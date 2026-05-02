import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState("friends");

  const [friends, setFriends] = useState([
    { id: "1", username: "natasha" },
    { id: "2", username: "jessica" },
    { id: "3", username: "rishika" },
  ]);

  const [requests, setRequests] = useState([
    { id: "4", username: "vidushi" },
    { id: "5", username: "krishna" },
  ]);

  const [showAddFriendModal, setShowAddFriendModal] = useState(false);

  const [searchUsername, setSearchUsername] = useState("");

  const acceptRequest = (request) => {
    setFriends([...friends, request]);

    setRequests(requests.filter((r) => r.id !== request.id));
  };

  const rejectRequest = (id) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  const sendFriendRequest = async () => {
    if (!searchUsername.trim()) {
      Alert.alert("Enter a username");
      return;
    }

    try {
      console.log("Sending request to:", searchUsername);

      Alert.alert("Success", "Friend request sent!");

      setSearchUsername("");
      setShowAddFriendModal(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not send request");
    }
  };

  const renderFriend = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>@{item.username}</Text>
    </View>
  );

  const renderRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <Text style={styles.name}>@{item.username}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => acceptRequest(item)}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => rejectRequest(item.id)}
          activeOpacity={0.9}
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>

      <Text style={styles.subtitle}>
        Manage your friends and requests 👀
      </Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "friends" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("friends")}
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "friends" && styles.activeTabText,
            ]}
          >
            Friends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "requests" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("requests")}
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "requests" && styles.activeTabText,
            ]}
          >
            Requests
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "friends" ? (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={renderFriend}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderRequest}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No friend requests</Text>
          }
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddFriendModal(true)}
        activeOpacity={0.9}
      >
        <Text style={styles.addButtonText}>+ Add Friends</Text>
      </TouchableOpacity>

      <Modal
        visible={showAddFriendModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Friend</Text>

            <Text style={styles.modalSubtitle}>
              Search for a username to send a request
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor="#9CA3AF"
              value={searchUsername}
              onChangeText={setSearchUsername}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendFriendRequest}
              activeOpacity={0.9}
            >
              <Text style={styles.sendButtonText}>Send Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowAddFriendModal(false);
                setSearchUsername("");
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
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
    paddingTop: 60,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -1.2,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 24,
  },

tabs: {
  flexDirection: "row",
  backgroundColor: "#D1D5DB",
  borderRadius: 12,
  padding: 4,
  marginBottom: 22,
},

  tabButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#FFFFFF",
  },

  tabText: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 14,
  },

  activeTabText: {
    color: "#111827",
  },

  card: {
  backgroundColor: "#FFFFFF",
  padding: 18,
  borderRadius: 14,
  marginBottom: 14,

  borderWidth: 2,
  borderColor: "#4F772D",

  shadowColor: "transparent",
  elevation: 0,
},

requestCard: {
  backgroundColor: "#FFFFFF",
  padding: 18,
  borderRadius: 14,
  marginBottom: 14,

  borderWidth: 2,
  borderColor: "#4F772D",

  shadowColor: "transparent",
  elevation: 0,
},

  requestCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.04,
    shadowRadius: 12,

    elevation: 2,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 16,
  },

 acceptButton: {
  flex: 1,
  backgroundColor: "#4F772D",
  paddingVertical: 13,
  borderRadius: 10,
  alignItems: "center",
  marginRight: 8,

  borderWidth: 2,
  borderColor: "#4F772D",
},

rejectButton: {
  flex: 1,
  backgroundColor: "#FFFFFF",
  paddingVertical: 13,
  borderRadius: 10,
  alignItems: "center",

  borderWidth: 2,
  borderColor: "#4F772D",
},

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },

rejectButtonText: {
  color: "#4F772D",
  fontWeight: "700",
  fontSize: 14,
},

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
    fontSize: 15,
  },

addButton: {
  position: "absolute",
  bottom: 30,
  left: 24,
  right: 24,
  backgroundColor: "#4F772D",
  paddingVertical: 15,
  borderRadius: 12,
  alignItems: "center",

  shadowColor: "transparent",
  elevation: 0,
},

  addButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

modalOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.3)",
},

modalContainer: {
  backgroundColor: "#FFFFFF",
  width: "88%",
  borderRadius: 22,
  padding: 24,

  borderWidth: 2,
  borderColor: "#4F772D",

  shadowColor: "transparent",
  elevation: 0,
},

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },

  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    color: "#111827",
    marginBottom: 14,
  },

 sendButton: {
  backgroundColor: "#4F772D",
  paddingVertical: 15,
  borderRadius: 12,
  alignItems: "center",

  borderWidth: 2,
  borderColor: "#4F772D",
},

  sendButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },

  cancelText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 18,
  },
});