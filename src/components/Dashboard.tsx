
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AirQualityMap from "./AirQualityMap";
import { AirQualityItem, City } from "@/types/airQuality";
import AqiCard from "./AqiCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AqiIndex from "./AqiIndex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PollutantInfo from "./PollutantInfo";
import { ScrollArea } from "@/components/ui/scroll-area";
import CitySearch from "./CitySearch";
import AirQualityChart from "./AirQualityChart";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { getCurrentAirQuality, getForecastAirQuality, getHistoricalAirQuality } from "@/services/airQualityService";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { apiKey } = useApiKey();
  const [selectedAirQuality, setSelectedAirQuality] = useState<AirQualityItem | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string | undefined>(undefined);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to New York
  
  // Get historical data for the last 24 hours
  const now = Math.floor(Date.now() / 1000);
  const oneDayAgo = now - 24 * 60 * 60;
  
  const { data: historicalData, isLoading: isLoadingHistorical } = useQuery({
    queryKey: ['historical', selectedCity?.coord.lat, selectedCity?.coord.lon, apiKey],
    queryFn: () => {
      if (!selectedCity || !apiKey) return null;
      return getHistoricalAirQuality(
        selectedCity.coord.lat, 
        selectedCity.coord.lon, 
        oneDayAgo, 
        now, 
        apiKey
      );
    },
    enabled: !!selectedCity && !!apiKey,
  });
  
  const { data: forecastData, isLoading: isLoadingForecast } = useQuery({
    queryKey: ['forecast', selectedCity?.coord.lat, selectedCity?.coord.lon, apiKey],
    queryFn: () => {
      if (!selectedCity || !apiKey) return null;
      return getForecastAirQuality(
        selectedCity.coord.lat, 
        selectedCity.coord.lon, 
        apiKey
      );
    },
    enabled: !!selectedCity && !!apiKey,
  });

  // Get current air quality data when a city is selected
  useEffect(() => {
    const fetchCityAirQuality = async () => {
      if (!selectedCity || !apiKey) return;
      
      try {
        const data = await getCurrentAirQuality(
          selectedCity.coord.lat,
          selectedCity.coord.lon,
          apiKey
        );
        
        if (data && data.list && data.list.length > 0) {
          // Make sure the air quality item has the coordinates
          data.list[0].coord = {
            lat: selectedCity.coord.lat,
            lon: selectedCity.coord.lon
          };
          
          setSelectedAirQuality(data.list[0]);
          setSelectedLocationName(selectedCity.name);
        }
      } catch (error) {
        console.error("Error fetching city air quality:", error);
        toast.error(`Couldn't fetch air quality data for ${selectedCity.name}`);
      }
    };
    
    fetchCityAirQuality();
  }, [selectedCity, apiKey]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setMapCenter([city.coord.lat, city.coord.lon]);
    setSelectedLocationName(city.name);
    console.log("Selected city:", city.name, "at coordinates:", city.coord.lat, city.coord.lon);
  };

  const handleMapLocationSelect = (airQuality: AirQualityItem | null, locationName?: string) => {
    setSelectedAirQuality(airQuality);
    setSelectedLocationName(locationName);
    
    // Clear selected city when clicking on map at a different location
    if (airQuality && airQuality.coord) {
      // Only clear if the coordinates don't match the selected city
      if (selectedCity && 
          (Math.abs(airQuality.coord.lat - selectedCity.coord.lat) > 0.01 ||
           Math.abs(airQuality.coord.lon - selectedCity.coord.lon) > 0.01)) {
        setSelectedCity(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <CitySearch onCitySelect={handleCitySelect} />
      
      <div className="grid md:grid-cols-4 gap-6 w-full h-[calc(100vh-240px)]">
        <div className="md:col-span-3 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Air Quality Map</h2>
          <div className="flex-1">
            <AirQualityMap 
              onAirQualityUpdate={handleMapLocationSelect}
              center={mapCenter}
            />
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg border border-border shadow-sm p-4 h-full">
            <Tabs defaultValue="details">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="details" className="flex-1">Air Quality</TabsTrigger>
                <TabsTrigger value="info" className="flex-1">AQI Info</TabsTrigger>
              </TabsList>
              <ScrollArea className="h-[calc(100vh-280px)]">
                <TabsContent value="details" className="m-0 p-1">
                  {selectedAirQuality ? (
                    <div className="space-y-6">
                      <AqiCard 
                        airQuality={selectedAirQuality} 
                        cityName={selectedLocationName || "Selected Location"}
                      />
                      <PollutantInfo airQuality={selectedAirQuality} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <p className="text-muted-foreground">
                        Click on the map or search for a city to view air quality data
                      </p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="info" className="m-0 p-1">
                  <div className="space-y-6">
                    <AqiIndex />
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">About Air Quality Index</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="text-muted-foreground">
                          The Air Quality Index (AQI) is a scale used to communicate how polluted the air currently is or how polluted it is forecast to become.
                          It helps people understand when to take precautions to protect their health from air pollution.
                        </p>
                        <p className="mt-2 text-muted-foreground">
                          An AQI value of 1 represents good air quality with minimal health concern, while an AQI value of 5 represents hazardous air quality.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </div>
      
      {selectedCity && (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Historical Data (24h)</h2>
            {isLoadingHistorical ? (
              <div className="flex items-center justify-center h-[300px] border rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : historicalData?.list && historicalData.list.length > 0 ? (
              <AirQualityChart 
                data={historicalData.list} 
                title={`Historical Air Quality for ${selectedCity.name}`} 
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] border rounded-lg">
                <p className="text-muted-foreground">No historical data available</p>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Forecast Data</h2>
            {isLoadingForecast ? (
              <div className="flex items-center justify-center h-[300px] border rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : forecastData?.list && forecastData.list.length > 0 ? (
              <AirQualityChart 
                data={forecastData.list.slice(0, 24)} 
                title={`Air Quality Forecast for ${selectedCity.name}`} 
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] border rounded-lg">
                <p className="text-muted-foreground">No forecast data available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
