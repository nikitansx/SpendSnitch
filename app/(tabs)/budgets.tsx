import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function BudgetsScreen() {
  const [goal, setGoal] = useState("");
  const [budgets, setBudgets] = useState<any>({
    Food: "0",
    Shopping: "0",
    Travel: "0",
    Entertainment: "0",
  });

  const [transactions, setTransactions] = useState<any[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [privacyKeywords, setPrivacyKeywords] = useState<string[]>([
    "Pharmacy",
    "Medical",
    "Health",
  ]);
  const [customKeyword, setCustomKeyword] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const saved = await AsyncStorage.getItem("spendSnitchUserData");

    if (saved) {
      const data = JSON.parse(saved);
      setGoal(data.goal || "");
      setBudgets(data.budgets || budgets);
      setTransactions(data.transactions || []);
      setPrivacyKeywords(data.privacyKeywords || ["Pharmacy", "Medical", "Health"]);
    }
  };

  const saveUserData = async (updates: any) => {
    const saved = await AsyncStorage.getItem("spendSnitchUserData");
    const oldData = saved ? JSON.parse(saved) : {};

    await AsyncStorage.setItem(
      "spendSnitchUserData",
      JSON.stringify({
        ...oldData,
        ...updates,
      })
    );
  };

  const updateGoal = async (value: string) => {
    setGoal(value);
    await saveUserData({ goal: value });
  };

  const updateBudget = async (category: string, value: string) => {
    const updatedBudgets = {
      ...budgets,
      [category]: value,
    };

    setBudgets(updatedBudgets);
    await saveUserData({ budgets: updatedBudgets });
  };

const parseCSV = (text: string) => {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const rows = lines.slice(1);

  return rows.map((line, index) => {
    const values = line.split(",").map((v) => v.trim());
    const row: any = {};

    headers.forEach((header, i) => {
      row[header] = values[i] || "";
    });

    return {
      id: index + 1,
      date: row.date || "",
      time: row.time || "",
      item: row.item || "",
      cost: Number(String(row.cost || "0").replace("$", "")),
      category: row.category || "",
    };
  });
};

const changeBankCSV = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: "text/csv",
  });

  if (result.canceled) return;

  const file = result.assets[0];

  const response = await fetch(file.uri);
  const text = await response.text();
  const parsed = parseCSV(text);

  setTransactions(parsed);

  await saveUserData({
    transactions: parsed,
  });

  Alert.alert("Bank updated", "Your mock bank transactions have been updated.");
};

  const addPrivacyKeyword = async () => {
    if (customKeyword.trim() === "") return;

    const updated = [...privacyKeywords, customKeyword.trim()];
    setPrivacyKeywords(updated);
    setCustomKeyword("");

    await saveUserData({ privacyKeywords: updated });
  };

  const removePrivacyKeyword = async (keyword: string) => {
    const updated = privacyKeywords.filter((item) => item !== keyword);
    setPrivacyKeywords(updated);

    await saveUserData({ privacyKeywords: updated });
  };

  const isPrivateTransaction = (transaction: any) => {
    const item = transaction.item.toLowerCase();
    const category = transaction.category.toLowerCase();

    return privacyKeywords.some((keyword) => {
      const lowerKeyword = keyword.toLowerCase();
      return item.includes(lowerKeyword) || category.includes(lowerKeyword);
    });
  };

  const visibleTransactions = transactions.filter(
    (transaction) => !isPrivateTransaction(transaction)
  );

  const hiddenTransactions = transactions.filter((transaction) =>
    isPrivateTransaction(transaction)
  );

  const getSpentByCategory = (category: string) => {
    return visibleTransactions
      .filter((item) => item.category === category)
      .reduce((total, item) => total + Number(item.cost), 0);
  };

  const categories = ["Food", "Shopping", "Travel", "Entertainment"];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Budgets</Text>

      <View style={styles.goalCard}>
        <Text style={styles.goalLabel}>Main budgeting goal</Text>

        <TextInput
          style={styles.goalInput}
          value={goal}
          placeholder="No goal added yet"
          placeholderTextColor="#9CA3AF"
          onChangeText={updateGoal}
        />
      </View>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setSettingsOpen(true)}
      >
        <Text style={styles.settingsButtonText}>Bank & Privacy Settings</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Weekly allowances</Text>

      {categories.map((category) => {
        const budget = Number(budgets[category]) || 0;
        const spent = getSpentByCategory(category);
        const remaining = budget - spent;
        const overBudget = remaining < 0;

        return (
          <View key={category} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.category}>{category}</Text>

              <View style={styles.inputBox}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={budgets[category]}
                  onChangeText={(value) => updateBudget(category, value)}
                />
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Spent</Text>
              <Text style={styles.value}>${spent.toFixed(2)}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Remaining</Text>
              <Text
                style={[
                  styles.value,
                  overBudget ? styles.overBudget : styles.safeBudget,
                ]}
              >
                ${remaining.toFixed(2)}
              </Text>
            </View>

            {overBudget && (
              <Text style={styles.warning}>
                Snitch alert sent: you went over your {category} budget 👀
              </Text>
            )}
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>Visible bank transactions</Text>

      {visibleTransactions.length === 0 ? (
        <Text style={styles.emptyText}>No visible transactions yet.</Text>
      ) : (
        visibleTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View>
              <Text style={styles.transactionItem}>{transaction.item}</Text>
              <Text style={styles.transactionCategory}>
                {transaction.category}
              </Text>
            </View>

            <Text style={styles.transactionCost}>
              ${Number(transaction.cost).toFixed(2)}
            </Text>
          </View>
        ))
      )}

      {hiddenTransactions.length > 0 && (
        <Text style={styles.privateNote}>
          {hiddenTransactions.length} private transaction(s) hidden by your privacy
          filters.
        </Text>
      )}

      <Modal visible={settingsOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Bank & Privacy Settings</Text>

              <Text style={styles.modalSubtitle}>
                Control your linked bank data and hide sensitive transactions
                from snitch alerts and shared reports.
              </Text>

              <Text style={styles.modalSectionTitle}>Linked bank</Text>

              <TouchableOpacity style={styles.bankButton} onPress={changeBankCSV}>
                <Text style={styles.bankButtonText}>Change Bank</Text>
              </TouchableOpacity>

              <Text style={styles.modalSectionTitle}>Privacy filters</Text>

              <Text style={styles.modalSubtitle}>
                Transactions containing these words will be hidden.
              </Text>

              {privacyKeywords.map((keyword) => (
                <View key={keyword} style={styles.keywordRow}>
                  <Text style={styles.keywordText}>{keyword}</Text>

                  <TouchableOpacity onPress={() => removePrivacyKeyword(keyword)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.addKeywordRow}>
                <TextInput
                  style={styles.keywordInput}
                  placeholder="Add keyword e.g. Pharmacy"
                  placeholderTextColor="#9CA3AF"
                  value={customKeyword}
                  onChangeText={setCustomKeyword}
                />

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addPrivacyKeyword}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.privacyInfoBox}>
                <Text style={styles.privacyInfoText}>
                  Hidden transactions are not counted in public snitch alerts. This
                  keeps accountability fun without exposing sensitive spending.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSettingsOpen(false)}
              >
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FFE1",
    padding: 24,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 45,
    marginBottom: 20,
  },

  goalCard: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
  },

  goalLabel: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 6,
  },

  goalInput: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "bold",
    padding: 0,
  },

  settingsButton: {
    alignSelf: "flex-end",
    backgroundColor: "white",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#D9EBCB",
  },

  settingsButtonText: {
    color: "#8E7DBE",
    fontWeight: "600",
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 14,
    marginTop: 10,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  category: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#111827",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3FFE1",
    borderRadius: 14,
    paddingHorizontal: 10,
  },

  dollarSign: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },

  input: {
    minWidth: 50,
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    padding: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  label: {
    color: "#6B7280",
    fontSize: 15,
  },

  value: {
    fontSize: 15,
    fontWeight: "bold",
  },

  safeBudget: {
    color: "#7CB342",
  },

  overBudget: {
    color: "#EF4444",
  },

  warning: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
    padding: 12,
    borderRadius: 14,
    marginTop: 14,
    fontWeight: "600",
  },

  transactionCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  transactionItem: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },

  transactionCategory: {
    color: "#6B7280",
    marginTop: 4,
  },

  transactionCost: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },

  emptyText: {
    color: "#6B7280",
    marginBottom: 20,
  },

  privateNote: {
    color: "#6B7280",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 16,
    marginTop: 4,
    marginBottom: 16,
    fontSize: 14,
  },

  reloadButton: {
    backgroundColor: "#8E7DBE",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 40,
  },

  reloadButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#F3FFE1",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: "88%",
  },

  modalTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },

  modalSubtitle: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },

  modalSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 10,
    marginBottom: 12,
  },

  bankButton: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8E7DBE",
    marginBottom: 18,
  },

  bankButtonText: {
    color: "#8E7DBE",
    fontWeight: "bold",
    fontSize: 15,
  },

  keywordRow: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  keywordText: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 15,
  },

  removeText: {
    color: "#EF4444",
    fontWeight: "bold",
    fontSize: 13,
  },

  addKeywordRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  keywordInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    fontSize: 15,
  },

  addButton: {
    backgroundColor: "#7CB342",
    borderRadius: 16,
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  privacyInfoBox: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
  },

  privacyInfoText: {
    color: "#6B7280",
    lineHeight: 22,
  },

  closeButton: {
    backgroundColor: "#8E7DBE",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});