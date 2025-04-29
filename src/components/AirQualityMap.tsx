
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { getCurrentAirQuality } from '@/services/airQualityService';
import { AirQualityData, AirQualityItem, getAqiColor } from '@/types/airQuality';
import AqiCard from './AqiCard';
import { toast } from 'sonner';

// Fix the default icon issue with Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

type Props = {
  onAirQualityUpdate?: (data: AirQualityItem | null, locationName?: string) => void;
  center?: [number, number]; // Added center prop
};

// Function to fetch location name from coordinates using reverse geocoding
const fetchLocationName = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
    const data = await response.json();
    
    // Extract relevant location information
    if (data && data.display_name) {
      // Parse the display_name to get a cleaner location name
      const parts = data.display_name.split(', ');
      // Return first part (typically city/town) and country (usually last part)
      if (parts.length >= 3) {
        return `${parts[0]}, ${parts[parts.length - 1]}`;
      }
      return data.display_name;
    }
    return "Unknown location";
  } catch (error) {
    console.error('Error fetching location name:', error);
    return "Unknown location";
  }
};

// This component handles map click events and updates air quality data
const MapClickHandler = ({ onAirQualityUpdate }: { onAirQualityUpdate?: Props['onAirQualityUpdate'] }) => {
  const map = useMap();
  const { apiKey } = useApiKey();
  
  useEffect(() => {
    if (!map) return;

    const handleMapClick = async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      try {
        if (!apiKey) {
          toast.error("Please enter your API key first");
          return;
        }
        
        // Get location name
        const locationName = await fetchLocationName(lat, lng);
        
        const data = await getCurrentAirQuality(lat, lng, apiKey);
        if (data && data.list && data.list.length > 0) {
          onAirQualityUpdate && onAirQualityUpdate(data.list[0], locationName);
        }
      } catch (error) {
        console.error('Error fetching air quality data:', error);
        toast.error("Couldn't fetch air quality data for this location");
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, apiKey, onAirQualityUpdate]);

  return null;
};

// This component handles updating the map center when the center prop changes
const MapCenterUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 10);
    }
  }, [center, map]);
  
  return null;
};

const AirQualityMap = ({ onAirQualityUpdate, center = [20, 0] }: Props) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    aqiData: AirQualityItem | null;
    name: string;
  } | null>(null);
  
  const { apiKey } = useApiKey();

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border shadow-sm">
      <MapContainer
        center={center} 
        zoom={3} // Slightly zoomed in to show more detail
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onAirQualityUpdate={(data, locationName) => {
          if (data && locationName) {
            setSelectedLocation({ 
              lat: data.coord.lat, 
              lng: data.coord.lon, 
              aqiData: data,
              name: locationName 
            });
            onAirQualityUpdate && onAirQualityUpdate(data, locationName);
          }
        }} />
        
        <MapCenterUpdater center={center} />
        
        {selectedLocation && selectedLocation.aqiData && (
          <Marker 
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={L.divIcon({
              className: 'custom-marker',
              html: `<div style="
                width: 30px; 
                height: 30px; 
                background-color: ${getAqiColor(selectedLocation.aqiData.main.aqi)}; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: white;
                font-weight: bold;
                border: 2px solid white;
                box-shadow: 0 0 4px rgba(0,0,0,0.4);">${selectedLocation.aqiData.main.aqi}</div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
          >
            <Popup className="air-quality-popup">
              <div className="mb-1">
                <strong>{selectedLocation.name}</strong>
              </div>
              <AqiCard airQuality={selectedLocation.aqiData} />
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default AirQualityMap;
