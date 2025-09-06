// Charity Tournament Integration - Enhanced app.js with compassionate UI
// This file shows how to integrate the new design system with existing functionality

let tournamentData = null;
let currentRound = 1;
let matchResults = {};
let playerStats = {};

// Enhanced UI animations and interactions
const UIAnimations = {
    // Gentle loading animation
    showLoading: (message = "Loading tournament data with care...") => {
        const loadingEl = document.getElementById('loading');
        loadingEl.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12">
                <div class="relative">
                    <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center animate-pulse">
                        <div class="pickleball-icon w-8 h-8 animate-spin"></div>
                    </div>
                    <div class="absolute inset-0 rounded-full border-2 border-primary-200 animate-ping"></div>
                </div>
                <p class="mt-4 text-gray-600 text-lg font-medium font-primary">${message}</p>
            </div>
        `;
        loadingEl.classList.remove('hidden');
    },

    hideLoading: () => {
        document.getElementById('loading').classList.add('hidden');
    },

    // Success animation for score submission
    showSuccess: (message = "Round scores submitted with care!") => {
        const successEl = document.createElement('div');
        successEl.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl shadow-warm flex items-center gap-3 transform translate-x-full transition-transform duration-500';
        successEl.innerHTML = `
            <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <div class="w-3 h-3 bg-white rounded-full animate-ping"></div>
            </div>
            <span class="font-medium">${message}</span>
        `;
        
        document.body.appendChild(successEl);
        
        // Slide in
        setTimeout(() => {
            successEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Slide out after 3 seconds
        setTimeout(() => {
            successEl.style.transform = 'translateX(full)';
            setTimeout(() => successEl.remove(), 500);
        }, 3000);
    },

    // Gentle error animation
    showError: (message = "Please check all scores and try again") => {
        const errorEl = document.createElement('div');
        errorEl.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-red-400 to-red-500 text-white px-6 py-4 rounded-xl shadow-warm flex items-center gap-3 transform translate-x-full transition-transform duration-500';
        errorEl.innerHTML = `
            <div class="w-6 h-6 text-white">⚠️</div>
            <span class="font-medium">${message}</span>
        `;
        
        document.body.appendChild(errorEl);
        
        setTimeout(() => {
            errorEl.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            errorEl.style.transform = 'translateX(full)';
            setTimeout(() => errorEl.remove(), 500);
        }, 4000);
    },

    // Gentle hover effects for court cards
    addCourtHoverEffects: () => {
        document.querySelectorAll('.court-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 0 20px rgba(74, 157, 74, 0.2), 0 0 30px rgba(238, 103, 37, 0.1)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '';
            });
        });
    }
};

// Enhanced player statistics with compassionate messaging
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

// Load tournament data with enhanced UI feedback
async function loadTournamentData() {
    try {
        UIAnimations.showLoading("Loading tournament schedule with care...");
        
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Tournament data (keeping existing structure)
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
        initializeCharityUI();
        displayRound(1);
        updateStandings();
        
        UIAnimations.hideLoading();
        
        // Show welcome message
        setTimeout(() => {
            UIAnimations.showSuccess("Tournament loaded successfully! Ready to support Sotos Syndrome families.");
        }, 500);
        
    } catch (error) {
        console.error('Error loading tournament data:', error);
        UIAnimations.hideLoading();
        UIAnimations.showError('Error loading tournament data. Please refresh and try again.');
    }
}

// Enhanced UI initialization with charity theming
function initializeCharityUI() {
    // Update tournament info with enhanced styling
    document.getElementById('totalPlayers').textContent = tournamentData.metadata.players;
    document.getElementById('totalRounds').textContent = tournamentData.metadata.rounds;
    document.getElementById('courtsPerRound').textContent = tournamentData.metadata.courts_per_round;
    
    // Create round selector with enhanced styling
    const roundSelector = document.getElementById('roundSelector');
    roundSelector.innerHTML = '';
    
    for (let i = 1; i <= tournamentData.metadata.rounds; i++) {
        const btn = document.createElement('button');
        btn.className = 'round-btn bg-white border-2 border-primary-200 text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 hover:scale-105';
        btn.textContent = `Round ${i}`;
        btn.onclick = () => {
            // Add gentle loading state
            btn.innerHTML = '<div class="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin mx-auto"></div>';
            
            setTimeout(() => {
                currentRound = i;
                displayRound(i);
                
                // Update active button states
                document.querySelectorAll('.round-btn').forEach(b => {
                    b.classList.remove('active', 'bg-gradient-to-r', 'from-primary-500', 'to-primary-600', 'text-white', 'shadow-gentle');
                    b.classList.add('bg-white', 'text-primary-600');
                });
                
                btn.classList.remove('bg-white', 'text-primary-600');
                btn.classList.add('active', 'bg-gradient-to-r', 'from-primary-500', 'to-primary-600', 'text-white', 'shadow-gentle');
                btn.textContent = `Round ${i}`;
            }, 200);
        };
        
        if (i === 1) {
            btn.classList.add('active', 'bg-gradient-to-r', 'from-primary-500', 'to-primary-600', 'text-white', 'shadow-gentle');
            btn.classList.remove('bg-white', 'text-primary-600');
        }
        roundSelector.appendChild(btn);
    }
    
    // Show round display with fade-in effect
    const roundDisplay = document.getElementById('roundDisplay');
    roundDisplay.style.opacity = '0';
    roundDisplay.style.display = 'block';
    
    setTimeout(() => {
        roundDisplay.style.transition = 'opacity 0.5s ease-in-out';
        roundDisplay.style.opacity = '1';
    }, 100);
}

// Enhanced round display with court color coding
function displayRound(roundNum) {
    const round = tournamentData.schedule[roundNum - 1];
    
    // Update round title with animation
    const roundTitle = document.getElementById('roundTitle');
    roundTitle.style.transform = 'translateY(-10px)';
    roundTitle.style.opacity = '0';
    
    setTimeout(() => {
        roundTitle.textContent = `Round ${roundNum}`;
        roundTitle.style.transition = 'all 0.3s ease';
        roundTitle.style.transform = 'translateY(0)';
        roundTitle.style.opacity = '1';
    }, 150);
    
    // Update bye players with enhanced styling
    const byePlayersEl = document.getElementById('byePlayers');
    if (round.byePlayers && round.byePlayers.length > 0) {
        byePlayersEl.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span class="text-amber-700 text-sm font-medium">Sitting Out: </span>
                <div class="flex gap-1">
                    ${round.byePlayers.map(player => 
                        `<span class="font-semibold text-amber-800">Player ${player}</span>`
                    ).join(', ')}
                </div>
            </div>
        `;
        byePlayersEl.style.display = 'block';
    } else {
        byePlayersEl.style.display = 'none';
    }
    
    // Generate courts with enhanced design
    const courtsGrid = document.getElementById('courtsGrid');
    courtsGrid.style.opacity = '0';
    
    setTimeout(() => {
        courtsGrid.innerHTML = '';
        
        const courtColors = {
            1: { bg: 'from-blue-50 to-blue-100 border-blue-200', header: 'bg-blue-500' },
            2: { bg: 'from-purple-50 to-purple-100 border-purple-200', header: 'bg-purple-500' },
            3: { bg: 'from-emerald-50 to-emerald-100 border-emerald-200', header: 'bg-emerald-500' },
            4: { bg: 'from-orange-50 to-orange-100 border-orange-200', header: 'bg-orange-500' },
            5: { bg: 'from-pink-50 to-pink-100 border-pink-200', header: 'bg-pink-500' }
        };
        
        round.courts.forEach((court, index) => {
            const [p1, p2, p3, p4] = court;
            const matchKey = `R${roundNum}C${index + 1}`;
            const courtNum = index + 1;
            const colors = courtColors[courtNum] || courtColors[1];
            
            const courtCard = document.createElement('div');
            courtCard.className = `court-card bg-gradient-to-br ${colors.bg} rounded-2xl p-6 shadow-gentle border hover:shadow-soft transition-all duration-500 hover:-translate-y-1`;
            courtCard.style.animationDelay = `${index * 0.1}s`;
            courtCard.innerHTML = `
                <div class="flex items-center justify-center mb-4">
                    <div class="${colors.header} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                        <div class="pickleball-icon w-4 h-4"></div>
                        Court ${courtNum}
                    </div>
                </div>
                
                <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 space-y-3">
                    <div class="team bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between shadow-sm border border-gray-100">
                        <div class="team-players flex items-center gap-2">
                            <div class="player-number bg-gradient-to-r from-primary-500 to-primary-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 hover:scale-110">${p1}</div>
                            <span class="font-semibold text-gray-600">&</span>
                            <div class="player-number bg-gradient-to-r from-primary-500 to-primary-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 hover:scale-110">${p2}</div>
                        </div>
                        <input type="number" 
                               class="score-input w-12 h-10 text-center border-2 border-gray-200 rounded-lg bg-gradient-to-br from-white to-gray-50 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-300 focus:scale-105" 
                               id="score_${matchKey}_team1" 
                               placeholder="0"
                               min="0"
                               value="${matchResults[matchKey]?.team1Score || ''}">
                    </div>
                    
                    <div class="text-center text-gray-400 font-semibold text-sm py-1">VS</div>
                    
                    <div class="team bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between shadow-sm border border-gray-100">
                        <div class="team-players flex items-center gap-2">
                            <div class="player-number bg-gradient-to-r from-secondary-500 to-secondary-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 hover:scale-110">${p3}</div>
                            <span class="font-semibold text-gray-600">&</span>
                            <div class="player-number bg-gradient-to-r from-secondary-500 to-secondary-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 hover:scale-110">${p4}</div>
                        </div>
                        <input type="number" 
                               class="score-input w-12 h-10 text-center border-2 border-gray-200 rounded-lg bg-gradient-to-br from-white to-gray-50 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-300 focus:scale-105" 
                               id="score_${matchKey}_team2" 
                               placeholder="0"
                               min="0"
                               value="${matchResults[matchKey]?.team2Score || ''}">
                    </div>
                </div>
            `;
            
            courtsGrid.appendChild(courtCard);
        });
        
        // Fade in courts
        courtsGrid.style.transition = 'opacity 0.5s ease-in-out';
        courtsGrid.style.opacity = '1';
        
        // Add hover effects
        setTimeout(() => {
            UIAnimations.addCourtHoverEffects();
        }, 500);
        
    }, 200);
}

// Enhanced score submission with compassionate feedback
function submitRoundScores() {
    const submitBtn = document.querySelector('.submit-scores-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = `
        <span class="flex items-center justify-center gap-2">
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Submitting with care...
        </span>
    `;
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const round = tournamentData.schedule[currentRound - 1];
        let allScoresEntered = true;
        let newResults = {};
        
        round.courts.forEach((court, index) => {
            const [p1, p2, p3, p4] = court;
            const matchKey = `R${currentRound}C${index + 1}`;
            
            const team1Score = document.getElementById(`score_${matchKey}_team1`).value;
            const team2Score = document.getElementById(`score_${matchKey}_team2`).value;
            
            if (team1Score === '' || team2Score === '') {
                allScoresEntered = false;
                return;
            }
            
            newResults[matchKey] = {
                round: currentRound,
                court: index + 1,
                team1: [p1, p2],
                team2: [p3, p4],
                team1Score: parseInt(team1Score),
                team2Score: parseInt(team2Score)
            };
            
            updatePlayerStats(p1, p2, p3, p4, parseInt(team1Score), parseInt(team2Score));
        });
        
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        if (!allScoresEntered) {
            UIAnimations.showError('Please enter scores for all matches before submitting.');
            return;
        }
        
        // Store results
        Object.assign(matchResults, newResults);
        
        // Update standings with animation
        updateStandings();
        
        // Success feedback
        UIAnimations.showSuccess(`Round ${currentRound} scores submitted successfully! Thank you for your care.`);
        
        // Move to next round if available
        if (currentRound < tournamentData.metadata.rounds) {
            setTimeout(() => {
                currentRound++;
                displayRound(currentRound);
                
                // Update active button
                document.querySelectorAll('.round-btn').forEach((b, i) => {
                    b.classList.remove('active', 'bg-gradient-to-r', 'from-primary-500', 'to-primary-600', 'text-white', 'shadow-gentle');
                    b.classList.add('bg-white', 'text-primary-600');
                    
                    if (i === currentRound - 1) {
                        b.classList.remove('bg-white', 'text-primary-600');
                        b.classList.add('active', 'bg-gradient-to-r', 'from-primary-500', 'to-primary-600', 'text-white', 'shadow-gentle');
                    }
                });
            }, 1500);
        } else {
            setTimeout(() => {
                UIAnimations.showSuccess('Tournament complete! Thank you for supporting Sotos Syndrome families. Check the final standings.');
            }, 1500);
        }
    }, 1000);
}

// Keep existing player stats and standings functions
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
        
        playerStats[player].partners.add(player === p3 ? p4 : p3);
        playerStats[player].opponents.add(p1);
        playerStats[player].opponents.add(p2);
    });
}

// Enhanced standings with charity theming
function updateStandings() {
    const standingsBody = document.getElementById('standingsBody');
    
    // Fade out current standings
    standingsBody.style.opacity = '0';
    
    setTimeout(() => {
        standingsBody.innerHTML = '';
        
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
            row.className = 'border-b border-gray-100 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-secondary-50/50 transition-all duration-300';
            row.innerHTML = `
                <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                        <div class="text-sm font-medium text-gray-500 min-w-[2rem]">#${index + 1}</div>
                        <div class="player-number bg-gradient-to-r from-primary-500 to-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">${player.player}</div>
                        <span class="font-medium">Player ${player.player}</span>
                        ${tournamentData.metadata.iron_players.includes(player.player) ? 
                            '<span class="text-orange-500 text-sm" title="Iron Player - Never sits out">⚡</span>' : ''}
                        ${index < 3 ? '<span class="text-yellow-500 text-sm" title="Top Performer">⭐</span>' : ''}
                    </div>
                </td>
                <td class="text-center py-4 px-3 text-gray-700">${player.matches}</td>
                <td class="text-center py-4 px-3 font-semibold text-primary-600">${player.wins}</td>
                <td class="text-center py-4 px-3 text-gray-600">${player.losses}</td>
                <td class="text-center py-4 px-3 font-medium">${player.pointsFor}</td>
                <td class="text-center py-4 px-3 font-semibold ${player.diff >= 0 ? 'text-primary-600' : 'text-gray-500'}">${player.diff > 0 ? '+' : ''}${player.diff}</td>
            `;
            standingsBody.appendChild(row);
        });
        
        // Fade in new standings
        standingsBody.style.transition = 'opacity 0.5s ease-in-out';
        standingsBody.style.opacity = '1';
    }, 300);
}

// Initialize app when page loads
window.addEventListener('DOMContentLoaded', loadTournamentData);