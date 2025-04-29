
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { City } from '@/types/airQuality';

// Popular cities with their coordinates
const popularCities: City[] = [
  { name: "New York", coord: { lat: 40.7128, lon: -74.0060 } },
  { name: "London", coord: { lat: 51.5074, lon: -0.1278 } },
  { name: "Tokyo", coord: { lat: 35.6762, lon: 139.6503 } },
  { name: "Paris", coord: { lat: 48.8566, lon: 2.3522 } },
  { name: "Mumbai", coord: { lat: 19.0760, lon: 72.8777 } },
  { name: "Beijing", coord: { lat: 39.9042, lon: 116.4074 } },
];

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const foundCity = popularCities.find(
      city => city.name.toLowerCase() === searchQuery.toLowerCase()
    );
    
    if (foundCity) {
      onCitySelect(foundCity);
    }
  };
  
  return (
    <div className="mb-4 space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
      
      <div className="flex flex-wrap gap-2">
        {popularCities.map((city) => (
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
  );
};

export default CitySearch;
