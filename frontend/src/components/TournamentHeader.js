import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

function TournamentHeader({ tournamentName, currentRound, viewingRound, setViewingRound }) {
  const displayRound = viewingRound || currentRound;
  const canGoBack = displayRound > 1;
  const canGoForward = displayRound < 10;
  
  const navigateRound = (direction) => {
    const newRound = displayRound + direction;
    if (newRound >= 1 && newRound <= 10) {
      if (newRound === currentRound) {
        setViewingRound(null);
      } else {
        setViewingRound(newRound);
      }
    }
  };
  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Round Navigation - Compact Left */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateRound(-1)}
              disabled={!canGoBack}
              className={`p-1 rounded text-xs transition-colors ${
                canGoBack 
                  ? 'bg-purple-500 text-white hover:bg-purple-400' 
                  : 'bg-purple-800 text-purple-400 cursor-not-allowed'
              }`}
            >
              ←
            </button>
            <div className="text-white text-sm font-bold">
              Round {displayRound || 1}
            </div>
            <button
              onClick={() => navigateRound(1)}
              disabled={!canGoForward}
              className={`p-1 rounded text-xs transition-colors ${
                canGoForward 
                  ? 'bg-purple-500 text-white hover:bg-purple-400' 
                  : 'bg-purple-800 text-purple-400 cursor-not-allowed'
              }`}
            >
              →
            </button>
          </div>
          
          {/* Title with Ribbons - Center */}
          <div className="flex items-center justify-center gap-3">
            {/* QR Code - Permanent Display */}
            <div className="bg-white p-1 rounded">
              <QRCodeSVG 
                value="https://sotos-tournament.netlify.app"
                size={40}
                level="M"
                fgColor="#8B5CF6"
                bgColor="#FFFFFF"
              />
            </div>
            {/* Awareness ribbon - smaller */}
            <svg width="25" height="35" viewBox="0 0 60 80" className="inline-block">
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
              <h1 className="text-xl md:text-2xl font-nunito font-bold">
                {tournamentName || "SOTOS SYNDROME FUNDRAISER"}
              </h1>
              <p className="text-xs text-purple-100 font-inter">
                Pickleball Tournament • September 6th
              </p>
            </div>
            
            {/* Mirror ribbon */}
            <svg width="25" height="35" viewBox="0 0 60 80" className="inline-block">
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
          
          {/* Leaderboard Header - Right */}
          <div className="text-white font-bold text-sm">
            🏆 Leaderboard
          </div>
        </div>
      </div>
    </header>
  );
}

export default TournamentHeader;