import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await axios.post(`${API_URL}/register`, data);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await axios.post(`${API_URL}/forgot-password`, { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await axios.post(`${API_URL}/reset-password`, { token, newPassword });
  },

  logout(): void {
    localStorage.removeItem('user');
  },

  getCurrentUser(): LoginResponse | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
};

export default authService;