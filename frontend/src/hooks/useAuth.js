import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token) {
      setIsAuthenticated(true);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    setIsAuthenticated(true);
    navigate('/'); // Redirect to dashboard after login
  };

  const logout = () => {
    // 1. Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Reset state
    setIsAuthenticated(false);
    setUser(null);

    // 3. Redirect to login page immediately
    navigate('/login');
  };

  return { isAuthenticated, user, loading, login, logout };
}