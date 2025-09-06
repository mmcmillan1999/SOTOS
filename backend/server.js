require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const httpServer = createServer(app);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
const corsOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://sotos-tournament.netlify.app', 'https://sotos.netlify.app', process.env.CORS_ORIGIN].filter(Boolean)
  : ['http://localhost:3000'];

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));
app.use(express.json());

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Tournament data (loaded from JSON)
const tournamentSchedule = {
  "metadata": {
    "tournament_type": "SRRBT",
    "players": 22,
    "rounds": 10,
    "courts_per_round": 5,
    "byes_per_round": 2,
    "iron_players": [7, 14],
    "description": "Sotos Syndrome Fundraiser - September 6th",
    "date_generated": "2025-01-09"
  },
  "schedule": [
    {"round": 1, "courts": [[14,11,12,22],[10,15,2,5],[9,4,6,7],[17,16,13,8],[1,3,18,20]], "byePlayers": [19,21]},
    {"round": 2, "courts": [[18,14,16,21],[4,15,3,22],[7,12,9,19],[20,10,11,6],[2,8,13,1]], "byePlayers": [5,17]},
    {"round": 3, "courts": [[22,20,21,12],[4,5,18,11],[19,8,6,2],[16,10,7,14],[17,1,15,9]], "byePlayers": [3,13]},
    {"round": 4, "courts": [[19,10,9,18],[11,5,13,7],[17,14,3,20],[21,8,12,15],[1,2,4,16]], "byePlayers": [6,22]},
    {"round": 5, "courts": [[6,14,15,1],[8,9,13,11],[16,7,3,21],[18,22,2,17],[5,20,4,19]], "byePlayers": [10,12]},
    {"round": 6, "courts": [[21,17,19,2],[20,11,6,16],[15,13,4,12],[1,22,3,7],[10,14,5,8]], "byePlayers": [9,18]},
    {"round": 7, "courts": [[21,22,9,10],[12,16,4,6],[14,15,19,13],[11,8,18,3],[17,20,7,5]], "byePlayers": [1,2]},
    {"round": 8, "courts": [[17,13,21,10],[1,6,5,19],[22,14,18,4],[3,16,9,12],[2,15,7,11]], "byePlayers": [8,20]},
    {"round": 9, "courts": [[11,17,1,14],[4,8,21,19],[22,7,6,13],[2,18,20,9],[10,5,3,12]], "byePlayers": [15,16]},
    {"round": 10, "courts": [[22,15,20,16],[5,3,2,21],[19,1,10,13],[12,6,18,17],[8,14,7,9]], "byePlayers": [4,11]}
  ]
};

// Player names
const playerNames = [
  "Player 1", "Player 2", "Player 3", "Player 4", "Player 5",
  "Player 6", "Player 7", "Player 8", "Player 9", "Player 10",
  "Player 11", "Player 12", "Player 13", "Player 14", "Player 15",
  "Player 16", "Player 17", "Player 18", "Player 19", "Player 20",
  "Player 21", "Player 22"
];

// In-memory state
let currentRound = 1;
let tournamentState = {
  currentRound: 1,
  players: playerNames.map((name, index) => ({
    id: index + 1,
    name: name,
    wins: 0,
    losses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    gamesPlayed: 0
  })),
  matches: [],
  completedRounds: []
};

// Simple auth (hardcoded for MVP)
const admins = {
  'Matt': '123',
  'Tug': '123',
  'Jenny': '123'
};

// Initialize database tables
async function initDB() {
  try {
    // Create schema if not exists
    await pool.query(`
      CREATE SCHEMA IF NOT EXISTS fairplay;
    `);

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fairplay.tournaments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        schedule_json JSONB,
        current_round INT DEFAULT 1,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS fairplay.players (
        id SERIAL PRIMARY KEY,
        tournament_id INT,
        player_number INT,
        name VARCHAR(100),
        stats JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS fairplay.matches (
        id SERIAL PRIMARY KEY,
        tournament_id INT,
        round INT,
        court INT,
        team1_players INTEGER[],
        team2_players INTEGER[],
        team1_score INT,
        team2_score INT,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// API Routes

// Get tournament state
app.get('/api/tournament', (req, res) => {
  const currentRoundData = tournamentSchedule.schedule[currentRound - 1];
  res.json({
    ...tournamentState,
    currentRoundData,
    totalRounds: tournamentSchedule.metadata.rounds,
    tournamentName: "SOTO'S SYNDROME FUNDRAISER"
  });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (admins[username] && admins[username] === password) {
    res.json({ success: true, username });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Submit scores (admin only)
app.post('/api/scores', async (req, res) => {
  const { round, court, team1Score, team2Score } = req.body;
  
  try {
    const roundData = tournamentSchedule.schedule[round - 1];
    const courtData = roundData.courts[court];
    const [p1, p2, p3, p4] = courtData;
    
    // Update player stats
    const updatePlayerStats = (playerId, won, pointsFor, pointsAgainst) => {
      const player = tournamentState.players.find(p => p.id === playerId);
      if (player) {
        player.gamesPlayed++;
        player.wins += won ? 1 : 0;
        player.losses += won ? 0 : 1;
        player.pointsFor += pointsFor;
        player.pointsAgainst += pointsAgainst;
      }
    };
    
    const team1Won = team1Score > team2Score;
    
    // Update team 1 players
    updatePlayerStats(p1, team1Won, team1Score, team2Score);
    updatePlayerStats(p2, team1Won, team1Score, team2Score);
    
    // Update team 2 players
    updatePlayerStats(p3, !team1Won, team2Score, team1Score);
    updatePlayerStats(p4, !team1Won, team2Score, team1Score);
    
    // Store match result
    tournamentState.matches.push({
      round,
      court,
      team1: [p1, p2],
      team2: [p3, p4],
      team1Score,
      team2Score,
      timestamp: new Date()
    });
    
    // Save to database
    await pool.query(`
      INSERT INTO fairplay.matches (tournament_id, round, court, team1_players, team2_players, team1_score, team2_score, completed)
      VALUES (1, $1, $2, $3, $4, $5, $6, true)
    `, [round, court, [p1, p2], [p3, p4], team1Score, team2Score]);
    
    // Emit update to all clients
    io.emit('tournamentUpdate', tournamentState);
    
    res.json({ success: true, tournamentState });
  } catch (error) {
    console.error('Score submission error:', error);
    res.status(500).json({ success: false, message: 'Error submitting scores' });
  }
});

// Advance round
app.post('/api/advance-round', (req, res) => {
  if (currentRound < tournamentSchedule.metadata.rounds) {
    currentRound++;
    tournamentState.currentRound = currentRound;
    
    // Emit update to all clients
    io.emit('roundAdvanced', { currentRound, tournamentState });
    
    res.json({ success: true, currentRound });
  } else {
    res.json({ success: false, message: 'Tournament complete' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  const sortedPlayers = [...tournamentState.players].sort((a, b) => {
    // Sort by wins, then by point differential
    if (b.wins !== a.wins) return b.wins - a.wins;
    return (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst);
  });
  
  res.json(sortedPlayers);
});

// Socket.io connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current state to new client
  socket.emit('tournamentUpdate', tournamentState);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Sotos Tournament Server Running',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3001;

initDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`
    🎾 Sotos Syndrome Fundraiser Tournament Server
    💜 Running on port ${PORT}
    💛 Supporting a great cause!
    🎗️ Deployment: ${process.env.NODE_ENV || 'development'}
    `);
  });
});