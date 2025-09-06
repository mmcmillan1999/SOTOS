import React, { useState } from 'react';

function CourtDisplay({ roundData, currentRound, isAdmin, onScoreSubmit, players }) {
  const [scores, setScores] = useState({});
  
  const courtColors = [
    'bg-purple-100 border-purple-300',
    'bg-yellow-100 border-yellow-400',
    'bg-purple-50 border-purple-200',
    'bg-yellow-50 border-yellow-300',
    'bg-gradient-to-br from-purple-50 to-yellow-50 border-purple-300'
  ];

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
    
    onScoreSubmit(currentRound, courtIndex, team1Score, team2Score);
    
    // Clear scores after submission
    setScores(prev => ({
      ...prev,
      [`court${courtIndex}_team1`]: '',
      [`court${courtIndex}_team2`]: ''
    }));
  };

  if (!roundData) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-nunito font-bold text-purple-800 mb-4 text-center">
        Courts - Round {currentRound}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {roundData.courts.map((court, index) => {
          const [p1, p2, p3, p4] = court;
          
          return (
            <div key={index} className={`court-card rounded-xl p-4 border-2 ${courtColors[index]} shadow-lg`}>
              <h3 className="font-nunito font-bold text-center mb-3 text-purple-900">
                Court {index + 1}
              </h3>
              
              {/* Team 1 */}
              <div className="bg-purple-600 text-white rounded-lg p-2 mb-2">
                <p className="text-sm font-semibold text-center mb-1">Team 1</p>
                <div className="flex justify-center gap-2">
                  <span className="bg-white text-purple-600 px-2 py-1 rounded-full text-sm font-bold">
                    {p1}
                  </span>
                  <span className="bg-white text-purple-600 px-2 py-1 rounded-full text-sm font-bold">
                    {p2}
                  </span>
                </div>
              </div>
              
              {/* VS */}
              <div className="text-center py-1">
                <span className="text-purple-600 font-bold">VS</span>
              </div>
              
              {/* Team 2 */}
              <div className="bg-yellow-400 text-purple-900 rounded-lg p-2 mb-3">
                <p className="text-sm font-semibold text-center mb-1">Team 2</p>
                <div className="flex justify-center gap-2">
                  <span className="bg-white text-purple-900 px-2 py-1 rounded-full text-sm font-bold">
                    {p3}
                  </span>
                  <span className="bg-white text-purple-900 px-2 py-1 rounded-full text-sm font-bold">
                    {p4}
                  </span>
                </div>
              </div>
              
              {/* Score Input (Admin Only) */}
              {isAdmin && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="T1"
                      min="0"
                      max="13"
                      value={scores[`court${index}_team1`] || ''}
                      onChange={(e) => handleScoreChange(index, 1, e.target.value)}
                      className="w-1/2 px-2 py-1 border-2 border-purple-300 rounded text-center"
                    />
                    <input
                      type="number"
                      placeholder="T2"
                      min="0"
                      max="13"
                      value={scores[`court${index}_team2`] || ''}
                      onChange={(e) => handleScoreChange(index, 2, e.target.value)}
                      className="w-1/2 px-2 py-1 border-2 border-yellow-300 rounded text-center"
                    />
                  </div>
                  <button
                    onClick={() => submitScore(index)}
                    className="w-full bg-purple-600 text-white py-1 rounded hover:bg-purple-700 transition-colors text-sm font-semibold"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CourtDisplay;