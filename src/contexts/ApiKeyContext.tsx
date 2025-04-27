
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeyValid: boolean;
  validateKey: (key: string) => Promise<boolean>;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKey] = useState<string>(() => {
    // Try to load from localStorage on initialization
    const savedKey = localStorage.getItem("openweathermap_api_key");
    return savedKey || "";
  });
  
  const [isKeyValid, setIsKeyValid] = useState<boolean>(() => {
    return !!localStorage.getItem("openweathermap_api_key");
  });

  const validateKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=40.7128&lon=-74.0060&appid=${key}`
      );
      
      const isValid = response.ok;
      
      if (isValid) {
        localStorage.setItem("openweathermap_api_key", key);
        setApiKey(key);
        setIsKeyValid(true);
        toast.success("API key validated and saved!");
      } else {
        toast.error("Invalid API key. Please try again.");
        setIsKeyValid(false);
      }
      
      return isValid;
    } catch (error) {
      console.error("Error validating API key:", error);
      toast.error("Error validating API key. Please check your connection.");
      setIsKeyValid(false);
      return false;
    }
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, isKeyValid, validateKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
};
