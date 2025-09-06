# SOTOS Tournament Tier Mapping Guide
## Optimal Player Position Assignment for Competitive Balance

### Quick Reference: Position Assignment by Skill Ranking

When you provide a ranked list of 22 players (1 = best, 22 = weakest), assign them to these tournament positions:

| Your Ranking | Tournament Position | Tier        | Notes                           |
|--------------|-------------------|-------------|----------------------------------|
| **1st best** | Position 5        | TOP TIER    | Strongest players distributed    |
| **2nd best** | Position 6        | TOP TIER    | across top tier positions        |
| **3rd best** | Position 13       | TOP TIER    |                                  |
| **4th best** | Position 18       | TOP TIER    |                                  |
| **5th best** | Position 22       | TOP TIER    |                                  |
| **6th**      | Position 1        | MIDDLE      | Strong middle players            |
| **7th**      | Position 3        | MIDDLE      |                                  |
| **8th**      | Position 4        | MIDDLE      |                                  |
| **9th**      | Position 7        | MIDDLE      | Iron player (no byes)            |
| **10th**     | Position 14       | MIDDLE      | Iron player (no byes)            |
| **11th**     | Position 8        | MIDDLE      |                                  |
| **12th**     | Position 9        | MIDDLE      |                                  |
| **13th**     | Position 10       | MIDDLE      |                                  |
| **14th**     | Position 15       | MIDDLE      |                                  |
| **15th**     | Position 16       | MIDDLE      |                                  |
| **16th**     | Position 17       | MIDDLE      |                                  |
| **17th**     | Position 21       | MIDDLE      | Weaker middle players            |
| **18th weakest** | Position 2    | BOTTOM TIER | Weakest players distributed      |
| **19th weakest** | Position 11   | BOTTOM TIER | across bottom tier positions     |
| **20th weakest** | Position 12   | BOTTOM TIER |                                  |
| **21st weakest** | Position 19   | BOTTOM TIER |                                  |
| **22nd weakest** | Position 20   | BOTTOM TIER |                                  |

---

## How to Use This Guide

### Step 1: Rank Your Players
Create a list of all 22 players ranked by skill level:
- 1 = Your strongest player
- 22 = Your weakest player

### Step 2: Map to Positions
Using the table above, assign each ranked player to their tournament position number.

### Example Mapping

If your players are ranked like this:
```
1. Sarah (best player)
2. Mike
3. John
4. Emily
5. David
...
18. Tom
19. Lisa
20. Amy
21. Bob
22. Carol (weakest player)
```

They would be assigned to positions:
```
Sarah → Position 5
Mike → Position 6
John → Position 13
Emily → Position 18
David → Position 22
...
Tom → Position 2
Lisa → Position 11
Amy → Position 12
Bob → Position 19
Carol → Position 20
```

---

## Why This Mapping Works

### Tier Distribution
- **Top Tier (5 players):** Positions 5, 6, 13, 18, 22
- **Middle Tier (12 players):** Positions 1, 3, 4, 7, 8, 9, 10, 14, 15, 16, 17, 21
- **Bottom Tier (5 players):** Positions 2, 11, 12, 19, 20

### Key Benefits
1. **Minimal Same-Tier Partnerships:** Only 4 violations across 10 rounds
2. **Maximum Competitive Matchups:** 22 games with top vs bottom tier opponents
3. **Balanced Competition:** Strong players help weaker partners
4. **Fair Distribution:** Iron players (7, 14) in middle tier for balance

### Violation Details (for reference)
The few times same-tier players partner:
- Round 5, Court 4: Positions 18 & 22 (top tier)
- Round 6, Court 1: Positions 19 & 2 (bottom tier)
- Round 6, Court 2: Positions 20 & 11 (bottom tier)
- Round 9, Court 3: Positions 6 & 13 (top tier)

---

## Special Considerations

### Iron Players
- **Positions 7 & 14** never get byes (play all 10 rounds)
- Assigned to middle-tier players (ranks 9-10) for balance
- Their points are factored by 0.9x in scoring

### Flexibility Notes
- If you have players of similar skill, you can swap within the same tier
- Middle tier has most flexibility for adjustment
- Keep top 5 and bottom 5 players in their respective tiers for best results

---

## Quick Implementation Checklist

- [ ] Get ranked list of 22 players (1=best, 22=weakest)
- [ ] Map each player to their assigned position using the table
- [ ] Enter player names in position order in the tournament system
- [ ] Verify iron players (positions 7 & 14) are appropriate for extra games
- [ ] Double-check top 5 players are in positions: 5, 6, 13, 18, 22
- [ ] Double-check bottom 5 players are in positions: 2, 11, 12, 19, 20

---

*Generated: January 2025*
*Based on OPTIMAL_22P_7VIOLATIONS_97PCT.json tournament schedule*
*Optimized for minimal same-tier partnerships and maximum competitive balance*