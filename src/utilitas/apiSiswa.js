import api from '@/utilitas/api';

export const getDashboardData = async () => {
    try {
        const response = await api.get('/siswa/dashboard');
        const data = response.data.data;
        const sesiLatihanTerdekat = data.sesi_latihan_terdekat || data.simulasi_terdekat;
        return {
            statistik: {
                totalSesiLatihan: data.total_sesi_latihan ?? data.total_simulasi,
                totalSimulasi: data.total_sesi_latihan ?? data.total_simulasi,
                rataRataNilai: data.rata_rata_nilai,
                modulSelesai: data.modul_selesai
            },
            sesiLatihanTerdekat: sesiLatihanTerdekat ? {
                id: sesiLatihanTerdekat.id_sesi_latihan ?? sesiLatihanTerdekat.id_simulasi,
                judul: sesiLatihanTerdekat.judul_sesi_latihan ?? sesiLatihanTerdekat.judul_simulasi,
                waktuMulai: sesiLatihanTerdekat.waktu_mulai,
                status: sesiLatihanTerdekat.status
            } : null,
            simulasiTerdekat: sesiLatihanTerdekat ? {
                id: sesiLatihanTerdekat.id_sesi_latihan ?? sesiLatihanTerdekat.id_simulasi,
                judul: sesiLatihanTerdekat.judul_sesi_latihan ?? sesiLatihanTerdekat.judul_simulasi,
                waktuMulai: sesiLatihanTerdekat.waktu_mulai,
                status: sesiLatihanTerdekat.status
            } : null,
            progressLatihan: data.progress_latihan || []
        };
    } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
        throw error;
    }
};

export const getDaftarSimulasi = async () => {
    try {
        const response = await api.get('/siswa/sesi-latihan');
        return response.data.data.map(item => ({
            id: item.id_sesi_latihan ?? item.id_simulasi,
            judul: item.judul_sesi_latihan ?? item.judul_simulasi,
            waktuMulai: item.waktu_mulai,
            waktuSelesai: item.waktu_selesai,
            durasi: item.durasi_menit,
            status: item.status,
            resource: item.resource,
            id_sesi_latihan: item.id_sesi_latihan ?? item.id_simulasi,
            judul_sesi_latihan: item.judul_sesi_latihan ?? item.judul_simulasi
        }));
    } catch (error) {
        console.error("Gagal mengambil daftar simulasi:", error);
        throw error;
    }
};

export const getDetailSimulasi = async (id) => {
    try {
        const response = await api.get(`/siswa/sesi-latihan/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Gagal mengambil detail simulasi:", error);
        throw error;
    }
};

export const getHasilSimulasi = async (riwayatId) => {
    try {
        const response = await api.get(`/siswa/sesi-latihan/${riwayatId}/hasil`);
        return response.data.data;
    } catch (error) {
        console.error("Gagal mengambil hasil simulasi:", error);
        throw error;
    }
};

export const getDaftarLatihan = async () => {
    try {
        const response = await api.get('/siswa/latihan');
        return response.data.data.map(latihan => ({
            id: latihan.id_latihan,
            judul: latihan.judul_latihan,
            mataPelajaran: latihan.mata_pelajaran,
            durasiMenit: latihan.durasi_menit,
            jumlahSoal: latihan.jumlah_soal,
            status: latihan.status,
            skorTerakhir: latihan.skor_terakhir
        }));
    } catch (error) {
        console.error("Gagal memuat daftar latihan:", error);
        throw error;
    }
};

export const getDetailLatihan = async (id) => {
    try {
        const response = await api.get(`/siswa/latihan/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Gagal mengambil detail latihan:", error);
        throw error;
    }
};

export const getHasilLatihan = async (riwayatId) => {
    try {
        const response = await api.get(`/siswa/latihan/${riwayatId}/hasil`);
        return response.data.data;
    } catch (error) {
        console.error("Gagal mengambil hasil latihan:", error);
        throw error;
    }
};

export const getDetailSurvei = async (idSurvei) => {
    try {
        const response = await api.get(`/siswa/survei/${idSurvei}`);
        const data = response.data.data;
        return {
            id: data.id_survei,
            title: data.judul_survei,
            description: data.deskripsi_survei,
            type: data.jenis,
            questions: data.pertanyaan ? data.pertanyaan.map(q => ({
                id: q.id_pertanyaan,
                text: q.teks_pertanyaan,
                type: q.jenis_pertanyaan,
                options: q.opsi ? q.opsi.map(o => ({
                    id: o.id_opsi_survei,
                    text: o.teks_opsi
                })) : []
            })) : []
        };
    } catch (error) {
        console.error("Gagal mengambil detail survei:", error);
        throw error;
    }
};

export const submitJawabanSurvei = async (idSurvei, jawaban) => {
    try {
        const response = await api.post(`/siswa/survei/${idSurvei}/submit`, { jawaban });
        return response.data;
    } catch (error) {
        console.error("Gagal mengirimkan jawaban survei:", error);
        throw error;
    }
};

export const getDaftarModul = async () => {
    try {
        const response = await api.get('/siswa/modul');
        return response.data.data.map(modul => ({
            id: modul.id_modul,
            judul: modul.judul_modul,
            mataPelajaran: modul.mata_pelajaran,
            deskripsi: modul.deskripsi || 'Deskripsi modul belum tersedia.',
            gambarCover: modul.gambar_cover || '/assets/hero/math-background-hero-3.jpg',
            totalMateri: modul.total_materi || 0,
            progress: modul.progress_siswa || 0,
            status: modul.status || 'tersedia'
        }));
    } catch (error) {
        console.error("Gagal memuat daftar modul:", error);
        throw error;
    }
};

export const getDetailMateri = async (modulId, materiId) => {
    try {
        const response = await api.get(`/siswa/modul/${modulId}/materi/${materiId}`);
        return response.data.data;
    } catch (error) {
        console.error("Gagal mengambil detail materi:", error);
        throw error;
    }
};

export const selesaiMateri = async (modulId, materiId) => {
    try {
        const response = await api.post(`/siswa/modul/${modulId}/materi/${materiId}/selesai`);
        return response.data;
    } catch (error) {
        console.error("Gagal mengirim status selesai materi:", error);
        throw error;
    }
};

export const updateProfilSiswa = async (data) => {
    try {
        const response = await api.put('/siswa/profil', data);
        return response.data;
    } catch (error) {
        console.error("Gagal update profil:", error);
        throw error;
    }
};

export const getProfilSiswa = async () => {
    try {
        const response = await api.get('/siswa/profil');
        const data = response.data.data;
        return {
            ...data,
            class: data.kelas?.nama_kelas ?? '-',
            wali_kelas: data.kelas?.wali_kelas ?? null,
            school: data.school ?? 'Portal Latihan TKA',
        };
    } catch (error) {
        console.error("Gagal mengambil profil siswa:", error);
        throw error;
    }
};

export const gantiPasswordSiswa = async (data) => {
    try {
        const response = await api.post('/siswa/ganti-password', data);
        return response.data;
    } catch (error) {
        console.error("Gagal ganti password:", error);
        throw error;
    }
};

export const getDaftarSesiLatihan = async () => {
    try {
        const response = await api.get('/siswa/sesi-latihan');
        return response.data.data.map(item => ({
            id: item.id_sesi_latihan ?? item.id_simulasi,
            judul: item.judul_sesi_latihan ?? item.judul_simulasi,
            waktuMulai: item.waktu_mulai,
            waktuSelesai: item.waktu_selesai,
            durasi: item.durasi_menit,
            status: item.status,
            resource: item.resource
        }));
    } catch (error) {
        console.error("Gagal mengambil daftar sesi latihan:", error);
        throw error;
    }
};

export const getDetailSesiLatihan = async (id) => {
    try {
        const response = await api.get(`/siswa/sesi-latihan/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Gagal mengambil detail sesi latihan:", error);
        throw error;
    }
};

export const getHasilSesiLatihan = async (riwayatId) => {
    try {
        const response = await api.get(`/siswa/sesi-latihan/${riwayatId}/hasil`);
        return response.data.data;
    } catch (error) {
        console.error("Gagal mengambil hasil sesi latihan:", error);
        throw error;
    }
};

export const mulaiSesiLatihan = async (tipeLatihan) => {
    try {
        const response = await api.post('/siswa/sesi-latihan/mulai', { tipe_latihan: tipeLatihan });
        return response.data;
    } catch (error) {
        console.error("Gagal memulai sesi latihan:", error);
        throw error;
    }
};

export const simpanJawabanSesiLatihan = async (riwayatId, soalId, opsiId) => {
    try {
        const response = await api.post(`/siswa/sesi-latihan/${riwayatId}/jawab`, {
            soal_id: soalId,
            opsi_id: opsiId
        });
        return response.data;
    } catch (error) {
        console.error("Gagal menyimpan jawaban sesi latihan:", error);
        throw error;
    }
};

export const submitSesiLatihan = async (sesiId, riwayatId) => {
    try {
        const response = await api.post('/siswa/sesi-latihan/submit', {
            sesi_id: sesiId,
            riwayat_id: riwayatId
        });
        return response.data;
    } catch (error) {
        console.error("Gagal submit sesi latihan:", error);
        throw error;
    }
};

export const kirimPesanBantuan = async (data) => {
    try {
        const response = await api.post('/siswa/pesan/kirim', data);
        return response.data;
    } catch (error) {
        console.error("Gagal kirim pesan:", error);
        throw error;
    }
};
