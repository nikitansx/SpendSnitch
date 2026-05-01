# SpendSnitch — Social Budgeting App

Turn budgeting into a competitive game. Log bad spends, get snitched on, and watch your ranking drop on the live leaderboard.

## Setup & Run

### Prerequisites
- Python 3.8+
- pip

### 1. Clone & Install

```bash
git clone https://github.com/nikitansx/SpendSnitch.git
cd SpendSnitch
python3 -m venv venv
source venv/bin/activate
pip install flask
```

### 2. Start the App

```bash
python app.py
```

You'll see:
```
Running on http://127.0.0.1:5000
```

Copy that link and paste it in your browser.

### 3. If Port 5000 Is Busy

```bash
lsof -i :5000
```

Find the PID and kill it:
```bash
kill -9 <PID>
python app.py
```

Then open the link in your browser.

---

## What Works

### ✅ Leaderboard
- 3 tabs: This Week / Month / All Time
- Podium shows top 3 players
- Live rankings update when you react
- Gold/silver/bronze rank colors

### ✅ Activity Feed
- Shows all snitch events in real-time
- Like/dislike buttons for each event
- Feed refreshes every 15 seconds
- Event badges (SNITCHED, GOAL HIT, STREAK, CLEAN)

### ✅ Punishment Voting
- Top 3 most snitched players face punishments
- 2 humiliating options per player
- Vote bars update live
- LEADING tag shows winning punishment

### ✅ Homepage
- Marketing landing page
- Navigation works (Home / Leaderboard)
- White background, clean design

---

## What Doesn't Work

### ❌ Scoring Issue
**Like/Dislike buttons don't properly update player scores on the leaderboard.** The points change in the feed display but the leaderboard rankings don't re-sort correctly. This is a bug in the reaction logic that needs fixing.

**Workaround:** The punishments voting and feed display work fine. Use those while scoring is being debugged.

---

## Customize

### Change Punishments

**File:** `app.py`

**Search for:** `PUNISHMENTS = [`

Edit the label:
```python
{"id":"p1","label":"Your custom punishment here","votes":15,"target_player":"ln","offense":"What they did"},
```

### Change Players

**File:** `app.py`

**Search for:** `PLAYERS = [`

Add/edit:
```python
{"id":"jk","name":"Jordan Kim","initials":"JK","bg":"#fef3d0","fg":"#8a6a00"},
```

### Change Starting Scores

**File:** `app.py`

**Search for:** `WEEKLY_BASE`

Edit the dict:
```python
WEEKLY_BASE = {"jk":1050,"ml":1048,"at":1046, ...}
```

---

## Troubleshooting

**Page won't load?**
```bash
killall python
python app.py
```

**Still getting errors?** Check the terminal output for Flask errors and fix them.

**Changes not showing?** Restart Flask and hard-refresh browser (`Cmd + Shift + R` on Mac).

---

## File Structure

```
SpendSnitch/
├── app.py                    (Flask backend)
├── templates/
│   ├── index.html           (Homepage)
│   └── leaderboard.html     (Leaderboard + Feed + Punishments)
└── venv/                    (Virtual environment)
```

---
