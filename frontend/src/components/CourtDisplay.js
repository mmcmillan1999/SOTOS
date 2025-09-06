import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function CourtDisplay({ roundData, currentRound, isAdmin, onScoreSubmit, players, tournamentData, currentEnv, viewingRound, setViewingRound }) {
  const [scores, setScores] = useState({});
  const [allRounds, setAllRounds] = useState([]);
  
  useEffect(() => {
    // Load all rounds data from tournament schedule
    if (tournamentData) {
      setAllRounds(tournamentData.schedule || []);
    }
  }, [tournamentData]);
  
  // Get player name by ID
  const getPlayerName = (playerId) => {
    const player = players?.find(p => p.id === playerId);
    return player?.name || `Player ${playerId}`;
  };
  
  // Determine which round to display
  const displayRound = viewingRound || currentRound;
  const displayRoundData = viewingRound 
    ? allRounds[viewingRound - 1] 
    : roundData;
  
  // Navigation functions
  const canGoBack = displayRound > 1;
  const canGoForward = displayRound < 10;
  
  const navigateRound = (direction) => {
    const newRound = displayRound + direction;
    if (newRound >= 1 && newRound <= 10) {
      if (newRound === currentRound) {
        setViewingRound(null); // Back to current
      } else {
        setViewingRound(newRound);
      }
    }
  };

  const handleScoreChange = (courtIndex, team, value) => {
    setScores(prev => ({
      ...prev,
      [`court${courtIndex}_team${team}`]: value
    }));
  };

  const submitScore = (courtIndex) => {
    const team1Score = scores[`court${courtIndex}_team1`];
    const team2Score = scores[`court${courtIndex}_team2`];
    
    if (!team1Score || !team2Score) {
      alert('Please enter scores for both teams');
      return;
    }
    
    onScoreSubmit(displayRound, courtIndex, team1Score, team2Score);
    
    // Clear scores after submission
    setScores(prev => ({
      ...prev,
      [`court${courtIndex}_team1`]: '',
      [`court${courtIndex}_team2`]: ''
    }));
  };

  // Get next round data for preview
  const nextRound = currentRound < 10 ? currentRound + 1 : null;
  const nextRoundData = nextRound ? allRounds[nextRound - 1] : null;

  if (!displayRoundData && !tournamentData) return null;

  return (
    <div className="mb-4">
      {/* Round Navigation Header */}
      <div className="bg-purple-100 rounded-lg p-3 mb-4 flex items-center justify-between">
        <button
          onClick={() => navigateRound(-1)}
          disabled={!canGoBack}
          className={`p-2 rounded-lg transition-colors ${
            canGoBack 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          ←
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-nunito font-bold text-purple-800">
            Round {displayRound}
          </h2>
          {viewingRound && viewingRound !== currentRound && (
            <p className="text-xs text-purple-600">
              (Viewing history - Current: Round {currentRound})
            </p>
          )}
        </div>
        
        <button
          onClick={() => navigateRound(1)}
          disabled={!canGoForward}
          className={`p-2 rounded-lg transition-colors ${
            canGoForward 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          →
        </button>
      </div>
      
      {/* Current Round Courts - 3x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayRoundData?.courts?.map((court, index) => {
          const [p1, p2, p3, p4] = court;
          const isCurrentRound = displayRound === currentRound;
          
          return (
            <div key={index} className="bg-white rounded-lg border-2 border-purple-200 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-2">
                <h3 className="font-nunito font-bold text-center text-sm">
                  Court {index + 1}
                </h3>
              </div>
              
              <div className="p-3">
                {/* Team 1 */}
                <div className="bg-purple-50 rounded-lg p-2 mb-2 border border-purple-200">
                  <p className="text-xs font-semibold text-center text-purple-700 mb-1">Team 1</p>
                  <div className="space-y-1">
                    <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-purple-900 text-center">
                      {getPlayerName(p1)}
                    </div>
                    <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-purple-900 text-center">
                      {getPlayerName(p2)}
                    </div>
                  </div>
                </div>
                
                {/* VS */}
                <div className="text-center py-1">
                  <span className="text-purple-600 font-bold text-xs">VS</span>
                </div>
                
                {/* Team 2 */}
                <div className="bg-yellow-50 rounded-lg p-2 mb-2 border border-yellow-300">
                  <p className="text-xs font-semibold text-center text-yellow-700 mb-1">Team 2</p>
                  <div className="space-y-1">
                    <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-purple-900 text-center">
                      {getPlayerName(p3)}
                    </div>
                    <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-purple-900 text-center">
                      {getPlayerName(p4)}
                    </div>
                  </div>
                </div>
                
                {/* Score Input (Admin Only, Current Round Only) */}
                {isAdmin && isCurrentRound && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="T1"
                        min="0"
                        max="13"
                        value={scores[`court${index}_team1`] || ''}
                        onChange={(e) => handleScoreChange(index, 1, e.target.value)}
                        className="w-1/2 px-2 py-1 border border-purple-300 rounded text-center text-sm"
                      />
                      <input
                        type="number"
                        placeholder="T2"
                        min="0"
                        max="13"
                        value={scores[`court${index}_team2`] || ''}
                        onChange={(e) => handleScoreChange(index, 2, e.target.value)}
                        className="w-1/2 px-2 py-1 border border-yellow-300 rounded text-center text-sm"
                      />
                    </div>
                    <button
                      onClick={() => submitScore(index)}
                      className="w-full bg-purple-600 text-white py-1 rounded hover:bg-purple-700 transition-colors text-xs font-semibold"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Bye Players Card */}
        {displayRoundData?.byePlayers && (
          <div className="bg-gray-100 rounded-lg border-2 border-gray-300 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-2">
              <h3 className="font-nunito font-bold text-center text-sm">
                Bye Players
              </h3>
            </div>
            <div className="p-3">
              <div className="space-y-2">
                {displayRoundData.byePlayers.map(playerId => (
                  <div key={playerId} className="bg-yellow-100 px-3 py-2 rounded text-sm font-semibold text-purple-900 text-center border border-yellow-300">
                    {getPlayerName(playerId)}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center italic">
                Sitting out this round
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Next Round Preview */}
      {nextRoundData && displayRound === currentRound && (
        <div className="mt-6">
          <h3 className="text-lg font-nunito font-bold text-purple-800 mb-3">
            On Deck - Round {nextRound}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 opacity-75">
            {nextRoundData.courts?.map((court, index) => {
              const [p1, p2, p3, p4] = court;
              return (
                <div key={index} className="bg-purple-50 rounded-lg p-2 border border-purple-200">
                  <p className="text-xs font-bold text-center text-purple-700 mb-1">Court {index + 1}</p>
                  <div className="text-xs text-center">
                    <span className="font-semibold">{getPlayerName(p1)} & {getPlayerName(p2)}</span>
                    <span className="mx-1 text-purple-600">vs</span>
                    <span className="font-semibold">{getPlayerName(p3)} & {getPlayerName(p4)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourtDisplay;