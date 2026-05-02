import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

/* ---------------- TYPES ---------------- */

type PeriodKey = "week" | "month" | "alltime";

type Player = {
  id: string;
  name: string;
  initials: string;
  bg: string;
  fg: string;
  streak: number;
  goal: string;
  actual: string;
  brokeDate?: string;
  brokeReason?: string;
};

type Punishment = {
  id: string;
  label: string;
  votes: number;
  target: string;
  status: "pending" | "done";
};

/* ---------------- DATA ---------------- */

const empty = {
  dateRange: "",
  leaderboard: [] as Player[],
  punishments: [] as Punishment[],
};

const data: Record<PeriodKey, typeof empty> = {
  week: {
    dateRange: "May 02 – May 08, 2026",
    leaderboard: [
      { id: "sr", name: "Sam Reeves", initials: "SR", bg: "#FFE08A", fg: "#8B6914", streak: 6, goal: "Goal: Pack lunch 5x/week", actual: "Under budget -12%" },
      { id: "jk", name: "Jordan Kim", initials: "JK", bg: "#D9F7A9", fg: "#4F772D", streak: 5, goal: "Goal: 2 coffees/week", actual: "Under budget -8%" },
      { id: "kw", name: "Kofi Williams", initials: "KW", bg: "#FFE08A", fg: "#8B6914", streak: 4, goal: "Goal: No UberEats", actual: "Under budget -5%" },
      { id: "po", name: "Priya Okonkwo", initials: "PO", bg: "#D9F7A9", fg: "#4F772D", streak: 3, goal: "Goal: No clothes buying", actual: "Under budget -2%" },
      { id: "ml", name: "Mia Lawson", initials: "ML", bg: "#A9E34B", fg: "#fff", streak: 2, goal: "Goal: $150/week budget", actual: "Over budget +3%" },
      { id: "at", name: "Amara Touré", initials: "AT", bg: "#A9E34B", fg: "#fff", streak: 1, goal: "Goal: Save $30/day", actual: "Over budget +18%" },
      { id: "ln", name: "Leila Nasser", initials: "LN", bg: "#A9E34B", fg: "#fff", streak: 0, goal: "Goal: $25 alcohol budget", actual: "Over budget +35%", brokeDate: "May 02", brokeReason: "Girls night got out of hand" },
      { id: "me", name: "Nikita", initials: "NK", bg: "#D9F7A9", fg: "#4F772D", streak: 0, goal: "Goal: 2 coffees/week", actual: "Over budget +48%", brokeDate: "May 02", brokeReason: "Stress-bought lattes all week" },
    ],
    punishments: [
      { id: "p1", label: "Sing 'Baby Shark' in a public place for 30 seconds", votes: 9, target: "ln", status: "pending" },
      { id: "p2", label: "Post a selfie with a silly face as your profile pic for 24h", votes: 11, target: "ln", status: "pending" },
      { id: "p3", label: "Text your crush 'are you a parking ticket because you have FINE written all over you' 😅", votes: 15, target: "me", status: "pending" },
      { id: "p4", label: "Wear mismatched socks to work for a whole week", votes: 12, target: "me", status: "pending" },
    ],
  },

  month: {
    dateRange: "April 02 – May 02, 2026",
    leaderboard: [
      { id: "sr", name: "Sam Reeves", initials: "SR", bg: "#FFE08A", fg: "#8B6914", streak: 6, goal: "Goal: Pack lunch 5x/week", actual: "Under budget -11%" },
      { id: "at", name: "Amara Touré", initials: "AT", bg: "#A9E34B", fg: "#fff", streak: 5, goal: "Goal: Save $30/day", actual: "Under budget -9%" },
      { id: "kw", name: "Kofi Williams", initials: "KW", bg: "#FFE08A", fg: "#8B6914", streak: 4, goal: "Goal: No UberEats", actual: "Under budget -6%" },
      { id: "jk", name: "Jordan Kim", initials: "JK", bg: "#D9F7A9", fg: "#4F772D", streak: 3, goal: "Goal: 2 coffees/week", actual: "Under budget -3%" },
      { id: "po", name: "Priya Okonkwo", initials: "PO", bg: "#D9F7A9", fg: "#4F772D", streak: 2, goal: "Goal: No clothes buying", actual: "Under budget -1%" },
      { id: "ml", name: "Mia Lawson", initials: "ML", bg: "#A9E34B", fg: "#fff", streak: 1, goal: "Goal: $150/week budget", actual: "Over budget +2%" },
      { id: "ln", name: "Leila Nasser", initials: "LN", bg: "#A9E34B", fg: "#fff", streak: 0, goal: "Goal: $25 alcohol budget", actual: "Over budget +35%", brokeReason: "Party mode never off" },
      { id: "me", name: "Nikita", initials: "NK", bg: "#D9F7A9", fg: "#4F772D", streak: 0, goal: "Goal: 2 coffees/week", actual: "Over budget +48%", brokeReason: "Coffee addiction spiral" },
    ],
    punishments: [
      { id: "pm1", label: "Live tweet your location every hour for 24h", status: "pending", votes: 0, target: "ln" },
      { id: "pm2", label: "Apologize to your bank account on video", status: "pending", votes: 0, target: "ln" },
      { id: "pm3", label: "Wear a 'BUDGET FAIL' sticker all week", status: "pending", votes: 0, target: "me" },
      { id: "pm4", label: "Send budget receipt to group chat daily", status: "pending", votes: 0, target: "me" },
    ],
  },

  alltime: {
    dateRange: "Jan 01 – May 02, 2026",
    leaderboard: [
      { id: "kw", name: "Kofi Williams", initials: "KW", bg: "#FFE08A", fg: "#8B6914", streak: 6, goal: "Goal: No UberEats", actual: "Under budget -10%" },
      { id: "sr", name: "Sam Reeves", initials: "SR", bg: "#FFE08A", fg: "#8B6914", streak: 5, goal: "Goal: Pack lunch 5x/week", actual: "Under budget -7%" },
      { id: "jk", name: "Jordan Kim", initials: "JK", bg: "#D9F7A9", fg: "#4F772D", streak: 4, goal: "Goal: 2 coffees/week", actual: "Under budget -4%" },
      { id: "at", name: "Amara Touré", initials: "AT", bg: "#A9E34B", fg: "#fff", streak: 3, goal: "Goal: Save $30/day", actual: "Under budget -5%" },
      { id: "po", name: "Priya Okonkwo", initials: "PO", bg: "#D9F7A9", fg: "#4F772D", streak: 2, goal: "Goal: No clothes buying", actual: "Under budget -2%" },
      { id: "ml", name: "Mia Lawson", initials: "ML", bg: "#A9E34B", fg: "#fff", streak: 1, goal: "Goal: $150/week budget", actual: "Over budget +1%" },
      { id: "ln", name: "Leila Nasser", initials: "LN", bg: "#A9E34B", fg: "#fff", streak: 0, goal: "Goal: $25 alcohol budget", actual: "Over budget +28%", brokeReason: "Social butterfly budget" },
      { id: "me", name: "Nikita", initials: "NK", bg: "#D9F7A9", fg: "#4F772D", streak: 0, goal: "Goal: 2 coffees/week", actual: "Over budget +55%", brokeReason: "Year of poor choices" },
    ],
    punishments: [
      { id: "pa1", label: "Do a TikTok explaining your budget fail", status: "pending", votes: 0, target: "ln" },
      { id: "pa2", label: "Wear a 'FINANCIAL DISASTER' t-shirt for a week", status: "pending", votes: 0, target: "ln" },
      { id: "pa3", label: "Host a 'How I Ruined My Budget' presentation", status: "pending", votes: 0, target: "me" },
      { id: "pa4", label: "Create a cautionary tale poster for the fridge", status: "pending", votes: 0, target: "me" },
    ],
  },
};

// Player metadata for punishments display
const playerMetadata: Record<string, Player> = {
  me: { id: "me", name: "Nikita", initials: "NK", bg: "#D9F7A9", fg: "#4F772D", streak: 0, goal: "", actual: "" },
  ln: { id: "ln", name: "Leila Nasser", initials: "LN", bg: "#A9E34B", fg: "#fff", streak: 0, goal: "", actual: "" },
  at: { id: "at", name: "Amara Touré", initials: "AT", bg: "#A9E34B", fg: "#fff", streak: 0, goal: "", actual: "" },
  sr: { id: "sr", name: "Sam Reeves", initials: "SR", bg: "#FFE08A", fg: "#8B6914", streak: 0, goal: "", actual: "" },
  jk: { id: "jk", name: "Jordan Kim", initials: "JK", bg: "#D9F7A9", fg: "#4F772D", streak: 0, goal: "", actual: "" },
  ml: { id: "ml", name: "Mia Lawson", initials: "ML", bg: "#A9E34B", fg: "#fff", streak: 0, goal: "", actual: "" },
};

/* ---------------- SCREEN ---------------- */

export default function LeaderboardScreen() {
  const [period, setPeriod] = useState<PeriodKey>("week");
  const [votedPunishments, setVotedPunishments] = useState<Set<string>>(new Set());

  const current = data?.[period] ?? data.week;

  const sorted = useMemo(() => {
    const list = [...(current.leaderboard ?? [])];
    return list.sort((a, b) => {
      const aMatch = a.actual.match(/([+-]?\d+)/);
      const bMatch = b.actual.match(/([+-]?\d+)/);

      const aNum = aMatch ? parseInt(aMatch[1]) : 0;
      const bNum = bMatch ? parseInt(bMatch[1]) : 0;

      return aNum - bNum;
    });
  }, [current]);

  const top = sorted.slice(0, 3);

  const groupedPunishments = useMemo(() => {
    const map: Record<string, Punishment[]> = {};
    (current.punishments ?? []).forEach((p) => {
      if (!map[p.target]) map[p.target] = [];
      map[p.target].push(p);
    });
    return map;
  }, [current]);

  const toggleVote = (punId: string) => {
    setVotedPunishments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(punId)) {
        newSet.delete(punId);
      } else {
        newSet.add(punId);
      }
      return newSet;
    });
  };

  const isVoted = (punId: string) => {
    return votedPunishments.has(punId);
  };

  const hasPunishments = (current.punishments ?? []).length > 0;
  const lowestTwoIds = sorted.slice(-2).map(p => p.id);

  return (
    <ScrollView style={styles.page}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Leaderboard <Text style={styles.italic}>by streak</Text>
        </Text>
        <Text style={styles.date}>{current.dateRange}</Text>
      </View>

      {/* TABS SECTION HEADER */}
      <Text style={styles.sectionHeader}>See your friends by rank</Text>

      {/* TABS */}
      <View style={styles.tabs}>
        {(["week", "month", "alltime"] as PeriodKey[]).map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setPeriod(p)}
            style={[styles.tab, period === p && styles.tabActive]}
          >
            <Text style={[styles.tabText, period === p && styles.tabTextActive]}>
              {p === "week" ? "This week" : p === "month" ? "This month" : "All time"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* PODIUM */}
      <View style={styles.podium}>
        <View style={styles.podiumRow}>

          {/* 2nd */}
          <View style={styles.podItem}>
            <Avatar p={top[1]} size="md" />
            <View style={styles.podMeta}>
              <Text style={styles.podName}>{top[1].name}</Text>
              <Text style={styles.podSub}>{top[1].streak}-day</Text>
              <Text style={styles.podActual}>{top[1].actual}</Text>
            </View>
            <View style={styles.bar2}><Text style={styles.barText}>2</Text></View>
          </View>

          {/* 1st */}
          <View style={styles.podItem}>
            <Avatar p={top[0]} size="lg" />
            <View style={styles.podMeta}>
              <Text style={styles.podName}>{top[0].name}</Text>
              <Text style={styles.podSub}>{top[0].streak}-day</Text>
              <Text style={styles.podActual}>{top[0].actual}</Text>
            </View>
            <View style={styles.bar1}><Text style={styles.barText}>1</Text></View>
          </View>

          {/* 3rd */}
          <View style={styles.podItem}>
            <Avatar p={top[2]} size="md" />
            <View style={styles.podMeta}>
              <Text style={styles.podName}>{top[2].name}</Text>
              <Text style={styles.podSub}>{top[2].streak}-day</Text>
              <Text style={styles.podActual}>{top[2].actual}</Text>
            </View>
            <View style={styles.bar3}><Text style={styles.barText}>3</Text></View>
          </View>

        </View>
      </View>

      {/* LIST */}
      <View style={styles.leaderboardList}>
        {sorted.map((p, i) => {
          const isLowest = lowestTwoIds.includes(p.id);

          return (
            <View
              key={p.id}
              style={[
                styles.row,
                i >= sorted.length - 2 && styles.lowest,
                i < 3 && styles.highlight,
              ]}
            >
              <Text style={styles.rank}>#{i + 1}</Text>

              <Avatar p={p} size="sm" />

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.sub}>
                  {p.streak}-day • {p.actual}
                </Text>
                {isLowest && p.brokeReason && (
                  <Text style={styles.reason}>Why: {p.brokeReason}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* PUNISHMENTS */}
      {hasPunishments && (
        <View style={styles.punSection}>
          <Text style={styles.punTitle}>
            Vote an <Text style={styles.punTitleAccent}>embarrassing punishment</Text>
          </Text>

          <Text style={styles.punSub}>For the top two lowest scorers</Text>

          {/* Group by target player */}
          {Object.entries(groupedPunishments).map(([targetId, punishments]) => {
            const player = playerMetadata[targetId];
            const punCount = punishments.length;

            return (
              <View key={targetId} style={styles.punPlayerGroup}>
                {/* Player header */}
                <View style={styles.punPlayerHeader}>
                  <View style={[styles.punPlayerAv, { backgroundColor: player.bg, borderWidth: 3, borderColor: "#fff" }]}>
                    <Text style={{ color: player.fg, fontWeight: "600" }}>{player.initials}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.punPlayerName}>{player.name}</Text>
                  </View>
                  <View style={styles.punPlayerCount}>
                    <Text style={styles.punPlayerCountNum}>{punCount}x</Text>
                    <Text style={styles.punPlayerCountLabel}>snitches</Text>
                  </View>
                </View>

                {/* Punishment options */}
                <View style={styles.punOptions}>
                  {punishments.map((pun) => {
                    const voted = isVoted(pun.id);

                    return (
                      <View key={pun.id} style={styles.punCard}>
                        <Text style={styles.punSep}>|</Text>

                        <Text style={styles.punLabel}>{pun.label}</Text>

                        {period === "week" ? (
                          <>
                            <Text style={styles.punVotes}>{pun.votes}</Text>
                            <TouchableOpacity
                              onPress={() => toggleVote(pun.id)}
                              style={[styles.punVoteBtn, voted && styles.punVoteBtnVoted]}
                            >
                              <Text style={[styles.punVoteBtnText, voted && { color: "#fff" }]}>
                                {voted ? "Voted" : "Vote"}
                              </Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <View style={[styles.punStatus, pun.status === "pending" ? styles.punStatusPending : styles.punStatusDone]}>
                            <Text style={[styles.punStatusText, pun.status === "pending" ? { color: "#c0443a" } : { color: "#4F772D" }]}>
                              {pun.status.charAt(0).toUpperCase() + pun.status.slice(1)}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      )}

    </ScrollView>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

const Avatar = ({ p, size }: any) => (
  <View
    style={[
      styles.avatar,
      size === "lg" && styles.avatarLg,
      size === "sm" && styles.avatarSm,
      { backgroundColor: p.bg, borderWidth: 3, borderColor: "#fff" },
    ]}
  >
    <Text style={{ color: p.fg, fontWeight: "600" }}>{p.initials}</Text>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  page: { backgroundColor: "#F3FFE1", padding: 24 },

  header: { marginBottom: 12 },
  title: { fontSize: 34, fontWeight: "700", color: "#2E1F3E" },
  italic: { fontStyle: "italic", color: "#8E7DBE" },
  date: { fontSize: 13, color: "#8E7DBE", marginTop: 4 },

  sectionHeader: { fontSize: 15, color: "#8E7DBE", fontWeight: "500", marginBottom: 12, marginTop: 8 },

  tabs: {
    flexDirection: "row",
    marginBottom: 24,
    backgroundColor: "#C9B6E4",
    borderRadius: 12,
    padding: 4,
  },
  tab: { padding: 8, borderRadius: 10, flex: 1, alignItems: "center" },
  tabActive: { backgroundColor: "#fff" },
  tabText: { fontSize: 13, color: "#8E7DBE" },
  tabTextActive: { color: "#2E1F3E", fontWeight: "600" },

  podium: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 30,
    marginBottom: 24,
    borderTopWidth: 3,
    borderTopColor: "#F2D16B",
  },
  podiumRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 28,
  },

  podItem: { alignItems: "center" },
  podMeta: { marginTop: 12, marginBottom: 16, alignItems: "center" },
  podName: { fontSize: 16, fontWeight: "600", marginBottom: 2, color: "#2E1F3E" },
  podSub: { fontSize: 14, color: "#8E7DBE" },
  podActual: { fontSize: 11, color: "#F6C1A6", marginTop: 1, fontWeight: "600" },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLg: { width: 72, height: 72, borderRadius: 36 },
  avatarSm: { width: 44, height: 44, borderRadius: 22 },

  bar1: {
    width: 100,
    height: 180,
    backgroundColor: "#F2D16B",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  bar2: {
    width: 90,
    height: 120,
    backgroundColor: "#E8C958",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  bar3: {
    width: 80,
    height: 70,
    backgroundColor: "#F2D16B",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  barText: { color: "#2E1F3E", fontWeight: "700", fontSize: 28 },

  leaderboardList: { marginBottom: 8 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 10,
  },

  highlight: { backgroundColor: "#D9F7A9" },
  lowest: { backgroundColor: "#FFF0E6" },

  rank: { width: 40, fontSize: 18, fontWeight: "700" },

  name: { fontSize: 15, fontWeight: "600" },
  sub: { fontSize: 12, color: "#8a9e8f", marginTop: 3 },
  reason: { fontSize: 11, color: "#c0443a", marginTop: 5, fontStyle: "italic", fontWeight: "500" },

  punSection: { marginTop: 24, borderTopWidth: 2, borderTopColor: "#C9B6E4", paddingTop: 24, marginBottom: 40 },
  punTitle: { fontSize: 28, fontWeight: "700", marginBottom: 6, color: "#2E1F3E" },
  punTitleAccent: { fontStyle: "italic", color: "#E8A8A8" },
  punSub: { fontSize: 15, color: "#1a2418", marginBottom: 24 },

  punPlayerGroup: { marginBottom: 32 },

  punPlayerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#D9F7A9",
  },

  punPlayerAv: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  punPlayerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#c0443a",
  },

  punPlayerCount: {
    alignItems: "flex-end",
  },

  punPlayerCountNum: {
    fontSize: 20,
    fontWeight: "700",
    color: "#c0443a",
  },

  punPlayerCountLabel: {
    fontSize: 10,
    color: "#8a9e8f",
  },

  punOptions: {
    gap: 12,
  },

  punCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D9F7A9",
  },

  punSep: { color: "#c0443a", marginRight: 10, fontSize: 16 },

  punLabel: { flex: 1, fontSize: 14, fontWeight: "500", lineHeight: 20 },

  punVotes: { fontSize: 12, color: "#8a9e8f", marginRight: 8, minWidth: 20, textAlign: "center" },

  punVoteBtn: {
    backgroundColor: "#F4D6D6",
    borderWidth: 1,
    borderColor: "#F4D6D6",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  punVoteBtnVoted: {
    backgroundColor: "#2E1F3E",
    borderColor: "#2E1F3E",
  },

  punVoteBtnText: { color: "#2E1F3E", fontSize: 13, fontWeight: "600" },

  punStatusPending: {
    backgroundColor: "#FFF0E6",
  },

  punStatusDone: {
    backgroundColor: "#D9F7A9",
  },

  punStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },

  punStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
