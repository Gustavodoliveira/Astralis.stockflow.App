import { LinearGradient } from "expo-linear-gradient";
import { Alert, StyleSheet } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import React from "react";

import LoadingModal from "@/components/loading-modal";
// import LotesModal from "@/components/lotes-modal"; // Temporariamente comentado
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedView } from "@/components/themed-view";
import Header from "@/components/ui/header";
// import { useProductDetails } from "@/hooks/use-product-details"; // Temporariamente comentado
import ProductSearch from "../../components/product-search";

export default function EstoqueScreen() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  
  // Estados básicos para teste
  const [showLotesModal, setShowLotesModal] = React.useState(false);
  const [selectedProductName, setSelectedProductName] = React.useState("");
  const [lotes, setLotes] = React.useState([]);
  const [lotesLoading, setLotesLoading] = React.useState(false);

  const [showLotesModal, setShowLotesModal] = React.useState(false);
  const [selectedProductName, setSelectedProductName] = React.useState("");

  const handleProductSelect = async (product: any) => {
    try {
      console.log("🎯 Produto selecionado no Estoque:", product);
      
      // Verificação de segurança do produto
      if (!product) {
        Alert.alert("Erro", "Produto inválido", [{ text: "OK" }]);
        return;
      }

    // Extrai informações importantes do produto com verificações de segurança
    const productInfo = {
      id: product?.id || null,
      descricao: product?.descricao || "Produto sem descrição",
      unidade: product?.unidade_medida || "UN",
      status: product?.status || "desconhecido",
      codigo: product?.identificacao || "Sem código",
    };

    if (productInfo.id) {
        console.log("🔍 Produto válido com ID:", productInfo.id);

        // Mostra informações do produto
        Alert.alert(
          "Produto Selecionado",
          `📦 ${productInfo.descricao}\\n\\n` +
            `🆔 ID: ${productInfo.id}\\n` +
            `🏷️ Código: ${productInfo.codigo}\\n` +
            `📏 Unidade: ${productInfo.unidade}\\n` +
            `📊 Status: ${productInfo.status ? productInfo.status.toUpperCase() : 'DESCONHECIDO'}`,
          [
            { text: "OK", style: "default" }
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
        visible={false}
        message="🔍 Buscando lotes disponíveis..."
      />

      {/* Modal de lotes simplificado por enquanto */}
      {/*
      <LotesModal
        visible={showLotesModal}
        lotes={lotes}
        onClose={() => setShowLotesModal(false)}
        productName={selectedProductName}
      />
      */}
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
