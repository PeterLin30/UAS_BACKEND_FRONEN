import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

function EditJob() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        salary: '',
        category: '',
        minEducation: '',
        requiresExperience: 'false'
    });
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const initPage = async () => {
            try {
                setIsLoading(true);
                const catRes = await API.get('/admin/categories');
                setCategories(catRes.data);

                const jobRes = await API.get(`/jobs`);
                const specificJob = jobRes.data.find(j => j._id === jobId);
                
                if (specificJob) {
                    setFormData({
                        title: specificJob.title || '',
                        location: specificJob.location || '',
                        salary: specificJob.salary || '',
                        category: specificJob.category || '',
                        minEducation: specificJob.minEducation || '',
                        requiresExperience: String(specificJob.requiresExperience)
                    });
                } else {
                    setMessage({ text: 'Detail lowongan gagal ditarik dari server.', type: 'error' });
                }
            } catch (error) {
                setMessage({ text: 'Gagal memuat konfigurasi komponen.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        initPage();
    }, [jobId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/jobs/${jobId}`, {
                ...formData,
                salary: Number(formData.salary),
                requiresExperience: formData.requiresExperience === 'true'
            });
            navigate('/');
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Gagal menyimpan perubahan.', type: 'error' });
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
                <div style={{ width: '45px', height: '45px', border: '5px solid var(--border)', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%', paddingBottom: '3rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 25px -5px var(--shadow)' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '800' }}>Edit rincian Lowongan</h2>
                <p style={{ margin: '0 0 2rem 0', color: 'var(--text-muted)' }}>Perbarui parameter info penempatan, kategori rumpun, hingga nominal remunerasi kerja.</p>

                {message.text && (
                    <div style={{ padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: '600', backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontWeight: '700' }}>Nama Posisi Jabatan</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ padding: '0.9rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontWeight: '700' }}>Lokasi Penempatan</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} required style={{ padding: '0.9rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontWeight: '700' }}>Nominal Gaji (Rupiah)</label>
                        <input type="number" name="salary" value={formData.salary} onChange={handleChange} required style={{ padding: '0.9rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontWeight: '700' }}>Rumpun Kategori Lowongan</label>
                        <select name="category" value={formData.category} onChange={handleChange} required style={{ padding: '0.9rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none', cursor: 'pointer' }}>
                            <option value="" disabled>Pilih kategori...</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontWeight: '700' }}>Kualifikasi Pendidikan Minimal</label>
                        <select name="minEducation" value={formData.minEducation} onChange={handleChange} required style={{ padding: '0.9rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none', cursor: 'pointer' }}>
                            <option value="" disabled>Pilih tingkat pendidikan...</option>
                            <option value="SMA/SMK Sederajat">SMA/SMK Sederajat</option>
                            <option value="Diploma (D1-D4)">Diploma (D1-D4)</option>
                            <option value="Sarjana (S1)">Sarjana (S1)</option>
                            <option value="Magister (S2)">Magister (S2)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontWeight: '700' }}>Kriteria Pengalaman Kerja</label>
                        <select name="requiresExperience" value={formData.requiresExperience} onChange={handleChange} required style={{ padding: '0.9rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none', cursor: 'pointer' }}>
                            <option value="false">Terbuka untuk Fresh Graduate</option>
                            <option value="true">Wajib Memiliki Pengalaman Kerja</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" className="btn-animate" style={{ flex: 1, padding: '1rem', backgroundColor: '#d97706', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1.05rem' }}>
                            Simpan Perubahan Lowongan
                        </button>
                        <button type="button" onClick={() => navigate('/')} className="btn-animate" style={{ flex: 1, padding: '1rem', backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: '700', fontSize: '1.05rem' }}>
                            Batalkan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditJob;