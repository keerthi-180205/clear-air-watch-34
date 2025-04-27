
import { AQI_LEVELS } from "@/types/airQuality";

const AqiIndex = () => {
  return (
    <div className="w-full px-4">
      <h3 className="font-medium mb-2 text-lg">Air Quality Index (AQI)</h3>
      <div className="flex flex-col space-y-4">
        {AQI_LEVELS.map((level) => (
          <div key={level.index} className="flex items-center space-x-4">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: level.color }}
            >
              {level.index}
            </div>
            <div className="flex-1">
              <div className="font-medium" style={{ color: level.color }}>{level.level}</div>
              <p className="text-xs text-muted-foreground">{level.healthImplications.substring(0, 60)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AqiIndex;
