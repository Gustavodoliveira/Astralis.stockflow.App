/**
 * Configurações da API
 * As URLs são construídas a partir da variável de ambiente EXPO_PUBLIC_API_BASE_URL
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    'EXPO_PUBLIC_API_BASE_URL não está definida. Verifique o arquivo .env'
  );
}

export const API_ENDPOINTS = {
  // Base URL
  BASE: API_BASE_URL,
  
  // Buscar produtos
  SEARCH_PRODUCTS: `${API_BASE_URL}/getProductByName`,
  
  // Buscar lotes por ID do produto
  GET_LOTS_BY_ID: (productId: string) => 
    `${API_BASE_URL}/getLotById/${encodeURIComponent(productId)}`,
  
  // Buscar lotes por localização
  GET_LOTS_BY_LOCATION: (location: string) => 
    `${API_BASE_URL}/getLotByLocation/${encodeURIComponent(location)}`,
} as const;

export default API_ENDPOINTS;