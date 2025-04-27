
import { AirQualityData } from "@/types/airQuality";

const OPENWEATHERMAP_API_KEY = ""; // This will be filled in by the user
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const getCurrentAirQuality = async (
  lat: number,
  lon: number,
  apiKey: string
): Promise<AirQualityData | null> => {
  try {
    if (!apiKey) return null;
    const response = await fetch(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data as AirQualityData;
  } catch (error) {
    console.error("Failed to fetch air quality data:", error);
    return null;
  }
};

export const getForecastAirQuality = async (
  lat: number,
  lon: number,
  apiKey: string
): Promise<AirQualityData | null> => {
  try {
    if (!apiKey) return null;
    const response = await fetch(
      `${BASE_URL}/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data as AirQualityData;
  } catch (error) {
    console.error("Failed to fetch air quality forecast:", error);
    return null;
  }
};

export const getHistoricalAirQuality = async (
  lat: number,
  lon: number,
  start: number,
  end: number,
  apiKey: string
): Promise<AirQualityData | null> => {
  try {
    if (!apiKey) return null;
    const response = await fetch(
      `${BASE_URL}/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data as AirQualityData;
  } catch (error) {
    console.error("Failed to fetch historical air quality:", error);
    return null;
  }
};
