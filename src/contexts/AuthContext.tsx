import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '../lib/api';
import type { User, AuthState, LoginCredentials } from '../types/auth';

type AuthContextType = AuthState & {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

type AuthAction =
  | { type: 'SET_AUTH'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: User };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Fetch token from localStorage on mount, decode, and update state in `useEffect`
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ user: User }>(token);
        if (decoded) {
          dispatch({ type: 'SET_AUTH', payload: { user: decoded.user, token } });
        } else {
          throw new Error('Token decoding failed');
        }
      } catch (error) {
        console.error('Token is invalid or expired:', error);
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const login = async (credentials: LoginCredentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('token', data.token);
      dispatch({ type: 'SET_AUTH', payload: data });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await api.put<User>('/users/profile', data);
      dispatch({ type: 'UPDATE_USER', payload: response.data });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Aquí no se hace un logout, simplemente retorna el contexto.
  return context;
}

