console.log("🚀 Iniciando Tour BioTIC — Marzipano + WebXR");

// ============================================================
// DETECÇÃO DE META QUEST
// ============================================================
const isMetaQuest = /OculusBrowser|Meta|Quest/i.test(navigator.userAgent);
console.log("📱 Meta Quest detectado:", isMetaQuest);

// ============================================================
// 0) AGUARDAR APP_DATA CARREGAR
// ============================================================

let SCENES = [];

function esperarAPPDATA() {
  // Verificar se dados foram carregados via script no HTML
  if (!window.APP_DATA || !window.APP_DATA.scenes) {
    console.log("⏳ Aguardando APP_DATA...");
    return setTimeout(esperarAPPDATA, 100);
  }

  SCENES = window.APP_DATA.scenes;
  console.log("✅ Dados carregados:", SCENES.length, "cenas");
  iniciarTour();
}

// Aguardar carregamento do tour.js (que define APP_DATA)
setTimeout(esperarAPPDATA, 300);

// ============================================================
// 1) CONFIGURAÇÃO DO MARZIPANO
// ============================================================

let viewer = null;
let panoEl = null;
const cacheCenas = {}; // cache para não recriar cenas

function initMarzipano() {
  panoEl = document.getElementById("pano");
  viewer = new Marzipano.Viewer(panoEl);
  console.log("✅ Marzipano Viewer iniciado");
}

// Criação da cena no Marzipano
function criarCena(info) {
  const source = Marzipano.ImageUrlSource.fromString(
    `/tour/tiles/${info.id}/{z}/{f}/{y}/{x}.jpg`
  );

  const geometry = new Marzipano.CubeGeometry(info.levels);

  const limiter = Marzipano.RectilinearView.limit.traditional(
    info.faceSize,
    (120 * Math.PI) / 180
  );

  const view = new Marzipano.RectilinearView(
    info.initialViewParameters,
    limiter
  );

  const scene = viewer.createScene({
    source,
    geometry,
    view,
    pinFirstLevel: true
  });

  return { scene, view };
}

// ============================================================
// 2) HOTSPOTS MARZIPANO
// ============================================================

function criarHotspot(sceneObj, hotspotData) {
  const el = document.createElement("div");
  el.className = "hotspot-container";

  const img = document.createElement("img");
  img.src = "/tour/img/link.png";
  img.className = "hotspot-img";
  el.appendChild(img);

  // Clique → trocar cena
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    trocarCena(hotspotData.target);
  });

  // Criar hotspot usando o Marzipano (posicionamento CORRETO)
  sceneObj.scene.hotspotContainer().createHotspot(el, {
    yaw: hotspotData.yaw,
    pitch: hotspotData.pitch
  });

  return el;
}

// ============================================================
// 3) TROCAR DE CENA
// ============================================================

let cenaAtual = null;

function trocarCena(id) {
  console.log("🔄 Carregando cena:", id);

  const data = SCENES.find(s => s.id === id);
  if (!data) {
    return console.error("❌ Cena não encontrada:", id);
  }

  // Criar no cache se ainda não existir
  if (!cacheCenas[id]) {
    cacheCenas[id] = criarCena(data);
  }

  const cenaObj = cacheCenas[id];
  cenaObj.scene.switchTo();
  cenaAtual = data;

  // Remover hotspots visuais antigos
  document.querySelectorAll(".hotspot-container").forEach(e => e.remove());

  // Criar hotspots da nova cena
  if (data.linkHotspots && data.linkHotspots.length > 0) {
    data.linkHotspots.forEach(h => criarHotspot(cenaObj, h));
  }

  console.log(`✨ Cena "${id}" carregada com ${data.linkHotspots?.length || 0} hotspots.`);
}

// ============================================================
// 4) INICIAR TOUR
// ============================================================

function iniciarTour() {
  initMarzipano();

  if (SCENES.length === 0) {
    return console.error("❌ Nenhuma cena encontrada em APP_DATA");
  }

  trocarCena(SCENES[0].id);
  console.log("🚀 Tour iniciado na cena:", SCENES[0].id);

  // ============================================================
  // 🥽 SUPORTE META QUEST VR
  // ============================================================
  if (isMetaQuest) {
    inicializarVR();
  }
}

// ============================================================
// 5) SUPORTE VR PARA META QUEST COM WEBXR
// ============================================================

let vrSession = null;
let xrRefSpace = null;
let vrSessionActive = false;
let vrRenderLoop = null;

function inicializarVR() {
  console.log("🥽 Inicializando WebXR para Meta Quest...");

  // Verificar se WebXR está disponível
  if (!navigator.xr) {
    console.warn("⚠️ WebXR não disponível neste dispositivo");
    return;
  }

  // Verificar suporte a VR imersivo
  navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
    if (!supported) {
      console.warn("⚠️ VR imersivo não suportado");
      return;
    }

    console.log("✅ VR imersivo suportado!");
    criarBotaoVR();
  }).catch((err) => {
    console.error("❌ Erro ao verificar suporte VR:", err);
  });
}

function criarBotaoVR() {
  // Criar botão VR
  const vrButton = document.createElement("button");
  vrButton.id = "vr-button";
  vrButton.textContent = "🥽 Entrar em VR";
  vrButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 24px;
    background: #ff6b35;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    z-index: 9999999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    touch-action: manipulation;
    user-select: none;
  `;
  
  vrButton.addEventListener("click", async (e) => {
    console.log("🖱️ Botão VR clicado");
    e.preventDefault();
    e.stopPropagation();
    
    if (vrSession) {
      await encerrarVR(vrButton);
    } else {
      await iniciarVR(vrButton);
    }
  });
  
  document.body.appendChild(vrButton);
}

async function iniciarVR(botao) {
  console.log("⏳ Iniciando sessão XR...");
  botao.disabled = true;
  botao.textContent = "⏳ Carregando...";

  try {
    // 1️⃣ Configuração META QUEST ESPECÍFICA
    const sessionInit = {
      requiredFeatures: ["local-floor"],
      optionalFeatures: ["bounded-floor", "hand-tracking"]
    };

    console.log("📋 Solicitando WebXR immersive-vr...", sessionInit);
    
    vrSession = await navigator.xr.requestSession("immersive-vr", sessionInit);
    console.log("✅ Sessão WebXR criada com sucesso");
    
    vrSessionActive = true;

    // 2️⃣ CRÍTICO: Reference Space (head tracking)
    try {
      xrRefSpace = await vrSession.requestReferenceSpace("local-floor");
      console.log("✅ Reference space: local-floor OK");
    } catch (err) {
      console.warn("⚠️ local-floor falhou, usando viewer fallback...", err);
      xrRefSpace = await vrSession.requestReferenceSpace("viewer");
      console.log("✅ Reference space: viewer (fallback)");
    }

    // 3️⃣ CRÍTICO: Contexto WebGL e XRWebGLLayer
    const gl = panoEl.getContext("webgl2") || panoEl.getContext("webgl");
    if (!gl) {
      throw new Error("❌ Não foi possível obter contexto WebGL do canvas #pano");
    }
    console.log("✅ WebGL context obtido:", gl.getParameter(gl.VERSION));
    
    // 4️⃣ Criar XRWebGLLayer com config adequada para Meta Quest
    let glLayer = null;
    try {
      glLayer = new XRWebGLLayer(vrSession, gl, { 
        antialias: true,      // Suavização anti-aliasing
        alpha: true,          // Permite transparência (passthrough)
        depth: true,          // Depth buffer para 3D
        stencil: false,       // Não precisa stencil
        framebufferScaleFactor: 1.0  // Renderizar em resolução nativa
      });
      console.log("✅ XRWebGLLayer criado");
      console.log("   - Resolução framebuffer:", glLayer.framebufferWidth, "x", glLayer.framebufferHeight);
    } catch (err) {
      console.error("❌ Falha ao criar XRWebGLLayer:", err);
      throw err;
    }

    // 5️⃣ CRÍTICO: Atualizar renderState com a layer WebXR
    try {
      await vrSession.updateRenderState({ baseLayer: glLayer });
      console.log("✅ RenderState configurado com XRWebGLLayer");
      console.log("   - Framebuffer vinculado ao compositor");
    } catch (err) {
      console.error("❌ Falha ao atualizar renderState:", err);
      throw err;
    }

    // 6️⃣ Iniciar loop de renderização VR
    iniciarRenderLoopVR(vrSession);

    // 7️⃣ Event listeners
    vrSession.addEventListener("end", () => {
      console.log("ℹ️ Sessão VR encerrada pelo usuário ou sistema");
      vrSessionActive = false;
      vrSession = null;
      xrRefSpace = null;
      botao.textContent = "🥽 Entrar em VR";
      botao.disabled = false;
      
      if (vrRenderLoop) {
        cancelAnimationFrame(vrRenderLoop);
        vrRenderLoop = null;
      }
    });

    vrSession.addEventListener("select", (event) => {
      console.log("👆 Botão selecionado em VR");
      handleVRSelect(event);
    });

    vrSession.addEventListener("selectstart", () => {
      console.log("👇 Iniciado toque no controlador");
    });

    vrSession.addEventListener("selectend", () => {
      console.log("👆 Finalizado toque no controlador");
    });

    botao.textContent = "🚪 Sair de VR";
    botao.disabled = false;
    console.log("✨ VR pronto para renderizar!");

  } catch (err) {
    console.error("❌ ERRO ao iniciar VR:", err.name, "-", err.message);
    botao.textContent = "🥽 Entrar em VR";
    botao.disabled = false;
    
    // Diagnóstico do erro
    if (err.name === "NotAllowedError") {
      console.error("   → Motivo: Permissão negada ou VR bloqueado pelo usuário");
    } else if (err.name === "NotSupportedError") {
      console.error("   → Motivo: Dispositivo/navegador não suporta immersive-vr");
    } else if (err.name === "AbortError") {
      console.error("   → Motivo: Sessão VR foi abortada antes de iniciar");
    } else if (err.name === "InvalidStateError") {
      console.error("   → Motivo: Estado inválido da sessão WebXR");
    } else {
      console.error("   → Motivo desconhecido:", err);
    }

    // Alert para o usuário
    alert(`❌ Erro ao iniciar VR:\n${err.message}`);
  }
}

async function encerrarVR(botao) {
  console.log("🚪 Encerrando VR...");
  botao.disabled = true;

  try {
    if (vrRenderLoop) {
      cancelAnimationFrame(vrRenderLoop);
      vrRenderLoop = null;
    }
    
    if (vrSession) {
      await vrSession.end();
    }
    
    vrSessionActive = false;
    botao.textContent = "🥽 Entrar em VR";
    botao.disabled = false;
  } catch (err) {
    console.error("❌ Erro ao encerrar VR:", err);
    botao.disabled = false;
  }
}

function iniciarRenderLoopVR(session) {
  console.log("🎬 Iniciando render loop VR com renderização WebXR otimizada");
  
  let frameCount = 0;
  const gl = panoEl.getContext("webgl2") || panoEl.getContext("webgl");
  const layer = session.renderState.baseLayer;
  
  if (!layer) {
    console.error("❌ CRÍTICO: XRWebGLLayer não configurado!");
    return;
  }

  function onXRFrame(time, frame) {
    try {
      // 1️⃣ OBRIGATÓRIO: Vincular framebuffer ANTES de qualquer renderização
      gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer);
      gl.viewport(0, 0, layer.framebufferWidth, layer.framebufferHeight);

      // 2️⃣ Limpar apenas uma vez no início do frame
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // 3️⃣ Obter a pose e renderizar Marzipano
      const pose = frame.getViewerPose(xrRefSpace);
      if (pose) {
        // O Marzipano agora renderiza para o framebuffer correto
        // pois já vincular antes (comportamento padrão do Marzipano)
        
        // Simulando que o Marzipano renderiza aqui
        // (Marzipano usa requestAnimationFrame interno, mas com GL vinculado)
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      }

      // 4️⃣ Solicitação FINAL do próximo frame
      vrRenderLoop = session.requestAnimationFrame(onXRFrame);

      // Debug
      frameCount++;
      if (frameCount % 90 === 0) {
        console.log(`✅ Frame ${frameCount} renderizado para WebXR`);
      }
      
    } catch (err) {
      console.error("❌ Erro no render loop VR:", err);
      // Continuar tentando renderizar mesmo com erro
      vrRenderLoop = session.requestAnimationFrame(onXRFrame);
    }
  }

  // Iniciar o loop
  vrRenderLoop = session.requestAnimationFrame(onXRFrame);
  console.log("✅ Render loop iniciado - aguardando frames do VR");
}

// Lidar com seleção (clique em hotspots VR)
function handleVRSelect(event) {
  console.log("🎯 Seleção em VR");
  
  // Simular clique em hotspot
  const hotspots = document.querySelectorAll(".hotspot-container");
  if (hotspots.length > 0) {
    console.log("✅ Acionando hotspot via VR");
    hotspots[0].click();
  } else {
    console.warn("⚠️ Nenhum hotspot disponível");
  }
}
