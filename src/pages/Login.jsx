import { useState } from 'react';
import API from '../services/api';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setError(null);
            const response = await API.post('/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', response.data.role);
            localStorage.setItem('userName', response.data.name);
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || 'Email atau password salah. Silakan periksa kembali.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '460px', margin: '4rem auto', width: '100%', backgroundColor: 'var(--bg-card)', padding: '3.5rem', borderRadius: '24px', boxShadow: '0 20px 25px -5px var(--shadow)', border: '1px solid var(--border)' }}>
            <h2 style={{ color: 'var(--text-main)', margin: '0 0 0.5rem 0', fontSize: '2.2rem', textAlign: 'center', fontWeight: '800', letterSpacing: '-0.02em' }}>Selamat Datang</h2>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 2.5rem 0', fontSize: '1.05rem' }}>Masuk guna mengelola portofolio profesional Anda.</p>
            
            {error && (
                <div style={{ padding: '1rem', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '600' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1.5rem', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '0.95rem' }}>Alamat Email</label>
                    <input type="email" name="email" onChange={handleChange} required style={{ padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '1rem', outline: 'none', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '0.95rem' }}>Kata Sandi</label>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            onChange={handleChange} 
                            required 
                            style={{ width: '100%', padding: '0.9rem 3.5rem 0.9rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '1rem', outline: 'none', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', boxSizing: 'border-box', margin: 0 }} 
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
                                color: 'var(--text-muted)'
                            }}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>
                
                <button type="submit" disabled={isLoading} className="btn-animate" style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)', opacity: isLoading ? 0.7 : 1 }}>
                    {isLoading ? 'Memvalidasi Sesi...' : 'Masuk Ke Akun'}
                </button>
            </form>
        </div>
    );
}

export default Login;