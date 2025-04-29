import React, { useState } from "react";
import { ApiKeyProvider } from "@/contexts/ApiKeyContext";
import { useApiKey } from "@/contexts/ApiKeyContext";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CitySearch from "@/components/CitySearch";
import { City } from "@/types/airQuality";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// City data with health tips and environmental regulations
const cityData = {
  "New York": {
    commonPollutants: ["PM2.5", "PM10", "NO2", "O3"],
    healthTips: [
      "Limit outdoor activities during high pollution days",
      "Use air purifiers indoors",
      "Stay hydrated",
      "Wear masks during high pollution days"
    ],
    regulations: [
      "NYC Clean Air Act",
      "Emissions standards for vehicles",
      "Restrictions on industrial emissions",
      "Building emission regulations"
    ]
  },
  "London": {
    commonPollutants: ["PM2.5", "NO2", "O3", "SO2"],
    healthTips: [
      "Check daily air quality reports",
      "Use public transport to reduce emissions",
      "Keep windows closed during peak pollution",
      "Consider air filtering plants for homes"
    ],
    regulations: [
      "Ultra Low Emission Zone (ULEZ)",
      "London Environment Strategy",
      "Clean Air Act",
      "Low emission bus zones"
    ]
  },
  "Beijing": {
    commonPollutants: ["PM2.5", "PM10", "SO2", "NO2"],
    healthTips: [
      "Use N95 masks during high AQI days",
      "Install HEPA air purifiers",
      "Limit outdoor exercise during smog",
      "Monitor air quality apps daily"
    ],
    regulations: [
      "Air Pollution Prevention and Control Action Plan",
      "Emission standards for vehicles and industry",
      "Coal burning restrictions",
      "Odd-even license plate policy during heavy pollution"
    ]
  },
  "Delhi": {
    commonPollutants: ["PM2.5", "PM10", "NO2", "SO2"],
    healthTips: [
      "Use air purifiers at home",
      "Avoid outdoor exercise during smog season",
      "Wear N95 masks",
      "Stay updated with pollution forecasts"
    ],
    regulations: [
      "Graded Response Action Plan",
      "Odd-even vehicle scheme",
      "Ban on diesel generators",
      "Construction dust mitigation rules"
    ]
  },
  "Los Angeles": {
    commonPollutants: ["O3", "PM2.5", "NO2", "CO"],
    healthTips: [
      "Check air quality before outdoor activities",
      "Avoid exercise near busy roads",
      "Keep windows closed during wildfires",
      "Consider air purifiers for homes"
    ],
    regulations: [
      "California Clean Air Act",
      "CARB emission standards",
      "Low emission vehicle programs",
      "Industrial emission controls"
    ]
  }
};

// Default city data for when no city is selected
const defaultCityData = {
  commonPollutants: ["PM2.5", "PM10", "O3", "NO2", "SO2", "CO"],
  healthTips: [
    "Check local air quality index daily",
    "Use air purifiers in homes and offices",
    "Limit outdoor activities during high pollution",
    "Consider wearing masks on heavily polluted days",
    "Stay hydrated to help your body flush toxins"
  ],
  regulations: [
    "Many cities implement emission standards for vehicles",
    "Industrial pollution control measures",
    "Green space requirements in urban areas",
    "Public transport initiatives to reduce car usage",
    "Clean energy incentives to reduce fossil fuel dependence"
  ]
};

const MainApp = () => {
  const { isKeyValid } = useApiKey();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const handleCitySelect = (city: City) => {
    setSelectedCity(city.name);
  };

  const getCityInfo = (cityName: string | null) => {
    if (!cityName) return defaultCityData;
    return cityData[cityName as keyof typeof cityData] || defaultCityData;
  };

  const currentCityData = getCityInfo(selectedCity);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6">
        {isKeyValid ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">City Air Quality Guide</h1>
            <p className="text-muted-foreground max-w-3xl">
              Explore information about air quality in cities around the world. Learn about common pollutants,
              health tips, and environmental regulations specific to each city.
            </p>
            
            <CitySearch onCitySelect={handleCitySelect} />
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedCity ? `${selectedCity} - Common Pollutants` : "Common Urban Pollutants"}
                  </CardTitle>
                  <CardDescription>
                    Key pollutants affecting air quality in this region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentCityData.commonPollutants.map((pollutant, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="h-6 w-6 rounded-full bg-orange-500/30 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm leading-6">{pollutant}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Tabs defaultValue="health">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="health">Health Tips</TabsTrigger>
                  <TabsTrigger value="regulations">Regulations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="health" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Health Recommendations</CardTitle>
                      <CardDescription>
                        Tips to protect your health from air pollution
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {currentCityData.healthTips.map((tip, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="h-6 w-6 rounded-full bg-green-500/30 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            <span className="text-sm leading-6">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="regulations" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Environmental Regulations</CardTitle>
                      <CardDescription>
                        Key policies aimed at improving air quality
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {currentCityData.regulations.map((regulation, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="h-6 w-6 rounded-full bg-blue-500/30 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            <span className="text-sm leading-6">{regulation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Understanding Air Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-medium mb-2">PM2.5 & PM10</h3>
                    <p className="text-sm text-muted-foreground">
                      Fine particulate matter that can penetrate deep into lungs and even enter the bloodstream.
                      Sources include vehicle emissions, construction, and industrial processes.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-medium mb-2">Ozone (O₃)</h3>
                    <p className="text-sm text-muted-foreground">
                      Ground-level ozone forms when pollutants react in sunlight. It can trigger asthma attacks
                      and cause other respiratory issues, especially during hot weather.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-medium mb-2">Nitrogen Dioxide (NO₂)</h3>
                    <p className="text-sm text-muted-foreground">
                      Primarily from vehicle exhaust and power plants. It irritates airways and can worsen
                      respiratory diseases, particularly affecting children and asthmatics.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-col h-full min-h-[80vh]">
            <h2 className="text-2xl font-bold mb-8 text-center text-primary">
              Welcome to ClearCity
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md text-center">
              Please return to the dashboard and enter your OpenWeatherMap API key to access the city guide features.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

const CityGuide = () => {
  return (
    <ApiKeyProvider>
      <MainApp />
    </ApiKeyProvider>
  );
};

export default CityGuide;
