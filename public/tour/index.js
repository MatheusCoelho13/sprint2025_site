console.log("🚀 Iniciando Tour BioTIC — Marzipano");

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
let xrFrameOfReference = null;

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
    `;
    
    vrButton.addEventListener("click", () => {
      if (vrSession) {
        // Sair de VR
        vrSession.end().then(() => {
          console.log("❌ Sessão VR encerrada");
          vrButton.textContent = "🥽 Entrar em VR";
          vrSession = null;
          xrRefSpace = null;
        });
      } else {
        // Entrar em VR
        navigator.xr.requestSession("immersive-vr", {
          requiredFeatures: ["local-floor"],
          optionalFeatures: ["dom-overlay", "dom-overlay-for-handheld-ar"],
          domOverlay: { root: document.body }
        }).then((session) => {
          console.log("✅ Sessão WebXR iniciada!");
          vrSession = session;
          vrButton.textContent = "🚪 Sair de VR";

          // Configurar espaço de referência
          session.requestReferenceSpace("local-floor").then((refSpace) => {
            xrRefSpace = refSpace;
            console.log("✅ VR iniciado com sucesso! Marzipano está ativo.");
            
            // Marzipano continua renderizando normalmente
            // Não precisamos de loop extra de frames XR
          }).catch((err) => {
            console.warn("⚠️ local-floor não suportado, tentando viewer...");
            session.requestReferenceSpace("viewer").then((refSpace) => {
              xrRefSpace = refSpace;
              console.log("✅ Viewer-space configurado");
            }).catch((err2) => {
              console.error("❌ Erro ao configurar reference space:", err2);
              session.end();
            });
          });

          // Evento de encerramento
          session.addEventListener("end", () => {
            console.log("ℹ️ Sessão VR encerrada pelo usuário");
            vrButton.textContent = "🥽 Entrar em VR";
            vrSession = null;
            xrRefSpace = null;
          });

          // Detectar seleção de controles (clique em hotspots)
          session.addEventListener("select", (event) => {
            console.log("👆 Seleção detectada");
            handleVRSelect(event);
          });
        }).catch((err) => {
          console.error("❌ Erro ao iniciar VR:", err);
          alert("Não foi possível iniciar VR. Verifique se você está em um Meta Quest.");
        });
      }
    });
    
    document.body.appendChild(vrButton);
  }).catch((err) => {
    console.error("❌ Erro ao verificar suporte VR:", err);
  });
}

// Lidar com seleção (clique em hotspots VR)
function handleVRSelect(event) {
  console.log("🎯 Hotspot VR selecionado");
  
  // Simular clique em hotspot
  const hotspots = document.querySelectorAll(".hotspot-container");
  if (hotspots.length > 0) {
    console.log("✅ Clicando em hotspot via VR");
    hotspots[0].click();
  }
}
