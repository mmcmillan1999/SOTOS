import React from 'react';

function PlayerDetails({ player, matches, onClose, tournamentData }) {
  if (!player) return null;
  
  // Get player's match history
  const playerMatches = [];
  const schedule = tournamentData?.schedule || [];
  const matchScores = tournamentData?.matchScores || {};
  
  // Go through each round to find player's matches
  schedule.forEach((round, roundIndex) => {
    const roundNum = roundIndex + 1;
    
    // Check each court for this player
    round.courts?.forEach((court, courtIndex) => {
      const [p1, p2, p3, p4] = court;
      const matchKey = `${roundNum}-${courtIndex}`;
      const score = matchScores[matchKey];
      
      if ([p1, p2, p3, p4].includes(player.id)) {
        const isTeam1 = [p1, p2].includes(player.id);
        const teammate = isTeam1 ? (p1 === player.id ? p2 : p1) : (p3 === player.id ? p4 : p3);
        const opponents = isTeam1 ? [p3, p4] : [p1, p2];
        
        let result = 'Pending';
        let scoreDisplay = '-';
        
        if (score && score.team1Score !== undefined && score.team2Score !== undefined) {
          const team1Won = score.team1Score > score.team2Score;
          result = (isTeam1 && team1Won) || (!isTeam1 && !team1Won) ? 'W' : 'L';
          scoreDisplay = isTeam1 
            ? `${score.team1Score}-${score.team2Score}`
            : `${score.team2Score}-${score.team1Score}`;
        }
        
        playerMatches.push({
          round: roundNum,
          teammate,
          opponents,
          result,
          score: scoreDisplay,
          isPlayed: score && score.team1Score !== undefined
        });
      }
    });
    
    // Check if player had a bye
    if (round.byePlayers?.includes(player.id)) {
      playerMatches.push({
        round: roundNum,
        teammate: null,
        opponents: [],
        result: 'Bye',
        score: '-',
        isPlayed: false
      });
    }
  });
  
  // Get player names
  const getPlayerName = (playerId) => {
    const p = tournamentData?.players?.find(pl => pl.id === playerId);
    return p?.name || `Player ${playerId}`;
  };
  
  // Calculate summary stats
  const wins = playerMatches.filter(m => m.result === 'W').length;
  const losses = playerMatches.filter(m => m.result === 'L').length;
  const pending = playerMatches.filter(m => m.result === 'Pending').length;
  const byes = playerMatches.filter(m => m.result === 'Bye').length;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{player.name}</h2>
              <p className="text-sm opacity-90">Match History</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-purple-500 rounded p-1"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Match History Table */}
        <div className="overflow-y-auto max-h-[60vh] p-4">
          <table className="w-full text-sm">
            <thead className="bg-purple-50 sticky top-0">
              <tr>
                <th className="px-2 py-2 text-left">Round</th>
                <th className="px-2 py-2 text-left">Partner</th>
                <th className="px-2 py-2 text-left">Opponents</th>
                <th className="px-2 py-2 text-center">Result</th>
                <th className="px-2 py-2 text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {playerMatches.map((match, index) => (
                <tr key={index} className="border-b hover:bg-purple-50">
                  <td className="px-2 py-2 font-bold">{match.round}</td>
                  <td className="px-2 py-2">
                    {match.teammate ? getPlayerName(match.teammate) : '-'}
                  </td>
                  <td className="px-2 py-2">
                    {match.opponents.length > 0 
                      ? `${getPlayerName(match.opponents[0])} & ${getPlayerName(match.opponents[1])}`
                      : '-'}
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className={`font-bold ${
                      match.result === 'W' ? 'text-green-600' : 
                      match.result === 'L' ? 'text-red-600' : 
                      match.result === 'Bye' ? 'text-gray-500' :
                      'text-yellow-600'
                    }`}>
                      {match.result}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-center font-semibold">
                    {match.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Summary Footer */}
        <div className="bg-gray-50 p-4 border-t">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-600">Wins</p>
              <p className="text-lg font-bold text-green-600">{wins}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Losses</p>
              <p className="text-lg font-bold text-red-600">{losses}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Pending</p>
              <p className="text-lg font-bold text-yellow-600">{pending}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Byes</p>
              <p className="text-lg font-bold text-gray-600">{byes}</p>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm text-purple-700 font-semibold">
              Win Rate: {wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerDetails;