/**
 * Tipos para el sistema de roles y permisos
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  roles: string[];
  permissions: string[];
  avatar?: string;
  createdAt?: Date;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  route: string | null;
  description?: string;
  roles: string[];
  permissions: string[];
  badge?: {
    text: string;
    color: string;
  } | string | null;
  children?: SidebarItem[] | null;
}

export interface SidebarConfig {
  header: {
    logo: string;
    company: string;
    toggleCollapse: boolean;
  };
  sections: SidebarItem[];
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken?: string;
  };
  message: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  setUser: (user: User | null) => void;
}
