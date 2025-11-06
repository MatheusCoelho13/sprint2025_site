/*
 * Marzipano VR Viewer - Compatível com Giroscópio (Android, iOS e Meta Quest)
 * Modo Automático (sem botão / sem confirmação)
 * Ajustado por ChatGPT (versão 2025)
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
  var sceneListElement = document.querySelector('#sceneList');
  var sceneElements = document.querySelectorAll('#sceneList .scene');
  var sceneListToggleElement = document.querySelector('#sceneListToggle');
  var autorotateToggleElement = document.querySelector('#autorotateToggle');
  var fullscreenToggleElement = document.querySelector('#fullscreenToggle');

  // ======== VIEWER ========
  var viewerOpts = {
    controls: { mouseViewMode: data.settings.mouseViewMode }
  };
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);
  var controls = viewer.controls();

  // ======== DETECÇÃO DESKTOP / MOBILE ========
  if (window.matchMedia) {
    var mql = matchMedia('(max-width: 500px), (max-height: 500px)');
    var setMode = function () {
      if (mql.matches) {
        document.body.classList.remove('desktop');
        document.body.classList.add('mobile');
      } else {
        document.body.classList.remove('mobile');
        document.body.classList.add('desktop');
      }
    };
    setMode();
    mql.addListener(setMode);
  } else {
    document.body.classList.add('desktop');
  }

  // Touch
  document.body.classList.add('no-touch');
  window.addEventListener('touchstart', function () {
    document.body.classList.remove('no-touch');
    document.body.classList.add('touch');
  });

  // ======== FUNÇÕES BASE ========
  function sanitize(s) {
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
  }

  function updateSceneName(scene) {
    sceneNameElement.innerHTML = sanitize(scene.data.name);
  }

  function updateSceneList(scene) {
    for (var i = 0; i < sceneElements.length; i++) {
      var el = sceneElements[i];
      if (el.getAttribute('data-id') === scene.data.id) el.classList.add('current');
      else el.classList.remove('current');
    }
  }

  function switchScene(scene) {
    stopAutorotate();
    scene.view.setParameters(scene.data.initialViewParameters);
    scene.scene.switchTo();
    startAutorotate();
    updateSceneName(scene);
    updateSceneList(scene);
  }

  function stopTouchAndScrollEventPropagation(element) {
    ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel', 'mousewheel'].forEach(function (ev) {
      element.addEventListener(ev, function (event) {
        event.stopPropagation();
      });
    });
  }

  function findSceneById(id) {
    for (var i = 0; i < scenes.length; i++) if (scenes[i].data.id === id) return scenes[i];
    return null;
  }

  function findSceneDataById(id) {
    for (var i = 0; i < data.scenes.length; i++) if (data.scenes[i].id === id) return data.scenes[i];
    return null;
  }

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
    stopTouchAndScrollEventPropagation(wrapper);
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
    var iconWrapper = document.createElement('div');
    iconWrapper.classList.add('info-hotspot-icon-wrapper');
    var icon = document.createElement('img');
    icon.src = 'img/info.png';
    icon.classList.add('info-hotspot-icon');
    iconWrapper.appendChild(icon);
    var titleWrapper = document.createElement('div');
    titleWrapper.classList.add('info-hotspot-title-wrapper');
    var title = document.createElement('div');
    title.classList.add('info-hotspot-title');
    title.innerHTML = hotspot.title;
    titleWrapper.appendChild(title);
    var closeWrapper = document.createElement('div');
    closeWrapper.classList.add('info-hotspot-close-wrapper');
    var closeIcon = document.createElement('img');
    closeIcon.src = 'img/close.png';
    closeIcon.classList.add('info-hotspot-close-icon');
    closeWrapper.appendChild(closeIcon);
    header.appendChild(iconWrapper);
    header.appendChild(titleWrapper);
    header.appendChild(closeWrapper);
    var text = document.createElement('div');
    text.classList.add('info-hotspot-text');
    text.innerHTML = hotspot.text;
    wrapper.appendChild(header);
    wrapper.appendChild(text);
    var modal = document.createElement('div');
    modal.innerHTML = wrapper.innerHTML;
    modal.classList.add('info-hotspot-modal');
    document.body.appendChild(modal);
    var toggle = function () {
      wrapper.classList.toggle('visible');
      modal.classList.toggle('visible');
    };
    wrapper.querySelector('.info-hotspot-header').addEventListener('click', toggle);
    modal.querySelector('.info-hotspot-close-wrapper').addEventListener('click', toggle);
    stopTouchAndScrollEventPropagation(wrapper);
    return wrapper;
  }

  // ======== CRIAÇÃO DAS CENAS ========
  var scenes = data.scenes.map(function (dataScene) {
    var urlPrefix = 'tiles';
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + '/' + dataScene.id + '/{z}/{f}/{y}/{x}.jpg',
      { cubeMapPreviewUrl: urlPrefix + '/' + dataScene.id + '/preview.jpg' }
    );
    var geometry = new Marzipano.CubeGeometry(dataScene.levels);
    var limiter = Marzipano.RectilinearView.limit.traditional(
      dataScene.faceSize,
      100 * Math.PI / 180,
      120 * Math.PI / 180
    );
    var view = new Marzipano.RectilinearView(dataScene.initialViewParameters, limiter);
    var scene = viewer.createScene({ source, geometry, view, pinFirstLevel: true });
    dataScene.linkHotspots.forEach(function (hotspot) {
      var element = createLinkHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });
    dataScene.infoHotspots.forEach(function (hotspot) {
      var element = createInfoHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });
    return { data: dataScene, scene, view };
  });

  // ======== AUTOROTAÇÃO ========
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

  // ======== GIROSCÓPIO + WEBXR ========

  async function enableXRTracking() {
    if (!('xr' in navigator)) return console.warn('⚠️ WebXR não disponível.');
    try {
      const session = await navigator.xr.requestSession('inline');
      const refSpace = await session.requestReferenceSpace('viewer');
      session.requestAnimationFrame(function onXRFrame(time, frame) {
        const pose = frame.getViewerPose(refSpace);
        if (pose) {
          const quat = pose.transform.orientation;
          const yaw = Math.atan2(
            2 * (quat.y * quat.w + quat.x * quat.z),
            1 - 2 * (quat.y * quat.y + quat.z * quat.z)
          );
          const pitch = Math.asin(2 * (quat.x * quat.w - quat.y * quat.z));
          const view = viewer.view();
          view.setYaw(-yaw);
          view.setPitch(pitch);
        }
        session.requestAnimationFrame(onXRFrame);
      });
      console.log('✅ WebXR ativado (Meta Quest).');
    } catch (e) {
      console.warn('Erro ao iniciar XR:', e);
    }
  }

  function enableGyroscope() {
    if (typeof DeviceOrientationEvent === 'undefined') return;
    function startGyroTracking() {
      window.addEventListener('deviceorientation', function (event) {
        if (event.alpha == null || event.beta == null) return;
        var view = viewer.view();
        var yaw = (event.alpha * Math.PI) / 180;
        var pitch = (event.beta * Math.PI) / 180;
        view.setYaw(-yaw);
        view.setPitch(pitch / 2);
      });
      console.log('✅ Giroscópio ativado!');
    }
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(r => { if (r === 'granted') startGyroTracking(); })
        .catch(console.error);
    } else startGyroTracking();
  }

  // ======== ATIVAÇÃO AUTOMÁTICA ========

  async function activateVR() {
    try {
      if (panoElement.requestFullscreen) await panoElement.requestFullscreen();
      else if (panoElement.webkitRequestFullscreen) await panoElement.webkitRequestFullscreen();
      else if (panoElement.msRequestFullscreen) await panoElement.msRequestFullscreen();

      const isQuest = /OculusBrowser|Meta Quest/i.test(navigator.userAgent);
      if (isQuest && 'xr' in navigator) enableXRTracking();
      else if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) enableGyroscope();
      console.log('✅ VR/Giroscópio ativado automaticamente.');
    } catch (err) {
      console.warn('⚠️ Falha ao ativar VR automático:', err);
    }
  }

  // ativa automaticamente após carregamento ou primeiro gesto
  window.addEventListener('load', () => setTimeout(activateVR, 1200));
  ['click', 'touchstart', 'keydown'].forEach(e =>
    document.addEventListener(e, function once() {
      activateVR();
      document.removeEventListener(e, once);
    })
  );

  // ======== CENA INICIAL ========
  switchScene(scenes[0]);
})();



