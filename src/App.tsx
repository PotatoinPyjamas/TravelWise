import React, { useState, useEffect } from 'react';
import FlightSearch from './components/FlightSearch';
import ConsentPopup from './components/ConsentPopup';
import AIRecommendations from './components/AIRecommendations';
import FlightResults from './components/FlightResults';
import { SearchData } from './types';

function App() {
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('travelConsentGiven');
    if (!consent) {
      setShowConsent(true);
    } else {
      setConsentGiven(true);
    }
  }, []);

  const handleConsentAccept = () => {
    localStorage.setItem('travelConsentGiven', 'true');
    setConsentGiven(true);
    setShowConsent(false);
  };

  const handleConsentDecline = () => {
    setShowConsent(false);
  };

  const handleSearch = (data: SearchData) => {
    setSearchData(data);
    setShowResults(true);
  };

  const handleBackToSearch = () => {
    setShowResults(false);
    setSearchData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">TravelWise</h1>
              <span className="text-primary-100 text-sm">Your Smart Travel Companion</span>
            </div>
            <nav className="flex gap-6">
              <a href="#flights" className="px-4 py-2 bg-white/20 rounded-lg font-medium hover:bg-white/30 transition-colors">
                Flights
              </a>
              <div className="relative group">
                <a href="#hotels" className="px-4 py-2 hover:bg-white/10 rounded-lg font-medium transition-colors cursor-pointer">
                  Hotels
                </a>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Hello! For the purpose of this MVP please only use the Flights tab :)
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
              <div className="relative group">
                <a href="#packages" className="px-4 py-2 hover:bg-white/10 rounded-lg font-medium transition-colors cursor-pointer">
                  Packages
                </a>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Hello! For the purpose of this MVP please only use the Flights tab :)
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {!showResults ? (
          <>
            <div className="bg-gradient-to-b from-primary-50 to-white py-16">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Find Your Perfect Flight</h2>
                <p className="text-xl text-gray-600 mb-12">Discover amazing destinations with personalized recommendations</p>
                <FlightSearch onSearch={handleSearch} />
              </div>
            </div>
            
            {searchData && (
              <AIRecommendations searchData={searchData} />
            )}
          </>
        ) : (
          <FlightResults 
            searchData={searchData!} 
            onBackToSearch={handleBackToSearch}
            showPersonalized={true}
          />
        )}
      </main>

      {showConsent && (
        <ConsentPopup
          onAccept={handleConsentAccept}
          onDecline={handleConsentDecline}
        />
      )}
    </div>
  );
}

export default App;