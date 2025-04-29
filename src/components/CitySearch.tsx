
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { City } from '@/types/airQuality';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { getCityByName } from '@/services/airQualityService';
import { toast } from 'sonner';

// Popular cities with their coordinates from around the world
const popularCities: City[] = [
  // Americas
  { name: "New York", coord: { lat: 40.7128, lon: -74.0060 } },
  { name: "Los Angeles", coord: { lat: 34.0522, lon: -118.2437 } },
  { name: "Mexico City", coord: { lat: 19.4326, lon: -99.1332 } },
  { name: "Toronto", coord: { lat: 43.6532, lon: -79.3832 } },
  { name: "São Paulo", coord: { lat: -23.5505, lon: -46.6333 } },
  
  // Europe
  { name: "London", coord: { lat: 51.5074, lon: -0.1278 } },
  { name: "Paris", coord: { lat: 48.8566, lon: 2.3522 } },
  { name: "Berlin", coord: { lat: 52.5200, lon: 13.4050 } },
  { name: "Rome", coord: { lat: 41.9028, lon: 12.4964 } },
  { name: "Madrid", coord: { lat: 40.4168, lon: -3.7038 } },
  
  // Asia
  { name: "Tokyo", coord: { lat: 35.6762, lon: 139.6503 } },
  { name: "Beijing", coord: { lat: 39.9042, lon: 116.4074 } },
  { name: "Mumbai", coord: { lat: 19.0760, lon: 72.8777 } },
  { name: "Seoul", coord: { lat: 37.5665, lon: 126.9780 } },
  { name: "Bangkok", coord: { lat: 13.7563, lon: 100.5018 } },
  
  // Africa
  { name: "Cairo", coord: { lat: 30.0444, lon: 31.2357 } },
  { name: "Lagos", coord: { lat: 6.5244, lon: 3.3792 } },
  { name: "Nairobi", coord: { lat: -1.2921, lon: 36.8219 } },
  { name: "Cape Town", coord: { lat: -33.9249, lon: 18.4241 } },
  
  // Oceania
  { name: "Sydney", coord: { lat: -33.8688, lon: 151.2093 } },
  { name: "Melbourne", coord: { lat: -37.8136, lon: 144.9631 } },
  { name: "Auckland", coord: { lat: -36.8509, lon: 174.7645 } },
];

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { apiKey } = useApiKey();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // First check if the city is in our popular cities list
    const foundCity = popularCities.find(
      city => city.name.toLowerCase() === searchQuery.toLowerCase()
    );
    
    if (foundCity) {
      onCitySelect(foundCity);
      return;
    }
    
    // If not found in the popular list, search via the API
    setIsSearching(true);
    
    try {
      const cityData = await getCityByName(searchQuery, apiKey);
      
      if (cityData) {
        onCitySelect(cityData);
      } else {
        toast.error("City not found. Please try another search.");
      }
    } catch (error) {
      console.error("Error searching for city:", error);
      toast.error("Error searching for city. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div className="mb-4 space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for any city in the world..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button type="submit" disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </form>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Popular Cities</h3>
        <div className="flex flex-wrap gap-2">
          {popularCities.slice(0, 12).map((city) => (
            <Button
              key={city.name}
              variant="outline"
              size="sm"
              onClick={() => onCitySelect(city)}
            >
              {city.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitySearch;
