import React from 'react';

function TournamentHeader({ tournamentName }) {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4">
          {/* Awareness ribbon - smaller */}
          <svg width="30" height="40" viewBox="0 0 60 80" className="inline-block">
            <path 
              d="M15 10 Q10 20 15 30 L20 50 Q25 60 30 70 Q35 60 40 50 L45 30 Q50 20 45 10 Q40 5 30 5 Q20 5 15 10" 
              fill="#FCD34D" 
              stroke="#8B5CF6" 
              strokeWidth="2"
            />
            <path 
              d="M25 10 Q20 20 25 30 L30 50 Q35 60 40 70 Q45 60 50 50 L55 30 Q60 20 55 10" 
              fill="#8B5CF6" 
              opacity="0.8"
            />
          </svg>
          
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-nunito font-bold">
              {tournamentName || "SOTOS SYNDROME FUNDRAISER"}
            </h1>
            <p className="text-sm text-purple-100 font-inter">
              Pickleball Tournament • September 6th
            </p>
          </div>
          
          {/* Mirror ribbon */}
          <svg width="30" height="40" viewBox="0 0 60 80" className="inline-block">
            <path 
              d="M15 10 Q10 20 15 30 L20 50 Q25 60 30 70 Q35 60 40 50 L45 30 Q50 20 45 10 Q40 5 30 5 Q20 5 15 10" 
              fill="#FCD34D" 
              stroke="#8B5CF6" 
              strokeWidth="2"
            />
            <path 
              d="M25 10 Q20 20 25 30 L30 50 Q35 60 40 70 Q45 60 50 50 L55 30 Q60 20 55 10" 
              fill="#8B5CF6" 
              opacity="0.8"
            />
          </svg>
        </div>
      </div>
    </header>
  );
}

export default TournamentHeader;