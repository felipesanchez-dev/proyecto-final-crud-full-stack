APIS A CONECTAR



# API de Sistema de Encuestas

Esta es la documentación para el backend de la aplicación de encuestas, desarrollado con Node.js, Express, TypeScript y MongoDB. La API sigue una arquitectura limpia y proporciona endpoints para gestionar usuarios, encuestas, preguntas y respuestas.

## Características

-   **Autenticación de Usuarios**: Endpoints para registro e inicio de sesión con JSON Web Tokens (JWT).
-   **Gestión de Encuestas y Preguntas**: CRUD completo para encuestas y sus preguntas anidadas.
-   **Respuestas y Resultados**: Endpoints para que los usuarios respondan a encuestas y para consultar los resultados agregados.
-   **Seguridad**: Las rutas de autenticación están funcionales. Las rutas de encuestas/preguntas están actualmente desprotegidas para facilitar el desarrollo local.
-   **Documentación**: Documentación interactiva de la API con Swagger.

---

## Instalación y Ejecución

Sigue estos pasos para levantar el servidor en tu entorno local.

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_DIRECTORIO>
```

### 2. Instalar Dependencias

Asegúrate de tener [Node.js](https://nodejs.org/) instalado. Luego, instala las dependencias del proyecto.

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto. Puedes copiar el archivo `.env.template` como base:

```bash
cp .env.template .env
```

Abre el archivo `.env` y ajusta las variables según tu configuración:

```
# Puerto en el que correrá el servidor
PORT=3000

# URL de conexión a tu base de datos MongoDB
MONGO_URL=mongodb://localhost:27017

# Nombre de la base de datos (puedes usar tu apellido como pide el proyecto)
MONGO_DB_NAME=encuestas-db

# Semilla secreta para la firma de JSON Web Tokens
JWT_SEED=ESTA-ES-MI-SEMILLA-SECRETA
```

### 4. Ejecutar el Servidor

Para iniciar el servidor en modo de desarrollo (con recarga automática):

```bash
npm run dev
```

El servidor estará corriendo en la URL `http://localhost:3000`.

---

## Documentación Interactiva (Swagger)

Para una guía completa, interactiva y detallada de todos los endpoints, visita la documentación de Swagger una vez que el servidor esté en ejecución:

**URL de Swagger**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

En la interfaz de Swagger podrás:
-   Ver todos los endpoints disponibles.
-   Probar cada endpoint directamente desde el navegador.
-   Ver los esquemas de datos (DTOs) para las peticiones y respuestas.
-   Para probar las rutas de autenticación, puedes usar el botón "Authorize".

---

## Guía de Endpoints

A continuación, un resumen de los endpoints disponibles.

### Autenticación (`/api/auth`)

#### `POST /login`
-   **Descripción**: Inicia sesión con un usuario existente.
-   **Cuerpo de la Petición (Campos requeridos)**:
    ```json
    {
      "email": "correo@ejemplo.com",
      "password": "tu-password"
    }
    ```

#### `POST /register`
-   **Descripción**: Registra un nuevo usuario.
-   **Cuerpo de la Petición (Campos requeridos)**:
    ```json
    {
      "name": "Nombre Apellido",
      "email": "correo@ejemplo.com",
      "password": "tu-password"
    }
    ```

#### `POST /admin-login`
-   **Descripción**: Inicia sesión como administrador. Falla si el usuario no tiene el rol `ADMIN_ROLE`.
-   **Cuerpo de la Petición (Campos requeridos)**:
    ```json
    {
      "email": "admin@ejemplo.com",
      "password": "tu-password-admin"
    }
    ```

#### `GET /revalidate-token`
-   **Descripción**: Revalida un token de sesión existente. Requiere enviar el token actual en la cabecera `Authorization` como `Bearer <token>`.
-   **Respuesta Exitosa (200)**: Devuelve los datos del usuario y un nuevo token con la fecha de expiración renovada.
    ```json
    {
      "user": { "id": "...", "name": "...", "email": "...", "roles": ["..."] },
      "token": "ey... (nuevo token)"
    }
    ```

### Encuestas (`/api/encuestas`)

#### `GET /`
-   **Descripción**: Obtiene una lista de todas las encuestas.

#### `GET /:id`
-   **Descripción**: Obtiene una encuesta específica por su ID.

#### `POST /`
-   **Descripción**: Crea una nueva encuesta.
-   **Cuerpo de la Petición (Campos requeridos)**:
    ```json
    {
      "nombreEncuesta": "Encuesta de Satisfacción",
      "descripcion": "Feedback sobre nuestros servicios"
    }
    ```

#### `PUT /:id`
-   **Descripción**: Actualiza el nombre o la descripción de una encuesta.

#### `DELETE /:id`
-   **Descripción**: Elimina una encuesta por su ID.

### Preguntas (`/api/encuestas/:id/preguntas`)

#### `POST /:id/preguntas`
-   **Descripción**: Añade una nueva pregunta a una encuesta existente.
-   **Cuerpo de la Petición (Campos requeridos)**:
    ```json
    {
      "numPregunta": 1,
      "textoPregunta": "¿Qué tan satisfecho estás?",
      "tipo": "opcion", // "texto", "opcion", o "boolean"
      "opciones": ["Mucho", "Poco", "Nada"] // Requerido si tipo es "opcion"
    }
    ```

#### `PUT /:id/preguntas/:preguntaId`
-   **Descripción**: Actualiza una pregunta existente dentro de una encuesta.

#### `DELETE /:id/preguntas/:preguntaId`
-   **Descripción**: Elimina una pregunta de una encuesta.

### Respuestas y Resultados (`/api/encuestas/:id/...`)

#### `POST /:id/responder`
-   **Descripción**: Envía un conjunto de respuestas para una encuesta específica.
-   **Cuerpo de la Petición (Campos requeridos)**:
    ```json
    {
      "usuarioId": "60d... (Opcional)",
      "respuestas": [
        {
          "preguntaId": "60d... (ID de la pregunta)",
          "valor": "Mucho"
        },
        {
          "preguntaId": "60d... (ID de otra pregunta)",
          "valor": true
        }
      ]
    }
    ```

#### `GET /:id/resultados`
-   **Descripción**: Obtiene los resultados agregados para una encuesta.
-   **Respuesta Exitosa (200)**:
    ```json
    {
      "encuesta": {
        "id": "...",
        "nombreEncuesta": "Encuesta de Satisfacción",
        "descripcion": "..."
      },
      "resumen": [
        {
          "preguntaId": "...",
          "textoPregunta": "¿Qué tan satisfecho estás?",
          "tipo": "opcion",
          "resultados": [
            { "valor": "Mucho", "conteo": 15 },
            { "valor": "Poco", "conteo": 5 }
          ]
        }
      ]
    }
    ```
