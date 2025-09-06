# FAIR-PLAY Tournament Management System - FINAL PRD
**Version:** 1.0 FINAL  
**Event Date:** September 6th, 2025 @ 6:00 PM  
**Status:** PRODUCTION READY

---

## 🎯 Executive Summary

FAIR-PLAY is a lightweight, web-based tournament management system designed for immediate deployment. The first event is a Sotos Syndrome Fundraiser Pickleball tournament with 22 players, 5 courts, and 10 rounds. The system prioritizes fairness in scheduling, real-time updates, and mobile accessibility.

**Critical Success Factors:**
- Deploy by tonight (September 6th)
- Support 22 players on 5 courts
- Fair bye distribution & matchup scheduling
- Mobile-first responsive design
- Real-time score updates

---

## 🏗️ Technical Architecture

### **Stack Selection** (Based on Your Existing Infrastructure)

**Frontend:**
- **Framework:** React 18+ (from your sluff-project setup)
- **Styling:** Tailwind CSS (from MAIOSC project)
- **Real-time:** Socket.io-client
- **Hosting:** Netlify (immediate deployment)
- **Build:** Create React App (fastest setup)

**Backend:**
- **Runtime:** Node.js + Express
- **Database:** PostgreSQL (from sluff-project) OR SQLite for tonight's prototype
- **Real-time:** Socket.io
- **Hosting:** Render.com
- **Authentication:** JWT (simplified for MVP)

**Repository:**
- GitHub → Auto-deploy to Netlify/Render

---

## 🚀 MVP Features (For Tonight)

### **Phase 1: Core Tournament Engine** (Priority 1)

#### 1.1 Tournament Setup
```javascript
{
  eventName: "Sotos Syndrome Fundraiser",
  date: "2025-09-06",
  startTime: "18:00",
  location: "Kaysville Kitchen Site",
  players: 22,
  courts: 5,
  rounds: 10,
  gameFormat: {
    pointsToWin: 11,
    winBy: 2,
    maxPoints: 13
  }
}
```

#### 1.2 Fair Scheduling Algorithm
- **Round-robin matchup generation**
- **Bye distribution:** Each player gets 1-2 byes max
- **Court assignment:** Automatic rotation
- **Partner variety:** Minimize repeat partnerships

#### 1.3 Database Schema (Simplified)
```sql
-- Core Tables
tournaments (id, name, date, config_json)
players (id, name, email, tournament_id)
rounds (id, tournament_id, round_number, status)
matches (id, round_id, court, team1_players, team2_players, score)
byes (id, round_id, player_id)
```

### **Phase 2: User Interface** (Priority 2)

#### 2.1 Public Tournament View (No Login Required)
- **Live Leaderboard**
  - Player rankings
  - Win/loss records
  - Point differentials
- **Current Round Display**
  - Court assignments
  - Active matches
  - Who has byes
- **Schedule View**
  - Full tournament bracket
  - Upcoming matches

#### 2.2 Host Admin Panel (Simple Auth)
- **Quick Actions:**
  - Start/pause tournament
  - Enter match scores
  - Manage players (add/remove)
  - Advance rounds
- **Tournament Config:**
  - Edit settings
  - Generate schedules
  - Export results

#### 2.3 Player View (Optional Login)
- **My Schedule:** When and where I play
- **My Stats:** Personal performance
- **My Partners:** Past and upcoming

---

## 📱 Mobile-First Design Requirements

### Responsive Breakpoints
- **Mobile:** 320px - 768px (PRIMARY)
- **Tablet:** 768px - 1024px
- **Desktop:** 1024px+

### Key Mobile Features
- **Large touch targets** (min 44x44px)
- **Swipe navigation** between rounds
- **Pull-to-refresh** for live updates
- **Offline capability** (PWA)

---

## 🔄 Real-Time Features

### Socket.io Events
```javascript
// Client → Server
'join_tournament' → Join tournament room
'update_score' → Submit match score
'admin_action' → Host controls

// Server → Client
'tournament_update' → Bracket changes
'score_update' → Live scores
'round_complete' → Round finished
'player_notification' → Your match is next
```

---

## 📂 Project Structure

```
FAIR-PLAY-APP/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Tournament/
│   │   │   │   ├── Leaderboard.jsx
│   │   │   │   ├── RoundView.jsx
│   │   │   │   └── CourtDisplay.jsx
│   │   │   ├── Admin/
│   │   │   │   ├── ScoreEntry.jsx
│   │   │   │   ├── PlayerManager.jsx
│   │   │   │   └── TournamentControls.jsx
│   │   │   └── Player/
│   │   │       ├── MySchedule.jsx
│   │   │       └── MyStats.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── socket.js
│   │   │   └── scheduler.js
│   │   ├── utils/
│   │   │   └── fairplay-algorithm.js
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── tournament.js
│   │   │   ├── players.js
│   │   │   └── admin.js
│   │   ├── services/
│   │   │   ├── scheduler.js
│   │   │   └── fairplay.js
│   │   ├── socket/
│   │   │   └── handlers.js
│   │   ├── db/
│   │   │   └── schema.sql
│   │   └── server.js
│   └── package.json
│
├── .env.example
├── README.md
└── DEPLOYMENT.md
```

---

## 🎮 Fair-Play Scheduling Algorithm

```javascript
class FairPlayScheduler {
  constructor(players, courts, rounds) {
    this.players = players;
    this.courts = courts;
    this.rounds = rounds;
    this.matchups = [];
    this.byeTracker = new Map();
  }

  generateSchedule() {
    // 1. Calculate matches per round
    const playersPerRound = this.courts * 4;
    const byesPerRound = this.players - playersPerRound;
    
    // 2. Initialize bye tracker
    this.players.forEach(p => this.byeTracker.set(p.id, 0));
    
    // 3. Generate each round
    for (let r = 0; r < this.rounds; r++) {
      const round = this.generateRound(r);
      this.matchups.push(round);
    }
    
    return this.matchups;
  }
  
  generateRound(roundNumber) {
    // Fair bye distribution
    const byePlayers = this.selectByePlayers();
    const activePlayers = this.getActivePlayers(byePlayers);
    
    // Create matches ensuring variety
    const matches = this.createMatches(activePlayers);
    
    return { roundNumber, matches, byes: byePlayers };
  }
}
```

---

## 🚢 Deployment Plan (Tonight!)

### Step 1: Repository Setup (5 min)
```bash
# Create GitHub repo
git init
git remote add origin https://github.com/[username]/fair-play-app
git push -u origin main
```

### Step 2: Frontend Deployment (10 min)
1. Connect GitHub to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `frontend/build`
4. Deploy

### Step 3: Backend Deployment (10 min)
1. Connect GitHub to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy

### Step 4: Database Setup (5 min)
- Use Render's PostgreSQL addon OR
- SQLite for tonight's prototype

---

## 📊 Success Metrics

### Tonight's Event
- ✅ All 22 players tracked
- ✅ 10 rounds completed
- ✅ Fair bye distribution (max 2 per player)
- ✅ No technical issues during event
- ✅ Real-time score updates working

### Post-Event
- User satisfaction > 90%
- Zero data loss
- < 3 second page loads
- Mobile usage > 70%

---

## 🔮 Future Enhancements (Post-MVP)

### Phase 3: Enhanced Features
- Tournament brackets (single/double elimination)
- Player ratings & handicapping
- Historical statistics
- Tournament series management
- Email/SMS notifications
- Payment integration for entry fees
- Photo uploads & galleries

### Phase 4: Platform Expansion
- Multiple sports support
- League management
- Venue scheduling
- Referee assignments
- Live streaming integration
- Sponsor management

---

## 📝 Implementation Checklist

### Immediate Actions (Do Now!)
- [ ] Create GitHub repository
- [ ] Initialize React frontend with CRA
- [ ] Setup Express backend
- [ ] Implement scheduling algorithm
- [ ] Create basic UI components
- [ ] Setup Socket.io connections
- [ ] Deploy to Netlify/Render
- [ ] Test with sample data
- [ ] Create admin credentials
- [ ] Share public URL

### Pre-Event Testing (1 Hour Before)
- [ ] Load test with 50+ concurrent users
- [ ] Verify mobile responsiveness
- [ ] Test score entry flow
- [ ] Confirm real-time updates
- [ ] Backup database

### During Event Support
- [ ] Monitor server logs
- [ ] Have backup scoring method ready
- [ ] Admin on standby for issues
- [ ] Collect user feedback

---

## 🔧 Environment Variables

```env
# Frontend (.env)
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_SOCKET_URL=wss://your-backend.onrender.com

# Backend (.env)
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
CORS_ORIGIN=https://your-app.netlify.app
```

---

## 💻 Quick Start Commands

```bash
# Clone and setup
git clone https://github.com/[username]/fair-play-app
cd fair-play-app

# Frontend
cd frontend
npm install
npm start

# Backend (new terminal)
cd backend
npm install
npm run dev

# Deploy
git add .
git commit -m "Initial tournament system"
git push origin main
# Netlify and Render will auto-deploy
```

---

## 🎯 Critical Path for Tonight

**6:00 PM - Event Start**

**NOW → 5:00 PM: Development**
1. Setup project structure (30 min)
2. Implement scheduling algorithm (1 hour)
3. Build essential UI components (1.5 hours)
4. Deploy and test (30 min)

**5:00 PM → 5:45 PM: Testing**
- Load sample data
- Run through complete tournament flow
- Fix any critical bugs

**5:45 PM → 6:00 PM: Go Live**
- Final deployment
- Share URLs with participants
- Brief admin on system usage

---

## 📞 Support & Troubleshooting

### Common Issues & Solutions
1. **Real-time not working:** Check WebSocket connection
2. **Scores not saving:** Verify database connection
3. **Mobile layout broken:** Force viewport meta tag
4. **Slow performance:** Enable caching, reduce Socket.io polling

### Emergency Fallback
- Have Google Sheets backup ready
- Print physical scorecards
- Manual leaderboard on whiteboard

---

**Remember:** Perfect is the enemy of done. Focus on core functionality for tonight's event. Everything else can be added later.

## ✅ Definition of Done (For Tonight)
- [ ] Players can view the tournament bracket
- [ ] Host can enter scores
- [ ] Leaderboard updates automatically
- [ ] Mobile-friendly interface
- [ ] Deployed and accessible via public URL
- [ ] Tested with real tournament data

---

*This PRD is optimized for rapid deployment using your existing toolchain and accounts. Focus on the MVP features and deploy iteratively throughout the day.*