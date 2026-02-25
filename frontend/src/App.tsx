import React, { useEffect, useState } from 'react';
import PanoramaViewer from './components/PanoramaViewer';
import { panoramaService } from './services/panoramaService';
import panoramaSocketService from './services/panoramaSocketService';
import { Panorama, Direction } from './types/panorama';
import './App.css';

const App: React.FC = () => {
  const [currentPanorama, setCurrentPanorama] = useState<Panorama | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
    panoramaSocketService.connect();

    panoramaSocketService.onUserNavigated((data) => {
      console.log('User navigated:', data);
    });

    return () => {
      panoramaSocketService.disconnect();
    };
  }, []);

  const initializeApp = async () => {
    try {
      await panoramaService.seedData();
      const panorama = await panoramaService.getPanorama('1');
      setCurrentPanorama(panorama);
      setHistory(['1']);
    } catch (error) {
      console.error('Failed to initialize:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = async (direction: Direction) => {
    if (!currentPanorama) return;

    const nextId = currentPanorama.connections[direction];
    if (!nextId) return;

    try {
      const nextPanorama = await panoramaService.getPanorama(nextId);
      setCurrentPanorama(nextPanorama);
      setHistory([...history, nextId]);
      panoramaSocketService.emitNavigate(nextId);
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  if (!currentPanorama) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>No panorama found</div>;
  }

  return (
    <div className="App">
      <PanoramaViewer panorama={currentPanorama} onNavigate={handleNavigate} />
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '5px',
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentPanorama.location || 'Unknown Location'}</div>
        <div>ID: {currentPanorama.id}</div>
        <div>Type: {currentPanorama.isVideo ? 'Video' : 'Image'}</div>
        <div>History: {history.length} locations</div>
      </div>
    </div>
  );
};

export default App;
