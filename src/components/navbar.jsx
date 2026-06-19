import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ color: '#0f172a', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Smart Economy</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {userName && (
                    <span style={{ color: '#334155', fontWeight: '600', fontSize: '1rem' }}>
                        Halo, {userName}
                    </span>
                )}
                
                <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Navbar;