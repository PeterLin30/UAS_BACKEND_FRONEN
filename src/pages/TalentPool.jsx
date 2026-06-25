import { useState, useEffect } from 'react';
import API from '../services/api';

function TalentPool() {
    const [seekers, setSeekers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [experienceFilter, setExperienceFilter] = useState('all');
    const [searchKeyword, setSearchKeyword] = useState('');

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

    const filteredSeekers = seekers.filter(seeker => {
        const hasExp = seeker.profileDetails?.hasExperience === true;
        const matchExperience =
            experienceFilter === 'all' ? true :
            experienceFilter === 'experienced' ? hasExp :
            !hasExp;

        const matchKeyword = seeker.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                             (seeker.profileDetails?.education && seeker.profileDetails.education.toLowerCase().includes(searchKeyword.toLowerCase()));

        return matchExperience && matchKeyword;
    });

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                <div style={{ width: '50px', height: '50px', border: '5px solid var(--border)', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '1000px',
            margin: '2rem auto',
            padding: '0 1rem',
            boxSizing: 'border-box',
            // FIX 1: Hapus overflow: 'hidden' — itu yang memotong konten card
            // overflow-x ditangani di level html/body lewat CSS global
        }}>

            {/* Header & Filter */}
            <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                padding: '2rem 1.5rem',
                borderRadius: '24px',
                color: 'white',
                marginBottom: '2rem',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                boxSizing: 'border-box',
                // FIX 2: Hapus width: '100%' eksplisit — block element sudah 100% by default
            }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '800', wordBreak: 'break-word' }}>
                    Pangkalan Data Talenta
                </h2>
                <p style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', opacity: 0.85, wordBreak: 'break-word' }}>
                    Eksplorasi profil dan rekam jejak kandidat profesional di platform ini.
                </p>

                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    backgroundColor: 'var(--bg-nav)',
                    padding: '1rem',
                    borderRadius: '16px',
                    flexWrap: 'wrap',
                    border: '1px solid var(--border)',
                    boxSizing: 'border-box',
                }}>
                    <input
                        type="text"
                        placeholder="Cari nama atau pendidikan..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        style={{
                            // FIX 3: flex: '1 1 0' + minWidth: 0 mencegah input meluber keluar container
                            flex: '1 1 0',
                            minWidth: 0,
                            padding: '0.9rem 1.2rem',
                            borderRadius: '10px',
                            border: '1px solid var(--border)',
                            outline: 'none',
                            backgroundColor: 'var(--input-bg)',
                            color: 'var(--text-main)',
                            fontSize: '0.95rem',
                            boxSizing: 'border-box',
                        }}
                    />
                    <select
                        value={experienceFilter}
                        onChange={(e) => setExperienceFilter(e.target.value)}
                        style={{
                            flex: '1 1 0',
                            minWidth: 0,
                            padding: '0.9rem 1.2rem',
                            borderRadius: '10px',
                            border: '1px solid var(--border)',
                            outline: 'none',
                            backgroundColor: 'var(--input-bg)',
                            color: 'var(--text-main)',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            boxSizing: 'border-box',
                        }}
                    >
                        <option value="all">Semua Talenta</option>
                        <option value="experienced">Hanya Berpengalaman</option>
                        <option value="fresh_graduate">Fresh Graduate (Belum Bekerja)</option>
                    </select>
                </div>
            </div>

            {/* Grid Cards */}
            <div style={{
                display: 'grid',
                // FIX 4: minmax(min(250px, 100%), 1fr) — kunci utama anti-offside
                // Di layar lebar: kolom minimal 250px → multi-kolom
                // Di HP sempit: min(250px, 100%) = 100% → 1 kolom penuh, tidak meluber
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(250px, 100%), 1fr))',
                gap: '1.5rem',
                boxSizing: 'border-box',
            }}>
                {filteredSeekers.map(seeker => (
                    <div
                        key={seeker._id}
                        className="hover-card"
                        style={{
                            padding: '1.5rem',
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: '20px',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            boxSizing: 'border-box',
                            // FIX 5: minWidth: 0 pada grid item mencegah konten memaksa kolom melebar
                            minWidth: 0,
                        }}
                    >
                        {/* Avatar + Nama */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                backgroundColor: '#eff6ff',
                                color: '#2563eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.4rem',
                                fontWeight: '800',
                                flexShrink: 0,
                            }}>
                                {seeker.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <h3 style={{ margin: '0', color: 'var(--text-main)', fontSize: '1.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {seeker.name}
                                </h3>
                                <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {seeker.email}
                                </p>
                            </div>
                        </div>

                        {/* Pendidikan & Status */}
                        <div style={{ backgroundColor: 'var(--bg-nav)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                <strong>Pendidikan:</strong> {seeker.profileDetails?.education || 'Belum diisi'}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: seeker.profileDetails?.hasExperience ? '#059669' : '#d97706', fontWeight: '700' }}>
                                💼 {seeker.profileDetails?.hasExperience ? 'Berpengalaman' : 'Fresh Graduate'}
                            </p>
                        </div>

                        {/* Pengalaman */}
                        {seeker.profileDetails?.hasExperience && seeker.profileDetails?.experienceText && (
                            <p style={{
                                fontSize: '0.9rem',
                                color: 'var(--text-main)',
                                lineHeight: '1.6',
                                margin: 0,
                                padding: '1rem',
                                backgroundColor: 'var(--input-bg)',
                                borderRadius: '12px',
                                borderLeft: '4px solid #2563eb',
                                wordBreak: 'break-word',
                                // FIX 6: overflowWrap agar teks panjang tidak meluber
                                overflowWrap: 'break-word',
                            }}>
                                "{seeker.profileDetails.experienceText.length > 80
                                    ? seeker.profileDetails.experienceText.substring(0, 80) + '...'
                                    : seeker.profileDetails.experienceText}"
                            </p>
                        )}
                    </div>
                ))}

                {filteredSeekers.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'var(--bg-card)', borderRadius: '20px', border: '1px dashed var(--border)', boxSizing: 'border-box' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '600' }}>
                            Tidak ada kandidat yang sesuai dengan kriteria filter tersebut.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TalentPool;