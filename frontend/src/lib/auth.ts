
import { API_HOST_BASE_URL } from '@/lib/constants'

export interface LoginData {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  user_name: string;
  email: string;
  password: number;
}

/**
 * Call your FastAPI backend to get a JWT and store it.
 * @throws if the response isn’t ok
 */
export async function login(data: LoginData): Promise<TokenResponse> {
  const form = new URLSearchParams();
  form.append('username', data.username);
  form.append('password', data.password);

  const url = `${API_HOST_BASE_URL}/auth/token`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  if (!res.ok) {
    throw new Error('Invalid credentials');
  }

  const json = (await res.json()) as TokenResponse;
  localStorage.setItem('accessToken', json.access_token);
  return json;
}

/** Clears the stored token */
export function clearToken() {
  localStorage.removeItem('accessToken');
}

/** Read the stored token (or null) */
export function getToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function setToken(token: string) {
  localStorage.setItem('accessToken', token);
}

export async function getUser(): Promise<User> {
    const token = localStorage.getItem("accessToken");
    if(!token) {
      throw Error("No token exists for user")
    } 
    const res = await fetch(`${API_HOST_BASE_URL}/auth/user`, {
      method: 'GET',
      headers: {
        token: token,
      }
    });
  
    if (!res.ok) {
      throw new Error('Invalid token');
    }
  
    const json = (await res.json()) as User;
    return json;
}