import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";

const GEMINI_API_KEY = "AIzaSyA1cVEGI2ol7x2eNGKDKgXT89ghGaokj8A";

export default function AICoachScreen() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const reportRef = useRef<any>(null);

  const analyseSpending = async () => {
    setLoading(true);

    try {
      const saved = await AsyncStorage.getItem("spendSnitchUserData");
      const userData = saved ? JSON.parse(saved) : null;

      if (!userData || !userData.transactions?.length) {
        setReport({
          personality: "Mystery Spender",
          roast: "I need your bank data before I can judge your spending habits 👀",
          pattern: "No mock CSV transactions found yet.",
          problemCategory: "Unknown",
          tip: "Upload a mock bank CSV first from onboarding or the budgets page.",
        });
        setLoading(false);
        return;
      }

      const prompt = `
You are the AI Snitch Coach for a budgeting app called SpendSnitch.

Use this user data:
Goal: ${userData.goal}
Budgets: ${JSON.stringify(userData.budgets)}
Transactions: ${JSON.stringify(userData.transactions)}

Return ONLY valid JSON in this exact format:
{
  "personality": "funny spending personality name",
  "roast": "one funny but not cruel roast",
  "pattern": "short spending pattern summary",
  "problemCategory": "one category only",
  "tip": "one useful saving tip"
}

Keep it short, funny, supportive, and Gen Z friendly.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("No AI response");

      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      setReport(parsed);
    } catch (error) {
      setReport({
        personality: "AI Confused Bestie",
        roast: "The AI tripped over your transactions. Very on brand.",
        pattern: "Something went wrong while analysing your spending.",
        problemCategory: "Error",
        tip: "Check your API key and uploaded CSV.",
      });
    }

    setLoading(false);
  };

  const shareReport = async () => {
    if (!reportRef.current) return;

    const uri = await reportRef.current.capture();

    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing is not available on this device");
      return;
    }

    await Sharing.shareAsync(uri, {
      mimeType: "image/png",
      dialogTitle: "Share your SpendSnitch report",
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI Snitch Coach</Text>

      <Text style={styles.subtitle}>
        Let AI analyse your spending and expose your financial personality.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={analyseSpending}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Analysing..." : "Analyse my spending"}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={styles.loader} size="large" />}

      {report && (
        <>
          <ViewShot
            ref={reportRef}
            options={{ format: "png", quality: 1 }}
          >
            <View style={styles.shareImageCard}>
              <Text style={styles.reportTitle}>SpendSnitch AI Report 👀</Text>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>Spending Personality</Text>
                <Text style={styles.cardText}>{report.personality}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>Funniest Roast</Text>
                <Text style={styles.cardText}>{report.roast}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>Spending Pattern</Text>
                <Text style={styles.cardText}>{report.pattern}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>Problem Category</Text>
                <Text style={styles.cardText}>{report.problemCategory}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>Saving Tip</Text>
                <Text style={styles.cardText}>{report.tip}</Text>
              </View>

              <Text style={styles.footerText}>
                Generated by SpendSnitch 💚
              </Text>
            </View>
          </ViewShot>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={shareReport}
          >
            <Text style={styles.shareButtonText}>
              Share
            </Text>
          </TouchableOpacity>
        </>
      )}
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
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
    marginBottom: 24,
    lineHeight: 24,
  },

  button: {
    backgroundColor: "#7CB342",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

  loader: {
    marginTop: 20,
  },

  shareImageCard: {
    backgroundColor: "#F3FFE1",
    borderRadius: 28,
    padding: 18,
    marginTop: 10,
  },

  reportTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },

  cardLabel: {
    color: "#7CB342",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },

  cardText: {
    color: "#111827",
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
  },

  footerText: {
    textAlign: "center",
    marginTop: 8,
    color: "#6B7280",
    fontWeight: "600",
  },

  shareButton: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 18,
    marginBottom: 40,
  },

  shareButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});