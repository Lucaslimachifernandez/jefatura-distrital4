# 📋 Paso a Paso: Desplegar en Render con GitHub y PostgreSQL

Esta guía te llevará desde cero hasta tener tu aplicación funcionando en Render.

---

## 📦 PARTE 1: Preparar el Proyecto Localmente

### Paso 1.1: Instalar las nuevas dependencias

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará las dependencias de PostgreSQL (`pg` y `pg-hstore`) que agregamos.

### Paso 1.2: Verificar que todo esté listo

Asegúrate de que tengas estos archivos en tu proyecto:
- ✅ `package.json` (actualizado con PostgreSQL)
- ✅ `server.js` (actualizado para PostgreSQL)
- ✅ `.gitignore` (creado)
- ✅ `README.md` (guía completa)
- ✅ `GUIA_DESPLIEGUE.md` (guía rápida)

---

## 🔵 PARTE 2: Crear Repositorio en GitHub

### Paso 2.1: Crear cuenta en GitHub (si no tienes)

1. Ve a [github.com](https://github.com)
2. Crea una cuenta o inicia sesión

### Paso 2.2: Crear un nuevo repositorio

1. Click en el **"+"** (arriba derecha) → **"New repository"**
2. Completa:
   - **Repository name:** `distrital4-jefatura`
   - **Description:** (opcional) "Sistema de gestión de novedades - Distrital 4"
   - **Visibility:** Elige **Public** o **Private**
   - ❌ **NO marques** "Initialize this repository with a README"
   - ❌ **NO agregues** .gitignore o license
3. Click en **"Create repository"**

### Paso 2.3: Subir tu código a GitHub

**Si es la primera vez usando Git en este proyecto:**

Abre PowerShell o Terminal en la carpeta de tu proyecto y ejecuta:

```bash
# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Crear el primer commit
git commit -m "Proyecto inicial - Preparado para Render con PostgreSQL"

# Cambiar a rama main
git branch -M main

# Conectar con GitHub (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/distrital4-jefatura.git

# Subir el código
git push -u origin main
```

**Si ya tienes Git configurado:**

```bash
git add .
git commit -m "Actualizado para PostgreSQL y Render"
git push
```

⚠️ **Nota:** Si te pide usuario y contraseña, usa un **Personal Access Token** de GitHub en lugar de tu contraseña.

**Para crear un Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Selecciona: `repo` (todos los permisos)
4. Genera y copia el token
5. Úsalo como contraseña cuando Git te la pida

---

## 🗄️ PARTE 3: Crear Base de Datos PostgreSQL en Render

### Paso 3.1: Crear cuenta en Render

1. Ve a [render.com](https://render.com)
2. Click en **"Get Started for Free"**
3. Regístrate con GitHub (recomendado) o con email

### Paso 3.2: Crear la base de datos PostgreSQL

1. En el dashboard de Render, click en **"New +"** (arriba derecha)
2. Selecciona **"PostgreSQL"**

3. Completa el formulario:
   - **Name:** `distrital4-postgres`
   - **Database:** `distrital4`
   - **User:** `distrital4_user`
   - **Region:** Elige la más cercana (ej: `Oregon (US West)`)
   - **PostgreSQL Version:** Deja la más reciente
   - **Plan:** 
     - ✅ **Free** (para empezar)
     - O elige un plan pagado si necesitas más recursos
   - **Datadog API Key:** (opcional, déjalo vacío)

4. Click en **"Create Database"**

5. **Espera 2-3 minutos** mientras Render crea la base de datos

### Paso 3.3: Obtener la URL de conexión

Una vez creada la base de datos:

1. Click en el nombre de tu base de datos (`distrital4-postgres`)
2. Ve a la pestaña **"Connections"**
3. Busca la sección **"Internal Database URL"**
4. **Copia esa URL completa** (será algo como: `postgresql://distrital4_user:password@dpg-xxxxx-a/distrital4`)
   - ⚠️ **IMPORTANTE:** Usa la **Internal** URL, NO la External

Guarda esta URL, la necesitarás en el siguiente paso.

---

## 🌐 PARTE 4: Crear Web Service en Render

### Paso 4.1: Crear el servicio web

1. En el dashboard de Render, click en **"New +"**
2. Selecciona **"Web Service"**

3. Render te pedirá conectar con GitHub:
   - Si no has conectado GitHub antes, click en **"Connect GitHub"**
   - Autoriza Render a acceder a tus repositorios
   - Selecciona **"Only select repositories"** y elige `distrital4-jefatura`
   - O **"All repositories"** si prefieres

4. Una vez conectado, selecciona el repositorio `distrital4-jefatura`

### Paso 4.2: Configurar el servicio

Completa el formulario:

- **Name:** `distrital4-jefatura`
- **Environment:** `Node`
- **Region:** Misma región que elegiste para la base de datos
- **Branch:** `main` (o `master` si usas ese)
- **Root Directory:** (déjalo vacío)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:**
  - ✅ **Free** (para empezar)
  - O elige un plan pagado

### Paso 4.3: Configurar Variables de Entorno

Antes de crear el servicio, ve a la sección **"Environment Variables"** y agrega estas variables:

#### Variable 1: NODE_ENV
- **Key:** `NODE_ENV`
- **Value:** `production`
- Click en **"Add"**

#### Variable 2: PORT
- **Key:** `PORT`
- **Value:** `3001`
- Click en **"Add"`

#### Variable 3: DATABASE_URL
- **Key:** `DATABASE_URL`
- **Value:** Pega la **Internal Database URL** que copiaste en el Paso 3.3
- Click en **"Add"**

#### Variable 4: JWT_SECRET
Primero genera una clave segura:

**En Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**En Linux/Mac Terminal:**
```bash
openssl rand -base64 32
```

Copia el resultado y:
- **Key:** `JWT_SECRET`
- **Value:** (pega la clave generada)
- Click en **"Add"**

#### Variable 5: JWT_EXPIRES_IN
- **Key:** `JWT_EXPIRES_IN`
- **Value:** `8h`
- Click en **"Add"**

#### Variable 6: ALLOWED_ORIGINS
- **Key:** `ALLOWED_ORIGINS`
- **Value:** `https://distrital4-jefatura.onrender.com`
  - ⚠️ **Nota:** Render cambiará la URL después de crear el servicio. Puedes actualizarla luego.
- Click en **"Add"**

#### Variable 7: DB_ALTER
- **Key:** `DB_ALTER`
- **Value:** `false`
- Click en **"Add"**

#### Variable 8: BACKUP_FREQUENCY
- **Key:** `BACKUP_FREQUENCY`
- **Value:** `daily`
- Click en **"Add"**

#### Variable 9: ADMIN_DEFAULT_PASSWORD
- **Key:** `ADMIN_DEFAULT_PASSWORD`
- **Value:** (elige una contraseña segura, ej: `Admin123!@#`)
  - ⚠️ **IMPORTANTE:** Cambia esta contraseña después del primer login
- Click en **"Add"**

### Paso 4.4: Conectar la Base de Datos

1. En la sección **"Connections"** (abajo del formulario)
2. Busca **"Add Database"**
3. Selecciona `distrital4-postgres` (la base de datos que creaste)
4. Esto automáticamente agregará la variable `DATABASE_URL` si no la agregaste manualmente

### Paso 4.5: Crear el servicio

1. Revisa que todas las variables estén configuradas
2. Click en **"Create Web Service"**
3. Render comenzará a construir tu aplicación

---

## ⏳ PARTE 5: Esperar el Despliegue

### Paso 5.1: Monitorear el build

Verás una pantalla con el progreso:

1. **Building** - Render está instalando dependencias (2-5 minutos)
2. **Deploying** - Render está desplegando tu aplicación (1-2 minutos)
3. **Live** ✅ - Tu aplicación está funcionando

### Paso 5.2: Verificar logs

Durante el build, puedes ver los logs:
- Click en **"Logs"** (pestaña arriba)
- Busca errores en rojo
- Si ves "Conexión a la base de datos PostgreSQL establecida exitosamente" = ✅ Todo bien

### Paso 5.3: Obtener tu URL

Una vez que el servicio esté **"Live"**:
- Verás una URL como: `https://distrital4-jefatura.onrender.com`
- **Copia esta URL**

---

## ✅ PARTE 6: Verificar y Configurar Final

### Paso 6.1: Actualizar ALLOWED_ORIGINS

1. Ve a tu servicio en Render
2. Click en **"Environment"** (menú izquierdo)
3. Busca `ALLOWED_ORIGINS`
4. Edita el valor y pon la URL real de tu servicio (la que copiaste)
5. Guarda los cambios

### Paso 6.2: Verificar que funciona

1. Abre tu navegador
2. Ve a la URL de tu aplicación (ej: `https://distrital4-jefatura.onrender.com`)
3. Deberías ver: **"Servidor backend funcionando!"**

### Paso 6.3: Probar el login

1. Ve a: `https://distrital4-jefatura.onrender.com/index.html`
2. Intenta hacer login con:
   - **Usuario:** `admin`
   - **Contraseña:** (la que pusiste en `ADMIN_DEFAULT_PASSWORD`)
3. Si funciona, ¡felicidades! 🎉

### Paso 6.4: Cambiar contraseña del admin

⚠️ **MUY IMPORTANTE:** Cambia la contraseña del admin después del primer login por seguridad.

---

## 🎯 Resumen de URLs y Credenciales

Guarda esta información:

- **URL de la aplicación:** `https://distrital4-jefatura.onrender.com`
- **Usuario admin:** `admin`
- **Contraseña admin:** (la que configuraste en `ADMIN_DEFAULT_PASSWORD`)

---

## 🆘 Solución de Problemas Comunes

### Problema: Error "Cannot connect to database"

**Solución:**
1. Verifica que `DATABASE_URL` esté correcta
2. Asegúrate de usar la **Internal** URL, no la External
3. Verifica que la base de datos esté "linked" en Connections

### Problema: Error 503 Service Unavailable

**Solución:**
- El servicio está "durmiendo" (plan gratuito)
- Espera 30-60 segundos y recarga la página
- El primer acceso después del sleep puede tardar

### Problema: Las tablas no se crean

**Solución:**
1. Ve a los Logs del servicio en Render
2. Busca errores de conexión
3. Verifica que `DB_ALTER=false` en producción
4. Las tablas se crean automáticamente en el primer inicio

### Problema: Error de autenticación JWT

**Solución:**
1. Verifica que `JWT_SECRET` tenga al menos 32 caracteres
2. Regenera `JWT_SECRET` si es necesario
3. Reinicia el servicio después de cambiar `JWT_SECRET`

---

## 📝 Notas Importantes

1. **Plan Gratuito:** El servicio "duerme" después de 15 minutos de inactividad
2. **Primer acceso:** Puede tardar 30-60 segundos después del sleep
3. **Base de datos:** El plan gratuito tiene límites (500MB, 90 días de retención)
4. **Producción:** Para uso en producción real, considera un plan pagado

---

## 🎉 ¡Listo!

Tu aplicación está desplegada y funcionando en Render. Cada vez que hagas `git push` a GitHub, Render automáticamente detectará los cambios y desplegará una nueva versión.

¿Necesitas ayuda con algún paso específico? Revisa los logs en Render o consulta la documentación en [render.com/docs](https://render.com/docs)

