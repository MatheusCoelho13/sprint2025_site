#!/bin/bash

# 🔍 Script para visualizar logs do Meta Quest com filtros úteis
# Uso: ./view_logs.sh [opção]

set -e

echo "🚀 Meta Quest WebXR Log Viewer"
echo "=============================="
echo ""
echo "Opções disponíveis:"
echo "  1) Todos os logs (tempo real)"
echo "  2) Apenas WebXR/OpenXR"
echo "  3) Apenas erros"
echo "  4) Apenas framebuffer/swapchain"
echo "  5) Apenas fps/performance"
echo "  6) Apenas compositor"
echo "  7) Salvar logs em arquivo"
echo "  8) Limpar logs antigos"
echo ""

# Se nenhuma opção passada, mostrar menu
if [ -z "$1" ]; then
  read -p "Escolha uma opção (1-8): " choice
else
  choice=$1
fi

case $choice in
  1)
    echo "📺 Mostrando TODOS os logs em tempo real..."
    echo "(Pressione Ctrl+C para parar)"
    echo ""
    adb logcat -v time
    ;;
    
  2)
    echo "🥽 Mostrando apenas logs WebXR/OpenXR..."
    echo "(Pressione Ctrl+C para parar)"
    echo ""
    adb logcat -v time | grep -i "webxr\|openxr\|vrshell\|xr_"
    ;;
    
  3)
    echo "❌ Mostrando apenas ERROS..."
    echo "(Pressione Ctrl+C para parar)"
    echo ""
    adb logcat -v time | grep -i "error\|fail\|fatal\|crash"
    ;;
    
  4)
    echo "📦 Mostrando logs de framebuffer/swapchain..."
    echo "(Pressione Ctrl+C para parar)"
    echo ""
    adb logcat -v time | grep -i "framebuffer\|swapchain\|xrendframe"
    ;;
    
  5)
    echo "⚡ Mostrando logs de performance/FPS..."
    echo "(Pressione Ctrl+C para parar)"
    echo ""
    adb logcat -v time | grep -i "fps\|frame rate\|refresh\|performance\|boost"
    ;;
    
  6)
    echo "🎬 Mostrando logs do compositor..."
    echo "(Pressione Ctrl+C para parar)"
    echo ""
    adb logcat -v time | grep -i "compositor\|display\|render\|thread"
    ;;
    
  7)
    # Salvar logs com timestamp
    timestamp=$(date +%Y%m%d_%H%M%S)
    filename="vr_logs_${timestamp}.txt"
    
    echo "💾 Limpando logs antigos..."
    adb logcat -c
    
    echo "⏳ Aguardando logs (pressione Ctrl+C quando terminar de testar VR)..."
    adb logcat -v time > "$filename" 2>&1 &
    logcat_pid=$!
    
    trap "kill $logcat_pid 2>/dev/null; echo ''; echo '✅ Logs salvos em: $filename'" EXIT INT TERM
    
    wait $logcat_pid
    ;;
    
  8)
    echo "🧹 Limpando logs antigos..."
    adb logcat -c
    echo "✅ Logs limpos!"
    ;;
    
  *)
    echo "❌ Opção inválida!"
    exit 1
    ;;
esac
