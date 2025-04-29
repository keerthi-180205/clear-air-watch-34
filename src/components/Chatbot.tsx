
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

// FAQ data for the chatbot
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
  }
];

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      type: "bot",
      text: "Hello! I'm your ClearCity assistant. How can I help you with air quality information today?",
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

  const generateResponse = (userInput: string): string => {
    const normalizedInput = userInput.toLowerCase();
    
    // Check for AQI level questions
    const aqiMatch = normalizedInput.match(/what (is|does) (aqi|air quality index) (level )?(of )?(\d+)( mean)?/);
    if (aqiMatch) {
      const level = parseInt(aqiMatch[5]);
      if (level >= 1 && level <= 5) {
        const aqiInfo = AQI_LEVELS[level - 1];
        return `AQI ${level} is rated as "${aqiInfo.level}". ${aqiInfo.description} ${aqiInfo.healthImplications}`;
      }
    }
    
    // Check for FAQ matches
    for (const faq of faqData) {
      if (normalizedInput.includes(faq.question.toLowerCase())) {
        return faq.answer;
      }
    }
    
    // Check for common queries
    if (normalizedInput.includes("hello") || normalizedInput.includes("hi")) {
      return "Hello! How can I help you with air quality information today?";
    }
    
    if (normalizedInput.includes("thank")) {
      return "You're welcome! If you have any more questions about air quality, feel free to ask.";
    }
    
    if (normalizedInput.includes("bye")) {
      return "Goodbye! Stay healthy and breathe clean air!";
    }
    
    if (normalizedInput.includes("how are you")) {
      return "I'm just a chatbot, but I'm functioning well and ready to help you with air quality information!";
    }
    
    if (normalizedInput.includes("help")) {
      return "I can answer questions about air quality, pollution, health effects, and provide explanations about the AQI (Air Quality Index). What would you like to know?";
    }
    
    // Topic detection for broader categories
    if (normalizedInput.includes("pollutant") || normalizedInput.includes("pollution")) {
      return "Common air pollutants include particulate matter (PM2.5 and PM10), ozone (O₃), nitrogen dioxide (NO₂), sulfur dioxide (SO₂), and carbon monoxide (CO). These can cause various health issues and environmental damage.";
    }
    
    if (normalizedInput.includes("health") || normalizedInput.includes("effect")) {
      return "Air pollution can cause or worsen respiratory conditions like asthma and COPD, cardiovascular issues, and is linked to developmental problems. Children, elderly, and those with pre-existing conditions are most vulnerable.";
    }
    
    if (normalizedInput.includes("protect") || normalizedInput.includes("safety") || normalizedInput.includes("safe")) {
      return "To protect yourself from air pollution: check daily air quality forecasts, limit outdoor activities during high pollution, use air purifiers indoors, keep windows closed during poor air quality events, and consider wearing appropriate masks when necessary.";
    }
    
    // Default response for unrecognized queries
    return "I'm not sure about that specific information. I can help with questions about air quality, pollution levels, health effects, or protective measures. Could you rephrase your question?";
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
