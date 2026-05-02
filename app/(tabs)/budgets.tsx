import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
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
    }
  };

  const updateBudget = async (category: string, value: string) => {
    const updatedBudgets = {
      ...budgets,
      [category]: value,
    };

    setBudgets(updatedBudgets);

    const saved = await AsyncStorage.getItem("spendSnitchUserData");
    const oldData = saved ? JSON.parse(saved) : {};

    await AsyncStorage.setItem(
      "spendSnitchUserData",
      JSON.stringify({
        ...oldData,
        budgets: updatedBudgets,
      })
    );
  };

  const getSpentByCategory = (category: string) => {
    return transactions
      .filter((item) => item.category === category)
      .reduce((total, item) => total + Number(item.cost), 0);
  };

  const categories = ["Food", "Shopping", "Travel", "Entertainment"];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Budgets</Text>

      <View style={styles.goalCard}>
        <Text style={styles.goalLabel}>Main budgeting goal</Text>
        <Text style={styles.goalText}>
          {goal ? goal : "No goal added yet"}
        </Text>
      </View>

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
                Snitch alert: you went over your {category} budget 👀
              </Text>
            )}
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>Mock bank transactions</Text>

      {transactions.length === 0 ? (
        <Text style={styles.emptyText}>
          No CSV uploaded yet. Upload mock bank data during onboarding.
        </Text>
      ) : (
        transactions.map((transaction) => (
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

      <TouchableOpacity style={styles.reloadButton} onPress={loadData}>
        <Text style={styles.reloadButtonText}>Refresh budgets</Text>
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
    marginBottom: 24,
  },

  goalLabel: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 6,
  },

  goalText: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "bold",
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

  reloadButton: {
    backgroundColor: "#7CB342",
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
});