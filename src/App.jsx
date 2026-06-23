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
import EditJob from './pages/EditJob';

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

            /* --- REVOLUSI DESAIN NAVIGASI MOBILE (ULTRA-COMPACT) --- */
            @media (max-width: 768px) {
              nav { 
                padding: 0.6rem 1rem !important; 
                flex-direction: column !important; 
                gap: 0.6rem !important; 
                position: relative !important; 
              }
              nav h2 { font-size: 1.6rem !important; text-align: center; }
              nav > div { 
                flex-direction: row !important; 
                flex-wrap: wrap !important; 
                justify-content: center !important; 
                gap: 0.5rem !important; 
                width: 100% !important; 
              }
              .nav-link { 
                width: auto !important; 
                padding: 0.4rem 0.8rem !important; 
                font-size: 0.85rem !important; 
                background-color: var(--input-bg); 
                border-radius: 999px !important; 
                border: 1px solid var(--border);
                margin: 0 !important;
              }
              .nav-link::after { display: none; }
              nav button.btn-animate, nav a.btn-animate { 
                width: auto !important; 
                padding: 0.4rem 1rem !important; 
                font-size: 0.85rem !important; 
                margin: 0 !important; 
              }
              nav button:not(.btn-animate) {
                width: 32px !important;
                height: 32px !important;
                padding: 0 !important;
                font-size: 0.9rem !important;
              }

              /* --- KOREKSI PENGECUALIAN CHECKBOX MUTLAK --- */
              .page-transition { padding: 1.5rem 1rem !important; }
              div[style*="padding: 4.5rem"], div[style*="padding: 3rem"], 
              div[style*="padding: 3.5rem"], div[style*="padding: 2.5rem"], 
              div[style*="padding: 2rem"] {
                padding: 1.2rem 1rem !important; 
                border-radius: 16px !important;
              }
              .hover-card { padding: 1.2rem !important; }
              div[style*="grid-template-columns"], div[style*="grid"] { grid-template-columns: 1fr !important; gap: 1rem !important; }
              h1 { font-size: 1.6rem !important; line-height: 1.3 !important; }
              h2 { font-size: 1.4rem !important; line-height: 1.3 !important; }
              h3 { font-size: 1.1rem !important; }
              
              /* PERHATIKAN BARIS INI: Kita mengecualikan tipe checkbox dan file */
              .search-focus, select, input:not([type="checkbox"]):not([type="file"]), textarea { 
                width: 100% !important; 
                min-width: 100% !important; 
                box-sizing: border-box !important; 
                margin-bottom: 0.5rem; 
              }
              
              div[style*="position: sticky"] { position: relative !important; top: auto !important; margin-top: 1.5rem; }
              form > div[style*="display: flex"][style*="gap: 1rem"] { flex-direction: column !important; gap: 0.8rem !important; }
              form button[type="submit"] { width: 100% !important; }
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
            <Route path="/edit-job/:jobId" element={<EditJob />} />
            </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;