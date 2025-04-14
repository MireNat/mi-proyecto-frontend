// src/pages/Login.js
import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import Header from '../components/Header';

const Login = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirigir si el usuario ya está autenticado
    useEffect(() => {
        console.log('Estado de autenticación en Login:', { user, token: localStorage.getItem('token') });

        // Verificar si hay un token en localStorage aunque el contexto no lo haya cargado aún
        const token = localStorage.getItem('token');

        if (user || token) {
            console.log('Usuario ya autenticado, redirigiendo a /dashboard');
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="login-page">
            <Header />
            <main className="auth-container">
                <LoginForm />
                <p className="auth-redirect">
                    ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
                </p>
            </main>
        </div>
    );
};

export default Login;
