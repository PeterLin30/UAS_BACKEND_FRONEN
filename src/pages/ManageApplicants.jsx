import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

function ManageApplicants() {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await API.get(`/applications/job/${jobId}`);
                setApplicants(response.data);
            } catch (error) {
                alert('Gagal mengambil data pelamar. Pastikan Anda login sebagai Perusahaan.');
            }
        };
        fetchApplicants();
    }, [jobId]);

    const handleUpdateStatus = async (applicationId, newStatus) => {
        try {
            await API.put(`/applications/${applicationId}/status`, { status: newStatus });
            setApplicants(applicants.map(app => 
                app._id === applicationId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            alert('Gagal mengubah status pelamar');
        }
    };

    // Fungsi Mutlak untuk mengubah Base64 menjadi Blob PDF
    const viewResume = (base64String) => {
        if (!base64String || !base64String.startsWith('data:application/pdf;base64,')) {
            alert('Dokumen tidak valid. Kandidat mungkin menggunakan format unggahan lama.');
            return;
        }

        // Memecah header "data:application/pdf;base64," dari isi datanya
        const base64Data = base64String.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        
        // Membuka PDF di tab baru
        window.open(blobUrl, '_blank');
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
            <h2 style={{ color: '#2d3748', margin: '0 0 0.5rem 0', fontSize: '2.2rem' }}>Otorisasi Dokumen Kandidat</h2>
            <p style={{ color: '#718096', margin: '0 0 2.5rem 0', fontSize: '1.1rem' }}>Evaluasi portofolio pelamar serta perbarui tahapan seleksi secara transparan</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {applicants.length === 0 ? (
                    <div style={{ backgroundColor: '#ffffff', padding: '4rem 2rem', borderRadius: '16px', textAlign: 'center', border: '1px solid #edf2f7', color: '#718096', fontSize: '1.1rem' }}>Tidak ada berkas masuk dari pelamar untuk kualifikasi ini.</div>
                ) : (
                    applicants.map((app) => {
                        const isFinalized = app.status === 'Accepted' || app.status === 'Rejected';

                        return (
                            <div key={app._id} style={{ padding: '2rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #edf2f7', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a202c', fontSize: '1.3rem' }}>{app.applicantId?.name || 'Kandidat'}</h3>
                                    <p style={{ margin: '0 0 1rem 0', color: '#718096' }}>📧 {app.applicantId?.email || '-'}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <span style={{ fontSize: '0.95rem', color: '#4a5568' }}>Status Terkini: <strong style={{ color: app.status === 'Accepted' ? '#38a169' : app.status === 'Rejected' ? '#e53e3e' : '#0056b3' }}>{app.status}</strong></span>
                                        
                                        {/* Perubahan pada Tombol PDF */}
                                        <button 
                                            onClick={() => viewResume(app.resumeUrl)} 
                                            style={{ border: 'none', cursor: 'pointer', textDecoration: 'none', backgroundColor: '#edf2f7', color: '#2b6cb0', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}
                                        >
                                            📄 Periksa Berkas CV
                                        </button>
                                        
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.6rem' }}>
                                    {isFinalized ? (
                                        <span style={{ backgroundColor: '#f7fafc', color: '#a0aec0', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', border: '1px solid #e2e8f0' }}>Keputusan Mutlak</span>
                                    ) : (
                                        <>
                                            {app.status !== 'Interview' && (
                                                <button onClick={() => handleUpdateStatus(app._id, 'Interview')} style={{ backgroundColor: '#ffffff', color: '#2b6cb0', border: '1px solid #cbd5e0', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Panggil Interview</button>
                                            )}
                                            <button onClick={() => handleUpdateStatus(app._id, 'Accepted')} style={{ backgroundColor: '#38a169', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Terima</button>
                                            <button onClick={() => handleUpdateStatus(app._id, 'Rejected')} style={{ backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Tolak</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ManageApplicants;