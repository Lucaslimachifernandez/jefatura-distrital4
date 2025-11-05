## DISTRITAL 4 - JEFATURA

### Requisitos
- Node.js LTS (incluye npm)
  - Windows: instalar desde `https://nodejs.org` o con `winget install OpenJS.NodeJS.LTS`

### Instalación
1) Abrir terminal en la carpeta del proyecto
```powershell
cd "C:\Users\TOSHIBA\Desktop\DISTRITAL-4-JEFATURA-main"
```
2) Instalar dependencias
```powershell
npm install
```

### Ejecución
Iniciar el servidor (Express + SQLite):
```powershell
npm start
```
Si inicia correctamente verás: `Servidor corriendo en el puerto 3001`.

Abrir el frontend:
- Navegador: `http://localhost:3001/index.html`

Credenciales iniciales (se crea un admin si no existe):
- Usuario: `admin`
- Contraseña: `hijoteamo2`

### Configuración
- Puerto: por defecto 3001. Puedes cambiarlo con variable de entorno:
```powershell
$env:PORT=3002; npm start
```
- Base de datos: archivo `database.sqlite` en la raíz (SQLite). Se crea/actualiza automáticamente por Sequelize.

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
- Error 401 al iniciar sesión: puede existir un admin previo. Cierra el servidor, elimina `database.sqlite` y ejecuta de nuevo `npm start` para recrear el admin por defecto.
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

### 7) Consideraciones de base de datos (SQLite)
- `database.sqlite` vive en la carpeta del proyecto. Garantiza permisos de escritura del usuario que corre PM2.
- Haz backups periódicos del archivo (detén la app o usa copias en frío para evitar corrupción).

### 8) Deploy de actualizaciones
```bash
git pull
npm ci --omit=dev
pm2 restart distrital4-jefatura --update-env
```

### 9) Variables en producción (opcional .env)
El proyecto ya soporta `process.env.PORT` y `process.env.JWT_SECRET`. Puedes exportarlas en tu shell o definirlas en PM2.


