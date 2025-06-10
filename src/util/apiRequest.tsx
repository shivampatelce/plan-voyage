import keycloak from '@/keycloak-config';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions<T = unknown> {
  method: RequestMethod;
  headers?: HeadersInit;
  body?: T;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest<
  TRequest = unknown,
  TResponse = { data: unknown }
>(
  endpoint: string,
  options: RequestOptions<TRequest> = { method: 'GET' }
): Promise<unknown> {
  const { method = 'GET', headers = {}, body } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${keycloak.token}`,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    keycloak.login();
  }

  if (!response.ok) {
    const errorData = await response.json().catch((error) => {
      console.error(error);
    });
    throw new Error(errorData.message || 'API request failed');
  }

  return (await response.json()) as TResponse;
}
