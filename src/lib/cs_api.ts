import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// Axios client for the Express API (browser only, adds Bearer token)
export const cs_api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let cs_cachedToken: { cs_token: string; cs_expiresAt: number } | null = null;
let cs_tokenRequest: Promise<string | null> | null = null;

const cs_fetchToken = async (): Promise<string | null> => {
  const cs_response = await fetch("/api/token", { cache: "no-store" });
  if (!cs_response.ok) return null;
  const cs_data = (await cs_response.json()) as { token: string; expiresAt: number };
  cs_cachedToken = { cs_token: cs_data.token, cs_expiresAt: cs_data.expiresAt };
  return cs_data.token;
};

// Reuse token until 1 min before expiry; share one in-flight request
const cs_getToken = async (): Promise<string | null> => {
  if (cs_cachedToken && cs_cachedToken.cs_expiresAt - Date.now() > 60_000) {
    return cs_cachedToken.cs_token;
  }
  cs_tokenRequest ??= cs_fetchToken().finally(() => {
    cs_tokenRequest = null;
  });
  return cs_tokenRequest;
};

// Call on sign out / account switch
export const cs_clearToken = () => {
  cs_cachedToken = null;
};

cs_api.interceptors.request.use(async (cs_config) => {
  const cs_token = await cs_getToken();
  if (cs_token) {
    cs_config.headers.Authorization = `Bearer ${cs_token}`;
  }
  return cs_config;
});

// On 401, get a fresh token and retry once
cs_api.interceptors.response.use(
  (cs_response) => cs_response,
  async (cs_error: AxiosError) => {
    const cs_config = cs_error.config as (InternalAxiosRequestConfig & { cs_retried?: boolean }) | undefined;
    if (cs_error.response?.status === 401 && cs_config && !cs_config.cs_retried) {
      cs_config.cs_retried = true;
      cs_clearToken();
      return cs_api(cs_config);
    }
    return Promise.reject(cs_error);
  },
);

// Readable message from an API error (for toasts)
export const cs_getErrorMessage = (cs_error: unknown, cs_fallback = "Something went wrong") => {
  if (axios.isAxiosError(cs_error)) {
    return (cs_error.response?.data as { message?: string } | undefined)?.message ?? cs_error.message ?? cs_fallback;
  }
  return cs_error instanceof Error ? cs_error.message : cs_fallback;
};
