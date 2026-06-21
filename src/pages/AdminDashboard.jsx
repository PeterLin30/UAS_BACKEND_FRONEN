import { useState, useEffect } from 'react';
import API from '../services/api';

function AdminDashboard() {
    const [stats, setStats] = useState({ seekers: 0, employers: 0, jobs: 0, applications: 0 });
    const [categoryName, setCategoryName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const response = await API.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/categories', { name: categoryName });
            setMessage({ text: 'Kategori master baru sukses didaftarkan ke sistem!', type: 'success' });
            setCategoryName('');
        } catch (error) {
            setMessage({ text: 'Gagal menambahkan data kategori.', type: 'error' });
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '3rem' }}>
            <style>
                {`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .stat-card { transition: transform 0.3s, box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
                .stat-card:hover { transform: translateY(-4px); }
                `}
            </style>

            <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)', padding: '3.5rem 3rem', borderRadius: '24px', boxShadow: '0 10px 20px rgba(67, 56, 202, 0.25)', marginBottom: '3rem', color: 'white' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', fontWeight: '800' }}>Overview Sistem Terpusat</h2>
                <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.85, fontWeight: '300' }}>Panel kendali Super Admin untuk agregasi data dan konfigurasi kluster basis data.</p>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 0' }}>
                    <div style={{ width: '45px', height: '45px', border: '5px solid #e2e8f0', borderTopColor: '#4338ca', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                        <div className="stat-card" style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '20px', borderTop: '6px solid #2563eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '1rem', fontWeight: '700' }}>KANDIDAT AKTIF</h3>
                            <p style={{ fontSize: '3.2rem', fontWeight: '900', margin: 0, color: '#1e293b' }}>{stats.seekers}</p>
                        </div>
                        <div className="stat-card" style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '20px', borderTop: '6px solid #059669', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '1rem', fontWeight: '700' }}>PERUSAHAAN MITRA</h3>
                            <p style={{ fontSize: '3.2rem', fontWeight: '900', margin: 0, color: '#1e293b' }}>{stats.employers}</p>
                        </div>
                        <div className="stat-card" style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '20px', borderTop: '6px solid #d97706', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '1rem', fontWeight: '700' }}>LOWONGAN PUBLIK</h3>
                            <p style={{ fontSize: '3.2rem', fontWeight: '900', margin: 0, color: '#1e293b' }}>{stats.jobs}</p>
                        </div>
                        <div className="stat-card" style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '20px', borderTop: '6px solid #7c3aed', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '1rem', fontWeight: '700' }}>TOTAL LAMARAN</h3>
                            <p style={{ fontSize: '3.2rem', fontWeight: '900', margin: 0, color: '#1e293b' }}>{stats.applications}</p>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', padding: '3rem', borderRadius: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.01)', border: '1px solid #f1f5f9' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.6rem', fontWeight: '800' }}>Manajemen Master Kategori</h3>
                        <p style={{ margin: '0 0 2rem 0', color: '#64748b', fontSize: '1rem' }}>Tambahkan rumpun industri baru guna memetakan klasifikasi karir platform.</p>
                        
                        {message.text && (
                            <div style={{ padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: '600', backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2', color: message.type === 'success' ? '#065f46' : '#991b1b' }}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '1fr' }}>
                            <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required style={{ flex: 1, padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1.05rem', outline: 'none', backgroundColor: '#f8fafc' }} />
                            <button type="submit" style={{ backgroundColor: '#1e1b4b', color: 'white', border: 'none', padding: '0 3rem', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '1.05rem', marginLeft: '1rem' }}>Simpan Master</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;