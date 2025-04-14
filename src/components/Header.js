// src/components/Header.js
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="logo">
                <Link to="/">Gestor de Tareas</Link>
            </div>
            <nav className="nav-links">
                {user ? (
                    <>
                        <span className="welcome-message">Hola, {user.name}</span>
                        <Link to="/dashboard">Dashboard</Link>
                        <button onClick={handleLogout} className="logout-btn">
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Iniciar Sesión</Link>
                        <Link to="/register">Registrarse</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
