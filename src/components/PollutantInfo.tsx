
import { AirQualityItem } from "@/types/airQuality";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface PollutantInfoProps {
  airQuality: AirQualityItem;
}

// Define thresholds for pollutants
const pollutantThresholds = {
  pm2_5: { good: 12, moderate: 35, unhealthy: 55, veryUnhealthy: 150 },
  pm10: { good: 54, moderate: 154, unhealthy: 254, veryUnhealthy: 354 },
  o3: { good: 50, moderate: 100, unhealthy: 200, veryUnhealthy: 300 },
  no2: { good: 40, moderate: 80, unhealthy: 180, veryUnhealthy: 280 },
  co: { good: 4400, moderate: 9400, unhealthy: 12400, veryUnhealthy: 15400 },
  so2: { good: 80, moderate: 365, unhealthy: 800, veryUnhealthy: 1600 },
};

const getProgressValue = (value: number, pollutant: keyof typeof pollutantThresholds): number => {
  const thresholds = pollutantThresholds[pollutant];
  if (value <= thresholds.good) return 25;
  if (value <= thresholds.moderate) return 50;
  if (value <= thresholds.unhealthy) return 75;
  if (value <= thresholds.veryUnhealthy) return 90;
  return 100;
};

const getProgressColor = (value: number, pollutant: keyof typeof pollutantThresholds): string => {
  const thresholds = pollutantThresholds[pollutant];
  if (value <= thresholds.good) return "#8AD83E";
  if (value <= thresholds.moderate) return "#FDD64B";
  if (value <= thresholds.unhealthy) return "#FE9B57";
  if (value <= thresholds.veryUnhealthy) return "#FE6A69";
  return "#A87ABC";
};

const PollutantInfo = ({ airQuality }: PollutantInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Pollutants</h3>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">PM2.5</span>
          <span className="text-sm text-muted-foreground">{airQuality.components.pm2_5.toFixed(1)} μg/m³</span>
        </div>
        <Progress 
          value={getProgressValue(airQuality.components.pm2_5, "pm2_5")} 
          className="h-2"
          style={{ 
            backgroundColor: "#f3f4f6",
            "--progress-background": getProgressColor(airQuality.components.pm2_5, "pm2_5") 
          } as React.CSSProperties} 
        />
        <p className="text-xs text-muted-foreground mt-1">Fine particulate matter</p>
      </div>
      
      <Separator />
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">PM10</span>
          <span className="text-sm text-muted-foreground">{airQuality.components.pm10.toFixed(1)} μg/m³</span>
        </div>
        <Progress 
          value={getProgressValue(airQuality.components.pm10, "pm10")} 
          className="h-2"
          style={{ 
            backgroundColor: "#f3f4f6",
            "--progress-background": getProgressColor(airQuality.components.pm10, "pm10") 
          } as React.CSSProperties} 
        />
        <p className="text-xs text-muted-foreground mt-1">Coarse particulate matter</p>
      </div>
      
      <Separator />
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">O₃</span>
          <span className="text-sm text-muted-foreground">{airQuality.components.o3.toFixed(1)} μg/m³</span>
        </div>
        <Progress 
          value={getProgressValue(airQuality.components.o3, "o3")} 
          className="h-2"
          style={{ 
            backgroundColor: "#f3f4f6",
            "--progress-background": getProgressColor(airQuality.components.o3, "o3") 
          } as React.CSSProperties} 
        />
        <p className="text-xs text-muted-foreground mt-1">Ozone</p>
      </div>
      
      <Separator />
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">NO₂</span>
          <span className="text-sm text-muted-foreground">{airQuality.components.no2.toFixed(1)} μg/m³</span>
        </div>
        <Progress 
          value={getProgressValue(airQuality.components.no2, "no2")} 
          className="h-2"
          style={{ 
            backgroundColor: "#f3f4f6",
            "--progress-background": getProgressColor(airQuality.components.no2, "no2") 
          } as React.CSSProperties} 
        />
        <p className="text-xs text-muted-foreground mt-1">Nitrogen dioxide</p>
      </div>
    </div>
  );
};

export default PollutantInfo;
