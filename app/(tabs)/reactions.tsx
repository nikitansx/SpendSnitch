import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase";

export default function ReactionsScreen() {
  const [reactions, setReactions] = useState<any[]>([]);
  const [showMeme, setShowMeme] = useState(false);

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

      if (!currentUser) {
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
          <Ionicons
            name="chevron-back"
            size={24}
            color="#4F772D"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Reactions
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>
        Reactions and replies to your snitch alerts
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
            <View
              key={reaction.id}
              style={styles.reactionCard}
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
                  "{reaction.message || "sent a reaction"}"
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

              {/* DEMO PHOTO REACTION FOR SOPHIE */}

              {reaction.fromUser?.toLowerCase() === "sophie" && (
                <TouchableOpacity
                  style={styles.photoButton}
                  activeOpacity={0.9}
                  onPress={() => setShowMeme(true)}
                >
                  <Ionicons
                    name="image-outline"
                    size={18}
                    color="#4F772D"
                  />

                  <Text style={styles.photoButtonText}>
                    Tap to view photo
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showMeme}
        transparent
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.closeOverlay}
            activeOpacity={1}
            onPress={() => setShowMeme(false)}
          />

          <Image
            source={require("../../assets/meme.png")}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowMeme(false)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="close"
              size={28}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </Modal>
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
    color: "#8E7DBE",
  },

  photoButton: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F3FFE1",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  photoButtonText: {
    color: "#4F772D",
    fontWeight: "700",
    fontSize: 14,
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

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  closeOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  fullscreenImage: {
    width: "92%",
    height: "70%",
    borderRadius: 16,
  },

  closeButton: {
    position: "absolute",
    top: 70,
    right: 24,
  },
});