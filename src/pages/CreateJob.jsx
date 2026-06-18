import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function CreateJob() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        jobType: 'full-time',
        validityDays: '30'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const requirementsArray = formData.requirements.split(',').map(item => item.trim());
            const payload = { ...formData, requirements: requirementsArray };
            await API.post('/jobs', payload);
            alert('Lowongan berhasil dibuat!');
            navigate('/');
        } catch (error) {
            alert('Gagal membuat lowongan, pastikan Anda login sebagai Perusahaan.');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', backgroundColor: '#ffffff', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #edf2f7' }}>
            <h2 style={{ color: '#2d3748', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>Buat Lowongan Pekerjaan Baru</h2>
            <p style={{ color: '#718096', margin: '0 0 2.5rem 0' }}>Lengkapi data di bawah ini untuk mempublikasikan posisi strategis perusahaan</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#4a5568', fontWeight: '600' }}>Posisi / Judul Pekerjaan</label>
                        <input type="text" name="title" placeholder="Contoh: Full Stack Developer" onChange={handleChange} required style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f7fafc' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#4a5568', fontWeight: '600' }}>Tipe Kontrak Kerja</label>
                        <select name="jobType" onChange={handleChange} style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f7fafc', cursor: 'pointer' }}>
                            <option value="full-time">Full-Time</option>
                            <option value="part-time">Part-Time</option>
                            <option value="remote">Remote</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#4a5568', fontWeight: '600' }}>Estimasi Gaji (IDR)</label>
                        <input type="number" name="salary" placeholder="Contoh: 8000000" onChange={handleChange} required style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f7fafc' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#4a5568', fontWeight: '600' }}>Lokasi Penempatan</label>
                        <input type="text" name="location" placeholder="Contoh: Medan" onChange={handleChange} required style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f7fafc' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#4a5568', fontWeight: '600' }}>Masa Berlaku (Hari)</label>
                        <input type="number" name="validityDays" min="1" value={formData.validityDays} onChange={handleChange} required style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f7fafc' }} />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#4a5568', fontWeight: '600' }}>Spesifikasi Kualifikasi Kunci</label>
                    <input type="text" name="requirements" placeholder="Pisahkan kualifikasi dengan koma" onChange={handleChange} required style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f7fafc' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#4a5568', fontWeight: '600' }}>Deskripsi Tugas & Tanggung Jawab</label>
                    <textarea name="description" placeholder="Deskripsikan ruang lingkup pekerjaan..." onChange={handleChange} required style={{ padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f7fafc', minHeight: '140px', resize: 'vertical' }} />
                </div>
                <button type="submit" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>Tayangkan Lowongan Kerja</button>
            </form>
        </div>
    );
}

export default CreateJob;