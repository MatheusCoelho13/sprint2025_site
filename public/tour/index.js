console.log("🚀 Iniciando Tour BioTIC — Marzipano");

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
}
