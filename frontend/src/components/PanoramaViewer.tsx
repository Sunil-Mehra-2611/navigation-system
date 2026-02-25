import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Panorama, Direction } from '../types/panorama';

interface PanoramaViewerProps {
  panorama: Panorama;
  onNavigate: (direction: Direction) => void;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ panorama, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const arrowsRef = useRef<Map<Direction, THREE.Mesh>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,  // 60 degree FOV
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Load panorama (image or video)
    if (panorama.isVideo && panorama.videoUrl) {
      loadVideo(scene, panorama.videoUrl);
    } else {
      loadImage(scene, panorama.imageUrl);
    }

    addClickableArrows(scene, panorama);

    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;

      const deltaX = e.clientX - mouseX;
      const deltaY = e.clientY - mouseY;

      camera.rotation.y += deltaX * 0.002;
      camera.rotation.x += deltaY * 0.002;
      camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const newFov = camera.fov + e.deltaY * 0.05;
      camera.fov = Math.max(20, Math.min(90, newFov));
      camera.updateProjectionMatrix();
    };

    const onClick = (e: MouseEvent) => {
      if (!cameraRef.current || !sceneRef.current) return;

      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      
      // Get all meshes from arrow groups
      const arrowMeshes: THREE.Object3D[] = [];
      arrowsRef.current.forEach((group) => {
        group.children.forEach((child) => arrowMeshes.push(child));
      });
      
      const intersects = raycasterRef.current.intersectObjects(arrowMeshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        arrowsRef.current.forEach((group, direction) => {
          if (group.children.includes(clickedMesh)) {
            console.log('Arrow clicked:', direction);
            onNavigate(direction);
          }
        });
      }
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Make arrows pulse
      arrowsRef.current.forEach((arrow) => {
        const scale = 1 + Math.sin(Date.now() * 0.003) * 0.2;
        arrow.scale.set(scale, scale, scale);
      });
      
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('wheel', onWheel);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current = null;
      }
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [panorama]);

  const loadImage = (scene: THREE.Scene, imageUrl: string) => {
    console.log('Loading image:', imageUrl);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      imageUrl,
      (texture) => {
        console.log('Image loaded successfully');
        
        // Create a flat plane instead of sphere for 60-degree images
        const geometry = new THREE.PlaneGeometry(100, 75);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.z = -50;
        scene.add(plane);
        setIsLoading(false);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
      },
      (error) => {
        console.error('Error loading texture:', error);
        alert('Failed to load panorama image. Check console for details.');
        setIsLoading(false);
      }
    );
  };

  const loadVideo = (scene: THREE.Scene, videoUrl: string) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    videoRef.current = video;

    video.addEventListener('loadeddata', () => {
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;

      const geometry = new THREE.SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ map: videoTexture });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      
      video.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch(err => {
        console.error('Video play error:', err);
        setIsLoading(false);
      });
    });

    video.addEventListener('error', (error) => {
      console.error('Error loading video:', error);
      setIsLoading(false);
    });
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const addClickableArrows = (scene: THREE.Scene, pano: Panorama) => {
    arrowsRef.current.clear();

    // Create clickable arrow with cone and cylinder
    const createArrow = (position: THREE.Vector3, rotation: THREE.Euler, direction: Direction) => {
      const group = new THREE.Group();
      
      // Arrow shaft (cylinder)
      const shaftGeometry = new THREE.CylinderGeometry(2, 2, 20, 8);
      const shaftMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
      shaft.position.y = 10;
      group.add(shaft);
      
      // Arrow head (cone)
      const headGeometry = new THREE.ConeGeometry(5, 10, 8);
      const headMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 20;
      group.add(head);
      
      group.position.copy(position);
      group.rotation.copy(rotation);
      scene.add(group);
      arrowsRef.current.set(direction, group as any);
    };

    if (pano.connections.forward) {
      createArrow(
        new THREE.Vector3(0, -20, -40),
        new THREE.Euler(0, 0, 0),
        Direction.FORWARD
      );
    }

    if (pano.connections.backward) {
      createArrow(
        new THREE.Vector3(0, -20, -40),
        new THREE.Euler(0, 0, Math.PI),
        Direction.BACKWARD
      );
    }

    if (pano.connections.left) {
      createArrow(
        new THREE.Vector3(-30, -20, -40),
        new THREE.Euler(0, 0, -Math.PI / 2),
        Direction.LEFT
      );
    }

    if (pano.connections.right) {
      createArrow(
        new THREE.Vector3(30, -20, -40),
        new THREE.Euler(0, 0, Math.PI / 2),
        Direction.RIGHT
      );
    }
  };

  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    const newFov = cameraRef.current.fov + delta;
    cameraRef.current.fov = Math.max(20, Math.min(90, newFov));
    cameraRef.current.updateProjectionMatrix();
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', cursor: 'grab' }}>
      <div ref={containerRef} />
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '24px',
          background: 'rgba(0,0,0,0.7)',
          padding: '20px',
          borderRadius: '10px',
        }}>
          Loading panorama...
        </div>
      )}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        background: 'rgba(0,0,0,0.7)',
        padding: '15px 25px',
        borderRadius: '10px',
        fontSize: '16px',
      }}>
        Click on the green arrows to navigate | Scroll to zoom
      </div>
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <button
          onClick={() => handleZoom(-5)}
          style={{
            width: '50px',
            height: '50px',
            fontSize: '24px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
        >
          +
        </button>
        <button
          onClick={() => handleZoom(5)}
          style={{
            width: '50px',
            height: '50px',
            fontSize: '24px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
        >
          −
        </button>
      </div>
      {panorama.isVideo && (
        <button
          onClick={togglePlayPause}
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '60px',
            fontSize: '24px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      )}
    </div>
  );
};

export default PanoramaViewer;
