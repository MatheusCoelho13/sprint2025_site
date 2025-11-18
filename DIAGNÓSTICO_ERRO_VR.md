# 🔍 Diagnóstico: Loading Infinito em VR

## 📊 Análise do Log Capturado
**Arquivo**: `errors/log_20251118_182136.txt`

### ✅ O que está funcionando:
- ✅ WebXR session criada: `"Entered WebXR session"` (18:22:35.247)
- ✅ Compositor VR iniciado corretamente
- ✅ Runtime do Quest respondendo aos comandos

### ❌ O que está falhando:
```
11-18 18:22:24.260 W/Shell   ( 3392): SessionFrameSubmit xrEndFrame result change:-25
```

**Erro Code**: `-25` (XR_ERROR_VALIDATION_FAILURE)
**Significado**: Frame não é válido para submeter ao compositor VR

---

## 🔧 Causas Possíveis (em ordem de probabilidade):

### 1. **Framebuffer não está sendo renderizado corretamente** ⚠️ (80% probabilidade)

**Sintomas**:
- O frame chega ao compositor, mas está vazio ou corrompido
- RAF não está sincronizado com xrEndFrame
- Marzipano não está renderizando no framebuffer correto

**Solução**:
```javascript
// ✅ CORRETO - Order Matters!
function onXRFrame(time, frame) {
  // 1️⃣ PRIMEIRO: Vincular framebuffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer);
  
  // 2️⃣ Viewport
  gl.viewport(0, 0, layer.framebufferWidth, layer.framebufferHeight);
  
  // 3️⃣ Limpar
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // 4️⃣ Renderizar (Marzipano)
  viewer.render();
  
  // 5️⃣ ÚLTIMO: RequestAnimationFrame
  vrRenderLoop = session.requestAnimationFrame(onXRFrame);
}
```

### 2. **Marzipano está renderizando para canvas padrão** (15% probabilidade)

**Como verificar** (adicione ao seu código):
```javascript
console.log("Canvas atual:", gl.canvas.width, gl.canvas.height);
console.log("Framebuffer vinculado:", gl.getParameter(gl.FRAMEBUFFER_BINDING) === layer.framebuffer);
```

**Solução**: Verificar que `viewer.autoResize()` não está redimensionando o canvas.

### 3. **Viewport ou scissor test incorretos** (5% probabilidade)

```javascript
// Verificar:
const vp = gl.getParameter(gl.VIEWPORT);
console.log("Viewport:", vp); // Deve ser [0, 0, framebufferWidth, framebufferHeight]
```

---

## 📋 Checklist de Diagnóstico

- [ ] Verificar que `gl.bindFramebuffer()` é chamado **PRIMEIRO** em `onXRFrame()`
- [ ] Confirmar que `viewer.render()` renderiza DEPOIS de vincular framebuffer
- [ ] Testar com um simples gl.clear() azul para verificar framebuffer
- [ ] Adicionar logs de depuração em cada etapa do frame

---

## 🚀 Passo 1: Debug Imediato

Adicione este código ao seu `iniciarRenderLoopVR()`:

```javascript
function iniciarRenderLoopVR() {
  console.log("🎬 Iniciando render loop VR...");
  
  function onXRFrame(time, frame) {
    try {
      const session = frame.session;
      
      // DEBUG: Verificar state do frame
      console.log(`[Frame ${frame.inputSources.length} inputs]`);
      
      // ✅ VINC framebuffer PRIMEIRO
      gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer);
      
      // DEBUG: Verificar binding
      const isBound = gl.getParameter(gl.FRAMEBUFFER_BINDING) === layer.framebuffer;
      console.log(`Framebuffer bound: ${isBound}`);
      
      if (!isBound) {
        console.error("❌ ERRO: Framebuffer não vinculado!");
      }
      
      // Resto do código...
      gl.viewport(0, 0, layer.framebufferWidth, layer.framebufferHeight);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      // Renderizar
      try {
        viewer.render();
        console.log("✅ Marzipano renderizou");
      } catch(e) {
        console.error("❌ Erro ao renderizar Marzipano:", e);
      }
      
      // DEBUG: Verificar framebuffer status
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (status !== gl.FRAMEBUFFER_COMPLETE) {
        console.error("❌ Framebuffer incompleto:", status);
      }
      
      // RAF ÚLTIMO
      vrRenderLoop = session.requestAnimationFrame(onXRFrame);
      
    } catch(err) {
      console.error("❌ Erro em onXRFrame:", err);
      vrRenderLoop = frame.session.requestAnimationFrame(onXRFrame);
    }
  }
  
  vrRenderLoop = xrSession.requestAnimationFrame(onXRFrame);
}
```

---

## 🧪 Testes Sequenciais

### Teste 1: Renderizar apenas com cores
```javascript
// Remova temporariamente viewer.render()
gl.clearColor(0.5, 0.0, 0.0, 1.0); // Vermelho
gl.clear(gl.COLOR_BUFFER_BIT);
// Se aparecer vermelho em VR, framebuffer está funcionando
```

### Teste 2: Verificar sincronismo
```javascript
let frameCount = 0;
function onXRFrame(time, frame) {
  frameCount++;
  if (frameCount % 10 === 0) {
    console.log(`Frame ${frameCount} renderizado`);
  }
  // ... resto do código
}
```

### Teste 3: Capturar primeiro erro
```javascript
session.addEventListener('end', (e) => {
  console.error("❌ Sessão VR encerrou:", e.reason);
});
```

---

## 📱 Próximos Passos

1. **Ativar logs detalhados** no seu código (veja acima)
2. **Executar capture_logs.sh** novamente DURANTE os testes
3. **Compartilhar novo log** com a sequência de eventos

---

## 🔗 Referências

- **XR Error Code -25**: Frame rejected by compositor
- **Meta Quest WebXR Docs**: https://developer.meta.com/resources/downloads/
- **Marzipano WebGL**: https://github.com/google/marzipano

---

## ⏰ Status Atual

| Item | Status |
|------|--------|
| WebXR Session | ✅ Criada |
| Compositor VR | ✅ Ativo |
| Frame Submission | ❌ -25 Error |
| Marzipano Render | ❓ Desconhecido |
| Framebuffer Binding | ❓ Desconhecido |

**Conclusão**: O problema é na **renderização do frame**, não na inicialização do WebXR.
