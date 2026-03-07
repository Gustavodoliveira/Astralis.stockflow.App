import { useCallback, useState } from 'react';
import { API_ENDPOINTS } from '@/constants/api';

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
  deposito?: any; // Object conforme API
}

interface ProductDetails {
  // Estrutura baseada na resposta da sua API de lotes
  id: number;
  descricao: string;
  identificacao: string;
  unidade_medida: string;
  status: string;
  lotes?: LoteDetails[];
  total_disponivel?: number;
}

interface UseProductDetailsReturn {
  productDetails: ProductDetails | null;
  lotes: LoteDetails[];
  loading: boolean;
  error: string | null;
  fetchProductDetails: (productId: string) => Promise<void>;
  clearDetails: () => void;
  formatLotesDisplay: () => string;
}

export function useProductDetails(): UseProductDetailsReturn {
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [lotes, setLotes] = useState<LoteDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductDetails = useCallback(async (productId: string) => {
    if (!productId) {
      setError('ID do produto é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Buscando detalhes do produto ID:", productId);
      
      // Busca lotes pelo ID do produto usando variável de ambiente
      const response = await fetch(
        API_ENDPOINTS.GET_LOTS_BY_ID(productId),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      console.log("📋 Lotes do produto:", data);
      
      // Processar a resposta da API de lotes
      let lotesData: LoteDetails[] = [];
      let productInfo: ProductDetails | null = null;
      
      if (data && data.success && Array.isArray(data.response)) {
        // Se a resposta contém array de lotes
        lotesData = data.response;
        
        // Calcular total disponível
        const totalDisponivel = lotesData.reduce((sum, lote) => {
          return sum + (lote.saldo || 0);
        }, 0);
        
        // Criar objeto do produto baseado no primeiro lote
        if (lotesData.length > 0) {
          const primeiroLote = lotesData[0];
          productInfo = {
            id: primeiroLote.produto || parseInt(productId),
            descricao: primeiroLote.descricao || `Produto ID: ${productId}`,
            identificacao: primeiroLote.identificacao_produto || productId,
            unidade_medida: "UN", // pode ser obtido de outro endpoint
            status: "ativo",
            lotes: lotesData,
            total_disponivel: totalDisponivel
          };
        }
      } else if (Array.isArray(data)) {
        // Fallback se retornar array direto
        lotesData = data;
      }
      
      setLotes(lotesData);
      setProductDetails(productInfo);
    } catch (error: any) {
      console.log("❌ Erro ao buscar detalhes:", error);
      setError(`Erro ao buscar detalhes: ${error.message}`);
      setProductDetails(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearDetails = useCallback(() => {
    setProductDetails(null);
    setLotes([]);
    setError(null);
  }, []);

  const formatLotesDisplay = useCallback(() => {
    if (lotes.length === 0) {
      return "Nenhum lote disponível";
    }

    const totalDisponivel = lotes.reduce((sum, lote) => sum + (lote.saldo || 0), 0);
    const lotesValidos = lotes.filter(lote => (lote.saldo || 0) > 0);
    
    return `${lotesValidos.length} lote(s) disponível(is)\nTotal: ${totalDisponivel} unidades`;
  }, [lotes]);

  return {
    productDetails,
    lotes,
    loading,
    error,
    fetchProductDetails,
    clearDetails,
    formatLotesDisplay,
  };
}