import React, { useState } from 'react';
import { Plane, Calendar, Users, ArrowRightLeft } from 'lucide-react';
import { SearchData } from '../types';

interface FlightSearchProps {
  onSearch: (data: SearchData) => void;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onSearch }) => {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!from || !to || !departureDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (tripType === 'round-trip' && !returnDate) {
      alert('Please select a return date for round trip');
      return;
    }

    const searchData: SearchData = {
      from,
      to,
      departureDate,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      tripType,
      passengers
    };

    onSearch(searchData);
  };

  const swapCities = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const popularCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Goa', 'Kochi', 'Chandigarh'
  ];

  return (
    <form className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto mb-8" onSubmit={handleSubmit}>
      {/* Trip Type Toggle */}
      <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 bg-gray-100 p-1 rounded-lg w-full sm:w-fit">
        <button
          type="button"
          className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-all flex-1 sm:flex-initial text-center ${
            tripType === 'one-way'
              ? 'bg-white text-primary-600 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setTripType('one-way')}
        >
          One Way
        </button>
        <button
          type="button"
          className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-all flex-1 sm:flex-initial text-center ${
            tripType === 'round-trip'
              ? 'bg-white text-primary-600 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setTripType('round-trip')}
        >
          Round Trip
        </button>
      </div>

      {/* Search Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6 sm:mb-8 items-end">
        {/* From */}
        <div className="lg:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Plane size={16} className="text-primary-500" />
            From
          </label>
          <input
            type="text"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="Departure city"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            list="from-cities"
            required
          />
          <datalist id="from-cities">
            {popularCities.map(city => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center order-3 lg:order-2">
          <button
            type="button"
            className="p-2 sm:p-3 border-2 border-gray-200 rounded-full hover:border-primary-300 hover:bg-primary-50 transition-all group"
            onClick={swapCities}
            title="Swap cities"
          >
            <ArrowRightLeft size={18} className="text-gray-500 group-hover:text-primary-500 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* To */}
        <div className="lg:col-span-2 order-2 lg:order-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Plane size={16} className="text-primary-500 rotate-180" />
            To
          </label>
          <input
            type="text"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="Destination city"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            list="to-cities"
            required
          />
          <datalist id="to-cities">
            {popularCities.map(city => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </div>

        {/* Search Button */}
        <div className="order-4 col-span-full lg:col-span-1">
          <button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 sm:px-6 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
          >
            Search
          </button>
        </div>
      </div>

      {/* Date and Passenger Fields */}
      <div className={`grid gap-4 mb-6 sm:mb-8 ${tripType === 'round-trip' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {/* Departure Date */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="text-primary-500" />
            Departure
          </label>
          <input
            type="date"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {/* Return Date */}
        {tripType === 'round-trip' && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="text-primary-500" />
              Return
            </label>
            <input
              type="date"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={departureDate || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        )}

        {/* Passengers */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Users size={16} className="text-primary-500" />
            Passengers
          </label>
          <select
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Popular Routes */}
      <div className="border-t border-gray-200 pt-4 sm:pt-6 pb-2">
        <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Popular Routes</h4>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
          <button
            type="button"
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 rounded-full hover:from-primary-100 hover:to-secondary-100 transition-all border border-primary-200 hover:border-primary-300 text-sm sm:text-base text-center"
            onClick={() => { setFrom('Mumbai'); setTo('Delhi'); }}
          >
            Mumbai → Delhi
          </button>
          <button
            type="button"
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 rounded-full hover:from-primary-100 hover:to-secondary-100 transition-all border border-primary-200 hover:border-primary-300 text-sm sm:text-base text-center"
            onClick={() => { setFrom('Bangalore'); setTo('Mumbai'); }}
          >
            Bangalore → Mumbai
          </button>
          <button
            type="button"
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 rounded-full hover:from-primary-100 hover:to-secondary-100 transition-all border border-primary-200 hover:border-primary-300 text-sm sm:text-base text-center"
            onClick={() => { setFrom('Delhi'); setTo('Goa'); }}
          >
            Delhi → Goa
          </button>
          <button
            type="button"
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 rounded-full hover:from-primary-100 hover:to-secondary-100 transition-all border border-primary-200 hover:border-primary-300 text-sm sm:text-base text-center"
            onClick={() => { setFrom('Chennai'); setTo('Bangalore'); }}
          >
            Chennai → Bangalore
          </button>
        </div>
      </div>
    </form>
  );
};

export default FlightSearch;
