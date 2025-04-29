import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AirQualityLevels, AQI_LEVELS } from "@/types/airQuality";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
}

interface ChatbotProps {
  onClose: () => void;
  airQualityData?: {
    currentAqi?: number;
    cityName?: string;
    pollutants?: {
      co?: number;
      no2?: number;
      o3?: number;
      pm2_5?: number;
      pm10?: number;
      so2?: number;
      nh3?: number;
    };
    hasHistoricalData?: boolean;
    hasForecastData?: boolean;
  };
}

// Expanded FAQ data for the chatbot - with more questions about specific cities and pollutant levels
const faqData = [
  {
    question: "What is AQI?",
    answer: "AQI (Air Quality Index) is a scale used to communicate how polluted the air is. It ranges from 1-5, with 1 being good air quality and 5 being hazardous."
  },
  {
    question: "What are PM2.5 and PM10?",
    answer: "PM2.5 and PM10 refer to particulate matter with diameters less than 2.5 and 10 micrometers respectively. These tiny particles can penetrate deep into your lungs and even enter your bloodstream, causing respiratory and cardiovascular issues."
  },
  {
    question: "How is air quality measured?",
    answer: "Air quality is measured using specialized equipment that detects various pollutants like particulate matter, ozone, nitrogen dioxide, sulfur dioxide, and carbon monoxide. These measurements are then converted to an Air Quality Index (AQI) value."
  },
  {
    question: "What should I do when air quality is poor?",
    answer: "When air quality is poor, try to limit outdoor activities, keep windows closed, use air purifiers indoors if available, and wear appropriate masks if you must go outside. Those with respiratory or heart conditions, elderly people, and children should take extra precautions."
  },
  {
    question: "What causes air pollution?",
    answer: "Air pollution is caused by various factors including vehicle emissions, industrial processes, power generation, agricultural activities, natural events like wildfires, and household activities such as cooking and heating with solid fuels."
  },
  {
    question: "What is ClearCity?",
    answer: "ClearCity is a real-time urban pollution tracker application that provides air quality data for cities worldwide. It uses the OpenWeatherMap API to fetch current, historical, and forecast air quality information and presents it in an easy-to-understand format."
  },
  {
    question: "How do I use ClearCity?",
    answer: "To use ClearCity, you first need to enter your OpenWeatherMap API key. Then you can search for cities or click on the map to view air quality data for specific locations. The dashboard displays current air quality, historical data for the past 24 hours, and forecast data."
  },
  {
    question: "How does the ClearCity app work?",
    answer: "ClearCity works by connecting to the OpenWeatherMap API to fetch real-time air quality data. When you search for a city or click on the map, the app retrieves current air quality readings, historical data for the past 24 hours, and forecasts for that location. The data is displayed through an intuitive interface with color-coded AQI indicators and detailed pollutant information. You can also use the charts to visualize air quality trends and access this chatbot for additional information and guidance."
  },
  {
    question: "What information does ClearCity show?",
    answer: "ClearCity displays the Air Quality Index (AQI), individual pollutant levels (PM2.5, PM10, O3, NO2, SO2, CO), historical air quality data for the past 24 hours, and air quality forecasts. It also provides a map view of air quality across different locations."
  },
  {
    question: "What API does ClearCity use?",
    answer: "ClearCity uses the OpenWeatherMap API to fetch air quality data. You need to provide your own API key from OpenWeatherMap to use the application."
  },
  {
    question: "How accurate is the air quality data?",
    answer: "The air quality data in ClearCity comes directly from OpenWeatherMap, which aggregates data from various monitoring stations worldwide. The accuracy depends on the proximity to monitoring stations and the data collection methods used by local authorities."
  },
  {
    question: "Can I see historical air quality data?",
    answer: "Yes, ClearCity provides historical air quality data for the past 24 hours for any selected location. This data is displayed in chart format for easy visualization of trends."
  },
  {
    question: "How do I interpret the AQI values?",
    answer: "In ClearCity, AQI values range from 1-5. AQI 1 means Good air quality with minimal health concern. AQI 2 is Fair with minor concerns for sensitive individuals. AQI 3 is Moderate with possible effects for sensitive groups. AQI 4 is Poor with health effects for everyone. AQI 5 is Very Poor/Hazardous with serious health risks for all."
  },
  {
    question: "What do the charts show?",
    answer: "The charts in ClearCity visualize air quality data over time. The historical chart shows the past 24 hours of air quality measurements, while the forecast chart shows predicted air quality for upcoming hours. Both charts track pollutants like PM2.5, PM10, Ozone (O₃), and Nitrogen Dioxide (NO₂)."
  },
  {
    question: "How do I read the charts?",
    answer: "The charts in ClearCity display pollutant concentrations (y-axis) over time (x-axis). Each colored line represents a different pollutant: purple for PM2.5, green for PM10, yellow for Ozone (O₃), and orange for Nitrogen Dioxide (NO₂). Higher values indicate higher pollution levels. You can hover over any point on the chart to see exact measurements for that time. The historical chart (left) shows the past 24 hours, while the forecast chart (right) shows predicted future values."
  },
  {
    question: "What is PM2.5?",
    answer: "PM2.5 refers to fine particulate matter with a diameter of 2.5 micrometers or smaller. These particles are primarily from combustion sources like vehicle exhaust, power plants, and wildfires. They can penetrate deep into the lungs and bloodstream, causing respiratory and cardiovascular issues. The WHO guideline for PM2.5 is an annual mean of 5 μg/m³."
  },
  {
    question: "What is PM10?",
    answer: "PM10 refers to particulate matter with a diameter of 10 micrometers or smaller. These particles include dust, pollen, and mold. While larger than PM2.5, they can still cause health problems, particularly respiratory issues like coughing, asthma attacks, and decreased lung function. The WHO guideline for PM10 is an annual mean of 15 μg/m³."
  },
  {
    question: "What is ozone (O₃)?",
    answer: "Ground-level ozone (O₃) is a secondary pollutant formed when nitrogen oxides and volatile organic compounds react in sunlight. It's a major component of smog and typically peaks during hot, sunny days. Ozone can irritate the respiratory system, reduce lung function, aggravate asthma, and cause inflammation of lung tissue. The WHO guideline for ozone is a peak 8-hour mean of 100 μg/m³."
  },
  {
    question: "What is nitrogen dioxide (NO₂)?",
    answer: "Nitrogen dioxide (NO₂) is a gaseous air pollutant primarily from vehicle exhaust and power plants. It has a reddish-brown color and a sharp, harsh odor. NO₂ can irritate airways, worsen respiratory diseases like asthma, contribute to the formation of fine particles and ozone, and increase susceptibility to respiratory infections. The WHO guideline for NO₂ is an annual mean of 10 μg/m³."
  },
  {
    question: "What is sulfur dioxide (SO₂)?",
    answer: "Sulfur dioxide (SO₂) is a gaseous air pollutant primarily from burning fossil fuels containing sulfur, especially in power plants and industrial processes. It has a sharp, pungent odor and can irritate the respiratory system, worsen asthma and chronic bronchitis, and form acid rain. The WHO guideline for SO₂ is a 24-hour mean of 40 μg/m³."
  },
  {
    question: "What is carbon monoxide (CO)?",
    answer: "Carbon monoxide (CO) is a colorless, odorless gas produced by incomplete combustion of carbon-containing fuels. Sources include vehicle exhaust, gas stoves, and furnaces. CO is dangerous because it binds to hemoglobin in blood more readily than oxygen, reducing oxygen delivery to tissues and organs. High levels can cause headaches, dizziness, confusion, and even death. The WHO guideline for CO is an 8-hour mean of 10 mg/m³."
  },
  {
    question: "What is ammonia (NH₃)?",
    answer: "Ammonia (NH₃) is a colorless gas with a pungent odor. In air pollution contexts, it primarily comes from agricultural activities, especially livestock farming and fertilizer application. Ammonia contributes to the formation of secondary particulate matter and can irritate the respiratory system at high concentrations. It also contributes to environmental issues like eutrophication when deposited into water bodies."
  },
  {
    question: "What are the most polluted cities in the world?",
    answer: "According to recent data, some of the most polluted cities in the world include Delhi (India), Lahore (Pakistan), Dhaka (Bangladesh), Kolkata (India), and Beijing (China). These cities often experience high levels of PM2.5, PM10, and other pollutants due to factors like industrial emissions, vehicle exhaust, construction dust, and in some cases, geographical factors that trap pollution."
  },
  {
    question: "What are the cities with the cleanest air?",
    answer: "Cities with the cleanest air tend to be in countries with strict environmental regulations and favorable geographical conditions. Some examples include Reykjavik (Iceland), Wellington (New Zealand), Zurich (Switzerland), Helsinki (Finland), and Honolulu (USA). These cities typically have AQI values in the 'Good' range with low PM2.5 and other pollutants."
  },
  {
    question: "What causes high PM2.5 levels?",
    answer: "High PM2.5 levels are primarily caused by combustion sources: vehicle exhaust (particularly diesel), power plants, industrial processes, biomass burning (including wildfires and agricultural burning), residential wood burning, and cooking with solid fuels. Secondary formation can also occur when gases like sulfur dioxide and nitrogen oxides react in the atmosphere. In urban areas, traffic and industrial emissions are often the main sources."
  },
  {
    question: "What is the safe level for PM2.5?",
    answer: "According to the World Health Organization's 2021 updated guidelines, the recommended annual mean for PM2.5 is 5 μg/m³ or lower, and the 24-hour mean is 15 μg/m³ or lower. These levels were significantly reduced from previous guidelines as research has shown harmful health effects even at lower concentrations. The EPA's standard in the US is currently 12 μg/m³ for the annual mean."
  },
  {
    question: "How does air pollution affect children?",
    answer: "Children are especially vulnerable to air pollution because their lungs are still developing, they breathe more air per pound of body weight than adults, and they often spend more time outdoors. Exposure to air pollution can lead to reduced lung function, asthma development or worsening, respiratory infections, and even neurodevelopmental effects. Long-term exposure during childhood has been linked to reduced lung capacity in adulthood."
  },
  {
    question: "What time of day is air pollution usually worst?",
    answer: "Air pollution often follows daily patterns: in many urban areas, there are two peaks - one in the morning (7-9 AM) during rush hour traffic, and another in the evening (5-7 PM) due to evening commutes combined with cooling temperatures that can trap pollutants closer to the ground. Air quality is typically best in the afternoon when sunlight and warmer temperatures help disperse pollutants, though this can vary based on location and weather conditions."
  },
  {
    question: "How does weather affect air quality?",
    answer: "Weather significantly impacts air quality. Wind can disperse pollutants or bring in pollution from other areas. Rain and snow can wash particulates from the air, improving air quality temporarily. Temperature inversions (when warm air traps cooler air near the ground) can trap pollution close to the surface. Hot, sunny days can increase ozone formation. Humidity can interact with pollutants to form secondary particles. Generally, air quality is worst during calm, dry weather with temperature inversions."
  },
  {
    question: "What's the difference between PM2.5 and PM10?",
    answer: "PM2.5 refers to particulate matter with a diameter of 2.5 micrometers or smaller, while PM10 refers to particles with a diameter of 10 micrometers or smaller (which includes PM2.5). The key difference is that PM2.5 particles are much smaller and can penetrate deeper into the lungs and even enter the bloodstream, making them generally more harmful to human health. PM2.5 typically comes from combustion sources, while PM10 includes additional sources like dust, pollen, and mold spores."
  },
  {
    question: "How can I protect myself on high pollution days?",
    answer: "On high pollution days: 1) Check air quality forecasts and limit outdoor activities when pollution is high, 2) If you must go outside, choose times of day with better air quality, 3) Use properly fitted N95 or KN95 masks which can filter some particulates, 4) Create a clean air space indoors using HEPA air purifiers, 5) Keep windows and doors closed, 6) Avoid adding to indoor pollution (smoking, burning candles, frying foods), 7) Stay well-hydrated, and 8) Consider using air conditioning in recirculation mode if available."
  },
  {
    question: "Which countries have the worst air pollution?",
    answer: "According to recent global air quality data, countries with the most severe air pollution problems include Bangladesh, Pakistan, India, Mongolia, Afghanistan, and several nations in Africa including Chad and Niger. These countries often face a combination of challenges including rapid industrialization without sufficient environmental regulations, high population density, widespread use of solid fuels for cooking and heating, vehicle emissions, and in some cases, geographical factors that trap pollution."
  },
  {
    question: "How does ozone at ground level differ from ozone in the atmosphere?",
    answer: "Ozone (O₃) serves different roles depending on its location. In the stratosphere (10-50 km above Earth), the 'ozone layer' protects us by absorbing harmful UV radiation. However, at ground level (tropospheric ozone), it's a harmful pollutant created when nitrogen oxides and volatile organic compounds react in sunlight. Ground-level ozone irritates the respiratory system, damages lung tissue, reduces lung function, and worsens conditions like asthma. Unlike beneficial stratospheric ozone, ground-level ozone is a key component of smog and a serious public health concern."
  },
  {
    question: "What is considered a dangerous AQI level?",
    answer: "In the 1-5 scale used by ClearCity, AQI 4 (Unhealthy) and 5 (Very Unhealthy/Hazardous) are considered dangerous. When converted to the more common 0-500 scale: Values above 150 (Unhealthy) begin to affect everyone, not just sensitive groups. Levels above 200 (Very Unhealthy) represent a health alert where everyone may experience serious health effects. Above 300 (Hazardous) is an emergency condition where the entire population is likely to be affected, with serious health impacts even for healthy individuals."
  },
  {
    question: "Why is air quality often worse in winter?",
    answer: "Air quality often deteriorates in winter due to several factors: 1) Temperature inversions trap pollutants close to the ground, 2) Increased heating needs lead to more fuel burning, especially wood and coal in residential areas, 3) Cold engines produce more emissions and vehicles idle longer, 4) Reduced mixing of air due to lower temperatures, 5) Less rainfall in some regions means fewer natural cleansing events, and 6) In very cold areas, people spend more time indoors with reduced ventilation. These factors combine to create higher concentration of pollutants, particularly PM2.5."
  },
  {
    question: "How can I help improve air quality?",
    answer: "You can help improve air quality by: 1) Using public transportation, carpooling, or biking instead of driving alone, 2) Conserving energy at home by using energy-efficient appliances and proper insulation, 3) Reducing or eliminating wood burning, especially during air quality alerts, 4) Properly maintaining your vehicles to reduce emissions, 5) Using electric or manual lawn equipment instead of gas-powered tools, 6) Supporting clean air policies and regulations, and 7) Planting trees and vegetation which can help filter some pollutants from the air."
  },
  {
    question: "How does the ClearCity chatbot work?",
    answer: "The ClearCity chatbot uses a knowledge base of air quality information to answer your questions. It can provide information about air quality concepts, pollutants, health effects, and how to use the ClearCity application. The chatbot can also provide context-specific information about the currently selected location if you've clicked on the map or searched for a city. Just type your question in the chat box and the bot will respond with relevant information."
  }
];

// Suggested prompts that users can click on
const suggestedPrompts = [
  "What is AQI?",
  "How do I read the charts?",
  "Which cities have the worst pollution?",
  "What are safe levels for PM2.5?",
  "How does weather affect air quality?",
  "What health risks come from air pollution?",
  "How does the ClearCity app work?"
];

// Project-specific keywords for improved query matching
const projectKeywords = {
  clearcity: ["clearcity", "clear city", "this app", "this application", "the app", "app", "website", "site", "dashboard", "platform"],
  features: ["features", "capabilities", "functions", "functionality", "what can", "able to", "how to use", "usage", "instructions"],
  api: ["api", "openweathermap", "weather", "key", "token", "authentication"],
  airQuality: ["air quality", "aqi", "pollution", "pollutant", "pm2.5", "pm10", "ozone", "o3", "no2", "co", "so2"],
  data: ["data", "information", "stats", "statistics", "metrics", "measurements", "readings", "levels"],
  map: ["map", "visualization", "visual", "view", "display", "show", "locate", "location", "city", "cities", "area", "region"],
  time: ["time", "history", "historical", "past", "previous", "forecast", "future", "prediction", "trend", "trends", "24 hours"],
  charts: ["chart", "graph", "plot", "line", "visualization", "trend", "patterns", "axis", "legend", "read"],
  pollutants: ["pm2.5", "pm10", "o3", "ozone", "no2", "nitrogen dioxide", "so2", "sulfur dioxide", "co", "carbon monoxide", "nh3", "ammonia", "particulate", "matter", "gas", "particle"],
  cities: ["city", "cities", "urban", "location", "place", "town", "region", "area", "country", "world", "global", "metropolitan"],
  comparison: ["most", "least", "worst", "best", "cleanest", "dirtiest", "polluted", "clean", "compare", "comparison", "higher", "lower", "better", "worse", "ranking", "rank", "top", "bottom"],
  health: ["health", "healthy", "sick", "illness", "disease", "respiratory", "lungs", "asthma", "breathe", "breathing", "cardiovascular", "heart", "children", "elderly", "sensitive", "symptoms", "effects", "impact", "risk"],
  weather: ["weather", "temperature", "rain", "wind", "humidity", "season", "seasonal", "winter", "summer", "spring", "fall", "inversion", "climate", "meteorological", "pressure"],
  causes: ["cause", "causes", "source", "sources", "emission", "emissions", "produce", "producing", "create", "creating", "contribute", "contributing", "factor", "factors", "reason", "reasons", "origin", "origins"],
  solutions: ["solution", "solutions", "reduce", "reducing", "mitigate", "mitigating", "improve", "improving", "clean", "cleaning", "policy", "policies", "regulation", "regulations", "action", "actions", "initiative", "initiatives", "protect", "protecting", "prevention", "prevent"]
};

const Chatbot: React.FC<ChatbotProps> = ({ onClose, airQualityData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      type: "bot",
      text: "Hello! I'm your ClearCity assistant. How can I help you with air quality information or using this application today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to find exact matches in the FAQ data
  const findExactMatch = (text: string): string | null => {
    const normalizedInput = text.toLowerCase().trim();
    
    for (const faq of faqData) {
      if (faq.question.toLowerCase().trim() === normalizedInput) {
        return faq.answer;
      }
    }
    
    return null;
  };

  // Function to check if a string contains any keywords from an array
  const containsKeywords = (text: string, keywords: string[]): boolean => {
    const normalizedText = text.toLowerCase();
    return keywords.some(keyword => normalizedText.includes(keyword.toLowerCase()));
  };

  // Function to get context-aware information about current air quality
  const getCurrentAirQualityInfo = (): string => {
    if (!airQualityData || airQualityData.currentAqi === undefined) {
      return "No air quality data is currently selected. Try clicking on the map or searching for a city to view air quality information.";
    }

    const aqiLevel = airQualityData.currentAqi !== undefined ? 
      AQI_LEVELS[airQualityData.currentAqi - 1] : null;
    
    let response = `Current air quality for ${airQualityData.cityName || "the selected location"} is `;
    
    if (aqiLevel) {
      response += `AQI ${airQualityData.currentAqi} (${aqiLevel.level}). ${aqiLevel.description}`;
      
      // Add pollutant info if available
      if (airQualityData.pollutants) {
        response += "\n\nKey pollutant levels:";
        if (airQualityData.pollutants.pm2_5 !== undefined) 
          response += `\nPM2.5: ${airQualityData.pollutants.pm2_5.toFixed(1)} μg/m³`;
        if (airQualityData.pollutants.pm10 !== undefined) 
          response += `\nPM10: ${airQualityData.pollutants.pm10.toFixed(1)} μg/m³`;
        if (airQualityData.pollutants.o3 !== undefined) 
          response += `\nO₃: ${airQualityData.pollutants.o3.toFixed(1)} μg/m³`;
        if (airQualityData.pollutants.no2 !== undefined) 
          response += `\nNO₂: ${airQualityData.pollutants.no2.toFixed(1)} μg/m³`;
      }
      
      // Add historical/forecast data availability info
      if (airQualityData.hasHistoricalData || airQualityData.hasForecastData) {
        response += "\n\nAdditional data available:";
        if (airQualityData.hasHistoricalData) response += "\n- Historical data for the past 24 hours";
        if (airQualityData.hasForecastData) response += "\n- Air quality forecast";
      }
    } else {
      response += "not available.";
    }
    
    return response;
  };

  // Function to handle specific pollutant questions
  const handlePollutantQuestion = (userInput: string): string | null => {
    const normalizedInput = userInput.toLowerCase();
    
    // Handle PM2.5 questions
    if (normalizedInput.includes("pm2.5") || normalizedInput.includes("pm 2.5")) {
      if (airQualityData?.pollutants?.pm2_5 !== undefined) {
        return `The current PM2.5 level for ${airQualityData.cityName || "this location"} is ${airQualityData.pollutants.pm2_5.toFixed(1)} μg/m³. PM2.5 refers to fine particulate matter smaller than 2.5 micrometers that can penetrate deep into the lungs and bloodstream. The World Health Organization recommends levels below 5 μg/m³ for annual exposure.`;
      } else {
        return "PM2.5 refers to fine particulate matter with a diameter of 2.5 micrometers or smaller. These particles are harmful as they can penetrate deep into your lungs and even enter the bloodstream. Select a location on the map or search for a city to see PM2.5 levels.";
      }
    }
    
    // Handle other pollutants
    if (normalizedInput.includes("pm10") || normalizedInput.includes("pm 10")) {
      if (airQualityData?.pollutants?.pm10 !== undefined) {
        return `The current PM10 level for ${airQualityData.cityName || "this location"} is ${airQualityData.pollutants.pm10.toFixed(1)} μg/m³. PM10 refers to coarse particulate matter smaller than 10 micrometers that can enter the respiratory system. The World Health Organization recommends levels below 15 μg/m³ for annual exposure.`;
      } else {
        return "PM10 refers to particulate matter with a diameter of 10 micrometers or smaller. These particles can enter your respiratory system and cause health issues. Select a location on the map or search for a city to see PM10 levels.";
      }
    }
    
    if (normalizedInput.includes("o3") || normalizedInput.includes("ozone")) {
      if (airQualityData?.pollutants?.o3 !== undefined) {
        return `The current Ozone (O₃) level for ${airQualityData.cityName || "this location"} is ${airQualityData.pollutants.o3.toFixed(1)} μg/m³. Ground-level ozone is a harmful air pollutant formed when pollutants from cars, power plants, and other sources react in the presence of sunlight. It can irritate the respiratory system and worsen conditions like asthma.`;
      } else {
        return "Ozone (O₃) at ground level is a harmful air pollutant and a key component of smog. It's formed when pollutants emitted by cars, power plants, and other sources chemically react in the presence of sunlight. Select a location on the map or search for a city to see Ozone levels.";
      }
    }
    
    if (normalizedInput.includes("no2") || normalizedInput.includes("nitrogen dioxide")) {
      if (airQualityData?.pollutants?.no2 !== undefined) {
        return `The current Nitrogen Dioxide (NO₂) level for ${airQualityData.cityName || "this location"} is ${airQualityData.pollutants.no2.toFixed(1)} μg/m³. NO₂ comes primarily from burning fuel in vehicles and power plants. It can irritate the respiratory system and contribute to the formation of particulate matter and ozone.`;
      } else {
        return "Nitrogen Dioxide (NO₂) is a gaseous air pollutant that primarily comes from burning fuel in vehicles, power plants, and industrial processes. It can irritate airways and worsen respiratory diseases. Select a location on the map or search for a city to see NO₂ levels.";
      }
    }
    
    if (normalizedInput.includes("so2") || normalizedInput.includes("sulfur dioxide")) {
      if (airQualityData?.pollutants?.so2 !== undefined) {
        return `The current Sulfur Dioxide (SO₂) level for ${airQualityData.cityName || "this location"} is ${airQualityData.pollutants.so2.toFixed(1)} μg/m³. SO₂ comes primarily from burning fossil fuels containing sulfur. It can harm the respiratory system and contribute to acid rain.`;
      } else {
        return "Sulfur Dioxide (SO₂) is a gaseous air pollutant primarily from burning fossil fuels containing sulfur. It has a sharp, pungent odor and can irritate the respiratory system, worsen asthma and chronic bronchitis, and form acid rain. The WHO guideline for SO₂ is a 24-hour mean of 40 μg/m³.";
      }
    }
    
    if (normalizedInput.includes("co") || normalizedInput.includes("carbon monoxide")) {
      if (airQualityData?.pollutants?.co !== undefined) {
        return `The current Carbon Monoxide (CO) level for ${airQualityData.cityName || "this location"} is ${airQualityData.pollutants.co.toFixed(1)} μg/m³. CO is a colorless, odorless gas that comes from incomplete combustion. It reduces oxygen delivery in the body and can be harmful at high concentrations.`;
      } else {
        return "Carbon monoxide (CO) is a colorless, odorless gas produced by incomplete combustion of carbon-containing fuels. Sources include vehicle exhaust, gas stoves, and furnaces. CO is dangerous because it binds to hemoglobin in blood more readily than oxygen, reducing oxygen delivery to tissues and organs.";
      }
    }
    
    return null; // No specific pollutant question detected
  };

  // Function to handle chart-related questions
  const handleChartQuestion = (userInput: string): string | null => {
    const normalizedInput = userInput.toLowerCase();
    
    // Direct match for chart-related questions
    if (normalizedInput.includes("how") && 
        (normalizedInput.includes("read") || normalizedInput.includes("interpret")) && 
        normalizedInput.includes("chart")) {
      
      return "The charts in ClearCity display pollutant concentrations (y-axis) over time (x-axis). Each colored line represents a different pollutant: purple for PM2.5, green for PM10, yellow for Ozone (O₃), and orange for Nitrogen Dioxide (NO₂). Higher values indicate higher pollution levels. You can hover over any point on the chart to see exact measurements for that time. The historical chart (left) shows the past 24 hours, while the forecast chart (right) shows predicted future values.";
    }
    
    // More flexible pattern matching for chart questions
    if ((normalizedInput.includes("chart") || normalizedInput.includes("graph") || 
         normalizedInput.includes("plot")) && 
        (normalizedInput.includes("read") || normalizedInput.includes("understand") || 
         normalizedInput.includes("interpret") || normalizedInput.includes("how"))) {
        
      return "The charts in ClearCity display pollutant concentrations (y-axis) over time (x-axis). Each colored line represents a different pollutant: purple for PM2.5, green for PM10, yellow for Ozone (O₃), and orange for Nitrogen Dioxide (NO₂). Higher values indicate higher pollution levels. You can hover over any point on the chart to see exact measurements for that time. The historical chart (left) shows the past 24 hours, while the forecast chart (right) shows predicted future values.";
    }
    
    // Questions about the historical chart
    if (containsKeywords(normalizedInput, ["what", "show", "explain", "about"]) && 
        containsKeywords(normalizedInput, projectKeywords.charts)) {
      
      if (normalizedInput.includes("historical") || 
          normalizedInput.includes("history") || 
          normalizedInput.includes("past") || 
          normalizedInput.includes("24 hour")) {
        
        if (airQualityData?.hasHistoricalData) {
          return `The historical chart shows air quality data for ${airQualityData.cityName || "the selected location"} over the past 24 hours. Each colored line represents a different pollutant: purple for PM2.5, green for PM10, yellow for Ozone (O₃), and orange for Nitrogen Dioxide (NO₂). The x-axis shows time, and the y-axis shows concentration in μg/m³. Higher values indicate worse air quality. You can hover over any point on the chart to see exact measurements.`;
        } else {
          return "The historical chart displays air quality data from the past 24 hours. It tracks multiple pollutants (PM2.5, PM10, Ozone, and NO₂) over time, allowing you to see how air quality has changed throughout the day. The chart appears when you select a location on the map or search for a city.";
        }
      }
      
      // Questions about the forecast chart
      if (normalizedInput.includes("forecast") || 
          normalizedInput.includes("future") || 
          normalizedInput.includes("predict") || 
          normalizedInput.includes("upcoming")) {
        
        if (airQualityData?.hasForecastData) {
          return `The forecast chart shows predicted air quality data for ${airQualityData.cityName || "the selected location"} in the upcoming hours. Like the historical chart, each colored line represents a different pollutant: purple for PM2.5, green for PM10, yellow for Ozone, and orange for NO₂. This can help you plan outdoor activities based on expected air quality.`;
        } else {
          return "The forecast chart shows predicted air quality for the next several hours. It uses the same color-coding as the historical chart (purple for PM2.5, green for PM10, yellow for Ozone, and orange for NO₂) and can help you plan activities based on expected air quality. The forecast chart appears when you select a location on the map or search for a city.";
        }
      }
      
      // General chart information
      return "ClearCity displays two main charts: a historical chart showing air quality data for the past 24 hours, and a forecast chart showing predicted air quality for upcoming hours. Both charts track multiple pollutants (PM2.5, PM10, Ozone, and NO₂) using different colored lines. These visualizations help you understand air quality patterns over time and make informed decisions about outdoor activities.";
    }
    
    return null; // No chart question detected
  };

  // Function to handle app-related questions
  const handleAppQuestion = (userInput: string): string | null => {
    const normalizedInput = userInput.toLowerCase();
    
    // Direct match for app functionality questions
    if ((normalizedInput.includes("how") && 
         normalizedInput.includes("work") && 
         (normalizedInput.includes("clearcity") || normalizedInput.includes("clear city") || normalizedInput.includes("app")))) {
      
      return "ClearCity works by connecting to the OpenWeatherMap API to fetch real-time air quality data. When you search for a city or click on the map, the app retrieves current air quality readings, historical data for the past 24 hours, and forecasts for that location. The data is displayed through an intuitive interface with color-coded AQI indicators and detailed pollutant information. You can also use the charts to visualize air quality trends and access this chatbot for additional information and guidance.";
    }
    
    return null; // No app question detected
  };

  // Function to find the best answer from the FAQ data
  const findBestAnswer = (text: string): string | null => {
    // First, check for exact matches
    const exactMatch = findExactMatch(text);
    if (exactMatch) return exactMatch;
    
    // Next, check if the question is about the current air quality
    if (text.toLowerCase().includes("current") && 
        containsKeywords(text, ["air quality", "aqi", "pollution"])) {
      return getCurrentAirQualityInfo();
    }
    
    // Check for specific pollutant questions
    const pollutantAnswer = handlePollutantQuestion(text);
    if (pollutantAnswer) return pollutantAnswer;
    
    // Check for chart-related questions
    const chartAnswer = handleChartQuestion(text);
    if (chartAnswer) return chartAnswer;
    
    // Check for app-related questions
    const appAnswer = handleAppQuestion(text);
    if (appAnswer) return appAnswer;
    
    // If no direct match, try to find the FAQ with the most keyword matches
    const normalizedInput = text.toLowerCase();
    
    // Check if the query is completely unrelated to the project
    let isAirQualityRelated = false;
    
    // Check against project keywords
    Object.values(projectKeywords).forEach(keywordArray => {
      if (containsKeywords(normalizedInput, keywordArray)) {
        isAirQualityRelated = true;
      }
    });
    
    // Check if the query contains any keywords from the FAQs
    if (!isAirQualityRelated) {
      for (const faq of faqData) {
        const questionWords = faq.question.toLowerCase().split(" ");
        for (const word of questionWords) {
          if (word.length > 3 && normalizedInput.includes(word)) {
            isAirQualityRelated = true;
            break;
          }
        }
        if (isAirQualityRelated) break;
      }
    }
    
    if (!isAirQualityRelated) {
      return "Unable to fetch the data...! I'm designed to answer questions about air quality and the ClearCity application. Please ask me something related to air pollution, AQI, pollutants, or how to use this app.";
    }
    
    // Find the best match based on keyword presence
    let bestMatchScore = 0;
    let bestMatchAnswer = null;
    
    for (const faq of faqData) {
      let score = 0;
      const questionWords = faq.question.toLowerCase().split(" ");
      
      // Count how many words from the FAQ question appear in the input
      for (const word of questionWords) {
        if (word.length > 3 && normalizedInput.includes(word)) {
          score++;
        }
      }
      
      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatchAnswer = faq.answer;
      }
    }
    
    // Return the best match if it has a minimum score, otherwise a fallback message
    return bestMatchScore >= 2
      ? bestMatchAnswer
      : "I'm not sure I understand your question. Could you try rephrasing it, or ask me about air quality, pollutants, or how to use the ClearCity app?";
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setShowSuggestions(false);
    
    // Find the best answer from FAQ data
    const answer = findBestAnswer(input);
    
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: answer || "I don't have information about that yet. Would you like to know something else about air quality or the ClearCity app?",
      };
      setMessages(prev => [...prev, botMessage]);
    }, 600); // Small delay for better UX
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    setShowSuggestions(false);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: prompt,
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Find the answer from FAQ data
    const answer = findBestAnswer(prompt);
    
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: answer || "I don't have information about that yet. Would you like to know something else about air quality or the ClearCity app?",
      };
      setMessages(prev => [...prev, botMessage]);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Card className="w-[350px] h-[500px] fixed bottom-20 right-6 overflow-hidden shadow-lg z-[1000]">
      {/* Header */}
      <div className="bg-primary text-white p-3 flex justify-between items-center">
        <h3 className="font-medium">ClearCity Assistant</h3>
        <button 
          onClick={onClose} 
          className="rounded-full p-1 hover:bg-primary-dark transition-colors"
          aria-label="Close chatbot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      
      {/* Messages */}
      <ScrollArea className="h-[380px] p-3">
        <div className="space-y-4 pb-2">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`rounded-lg px-4 py-2 max-w-[85%] ${
                  message.type === "user" 
                    ? "bg-primary text-white" 
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}
          {/* Suggestions */}
          {showSuggestions && (
            <div className="flex flex-wrap gap-2 mt-4">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptClick(prompt)}
                  className="bg-muted rounded-full px-3 py-1 text-xs hover:bg-muted/80 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input */}
      <div className="border-t p-3 flex gap-2">
        <Input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about air quality..."
          className="flex-1"
        />
        <Button size="sm" onClick={handleSendMessage}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-11 11"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </Card>
  );
};

export default Chatbot;
