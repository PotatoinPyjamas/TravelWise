import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, ChevronDown, ChevronUp, MapPin, Utensils, Hotel, Calendar, Sun, Cloud, CloudRain, Car, Train, ExternalLink } from 'lucide-react';
import { SearchData, Recommendation, Itinerary, WeatherInfo } from '../types';
import { getWeatherByCity } from '../services/weatherService';
import { generatePersonalizedRecommendations, generateWeatherBasedTips } from '../services/geminiService';
import DetailedRecommendations from './DetailedRecommendations';

interface AIRecommendationsProps {
  searchData: SearchData;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ searchData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [travelOptions, setTravelOptions] = useState<any[]>([]);
  const [foodOptions, setFoodOptions] = useState<any[]>([]);
  const [showLuxury, setShowLuxury] = useState(false);
  const [luxuryRecommendations, setLuxuryRecommendations] = useState<any[]>([]);

  const generateRecommendations = useCallback(async () => {
    setLoading(true);
    
    console.log('🚀 Starting generateRecommendations with searchData:', searchData);
    console.log('📅 Departure:', searchData.departureDate);
    console.log('📅 Return:', searchData.returnDate);
    console.log('🎯 Trip type:', searchData.tripType);
    
    try {
      // Get live weather data for the destination on departure date
      console.log('🌤️ Fetching weather for:', searchData.to, 'on', searchData.departureDate);
      const liveWeather = await getWeatherByCity(searchData.to, searchData.departureDate);
      console.log('🌤️ Weather data received:', liveWeather);
      
      // Convert WeatherData to WeatherInfo format
      const weatherInfo: WeatherInfo = {
        condition: liveWeather.condition,
        temperature: liveWeather.temperature,
        description: liveWeather.description,
        icon: liveWeather.icon,
        humidity: liveWeather.humidity,
        windSpeed: liveWeather.windSpeed,
        feelsLike: liveWeather.feelsLike,
        location: liveWeather.location,
        localTime: liveWeather.localTime,
        travelTips: liveWeather.travelTips,
        conditionCode: liveWeather.conditionCode
      };

      // TEMPORARILY SKIP GEMINI - Use only mock data to test
      console.log('🚫 SKIPPING Gemini integration - using mock data only');
      
      // Just use weather info as-is
      const combinedWeatherInfo = {
        ...weatherInfo,
        travelTips: liveWeather.travelTips || []
      };
      
      // Generate mock data
    const mockRecommendations = generateMockRecommendations(searchData.to);
    const mockItineraries = generateMockItineraries(searchData.to, searchData.departureDate, searchData.returnDate);
      const mockTravelOptions = generateMockTravelOptions(searchData.to);
      const mockFoodOptions = generateMockFoodOptions(searchData.to);
      
      console.log('🔄 Mock itineraries generated:', mockItineraries.length);
      console.log('🔄 First itinerary days:', mockItineraries[0]?.days?.length || 0);
      console.log('🔄 Second itinerary days:', mockItineraries[1]?.days?.length || 0);
      
      setRecommendations(mockRecommendations);
      setItineraries(mockItineraries);
      setWeather(combinedWeatherInfo);
      setTravelOptions(mockTravelOptions);
      setFoodOptions(mockFoodOptions);
      setLuxuryRecommendations([
        { type: 'hotel', name: 'Luxury Hotel', description: 'Premium accommodation', price: '₹15,000+', rating: 4.8, specialFeatures: ['Spa', 'Fine Dining'] }
      ]);
      
    } catch (error) {
      console.error('❌ Error fetching recommendations:', error);
      // Fallback to mock data if APIs fail
      console.log('🔄 Using fallback mock data');
      
    const mockWeather = generateMockWeather(searchData.to);
      const mockRecommendations = generateMockRecommendations(searchData.to);
      console.log('🔄 Calling generateMockItineraries with:', {
        destination: searchData.to,
        departure: searchData.departureDate,
        returnDate: searchData.returnDate
      });
      
      const mockItineraries = generateMockItineraries(searchData.to, searchData.departureDate, searchData.returnDate);
    const mockTravelOptions = generateMockTravelOptions(searchData.to);
    const mockFoodOptions = generateMockFoodOptions(searchData.to);
      
      console.log('🔄 Mock itineraries generated:', mockItineraries.length);
      console.log('🔄 First itinerary days:', mockItineraries[0]?.days?.length || 0);
      console.log('🔄 Second itinerary days:', mockItineraries[1]?.days?.length || 0);
    
    setRecommendations(mockRecommendations);
    setItineraries(mockItineraries);
    setWeather(mockWeather);
    setTravelOptions(mockTravelOptions);
    setFoodOptions(mockFoodOptions);
      setLuxuryRecommendations([
        { type: 'hotel', name: 'Luxury Hotel', description: 'Premium accommodation', price: '₹15,000+', rating: 4.8, specialFeatures: ['Spa', 'Fine Dining'] }
      ]);
    }
    
    setLoading(false);
  }, [searchData]);

  useEffect(() => {
    if (searchData.to) {
      generateRecommendations();
    }
  }, [searchData, generateRecommendations]);

  const generateMockRecommendations = (destination: string): Recommendation[] => {
    const destinations: { [key: string]: Recommendation[] } = {
      'Goa': [
        { type: 'attraction' as const, name: 'Baga Beach', description: 'Famous for water sports and nightlife', rating: 4.5, category: 'beach' },
        { type: 'restaurant' as const, name: 'Thalassa', description: 'Greek cuisine with stunning cliff views', rating: 4.7, priceRange: '₹₹₹', cuisine: 'Greek' },
        { type: 'hotel' as const, name: 'Taj Exotica', description: 'Luxury beachfront resort', rating: 4.8, priceRange: '₹₹₹₹', amenities: ['Beach', 'Spa', 'Pool'] },
        { type: 'activity' as const, name: 'Spice Plantation Tour', description: 'Explore organic spice farms', rating: 4.3, duration: '4 hours', price: '₹1500' }
      ],
      'Mumbai': [
        { type: 'attraction' as const, name: 'Gateway of India', description: 'Iconic monument overlooking the harbor', rating: 4.4, category: 'historical' },
        { type: 'restaurant' as const, name: 'Trishna', description: 'Contemporary Indian seafood', rating: 4.6, priceRange: '₹₹₹', cuisine: 'Seafood' },
        { type: 'hotel' as const, name: 'The Taj Mahal Palace', description: 'Historic luxury hotel', rating: 4.7, priceRange: '₹₹₹₹', amenities: ['Heritage', 'Spa', 'Pool'] },
        { type: 'activity' as const, name: 'Dharavi Slum Tour', description: 'Eye-opening cultural experience', rating: 4.2, duration: '3 hours', price: '₹1200' }
      ],
      'Delhi': [
        { type: 'attraction' as const, name: 'Red Fort', description: 'Mughal architectural masterpiece', rating: 4.3, category: 'historical' },
        { type: 'restaurant' as const, name: 'Indian Accent', description: 'Modern Indian fine dining', rating: 4.8, priceRange: '₹₹₹₹', cuisine: 'Modern Indian' },
        { type: 'hotel' as const, name: 'The Imperial', description: 'Colonial-era luxury hotel', rating: 4.6, priceRange: '₹₹₹₹', amenities: ['Heritage', 'Spa', 'Business Center'] },
        { type: 'activity' as const, name: 'Old Delhi Food Walk', description: 'Street food adventure', rating: 4.5, duration: '3 hours', price: '₹800' }
      ]
    };

    return destinations[destination] || [
      { type: 'attraction' as const, name: 'Local Heritage Site', description: 'Explore the rich history and culture', rating: 4.2, category: 'cultural' },
      { type: 'restaurant' as const, name: 'Local Cuisine Restaurant', description: 'Authentic regional flavors', rating: 4.4, priceRange: '₹₹', cuisine: 'Local' },
      { type: 'hotel' as const, name: 'Boutique Hotel', description: 'Comfortable stay with local charm', rating: 4.3, priceRange: '₹₹₹', amenities: ['WiFi', 'AC'] },
      { type: 'activity' as const, name: `${destination} City Tour`, description: 'Explore the city highlights', rating: 4.0, duration: '4 hours', price: '₹1000' }
    ];
  };

  const generateMockItineraries = (destination: string, departure: string, returnDate?: string): Itinerary[] => {
    console.log(`🔍 generateMockItineraries called with:`, {
      destination,
      departure,
      returnDate,
      returnDateType: typeof returnDate,
      isReturnDateEmpty: !returnDate,
      isReturnDateSameAsDeparture: returnDate === departure
    });
    
    // Calculate trip duration
    let tripDays;
    if (returnDate && returnDate !== departure && returnDate.trim() !== '') {
      // Calculate days between departure and return
      const departureDate = new Date(departure);
      const returnDateObj = new Date(returnDate);
      
      console.log(`📅 Date objects:`, {
        departureDate: departureDate.toISOString(),
        returnDateObj: returnDateObj.toISOString(),
        timeDiff: returnDateObj.getTime() - departureDate.getTime()
      });
      
      tripDays = Math.ceil((returnDateObj.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));
      console.log(`📊 Calculated trip days from dates: ${tripDays}`);
    } else {
      // For one-way trips, default to 3 days
      tripDays = 3;
      console.log(`📊 Using default 3 days for one-way trip`);
    }

    // Ensure minimum 1 day, maximum 7 days for itinerary
    const itineraryDays = Math.max(1, Math.min(tripDays, 7));
    
    console.log(`🗓️ Final calculation: Trip duration: ${tripDays} days, Itinerary will be: ${itineraryDays} days`);

    const popularDays = generatePopularItinerary(destination, itineraryDays);
    const offbeatDays = generateOffbeatItinerary(destination, itineraryDays);
    
    console.log(`🗓️ Generated popular itinerary days:`, popularDays.length);
    console.log(`🗓️ Generated offbeat itinerary days:`, offbeatDays.length);

    return [
      {
        type: 'popular',
        title: `${itineraryDays}-Day Popular ${destination} Experience`,
        description: `Discover the must-see attractions and famous spots that make ${destination} special over ${itineraryDays} ${itineraryDays === 1 ? 'day' : 'days'}.`,
        days: popularDays
      },
      {
        type: 'offbeat',
        title: `${itineraryDays}-Day Hidden Gems of ${destination}`,
        description: `Explore the lesser-known treasures and local secrets of ${destination} over ${itineraryDays} ${itineraryDays === 1 ? 'day' : 'days'}.`,
        days: offbeatDays
      }
    ];
  };

  const generatePopularItinerary = (destination: string, days: number) => {
    console.log(`🏗️ Generating popular itinerary for ${destination}, ${days} days`);
    console.log(`🏗️ Days parameter type:`, typeof days, 'value:', days);
    
    const dayTemplates = [
      {
        title: `Arrival & City Center`,
        activities: [
          { time: '10:00 AM', title: 'Hotel Check-in & Freshen Up', description: 'Get settled and refreshed after your journey', location: destination, duration: '1 hour' },
          { time: '12:00 PM', title: 'Welcome Lunch', description: 'Try local cuisine at a popular restaurant', location: destination, duration: '1.5 hours' },
          { time: '2:30 PM', title: 'City Center Walk', description: 'Explore the main attractions and get oriented', location: destination, duration: '3 hours' },
          { time: '6:00 PM', title: 'Sunset Viewing', description: 'Find the best sunset spot in the city', location: destination, duration: '1 hour' }
        ],
        tips: ['Keep your luggage light for easy check-in', 'Download offline maps', 'Stay hydrated']
      },
      {
        title: `Must-See Attractions`,
        activities: [
          { time: '9:00 AM', title: 'Famous Landmark Visit', description: 'Visit the most iconic attraction early to avoid crowds', location: destination, duration: '2.5 hours' },
          { time: '12:30 PM', title: 'Local Market Experience', description: 'Shop for souvenirs and try street food', location: destination, duration: '2 hours' },
          { time: '3:00 PM', title: 'Cultural Site', description: 'Explore museums or historical sites', location: destination, duration: '2 hours' },
          { time: '6:30 PM', title: 'Traditional Dinner', description: 'Experience authentic local dining', location: destination, duration: '1.5 hours' }
        ],
        tips: ['Book attraction tickets online', 'Carry cash for street vendors', 'Respect local customs']
      },
      {
        title: `Nature & Adventure`,
        activities: [
          { time: '8:00 AM', title: 'Outdoor Adventure', description: 'Hiking, beach, or nature park visit', location: destination, duration: '4 hours' },
          { time: '1:00 PM', title: 'Scenic Lunch', description: 'Lunch with a view at a scenic location', location: destination, duration: '1 hour' },
          { time: '3:00 PM', title: 'Relaxation Time', description: 'Spa, beach time, or leisurely stroll', location: destination, duration: '2 hours' },
          { time: '6:00 PM', title: 'Local Entertainment', description: 'Live music, dance show, or local performance', location: destination, duration: '2 hours' }
        ],
        tips: ['Wear comfortable shoes', 'Bring sun protection', 'Check weather conditions']
      },
      {
        title: `Local Life & Culture`,
        activities: [
          { time: '9:30 AM', title: 'Neighborhood Exploration', description: 'Walk through local residential areas', location: destination, duration: '2 hours' },
          { time: '12:00 PM', title: 'Cooking Class', description: 'Learn to make local dishes', location: destination, duration: '3 hours' },
          { time: '4:00 PM', title: 'Art & Craft Workshop', description: 'Try local handicrafts or art forms', location: destination, duration: '2 hours' },
          { time: '7:00 PM', title: 'Night Market', description: 'Experience the evening food and shopping scene', location: destination, duration: '2 hours' }
        ],
        tips: ['Learn basic local phrases', 'Bring business cards to exchange', 'Try something new']
      },
      {
        title: `Adventure & Sports`,
        activities: [
          { time: '7:00 AM', title: 'Adventure Activity', description: 'Water sports, trekking, or extreme sports', location: destination, duration: '4 hours' },
          { time: '12:00 PM', title: 'Recovery Lunch', description: 'Hearty meal to refuel after activities', location: destination, duration: '1 hour' },
          { time: '2:30 PM', title: 'Gentle Sightseeing', description: 'Relaxed exploration of nearby attractions', location: destination, duration: '2.5 hours' },
          { time: '6:00 PM', title: 'Celebration Dinner', description: 'Treat yourself to a special meal', location: destination, duration: '2 hours' }
        ],
        tips: ['Book adventure activities in advance', 'Check safety requirements', 'Bring appropriate gear']
      },
      {
        title: `Shopping & Relaxation`,
        activities: [
          { time: '10:00 AM', title: 'Shopping District', description: 'Explore local markets and boutiques', location: destination, duration: '3 hours' },
          { time: '1:30 PM', title: 'Leisurely Lunch', description: 'Relaxed meal at a recommended restaurant', location: destination, duration: '1.5 hours' },
          { time: '3:30 PM', title: 'Spa or Wellness', description: 'Pamper yourself with local treatments', location: destination, duration: '2 hours' },
          { time: '6:30 PM', title: 'Rooftop Drinks', description: 'Enjoy views with evening beverages', location: destination, duration: '1.5 hours' }
        ],
        tips: ['Negotiate prices in markets', 'Keep receipts for tax refunds', 'Pack light for shopping']
      },
      {
        title: `Final Day & Departure`,
      activities: [
          { time: '9:00 AM', title: 'Last-minute Sightseeing', description: 'Visit any missed attractions nearby', location: destination, duration: '2 hours' },
          { time: '11:30 AM', title: 'Souvenir Shopping', description: 'Final shopping for gifts and memories', location: destination, duration: '1.5 hours' },
          { time: '1:30 PM', title: 'Farewell Meal', description: 'Final taste of local cuisine', location: destination, duration: '1 hour' },
          { time: '3:00 PM', title: 'Check-out & Departure', description: 'Head to airport or next destination', location: destination, duration: '1 hour' }
        ],
        tips: ['Check flight times', 'Pack souvenirs carefully', 'Exchange remaining local currency']
      }
    ];

    console.log(`🏗️ About to create Array.from with length:`, days);
    
    const result = Array.from({ length: days }, (_, i) => {
      console.log(`🏗️ Creating day ${i + 1}`);
      return {
        day: i + 1,
        title: `Day ${i + 1}: ${dayTemplates[i % dayTemplates.length].title}`,
        activities: dayTemplates[i % dayTemplates.length].activities,
        tips: dayTemplates[i % dayTemplates.length].tips
      };
    });
    
    console.log(`🏗️ Generated ${result.length} days for popular itinerary`);
    console.log(`🏗️ Result array:`, result);
    return result;
  };

  const generateOffbeatItinerary = (destination: string, days: number) => {
    console.log(`🏗️ Generating offbeat itinerary for ${destination}, ${days} days`);
    
    const offbeatPlans = [
      {
        title: `Local Neighborhoods`,
        activities: [
          { time: '9:00 AM', title: 'Residential Area Walk', description: 'Explore where locals actually live and work', location: destination, duration: '2 hours' },
          { time: '11:30 AM', title: 'Local Coffee Shop', description: 'Chat with locals at a neighborhood café', location: destination, duration: '1 hour' },
          { time: '1:00 PM', title: 'Home-style Restaurant', description: 'Eat where families go, not tourists', location: destination, duration: '1.5 hours' },
          { time: '3:30 PM', title: 'Community Center', description: 'Visit local community spaces or libraries', location: destination, duration: '2 hours' },
          { time: '6:30 PM', title: 'Local Pub/Bar', description: 'Evening drinks where residents unwind', location: destination, duration: '2 hours' }
        ],
        tips: ['Learn basic local greetings', 'Use public transport like locals', 'Ask for recommendations']
      },
      {
        title: `Hidden Cultural Gems`,
        activities: [
          { time: '8:30 AM', title: 'Sunrise Spot', description: 'Find the secret sunrise viewing location', location: destination, duration: '1.5 hours' },
          { time: '10:30 AM', title: 'Artisan Workshop', description: 'Visit local craftspeople at work', location: destination, duration: '2 hours' },
          { time: '1:00 PM', title: 'Family-run Eatery', description: 'Lunch at a multi-generation restaurant', location: destination, duration: '1 hour' },
          { time: '3:00 PM', title: 'Underground Art Scene', description: 'Galleries and studios off the beaten path', location: destination, duration: '2.5 hours' },
          { time: '6:30 PM', title: 'Local Music Venue', description: 'Live music where locals go', location: destination, duration: '2 hours' }
        ],
        tips: ['Bring cash for small vendors', 'Be respectful when photographing', 'Support local artists']
      },
      {
        title: `Nature\'s Secret Spots`,
        activities: [
          { time: '7:00 AM', title: 'Hidden Nature Trail', description: 'Hike paths known only to locals', location: destination, duration: '3 hours' },
          { time: '11:00 AM', title: 'Secret Swimming Spot', description: 'Natural pools or hidden beaches', location: destination, duration: '2 hours' },
          { time: '1:30 PM', title: 'Picnic with a View', description: 'Lunch at an undiscovered viewpoint', location: destination, duration: '1 hour' },
          { time: '3:00 PM', title: 'Local Farm Visit', description: 'Meet farmers and see local agriculture', location: destination, duration: '2 hours' },
          { time: '6:00 PM', title: 'Stargazing Spot', description: 'Best place for night sky viewing', location: destination, duration: '2 hours' }
        ],
        tips: ['Bring water and snacks', 'Wear proper hiking shoes', 'Respect natural environments']
      },
      {
        title: `Authentic Food Journey`,
        activities: [
          { time: '8:00 AM', title: 'Local Market Tour', description: 'Shop for ingredients with locals', location: destination, duration: '2 hours' },
          { time: '10:30 AM', title: 'Street Food Hunt', description: 'Find the best local street vendors', location: destination, duration: '1.5 hours' },
          { time: '12:30 PM', title: 'Cooking with Locals', description: 'Learn family recipes in someone\'s home', location: destination, duration: '3 hours' },
          { time: '4:00 PM', title: 'Tea/Coffee Ceremony', description: 'Traditional beverage preparation', location: destination, duration: '1 hour' },
          { time: '6:00 PM', title: 'Underground Restaurant', description: 'Hidden gems known only to food lovers', location: destination, duration: '2 hours' }
        ],
        tips: ['Try everything offered', 'Learn about ingredients', 'Bring appetite for adventure']
      },
      {
        title: `Local Festivals & Events`,
        activities: [
          { time: '9:00 AM', title: 'Community Event', description: 'Join local celebrations or markets', location: destination, duration: '2 hours' },
          { time: '11:30 AM', title: 'Traditional Games', description: 'Learn local sports or games', location: destination, duration: '1.5 hours' },
          { time: '1:30 PM', title: 'Festival Food', description: 'Special dishes prepared for events', location: destination, duration: '1 hour' },
          { time: '3:00 PM', title: 'Cultural Workshop', description: 'Learn traditional dances or crafts', location: destination, duration: '2 hours' },
          { time: '6:00 PM', title: 'Evening Celebrations', description: 'Join the community evening festivities', location: destination, duration: '3 hours' }
        ],
        tips: ['Dress appropriately for events', 'Participate respectfully', 'Bring small gifts to share']
      },
      {
        title: `Urban Exploration`,
        activities: [
          { time: '9:00 AM', title: 'Abandoned Places', description: 'Safely explore historical ruins or sites', location: destination, duration: '2 hours' },
          { time: '11:30 AM', title: 'Rooftop Views', description: 'Find the best unofficial city viewpoints', location: destination, duration: '1 hour' },
          { time: '1:00 PM', title: 'Hole-in-the-wall Lunch', description: 'Tiny places with amazing food', location: destination, duration: '1 hour' },
          { time: '2:30 PM', title: 'Street Art Tour', description: 'Discover murals and graffiti art', location: destination, duration: '2.5 hours' },
          { time: '6:00 PM', title: 'Local Nightlife', description: 'Where young locals hang out', location: destination, duration: '2 hours' }
        ],
        tips: ['Stay safe in unfamiliar areas', 'Go with others when possible', 'Respect private property']
      },
      {
        title: `Spiritual & Peaceful`,
        activities: [
          { time: '6:00 AM', title: 'Meditation Spot', description: 'Peaceful places for reflection', location: destination, duration: '1 hour' },
          { time: '8:00 AM', title: 'Local Temple/Shrine', description: 'Small spiritual sites off tourist maps', location: destination, duration: '1.5 hours' },
          { time: '10:00 AM', title: 'Healing Practices', description: 'Traditional wellness or therapy', location: destination, duration: '2 hours' },
          { time: '1:00 PM', title: 'Quiet Lunch', description: 'Peaceful restaurant with garden setting', location: destination, duration: '1 hour' },
          { time: '3:00 PM', title: 'Wisdom Keeper Visit', description: 'Meet local elders or wise people', location: destination, duration: '2 hours' },
          { time: '6:00 PM', title: 'Sunset Reflection', description: 'End day at a peaceful sunset spot', location: destination, duration: '1 hour' }
        ],
        tips: ['Dress modestly for spiritual sites', 'Bring offerings if appropriate', 'Be quiet and respectful']
      }
    ];

    const result = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: ${offbeatPlans[i % offbeatPlans.length].title}`,
      activities: offbeatPlans[i % offbeatPlans.length].activities,
      tips: offbeatPlans[i % offbeatPlans.length].tips
    }));
    
    console.log(`🏗️ Generated ${result.length} days for offbeat itinerary`);
    return result;
  };

  const generateMockWeather = (destination: string): WeatherInfo => {
    const weatherOptions = [
      { condition: 'sunny', temperature: '28°C', description: 'Perfect weather for sightseeing!', icon: 'sun' },
      { condition: 'partly-cloudy', temperature: '25°C', description: 'Nice and pleasant – great for walking around!', icon: 'cloud' },
      { condition: 'light-rain', temperature: '23°C', description: 'Light showers expected – carry an umbrella!', icon: 'cloud-rain' }
    ];
    
    return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
  };

  const generateMockTravelOptions = (destination: string) => {
    const travelOptions: { [key: string]: any[] } = {
      'Goa': [
        { type: 'rental', name: 'Scooter Rental', description: 'Best way to explore beaches', price: '₹400/day', icon: 'car' },
        { type: 'taxi', name: 'Airport Transfer', description: 'Comfortable AC taxi service', price: '₹800', icon: 'car' },
        { type: 'bus', name: 'Hop-on Hop-off Bus', description: 'Tourist bus covering all major spots', price: '₹500/day', icon: 'train' }
      ],
      'Mumbai': [
        { type: 'metro', name: 'Mumbai Metro', description: 'Fast and efficient city transport', price: '₹10-40', icon: 'train' },
        { type: 'taxi', name: 'Uber/Ola', description: 'Convenient app-based rides', price: '₹8-12/km', icon: 'car' },
        { type: 'local', name: 'Local Train', description: 'Experience Mumbai\'s lifeline', price: '₹5-15', icon: 'train' }
      ]
    };
    
    return travelOptions[destination] || [
      { type: 'taxi', name: 'Local Taxi', description: 'Reliable local transportation', price: '₹10-15/km', icon: 'car' },
      { type: 'bus', name: 'City Bus', description: 'Budget-friendly city travel', price: '₹10-30', icon: 'train' },
      { type: 'rental', name: 'Car Rental', description: 'Self-drive convenience', price: '₹1200/day', icon: 'car' }
    ];
  };

  const generateMockFoodOptions = (destination: string) => {
    const foodOptions: { [key: string]: any[] } = {
      'Goa': [
        { name: 'Fish Curry Rice', description: 'Authentic Goan staple with coconut curry', price: '₹180', type: 'local', rating: 4.6 },
        { name: 'Bebinca', description: 'Traditional Goan layered dessert', price: '₹120', type: 'dessert', rating: 4.4 },
        { name: 'Prawn Balchão', description: 'Spicy pickled prawns - a Goan delicacy', price: '₹280', type: 'seafood', rating: 4.7 },
        { name: 'Cashew Feni', description: 'Local spirit made from cashew fruit', price: '₹150/glass', type: 'drink', rating: 4.2 }
      ],
      'Mumbai': [
        { name: 'Vada Pav', description: 'Mumbai\'s iconic street food burger', price: '₹15', type: 'street', rating: 4.5 },
        { name: 'Pav Bhaji', description: 'Spicy vegetable curry with bread', price: '₹80', type: 'street', rating: 4.6 },
        { name: 'Bombay Duck Curry', description: 'Local fish curry specialty', price: '₹220', type: 'local', rating: 4.4 },
        { name: 'Kulfi', description: 'Traditional Indian ice cream', price: '₹40', type: 'dessert', rating: 4.3 }
      ]
    };
    
    return foodOptions[destination] || [
      { name: 'Local Thali', description: 'Traditional meal with variety of dishes', price: '₹150', type: 'local', rating: 4.3 },
      { name: 'Street Chaat', description: 'Popular local street snacks', price: '₹50', type: 'street', rating: 4.2 },
      { name: 'Regional Sweet', description: 'Famous local dessert', price: '₹80', type: 'dessert', rating: 4.1 }
    ];
  };

  const getLuxuryRecommendations = () => {
    // Return Gemini AI generated luxury recommendations, fallback to mock if empty
    if (luxuryRecommendations.length > 0) {
      return luxuryRecommendations;
    }
    
    // Fallback mock data
    return [
      {
        type: 'hotel',
        name: 'The Leela Palace',
        description: 'Ultra-luxury hotel with royal treatment',
        price: '₹25,000/night',
        rating: 4.9
      },
      {
        type: 'restaurant',
        name: 'Michelin Star Experience',
        description: 'Fine dining at its absolute best',
        price: '₹8,000/person',
        rating: 4.8
      },
      {
        type: 'experience',
        name: 'Private City Tour',
        description: 'Exclusive guided tour with luxury transport',
        price: '₹15,000/day',
        rating: 4.7
      }
    ];
  };

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun': return <Sun size={20} className="text-yellow-500" />;
      case 'cloud': return <Cloud size={20} className="text-gray-500" />;
      case 'cloud-rain': return <CloudRain size={20} className="text-blue-500" />;
      default: return <Sun size={20} className="text-yellow-500" />;
    }
  };

  // Show AI recommendations for all trip types

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-2xl' : ''}`}>
        <button 
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:shadow-lg"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={24} className="animate-pulse" />
              <span className="text-lg font-semibold">AI Travel Insights</span>
            {weather && !isExpanded && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                {getWeatherIcon(weather.icon)}
                  <span className="text-sm font-medium">{weather.temperature}</span>
              </div>
            )}
            </div>
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </button>

        {isExpanded && (
          <div className="p-6 bg-gray-50">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 text-lg">Crafting personalized recommendations for {searchData.to}...</p>
                <p className="text-sm text-gray-500 mt-2">🌤️ Fetching live weather data...</p>
              </div>
            ) : (
              <>
                {weather && (
                  <div className="mb-8 bg-white rounded-lg p-6 shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800">
                          Weather in {weather.location || searchData.to}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {searchData.departureDate ? `On ${new Date(searchData.departureDate).toLocaleDateString()}` : 'Current conditions'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span>Live • WeatherAPI.com</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4">
                      {getWeatherIcon(weather.icon)}
                        <div>
                          <span className="text-3xl font-bold text-gray-800">{weather.temperature}</span>
                          <p className="text-gray-600 mt-1">{weather.description}</p>
                          {weather.feelsLike && (
                            <p className="text-sm text-gray-500">Feels like {weather.feelsLike}</p>
                          )}
                        </div>
                      </div>
                      {(weather.humidity || weather.windSpeed) && (
                        <div className="space-y-2">
                          {weather.humidity && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Humidity:</span>
                              <span className="font-medium">{weather.humidity}%</span>
                            </div>
                          )}
                          {weather.windSpeed && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Wind Speed:</span>
                              <span className="font-medium">{weather.windSpeed} km/h</span>
                            </div>
                          )}
                          {weather.localTime && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Local Time:</span>
                              <span className="font-medium">{new Date(weather.localTime).toLocaleTimeString()}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {weather.travelTips && weather.travelTips.length > 0 && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <span>💡</span>
                          Smart Travel Tips
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {weather.travelTips.map((tip, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm text-blue-800">
                              <span className="text-blue-600 mt-0.5">•</span>
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-8 text-center">
                  <p className="text-lg text-gray-700">While you're in <strong className="text-primary-600">{searchData.to}</strong>, don't forget to visit these amazing places and try the local experiences we've curated just for you!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Must Visit */}
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                      <MapPin size={18} className="text-red-500" />
                      Must Visit
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">While you're at {searchData.to}, don't forget to visit:</p>
                    <div className="space-y-3">
                    {recommendations.filter(r => r.type === 'attraction').slice(0, 3).map((rec, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-3 last:border-b-0">
                          <h5 className="font-medium text-gray-800">{rec.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                          {rec.rating && <span className="text-xs text-yellow-500 mt-1 inline-block">★ {rec.rating}</span>}
                      </div>
                    ))}
                    </div>
                  </div>

                  {/* Local Food */}
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                      <Utensils size={18} className="text-orange-500" />
                      Local Food Must-Tries
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Taste the authentic flavors of {searchData.to}:</p>
                    <div className="space-y-3">
                    {foodOptions.slice(0, 3).map((food, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-3 last:border-b-0">
                          <h5 className="font-medium text-gray-800">{food.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">{food.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{food.type}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-yellow-500">★ {food.rating}</span>
                              <span className="text-xs font-medium text-green-600">{food.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>
                  </div>

                  {/* Getting Around */}
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                      <Car size={18} className="text-blue-500" />
                      Getting Around
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Best ways to travel in {searchData.to}:</p>
                    <div className="space-y-3">
                    {travelOptions.slice(0, 2).map((travel, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-3 last:border-b-0">
                          <div className="flex items-center gap-2 mb-1">
                            {travel.icon === 'car' ? <Car size={14} /> : <Train size={14} />}
                            <h5 className="font-medium text-gray-800">{travel.name}</h5>
                          </div>
                          <p className="text-sm text-gray-600">{travel.description}</p>
                          <span className="text-xs font-medium text-green-600 mt-1 inline-block">{travel.price}</span>
                        </div>
                      ))}
                      </div>
                  </div>

                  {/* Where to Stay */}
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                      <Hotel size={18} className="text-purple-500" />
                      Where to Stay
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Comfortable stays in {searchData.to}:</p>
                    <div className="space-y-3">
                    {recommendations.filter(r => r.type === 'hotel').slice(0, 2).map((rec, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-3 last:border-b-0">
                          <h5 className="font-medium text-gray-800">{rec.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            {rec.rating && <span className="text-xs text-yellow-500">★ {rec.rating}</span>}
                            {rec.priceRange && <span className="text-xs font-medium text-green-600">{rec.priceRange}</span>}
                          </div>
                        </div>
                      ))}
                      </div>
                  </div>
                </div>

                {/* For the Occasional Splurge Section */}
                <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="flex items-center gap-2 text-xl font-semibold text-purple-800">
                      <Sparkles size={20} className="text-purple-600" />
                      For the Occasional Splurge
                    </h4>
                    <button 
                      className="bg-white/80 hover:bg-white border border-purple-200 px-4 py-2 rounded-lg text-sm font-medium text-purple-700 transition-all duration-200 hover:shadow-md"
                      onClick={() => setShowLuxury(!showLuxury)}
                    >
                      {showLuxury ? 'Hide' : 'Show'} Luxury Options
                    </button>
                  </div>
                  
                  {showLuxury && (
                    <>
                      <p className="text-purple-700 mb-6">Sometimes it's worth treating yourself to something special:</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {getLuxuryRecommendations().map((rec, idx) => (
                          <div key={idx} className="bg-white/80 backdrop-blur rounded-lg p-4 border border-purple-200 hover:shadow-lg transition-all duration-200">
                            <h5 className="font-semibold text-purple-900 mb-2">{rec.name}</h5>
                            <p className="text-sm text-purple-700 mb-3">{rec.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-purple-600">{rec.price}</span>
                              <span className="text-sm text-yellow-500">★ {rec.rating}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Curated Itineraries */}
                <div className="mb-8">
                  <h4 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-6">
                    <Calendar size={20} className="text-green-500" />
                    Curated Itineraries
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {itineraries.map((itinerary, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-start justify-between mb-4">
                          <h5 className="text-lg font-semibold text-gray-800 flex-1">{itinerary.title}</h5>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ml-2 ${
                            itinerary.type === 'popular' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {itinerary.type === 'popular' ? '🌟 Popular' : '💎 Hidden Gems'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 text-sm">{itinerary.description}</p>
                        <div className="space-y-2">
                          {itinerary.days.map((day, dayIdx) => (
                            <div key={dayIdx} className="bg-gray-50 p-3 rounded text-sm">
                              <strong className="text-gray-800">Day {day.day}:</strong> 
                              <span className="text-gray-600 ml-1">{day.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* View Complete Guide */}
                <div className="text-center bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 border border-primary-200">
                  <button 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-2 mx-auto"
                    onClick={() => setShowDetailedView(true)}
                  >
                    <ExternalLink size={18} />
                    View Complete Travel Guide
                  </button>
                  <p className="text-gray-600 mt-4 text-sm">Get detailed itineraries, more food options, activities, and insider tips!</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showDetailedView && (
        <DetailedRecommendations
          searchData={searchData}
          recommendations={recommendations}
          itineraries={itineraries}
          weather={weather}
          travelOptions={travelOptions}
          foodOptions={foodOptions}
          onClose={() => setShowDetailedView(false)}
        />
      )}
    </div>
  );
};

export default AIRecommendations;
