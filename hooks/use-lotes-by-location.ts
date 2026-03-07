import { useCallback, useState } from 'react';
import { API_ENDPOINTS } from '@/constants/api';

interface LoteByLocationDetails {
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

interface UseLotesByLocationReturn {
  lotes: LoteByLocationDetails[];
  loading: boolean;
  error: string | null;
  searchLotesByLocation: (location: string) => Promise<void>;
  clearLotes: () => void;
}

export function useLotesByLocation(): UseLotesByLocationReturn {
  const [lotes, setLotes] = useState<LoteByLocationDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLotesByLocation = useCallback(async (location: string) => {
    if (!location || !location.trim()) {
      setLotes([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Buscando lotes por localização:", location);
      
      // Busca lotes por localização usando variável de ambiente
      // encodeURIComponent garante que espaços e caracteres especiais sejam tratados corretamente
      const response = await fetch(
        API_ENDPOINTS.GET_LOTS_BY_LOCATION(location),
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
      console.log("📋 Lotes por localização:", data);
      
      // Processar a resposta da API de lotes por localização
      let lotesData: LoteByLocationDetails[] = [];
      
      if (data && data.success && Array.isArray(data.response)) {
        lotesData = data.response;
      } else if (Array.isArray(data)) {
        lotesData = data;
      }
      
      setLotes(lotesData);
    } catch (error: any) {
      console.log("❌ Erro ao buscar lotes por localização:", error);
      setError(`Erro ao buscar lotes: ${error.message}`);
      setLotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearLotes = useCallback(() => {
    setLotes([]);
    setError(null);
  }, []);

  return {
    lotes,
    loading,
    error,
    searchLotesByLocation,
    clearLotes,
  };
}