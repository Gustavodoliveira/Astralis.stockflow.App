import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Input from "./input";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { API_ENDPOINTS } from "@/constants/api";

export default function SearchExample() {
  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Função específica para buscar item por descrição
  const searchItemByDescription = async (text: string) => {
    console.log("🔥 Searching for:", text);

    if (!text || text.trim() === "") {
      console.log("⚠️ Text is empty, skipping search");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      console.log("🌐 Making API call to search item");
      const response = await fetch(
        `${API_ENDPOINTS.BASE}/getItemByDescription/${text}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("✅ Response received, status:", response.status);
      const data = await response.json();
      console.log("📦 Response data:", JSON.stringify(data, null, 2));

      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.log("❌ API Error:", error);
      setResult(`Erro: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Buscar Item por Descrição
      </ThemedText>

      <Input
        placeholder="Digite a descrição do item..."
        value={searchText}
        onChangeText={setSearchText}
        onSubmit={searchItemByDescription} // Passa a função customizada
        style={styles.input}
      />

      {loading && <ThemedText style={styles.loading}>Buscando...</ThemedText>}

      {result && (
        <ThemedText style={styles.result}>Resultado: {result}</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "transparent",
  },
  title: {
    color: "#F4F7FF",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 20,
  },
  loading: {
    color: "#F4F7FF",
    textAlign: "center",
    fontStyle: "italic",
  },
  result: {
    color: "#4CAF50",
    fontSize: 12,
    marginTop: 10,
  },
});
