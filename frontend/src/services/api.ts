import axios from 'axios';

// API Client pointing to backend /api/v1 via Vite proxy or direct URL
const API_BASE_URL = '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ayur_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'doctor' | 'student' | 'patient';
  phone?: string;
  is_active: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  profile: UserProfile;
}

export const authService = {
  async register(data: { email: string; password: str; full_name: string; role: string }): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      if (response.data && response.data.access_token) {
        localStorage.setItem('ayur_token', response.data.access_token);
        localStorage.setItem('ayur_user', JSON.stringify(response.data.profile));
      }
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Registration failed. Please try again.';
      throw new Error(message);
    }
  },

  async login(data: { email: string; password: str }): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      if (response.data && response.data.access_token) {
        localStorage.setItem('ayur_token', response.data.access_token);
        localStorage.setItem('ayur_user', JSON.stringify(response.data.profile));
      }
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Invalid email or password.';
      throw new Error(message);
    }
  },

  async getMe(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/auth/me');
    if (response.data) {
      localStorage.setItem('ayur_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('ayur_token');
    localStorage.removeItem('ayur_user');
  },

  getStoredUser(): UserProfile | null {
    const data = localStorage.getItem('ayur_user');
    return data ? JSON.parse(data) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('ayur_token');
  }
};
