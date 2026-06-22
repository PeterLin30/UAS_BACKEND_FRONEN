import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

function ManageApplicants() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplicants = async () => {
        try {
            setIsLoading(true);
            // Menarik data pelamar khusus untuk lowongan ini
            const response = await API.get(`/applications/job/${jobId}`);
            setApplicants(response.data);
        } catch (err) {
            setError('Gagal memuat daftar pelamar. Pastikan Anda memiliki hak akses perusahaan.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, [jobId]);

    const handleStatusChange = async (appId, newStatus) => {
        try {
            await API.put(`/applications/${appId}/status`, { status: newStatus });
            // Perbarui state lokal agar UI langsung berubah tanpa perlu refresh
            setApplicants(applicants.map(app => 
                app._id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            alert('Gagal mengubah status pelamar.');
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10rem 0' }}>
                <div style={{ width: '60px', height: '60px', border: '6px solid var(--border)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }}></div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '600', animation: 'pulse 2s infinite' }}>Memuat Pangkalan Data Talenta...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '900px', margin: '3rem auto', backgroundColor: '#fef2f2', borderLeft: '6px solid #ef4444', padding: '2rem', borderRadius: '16px', color: '#991b1b', fontWeight: '700' }}>
                {error}
                <br/><br/>
                <button onClick={() => navigate('/')} style={{ padding: '0.8rem 1.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Kembali ke Beranda</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>Manajemen Kandidat</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>Evaluasi dokumen dan surat pengantar pelamar Anda.</p>
                </div>
                <button onClick={() => navigate('/')} style={{ padding: '0.8rem 1.5rem', backgroundColor: 'var(--bg-nav)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
                    ← Kembali
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {applicants.length === 0 ? (
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '5rem 2rem', borderRadius: '24px', textAlign: 'center', border: '2px dashed var(--border)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                        <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Belum Ada Pelamar Masuk</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Lowongan ini belum menerima transmisi dokumen dari kandidat.</p>
                    </div>
                ) : (
                    applicants.map(app => (
                        <div key={app._id} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px var(--shadow)', overflow: 'hidden' }}>
                            
                            {/* Header Kartu Pelamar */}
                            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                                        {app.applicantId?.name?.charAt(0).toUpperCase() || '👤'}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: '800' }}>{app.applicantId?.name || 'Kandidat Tidak Diketahui'}</h3>
                                        <p style={{ margin: '0 0 0.8rem 0', color: 'var(--text-muted)' }}>✉️ {app.applicantId?.email}</p>
                                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                                            <span style={{ backgroundColor: 'var(--input-bg)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid var(--border)', color: 'var(--text-main)' }}>
                                                🎓 {app.applicantId?.profileDetails?.education || 'Pendidikan Tidak Diisi'}
                                            </span>
                                            <span style={{ backgroundColor: app.applicantId?.profileDetails?.hasExperience ? '#eff6ff' : '#f8fafc', color: app.applicantId?.profileDetails?.hasExperience ? '#2563eb' : '#64748b', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid var(--border)' }}>
                                                💼 {app.applicantId?.profileDetails?.hasExperience ? 'Berpengalaman' : 'Fresh Graduate'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Kontrol Status (HRD Action) */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Status Kandidat:</label>
                                    <select 
                                        value={app.status} 
                                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                        style={{ padding: '0.8rem', borderRadius: '12px', border: '2px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontWeight: '700', cursor: 'pointer', outline: 'none' }}
                                    >
                                        <option value="Review">📄 Sedang Direview</option>
                                        <option value="Interview">🎤 Panggilan Wawancara</option>
                                        <option value="Accepted">🌟 Terima Kandidat</option>
                                        <option value="Rejected">❌ Tolak Kandidat</option>
                                    </select>
                                </div>
                            </div>

                            {/* Isi Surat Pengantar & CV */}
                            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                
                                {/* Blok Surat Pengantar */}
                                <div>
                                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>📝</span> Surat Pengantar (Cover Letter)
                                    </h4>
                                    <div style={{ backgroundColor: 'var(--input-bg)', padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--border)', borderLeft: '4px solid #2563eb' }}>
                                        <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
                                            {app.coverLetter || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Kandidat tidak menyertakan surat pengantar.</span>}
                                        </p>
                                    </div>
                                </div>

                                {/* Blok Detail Pengalaman & Tombol Download CV */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                                    <div style={{ flex: '1 1 300px' }}>
                                        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>Detail Keahlian / Pengalaman</h4>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontSize: '0.95rem', backgroundColor: 'var(--bg-nav)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                            {app.applicantId?.profileDetails?.experienceText || 'Tidak ada detail pengalaman yang dicantumkan di profil.'}
                                        </p>
                                    </div>
                                    
                                    <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        {app.resumeUrl ? (
                                            <a 
                                                href={app.resumeUrl} 
                                                download={`CV_${app.applicantId?.name || 'Kandidat'}.pdf`}
                                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', backgroundColor: '#eff6ff', border: '2px dashed #3b82f6', padding: '2rem', borderRadius: '16px', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                            >
                                                <span style={{ fontSize: '2.5rem' }}>📄</span>
                                                <span style={{ color: '#1d4ed8', fontWeight: '800', fontSize: '1.1rem' }}>Unduh Dokumen CV</span>
                                                <span style={{ color: '#3b82f6', fontSize: '0.85rem', fontWeight: '600' }}>Format PDF (Aman)</span>
                                            </a>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fef2f2', border: '2px dashed #ef4444', padding: '2rem', borderRadius: '16px' }}>
                                                <span style={{ fontSize: '2.5rem' }}>⚠️</span>
                                                <span style={{ color: '#b91c1c', fontWeight: '800', fontSize: '1.1rem' }}>CV Tidak Ditemukan</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ManageApplicants;