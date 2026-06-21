import { useState, useEffect } from 'react';
import API from '../services/api';

function EmployerAnalytics() {
    const [analyticsData, setAnalyticsData] = useState([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await API.get('/applications/my-applications');
                const counts = res.data.reduce((acc, app) => {
                    const title = app.jobId?.title || 'Posisi Non-Aktif';
                    acc[title] = (acc[title] || 0) + 1;
                    return acc;
                }, {});
                
                const formatted = Object.keys(counts).map(key => ({
                    title: key,
                    count: counts[key]
                }));
                setAnalyticsData(formatted);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAnalytics();
    }, []);

    const maxCount = Math.max(...analyticsData.map(d => d.count), 1);

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>Metrik Performa Lowongan</h2>
            <p style={{ color: '#64748b', marginBottom: '3rem' }}>Statistik grafik kuantitas berkas lamaran yang masuk pada tiap posisi kerja.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {analyticsData.map((data, index) => {
                    const percentage = (data.count / maxCount) * 100;
                    return (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#334155' }}>
                                <span>{data.title}</span>
                                <span style={{ color: '#2563eb' }}>{data.count} Berkas</span>
                            </div>
                            <div style={{ width: '100%', height: '24px', backgroundColor: '#f1f5f9', borderRadius: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#3b82f6', borderRadius: '8px', transition: 'width 1s ease-in-out' }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default EmployerAnalytics;