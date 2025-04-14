// src/components/TaskItem.js
import { useState } from 'react';
import { updateTask, deleteTask } from '../services/taskService';

const TaskItem = ({ task, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Validar que la tarea sea un objeto válido
    if (!task || typeof task !== 'object') {
        console.error('Tarea inválida recibida:', task);
        return <div className="error-message">Tarea inválida</div>;
    }

    console.log('Renderizando tarea:', task);

    const formatDate = (dateString) => {
        if (!dateString) return 'Sin fecha';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Fecha inválida';
            return date.toLocaleDateString();
        } catch (err) {
            console.error('Error al formatear fecha:', err);
            return 'Error en fecha';
        }
    };

    const getStatusBadgeClass = (status) => {
        if (!status) return 'status-badge';

        switch (status.toLowerCase()) {
            case 'pendiente':
                return 'status-badge pending';
            case 'en progreso':
            case 'en-progreso':
            case 'in progress':
            case 'in-progress':
                return 'status-badge in-progress';
            case 'completada':
            case 'completed':
            case 'complete':
                return 'status-badge completed';
            default:
                return 'status-badge';
        }
    };

    const handleStatusChange = async (newStatus) => {
        // Verificar que la tarea tenga un ID válido
        if (!task._id && task._id !== 0) {
            console.error('Intento de cambiar el estado de una tarea sin ID:', task);
            setError('No se puede actualizar esta tarea porque no tiene un ID válido');
            setTimeout(() => setError(''), 3000);
            return;
        }

        console.log(`Intentando cambiar estado de tarea ${task._id} de "${task.status}" a "${newStatus}"`);

        // Validar cambios de estado según las reglas
        if (
            (task.status === 'pendiente' && newStatus !== 'en progreso') ||
            (task.status === 'en progreso' && newStatus !== 'completada') ||
            task.status === 'completada'
        ) {
            setError(`Cambio de estado no permitido: ${task.status} → ${newStatus}`);
            setTimeout(() => setError(''), 3000);
            return;
        }

        setIsLoading(true);
        try {
            // Crear una copia de la tarea con el nuevo estado
            const updatedTask = { ...task, status: newStatus };
            console.log('Datos que se enviarán al servidor:', updatedTask);
            console.log('URL para actualización:', `/api/tasks/${task._id}`);

            await updateTask(task._id, updatedTask);
            console.log('Estado actualizado correctamente');

            if (onUpdate) {
                console.log('Llamando a onUpdate');
                onUpdate();
            }
        } catch (err) {
            console.error('Error al actualizar estado:', err);
            setError(err.message || 'Error al actualizar estado');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        // Verificar que la tarea tenga un ID válido
        if (!task._id && task._id !== 0) {
            console.error('Intento de eliminar una tarea sin ID:', task);
            setError('No se puede eliminar esta tarea porque no tiene un ID válido');
            setTimeout(() => setError(''), 3000);
            return;
        }

        // Solo permitir eliminar tareas completadas
        if (task.status !== 'completada') {
            setError('Solo se pueden eliminar tareas completadas');
            setTimeout(() => setError(''), 3000);
            return;
        }

        if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
            setIsLoading(true);
            try {
                console.log(`Eliminando tarea ${task._id}`);
                console.log('URL para eliminación:', `/api/tasks/${task._id}`);

                await deleteTask(task._id);
                console.log('Tarea eliminada correctamente');

                if (onUpdate) {
                    console.log('Llamando a onUpdate después de eliminar');
                    onUpdate();
                }
            } catch (err) {
                console.error('Error al eliminar la tarea:', err);
                setError(err.message || 'Error al eliminar la tarea');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="task-item">
            {error && <div className="error-message">{error}</div>}
            <div className="task-header">
                <h3>{task.title || 'Sin título'}</h3>
                <span className={getStatusBadgeClass(task.status)}>
          {task.status || 'sin estado'}
        </span>
            </div>
            {task.description && (
                <div className="task-description">{task.description}</div>
            )}
            <div className="task-footer">
                <div className="task-due-date">
                    Fecha límite: {formatDate(task.dueDate)}
                </div>
                <div className="task-id" style={{fontSize: '0.8rem', color: '#888', marginBottom: '8px'}}>
                    ID: {task._id}
                </div>
                <div className="task-actions">
                    {task.status === 'pendiente' && (
                        <button
                            onClick={() => handleStatusChange('en progreso')}
                            disabled={isLoading}
                            className="btn btn-progress"
                        >
                            Marcar en progreso
                        </button>
                    )}
                    {task.status === 'en progreso' && (
                        <button
                            onClick={() => handleStatusChange('completada')}
                            disabled={isLoading}
                            className="btn btn-complete"
                        >
                            Marcar como completada
                        </button>
                    )}
                    {task.status === 'completada' && (
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="btn btn-delete"
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
