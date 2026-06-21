import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function CreateJob() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: 'Medan, Sumatera Utara',
        salary: '',
        category: '',
        minEducation: 'Tidak Ada Syarat Minimal',
        requiresExperience: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await API.get('/admin/categories');
                setCategories(res.data);
                if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, category: res.data[0].name }));
                }
            } catch (err) {
                setError('Gagal memuat daftar kategori.');
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await API.post('/jobs', formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat lowongan pekerjaan.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#0f172a' }}>Buat Lowongan Pekerjaan Baru</h2>
            
            {error && (
                <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold', color: '#334155' }}>Judul Posisi</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>

                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>Bidang Kategori</label>
                        <select name="category" value={formData.category} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>Lokasi Kerja</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>Minimal Pendidikan</label>
                        <select name="minEducation" value={formData.minEducation} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                            <option value="Tidak Ada Syarat Minimal">Tidak Ada Syarat Minimal</option>
                            <option value="SMA/SMK Sederajat">SMA/SMK Sederajat</option>
                            <option value="Diploma (D1-D4)">Diploma (D1-D4)</option>
                            <option value="Sarjana (S1)">Sarjana (S1)</option>
                            <option value="Magister (S2)">Magister (S2)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>Gaji (Opsional)</label>
                        <input type="number" name="salary" value={formData.salary} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <input type="checkbox" name="requiresExperience" checked={formData.requiresExperience} onChange={handleChange} id="expCheck" style={{ width: '20px', height: '20px' }} />
                    <label htmlFor="expCheck" style={{ fontWeight: 'bold', color: '#334155', cursor: 'pointer' }}>Kandidat wajib memiliki pengalaman kerja sebelumnya</label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold', color: '#334155' }}>Deskripsi Lengkap</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows="6" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}></textarea>
                </div>

                <button type="submit" disabled={isLoading} style={{ padding: '1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, marginTop: '1rem' }}>
                    {isLoading ? 'Menyimpan Lowongan...' : 'Publikasikan Lowongan'}
                </button>
            </form>
        </div>
    );
}

export default CreateJob;