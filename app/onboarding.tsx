import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [goal, setGoal] = useState("");
  const [csvName, setCsvName] = useState("");
  const [csvData, setCsvData] = useState<any[]>([]);

  const [budgets, setBudgets] = useState({
    Food: "80",
    Shopping: "60",
    Travel: "40",
    Entertainment: "50",
  });

  const updateBudget = (category: string, value: string) => {
    setBudgets({ ...budgets, [category]: value });
  };

  const updateBudgetFromSlider = (category: string, value: number) => {
    setBudgets({ ...budgets, [category]: Math.round(value).toString() });
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    const rows = lines.slice(1);

    return rows.map((line, index) => {
      const [item, cost, category] = line.split(",");

      return {
        id: index + 1,
        item: item.trim(),
        cost: Number(cost.replace("$", "").trim()),
        category: category.trim(),
      };
    });
  };

  const uploadCSV = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "text/csv",
    });

    if (result.canceled) return;

    const file = result.assets[0];
    setCsvName(file.name);

    const response = await fetch(file.uri);
    const text = await response.text();

    const parsed = parseCSV(text);
    setCsvData(parsed);
  };

  const finishOnboarding = async () => {
    const userData = {
      username,
      goal,
      budgets,
      transactions: csvData,
    };

    await AsyncStorage.setItem("spendSnitchUserData", JSON.stringify(userData));
    router.replace("/(tabs)");
  };

  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to SpendSnitch</Text>
        <Text style={styles.subtitle}>
          Log in to start tracking your spending.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#9CA3AF"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>What is your main budgeting goal?</Text>
      <Text style={styles.subtitle}>
        Tell us what you are saving for right now.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Holiday, car, emergency savings"
        placeholderTextColor="#9CA3AF"
        value={goal}
        onChangeText={setGoal}
      />

      <Text style={styles.sectionTitle}>Weekly budget allowance</Text>

      {Object.keys(budgets).map((category) => {
        const budgetValue = Number(budgets[category as keyof typeof budgets]) || 0;

        return (
          <View key={category} style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <Text style={styles.category}>{category}</Text>

              <View style={styles.amountBox}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  keyboardType="numeric"
                  value={budgets[category as keyof typeof budgets]}
                  onChangeText={(value) => updateBudget(category, value)}
                />
              </View>
            </View>

            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={300}
              step={5}
              value={Math.min(budgetValue, 300)}
              minimumTrackTintColor="#7CB342"
              maximumTrackTintColor="#D9EBCB"
              thumbTintColor="#7CB342"
              onValueChange={(value) => updateBudgetFromSlider(category, value)}
            />

            <Text style={styles.dollarText}>per week</Text>
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>Connect your bank account</Text>

      <Text style={styles.bankText}>
        For this prototype, upload a mock CSV file to simulate bank transactions.
      </Text>

      <TouchableOpacity style={styles.bankButton} onPress={uploadCSV}>
        <Text style={styles.bankButtonText}>
          {csvName ? `Uploaded: ${csvName}` : "Connect Bank"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={finishOnboarding}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FFE1",
    padding: 24,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 25,
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
    marginBottom: 30,
    lineHeight: 24,
  },

  input: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },

  button: {
    backgroundColor: "#7CB342",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },

  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 20,
    marginBottom: 16,
  },

  budgetCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  category: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
  },

  amountBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3FFE1",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  dollarSign: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },

  amountInput: {
    minWidth: 45,
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    padding: 4,
  },

  slider: {
    width: "100%",
    height: 40,
    marginTop: 12,
  },

  dollarText: {
    color: "#6B7280",
    marginTop: 4,
  },

  bankText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 20,
  },

  bankButton: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7CB342",
    marginBottom: 10,
  },

  bankButtonText: {
    color: "#7CB342",
    fontWeight: "bold",
    fontSize: 15,
  },
});