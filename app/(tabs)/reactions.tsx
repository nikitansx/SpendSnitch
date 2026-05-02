import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function ReactionsScreen() {
  const reactions = [
    {
      id: 1,
      friend: "Sarah",
      message: "Come on 😭",
      category: "Food",
      place: "Mama Brown",
      time: "2 mins ago",
    },
    {
      id: 2,
      friend: "Natasha",
      message: "That was NOT in the budget",
      category: "Shopping",
      place: "Zara",
      time: "8 mins ago",
    },
    {
      id: 3,
      friend: "Jessica",
      message: "Worth it honestly 👀",
      category: "Coffee",
      place: "Starbucks",
      time: "20 mins ago",
    },
    {
      id: 4,
      friend: "Mia",
      message: "You can do better than that!",
      category: "Entertainment",
      place: "Event Cinemas",
      time: "1 hour ago",
    },
    {
      id: 5,
      friend: "Rishika",
      message: "Did you really need another coffee?",
      category: "Coffee",
      place: "Coffee Club",
      time: "2 hours ago",
    },
    {
      id: 6,
      friend: "Vidushi",
      message: "At least invite me next time 😭",
      category: "Food",
      place: "Monsoon Poon",
      time: "3 hours ago",
    },
    {
      id: 7,
      friend: "Krishna",
      message: "Actually fair enough",
      category: "Transport",
      place: "Uber",
      time: "5 hours ago",
    },
    {
      id: 8,
      friend: "Liam",
      message: "That gym membership is NOT being used",
      category: "Fitness",
      place: "CityFitness",
      time: "7 hours ago",
    },
    {
      id: 9,
      friend: "Sophie",
      message: "Lowkey worth it though",
      category: "Shopping",
      place: "Glassons",
      time: "Yesterday",
    },
    {
      id: 10,
      friend: "Ben",
      message: "Another bubble tea is crazy",
      category: "Food",
      place: "Chatime",
      time: "Yesterday",
    },
    {
      id: 11,
      friend: "Emily",
      message: "This is why you're broke",
      category: "Entertainment",
      place: "Steam",
      time: "2 days ago",
    },
    {
      id: 12,
      friend: "Josh",
      message: "I would've done the same honestly",
      category: "Shopping",
      place: "Nike",
      time: "2 days ago",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={24} color="#4F772D" />
        </TouchableOpacity>

        <Text style={styles.title}>Reactions</Text>

        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>
        Reactions and replies to your snitch alerts 👀
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {reactions.map((reaction) => (
          <TouchableOpacity
            key={reaction.id}
            style={styles.reactionCard}
            activeOpacity={0.9}
          >
            <View style={styles.topRow}>
              <Text style={styles.friendName}>
                {reaction.friend}
              </Text>

              <Text style={styles.time}>
                {reaction.time}
              </Text>
            </View>

            <Text style={styles.message}>
              replied{" "}
              <Text style={styles.bold}>
                "{reaction.message}"
              </Text>{" "}
              to your{" "}
              <Text style={styles.bold}>
                {reaction.category}
              </Text>{" "}
              spend alert at{" "}
              <Text style={styles.bold}>
                {reaction.place}
              </Text>
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FFE1",
    paddingHorizontal: 24,
    paddingTop: 80,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4F772D",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 10,
    marginBottom: 28,
  },

  reactionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#4F772D",
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  friendName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  time: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  message: {
    fontSize: 15,
    lineHeight: 24,
    color: "#374151",
  },

  bold: {
    fontWeight: "700",
    color: "#4F772D",
  },
});