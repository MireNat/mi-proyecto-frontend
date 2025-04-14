// src/pages/Dashboard.js
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        search: ''
    });
    const [refreshKey, setRefreshKey] = useState(0);

    // Redirigir si el usuario no está autenticado
    useEffect(() => {
        console.log('Estado de autenticación en Dashboard:', { loading, user, token: localStorage.getItem('token') });

        // Verificar si hay un token en localStorage aunque el contexto no lo haya cargado aún
        const token = localStorage.getItem('token');

        if (!loading && !user && !token) {
            console.log('No hay usuario autenticado, redirigiendo a /login');
            navigate('/login');
        } else if (token && !user) {
            // Si hay token pero no hay usuario, intentar obtener los datos del usuario
            console.log('Hay token pero no hay datos de usuario, intentando cargar datos');
            // Podríamos implementar una función para cargar los datos del usuario aquí
        }
    }, [user, loading, navigate]);

    const handleTaskSuccess = () => {
        setShowTaskForm(false);
        setTaskToEdit(null);
        setRefreshKey(prev => prev + 1);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // La búsqueda se activará automáticamente por el cambio en los filtros
    };

    if (loading) return <div className="loading">Cargando...</div>;
    if (!user) return null; // No renderizar nada mientras redirige

    return (
        <div className="dashboard-page">
            <Header />
            <main className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Mi Dashboard</h1>
                    <button
                        className="new-task-btn"
                        onClick={() => setShowTaskForm(prev => !prev)}
                    >
                        {showTaskForm ? 'Cancelar' : 'Nueva Tarea'}
                    </button>
                </div>

                {showTaskForm && (
                    <div className="task-form-container">
                        <TaskForm
                            task={taskToEdit}
                            onSuccess={handleTaskSuccess}
                        />
                    </div>
                )}

                <div className="filters-section">
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            name="search"
                            placeholder="Buscar tareas..."
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                        <button type="submit">Buscar</button>
                    </form>

                    <div className="filter-controls">
                        <label htmlFor="status-filter">Filtrar por estado:</label>
                        <select
                            id="status-filter"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todos</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="en progreso">En Progreso</option>
                            <option value="completada">Completada</option>
                        </select>
                    </div>
                </div>

                <div className="tasks-container">
                    <TaskList
                        key={refreshKey}
                        filters={filters}
                        onTaskUpdate={() => setRefreshKey(prev => prev + 1)}
                    />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
