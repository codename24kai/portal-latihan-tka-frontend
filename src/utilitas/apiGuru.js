import api from './api';

export const getDashboardGuru = async () => {
    const response = await api.get('/guru/dashboard');
    return response.data.data;
};

export const getProfilGuru = async () => {
    const response = await api.get('/guru/profil');
    return response.data.data;
};

export const updateProfilGuru = async (data) => {
    const response = await api.put('/guru/profil', data);
    return response.data;
};

export const getDaftarSiswaGuru = async () => {
    const response = await api.get('/guru/siswa');
    return response.data.data;
};

export const getDaftarAgendaGuru = async () => {
    const response = await api.get('/guru/sesi-latihan');
    return response.data.data;
};

export const tambahAgendaGuru = async (data) => {
    const response = await api.post('/guru/sesi-latihan', data);
    return response.data;
};

export const hapusAgendaGuru = async (id) => {
    const response = await api.delete(`/guru/sesi-latihan/${id}`);
    return response.data;
};

export const getLaporanNilaiGuru = async () => {
    const response = await api.get('/guru/laporan/nilai');
    return response.data.data;
};

export const exportLaporanGuru = async () => {
    const response = await api.get('/guru/laporan/export');
    return response.data;
};

export const getDaftarModulGuru = async () => {
    const response = await api.get('/guru/modul');
    return response.data.data;
};

export const tambahModulGuru = async (data) => {
    const response = await api.post('/guru/modul', data);
    return response.data;
};

export const uploadCoverModulGuru = async (id, file) => {
    const formData = new FormData();
    formData.append('cover', file);
    const response = await api.post(`/guru/modul/${id}/cover`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const tambahMateriModulGuru = async (id, data) => {
    const response = await api.post(`/guru/modul/${id}/materi`, data);
    return response.data;
};

export const getDaftarKuisGuru = async () => {
    const response = await api.get('/guru/kuis');
    return response.data.data;
};

export const tambahKuisGuru = async (data) => {
    const response = await api.post('/guru/kuis', data);
    return response.data;
};

export const tambahSoalKuisGuru = async (id, data) => {
    const response = await api.post(`/guru/kuis/${id}/soal`, data);
    return response.data;
};

export const broadcastPesanGuru = async (data) => {
    const response = await api.post('/pesan/broadcast', data);
    return response.data;
};

export const getInboxGuru = async () => {
    const response = await api.get('/guru/pesan');
    return response.data.data;
};

export const getDaftarSesiLatihanGuru = async () => {
    const response = await api.get('/guru/sesi-latihan');
    return response.data.data;
};

export const tambahSesiLatihanGuru = async (data) => {
    const response = await api.post('/guru/sesi-latihan', data);
    return response.data;
};

export const updateSesiLatihanGuru = async (id, data) => {
    const response = await api.put(`/guru/sesi-latihan/${id}`, data);
    return response.data;
};

export const hapusSesiLatihanGuru = async (id) => {
    const response = await api.delete(`/guru/sesi-latihan/${id}`);
    return response.data;
};
