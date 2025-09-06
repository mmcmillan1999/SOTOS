import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function CourtDisplay({ roundData, currentRound, isAdmin, onScoreSubmit, players, tournamentData, currentEnv, viewingRound, setViewingRound }) {
  const [scores, setScores] = useState({});
  const [editingScore, setEditingScore] = useState(null);
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
            <div key={index} className="bg-white rounded-lg border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 shadow-md">
                <h3 className="font-nunito font-bold text-center text-base">
                  Court {index + 1}
                </h3>
              </div>
              
              <div className="p-3">
                {/* Team 1 */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 mb-2 border border-purple-300 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-purple-700">Team 1</p>
                      {/* Serve indicator */}
                      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" className="text-purple-600" title="Serves first">
                        {/* ball */}
                        <circle cx="7.5" cy="8" r="2.2" fill="currentColor"/>
                        {/* curved arrow */}
                        <path d="M2.2 9.6c.9 2.8 4.2 4.3 7 3.3a6 6 0 0 0 3.6-3.2"
                              fill="none" stroke="currentColor" strokeWidth="1.6"
                              strokeLinecap="round"/>
                        <path d="M12.9 7.5l1.6.9l-1 1.6" fill="none"
                              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
                              strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {hasScore && editingScore !== matchKey ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-bold text-purple-900">{savedScore.team1Score}</span>
                        {isAdmin && isCurrentRound && (
                          <button
                            onClick={() => {
                              setEditingScore(matchKey);
                              setScores({
                                ...scores,
                                [`court${index}_team1`]: savedScore.team1Score.toString(),
                                [`court${index}_team2`]: savedScore.team2Score.toString()
                              });
                            }}
                            className="text-purple-400 hover:text-purple-600 text-xs"
                            title="Edit score"
                          >
                            ✏️
                          </button>
                        )}
                      </div>
                    ) : (
                      isAdmin && isCurrentRound && (
                        <input
                          type="number"
                          placeholder="Score"
                          min="0"
                          max="13"
                          value={scores[`court${index}_team1`] || ''}
                          onChange={(e) => handleScoreChange(index, 1, e.target.value)}
                          className="w-18 px-2 py-1 border-2 border-purple-300 rounded text-center text-base font-semibold"
                        />
                      )
                    )}
                  </div>
                  <div className="space-y-1 mt-1">
                    <div className="bg-white px-3 py-1.5 rounded text-sm font-semibold text-purple-900 text-center border border-gray-200">
                      {getPlayerName(p1)}
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded text-sm font-semibold text-purple-900 text-center border border-gray-200">
                      {getPlayerName(p2)}
                    </div>
                  </div>
                </div>
                
                {/* Team 2 */}
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-3 mb-2 border border-yellow-400 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-yellow-700">Team 2</p>
                    {hasScore && editingScore !== matchKey ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-bold text-purple-900">{savedScore.team2Score}</span>
                      </div>
                    ) : (
                      isAdmin && isCurrentRound && (
                        <input
                          type="number"
                          placeholder="Score"
                          min="0"
                          max="13"
                          value={scores[`court${index}_team2`] || ''}
                          onChange={(e) => handleScoreChange(index, 2, e.target.value)}
                          className="w-18 px-2 py-1 border-2 border-yellow-300 rounded text-center text-base font-semibold"
                        />
                      )
                    )}
                  </div>
                  <div className="space-y-1 mt-1">
                    <div className="bg-white px-3 py-1.5 rounded text-sm font-semibold text-purple-900 text-center border border-gray-200">
                      {getPlayerName(p3)}
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded text-sm font-semibold text-purple-900 text-center border border-gray-200">
                      {getPlayerName(p4)}
                    </div>
                  </div>
                </div>
                
                {/* Submit/Cancel Buttons (Admin Only, Current Round Only, Editing or New Score) */}
                {isAdmin && isCurrentRound && (editingScore === matchKey || (!hasScore && 
                 scores[`court${index}_team1`] && scores[`court${index}_team2`])) && (
                  <div className="text-center mt-1 flex justify-center gap-1">
                    <button
                      onClick={() => {
                        submitScore(index);
                        if (editingScore === matchKey) {
                          setEditingScore(null);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-sm font-semibold"
                      title="Submit scores"
                    >
                      <span>✓</span>
                      <span className="text-sm">{editingScore === matchKey ? 'Update' : 'Submit'}</span>
                    </button>
                    {editingScore === matchKey && (
                      <button
                        onClick={() => {
                          setEditingScore(null);
                          setScores({
                            ...scores,
                            [`court${index}_team1`]: '',
                            [`court${index}_team2`]: ''
                          });
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-semibold"
                        title="Cancel editing"
                      >
                        <span>✕</span>
                        <span className="text-sm">Cancel</span>
                      </button>
                    )}
                  </div>
                )}
                
                {/* Winner Indicator */}
                {hasScore && editingScore !== matchKey && (
                  <div className="text-center mt-2">
                    <span className="text-sm font-bold text-green-600"
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
          <div className="bg-gray-100 rounded-lg border-2 border-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 shadow-md">
              <h3 className="font-nunito font-bold text-center text-base">
                Bye Players
              </h3>
            </div>
            <div className="p-3">
              <div className="space-y-2">
                {displayRoundData.byePlayers.map(playerId => (
                  <div key={playerId} className="bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-2.5 rounded text-sm font-semibold text-purple-900 text-center border border-yellow-400 shadow-sm">
                    {getPlayerName(playerId)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center italic">
                Sitting out this round
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Next Round Preview */}
      {nextRoundData && displayRound === currentRound && (
        <div className="mt-6">
          <h3 className="text-xl font-nunito font-bold text-purple-800 mb-3">
            On Deck - Round {nextRound}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 opacity-75">
            {nextRoundData.courts?.map((court, index) => {
              const [p1, p2, p3, p4] = court;
              return (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-2 border border-purple-300 shadow-sm">
                  <p className="text-sm font-bold text-center text-purple-700 mb-1">Court {index + 1}</p>
                  <div className="text-sm text-center">
                    <span className="font-semibold">{getPlayerName(p1)} & {getPlayerName(p2)}</span>
                    <span className="mx-2 text-purple-600 font-bold">vs</span>
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