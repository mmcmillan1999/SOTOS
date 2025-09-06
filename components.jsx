// Compassionate UI Components for Sotos Syndrome Fundraiser
// React components with Tailwind CSS classes

import React, { useState, useEffect } from 'react';

// Design system constants
export const designTokens = {
  colors: {
    primary: {
      50: '#f0f9f0',
      100: '#dcf2dc',
      200: '#bce5bc',
      300: '#94d394',
      400: '#6bb86b',
      500: '#4a9d4a',
      600: '#3a7d3a',
      700: '#2f5f2f',
      800: '#264826',
      900: '#1f3a1f',
    },
    secondary: {
      50: '#fef7f0',
      100: '#fdebd7',
      200: '#fbd3af',
      300: '#f7b377',
      400: '#f28b47',
      500: '#ee6725',
      600: '#d4511b',
      700: '#b13d19',
      800: '#8e321e',
      900: '#732a1c',
    },
    court: {
      1: '#e1f5fe',
      2: '#f3e5f5', 
      3: '#e8f5e8',
      4: '#fff3e0',
      5: '#fce4ec',
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
  },
  shadows: {
    soft: '0 4px 20px rgba(74, 157, 74, 0.1)',
    gentle: '0 2px 15px rgba(0, 0, 0, 0.08)',
    warm: '0 8px 32px rgba(238, 103, 37, 0.12)',
  }
};

// Utility components
export const PickleballIcon = ({ className = "w-6 h-6", color = "#4a9d4a" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="8" cy="8" r="1" fill={color}/>
    <circle cx="16" cy="8" r="1" fill={color}/>
    <circle cx="8" cy="16" r="1" fill={color}/>
    <circle cx="16" cy="16" r="1" fill={color}/>
    <circle cx="12" cy="12" r="1" fill={color}/>
  </svg>
);

export const LoadingSpinner = ({ message = "Loading with care..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative">
      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center animate-pulse">
        <PickleballIcon className="w-8 h-8 animate-spin" />
      </div>
      <div className="absolute inset-0 rounded-full border-2 border-primary-200 animate-ping"></div>
    </div>
    <p className="mt-4 text-gray-600 text-lg font-medium font-primary">{message}</p>
  </div>
);

// Tournament Header Component
export const CharityTournamentHeader = ({ 
  totalPlayers = 22, 
  totalRounds = 10, 
  courtsPerRound = 5,
  accuracy = 97 
}) => (
  <div className="bg-gradient-to-br from-white/90 to-primary-50/90 backdrop-blur-lg rounded-2xl shadow-soft p-6 md:p-8 mb-8 text-center relative overflow-hidden border border-white/30">
    {/* Floating background elements */}
    <div className="absolute inset-0 opacity-10">
      <PickleballIcon className="w-32 h-32 absolute top-4 right-4 animate-float" />
      <PickleballIcon className="w-24 h-24 absolute bottom-4 left-4 animate-float" style={{ animationDelay: '2s' }} />
    </div>
    
    <div className="relative z-10">
      <h1 className="font-primary text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3">
        SOTOS SYNDROME FUNDRAISER
      </h1>
      <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 mx-auto rounded-full mb-4"></div>
      <p className="text-gray-600 text-lg md:text-xl font-medium mb-6 font-primary">
        Pickleball Tournament for Hope & Community
      </p>
      
      {/* Tournament Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
        <InfoCard label="Players" value={totalPlayers} color="primary" />
        <InfoCard label="Rounds" value={totalRounds} color="secondary" />
        <InfoCard label="Courts" value={courtsPerRound} color="blue" />
        <InfoCard label="Format" value="Doubles RR" color="purple" small />
        <InfoCard label="Optimized" value={`${accuracy}% Perfect`} color="emerald" small />
      </div>
    </div>
  </div>
);

// Info Card Component
export const InfoCard = ({ label, value, color = "primary", small = false }) => {
  const colorClasses = {
    primary: "bg-primary-50 border-primary-100 text-primary-600",
    secondary: "bg-secondary-50 border-secondary-100 text-secondary-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    purple: "bg-purple-50 border-purple-100 text-purple-600",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
  };
  
  return (
    <div className={`${colorClasses[color]} rounded-xl p-4 border transition-all duration-300 hover:scale-105 hover:shadow-gentle`}>
      <div className={`text-sm font-medium ${color === 'primary' ? 'text-primary-600' : color === 'secondary' ? 'text-secondary-600' : `text-${color}-600`}`}>
        {label}
      </div>
      <div className={`${small ? 'text-xs' : 'text-2xl'} font-bold ${color === 'primary' ? 'text-primary-700' : color === 'secondary' ? 'text-secondary-700' : `text-${color}-700`}`}>
        {value}
      </div>
    </div>
  );
};

// Player Number Component
export const PlayerNumber = ({ number, team = "primary", className = "" }) => {
  const teamColors = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600",
  };
  
  return (
    <div className={`${teamColors[team]} text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 hover:scale-110 hover:shadow-gentle relative overflow-hidden group ${className}`}>
      <span className="relative z-10">{number}</span>
      <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
    </div>
  );
};

// Score Input Component
export const ScoreInput = ({ value, onChange, placeholder = "0", disabled = false }) => (
  <input
    type="number"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    min="0"
    className="w-12 h-10 text-center border-2 border-gray-200 rounded-lg bg-gradient-to-br from-white to-gray-50 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-300 hover:shadow-gentle disabled:opacity-50 disabled:cursor-not-allowed"
  />
);

// Team Component
export const Team = ({ player1, player2, score, onScoreChange, team = "primary", disabled = false }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-gentle transition-all duration-300">
    <div className="flex items-center gap-2">
      <PlayerNumber number={player1} team={team} />
      <span className="font-semibold text-gray-600">&</span>
      <PlayerNumber number={player2} team={team} />
    </div>
    <ScoreInput 
      value={score}
      onChange={onScoreChange}
      disabled={disabled}
    />
  </div>
);

// Court Card Component
export const CourtCard = ({ 
  courtNumber, 
  team1Players, 
  team2Players, 
  team1Score, 
  team2Score, 
  onTeam1ScoreChange, 
  onTeam2ScoreChange,
  disabled = false 
}) => {
  const courtColors = {
    1: "from-blue-50 to-blue-100 border-blue-200",
    2: "from-purple-50 to-purple-100 border-purple-200", 
    3: "from-emerald-50 to-emerald-100 border-emerald-200",
    4: "from-orange-50 to-orange-100 border-orange-200",
    5: "from-pink-50 to-pink-100 border-pink-200",
  };
  
  const headerColors = {
    1: "bg-blue-500",
    2: "bg-purple-500",
    3: "bg-emerald-500", 
    4: "bg-orange-500",
    5: "bg-pink-500",
  };
  
  return (
    <div className={`bg-gradient-to-br ${courtColors[courtNumber] || courtColors[1]} rounded-2xl p-6 shadow-gentle border hover:shadow-soft transition-all duration-500 hover:-translate-y-1 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-center mb-4">
        <div className={`${headerColors[courtNumber] || headerColors[1]} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2`}>
          <PickleballIcon className="w-4 h-4" color="white" />
          Court {courtNumber}
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 space-y-3">
        <Team 
          player1={team1Players[0]}
          player2={team1Players[1]}
          score={team1Score}
          onScoreChange={onTeam1ScoreChange}
          team="primary"
          disabled={disabled}
        />
        
        <div className="text-center text-gray-400 font-semibold text-sm py-1">VS</div>
        
        <Team 
          player1={team2Players[0]}
          player2={team2Players[1]}
          score={team2Score}
          onScoreChange={onTeam2ScoreChange}
          team="secondary"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

// Round Selector Component
export const RoundSelector = ({ currentRound, totalRounds, onRoundChange }) => (
  <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-gentle p-6 mb-8">
    <div className="flex flex-wrap justify-center gap-3">
      {Array.from({ length: totalRounds }, (_, i) => i + 1).map(round => (
        <button
          key={round}
          onClick={() => onRoundChange(round)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 border-2 ${
            currentRound === round
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white border-primary-500 shadow-gentle'
              : 'bg-white text-primary-600 border-primary-200 hover:bg-primary-50 hover:border-primary-300'
          }`}
        >
          Round {round}
        </button>
      ))}
    </div>
  </div>
);

// Submit Button Component
export const SubmitButton = ({ onClick, loading = false, disabled = false, children }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-soft hover:shadow-warm transition-all duration-300 hover:-translate-y-1 focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none relative overflow-hidden group"
  >
    {loading && (
      <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
    )}
    <span className="relative z-10 flex items-center justify-center gap-2">
      {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
      {children}
    </span>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
  </button>
);

// Bye Players Component
export const ByePlayers = ({ players = [] }) => {
  if (!players.length) return null;
  
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-4 py-3 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        <span className="text-amber-700 text-sm font-medium">Sitting Out: </span>
        <div className="flex gap-1">
          {players.map((player, index) => (
            <span key={player} className="font-semibold text-amber-800">
              Player {player}{index < players.length - 1 && ', '}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Standings Row Component
export const StandingsRow = ({ 
  rank, 
  player, 
  matches, 
  wins, 
  losses, 
  points, 
  diff, 
  isIronPlayer = false,
  isTopPerformer = false 
}) => (
  <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-secondary-50/50 transition-all duration-300">
    <td className="py-4 px-4">
      <div className="flex items-center gap-3">
        <div className="text-sm font-medium text-gray-500 min-w-[2rem]">#{rank}</div>
        <PlayerNumber number={player} />
        <span className="font-medium">Player {player}</span>
        {isIronPlayer && (
          <span className="text-orange-500 text-sm" title="Iron Player - Never sits out">⚡</span>
        )}
        {isTopPerformer && (
          <span className="text-yellow-500 text-sm" title="Top Performer">⭐</span>
        )}
      </div>
    </td>
    <td className="text-center py-4 px-3 text-gray-700">{matches}</td>
    <td className="text-center py-4 px-3 font-semibold text-primary-600">{wins}</td>
    <td className="text-center py-4 px-3 text-gray-600">{losses}</td>
    <td className="text-center py-4 px-3 font-medium">{points}</td>
    <td className={`text-center py-4 px-3 font-semibold ${diff >= 0 ? 'text-primary-600' : 'text-gray-500'}`}>
      {diff > 0 ? '+' : ''}{diff}
    </td>
  </tr>
);

// Standings Table Component
export const StandingsTable = ({ players = [], ironPlayers = [] }) => (
  <div className="bg-gradient-to-br from-white/90 to-primary-50/30 rounded-2xl shadow-soft p-6 md:p-8">
    <div className="flex items-center justify-center mb-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 font-primary mb-2">Player Standings</h2>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 mx-auto rounded-full"></div>
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-primary-50/30 border-b-2 border-gray-100">
            <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">Player</th>
            <th className="text-center py-4 px-3 font-semibold text-gray-700 text-sm">Matches</th>
            <th className="text-center py-4 px-3 font-semibold text-gray-700 text-sm">Wins</th>
            <th className="text-center py-4 px-3 font-semibold text-gray-700 text-sm">Losses</th>
            <th className="text-center py-4 px-3 font-semibold text-gray-700 text-sm">Points</th>
            <th className="text-center py-4 px-3 font-semibold text-gray-700 text-sm">Diff</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <StandingsRow
              key={player.player}
              rank={index + 1}
              player={player.player}
              matches={player.matches}
              wins={player.wins}
              losses={player.losses}
              points={player.pointsFor}
              diff={player.diff}
              isIronPlayer={ironPlayers.includes(player.player)}
              isTopPerformer={index < 3}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Footer Component
export const CharityFooter = () => (
  <footer className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-gentle p-6 md:p-8 text-center border border-white/30">
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Branding */}
        <div className="text-center md:text-left">
          <div className="font-primary text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            Powered by 
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              FAIR-PLAY
            </span>
            <PickleballIcon className="w-5 h-5" />
          </div>
          <p className="text-gray-600 text-sm">Tournament management with heart</p>
        </div>
        
        {/* QR Code Section */}
        <div className="text-center">
          <div className="bg-white rounded-xl p-4 shadow-gentle border inline-block hover:scale-105 transition-transform duration-300">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
              <span className="text-gray-400 text-xs font-medium">QR Code</span>
            </div>
            <p className="text-xs text-gray-600 max-w-48 leading-relaxed">
              Text Matt if you're interested in piloting our FAIR-PLAY App
              <br />
              <span className="font-semibold text-primary-600">801-549-8406</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Charity Message */}
      <div className="mt-8 pt-6 border-t border-gray-200 bg-gradient-to-r from-primary-50/30 to-secondary-50/30 rounded-xl p-4">
        <p className="text-gray-600 text-sm font-medium mb-2 flex items-center justify-center gap-2">
          <span className="text-red-400">❤️</span>
          Supporting Families Affected by Sotos Syndrome
        </p>
        <p className="text-gray-500 text-xs">
          Every game played brings hope to children and families in our community
        </p>
      </div>
    </div>
  </footer>
);

// Main App Component Example
export const CharityTournamentApp = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const [loading, setLoading] = useState(false);
  
  return (
    <div className="bg-gradient-to-br from-primary-50/30 via-secondary-50/20 to-blue-50/30 min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <CharityTournamentHeader />
        <RoundSelector 
          currentRound={currentRound}
          totalRounds={10}
          onRoundChange={setCurrentRound}
        />
        
        {/* Courts would be rendered here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {/* Example court cards */}
        </div>
        
        <div className="text-center mb-8">
          <SubmitButton 
            loading={loading}
            onClick={() => setLoading(!loading)}
          >
            Submit Round Scores with Care
          </SubmitButton>
        </div>
        
        <StandingsTable players={[]} />
        <CharityFooter />
      </div>
    </div>
  );
};

export default CharityTournamentApp;