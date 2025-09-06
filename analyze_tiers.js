const fs = require('fs');

// Load the tournament schedule
const schedule = JSON.parse(fs.readFileSync('./TourneySchedules/OPTIMAL_22P_7VIOLATIONS_97PCT.json', 'utf8'));

// Function to analyze tier violations for a given configuration
function analyzeTierConfiguration(topTier, bottomTier) {
  const middleTier = [];
  for (let i = 1; i <= 22; i++) {
    if (!topTier.includes(i) && !bottomTier.includes(i)) {
      middleTier.push(i);
    }
  }
  
  let violations = 0;
  const violationDetails = [];
  let goodMatchups = 0;  // Count when top vs bottom as opponents
  const goodMatchupDetails = [];
  
  // Check each round
  schedule.schedule.forEach((round, roundIndex) => {
    round.courts.forEach((court, courtIndex) => {
      const [p1, p2, p3, p4] = court;
      
      // Check Team 1 (p1 & p2) - VIOLATIONS when same tier are partners
      const team1Top = [p1, p2].filter(p => topTier.includes(p)).length;
      const team1Bottom = [p1, p2].filter(p => bottomTier.includes(p)).length;
      
      if (team1Top === 2) {
        violations++;
        violationDetails.push(`Round ${roundIndex + 1}, Court ${courtIndex + 1}: Top tier partners (${p1}, ${p2})`);
      }
      if (team1Bottom === 2) {
        violations++;
        violationDetails.push(`Round ${roundIndex + 1}, Court ${courtIndex + 1}: Bottom tier partners (${p1}, ${p2})`);
      }
      
      // Check Team 2 (p3 & p4) - VIOLATIONS when same tier are partners
      const team2Top = [p3, p4].filter(p => topTier.includes(p)).length;
      const team2Bottom = [p3, p4].filter(p => bottomTier.includes(p)).length;
      
      if (team2Top === 2) {
        violations++;
        violationDetails.push(`Round ${roundIndex + 1}, Court ${courtIndex + 1}: Top tier partners (${p3}, ${p4})`);
      }
      if (team2Bottom === 2) {
        violations++;
        violationDetails.push(`Round ${roundIndex + 1}, Court ${courtIndex + 1}: Bottom tier partners (${p3}, ${p4})`);
      }
      
      // Check for GOOD matchups (top vs bottom as opponents)
      const team1HasTop = team1Top > 0;
      const team1HasBottom = team1Bottom > 0;
      const team2HasTop = team2Top > 0;
      const team2HasBottom = team2Bottom > 0;
      
      if ((team1HasTop && team2HasBottom) || (team1HasBottom && team2HasTop)) {
        goodMatchups++;
        goodMatchupDetails.push(`Round ${roundIndex + 1}, Court ${courtIndex + 1}: Good matchup (tier separation)`);
      }
    });
  });
  
  return { violations, violationDetails, topTier, bottomTier, middleTier, goodMatchups, goodMatchupDetails };
}

// Test different configurations
console.log("=== TIER ANALYSIS FOR TOURNAMENT SCHEDULE ===\n");

// Test configuration 1: Your suggested ranges
const config1 = analyzeTierConfiguration(
  [16, 17, 18, 19, 20, 21, 22], // Top tier (7 players)
  [1, 2, 3, 4, 5, 6, 7, 8, 9]    // Bottom tier (9 players)
);

console.log("Configuration 1: Top=[16-22], Bottom=[1-9]");
console.log(`Partner violations: ${config1.violations}`);
console.log(`Good matchups (tier vs tier): ${config1.goodMatchups}/50`);
console.log(`Middle tier: [${config1.middleTier.join(', ')}]\n`);

// Test configuration 2: Even split
const config2 = analyzeTierConfiguration(
  [1, 2, 3, 4, 5, 6, 7],          // Top tier (7 players)
  [16, 17, 18, 19, 20, 21, 22]    // Bottom tier (7 players)
);

console.log("Configuration 2: Top=[1-7], Bottom=[16-22]");
console.log(`Partner violations: ${config2.violations}`);
console.log(`Good matchups (tier vs tier): ${config2.goodMatchups}/50`);
console.log(`Middle tier: [${config2.middleTier.join(', ')}]\n`);

// Test configuration 3: Smaller extremes
const config3 = analyzeTierConfiguration(
  [1, 2, 3, 4, 5],                // Top tier (5 players)
  [18, 19, 20, 21, 22]             // Bottom tier (5 players)
);

console.log("Configuration 3: Top=[1-5], Bottom=[18-22]");
console.log(`Partner violations: ${config3.violations}`);
console.log(`Good matchups (tier vs tier): ${config3.goodMatchups}/50`);
console.log(`Middle tier: [${config3.middleTier.join(', ')}]\n`);

// Test configuration 4: Strategic selection based on iron players
const config4 = analyzeTierConfiguration(
  [7, 14, 1, 3, 5],                // Include iron players in top
  [19, 20, 21, 22, 18]             // Bottom tier
);

console.log("Configuration 4: Top=[7,14,1,3,5], Bottom=[19,20,21,22,18]");
console.log(`Partner violations: ${config4.violations}`);
console.log(`Good matchups (tier vs tier): ${config4.goodMatchups}/50`);
console.log(`Middle tier: [${config4.middleTier.join(', ')}]\n`);

// Try random configurations to find optimal
console.log("=== SEARCHING FOR OPTIMAL CONFIGURATION ===\n");

let bestConfig = null;
let minViolations = Infinity;

// Try different sized tiers
for (let topSize = 5; topSize <= 8; topSize++) {
  for (let bottomSize = 5; bottomSize <= 8; bottomSize++) {
    // Try different combinations
    for (let attempt = 0; attempt < 100; attempt++) {
      const players = Array.from({length: 22}, (_, i) => i + 1);
      
      // Shuffle and pick
      for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
      }
      
      const topTier = players.slice(0, topSize);
      const bottomTier = players.slice(topSize, topSize + bottomSize);
      
      const config = analyzeTierConfiguration(topTier, bottomTier);
      
      if (config.violations < minViolations) {
        minViolations = config.violations;
        bestConfig = config;
      }
    }
  }
}

console.log("BEST CONFIGURATION FOUND:");
console.log(`Top tier (${bestConfig.topTier.length} players): [${bestConfig.topTier.sort((a,b) => a-b).join(', ')}]`);
console.log(`Middle tier (${bestConfig.middleTier.length} players): [${bestConfig.middleTier.sort((a,b) => a-b).join(', ')}]`);
console.log(`Bottom tier (${bestConfig.bottomTier.length} players): [${bestConfig.bottomTier.sort((a,b) => a-b).join(', ')}]`);
console.log(`Partner violations: ${bestConfig.violations}`);
console.log(`Good matchups: ${bestConfig.goodMatchups}/50\n`);

// Show detailed violations for best config
if (bestConfig.violations > 0 && bestConfig.violations < 20) {
  console.log("Violation details:");
  bestConfig.violationDetails.forEach(v => console.log(`  - ${v}`));
}

// Analyze specific strategic configuration
console.log("\n=== STRATEGIC ANALYSIS ===\n");

// Based on pairs that meet twice, try to separate them
const strategicTop = [1, 4, 7, 14, 16];
const strategicBottom = [5, 10, 19, 20, 22];
const strategicConfig = analyzeTierConfiguration(strategicTop, strategicBottom);

console.log("Strategic Configuration (based on pair frequencies):");
console.log(`Top tier: [${strategicTop.join(', ')}]`);
console.log(`Middle tier: [${strategicConfig.middleTier.sort((a,b) => a-b).join(', ')}]`);
console.log(`Bottom tier: [${strategicBottom.join(', ')}]`);
console.log(`Partner violations: ${strategicConfig.violations}`);
console.log(`Good matchups: ${strategicConfig.goodMatchups}/50`);

if (strategicConfig.violations > 0 && strategicConfig.violations < 15) {
  console.log("\nViolation details:");
  strategicConfig.violationDetails.forEach(v => console.log(`  - ${v}`));
}