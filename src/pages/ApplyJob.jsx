import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

function ApplyJob() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [employerProfile, setEmployerProfile] = useState(null);

    const [resumeBase64, setResumeBase64] = useState('');
    const [fileName, setFileName] = useState('');
    const [coverLetter, setCoverLetter] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const jobRes = await API.get(`/jobs/${jobId}`);
                setJob(jobRes.data);

                const empId = jobRes.data.employerId?._id || jobRes.data.employerId;
                if (empId) {
                    const empRes = await API.get(`/users/${empId}`);
                    setEmployerProfile(empRes.data);
                }
            } catch (error) {
                setMessage({ text: 'Gagal memuat detail pekerjaan atau profil perusahaan.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [jobId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setMessage({ text: 'Ukuran file CV maksimal 2MB.', type: 'error' });
                e.target.value = '';
                return;
            }
            
            setFileName(file.name);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setResumeBase64(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resumeBase64) {
            setMessage({ text: 'Dokumen CV mutlak wajib diunggah.', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            await API.post('/applications', {
                jobId: jobId,
                resume: resumeBase64,
                coverLetter: coverLetter
            });
            setMessage({ text: 'Lamaran Anda berhasil dikirim ke perusahaan!', type: 'success' });
            setTimeout(() => {
                navigate('/my-applications');
            }, 2000);
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Gagal mengirim lamaran.', type: 'error' });
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10rem 0' }}>
                <div style={{ width: '50px', height: '50px', border: '5px solid var(--border)', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.2rem' }}></div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600', animation: 'pulse 2s infinite' }}>Memuat profil perusahaan...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 4px 6px var(--shadow)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '65px', height: '65px', borderRadius: '16px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '800' }}>
                            {employerProfile?.name ? employerProfile.name.charAt(0).toUpperCase() : '🏢'}
                        </div>
                        <div>
                            <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.6rem', fontWeight: '800' }}>
                                {employerProfile?.profileDetails?.companyName || employerProfile?.name || 'Nama Perusahaan Dirahasiakan'}
                            </h2>
                            <span style={{ display: 'inline-block', marginTop: '0.5rem', backgroundColor: 'var(--bg-nav)', color: 'var(--text-main)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid var(--border)' }}>
                                🏭 {employerProfile?.profileDetails?.companyIndustry || 'Sektor Industri Tidak Diketahui'}
                            </span>
                        </div>
                    </div>
                    
                    <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                        <h3 style={{ margin: '0 0 0.8rem 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>Tentang Perusahaan</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                            {employerProfile?.profileDetails?.companyDescription || 'Perusahaan ini belum melengkapi deskripsi entitas bisnis mereka di platform APXGP.'}
                        </p>
                    </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 4px 6px var(--shadow)' }}>
                    <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '1.8rem', fontWeight: '800' }}>{job?.title}</h2>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.5rem' }}>
                        <span style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600' }}>📍 {job?.location}</span>
                        <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700' }}>{job?.salary ? `Rp ${job.salary.toLocaleString('id-ID')}` : 'Gaji Dirahasiakan'}</span>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-nav)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}><strong>🎓 Minimal Pendidikan:</strong> {job?.minEducation}</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: job?.requiresExperience ? '#be123c' : '#0f766e', fontWeight: '700' }}>
                            💼 {job?.requiresExperience ? 'Wajib Memiliki Pengalaman' : 'Terbuka Untuk Fresh Graduate'}
                        </p>
                    </div>

                    <h3 style={{ margin: '0 0 0.8rem 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>Deskripsi Pekerjaan</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                        {job?.description}
                    </p>
                </div>
            </div>

            <div style={{ flex: '1 1 400px' }}>
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 25px -5px var(--shadow)', position: 'sticky', top: '100px' }}>
                    <h2 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)', fontSize: '1.6rem', fontWeight: '800' }}>Kirimkan Berkas Anda</h2>
                    
                    {message.text && (
                        <div style={{ padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: '700', backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2', color: message.type === 'success' ? '#065f46' : '#991b1b' }}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Curriculum Vitae (PDF)</label>
                            <div style={{ border: '2px dashed var(--border)', borderRadius: '16px', padding: '2rem 1rem', textAlign: 'center', backgroundColor: 'var(--input-bg)', transition: 'border-color 0.3s' }}>
                                <input 
                                    type="file" 
                                    accept=".pdf" 
                                    onChange={handleFileChange} 
                                    id="cv-upload"
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="cv-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '2rem' }}>📄</span>
                                    <span style={{ color: '#2563eb', fontWeight: '700' }}>Klik untuk memilih file PDF</span>
                                    <span style={{ color: fileName ? '#059669' : 'var(--text-muted)', fontSize: '0.9rem', fontWeight: fileName ? 'bold' : 'normal' }}>
                                        {fileName ? `✓ ${fileName}` : 'Maksimal ukuran file: 2MB'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '700', color: 'var(--text-main)' }}>Surat Pengantar / Cover Letter</label>
                            <textarea 
                                value={coverLetter} 
                                onChange={(e) => setCoverLetter(e.target.value)} 
                                rows="6" 
                                required
                                style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', resize: 'vertical', fontSize: '0.95rem', fontFamily: 'inherit' }}
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting || !resumeBase64} 
                            className="btn-animate" 
                            style={{ padding: '1.2rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1.1rem', marginTop: '0.5rem', opacity: (isSubmitting || !resumeBase64) ? 0.6 : 1, cursor: (isSubmitting || !resumeBase64) ? 'not-allowed' : 'pointer' }}
                        >
                            {isSubmitting ? 'Memproses Transmisi...' : 'Kirim Lamaran Sekarang'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ApplyJob;