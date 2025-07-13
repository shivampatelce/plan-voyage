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
  options: RequestOptions<TRequest> = { method: 'GET' },
  baseUrl = API_BASE_URL
): Promise<unknown> {
  const { method = 'GET', headers = {}, body } = options;

  const isFormData = body instanceof FormData;

  const config: RequestInit = {
    method,
    headers: {
      Authorization: `bearer ${keycloak.token}`,
      ...headers,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    },
    body: isFormData
      ? (body as BodyInit)
      : body
      ? JSON.stringify(body)
      : undefined,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, config);

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
