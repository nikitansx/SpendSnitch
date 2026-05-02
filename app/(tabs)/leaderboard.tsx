import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

/* ---------------- TYPES ---------------- */

type PeriodKey = "week" | "month";

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

/* ---------------- DATA ---------------- */

const empty = {
  dateRange: "",
  leaderboard: [] as Player[],
};

const data: Record<PeriodKey, typeof empty> = {
 week: {
  dateRange: "May 02 – May 08, 2026",
  leaderboard: [
    {
      id: "an",
      name: "@annika",
      initials: "AN",
      bg: "#FFE08A",
      fg: "#8B6914",
      streak: 6,
      goal: "Goal: Pack lunch 5x/week",
      actual: "-12% under budget",
    },
    {
      id: "na",
      name: "@natasha",
      initials: "NA",
      bg: "#D9F7A9",
      fg: "#4F772D",
      streak: 5,
      goal: "Goal: 2 coffees/week",
      actual: "-8% under budget",
    },
    {
      id: "mi",
      name: "@mia",
      initials: "MI",
      bg: "#FFE08A",
      fg: "#8B6914",
      streak: 4,
      goal: "Goal: No UberEats",
      actual: "-5% under budget",
    },
    {
      id: "li",
      name: "@liam",
      initials: "LI",
      bg: "#D9F7A9",
      fg: "#4F772D",
      streak: 3,
      goal: "Goal: No clothes buying",
      actual: "-2% under budget",
    },
    {
      id: "so",
      name: "@sophie",
      initials: "SO",
      bg: "#A9E34B",
      fg: "#fff",
      streak: 2,
      goal: "Goal: $150/week budget",
      actual: "+3% over budget",
    },
    {
      id: "sa",
      name: "@sam",
      initials: "SA",
      bg: "#A9E34B",
      fg: "#fff",
      streak: 1,
      goal: "Goal: Save $30/day",
      actual: "+18% over budget",
    },
    {
      id: "ja",
      name: "@jack",
      initials: "JA",
      bg: "#A9E34B",
      fg: "#fff",
      streak: 0,
      goal: "Goal: $25 alcohol budget",
      actual: "+25% over budget",
    },
    {
      id: "la",
      name: "@lila",
      initials: "LA",
      bg: "#D9F7A9",
      fg: "#4F772D",
      streak: 0,
      goal: "Goal: 2 coffees/week",
      actual: "+48% over budget",
    },
  ],
},

month: {
  dateRange: "April 02 – May 02, 2026",
  leaderboard: [
    {
      id: "an",
      name: "@annika",
      initials: "AN",
      bg: "#FFE08A",
      fg: "#8B6914",
      streak: 6,
      goal: "Goal: Pack lunch 5x/week",
      actual: "-11% under budget",
    },
    {
      id: "na",
      name: "@natasha",
      initials: "NA",
      bg: "#A9E34B",
      fg: "#fff",
      streak: 5,
      goal: "Goal: Save $30/day",
      actual: "-9% under budget",
    },
    {
      id: "mi",
      name: "@mia",
      initials: "MI",
      bg: "#FFE08A",
      fg: "#8B6914",
      streak: 4,
      goal: "Goal: No UberEats",
      actual: "-6% under budget",
    },
    {
      id: "li",
      name: "@liam",
      initials: "LI",
      bg: "#D9F7A9",
      fg: "#4F772D",
      streak: 3,
      goal: "Goal: 2 coffees/week",
      actual: "-3% under budget",
    },
    {
      id: "so",
      name: "@sophie",
      initials: "SO",
      bg: "#D9F7A9",
      fg: "#4F772D",
      streak: 2,
      goal: "Goal: No clothes buying",
      actual: "-1% under budget",
    },
    {
      id: "sa",
      name: "@sam",
      initials: "SA",
      bg: "#A9E34B",
      fg: "#fff",
      streak: 1,
      goal: "Goal: $150/week budget",
      actual: "+2% over budget",
    },
    {
      id: "ja",
      name: "@jack",
      initials: "JA",
      bg: "#A9E34B",
      fg: "#fff",
      streak: 0,
      goal: "Goal: $25 alcohol budget",
      actual: "+35% over budget",
      brokeReason: "Party mode never off",
    },
    {
      id: "la",
      name: "@lila",
      initials: "LA",
      bg: "#D9F7A9",
      fg: "#4F772D",
      streak: 0,
      goal: "Goal: 2 coffees/week",
      actual: "+48% over budget",
      brokeReason: "Coffee addiction spiral",
    },
  ],
},
};

export default function LeaderboardScreen() {
  const [period, setPeriod] = useState<PeriodKey>("week");

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

  const lowestTwoIds = sorted.slice(-2).map((p) => p.id);

  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Leaderboard <Text style={styles.italic}>by savings</Text>
        </Text>    
      </View>

      <Text style={styles.sectionHeader}>
        See your friends by rank
      </Text>

      <View style={styles.tabs}>
        {(["week", "month"] as PeriodKey[]).map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setPeriod(p)}
            style={[
              styles.tab,
              period === p && styles.tabActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                period === p && styles.tabTextActive,
              ]}
            >
              {p === "week" ? "This week" : "This month"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.podium}>
        <View style={styles.podiumRow}>
          <View style={styles.podItem}>
            <Avatar p={top[1]} size="md" />

            <View style={styles.podMeta}>
              <Text style={styles.podName}>
                {top[1].name}
              </Text>

              <Text style={styles.podActual}>
                {top[1].actual}
              </Text>
            </View>

            <View style={styles.bar2}>
              <Text style={styles.barText}>2</Text>
            </View>
          </View>

          <View style={styles.podItem}>
            <Avatar p={top[0]} size="lg" />

            <View style={styles.podMeta}>
              <Text style={styles.podName}>
                {top[0].name}
              </Text>

              <Text style={styles.podActual}>
                {top[0].actual}
              </Text>
            </View>

            <View style={styles.bar1}>
              <Text style={styles.barText}>1</Text>
            </View>
          </View>

          <View style={styles.podItem}>
            <Avatar p={top[2]} size="md" />

            <View style={styles.podMeta}>
              <Text style={styles.podName}>
                {top[2].name}
              </Text>

              <Text style={styles.podActual}>
                {top[2].actual}
              </Text>
            </View>

            <View style={styles.bar3}>
              <Text style={styles.barText}>3</Text>
            </View>
          </View>
        </View>
      </View>

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
                  {p.actual}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const Avatar = ({ p, size }: any) => (
  <View
    style={[
      styles.avatar,
      size === "lg" && styles.avatarLg,
      size === "sm" && styles.avatarSm,
      {
        backgroundColor: p.bg,
        borderWidth: 3,
        borderColor: "#fff",
      },
    ]}
  >
    <Text
      style={{
        color: p.fg,
        fontWeight: "600",
      }}
    >
      {p.initials}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#F3FFE1",
    padding: 24,
  },

  header: {
    marginBottom: 12,
    paddingTop: 50,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#2E1F3E",
  },

  italic: {
    fontStyle: "italic",
    color: "#8E7DBE",
  },

  sectionHeader: {
    fontSize: 15,
    color: "#8E7DBE",
    fontWeight: "500",
    marginBottom: 12,
    marginTop: 8,
  },

tabs: {
  flexDirection: "row",
  backgroundColor: "#D1D5DB",
  borderRadius: 12,
  padding: 4,
  marginBottom: 24,
},

tab: {
  flex: 1,
  paddingVertical: 11,
  borderRadius: 8,
  alignItems: "center",
},

tabActive: {
  backgroundColor: "#FFFFFF",
},

tabText: {
  color: "#6B7280",
  fontWeight: "600",
  fontSize: 14,
},

tabTextActive: {
  color: "#111827",
  fontWeight: "700",
},

podium: {
  backgroundColor: "#fff",
  paddingTop: 30,
  paddingHorizontal: 18,
  paddingBottom: 50,
  marginBottom: 24,
  overflow: "hidden",
},

podiumRow: {
  flexDirection: "row",
  alignItems: "flex-end",
  justifyContent: "space-between",
  width: "100%",
},

podItem: {
  alignItems: "center",
  flex: 1,
},

  podMeta: {
    marginTop: 12,
    marginBottom: 16,
    alignItems: "center",
  },

  podName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#2E1F3E",
    textAlign: "center",
  },

podActual: {
  fontSize: 11,
  color: "#000",
  marginTop: 1,
  fontWeight: "600",
  textAlign: "center",
},

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarLg: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },

  avatarSm: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

bar1: {
  width: 88,
  height: 180,
  backgroundColor: "#4F772D",
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
},

bar2: {
  width: 78,
  height: 120,
  backgroundColor: "#4F772D",
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
},

bar3: {
  width: 68,
  height: 70,
  backgroundColor: "#4F772D",
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
},

barText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 28,
},

  leaderboardList: {
    marginBottom: 30,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 10,
  },

  highlight: {
    backgroundColor: "#D9F7A9",
  },

  lowest: {
    backgroundColor: "#FFF0E6",
  },

  rank: {
    width: 40,
    fontSize: 18,
    fontWeight: "700",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
  },

  sub: {
    fontSize: 12,
    color: "#8a9e8f",
    marginTop: 3,
  },
});