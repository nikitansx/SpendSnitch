from flask import Flask, jsonify, request, render_template
from datetime import datetime, date, timedelta

app = Flask(__name__)

today = date.today()
monday = today - timedelta(days=today.weekday())

PLAYERS = [
    {"id":"jk","name":"Jordan Kim",    "initials":"JK","bg":"#fef3d0","fg":"#8a6a00"},
    {"id":"ml","name":"Mia Lawson",    "initials":"ML","bg":"#e8eef8","fg":"#2a4a8a"},
    {"id":"at","name":"Amara Touré",   "initials":"AT","bg":"#fde8e4","fg":"#a03030"},
    {"id":"po","name":"Priya Okonkwo", "initials":"PO","bg":"#fef3d0","fg":"#8a6a00"},
    {"id":"me","name":"Nikita",        "initials":"NK","bg":"#e8f2eb","fg":"#2d5a3d","is_me":True},
    {"id":"sr","name":"Sam Reeves",    "initials":"SR","bg":"#fde8e4","fg":"#a03030"},
    {"id":"kw","name":"Kofi Williams", "initials":"KW","bg":"#ede9fe","fg":"#6d28d9"},
    {"id":"ln","name":"Leila Nasser",  "initials":"LN","bg":"#fde8e4","fg":"#a03030"},
]

# Scores much closer together so reactions actually change rankings
WEEKLY_BASE  = {"jk":1050,"ml":1048,"at":1046,"po":1044,"me":1042,"sr":1040,"kw":1038,"ln":1036}
MONTHLY_BASE = {"jk":4200,"ml":4190,"at":4180,"po":4170,"me":4160,"sr":4150,"kw":4140,"ln":4130}
ALLTIME_BASE = {"jk":12500,"ml":12480,"at":12460,"po":12440,"me":12420,"sr":12400,"kw":12380,"ln":12360}
WEEK_CHANGES = {"jk":+8,"ml":+4,"at":+2,"po":+6,"me":-8,"sr":-12,"kw":0,"ln":-20}
SNITCH_COUNTS = {"jk":0,"ml":0,"at":1,"po":0,"me":3,"sr":3,"kw":0,"ln":5}

FEED_EVENTS = [
    {"id":"e1","player_id":"sr","type":"snitch","category":"UberEats","amount":34.50,
     "note":"Sam's 3rd snitch this week","pts_change":-8,
     "ts":(monday+timedelta(hours=13,minutes=23)).isoformat(),"likes":14,"dislikes":2},
    {"id":"e2","player_id":"po","type":"streak","streak_days":5,"pts_change":+6,
     "ts":(monday+timedelta(hours=9,minutes=45)).isoformat(),"likes":11,"dislikes":0},
    {"id":"e3","player_id":"ln","type":"snitch","category":"Alcohol","amount":67.00,
     "note":"Leila's 5th snitch — budget exceeded by $42",
     "pts_change":-12,"ts":(monday-timedelta(hours=2)).isoformat(),"likes":12,"dislikes":5},
    {"id":"e4","player_id":"jk","type":"goal","budget":150,"under_by":28,"pts_change":+8,
     "ts":(monday-timedelta(hours=5)).isoformat(),"likes":14,"dislikes":1},
    {"id":"e5","player_id":"me","type":"snitch","category":"Coffee","amount":12.00,
     "note":"Nikita bought 3 coffees this week. Goal was 1.","pts_change":-4,
     "ts":(monday-timedelta(hours=8)).isoformat(),"likes":8,"dislikes":11},
    {"id":"e6","player_id":"kw","type":"clean","pts_change":+2,
     "ts":(monday-timedelta(days=1,hours=2)).isoformat(),"likes":5,"dislikes":0},
    {"id":"e7","player_id":"at","type":"snitch","category":"Clothes","amount":89.00,
     "note":"Amara's impulse buy — broke the no-clothes rule",
     "pts_change":-6,"ts":(monday-timedelta(days=1,hours=6)).isoformat(),"likes":14,"dislikes":3},
    {"id":"e8","player_id":"ml","type":"goal","budget":200,"under_by":55,"pts_change":+10,
     "ts":(monday-timedelta(days=2)).isoformat(),"likes":14,"dislikes":0},
    {"id":"e9","player_id":"me","type":"snitch","category":"Coffee","amount":8.50,
     "note":"Nikita's 2nd coffee this week — goal is 1 per week",
     "pts_change":-4,"ts":(monday-timedelta(days=2,hours=3)).isoformat(),"likes":16,"dislikes":4},
    {"id":"e10","player_id":"me","type":"snitch","category":"Coffee","amount":6.00,
     "note":"Nikita's first coffee snitch — weekly limit triggered",
     "pts_change":-2,"ts":(monday-timedelta(days=3,hours=1)).isoformat(),"likes":9,"dislikes":2},
]

# NZ-appropriate embarrassing punishments - 3 people with 2 humiliating options each
PUNISHMENTS = [
    {"id":"p1","icon":"📱","label":"Text your crush: 'be honest… would you survive in minecraft'","votes":15,"target_player":"ln","offense":"Leila spent $67 on alcohol"},
    {"id":"p2","icon":"💔","label":"Send 'we need to talk' to someone and never respond for 48 hours","votes":12,"target_player":"ln","offense":"Leila spent $67 on alcohol"},
    
    {"id":"p3","icon":"☕","label":"Post on your story: 'I've bought 3 coffees instead of 1. I hate myself.'","votes":11,"target_player":"me","offense":"Nikita bought 3 coffees instead of 1"},
    {"id":"p4","icon":"📧","label":"Email your teacher 'I know what you did' and refuse to explain for 24 hours","votes":9,"target_player":"me","offense":"Nikita bought 3 coffees instead of 1"},
    
    {"id":"p5","icon":"🍔","label":"Order UberEats and send the notification screenshot to the group chat","votes":9,"target_player":"sr","offense":"Sam spent $34.50 on UberEats"},
    {"id":"p6","icon":"😳","label":"DM a spicy text to a cousin and read it aloud to the group","votes":6,"target_player":"sr","offense":"Sam spent $34.50 on UberEats"},
]

STATE = {
    "scores":      dict(WEEKLY_BASE),
    "week_changes":dict(WEEK_CHANGES),
    "snitch_counts":dict(SNITCH_COUNTS),
    "feed":        {e["id"]:{"likes":e["likes"],"dislikes":e["dislikes"]} for e in FEED_EVENTS},
    "user_reactions":    {},
    "punishment_votes":  {p["id"]:p["votes"] for p in PUNISHMENTS},
    "user_punishment_votes": set(),
}

def player_map():
    return {p["id"]: p for p in PLAYERS}

def most_snitched_players():
    """Return top 3 most snitched players"""
    sorted_by_snitch = sorted(
        STATE["snitch_counts"].items(),
        key=lambda x: x[1],
        reverse=True
    )[:3]
    pm = player_map()
    return [
        {**pm[pid], "snitch_count": count}
        for pid, count in sorted_by_snitch
    ]

def build_leaderboard(period="week"):
    pm = player_map()
    rows = []
    for pid, p in pm.items():
        if period == "week":
            score  = STATE["scores"][pid]
            change = STATE["week_changes"][pid]
        elif period == "month":
            score  = MONTHLY_BASE[pid]
            change = None
        else:
            score  = ALLTIME_BASE[pid]
            change = None
        snitch_n = STATE["snitch_counts"][pid]
        rows.append({**p,"score":score,"change":change,
                     "snitched":snitch_n>0,"snitch_count":snitch_n})
    rows.sort(key=lambda r: -r["score"])
    for i, r in enumerate(rows):
        r["rank"] = i + 1
    return rows

def date_range_label(period):
    t = date.today()
    if period == "week":
        mon = t - timedelta(days=t.weekday())
        sun = mon + timedelta(days=6)
        return f"{mon.strftime('%b %d')} – {sun.strftime('%b %d, %Y')}"
    elif period == "month":
        first = t.replace(day=1)
        last = first.replace(month=first.month+1,day=1)-timedelta(days=1) if first.month<12 else first.replace(day=31)
        return f"{first.strftime('%B %Y')} ({first.strftime('%b %d')} – {last.strftime('%b %d')})"
    else:
        return "All time (since Jan 2025)"

# PAGE ROUTES
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/leaderboard")
def leaderboard():
    return render_template("leaderboard.html")

# API ROUTES
@app.route("/api/leaderboard")
def api_leaderboard():
    period = request.args.get("period","week")
    return jsonify({"period":period,"date_range":date_range_label(period),
                    "leaderboard":build_leaderboard(period),"most_snitched":most_snitched_players()})

@app.route("/api/feed")
def api_feed():
    pm = player_map()
    events = []
    for e in FEED_EVENTS:
        counts   = STATE["feed"][e["id"]]
        reaction = STATE["user_reactions"].get(e["id"])
        events.append({**e,**counts,"reaction":reaction,"player":pm[e["player_id"]]})
    return jsonify(events)

@app.route("/api/react", methods=["POST"])
def api_react():
    data   = request.json
    eid    = data["event_id"]
    action = data["action"]
    counts = STATE["feed"][eid]
    prev   = STATE["user_reactions"].get(eid)
    if prev == action:
        counts[action+"s"] = max(0, counts[action+"s"]-1)
        STATE["user_reactions"][eid] = None
        new_reaction = None
    else:
        if prev:
            counts[prev+"s"] = max(0, counts[prev+"s"]-1)
        counts[action+"s"] += 1
        STATE["user_reactions"][eid] = action
        new_reaction = action
    counts["likes"]    = min(counts["likes"],    20)
    counts["dislikes"] = min(counts["dislikes"], 20)
    event = next(e for e in FEED_EVENTS if e["id"]==eid)
    if event["type"] == "snitch":
        pid   = event["player_id"]
        # Like/dislike changes scores by 3 points so leaderboard visibly changes
        delta = -3 if new_reaction=="like" else (+3 if prev=="like" else 0)
        if delta:
            STATE["scores"][pid]       = max(0, STATE["scores"][pid]+delta)
            STATE["week_changes"][pid] += delta
    return jsonify({"likes":counts["likes"],"dislikes":counts["dislikes"],
                    "reaction":new_reaction,"leaderboard":build_leaderboard("week")})

@app.route("/api/punishments")
def api_punishments():
    most_snitched = most_snitched_players()
    result = []
    for p in PUNISHMENTS:
        result.append({**p,"votes":STATE["punishment_votes"][p["id"]],
                       "voted":p["id"] in STATE["user_punishment_votes"]})
    result.sort(key=lambda x: -x["votes"])
    return jsonify({"punishments":result,"most_snitched":most_snitched})

@app.route("/api/punishments/vote", methods=["POST"])
def api_punishment_vote():
    pid = request.json["punishment_id"]
    if pid in STATE["user_punishment_votes"]:
        STATE["user_punishment_votes"].discard(pid)
        STATE["punishment_votes"][pid] = max(0, STATE["punishment_votes"][pid]-1)
        voted = False
    else:
        STATE["user_punishment_votes"].add(pid)
        STATE["punishment_votes"][pid] += 1
        voted = True
    all_puns = []
    for p in PUNISHMENTS:
        all_puns.append({**p,"votes":STATE["punishment_votes"][p["id"]],
                         "voted":p["id"] in STATE["user_punishment_votes"]})
    all_puns.sort(key=lambda x: -x["votes"])
    most_snitched = most_snitched_players()
    return jsonify({"punishment_id":pid,"voted":voted,"punishments":all_puns,
                    "most_snitched":most_snitched})

if __name__ == "__main__":
    app.run(debug=True, port=5000)