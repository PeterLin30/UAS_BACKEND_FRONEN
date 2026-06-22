import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Home() {
    const [jobs, setJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [userBookmarks, setUserBookmarks] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterEducation, setFilterEducation] = useState('');
    const [filterExp, setFilterExp] = useState('');
    
    const [showOnlyMyJobs, setShowOnlyMyJobs] = useState(false);
    const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
    
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
            if (filters.category) params.append('category', filters.category);
            if (filters.minEducation) params.append('minEducation', filters.minEducation);
            if (filters.requiresExperience !== '') params.append('requiresExperience', filters.requiresExperience);
            
            const response = await API.get(`/jobs?${params.toString()}`);
            setJobs(response.data);
        } catch (err) {
            setError('Gagal memuat daftar lowongan pekerjaan ter-update.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const appRes = await API.get('/applications/my-applications');
                const appIds = appRes.data.map(app => app.jobId?._id || app.jobId);
                setAppliedJobIds(appIds);

                const bmRes = await API.get('/bookmarks');
                const bmIds = bmRes.data.map(bm => bm._id || bm);
                setUserBookmarks(bmIds);
            } catch (err) {}
        };

        const fetchCategories = async () => {
            try {
                const res = await API.get('/admin/categories');
                setCategories(res.data);
            } catch (err) {}
        };

        fetchCategories();
        if (userRole === 'seeker') {
            fetchUserData();
        }
    }, [userRole]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchJobs({ 
                keyword: searchKeyword, 
                location: searchLocation,
                category: filterCategory,
                minEducation: filterEducation,
                requiresExperience: filterExp
            });
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchKeyword, searchLocation, filterCategory, filterEducation, filterExp, fetchJobs]);

    const handleToggleBookmark = async (jobId) => {
        try {
            const res = await API.post('/bookmarks/toggle', { jobId });
            setUserBookmarks(res.data.bookmarks);
        } catch (err) {}
    };

    let displayedJobs = jobs;
    if (userRole === 'employer' && showOnlyMyJobs) {
        displayedJobs = jobs.filter(job => job.employerId?._id === currentUserId || job.employerId === currentUserId);
    }
    if (userRole === 'seeker' && showBookmarksOnly) {
        displayedJobs = displayedJobs.filter(job => userBookmarks.includes(job._id));
    }

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
    } else if (displayedJobs.length === 0) {
        renderContent = (
            <div style={{ gridColumn: '1/-1', backgroundColor: 'var(--bg-card)', padding: '5rem 2rem', borderRadius: '24px', textAlign: 'center', border: '1px dashed var(--border)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', margin: 0 }}>Tidak ditemukan posisi pekerjaan yang sesuai dengan kriteria pencarian Anda.</p>
            </div>
        );
    } else {
        renderContent = displayedJobs.map((job) => {
            const isMyJob = job.employerId?._id === currentUserId || job.employerId === currentUserId;
            const hasApplied = appliedJobIds.includes(job._id);
            const isBookmarked = userBookmarks.includes(job._id);
            const daysLeft = job.expiresAt ? Math.ceil((new Date(job.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

            return (
                <div key={job._id} className="hover-card" style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem', borderRadius: '24px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ margin: '0 0 0.8rem 0', color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{job.title}</h3>
                            
                            {userRole === 'seeker' && (
                                <button 
                                    onClick={() => handleToggleBookmark(job._id)} 
                                    style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', transition: 'transform 0.2s', color: isBookmarked ? '#f59e0b' : 'var(--text-muted)' }}
                                    title={isBookmarked ? "Hapus dari Tersimpan" : "Simpan Lowongan"}
                                >
                                    {isBookmarked ? '★' : '☆'}
                                </button>
                            )}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <span style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-muted)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid var(--border)' }}>📍 {job.location}</span>
                            {daysLeft > 0 && (
                                <span style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '700' }}>Sisa {daysLeft} Hari</span>
                            )}
                        </div>

                        <p style={{ margin: '0 0 0.8rem 0', color: 'var(--text-muted)', fontSize: '1.1rem' }}>🏢 <strong>{job.employerId?.profileDetails?.companyName || job.employerId?.name || 'Perusahaan Mitra'}</strong></p>
                        <p style={{ margin: '0 0 1.5rem 0', color: '#10b981', fontSize: '1.3rem', fontWeight: '800' }}>{job.salary ? `Rp ${job.salary.toLocaleString('id-ID')}` : 'Gaji Dirahasiakan'}</p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2rem' }}>
                            {job.category && (
                                <span style={{ backgroundColor: 'var(--bg-nav)', color: 'var(--text-main)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid var(--border)' }}>
                                    🏷️ {job.category}
                                </span>
                            )}
                            {job.minEducation && (
                                <span style={{ backgroundColor: 'var(--bg-nav)', color: 'var(--text-main)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid var(--border)' }}>
                                    🎓 {job.minEducation}
                                </span>
                            )}
                            <span style={{ backgroundColor: job.requiresExperience ? '#fff1f2' : '#f0fdfa', color: job.requiresExperience ? '#be123c' : '#0f766e', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                                💼 {job.requiresExperience ? 'Wajib Pengalaman' : 'Terbuka Fresh Graduate'}
                            </span>
                        </div>
                    </div>
                    
                    {userRole === 'employer' ? (
    isMyJob ? (
        // Pastikan ini adalah rute yang benar untuk menuju halaman ManageApplicants
        <button 
            onClick={() => navigate(`/manage-applicants/${job._id}`)} 
            className="btn-animate" 
            style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: '700', fontSize: '1rem' }}
        >
            Manajemen Pelamar
        </button>
    ) : (
        <button disabled style={{ backgroundColor: 'var(--border)', color: 'var(--text-muted)', border: 'none', padding: '1rem', borderRadius: '12px', width: '100%', fontWeight: '700', fontSize: '1rem', cursor: 'not-allowed' }}>
            Milik Perusahaan Lain
        </button>
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
                .search-focus {
                    background-color: var(--input-bg);
                    color: var(--text-main);
                }
                .search-focus:focus { 
                    border-color: #2563eb !important; 
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); 
                }
                `}
            </style>

            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)', padding: '4.5rem 3rem', borderRadius: '24px', boxShadow: '0 12px 30px rgba(30, 64, 175, 0.25)', marginBottom: '3rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
                    <h1 style={{ margin: '0 0 0.8rem 0', fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>Eksplorasi Karir Masa Depan</h1>
                    <p style={{ margin: '0 0 2.5rem 0', fontSize: '1.2rem', opacity: 0.85, fontWeight: '300', lineHeight: '1.6', color: '#ffffff' }}>Temukan posisi strategis di berbagai industri terkemuka dengan ekosistem pencarian terintegrasi.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', backgroundColor: 'var(--bg-nav)', padding: '1rem', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                            <input type="text" placeholder="Cari posisi atau perusahaan..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="search-focus" style={{ flex: 1, minWidth: '220px', padding: '0.9rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none', border: '1px solid var(--border)', transition: 'all 0.2s' }} />
                            <input type="text" placeholder="Lokasi penempatan..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="search-focus" style={{ flex: 1, minWidth: '220px', padding: '0.9rem 1.2rem', borderRadius: '12px', fontSize: '1rem', outline: 'none', border: '1px solid var(--border)', transition: 'all 0.2s' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="search-focus" style={{ flex: 1, minWidth: '150px', padding: '0.9rem 1.2rem', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', border: '1px solid var(--border)', cursor: 'pointer' }}>
                                <option value="">Semua Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                            <select value={filterEducation} onChange={(e) => setFilterEducation(e.target.value)} className="search-focus" style={{ flex: 1, minWidth: '150px', padding: '0.9rem 1.2rem', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', border: '1px solid var(--border)', cursor: 'pointer' }}>
                                <option value="">Semua Pendidikan</option>
                                <option value="SMA/SMK Sederajat">SMA/SMK Sederajat</option>
                                <option value="Diploma (D1-D4)">Diploma (D1-D4)</option>
                                <option value="Sarjana (S1)">Sarjana (S1)</option>
                                <option value="Magister (S2)">Magister (S2)</option>
                            </select>
                            <select value={filterExp} onChange={(e) => setFilterExp(e.target.value)} className="search-focus" style={{ flex: 1, minWidth: '150px', padding: '0.9rem 1.2rem', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', border: '1px solid var(--border)', cursor: 'pointer' }}>
                                <option value="">Semua Pengalaman</option>
                                <option value="false">Terbuka Fresh Graduate</option>
                                <option value="true">Wajib Pengalaman</option>
                            </select>
                        </div>
                        
                        {/* KOREKSI MUTLAK CHECKBOX: FlexShrink untuk kotak, Flex-1 dan normal space untuk teks label */}
                        {userRole === 'employer' && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', marginTop: '0.5rem', padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}>
                                <input 
                                    type="checkbox" 
                                    id="myJobsFilter" 
                                    checked={showOnlyMyJobs}
                                    onChange={(e) => setShowOnlyMyJobs(e.target.checked)}
                                    style={{ width: '22px', height: '22px', minWidth: '22px', cursor: 'pointer', accentColor: '#2563eb', flexShrink: 0, margin: 0, marginTop: '2px' }}
                                />
                                <label htmlFor="myJobsFilter" style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', lineHeight: '1.4', flex: 1, whiteSpace: 'normal', textAlign: 'left', wordBreak: 'break-word' }}>
                                    Hanya tampilkan lowongan perusahaan saya
                                </label>
                            </div>
                        )}
                        
                        {userRole === 'seeker' && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', marginTop: '0.5rem', padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}>
                                <input 
                                    type="checkbox" 
                                    id="bookmarkFilter" 
                                    checked={showBookmarksOnly}
                                    onChange={(e) => setShowBookmarksOnly(e.target.checked)}
                                    style={{ width: '22px', height: '22px', minWidth: '22px', cursor: 'pointer', accentColor: '#f59e0b', flexShrink: 0, margin: 0, marginTop: '2px' }}
                                />
                                <label htmlFor="bookmarkFilter" style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', lineHeight: '1.4', flex: 1, whiteSpace: 'normal', textAlign: 'left', wordBreak: 'break-word' }}>
                                    Tampilkan Lowongan Tersimpan (⭐)
                                </label>
                            </div>
                        )}
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