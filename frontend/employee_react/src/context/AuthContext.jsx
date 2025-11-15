import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('AUTH_TOKEN'));

  useEffect(() => {
    // Verificar si hay un token almacenado al cargar
    if (token) {
      // Verificar si hay datos de usuario guardados
      const userData = localStorage.getItem('USER_DATA');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Si hay error, limpiar datos corruptos
          localStorage.removeItem('AUTH_TOKEN');
          localStorage.removeItem('USER_DATA');
          setToken(null);
        }
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', { email, apiUrl: import.meta.env.VITE_API_URL });
      
      const response = await api.post('/login', {
        email,
        password
      });

      console.log('Login response:', response.data);
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('AUTH_TOKEN', token);
      localStorage.setItem('USER_DATA', JSON.stringify(user));
      console.log('Login successful, user:', user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.status === 422 || error.response?.status === 401) {
        return { success: false, error: 'Credenciales inválidas. Verifica tu email y contraseña.' };
      } else {
        return { success: false, error: 'Error de conexión. Inténtalo de nuevo.' };
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/register', userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Register error:', error);
      if (error.response?.data?.message) {
        return { success: false, error: error.response.data.message };
      } else {
        return { success: false, error: 'Error de conexión. Inténtalo de nuevo.' };
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('AUTH_TOKEN');
    localStorage.removeItem('USER_DATA');
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};