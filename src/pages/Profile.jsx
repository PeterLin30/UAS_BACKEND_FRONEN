import { useState, useEffect } from 'react';
import API from '../services/api';

function Profile() {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [education, setEducation] = useState('');
    const [hasExperience, setHasExperience] = useState(false);
    const [experienceText, setExperienceText] = useState('');
    
    // --- TAMBAHAN VARIABEL MUTLAK UNTUK PERUSAHAAN ---
    const [companyIndustry, setCompanyIndustry] = useState('');
    const [companyDescription, setCompanyDescription] = useState('');
    
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);

    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/users/profile');
                setName(data.name || '');
                if (data.profileDetails) {
                    setPhoneNumber(data.profileDetails.phoneNumber || '');
                    setEducation(data.profileDetails.education || '');
                    setHasExperience(data.profileDetails.hasExperience || false);
                    setExperienceText(data.profileDetails.experienceText || '');
                    
                    // Tarik data perusahaan dari Back-End
                    setCompanyIndustry(data.profileDetails.companyIndustry || '');
                    setCompanyDescription(data.profileDetails.companyDescription || '');
                }
            } catch (error) {
                setMessage({ text: 'Gagal memuat profil', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        try {
            await API.put('/users/profile', {
                name,
                profileDetails: {
                    phoneNumber,
                    education,
                    hasExperience,
                    experienceText,
                    // Kirim data perusahaan dengan nama variabel yang benar
                    companyIndustry,
                    companyDescription
                }
            });
            setMessage({ text: 'Profil Anda berhasil disinkronisasi ke pangkalan data!', type: 'success' });
            setIsEditing(false);
        } catch (error) {
            setMessage({ text: 'Gagal menyimpan pembaruan profil.', type: 'error' });
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
                <div style={{ width: '50px', height: '50px', border: '5px solid var(--border)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
                <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Menarik data identitas...</p>
            </div>
        );
    }

    const isProfileIncomplete = userRole === 'seeker' 
        ? (!name || !phoneNumber || !education)
        : (!name || !phoneNumber || !companyIndustry);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', paddingBottom: '3rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 25px -5px var(--shadow)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>Profil {userRole === 'employer' ? 'Perusahaan' : 'Profesional'}</h2>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="btn-animate" style={{ padding: '0.8rem 1.5rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700' }}>
                            Edit Profil
                        </button>
                    )}
                </div>

                {message.text && (
                    <div style={{ padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: '700', backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2', color: message.type === 'success' ? '#065f46' : '#991b1b', border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}` }}>
                        {message.text}
                    </div>
                )}

                {isProfileIncomplete && !isEditing && !message.text && (
                    <div style={{ padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', fontWeight: '700' }}>
                        ⚠️ Mohon lengkapi profil Anda agar sistem dapat memproses akun Anda secara optimal.
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Nama Lengkap / Identitas Akun</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            disabled={!isEditing}
                            required
                            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: isEditing ? 'var(--input-bg)' : 'transparent', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Nomor Telepon Kontak</label>
                        <input 
                            type="text" 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                            disabled={!isEditing}
                            required
                            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: isEditing ? 'var(--input-bg)' : 'transparent', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>

                    {userRole === 'seeker' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Pendidikan Terakhir</label>
                            <select 
                                value={education} 
                                onChange={(e) => setEducation(e.target.value)} 
                                disabled={!isEditing}
                                required
                                style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: isEditing ? 'var(--input-bg)' : 'transparent', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', cursor: isEditing ? 'pointer' : 'default', appearance: isEditing ? 'auto' : 'none' }}
                            >
                                <option value="" disabled>Pilih tingkat pendidikan...</option>
                                <option value="SMA/SMK Sederajat">SMA/SMK Sederajat</option>
                                <option value="Diploma (D1-D4)">Diploma (D1-D4)</option>
                                <option value="Sarjana (S1)">Sarjana (S1)</option>
                                <option value="Magister (S2)">Magister (S2)</option>
                                <option value="Doktor (S3)">Doktor (S3)</option>
                            </select>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Sektor Industri</label>
                            <input 
                                type="text" 
                                value={companyIndustry} // SUDAH DIPISAHKAN
                                onChange={(e) => setCompanyIndustry(e.target.value)} 
                                disabled={!isEditing}
                                required
                                style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: isEditing ? 'var(--input-bg)' : 'transparent', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>
                    )}

                    {userRole === 'seeker' && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: '12px', marginTop: '0.5rem' }}>
                                <input 
                                    type="checkbox" 
                                    checked={hasExperience} 
                                    onChange={(e) => setHasExperience(e.target.checked)} 
                                    disabled={!isEditing}
                                    id="experience-check"
                                    style={{ width: '22px', height: '22px', cursor: isEditing ? 'pointer' : 'default', accentColor: '#3b82f6', flexShrink: 0 }}
                                />
                                <label htmlFor="experience-check" style={{ fontWeight: '700', color: 'var(--text-main)', cursor: isEditing ? 'pointer' : 'default', lineHeight: '1.4', fontSize: '0.95rem', margin: 0 }}>
                                    Saya memiliki rekam jejak karir profesional sebelumnya
                                </label>
                            </div>

                            {hasExperience && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', animation: 'fadeIn 0.4s ease' }}>
                                    <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Detail Pengalaman & Keahlian Khusus</label>
                                    <textarea 
                                        value={experienceText} 
                                        onChange={(e) => setExperienceText(e.target.value)} 
                                        disabled={!isEditing}
                                        rows="5"
                                        required={hasExperience}
                                        style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: isEditing ? 'var(--input-bg)' : 'transparent', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', resize: 'vertical' }}
                                    ></textarea>
                                </div>
                            )}
                        </>
                    )}

                    {userRole === 'employer' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Deskripsi Perusahaan</label>
                            <textarea 
                                value={companyDescription} // SUDAH DIPISAHKAN
                                onChange={(e) => setCompanyDescription(e.target.value)} 
                                disabled={!isEditing}
                                rows="5"
                                required
                                style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: isEditing ? 'var(--input-bg)' : 'transparent', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', resize: 'vertical' }}
                            ></textarea>
                        </div>
                    )}

                    {isEditing && (
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                            <button type="submit" className="btn-animate" style={{ flex: 1, padding: '1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1.05rem' }}>
                                Simpan Perubahan Mutlak
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn-animate" style={{ flex: 1, padding: '1rem', backgroundColor: 'var(--bg-nav)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: '800', fontSize: '1.05rem' }}>
                                Batalkan
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Profile;