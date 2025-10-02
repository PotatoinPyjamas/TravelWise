export interface SearchData {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'one-way' | 'round-trip';
  passengers: number;
}

export interface FlightResult {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    time: string;
    airport: string;
    city: string;
  };
  arrival: {
    time: string;
    airport: string;
    city: string;
  };
  duration: string;
  price: number;
  stops: number;
  aircraft: string;
}

export interface Recommendation {
  type: 'attraction' | 'restaurant' | 'hotel' | 'activity';
  name: string;
  description: string;
  rating?: number;
  priceRange?: string;
  category?: string;
  cuisine?: string;
  amenities?: string[];
  duration?: string;
  price?: string;
}

export interface Itinerary {
  type: 'popular' | 'offbeat';
  title: string;
  description: string;
  days: ItineraryDay[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: ItineraryActivity[];
  tips?: string[];
}

export interface ItineraryActivity {
  time: string;
  title: string;
  description: string;
  location: string;
  duration?: string;
  cost?: string;
  tips?: string[];
}

export interface WeatherInfo {
  condition: string;
  temperature: string;
  description: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
  feelsLike?: string;
  location?: string;
  localTime?: string;
  travelTips?: string[];
  conditionCode?: number;
}
