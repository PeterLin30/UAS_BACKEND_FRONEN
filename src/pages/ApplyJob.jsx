import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

function ApplyJob() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        setError(null);
        const selectedFile = e.target.files[0];
        
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setError('Format ditolak! Sistem APXGP bersifat mutlak dan hanya menerima dokumen berekstensi .PDF');
                setFile(null);
                e.target.value = null; 
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Pilih file CV berformat PDF terlebih dahulu!');
            return;
        }
        
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('jobId', jobId);
        formData.append('resume', file);
        
        try {
            await API.post('/applications/apply', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/my-applications');
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengirim dokumen lamaran.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-transition" style={{ maxWidth: '650px', margin: '2rem auto', width: '100%', backgroundColor: 'var(--bg-card)', padding: '4rem', borderRadius: '24px', boxShadow: '0 20px 25px -5px var(--shadow)', border: '1px solid var(--border)' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', fontSize: '2.5rem', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1)' }}>
                    📄
                </div>
                <h2 style={{ color: 'var(--text-main)', margin: '0 0 0.5rem 0', fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Kirimkan Profil Anda</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>Hanya menerima format dokumen PDF resmi.</p>
            </div>

            {error && (
                <div style={{ backgroundColor: '#fef2f2', borderLeft: '6px solid #ef4444', padding: '1.5rem', borderRadius: '12px', color: '#991b1b', fontWeight: '700', marginBottom: '2rem', animation: 'fadeIn 0.4s ease' }}>
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ 
                    border: file ? '2px solid #3b82f6' : '2px dashed var(--border)', 
                    padding: '3rem 2rem', 
                    borderRadius: '20px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    backgroundColor: file ? 'rgba(59, 130, 246, 0.05)' : 'var(--input-bg)',
                    transition: 'all 0.3s ease'
                }}>
                    <input 
                        type="file" 
                        accept="application/pdf" 
                        onChange={handleFileChange} 
                        required 
                        id="cv-upload"
                        style={{ display: 'none' }} 
                    />
                    <label htmlFor="cv-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <span style={{ fontSize: '3.5rem', marginBottom: '1rem', color: file ? '#3b82f6' : 'var(--text-muted)', transition: 'color 0.3s' }}>
                            {file ? '✅' : '📤'}
                        </span>
                        <span style={{ fontSize: '1.2rem', fontWeight: '800', color: file ? '#2563eb' : 'var(--text-main)', marginBottom: '0.6rem', textAlign: 'center', transition: 'color 0.3s' }}>
                            {file ? file.name : 'Ketuk untuk Mengunggah CV'}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '600' }}>Mutlak format .PDF (Maksimal 5MB)</span>
                    </label>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-animate" style={{ 
                    padding: '1.2rem', 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '16px', 
                    fontWeight: '800', 
                    fontSize: '1.2rem',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}>
                    {isSubmitting ? 'Memproses Dokumen...' : 'Kirim Dokumen Sekarang'}
                </button>
            </form>
        </div>
    );
}

export default ApplyJob;