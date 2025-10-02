import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plane, Clock, Filter, DollarSign, Sparkles } from 'lucide-react';
import { SearchData, FlightResult } from '../types';
import AIRecommendations from './AIRecommendations';

interface FlightResultsProps {
  searchData: SearchData;
  onBackToSearch: () => void;
  showPersonalized: boolean;
}

const FlightResults: React.FC<FlightResultsProps> = ({ 
  searchData, 
  onBackToSearch, 
  showPersonalized 
}) => {
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<FlightResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'cheapest' | 'fastest'>('all');

  useEffect(() => {
    generateMockFlights();
  }, [searchData]);

  useEffect(() => {
    applyFilters();
  }, [flights, activeFilter]);

  const generateMockFlights = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockFlights: FlightResult[] = [
      {
        id: '1',
        airline: 'IndiGo',
        flightNumber: '6E 123',
        departure: { time: '06:30', airport: 'BOM', city: searchData.from },
        arrival: { time: '08:45', airport: 'DEL', city: searchData.to },
        duration: '2h 15m',
        price: 4500,
        stops: 0,
        aircraft: 'A320'
      },
      {
        id: '2',
        airline: 'Air India',
        flightNumber: 'AI 456',
        departure: { time: '09:15', airport: 'BOM', city: searchData.from },
        arrival: { time: '11:45', airport: 'DEL', city: searchData.to },
        duration: '2h 30m',
        price: 5200,
        stops: 0,
        aircraft: 'B737'
      },
      {
        id: '3',
        airline: 'SpiceJet',
        flightNumber: 'SG 789',
        departure: { time: '14:20', airport: 'BOM', city: searchData.from },
        arrival: { time: '16:50', airport: 'DEL', city: searchData.to },
        duration: '2h 30m',
        price: 3800,
        stops: 0,
        aircraft: 'B737'
      },
      {
        id: '4',
        airline: 'Vistara',
        flightNumber: 'UK 101',
        departure: { time: '18:00', airport: 'BOM', city: searchData.from },
        arrival: { time: '20:25', airport: 'DEL', city: searchData.to },
        duration: '2h 25m',
        price: 6800,
        stops: 0,
        aircraft: 'A320neo'
      },
      {
        id: '5',
        airline: 'GoAir',
        flightNumber: 'G8 202',
        departure: { time: '12:30', airport: 'BOM', city: searchData.from },
        arrival: { time: '16:15', airport: 'DEL', city: searchData.to },
        duration: '3h 45m',
        price: 3200,
        stops: 1,
        aircraft: 'A320'
      }
    ];
    
    setFlights(mockFlights);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...flights];
    
    switch (activeFilter) {
      case 'cheapest':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'fastest':
        filtered = filtered.sort((a, b) => {
          const aDuration = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1]);
          const bDuration = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1]);
          return aDuration - bDuration;
        });
        break;
      default:
        filtered = filtered.sort((a, b) => a.price - b.price);
    }
    
    setFilteredFlights(filtered);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center gap-4">
              <button 
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={onBackToSearch}
              >
                <ArrowLeft size={20} />
                Back to Search
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">Searching Flights...</h2>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-6"></div>
          <p className="text-gray-600 text-lg">Finding the best flights for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
            <button 
              className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
              onClick={onBackToSearch}
            >
              <ArrowLeft size={20} />
              Back to Search
            </button>
            <div>
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">{searchData.from} → {searchData.to}</h2>
              <p className="text-sm sm:text-base text-gray-600">{searchData.departureDate} • {searchData.passengers} passenger{searchData.passengers > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Filter Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl shadow-md">
            <button 
              className={`flex items-center justify-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base flex-1 sm:flex-initial ${
                activeFilter === 'all' 
                  ? 'bg-primary-500 text-white shadow-lg' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              <Filter size={14} className="sm:w-4 sm:h-4" />
              All Flights
            </button>
            <button 
              className={`flex items-center justify-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base flex-1 sm:flex-initial ${
                activeFilter === 'cheapest' 
                  ? 'bg-primary-500 text-white shadow-lg' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveFilter('cheapest')}
            >
              <DollarSign size={14} className="sm:w-4 sm:h-4" />
              Cheapest
            </button>
            <button 
              className={`flex items-center justify-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base flex-1 sm:flex-initial ${
                activeFilter === 'fastest' 
                  ? 'bg-primary-500 text-white shadow-lg' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveFilter('fastest')}
            >
              <Clock size={14} className="sm:w-4 sm:h-4" />
              Fastest
            </button>
          </div>
        </div>

        {/* AI Recommendations Section */}
        {showPersonalized && (
          <div className="mb-8">
            <AIRecommendations searchData={searchData} />
          </div>
        )}

        {/* Flight Results */}
        <div className="space-y-4">
          {filteredFlights.map((flight) => (
            <div key={flight.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">{flight.airline}</h4>
                    <span className="text-gray-500 text-sm">{flight.flightNumber}</span>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{flight.departure.time}</div>
                      <div className="text-gray-500 text-sm font-medium">{flight.departure.airport}</div>
                    </div>
                    
                    <div className="flex-1 relative">
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 -translate-y-1/2"></div>
                      <div className="relative bg-white flex flex-col items-center">
                        <Plane size={20} className="text-primary-500 bg-white px-1" />
                        <div className="text-center mt-2">
                          <div className="text-sm font-medium text-gray-600">{flight.duration}</div>
                          {flight.stops > 0 && (
                            <div className="text-xs text-red-500 mt-1">{flight.stops} stop{flight.stops > 1 ? 's' : ''}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{flight.arrival.time}</div>
                      <div className="text-gray-500 text-sm font-medium">{flight.arrival.airport}</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center lg:text-right lg:ml-8 flex-shrink-0">
                  <div className="text-3xl font-bold text-gray-800 mb-4">{formatPrice(flight.price)}</div>
                  <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 text-sm sm:text-base w-full sm:w-auto">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
