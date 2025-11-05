# Distrital 4 - Jefatura

Sistema de gestión de novedades para la Jefatura Distrital 4.

## 🚀 Despliegue en Render con PostgreSQL

Esta guía te ayudará a desplegar la aplicación en Render usando GitHub y PostgreSQL.

## 📋 Prerrequisitos

1. Cuenta en [GitHub](https://github.com)
2. Cuenta en [Render](https://render.com)
3. Git instalado en tu máquina local

## 📦 Configuración Inicial

### 1. Preparar el repositorio en GitHub

1. **Crear un nuevo repositorio en GitHub**
   ```bash
   # En GitHub, crea un nuevo repositorio llamado "distrital4-jefatura"
   ```

2. **Inicializar Git en tu proyecto local** (si aún no lo has hecho)
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Preparado para Render"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/distrital4-jefatura.git
   git push -u origin main
   ```

### 2. Configurar PostgreSQL en Render

1. **Inicia sesión en Render** y ve al dashboard
2. **Crea una nueva base de datos PostgreSQL:**
   - Haz clic en "New +" → "PostgreSQL"
   - Nombre: `distrital4-postgres`
   - Base de datos: `distrital4`
   - Usuario: `distrital4_user`
   - Plan: Free (o el plan que prefieras)
   - Región: Elige la más cercana a tus usuarios
   - Haz clic en "Create Database"

3. **Copia la conexión interna:**
   - Una vez creada, ve a la configuración de la base de datos
   - Copia la "Internal Database URL" (será algo como: `postgresql://user:password@host:5432/database`)

### 3. Desplegar la aplicación web en Render

1. **Crea un nuevo Web Service:**
   - Haz clic en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio `distrital4-jefatura`

2. **Configuración del servicio:**
   - **Name:** `distrital4-jefatura`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (o el plan que prefieras)

3. **Variables de entorno:**
   Agrega las siguientes variables de entorno en la sección "Environment Variables":
   
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=<Pega aquí la Internal Database URL de PostgreSQL>
   JWT_SECRET=<Genera una clave secreta segura de al menos 32 caracteres>
   JWT_EXPIRES_IN=8h
   ALLOWED_ORIGINS=https://distrital4-jefatura.onrender.com
   DB_ALTER=false
   BACKUP_FREQUENCY=daily
   ADMIN_DEFAULT_PASSWORD=<Cambia esta contraseña por una segura>
   ```

   **⚠️ IMPORTANTE:**
   - Genera un `JWT_SECRET` seguro (puedes usar: `openssl rand -base64 32`)
   - Cambia `ADMIN_DEFAULT_PASSWORD` por una contraseña segura
   - `ALLOWED_ORIGINS` debe ser la URL de tu aplicación en Render

4. **Conectar la base de datos:**
   - En la sección "Connections", haz clic en "Link Database"
   - Selecciona la base de datos PostgreSQL que creaste anteriormente
   - Esto automáticamente agregará la variable `DATABASE_URL`

5. **Desplegar:**
   - Haz clic en "Create Web Service"
   - Render comenzará a construir y desplegar tu aplicación

## 🔧 Configuración Adicional

### Generar JWT_SECRET seguro

En tu terminal local:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Verificar el despliegue

1. Una vez desplegado, Render te dará una URL como: `https://distrital4-jefatura.onrender.com`
2. Visita la URL para verificar que la aplicación funciona
3. El primer inicio puede tardar unos minutos (cold start en plan gratuito)

## 📝 Migración desde SQLite a PostgreSQL

Si ya tienes datos en SQLite, necesitarás migrarlos:

1. **Exportar datos de SQLite:**
   ```bash
   # Instalar sqlite3 si no lo tienes
   sqlite3 database.sqlite .dump > backup.sql
   ```

2. **Importar a PostgreSQL:**
   - Conecta a tu base de datos PostgreSQL en Render
   - Usa pgAdmin, DBeaver o la terminal de Render
   - Adapta y ejecuta los scripts SQL necesarios

## 🔒 Seguridad

- ✅ Nunca subas el archivo `.env` a GitHub
- ✅ Usa contraseñas seguras para producción
- ✅ Cambia la contraseña del admin después del primer login
- ✅ Mantén `JWT_SECRET` seguro y único
- ✅ Configura `ALLOWED_ORIGINS` correctamente en producción

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verifica que `DATABASE_URL` esté configurada correctamente
- Asegúrate de que la base de datos esté "linked" en Render
- Revisa los logs de Render para más detalles

### Error 503 - Service Unavailable
- El servicio puede estar en "sleep" (plan gratuito)
- Espera unos segundos y recarga
- Considera usar un plan pagado para evitar sleep

### Las tablas no se crean
- Verifica que `DB_ALTER=false` en producción
- Revisa los logs de Render para errores de migración
- Las tablas se crean automáticamente en el primer inicio

## 📚 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Producción local
npm start

# Ver logs en Render
# Ve al dashboard de Render → Logs
```

## 🌐 URLs Importantes

- **Render Dashboard:** https://dashboard.render.com
- **Documentación Render:** https://render.com/docs
- **PostgreSQL en Render:** https://render.com/docs/databases

## 📞 Soporte

Para problemas con Render, consulta su documentación o soporte.
Para problemas con la aplicación, revisa los logs en el dashboard de Render.

