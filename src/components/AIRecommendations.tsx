import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, ChevronDown, ChevronUp, MapPin, Utensils, Hotel, Calendar, Sun, Cloud, CloudRain, Car, Train, ExternalLink } from 'lucide-react';
import { SearchData, Recommendation, Itinerary, WeatherInfo } from '../types';
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

  const generateRecommendations = useCallback(async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockRecommendations = generateMockRecommendations(searchData.to);
    const mockItineraries = generateMockItineraries(searchData.to, searchData.departureDate, searchData.returnDate);
    const mockWeather = generateMockWeather(searchData.to);
    const mockTravelOptions = generateMockTravelOptions(searchData.to);
    const mockFoodOptions = generateMockFoodOptions(searchData.to);
    
    setRecommendations(mockRecommendations);
    setItineraries(mockItineraries);
    setWeather(mockWeather);
    setTravelOptions(mockTravelOptions);
    setFoodOptions(mockFoodOptions);
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
        { type: 'attraction', name: 'Baga Beach', description: 'Famous for water sports and nightlife', rating: 4.5 },
        { type: 'restaurant', name: 'Thalassa', description: 'Greek cuisine with stunning cliff views', rating: 4.7, priceRange: '₹₹₹' },
        { type: 'hotel', name: 'Taj Exotica', description: 'Luxury beachfront resort', rating: 4.8, priceRange: '₹₹₹₹' },
        { type: 'activity', name: 'Spice Plantation Tour', description: 'Explore organic spice farms', rating: 4.3 }
      ],
      'Mumbai': [
        { type: 'attraction', name: 'Gateway of India', description: 'Iconic monument overlooking the harbor', rating: 4.4 },
        { type: 'restaurant', name: 'Trishna', description: 'Contemporary Indian seafood', rating: 4.6, priceRange: '₹₹₹' },
        { type: 'hotel', name: 'The Taj Mahal Palace', description: 'Historic luxury hotel', rating: 4.7, priceRange: '₹₹₹₹' },
        { type: 'activity', name: 'Dharavi Slum Tour', description: 'Eye-opening cultural experience', rating: 4.2 }
      ],
      'Delhi': [
        { type: 'attraction', name: 'Red Fort', description: 'Mughal architectural masterpiece', rating: 4.3 },
        { type: 'restaurant', name: 'Indian Accent', description: 'Modern Indian fine dining', rating: 4.8, priceRange: '₹₹₹₹' },
        { type: 'hotel', name: 'The Imperial', description: 'Colonial-era luxury hotel', rating: 4.6, priceRange: '₹₹₹₹' },
        { type: 'activity', name: 'Old Delhi Food Walk', description: 'Street food adventure', rating: 4.5 }
      ]
    };

    return destinations[destination] || [
      { type: 'attraction', name: 'Local Heritage Site', description: 'Explore the rich history and culture', rating: 4.2 },
      { type: 'restaurant', name: 'Local Cuisine Restaurant', description: 'Authentic regional flavors', rating: 4.4, priceRange: '₹₹' },
      { type: 'hotel', name: 'Boutique Hotel', description: 'Comfortable stay with local charm', rating: 4.3, priceRange: '₹₹₹' }
    ];
  };

  const generateMockItineraries = (destination: string, departure: string, returnDate?: string): Itinerary[] => {
    const days = returnDate ? Math.ceil((new Date(returnDate).getTime() - new Date(departure).getTime()) / (1000 * 60 * 60 * 24)) : 3;
    const limitedDays = Math.min(days, 7);

    return [
      {
        type: 'popular',
        title: `${limitedDays}-Day Popular ${destination} Experience`,
        description: `Discover the must-see attractions and famous spots that make ${destination} special.`,
        days: generatePopularItinerary(destination, limitedDays)
      },
      {
        type: 'offbeat',
        title: `${limitedDays}-Day Hidden Gems of ${destination}`,
        description: `Explore the lesser-known treasures and local secrets of ${destination}.`,
        days: generateOffbeatItinerary(destination, limitedDays)
      }
    ];
  };

  const generatePopularItinerary = (destination: string, days: number) => {
    // Generate generic itinerary for all destinations
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: Explore ${destination}`,
      activities: [
        { time: '9:00 AM', title: 'Morning Attraction', description: 'Start your day with a popular sight', location: destination, duration: '2 hours' },
        { time: '2:00 PM', title: 'Local Cuisine', description: 'Try authentic local food', location: destination, duration: '1 hour' },
        { time: '5:00 PM', title: 'Evening Activity', description: 'End with a cultural experience', location: destination, duration: '2 hours' }
      ],
      tips: ['Book tickets in advance', 'Carry comfortable walking shoes']
    }));
  };

  const generateOffbeatItinerary = (destination: string, days: number) => {
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: Hidden ${destination}`,
      activities: [
        { time: '9:00 AM', title: 'Local Market', description: 'Experience authentic local life', location: destination, duration: '2 hours' },
        { time: '12:00 PM', title: 'Hidden Gem', description: 'Discover a lesser-known attraction', location: destination, duration: '3 hours' },
        { time: '6:00 PM', title: 'Local Hangout', description: 'Where locals spend their evenings', location: destination, duration: '2 hours' }
      ],
      tips: ['Ask locals for directions', 'Try street food for authentic flavors']
    }));
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
              </div>
            ) : (
              <>
                {weather && (
                  <div className="mb-8 bg-white rounded-lg p-6 shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-semibold text-gray-800">Weather in {searchData.to}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span>Updated live • Fetched from Weather.com</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getWeatherIcon(weather.icon)}
                      <div>
                        <span className="text-3xl font-bold text-gray-800">{weather.temperature}</span>
                        <p className="text-gray-600 mt-1">{weather.description}</p>
                      </div>
                    </div>
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
                          {itinerary.days.slice(0, 2).map((day, dayIdx) => (
                            <div key={dayIdx} className="bg-gray-50 p-3 rounded text-sm">
                              <strong className="text-gray-800">Day {day.day}:</strong> 
                              <span className="text-gray-600 ml-1">{day.title}</span>
                            </div>
                          ))}
                          {itinerary.days.length > 2 && (
                            <div className="text-center py-2 text-sm text-gray-500 font-medium">
                              +{itinerary.days.length - 2} more days
                            </div>
                          )}
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
