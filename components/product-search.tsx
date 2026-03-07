import Input from "@/components/input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSearchProducts } from "@/hooks/use-search-products";
import { useLotesByLocation } from "@/hooks/use-lotes-by-location";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

interface ProductSearchProps {
  onProductSelect?: (product: any) => void;
  onLoteSelect?: (lote: any) => void;
}

export default function ProductSearch({
  onProductSelect,
  onLoteSelect,
}: ProductSearchProps) {
  const {
    products,
    loading: productsLoading,
    error: productsError,
    searchProducts,
  } = useSearchProducts(300);
  const {
    lotes,
    loading: lotesLoading,
    error: lotesError,
    searchLotesByLocation,
    clearLotes,
  } = useLotesByLocation();

  const [searchType, setSearchType] = React.useState<
    "produtos" | "localizacao"
  >("produtos");
  const [locationSearch, setLocationSearch] = React.useState("");

  const handleLocationSearch = React.useCallback(
    (location: string) => {
      setLocationSearch(location);
      if (location.trim()) {
        searchLotesByLocation(location);
        setSearchType("localizacao");
      } else {
        clearLotes();
        setSearchType("produtos");
      }
    },
    [searchLotesByLocation, clearLotes],
  );

  const handleProductSearch = React.useCallback(
    (query: string) => {
      searchProducts(query);
      if (query.trim()) {
        setSearchType("produtos");
      }
    },
    [searchProducts],
  );

  // Filtrar apenas produtos ativos
  const activeProducts = products.filter(
    (product) => product.status === "ativo",
  );

  const renderProduct = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => {
          console.log("🎯 Product selected:", {
            id: item.id,
            descricao: item.descricao,
            unidade_medida: item.unidade_medida,
            status: item.status,
          });
          onProductSelect?.(item);
        }}
        activeOpacity={0.8}
      >
        {/* Cabeçalho do card */}
        <ThemedView style={styles.cardHeader}>
          <ThemedText style={styles.productId}>ID: {item.id}</ThemedText>
        </ThemedView>

        {/* Descrição do produto */}
        <ThemedText style={styles.productName} numberOfLines={2}>
          {item.descricao || "Produto sem descrição"}
        </ThemedText>

        {/* Informações principais */}
        <ThemedView style={styles.productInfo}>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Unidade:</ThemedText>
            <ThemedText style={styles.unitText}>
              {item.unidade_medida || "N/A"}
            </ThemedText>
          </ThemedView>

          {item.identificacao && (
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Código:</ThemedText>
              <ThemedText style={styles.codeText}>
                {item.identificacao}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </TouchableOpacity>
    );
  };

  const renderLote = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => {
          console.log("🎯 Lote selected:", {
            id: item.id,
            identificacao: item.identificacao,
            descricao: item.descricao,
            localizacao: item.localizacao,
          });
          onLoteSelect?.(item);
        }}
        activeOpacity={0.8}
      >
        {/* Cabeçalho do card */}
        <ThemedView style={styles.cardHeader}>
          <ThemedText style={styles.productId}>ID: {item.id}</ThemedText>
          <ThemedView style={styles.statusBadge}>
            <ThemedText style={styles.statusText}>Ativo</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Descrição do lote */}
        <ThemedText style={styles.productName} numberOfLines={2}>
          {item.descricao || "Lote sem descrição"}
        </ThemedText>

        {/* Informações principais */}
        <ThemedView style={styles.productInfo}>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Código:</ThemedText>
            <ThemedText style={styles.unitText}>
              {item.identificacao || "N/A"}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Quantidade:</ThemedText>
            <ThemedText style={styles.unitText}>{item.qtde}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Saldo:</ThemedText>
            <ThemedText style={styles.unitText}>{item.saldo}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Localização:</ThemedText>
            <ThemedText style={styles.codeText}>{item.localizacao}</ThemedText>
          </ThemedView>

          {item.data_validade && (
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Validade:</ThemedText>
              <ThemedText style={styles.codeText}>
                {new Date(item.data_validade).toLocaleDateString("pt-BR")}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    const isLoading =
      searchType === "produtos" ? productsLoading : lotesLoading;
    const error = searchType === "produtos" ? productsError : lotesError;

    if (isLoading) {
      return (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>
            {searchType === "produtos"
              ? "🔍 Buscando produtos..."
              : "🗺️ Buscando lotes..."}
          </ThemedText>
        </ThemedView>
      );
    }

    if (error) {
      return (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
          <ThemedText style={styles.emptyText}>
            Tente novamente ou verifique sua conexão
          </ThemedText>
        </ThemedView>
      );
    }

    return (
      <ThemedView style={styles.emptyState}>
        <ThemedText style={styles.emptyText}>
          {searchType === "produtos"
            ? "💡 Digite para buscar produtos"
            : "🗺️ Digite uma localização para buscar lotes"}
        </ThemedText>
      </ThemedView>
    );
  };

  // Dados para renderizar baseado no tipo de busca
  const dataToRender = searchType === "produtos" ? activeProducts : lotes;
  const renderItem = searchType === "produtos" ? renderProduct : renderLote;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.searchInputsContainer}>
        <Input
          placeholder="Buscar produtos..."
          onChangeText={handleProductSearch}
          style={styles.searchInput}
        />

        <Input
          placeholder="Buscar por localização..."
          value={locationSearch}
          onChangeText={handleLocationSearch}
          style={styles.searchInput}
        />
      </ThemedView>

      {searchType === "produtos" && activeProducts.length > 0 && (
        <ThemedText style={styles.resultsHeader}>
          📦 {activeProducts.length} produto(s) encontrado(s)
        </ThemedText>
      )}

      {searchType === "localizacao" && lotes.length > 0 && (
        <ThemedText style={styles.resultsHeader}>
          🗺️ {lotes.length} lote(s) encontrado(s) na localização
        </ThemedText>
      )}

      <FlatList
        data={dataToRender}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        style={styles.resultsList}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          dataToRender.length === 0
            ? styles.emptyContainer
            : { paddingBottom: 20 }
        }
        extraData={dataToRender.length}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    minHeight: 500,
  },
  searchInput: {
    marginBottom: 16,
  },
  searchInputsContainer: {
    paddingBottom: 16,
    backgroundColor: "transparent",
  },
  resultsHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2FA8FF",
    marginBottom: 12,
    paddingLeft: 4,
  },
  resultsList: {
    flex: 1,
    minHeight: 300,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  productItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A3B5C",
    borderLeftWidth: 4,
    borderLeftColor: "#2FA8FF",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  statusBadge: {
    backgroundColor: "#1D4ED8",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  productId: {
    fontSize: 12,
    color: "#8A9BB8",
    fontWeight: "600",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F4F7FF",
    lineHeight: 22,
    marginBottom: 12,
  },
  productInfo: {
    backgroundColor: "transparent",
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  infoLabel: {
    fontSize: 12,
    color: "#8A9BB8",
    fontWeight: "500",
  },
  unitText: {
    fontSize: 14,
    color: "#F4F7FF",
    fontWeight: "600",
  },
  codeText: {
    fontSize: 12,
    color: "#8A9BB8",
    fontStyle: "italic",
  },
  emptyState: {
    flex: 1,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  emptyText: {
    color: "#8A9BB8",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  errorText: {
    color: "#FF4D6D",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 8,
  },
});
