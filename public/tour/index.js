/*
 * Marzipano otimizado:
 *  - 🥽 Meta Quest → tracking automático (sem WebXR)
 *  - 📱 Mobile → giroscópio simples
 *  - 🖥 Desktop → mouse
 *  - 🗂 Cena troca normal por hotspot e lista
 */

'use strict';

(function () {
  var Marzipano = window.Marzipano;
  var data = window.APP_DATA;

  // Detectar dispositivos
  const ua = navigator.userAgent || "";
  const isQuest = /OculusBrowser|Meta Quest|Quest/i.test(ua);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua) && !isQuest;

  console.log("🟦 DEVICE:", { isQuest, isMobile });

  // Elementos UI
  var panoElement = document.querySelector("#pano");
  var sceneListEl = document.querySelector("#sceneList");
  var sceneEls = document.querySelectorAll("#sceneList .scene");

  // Viewer
  var viewer = new Marzipano.Viewer(panoElement, {
    controls: { mouseViewMode: data.settings.mouseViewMode }
  });

  // Criar cenas
  var scenes = data.scenes.map(function (s) {
    var source = Marzipano.ImageUrlSource.fromString(
      "tiles/" + s.id + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: "tiles/" + s.id + "/preview.jpg" }
    );

    var geometry = new Marzipano.CubeGeometry(s.levels);

    var limiter = Marzipano.RectilinearView.limit.traditional(
      s.faceSize,
      100 * Math.PI / 180,
      120 * Math.PI / 180
    );

    var view = new Marzipano.RectilinearView(s.initialViewParameters, limiter);

    var scene = viewer.createScene({
      source,
      geometry,
      view,
      pinFirstLevel: true
    });

    // Criar hotspots de navegação
    s.linkHotspots.forEach(function (h) {
      var element = createLinkHotspotElement(h);
      scene.hotspotContainer().createHotspot(element, { yaw: h.yaw, pitch: h.pitch });
    });

    return { data: s, scene, view };
  });

  // FUNÇÃO PARA TROCAR CENA
  function switchScene(target) {
    console.log("🔄 Mudando para cena:", target.data.id);

    target.scene.switchTo();
    updateSceneList(target);
  }

  // Atualizar UI da lista
  function updateSceneList(active) {
    sceneEls.forEach(el => {
      el.classList.toggle("current", el.getAttribute("data-id") === active.data.id);
    });
  }

  // Evento de clique na lista
  scenes.forEach(scene => {
    var el = document.querySelector(`#sceneList .scene[data-id="${scene.data.id}"]`);
    if (!el) return;

    el.addEventListener("click", () => switchScene(scene));
  });

  // ==========================
  // 🔗 HOTSPOT DE LINK (CENA)
  // ==========================
  function createLinkHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('link-hotspot');

    var icon = document.createElement('img');
    icon.src = 'img/link.png';
    icon.classList.add('link-hotspot-icon');

    wrapper.appendChild(icon);

    wrapper.addEventListener('click', function () {
      var targetScene = scenes.find(s => s.data.id === hotspot.target);
      if (targetScene) switchScene(targetScene);
    });

    return wrapper;
  }

  // ==========================
  // 🥽 META QUEST → Tracking
  // ==========================
  if (isQuest) {
    console.log("🥽 Meta Quest detectado → Usando look controls");

    viewer.controls().enableMethod("look", true);
    document.body.classList.add("quest-mode");
  }

  // ==========================
  // 📱 MOBILE → Giroscópio simples
  // ==========================
  if (isMobile) {
    console.log("📱 Mobile detectado → deviceorientation habilitado");

    window.addEventListener("deviceorientation", function (event) {
      if (!event.alpha && !event.beta) return;

      var yaw = (event.alpha * Math.PI) / 180;
      var pitch = (event.beta * Math.PI) / 180;

      viewer.view().setYaw(-yaw);
      viewer.view().setPitch(pitch / 3);
    });
  }

  // ==========================
  // 🖥 DESKTOP
  // ==========================
  if (!isMobile && !isQuest) {
    console.log("🖥 Desktop → modo mouse");
  }

  // ==========================
  // INICIALIZAR A PRIMEIRA CENA
  // ==========================
  switchScene(scenes[0]);

})();
