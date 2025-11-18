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
    // Configuração corrigida para Meta Quest
    const sessionInit = {
      requiredFeatures: ["local-floor"],
      optionalFeatures: ["bounded-floor", "hand-tracking"]
    };

    console.log("📋 RequestSession config:", sessionInit);
    
    vrSession = await navigator.xr.requestSession("immersive-vr", sessionInit);
    console.log("✅ Sessão XR criada:", vrSession);
    
    vrSessionActive = true;
    botao.textContent = "🚪 Sair de VR";
    botao.disabled = false;

    // Configurar reference space
    try {
      xrRefSpace = await vrSession.requestReferenceSpace("local-floor");
      console.log("✅ Reference space local-floor obtido");
    } catch (err) {
      console.warn("⚠️ local-floor não disponível, tentando viewer...");
      xrRefSpace = await vrSession.requestReferenceSpace("viewer");
      console.log("✅ Reference space viewer obtido como fallback");
    }

    // Iniciar loop de renderização VR
    iniciarRenderLoopVR(vrSession);

    // Listeners de eventos
    vrSession.addEventListener("end", () => {
      console.log("ℹ️ Sessão VR encerrada");
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
      console.log("👆 Controle selecionado em VR");
      handleVRSelect(event);
    });

    vrSession.addEventListener("selectstart", (event) => {
      console.log("👇 Pressionado");
    });

    vrSession.addEventListener("selectend", (event) => {
      console.log("👆 Liberado");
    });

  } catch (err) {
    console.error("❌ ERRO ao iniciar VR:", err.name, err.message);
    botao.textContent = "🥽 Entrar em VR";
    botao.disabled = false;
    
    // Mostrar erro específico
    let mensagem = "Erro ao iniciar VR";
    if (err.name === "NotAllowedError") {
      mensagem = "VR bloqueado ou sem permissão";
    } else if (err.name === "NotSupportedError") {
      mensagem = "VR não suportado";
    } else if (err.name === "AbortError") {
      mensagem = "Sessão VR abortada";
    }
    
    console.error("📌 Tipo de erro:", mensagem);
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
  console.log("🎬 Iniciando render loop VR");
  
  let frameCount = 0;

  function onXRFrame(time, frame) {
    // ⚠️ IMPORTANTE: Sempre solicitar o próximo frame!
    vrRenderLoop = session.requestAnimationFrame(onXRFrame);

    // Obter a pose do usuário
    const pose = frame.getViewerPose(xrRefSpace);
    if (!pose) {
      console.warn("⚠️ Sem pose disponível");
      return;
    }

    // Marzipano continua renderizando automaticamente
    // Esta função apenas mantém a sessão XR ativa
    
    // Debug: mostrar pose a cada 60 frames
    frameCount++;
    if (frameCount % 60 === 0) {
      console.log("🎥 VR renderizando - Pose:", pose.transform.position);
    }
  }

  vrRenderLoop = session.requestAnimationFrame(onXRFrame);
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
