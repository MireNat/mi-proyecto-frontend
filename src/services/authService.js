// src/services/authService.js
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
const API_URL = `${BASE_URL}/auth`;

// Registrar un nuevo usuario
export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error en el registro');
    }
};

// Iniciar sesión
export const login = async (credentials) => {
    try {
        console.log('Enviando solicitud de login a:', `${API_URL}/login`);
        console.log('Credenciales:', credentials);

        const response = await axios.post(`${API_URL}/login`, credentials);
        console.log('Respuesta completa del servidor:', response);

        if (response.data && response.data.token) {
            // Asegurarnos de que la respuesta tenga el formato esperado
            return {
                token: response.data.token,
                user: response.data.user || { email: credentials.email } // Si no hay user, usamos al menos el email
            };
        } else {
            console.error('Formato de respuesta inesperado:', response.data);
            throw new Error('La respuesta del servidor no contiene un token válido');
        }
    } catch (error) {
        console.error('Error completo:', error);
        if (error.response) {
            console.error('Datos de error:', error.response.data);
            console.error('Estado HTTP:', error.response.status);
        }
        throw error.response ? error.response.data : new Error('Error en el inicio de sesión');
    }
};

// Obtener datos del usuario autenticado
export const getUserData = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error al obtener datos del usuario');
    }
};
