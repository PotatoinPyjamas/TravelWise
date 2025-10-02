import React from 'react';
import { X, MapPin, Utensils, Hotel, Car, Train, Calendar, Clock, Sun, Cloud, CloudRain, Activity, Camera, Music, ShoppingBag } from 'lucide-react';
import { SearchData, Recommendation, Itinerary, WeatherInfo } from '../types';

interface DetailedRecommendationsProps {
  searchData: SearchData;
  recommendations: Recommendation[];
  itineraries: Itinerary[];
  weather: WeatherInfo | null;
  travelOptions: any[];
  foodOptions: any[];
  onClose: () => void;
}

const DetailedRecommendations: React.FC<DetailedRecommendationsProps> = ({
  searchData,
  recommendations,
  itineraries,
  weather,
  travelOptions,
  foodOptions,
  onClose
}) => {
  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun': return <Sun size={24} className="text-yellow-500" />;
      case 'cloud': return <Cloud size={24} className="text-gray-500" />;
      case 'cloud-rain': return <CloudRain size={24} className="text-blue-500" />;
      default: return <Sun size={24} className="text-yellow-500" />;
    }
  };

  const getExtendedFoodOptions = () => [
    ...foodOptions,
    ...(searchData.to === 'Goa' ? [
      { name: 'Vindaloo', description: 'Spicy Portuguese-influenced curry', price: '₹220', type: 'local', rating: 4.5 },
      { name: 'Solkadhi', description: 'Refreshing kokum drink', price: '₹60', type: 'drink', rating: 4.3 },
      { name: 'Chorizo Pao', description: 'Goan sausage bread', price: '₹80', type: 'snack', rating: 4.4 },
      { name: 'Serradura', description: 'Sawdust pudding dessert', price: '₹100', type: 'dessert', rating: 4.2 }
    ] : [
      { name: 'Regional Curry', description: 'Authentic local curry preparation', price: '₹180', type: 'local', rating: 4.3 },
      { name: 'Local Beverage', description: 'Traditional regional drink', price: '₹50', type: 'drink', rating: 4.2 },
      { name: 'Street Snack', description: 'Popular local street food', price: '₹40', type: 'snack', rating: 4.4 },
      { name: 'Traditional Sweet', description: 'Famous regional dessert', price: '₹70', type: 'dessert', rating: 4.1 }
    ])
  ];

  const getExtendedActivities = () => {
    const baseActivities = [
      { name: 'Photography Walk', description: 'Capture the best spots with a local photographer', price: '₹1200', icon: 'camera', duration: '3 hours', rating: 4.6 },
      { name: 'Cultural Performance', description: 'Traditional music and dance show', price: '₹500', icon: 'music', duration: '2 hours', rating: 4.4 },
      { name: 'Shopping Tour', description: 'Visit local markets and artisan shops', price: '₹800', icon: 'shopping-bag', duration: '4 hours', rating: 4.3 },
      { name: 'Adventure Activity', description: 'Exciting outdoor adventure experience', price: '₹2000', icon: 'activity', duration: '5 hours', rating: 4.7 }
    ];

    if (searchData.to === 'Goa') {
      return [
        ...baseActivities,
        { name: 'Water Sports', description: 'Parasailing, jet skiing, and banana boat rides', price: '₹1500', icon: 'activity', duration: '3 hours', rating: 4.8 },
        { name: 'Sunset Cruise', description: 'Romantic boat ride with dinner', price: '₹2500', icon: 'activity', duration: '4 hours', rating: 4.9 },
        { name: 'Spice Plantation', description: 'Guided tour with traditional lunch', price: '₹800', icon: 'camera', duration: '6 hours', rating: 4.5 }
      ];
    }

    return baseActivities;
  };

  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case 'camera': return <Camera size={20} />;
      case 'music': return <Music size={20} />;
      case 'shopping-bag': return <ShoppingBag size={20} />;
      case 'activity': return <Activity size={20} />;
      default: return <Activity size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Complete Travel Guide for {searchData.to}</h2>
            <p className="text-primary-100 mt-1">Your personalized {Math.ceil((new Date(searchData.returnDate || searchData.departureDate).getTime() - new Date(searchData.departureDate).getTime()) / (1000 * 60 * 60 * 24)) || 3}-day travel companion</p>
          </div>
          <button 
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {weather && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-4 mb-4">
                  {getWeatherIcon(weather.icon)}
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800">{weather.temperature}</h3>
                    <p className="text-gray-600">{weather.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Live updates from Weather.com</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {/* Complete Itineraries */}
            <div>
              <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6">
                <Calendar size={24} className="text-green-500" />
                Complete Itineraries
              </h3>
              <div className="space-y-6">
                {itineraries.map((itinerary, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-semibold text-gray-800">{itinerary.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        itinerary.type === 'popular' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {itinerary.type === 'popular' ? '🌟 Popular Route' : '💎 Hidden Gems'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6">{itinerary.description}</p>
                    
                    <div className="space-y-4">
                      {itinerary.days.map((day, dayIdx) => (
                        <div key={dayIdx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold">Day {day.day}</span>
                            <h5 className="text-lg font-semibold text-gray-800">{day.title}</h5>
                          </div>
                          <div className="space-y-3">
                            {day.activities.map((activity, actIdx) => (
                              <div key={actIdx} className="bg-white rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                  <Clock size={14} />
                                  <span className="font-medium">{activity.time}</span>
                                </div>
                                <div>
                                  <h6 className="font-semibold text-gray-800 mb-1">{activity.title}</h6>
                                  <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{activity.location}</span>
                                    {activity.duration && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{activity.duration}</span>}
                                    {activity.cost && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">{activity.cost}</span>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {day.tips && day.tips.length > 0 && (
                            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <strong className="text-yellow-800 text-sm">Pro Tips:</strong>
                              <ul className="mt-2 space-y-1">
                                {day.tips.map((tip, tipIdx) => (
                                  <li key={tipIdx} className="text-yellow-700 text-sm">• {tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Food Guide */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6">
                  <Utensils size={24} className="text-orange-500" />
                  Complete Food Guide
                </h3>
                <div className="space-y-6">
                  {['local', 'street', 'dessert', 'drink', 'snack', 'seafood'].map(category => {
                    const categoryItems = getExtendedFoodOptions().filter(food => food.type === category);
                    if (categoryItems.length === 0) return null;
                    
                    return (
                      <div key={category} className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">{category.charAt(0).toUpperCase() + category.slice(1)} Specialties</h4>
                        <div className="space-y-3">
                          {categoryItems.map((food, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3">
                              <h5 className="font-medium text-gray-800">{food.name}</h5>
                              <p className="text-sm text-gray-600 mt-1">{food.description}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm font-medium text-green-600">{food.price}</span>
                                <span className="text-sm text-yellow-500">★ {food.rating}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activities & Experiences */}
              <div>
                <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6">
                  <Activity size={24} className="text-blue-500" />
                  Activities & Experiences
                </h3>
                <div className="space-y-4">
                  {getExtendedActivities().map((activity, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getActivityIcon(activity.icon)}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800">{activity.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{activity.price}</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{activity.duration}</span>
                            <span className="text-yellow-500">★ {activity.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Transportation Guide */}
              <div>
                <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6">
                  <Car size={24} className="text-purple-500" />
                  Getting Around
                </h3>
                <div className="space-y-4">
                  {travelOptions.map((option, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          {option.icon === 'car' ? <Car size={20} className="text-purple-600" /> : <Train size={20} className="text-purple-600" />}
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800">{option.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                          <span className="text-sm font-medium text-green-600">{option.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accommodation */}
              <div>
                <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6">
                  <Hotel size={24} className="text-pink-500" />
                  Where to Stay
                </h3>
                <div className="space-y-4">
                  {recommendations.filter(r => r.type === 'hotel').map((hotel, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                      <h5 className="font-semibold text-gray-800">{hotel.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">{hotel.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-yellow-500">★ {hotel.rating}</span>
                        <span className="text-sm font-medium text-green-600">{hotel.priceRange}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Must Visit Places */}
            <div>
              <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6">
                <MapPin size={24} className="text-red-500" />
                Must-Visit Attractions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.filter(r => r.type === 'attraction').map((attraction, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <h5 className="font-semibold text-gray-800">{attraction.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{attraction.description}</p>
                    {attraction.rating && (
                      <span className="text-sm text-yellow-500 mt-2 inline-block">★ {attraction.rating}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedRecommendations;
