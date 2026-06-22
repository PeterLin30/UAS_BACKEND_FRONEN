import { useState, useEffect } from 'react';
import API from '../services/api';

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyApplications = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await API.get('/applications/my-applications');
                setApplications(response.data);
            } catch (err) {
                setError('Terjadi kendala jaringan saat mengambil data pelamar. Silakan muat ulang halaman.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyApplications();
    }, []);

    const renderProgressBar = (status) => {
        let step = 1;
        let color = '#3b82f6'; // Modern Blue
        let bgColor = 'var(--input-bg)'; // Adaptif dengan tema
        
        if (status === 'Review') { step = 1; color = '#f59e0b'; bgColor = 'rgba(245, 158, 11, 0.1)'; } // Amber
        else if (status === 'Interview') { step = 2; color = '#8b5cf6'; bgColor = 'rgba(139, 92, 246, 0.1)'; } // Purple
        else if (status === 'Accepted') { step = 3; color = '#10b981'; bgColor = 'rgba(16, 185, 129, 0.1)'; } // Emerald
        else if (status === 'Rejected') { step = 3; color = '#ef4444'; bgColor = 'rgba(239, 68, 68, 0.1)'; } // Red

        return (
            <div style={{ marginTop: '2.5rem', padding: '1.8rem', backgroundColor: bgColor, borderRadius: '16px', border: `1px solid ${color}40` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '700' }}>
                    <span style={{ color: step >= 1 ? color : 'var(--text-muted)', transition: 'color 0.3s' }}>1. Seleksi Berkas</span>
                    <span style={{ color: step >= 2 ? color : 'var(--text-muted)', transition: 'color 0.3s' }}>2. Wawancara HR</span>
                    <span style={{ color: step >= 3 ? color : 'var(--text-muted)', transition: 'color 0.3s' }}>3. Keputusan Akhir</span>
                </div>
                
                {/* Track Progress Bar */}
                <div style={{ width: '100%', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: '999px', height: '12px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                    {/* Fill Progress Bar (Beranimasi) */}
                    <div style={{ 
                        width: step === 1 ? '33%' : step === 2 ? '66%' : '100%', 
                        backgroundColor: color, 
                        height: '100%', 
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: '999px',
                        backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
                        backgroundSize: '1rem 1rem'
                    }}></div>
                </div>
                
                <div style={{ marginTop: '1.2rem', textAlign: 'center', fontWeight: '700', color: color, fontSize: '1.1rem' }}>
                    {status === 'Review' && '📄 Berkas Anda sedang dalam peninjauan ketat perusahaan.'}
                    {status === 'Interview' && '🎉 Selamat! Anda diundang untuk sesi wawancara eksklusif.'}
                    {status === 'Accepted' && '🌟 Luar biasa! Anda resmi diterima di posisi ini.'}
                    {status === 'Rejected' && '💼 Tetap semangat! Profil Anda akan bersinar di kesempatan lain.'}
                </div>
            </div>
        );
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', paddingBottom: '3rem' }}>
            <style>
                {`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
                .hover-card:hover { transform: translateY(-6px); box-shadow: 0 20px 25px -5px var(--shadow), 0 10px 10px -5px var(--shadow); }
                `}
            </style>

            <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', padding: '3.5rem 3rem', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)', marginBottom: '3rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Pusat Pelacakan Karir</h2>
                    <p style={{ margin: 0, fontSize: '1.15rem', opacity: 0.9, fontWeight: '300' }}>Pantau pergerakan dokumen lamaran Anda secara presisi dan elegan.</p>
                </div>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-40px', right: '50px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
                    <div style={{ width: '60px', height: '60px', border: '6px solid var(--border)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }}></div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '600', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>Menyiapkan data karir Anda...</p>
                </div>
            ) : error ? (
                <div style={{ backgroundColor: '#fef2f2', borderLeft: '6px solid #ef4444', padding: '2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.1)' }}>
                    <span style={{ fontSize: '2.5rem' }}>⚠️</span>
                    <div>
                        <h3 style={{ color: '#991b1b', margin: '0 0 0.3rem 0', fontSize: '1.3rem', fontWeight: '800' }}>Gagal Memuat Data</h3>
                        <p style={{ color: '#b91c1c', margin: 0, fontSize: '1.05rem' }}>{error}</p>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {applications.length === 0 ? (
                        <div style={{ backgroundColor: 'var(--bg-card)', padding: '6rem 2rem', borderRadius: '24px', textAlign: 'center', border: '2px dashed var(--border)' }}>
                            <div style={{ fontSize: '5rem', marginBottom: '1.5rem', animation: 'pulse 3s infinite' }}>📭</div>
                            <h3 style={{ color: 'var(--text-main)', margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '800' }}>Kanvas Masih Kosong</h3>
                            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Mulai eksplorasi dan kirimkan lamaran pertama Anda hari ini. Peluang besar menanti!</p>
                        </div>
                    ) : (
                        applications.map((app) => (
                            <div key={app._id} className="hover-card" style={{ padding: '2.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px var(--shadow)', transition: 'all 0.3s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.6rem 0', color: 'var(--text-main)', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{app.jobId?.title || 'Posisi Non-Aktif'}</h3>
                                        <p style={{ color: 'var(--text-muted)', margin: '0 0 1.2rem 0', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ backgroundColor: 'var(--input-bg)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>🏢</span> 
                                            <strong>{app.jobId?.employerId?.name || 'Perusahaan'}</strong>
                                        </p>
                                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '600', flexWrap: 'wrap' }}>
                                            <span style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', padding: '0.5rem 1.2rem', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                📍 {app.jobId?.location || '-'}
                                            </span>
                                            <span style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', border: '1px solid #bbf7d0', padding: '0.5rem 1.2rem', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                💵 Rp {app.jobId?.salary?.toLocaleString('id-ID') || '-'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Tombol Lihat CV yang telah kembali dengan variabel resumeUrl */}
                                    {app.resumeUrl && (
                                        <a 
                                            href={app.resumeUrl} 
                                            download={`CV_${app.jobId?.title || 'Lamaran'}.pdf`} 
                                            style={{ textDecoration: 'none', backgroundColor: 'var(--bg-nav)', color: '#2563eb', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: '700', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background-color 0.2s' }}
                                        >
                                            📄 Unduh CV Anda
                                        </a>
                                    )}
                                </div>
                                
                                {renderProgressBar(app.status)}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default MyApplications;