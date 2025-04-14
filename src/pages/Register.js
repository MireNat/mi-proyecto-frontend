// src/pages/Register.js
import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RegisterForm from '../components/RegisterForm';
import Header from '../components/Header';

const Register = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirigir si el usuario ya está autenticado
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="register-page">
            <Header />
            <main className="auth-container">
                <RegisterForm />
                <p className="auth-redirect">
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </p>
            </main>
        </div>
    );
};

export default Register;
