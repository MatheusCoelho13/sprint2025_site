# 🚀 Próximos Passos: Capturar Logs de Debug

## ✅ O que foi feito

Adicionei **console.logs detalhados** em 2 funções principais:

1. **`iniciarVR()`** - Logs de cada etapa da inicialização WebXR
   - Detecção de suporte WebXR
   - Criação da session
   - Reference space setup
   - WebGL context
   - XRWebGLLayer creation ← **CRÍTICO**
   - RenderState update ← **CRÍTICO**

2. **`iniciarRenderLoopVR()`** - Logs a cada frame renderizado
   - Verificação de framebuffer binding
   - Status do framebuffer (COMPLETE?)
   - Contagem de frames
   - Detecção de erros críticos

## 🎯 Como testar agora

### Passo 1: Limpar e rodar novo teste
```bash
# Entrar na pasta do projeto
cd "c:\Users\Matheus coelho\Desktop\projetodev\faculdade\biotic_sprint"

# Tornar script executável (se necessário)
chmod +x capture_debug_logs.sh

# Rodar captura de 90 segundos
./capture_debug_logs.sh
```

### Passo 2: DURANTE a captura (primeiros 30 segundos)
1. No seu Meta Quest, abra o navegador
2. Acesse seu tour (provavelmente http://192.168.x.x:5173 ou similar)
3. Clique em **"🥽 Entrar em VR"**
4. Espere 5-10 segundos e veja se trava em loading infinito

### Passo 3: Análise automática
O script vai:
- ✅ Salvar logs em `errors/debug_YYYYMMDD_HHMMSS.txt`
- ✅ Contar erros, console.logs, logs WebXR
- ✅ Mostrar snippets importantes
- ✅ Exibir as últimas 20 linhas

## 🔍 O que procurar nos logs

### ✅ SE TUDO ESTÁ BOM, você verá:
```
⏳ Iniciando sessão XR...
📋 Solicitando WebXR immersive-vr...
✅ Sessão WebXR criada com sucesso
✅ Reference space: local-floor OK
🎨 Obtendo contexto WebGL...
✅ WebGL context obtido: WebGL 2.0
📦 Criando XRWebGLLayer...
✅ XRWebGLLayer criado com sucesso
   📐 Resolução framebuffer: 1536x1536 (ou similar)
   🎯 Framebuffer object: true
⚙️  Atualizando RenderState...
✅ RenderState configurado com XRWebGLLayer
🎬 Iniciando render loop VR...
✅ Frame 90 renderizado para WebXR com sucesso
```

### ❌ SE TEM PROBLEMA, você verá:
```
❌ ERRO CRÍTICO: Framebuffer NÃO vinculado no frame 1
❌ Framebuffer incompleto (status 36054)
❌ ERRO ao iniciar VR: NotSupportedError
❌ Falha ao criar XRWebGLLayer: ...
```

## 📊 Interpretando os resultados

| Log | Significado | Ação |
|-----|-------------|------|
| `Framebuffer NÃO vinculado` | gl.bindFramebuffer não funcionou | Verificar WebGL context |
| `Framebuffer incompleto` | Status != FRAMEBUFFER_COMPLETE | Recheck XRWebGLLayer config |
| `Pose null` | frame.getViewerPose() retornou null | Verificar reference space |
| `Frame X renderizado` | Frame foi processado corretamente | ✅ Tudo OK |
| `0 console.logs` | Nenhum log apareceu | Problema na inicialização |

## 🛠️ Se aparecer erro...

1. **Copie o erro exato** do log
2. Procure em `DIAGNÓSTICO_ERRO_VR.md`
3. Se não encontrar, nos mande o arquivo `errors/debug_*.txt`

## 📝 Arquivo de logs esperado

```
errors/
  └── debug_20251118_183045.txt (~5-10MB)
```

Conterá tudo que o Chrome/navegador registrou durante esses 90 segundos.

## ⚡ Quick Commands

```bash
# Ver arquivo inteiro
cat errors/debug_*.txt | tail -100

# Filtrar apenas erros
grep -i "error\|❌" errors/debug_*.txt

# Filtrar apenas WebXR
grep -i "webxr\|xrwebglayer" errors/debug_*.txt

# Contar linhas por tipo
grep -c "✅" errors/debug_*.txt  # Sucessos
grep -c "❌" errors/debug_*.txt  # Erros
```

---

## ✨ Resultado esperado

Depois de rodar e compartilhar o log, conseguiremos identificar EXATAMENTE qual passo falha:

1. Inicialização WebXR?
2. Criação do XRWebGLLayer?
3. Configuração do RenderState?
4. Render loop (framebuffer binding)?
5. Marzipano renderization?

**Vamos conseguir resolver! 🎯**
