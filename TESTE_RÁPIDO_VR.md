# 🧪 GUIA DE TESTE RÁPIDO - VR NO META QUEST

## 📱 Pré-Requisitos

1. **Meta Quest 3** (ou Quest Pro/Quest 2) com OculusBrowser atualizado
2. **ADB configurado** no Windows
3. **App rodando** em: `http://localhost:3000/public/tour/tour.html` (ou similar)

---

## ⚡ TESTE RÁPIDO (5 minutos)

### 1️⃣ No Windows - Limpar e monitorar logs

```bash
# Terminal 1: Limpar logs antigos
adb logcat -c

# Terminal 2: Monitorar logs (deixe aberto)
adb logcat | grep -i "openxr\|webxr\|xr\|vrshell\|framebuffer\|swapchain"
```

### 2️⃣ No Meta Quest

1. Abrir **OculusBrowser**
2. Navegar para: `http://SEU_IP:3000/public/tour/tour.html`
3. Esperar panorama carregar (deve ver a primeira cena 360)
4. **Clicar no botão "🥽 Entrar em VR"** (canto inferior direito)

### 3️⃣ Resultado Esperado

```
✅ SUCESSO:
- Botão muda para "🚪 Sair de VR"
- Pode pôr óculos (Meta Quest auto-enters VR)
- Vê o panorama em HD nos dois olhos
- Pode olhar em volta naturalmente
- Log mostra:
  ✅ Sessão WebXR criada com sucesso
  ✅ XRWebGLLayer criado
  ✅ Framebuffer: 1536 x 1536 (ou similar)
  ✅ RenderState configurado com XRWebGLLayer
  ✅ Frame renderizado para WebXR

❌ FALHA:
- Tela fica "carregando..." infinitamente
- Botão desaparece ou fica desabilitado
- Log mostra:
  ❌ xrEndFrame frameTransaction failure
  ❌ swapchains not marked as used-in-frame
  ❌ NotAllowedError / NotSupportedError
```

---

## 🔍 Verificações Detalhadas

### Check 1: WebXR Support

No console do navegador (F12):
```javascript
// Deve retornar true
navigator.xr.isSessionSupported("immersive-vr").then(r => console.log("VR suportado:", r))
```

### Check 2: WebGL Context

```javascript
const canvas = document.getElementById("pano");
const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
console.log("WebGL disponível:", !!gl);
console.log("Vendor:", gl.getParameter(gl.VENDOR));
console.log("Renderer:", gl.getParameter(gl.RENDERER));
```

### Check 3: XRWebGLLayer Framebuffer

Monitorar a cada frame (coloque no console):
```javascript
setInterval(() => {
  if (window.vrSession && window.vrSession.renderState.baseLayer) {
    const layer = window.vrSession.renderState.baseLayer;
    console.log("Layer exists:", !!layer);
    console.log("Framebuffer:", layer.framebufferWidth, "x", layer.framebufferHeight);
    console.log("Framebuffer object:", !!layer.framebuffer);
  }
}, 1000);
```

---

## 📊 Monitorar Performance

```bash
# Monitorar FPS da GPU Quest
adb logcat | grep -i "fps\|frame rate\|refresh"

# Monitorar memory
adb logcat | grep -i "memory\|allocation"

# Monitorar errors
adb logcat | grep -i "error\|fail\|fatal"
```

---

## 🆘 Se der erro...

### Erro: "NotAllowedError"
```
❌ VR bloqueado ou sem permissão

Solução:
1. Rebootar Meta Quest
2. Abrir Meta Quest app → Developer Settings
3. Confirmar que "Unknown Sources" está ativado
4. Voltar ao navegador e tentar novamente
```

### Erro: "NotSupportedError"
```
❌ Dispositivo/navegador não suporta immersive-vr

Solução:
1. Verificar OculusBrowser versão (deve ser latest)
2. Desinstalar e reinstalar OculusBrowser
3. Confirmar que está em "immersive-vr" mode, não "inline"
```

### Erro: "swapchains not marked as used-in-frame"
```
❌ Frames não estão sendo renderizados corretamente

Solução:
1. Verificar que gl.bindFramebuffer() é chamado ANTES de renderizar
2. Verificar que XRWebGLLayer foi criado com sucesso
3. Verificar logs: "✅ XRWebGLLayer criado"
4. Se ainda falhar, pode ser GPU overload:
   - Reduzir qualidade de textura
   - Usar framebufferScaleFactor: 0.8
```

### Erro: "XRWebGLLayer not created"
```
❌ Falha ao criar a layer

Solução:
1. Verificar WebGL context:
   const gl = canvas.getContext("webgl2");
   console.log("WebGL OK:", !!gl);
2. Se for null, canvas pode estar com display:none
3. Verificar que XRWebGLLayer é suportado:
   console.log("XRWebGLLayer:", typeof XRWebGLLayer);
```

---

## ✅ Validação Final

Se chegou aqui e viu tudo ✅:

1. **Documentar sucesso**:
   ```bash
   # Salvar logs da sessão bem-sucedida
   adb logcat > vr_session_success_$(date +%s).txt
   ```

2. **Testar navegação entre cenas**:
   - Olhar para hotspot (ponto branco de ligação)
   - Pressionar botão do controlador
   - Deve mudar para próxima cena

3. **Testar saída de VR**:
   - Pressionar botão home do Meta Quest
   - Ou clicar em "🚪 Sair de VR" via controller

---

## 📈 Performance Target

- **FPS**: 72-90 fps (conforme Meta Quest)
- **Latência**: < 20ms (movimento de cabeça → renderização)
- **Framebuffer**: 1024x1024 ou 1536x1536 por olho
- **Memory**: < 2GB (Quest 3 tem 8GB, mas app deve usar < 500MB)

---

## 🎯 Próximos Testes Avançados

- [ ] Hand tracking (pegar em hotspots)
- [ ] Eye tracking (mirar com os olhos)
- [ ] Frame rate switching (72 ↔ 90 Hz)
- [ ] Passthrough (render com câmera)
- [ ] Guardian (play space tracking)

---

**Duração esperada**: 5-10 minutos
**Sucesso = você pode entrar em VR sem erro de loading infinito**
