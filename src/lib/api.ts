import { toast } from "@/hooks/use-toast";

const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

// Types for our API
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'clergy' | 'admin';
  profile: {
    phone: string;
    bio: string;
    dateOfBirth: string | null;
    gender: string;
    studentId: string;
    department: string;
    yearOfStudy: string;
    church: string;
    position: string;
    ordinationDate: string | null;
  };
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'student' | 'clergy' | 'admin';
  profile?: {
    phone?: string;
    bio?: string;
    dateOfBirth?: string;
    gender?: string;
    studentId?: string;
    department?: string;
    yearOfStudy?: string;
    church?: string;
    position?: string;
    ordinationDate?: string;
  };
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    }
  }

  // Auth methods
  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getMe(): Promise<{ status: string; data: { user: User } }> {
    return this.request<{ status: string; data: { user: User } }>('/auth/me');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // User methods
  async updateProfile(profileData: Partial<User['profile']>): Promise<{ status: string; data: { user: User } }> {
    return this.request<{ status: string; data: { user: User } }>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  async getProfile(): Promise<{ status: string; data: { user: User } }> {
    return this.request<{ status: string; data: { user: User } }>('/users/profile');
  }
}

export const apiService = new ApiService();