import { LocationData } from '../types';

export const getLocationData = async (): Promise<LocationData | null> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    return {
      city: data.city || 'Unknown',
      country: data.country_name || 'Unknown',
      ip: data.ip || 'Unknown'
    };
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
};