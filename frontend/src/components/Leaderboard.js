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
      <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-purple-100 to-purple-200 border-b-2 border-purple-300 shadow-sm">
          <tr>
            <th className="px-2 py-3 text-left font-bold text-purple-900 text-base">#</th>
            <th className="px-2 py-3 text-left font-bold text-purple-900 text-base">Player</th>
            <th className="px-2 py-3 text-center font-bold text-purple-900 text-base">W-L</th>
            <th className="px-2 py-3 text-center font-bold text-purple-900 text-base">Win%</th>
            <th className="px-2 py-3 text-center font-bold text-purple-900 text-base">PF</th>
            <th className="px-2 py-3 text-center font-bold text-purple-900 text-base">PA</th>
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
                  border-b border-purple-100 hover:bg-purple-50 transition-all duration-200 hover:shadow-sm
                  ${isTop3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm' : 'hover:border-purple-200'}
                `}
              >
                <td className="px-2 py-1.5">
                  <span className="font-bold text-lg">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && (index + 1)}
                  </span>
                </td>
                <td className="px-2 py-1.5">
                  {editingPlayer === player.id ? (
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 border border-purple-300 rounded text-sm w-24"
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
                        className="font-semibold text-purple-900 cursor-pointer hover:text-purple-600 text-sm"
                        onClick={() => isAdmin ? handleStartEdit(player) : setSelectedPlayer(player)}
                        title={isAdmin ? 'Click to edit name' : 'Click for details'}
                      >
                        {player.name}
                      </span>
                      <span 
                        className="text-purple-400 text-sm italic cursor-pointer hover:text-purple-600"
                        onClick={() => setSelectedPlayer(player)}
                        title="View player details"
                      >
                        ⓘ
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-2 py-1.5 text-center text-sm">
                  <span className="text-green-600 font-bold">
                    {player.wins}
                  </span>
                  <span className="text-purple-700 font-bold">-</span>
                  <span className="text-red-600 font-bold">
                    {player.losses}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-center text-sm font-bold text-purple-900">
                  {player.winPercentage}%
                </td>
                <td className="px-2 py-1.5 text-center text-sm font-semibold text-purple-900">
                  {player.adjustedPointsFor || player.pointsFor || 0}{hasAsterisk && '*'}
                </td>
                <td className="px-2 py-1.5 text-center text-sm font-semibold text-purple-900">
                  {player.adjustedPointsAgainst || player.pointsAgainst || 0}{hasAsterisk && '*'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {players.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">No games played yet</p>
        </div>
      )}
      
      {/* Compact footer for asterisk explanation */}
      {players.some(p => p.isFactored) && (
        <div className="mt-2 p-2 bg-gradient-to-r from-yellow-50 to-yellow-100 text-sm text-purple-700 text-center border border-yellow-300 rounded shadow-sm">
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