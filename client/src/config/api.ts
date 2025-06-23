// API Configuration for different environments
export const API_CONFIG = {
  // Base URL for API calls
  baseURL: import.meta.env.VITE_API_URL || 
           (import.meta.env.DEV ? '' : 'https://barberbooker-backend.onrender.com'),
  
  // Request timeout in milliseconds
  timeout: 10000,
  
  // Default headers
  defaultHeaders: {
    'Content-Type': 'application/json',
  }
};

// API request wrapper with base URL handling
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  options?: RequestInit
): Promise<Response> {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const config: RequestInit = {
    method,
    headers: {
      ...API_CONFIG.defaultHeaders,
      ...options?.headers,
    },
    ...options,
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  return response;
}

// Helper for GET requests
export async function apiGet(endpoint: string): Promise<Response> {
  return apiRequest('GET', endpoint);
}

// Helper for POST requests
export async function apiPost(endpoint: string, data?: any): Promise<Response> {
  return apiRequest('POST', endpoint, data);
}
