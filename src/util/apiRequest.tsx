import keycloak from '@/keycloak-config';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions<T = unknown> {
  method: RequestMethod;
  headers?: HeadersInit;
  body?: T;
}

export interface ErrorResponse {
  errorCode: number;
  message: string;
  path: string;
  statusCode: number;
  timeStamp: Date;
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
    return Promise.reject({
      message: 'Unauthorized. Redirecting to login.',
      statusCode: 401,
    });
  }

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json().catch((error) => {
      console.error(error);
    });
    throw errorData;
  }

  return (await response.json()) as TResponse;
}
