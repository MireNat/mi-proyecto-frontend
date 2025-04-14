// src/components/TaskForm.js
import { useState, useEffect } from 'react';
import { createTask, updateTask } from '../services/taskService';

const TaskForm = ({ task, onSuccess }) => {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        status: 'pendiente',
        dueDate: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!task;

    useEffect(() => {
        if (task) {
            // Formatear la fecha para el input date
            let formattedDueDate = '';
            if (task.dueDate) {
                const date = new Date(task.dueDate);
                formattedDueDate = date.toISOString().split('T')[0];
            }

            setTaskData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'pendiente',
                dueDate: formattedDueDate
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log('Enviando datos de tarea:', taskData);

            if (isEditing) {
                console.log(`Actualizando tarea ${task.id}`);
                const result = await updateTask(task.id, taskData);
                console.log('Respuesta de actualización:', result);
            } else {
                console.log('Creando nueva tarea');
                const result = await createTask(taskData);
                console.log('Respuesta de creación:', result);
            }

            // Limpiar el formulario si es nueva tarea
            if (!isEditing) {
                setTaskData({
                    title: '',
                    description: '',
                    status: 'pendiente',
                    dueDate: ''
                });
            }

            // Esperar un momento para que el backend procese los cambios
            setTimeout(() => {
                // Callback para actualizar lista de tareas
                if (onSuccess) {
                    console.log('Llamando a onSuccess después de guardar tarea');
                    onSuccess();
                }
            }, 500);

        } catch (err) {
            console.error('Error al guardar tarea:', err);
            setError(err.message || 'Error al guardar la tarea');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="task-form">
            <h2>{isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Título*</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={taskData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        name="description"
                        value={taskData.description}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>
                {isEditing && (
                    <div className="form-group">
                        <label htmlFor="status">Estado</label>
                        <select
                            id="status"
                            name="status"
                            value={taskData.status}
                            onChange={handleChange}
                            disabled={
                                // Solo permitir ciertos cambios de estado según reglas del proyecto
                                (task.status === 'completada') ||
                                (task.status === 'en progreso' && taskData.status === 'pendiente')
                            }
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="en progreso">En Progreso</option>
                            <option value="completada">Completada</option>
                        </select>
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="dueDate">Fecha límite</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={taskData.dueDate}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
                </button>
            </form>
        </div>
    );
};

export default TaskForm;
