#!/bin/bash

# 🔍 Script para capturar logs por 1 minuto e salvar em pasta errors/
# Uso: ./capture_logs.sh

set -e

# Criar pasta errors se não existir
mkdir -p errors

# Gerar nome do arquivo com timestamp
timestamp=$(date +%Y%m%d_%H%M%S)
filename="errors/log_${timestamp}.txt"

echo "🚀 Capturando logs por 1 minuto..."
echo "📁 Salvando em: $filename"
echo ""

# Limpar logs antigos do ADB
adb logcat -c

# Esperar 1 minuto capturando logs
echo "⏳ Aguardando 60 segundos..."
adb logcat -v time > "$filename" &
logcat_pid=$!

# Barra de progresso
for i in {1..60}; do
  echo -ne "\r▓ $i/60 segundos [$((i*100/60))%]"
  sleep 1
done

# Parar captura
kill $logcat_pid 2>/dev/null || true
wait $logcat_pid 2>/dev/null || true

echo ""
echo ""
echo "✅ Logs capturados com sucesso!"
echo "📁 Arquivo: $filename"
echo "📊 Tamanho: $(du -h "$filename" | cut -f1)"
echo ""

# Contar erros
error_count=$(grep -ic "error\|fail\|fatal" "$filename" || echo "0")
webxr_count=$(grep -ic "webxr\|openxr\|xrendframe" "$filename" || echo "0")

echo "📈 Estatísticas:"
echo "   - Linhas de erro: $error_count"
echo "   - Linhas WebXR/OpenXR: $webxr_count"
echo ""

# Mostrar últimas linhas
echo "📝 Últimas 10 linhas do log:"
echo "---"
tail -10 "$filename"
echo "---"
