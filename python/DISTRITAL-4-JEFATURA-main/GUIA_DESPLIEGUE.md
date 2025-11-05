# 🚀 Guía Rápida de Despliegue en Render

## Pasos para subir tu proyecto a Render

### 1️⃣ Subir código a GitHub

```bash
# Si es la primera vez
git init
git add .
git commit -m "Preparado para Render con PostgreSQL"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/distrital4-jefatura.git
git push -u origin main

# Si ya tienes el repo
git add .
git commit -m "Actualizado para PostgreSQL y Render"
git push
```

### 2️⃣ Crear base de datos PostgreSQL en Render

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en **"New +"** → **"PostgreSQL"**
3. Configura:
   - **Name:** `distrital4-postgres`
   - **Database:** `distrital4`
   - **User:** `distrital4_user`
   - **Plan:** Free (o el que prefieras)
4. Click en **"Create Database"**
5. **Copia la "Internal Database URL"** (la necesitarás después)

### 3️⃣ Crear Web Service en Render

1. Click en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Selecciona `distrital4-jefatura`
4. Configura:
   - **Name:** `distrital4-jefatura`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### 4️⃣ Configurar Variables de Entorno

En la sección **"Environment Variables"**, agrega:

| Variable | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `DATABASE_URL` | `<Pega la Internal Database URL de PostgreSQL>` |
| `JWT_SECRET` | `<Genera una clave de 32+ caracteres>` |
| `JWT_EXPIRES_IN` | `8h` |
| `ALLOWED_ORIGINS` | `https://distrital4-jefatura.onrender.com` |
| `DB_ALTER` | `false` |
| `BACKUP_FREQUENCY` | `daily` |
| `ADMIN_DEFAULT_PASSWORD` | `<Cambia por una contraseña segura>` |

### 5️⃣ Conectar la Base de Datos

1. En la sección **"Connections"** del Web Service
2. Click en **"Link Database"**
3. Selecciona la base de datos PostgreSQL que creaste
4. Esto agregará automáticamente `DATABASE_URL`

### 6️⃣ Desplegar

1. Click en **"Create Web Service"**
2. Espera a que termine el build (puede tardar 2-5 minutos)
3. Una vez listo, tu app estará en: `https://distrital4-jefatura.onrender.com`

## ⚠️ Importante

### Generar JWT_SECRET seguro

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

### Primera vez que inicia

- El primer inicio puede tardar 1-2 minutos
- Las tablas se crean automáticamente
- El usuario `admin` se crea con la contraseña de `ADMIN_DEFAULT_PASSWORD`
- **Cambia la contraseña del admin después del primer login**

## 🔍 Verificar que funciona

1. Visita la URL de tu aplicación
2. Deberías ver: "Servidor backend funcionando!"
3. Intenta hacer login con el usuario `admin`

## 📝 Notas

- El plan gratuito de Render "duerme" después de 15 minutos de inactividad
- El primer acceso después del sleep puede tardar 30-60 segundos
- Para producción real, considera un plan pagado

## 🆘 Problemas Comunes

### Error de conexión a BD
- Verifica que `DATABASE_URL` esté correcta
- Asegúrate de que la BD esté "linked"

### Error 503
- El servicio está "durmiendo" (plan gratuito)
- Espera 30-60 segundos y recarga

### Las tablas no se crean
- Revisa los logs en Render Dashboard
- Verifica que `DB_ALTER=false` en producción

