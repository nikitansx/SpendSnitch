import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";

import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState("friends");

  const [friends, setFriends] = useState([
    { id: "1", username: "natasha" },
    { id: "2", username: "jessica" },
    { id: "3", username: "rishika" },
  ]);

const [requests, setRequests] = useState([]);

  const [showAddFriendModal, setShowAddFriendModal] =
    useState(false);

  const [searchUsername, setSearchUsername] =
    useState("");

  const [matchingUsers, setMatchingUsers] =
    useState([]);

  const [editMode, setEditMode] = useState(false);

  const acceptRequest = (request) => {
    setFriends([...friends, request]);

    setRequests(
      requests.filter((r) => r.id !== request.id)
    );
  };

  const rejectRequest = (id) => {
    setRequests(
      requests.filter((r) => r.id !== id)
    );
  };

  const removeFriend = (id) => {
    setFriends(
      friends.filter((friend) => friend.id !== id)
    );
  };

 const searchUsers = async (text) => {
  setSearchUsername(text);

  if (!text.trim()) {
    setMatchingUsers([]);
    return;
  }

  try {
    const querySnapshot = await getDocs(
      collection(db, "users")
    );

    const users = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      if (
        data.username.includes(
          text.toLowerCase()
        )
      ) {
        users.push({
          id: doc.id,
          ...data,
        });
      }
    });

    setMatchingUsers(users);
  } catch (error) {
    console.log(error);
  }
};

const sendFriendRequest = async (selectedUser) => {
  try {
    const currentUsername = await AsyncStorage.getItem("username");

    if (!currentUsername) {
      Alert.alert("Error", "No logged in user found.");
      return;
    }

    await addDoc(collection(db, "friendRequests"), {
      from: currentUsername,
      to: selectedUser.username,
      status: "pending",
      createdAt: new Date(),
    });

    Alert.alert(
      "Sent!",
      `Friend request sent to ${selectedUser.username}`
    );
  } catch (error) {
    console.log(error);
    Alert.alert("Error", "Could not send friend request.");
  }
};

const loadFriendRequests = async () => {
  try {
    const currentUsername =
      await AsyncStorage.getItem("username");

    if (!currentUsername) return;

    const q = query(
      collection(db, "friendRequests"),
      where("to", "==", currentUsername),
      where("status", "==", "pending")
    );

    const querySnapshot = await getDocs(q);

    const requestsList = [];

    querySnapshot.forEach((doc) => {
      requestsList.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setRequests(requestsList);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  loadFriendRequests();
}, []);

  const renderFriend = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      delayLongPress={500}
      onLongPress={() => setEditMode(true)}
    >
      {editMode && (
        <TouchableOpacity
          style={styles.removeIcon}
          onPress={() => removeFriend(item.id)}
        >
          <Ionicons
            name="close-circle"
            size={28}
            color="#EF4444"
          />
        </TouchableOpacity>
      )}

      <Text style={styles.name}>
        @{item.username}
      </Text>
    </TouchableOpacity>
  );

  const renderRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <Text style={styles.name}>
        @{item.from}
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => acceptRequest(item)}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>
            Accept
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => rejectRequest(item.id)}
          activeOpacity={0.9}
        >
          <Text style={styles.rejectButtonText}>
            Reject
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>
            Friends
          </Text>

          <Text style={styles.subtitle}>
            Manage your friends and requests
          </Text>
        </View>

        {editMode && (
          <TouchableOpacity
            onPress={() => setEditMode(false)}
          >
            <Text style={styles.doneText}>
              Done
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "friends" &&
              styles.activeTab,
          ]}
          onPress={() =>
            setActiveTab("friends")
          }
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "friends" &&
                styles.activeTabText,
            ]}
          >
            Friends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "requests" &&
              styles.activeTab,
          ]}
          onPress={() =>
            setActiveTab("requests")
          }
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "requests" &&
                styles.activeTabText,
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
          contentContainerStyle={{
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderRequest}
          contentContainerStyle={{
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No friend requests
            </Text>
          }
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          setShowAddFriendModal(true)
        }
        activeOpacity={0.9}
      >
        <Text style={styles.addButtonText}>
          + Add Friends
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showAddFriendModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Add Friend
            </Text>

            <Text style={styles.modalSubtitle}>
              Search for a username to send a
              request
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor="#9CA3AF"
              value={searchUsername}
              onChangeText={searchUsers}
              autoCapitalize="none"
            />

            {searchUsername.length > 0 &&
              matchingUsers.length === 0 && (
                <Text
                  style={styles.notFoundText}
                >
                  Username not found
                </Text>
              )}

            <FlatList
              data={matchingUsers}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 200 }}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userResult}
                  onPress={() =>
                    sendFriendRequest(item)
                  }
                  activeOpacity={0.9}
                >
                  <Text
                    style={
                      styles.userResultText
                    }
                  >
                    @{item.username}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => {
                setShowAddFriendModal(false);
                setSearchUsername("");
                setMatchingUsers([]);
              }}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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

  doneText: {
    color: "#4F772D",
    fontWeight: "700",
    fontSize: 16,
    marginTop: 10,
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

    position: "relative",
  },

  removeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
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
    backgroundColor: "#8E7DBE",
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

  notFoundText: {
    color: "#6B7280",
    marginBottom: 14,
    fontSize: 14,
  },

  userResult: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,

    borderWidth: 2,
    borderColor: "#D9F99D",
  },

  userResultText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  cancelText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 18,
  },
});