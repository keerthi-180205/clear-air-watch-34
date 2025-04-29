export interface AirQualityData {
  coord: {
    lon: number;
    lat: number;
  };
  list: AirQualityItem[];
}

export interface AirQualityItem {
  main: {
    aqi: number; // 1-5 scale for air quality index
  };
  components: {
    co: number; // Carbon monoxide (μg/m3)
    no: number; // Nitrogen monoxide (μg/m3)
    no2: number; // Nitrogen dioxide (μg/m3)
    o3: number; // Ozone (μg/m3)
    so2: number; // Sulphur dioxide (μg/m3)
    pm2_5: number; // Fine particles matter (μg/m3)
    pm10: number; // Coarse particulate matter (μg/m3)
    nh3: number; // Ammonia (μg/m3)
  };
  dt: number; // Data timestamp (Unix)
  coord: {
    lat: number;
    lon: number;
  };
}

export interface City {
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
}

export interface AirQualityLevels {
  index: number;
  level: string;
  color: string;
  description: string;
  healthImplications: string;
  cautionaryStatement: string;
}

export const AQI_LEVELS: AirQualityLevels[] = [
  {
    index: 1,
    level: "Good",
    color: "#8AD83E",
    description: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
    healthImplications: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
    cautionaryStatement: "None"
  },
  {
    index: 2,
    level: "Moderate",
    color: "#FDD64B",
    description: "Air quality is acceptable; however, for some pollutants, there may be a moderate health concern for a very small number of people.",
    healthImplications: "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.",
    cautionaryStatement: "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion."
  },
  {
    index: 3,
    level: "Unhealthy for Sensitive Groups",
    color: "#FE9B57",
    description: "Members of sensitive groups may experience health effects. The general public is not likely to be affected.",
    healthImplications: "People with heart or lung disease, older adults, and children should limit prolonged outdoor exertion.",
    cautionaryStatement: "People with respiratory disease should limit outdoor exertion."
  },
  {
    index: 4,
    level: "Unhealthy",
    color: "#FE6A69",
    description: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
    healthImplications: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
    cautionaryStatement: "People with heart or lung disease, older adults, and children should avoid prolonged or heavy exertion; everyone else should reduce prolonged or heavy exertion."
  },
  {
    index: 5,
    level: "Very Unhealthy",
    color: "#A87ABC",
    description: "Health alert: everyone may experience more serious health effects.",
    healthImplications: "Health warnings of emergency conditions. The entire population is more likely to be affected.",
    cautionaryStatement: "People with heart or lung disease, older adults, and children should avoid all physical activity outdoors; everyone else should avoid prolonged or heavy exertion."
  }
];

export const getAqiColor = (aqi: number): string => {
  if (aqi >= 1 && aqi <= 5) {
    return AQI_LEVELS[aqi - 1].color;
  }
  return "#A87ABC"; // Default to worst
};

export const getAqiLevel = (aqi: number): AirQualityLevels => {
  if (aqi >= 1 && aqi <= 5) {
    return AQI_LEVELS[aqi - 1];
  }
  return AQI_LEVELS[4]; // Default to worst
};
