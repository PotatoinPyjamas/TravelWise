import React, { useState, useEffect } from 'react';
import FlightSearch from './components/FlightSearch';
import ConsentPopup from './components/ConsentPopup';
import AIRecommendations from './components/AIRecommendations';
import FlightResults from './components/FlightResults';
import { SearchData } from './types';
import { Menu, X } from 'lucide-react';

function App() {
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <header className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">TravelWise</h1>
              <span className="text-primary-100 text-xs sm:text-sm hidden sm:block">Your Smart Travel Companion</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-4 lg:gap-6">
              <a href="#flights" className="px-3 lg:px-4 py-2 bg-white/20 rounded-lg font-medium hover:bg-white/30 transition-colors text-sm lg:text-base">
                Flights
              </a>
              <div className="relative group">
                <a href="#hotels" className="px-3 lg:px-4 py-2 hover:bg-white/10 rounded-lg font-medium transition-colors cursor-pointer text-sm lg:text-base">
                  Hotels
                </a>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Hello! For the purpose of this MVP please only use the Flights tab :)
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
              <div className="relative group">
                <a href="#packages" className="px-3 lg:px-4 py-2 hover:bg-white/10 rounded-lg font-medium transition-colors cursor-pointer text-sm lg:text-base">
                  Packages
                </a>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Hello! For the purpose of this MVP please only use the Flights tab :)
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 mt-4 pt-4 pb-4">
              <nav className="flex flex-col space-y-3">
                <a 
                  href="#flights" 
                  className="px-4 py-2 bg-white/20 rounded-lg font-medium hover:bg-white/30 transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Flights
                </a>
                <div className="px-4 py-2 text-center text-white/70 text-sm">
                  Hotels & Packages coming soon!
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>
        {!showResults ? (
          <>
            <div className="bg-gradient-to-b from-primary-50 to-white py-8 sm:py-12 lg:py-16 min-h-screen">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Find Your Perfect Flight</h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 lg:mb-12">Discover amazing destinations with personalized recommendations</p>
                <div className="w-full">
                  <FlightSearch onSearch={handleSearch} />
                </div>
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