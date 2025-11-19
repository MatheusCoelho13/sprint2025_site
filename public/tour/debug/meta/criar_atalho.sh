#!/bin/bash

###############################################
# CONFIGURAÇÕES
###############################################

SITE="https://biotic-sprint.vercel.app/"
ICON="favicon.ico"       # .png, .jpg ou .ico funciona
NOME="Biotic_sprint"
DESKTOP_DIR_LOCAL="./atalho_quest"
DESKTOP_FILE="$NOME.desktop"
ICON_DIR_QUEST="/sdcard/MetaIcons"
DESKTOP_DIR_QUEST="/sdcard/Android/data/com.oculus.shell/Desktop"

###############################################
# PREPARAR ARQUIVOS LOCAIS
###############################################

echo "📁 Criando pasta temporária..."
mkdir -p "$DESKTOP_DIR_LOCAL"

echo "📝 Criando arquivo .desktop..."
cat <<EOF > "$DESKTOP_DIR_LOCAL/$DESKTOP_FILE"
[Desktop Entry]
Type=Application
Name=$NOME
Exec=xdg-open $SITE
Icon=/sdcard/MetaIcons/$ICON
Terminal=false
EOF

###############################################
# DETECTAR DISPOSITIVOS
###############################################

echo "🔍 Detectando Meta Quest conectados via ADB..."
DEVICES=$(adb devices | awk 'NR>1 && $2=="device" {print $1}')

if [ -z "$DEVICES" ]; then
  echo "❌ Nenhum Quest detectado!"
  exit 1
fi

echo "📱 Dispositivos encontrados:"
echo "$DEVICES"
echo

###############################################
# INSTALAR O ATALHO EM CADA QUEST
###############################################

for DEVICE in $DEVICES; do
  echo "🚀 Instalando no dispositivo: $DEVICE"

  echo "📤 Enviando ícone..."
  adb -s "$DEVICE" shell mkdir -p "$ICON_DIR_QUEST"
  adb -s "$DEVICE" push "$ICON" "$ICON_DIR_QUEST/$ICON" > /dev/null

  echo "📤 Enviando atalho..."
  adb -s "$DEVICE" shell mkdir -p "$DESKTOP_DIR_QUEST"
  adb -s "$DEVICE" push "$DESKTOP_DIR_LOCAL/$DESKTOP_FILE" "$DESKTOP_DIR_QUEST" > /dev/null

  echo "✅ Atalho instalado no $DEVICE!"
  echo
done

echo "🎉 Finalizado! Reinicie todos os Meta Quest."
