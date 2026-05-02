import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [sentMessage, setSentMessage] = useState("");

  const alerts = [
    {
      id: 1,
      name: "Natasha",
      category: "Food",
      amount: "$100",
      place: "Mama Brown",
      time: "2 mins ago",
    },
    {
      id: 2,
      name: "Mia",
      category: "Shopping",
      amount: "$240",
      place: "Zara",
      time: "12 mins ago",
    },
    {
      id: 3,
      name: "Liam",
      category: "Entertainment",
      amount: "$85",
      place: "Event Cinemas",
      time: "25 mins ago",
    },
    {
      id: 4,
      name: "Sophie",
      category: "Coffee",
      amount: "$32",
      place: "Starbucks",
      time: "1 hour ago",
    },
  ];

  const quickMessages = [
    "Come on 😭",
    "You can do better than that!",
    "Worth it honestly 👀",
    "That was NOT in the budget",
    "Iconic purchase",
  ];

  const sendQuickMessage = () => {
    setSentMessage("Sent! 🎉");

    setTimeout(() => {
      setSelectedAlert(null);
      setSentMessage("");
    }, 2000);
  };

  const sendCustomMessage = () => {
    if (customMessage.trim() === "") return;

    setSentMessage("Message sent! 🎉");

    setTimeout(() => {
      setSelectedAlert(null);
      setCustomMessage("");
      setSentMessage("");
    }, 2000);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.logo}>Spend Snitch</Text>

          <TouchableOpacity
            style={styles.settingsButton}
            activeOpacity={0.8}
            onPress={() => router.push("/settings")}
          >
            <Ionicons name="settings-outline" size={22} color="#4F772D" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Recent snitch alerts from your friends 👀
        </Text>

        {alerts.map((alert) => (
          <TouchableOpacity
            key={alert.id}
            style={styles.alertCard}
            onPress={() => setSelectedAlert(alert)}
            activeOpacity={0.9}
          >
            <View style={styles.topRow}>
              <Text style={styles.friendName}>{alert.name}</Text>
              <Text style={styles.time}>{alert.time}</Text>
            </View>

            <Text style={styles.alertText}>
              went over their{" "}
              <Text style={styles.bold}>{alert.category}</Text> budget and
              spent <Text style={styles.bold}>{alert.amount}</Text> at{" "}
              <Text style={styles.bold}>{alert.place}</Text>
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={selectedAlert !== null}
        transparent
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedAlert && (
              <>
                <Text style={styles.modalTitle}>
                  React to {selectedAlert.name}'s spend 👀
                </Text>

                {quickMessages.map((msg, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickMessage}
                    onPress={() => sendQuickMessage()}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.quickMessageText}>{msg}</Text>
                  </TouchableOpacity>
                ))}

                <TextInput
                  placeholder="Write your own message..."
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  value={customMessage}
                  onChangeText={setCustomMessage}
                />

                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={sendCustomMessage}
                  activeOpacity={0.9}
                >
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>

                {sentMessage !== "" ? (
                  <View style={styles.sentBox}>
                    <Text style={styles.sentText}>{sentMessage}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  onPress={() => setSelectedAlert(null)}
                >
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FFE1",
    padding: 24,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 60,
  },

  logo: {
    fontSize: 34,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -1.2,
  },

settingsButton: {
  backgroundColor: "#FFFFFF",
  width: 42,
  height: 42,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: "#4F772D",
  alignItems: "center",
  justifyContent: "center",
},

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 28,
  },

  alertCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "#4F772D",
    shadowColor: "transparent",
    elevation: 0,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  friendName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },

  time: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  alertText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#374151",
  },

  bold: {
    fontWeight: "700",
    color: "#4F772D",
  },

  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    marginTop: 220,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
    letterSpacing: -0.5,
  },

  quickMessage: {
    backgroundColor: "#F3FFE1",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  quickMessageText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 16,
    marginTop: 14,
    fontSize: 15,
    color: "#111827",
  },

  sendButton: {
    backgroundColor: "#4F772D",
    padding: 15,
    borderRadius: 12,
    marginTop: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4F772D",
  },

  sendButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },

  sentBox: {
    backgroundColor: "#DCFCE7",
    padding: 14,
    borderRadius: 10,
    marginTop: 18,
    alignItems: "center",
  },

  sentText: {
    textAlign: "center",
    color: "#15803D",
    fontWeight: "700",
    fontSize: 15,
  },

  closeText: {
    textAlign: "center",
    marginTop: 20,
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
  },
});