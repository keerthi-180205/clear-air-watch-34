
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
  time: ["time", "history", "historical", "past", "previous", "forecast", "future", "prediction", "trend", "trends", "24 hours"]
};

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
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

  // Improved response generation with better context understanding
  const generateResponse = (userInput: string): string => {
    const normalizedInput = userInput.toLowerCase();
    
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
