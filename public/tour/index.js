/*
 * Marzipano otimizado:
 *  - 🥽 Meta Quest → tracking automático (sem WebXR manual)
 *  - 📱 Mobile → giroscópio
 *  - 🖥 Desktop → mouse
 *  - Sem permissões WebXR quebradas
 *  - Sem COOP/COEP
 *  - Sem requestPermission no Quest
 */

'use strict';

(function () {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  // Detectar dispositivos
  const ua = navigator.userAgent || "";
  const isQuest = /OculusBrowser|Meta Quest|Quest/i.test(ua);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua) && !isQuest;

  console.log("🟦 Device:", { isQuest, isMobile, ua });

  // Elementos base
  var panoElement = document.querySelector("#pano");
  var sceneListElement = document.querySelector("#sceneList");
  var sceneElements = document.querySelectorAll("#sceneList .scene");

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

    return { data: s, scene, view };
  });

  // Trocar cena
  function switchScene(scene) {
    scene.scene.switchTo();
    updateSceneList(scene);
  }

  // UI da lista
  function updateSceneList(scene) {
    sceneElements.forEach(el => {
      el.classList.toggle("current", el.getAttribute("data-id") === scene.data.id);
    });
  }

  // Evento de click na lista
  scenes.forEach(scene => {
    var el = document.querySelector(`#sceneList .scene[data-id="${scene.data.id}"]`);
    if (!el) return;
    el.addEventListener("click", () => switchScene(scene));
  });

  // ==========================
  // 🥽 META QUEST – TRACKING
  // ==========================
  if (isQuest) {
    console.log("🥽 Meta Quest detectado → Tracking VR ativado");

    // ESSA LINHA É O SEGREDO:
    viewer.controls().enableMethod("look", true);

    // UI mais limpa para Quest
    document.body.classList.add("quest-mode");

    // Nada de XR manual / requests
  }

  // ==========================
  // 📱 MOBILE – Giroscópio
  // ==========================
  if (isMobile) {
    console.log("📱 Mobile detectado → Ativando DeviceOrientation");

    window.addEventListener("deviceorientation", function (event) {
      if (!event.alpha && !event.beta) return;

      var yaw = (event.alpha * Math.PI) / 180;
      var pitch = (event.beta * Math.PI) / 180;

      viewer.view().setYaw(-yaw);
      viewer.view().setPitch(pitch / 3);
    });
  }

  // ==========================
  // 🖥 DESKTOP – Mouse
  // ==========================
  if (!isMobile && !isQuest) {
    console.log("🖥 Desktop → Mouse / controles padrão");
  }

  // Carregar cena inicial
  switchScene(scenes[0]);

})();
