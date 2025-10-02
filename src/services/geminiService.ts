import { GoogleGenerativeAI } from '@google/generative-ai';
import { SearchData, Recommendation, Itinerary, WeatherInfo } from '../types';

// Replace with your Gemini API key
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyDGCSllY8mtm8uiRxms_ldcJWaihMrWgAE';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface GeminiRecommendations {
  attractions: Recommendation[];
  restaurants: Recommendation[];
  hotels: Recommendation[];
  activities: Recommendation[];
  itineraries: Itinerary[];
  foodOptions: any[];
  travelOptions: any[];
  luxuryRecommendations: any[];
}

export const generatePersonalizedRecommendations = async (
  searchData: SearchData,
  weather?: WeatherInfo
): Promise<GeminiRecommendations> => {
  console.log('🚀 Starting Gemini API call for:', searchData.to);
  console.log('🔑 API Key available:', API_KEY ? 'Yes' : 'No');
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log('🤖 Model initialized successfully');
    
    // Calculate trip duration
    let tripDays = 3;
    if (searchData.returnDate && searchData.returnDate !== searchData.departureDate) {
      const departureDate = new Date(searchData.departureDate);
      const returnDate = new Date(searchData.returnDate);
      tripDays = Math.ceil((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    const itineraryDays = Math.max(1, Math.min(tripDays, 7));

    // Create simple, focused prompt
    const prompt = `You are a travel expert. Create specific recommendations for a ${tripDays}-day trip to ${searchData.to}.

Respond with ONLY valid JSON in this exact format:

{
  "attractions": [
    {"type": "attraction", "name": "Attraction Name", "description": "Description", "rating": 4.5}
  ],
  "restaurants": [
    {"type": "restaurant", "name": "Restaurant Name", "description": "Description", "rating": 4.6, "priceRange": "₹₹₹"}
  ],
  "hotels": [
    {"type": "hotel", "name": "Hotel Name", "description": "Description", "rating": 4.7, "priceRange": "₹₹₹₹"}
  ],
  "activities": [
    {"type": "activity", "name": "Activity Name", "description": "Description", "rating": 4.4}
  ],
  "foodOptions": [
    {"name": "Dish Name", "description": "Description", "price": "₹150", "rating": 4.5}
  ],
  "travelOptions": [
    {"name": "Transport", "description": "Description", "price": "₹50-100"}
  ],
  "luxuryRecommendations": [
    {"name": "Luxury Option", "description": "Description", "price": "₹10,000+", "rating": 4.9}
  ],
  "itineraries": [
    {
      "type": "popular",
      "title": "${itineraryDays}-Day ${searchData.to} Experience", 
      "description": "Highlights of ${searchData.to}",
      "days": [
        {"day": 1, "title": "Day 1: Explore", "activities": [{"time": "10:00 AM", "title": "Activity", "description": "Description", "location": "${searchData.to}", "duration": "2 hours"}], "tips": ["Tip 1"]}
      ]
    }
  ]
}

Make ${itineraryDays} days for each itinerary. Include specific ${searchData.to} recommendations. Return only valid JSON.
`;

    console.log('📤 Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    console.log('📥 Received result from Gemini');
    
    const response = await result.response;
    console.log('📄 Got response object');
    
    const text = response.text();
    console.log('📝 Response text length:', text?.length || 0);
    console.log('🤖 Gemini response preview:', text?.substring(0, 200) + '...');
    
    // Parse the JSON response
    let geminiData;
    try {
      // Clean the response text (remove any markdown formatting)
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      console.log('🧹 Cleaned text preview:', cleanText.substring(0, 200) + '...');
      
      geminiData = JSON.parse(cleanText);
      console.log('✅ Successfully parsed JSON');
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      console.error('❌ Raw text:', text);
      throw new Error('Failed to parse Gemini response as JSON');
    }
    
    return {
      attractions: geminiData.attractions || [],
      restaurants: geminiData.restaurants || [],
      hotels: geminiData.hotels || [],
      activities: geminiData.activities || [],
      itineraries: geminiData.itineraries || [
        {
          type: 'popular',
          title: `Explore ${searchData.to}`,
          description: `Discover ${searchData.to}`,
          days: [{ day: 1, title: 'Day 1: Explore', activities: [], tips: [] }]
        }
      ],
      foodOptions: geminiData.foodOptions || [],
      travelOptions: geminiData.travelOptions || [],
      luxuryRecommendations: geminiData.luxuryRecommendations || []
    };

  } catch (error) {
    console.error('❌ Gemini AI error:', error);
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    if (error instanceof Error && error.message.includes('API_KEY')) {
      console.error('🔑 API Key issue detected');
    }
    
    // Fallback to basic recommendations if Gemini fails
    return {
      attractions: [
        { type: 'attraction' as const, name: 'Popular Local Attraction', description: 'A must-visit spot in the area', rating: 4.2, category: 'cultural' }
      ],
      restaurants: [
        { type: 'restaurant' as const, name: 'Local Restaurant', description: 'Authentic local cuisine', rating: 4.3, priceRange: '₹₹', cuisine: 'Local' }
      ],
      hotels: [
        { type: 'hotel' as const, name: 'Comfortable Hotel', description: 'Good value accommodation', rating: 4.1, priceRange: '₹₹₹', amenities: ['WiFi', 'AC'] }
      ],
      activities: [
        { type: 'activity' as const, name: 'City Walking Tour', description: 'Explore the city on foot', rating: 4.0, duration: '3 hours', price: '₹800' }
      ],
      itineraries: [
        {
          type: 'popular',
          title: `Explore ${searchData.to}`,
          description: `Discover the highlights of ${searchData.to}`,
          days: [
            {
              day: 1,
              title: 'Day 1: City Exploration',
              activities: [
                { time: '10:00 AM', title: 'City Tour', description: 'Explore main attractions', location: searchData.to, duration: '4 hours', cost: '₹1000' }
              ],
              tips: ['Wear comfortable shoes', 'Bring water']
            }
          ]
        },
        {
          type: 'offbeat',
          title: `Hidden ${searchData.to}`,
          description: `Discover local secrets of ${searchData.to}`,
          days: [
            {
              day: 1,
              title: 'Day 1: Local Experience',
              activities: [
                { time: '9:00 AM', title: 'Local Market', description: 'Experience local life', location: searchData.to, duration: '2 hours', cost: '₹500' }
              ],
              tips: ['Learn basic local phrases', 'Try local food']
            }
          ]
        }
      ],
      foodOptions: [
        { name: 'Local Specialty', description: 'Must-try local dish', price: '₹200', type: 'local', rating: 4.2, mustTry: true }
      ],
      travelOptions: [
        { name: 'Local Transport', description: 'Best way to get around', price: '₹50-100', icon: 'car', bestFor: 'City travel' }
      ],
      luxuryRecommendations: [
        { type: 'hotel', name: 'Luxury Hotel', description: 'Premium accommodation', price: '₹15,000+', rating: 4.8, specialFeatures: ['Spa', 'Fine Dining'] }
      ]
    };
  }
};

export const generateWeatherBasedTips = async (weather: WeatherInfo, destination: string): Promise<string[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
Based on the current weather in ${destination}:
- Temperature: ${weather.temperature}
- Condition: ${weather.condition}
- Humidity: ${weather.humidity}%
- Wind Speed: ${weather.windSpeed} km/h

Generate 4-6 practical travel tips for someone visiting ${destination} today. 
Include specific advice about:
1. What to wear/bring
2. Activities that work well in this weather
3. Things to avoid
4. Local transportation considerations

Return as a JSON array of strings:
["tip 1", "tip 2", "tip 3", "tip 4"]

Each tip should start with an emoji and be practical and actionable.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini weather tips error:', error);
    return [
      '🌤️ Check weather updates regularly',
      '👟 Wear comfortable walking shoes',
      '💧 Stay hydrated throughout the day',
      '📱 Keep emergency contacts handy'
    ];
  }
};
