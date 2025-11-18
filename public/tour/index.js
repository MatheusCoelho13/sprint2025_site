console.log("🚀 Iniciando Tour BioTIC — Marzipano + WebXR");

// ============================================================
// DETECÇÃO DE DISPOSITIVO
// ============================================================
const isMetaQuest = /OculusBrowser|Meta|Quest/i.test(navigator.userAgent);
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
console.log("📱 Meta Quest detectado:", isMetaQuest);
console.log("📱 Celular detectado:", isMobile);

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

  // ============================================================
  // 📱 SUPORTE GIROSCÓPIO CELULAR
  // ============================================================
  if (isMobile) {
    criarBotaoGiroscopio();
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
    console.log("🎨 Obtendo contexto WebGL...");
    const gl = panoEl.getContext("webgl2") || panoEl.getContext("webgl");
    if (!gl) {
      throw new Error("❌ Não foi possível obter contexto WebGL do canvas #pano");
    }
    console.log("✅ WebGL context obtido:", gl.getParameter(gl.VERSION));
    console.log(`   Canvas size: ${panoEl.width}x${panoEl.height}`);
    
    // 4️⃣ Criar XRWebGLLayer com config adequada para Meta Quest
    let glLayer = null;
    console.log("📦 Criando XRWebGLLayer...");
    try {
      glLayer = new XRWebGLLayer(vrSession, gl, { 
        antialias: true,      // Suavização anti-aliasing
        alpha: true,          // Permite transparência (passthrough)
        depth: true,          // Depth buffer para 3D
        stencil: false,       // Não precisa stencil
        framebufferScaleFactor: 1.0  // Renderizar em resolução nativa
      });
      console.log("✅ XRWebGLLayer criado com sucesso");
      console.log(`   📐 Resolução framebuffer: ${glLayer.framebufferWidth}x${glLayer.framebufferHeight}`);
      console.log(`   🎯 Framebuffer object: ${!!glLayer.framebuffer}`);
    } catch (err) {
      console.error("❌ Falha ao criar XRWebGLLayer:", err);
      throw err;
    }

    // 5️⃣ CRÍTICO: Atualizar renderState com a layer WebXR
    console.log("⚙️  Atualizando RenderState...");
    try {
      await vrSession.updateRenderState({ baseLayer: glLayer });
      console.log("✅ RenderState configurado com XRWebGLLayer");
      console.log(`   ✓ Framebuffer vinculado ao compositor`);
      console.log(`   ✓ Base layer definida: ${!!vrSession.renderState.baseLayer}`);
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

  console.log(`   📐 Framebuffer size: ${layer.framebufferWidth}x${layer.framebufferHeight}`);
  console.log(`   🎨 Framebuffer object exists: ${!!layer.framebuffer}`);
  console.log(`   📦 Canvas original: ${panoEl.width}x${panoEl.height}`);

  function onXRFrame(time, frame) {
    try {
      frameCount++;

      // 1️⃣ OBRIGATÓRIO: Vincular framebuffer ANTES de TUDO
      gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer);
      
      // DEBUG: Verificar se framebuffer foi vinculado
      const isBound = gl.getParameter(gl.FRAMEBUFFER_BINDING) === layer.framebuffer;
      if (!isBound) {
        console.error(`❌ ERRO CRÍTICO: Framebuffer NÃO vinculado no frame ${frameCount}`);
      }

      // 2️⃣ Viewport para o tamanho do framebuffer
      gl.viewport(0, 0, layer.framebufferWidth, layer.framebufferHeight);

      // DEBUG: Verificar viewport
      const vp = gl.getParameter(gl.VIEWPORT);
      if (frameCount === 1) {
        console.log(`   🔍 Viewport: [${vp[0]}, ${vp[1]}, ${vp[2]}, ${vp[3]}]`);
      }

      // 3️⃣ Limpar canvas
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // DEBUG: Verificar framebuffer status
      const fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (fbStatus !== gl.FRAMEBUFFER_COMPLETE) {
        console.error(`❌ Framebuffer incompleto (status ${fbStatus}) no frame ${frameCount}`);
      } else if (frameCount === 1) {
        console.log(`✅ Framebuffer status: COMPLETE (0x${fbStatus.toString(16)})`);
      }

      // 4️⃣ Obter a pose e renderizar
      const pose = frame.getViewerPose(xrRefSpace);
      if (pose) {
        if (frameCount === 1) {
          console.log(`   ✅ Pose obtida: ${pose.views.length} views para renderizar`);
        }
        
        // 5️⃣ RENDERIZAR O MARZIPANO
        try {
          if (viewer) {
            viewer.render();
            if (frameCount === 1) {
              console.log(`   ✅ viewer.render() executado com sucesso`);
            }
          } else {
            console.warn(`⚠️ Viewer não disponível no frame ${frameCount}`);
            gl.clearColor(0.2, 0.5, 0.2, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
          }
        } catch (renderErr) {
          console.error(`❌ Erro ao renderizar Marzipano no frame ${frameCount}:`, renderErr);
        }
      } else {
        console.warn(`   ⚠️ Pose null no frame ${frameCount}`);
        gl.clearColor(0.5, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }

      // 6️⃣ Solicitação FINAL do próximo frame (MUST BE LAST)
      vrRenderLoop = session.requestAnimationFrame(onXRFrame);

      // Debug logging a cada N frames
      if (frameCount === 1 || frameCount === 30 || frameCount === 90) {
        console.log(`📊 Frame ${frameCount} OK: bound=${isBound}, pose=${!!pose}, fbStatus=0x${fbStatus.toString(16)}`);
      }
      
    } catch (err) {
      console.error(`❌ ERRO CRÍTICO no frame ${frameCount}:`, err);
      console.error(`   Mensagem: ${err.message}`);
      // Continuar tentando renderizar mesmo com erro
      vrRenderLoop = session.requestAnimationFrame(onXRFrame);
    }
  }

  // Iniciar o loop
  console.log("📍 Solicitando primeiro frame XR...");
  vrRenderLoop = session.requestAnimationFrame(onXRFrame);
  console.log("✅ Render loop VR iniciado - aguardando frames do compositor");
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

// ============================================================
// 6) SUPORTE GIROSCÓPIO PARA CELULAR
// ============================================================

let deviceOrientationControl = null;
let gyroscopeEnabled = false;
let gyroscopeButton = null;

function inicializarGiroscopio() {
  if (!isMobile) {
    console.log("⏭️ Giroscópio não disponível em desktop");
    return;
  }

  console.log("📱 Inicializando suporte a giroscópio...");

  // Solicitar permissão de acesso ao giroscópio (obrigatório em iOS 13+)
  if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
    console.log("🔐 Solicitando permissão para giroscópio (iOS)...");
    DeviceOrientationEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === "granted") {
          console.log("✅ Permissão concedida para giroscópio");
          ativarGiroscopio();
        } else {
          console.warn("⚠️ Permissão negada para giroscópio");
        }
      })
      .catch((err) => {
        console.warn("⚠️ Erro ao solicitar permissão:", err);
        // Tentar ativar mesmo sem permissão (Android)
        ativarGiroscopio();
      });
  } else {
    // Android e navegadores antigos
    console.log("📱 Ativando giroscópio sem permissão (Android/antigos)");
    ativarGiroscopio();
  }
}

function ativarGiroscopio() {
  if (!viewer || !panoEl) {
    console.warn("⚠️ Viewer não disponível");
    return;
  }

  try {
    console.log("🎮 Ativando controle por giroscópio...");
    
    let lastAlpha = 0;
    let lastBeta = 0;
    let lastGamma = 0;

    // Listener para mudanças de orientação
    const handleDeviceOrientation = (event) => {
      if (!gyroscopeEnabled) return;

      const alpha = (event.alpha || 0) % 360; // z rotation (0-360)
      const beta = event.beta || 0;           // x rotation (-180 to 180)
      const gamma = event.gamma || 0;         // y rotation (-90 to 90)

      // Converter para radianos
      const yaw = THREE.MathUtils.degToRad(alpha);
      const pitch = THREE.MathUtils.degToRad(-beta); // Inverter pitch

      // Atualizar visão do Marzipano
      try {
        if (cenaAtual && viewer) {
          const view = viewer.view();
          if (view) {
            view.setYaw(yaw);
            view.setPitch(pitch);
          }
        }
      } catch (err) {
        console.warn("⚠️ Erro ao atualizar visão:", err);
      }

      lastAlpha = alpha;
      lastBeta = beta;
      lastGamma = gamma;
    };

    // Remover listener anterior se existir
    window.removeEventListener("deviceorientation", handleDeviceOrientation);
    
    // Adicionar novo listener
    window.addEventListener("deviceorientation", handleDeviceOrientation, false);

    console.log("✅ Giroscópio ativado com sucesso");
    gyroscopeEnabled = true;
    
    if (gyroscopeButton) {
      gyroscopeButton.textContent = "📱 Giroscópio ✓";
      gyroscopeButton.style.background = "#4CAF50";
    }
  } catch (err) {
    console.error("❌ Erro ao ativar giroscópio:", err);
  }
}

function desativarGiroscopio() {
  console.log("🎮 Desativando giroscópio...");
  gyroscopeEnabled = false;
  
  if (gyroscopeButton) {
    gyroscopeButton.textContent = "📱 Giroscópio";
    gyroscopeButton.style.background = "#2196F3";
  }
}

function criarBotaoGiroscopio() {
  if (!isMobile) return;

  gyroscopeButton = document.createElement("button");
  gyroscopeButton.id = "gyro-button";
  gyroscopeButton.textContent = "📱 Giroscópio";
  gyroscopeButton.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    padding: 12px 24px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    z-index: 9999998;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    touch-action: manipulation;
    user-select: none;
  `;

  gyroscopeButton.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (gyroscopeEnabled) {
      desativarGiroscopio();
    } else {
      inicializarGiroscopio();
    }
  });

  document.body.appendChild(gyroscopeButton);
  console.log("✅ Botão de giroscópio criado");
}
