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

    // Create comprehensive city-specific prompt with detailed itinerary focus
    const prompt = `You are a local travel expert and itinerary planner for ${searchData.to}. Create a detailed, travel-friendly ${tripDays}-day itinerary with specific recommendations.

TRIP DETAILS:
- Destination: ${searchData.to}, India
- Duration: ${tripDays} days (create exactly ${itineraryDays} days of itinerary)
- Weather: ${weather?.temperature || 'N/A'}, ${weather?.condition || 'N/A'}
- Travelers: ${searchData.passengers} people
- From: ${searchData.from}

REQUIREMENTS:
1. Include REAL restaurants, attractions, and activities in ${searchData.to}
2. Add specific local transport options (Metro/Bus/Auto/Taxi) for each activity
3. Include breakfast, lunch, dinner recommendations with actual restaurant names
4. Balance sightseeing, cultural experiences, food, and activities
5. Consider travel time between locations
6. Add practical tips for each day

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
    {"name": "Metro System", "description": "Fast rail network with stations and lines", "price": "₹10-60", "category": "metro", "rating": 4.5},
    {"name": "Local Bus", "description": "City bus network covering all areas", "price": "₹5-30", "category": "bus", "rating": 4.0},
    {"name": "Auto Rickshaw", "description": "Three-wheeler for short distances", "price": "₹30-150", "category": "auto", "rating": 4.1},
    {"name": "Ola/Uber", "description": "App-based cab service", "price": "₹50-400", "category": "cab", "rating": 4.3}
  ],
  "luxuryRecommendations": [
    {"name": "Luxury Option", "description": "Description", "price": "₹10,000+", "rating": 4.9}
  ],
  "itineraries": [
    {
      "type": "popular",
      "title": "${itineraryDays}-Day Popular ${searchData.to} Experience", 
      "description": "Comprehensive itinerary covering must-see attractions, local cuisine, and cultural experiences in ${searchData.to}",
      "days": [
        {
          "day": 1, 
          "title": "Day 1: Arrival & City Highlights", 
          "activities": [
            {"time": "8:00 AM", "title": "Breakfast at [Real Restaurant Name]", "description": "Start with authentic local breakfast", "location": "Specific area in ${searchData.to}", "duration": "1 hour", "transport": "Metro/Bus/Auto from hotel", "cost": "₹200-300", "type": "food"},
            {"time": "10:00 AM", "title": "[Famous Landmark Name]", "description": "Visit iconic attraction with historical significance", "location": "${searchData.to}", "duration": "2 hours", "transport": "Metro Line X to Y Station", "cost": "₹50-100", "type": "sightseeing"},
            {"time": "1:00 PM", "title": "Lunch at [Real Restaurant Name]", "description": "Try signature local dishes", "location": "Near landmark", "duration": "1 hour", "transport": "Walking distance", "cost": "₹400-600", "type": "food"},
            {"time": "3:00 PM", "title": "[Cultural Activity/Museum]", "description": "Immerse in local culture and history", "location": "${searchData.to}", "duration": "2 hours", "transport": "Auto/Taxi", "cost": "₹100-200", "type": "activity"},
            {"time": "6:00 PM", "title": "[Evening Spot/Market]", "description": "Shopping and local atmosphere", "location": "${searchData.to}", "duration": "2 hours", "transport": "Bus/Metro", "cost": "₹30-50", "type": "activity"},
            {"time": "8:00 PM", "title": "Dinner at [Real Restaurant Name]", "description": "End day with local specialty cuisine", "location": "${searchData.to}", "duration": "1.5 hours", "transport": "Auto/Taxi", "cost": "₹600-1000", "type": "food"}
          ], 
          "tips": ["Book tickets online for popular attractions", "Carry cash for local transport", "Try the local breakfast specialty", "Evening markets are great for souvenirs"],
          "totalBudget": "₹1500-2500 per person",
          "transportTips": "Get a local transport card for easy metro/bus travel"
        }
      ]
    },
    {
      "type": "offbeat",
      "title": "${itineraryDays}-Day Hidden Gems of ${searchData.to}",
      "description": "Explore lesser-known treasures and authentic local experiences away from tourist crowds",
      "days": [
        {
          "day": 1,
          "title": "Day 1: Local Life & Hidden Spots",
          "activities": [
            {"time": "7:30 AM", "title": "Local Tea Stall/Breakfast Joint", "description": "Experience morning routine like a local", "location": "Local neighborhood", "duration": "45 minutes", "transport": "Auto/Walking", "cost": "₹50-100", "type": "food"},
            {"time": "9:00 AM", "title": "[Hidden Local Market/Area]", "description": "Authentic local market experience", "location": "Off-tourist-path area", "duration": "2 hours", "transport": "Local bus/Auto", "cost": "₹20-40", "type": "activity"},
            {"time": "12:00 PM", "title": "[Local Family Restaurant]", "description": "Home-style cooking at local favorite", "location": "Residential area", "duration": "1 hour", "transport": "Walking/Auto", "cost": "₹200-350", "type": "food"},
            {"time": "2:00 PM", "title": "[Lesser-known Attraction]", "description": "Hidden gem with local significance", "location": "${searchData.to}", "duration": "2 hours", "transport": "Local transport", "cost": "₹50-150", "type": "sightseeing"},
            {"time": "5:00 PM", "title": "[Local Activity/Craft Center]", "description": "Learn about local crafts or traditions", "location": "${searchData.to}", "duration": "1.5 hours", "transport": "Bus/Metro", "cost": "₹100-300", "type": "activity"},
            {"time": "7:30 PM", "title": "[Street Food Area]", "description": "Evening street food adventure", "location": "Local street food hub", "duration": "1.5 hours", "transport": "Auto/Walking", "cost": "₹150-250", "type": "food"}
          ],
          "tips": ["Learn basic local language phrases", "Ask locals for recommendations", "Bargain at local markets", "Try street food from busy stalls"],
          "totalBudget": "₹800-1500 per person",
          "transportTips": "Use local buses and shared autos for authentic experience"
        }
      ]
    }
  ]
}

IMPORTANT REQUIREMENTS:
1. Generate exactly ${itineraryDays} days for EACH itinerary (both popular and offbeat)
2. Each day should have 6 activities: breakfast, morning activity, lunch, afternoon activity, evening activity, dinner
3. Include specific transport options for ${searchData.to}:
   - Metro lines and stations (if available)
   - Bus routes and numbers
   - Auto-rickshaw/taxi estimates
   - Walking distances
4. Use REAL places in ${searchData.to}:
   - Actual restaurant names and signature dishes
   - Real attractions with proper names
   - Specific neighborhoods and markets
   - Local transport hubs and stations
5. Include costs for transport and activities
6. Add practical travel tips for each day
7. Weather-appropriate activities (current: ${weather?.condition || 'unknown'})

For ${searchData.to} specifically, research and include:
- Local metro/bus system details (exact names like "Delhi Metro", "Mumbai Local Trains")
- Available transport modes: Metro (if exists), City Buses, Auto Rickshaws, Ola/Uber
- Real transport pricing for ${searchData.to}
- Famous local breakfast spots
- Signature local dishes and where to find them
- Real attraction names and locations
- Popular local markets and shopping areas
- Evening entertainment spots
- Transport cards or passes available

TRANSPORT REQUIREMENTS:
- Only include transport modes that actually exist in ${searchData.to}
- Use real system names (e.g., "Delhi Metro", "BEST Buses", "Mumbai Local Trains")
- Provide accurate pricing ranges for ${searchData.to}
- Include ratings based on actual user experience

Return ONLY valid JSON, no additional text.
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
