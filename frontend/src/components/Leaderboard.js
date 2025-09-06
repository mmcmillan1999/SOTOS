import React from 'react';

function Leaderboard({ players }) {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-xl border-2 border-purple-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
        <h2 className="text-2xl font-nunito font-bold text-center">
          🏆 Leaderboard 🏆
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-purple-50">
            <tr>
              <th className="px-4 py-3 text-left font-nunito font-bold text-purple-900">Rank</th>
              <th className="px-4 py-3 text-left font-nunito font-bold text-purple-900">Player</th>
              <th className="px-4 py-3 text-center font-nunito font-bold text-purple-900">W</th>
              <th className="px-4 py-3 text-center font-nunito font-bold text-purple-900">L</th>
              <th className="px-4 py-3 text-center font-nunito font-bold text-purple-900">PF</th>
              <th className="px-4 py-3 text-center font-nunito font-bold text-purple-900">PA</th>
              <th className="px-4 py-3 text-center font-nunito font-bold text-purple-900">+/-</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => {
              const differential = player.pointsFor - player.pointsAgainst;
              const isTop3 = index < 3;
              
              return (
                <tr 
                  key={player.id} 
                  className={`
                    border-b hover:bg-purple-50 transition-colors
                    ${isTop3 ? 'bg-yellow-50' : ''}
                  `}
                >
                  <td className="px-4 py-3">
                    <span className={`
                      font-bold 
                      ${index === 0 ? 'text-2xl' : ''}
                      ${index === 1 ? 'text-xl' : ''}
                      ${index === 2 ? 'text-lg' : ''}
                    `}>
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && (index + 1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-inter font-semibold text-purple-900">
                      {player.name}
                    </span>
                    {player.id === 7 || player.id === 14 ? (
                      <span className="ml-2 text-purple-600" title="Iron Player - No Byes">⚡</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-green-600">
                    {player.wins}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-red-600">
                    {player.losses}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">
                    {player.pointsFor}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">
                    {player.pointsAgainst}
                  </td>
                  <td className={`px-4 py-3 text-center font-bold ${
                    differential > 0 ? 'text-green-600' : differential < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {differential > 0 ? '+' : ''}{differential}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {players.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p className="font-inter">No games played yet</p>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;