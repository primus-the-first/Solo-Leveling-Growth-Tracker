# AI Onboarding Questions Template

Template for the System AI to collect user goals and generate personalized quest plans.

---

## Onboarding Questions

### Pillar 1: Personal & Discipline

> Discipline forges power. What daily habits do you want to master?

### Pillar 2: Spiritual Growth

> True strength comes from within. What gives you purpose and peace?

### Pillar 3: Financial Freedom

> Freedom requires resources. What are your financial goals?

### Pillar 4: Career & Skills

> Skills are your weapons. What abilities do you want to develop?

### Pillar 5: Knowledge & Learning

> Knowledge is power. What do you want to learn?

---

## Quest Generation Prompt

After collecting answers, use this prompt to generate quests:

```
Based on the user's goals:
- Personal: "[answer]"
- Spiritual: "[answer]"
- Financial: "[answer]"
- Career: "[answer]"
- Learning: "[answer]"

Generate a structured quest plan in JSON format:

{
  "dailyQuests": [
    { "name": "Short daily action (5-30 min)", "pillar": "Pillar name", "xp": 20 }
  ],
  "weeklyQuests": [
    { "name": "Weekly milestone", "pillar": "Pillar name", "xp": 50 }
  ],
  "monthlyQuests": [
    { "name": "Major monthly achievement", "pillar": "Pillar name", "xp": 200 }
  ]
}

Guidelines:
- Daily: Small, repeatable actions (5-30 min)
- Weekly: Progress milestones
- Monthly: Major achievements/completions
- Each pillar should have at least 1 daily quest
- XP values: Daily=20, Weekly=50, Monthly=200
```

---

## Example Output

For a user who said:

- Personal: "I want to read more and exercise"
- Spiritual: "Daily meditation"
- Financial: "Save $500/month"
- Career: "Learn Python programming"
- Learning: "Complete 12 books this year"

Generated quests:

**Daily Quests:**
| Quest | Pillar | XP |
|-------|--------|-----|
| Read 10-20 pages | Personal & Discipline | 20 |
| Exercise 20-30 min | Personal & Discipline | 20 |
| Meditate 10 min | Spiritual Growth | 20 |
| Track spending | Financial Freedom | 20 |
| Code practice 30 min | Career & Skills | 20 |

**Weekly Quests:**
| Quest | Pillar | XP |
|-------|--------|-----|
| Read 50+ pages | Personal & Discipline | 50 |
| 5 workout sessions | Personal & Discipline | 50 |
| Weekly reflection | Spiritual Growth | 50 |
| Review weekly spending | Financial Freedom | 50 |
| Complete coding lesson | Career & Skills | 50 |

**Monthly Quests:**
| Quest | Pillar | XP |
|-------|--------|-----|
| Finish 1 book | Knowledge & Learning | 200 |
| Save $500 | Financial Freedom | 200 |
| Complete project milestone | Career & Skills | 200 |
| Monthly journal entry | Spiritual Growth | 200 |
