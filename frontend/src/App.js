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
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-100">
      {/* Purple ribbon decoration */}
      <div className="fixed top-0 right-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 10 L40 40 L10 40 L35 60 L25 90 L50 70 L75 90 L65 60 L90 40 L60 40 Z" fill="#8B5CF6"/>
        </svg>
      </div>

      <TournamentHeader 
        tournamentName={tournamentData?.tournamentName}
        currentRound={tournamentData?.currentRound}
        totalRounds={tournamentData?.totalRounds}
      />

      {/* Connection Status and Environment Selector */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          connected 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {connected ? '🟢 Live' : '🔴 Offline'}
        </div>
        
        {/* Environment Selector */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-purple-300 p-2">
          <p className="text-xs font-semibold text-purple-700 mb-1">Tournament:</p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleEnvChange('PROD')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                currentEnv === 'PROD' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              LIVE EVENT
            </button>
            <button
              onClick={() => handleEnvChange('SIT')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                currentEnv === 'SIT' 
                  ? 'bg-yellow-500 text-purple-900' 
                  : 'bg-yellow-100 text-purple-700 hover:bg-yellow-200'
              }`}
            >
              SIT TEST
            </button>
            <button
              onClick={() => handleEnvChange('UAT')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                currentEnv === 'UAT' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              UAT REHEARSAL
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Environment Warning Banner */}
        {currentEnv !== 'PROD' && (
          <div className={`mb-4 p-3 rounded-lg text-center font-bold ${
            currentEnv === 'SIT' 
              ? 'bg-yellow-200 text-yellow-900 border-2 border-yellow-400' 
              : 'bg-green-200 text-green-900 border-2 border-green-400'
          }`}>
            ⚠️ {currentEnv} ENVIRONMENT - Testing Only ⚠️
          </div>
        )}
        
        {/* Admin Controls */}
        {!isAdmin && (
          <div className="text-center mb-6">
            <button
              onClick={() => setShowAdminLogin(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-nunito font-semibold"
            >
              Admin Login
            </button>
          </div>
        )}

        {isAdmin && (
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border-2 border-purple-200">
            <p className="text-purple-700 font-nunito font-bold">Admin Mode: {adminUsername}</p>
          </div>
        )}

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
          <div className="mt-6 bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
            <h3 className="font-nunito font-bold text-purple-800 mb-2">Players with Bye this Round:</h3>
            <div className="flex gap-2 flex-wrap">
              {tournamentData.currentRoundData.byePlayers.map(playerId => (
                <span key={playerId} className="bg-yellow-300 text-purple-900 px-3 py-1 rounded-full font-semibold">
                  Player {playerId}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <Leaderboard players={leaderboard} />

        {/* Admin Panel Modal */}
        {showAdminLogin && (
          <AdminPanel
            onLogin={handleAdminLogin}
            onClose={() => setShowAdminLogin(false)}
          />
        )}

        {/* Advance Round Button */}
        {isAdmin && tournamentData?.currentRound < tournamentData?.totalRounds && (
          <div className="text-center mt-6">
            <button
              onClick={handleAdvanceRound}
              className="bg-yellow-400 text-purple-900 px-8 py-3 rounded-lg hover:bg-yellow-300 transition-colors font-nunito font-bold text-lg shadow-lg"
            >
              Advance to Round {tournamentData.currentRound + 1}
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;