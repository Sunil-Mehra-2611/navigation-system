# System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              React Frontend (Port 3000)                   │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────┐    │ │
│  │  │         PanoramaViewer Component                │    │ │
│  │  │  ┌──────────────────────────────────────────┐  │    │ │
│  │  │  │        Three.js Scene                    │  │    │ │
│  │  │  │  • Sphere Geometry (radius 500)          │  │    │ │
│  │  │  │  • Panorama Texture Mapping              │  │    │ │
│  │  │  │  • 3D Arrow Markers                      │  │    │ │
│  │  │  │  • Camera Controls (mouse drag)          │  │    │ │
│  │  │  └──────────────────────────────────────────┘  │    │ │
│  │  │                                                 │    │ │
│  │  │  ┌──────────────────────────────────────────┐  │    │ │
│  │  │  │     Navigation UI                        │  │    │ │
│  │  │  │  • Forward/Back/Left/Right Buttons       │  │    │ │
│  │  │  │  • History Display                       │  │    │ │
│  │  │  │  • Loading States                        │  │    │ │
│  │  │  └──────────────────────────────────────────┘  │    │ │
│  │  └─────────────────────────────────────────────────┘    │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────┐    │ │
│  │  │              Services Layer                     │    │ │
│  │  │  ┌──────────────┐    ┌────────────────────┐    │    │ │
│  │  │  │ panorama     │    │ panoramaSocket     │    │    │ │
│  │  │  │ Service      │    │ Service            │    │    │ │
│  │  │  │ (REST API)   │    │ (WebSocket)        │    │    │ │
│  │  │  └──────────────┘    └────────────────────┘    │    │ │
│  │  └─────────────────────────────────────────────────┘    │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                           │                    │
                           │ HTTP               │ WebSocket
                           │ REST API           │ Socket.IO
                           ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                  NestJS Backend (Port 3001)                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    API Layer                              │ │
│  │  ┌──────────────────────┐    ┌──────────────────────┐    │ │
│  │  │ PanoramaController   │    │  PanoramaGateway     │    │ │
│  │  │                      │    │                      │    │ │
│  │  │ GET /panorama/:id    │    │  @SubscribeMessage   │    │ │
│  │  │ GET /panorama        │    │  • navigate          │    │ │
│  │  │ GET /panorama/seed   │    │  • cameraRotate      │    │ │
│  │  └──────────────────────┘    └──────────────────────┘    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                    │                │
│                           ▼                    ▼                │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                  Service Layer                            │ │
│  │  ┌──────────────────────────────────────────────────┐    │ │
│  │  │           PanoramaService                        │    │ │
│  │  │  • findById(id)                                  │    │ │
│  │  │  • findAll()                                     │    │ │
│  │  │  • seedData()                                    │    │ │
│  │  └──────────────────────────────────────────────────┘    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                     │
│                           ▼                                     │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                  Data Layer                               │ │
│  │  ┌──────────────────────────────────────────────────┐    │ │
│  │  │           TypeORM Repository                     │    │ │
│  │  │  • Panorama Entity                               │    │ │
│  │  │  • CRUD Operations                               │    │ │
│  │  └──────────────────────────────────────────────────┘    │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ SQL Queries
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Port 5432)                    │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                  panoramas Table                          │ │
│  │  ┌──────────────────────────────────────────────────┐    │ │
│  │  │  id           UUID PRIMARY KEY                   │    │ │
│  │  │  image_url    VARCHAR NOT NULL                   │    │ │
│  │  │  forward_id   UUID (FK → panoramas.id)           │    │ │
│  │  │  left_id      UUID (FK → panoramas.id)           │    │ │
│  │  │  right_id     UUID (FK → panoramas.id)           │    │ │
│  │  │  backward_id  UUID (FK → panoramas.id)           │    │ │
│  │  │  yaw          FLOAT DEFAULT 0                    │    │ │
│  │  │  pitch        FLOAT DEFAULT 0                    │    │ │
│  │  └──────────────────────────────────────────────────┘    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Sample Data:                                                  │
│  Panorama 1 ──forward──> Panorama 2                           │
│  Panorama 2 ──forward──> Panorama 3                           │
│  Panorama 3 ──left────> Panorama 4                            │
│  Panorama 4 ──right───> Panorama 3                            │
└─────────────────────────────────────────────────────────────────┘


DATA FLOW DIAGRAM:
==================

User Navigation Flow:
---------------------
1. User clicks "Forward" button
   │
   ├─> PanoramaViewer.onNavigate(Direction.FORWARD)
   │
   ├─> App.handleNavigate(direction)
   │
   ├─> panoramaService.getPanorama(nextId)
   │   │
   │   └─> HTTP GET /panorama/:id
   │       │
   │       └─> PanoramaController.getPanorama(id)
   │           │
   │           └─> PanoramaService.findById(id)
   │               │
   │               └─> TypeORM Repository.findOne()
   │                   │
   │                   └─> PostgreSQL SELECT query
   │                       │
   │                       └─> Returns Panorama data
   │
   ├─> setCurrentPanorama(newPanorama)
   │
   ├─> panoramaSocketService.emitNavigate(id)
   │   │
   │   └─> WebSocket emit 'navigate'
   │       │
   │       └─> PanoramaGateway.handleNavigate()
   │           │
   │           └─> Broadcast 'userNavigated' to all clients
   │
   └─> PanoramaViewer re-renders with new panorama


Real-time Sync Flow:
--------------------
User A navigates
   │
   └─> WebSocket emit 'navigate' event
       │
       └─> Backend PanoramaGateway receives
           │
           └─> Broadcast 'userNavigated' to all connected clients
               │
               ├─> User A receives (optional: ignore own event)
               │
               ├─> User B receives
               │   └─> Console log: "User navigated to panorama X"
               │
               └─> User C receives
                   └─> Console log: "User navigated to panorama X"


Component Hierarchy:
--------------------
App
 │
 ├─> PanoramaViewer
 │    │
 │    ├─> Three.js Scene
 │    │    │
 │    │    ├─> Sphere Mesh (panorama)
 │    │    │
 │    │    └─> Arrow Meshes (navigation markers)
 │    │
 │    └─> Navigation Buttons
 │         │
 │         ├─> Forward Button
 │         ├─> Backward Button
 │         ├─> Left Button
 │         └─> Right Button
 │
 └─> Info Overlay
      │
      ├─> Current Panorama ID
      └─> History Count


Technology Stack:
-----------------
┌─────────────────────────────────────────┐
│ Frontend                                │
│ • React 18                              │
│ • TypeScript 5                          │
│ • Three.js (3D rendering)               │
│ • Socket.IO Client (WebSocket)          │
└─────────────────────────────────────────┘
                  │
                  │ HTTP + WebSocket
                  ▼
┌─────────────────────────────────────────┐
│ Backend                                 │
│ • NestJS 10                             │
│ • TypeScript 5                          │
│ • TypeORM (ORM)                         │
│ • Socket.IO (WebSocket)                 │
│ • class-validator (validation)          │
└─────────────────────────────────────────┘
                  │
                  │ SQL
                  ▼
┌─────────────────────────────────────────┐
│ Database                                │
│ • PostgreSQL 14                         │
│ • Docker Container                      │
└─────────────────────────────────────────┘
```
