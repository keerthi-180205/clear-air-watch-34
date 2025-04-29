
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { getCurrentAirQuality } from '@/services/airQualityService';
import { AirQualityData, AirQualityItem, getAqiColor } from '@/types/airQuality';
import AqiCard from './AqiCard';

// Fix the default icon issue with Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

type Props = {
  onAirQualityUpdate?: (data: AirQualityItem | null) => void;
};

const MapClickHandler = ({ onAirQualityUpdate }: Props) => {
  const map = useMap();
  const { apiKey } = useApiKey();
  
  useEffect(() => {
    if (!map) return;

    const handleMapClick = async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      try {
        const data = await getCurrentAirQuality(lat, lng, apiKey);
        if (data && data.list && data.list.length > 0) {
          onAirQualityUpdate && onAirQualityUpdate(data.list[0]);
        }
      } catch (error) {
        console.error('Error fetching air quality data:', error);
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, apiKey, onAirQualityUpdate]);

  return null;
};

const AirQualityMap = ({ onAirQualityUpdate }: Props) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    aqiData: AirQualityItem | null;
  } | null>(null);
  
  const { apiKey } = useApiKey();
  const mapRef = useRef<L.Map | null>(null);

  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    
    try {
      const data = await getCurrentAirQuality(lat, lng, apiKey);
      if (data && data.list && data.list.length > 0) {
        setSelectedLocation({ lat, lng, aqiData: data.list[0] });
        onAirQualityUpdate && onAirQualityUpdate(data.list[0]);
      }
    } catch (error) {
      console.error('Error fetching air quality data:', error);
    }
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border shadow-sm">
      <MapContainer
        center={[40.7128, -74.0060]} // Default to New York
        zoom={3}
        style={{ height: '100%', width: '100%' }}
        whenReady={(mapEvent) => { 
          mapRef.current = mapEvent.target;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onAirQualityUpdate={onAirQualityUpdate} />
        
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
              <AqiCard airQuality={selectedLocation.aqiData} />
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default AirQualityMap;
