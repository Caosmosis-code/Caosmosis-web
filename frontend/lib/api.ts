import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface ApiOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { skipAuth, headers, ...rest } = options;

  const token = Cookies.get("token");

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (token && !skipAuth) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorBody);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export class ApiError extends Error {
  status: number;
  body: any;

  constructor(status: number, body: any) {
    super(body?.mensaje || "Error en la petición");
    this.status = status;
    this.body = body;
  }
}