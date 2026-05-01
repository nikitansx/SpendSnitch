# SpendSnitch — Local Dev Setup

## Requirements
- Python 3.8+
- pip

## Install & Run

```bash
cd spendsnitch
pip install flask
python app.py
```

Then open: http://localhost:5000

## What works
- Leaderboard with This Week / Month / All Time tabs + date ranges
- Live activity feed with like/dislike buttons
- Likes update the snitched person's score live — leaderboard re-sorts
- Likes are capped at 20 (max friend group size)
- Punishment voting section at the bottom
- All state is in-memory (resets on restart — swap for SQLite/Postgres for persistence)
