import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  }, [navigate]);

  
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setUser(null);
          } else {
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            axios.get('/api/users/profile')
              .then(res => {
                setUser(res.data);
              })
              .catch(err => {
                console.error('Error loading user', err);
                localStorage.removeItem('token');
                setUser(null);
              });
          }
        } catch (err) {
          console.error('Invalid token', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();

    
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized response detected');
          logout();
        }
        return Promise.reject(error);
      }
    );

    
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

 
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/users/register', formData);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data);
        return { success: true };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Registration failed'
      };
    }
  };

 
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/users/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data);
        return { success: true };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Invalid credentials'
      };
    }
  };

  const updateProfile = async (formData) => {
    try {
      const res = await axios.put(`/api/users/${user._id}`, formData);
      setUser(prevUser => ({ ...prevUser, ...res.data }));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Update failed'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 