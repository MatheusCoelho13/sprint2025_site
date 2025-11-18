console.log("🚀 Iniciando BioTIC VR — Three.js + Marzipano + Hotspots");

/* ============================================================
   0) CARREGAÇÃO DOS DADOS
============================================================ */

const SCENES = window.TOUR_SCENES || [];
if (!SCENES.length) console.error("❌ Nenhuma cena em TOUR_SCENES");

/* ============================================================
   1) MARZIPANO — Panorama DOM normal
============================================================ */

const panoEl = document.getElementById("pano");
const viewer = new Marzipano.Viewer(panoEl);

const marzipanoCache = {};

function criarCenaMarzipano(data) {
  const source = Marzipano.ImageUrlSource.fromString(
    `/tour/tiles/${data.id}/{z}/{f}/{y}/{x}.jpg`
  );

  const geometry = new Marzipano.CubeGeometry(data.levels);

  const limiter = Marzipano.RectilinearView.limit.traditional(
    data.faceSize,
    Math.PI / 2
  );

  const view = new Marzipano.RectilinearView(
    data.initialViewParameters,
    limiter
  );

  const scene = viewer.createScene({
    source,
    geometry,
    view
  });

  return { scene, view };
}

function trocarCenaMarzipano(id) {
  const info = APP_DATA.scenes.find(s => s.id === id);
  if (!info) return console.error("Cena não encontrada:", id);

  if (!marzipanoCache[id]) {
    marzipanoCache[id] = criarCenaMarzipano(info);
  }

  marzipanoCache[id].scene.switchTo();
}

/* ============================================================
   2) THREE.JS — VR PREVIEW
============================================================ */

const loader = new THREE.TextureLoader();

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

document.body.appendChild(VRButton.createButton(renderer));

const scene3D = new THREE.Scene();

const camera3D = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  50
);

// Esfera VR
const sphereGeo = new THREE.SphereGeometry(10, 64, 64);
sphereGeo.scale(-1, 1, 1);

const sphereMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
scene3D.add(sphereMesh);

/* ============================================================
   3) HOTSPOTS 3D (versão 100% compatível)
============================================================ */

let hotspots = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function clearHotspots() {
  hotspots.forEach(h => scene3D.remove(h));
  hotspots = [];
}

function yawPitchToVector(yaw, pitch, dist) {
  return new THREE.Vector3(
    dist * Math.sin(yaw) * Math.cos(pitch),
    dist * Math.sin(pitch),
    -dist * Math.cos(yaw) * Math.cos(pitch)
  );
}

function criarHotspot3D(yaw, pitch, targetId) {
  const texture = loader.load("/tour/img/link.png");
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.1,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

  const pos = yawPitchToVector(yaw, pitch, 11.5);
  mesh.position.copy(pos);

  mesh.userData.targetId = targetId;
  hotspots.push(mesh);
  scene3D.add(mesh);
}

function criarHotspotsCena(id) {
  clearHotspots();
  const info = SCENES.find(s => s.id === id);
  if (!info) return;

  info.links.forEach(h =>
    criarHotspot3D(h.yaw, h.pitch, h.target)
  );
}

// Sempre virar para a câmera
function atualizarHotspots() {
  hotspots.forEach(h => h.lookAt(camera3D.position));
}

/* ============================================================
   4) TROCAR CENA COMPLETA (DOM + VR)
============================================================ */

function trocarCena(id) {
  console.log("🔄 Trocando para:", id);

  trocarCenaMarzipano(id);

  const preview = `/tour/tiles/${id}/preview.jpg`;
  loader.load(preview, tex => {
    sphereMat.map = tex;
    sphereMat.needsUpdate = true;
  });

  criarHotspotsCena(id);
}

/* ============================================================
   5) CLIQUES EM HOTSPOTS
============================================================ */

window.addEventListener("click", ev => {
  mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera3D);
  const hit = raycaster.intersectObjects(hotspots);

  if (hit.length > 0) {
    trocarCena(hit[0].object.userData.targetId);
  }
});

/* ============================================================
   6) RESIZE
============================================================ */

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera3D.aspect = window.innerWidth / window.innerHeight;
  camera3D.updateProjectionMatrix();
});

/* ============================================================
   7) LOOP RENDER
============================================================ */

renderer.setAnimationLoop(() => {
  atualizarHotspots();
  renderer.render(scene3D, camera3D);
});

/* ============================================================
   8) INICIAR NO PRIMEIRO PANORAMA
============================================================ */

trocarCena(SCENES[0].id);
