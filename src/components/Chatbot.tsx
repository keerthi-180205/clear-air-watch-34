
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

// FAQ data for the chatbot - expanded with more project-specific information
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
    question: "How do I read the line charts?",
    answer: "The line charts display pollutant concentrations (y-axis) over time (x-axis). Each colored line represents a different pollutant: PM2.5, PM10, O₃, and NO₂. Higher values indicate higher pollution levels. You can hover over any point on the chart to see exact measurements for that time."
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
  }
];

// Project-specific keywords to help with matching user queries
const projectKeywords = {
  clearcity: ["clearcity", "clear city", "this app", "this application", "the app", "app", "website", "site", "dashboard", "platform"],
  features: ["features", "capabilities", "functions", "functionality", "what can", "able to", "how to use", "usage", "instructions"],
  api: ["api", "openweathermap", "weather", "key", "token", "authentication"],
  airQuality: ["air quality", "aqi", "pollution", "pollutant", "pm2.5", "pm10", "ozone", "o3", "no2", "co", "so2"],
  data: ["data", "information", "stats", "statistics", "metrics", "measurements", "readings", "levels"],
  map: ["map", "visualization", "visual", "view", "display", "show", "locate", "location", "city", "cities", "area", "region"],
  time: ["time", "history", "historical", "past", "previous", "forecast", "future", "prediction", "trend", "trends", "24 hours"],
  charts: ["chart", "graph", "plot", "line", "visualization", "trend", "patterns", "axis", "legend"],
  pollutants: ["pm2.5", "pm10", "o3", "ozone", "no2", "nitrogen dioxide", "so2", "sulfur dioxide", "co", "carbon monoxide", "nh3", "ammonia", "particulate", "matter", "gas", "particle"]
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        return "PM2.5 refers to fine particulate matter with a diameter of 2.5 micrometers or smaller. These particles are harmful as they can penetrate deep into your lungs and even enter your bloodstream. Select a location on the map or search for a city to see PM2.5 levels.";
      }
    }
    
    // Handle PM10 questions
    if (normalizedInput.includes("pm10") || normalizedInput.includes("pm 10")) {
      if (airQualityData?.pollutants?.pm10 !== undefined) {
        return `The current PM10 level for ${airQualityData.cityName || "this location"} is ${airQualityData.pollutants.pm10.toFixed(1)} μg/m³. PM10 refers to coarse particulate matter smaller than 10 micrometers that can enter the respiratory system. The World Health Organization recommends levels below 15 μg/m³ for annual exposure.`;
      } else {
        return "PM10 refers to particulate matter with a diameter of 10 micrometers or smaller. These particles can enter your respiratory system and cause health issues. Select a location on the map or search for a city to see PM10 levels.";
      }
    }
    
    // Handle Ozone (O3) questions
    if (normalizedInput.includes("o3") || normalizedInput.includes("ozone")) {
      if (airQualityData?.pollutants?.o3 !== undefined) {
        return `The current Ozone (O₃) level for ${airQualityData.cityName || "this location"} is ${airQualityData.pollutants.o3.toFixed(1)} μg/m³. Ground-level ozone is a harmful air pollutant formed when pollutants from cars, power plants, and other sources react in the presence of sunlight. It can irritate the respiratory system and worsen conditions like asthma.`;
      } else {
        return "Ozone (O₃) at ground level is a harmful air pollutant and a key component of smog. It's formed when pollutants emitted by cars, power plants, and other sources chemically react in the presence of sunlight. Select a location on the map or search for a city to see Ozone levels.";
      }
    }
    
    // Handle Nitrogen Dioxide (NO2) questions
    if (normalizedInput.includes("no2") || normalizedInput.includes("nitrogen dioxide")) {
      if (airQualityData?.pollutants?.no2 !== undefined) {
        return `The current Nitrogen Dioxide (NO₂) level for ${airQualityData.cityName || "this location"} is ${airQualityData.pollutants.no2.toFixed(1)} μg/m³. NO₂ comes primarily from burning fuel in vehicles and power plants. It can irritate the respiratory system and contribute to the formation of particulate matter and ozone.`;
      } else {
        return "Nitrogen Dioxide (NO₂) is a gaseous air pollutant that primarily comes from burning fuel in vehicles, power plants, and industrial processes. It can irritate airways and worsen respiratory diseases. Select a location on the map or search for a city to see NO₂ levels.";
      }
    }
    
    // Handle other pollutants if data is available
    if (normalizedInput.includes("so2") || normalizedInput.includes("sulfur dioxide")) {
      if (airQualityData?.pollutants?.so2 !== undefined) {
        return `The current Sulfur Dioxide (SO₂) level for ${airQualityData.cityName || "this location"} is ${airQualityData.pollutants.so2.toFixed(1)} μg/m³. SO₂ comes primarily from burning fossil fuels containing sulfur. It can harm the respiratory system and contribute to acid rain.`;
      }
    }
    
    if (normalizedInput.includes("co") || normalizedInput.includes("carbon monoxide")) {
      if (airQualityData?.pollutants?.co !== undefined) {
        return `The current Carbon Monoxide (CO) level for ${airQualityData.cityName || "this location"} is ${airQualityData.pollutants.co.toFixed(1)} μg/m³. CO is a colorless, odorless gas that comes from incomplete combustion. It reduces oxygen delivery in the body and can be harmful at high concentrations.`;
      }
    }
    
    return null; // No specific pollutant question detected
  };

  // Function to handle chart-related questions
  const handleChartQuestion = (userInput: string): string | null => {
    const normalizedInput = userInput.toLowerCase();
    
    if (containsKeywords(normalizedInput, ["what", "show", "explain", "about"]) && 
        containsKeywords(normalizedInput, projectKeywords.charts)) {
      
      // Questions about the historical chart
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
          return `The forecast chart shows predicted air quality data for ${airQualityData.cityName || "the selected location"} in the upcoming hours. Like the historical chart, each colored line represents a different pollutant: purple for PM2.5, green for PM10, yellow for Ozone (O₃), and orange for Nitrogen Dioxide (NO₂). This can help you plan outdoor activities based on expected air quality.`;
        } else {
          return "The forecast chart shows predicted air quality for the next several hours. It uses the same color-coding as the historical chart (purple for PM2.5, green for PM10, yellow for Ozone, and orange for NO₂) and can help you plan activities based on expected air quality. The forecast chart appears when you select a location on the map or search for a city.";
        }
      }
      
      // General questions about chart reading
      if (normalizedInput.includes("read") || 
          normalizedInput.includes("understand") || 
          normalizedInput.includes("interpret") ||
          normalizedInput.includes("how to")) {
        
        return "The charts in ClearCity display pollutant concentrations (y-axis) over time (x-axis). Each colored line tracks a different pollutant: purple for PM2.5, green for PM10, yellow for Ozone (O₃), and orange for Nitrogen Dioxide (NO₂). Higher values indicate higher pollution levels. You can hover over any point to see the exact measurement for that time. The historical chart (left) shows the past 24 hours, while the forecast chart (right) shows predicted future values.";
      }
      
      // General chart information
      return "ClearCity displays two main charts: a historical chart showing air quality data for the past 24 hours, and a forecast chart showing predicted air quality for upcoming hours. Both charts track multiple pollutants (PM2.5, PM10, Ozone, and NO₂) using different colored lines. These visualizations help you understand air quality patterns over time and make informed decisions about outdoor activities.";
    }
    
    return null; // No chart question detected
  };

  // Enhanced response generation with better context understanding for charts and API data
  const generateResponse = (userInput: string): string => {
    const normalizedInput = userInput.toLowerCase();
    
    // Check for specific pollutant questions first
    const pollutantResponse = handlePollutantQuestion(userInput);
    if (pollutantResponse) return pollutantResponse;
    
    // Check for chart-related questions
    const chartResponse = handleChartQuestion(userInput);
    if (chartResponse) return chartResponse;
    
    // Check for current air quality data request
    if (normalizedInput.includes("current") && 
        (normalizedInput.includes("air quality") || 
         normalizedInput.includes("aqi") || 
         normalizedInput.includes("pollution"))) {
      return getCurrentAirQualityInfo();
    }
    
    // Check for specific location air quality questions
    if (containsKeywords(normalizedInput, ["what is", "how is", "tell me"]) &&
        containsKeywords(normalizedInput, ["air quality", "aqi", "pollution"]) &&
        !normalizedInput.includes("what is aqi")) {
      
      // Check if they're asking about the currently selected location
      if (airQualityData && airQualityData.currentAqi !== undefined) {
        return getCurrentAirQualityInfo();
      } else {
        return "To check air quality for a specific location, you can either search for a city using the search bar at the top of the application or click directly on the map. Once you select a location, I can provide you with detailed air quality information for that area.";
      }
    }
    
    // Check for a question about trend analysis
    if (containsKeywords(normalizedInput, ["trend", "pattern", "change", "changing", "improving", "worsening"]) &&
        containsKeywords(normalizedInput, ["air quality", "pollution", "aqi"])) {
      
      if (airQualityData?.hasHistoricalData) {
        return `You can analyze air quality trends for ${airQualityData.cityName || "this location"} by looking at the historical chart below the map. This chart shows how different pollutants (PM2.5, PM10, O₃, and NO₂) have changed over the past 24 hours. Look for patterns like daily peaks and valleys, which often correspond to traffic patterns and temperature changes throughout the day.`;
      } else {
        return "To analyze air quality trends, select a location on the map or search for a city. The historical chart will show you how different pollutants have changed over the past 24 hours. Look for patterns like higher pollution during rush hours or changes related to weather conditions. The forecast chart can also help you anticipate upcoming changes in air quality.";
      }
    }
    
    // Check for irrelevant questions or non-project content
    const isProjectRelated = Object.values(projectKeywords).some(category => 
      containsKeywords(normalizedInput, category)
    ) || normalizedInput.includes("pollution") || normalizedInput.includes("air") || normalizedInput.includes("quality");
    
    if (!isProjectRelated && !normalizedInput.includes("help") && !normalizedInput.includes("hi") && !normalizedInput.includes("hello")) {
      return "I'm designed to help with questions about air quality and the ClearCity application. If you have questions about those topics, I'd be happy to assist you!";
    }
    
    // Check for AQI level questions
    const aqiMatch = normalizedInput.match(/what (is|does) (aqi|air quality index) (level )?(of )?(\d+)( mean)?/);
    if (aqiMatch) {
      const level = parseInt(aqiMatch[5]);
      if (level >= 1 && level <= 5) {
        const aqiInfo = AQI_LEVELS[level - 1];
        return `AQI ${level} is rated as "${aqiInfo.level}". ${aqiInfo.description} ${aqiInfo.healthImplications}`;
      }
    }
    
    // Check for FAQ matches - exact and fuzzy
    for (const faq of faqData) {
      if (normalizedInput.includes(faq.question.toLowerCase()) || 
          (normalizedInput.length > 5 && faq.question.toLowerCase().includes(normalizedInput))) {
        return faq.answer;
      }
    }
    
    // Check for feature/capability questions about the app
    if ((containsKeywords(normalizedInput, projectKeywords.features) && 
         containsKeywords(normalizedInput, projectKeywords.clearcity)) || 
        normalizedInput.includes("what does this do") || 
        normalizedInput.includes("what can this do")) {
      return "ClearCity is a real-time urban pollution tracker that shows air quality data across cities worldwide. You can search for specific cities, view current AQI levels, check pollutant details, see historical data for the past 24 hours, and view air quality forecasts. You can also click directly on the map to check air quality at specific locations.";
    }
    
    // Check for API key related questions
    if (containsKeywords(normalizedInput, projectKeywords.api)) {
      return "ClearCity requires an OpenWeatherMap API key to function. You'll need to enter your API key when you first open the application. You can get a free API key by signing up at the OpenWeatherMap website. This key allows the application to fetch real-time air quality data.";
    }
    
    // Check for data visualization questions
    if ((containsKeywords(normalizedInput, projectKeywords.map) || 
         containsKeywords(normalizedInput, ["chart", "graph"])) && 
        containsKeywords(normalizedInput, projectKeywords.airQuality)) {
      return "ClearCity visualizes air quality data in several ways: an interactive map using color-coded markers to show AQI levels across locations, detailed charts showing historical 24-hour data trends, and forecast graphs for upcoming air quality predictions. You can interact with the map to select specific locations or use the search feature to find cities.";
    }
    
    // Check for common queries
    if (normalizedInput.includes("hello") || normalizedInput.includes("hi")) {
      return "Hello! How can I help you with air quality information or using the ClearCity application today?";
    }
    
    if (normalizedInput.includes("thank")) {
      return "You're welcome! If you have any more questions about air quality or using ClearCity, feel free to ask.";
    }
    
    if (normalizedInput.includes("bye")) {
      return "Goodbye! Stay healthy and breathe clean air!";
    }
    
    if (normalizedInput.includes("how are you")) {
      return "I'm just a chatbot, but I'm functioning well and ready to help you with air quality information and using ClearCity!";
    }
    
    if (normalizedInput.includes("help")) {
      return "I can answer questions about air quality, pollution, health effects, and provide information about using the ClearCity application. You can ask about AQI levels, pollutants, how to interpret the data, or how to use specific features of the app.";
    }
    
    // Topic detection for broader categories
    if (containsKeywords(normalizedInput, ["pollutant", "pollution", "pm2.5", "pm10", "ozone", "no2", "so2", "co"])) {
      return "ClearCity tracks key air pollutants including particulate matter (PM2.5 and PM10), ozone (O₃), nitrogen dioxide (NO₂), sulfur dioxide (SO₂), and carbon monoxide (CO). These pollutants can cause various health issues and environmental damage. You can see detailed information about each pollutant's concentration when you select a location on the map or search for a city.";
    }
    
    if (containsKeywords(normalizedInput, ["health", "effect", "impact", "dangerous"])) {
      return "Air pollution can cause or worsen respiratory conditions like asthma and COPD, cardiovascular issues, and is linked to developmental problems. Children, elderly, and those with pre-existing conditions are most vulnerable. ClearCity helps you monitor air quality so you can take appropriate precautions when levels are harmful.";
    }
    
    if (containsKeywords(normalizedInput, ["protect", "safety", "safe", "precaution", "mask"])) {
      return "To protect yourself from air pollution: check ClearCity daily for air quality forecasts, limit outdoor activities during high pollution, use air purifiers indoors, keep windows closed during poor air quality events, and consider wearing appropriate masks when necessary. The app's color-coded system helps you easily determine when additional precautions are needed.";
    }
    
    // Default response for unrecognized queries related to air quality
    if (containsKeywords(normalizedInput, projectKeywords.airQuality)) {
      return "I understand you're asking about air quality. ClearCity provides comprehensive air quality data including AQI values, pollutant concentrations, historical trends, and forecasts. Could you specify what aspect of air quality information you're looking for?";
    }
    
    // Very general default response
    return "I'm not sure I understand your question about ClearCity or air quality. I can help with questions about air quality data, pollutants, health effects, using the application features, or interpreting AQI values. Could you rephrase your question?";
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
    };
    setMessages([...messages, userMessage]);
    
    // Generate and add bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: generateResponse(input),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 500);
    
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Card className="fixed bottom-20 right-6 w-80 md:w-96 h-[500px] z-50 shadow-lg flex flex-col">
      <div className="p-3 bg-primary text-white flex justify-between items-center rounded-t-lg">
        <h3 className="font-medium">ClearCity Assistant</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          className="flex-grow"
        />
        <Button onClick={handleSend}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-90"><path d="m6 12 6-9 6 9"/><path d="m6 12 6 9 6-9"/></svg>
        </Button>
      </div>
    </Card>
  );
};

export default Chatbot;
