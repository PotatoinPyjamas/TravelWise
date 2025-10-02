import axios from 'axios';

// Replace with your WeatherAPI key
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || '3ddab1c6c16f43068b5150956250210';
const BASE_URL = 'https://api.weatherapi.com/v1';

export interface WeatherData {
  temperature: string;
  description: string;
  icon: string;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: string;
  location: string;
  localTime: string;
  travelTips: string[];
  conditionCode: number;
}

export const getWeatherByCity = async (city: string, date?: string): Promise<WeatherData> => {
  try {
    // If date is provided and it's in the future (up to 3 days), use forecast
    const today = new Date();
    const targetDate = date ? new Date(date) : today;
    const daysDiff = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let response;
    
    if (daysDiff > 0 && daysDiff <= 3) {
      // Use forecast for future dates (up to 3 days)
      response = await axios.get(`${BASE_URL}/forecast.json`, {
        params: {
          key: API_KEY,
          q: city,
          days: daysDiff + 1,
          aqi: 'no'
        }
      });
      
      const forecastDay = response.data.forecast.forecastday.find((day: any) => 
        day.date === targetDate.toISOString().split('T')[0]
      );
      
      if (forecastDay) {
        const data = response.data;
        const dayData = forecastDay.day;
        const location = data.location;
        
        return {
          temperature: `${Math.round(dayData.avgtemp_c)}°C`,
          description: getWeatherDescription(dayData.condition.text),
          icon: getWeatherIcon(dayData.condition.code),
          condition: dayData.condition.text.toLowerCase(),
          humidity: dayData.avghumidity,
          windSpeed: dayData.maxwind_kph,
          feelsLike: `${Math.round(dayData.avgtemp_c)}°C`,
          location: `${location.name}, ${location.country}`,
          localTime: forecastDay.date,
          travelTips: getTravelTips(dayData.condition.code, dayData.avgtemp_c, dayData.avghumidity, dayData.maxwind_kph),
          conditionCode: dayData.condition.code
        };
      }
    }
    
    // Use current weather for today or if forecast fails
    response = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: API_KEY,
        q: city,
        aqi: 'no'
      }
    });

    const data = response.data;
    const current = data.current;
    const location = data.location;
    
    return {
      temperature: `${Math.round(current.temp_c)}°C`,
      description: getWeatherDescription(current.condition.text),
      icon: getWeatherIcon(current.condition.code),
      condition: current.condition.text.toLowerCase(),
      humidity: current.humidity,
      windSpeed: current.wind_kph,
      feelsLike: `${Math.round(current.feelslike_c)}°C`,
      location: `${location.name}, ${location.country}`,
      localTime: location.localtime,
      travelTips: getTravelTips(current.condition.code, current.temp_c, current.humidity, current.wind_kph),
      conditionCode: current.condition.code
    };
  } catch (error) {
    console.error('WeatherAPI error:', error);
    // Return fallback data
    return {
      temperature: '25°C',
      description: 'Weather data temporarily unavailable',
      icon: 'sun',
      condition: 'clear',
      humidity: 60,
      windSpeed: 5,
      feelsLike: '27°C',
      location: city,
      localTime: new Date().toLocaleString(),
      travelTips: ['🌤️ Check the weather again before heading out'],
      conditionCode: 1000
    };
  }
};

const getWeatherDescription = (description: string): string => {
  const descriptions: { [key: string]: string } = {
    'sunny': 'Perfect weather for sightseeing!',
    'clear': 'Perfect weather for sightseeing!',
    'partly cloudy': 'Nice and pleasant – great for walking around!',
    'cloudy': 'Overcast but pleasant for outdoor activities!',
    'overcast': 'Overcast but comfortable for exploring!',
    'light rain': 'Light showers expected – carry an umbrella!',
    'moderate rain': 'Rainy weather – perfect for indoor attractions!',
    'heavy rain': 'Heavy rain – stay indoors and enjoy local cuisine!',
    'thunderstorm': 'Stormy weather – stay safe indoors!',
    'snow': 'Snowy conditions – dress warmly!',
    'mist': 'Misty weather – reduced visibility!',
    'fog': 'Foggy conditions – be careful while traveling!'
  };
  
  return descriptions[description.toLowerCase()] || `${description.charAt(0).toUpperCase() + description.slice(1)} weather expected!`;
};

const getWeatherIcon = (conditionCode: number): string => {
  // WeatherAPI condition codes to our icon mapping
  // Reference: https://www.weatherapi.com/docs/weather_conditions.json
  if (conditionCode === 1000) return 'sun'; // Sunny/Clear
  if ([1003, 1006, 1009].includes(conditionCode)) return 'cloud'; // Partly cloudy, Cloudy, Overcast
  if ([1030, 1135, 1147].includes(conditionCode)) return 'cloud'; // Mist, Fog
  if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(conditionCode)) {
    return 'cloud-rain'; // Various rain conditions
  }
  if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) return 'cloud-rain'; // Thunderstorm
  if ([1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(conditionCode)) {
    return 'cloud-rain'; // Snow and sleet conditions
  }
  
  return 'sun'; // Default fallback
};

const getTravelTips = (conditionCode: number, temperature: number, humidity: number, windSpeed: number): string[] => {
  const tips: string[] = [];
  
  // Rain conditions
  if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(conditionCode)) {
    tips.push("🌧️ Don't forget to carry an umbrella!");
    tips.push("☔ Pack a waterproof jacket or raincoat");
    tips.push("👟 Wear waterproof shoes or boots");
    tips.push("🏢 Consider indoor attractions and activities");
  }
  
  // Heavy rain or thunderstorm
  if ([1195, 1198, 1201, 1243, 1246, 1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
    tips.push("⛈️ Heavy rain expected - stay indoors when possible");
    tips.push("🏨 Perfect weather for exploring museums and shopping malls");
  }
  
  // Snow conditions
  if ([1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(conditionCode)) {
    tips.push("❄️ Pack warm winter clothes and gloves");
    tips.push("🧥 Layer up - it's going to be cold!");
    tips.push("👢 Wear non-slip shoes for icy conditions");
  }
  
  // Temperature-based tips
  if (temperature > 30) {
    tips.push("🌡️ It's hot! Stay hydrated and drink plenty of water");
    tips.push("🧴 Don't forget sunscreen and a hat");
    tips.push("👕 Wear light, breathable clothing");
  } else if (temperature < 10) {
    tips.push("🧥 Bundle up - it's quite cold!");
    tips.push("🧤 Pack warm accessories like gloves and scarves");
  } else if (temperature < 20) {
    tips.push("🧥 Pack a light jacket or sweater");
  }
  
  // Humidity-based tips
  if (humidity > 80) {
    tips.push("💧 High humidity - dress in breathable fabrics");
    tips.push("🌬️ Consider air-conditioned venues during peak hours");
  }
  
  // Wind-based tips
  if (windSpeed > 25) {
    tips.push("💨 It's quite windy - secure loose items");
    tips.push("🧢 Hold onto your hat!");
  }
  
  // Clear/sunny conditions
  if (conditionCode === 1000) {
    tips.push("☀️ Perfect weather for outdoor sightseeing!");
    tips.push("📸 Great conditions for photography");
    tips.push("🌅 Ideal for walking tours and outdoor activities");
  }
  
  // Cloudy but pleasant
  if ([1003, 1006, 1009].includes(conditionCode) && temperature >= 15 && temperature <= 25) {
    tips.push("☁️ Pleasant weather - perfect for exploring!");
    tips.push("🚶‍♂️ Great conditions for walking around the city");
  }
  
  // Fog/mist conditions
  if ([1030, 1135, 1147].includes(conditionCode)) {
    tips.push("🌫️ Reduced visibility due to fog - drive carefully");
    tips.push("🚗 Allow extra time for transportation");
  }
  
  // Default tips if no specific conditions
  if (tips.length === 0) {
    tips.push("🌤️ Check the weather again before heading out");
    tips.push("📱 Keep an eye on weather updates during your trip");
  }
  
  // Ensure we always have exactly 4 tips
  const finalTips = tips.slice(0, 4);
  while (finalTips.length < 4) {
    finalTips.push('🌤️ Enjoy your trip and stay safe!');
  }
  return finalTips;
};

// Get weather for multiple cities (useful for comparison)
export const getWeatherForMultipleCities = async (cities: string[]): Promise<WeatherData[]> => {
  try {
    const weatherPromises = cities.map(city => getWeatherByCity(city));
    return await Promise.all(weatherPromises);
  } catch (error) {
    console.error('Multiple cities weather error:', error);
    return cities.map((city) => ({
      temperature: '25°C',
      description: 'Weather data temporarily unavailable',
      icon: 'sun',
      condition: 'clear',
      humidity: 60,
      windSpeed: 5,
      feelsLike: '27°C',
      location: city,
      localTime: new Date().toLocaleString(),
      travelTips: ['🌤️ Check the weather again before heading out'],
      conditionCode: 1000
    }));
  }
};

// Get forecast for planning (3-day forecast)
export const getWeatherForecast = async (city: string, days: number = 3): Promise<WeatherData[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: city,
        days: Math.min(days, 10), // WeatherAPI supports up to 10 days
        aqi: 'no'
      }
    });

    const forecastDays = response.data.forecast.forecastday;
    
    return forecastDays.map((day: any) => ({
      temperature: `${Math.round(day.day.avgtemp_c)}°C`,
      description: getWeatherDescription(day.day.condition.text),
      icon: getWeatherIcon(day.day.condition.code),
      condition: day.day.condition.text.toLowerCase(),
      humidity: day.day.avghumidity,
      windSpeed: day.day.maxwind_kph,
      feelsLike: `${Math.round(day.day.avgtemp_c)}°C`,
      location: `${response.data.location.name}, ${response.data.location.country}`,
      localTime: day.date,
      travelTips: getTravelTips(day.day.condition.code, day.day.avgtemp_c, day.day.avghumidity, day.day.maxwind_kph),
      conditionCode: day.day.condition.code
    }));
  } catch (error) {
    console.error('Weather forecast error:', error);
    return Array(days).fill(null).map(() => ({
      temperature: '25°C',
      description: 'Forecast data temporarily unavailable',
      icon: 'sun',
      condition: 'clear',
      humidity: 60,
      windSpeed: 5,
      feelsLike: '27°C',
      location: city,
      localTime: new Date().toLocaleDateString(),
      travelTips: ['🌤️ Check the weather again before heading out'],
      conditionCode: 1000
    }));
  }
};
