import { useState, useEffect } from 'react';
import API from '../services/api';

function Profile() {
    const userRole = localStorage.getItem('userRole');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        education: '',
        hasExperience: false,
        experienceText: '',
        companyName: '',
        companyIndustry: '',
        companyDescription: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await API.get('/users/profile'); 
            setFormData({ 
                name: res.data.name || '',
                phoneNumber: res.data.profileDetails?.phoneNumber || '',
                education: res.data.profileDetails?.education || '',
                hasExperience: res.data.profileDetails?.hasExperience || false,
                experienceText: res.data.profileDetails?.experienceText || '',
                companyName: res.data.profileDetails?.companyName || '',
                companyIndustry: res.data.profileDetails?.companyIndustry || '',
                companyDescription: res.data.profileDetails?.companyDescription || ''
            });
        } catch (error) {
            setMessage({ text: 'Gagal memuat data.', type: 'error' });
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi Mutlak: Nomor Telepon harus mulai dengan + dan diikuti angka
        if (!/^\+[0-9]{8,15}$/.test(formData.phoneNumber)) {
            setMessage({ text: 'GAGAL: Nomor telepon wajib diawali tanda "+" dan hanya berisi angka (contoh: +62812...).', type: 'error' });
            return;
        }

        setIsLoading(true);
        setMessage({ text: '', type: '' });
        try {
            await API.put('/users/profile', formData);
            setMessage({ text: 'Data pribadi berhasil diperbarui.', type: 'success' });
            setIsEditing(false);
            fetchProfile();
            
            // Notifikasi sukses menghilang dalam 3 detik
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 3000);

        } catch (error) {
            setMessage({ text: 'Gagal memperbarui profil.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        fetchProfile();
        setMessage({ text: '', type: '' });
    };

    const checkIncomplete = () => {
        if (!formData.name || !formData.phoneNumber) return true;
        if (userRole === 'seeker' && !formData.education) return true;
        if (userRole === 'employer' && !formData.companyName) return true;
        return false;
    };

    return (
        <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '3rem', backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '2.2rem', color: 'var(--text-main)', fontWeight: '800', margin: 0 }}>Profil Akun Pribadi</h2>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
                        ✏️ Edit Profil
                    </button>
                )}
            </div>
            
            {/* Pembungkus Notifikasi Statis: Mencegah Form Lompat-Lompat */}
            <div style={{ minHeight: '85px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                {message.text ? (
                    <div style={{ padding: '1rem 1.5rem', borderRadius: '12px', fontWeight: '700', backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2', color: message.type === 'success' ? '#065f46' : '#991b1b', border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}` }}>
                        {message.text}
                    </div>
                ) : checkIncomplete() ? (
                    <div style={{ padding: '1rem 1.5rem', borderRadius: '12px', fontWeight: '700', backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' }}>
                        ⚠️ Mohon lengkapi seluruh data profil Anda yang diperlukan (Nama, Nomor Telepon, Pendidikan/Perusahaan) agar kualifikasi Anda optimal.
                    </div>
                ) : null}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Nama Lengkap / Akun</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: isEditing ? 'var(--input-bg)' : 'transparent', color: 'var(--text-main)', cursor: isEditing ? 'text' : 'not-allowed' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Nomor Telepon Kontak</label>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={!isEditing} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: isEditing ? 'var(--input-bg)' : 'transparent', color: 'var(--text-main)', cursor: isEditing ? 'text' : 'not-allowed' }} />
                </div>

                {userRole === 'seeker' && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Pendidikan Terakhir</label>
                            <select name="education" value={formData.education} onChange={handleChange} disabled={!isEditing} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: isEditing ? 'var(--input-bg)' : 'transparent', color: 'var(--text-main)', cursor: isEditing ? 'pointer' : 'not-allowed', appearance: isEditing ? 'auto' : 'none' }}>
                                <option value="">Pilih Jenjang Pendidikan</option>
                                <option value="SMA/SMK Sederajat">SMA/SMK Sederajat</option>
                                <option value="Diploma (D1-D4)">Diploma (D1-D4)</option>
                                <option value="Sarjana (S1)">Sarjana (S1)</option>
                                <option value="Magister (S2)">Magister (S2)</option>
                            </select>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.2rem', backgroundColor: 'var(--bg-nav)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <input type="checkbox" name="hasExperience" checked={formData.hasExperience} onChange={handleChange} id="hasExp" disabled={!isEditing} style={{ width: '20px', height: '20px', accentColor: '#2563eb', cursor: isEditing ? 'pointer' : 'not-allowed' }} />
                            <label htmlFor="hasExp" style={{ fontWeight: '700', color: 'var(--text-main)', cursor: isEditing ? 'pointer' : 'not-allowed' }}>Saya memiliki rekam jejak karir</label>
                        </div>

                        {(formData.hasExperience || !isEditing) && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Detail Pengalaman & Keahlian</label>
                                <textarea name="experienceText" value={formData.experienceText} onChange={handleChange} disabled={!isEditing} rows="5" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: isEditing ? 'var(--input-bg)' : 'transparent', color: 'var(--text-main)', resize: 'vertical', cursor: isEditing ? 'text' : 'not-allowed' }}></textarea>
                            </div>
                        )}
                    </>
                )}

                {userRole === 'employer' && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Nama Entitas Perusahaan</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} disabled={!isEditing} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: isEditing ? 'var(--input-bg)' : 'transparent', color: 'var(--text-main)', cursor: isEditing ? 'text' : 'not-allowed' }} />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Sektor Industri</label>
                            <input type="text" name="companyIndustry" value={formData.companyIndustry} onChange={handleChange} disabled={!isEditing} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: isEditing ? 'var(--input-bg)' : 'transparent', color: 'var(--text-main)', cursor: isEditing ? 'text' : 'not-allowed' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Deskripsi Perusahaan</label>
                            <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} disabled={!isEditing} rows="5" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: isEditing ? 'var(--input-bg)' : 'transparent', color: 'var(--text-main)', cursor: isEditing ? 'text' : 'not-allowed' }}></textarea>
                        </div>
                    </>
                )}

                {isEditing && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" disabled={isLoading} style={{ flex: 1, padding: '1.2rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1.1rem', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}>
                            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                        <button type="button" onClick={handleCancel} style={{ flex: 1, padding: '1.2rem', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer' }}>
                            Batal
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default Profile;