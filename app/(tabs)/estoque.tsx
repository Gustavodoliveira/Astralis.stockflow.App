import { LinearGradient } from "expo-linear-gradient";
import { Alert, StyleSheet } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import React from "react";

import LoadingModal from "@/components/loading-modal";
import LotesModal from "@/components/lotes-modal";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedView } from "@/components/themed-view";
import Header from "@/components/ui/header";
import { useProductDetails } from "@/hooks/use-product-details";
import ProductSearch from "../../components/product-search";

export default function EstoqueScreen() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const {
    lotes,
    loading: lotesLoading,
    fetchProductDetails,
  } = useProductDetails();

  const [showLotesModal, setShowLotesModal] = React.useState(false);
  const [selectedProductName, setSelectedProductName] = React.useState("");

  const handleProductSelect = async (product: any) => {
    console.log("🎯 Produto selecionado no Estoque:", product);

    // Extrai informações importantes do produto
    const productInfo = {
      id: product.id,
      descricao: product.descricao,
      unidade: product.unidade_medida,
      status: product.status,
      codigo: product.identificacao,
    };

    if (productInfo.id) {
      console.log("🔍 Buscando detalhes para ID:", productInfo.id);

      // Mostra informações do produto imediatamente
      Alert.alert(
        "Produto Selecionado",
        `📦 ${productInfo.descricao}\\n\\n` +
          `🆔 ID: ${productInfo.id}\\n` +
          `🏷️ Código: ${productInfo.codigo}\\n` +
          `📏 Unidade: ${productInfo.unidade}\\n` +
          `📊 Status: ${productInfo.status.toUpperCase()}`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Buscar Lotes",
            onPress: async () => {
              try {
                console.log("🔄 Iniciando busca de lotes...");
                setSelectedProductName(productInfo.descricao);
                await fetchProductDetails(productInfo.id.toString());
                console.log("✅ Lotes carregados com sucesso");

                // Abrir modal visual ao invés do Alert
                setShowLotesModal(true);
              } catch (err) {
                console.error("Erro ao buscar lotes:", err);
                Alert.alert(
                  "Erro",
                  "Não foi possível buscar os lotes do produto. Tente novamente.",
                  [{ text: "OK" }],
                );
              }
            },
          },
        ],
      );
    } else {
      Alert.alert("Erro", "Produto selecionado não possui ID válido", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <LinearGradient colors={["#0B1220", "#0E1A33"]} style={styles.container}>
      <ParallaxScrollView
        headerImage={
          <ThemedView style={styles.headerContainer}>
            <Header scrollRef={scrollRef} title="Estoque" />
          </ThemedView>
        }
        headerBackgroundColor={{ light: "transparent", dark: "transparent" }}
        scrollRef={scrollRef}
      >
        <ThemedView style={styles.searchContainer}>
          <ProductSearch onProductSelect={handleProductSelect} />
        </ThemedView>
      </ParallaxScrollView>

      <LoadingModal
        visible={lotesLoading}
        message="🔍 Buscando lotes disponíveis..."
      />

      <LotesModal
        visible={showLotesModal}
        lotes={lotes}
        onClose={() => setShowLotesModal(false)}
        productName={selectedProductName}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  searchContainer: {
    flex: 1,
    backgroundColor: "transparent",
    minHeight: 600,
    paddingBottom: 120,
  },
});
