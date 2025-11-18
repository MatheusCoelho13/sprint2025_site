#!/usr/bin/env pwsh
# 🔍 Script para visualizar logs do Meta Quest em PowerShell
# Uso: .\view_logs.ps1 [opção]

param(
    [string]$option = ""
)

Write-Host "🚀 Meta Quest WebXR Log Viewer (PowerShell)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

if ([string]::IsNullOrEmpty($option)) {
    Write-Host "Opções disponíveis:"
    Write-Host "  1) Todos os logs (tempo real)"
    Write-Host "  2) Apenas WebXR/OpenXR"
    Write-Host "  3) Apenas erros"
    Write-Host "  4) Apenas framebuffer/swapchain"
    Write-Host "  5) Apenas fps/performance"
    Write-Host "  6) Apenas compositor"
    Write-Host "  7) Salvar logs em arquivo"
    Write-Host "  8) Limpar logs antigos"
    Write-Host ""
    $option = Read-Host "Escolha uma opção (1-8)"
}

switch ($option) {
    "1" {
        Write-Host "📺 Mostrando TODOS os logs em tempo real..." -ForegroundColor Yellow
        Write-Host "(Pressione Ctrl+C para parar)" -ForegroundColor Gray
        Write-Host ""
        & adb logcat -v time
    }
    
    "2" {
        Write-Host "🥽 Mostrando apenas logs WebXR/OpenXR..." -ForegroundColor Yellow
        Write-Host "(Pressione Ctrl+C para parar)" -ForegroundColor Gray
        Write-Host ""
        & adb logcat -v time | Select-String -Pattern "webxr|openxr|vrshell|xr_" -CaseSensitive:$false
    }
    
    "3" {
        Write-Host "❌ Mostrando apenas ERROS..." -ForegroundColor Red
        Write-Host "(Pressione Ctrl+C para parar)" -ForegroundColor Gray
        Write-Host ""
        & adb logcat -v time | Select-String -Pattern "error|fail|fatal|crash" -CaseSensitive:$false
    }
    
    "4" {
        Write-Host "📦 Mostrando logs de framebuffer/swapchain..." -ForegroundColor Yellow
        Write-Host "(Pressione Ctrl+C para parar)" -ForegroundColor Gray
        Write-Host ""
        & adb logcat -v time | Select-String -Pattern "framebuffer|swapchain|xrendframe" -CaseSensitive:$false
    }
    
    "5" {
        Write-Host "⚡ Mostrando logs de performance/FPS..." -ForegroundColor Yellow
        Write-Host "(Pressione Ctrl+C para parar)" -ForegroundColor Gray
        Write-Host ""
        & adb logcat -v time | Select-String -Pattern "fps|frame rate|refresh|performance|boost" -CaseSensitive:$false
    }
    
    "6" {
        Write-Host "🎬 Mostrando logs do compositor..." -ForegroundColor Yellow
        Write-Host "(Pressione Ctrl+C para parar)" -ForegroundColor Gray
        Write-Host ""
        & adb logcat -v time | Select-String -Pattern "compositor|display|render|thread" -CaseSensitive:$false
    }
    
    "7" {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $filename = "vr_logs_${timestamp}.txt"
        
        Write-Host "💾 Limpando logs antigos..." -ForegroundColor Yellow
        & adb logcat -c
        
        Write-Host "⏳ Capturando logs (pressione Ctrl+C quando terminar de testar VR)..." -ForegroundColor Yellow
        Write-Host ""
        
        & adb logcat -v time | Tee-Object -FilePath $filename | Out-Null
        
        Write-Host ""
        Write-Host "✅ Logs salvos em: $filename" -ForegroundColor Green
    }
    
    "8" {
        Write-Host "🧹 Limpando logs antigos..." -ForegroundColor Yellow
        & adb logcat -c
        Write-Host "✅ Logs limpos!" -ForegroundColor Green
    }
    
    default {
        Write-Host "❌ Opção inválida!" -ForegroundColor Red
        exit 1
    }
}
