
import React from 'react';
import { GroundingChunk } from '../types';

interface GroundingSourcesProps {
  chunks: GroundingChunk[];
}

const WebSourceIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 flex-shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0112 13.5c-2.998 0-5.74-1.1-7.843-2.918" />
    </svg>
);

const MapSourceIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 flex-shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);


const GroundingSources: React.FC<GroundingSourcesProps> = ({ chunks }) => {
  if (!chunks || chunks.length === 0) return null;

  return (
    <div className="mt-2 w-auto max-w-xl">
      <h4 className="text-xs text-gray-400 font-semibold mb-1">Sources:</h4>
      <div className="flex flex-wrap gap-2">
        {chunks.map((chunk, index) => {
          if (chunk.web) {
            return (
              <a key={`web-${index}`} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gray-600 hover:bg-gray-500 text-gray-200 text-xs rounded-full px-3 py-1 transition-colors">
                <WebSourceIcon/>
                <span className="truncate">{chunk.web.title}</span>
              </a>
            );
          }
          if (chunk.maps) {
            return (
               <a key={`map-${index}`} href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="flex items-center bg-green-700 hover:bg-green-600 text-white text-xs rounded-full px-3 py-1 transition-colors">
                <MapSourceIcon/>
                <span className="truncate">{chunk.maps.title}</span>
              </a>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default GroundingSources;
