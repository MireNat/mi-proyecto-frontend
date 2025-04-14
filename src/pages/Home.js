// src/pages/Home.js
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="home-page">
            <Header />
            <main className="home-content">
                <section className="hero">
                    <h1>Gestor de Tareas</h1>
                    <p className="subtitle">
                        Organiza tus tareas de manera eficiente y mantén el control de tus actividades
                    </p>
                    {user ? (
                        <Link to="/dashboard" className="cta-button">
                            Ir a mi Dashboard
                        </Link>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="cta-button">
                                Iniciar Sesión
                            </Link>
                            <Link to="/register" className="secondary-button">
                                Registrarse
                            </Link>
                        </div>
                    )}
                </section>
                <section className="features">
                    <h2>Características</h2>
                    <div className="feature-grid">
                        <div className="feature-card">
                            <h3>Organización Simple</h3>
                            <p>Crea, edita y organiza tus tareas de manera intuitiva</p>
                        </div>
                        <div className="feature-card">
                            <h3>Seguimiento de Estado</h3>
                            <p>Visualiza el progreso de tus tareas: pendiente, en progreso o completada</p>
                        </div>
                        <div className="feature-card">
                            <h3>Fechas Límite</h3>
                            <p>Establece fechas límite para mantenerte al día con tus responsabilidades</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;
