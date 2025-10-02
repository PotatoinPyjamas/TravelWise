# TravelWise - Smart Travel Booking Platform

A MakeMyTrip-inspired travel booking clone focused on flight booking with AI-powered personalized recommendations.

## 🌟 Features

### Core Functionality
- **Flight Search**: Search for one-way and round-trip flights between cities
- **Smart Filters**: Filter flights by price (cheapest) and duration (fastest)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### AI-Powered Personalization
- **Consent-Based Personalization**: Non-intrusive consent popup for data usage
- **Smart Recommendations**: Personalized suggestions for attractions, restaurants, and hotels
- **Curated Itineraries**: Popular and offbeat travel itineraries (up to 7 days)
- **Weather Integration**: Real-time weather information for destinations
- **Cross-Selling**: Budget-friendly and luxury recommendations based on flight choices

### User Experience
- **Modern UI**: Clean, intuitive interface with gradient color scheme
- **Expandable AI Tab**: Non-intrusive recommendations that expand on demand
- **Smart Travel Tips**: Context-aware tips embedded in itineraries
- **Popular Routes**: Quick selection of frequently traveled routes

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd travel-booking-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: CSS3 with custom properties and animations
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Create React App

## 📱 Key Components

### FlightSearch
- Interactive search form with city autocomplete
- One-way/Round-trip toggle
- Date selection with validation
- Popular routes quick selection

### ConsentPopup
- GDPR-compliant consent management
- Clear benefits explanation
- Non-intrusive design
- Persistent storage of user preference

### AIRecommendations
- Expandable recommendation panel
- Weather information display
- Categorized recommendations (attractions, restaurants, hotels)
- Dual itinerary system (popular vs offbeat)

### FlightResults
- Real-time flight search simulation
- Advanced filtering options
- Cross-selling recommendations
- Luxury options toggle

## 🎨 Design Philosophy

- **User-Centric**: Prioritizes user experience and ease of use
- **Non-Intrusive**: Personalization features are optional and clearly explained
- **Modern**: Clean, contemporary design with smooth animations
- **Accessible**: Responsive design that works across all devices
- **Performance**: Optimized for fast loading and smooth interactions

## 🔧 Customization

### Adding New Cities
Update the `popularCities` array in `FlightSearch.tsx` to add more cities to the autocomplete.

### Modifying Recommendations
Edit the mock data generators in `AIRecommendations.tsx` to customize recommendations for different destinations.

### Styling Changes
All styles are contained in component-specific CSS files. The main color scheme can be modified in `App.css`.

## 📈 Future Enhancements

- Real API integration for flights and weather
- User authentication and profile management
- Booking and payment processing
- Advanced filtering (airlines, stops, price range)
- Social features and reviews
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by MakeMyTrip's user interface and functionality
- Icons provided by Lucide React
- Built with Create React App for rapid development