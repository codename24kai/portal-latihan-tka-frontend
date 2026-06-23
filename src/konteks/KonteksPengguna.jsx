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

        // 1. Ekstrak data sesuai struktur Laravel kita (tanpa .data ganda)
        const userDataRaw = response.data.user || response.data;
        const profilRaw = response.data.profil || null;

        // Jika API tidak merespons dengan benar, lemparkan error agar ditangkap catch
        if (!userDataRaw || !userDataRaw.id) {
          throw new Error("Struktur data /auth/me tidak sesuai ekspektasi");
        }

        // 2. Sync local IndexedDB profile pic
        const savedPic = await getProfilePic(userDataRaw.id);

        // 3. Mapping data menggunakan standar yang sama dengan fungsi login
        const restoredUser = {
          id: userDataRaw.id,
          username: userDataRaw.username,
          role: userDataRaw.role,
          status: userDataRaw.status,
          namaLengkap: profilRaw ? profilRaw.nama_lengkap : userDataRaw.username,
          nisn: profilRaw ? profilRaw.nisn : null,
          gender: profilRaw ? profilRaw.gender : null,
          kelas: profilRaw && profilRaw.kelas ? profilRaw.kelas.nama_kelas : '-',
          waliKelas: profilRaw && profilRaw.kelas && profilRaw.kelas.wali_kelas ? profilRaw.kelas.wali_kelas.nama_lengkap : '-',
          detailProfil: profilRaw,
          profile_pic: savedPic || userDataRaw.profile_pic
        };

        setCurrentUser(restoredUser);

      } catch (error) {
        console.error('Failed to restore session:', error);
        // Jika gagal (misal token expired atau server mati), bersihkan memori
        localStorage.removeItem('auth_token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('assignedClass');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (username, password) => {
    try {
      console.log("2. Mengirim request Axios ke backend...");

      const response = await api.post('/auth/login', { username, password });

      console.log("3. Jawaban murni dari backend:", response.data);

      const { token, user, profil } = response.data;

      // PERBAIKAN 1: Samakan dengan nama key di useEffect & logout ('auth_token')
      localStorage.setItem('auth_token', token);

      localStorage.setItem('auth_token', token);
      localStorage.setItem('userRole', user.role);

      if (profil && profil.kelas) {
        localStorage.setItem('assignedClass', profil.kelas.nama_kelas);
      }

      const userData = {
        id: user.id,
        username: user.username,
        role: user.role,
        status: user.status,
        namaLengkap: profil ? profil.nama_lengkap : user.username,
        nisn: profil ? profil.nisn : null,
        gender: profil ? profil.gender : null,
        kelas: profil && profil.kelas ? profil.kelas.nama_kelas : '-',
        waliKelas: profil && profil.kelas && profil.kelas.wali_kelas ? profil.kelas.wali_kelas.nama_lengkap : '-',
        detailProfil: profil
      };

      // PERBAIKAN 2: Gunakan fungsi setter state yang benar
      setCurrentUser(userData);

      return userData;
    } catch (error) {
      console.error("ERROR TERTANGKAP DI KONTEKS:", error);
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
