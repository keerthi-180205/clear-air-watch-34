
import { useState } from "react";
import AirQualityMap from "./AirQualityMap";
import { AirQualityItem } from "@/types/airQuality";
import AqiCard from "./AqiCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AqiIndex from "./AqiIndex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PollutantInfo from "./PollutantInfo";
import { ScrollArea } from "@/components/ui/scroll-area";

const Dashboard = () => {
  const [selectedAirQuality, setSelectedAirQuality] = useState<AirQualityItem | null>(null);

  return (
    <div className="grid md:grid-cols-4 gap-6 w-full h-[calc(100vh-80px)]">
      <div className="md:col-span-3 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Air Quality Map</h2>
        <div className="flex-1">
          <AirQualityMap onAirQualityUpdate={setSelectedAirQuality} />
        </div>
      </div>
      
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg border border-border shadow-sm p-4 h-full">
          <Tabs defaultValue="details">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="details" className="flex-1">Air Quality</TabsTrigger>
              <TabsTrigger value="info" className="flex-1">AQI Info</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <TabsContent value="details" className="m-0 p-1">
                {selectedAirQuality ? (
                  <div className="space-y-6">
                    <AqiCard airQuality={selectedAirQuality} />
                    <PollutantInfo airQuality={selectedAirQuality} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">
                      Click on the map to view air quality data
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
  );
};

export default Dashboard;
