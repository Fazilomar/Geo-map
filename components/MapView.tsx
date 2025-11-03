import React from 'react';
import { Location } from '../types';

interface MapViewProps {
  location: Location | null;
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
}

const MyLocationIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25c-1.928 0-3.487 1.56-3.487 3.488 0 1.928 1.56 3.488 3.487 3.488s3.487-1.56 3.487-3.488c0-1.928-1.56-3.488-3.487-3.488z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0 4.142-3.358 7.5-7.5 7.5s-7.5-3.358-7.5-7.5 3.358-7.5 7.5-7.5 7.5 3.358 7.5 7.5z" />
    </svg>
);

const MapView: React.FC<MapViewProps> = ({ location, loading, error, onRefetch }) => {
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-lg">Fetching your location...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-400 p-4">
          <p className="font-bold">Could not get location</p>
          <p className="text-sm">{error}</p>
          <p className="text-sm mt-2 text-gray-400">Map features will be disabled.</p>
        </div>
      );
    }
    
    if (location) {
      const mapSrc = `https://www.google.com/maps?q=${location.latitude},${location.longitude}&hl=en&z=15&output=embed`;
      return (
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          className="border-0"
          allowFullScreen={false}
          loading="lazy"
          title="User Location Map"
        ></iframe>
      );
    }
    
    return <div className="flex items-center justify-center h-full">Map will be displayed here.</div>;
  };

  return (
    <div className="relative bg-gray-800 rounded-lg shadow-lg w-full h-full text-white">
      {renderContent()}
      {!loading && location?.accuracy != null && (
        <div
          className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white text-xs rounded-full px-3 py-1 shadow-lg pointer-events-none"
          aria-live="polite"
          title={`Location accuracy is within ${Math.round(location.accuracy)} meters`}
        >
          Accuracy: {Math.round(location.accuracy)}m
        </div>
      )}
      {!loading && (
        <button
          onClick={onRefetch}
          className="absolute bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-gray-500 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 shadow-lg"
          aria-label="Refetch your current location"
          title="Refetch your current location"
        >
          <MyLocationIcon />
        </button>
      )}
    </div>
  );
};

export default MapView;
