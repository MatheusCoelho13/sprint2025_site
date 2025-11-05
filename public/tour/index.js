'use strict';

(function () {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  // DOM
  var panoElement = document.querySelector('#pano');
  var sceneNameElement = document.querySelector('#titleBar .sceneName');
  var sceneListElement = document.querySelector('#sceneList');
  var sceneElements = document.querySelectorAll('#sceneList .scene');
  var sceneListToggleElement = document.querySelector('#sceneListToggle');
  var autorotateToggleElement = document.querySelector('#autorotateToggle');
  var fullscreenToggleElement = document.querySelector('#fullscreenToggle');

  // Viewer
  var viewerOpts = { controls: { mouseViewMode: data.settings.mouseViewMode } };
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);
  var controls = viewer.controls();

  // ======== FUNÇÕES PRINCIPAIS ========

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

  // === Hotspots (precisam vir DEPOIS de switchScene) ===
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
      data.faceSize, 100 * Math.PI / 180, 120 * Math.PI / 180
    );
    var view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);
    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    if (Array.isArray(data.linkHotspots)) {
      data.linkHotspots.forEach(function (hotspot) {
        var element = createLinkHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(element, {
          yaw: hotspot.yaw,
          pitch: hotspot.pitch
        });
      });
    }

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

  // ======== AUTOROTAÇÃO / CONTROLES ========

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

  // ======== FULLSCREEN ========

  if (screenfull.enabled && data.settings.fullscreenButton) {
    fullscreenToggleElement.addEventListener('click', function () {
      screenfull.toggle();
    });
    screenfull.on('change', function () {
      fullscreenToggleElement.classList.toggle('enabled', screenfull.isFullscreen);
    });
  }

  // ======== GIROSCÓPIO ========

  // Nem todas as builds do Marzipano expõem DeviceOrientationControlMethod.
  // Verificamos a existência antes de instanciar para evitar TypeError.
  var deviceOrientationControl = null;
  if (typeof Marzipano.DeviceOrientationControlMethod === 'function') {
    try {
      deviceOrientationControl = new Marzipano.DeviceOrientationControlMethod();
    } catch (e) {
      deviceOrientationControl = null;
    }
  }

  function enableGyroscope() {
    try {
      if (!deviceOrientationControl) {
        console.warn('⚠️ DeviceOrientationControlMethod não disponível no Marzipano; pulando ativação do giroscópio.');
        return;
      }

      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === 'granted') {
              controls.registerMethod('device', deviceOrientationControl);
              controls.enableMethod('device');
              console.log('✅ Giroscópio ativado (iOS)');
            } else {
              console.warn('⚠️ Permissão negada.');
            }
          })
          .catch(console.error);
      } else {
        controls.registerMethod('device', deviceOrientationControl);
        controls.enableMethod('device');
        console.log('✅ Giroscópio ativado automaticamente');
      }
    } catch (err) {
      console.error('❌ Erro ao ativar giroscópio:', err);
    }
  }

  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    var btn = document.createElement('button');
    btn.textContent = 'Ativar Giroscópio';
    Object.assign(btn.style, {
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      padding: '10px 15px',
      background: '#000',
      color: '#fff',
      border: '1px solid #fff',
      borderRadius: '8px',
      zIndex: '999'
    });
    btn.onclick = enableGyroscope;
    document.body.appendChild(btn);
  } else {
    enableGyroscope(); // Android/Quest
  }

  // ======== INICIALIZAÇÃO ========

  switchScene(scenes[0]);
})();
