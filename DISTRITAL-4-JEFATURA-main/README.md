## DISTRITAL 4 - JEFATURA

### Requisitos
- Node.js LTS (incluye npm)
  - Windows: instalar desde `https://nodejs.org` o con `winget install OpenJS.NodeJS.LTS`
- PostgreSQL 12 o superior
  - Windows: instalar desde `https://www.postgresql.org/download/windows/` o con `winget install PostgreSQL.PostgreSQL`
  - Linux: `sudo apt install postgresql postgresql-contrib`

### Instalación
1) Abrir terminal en la carpeta del proyecto
```powershell
cd "C:\Users\TOSHIBA\Desktop\DISTRITAL-4-JEFATURA-main"
```
2) Instalar dependencias
```powershell
npm install
```

### Configuración de PostgreSQL

Antes de ejecutar el servidor, necesitas configurar PostgreSQL:

1. **Crear la base de datos:**
```powershell
# Conectar a PostgreSQL (Windows)
psql -U postgres

# Crear la base de datos
CREATE DATABASE distrital4_jefatura;

# Salir
\q
```

2. **Configurar variables de entorno:**
   - Crea un archivo `.env` en la raíz del proyecto (puedes copiar `.env.example` si existe)
   - O configura las variables directamente en PowerShell:
```powershell
$env:DB_HOST="localhost"
$env:DB_PORT="5432"
$env:DB_NAME="distrital4_jefatura"
$env:DB_USER="postgres"
$env:DB_PASSWORD="tu_contraseña_postgres"
$env:DB_SSL="false"
```

### Migración de datos (si tienes datos en SQLite)

Si ya tienes datos en SQLite y quieres migrarlos a PostgreSQL:

1. **Asegúrate de tener PostgreSQL configurado** (ver sección anterior)

2. **Ejecuta el script de migración:**
```powershell
npm run migrate
```

El script:
- Lee todos los datos de `database.sqlite`
- Los migra a PostgreSQL
- Evita duplicados (si ya existen datos en PostgreSQL)
- Muestra un resumen de la migración

**Nota:** El script es seguro y no elimina datos existentes. Si ya tienes datos en PostgreSQL, solo migrará los que no existen.

### Ejecución
Iniciar el servidor (Express + PostgreSQL):
```powershell
npm start
```
Si inicia correctamente verás: `Servidor corriendo en el puerto 3001` y `Conexión a la base de datos PostgreSQL establecida exitosamente`.

Abrir el frontend:
- Navegador: `http://localhost:3001/index.html`

Credenciales iniciales (se crea un admin si no existe):
- Usuario: `admin`
- Contraseña: `hijoteamo2`

### Configuración
- **Puerto:** por defecto 3001. Puedes cambiarlo con variable de entorno:
```powershell
$env:PORT=3002; npm start
```

- **Base de datos PostgreSQL:** El proyecto usa PostgreSQL. Configura las siguientes variables de entorno:
  - `DB_HOST`: Host de PostgreSQL (default: `localhost`)
  - `DB_PORT`: Puerto de PostgreSQL (default: `5432`)
  - `DB_NAME`: Nombre de la base de datos (default: `distrital4_jefatura`)
  - `DB_USER`: Usuario de PostgreSQL (default: `postgres`)
  - `DB_PASSWORD`: Contraseña de PostgreSQL (default: `postgres`)
  - `DB_SSL`: Habilitar SSL (default: `false`, usar `true` para conexiones remotas)
  - `DB_LOGGING`: Habilitar logs de SQL (default: `false`)
  - `DB_ALTER`: Permitir alteración automática de esquema (default: `false`)

Las tablas se crean automáticamente al iniciar el servidor por primera vez.

### Solución de problemas (Windows)
- PowerShell bloquea npm.ps1 (ExecutionPolicy):
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
# o usar directamente
& "C:\Program Files\nodejs\npm.cmd" -v
```
- `npm/node no se reconoce`: reinstala Node.js y vuelve a abrir la terminal. Verifica con:
```powershell
node -v
npm -v
```
- Error 401 al iniciar sesión: puede existir un admin previo. El usuario admin se crea automáticamente si no existe.
- Error de conexión a PostgreSQL: verifica que PostgreSQL esté corriendo y que las credenciales en las variables de entorno sean correctas.
  ```powershell
  # Verificar que PostgreSQL esté corriendo (Windows)
  Get-Service -Name postgresql*
  ```
- No carga el frontend: asegúrate de abrir `http://localhost:3001/index.html` (no `file:///...`).

### Endpoints principales (backend)
- `POST /login` — inicio de sesión (devuelve JWT)
- `GET /novedades` — listado (requiere JWT)
- `POST /novedades` — crear (roles oficiales)
- `PUT /novedades/:id` — actualizar (roles oficiales)
- `DELETE /novedades/:id` — eliminar (roles oficiales)
- `GET /users` — listar usuarios (admin)
- `DELETE /users/:id` — eliminar usuario (admin)

El servidor sirve archivos estáticos desde la raíz del proyecto (por ejemplo `index.html`).

### Scripts npm
- `npm start` — inicia el servidor con Node (`server.js`).
- `npm run dev` — inicia con recarga automática usando nodemon.
 - `npm run start:pm2` — inicia con PM2 usando `ecosystem.config.js` (dev por defecto).
 - `npm run start:prod` — inicia con PM2 en modo producción.
 - `npm run restart:prod` — reinicia la app en PM2 aplicando variables de entorno.
 - `npm run stop:prod` — detiene la app en PM2.
 - `npm run logs` — muestra logs en vivo de PM2.

### Notas
- La clave JWT está en `server.js` (usa variables de entorno en producción).
- `API_BASE_URL` en `index.html` apunta a `http://localhost:3001`.

Si `npm run dev` no arranca, asegúrate de instalar dependencias (incluye nodemon en devDependencies):
```powershell
npm install
```


## Despliegue en Producción (Linux + Nginx + PM2 + SSL)

### 1) Requisitos en el servidor (Ubuntu 22.04+)
- Node.js LTS y npm
- PostgreSQL 12+: `sudo apt update && sudo apt install -y postgresql postgresql-contrib`
- PM2: `npm i -g pm2`
- Nginx: `sudo apt update && sudo apt install -y nginx`

### 2) Clonar y preparar
```bash
git clone <TU_REPO>
cd DISTRITAL-4-JEFATURA-main
npm ci --omit=dev
```

### 3) Variables de entorno seguras
Configura un secreto real para JWT y el puerto. Con PM2 puedes usar:
```bash
pm2 start ecosystem.config.js --env production --update-env \
  --name distrital4-jefatura
```
Luego persiste PM2:
```bash
pm2 save
pm2 startup systemd
# sigue las instrucciones que imprime para habilitar el servicio
```

### 4) Nginx como reverse proxy (80/443)
Archivo ejemplo `/etc/nginx/sites-available/distrital4-jefatura`:
```nginx
server {
    listen 80;
    server_name ejemplo.tu-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Activar sitio y probar:
```bash
sudo ln -s /etc/nginx/sites-available/distrital4-jefatura /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 5) Certificado SSL con Let’s Encrypt
```bash
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d ejemplo.tu-dominio.com
```

### 6) Firewall (UFW)
```bash
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 7) Configuración de PostgreSQL en producción
```bash
# Crear base de datos
sudo -u postgres psql
CREATE DATABASE distrital4_jefatura;
CREATE USER distrital_user WITH PASSWORD 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON DATABASE distrital4_jefatura TO distrital_user;
\q

# Configurar variables de entorno en PM2 (ecosystem.config.js o directamente)
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=distrital4_jefatura
export DB_USER=distrital_user
export DB_PASSWORD=tu_contraseña_segura
export DB_SSL=false
export JWT_SECRET=tu_secreto_jwt_muy_seguro_minimo_32_caracteres
```

**Backups de PostgreSQL:**
```bash
# Backup manual
pg_dump -U distrital_user distrital4_jefatura > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -U distrital_user distrital4_jefatura < backup_20250101.sql
```

### 8) Deploy de actualizaciones
```bash
git pull
npm ci --omit=dev
pm2 restart distrital4-jefatura --update-env
```

### 9) Variables en producción (opcional .env)
El proyecto soporta las siguientes variables de entorno:
- `PORT`: Puerto del servidor (default: 3001)
- `JWT_SECRET`: Secreto para JWT (requerido en producción, mínimo 32 caracteres)
- `JWT_EXPIRES_IN`: Tiempo de expiración del token (default: 8h)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Configuración de PostgreSQL
- `DB_SSL`: Habilitar SSL para conexiones remotas (`true`/`false`)
- `DB_LOGGING`: Habilitar logs SQL (`true`/`false`)
- `DB_ALTER`: Permitir alteración automática de esquema (`true`/`false`)
- `NODE_ENV`: Entorno (`development`/`production`)
- `ALLOWED_ORIGINS`: Orígenes permitidos para CORS (separados por comas)

Puedes exportarlas en tu shell, definirlas en PM2 o usar un archivo `.env` (asegúrate de agregarlo a `.gitignore`).


