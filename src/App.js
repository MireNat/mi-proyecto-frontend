// src/App.js
import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const token = localStorage.getItem('token');

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    // Si no hay usuario ni token, redirigir a login
    if (!user && !token) {
        return <Navigate to="/login" />;
    }

    // Si hay token o usuario, mostrar la ruta protegida
    return children;
};

function App() {
    // Efecto para inicializar debugging
    useEffect(() => {
        console.log('App inicializada - Versión 1.0.1');
        console.log('Token en localStorage:', localStorage.getItem('token'));
    }, []);

    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
