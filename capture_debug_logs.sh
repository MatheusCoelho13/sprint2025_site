#!/bin/bash

# 🔍 Script para capturar logs COM os console.logs detalhados de debug
# Uso: ./capture_debug_logs.sh

# Criar pasta errors se não existir
mkdir -p "errors"

# Gerar nome do arquivo com timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="errors/debug_${TIMESTAMP}.txt"

echo ""
echo "🚀 Capturando logs de DEBUG por 90 segundos..."
echo "📁 Salvando em: $LOG_FILE"
echo "📝 Esperando você entrar em VR durante os primeiros 30 segundos..."
echo ""

# Limpar logs antigos do ADB
adb logcat -c

# Capturar TODOS os logs, filtrando depois por console.log e WebXR
# Filtro: console.log, chromium, xr, webxr, framebuffer, error
echo "⏳ Iniciando captura... (pressione Ctrl+C para parar)"

adb logcat -v time "*:V" 2>&1 | tee "$LOG_FILE" &
LOGCAT_PID=$!

# Barra de progresso com 90 segundos
for i in $(seq 1 90); do
    PERCENT=$((i * 100 / 90))
    BAR=$(printf '▓%.0s' $(seq 1 $((i * 45 / 90))))
    EMPTY=$(printf '░%.0s' $(seq 1 $((45 - i * 45 / 90))))
    
    printf "\r[%s%s] %d%% - %ds de 90s" "$BAR" "$EMPTY" "$PERCENT" "$i"
    
    # A cada 30s, aviso
    if [ $((i % 30)) -eq 0 ]; then
        echo ""
        echo "   💡 Dica: Se ainda não entrou em VR, faça agora!"
    fi
    
    sleep 1
done

# Parar captura
kill $LOGCAT_PID 2>/dev/null

echo ""
echo ""
echo "✅ Captura finalizada!"
echo "📁 Arquivo: $LOG_FILE"

# Tamanho do arquivo
FILE_SIZE=$(ls -lh "$LOG_FILE" | awk '{print $5}')
echo "📊 Tamanho: $FILE_SIZE"
echo ""

# Análise rápida
echo "🔍 ANÁLISE DE LOGS:"
echo "==================="

ERROR_COUNT=$(grep -i "error\|fail" "$LOG_FILE" | wc -l)
CONSOLE_COUNT=$(grep -i "console.log\|chromium.*log" "$LOG_FILE" | wc -l)
XR_COUNT=$(grep -i "webxr\|xrendframe\|immersive" "$LOG_FILE" | wc -l)
FRAMEBUFFER_COUNT=$(grep -i "framebuffer\|glLayer" "$LOG_FILE" | wc -l)

echo "   📋 Total de linhas de erro: $ERROR_COUNT"
echo "   📝 Total de console.logs: $CONSOLE_COUNT"
echo "   🥽 Total de logs WebXR: $XR_COUNT"
echo "   🎨 Total de logs Framebuffer: $FRAMEBUFFER_COUNT"
echo ""

# Mostrar snippets importantes
echo "📌 SNIPPETS IMPORTANTES:"
echo "======================="

echo ""
echo "🟡 Primeiros console.logs (início da sessão):"
grep -i "iniciando.*vr\|solicitando webxr\|sessão webxr criada" "$LOG_FILE" | head -5

echo ""
echo "🟡 Status do Framebuffer:"
grep -i "framebuffer\|resolução" "$LOG_FILE" | head -5

echo ""
echo "🔴 ERROS (se houver):"
grep -i "error\|❌" "$LOG_FILE" | head -10 || echo "   ✅ Nenhum erro encontrado"

echo ""
echo "💚 SUCESSO (se houver):"
grep -i "✅" "$LOG_FILE" | head -10 || echo "   ⚠️ Nenhum log de sucesso encontrado"

echo ""
echo "👁️  Últimas 20 linhas do log:"
tail -20 "$LOG_FILE"

echo ""
echo "📄 Para ver o arquivo completo:"
echo "   cat $LOG_FILE"
echo ""
echo "🔍 Para filtrar apenas console.logs:"
echo "   grep -i 'console.log\|chromium' $LOG_FILE"
echo ""
