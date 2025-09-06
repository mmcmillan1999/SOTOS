import React, { useState } from 'react';
import PlayerDetails from './PlayerDetails';

function Leaderboard({ players, isAdmin, onUpdatePlayerName, currentEnv, tournamentData }) {
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editName, setEditName] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleStartEdit = (player) => {
    if (!isAdmin) return;
    setEditingPlayer(player.id);
    setEditName(player.name);
  };

  const handleSaveEdit = (playerId) => {
    if (onUpdatePlayerName) {
      onUpdatePlayerName(playerId, editName);
    }
    setEditingPlayer(null);
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
    setEditName('');
  };

  return (
    <div>
      <table className="w-full text-xs">
        <thead className="bg-purple-50 sticky top-0">
          <tr>
            <th className="px-1 py-1 text-left font-bold text-purple-900 text-xs">#</th>
            <th className="px-1 py-1 text-left font-bold text-purple-900 text-xs">Player</th>
            <th className="px-1 py-1 text-center font-bold text-purple-900 text-xs">W-L</th>
            <th className="px-1 py-1 text-center font-bold text-purple-900 text-xs">Win%</th>
            <th className="px-1 py-1 text-center font-bold text-purple-900 text-xs">PF</th>
            <th className="px-1 py-1 text-center font-bold text-purple-900 text-xs">PA</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => {
            const isTop3 = index < 3;
            const hasAsterisk = player.isFactored;
            
            return (
              <tr 
                key={player.id} 
                className={`
                  border-b hover:bg-purple-50 transition-colors
                  ${isTop3 ? 'bg-yellow-50' : ''}
                `}
              >
                <td className="px-1 py-1">
                  <span className="font-bold">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && (index + 1)}
                  </span>
                </td>
                <td className="px-1 py-1">
                  {editingPlayer === player.id ? (
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-1 py-0 border border-purple-300 rounded text-xs w-20"
                        autoFocus
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(player.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                      <button
                        onClick={() => handleSaveEdit(player.id)}
                        className="text-green-600 hover:text-green-800 font-bold"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span 
                        className={`font-semibold text-purple-900 ${
                          isAdmin ? 'cursor-pointer hover:text-purple-600' : 'cursor-pointer hover:text-purple-600'
                        }`}
                        onClick={() => isAdmin ? handleStartEdit(player) : setSelectedPlayer(player)}
                        title={isAdmin ? 'Click to edit' : 'Click for details'}
                      >
                        {player.name}
                      </span>
                      {!isAdmin && (
                        <span 
                          className="text-purple-400 text-xs italic cursor-pointer hover:text-purple-600"
                          onClick={() => setSelectedPlayer(player)}
                        >
                          ⓘ
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-1 py-1 text-center text-xs">
                  <span className="text-green-600 font-bold">
                    {player.wins}
                  </span>
                  -
                  <span className="text-red-600 font-bold">
                    {player.losses}
                  </span>
                </td>
                <td className="px-1 py-1 text-center text-xs font-bold text-purple-900">
                  {player.winPercentage}%
                </td>
                <td className="px-1 py-1 text-center text-xs font-semibold text-purple-900">
                  {player.adjustedPointsFor || player.pointsFor || 0}{hasAsterisk && '*'}
                </td>
                <td className="px-1 py-1 text-center text-xs font-semibold text-purple-900">
                  {player.adjustedPointsAgainst || player.pointsAgainst || 0}{hasAsterisk && '*'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {players.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          <p className="text-xs">No games played yet</p>
        </div>
      )}
      
      {/* Compact footer for asterisk explanation */}
      {players.some(p => p.isFactored) && (
        <div className="mt-1 p-1 bg-yellow-50 text-xs text-purple-700 text-center">
          <span className="font-bold">*</span> Points adjusted 0.9x (iron players - no byes)
        </div>
      )}
      
      {/* Player Details Modal */}
      {selectedPlayer && (
        <PlayerDetails 
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          tournamentData={tournamentData}
        />
      )}
    </div>
  );
}

export default Leaderboard;