// src/components/LoginForm.js
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/authService';

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login: authLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await login(credentials);
            console.log('Login exitoso:', result); // Logging para debug

            if (result && result.token) {
                // Primero guardar el token en localStorage directamente
                localStorage.setItem('token', result.token);

                // Luego actualizar el contexto
                authLogin(result.user || {}, result.token);

                // Usar setTimeout para asegurar que el estado se actualice antes de la redirección
                setTimeout(() => {
                    console.log('Redirigiendo a /dashboard');
                    navigate('/dashboard');
                }, 100);
            } else {
                throw new Error('No se recibió un token válido');
            }
        } catch (err) {
            console.error('Error en login:', err);
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-form">
            <h2>Iniciar Sesión</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
