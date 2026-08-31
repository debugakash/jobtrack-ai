export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface User {
  id: string;

  firstName: string;
  lastName: string;
  email: string;

  avatar?: string | null;
  avatarUrl: string | null;

  // Profile information
  phone?: string | null;
  location?: string | null;
  headline?: string | null;
  bio?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  skills?: string | null;

  // Account information
  emailVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;

  // Notification preferences
  emailNotifications: boolean;
  interviewReminders: boolean;
  followUpReminders: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}
