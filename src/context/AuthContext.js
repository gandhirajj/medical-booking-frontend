import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

// Using centralized api client with baseURL configured

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Validate user data structure
          if (userData && typeof userData === 'object' && userData._id) {
            // Ensure all fields are properly typed
            const validatedUser = {
              _id: String(userData._id),
              name: String(userData.name || ''),
              email: String(userData.email || ''),
              role: String(userData.role || 'patient'),
              phone: userData.phone ? String(userData.phone) : '',
              address: userData.address ? String(userData.address) : '',
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt
            };
            
            setUser(validatedUser);
            setIsAuthenticated(true);
            console.log('User loaded from storage:', validatedUser.name);
          } else {
            console.warn('Invalid user data in localStorage, clearing...');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem('user');
      }
      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Registering user:', { ...userData, password: '[HIDDEN]' });
      
      const res = await api.post('/api/auth/register', userData);
      
      console.log('Registration response:', res.data);
      
      if (res.data.success) {
        const userData = res.data.data;
        
        // Ensure consistent data structure
        const validatedUser = {
          _id: String(userData._id),
          name: String(userData.name || ''),
          email: String(userData.email || ''),
          role: String(userData.role || 'patient'),
          phone: userData.phone ? String(userData.phone) : '',
          address: userData.address ? String(userData.address) : '',
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt
        };
        
        setUser(validatedUser);
        setIsAuthenticated(true);
        
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(validatedUser));
        
        setLoading(false);
        toast.success('Registration successful!');
        return true;
      } else {
        setError(res.data.message || 'Registration failed');
        toast.error(res.data.message || 'Registration failed');
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Logging in user:', email);
      
      const res = await api.post('/api/auth/login', { email, password });
      
      console.log('Login response:', res.data);
      
      if (res.data.success) {
        const userData = res.data.data;
        
        // Ensure consistent data structure
        const validatedUser = {
          _id: String(userData._id),
          name: String(userData.name || ''),
          email: String(userData.email || ''),
          role: String(userData.role || 'patient'),
          phone: userData.phone ? String(userData.phone) : '',
          address: userData.address ? String(userData.address) : '',
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt
        };
        
        setUser(validatedUser);
        setIsAuthenticated(true);
        
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(validatedUser));
        
        setLoading(false);
        toast.success('Login successful!');
        return true;
      } else {
        setError(res.data.message || 'Login failed');
        toast.error(res.data.message || 'Login failed');
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Invalid credentials';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return false;
    }
  };

  // Admin login with hardcoded credentials
  const adminLogin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Admin login attempt:', email);
      
      // Hardcoded admin credentials
      const adminEmail = 'aihospital@gmail.com';
      const adminPassword = 'ai12345@123';
      
      if (email === adminEmail && password === adminPassword) {
        const adminUser = {
          _id: 'admin-001',
          name: 'Hospital Admin',
          email: adminEmail,
          role: 'admin',
          phone: '',
          address: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setUser(adminUser);
        setIsAuthenticated(true);
        
        // Store admin user in localStorage
        localStorage.setItem('user', JSON.stringify(adminUser));
        
        setLoading(false);
        toast.success('Admin login successful!');
        return true;
      } else {
        setError('Invalid admin credentials');
        toast.error('Invalid admin credentials');
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Admin login failed');
      toast.error('Admin login failed');
      setLoading(false);
      return false;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await api.get('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    // Clear user from state and localStorage
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem('user');
    
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
