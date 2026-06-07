import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfilePic, saveProfilePic as storageSaveProfilePic } from '@/siswa/utilitas/penyimpananProfil';
import api from '@/utilitas/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        const user = response.data.data;
        
        // Sync local IndexedDB profile pic if any, otherwise keep what API returns
        const savedPic = await getProfilePic(user.id);
        
        setCurrentUser({
          ...user,
          profile_pic: savedPic || user.profile_pic
        });
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('assignedClass');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('userRole', user.role);
      
      if (user.class) {
        localStorage.setItem('assignedClass', user.class);
      } else {
        localStorage.removeItem('assignedClass');
      }

      // Check IndexedDB profile picture
      const savedPic = await getProfilePic(user.id);
      const userWithPic = {
        ...user,
        profile_pic: savedPic || user.profile_pic
      };

      setCurrentUser(userWithPic);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Failed to contact logout API, clearing state locally');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('assignedClass');
      setCurrentUser(null);
    }
  };

  const updateProfilePic = async (newPicPath) => {
    if (!currentUser) return;
    try {
      // Update state
      setCurrentUser(prev => ({
        ...prev,
        profile_pic: newPicPath
      }));

      // Update backend
      await api.put('/auth/profile', { profile_pic: newPicPath });

      // Persist to IndexedDB storage
      await storageSaveProfilePic(currentUser.id, newPicPath);
    } catch (error) {
      console.error('Failed to update profile pic:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    updateProfilePic,
    setCurrentUser
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};
