# 360° Panorama Navigation System - Architecture

## System Overview
A Google Street View-like navigation system with real-time multi-user synchronization.

## Architecture Layers

### 1. Frontend (React + TypeScript + Three.js)
**Components:**
- `PanoramaViewer.tsx` - Main 360° viewer using Three.js
  - Renders sphere geometry with panorama texture
  - Handles mouse drag for camera rotation
  - Displays navigation arrows in 3D space
  - Manages smooth transitions

**Services:**
- `panoramaService.ts` - REST API calls
- `panoramaSocketService.ts` - WebSocket real-time sync

**Types:**
- `panorama.ts` - TypeScript interfaces

### 2. Backend (NestJS + TypeScript)
**Layers:**
- **Controller** (`panorama.controller.ts`)
  - REST endpoints for panorama CRUD
  - Input validation
  
- **Service** (`panorama.service.ts`)
  - Business logic
  - Database operations
  - Data seeding

- **Gateway** (`panorama.gateway.ts`)
  - WebSocket event handling
  - Real-time broadcast

- **Entity** (`panorama.entity.ts`)
  - TypeORM database model

- **DTO** (`panorama.dto.ts`)
  - Data transfer objects

### 3. Database (PostgreSQL)
**Schema:**
```
panoramas
├── id (UUID, PK)
├── image_url (VARCHAR)
├── forward_id (UUID, FK)
├── left_id (UUID, FK)
├── right_id (UUID, FK)
├── backward_id (UUID, FK)
├── yaw (FLOAT)
└── pitch (FLOAT)
```

## Data Flow

### Navigation Flow
1. User clicks arrow in PanoramaViewer
2. Component calls `onNavigate(direction)`
3. App.tsx fetches next panorama via REST API
4. New panorama loads with fade transition
5. WebSocket broadcasts navigation to other users
6. History updated

### Real-time Sync Flow
1. User A navigates to new panorama
2. Frontend emits 'navigate' event via WebSocket
3. Backend broadcasts 'userNavigated' to all clients
4. User B receives notification
5. Optional: Auto-sync User B to same location

## Key Features

### 1. 360° Rendering (Three.js)
- Sphere geometry (radius 500)
- Inverted normals for inside view
- Equirectangular texture mapping
- Perspective camera with FOV 75°

### 2. Navigation System
- 4-directional connections (forward, back, left, right)
- Clickable 3D arrow markers
- Null-safe navigation (disabled if no connection)
- Smooth fade transitions

### 3. Real-time Sync (Socket.IO)
- Multi-user awareness
- Navigation broadcasts
- Camera rotation sync (optional)
- Connection status tracking

### 4. State Management
- Current panorama state
- Navigation history
- Loading states
- Error handling

## Production Considerations

### Performance
- Lazy load panorama images
- Texture compression
- Level of detail (LOD) for distant objects
- Connection pooling for database

### Security
- Input validation on all endpoints
- SQL injection prevention (TypeORM)
- CORS configuration
- Rate limiting on WebSocket events
- Authentication/Authorization (add JWT)

### Scalability
- Redis for WebSocket adapter (multi-server)
- CDN for panorama images
- Database read replicas
- Horizontal scaling with load balancer

### Monitoring
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- WebSocket connection metrics
- Database query performance

## Extension Ideas

### 1. Mini-map
- 2D overhead view
- Show current location
- Click to teleport

### 2. Hotspots
- Interactive points of interest
- Info popups
- Media attachments

### 3. Path Recording
- Record navigation paths
- Playback mode
- Share paths with others

### 4. VR Support
- WebXR integration
- Stereo rendering
- Controller support

### 5. Advanced Features
- Gyroscope support (mobile)
- Voice navigation
- AI-powered auto-tour
- Collaborative annotations
- Time-of-day variations
- Weather effects

## Technology Choices

### Why Three.js?
- Full control over 3D rendering
- Better performance than Pannellum
- Extensible for advanced features
- Large community

### Why NestJS?
- TypeScript native
- Modular architecture
- Built-in WebSocket support
- Excellent TypeORM integration

### Why PostgreSQL?
- Robust relational model
- UUID support
- JSON fields for metadata
- Spatial extensions (PostGIS) for future

### Why Socket.IO?
- Automatic reconnection
- Room support
- Fallback transports
- Easy integration

## Development Workflow

1. **Local Development**
   - Docker for PostgreSQL
   - Hot reload (backend & frontend)
   - Mock data seeding

2. **Testing**
   - Unit tests (Jest)
   - E2E tests (Cypress)
   - WebSocket testing

3. **Deployment**
   - Docker containers
   - CI/CD pipeline
   - Environment configs
   - Database migrations

## File Structure Summary
```
navigation-system/
├── backend/
│   ├── src/
│   │   ├── entities/panorama.entity.ts
│   │   ├── controllers/panorama.controller.ts
│   │   ├── services/panorama.service.ts
│   │   ├── gateway/panorama.gateway.ts
│   │   ├── dto/panorama.dto.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/PanoramaViewer.tsx
│   │   ├── services/
│   │   │   ├── panoramaService.ts
│   │   │   └── panoramaSocketService.ts
│   │   ├── types/panorama.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
├── docker-compose.yml
├── README.md
├── INSTALL.md
└── start-panorama.bat
```
