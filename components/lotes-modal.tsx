import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { Modal, StyleSheet, TouchableOpacity, FlatList } from "react-native";

interface LoteDetails {
  id: number;
  produto: number;
  identificacao: string;
  identificacao_produto: string;
  descricao: string;
  data_criacao: string;
  data_validade: string;
  localizacao: string;
  qtde: number;
  saldo: number;
  deposito?: any;
}

interface LotesModalProps {
  visible: boolean;
  lotes: LoteDetails[];
  onClose: () => void;
  productName?: string;
}

export default function LotesModal({
  visible,
  lotes,
  onClose,
  productName = "Produto",
}: LotesModalProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
  };

  const calculateDaysUntilExpiry = (expiryDate: string) => {
    try {
      const today = new Date();
      const expiry = new Date(expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  const getExpiryStatus = (expiryDate: string) => {
    const days = calculateDaysUntilExpiry(expiryDate);
    if (days === null) return { color: "#8A9BB8", text: "Data inválida" };

    if (days < 0)
      return { color: "#FF4D6D", text: `Vencido há ${Math.abs(days)} dias` };
    if (days <= 7) return { color: "#F59E0B", text: `Vence em ${days} dias` };
    if (days <= 30) return { color: "#EAB308", text: `Vence em ${days} dias` };
    return { color: "#10B981", text: `Vence em ${days} dias` };
  };

  const totalDisponivel = lotes.reduce(
    (sum, lote) => sum + (lote.saldo || 0),
    0,
  );

  const renderLote = ({
    item,
    index,
  }: {
    item: LoteDetails;
    index: number;
  }) => {
    const expiryStatus = getExpiryStatus(item.data_validade);

    return (
      <ThemedView style={styles.loteCard}>
        {/* Header do lote */}
        <ThemedView style={styles.loteHeader}>
          <ThemedText style={styles.loteNumber}>Lote #{index + 1}</ThemedText>
          <ThemedView
            style={[
              styles.statusBadge,
              { backgroundColor: expiryStatus.color + "20" },
            ]}
          >
            <ThemedText
              style={[styles.statusText, { color: expiryStatus.color }]}
            >
              {item.saldo > 0 ? "Disponível" : "Esgotado"}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Identificação do lote */}
        <ThemedText style={styles.loteId}>ID: {item.identificacao}</ThemedText>

        {/* Informações principais */}
        <ThemedView style={styles.loteInfo}>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>💰 Quantidade:</ThemedText>
            <ThemedText style={styles.quantityText}>
              {item.qtde || 0}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>📦 Saldo:</ThemedText>
            <ThemedText
              style={[
                styles.saldoText,
                { color: item.saldo > 0 ? "#10B981" : "#FF4D6D" },
              ]}
            >
              {item.saldo || 0}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>📍 Localização:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {item.localizacao || "N/A"}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>📅 Criação:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {formatDate(item.data_criacao)}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>⏰ Validade:</ThemedText>
            <ThemedText
              style={[styles.expiryText, { color: expiryStatus.color }]}
            >
              {formatDate(item.data_validade)}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.expiryStatusRow}>
            <ThemedText
              style={[styles.expiryStatus, { color: expiryStatus.color }]}
            >
              {expiryStatus.text}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };

  const renderEmptyState = () => (
    <ThemedView style={styles.emptyState}>
      <ThemedText style={styles.emptyIcon}>📦</ThemedText>
      <ThemedText style={styles.emptyTitle}>Nenhum lote encontrado</ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        Este produto não possui lotes disponíveis no momento.
      </ThemedText>
    </ThemedView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedView style={styles.headerContent}>
            <ThemedText style={styles.title}>📦 Lotes Disponíveis</ThemedText>
            <ThemedText style={styles.productName}>{productName}</ThemedText>

            <ThemedView style={styles.summaryContainer}>
              <ThemedView style={styles.summaryCard}>
                <ThemedText style={styles.summaryLabel}>
                  Total de Lotes
                </ThemedText>
                <ThemedText style={styles.summaryValue}>
                  {lotes.length}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.summaryCard}>
                <ThemedText style={styles.summaryLabel}>
                  Total Disponível
                </ThemedText>
                <ThemedText style={[styles.summaryValue, { color: "#10B981" }]}>
                  {totalDisponivel}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Lista de lotes */}
        <FlatList
          data={lotes}
          renderItem={renderLote}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },
  header: {
    backgroundColor: "#1E293B",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2A3B5C",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F4F7FF",
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    color: "#8A9BB8",
    marginBottom: 20,
    fontWeight: "500",
  },
  summaryContainer: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#8A9BB8",
    marginBottom: 4,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 18,
    color: "#2FA8FF",
    fontWeight: "700",
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#8A9BB8",
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loteCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A3B5C",
    borderLeftWidth: 4,
    borderLeftColor: "#2FA8FF",
    padding: 16,
    marginBottom: 16,
  },
  loteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  loteNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2FA8FF",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  loteId: {
    fontSize: 12,
    color: "#8A9BB8",
    marginBottom: 12,
    fontWeight: "500",
  },
  loteInfo: {
    backgroundColor: "transparent",
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  infoLabel: {
    fontSize: 13,
    color: "#8A9BB8",
    fontWeight: "500",
    flex: 1,
  },
  quantityText: {
    fontSize: 14,
    color: "#F4F7FF",
    fontWeight: "600",
  },
  saldoText: {
    fontSize: 16,
    fontWeight: "700",
  },
  infoValue: {
    fontSize: 13,
    color: "#F4F7FF",
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
  },
  expiryText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
  expiryStatusRow: {
    marginTop: 4,
    backgroundColor: "transparent",
  },
  expiryStatus: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    backgroundColor: "transparent",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F4F7FF",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#8A9BB8",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
