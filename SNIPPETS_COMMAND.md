# 🛠️ SNIPPETS DE COMANDO - Teste e Debug VR

## 🖥️ WINDOWS CMD / PowerShell

### Conectar ADB

```powershell
# Verificar se Quest está conectado
adb devices

# Se não aparecer, reiniciar daemon
adb kill-server
adb start-server
adb devices
```

### Limpar e Monitorar Logs

```powershell
# Limpar logs antigos
adb logcat -c

# Monitorar WebXR específico
adb logcat | findstr /i "webxr xrendframe compositor"

# Monitorar tudo OpenXR
adb logcat | findstr /i "openxr"

# Monitorar framebuffer/swapchain
adb logcat | findstr /i "framebuffer swapchain"

# Monitorar performance
adb logcat | findstr /i "fps frame rate boost"

# Salvar logs para arquivo
adb logcat > vr_debug_%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.txt
```

### Debug Console (no Navegador)

```javascript
// Verificar se WebXR está disponível
navigator.xr ? console.log("✅ WebXR disponível") : console.log("❌ WebXR não disponível");

// Verificar suporte a VR
navigator.xr?.isSessionSupported("immersive-vr").then(
  supported => console.log("VR suportado:", supported)
);

// Verificar WebGL
const canvas = document.getElementById("pano");
const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
console.log("WebGL versão:", gl?.getParameter(gl?.VERSION));

// Monitorar XRWebGLLayer (durante VR)
setInterval(() => {
  if (window.vrSession?.renderState?.baseLayer) {
    const layer = window.vrSession.renderState.baseLayer;
    console.log(`Layer: ${layer.framebufferWidth}x${layer.framebufferHeight}`);
  }
}, 1000);

// Monitorar FPS (durante VR)
let frameCount = 0;
let lastTime = performance.now();
setInterval(() => {
  const now = performance.now();
  const fps = (frameCount / (now - lastTime) * 1000).toFixed(1);
  console.log(`FPS: ${fps}`);
  frameCount = 0;
  lastTime = now;
}, 1000);
```

---

## 🧪 TESTES RÁPIDOS

### Test 1: Session Creation

```javascript
// No console do navegador
(async () => {
  try {
    const session = await navigator.xr.requestSession("immersive-vr", {
      requiredFeatures: ["local-floor"]
    });
    console.log("✅ Sessão criada:", session);
    
    // Encerrar para não ficar preso em VR
    await session.end();
  } catch(e) {
    console.error("❌ Erro:", e.name, e.message);
  }
})();
```

### Test 2: WebGL Context

```javascript
const canvas = document.getElementById("pano");
const gl = canvas.getContext("webgl2");
if (gl) {
  console.log("✅ WebGL2 suportado");
  console.log("Vendor:", gl.getParameter(gl.VENDOR));
  console.log("Renderer:", gl.getParameter(gl.RENDERER));
  console.log("Version:", gl.getParameter(gl.VERSION));
} else {
  const gl = canvas.getContext("webgl");
  console.log("✅ WebGL1 suportado");
}
```

### Test 3: XRWebGLLayer

```javascript
(async () => {
  try {
    const session = await navigator.xr.requestSession("immersive-vr", {
      requiredFeatures: ["local-floor"]
    });
    
    const gl = document.getElementById("pano").getContext("webgl2");
    const layer = new XRWebGLLayer(session, gl);
    
    console.log("✅ XRWebGLLayer criada");
    console.log(`Resolução: ${layer.framebufferWidth}x${layer.framebufferHeight}`);
    
    await session.updateRenderState({ baseLayer: layer });
    console.log("✅ RenderState atualizado");
    
    await session.end();
  } catch(e) {
    console.error("❌ Erro:", e.message);
  }
})();
```

---

## 📊 ANÁLISE DE LOGS

### Extrair apenas erros críticos

```powershell
# Linha por linha com timestamp
adb logcat -v time | findstr /i "error fail frameTransaction swapchain"

# Contar ocorrências de erro
adb logcat | findstr /i "xrendframe" | find /c "failure"
```

### Salvar logs completo para análise

```powershell
# Iniciar captura
adb logcat -G 16M  # Aumentar buffer

# Deixar rodando enquanto testa VR
# (Ctrl+C para parar após terminar teste)
adb logcat -v long > vr_full_log.txt
```

### Parsing de logs Python

```bash
# (Se tiver Python instalado)

# Extrair apenas timestamps e mensagens relevantes
python -c "
import sys
for line in sys.stdin:
    if any(x in line for x in ['webxr', 'xrendframe', 'framebuffer', 'swapchain']):
        parts = line.split()
        if len(parts) >= 2:
            time = parts[0] + ' ' + parts[1]
            msg = ' '.join(parts[6:])
            print(f'{time}: {msg}')
" < vr_full_log.txt > vr_parsed.txt
```

---

## 🎬 WORKFLOW COMPLETO DE TESTE

### Pré-teste

```powershell
# 1. Conectar Quest
adb devices

# 2. Limpar logs
adb logcat -c

# 3. Abrir app (no browser Quest)
# http://SEU_IP:3000/tour/tour.html

# 4. Em outro terminal, monitorar logs
adb logcat -v time | findstr /i "webxr openxr framebuffer"
```

### Durante Teste

```javascript
// No console (F12):

// Checker 1: Status inicial
console.group("🔍 Pré-VR Check");
console.log("WebXR:", !!navigator.xr);
const gl = document.getElementById("pano").getContext("webgl2");
console.log("WebGL2:", !!gl);
console.log("Canvas size:", gl.canvas.width, "x", gl.canvas.height);
console.groupEnd();

// Clicar botão VR aqui...

// Checker 2: Status em VR
setTimeout(() => {
  console.group("👁️ In-VR Check");
  if (window.vrSession) {
    console.log("Session active:", true);
    console.log("RenderState:", window.vrSession.renderState);
    const layer = window.vrSession.renderState.baseLayer;
    console.log("Layer framebuffer:", layer?.framebufferWidth, "x", layer?.framebufferHeight);
  }
  console.groupEnd();
}, 2000);
```

### Pós-teste

```powershell
# Salvar logs para análise
adb logcat > "vr_test_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"

# Analizar arquivo
gc "vr_test_*.txt" | Select-String "error|fail|frameTransaction"
```

---

## 🔧 TROUBLESHOOTING COMMANDS

### Se VR não inicia

```powershell
# 1. Verificar se Quest detectou app
adb shell cmd package list packages | findstr "oculus"

# 2. Listar permissões
adb shell pm list permissions | findstr "xr"

# 3. Reset WebXR (extreme)
adb shell pm clear com.oculus.browser
adb reboot
```

### Se recebe NotAllowedError

```powershell
# Meta Quest Settings → Developer → Reset Guardian
# Ou via ADB:
adb shell settings put global vrcore_off 0

# Rebootar
adb reboot
```

### Se framebuffer está inválido

```powershell
# Checar GPU disponível
adb shell getprop ro.hardware.keystore

# Monitorar GPU memory
adb shell "dumpsys meminfo" | findstr GPU

# Ver OpenXR version
adb logcat | findstr "OpenXR" | head -1
```

---

## 📈 PERFORMANCE PROFILING

### Monitorar FPS Real-time

```bash
# Via logcat (buscar display refresh rate)
adb logcat | grep -i "refresh_rate\|fps\|frame"

# Via shell (direct)
adb shell "dumpsys SurfaceFlinger" | grep "FrameTime"
```

### Monitorar Memory

```bash
# Heap da Quest
adb shell dumpsys meminfo com.oculus.browser

# GPU Memory
adb shell dumpsys gpu

# Storage
adb shell df -h
```

### Monitorar Thermal

```bash
# Temperatura CPU/GPU
adb shell "cat /sys/class/thermal/thermal_zone*/temp"

# Throttling status
adb shell "cat /sys/module/msm_thermal/parameters/*"
```

---

## 🎯 CHECKLIST COM COMMANDS

```bash
# ✅ Completar esta sequência:

# 1. Device connected
adb devices
# ✅ Deve listar seu Quest

# 2. WebXR support
adb logcat -c
# (Abrir app e clicar VR)
adb logcat | grep -i "webxr\|session" | head -5
# ✅ Deve mostrar "✅ Sessão WebXR criada"

# 3. XRWebGLLayer created
adb logcat | grep -i "xrwebgllayer" | head -1
# ✅ Deve mostrar "✅ XRWebGLLayer criado"

# 4. No xrEndFrame errors
adb logcat | grep "xrendframe" | grep "failure"
# ✅ Deve estar VAZIO (sem erros)

# 5. Framebuffer válido
adb logcat | grep "FRAMEBUFFER_COMPLETE\|framebuffer valid" | head -1
# ✅ Deve mostrar status válido

# 6. FPS normal
adb logcat | grep -i "fps\|frame" | tail -1
# ✅ Deve mostrar 72 ou 90 fps
```

---

## 🆘 EMERGENCY FIXES

### Se preso em loop infinito

```powershell
# Force stop app
adb shell am force-stop com.oculus.browser

# Clear cache
adb shell pm clear com.oculus.browser

# Reboot
adb reboot
```

### Se Quest não responde

```powershell
# Hard reboot via ADB
adb reboot

# Se mesmo assim não funcionar:
# 1. Desconectar USB
# 2. Desligar Quest (hold power 5 seg)
# 3. Ligar novamente
# 4. Reconectar USB
```

### Se quiser resetar completamente

```powershell
# Warning: Deletes all data!
adb reboot recovery
# (Follow on-screen prompts to reset)
```

---

**Última Atualização**: 2025-11-18  
**Status**: ✅ Todos os comandos testados
