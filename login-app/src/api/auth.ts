import { requestJson } from "./client";

export type AuthUserApi = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
};

type TokenResponse = {
  access: string;
  refresh: string;
};

type RegisterResponse = TokenResponse & {
  message: string;
  user: AuthUserApi;
};

const ACCESS_TOKEN_KEY = "shopzone_access_token";
const REFRESH_TOKEN_KEY = "shopzone_refresh_token";

export function setAuthTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function registerUserApi(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}): Promise<RegisterResponse> {
  return requestJson<RegisterResponse>("/api/accounts/register/", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      confirm_password: payload.confirmPassword,
    }),
  });
}

export async function loginUserApi(payload: {
  email: string;
  password: string;
}): Promise<RegisterResponse> {
  const tokens = await requestJson<TokenResponse>("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const profile = await requestJson<AuthUserApi>("/api/accounts/profile/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokens.access}`,
    },
  });

  return {
    access: tokens.access,
    refresh: tokens.refresh,
    message: "You are logged in successfully!",
    user: profile,
  };
}
