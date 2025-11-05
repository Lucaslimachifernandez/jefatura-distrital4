# Script para subir el proyecto a GitHub
# Ejecuta este script después de instalar Git

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Subiendo proyecto a GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Git está instalado
try {
    $gitVersion = git --version
    Write-Host "✓ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Git no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor instala Git desde: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Después de instalar, reinicia PowerShell y ejecuta este script nuevamente." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Paso 1: Verificando estado del repositorio..." -ForegroundColor Yellow

# Verificar si ya existe un repositorio Git
if (Test-Path .git) {
    Write-Host "✓ Repositorio Git ya inicializado" -ForegroundColor Green
    git status
} else {
    Write-Host "Inicializando nuevo repositorio Git..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Repositorio inicializado" -ForegroundColor Green
}

Write-Host ""
Write-Host "Paso 2: Agregando archivos..." -ForegroundColor Yellow
git add .
Write-Host "✓ Archivos agregados" -ForegroundColor Green

Write-Host ""
Write-Host "Paso 3: Creando commit inicial..." -ForegroundColor Yellow
git commit -m "Proyecto inicial - Preparado para Render con PostgreSQL"
Write-Host "✓ Commit creado" -ForegroundColor Green

Write-Host ""
Write-Host "Paso 4: Configurando rama main..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Rama configurada como 'main'" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IMPORTANTE: Configurar repositorio remoto" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Antes de continuar, asegúrate de haber creado el repositorio en GitHub:" -ForegroundColor Yellow
Write-Host "  1. Ve a https://github.com" -ForegroundColor White
Write-Host "  2. Crea un nuevo repositorio llamado: distrital4-jefatura" -ForegroundColor White
Write-Host "  3. NO inicialices con README, .gitignore o licencia" -ForegroundColor White
Write-Host ""
$usuario = Read-Host "Ingresa tu usuario de GitHub (ej: tuusuario)"

if ([string]::IsNullOrWhiteSpace($usuario)) {
    Write-Host "✗ No se ingresó usuario. Saliendo..." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Paso 5: Configurando repositorio remoto..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/$usuario/distrital4-jefatura.git"

# Verificar si ya existe el remote
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "Ya existe un remote 'origin'. ¿Deseas actualizarlo? (S/N)" -ForegroundColor Yellow
    $respuesta = Read-Host
    if ($respuesta -eq "S" -or $respuesta -eq "s") {
        git remote set-url origin $remoteUrl
        Write-Host "✓ Remote actualizado" -ForegroundColor Green
    } else {
        Write-Host "Manteniendo remote existente: $existingRemote" -ForegroundColor Yellow
    }
} else {
    git remote add origin $remoteUrl
    Write-Host "✓ Remote configurado: $remoteUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "Paso 6: Subiendo código a GitHub..." -ForegroundColor Yellow
Write-Host "Nota: Si te pide credenciales, usa tu Personal Access Token como contraseña" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ ¡Código subido exitosamente!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tu repositorio está disponible en:" -ForegroundColor Cyan
    Write-Host "  https://github.com/$usuario/distrital4-jefatura" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Error al subir el código. Verifica:" -ForegroundColor Red
    Write-Host "  1. Que el repositorio exista en GitHub" -ForegroundColor Yellow
    Write-Host "  2. Que tengas permisos para escribir en el repositorio" -ForegroundColor Yellow
    Write-Host "  3. Que uses un Personal Access Token si te pide contraseña" -ForegroundColor Yellow
    Write-Host ""
}

