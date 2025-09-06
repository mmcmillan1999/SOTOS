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
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('sotosAdmin') === 'true';
  });
  const [adminUsername, setAdminUsername] = useState(() => {
    return localStorage.getItem('sotosAdminUser') || '';
  });
  const [loading, setLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [currentEnv, setCurrentEnv] = useState('PROD');
  const [viewingRound, setViewingRound] = useState(null); // null means current round
  const [mobileView, setMobileView] = useState('rounds'); // 'rounds' or 'leaderboard' for mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Fetch initial tournament data
    fetchTournamentData();
    fetchLeaderboard();

    // Socket connection
    socket.on('connect', () => {
      console.log('Connected to tournament server');
      // Join the tournament room
      socket.emit('join-tournament', currentEnv);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from tournament server');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      window.removeEventListener('resize', () => {});
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
        // Save to localStorage
        localStorage.setItem('sotosAdmin', 'true');
        localStorage.setItem('sotosAdminUser', username);
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
        currentRound={tournamentData?.currentRound}
        viewingRound={viewingRound}
        setViewingRound={setViewingRound}
      />

      {/* Mobile Toggle Sub-header */}
      {isMobile && (
        <div className="bg-purple-100 border-b border-purple-200 px-4 py-2">
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setMobileView('rounds')}
              className={`px-4 py-1 rounded text-sm font-bold transition-colors ${
                mobileView === 'rounds' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-purple-600 border border-purple-300'
              }`}
            >
              Round {viewingRound || tournamentData?.currentRound}
            </button>
            <button
              onClick={() => setMobileView('leaderboard')}
              className={`px-4 py-1 rounded text-sm font-bold transition-colors ${
                mobileView === 'leaderboard' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-purple-600 border border-purple-300'
              }`}
            >
              🏆 Leaderboard
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area - Responsive Layout */}
      <div className={`flex-1 ${isMobile ? '' : 'flex'} overflow-hidden`}>
        {/* Left Column - Scrollable Rounds */}
        <div className={`${isMobile ? (mobileView === 'rounds' ? 'block' : 'hidden') : 'flex-1'} overflow-y-auto p-4`}>
          <div className="max-w-6xl mx-auto">
            {/* Court Display */}
            <CourtDisplay
              roundData={tournamentData?.currentRoundData}
              currentRound={tournamentData?.currentRound}
              isAdmin={isAdmin}
              onScoreSubmit={handleScoreSubmit}
              players={tournamentData?.players}
              tournamentData={tournamentData}
              currentEnv={currentEnv}
              viewingRound={viewingRound}
              setViewingRound={setViewingRound}
            />
          </div>
        </div>

        {/* Right Column - Fixed Scoreboard */}
        <div className={`${isMobile ? (mobileView === 'leaderboard' ? 'block w-full' : 'hidden') : 'w-96 border-l'} border-purple-200 bg-white overflow-y-auto`}>
          <div className="p-3">
            <Leaderboard 
              players={leaderboard} 
              isAdmin={isAdmin}
              onUpdatePlayerName={handleUpdatePlayerName}
              currentEnv={currentEnv}
              tournamentData={tournamentData}
            />
          </div>
        </div>
      </div>

      {/* Admin Controls - Small at bottom */}
      <div className="border-t border-purple-200 bg-purple-50 px-4 py-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {!isAdmin ? (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs hover:bg-purple-700 transition-colors font-semibold"
              >
                Admin Login
              </button>
            ) : (
              <>
                <span className="text-xs text-purple-700 font-semibold">Admin: {adminUsername}</span>
                {tournamentData?.currentRound < tournamentData?.totalRounds && (
                  <button
                    onClick={handleAdvanceRound}
                    className="bg-yellow-400 text-purple-900 px-2 py-0.5 rounded text-xs hover:bg-yellow-300 transition-colors font-bold"
                  >
                    Advance to Round {tournamentData.currentRound + 1}
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsAdmin(false);
                    setAdminUsername('');
                    localStorage.removeItem('sotosAdmin');
                    localStorage.removeItem('sotosAdminUser');
                  }}
                  className="bg-red-500 text-white px-2 py-0.5 rounded text-xs hover:bg-red-600 transition-colors font-semibold"
                >
                  Logout
                </button>
              </>
            )}
          </div>
          
          {/* Environment Selector - Center */}
          <div className="flex gap-1">
            <button
              onClick={() => handleEnvChange('PROD')}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                currentEnv === 'PROD' 
                  ? 'bg-purple-700 text-white' 
                  : 'bg-purple-200 text-purple-700 hover:bg-purple-300'
              }`}
            >
              LIVE
            </button>
            <button
              onClick={() => handleEnvChange('SIT')}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                currentEnv === 'SIT' 
                  ? 'bg-yellow-400 text-purple-900' 
                  : 'bg-purple-200 text-purple-700 hover:bg-purple-300'
              }`}
            >
              SIT
            </button>
            <button
              onClick={() => handleEnvChange('UAT')}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                currentEnv === 'UAT' 
                  ? 'bg-green-400 text-purple-900' 
                  : 'bg-purple-200 text-purple-700 hover:bg-purple-300'
              }`}
            >
              UAT
            </button>
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