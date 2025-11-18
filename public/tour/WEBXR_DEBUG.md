# 🥽 WebXR Debug Guide - Meta Quest + Marzipano

## ✅ CORREÇÕES IMPLEMENTADAS

### 1. **Adicionado requestAnimationFrame contínuo**
   - ✅ Mantém a sessão XR ativa
   - ✅ Evita carregamento infinito
   - ✅ Permite rastreamento de pose

### 2. **Removed dom-overlay (incompatível com Marzipano)**
   - ❌ dom-overlay não funciona com canvas Marzipano
   - ✅ Usando apenas local-floor + viewer fallback

### 3. **Async/await adequado**
   - ✅ Proper error handling
   - ✅ Disable botão durante carregamento
   - ✅ Estados corretos de sessão

### 4. **Fallback para viewer-space**
   - ✅ Se local-floor falhar, tenta viewer
   - ✅ Funciona em qualquer Meta Quest

---

## 🔧 COMO TESTAR NO META QUEST

### **1. Monitorar logs WebXR com ADB**

```bash
# Terminal no Windows (cmd ou PowerShell)
adb logcat | findstr /i "webxr xr immersive"
```

### **2. Monitorar especificamente Chromium**

```bash
adb logcat | findstr /i "chromium"
```

### **3. Capturar TODOS os logs**

```bash
adb logcat > xr_logs.txt
# Deixar rodando enquanto testa no Quest
# Depois colar aqui para análise
```

### **4. Ver erros de WebGL**

```bash
adb logcat | findstr /i "webgl"
```

---

## ✔️ O QUE VERIFICAR NOS LOGS

### **Sucesso - Você verá:**
```
✅ [Chromium] WebXR session created
✅ [Chromium] XR Frame started
✅ [Chromium] Reference space obtained
```

### **Erro 1 - NotAllowedError**
```
❌ NotAllowedError: User denied VR permission
```
**Solução:** Permitir VR nas configurações do Oculus Browser

### **Erro 2 - NotSupportedError**
```
❌ NotSupportedError: immersive-vr not supported
```
**Solução:** Verificar versão do Oculus Browser

### **Erro 3 - AbortError**
```
❌ AbortError: XR session aborted
```
**Solução:** Resetar Oculus Browser ou reiniciar headset

### **Erro 4 - IMU Error (Tracking)**
```
❌ IMU failure detected
```
**Solução:** Calibrar headset (Oculus > Settings > Developer)

---

## 🎮 TESTANDO MANUALMENTE NO QUEST

### **Passo 1: Conectar via ADB**
```bash
adb devices
```

### **Passo 2: Abrir seu site no Oculus Browser**
1. Colocar headset
2. Oculus Browser > endereço > http://seu-ip:porta/tour

### **Passo 3: Clicar em "Entrar em VR"**
- Observe o console (F12 ou adb logcat)
- Veja se a tela de carregamento aparece
- Veja se entra em VR

### **Passo 4: Ver logs em tempo real**
```bash
adb logcat -s Chromium:* | grep -i webxr
```

---

## 📊 CHECKLIST DE VALIDAÇÃO

- [ ] Botão VR aparece no Meta Quest
- [ ] Clique no botão dispara evento
- [ ] Tela de loading VR aparece
- [ ] Sessão XR é criada (check logs)
- [ ] Reference space é obtido
- [ ] Marzipano renderiza em VR
- [ ] Hotspots funcionam em VR
- [ ] Sair de VR funciona

---

## 🔍 LOGS ESPERADOS (CONSOLE DO NAVEGADOR)

```javascript
📱 Meta Quest detectado: true
✅ Dados carregados: 19 cenas
✅ Marzipano Viewer iniciado
✨ Cena "0-inicio_tour_tarde" carregada com 1 hotspots
🥽 Inicializando WebXR para Meta Quest...
✅ VR imersivo suportado!
🖱️ Botão VR clicado
⏳ Iniciando sessão XR...
✅ Sessão XR criada: XRSession {...}
✅ Reference space local-floor obtido
🎬 Iniciando render loop VR
🎥 VR renderizando - Pose: {x: 0, y: 1.6, z: 0}
```

---

## 🐛 SE AINDA FICAR TRAVADO

### **Causa 1: RAF não está rodando**
```javascript
// Ver no console:
console.log(vrRenderLoop); // Não deve ser null
```

### **Causa 2: Pose é null**
```javascript
// Adicionar no onXRFrame:
console.log("Frame pose:", frame.getViewerPose(xrRefSpace));
```

### **Causa 3: Reference space falhou**
```javascript
// Verificar fallback funcionou
console.log("XR Ref Space:", xrRefSpace); // Não deve ser null
```

### **Causa 4: Session end event**
```javascript
// Verif se session ended antes de começar
vrSession.addEventListener("end", () => console.log("SESSION ENDED"));
```

---

## 💡 DICAS IMPORTANTES

1. **Always requestAnimationFrame** - WebXR precisa de RAF contínuo
2. **Teste em browser desktop primeiro** - Chrome com WebXR emulator
3. **Use console.log abundantemente** - Você não verá tela em VR
4. **Capture logs com ADB** - Erros só aparecem nos logs do sistema
5. **Reinicie o headset** - Se algo estranho acontecer
6. **Verifique permissões** - Settings > Apps > Oculus Browser > VR

---

## 🚀 PRÓXIMOS PASSOS

1. Teste agora com o botão
2. Capture logs com: `adb logcat | findstr /i webxr`
3. Cole os logs aqui para análise final
4. Se entrar em VR mas Marzipano não renderizar, aviso!

