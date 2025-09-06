import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import TournamentHeader from './components/TournamentHeader';
import CourtDisplay from './components/CourtDisplay';
import Leaderboard from './components/Leaderboard';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const socket = io(API_URL);

function App() {
  const [tournamentData, setTournamentData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [connected, setConnected] = useState(false);
  const [currentEnv, setCurrentEnv] = useState('PROD');

  useEffect(() => {
    // Fetch initial tournament data
    fetchTournamentData();
    fetchLeaderboard();

    // Socket connection status
    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to tournament server');
      // Join the tournament room
      socket.emit('join-tournament', currentEnv);
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from tournament server');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    // Clean up previous listeners
    socket.off(`tournamentUpdate:${currentEnv}`);
    socket.off(`roundAdvanced:${currentEnv}`);
    
    // Socket listeners for current environment
    socket.on(`tournamentUpdate:${currentEnv}`, (data) => {
      setTournamentData(prev => ({ ...prev, ...data }));
      fetchLeaderboard();
    });

    socket.on(`roundAdvanced:${currentEnv}`, ({ currentRound, tournamentState }) => {
      setTournamentData(prev => ({ ...prev, currentRound, ...tournamentState }));
      fetchLeaderboard();
    });
    
    // Join new tournament room
    socket.emit('join-tournament', currentEnv);
    
    // Fetch data for new environment
    fetchTournamentData();
    fetchLeaderboard();

    return () => {
      socket.off(`tournamentUpdate:${currentEnv}`);
      socket.off(`roundAdvanced:${currentEnv}`);
    };
  }, [currentEnv]);

  const fetchTournamentData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tournament/${currentEnv}`);
      setTournamentData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tournament data:', error);
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/leaderboard/${currentEnv}`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const handleAdminLogin = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, {
        username,
        password
      });
      if (response.data.success) {
        setIsAdmin(true);
        setAdminUsername(username);
        setShowAdminLogin(false);
      }
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  const handleScoreSubmit = async (round, court, team1Score, team2Score) => {
    try {
      await axios.post(`${API_URL}/api/scores/${currentEnv}`, {
        round,
        court,
        team1Score: parseInt(team1Score),
        team2Score: parseInt(team2Score)
      });
      fetchTournamentData();
    } catch (error) {
      console.error('Error submitting scores:', error);
      alert('Error submitting scores');
    }
  };

  const handleAdvanceRound = async () => {
    try {
      await axios.post(`${API_URL}/api/advance-round/${currentEnv}`);
      fetchTournamentData();
    } catch (error) {
      console.error('Error advancing round:', error);
    }
  };
  
  const handleEnvChange = (env) => {
    setLoading(true);
    setCurrentEnv(env);
  };

  const handleUpdatePlayerName = async (playerId, newName) => {
    try {
      await axios.post(`${API_URL}/api/player/${currentEnv}/${playerId}`, {
        name: newName
      });
      fetchTournamentData();
      fetchLeaderboard();
    } catch (error) {
      console.error('Error updating player name:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          <p className="mt-4 text-purple-800 font-nunito font-semibold text-xl">Loading tournament...</p>
          <p className="mt-2 text-purple-600 font-inter">Sotos Syndrome Fundraiser</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 flex flex-col">
      <TournamentHeader 
        tournamentName={tournamentData?.tournamentName}
      />

      {/* Connection Status and Environment Selector - Moved to top bar */}
      <div className="bg-purple-50 border-b border-purple-200 px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Round Info */}
          <div className="flex items-center gap-4">
            <span className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-full font-bold text-sm">
              Round {tournamentData?.currentRound || 1} of {tournamentData?.totalRounds || 10}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              connected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {connected ? '🟢 Live' : '🔴 Offline'}
            </span>
          </div>
          
          {/* Environment Selector - Horizontal */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-purple-700">Environment:</span>
            <button
              onClick={() => handleEnvChange('PROD')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                currentEnv === 'PROD' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              LIVE
            </button>
            <button
              onClick={() => handleEnvChange('SIT')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                currentEnv === 'SIT' 
                  ? 'bg-yellow-500 text-purple-900' 
                  : 'bg-yellow-100 text-purple-700 hover:bg-yellow-200'
              }`}
            >
              SIT
            </button>
            <button
              onClick={() => handleEnvChange('UAT')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                currentEnv === 'UAT' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              UAT
            </button>
          </div>
        </div>
      </div>

      {/* Environment Warning */}
      {currentEnv !== 'PROD' && (
        <div className={`px-4 py-1 text-center text-xs font-bold ${
          currentEnv === 'SIT' 
            ? 'bg-yellow-200 text-yellow-900' 
            : 'bg-green-200 text-green-900'
        }`}>
          ⚠️ {currentEnv} ENVIRONMENT - Testing Only
        </div>
      )}

      {/* Main Content Area - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Scrollable Rounds */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-6xl mx-auto">
            {/* Court Display */}
            <CourtDisplay
              roundData={tournamentData?.currentRoundData}
              currentRound={tournamentData?.currentRound}
              isAdmin={isAdmin}
              onScoreSubmit={handleScoreSubmit}
              players={tournamentData?.players}
            />

            {/* Bye Players */}
            {tournamentData?.currentRoundData?.byePlayers && (
              <div className="mt-4 bg-purple-50 rounded-lg p-3 border border-purple-200">
                <h3 className="font-nunito font-semibold text-purple-800 text-sm mb-2">Byes this Round:</h3>
                <div className="flex gap-2 flex-wrap">
                  {tournamentData.currentRoundData.byePlayers.map(playerId => (
                    <span key={playerId} className="bg-yellow-300 text-purple-900 px-2 py-1 rounded-full text-xs font-semibold">
                      Player {playerId}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Fixed Scoreboard */}
        <div className="w-96 border-l border-purple-200 bg-white overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3">
            <h2 className="text-lg font-nunito font-bold text-center">
              🏆 Leaderboard
            </h2>
          </div>
          <div className="p-4">
            <Leaderboard 
              players={leaderboard} 
              isAdmin={isAdmin}
              onUpdatePlayerName={handleUpdatePlayerName}
              currentEnv={currentEnv}
            />
          </div>
        </div>
      </div>

      {/* Admin Controls - Small at bottom */}
      <div className="border-t border-purple-200 bg-purple-50 px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {!isAdmin ? (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition-colors font-semibold"
              >
                Admin Login
              </button>
            ) : (
              <>
                <span className="text-xs text-purple-700 font-semibold">Admin: {adminUsername}</span>
                {tournamentData?.currentRound < tournamentData?.totalRounds && (
                  <button
                    onClick={handleAdvanceRound}
                    className="bg-yellow-400 text-purple-900 px-3 py-1 rounded text-xs hover:bg-yellow-300 transition-colors font-bold"
                  >
                    Advance to Round {tournamentData.currentRound + 1}
                  </button>
                )}
              </>
            )}
          </div>
          
          {/* FAIR-PLAY Branding - Small */}
          <div className="text-xs text-purple-600">
            Powered by <span className="font-bold">FAIR-PLAY</span> | Text Matt: 801-549-8406
          </div>
        </div>
      </div>

      {/* Admin Panel Modal */}
      {showAdminLogin && (
        <AdminPanel
          onLogin={handleAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  );
}

export default App;