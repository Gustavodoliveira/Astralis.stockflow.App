import { useCallback, useEffect, useRef, useState } from 'react';
import { API_ENDPOINTS } from '@/constants/api';

interface Product {
  id: string;
  description: string;
  descricao: string;
  unidade_medida: string;
  status: string;
  identificacao: string;
  price?: number;
}

interface UseSearchProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchProducts: (query: string) => void;
}

export function useSearchProducts(debounceMs = 300): UseSearchProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref para cancelar a requisição anterior
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  const fetchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    // Cancela a requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Cria um novo AbortController
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError(null);

    try {
      console.log("🔥 Searching for:", query);
      const response = await fetch(
        `${API_ENDPOINTS.BASE}/getItemByDescription/${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortController.signal, // Para cancelar a requisição
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 Response data:", data);
      
      // Verifica se a requisição não foi cancelada
      if (!abortController.signal.aborted) {
        let productList = [];
        
        // Extrai o array de produtos da resposta da API
        if (data && data.success && Array.isArray(data.response)) {
          productList = data.response;
        } else if (Array.isArray(data)) {
          // Fallback para caso a API retorne array direto
          productList = data;
        } else if (data && typeof data === 'object') {
          // Fallback para caso seja um objeto único
          productList = [data];
        }
        
        console.log("📦 Final products list:", productList);
        console.log("📦 Products count:", productList.length);
        setProducts(productList);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError' && !abortController.signal.aborted) {
        console.log("❌ API Error:", error);
        setError(`Erro ao buscar produtos: ${error.message}`);
        setProducts([]);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const searchProducts = useCallback((query: string) => {
    // Clear timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Aplica o debounce
    debounceTimerRef.current = setTimeout(() => {
      fetchProducts(query);
    }, debounceMs);
  }, [fetchProducts, debounceMs]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { products, loading, error, searchProducts };
}