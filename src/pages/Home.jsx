import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Home() {
    const [jobs, setJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    let currentUserId = null;
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUserId = payload.id || payload.userId || payload._id; 
        } catch (err) {}
    }

    const fetchJobs = useCallback(async (filters = {}) => {
        try {
            setIsLoading(true);
            setError(null);
            const params = new URLSearchParams();
            if (filters.keyword) params.append('keyword', filters.keyword);
            if (filters.location) params.append('location', filters.location);
            
            const response = await API.get(`/jobs?${params.toString()}`);
            setJobs(response.data);
        } catch (err) {
            setError('Gagal memuat daftar lowongan pekerjaan ter-update.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const response = await API.get('/applications/my-applications');
                const ids = response.data.map(app => app.jobId?._id || app.jobId);
                setAppliedJobIds(ids);
            } catch (err) {}
        };

        if (userRole === 'seeker') {
            fetchAppliedJobs();
        }
    }, [userRole]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchJobs({ keyword: searchKeyword, location: searchLocation });
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchKeyword, searchLocation, fetchJobs]);

    let renderContent;
    if (isLoading) {
        renderContent = (
            <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0' }}>
                <div style={{ width: '50px', height: '50px', border: '5px solid var(--border)', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.2rem' }}></div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600', animation: 'pulse 2s infinite' }}>Sinkronisasi data lowongan...</p>
            </div>
        );
    } else if (error) {
        renderContent = (
            <div style={{ gridColumn: '1/-1', backgroundColor: '#fef2f2', borderLeft: '6px solid #ef4444', padding: '2rem', borderRadius: '16px', color: '#991b1b', fontWeight: '600' }}>
                {error}
            </div>
        );
    } else if (jobs.length === 0) {
        renderContent = (
            <div style={{ gridColumn: '1/-1', backgroundColor: 'var(--bg-card)', padding: '5rem 2rem', borderRadius: '24px', textAlign: 'center', border: '1px dashed var(--border)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', margin: 0 }}>Tidak ditemukan posisi pekerjaan yang sesuai dengan kriteria pencarian Anda.</p>
            </div>
        );
    } else {
        renderContent = jobs.map((job) => {
            const isMyJob = job.employerId?._id === currentUserId || job.employerId === currentUserId;
            const hasApplied = appliedJobIds.includes(job._id);
            const daysLeft = Math.ceil((new Date(job.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));

            return (
                <div key={job._id} className="hover-card" style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem', borderRadius: '24px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.8rem 0', color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{job.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '700' }}>{job.jobType}</span>
                            <span style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-muted)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid var(--border)' }}>📍 {job.location}</span>
                            {daysLeft > 0 && (
                                <span style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '700' }}>Sisa {daysLeft} Hari</span>
                            )}
                        </div>
                        <p style={{ margin: '0 0 0.8rem 0', color: 'var(--text-muted)', fontSize: '1.1rem' }}>🏢 <strong>{job.employerId?.name || 'Perusahaan Mitra'}</strong></p>
                        <p style={{ margin: '0 0 2rem 0', color: '#10b981', fontSize: '1.3rem', fontWeight: '800' }}>Rp {job.salary?.toLocaleString('id-ID')}</p>
                    </div>
                    
                    {userRole === 'employer' ? (
                        isMyJob ? (
                            <button onClick={() => navigate(`/manage-applicants/${job._id}`)} className="btn-animate" style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: '700', fontSize: '1rem' }}>Manajemen Pelamar</button>
                        ) : (
                            <button disabled style={{ backgroundColor: 'var(--border)', color: 'var(--text-muted)', border: 'none', padding: '1rem', borderRadius: '12px', width: '100%', fontWeight: '700', fontSize: '1rem', cursor: 'not-allowed' }}>Milik Perusahaan Lain</button>
                        )
                    ) : userRole === 'admin' ? (
                        <button disabled style={{ backgroundColor: 'var(--border)', color: 'var(--text-muted)', border: 'none', padding: '1rem', borderRadius: '12px', width: '100%', fontWeight: '700', fontSize: '1rem', cursor: 'not-allowed' }}>Lowongan Aktif</button>
                    ) : userRole === 'seeker' ? (
                        hasApplied ? (
                            <button disabled style={{ backgroundColor: '#d1fae5', color: '#065f46', border: 'none', padding: '1rem', borderRadius: '12px', width: '100%', fontWeight: '700', fontSize: '1rem', cursor: 'not-allowed' }}>Sudah Dilamar</button>
                        ) : (
                            <button onClick={() => navigate(`/apply/${job._id}`)} className="btn-animate" style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: '700', fontSize: '1rem' }}>Lamar Sekarang</button>
                        )
                    ) : (
                        <button onClick={() => navigate('/login')} className="btn-animate" style={{ backgroundColor: '#475569', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: '700', fontSize: '1rem' }}>Login untuk Melamar</button>
                    )}
                </div>
            );
        });
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '3rem' }}>
            <style>
                {`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
                .hover-card {
                    background-color: var(--bg-card) !important;
                    border: 1px solid var(--border) !important;
                    box-shadow: 0 4px 6px var(--shadow) !important;
                    transition: transform 0.3s, box-shadow 0.3s;
                }
                .hover-card:hover { 
                    transform: translateY(-6px); 
                    box-shadow: 0 20px 25px -5px var(--shadow) !important; 
                }
                .search-focus:focus { 
                    border-color: #2563eb !important; 
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); 
                }
                `}
            </style>

            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)', padding: '4.5rem 3rem', borderRadius: '24px', boxShadow: '0 12px 30px rgba(30, 64, 175, 0.25)', marginBottom: '3rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
                    <h1 style={{ margin: '0 0 0.8rem 0', fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>Eksplorasi Karir Masa Depan</h1>
                    <p style={{ margin: '0 0 2.5rem 0', fontSize: '1.2rem', opacity: 0.85, fontWeight: '300', lineHeight: '1.6', color: '#ffffff' }}>Temukan posisi strategis di berbagai industri terkemuka dengan ekosistem pencarian terintegrasi.</p>
                    
                    <div style={{ display: 'flex', gap: '0.8rem', backgroundColor: 'var(--bg-nav)', padding: '0.6rem', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', flexWrap: 'wrap', border: '1px solid var(--border)' }}>
                        <input type="text" placeholder="Cari posisi atau bidang keahlian..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="search-focus" style={{ flex: 1, minWidth: '220px', padding: '0.9rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none', transition: 'all 0.2s' }} />
                        <input type="text" placeholder="Lokasi penempatan..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="search-focus" style={{ flex: 1, minWidth: '220px', padding: '0.9rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none', transition: 'all 0.2s' }} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {renderContent}
            </div>
        </div>
    );
}

export default Home;