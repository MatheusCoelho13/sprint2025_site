'use strict';

(function () {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  // ==============================
  // 🔹 ELEMENTOS DOM
  // ==============================
  var panoElement = document.querySelector('#pano');
  var sceneNameElement = document.querySelector('#titleBar .sceneName');
  var sceneListElement = document.querySelector('#sceneList');
  var sceneElements = document.querySelectorAll('#sceneList .scene');
  var sceneListToggleElement = document.querySelector('#sceneListToggle');
  var autorotateToggleElement = document.querySelector('#autorotateToggle');
  var fullscreenToggleElement = document.querySelector('#fullscreenToggle');

  // ==============================
  // 🔹 VIEWER
  // ==============================
  var viewerOpts = { controls: { mouseViewMode: data.settings.mouseViewMode } };
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);
  var controls = viewer.controls();

  // ==============================
  // 🔹 FUNÇÕES PRINCIPAIS
  // ==============================
  function sanitize(s) {
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
  }

  function switchScene(scene) {
    stopAutorotate();
    scene.view.setParameters(scene.data.initialViewParameters);
    scene.scene.switchTo();
    startAutorotate();
    updateSceneName(scene);
  }

  function updateSceneName(scene) {
    sceneNameElement.innerHTML = sanitize(scene.data.name);
  }

  // ==============================
  // 🔹 HOTSPOTS
  // ==============================
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

  // ==============================
  // 🔹 CRIAÇÃO DAS CENAS
  // ==============================
  var scenes = data.scenes.map(function (data) {
    var urlPrefix = 'tiles';
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + '/' + data.id + '/{z}/{f}/{y}/{x}.jpg',
      { cubeMapPreviewUrl: urlPrefix + '/' + data.id + '/preview.jpg' }
    );
    var geometry = new Marzipano.CubeGeometry(data.levels);
    var limiter = Marzipano.RectilinearView.limit.traditional(
      data.faceSize, 100 * Math.PI / 180, 120 * Math.PI / 180
    );
    var view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);
    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // Hotspots de navegação
    if (Array.isArray(data.linkHotspots)) {
      data.linkHotspots.forEach(function (hotspot) {
        var element = createLinkHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(element, {
          yaw: hotspot.yaw,
          pitch: hotspot.pitch
        });
      });
    }

    // Hotspots de informação
    if (Array.isArray(data.infoHotspots)) {
      data.infoHotspots.forEach(function (hotspot) {
        var element = createInfoHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(element, {
          yaw: hotspot.yaw,
          pitch: hotspot.pitch
        });
      });
    }

    return { data: data, scene: scene, view: view };
  });

  // ==============================
  // 🔹 AUTOROTAÇÃO
  // ==============================
  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI / 2
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
    if (autorotateToggleElement.classList.contains('enabled'))
      startAutorotate();
    else
      stopAutorotate();
  }

  autorotateToggleElement.addEventListener('click', toggleAutorotate);

  // ==============================
  // 🔹 FULLSCREEN
  // ==============================
  if (screenfull.enabled && data.settings.fullscreenButton) {
    fullscreenToggleElement.addEventListener('click', function () {
      screenfull.toggle();
    });
    screenfull.on('change', function () {
      fullscreenToggleElement.classList.toggle('enabled', screenfull.isFullscreen);
    });
  }

  // ==============================
  // 🔹 GIROSCÓPIO (CORRIGIDO)
  // ==============================
  var deviceOrientationControl = null;

  if (typeof Marzipano.DeviceOrientationControlMethod === 'function') {
    try {
      deviceOrientationControl = new Marzipano.DeviceOrientationControlMethod();
    } catch (e) {
      console.warn("⚠️ Falha ao criar DeviceOrientationControlMethod:", e);
      deviceOrientationControl = null;
    }
  }

  async function enableGyroscope() {
    if (!deviceOrientationControl) {
      console.warn("⚠️ DeviceOrientationControlMethod não disponível no Marzipano.");
      return;
    }

    try {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === "granted") {
          controls.registerMethod("device", deviceOrientationControl);
          controls.enableMethod("device");
          alert("✅ Giroscópio ativado com sucesso!");
        } else {
          alert("❌ Permissão negada. Vá nas configurações do navegador e ative o sensor de movimento.");
        }
      } else {
        // Wolvic, Meta Quest e Android antigos
        controls.registerMethod("device", deviceOrientationControl);
        controls.enableMethod("device");
        console.log("✅ Giroscópio ativado automaticamente (sem permissão explícita).");
      }
    } catch (err) {
      console.error("❌ Erro ao ativar giroscópio:", err);
    }
  }

  // ==============================
  // 🔹 ATIVAÇÃO DO GIROSCÓPIO
  // ==============================
  window.addEventListener("load", function () {
    const isMobile = /Android|iPhone|iPad|OculusBrowser|Meta Quest/i.test(navigator.userAgent);

    if (isMobile) {
      console.log("📱 Dispositivo mobile detectado — aguardando toque para ativar giroscópio.");

      const btn = document.createElement("button");
      btn.textContent = "🥽 Ativar Giroscópio";
      Object.assign(btn.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        background: "#0a3d5a",
        color: "#fff",
        border: "none",
        padding: "10px 16px",
        borderRadius: "10px",
        fontSize: "14px",
        cursor: "pointer",
      });

      btn.addEventListener("click", function () {
        enableGyroscope();
        btn.remove();
      });

      document.body.appendChild(btn);
    } else {
      // Ativa automaticamente em desktop / ambiente de testes
      enableGyroscope();
    }
  });

  // ==============================
  // 🔹 INICIALIZAÇÃO
  // ==============================
  switchScene(scenes[0]);
})();
