import { useState, useEffect } from 'react';
import API from '../services/api';

function TalentPool() {
    const [seekers, setSeekers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSeekers = async () => {
            try {
                const res = await API.get('/users/seekers');
                setSeekers(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSeekers();
    }, []);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                <div style={{ width: '50px', height: '50px', border: '5px solid var(--border)', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '3rem', borderRadius: '24px', color: 'white', marginBottom: '3rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', fontWeight: '800' }}>Pangkalan Data Talenta</h2>
                <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.85 }}>Eksplorasi profil dan rekam jejak kandidat profesional di platform ini.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {seekers.map(seeker => (
                    <div key={seeker._id} className="hover-card" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: '800' }}>
                                {seeker.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 style={{ margin: '0', color: 'var(--text-main)', fontSize: '1.3rem' }}>{seeker.name}</h3>
                                <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{seeker.email}</p>
                            </div>
                        </div>
                        
                        <div style={{ backgroundColor: 'var(--bg-nav)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}><strong>Pendidikan:</strong> {seeker.profileDetails?.education || 'Belum diisi'}</p>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}><strong>Status Pengalaman:</strong> {seeker.profileDetails?.hasExperience ? 'Berpengalaman' : 'Fresh Graduate'}</p>
                        </div>

                        {seeker.profileDetails?.hasExperience && seeker.profileDetails?.experienceText && (
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.5', margin: '0.5rem 0' }}>
                                "{seeker.profileDetails.experienceText.length > 80 ? seeker.profileDetails.experienceText.substring(0, 80) + '...' : seeker.profileDetails.experienceText}"
                            </p>
                        )}
                    </div>
                ))}
                
                {seekers.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-card)', borderRadius: '20px', border: '1px dashed var(--border)' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Belum ada kandidat yang terdaftar di sistem.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TalentPool;