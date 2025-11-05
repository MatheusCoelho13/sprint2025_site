/*
 * Marzipano VR Viewer - Compatível com Giroscópio (Android, iOS e Meta Quest)
 * Corrigido por Matheus Coelho & ChatGPT
 */
'use strict';

(function () {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  // ======== ELEMENTOS DOM ========
  var panoElement = document.querySelector('#pano');
  var sceneNameElement = document.querySelector('#titleBar .sceneName');
  var sceneElements = document.querySelectorAll('#sceneList .scene');
  var sceneListElement = document.querySelector('#sceneList');
  var sceneListToggleElement = document.querySelector('#sceneListToggle');
  var autorotateToggleElement = document.querySelector('#autorotateToggle');
  var fullscreenToggleElement = document.querySelector('#fullscreenToggle');

  // ======== VIEWER ========
  var viewerOpts = { controls: { mouseViewMode: data.settings.mouseViewMode } };
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);
  var controls = viewer.controls();

  // ======== FUNÇÕES BASE ========
  function sanitize(s) {
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
  }

  function switchScene(scene) {
    stopAutorotate();
    scene.view.setParameters(scene.data.initialViewParameters);
    scene.scene.switchTo();
    startAutorotate();
    updateSceneName(scene);
    updateSceneList(scene);
  }

  function updateSceneName(scene) {
    sceneNameElement.innerHTML = sanitize(scene.data.name);
  }

  function updateSceneList(scene) {
    for (var i = 0; i < sceneElements.length; i++) {
      var el = sceneElements[i];
      if (el.getAttribute('data-id') === scene.data.id) {
        el.classList.add('current');
      } else {
        el.classList.remove('current');
      }
    }
  }

  // ======== HOTSPOTS ========
  function createLinkHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot', 'link-hotspot');

    var icon = document.createElement('img');
    icon.src = 'img/link.png';
    icon.classList.add('link-hotspot-icon');
    icon.style.transform = 'rotate(' + hotspot.rotation + 'rad)';
    wrapper.appendChild(icon);

    wrapper.addEventListener('click', function () {
      switchScene(findSceneById(hotspot.target));
    });

    var tooltip = document.createElement('div');
    tooltip.classList.add('hotspot-tooltip', 'link-hotspot-tooltip');
    tooltip.innerHTML = findSceneDataById(hotspot.target).name;
    wrapper.appendChild(tooltip);

    return wrapper;
  }

  function createInfoHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot', 'info-hotspot');

    var header = document.createElement('div');
    header.classList.add('info-hotspot-header');

    var icon = document.createElement('img');
    icon.src = 'img/info.png';
    icon.classList.add('info-hotspot-icon');
    header.appendChild(icon);

    var title = document.createElement('div');
    title.classList.add('info-hotspot-title');
    title.innerHTML = hotspot.title;
    header.appendChild(title);
    wrapper.appendChild(header);

    var text = document.createElement('div');
    text.classList.add('info-hotspot-text');
    text.innerHTML = hotspot.text;
    wrapper.appendChild(text);

    return wrapper;
  }

  function findSceneById(id) {
    return scenes.find((s) => s.data.id === id) || null;
  }

  function findSceneDataById(id) {
    return data.scenes.find((s) => s.id === id) || null;
  }

  // ======== CRIAÇÃO DAS CENAS ========
  var scenes = data.scenes.map(function (data) {
    var urlPrefix = 'tiles';
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + '/' + data.id + '/{z}/{f}/{y}/{x}.jpg',
      { cubeMapPreviewUrl: urlPrefix + '/' + data.id + '/preview.jpg' }
    );

    var geometry = new Marzipano.CubeGeometry(data.levels);
    var limiter = Marzipano.RectilinearView.limit.traditional(
      data.faceSize, (100 * Math.PI) / 180, (120 * Math.PI) / 180
    );
    var view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true,
    });

    if (Array.isArray(data.linkHotspots)) {
      data.linkHotspots.forEach(function (hotspot) {
        var element = createLinkHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(element, {
          yaw: hotspot.yaw,
          pitch: hotspot.pitch,
        });
      });
    }

    if (Array.isArray(data.infoHotspots)) {
      data.infoHotspots.forEach(function (hotspot) {
        var element = createInfoHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(element, {
          yaw: hotspot.yaw,
          pitch: hotspot.pitch,
        });
      });
    }

    return { data: data, scene: scene, view: view };
  });

  // ======== AUTOROTAÇÃO ========
  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI / 2,
  });

  function startAutorotate() {
    if (!autorotateToggleElement.classList.contains('enabled')) return;
    viewer.startMovement(autorotate);
    viewer.setIdleMovement(3000, autorotate);
  }

  function stopAutorotate() {
    viewer.stopMovement();
    viewer.setIdleMovement(Infinity);
  }

  function toggleAutorotate() {
    autorotateToggleElement.classList.toggle('enabled');
    if (autorotateToggleElement.classList.contains('enabled')) startAutorotate();
    else stopAutorotate();
  }

  autorotateToggleElement.addEventListener('click', toggleAutorotate);

  // ======== FULLSCREEN ========
  if (screenfull.enabled && data.settings.fullscreenButton) {
    fullscreenToggleElement.addEventListener('click', function () {
      screenfull.toggle();
    });
    screenfull.on('change', function () {
      fullscreenToggleElement.classList.toggle('enabled', screenfull.isFullscreen);
    });
  }

  // ======== GIROSCÓPIO UNIVERSAL ========
  function enableGyroscope() {
    if (typeof DeviceOrientationEvent === "undefined") {
      console.warn("⚠️ Este navegador não suporta DeviceOrientationEvent.");
      return;
    }

    function startGyroTracking() {
      const view = viewer.view();
      let lastYaw = 0, lastPitch = 0;

      window.addEventListener("deviceorientation", function (event) {
        if (event.alpha == null || event.beta == null) return;

        const yaw = (event.alpha * Math.PI) / 180;
        const pitch = (event.beta * Math.PI) / 180;

        lastYaw = lastYaw * 0.9 + yaw * 0.1;
        lastPitch = lastPitch * 0.9 + pitch * 0.1;

        view.setYaw(-lastYaw);
        view.setPitch(lastPitch / 2);
      });

      console.log("✅ Giroscópio ativado e rastreando movimento!");
    }

    // === iOS ===
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") startGyroTracking();
          else alert("Permissão de giroscópio negada.");
        })
        .catch((err) => console.error("❌ Erro no iOS:", err));
      return;
    }

    // === Android / Quest ===
    if (navigator.permissions) {
      navigator.permissions.query({ name: "gyroscope" })
        .then((result) => {
          if (result.state === "granted") {
            startGyroTracking();
          } else {
            showEnableButton();
          }
        })
        .catch(() => {
          showEnableButton();
        });
    } else {
      showEnableButton();
    }

    function showEnableButton() {
      const btn = document.createElement("button");
      btn.textContent = "Ativar Giroscópio";
      Object.assign(btn.style, {
        position: "absolute",
        bottom: "20px",
        left: "20px",
        padding: "10px 15px",
        background: "#000",
        color: "#fff",
        border: "1px solid #fff",
        borderRadius: "8px",
        zIndex: "9999",
      });
      btn.onclick = () => {
        startGyroTracking();
        btn.remove();
      };
      document.body.appendChild(btn);
      console.log("📱 Clique em 'Ativar Giroscópio' para liberar sensores");
    }
  }

  // ======== INICIALIZAÇÃO ========
  if (/Android|iPhone|iPad|iPod|Quest|Oculus/i.test(navigator.userAgent)) {
    enableGyroscope();
  } else {
    console.log("💻 Giroscópio desativado (modo desktop)");
  }

  switchScene(scenes[0]);
})();
