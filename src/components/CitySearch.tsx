
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { City } from '@/types/airQuality';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { getCityByName } from '@/services/airQualityService';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  
  // India
  { name: "Delhi", coord: { lat: 28.6517178, lon: 77.2219388 } },
  { name: "Bengaluru", coord: { lat: 12.9767936, lon: 77.590082 } },
  { name: "Chennai", coord: { lat: 13.0826802, lon: 80.2707184 } },
  { name: "Kolkata", coord: { lat: 22.572646, lon: 88.363895 } },
  { name: "Hyderabad", coord: { lat: 17.384, lon: 78.4564 } },
  { name: "Mysuru", coord: { lat: 12.3051828, lon: 76.6553609 } },
  
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
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const { apiKey } = useApiKey();
  
  // Handle input change for real-time filtering
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 1) {
      // Filter popular cities as you type
      const filtered = popularCities.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCities([]);
      setShowDropdown(false);
    }
  };
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a city name");
      return;
    }
    
    // First check if the city is in our popular cities list (case-insensitive)
    const foundCity = popularCities.find(
      city => city.name.toLowerCase() === searchQuery.toLowerCase()
    );
    
    if (foundCity) {
      onCitySelect(foundCity);
      toast.success(`Showing data for ${foundCity.name}`);
      setShowDropdown(false);
      return;
    }
    
    if (!apiKey) {
      toast.error("Please enter your API key first");
      return;
    }
    
    // If not found in the popular list, search via the API
    setIsSearching(true);
    
    try {
      const cityData = await getCityByName(searchQuery, apiKey);
      
      if (cityData) {
        onCitySelect(cityData);
        toast.success(`Showing data for ${cityData.name}`);
        setShowDropdown(false);
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
  
  const handleCitySelect = (city: City) => {
    onCitySelect(city);
    setSearchQuery(city.name);
    setShowDropdown(false);
    toast.success(`Showing data for ${city.name}`);
  };
  
  // Handle clicking outside to close the dropdown
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="mb-4 space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2 relative">
        <div className="flex-1 relative" onClick={(e) => e.stopPropagation()}>
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for any city in the world..."
            value={searchQuery}
            onChange={handleInputChange}
            className="pl-8"
            onFocus={() => {
              if (searchQuery.length > 1) {
                setShowDropdown(true);
              }
            }}
          />
          
          {showDropdown && filteredCities.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              <ScrollArea className="max-h-60">
                {filteredCities.map((city) => (
                  <div
                    key={`${city.name}-${city.coord.lat}-${city.coord.lon}`}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                    onClick={() => handleCitySelect(city)}
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{city.name}</span>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
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
              key={`${city.name}-button`}
              variant="outline"
              size="sm"
              onClick={() => handleCitySelect(city)}
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
