// src/components/TaskList.js
import { useState, useEffect } from 'react';
import { getTasks } from '../services/taskService';
import TaskItem from './TaskItem';

const TaskList = ({ filters = {}, onTaskUpdate }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshCount, setRefreshCount] = useState(0);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            console.log('Obteniendo tareas con filtros:', filters);
            const result = await getTasks(filters);
            console.log('Resultado de getTasks:', result);

            // Asegurarse de que siempre tengamos un array
            const taskArray = result.tasks || [];
            console.log('Array de tareas procesado:', taskArray);

            setTasks(taskArray);
            setError('');
        } catch (err) {
            console.error('Error en fetchTasks:', err);
            setError('Error al cargar las tareas: ' + (err.message || 'Error desconocido'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();

        // Configurar un intervalo para actualizar periódicamente
        const intervalId = setInterval(() => {
            console.log('Actualizando tareas automáticamente...');
            setRefreshCount(prev => prev + 1);
        }, 10000); // Cada 10 segundos

        return () => clearInterval(intervalId);
    }, [filters]); // No incluimos refreshCount aquí para evitar bucles

    // Efecto separado para la actualización por refreshCount
    useEffect(() => {
        if (refreshCount > 0) {
            fetchTasks();
        }
    }, [refreshCount]);

    const handleTaskUpdated = () => {
        console.log('Tarea actualizada, refrescando lista...');
        fetchTasks();
        if (onTaskUpdate) onTaskUpdate();
    };

    if (loading && tasks.length === 0) return <div className="loading">Cargando tareas...</div>;
    if (error) return <div className="error-message">{error}</div>;

    // Debug del array de tareas
    console.log('Renderizando lista con tareas:', tasks);

    return (
        <div className="task-list">
            {tasks.length === 0 ? (
                <div className="no-tasks">No hay tareas disponibles</div>
            ) : (
                tasks.map(task => (
                    <TaskItem
                        key={task.id || Math.random().toString()}
                        task={task}
                        onUpdate={handleTaskUpdated}
                    />
                ))
            )}

            {/*/!* Botón para recargar manualmente *!/*/}
            {/*<button*/}
            {/*    className="refresh-btn"*/}
            {/*    onClick={() => {*/}
            {/*        console.log('Recargando manualmente...');*/}
            {/*        fetchTasks();*/}
            {/*    }}*/}
            {/*    style={{ marginTop: '20px' }}*/}
            {/*>*/}
            {/*    Recargar tareas*/}
            {/*</button>*/}
        </div>
    );
};

export default TaskList;
