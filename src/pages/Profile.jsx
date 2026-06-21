import { useState, useEffect } from 'react';
import API from '../services/api';

function Profile() {
    const userRole = localStorage.getItem('userRole');
    const [formData, setFormData] = useState({
        education: '',
        hasExperience: false,
        experienceText: '',
        companyName: '',
        companyIndustry: '',
        companyDescription: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get('/auth/me'); 
                if (res.data.profileDetails) {
                    setFormData({ ...formData, ...res.data.profileDetails });
                }
            } catch (error) {
                console.error("Gagal memuat profil");
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
        setMessage('');
        try {
            await API.put('/users/profile', formData);
            setMessage('Profil berhasil diperbarui secara mutlak.');
        } catch (error) {
            setMessage('Gagal memperbarui profil.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#0f172a' }}>Pengaturan Profil</h2>
            
            {message && (
                <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', backgroundColor: message.includes('berhasil') ? '#dcfce7' : '#fef2f2', color: message.includes('berhasil') ? '#166534' : '#991b1b', fontWeight: 'bold' }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {userRole === 'seeker' && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: 'bold', color: '#334155' }}>Pendidikan Terakhir</label>
                            <input type="text" name="education" value={formData.education} onChange={handleChange} placeholder="Contoh: S1 Teknik Informatika" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <input type="checkbox" name="hasExperience" checked={formData.hasExperience} onChange={handleChange} id="hasExp" style={{ width: '20px', height: '20px' }} />
                            <label htmlFor="hasExp" style={{ fontWeight: 'bold', color: '#334155', cursor: 'pointer' }}>Saya memiliki pengalaman kerja</label>
                        </div>

                        {formData.hasExperience && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontWeight: 'bold', color: '#334155' }}>Detail Pengalaman</label>
                                <textarea name="experienceText" value={formData.experienceText} onChange={handleChange} placeholder="Jelaskan pengalaman kerja Anda..." rows="4" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}></textarea>
                            </div>
                        )}
                    </>
                )}

                {userRole === 'employer' && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: 'bold', color: '#334155' }}>Nama Entitas Perusahaan</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: 'bold', color: '#334155' }}>Sektor Industri</label>
                            <input type="text" name="companyIndustry" value={formData.companyIndustry} onChange={handleChange} placeholder="Contoh: Teknologi Finansial" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: 'bold', color: '#334155' }}>Deskripsi Perusahaan</label>
                            <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} rows="5" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}></textarea>
                        </div>
                    </>
                )}

                <button type="submit" disabled={isLoading} style={{ padding: '1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '1rem' }}>
                    {isLoading ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
            </form>
        </div>
    );
}

export default Profile;