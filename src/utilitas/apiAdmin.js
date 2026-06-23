import api from '@/utilitas/api';

export const getProfilAdmin = async () => {
    const response = await api.get('/admin/profil');
    return response.data.data;
};

export const updateProfilAdmin = async (data) => {
    const response = await api.put('/admin/profil', data);
    return response.data;
};

export const getProfilPenggunaAdmin = async () => {
    const response = await api.get('/admin/profil');
    return response.data.data;
};

export const getDaftarSesiLatihanAdmin = async (params = {}) => {
    const response = await api.get('/admin/sesi-latihan', { params });
    return response.data;
};

export const getDetailSesiLatihanAdmin = async (id) => {
    const response = await api.get(`/admin/sesi-latihan/${id}`);
    return response.data.data;
};

export const tambahSesiLatihanAdmin = async (data) => {
    const response = await api.post('/admin/sesi-latihan', data);
    return response.data;
};

export const updateSesiLatihanAdmin = async (id, data) => {
    const response = await api.put(`/admin/sesi-latihan/${id}`, data);
    return response.data;
};

export const hapusSesiLatihanAdmin = async (id) => {
    const response = await api.delete(`/admin/sesi-latihan/${id}`);
    return response.data;
};

export const importPenggunaCsvAdmin = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/pengguna/import-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const previewSoalPdfAdmin = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/soal/import-pdf/preview', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const createPenggunaAdmin = async (data) => {
    const response = await api.post('/admin/pengguna', data);
    return response.data;
};

export const updatePenggunaAdmin = async (id, data) => {
    const response = await api.put(`/admin/pengguna/${id}`, data);
    return response.data;
};

export const getPenggunaAdmin = async (id) => {
    const response = await api.get(`/admin/pengguna/${id}`);
    return response.data.data;
};

export const createSoalAdmin = async (data) => {
    const response = await api.post('/soal', data);
    return response.data;
};
