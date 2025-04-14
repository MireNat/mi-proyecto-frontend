# Instrucciones para el Proyecto Frontend de Gestor de Tareas

## Resumen del Proyecto

Este proyecto frontend en React implementa una interfaz de usuario para tu Gestor de Tareas que se conecta con tu backend existente en Node.js. La estructura sigue las especificaciones del proyecto y permite realizar todas las operaciones CRUD requeridas.

## Estructura del Proyecto

```
/src
  /components       # Componentes reutilizables
  /pages            # Páginas principales
  /context          # Context API para estado global
  /services         # Servicios para conectar con el backend
  App.js            # Componente principal
  App.css           # Estilos globales
  index.js          # Punto de entrada
```

## Pasos para configurar y ejecutar el proyecto

1. **Crear el proyecto**

```bash
npx create-react-app task-manager-frontend
cd task-manager-frontend
```

2. **Instalar dependencias**

```bash
npm install axios react-router-dom
```

3. **Configurar las variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```
REACT_APP_API_URL=http://localhost:4000/api
```

Si tu backend se ejecuta en un puerto diferente o tienes un dominio específico cuando se despliega, actualiza la URL en consecuencia.

4. **Copiar los archivos del proyecto**

Copia todos los archivos proporcionados a la estructura correspondiente de tu proyecto.

5. **Configurar CORS en el backend**

Asegúrate de que tu backend tenga CORS habilitado para permitir solicitudes desde tu frontend:

```javascript
// En tu archivo principal del servidor (app.js o index.js)
const cors = require('cors');

app.use(cors());
```

6. **Iniciar el proyecto**

```bash
npm start
```

La aplicación debería iniciarse en [http://localhost:3000](http://localhost:3000)

## Configuración para producción

Antes de desplegar el frontend, modifica las variables de entorno para usar la URL de producción de tu backend:

1. Crea un archivo `.env.production`:

```
REACT_APP_API_URL=https://tu-backend-en-produccion.com/api
```

2. Construye la aplicación para producción:

```bash
npm run build
```

3. Despliega la carpeta `build` en Vercel u otro servicio:

Para Vercel, puedes instalar la CLI y ejecutar:

```bash
npm install -g vercel
vercel login
vercel
```

## Puntos a verificar antes de entregar

1. **Funcionalidad completa de autenticación**:
    - Registro de usuario
    - Inicio de sesión
    - Rutas protegidas

2. **Gestión de tareas (CRUD)**:
    - Crear tareas con todos los campos requeridos
    - Visualizar la lista de tareas
    - Editar tareas respetando las reglas de estado
    - Eliminar tareas completadas

3. **Filtrado y búsqueda**:
    - Buscar tareas por título
    - Filtrar por estado (pendiente, en progreso, completada)

4. **Interfaz responsiva**:
    - Verificar la visualización en diferentes dispositivos

5. **Conexión con el backend**:
    - Todas las operaciones CRUD se realizan correctamente
    - Los tokens JWT se gestionan adecuadamente
    - Manejo de errores apropiado

## Notas adicionales

- Este frontend está diseñado para trabajar con la API especificada en los requisitos del proyecto.
- Asegúrate de que todos los endpoints en el backend correspondan con los utilizados en los servicios del frontend.
- Para personalizar los estilos, puedes modificar el archivo `App.css` o implementar una solución de estilo diferente como Tailwind CSS o Styled Components.
