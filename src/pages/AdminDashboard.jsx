import { useState, useEffect } from 'react';
import API from '../services/api';

function AdminDashboard() {
    const [stats, setStats] = useState({ seekers: 0, employers: 0, jobs: 0, applications: 0 });
    const [categoryName, setCategoryName] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const statsResponse = await API.get('/admin/stats');
                setStats(statsResponse.data);
                try {
                    const usersResponse = await API.get('/admin/users');
                    setUsers(usersResponse.data);
                } catch (userError) {}
            } catch (error) {
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '3rem', paddingLeft: '1rem', paddingRight: '1rem', boxSizing: 'border-box' }}>
            <style>
                {`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .stat-card { transition: transform 0.3s; }
                .stat-card:hover { transform: translateY(-4px); }
                .user-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                .user-table th, .user-table td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
                .user-table th { background-color: #f8fafc; color: #64748b; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .user-table tr:hover { background-color: #f8fafc; }
                `}
            </style>

            {/* Header Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
                padding: 'clamp(1.5rem, 4vw, 3.5rem) clamp(1.25rem, 4vw, 3rem)',
                borderRadius: '24px',
                boxShadow: '0 10px 20px rgba(67, 56, 202, 0.25)',
                marginBottom: '2rem',
                color: 'white'
            }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: 'clamp(1.4rem, 4vw, 2.5rem)', fontWeight: '800' }}>Overview Sistem Terpusat</h2>
                <p style={{ margin: 0, fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', opacity: 0.85, fontWeight: '300' }}>
                    Panel kendali Super Admin untuk agregasi data dan konfigurasi kluster basis data.
                </p>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 0' }}>
                    <div style={{ width: '45px', height: '45px', border: '5px solid #e2e8f0', borderTopColor: '#4338ca', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Stat Cards - 2x2 grid di mobile */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                        <div className="stat-card" style={{ backgroundColor: '#ffffff', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '16px', borderTop: '6px solid #2563eb', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.8rem', fontWeight: '700' }}>KANDIDAT AKTIF</h3>
                            <p style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)', fontWeight: '900', margin: 0, color: '#1e293b' }}>{stats.seekers}</p>
                        </div>
                        <div className="stat-card" style={{ backgroundColor: '#ffffff', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '16px', borderTop: '6px solid #059669', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.8rem', fontWeight: '700' }}>PERUSAHAAN MITRA</h3>
                            <p style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)', fontWeight: '900', margin: 0, color: '#1e293b' }}>{stats.employers}</p>
                        </div>
                        <div className="stat-card" style={{ backgroundColor: '#ffffff', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '16px', borderTop: '6px solid #d97706', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.8rem', fontWeight: '700' }}>LOWONGAN PUBLIK</h3>
                            <p style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)', fontWeight: '900', margin: 0, color: '#1e293b' }}>{stats.jobs}</p>
                        </div>
                        <div className="stat-card" style={{ backgroundColor: '#ffffff', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '16px', borderTop: '6px solid #7c3aed', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.8rem', fontWeight: '700' }}>TOTAL LAMARAN</h3>
                            <p style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)', fontWeight: '900', margin: 0, color: '#1e293b' }}>{stats.applications}</p>
                        </div>
                    </div>

                    {/* Manajemen Master Kategori */}
                    <div style={{ backgroundColor: '#ffffff', padding: 'clamp(1.25rem, 4vw, 3rem)', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: '800' }}>Manajemen Master Kategori</h3>
                        <p style={{ margin: '0 0 1.5rem 0', color: '#64748b', fontSize: '1rem' }}>
                            Tambahkan rumpun industri baru guna memetakan klasifikasi karir platform.
                        </p>

                        {message.text && (
                            <div style={{
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                marginBottom: '1.5rem',
                                fontWeight: '600',
                                backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                                color: message.type === 'success' ? '#065f46' : '#991b1b'
                            }}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                                placeholder="Nama kategori industri..."
                                style={{ flex: 1, minWidth: '200px', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}
                            />
                            <button
                                type="submit"
                                style={{ backgroundColor: '#1e1b4b', color: 'white', border: 'none', padding: '0 2rem', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '1rem', whiteSpace: 'nowrap', minHeight: '52px' }}
                            >
                                Simpan Master
                            </button>
                        </form>
                    </div>

                    {/* Pangkalan Data Pengguna */}
                    <div style={{ backgroundColor: '#ffffff', padding: 'clamp(1.25rem, 4vw, 3rem)', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: '800' }}>Pangkalan Data Pengguna</h3>
                        <p style={{ margin: '0 0 1.5rem 0', color: '#64748b', fontSize: '1rem' }}>
                            Daftar seluruh akun kandidat dan perusahaan yang terdaftar dalam ekosistem.
                        </p>

                        {users.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                Belum ada data pengguna atau gagal memuat data.
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="user-table">
                                    <thead>
                                        <tr>
                                            <th>Nama / Identitas</th>
                                            <th>Alamat Email</th>
                                            <th>Peran Akses</th>
                                            <th>Pendidikan / Industri</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user._id}>
                                                <td style={{ fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap' }}>{user.name}</td>
                                                <td style={{ color: '#475569' }}>{user.email}</td>
                                                <td>
                                                    <span style={{
                                                        backgroundColor: user.role === 'employer' ? '#ecfdf5' : user.role === 'admin' ? '#fef2f2' : '#eff6ff',
                                                        color: user.role === 'employer' ? '#059669' : user.role === 'admin' ? '#e11d48' : '#2563eb',
                                                        padding: '0.3rem 0.8rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '700',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {user.role === 'employer' ? 'Perusahaan' : user.role === 'admin' ? 'Admin' : 'Kandidat'}
                                                    </span>
                                                </td>
                                                <td style={{ color: '#475569' }}>{user.profileDetails?.education || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}

export default AdminDashboard;