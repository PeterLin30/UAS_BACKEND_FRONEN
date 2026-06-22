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

    const togglePassword = () => {
        setShowPassword(!showPassword);
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
        <div style={{ maxWidth: '460px', margin: '4rem auto', width: '100%', backgroundColor: '#ffffff', padding: '3.5rem', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
            <h2 style={{ color: '#0f172a', margin: '0 0 0.5rem 0', fontSize: '2.2rem', textAlign: 'center', fontWeight: '800', letterSpacing: '-0.02em' }}>Selamat Datang</h2>
            <p style={{ color: '#64748b', textAlign: 'center', margin: '0 0 2.5rem 0', fontSize: '1.05rem' }}>Masuk guna mengelola portofolio profesional Anda.</p>
            
            {error && (
                <div style={{ padding: '1rem', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '600' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1.5rem', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#334155', fontWeight: '700', fontSize: '0.95rem' }}>Alamat Email</label>
                    <input type="email" name="email" placeholder="nama@email.com" onChange={handleChange} required style={{ padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#334155', fontWeight: '700', fontSize: '0.95rem' }}>Kata Sandi</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            placeholder="••••••••" 
                            onChange={handleChange} 
                            required 
                            style={{ width: '100%', padding: '0.9rem 4rem 0.9rem 1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} 
                        />
                        <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                        position: 'absolute', 
                        right: '10px', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                    }}
                >
                    {showPassword ? '🙈' : '👁️'}
                </button>
                    </div>
                </div>
                
                <button type="submit" disabled={isLoading} style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)', opacity: isLoading ? 0.7 : 1 }}>
                    {isLoading ? 'Memvalidasi Sesi...' : 'Masuk Ke Akun'}
                </button>
            </form>
        </div>
    );
}

export default Login;