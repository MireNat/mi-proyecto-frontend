// src/services/taskService.js
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
const API_URL = `${BASE_URL}/tasks`;

// Configurar instancia de axios con interceptor para añadir token
const taskApi = axios.create({
    baseURL: 'http://localhost:4000/api'
});

// Log cada vez que se instancia el servicio
console.log('Servicio de tareas inicializado:', { apiUrl: API_URL });

taskApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Interceptor de solicitud - Token disponible:', !!token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token añadido a la solicitud');
        } else {
            console.warn('No se encontró token para la solicitud');
        }

        console.log('Configuración final de la solicitud:', {
            url: config.url,
            method: config.method,
            hasAuthHeader: !!config.headers.Authorization
        });

        return config;
    },
    (error) => {
        console.error('Error en interceptor de solicitud:', error);
        return Promise.reject(error);
    }
);

// Interceptor para respuestas
taskApi.interceptors.response.use(
    (response) => {
        console.log(`Respuesta exitosa de ${response.config.url}:`, {
            status: response.status,
            statusText: response.statusText
        });
        return response;
    },
    (error) => {
        console.error('Error en la respuesta:', error);
        if (error.response) {
            console.error('Detalles de la respuesta con error:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });

            // Si el error es 401 (no autorizado), podría ser un token expirado
            if (error.response.status === 401) {
                console.warn('Token posiblemente expirado o inválido. Considerar cerrar sesión.');
                // Aquí podrías implementar un manejo de sesión expirada
            }
        }
        return Promise.reject(error);
    }
);

// Obtener todas las tareas
export const getTasks = async (filters = {}) => {
    try {
        // Construir parámetros de consulta para filtros
        let queryParams = new URLSearchParams();
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.search) queryParams.append('search', filters.search);

        const queryString = queryParams.toString();
        const url = queryString ? `/tasks?${queryString}` : '/tasks';

        console.log('Obteniendo tareas desde:', url);
        const response = await taskApi.get(url);
        console.log('Respuesta completa de tareas:', response);

        // Normalizar la respuesta para asegurar que siempre tengamos un array de tareas
        let tasks = [];

        if (response.data && Array.isArray(response.data)) {
            // Si la respuesta ya es un array
            tasks = response.data;
        } else if (response.data && Array.isArray(response.data.tasks)) {
            // Si la respuesta tiene un objeto con propiedad 'tasks'
            tasks = response.data.tasks;
        } else if (response.data) {
            console.warn('Formato de respuesta inesperado, intentando adaptarlo:', response.data);
            // Intentar extraer tareas del objeto
            const possibleTasks = Object.values(response.data).find(val => Array.isArray(val));
            if (possibleTasks) {
                tasks = possibleTasks;
            }
        }

        console.log('Tareas procesadas:', tasks);
        return { tasks };
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        if (error.response) {
            console.error('Datos de error:', error.response.data);
            console.error('Estado HTTP:', error.response.status);
        }
        throw error.response ? error.response.data : new Error('Error al obtener tareas');
    }
};

// Obtener una tarea por ID
export const getTaskById = async (taskId) => {
    try {
        if (!taskId && taskId !== 0) {
            throw new Error('ID de tarea no válido');
        }
        console.log(`Obteniendo tarea con ID: ${taskId}`);

        const response = await taskApi.get(`/tasks/${taskId}`);
        console.log('Respuesta de tarea por ID:', response);

        return response.data;
    } catch (error) {
        console.error(`Error al obtener tarea ${taskId}:`, error);
        throw error.response ? error.response.data : new Error('Error al obtener la tarea');
    }
};

// Crear una nueva tarea
export const createTask = async (taskData) => {
    try {
        console.log('Enviando solicitud para crear tarea:', taskData);

        const response = await taskApi.post('/tasks', taskData);
        console.log('Respuesta completa de creación:', response);

        return response.data;
    } catch (error) {
        console.error('Error completo al crear tarea:', error);
        if (error.response) {
            console.error('Datos de error:', error.response.data);
            console.error('Estado HTTP:', error.response.status);
        }
        throw error.response ? error.response.data : new Error('Error al crear la tarea');
    }
};

// Actualizar una tarea
export const updateTask = async (taskId, taskData) => {
    try {
        if (!taskId && taskId !== 0) {
            throw new Error('ID de tarea no válido para actualización');
        }

        console.log(`Enviando solicitud para actualizar tarea ${taskId}:`, taskData);
        console.log('URL:', `/tasks/${taskId}`);

        const response = await taskApi.put(`/tasks/${taskId}`, taskData);
        console.log('Respuesta completa de actualización:', response);

        return response.data;
    } catch (error) {
        console.error(`Error completo al actualizar tarea ${taskId}:`, error);
        if (error.response) {
            console.error('Datos de error:', error.response.data);
            console.error('Estado HTTP:', error.response.status);
        }
        throw error.response ? error.response.data : new Error('Error al actualizar la tarea');
    }
};

// Eliminar una tarea
export const deleteTask = async (taskId) => {
    try {
        if (!taskId && taskId !== 0) {
            throw new Error('ID de tarea no válido para eliminación');
        }

        console.log(`Enviando solicitud para eliminar tarea ${taskId}`);
        console.log('URL:', `/tasks/${taskId}`);

        const response = await taskApi.delete(`/tasks/${taskId}`);
        console.log('Respuesta completa de eliminación:', response);

        return response.data;
    } catch (error) {
        console.error(`Error completo al eliminar tarea ${taskId}:`, error);
        if (error.response) {
            console.error('Datos de error:', error.response.data);
            console.error('Estado HTTP:', error.response.status);
        }
        throw error.response ? error.response.data : new Error('Error al eliminar la tarea');
    }
};
