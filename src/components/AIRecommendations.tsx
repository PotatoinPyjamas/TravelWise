import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, ChevronDown, ChevronUp, MapPin, Utensils, Hotel, Calendar, Sun, Cloud, CloudRain, Car, Train, ExternalLink, Star } from 'lucide-react';
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
    console.log('🔥 generateRecommendations CALLED!');
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

      // Generate AI-powered recommendations using Gemini
      console.log('🤖 About to start Gemini integration for:', searchData.to);
      console.log('🤖 Weather info available:', !!weatherInfo);
      
      try {
        console.log('🤖 Calling Gemini API...');
        const geminiRecommendations = await generatePersonalizedRecommendations(searchData, weatherInfo);
        console.log('🤖 Gemini recommendations received:', geminiRecommendations);
        console.log('🤖 Attractions from Gemini:', geminiRecommendations.attractions?.length || 0);
        console.log('🤖 Restaurants from Gemini:', geminiRecommendations.restaurants?.length || 0);
        
        // Get additional weather-based tips from Gemini
        const aiWeatherTips = await generateWeatherBasedTips(weatherInfo, searchData.to);
        
        // Combine weather tips from both sources
        const combinedWeatherInfo = {
          ...weatherInfo,
          travelTips: [...(liveWeather.travelTips || []), ...aiWeatherTips].slice(0, 4)
        };
        
        // Combine all recommendations
        const allRecommendations = [
          ...geminiRecommendations.attractions,
          ...geminiRecommendations.restaurants,
          ...geminiRecommendations.hotels,
          ...geminiRecommendations.activities
        ];
        
        console.log('🤖 Combined recommendations count:', allRecommendations.length);
        console.log('🤖 Combined recommendations:', allRecommendations);
        
        console.log('🤖 Setting Gemini-generated itineraries:', geminiRecommendations.itineraries?.length || 0);
        console.log('🤖 First Gemini itinerary days:', geminiRecommendations.itineraries?.[0]?.days?.length || 0);
        console.log('🤖 Second Gemini itinerary days:', geminiRecommendations.itineraries?.[1]?.days?.length || 0);
        
        // Try Gemini first, with enhanced itinerary focus
        console.log('✨ Using Gemini for enhanced itineraries with transport details');
        
        if (geminiRecommendations.itineraries && 
            geminiRecommendations.itineraries.length > 0 && 
            geminiRecommendations.itineraries[0].days && 
            geminiRecommendations.itineraries[0].days.length > 0) {
          console.log('✅ Using Gemini itineraries with detailed activities');
          setItineraries(geminiRecommendations.itineraries);
        } else {
          console.log('⚠️ Gemini itineraries incomplete, using enhanced mock itineraries');
          const mockItineraries = generateMockItineraries(searchData.to, searchData.departureDate, searchData.returnDate);
          setItineraries(mockItineraries);
        }
        
        // TEMPORARY: Force city-specific mock data to test
        console.log('🔧 TEMPORARILY forcing city-specific mock data for', searchData.to);
        const mockRecommendations = generateMockRecommendations(searchData.to);
        console.log('🔄 Mock recommendations for', searchData.to, ':', mockRecommendations);
        console.log('🔄 First mock recommendation:', mockRecommendations[0]);
        setRecommendations(mockRecommendations);
        
        // Set all the state with Gemini data
        console.log('🎯 Setting recommendations. Count:', allRecommendations.length);
        console.log('🎯 First recommendation:', allRecommendations[0]);
        
        // if (allRecommendations.length > 0) {
        //   console.log('✅ Using Gemini recommendations');
        //   setRecommendations(allRecommendations);
        // } else {
        //   console.log('⚠️ No Gemini recommendations, using mock data for', searchData.to);
        //   const mockRecommendations = generateMockRecommendations(searchData.to);
        //   console.log('🔄 Mock recommendations:', mockRecommendations);
        //   setRecommendations(mockRecommendations);
        // }
        setWeather(combinedWeatherInfo);
        setTravelOptions(geminiRecommendations.travelOptions || generateMockTravelOptions(searchData.to));
        const finalFoodOptions = geminiRecommendations.foodOptions || generateMockFoodOptions(searchData.to);
        console.log('🍽️ Setting food options:', finalFoodOptions);
        console.log('🍽️ First food option:', finalFoodOptions[0]);
        setFoodOptions(finalFoodOptions);
        setLuxuryRecommendations(geminiRecommendations.luxuryRecommendations || getLuxuryRecommendations());
        
      } catch (geminiError) {
        console.error('🚫 Gemini failed, using enhanced mock data:', geminiError);
        console.log('🔄 Falling back to mock recommendations for everything');
        
        // Enhanced fallback with weather-aware tips
        const combinedWeatherInfo = {
          ...weatherInfo,
          travelTips: liveWeather.travelTips || []
        };
        
        // Generate mock data
    const mockRecommendations = generateMockRecommendations(searchData.to);
    const mockItineraries = generateMockItineraries(searchData.to, searchData.departureDate, searchData.returnDate);
        const mockTravelOptions = generateMockTravelOptions(searchData.to);
        const mockFoodOptions = generateMockFoodOptions(searchData.to);
        
        setRecommendations(mockRecommendations);
        setItineraries(mockItineraries);
        setWeather(combinedWeatherInfo);
        setTravelOptions(mockTravelOptions);
        setFoodOptions(mockFoodOptions);
        setLuxuryRecommendations([
          { type: 'hotel', name: 'Luxury Hotel', description: 'Premium accommodation', price: '₹15,000+', rating: 4.8, specialFeatures: ['Spa', 'Fine Dining'] }
        ]);
      }
      
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
    console.log('🔄 useEffect triggered with searchData.to:', searchData.to);
    if (searchData.to) {
      console.log('✅ Calling generateRecommendations...');
      generateRecommendations();
    } else {
      console.log('❌ No destination, skipping generateRecommendations');
    }
  }, [searchData, generateRecommendations]);

  const generateMockRecommendations = (destination: string): Recommendation[] => {
    // City-specific recommendations with 2 must-visit places and 2 accommodations (1 budget-friendly)
    const destinations: { [key: string]: Recommendation[] } = {
      'Hyderabad': [
        // Must Visit Places (2)
        { type: 'attraction' as const, name: 'Charminar', description: 'Iconic 16th-century monument and symbol of Hyderabad', rating: 4.4, category: 'historical' },
        { type: 'attraction' as const, name: 'Golconda Fort', description: 'Historic fort complex with acoustic marvels and diamond mines', rating: 4.3, category: 'historical' },
        // Where to Stay (2 - 1 luxury, 1 budget)
        { type: 'hotel' as const, name: 'Taj Falaknuma Palace', description: 'Palatial luxury hotel with royal Nizam heritage', rating: 4.8, priceRange: '₹₹₹₹', amenities: ['Palace', 'Spa', 'Heritage'] },
        { type: 'hotel' as const, name: 'Hotel Sapphire', description: 'Budget-friendly hotel near Charminar with basic amenities', rating: 4.0, priceRange: '₹', amenities: ['WiFi', 'AC', 'Room Service'] },
        // Local Food (3)
        { type: 'restaurant' as const, name: 'Hyderabadi Biryani', description: 'World-famous aromatic basmati rice with tender mutton/chicken', rating: 4.8, priceRange: '₹300', cuisine: 'Hyderabadi' },
        { type: 'restaurant' as const, name: 'Haleem', description: 'Slow-cooked lentil and meat stew, a Ramadan specialty', rating: 4.6, priceRange: '₹180', cuisine: 'Hyderabadi' },
        { type: 'restaurant' as const, name: 'Double Ka Meetha', description: 'Traditional bread pudding with cardamom and nuts', rating: 4.4, priceRange: '₹120', cuisine: 'Dessert' }
      ],
      'Mumbai': [
        // Must Visit Places (2)
        { type: 'attraction' as const, name: 'Gateway of India', description: 'Iconic monument overlooking the Arabian Sea harbor', rating: 4.4, category: 'historical' },
        { type: 'attraction' as const, name: 'Marine Drive', description: 'Queen\'s Necklace - scenic coastal road perfect for evening walks', rating: 4.5, category: 'scenic' },
        // Where to Stay (2 - 1 luxury, 1 budget)
        { type: 'hotel' as const, name: 'The Taj Mahal Palace', description: 'Historic luxury hotel overlooking Gateway of India', rating: 4.7, priceRange: '₹₹₹₹', amenities: ['Heritage', 'Sea View', 'Spa'] },
        { type: 'hotel' as const, name: 'Hotel City Palace', description: 'Budget-friendly accommodation in Colaba with clean rooms', rating: 4.1, priceRange: '₹', amenities: ['WiFi', 'AC', 'Central Location'] },
        // Local Food (3)
        { type: 'restaurant' as const, name: 'Vada Pav', description: 'Mumbai\'s iconic street burger with spiced potato fritter', rating: 4.7, priceRange: '₹25', cuisine: 'Street Food' },
        { type: 'restaurant' as const, name: 'Pav Bhaji', description: 'Spiced vegetable curry served with buttered bread rolls', rating: 4.6, priceRange: '₹80', cuisine: 'Street Food' },
        { type: 'restaurant' as const, name: 'Modak', description: 'Sweet steamed dumplings filled with jaggery and coconut', rating: 4.3, priceRange: '₹60', cuisine: 'Dessert' },
        // Getting Around (4)
        { type: 'activity' as const, name: 'Mumbai Metro', description: 'Fast and efficient metro system covering major areas', rating: 4.4, duration: 'Per trip', price: '₹10-60', category: 'metro' },
        { type: 'activity' as const, name: 'Local Trains', description: 'Lifeline of Mumbai - extensive suburban railway network', rating: 4.2, duration: 'Per trip', price: '₹5-15', category: 'train' },
        { type: 'activity' as const, name: 'Auto Rickshaw', description: 'Three-wheelers for short distances and narrow lanes', rating: 4.0, duration: 'Per trip', price: '₹25-100', category: 'auto' },
        { type: 'activity' as const, name: 'Ola/Uber', description: 'App-based cabs for comfortable door-to-door travel', rating: 4.3, duration: 'Per trip', price: '₹50-300', category: 'cab' }
      ],
      'Delhi': [
        // Must Visit Places (2)
        { type: 'attraction' as const, name: 'Red Fort', description: 'UNESCO World Heritage Mughal fortress and palace complex', rating: 4.3, category: 'historical' },
        { type: 'attraction' as const, name: 'India Gate', description: 'War memorial and iconic landmark of New Delhi', rating: 4.4, category: 'memorial' },
        // Where to Stay (2 - 1 luxury, 1 budget)
        { type: 'hotel' as const, name: 'The Imperial', description: 'Art Deco luxury hotel with colonial grandeur', rating: 4.6, priceRange: '₹₹₹₹', amenities: ['Heritage', 'Spa', 'Business Center'] },
        { type: 'hotel' as const, name: 'Hotel Tara Palace', description: 'Budget hotel in Chandni Chowk with traditional charm', rating: 4.0, priceRange: '₹', amenities: ['WiFi', 'Restaurant', 'Old Delhi Location'] },
        // Local Food (3)
        { type: 'restaurant' as const, name: 'Chole Bhature', description: 'Spicy chickpea curry with deep-fried bread', rating: 4.5, priceRange: '₹120', cuisine: 'North Indian' },
        { type: 'restaurant' as const, name: 'Paranthe Wali Gali Parathas', description: 'Stuffed flatbreads from the famous Old Delhi lane', rating: 4.7, priceRange: '₹100', cuisine: 'Street Food' },
        { type: 'restaurant' as const, name: 'Kulfi Faluda', description: 'Traditional ice cream with vermicelli and rose syrup', rating: 4.4, priceRange: '₹80', cuisine: 'Dessert' },
        // Getting Around (4)
        { type: 'activity' as const, name: 'Delhi Metro', description: 'Extensive metro network with 6 color-coded lines', rating: 4.5, duration: 'Per trip', price: '₹10-60', category: 'metro' },
        { type: 'activity' as const, name: 'DTC Buses', description: 'Delhi Transport Corporation buses covering entire city', rating: 3.8, duration: 'Per trip', price: '₹5-25', category: 'bus' },
        { type: 'activity' as const, name: 'Auto Rickshaw', description: 'Yellow-green three-wheelers with meter system', rating: 3.9, duration: 'Per trip', price: '₹30-150', category: 'auto' },
        { type: 'activity' as const, name: 'Ola/Uber', description: 'Reliable app-based cabs available 24/7', rating: 4.2, duration: 'Per trip', price: '₹80-400', category: 'cab' }
      ],
      'Goa': [
        // Must Visit Places (2)
        { type: 'attraction' as const, name: 'Baga Beach', description: 'Famous beach destination with water sports and nightlife', rating: 4.5, category: 'beach' },
        { type: 'attraction' as const, name: 'Basilica of Bom Jesus', description: 'UNESCO World Heritage church with St. Francis Xavier\'s remains', rating: 4.6, category: 'religious' },
        // Where to Stay (2 - 1 luxury, 1 budget)
        { type: 'hotel' as const, name: 'Taj Exotica Resort & Spa', description: 'Luxury beachfront resort with private beach access', rating: 4.8, priceRange: '₹₹₹₹', amenities: ['Beach', 'Spa', 'Pool'] },
        { type: 'hotel' as const, name: 'Anjuna Beach Resort', description: 'Budget-friendly beachside accommodation with sea views', rating: 4.1, priceRange: '₹', amenities: ['Beach Access', 'Restaurant', 'WiFi'] },
        // Local Food (3)
        { type: 'restaurant' as const, name: 'Fish Curry Rice', description: 'Coconut-based fish curry with steamed rice', rating: 4.6, priceRange: '₹200', cuisine: 'Goan' },
        { type: 'restaurant' as const, name: 'Bebinca', description: 'Traditional Goan layered dessert with coconut milk', rating: 4.3, priceRange: '₹150', cuisine: 'Dessert' },
        { type: 'restaurant' as const, name: 'Prawn Balchão', description: 'Spicy pickled prawns in tangy sauce', rating: 4.5, priceRange: '₹250', cuisine: 'Seafood' }
      ],
      'Chennai': [
        // Must Visit Places (2)
        { type: 'attraction' as const, name: 'Marina Beach', description: 'Second longest urban beach in the world', rating: 4.2, category: 'beach' },
        { type: 'attraction' as const, name: 'Kapaleeshwarar Temple', description: 'Ancient Dravidian architecture temple dedicated to Lord Shiva', rating: 4.5, category: 'religious' },
        // Where to Stay (2 - 1 luxury, 1 budget)
        { type: 'hotel' as const, name: 'The Leela Palace Chennai', description: 'Luxury beachfront hotel with contemporary design', rating: 4.7, priceRange: '₹₹₹₹', amenities: ['Beach', 'Spa', 'Pool'] },
        { type: 'hotel' as const, name: 'Hotel Pandian', description: 'Budget hotel in T. Nagar with good connectivity', rating: 4.0, priceRange: '₹', amenities: ['WiFi', 'Restaurant', 'Shopping Area'] },
        // Local Food (3)
        { type: 'restaurant' as const, name: 'Chettinad Chicken', description: 'Spicy Tamil Nadu chicken curry with aromatic spices', rating: 4.6, priceRange: '₹220', cuisine: 'South Indian' },
        { type: 'restaurant' as const, name: 'Masala Dosa', description: 'Crispy rice crepe with spiced potato filling', rating: 4.7, priceRange: '₹60', cuisine: 'South Indian' },
        { type: 'restaurant' as const, name: 'Filter Coffee & Mysore Pak', description: 'South Indian coffee with traditional gram flour sweet', rating: 4.4, priceRange: '₹80', cuisine: 'Dessert' }
      ],
      'Bangalore': [
        // Must Visit Places (2)
        { type: 'attraction' as const, name: 'Lalbagh Botanical Garden', description: 'Historic 240-acre botanical garden with glass house', rating: 4.4, category: 'nature' },
        { type: 'attraction' as const, name: 'Bangalore Palace', description: 'Tudor-style palace inspired by Windsor Castle', rating: 4.3, category: 'historical' },
        // Where to Stay (2 - 1 luxury, 1 budget)
        { type: 'hotel' as const, name: 'The Oberoi Bangalore', description: 'Contemporary luxury hotel in the business district', rating: 4.6, priceRange: '₹₹₹₹', amenities: ['Business', 'Spa', 'Fine Dining'] },
        { type: 'hotel' as const, name: 'Zostel Bangalore', description: 'Modern hostel with comfortable dorms and private rooms', rating: 4.2, priceRange: '₹', amenities: ['WiFi', 'Common Area', 'Cafe'] },
        // Local Food (3)
        { type: 'restaurant' as const, name: 'Bisi Bele Bath', description: 'Karnataka\'s signature spiced rice and lentil dish', rating: 4.5, priceRange: '₹100', cuisine: 'South Indian' },
        { type: 'restaurant' as const, name: 'Mysore Masala Dosa', description: 'Crispy dosa with spicy red chutney', rating: 4.6, priceRange: '₹70', cuisine: 'South Indian' },
        { type: 'restaurant' as const, name: 'Dharwad Peda', description: 'Famous Karnataka milk-based sweet', rating: 4.3, priceRange: '₹40', cuisine: 'Dessert' }
      ],
      'Kolkata': [
        // Must Visit Places (2)
        { type: 'attraction' as const, name: 'Victoria Memorial', description: 'Grand marble building and museum dedicated to Queen Victoria', rating: 4.4, category: 'historical' },
        { type: 'attraction' as const, name: 'Howrah Bridge', description: 'Iconic cantilever bridge over the Hooghly River', rating: 4.3, category: 'architectural' },
        // Where to Stay (2 - 1 luxury, 1 budget)
        { type: 'hotel' as const, name: 'The Oberoi Grand Kolkata', description: 'Heritage luxury hotel in the heart of the city', rating: 4.5, priceRange: '₹₹₹₹', amenities: ['Heritage', 'Spa', 'Fine Dining'] },
        { type: 'hotel' as const, name: 'Hotel Lindsay', description: 'Budget heritage hotel on Lindsay Street with old-world charm', rating: 4.0, priceRange: '₹', amenities: ['Heritage', 'WiFi', 'Central Location'] }
      ]
    };

    return destinations[destination] || [
      // Default fallback
      { type: 'attraction' as const, name: 'Local Heritage Site', description: 'Explore the rich history and culture', rating: 4.2, category: 'cultural' },
      { type: 'attraction' as const, name: 'City Center', description: 'Heart of the city with shopping and dining', rating: 4.1, category: 'urban' },
      { type: 'hotel' as const, name: 'Luxury Hotel', description: 'Premium accommodation with modern amenities', rating: 4.5, priceRange: '₹₹₹₹', amenities: ['Spa', 'Pool', 'Fine Dining'] },
      { type: 'hotel' as const, name: 'Budget Inn', description: 'Comfortable and affordable stay', rating: 4.0, priceRange: '₹', amenities: ['WiFi', 'AC', 'Room Service'] }
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

    // FORCE city-specific itineraries for testing
    console.log(`🔧 FORCING city-specific itinerary for ${destination}`);
    const popularDays = getCitySpecificPopularItinerary(destination, itineraryDays);
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

    const result = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: ${dayTemplates[i % dayTemplates.length].title}`,
      activities: dayTemplates[i % dayTemplates.length].activities,
      tips: dayTemplates[i % dayTemplates.length].tips
    }));
    
    console.log(`🏗️ Generated ${result.length} days for popular itinerary`);
    return result;
  };

  const getCitySpecificPopularItinerary = (destination: string, days: number) => {
    console.log(`🏗️ getCitySpecificPopularItinerary called for ${destination}, ${days} days`);
    
    // City-specific 7-day popular itineraries based on Gemini insights
    const cityItineraries: { [key: string]: any[] } = {
      'Mumbai': [
        { title: 'Arrival & South Mumbai Icons', activities: [
          { time: '10:00 AM', title: 'Gateway of India', description: 'Visit Mumbai\'s iconic monument overlooking the harbor', location: 'Colaba', duration: '1.5 hours', transport: 'Taxi from airport', cost: '₹500' },
          { time: '12:00 PM', title: 'Lunch at Trishna', description: 'Contemporary Indian seafood restaurant', location: 'Fort', duration: '1.5 hours', transport: 'Walking', cost: '₹1200' },
          { time: '2:30 PM', title: 'Chhatrapati Shivaji Terminus', description: 'UNESCO World Heritage Victorian Gothic railway station', location: 'Fort', duration: '1 hour', transport: 'Taxi', cost: '₹100' },
          { time: '5:00 PM', title: 'Marine Drive Sunset', description: 'Walk along Queen\'s Necklace for stunning sunset', location: 'Marine Drive', duration: '2 hours', transport: 'Taxi', cost: '₹150' }
        ], tips: ['Book airport pickup in advance', 'Carry cash for local transport', 'Marine Drive sunset is magical'] },
        
        { title: 'Bollywood & Markets', activities: [
          { time: '9:00 AM', title: 'Film City Tour', description: 'Behind-the-scenes look at Bollywood movie making', location: 'Goregaon', duration: '3 hours', transport: 'Taxi', cost: '₹800' },
          { time: '1:00 PM', title: 'Lunch at Britannia & Co', description: 'Iconic Parsi cafe famous for berry pulav', location: 'Fort', duration: '1 hour', transport: 'Local train', cost: '₹300' },
          { time: '3:00 PM', title: 'Crawford Market Shopping', description: 'Historic market for spices, fruits, and souvenirs', location: 'Fort', duration: '2 hours', transport: 'Walking', cost: '₹500' },
          { time: '6:00 PM', title: 'Linking Road Shopping', description: 'Street shopping paradise in Bandra', location: 'Bandra', duration: '2 hours', transport: 'Local train', cost: '₹1000' }
        ], tips: ['Book Film City tour online', 'Bargain at Crawford Market', 'Try local train experience'] },
        
        { title: 'Spiritual & Cultural Mumbai', activities: [
          { time: '8:00 AM', title: 'Siddhivinayak Temple', description: 'Mumbai\'s most revered Ganesha temple', location: 'Prabhadevi', duration: '1.5 hours', transport: 'Taxi', cost: '₹200' },
          { time: '10:30 AM', title: 'Dhobi Ghat', description: 'World\'s largest outdoor laundry', location: 'Mahalaxmi', duration: '1 hour', transport: 'Taxi', cost: '₹150' },
          { time: '12:30 PM', title: 'Lunch at Mahesh Lunch Home', description: 'Authentic Mangalorean seafood', location: 'Fort', duration: '1 hour', transport: 'Local train', cost: '₹800' },
          { time: '3:00 PM', title: 'Prince of Wales Museum', description: 'Art, archaeology and natural history', location: 'Fort', duration: '2 hours', transport: 'Walking', cost: '₹300' },
          { time: '6:00 PM', title: 'Juhu Beach', description: 'Popular beach with street food and sunset', location: 'Juhu', duration: '2 hours', transport: 'Taxi', cost: '₹300' }
        ], tips: ['Dress modestly for temples', 'Try bhel puri at Juhu Beach', 'Museum closes at 6 PM'] }
      ],
      'Delhi': [
        { title: 'Old Delhi Heritage Walk', activities: [
          { time: '9:00 AM', title: 'Red Fort', description: 'UNESCO World Heritage Mughal fortress complex', location: 'Old Delhi', duration: '2 hours', transport: 'Metro to Lal Qila', cost: '₹35' },
          { time: '11:30 AM', title: 'Jama Masjid', description: 'India\'s largest mosque with stunning architecture', location: 'Old Delhi', duration: '1 hour', transport: 'Walking', cost: '₹0' },
          { time: '1:00 PM', title: 'Paranthe Wali Gali Lunch', description: 'Famous lane serving stuffed parathas since 1870s', location: 'Chandni Chowk', duration: '1 hour', transport: 'Walking', cost: '₹200' },
          { time: '3:00 PM', title: 'Chandni Chowk Shopping', description: 'Oldest and busiest market in Old Delhi', location: 'Chandni Chowk', duration: '2 hours', transport: 'Walking', cost: '₹800' },
          { time: '6:00 PM', title: 'Raj Ghat', description: 'Memorial to Mahatma Gandhi', location: 'Raj Ghat', duration: '1 hour', transport: 'Auto rickshaw', cost: '₹100' }
        ], tips: ['Start early to avoid crowds', 'Carry cash for Old Delhi', 'Wear comfortable walking shoes'] },
        
        { title: 'New Delhi & Government Quarter', activities: [
          { time: '9:00 AM', title: 'India Gate', description: 'War memorial and iconic landmark of New Delhi', location: 'India Gate', duration: '1 hour', transport: 'Metro to Central Secretariat', cost: '₹30' },
          { time: '10:30 AM', title: 'Rashtrapati Bhavan', description: 'Presidential Palace with Mughal Gardens (if open)', location: 'Raisina Hill', duration: '2 hours', transport: 'Walking', cost: '₹50' },
          { time: '1:00 PM', title: 'Lunch at Indian Accent', description: 'World-renowned modern Indian cuisine', location: 'Lodhi Road', duration: '1.5 hours', transport: 'Taxi', cost: '₹3000' },
          { time: '3:30 PM', title: 'Humayun\'s Tomb', description: 'UNESCO site and precursor to Taj Mahal', location: 'Nizamuddin', duration: '2 hours', transport: 'Metro', cost: '₹30' },
          { time: '6:00 PM', title: 'Lodhi Gardens', description: 'Beautiful park with medieval monuments', location: 'Lodhi Road', duration: '1.5 hours', transport: 'Metro', cost: '₹0' }
        ], tips: ['Check Rashtrapati Bhavan visiting hours', 'Book Indian Accent in advance', 'Lodhi Gardens perfect for evening walk'] },
        
        { title: 'Markets & Modern Delhi', activities: [
          { time: '10:00 AM', title: 'Lotus Temple', description: 'Bahai House of Worship with lotus-inspired architecture', location: 'Kalkaji', duration: '1.5 hours', transport: 'Metro to Kalkaji Mandir', cost: '₹35' },
          { time: '12:30 PM', title: 'Connaught Place', description: 'Shopping and dining in Delhi\'s commercial heart', location: 'Connaught Place', duration: '2 hours', transport: 'Metro to Rajiv Chowk', cost: '₹30' },
          { time: '2:30 PM', title: 'Lunch at Karim\'s', description: 'Historic restaurant famous for Mughlai cuisine', location: 'Jama Masjid', duration: '1 hour', transport: 'Metro', cost: '₹500' },
          { time: '4:30 PM', title: 'Dilli Haat', description: 'Crafts bazaar showcasing all Indian states', location: 'INA', duration: '2 hours', transport: 'Metro to INA', cost: '₹30' },
          { time: '7:00 PM', title: 'Kingdom of Dreams', description: 'Live Bollywood musical and cultural shows', location: 'Gurgaon', duration: '3 hours', transport: 'Metro + taxi', cost: '₹2000' }
        ], tips: ['Maintain silence at Lotus Temple', 'Dilli Haat has entry fee', 'Book Kingdom of Dreams tickets online'] }
      ]
    };

    const cityData = cityItineraries[destination] || [];
    console.log(`🏗️ City data found for ${destination}:`, cityData.length, 'days available');
    
    const result = [];
    
    for (let i = 0; i < Math.min(days, cityData.length); i++) {
      result.push({
        day: i + 1,
        title: `Day ${i + 1}: ${cityData[i].title}`,
        activities: cityData[i].activities,
        tips: cityData[i].tips,
        totalBudget: '₹2000-4000 per person',
        transportTips: 'Use Mumbai local trains and taxis for efficient travel'
      });
    }
    
    console.log(`🏗️ getCitySpecificPopularItinerary returning ${result.length} days for ${destination}`);
    console.log(`🏗️ First day title:`, result[0]?.title);
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
    // City-specific authentic food recommendations based on Gemini insights
    const foodOptions: { [key: string]: any[] } = {
      'Hyderabad': [
        { name: 'Hyderabadi Biryani', description: 'World-famous aromatic basmati rice with tender mutton/chicken', price: '₹300', type: 'local', rating: 4.8 },
        { name: 'Haleem', description: 'Slow-cooked lentil and meat stew, a Ramadan specialty', price: '₹180', type: 'local', rating: 4.6 },
        { name: 'Double Ka Meetha', description: 'Traditional bread pudding with cardamom and nuts', price: '₹120', type: 'dessert', rating: 4.4 }
      ],
      'Mumbai': [
        { name: 'Vada Pav', description: 'Mumbai\'s iconic street burger with spiced potato fritter', price: '₹25', type: 'street', rating: 4.7 },
        { name: 'Pav Bhaji', description: 'Spiced vegetable curry served with buttered bread rolls', price: '₹80', type: 'street', rating: 4.6 },
        { name: 'Modak', description: 'Sweet steamed dumplings filled with jaggery and coconut', price: '₹60', type: 'dessert', rating: 4.3 }
      ],
      'Delhi': [
        { name: 'Chole Bhature', description: 'Spicy chickpea curry with deep-fried bread', price: '₹120', type: 'local', rating: 4.5 },
        { name: 'Paranthe Wali Gali Parathas', description: 'Stuffed flatbreads from the famous Old Delhi lane', price: '₹100', type: 'local', rating: 4.7 },
        { name: 'Kulfi Faluda', description: 'Traditional ice cream with vermicelli and rose syrup', price: '₹80', type: 'dessert', rating: 4.4 }
      ],
      'Goa': [
        { name: 'Fish Curry Rice', description: 'Coconut-based fish curry with steamed rice', price: '₹200', type: 'local', rating: 4.6 },
        { name: 'Bebinca', description: 'Traditional Goan layered dessert with coconut milk', price: '₹150', type: 'dessert', rating: 4.3 },
        { name: 'Prawn Balchão', description: 'Spicy pickled prawns in tangy sauce', price: '₹250', type: 'seafood', rating: 4.5 }
      ],
      'Chennai': [
        { name: 'Chettinad Chicken', description: 'Spicy Tamil Nadu chicken curry with aromatic spices', price: '₹220', type: 'local', rating: 4.6 },
        { name: 'Masala Dosa', description: 'Crispy rice crepe with spiced potato filling', price: '₹60', type: 'local', rating: 4.7 },
        { name: 'Filter Coffee & Mysore Pak', description: 'South Indian coffee with traditional gram flour sweet', price: '₹80', type: 'dessert', rating: 4.4 }
      ],
      'Bangalore': [
        { name: 'Bisi Bele Bath', description: 'Karnataka\'s signature spiced rice and lentil dish', price: '₹100', type: 'local', rating: 4.5 },
        { name: 'Mysore Masala Dosa', description: 'Crispy dosa with spicy red chutney', price: '₹70', type: 'local', rating: 4.6 },
        { name: 'Dharwad Peda', description: 'Famous Karnataka milk-based sweet', price: '₹40', type: 'dessert', rating: 4.3 }
      ],
      'Kolkata': [
        { name: 'Macher Jhol', description: 'Bengali fish curry with potatoes', price: '₹180', type: 'local', rating: 4.6 },
        { name: 'Kathi Roll', description: 'Kolkata\'s famous wrap with kebab and onions', price: '₹80', type: 'street', rating: 4.5 },
        { name: 'Rasgulla', description: 'Spongy cottage cheese balls in sugar syrup', price: '₹60', type: 'dessert', rating: 4.7 }
      ]
    };
    
    return foodOptions[destination] || [
      { name: 'Local Thali', description: 'Traditional meal with variety of dishes', price: '₹150', type: 'local', rating: 4.3 },
      { name: 'Street Chaat', description: 'Popular local street snacks', price: '₹50', type: 'street', rating: 4.2 },
      { name: 'Regional Sweet', description: 'Famous local dessert', price: '₹80', type: 'dessert', rating: 4.1 }
    ];
  };

  const getLuxuryRecommendations = () => {
    // City-specific luxury recommendations with real expensive restaurants
    const cityLuxuryData: { [key: string]: any[] } = {
      'Mumbai': [
        {
          type: 'restaurant',
          name: 'Trishna',
          description: 'Michelin-starred contemporary Indian seafood with innovative preparations',
          price: '₹12,000/person',
          rating: 4.9,
          specialFeatures: ['Michelin Star', 'Chef Rahul Akerkar', 'Wine Pairing']
        },
        {
          type: 'restaurant', 
          name: 'The Table',
          description: 'Fine dining European cuisine with Mumbai\'s skyline views',
          price: '₹10,000/person',
          rating: 4.8,
          specialFeatures: ['Rooftop Dining', 'European Cuisine', 'City Views']
        },
        {
          type: 'hotel',
          name: 'The Taj Mahal Palace',
          description: 'Iconic heritage luxury hotel overlooking the Gateway of India',
          price: '₹45,000/night',
          rating: 4.9,
          specialFeatures: ['Heritage', 'Sea View', 'Presidential Suite']
        }
      ],
      'Delhi': [
        {
          type: 'restaurant',
          name: 'Indian Accent',
          description: 'World-renowned modern Indian cuisine in elegant colonial setting',
          price: '₹15,000/person',
          rating: 4.9,
          specialFeatures: ['World\'s 50 Best', 'Chef Manish Mehrotra', 'Tasting Menu']
        },
        {
          type: 'restaurant',
          name: 'Varq',
          description: 'Progressive Indian fine dining at The Taj Mahal Hotel',
          price: '₹12,000/person',
          rating: 4.8,
          specialFeatures: ['Molecular Gastronomy', 'Silver Leaf Decor', 'Wine Cellar']
        },
        {
          type: 'hotel',
          name: 'The Imperial',
          description: 'Art Deco masterpiece with colonial grandeur and modern luxury',
          price: '₹40,000/night',
          rating: 4.8,
          specialFeatures: ['Art Deco', 'Heritage', 'Spa']
        }
      ],
      'Goa': [
        {
          type: 'restaurant',
          name: 'Thalassa',
          description: 'Cliffside Greek fine dining with spectacular sunset views',
          price: '₹8,000/person',
          rating: 4.7,
          specialFeatures: ['Cliffside', 'Greek Cuisine', 'Sunset Views']
        },
        {
          type: 'restaurant',
          name: 'Spice Studio',
          description: 'Contemporary Indian cuisine with ocean views and wine pairing',
          price: '₹7,500/person',
          rating: 4.6,
          specialFeatures: ['Ocean Views', 'Contemporary Indian', 'Wine Pairing']
        },
        {
          type: 'hotel',
          name: 'Taj Exotica Resort & Spa',
          description: 'Luxury beachfront resort with private beach and world-class spa',
          price: '₹35,000/night',
          rating: 4.8,
          specialFeatures: ['Private Beach', 'Spa', 'Golf Course']
        }
      ],
      'Hyderabad': [
        {
          type: 'restaurant',
          name: 'Adaa',
          description: 'Royal Hyderabadi cuisine in palatial setting at Taj Falaknuma Palace',
          price: '₹10,000/person',
          rating: 4.8,
          specialFeatures: ['Palace Dining', 'Royal Cuisine', 'Heritage']
        },
        {
          type: 'restaurant',
          name: 'Celeste',
          description: 'Pan-Asian fine dining with city skyline views',
          price: '₹8,500/person',
          rating: 4.7,
          specialFeatures: ['Pan-Asian', 'Skyline Views', 'Rooftop']
        },
        {
          type: 'hotel',
          name: 'Taj Falaknuma Palace',
          description: 'Former Nizam\'s palace turned luxury hotel with royal treatment',
          price: '₹50,000/night',
          rating: 4.9,
          specialFeatures: ['Palace', 'Royal Heritage', 'Butler Service']
        }
      ],
      'Chennai': [
        {
          type: 'restaurant',
          name: 'Dakshin',
          description: 'Award-winning South Indian fine dining with regional specialties',
          price: '₹6,500/person',
          rating: 4.7,
          specialFeatures: ['Regional Cuisine', 'Award Winning', 'Traditional']
        },
        {
          type: 'restaurant',
          name: 'Golden Dragon',
          description: 'Upscale Chinese cuisine with elegant ambiance',
          price: '₹6,000/person',
          rating: 4.6,
          specialFeatures: ['Chinese Cuisine', 'Elegant Ambiance', 'Dim Sum']
        },
        {
          type: 'hotel',
          name: 'The Leela Palace Chennai',
          description: 'Luxury beachfront hotel with contemporary design and spa',
          price: '₹30,000/night',
          rating: 4.7,
          specialFeatures: ['Beachfront', 'Contemporary', 'Spa']
        }
      ],
      'Bangalore': [
        {
          type: 'restaurant',
          name: 'Caperberry',
          description: 'European fine dining with innovative molecular gastronomy',
          price: '₹9,000/person',
          rating: 4.8,
          specialFeatures: ['Molecular Gastronomy', 'European', 'Innovation']
        },
        {
          type: 'restaurant',
          name: 'Rim Naam',
          description: 'Authentic Thai cuisine in traditional setting with live music',
          price: '₹7,000/person',
          rating: 4.7,
          specialFeatures: ['Authentic Thai', 'Live Music', 'Traditional Setting']
        },
        {
          type: 'hotel',
          name: 'The Oberoi Bangalore',
          description: 'Contemporary luxury hotel with award-winning spa and dining',
          price: '₹25,000/night',
          rating: 4.6,
          specialFeatures: ['Contemporary', 'Award-winning Spa', 'Business District']
        }
      ]
    };

    const cityData = cityLuxuryData[searchData.to] || cityLuxuryData['Mumbai'];
    return cityData;
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
                    {recommendations.filter(r => r.type === 'restaurant').slice(0, 3).map((rec, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-3 last:border-b-0">
                          <h5 className="font-medium text-gray-800">{rec.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{rec.cuisine}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-yellow-500">★ {rec.rating}</span>
                              <span className="text-xs font-medium text-green-600">{rec.priceRange}</span>
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
                    {recommendations.filter(r => r.type === 'activity' && r.category && ['metro', 'train', 'bus', 'auto', 'cab'].includes(r.category)).slice(0, 4).map((transport, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-3 last:border-b-0">
                          <div className="flex items-center gap-2 mb-1">
                            {transport.category === 'metro' && <Train size={14} className="text-blue-600" />}
                            {transport.category === 'train' && <Train size={14} className="text-green-600" />}
                            {transport.category === 'bus' && <Car size={14} className="text-orange-600" />}
                            {transport.category === 'auto' && <Car size={14} className="text-yellow-600" />}
                            {transport.category === 'cab' && <Car size={14} className="text-purple-600" />}
                            <h5 className="font-medium text-gray-800">{transport.name}</h5>
                          </div>
                          <p className="text-sm text-gray-600">{transport.description}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-medium text-green-600">{transport.price}</span>
                            <span className="text-xs text-yellow-500">★ {transport.rating}</span>
                          </div>
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
                      <p className="text-purple-700 mb-6">Experience {searchData.to}'s finest dining and luxury accommodations:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getLuxuryRecommendations().map((rec, idx) => (
                          <div key={idx} className="bg-white/90 backdrop-blur rounded-xl p-5 border border-purple-200 hover:shadow-xl hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                {rec.type === 'restaurant' ? (
                                  <Utensils size={16} className="text-purple-600" />
                                ) : rec.type === 'hotel' ? (
                                  <MapPin size={16} className="text-purple-600" />
                                ) : (
                                  <Star size={16} className="text-purple-600" />
                                )}
                              </div>
                              <span className="text-xs font-medium text-purple-500 uppercase tracking-wide">{rec.type}</span>
                            </div>
                            
                            <h5 className="font-bold text-purple-900 mb-2 text-lg">{rec.name}</h5>
                            <p className="text-sm text-purple-700 mb-3 leading-relaxed">{rec.description}</p>
                            
                            {rec.specialFeatures && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {rec.specialFeatures.slice(0, 3).map((feature: string, featureIdx: number) => (
                                  <span key={featureIdx} className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">{rec.price}</span>
                              <span className="text-sm text-yellow-500 flex items-center gap-1">
                                <Star size={14} className="fill-current" />
                                {rec.rating}
                              </span>
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
                        <div className="space-y-4">
                          {itinerary.days.map((day, dayIdx) => (
                            <div key={dayIdx} className="bg-gray-50 p-4 rounded-lg">
                              <h6 className="text-gray-800 font-semibold mb-3">{day.title}</h6>
                              
                              {/* Activities */}
                              {day.activities && day.activities.length > 0 && (
                                <div className="space-y-2 mb-3">
                                  {day.activities.slice(0, 3).map((activity, actIdx) => (
                                    <div key={actIdx} className="flex items-start gap-3 text-xs">
                                      <span className="text-blue-600 font-medium min-w-[60px]">{activity.time}</span>
                                      <div className="flex-1">
                                        <div className="font-medium text-gray-800">{activity.title}</div>
                                        <div className="text-gray-600">{activity.description}</div>
                                        {activity.transport && (
                                          <div className="flex items-center gap-4 mt-1 text-gray-500">
                                            <span className="flex items-center gap-1">
                                              <Car size={12} />
                                              {activity.transport}
                                            </span>
                                            {activity.cost && (
                                              <span className="text-green-600 font-medium">{activity.cost}</span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  {day.activities.length > 3 && (
                                    <div className="text-xs text-gray-500 text-center pt-2">
                                      +{day.activities.length - 3} more activities...
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Budget and Transport Tips */}
                              <div className="flex justify-between items-center text-xs text-gray-600 pt-2 border-t border-gray-200">
                                {day.totalBudget && (
                                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                    Budget: {day.totalBudget}
                                  </span>
                                )}
                                {day.transportTips && (
                                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                                    <Train size={10} />
                                    {day.transportTips}
                                  </span>
                                )}
                              </div>
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
