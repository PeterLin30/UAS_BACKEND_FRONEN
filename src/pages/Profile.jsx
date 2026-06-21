import { useState, useEffect } from 'react';
import API from '../services/api';

function Profile() {
    const userRole = localStorage.getItem('userRole');
    const [formData, setFormData] = useState({
        name: '',
        education: '',
        hasExperience: false,
        experienceText: '',
        companyName: '',
        companyIndustry: '',
        companyDescription: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get('/auth/me'); 
                setFormData({ 
                    name: res.data.name || '',
                    ...res.data.profileDetails 
                });
            } catch (error) {
                setMessage({ text: 'Gagal memuat data.', type: 'error' });
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });
        try {
            await API.put('/users/profile', formData);
            setMessage({ text: 'Data pribadi berhasil diperbarui.', type: 'success' });
        } catch (error) {
            setMessage({ text: 'Gagal memperbarui profil.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '3rem', backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px var(--shadow)' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: '800' }}>Pengaturan Akun Pribadi</h2>
            
            {message.text && (
                <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '12px', backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2', color: message.type === 'success' ? '#065f46' : '#991b1b', fontWeight: '700' }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Nama Lengkap / Entitas</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)' }} />
                </div>

                {userRole === 'seeker' && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Pendidikan Terakhir</label>
                            <input type="text" name="education" value={formData.education} onChange={handleChange} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)' }} />
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.2rem', backgroundColor: 'var(--bg-nav)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <input type="checkbox" name="hasExperience" checked={formData.hasExperience} onChange={handleChange} id="hasExp" style={{ width: '20px', height: '20px', accentColor: '#2563eb' }} />
                            <label htmlFor="hasExp" style={{ fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }}>Saya memiliki rekam jejak karir</label>
                        </div>

                        {formData.hasExperience && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Detail Pengalaman & Keahlian</label>
                                <textarea name="experienceText" value={formData.experienceText} onChange={handleChange} rows="5" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', resize: 'vertical' }}></textarea>
                            </div>
                        )}
                    </>
                )}

                {userRole === 'employer' && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Nama Entitas Perusahaan</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)' }} />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Sektor Industri</label>
                            <input type="text" name="companyIndustry" value={formData.companyIndustry} onChange={handleChange} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Deskripsi Perusahaan</label>
                            <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} rows="5" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)' }}></textarea>
                        </div>
                    </>
                )}

                <button type="submit" disabled={isLoading} className="btn-animate" style={{ padding: '1.2rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1.1rem', cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '1rem', opacity: isLoading ? 0.7 : 1 }}>
                    {isLoading ? 'Menyimpan...' : 'Perbarui Identitas'}
                </button>
            </form>
        </div>
    );
}

export default Profile;