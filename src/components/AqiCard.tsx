
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
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{cityName}</CardTitle>
          <Badge 
            style={{ backgroundColor: aqiColor }}
            className="text-white"
          >
            AQI {airQuality.main.aqi}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        <div className="grid grid-cols-2 gap-1 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">PM2.5</span>
            <span className="font-medium">{airQuality.components.pm2_5.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">PM10</span>
            <span className="font-medium">{airQuality.components.pm10.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">O₃</span>
            <span className="font-medium">{airQuality.components.o3.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">NO₂</span>
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
