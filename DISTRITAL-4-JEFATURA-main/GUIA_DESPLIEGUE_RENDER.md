# 📋 Guía Completa de Despliegue en Render

Esta guía te llevará paso a paso para desplegar tu aplicación DISTRITAL-4-JEFATURA en Render.

## ✅ Paso 1: Verificar que todo esté en Git

Tu código ya está subido a: `https://github.com/Lucaslimachifernandez/jefatura-distrital4.git`

**Verificar estado:**
```bash
git status
```

## ✅ Paso 2: Crear cuenta en Render

1. Ve a [https://render.com](https://render.com)
2. Haz clic en "Get Started" o "Sign Up"
3. Elige "Sign up with GitHub" (recomendado) para conectar directamente tu repositorio
4. Autoriza a Render a acceder a tus repositorios

## ✅ Paso 3: Crear Blueprint (Despliegue Automático)

1. En el Dashboard de Render, haz clic en **"New +"** (botón azul en la esquina superior derecha)
2. Selecciona **"Blueprint"**
3. Conecta tu repositorio:
   - Si ya conectaste GitHub, selecciona: `Lucaslimachifernandez/jefatura-distrital4`
   - Si no, haz clic en "Connect account" y autoriza Render
4. Render detectará automáticamente el archivo `render.yaml`
5. Haz clic en **"Apply"**

## ✅ Paso 4: Configurar Variables de Entorno

Después de crear el Blueprint, Render creará dos servicios:
- **distrital4-db** (PostgreSQL)
- **distrital4-jefatura** (Web Service)

### 4.1 Generar JWT_SECRET seguro

**Opción A - Desde PowerShell (Windows):**
```powershell
# Generar un secreto seguro de 32 caracteres
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Opción B - Desde Node.js (si tienes Node instalado):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Opción C - Usar un generador online:**
- Ve a: https://www.random.org/strings/
- Genera una cadena de 32 caracteres alfanuméricos

### 4.2 Configurar variables en Render

1. Ve al servicio web **"distrital4-jefatura"** en el Dashboard
2. Haz clic en **"Environment"** en el menú lateral
3. Busca y edita estas variables:

   **Variables que DEBES configurar manualmente:**
   - `JWT_SECRET`: Pega el secreto que generaste (mínimo 32 caracteres)
   - `ALLOWED_ORIGINS`: Configúrala después de conocer tu URL (ejemplo: `https://distrital4-jefatura.onrender.com`)

   **Variables opcionales:**
   - `ADMIN_DEFAULT_PASSWORD`: Si quieres cambiar la contraseña por defecto del admin (por defecto: `hijoteamo2`)

4. Las variables de base de datos (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`) se configuran automáticamente desde `render.yaml`, **NO las cambies manualmente**.

## ✅ Paso 5: Esperar el Despliegue

1. Render comenzará a construir tu aplicación automáticamente
2. Puedes ver el progreso en la pestaña **"Logs"** del servicio web
3. El proceso tarda aproximadamente 5-10 minutos la primera vez
4. Verás mensajes como:
   - "Building application..."
   - "Installing dependencies..."
   - "Starting application..."

## ✅ Paso 6: Verificar el Despliegue

1. Una vez completado, verás **"Live"** en verde en el estado del servicio
2. Tu aplicación estará disponible en: `https://distrital4-jefatura.onrender.com` (o la URL que Render asigne)
3. Haz clic en la URL para abrirla en tu navegador

### 6.1 Verificar que la base de datos funciona

1. Ve a la pestaña **"Logs"** del servicio web
2. Busca el mensaje: `"Conexión a la base de datos PostgreSQL establecida exitosamente"`
3. Si ves errores de conexión, verifica las variables de entorno

### 6.2 Probar el login

1. Abre tu aplicación en el navegador
2. Intenta iniciar sesión con:
   - **Usuario:** `admin`
   - **Contraseña:** `hijoteamo2` (o la que configuraste en `ADMIN_DEFAULT_PASSWORD`)
3. **IMPORTANTE:** Cambia esta contraseña inmediatamente después del primer login

## ✅ Paso 7: Configurar ALLOWED_ORIGINS

Una vez que conozcas la URL de tu aplicación:

1. Ve al servicio web **"distrital4-jefatura"**
2. **"Environment"** → Busca `ALLOWED_ORIGINS`
3. Configúrala con tu URL completa: `https://distrital4-jefatura.onrender.com`
4. Guarda los cambios
5. Render reiniciará automáticamente el servicio

## 🔧 Solución de Problemas Comunes

### Problema: Error 503 o "Service Unavailable"
**Solución:** 
- En el plan gratuito, los servicios se "duermen" después de 15 minutos de inactividad
- Espera 30-60 segundos y vuelve a intentar
- La primera petición puede tardar más tiempo

### Problema: Error de conexión a la base de datos
**Solución:**
1. Verifica que la base de datos `distrital4-db` esté activa (debe mostrar "Available")
2. Verifica en "Logs" si hay errores de autenticación
3. Asegúrate de que `DB_SSL` esté configurado como `"true"`

### Problema: Error "JWT_SECRET es muy corto"
**Solución:**
- Asegúrate de que `JWT_SECRET` tenga al menos 32 caracteres
- Regenera un nuevo secreto y actualízalo en las variables de entorno

### Problema: Error de CORS
**Solución:**
- Verifica que `ALLOWED_ORIGINS` incluya exactamente la URL de tu aplicación (con `https://`)
- Si usas múltiples orígenes, sepáralos con comas: `https://app1.onrender.com,https://app2.onrender.com`

### Problema: La aplicación no inicia
**Solución:**
1. Revisa los logs en la pestaña "Logs"
2. Verifica que todas las dependencias se instalaron correctamente
3. Asegúrate de que el comando de inicio sea `npm start`

## 📝 Actualizar la Aplicación

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

Render detectará automáticamente los cambios y desplegará una nueva versión.

## 📊 Monitoreo

- **Logs en tiempo real:** Ve a "Logs" en el dashboard del servicio
- **Estado del servicio:** Aparece en la parte superior (Live, Deploying, Build Failed, etc.)
- **Métricas:** Plan gratuito tiene métricas básicas

## 💰 Plan Gratuito - Limitaciones

- **Servicios se "duermen"** después de 15 minutos de inactividad
- **Base de datos:** 1 GB de almacenamiento
- **Ancho de banda:** Limitado pero suficiente para desarrollo/pruebas
- **SSL:** Incluido automáticamente ✅

## 🔐 Seguridad Post-Despliegue

1. ✅ Cambia la contraseña del admin inmediatamente
2. ✅ Verifica que `JWT_SECRET` sea único y seguro
3. ✅ Configura `ALLOWED_ORIGINS` correctamente
4. ✅ No compartas tus credenciales de Render
5. ✅ Revisa los logs regularmente

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Render
2. Verifica la documentación de Render: https://render.com/docs
3. Consulta el README.md del proyecto para más detalles

---

**¡Listo!** Tu aplicación debería estar funcionando en Render. 🚀

