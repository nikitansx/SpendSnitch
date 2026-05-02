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
  Alert,
  Image,
} from "react-native";

import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import * as ImagePicker from "expo-image-picker";

import { db } from "../../firebase";

export default function HomeScreen() {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const alerts = [
    {
      id: 1,
      username: "@natasha",
      category: "Food",
      amount: "$100",
      place: "Mama Brown",
      time: "2 mins ago",
    },
    {
      id: 2,
      username: "@mia",
      category: "Shopping",
      amount: "$240",
      place: "Zara",
      time: "12 mins ago",
    },
    {
      id: 3,
      username: "@liam",
      category: "Entertainment",
      amount: "$85",
      place: "Event Cinemas",
      time: "25 mins ago",
    },
    {
      id: 4,
      username: "@sophie",
      category: "Coffee",
      amount: "$32",
      place: "Starbucks",
      time: "1 hour ago",
    },
  ];

  const quickMessages = [
    "Are you serious?",
    "You can do better than that!",
    "Worth it honestly",
    "That was NOT in the budget",
    "Iconic purchase",
  ];

  const resetModal = () => {
    setSelectedAlert(null);
    setCustomMessage("");
    setSelectedImage(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Camera permission required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const sendQuickMessage = async (message: string) => {
    try {
      const currentUser = await AsyncStorage.getItem("loggedInUser");

      if (!currentUser) {
        Alert.alert("Error", "No logged in user found");
        return;
      }

      await addDoc(collection(db, "reactions"), {
        toUser: selectedAlert.username
          .replace("@", "")
          .toLowerCase()
          .trim(),
        fromUser: currentUser.toLowerCase().trim(),
        message: message,
        category: selectedAlert.category,
        place: selectedAlert.place,
        hasImage: false,
        createdAt: serverTimestamp(),
      });

      resetModal();

      Alert.alert("Success", "Reaction sent!");

    } catch (error: any) {
      console.log(error);

      Alert.alert(
        "Firebase Error",
        JSON.stringify(error)
      );
    }
  };

  const sendCustomMessage = async () => {
    if (customMessage.trim() === "" && !selectedImage) {
      Alert.alert(
        "Error",
        "Write a message or attach a photo"
      );
      return;
    }

    try {
      const currentUser = await AsyncStorage.getItem("loggedInUser");

      if (!currentUser) {
        Alert.alert(
          "Error",
          "No logged in user found"
        );
        return;
      }

      await addDoc(collection(db, "reactions"), {
        toUser: selectedAlert.username
          .replace("@", "")
          .toLowerCase()
          .trim(),
        fromUser: currentUser.toLowerCase().trim(),
        message: customMessage,
        category: selectedAlert.category,
        place: selectedAlert.place,
        hasImage: selectedImage ? true : false,
        createdAt: serverTimestamp(),
      });

      resetModal();

      Alert.alert("Success", "Message sent!");

    } catch (error: any) {
      console.log(error);

      Alert.alert(
        "Firebase Error",
        JSON.stringify(error)
      );
    }
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
            onPress={() => router.push("/reactions")}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color="#4F772D"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Recent snitch alerts from your friends
        </Text>

        {alerts.map((alert) => (
          <TouchableOpacity
            key={alert.id}
            style={styles.alertCard}
            onPress={() => setSelectedAlert(alert)}
            activeOpacity={0.9}
          >
            <View style={styles.topRow}>
              <Text style={styles.friendName}>
                {alert.username}
              </Text>

              <Text style={styles.time}>
                {alert.time}
              </Text>
            </View>

            <Text style={styles.alertText}>
              went over their{" "}
              <Text style={styles.bold}>
                {alert.category}
              </Text>{" "}
              budget and spent{" "}
              <Text style={styles.bold}>
                {alert.amount}
              </Text>{" "}
              at{" "}
              <Text style={styles.bold}>
                {alert.place}
              </Text>
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
          <ScrollView
            style={styles.modalContainer}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {selectedAlert && (
              <>
                <Text style={styles.modalTitle}>
                  React to {selectedAlert.username}'s spend
                </Text>

                {quickMessages.map((msg, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickMessage}
                    onPress={() => sendQuickMessage(msg)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.quickMessageText}>
                      {msg}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TextInput
                  placeholder="Write your own message..."
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  value={customMessage}
                  onChangeText={setCustomMessage}
                />

                <View style={styles.imageButtonsRow}>
                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={pickImage}
                    activeOpacity={0.9}
                  >
                    <Ionicons
                      name="image-outline"
                      size={20}
                      color="#4F772D"
                    />

                    <Text style={styles.imageButtonText}>
                      Upload Photo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={takePhoto}
                    activeOpacity={0.9}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={20}
                      color="#4F772D"
                    />

                    <Text style={styles.imageButtonText}>
                      Take Photo
                    </Text>
                  </TouchableOpacity>
                </View>

                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.previewImage}
                  />
                )}

                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={sendCustomMessage}
                  activeOpacity={0.9}
                >
                  <Text style={styles.sendButtonText}>
                    Send
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={resetModal}
                >
                  <Text style={styles.closeText}>
                    Close
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
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
    marginTop: 65,
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

  imageButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  imageButton: {
    flex: 1,
    backgroundColor: "#F3FFE1",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  imageButtonText: {
    fontWeight: "700",
    color: "#4F772D",
    fontSize: 14,
  },

  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    marginTop: 16,
  },

  sendButton: {
    backgroundColor: "#4F772D",
    padding: 15,
    borderRadius: 12,
    marginTop: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4F772D",
  },

  sendButtonText: {
    color: "white",
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