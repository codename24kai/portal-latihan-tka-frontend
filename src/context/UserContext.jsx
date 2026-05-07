import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfilePic, saveProfilePic as storageSaveProfilePic } from '../student/utils/profileStorage';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Budi Kialang',
    school: 'SD Negeri Muncul 02',
    class: 'Kelas 6-A',
    gender: 'Laki-laki',
    nisn: '0012345678',
    profile_pic: null,
    avatarId: 'boy-2'
  });

  // Load profile pic from storage on initialization
  useEffect(() => {
    const loadSavedProfile = async () => {
      try {
        const savedPic = await getProfilePic(currentUser.id);
        if (savedPic) {
          setCurrentUser(prev => ({ ...prev, profile_pic: savedPic }));
        }
      } catch (error) {
        console.error('Failed to load profile pic:', error);
      }
    };
    loadSavedProfile();
  }, [currentUser.id]);

  const updateProfilePic = async (newPicPath) => {
    try {
      // Update state
      setCurrentUser(prev => ({
        ...prev,
        profile_pic: newPicPath
      }));

      // Persist to storage
      await storageSaveProfilePic(currentUser.id, newPicPath);
    } catch (error) {
      console.error('Failed to update profile pic:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    updateProfilePic,
    setCurrentUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
