// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar si existe un token en localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchUserData(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserData = async (authToken) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                // Si hay un error, limpiar el token
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData, authToken) => {
        console.log('AuthContext.login llamado con:', { userData, authToken });

        // Asegurarse de que tenemos datos válidos
        if (!userData) userData = {};
        if (!authToken) {
            console.error('Error: Se intentó iniciar sesión sin token');
            return false;
        }

        // Primero guardar en localStorage
        localStorage.setItem('token', authToken);
        console.log('Token guardado en localStorage');

        // Luego actualizar el estado
        setUser(userData);
        setToken(authToken);
        console.log('Estado actualizado correctamente');

        return true;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
