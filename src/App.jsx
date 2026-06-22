import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CreateJob from './pages/CreateJob';
import ApplyJob from './pages/ApplyJob';
import MyApplications from './pages/MyApplications';
import ManageApplicants from './pages/ManageApplicants';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import TalentPool from './pages/TalentPool';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
        document.body.style.backgroundColor = '#0f172a';
    } else {
        document.body.style.backgroundColor = '#f8fafc';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
  };

  const themeStyles = theme === 'light' ? {
    '--bg-app': '#f8fafc',
    '--bg-nav': 'rgba(255, 255, 255, 0.85)',
    '--bg-card': '#ffffff',
    '--text-main': '#0f172a',
    '--text-muted': '#64748b',
    '--border': '#e2e8f0',
    '--shadow': 'rgba(0, 0, 0, 0.05)',
    '--input-bg': '#f1f5f9'
  } : {
    '--bg-app': '#0f172a',
    '--bg-nav': 'rgba(15, 23, 42, 0.85)',
    '--bg-card': '#1e293b',
    '--text-main': '#f8fafc',
    '--text-muted': '#94a3b8',
    '--border': '#334155',
    '--shadow': 'rgba(0, 0, 0, 0.3)',
    '--input-bg': '#0f172a'
  };

  return (
    <Router>
      <div style={{ ...themeStyles, display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0, padding: 0, backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', transition: 'background-color 0.4s ease, color 0.4s ease' }}>
        <style>
          {`
            .btn-animate {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              cursor: pointer;
            }
            .btn-animate:hover:not(:disabled) {
              transform: translateY(-3px);
              box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4) !important;
            }
            .btn-animate:active:not(:disabled) {
              transform: translateY(-1px);
            }
            .nav-link {
              text-decoration: none;
              color: var(--text-muted);
              font-weight: 600;
              font-size: 1.05rem;
              transition: color 0.3s ease, transform 0.3s ease;
              position: relative;
            }
            .nav-link:hover {
              color: #3b82f6;
              transform: translateY(-2px);
            }
            .nav-link::after {
              content: '';
              position: absolute;
              width: 0;
              height: 2.5px;
              bottom: -6px;
              left: 0;
              background-color: #3b82f6;
              transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              border-radius: 4px;
            }
            .nav-link:hover::after {
              width: 100%;
            }
            input, select, textarea {
              background-color: var(--input-bg) !important;
              color: var(--text-main) !important;
              border: 1px solid var(--border) !important;
            }
            div[style*="backgroundColor: '#ffffff'"], 
            div[style*="backgroundColor: '#fff'"] {
              background-color: var(--bg-card) !important;
              border-color: var(--border) !important;
              color: var(--text-main) !important;
            }
            .page-transition {
              animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(15px); }
              to { opacity: 1; transform: translateY(0); }
            }
            /* --- SUNTIKAN RESPONSIVITAS MOBILE MUTLAK --- */
            @media (max-width: 768px) {
              /* 1. Rombak Navbar menjadi Vertikal di HP */
              nav {
                flex-direction: column !important;
                padding: 1.5rem 1rem !important;
                gap: 1rem;
              }
              nav > div {
                flex-wrap: wrap !important;
                justify-content: center !important;
                gap: 1rem !important;
              }
              
              /* 2. Pangkas Padding Halaman Utama */
              .page-transition {
                padding: 1.5rem 1rem !important;
              }
              
              /* 3. Pangkas Padding di dalam Kartu & Banner */
              div[style*="padding: '4.5rem 3rem'"],
              div[style*="padding: '3rem'"],
              div[style*="padding: '3.5rem 3rem'"] {
                padding: 1.5rem !important;
                border-radius: 16px !important;
              }
              
              .hover-card {
                padding: 1.5rem !important;
              }

              /* 4. Kecilkan Ukuran Font Judul Utama */
              h1 { font-size: 2.2rem !important; }
              h2 { font-size: 1.8rem !important; }

              /* 5. FIX OFFSIDE: Pangkas Filter Pencarian */
              .search-focus {
                min-width: 100% !important; /* Paksa input/select penuh ke bawah, bukan menyamping */
                margin-bottom: 0.5rem;
              }
              
              /* Hilangkan gap horizontal pada wadah filter agar tidak tumpah */
              div[style*="gap: '0.8rem'"] {
                gap: 0 !important;
              }
            }

            @media (max-width: 400px) {
              /* 6. Paksa Grid menjadi 1 Kolom Penuh pada Layar Sangat Kecil */
              div[style*="gridTemplateColumns"] {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>
        
        <nav style={{ padding: '1rem 4rem', backgroundColor: 'var(--bg-nav)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 4px 30px var(--shadow)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid var(--border)', transition: 'background-color 0.4s ease' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ margin: 0, background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '900', letterSpacing: '1.5px', fontSize: '2.4rem', textShadow: '0 2px 10px rgba(59, 130, 246, 0.2)' }}>APXGP</h2>
          </Link>

          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <Link to="/" className="nav-link">Beranda</Link>
            
            {userRole === 'admin' && (
                <Link to="/admin" className="nav-link">Dashboard</Link>
            )}

            {userRole === 'employer' && (
                <>
                    <Link to="/talent-pool" className="nav-link">Cari Talenta</Link>
                    <Link to="/create-job" className="nav-link">Buat Lowongan</Link>
                </>
            )}
            
            {userRole === 'seeker' && (
                <Link to="/my-applications" className="nav-link">Lamaran Saya</Link>
            )}

            {token && (
                <Link to="/profile" className="nav-link">Profil</Link>
            )}

            <button onClick={toggleTheme} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.6rem', borderRadius: '50%', width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 12px var(--shadow)' }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {!token ? (
                <div style={{ display: 'flex', gap: '1.2rem' }}>
                    <Link to="/login" className="btn-animate" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: '800', padding: '0.7rem 2rem', border: '2px solid #3b82f6', borderRadius: '12px', display: 'inline-block', backgroundColor: 'transparent' }}>Login</Link>
                    <Link to="/register" className="btn-animate" style={{ textDecoration: 'none', color: '#ffffff', backgroundColor: '#3b82f6', fontWeight: '800', padding: '0.7rem 2rem', border: '2px solid #3b82f6', borderRadius: '12px', display: 'inline-block' }}>Daftar</Link>
                </div>
            ) : (
                <button onClick={handleLogout} className="btn-animate" style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.7rem 2rem', borderRadius: '12px', fontWeight: '800', fontSize: '1.05rem' }}>Logout</button>
            )}
          </div>
        </nav>
        
        <div className="page-transition" style={{ flex: 1, padding: '4rem 2rem', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/apply/:jobId" element={<ApplyJob />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/manage-applicants/:jobId" element={<ManageApplicants />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/talent-pool" element={<TalentPool />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;