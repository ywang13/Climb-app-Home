import { apiRequest } from "./queryClient";

export interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

class AuthManager {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem("auth_token");
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>("/api/users/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    this.setAuth(response.token, response.user);
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>("/api/users/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    this.setAuth(response.token, response.user);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    if (!this.token) {
      throw new Error("No authentication token");
    }

    const user = await apiRequest<User>("/api/users/me", {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    this.user = user;
    return user;
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem("auth_token");
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setAuth(token: string, user: User): void {
    this.token = token;
    this.user = user;
    localStorage.setItem("auth_token", token);
  }

  // Add authorization header to requests
  getAuthHeaders(): HeadersInit {
    if (!this.token) {
      return {};
    }
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }
}

export const authManager = new AuthManager();