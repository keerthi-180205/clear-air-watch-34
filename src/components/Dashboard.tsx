
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
import Chatbot from "./Chatbot";

const Dashboard = () => {
  const { apiKey } = useApiKey();
  const [selectedAirQuality, setSelectedAirQuality] = useState<AirQualityItem | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string | undefined>(undefined);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to New York
  const [mapLocation, setMapLocation] = useState<{lat: number, lon: number} | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  
  // Get historical data for the last 24 hours
  const now = Math.floor(Date.now() / 1000);
  const oneDayAgo = now - 24 * 60 * 60;
  
  // Historical data query
  const { data: historicalData, isLoading: isLoadingHistorical } = useQuery({
    queryKey: ['historical', mapLocation?.lat || selectedCity?.coord.lat, mapLocation?.lon || selectedCity?.coord.lon, apiKey],
    queryFn: () => {
      // Use either map location or selected city coordinates
      const lat = mapLocation?.lat || (selectedCity?.coord.lat);
      const lon = mapLocation?.lon || (selectedCity?.coord.lon);
      
      if ((!lat || !lon) || !apiKey) return null;
      return getHistoricalAirQuality(
        lat, 
        lon, 
        oneDayAgo, 
        now, 
        apiKey
      );
    },
    enabled: !!(((mapLocation || selectedCity) && apiKey)),
  });
  
  // Forecast data query
  const { data: forecastData, isLoading: isLoadingForecast } = useQuery({
    queryKey: ['forecast', mapLocation?.lat || selectedCity?.coord.lat, mapLocation?.lon || selectedCity?.coord.lon, apiKey],
    queryFn: () => {
      // Use either map location or selected city coordinates
      const lat = mapLocation?.lat || (selectedCity?.coord.lat);
      const lon = mapLocation?.lon || (selectedCity?.coord.lon);
      
      if ((!lat || !lon) || !apiKey) return null;
      return getForecastAirQuality(
        lat, 
        lon, 
        apiKey
      );
    },
    enabled: !!(((mapLocation || selectedCity) && apiKey)),
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
          // Add coordinates to the air quality item from the parent data
          data.list[0].coord = {
            lat: selectedCity.coord.lat,
            lon: selectedCity.coord.lon
          };
          
          setSelectedAirQuality(data.list[0]);
          setSelectedLocationName(selectedCity.name);
          
          // Reset map location when selecting a city
          setMapLocation(null);
        }
      } catch (error) {
        console.error("Error fetching city air quality:", error);
        toast.error("Couldn't fetch air quality data for ${selectedCity.name}");
      }
    };
    
    fetchCityAirQuality();
  }, [selectedCity, apiKey]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setMapCenter([city.coord.lat, city.coord.lon]);
    setSelectedLocationName(city.name);
    setMapLocation(null); // Clear map location when a city is selected
    console.log("Selected city:", city.name, "at coordinates:", city.coord.lat, city.coord.lon);
  };

  const handleMapLocationSelect = (airQuality: AirQualityItem | null, locationName?: string) => {
    setSelectedAirQuality(airQuality);
    setSelectedLocationName(locationName);
    
    // Set map location for queries
    if (airQuality && airQuality.coord) {
      setMapLocation({
        lat: airQuality.coord.lat,
        lon: airQuality.coord.lon
      });
      
      // Clear selected city when clicking on map at a different location
      if (selectedCity && 
          (Math.abs(airQuality.coord.lat - selectedCity.coord.lat) > 0.01 ||
           Math.abs(airQuality.coord.lon - selectedCity.coord.lon) > 0.01)) {
        setSelectedCity(null);
      }
    }
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const shouldShowChartSection = mapLocation || selectedCity;

  // Create an object with current air quality data to share with chatbot
  const airQualityContextData = {
    currentAqi: selectedAirQuality?.main.aqi,
    cityName: selectedLocationName,
    pollutants: selectedAirQuality?.components,
    hasHistoricalData: historicalData?.list && historicalData.list.length > 0,
    hasForecastData: forecastData?.list && forecastData.list.length > 0
  };

  return (
    <div className="space-y-6">
      <CitySearch onCitySelect={handleCitySelect} />
      
      <div className="grid md:grid-cols-4 gap-6 w-full h-[calc(100vh-240px)]">
        <div className="md:col-span-3 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Air Quality Map</h2>
          <div className="flex-1 relative">
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
      
      {shouldShowChartSection && (
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
                title={`Historical Air Quality for ${selectedLocationName || "Selected Location"}`} 
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
                title={`Air Quality Forecast for ${selectedLocationName || "Selected Location"}`} 
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] border rounded-lg">
                <p className="text-muted-foreground">No forecast data available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chatbot toggle button - with higher z-index */}
      <button 
        onClick={toggleChatbot} 
        className="fixed right-6 bottom-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/80 transition-colors z-[500]"
        aria-label="Open chat"
      >
        {isChatbotOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
        )}
      </button>
      
      {/* Chatbot component - we'll ensure this always appears on top */}
      <div className="chatbot-container" style={{ position: 'relative', zIndex: 1000 }}>
        {isChatbotOpen && (
          <Chatbot 
            onClose={() => setIsChatbotOpen(false)} 
            airQualityData={airQualityContextData}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
