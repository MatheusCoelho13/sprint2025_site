#!/usr/bin/env pwsh
# 🔍 Script para capturar logs por 1 minuto e salvar em pasta errors/
# Uso: .\capture_logs.ps1

# Criar pasta errors se não existir
if (-not (Test-Path "errors")) {
    New-Item -ItemType Directory -Path "errors" | Out-Null
    Write-Host "📁 Pasta 'errors' criada" -ForegroundColor Green
}

# Gerar nome do arquivo com timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$filename = "errors\log_${timestamp}.txt"

Write-Host ""
Write-Host "🚀 Capturando logs por 1 minuto..." -ForegroundColor Cyan
Write-Host "📁 Salvando em: $filename" -ForegroundColor Cyan
Write-Host ""

# Limpar logs antigos do ADB
Write-Host "🧹 Limpando logs antigos..." -ForegroundColor Yellow
& adb logcat -c

Write-Host "⏳ Aguardando 60 segundos..." -ForegroundColor Yellow
Write-Host ""

# Iniciar captura em background
$logcat_process = Start-Process -NoNewWindow -FilePath adb -ArgumentList "logcat", "-v", "time" -RedirectStandardOutput $filename -PassThru

# Barra de progresso
for ($i = 1; $i -le 60; $i++) {
    $percent = [math]::Round(($i / 60) * 100)
    $bar = "▓" * ($i / 3) + "░" * ((60 - $i) / 3)
    Write-Host -NoNewline "`r[$bar] $i/60 segundos [$percent%]"
    Start-Sleep -Seconds 1
}

# Parar captura
Stop-Process -InputObject $logcat_process -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host ""
Write-Host "✅ Logs capturados com sucesso!" -ForegroundColor Green
Write-Host "📁 Arquivo: $filename" -ForegroundColor Green

# Tamanho do arquivo
$fileSize = (Get-Item $filename).Length
$fileSizeDisplay = if ($fileSize -gt 1MB) { 
    "{0:F2} MB" -f ($fileSize / 1MB) 
} elseif ($fileSize -gt 1KB) { 
    "{0:F2} KB" -f ($fileSize / 1KB) 
} else { 
    "$fileSize B" 
}

Write-Host "📊 Tamanho: $fileSizeDisplay" -ForegroundColor Green
Write-Host ""

# Contar erros
$content = Get-Content $filename
$error_count = ($content | Select-String -Pattern "error|fail|fatal" -CaseSensitive:$false | Measure-Object).Count
$webxr_count = ($content | Select-String -Pattern "webxr|openxr|xrendframe" -CaseSensitive:$false | Measure-Object).Count

Write-Host "📈 Estatísticas:" -ForegroundColor Cyan
Write-Host "   - Linhas de erro: $error_count" -ForegroundColor Yellow
Write-Host "   - Linhas WebXR/OpenXR: $webxr_count" -ForegroundColor Yellow
Write-Host ""

# Mostrar últimas linhas
Write-Host "📝 Últimas 10 linhas do log:" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Gray
$content | Select-Object -Last 10 | ForEach-Object { Write-Host $_ -ForegroundColor Gray }
Write-Host "---" -ForegroundColor Gray
