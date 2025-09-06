import React, { useState } from 'react';

function Leaderboard({ players, isAdmin, onUpdatePlayerName, currentEnv }) {
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editName, setEditName] = useState('');

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
            <th className="px-1 py-1 text-left font-bold text-purple-900">#</th>
            <th className="px-1 py-1 text-left font-bold text-purple-900">Player</th>
            <th className="px-1 py-1 text-center font-bold text-purple-900">W-L</th>
            <th className="px-1 py-1 text-center font-bold text-purple-900">+/-</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => {
            const differential = player.displayPointsFor - player.displayPointsAgainst;
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
                    <span 
                      className={`font-semibold text-purple-900 ${
                        isAdmin ? 'cursor-pointer hover:text-purple-600' : ''
                      }`}
                      onClick={() => handleStartEdit(player)}
                      title={isAdmin ? 'Click to edit' : (hasAsterisk ? `Actual: W${player.actualWins} L${player.actualLosses}` : '')}
                    >
                      {player.name}
                      {hasAsterisk && (
                        <span className="ml-1 text-purple-600 font-bold">*</span>
                      )}
                    </span>
                  )}
                </td>
                <td className="px-1 py-1 text-center">
                  <span className="text-green-600 font-bold">
                    {player.displayWins}{hasAsterisk && '*'}
                  </span>
                  -
                  <span className="text-red-600 font-bold">
                    {player.displayLosses}
                  </span>
                </td>
                <td className={`px-1 py-1 text-center font-bold ${
                  differential > 0 ? 'text-green-600' : differential < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {differential > 0 ? '+' : ''}{differential}{hasAsterisk && '*'}
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
          <span className="font-bold">*</span> Factored 0.9x (no byes)
        </div>
      )}
    </div>
  );
}

export default Leaderboard;