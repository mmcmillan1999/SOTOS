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
      {/* Current Round Courts - 3x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayRoundData?.courts?.map((court, index) => {
          const [p1, p2, p3, p4] = court;
          const isCurrentRound = displayRound === currentRound;
          const matchKey = `${displayRound}-${index}`;
          const savedScore = tournamentData?.matchScores?.[matchKey];
          const hasScore = savedScore && (savedScore.team1Score !== undefined || savedScore.team2Score !== undefined);
          
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
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-purple-700">Team 1</p>
                    {hasScore ? (
                      <span className="text-lg font-bold text-purple-900">{savedScore.team1Score}</span>
                    ) : (
                      isAdmin && isCurrentRound && (
                        <input
                          type="number"
                          placeholder="Score"
                          min="0"
                          max="13"
                          value={scores[`court${index}_team1`] || ''}
                          onChange={(e) => handleScoreChange(index, 1, e.target.value)}
                          className="w-16 px-1 py-0.5 border border-purple-300 rounded text-center text-sm"
                        />
                      )
                    )}
                  </div>
                  <div className="space-y-1 mt-1">
                    <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-purple-900 text-center">
                      {getPlayerName(p1)}
                    </div>
                    <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-purple-900 text-center">
                      {getPlayerName(p2)}
                    </div>
                  </div>
                </div>
                
                {/* Team 2 */}
                <div className="bg-yellow-50 rounded-lg p-2 mb-2 border border-yellow-300">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-yellow-700">Team 2</p>
                    {hasScore ? (
                      <span className="text-lg font-bold text-purple-900">{savedScore.team2Score}</span>
                    ) : (
                      isAdmin && isCurrentRound && (
                        <input
                          type="number"
                          placeholder="Score"
                          min="0"
                          max="13"
                          value={scores[`court${index}_team2`] || ''}
                          onChange={(e) => handleScoreChange(index, 2, e.target.value)}
                          className="w-16 px-1 py-0.5 border border-yellow-300 rounded text-center text-sm"
                        />
                      )
                    )}
                  </div>
                  <div className="space-y-1 mt-1">
                    <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-purple-900 text-center">
                      {getPlayerName(p3)}
                    </div>
                    <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-purple-900 text-center">
                      {getPlayerName(p4)}
                    </div>
                  </div>
                </div>
                
                {/* Submit Button (Admin Only, Current Round Only, No Score Yet) */}
                {isAdmin && isCurrentRound && !hasScore && (
                  <button
                    onClick={() => submitScore(index)}
                    className="w-full bg-purple-600 text-white py-1 rounded hover:bg-purple-700 transition-colors text-xs font-semibold"
                  >
                    Submit Score
                  </button>
                )}
                
                {/* Winner Indicator */}
                {hasScore && (
                  <div className="text-center mt-2">
                    <span className="text-xs font-semibold text-green-600">
                      {savedScore.team1Score > savedScore.team2Score ? 'Team 1 Wins!' : 'Team 2 Wins!'}
                    </span>
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