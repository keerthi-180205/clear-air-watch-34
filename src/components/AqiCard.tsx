
import { AirQualityItem } from "@/types/airQuality";
import { getAqiColor, getAqiLevel } from "@/types/airQuality";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AqiCardProps {
  airQuality: AirQualityItem;
  cityName?: string;
}

const AqiCard = ({ airQuality, cityName = "Selected Location" }: AqiCardProps) => {
  const aqiLevel = getAqiLevel(airQuality.main.aqi);
  const aqiColor = getAqiColor(airQuality.main.aqi);
  
  return (
    <Card className="w-full aqi-card border animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            {cityName}
          </CardTitle>
          <Badge 
            style={{ 
              backgroundColor: aqiColor,
              boxShadow: `0 2px 8px ${aqiColor}40`
            }}
            className="text-white shadow-sm transition-all duration-300 hover:shadow-md"
          >
            AQI {airQuality.main.aqi}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col bg-gray-50/70 p-2 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
            <span className="text-muted-foreground text-xs">PM2.5</span>
            <span className="font-medium">{airQuality.components.pm2_5.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex flex-col bg-gray-50/70 p-2 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
            <span className="text-muted-foreground text-xs">PM10</span>
            <span className="font-medium">{airQuality.components.pm10.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex flex-col bg-gray-50/70 p-2 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
            <span className="text-muted-foreground text-xs">O₃</span>
            <span className="font-medium">{airQuality.components.o3.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex flex-col bg-gray-50/70 p-2 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
            <span className="text-muted-foreground text-xs">NO₂</span>
            <span className="font-medium">{airQuality.components.no2.toFixed(1)} μg/m³</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground">
          Quality: <span style={{ color: aqiColor }} className="font-medium">{aqiLevel.level}</span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default AqiCard;
