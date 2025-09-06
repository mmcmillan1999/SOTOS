// Tournament Application - Fair Play Engine
// Loads and manages the optimal 22-player tournament schedule

let tournamentData = null;
let currentRound = 1;
let matchResults = {};
let playerStats = {};

// Initialize player statistics
function initializePlayerStats() {
    for (let i = 1; i <= 22; i++) {
        playerStats[i] = {
            matches: 0,
            wins: 0,
            losses: 0,
            pointsFor: 0,
            pointsAgainst: 0,
            partners: new Set(),
            opponents: new Set(),
            byes: 0
        };
    }
}

// Load tournament data
async function loadTournamentData() {
    try {
        // For now, embed the optimal schedule directly
        // In production, this would fetch from TourneySchedules/OPTIMAL_22P_7VIOLATIONS_97PCT.json
        tournamentData = {
            "metadata": {
                "tournament_type": "SRRBT",
                "players": 22,
                "rounds": 10,
                "courts_per_round": 5,
                "byes_per_round": 2,
                "accuracy": 97.0,
                "violations": 7,
                "iron_players": [7, 14],
                "pairs_meeting_twice": ["4-22", "5-10", "6-19", "6-20", "7-9", "8-13", "14-16"]
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

        initializePlayerStats();
        initializeUI();
        displayRound(1);
        updateStandings();
        
    } catch (error) {
        console.error('Error loading tournament data:', error);
        alert('Error loading tournament data. Please check the schedule file.');
    }
}

// Initialize UI components
function initializeUI() {
    // Update tournament info
    document.getElementById('totalPlayers').textContent = tournamentData.metadata.players;
    document.getElementById('totalRounds').textContent = tournamentData.metadata.rounds;
    document.getElementById('courtsPerRound').textContent = tournamentData.metadata.courts_per_round;
    
    // Create round selector buttons
    const roundSelector = document.getElementById('roundSelector');
    roundSelector.innerHTML = '';
    
    for (let i = 1; i <= tournamentData.metadata.rounds; i++) {
        const btn = document.createElement('button');
        btn.className = 'round-btn';
        btn.textContent = `Round ${i}`;
        btn.onclick = () => {
            currentRound = i;
            displayRound(i);
            
            // Update active button
            document.querySelectorAll('.round-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
        
        if (i === 1) btn.classList.add('active');
        roundSelector.appendChild(btn);
    }
    
    // Hide loading, show round display
    document.getElementById('loading').style.display = 'none';
    document.getElementById('roundDisplay').style.display = 'block';
}

// Display a specific round
function displayRound(roundNum) {
    const round = tournamentData.schedule[roundNum - 1];
    
    // Update round title
    document.getElementById('roundTitle').textContent = `Round ${roundNum}`;
    
    // Update bye players
    const byePlayersEl = document.getElementById('byePlayers');
    if (round.byePlayers && round.byePlayers.length > 0) {
        byePlayersEl.innerHTML = `Sitting Out: <strong>Players ${round.byePlayers.join(', ')}</strong>`;
        byePlayersEl.style.display = 'block';
    } else {
        byePlayersEl.style.display = 'none';
    }
    
    // Generate courts
    const courtsGrid = document.getElementById('courtsGrid');
    courtsGrid.innerHTML = '';
    
    round.courts.forEach((court, index) => {
        const [p1, p2, p3, p4] = court;
        const matchKey = `R${roundNum}C${index + 1}`;
        
        const courtCard = document.createElement('div');
        courtCard.className = 'court-card';
        courtCard.innerHTML = `
            <div class="court-number">Court ${index + 1}</div>
            <div class="match-display">
                <div class="team">
                    <span class="team-players">
                        <span class="player-number">${p1}</span> &
                        <span class="player-number">${p2}</span>
                    </span>
                    <input type="number" 
                           class="score-input" 
                           id="score_${matchKey}_team1" 
                           placeholder="0"
                           min="0"
                           value="${matchResults[matchKey]?.team1Score || ''}">
                </div>
                <div class="vs-divider">VS</div>
                <div class="team">
                    <span class="team-players">
                        <span class="player-number">${p3}</span> &
                        <span class="player-number">${p4}</span>
                    </span>
                    <input type="number" 
                           class="score-input" 
                           id="score_${matchKey}_team2" 
                           placeholder="0"
                           min="0"
                           value="${matchResults[matchKey]?.team2Score || ''}">
                </div>
            </div>
        `;
        
        courtsGrid.appendChild(courtCard);
    });
}

// Submit round scores
function submitRoundScores() {
    const round = tournamentData.schedule[currentRound - 1];
    let allScoresEntered = true;
    
    round.courts.forEach((court, index) => {
        const [p1, p2, p3, p4] = court;
        const matchKey = `R${currentRound}C${index + 1}`;
        
        const team1Score = document.getElementById(`score_${matchKey}_team1`).value;
        const team2Score = document.getElementById(`score_${matchKey}_team2`).value;
        
        if (team1Score === '' || team2Score === '') {
            allScoresEntered = false;
            return;
        }
        
        // Store match result
        matchResults[matchKey] = {
            round: currentRound,
            court: index + 1,
            team1: [p1, p2],
            team2: [p3, p4],
            team1Score: parseInt(team1Score),
            team2Score: parseInt(team2Score)
        };
        
        // Update player statistics
        updatePlayerStats(p1, p2, p3, p4, parseInt(team1Score), parseInt(team2Score));
    });
    
    if (!allScoresEntered) {
        alert('Please enter scores for all matches before submitting.');
        return;
    }
    
    // Update standings
    updateStandings();
    
    // Move to next round if available
    if (currentRound < tournamentData.metadata.rounds) {
        alert(`Round ${currentRound} scores submitted successfully!`);
        currentRound++;
        displayRound(currentRound);
        
        // Update active button
        document.querySelectorAll('.round-btn').forEach((b, i) => {
            b.classList.toggle('active', i === currentRound - 1);
        });
    } else {
        alert('Tournament complete! Check the final standings.');
    }
}

// Update player statistics
function updatePlayerStats(p1, p2, p3, p4, team1Score, team2Score) {
    // Team 1 players
    [p1, p2].forEach(player => {
        playerStats[player].matches++;
        playerStats[player].pointsFor += team1Score;
        playerStats[player].pointsAgainst += team2Score;
        
        if (team1Score > team2Score) {
            playerStats[player].wins++;
        } else {
            playerStats[player].losses++;
        }
        
        // Track partners and opponents
        playerStats[player].partners.add(player === p1 ? p2 : p1);
        playerStats[player].opponents.add(p3);
        playerStats[player].opponents.add(p4);
    });
    
    // Team 2 players
    [p3, p4].forEach(player => {
        playerStats[player].matches++;
        playerStats[player].pointsFor += team2Score;
        playerStats[player].pointsAgainst += team1Score;
        
        if (team2Score > team1Score) {
            playerStats[player].wins++;
        } else {
            playerStats[player].losses++;
        }
        
        // Track partners and opponents
        playerStats[player].partners.add(player === p3 ? p4 : p3);
        playerStats[player].opponents.add(p1);
        playerStats[player].opponents.add(p2);
    });
}

// Update standings display
function updateStandings() {
    const standingsBody = document.getElementById('standingsBody');
    standingsBody.innerHTML = '';
    
    // Convert to array and sort by wins, then point differential
    const standings = Object.entries(playerStats).map(([player, stats]) => ({
        player: parseInt(player),
        ...stats,
        diff: stats.pointsFor - stats.pointsAgainst
    })).sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.diff - a.diff;
    });
    
    standings.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <span class="player-number">${player.player}</span>
                ${tournamentData.metadata.iron_players.includes(player.player) ? 
                    '<span style="color: #f39c12; margin-left: 5px;" title="Iron Player - Never sits out">★</span>' : ''}
            </td>
            <td>${player.matches}</td>
            <td>${player.wins}</td>
            <td>${player.losses}</td>
            <td>${player.pointsFor}</td>
            <td>${player.diff > 0 ? '+' : ''}${player.diff}</td>
        `;
        standingsBody.appendChild(row);
    });
}

// Initialize app when page loads
window.addEventListener('DOMContentLoaded', loadTournamentData);