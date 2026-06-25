import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'seeker' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // --- VALIDASI MUTLAK KATA SANDI ---
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError('Kata sandi terlalu lemah! Wajib minimal 6 karakter, mengandung minimal 1 huruf kapital, dan 1 angka.');
            return; // Hentikan eksekusi pengiriman ke peladen
        }

        try {
            setIsLoading(true);
            setError(null);
            await API.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registrasi gagal. Email mungkin telah terdaftar.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '480px', margin: '2rem auto', width: '100%', backgroundColor: '#ffffff', padding: '3.5rem', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
            <h2 style={{ color: '#0f172a', margin: '0 0 0.5rem 0', fontSize: '2.2rem', textAlign: 'center', fontWeight: '800', letterSpacing: '-0.02em' }}>Registrasi Akun</h2>
            <p style={{ color: '#64748b', textAlign: 'center', margin: '0 0 2.5rem 0', fontSize: '1.05rem' }}>Bergabung dalam ekosistem Smart Economy.</p>
            
            {error && (
                <div style={{ padding: '1rem', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '600' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1.3rem', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ color: '#334155', fontWeight: '700', fontSize: '0.95rem' }}>Nama Lengkap</label>
                    <input type="text" name="name" onChange={handleChange} required style={{ padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ color: '#334155', fontWeight: '700', fontSize: '0.95rem' }}>Alamat Email Aktif</label>
                    <input type="email" name="email" onChange={handleChange} required style={{ padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ color: '#334155', fontWeight: '700', fontSize: '0.95rem' }}>Kata Sandi Keamanan</label>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            onChange={handleChange} 
                            required 
                            style={{ width: '100%', padding: '0.9rem 3.5rem 0.9rem 1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box', margin: 0 }} 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ 
                                position: 'absolute', 
                                right: '15px', 
                                top: '50%', 
                                transform: 'translateY(-50%)', 
                                background: 'transparent', 
                                border: 'none', 
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                                color: '#64748b'
                            }}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ color: '#334155', fontWeight: '700', fontSize: '0.95rem' }}>Klasifikasi Peran Akses</label>
                    <select name="role" onChange={handleChange} style={{ padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
                        <option value="seeker">Pencari Kerja (Kandidat)</option>
                        <option value="employer">Perusahaan (Recruiter / HRD)</option>
                    </select>
                </div>
                
                <button type="submit" disabled={isLoading} style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)', opacity: isLoading ? 0.7 : 1 }}>
                    {isLoading ? 'Memproses Akun Baru...' : 'Daftar Sekarang'}
                </button>
            </form>
        </div>
    );
}

export default Register;