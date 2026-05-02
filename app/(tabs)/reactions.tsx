import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "../../firebase";

export default function ReactionsScreen() {
  const [reactions, setReactions] = useState<any[]>([]);

  useEffect(() => {
    loadReactions();

    const interval = setInterval(() => {
      loadReactions();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const loadReactions = async () => {
    try {
      const currentUser = await AsyncStorage.getItem("loggedInUser");

      //console.log("Current logged in user:", currentUser);

      console.log("CURRENT USER:");
      console.log(currentUser);

      if (!currentUser) {
        console.log("No logged in user");
        return;
      }

      const cleanUser = currentUser.toLowerCase().trim();

      const q = query(
        collection(db, "reactions"),
        where("toUser", "==", cleanUser)
      );

      const querySnapshot = await getDocs(q);

      const reactionsData: any[] = [];

      querySnapshot.forEach((doc) => {
        reactionsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log("Loaded reactions:", reactionsData);

      setReactions(reactionsData);

    } catch (error) {
      console.log(error);
    }
  };

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
        {reactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No reactions yet 👀
            </Text>
          </View>
        ) : (
          reactions.map((reaction) => (
            <TouchableOpacity
              key={reaction.id}
              style={styles.reactionCard}
              activeOpacity={0.9}
            >
              <View style={styles.topRow}>
                <Text style={styles.friendName}>
                  {reaction.fromUser || "unknown"}
                </Text>

                <Text style={styles.time}>
                  just now
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
          ))
        )}
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

  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
});