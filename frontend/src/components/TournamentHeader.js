import React from 'react';

function TournamentHeader({ tournamentName, currentRound, totalRounds }) {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-8">
        {/* Floating decorative elements */}
        <div className="absolute left-4 top-4">
          <span className="text-6xl opacity-20 float-animation">💜</span>
        </div>
        <div className="absolute right-4 top-4">
          <span className="text-6xl opacity-20 float-animation" style={{animationDelay: '3s'}}>💛</span>
        </div>
        
        <div className="text-center relative">
          <h1 className="text-4xl md:text-5xl font-nunito font-bold mb-2">
            {tournamentName || "SOTO'S SYNDROME FUNDRAISER"}
          </h1>
          <p className="text-xl text-purple-100 font-inter">
            Pickleball Tournament • September 6th
          </p>
          
          {/* Awareness ribbon */}
          <div className="mt-4 inline-block">
            <svg width="60" height="80" viewBox="0 0 60 80" className="inline-block">
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
          
          {currentRound && (
            <div className="mt-4 inline-block bg-yellow-400 text-purple-900 px-6 py-2 rounded-full font-bold">
              Round {currentRound} of {totalRounds}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TournamentHeader;