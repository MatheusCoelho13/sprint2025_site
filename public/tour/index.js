console.log("🚀 Iniciando Tour BioTIC — Marzipano + WebXR");

// ============================================================
// DETECÇÃO DE DISPOSITIVO
// ============================================================
const isMetaQuest = /OculusBrowser|Meta|Quest/i.test(navigator.userAgent);
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);
console.log("📱 Meta Quest detectado:", isMetaQuest);
console.log("📱 Celular detectado:", isMobile);

// ============================================================
// 0) AGUARDAR APP_DATA CARREGAR
// ============================================================

let SCENES = [];

function esperarAPPDATA() {
  if (!window.APP_DATA || !window.APP_DATA.scenes) {
    console.log("⏳ Aguardando APP_DATA...");
    return setTimeout(esperarAPPDATA, 100);
  }

  SCENES = window.APP_DATA.scenes;
  console.log("✅ Dados carregados:", SCENES.length, "cenas");
  iniciarTour();
}

// Aguardar carregamento do data.js (que define APP_DATA)
setTimeout(esperarAPPDATA, 300);

// ============================================================
// 1) CONFIGURAÇÃO DO MARZIPANO
// ============================================================

let viewer = null;
let panoEl = null;
const cacheCenas = {}; // cache para não recriar cenas

function initMarzipano() {
  panoEl = document.getElementById("pano");
  if (!panoEl) {
    console.error("❌ Elemento #pano não encontrado no DOM");
    return;
  }

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
    pinFirstLevel: true,
  });

  return { scene, view };
}

// ============================================================
// 2) HOTSPOTS MARZIPANO
// ============================================================

// ---- Hotspot de NAVEGAÇÃO (seta) ----
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
    pitch: hotspotData.pitch,
  });

  return el;
}

// ---- Hotspot de INFORMAÇÃO (elevador, porta, empresa etc.) ----
// Usa apenas dados do data.js (infoHotspots) sem alterar VR / giroscópio.
function criarInfoHotspot(sceneObj, hotspotData) {
  if (!hotspotData) return;

  const wrapper = document.createElement("div");
  wrapper.className = "info-hotspot";
  wrapper.style.position = "absolute";
  wrapper.style.transform = "translate(-50%, -50%)";
  wrapper.style.cursor = "pointer";
  wrapper.style.zIndex = "999998";
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "8px";

  // bolinha com "i"
  const icon = document.createElement("div");
  icon.textContent = "i";
  icon.style.width = "36px";
  icon.style.height = "36px";
  icon.style.borderRadius = "50%";
  icon.style.background = "rgba(30, 30, 30, 0.9)";
  icon.style.color = "#fff";
  icon.style.display = "flex";
  icon.style.alignItems = "center";
  icon.style.justifyContent = "center";
  icon.style.fontWeight = "bold";
  icon.style.fontFamily =
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  icon.style.boxShadow = "0 0 6px rgba(0,0,0,0.8)";

  // label com título + texto
  const label = document.createElement("div");
  label.className = "info-hotspot-label";
  label.style.padding = "6px 10px";
  label.style.borderRadius = "4px";
  label.style.background = "rgba(35, 35, 35, 0.95)";
  label.style.color = "#fff";
  label.style.fontSize = "13px";
  label.style.fontFamily =
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  label.style.whiteSpace = "nowrap";
  label.style.maxWidth = "260px";
  label.style.overflow = "hidden";
  label.style.textOverflow = "ellipsis";
  label.style.display = "none"; // abre só em hover/click

  const title = hotspotData.title || "";
  const text = hotspotData.text || "";
  if (title && text) {
    label.innerHTML = `<strong>${title}</strong><br>${text}`;
  } else if (title) {
    label.textContent = title;
  } else {
    label.textContent = text;
  }

  wrapper.appendChild(icon);
  wrapper.appendChild(label);

  // desktop → hover; mobile/Quest → click alterna abrir/fechar
  wrapper.addEventListener("mouseenter", () => {
    if (!isMobile && !isMetaQuest) {
      label.style.display = "block";
    }
  });
  wrapper.addEventListener("mouseleave", () => {
    if (!isMobile && !isMetaQuest) {
      label.style.display = "none";
    }
  });
  wrapper.addEventListener("click", (e) => {
    e.stopPropagation();
    if (label.style.display === "none") {
      label.style.display = "block";
    } else {
      label.style.display = "none";
    }
  });

  // Posicionamento no panorama
  sceneObj.scene.hotspotContainer().createHotspot(wrapper, {
    yaw: hotspotData.yaw,
    pitch: hotspotData.pitch,
  });

  return wrapper;
}

// ============================================================
// 3) TROCAR DE CENA
// ============================================================

let cenaAtual = null;

function trocarCena(id) {
  console.log("🔄 Carregando cena:", id);

  const data = SCENES.find((s) => s.id === id);
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

  // Remover hotspots visuais antigos (navegação + informação)
  document
    .querySelectorAll(".hotspot-container, .info-hotspot")
    .forEach((e) => e.remove());

  // Criar hotspots de navegação
  if (data.linkHotspots && data.linkHotspots.length > 0) {
    data.linkHotspots.forEach((h) => criarHotspot(cenaObj, h));
  }

  // Criar hotspots de informação (elevadores, portas, empresas, etc.)
  if (data.infoHotspots && data.infoHotspots.length > 0) {
    console.log(`ℹ️ Cena "${id}" possui ${data.infoHotspots.length} infoHotspots.`);
    data.infoHotspots.forEach((h) => criarInfoHotspot(cenaObj, h));
  } else {
    console.log(`ℹ️ Cena "${id}" não possui infoHotspots.`);
  }

  console.log(
    `✨ Cena "${id}" carregada com ${data.linkHotspots?.length || 0} hotspots de navegação e ${
      data.infoHotspots?.length || 0
    } hotspots de informação.`
  );
}

// ============================================================
// 4) INICIAR TOUR
// ============================================================

function iniciarTour() {
  initMarzipano();

  if (!SCENES || SCENES.length === 0) {
    return console.error("❌ Nenhuma cena encontrada em APP_DATA");
  }

  trocarCena(SCENES[0].id);
  console.log("🚀 Tour iniciado na cena:", SCENES[0].id);

  // 🥽 SUPORTE META QUEST VR
  if (isMetaQuest) {
    inicializarVR();
  }

  // 📱 SUPORTE GIROSCÓPIO CELULAR
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

  if (!navigator.xr) {
    console.warn("⚠️ WebXR não disponível neste dispositivo");
    return;
  }

  navigator.xr
    .isSessionSupported("immersive-vr")
    .then((supported) => {
      if (!supported) {
        console.warn("⚠️ VR imersivo não suportado");
        return;
      }

      console.log("✅ VR imersivo suportado!");
      criarBotaoVR();
    })
    .catch((err) => {
      console.error("❌ Erro ao verificar suporte VR:", err);
    });
}

function criarBotaoVR() {
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
    const sessionInit = {
      requiredFeatures: ["local-floor"],
      optionalFeatures: ["bounded-floor", "hand-tracking"],
    };

    console.log("📋 Solicitando WebXR immersive-vr...", sessionInit);

    vrSession = await navigator.xr.requestSession("immersive-vr", sessionInit);
    console.log("✅ Sessão WebXR criada com sucesso");
    vrSessionActive = true;

    // Reference space
    try {
      xrRefSpace = await vrSession.requestReferenceSpace("local-floor");
      console.log("✅ Reference space: local-floor OK");
    } catch (err) {
      console.warn("⚠️ local-floor falhou, usando viewer fallback...", err);
      xrRefSpace = await vrSession.requestReferenceSpace("viewer");
      console.log("✅ Reference space: viewer (fallback)");
    }

    // PEGAR O CANVAS INTERNO DO MARZIPANO
    const marziCanvas = panoEl.querySelector("canvas");
    if (!marziCanvas) {
      throw new Error("❌ Canvas interno do Marzipano não encontrado dentro de #pano");
    }

    console.log("🎨 Canvas do Marzipano encontrado:", marziCanvas.width, "x", marziCanvas.height);

    const gl =
      marziCanvas.getContext("webgl2") ||
      marziCanvas.getContext("webgl") ||
      marziCanvas.getContext("experimental-webgl");

    if (!gl) {
      throw new Error("❌ Não foi possível obter contexto WebGL do canvas do Marzipano");
    }

    console.log("✅ WebGL context obtido:", gl.getParameter(gl.VERSION));

    // XRWebGLLayer
    let glLayer = null;
    console.log("📦 Criando XRWebGLLayer...");
    try {
      glLayer = new XRWebGLLayer(vrSession, gl, {
        antialias: true,
        alpha: true,
        depth: true,
        stencil: false,
        framebufferScaleFactor: 1.0,
      });
      console.log("✅ XRWebGLLayer criado com sucesso");
      console.log(
        `   📐 Resolução framebuffer: ${glLayer.framebufferWidth}x${glLayer.framebufferHeight}`
      );
    } catch (err) {
      console.error("❌ Falha ao criar XRWebGLLayer:", err);
      throw err;
    }

    // RenderState
    console.log("⚙️  Atualizando RenderState...");
    try {
      await vrSession.updateRenderState({ baseLayer: glLayer });
      console.log("✅ RenderState configurado com XRWebGLLayer");
    } catch (err) {
      console.error("❌ Falha ao atualizar renderState:", err);
      throw err;
    }

    // Inicia loop de renderização
    iniciarRenderLoopVR(vrSession, gl, glLayer);

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

function iniciarRenderLoopVR(session, gl, layer) {
  console.log("🎬 Iniciando render loop VR com Marzipano");

  let frameCount = 0;

  if (!layer) {
    console.error("❌ CRÍTICO: XRWebGLLayer não configurado!");
    return;
  }

  function onXRFrame(time, frame) {
    try {
      frameCount++;

      gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer);
      gl.viewport(0, 0, layer.framebufferWidth, layer.framebufferHeight);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const pose = frame.getViewerPose(xrRefSpace);

      if (pose) {
        try {
          if (viewer) {
            viewer.render();
          } else {
            gl.clearColor(0.2, 0.5, 0.2, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
          }
        } catch (renderErr) {
          console.error(
            `❌ Erro ao renderizar Marzipano no frame ${frameCount}:`,
            renderErr
          );
        }
      } else {
        gl.clearColor(0.5, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }

      vrRenderLoop = session.requestAnimationFrame(onXRFrame);
    } catch (err) {
      console.error(`❌ ERRO CRÍTICO no frame ${frameCount}:`, err);
      vrRenderLoop = session.requestAnimationFrame(onXRFrame);
    }
  }

  console.log("📍 Solicitando primeiro frame XR...");
  vrRenderLoop = session.requestAnimationFrame(onXRFrame);
  console.log("✅ Render loop VR iniciado - aguardando frames do compositor");
}

// Lidar com seleção (clique em hotspots VR)
function handleVRSelect(event) {
  console.log("🎯 Seleção em VR");

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

let gyroscopeEnabled = false;
let gyroscopeButton = null;

function inicializarGiroscopio() {
  if (!isMobile) {
    console.log("⏭️ Giroscópio não disponível em desktop");
    return;
  }

  console.log("📱 Inicializando suporte a giroscópio...");

  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
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
        ativarGiroscopio();
      });
  } else {
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

    if (cenaAtual && viewer) {
      const view = viewer.view();
      if (view) {
        view.setYaw(0);
        view.setPitch(0);
      }
    }

    let calibrationYaw = 0;
    let calibrationPitch = 0;
    let isCalibrated = false;

    const handleDeviceOrientation = (event) => {
      if (!gyroscopeEnabled) return;

      const beta = event.beta || 0; // x rotation (-180 a 180) - pitch
      const gamma = event.gamma || 0; // y rotation (-90 a 90) - yaw

      if (!isCalibrated) {
        calibrationYaw = gamma;
        calibrationPitch = beta;
        isCalibrated = true;
        console.log(
          `🎯 Giroscópio calibrado: yaw=${calibrationYaw}, pitch=${calibrationPitch}`
        );
      }

      const deltaYaw = gamma - calibrationYaw;
      const deltaPitch = calibrationPitch - beta;

      const yaw = THREE.MathUtils.degToRad(deltaYaw);
      const pitch = THREE.MathUtils.degToRad(deltaPitch);

      try {
        if (cenaAtual && viewer) {
          const view = viewer.view();
          if (view) {
            view.setYaw(yaw);
            view.setPitch(pitch);
          }
        }
      } catch (err) {
        console.warn("⚠️ Erro ao atualizar visão com giroscópio:", err);
      }
    };

    window.removeEventListener("deviceorientation", handleDeviceOrientation);
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
