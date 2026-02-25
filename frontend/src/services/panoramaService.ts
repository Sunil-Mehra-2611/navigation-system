import { Panorama } from '../types/panorama';

const API_URL = 'http://localhost:3001';

export const panoramaService = {
  async getPanorama(id: string): Promise<Panorama> {
    const response = await fetch(`${API_URL}/panorama/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch panorama');
    }
    return response.json();
  },

  async getAllPanoramas(): Promise<Panorama[]> {
    const response = await fetch(`${API_URL}/panorama`);
    if (!response.ok) {
      throw new Error('Failed to fetch panoramas');
    }
    return response.json();
  },

  async seedData(): Promise<void> {
    await fetch(`${API_URL}/panorama/seed/data`);
  },
};
