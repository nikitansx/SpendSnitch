import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";

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

const sendQuickMessage = (message: string) => {
  setSentMessage(`Sent! 🎉`);

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
      <ScrollView style={styles.container}>
        <Text style={styles.logo}>Spend Snitch</Text>

        <Text style={styles.subtitle}>
          Recent snitch alerts from your friends 👀
        </Text>

        {alerts.map((alert) => (
          <TouchableOpacity
            key={alert.id}
            style={styles.alertCard}
            onPress={() => setSelectedAlert(alert)}
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
                    onPress={() => sendQuickMessage(msg)}
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

  logo: {
    fontSize: 38,
    fontWeight: "bold",
    marginTop: 60,
    color: "#111827",
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 10,
    marginBottom: 30,
  },

  alertCard: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  friendName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  time: {
    fontSize: 13,
    color: "#9CA3AF",
  },

  alertText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
  },

  bold: {
    fontWeight: "bold",
    color: "#F97316",
  },

  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  modalContainer: {
    backgroundColor: "white",
    height: "80%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
  },

  quickMessage: {
    backgroundColor: "#FFF7ED",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  quickMessageText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    fontSize: 16,
  },

  sendButton: {
    backgroundColor: "#F97316",
    padding: 16,
    borderRadius: 18,
    marginTop: 16,
    alignItems: "center",
  },

  sendButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  sentText: {
    textAlign: "center",
    marginTop: 16,
    color: "#16A34A",
    fontWeight: "bold",
    fontSize: 16,
  },

  sentBox: {
  backgroundColor: "#DCFCE7",
  padding: 14,
  borderRadius: 14,
  marginTop: 18,
  alignItems: "center",
},

  closeText: {
    textAlign: "center",
    marginTop: 20,
    color: "#9CA3AF",
    fontSize: 15,
  },
});