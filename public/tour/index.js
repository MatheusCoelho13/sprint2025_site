/*
 * Baseado no template original do Marzipano,
 * adaptado para:
 *  - funcionar com seu HTML atual,
 *  - suportar WebXR (inline + immersive-vr),
 *  - usar giroscópio em mobile,
 *  - funcionar em desktop.
 */
'use strict';

(function () {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  // ====== DETECÇÃO DE DISPOSITIVO ======
  var ua = navigator.userAgent || "";
  var isQuest = /OculusBrowser|Meta Quest|Wolvic/i.test(ua);
  var isMobile = /Android|iPhone|iPad|iPod/i.test(ua) && !isQuest;

  // ====== ELEMENTOS PRINCIPAIS DO DOM ======
  var panoElement = document.querySelector('#pano');
  var sceneListElement = document.querySelector('#sceneList');
  var sceneElements = document.querySelectorAll('#sceneList .scene');
  var enterVRButton = document.getElementById('enterVRButton');

  // Título da cena (sceneName):
  // - tenta pegar do HTML
  // - se não existir, cria um titleBar simples no topo.
  var sceneNameElement = document.querySelector('.sceneName');
  if (!sceneNameElement) {
    var titleBar = document.createElement('div');
    titleBar.id = 'titleBar';
    titleBar.style.position = 'fixed';
    titleBar.style.top = '10px';
    titleBar.style.left = '50%';
    titleBar.style.transform = 'translateX(-50%)';
    titleBar.style.zIndex = '9998';
    titleBar.style.padding = '6px 12px';
    titleBar.style.borderRadius = '8px';
    titleBar.style.background = 'rgba(0,0,0,0.6)';
    titleBar.style.color = '#fff';
    titleBar.style.fontFamily = 'system-ui, sans-serif';
    titleBar.style.fontSize = '14px';

    sceneNameElement = document.createElement('span');
    sceneNameElement.className = 'sceneName';
    titleBar.appendChild(sceneNameElement);

    document.body.appendChild(titleBar);
  }

  // Elementos opcionais (podem não existir no seu HTML atual)
  var autorotateToggleElement = document.getElementById('autorotateToggle');
  var fullscreenToggleElement = document.getElementById('fullscreenToggle');
  var sceneListToggleElement = document.getElementById('sceneListToggle');

  // ===== DETECÇÃO DESKTOP / MOBILE (classe no body) =====
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

  // Detectar touch (opcional, usado por CSS)
  document.body.classList.add('no-touch');
  window.addEventListener('touchstart', function () {
    document.body.classList.remove('no-touch');
    document.body.classList.add('touch');
  });

  // Fallback para IE < 11 (só CSS)
  if (bowser && bowser.msie && parseFloat(bowser.version) < 11) {
    document.body.classList.add('tooltip-fallback');
  }

  // ====== VIEWER ======
  var viewerOpts = {
    controls: {
      mouseViewMode: data.settings.mouseViewMode
    }
  };
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

  // ====== CRIAÇÃO DAS CENAS A PARTIR DO data.js ======
  var scenes = data.scenes.map(function (sceneData) {
    var urlPrefix = 'tiles';
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + '/' + sceneData.id + '/{z}/{f}/{y}/{x}.jpg',
      { cubeMapPreviewUrl: urlPrefix + '/' + sceneData.id + '/preview.jpg' }
    );

    var geometry = new Marzipano.CubeGeometry(sceneData.levels);

    var limiter = Marzipano.RectilinearView.limit.traditional(
      sceneData.faceSize,
      100 * Math.PI / 180,
      120 * Math.PI / 180
    );
    var view = new Marzipano.RectilinearView(
      sceneData.initialViewParameters,
      limiter
    );

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // Hotspots de link.
    sceneData.linkHotspots.forEach(function (hotspot) {
      var element = createLinkHotspotElement(hotspot);
      scene
        .hotspotContainer()
        .createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });

    // Hotspots de informação.
    sceneData.infoHotspots.forEach(function (hotspot) {
      var element = createInfoHotspotElement(hotspot);
      scene
        .hotspotContainer()
        .createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });

    return {
      data: sceneData,
      scene: scene,
      view: view
    };
  });

  // ===== AUTOROTAÇÃO =====
  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI / 2
  });

  if (autorotateToggleElement && data.settings.autorotateEnabled) {
    autorotateToggleElement.classList.add('enabled');
  }

  if (autorotateToggleElement) {
    autorotateToggleElement.addEventListener('click', toggleAutorotate);
  }

  // ===== FULLSCREEN =====
  if (screenfull && screenfull.enabled && data.settings.fullscreenButton) {
    document.body.classList.add('fullscreen-enabled');
    if (fullscreenToggleElement) {
      fullscreenToggleElement.addEventListener('click', function () {
        screenfull.toggle();
      });
    }
    screenfull.on('change', function () {
      if (!fullscreenToggleElement) return;
      if (screenfull.isFullscreen) {
        fullscreenToggleElement.classList.add('enabled');
      } else {
        fullscreenToggleElement.classList.remove('enabled');
      }
    });
  } else {
    document.body.classList.add('fullscreen-disabled');
  }

  // ===== LISTA DE CENAS =====
  // Se existir um botão de toggle (você comentou no HTML), usamos.
  if (sceneListToggleElement) {
    sceneListToggleElement.addEventListener('click', toggleSceneList);
  }

  // Em desktop, mantemos a lista visível.
  if (!document.body.classList.contains('mobile')) {
    showSceneList();
  }

  // Clicar em um item da lista (seu HTML já tem <a class="scene" data-id="...">)
  scenes.forEach(function (scene) {
    var el = document.querySelector(
      '#sceneList .scene[data-id="' + scene.data.id + '"]'
    );
    if (!el) return;
    el.addEventListener('click', function () {
      switchScene(scene);
      if (document.body.classList.contains('mobile')) {
        hideSceneList();
      }
    });
  });

  // ===== CONTROLES MANUAIS (SETA / ZOOM) =====
  var viewUpElement = document.querySelector('#viewUp');
  var viewDownElement = document.querySelector('#viewDown');
  var viewLeftElement = document.querySelector('#viewLeft');
  var viewRightElement = document.querySelector('#viewRight');
  var viewInElement = document.querySelector('#viewIn');
  var viewOutElement = document.querySelector('#viewOut');

  var velocity = 0.7;
  var friction = 3;

  var controls = viewer.controls();

  if (viewUpElement) {
    controls.registerMethod(
      'upElement',
      new Marzipano.ElementPressControlMethod(
        viewUpElement,
        'y',
        -velocity,
        friction
      ),
      true
    );
  }
  if (viewDownElement) {
    controls.registerMethod(
      'downElement',
      new Marzipano.ElementPressControlMethod(
        viewDownElement,
        'y',
        velocity,
        friction
      ),
      true
    );
  }
  if (viewLeftElement) {
    controls.registerMethod(
      'leftElement',
      new Marzipano.ElementPressControlMethod(
        viewLeftElement,
        'x',
        -velocity,
        friction
      ),
      true
    );
  }
  if (viewRightElement) {
    controls.registerMethod(
      'rightElement',
      new Marzipano.ElementPressControlMethod(
        viewRightElement,
        'x',
        velocity,
        friction
      ),
      true
    );
  }
  if (viewInElement) {
    controls.registerMethod(
      'inElement',
      new Marzipano.ElementPressControlMethod(
        viewInElement,
        'zoom',
        -velocity,
        friction
      ),
      true
    );
  }
  if (viewOutElement) {
    controls.registerMethod(
      'outElement',
      new Marzipano.ElementPressControlMethod(
        viewOutElement,
        'zoom',
        velocity,
        friction
      ),
      true
    );
  }

  // ===== FUNÇÕES AUXILIARES DE UI =====
  function sanitize(s) {
    return s
      .replace('&', '&amp;')
      .replace('<', '&lt;')
      .replace('>', '&gt;');
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
    if (!sceneNameElement) return;
    sceneNameElement.textContent = sanitize(scene.data.name || '');
  }

  function updateSceneList(scene) {
    if (!sceneElements || !sceneElements.length) return;
    for (var i = 0; i < sceneElements.length; i++) {
      var el = sceneElements[i];
      if (el.getAttribute('data-id') === scene.data.id) {
        el.classList.add('current');
      } else {
        el.classList.remove('current');
      }
    }
  }

  function showSceneList() {
    if (!sceneListElement) return;
    sceneListElement.classList.add('enabled');
    if (sceneListToggleElement) {
      sceneListToggleElement.classList.add('enabled');
    }
  }

  function hideSceneList() {
    if (!sceneListElement) return;
    sceneListElement.classList.remove('enabled');
    if (sceneListToggleElement) {
      sceneListToggleElement.classList.remove('enabled');
    }
  }

  function toggleSceneList() {
    if (!sceneListElement) return;
    sceneListElement.classList.toggle('enabled');
    if (sceneListToggleElement) {
      sceneListToggleElement.classList.toggle('enabled');
    }
  }

  function startAutorotate() {
    if (autorotateToggleElement &&
        !autorotateToggleElement.classList.contains('enabled')) {
      return;
    }
    viewer.startMovement(autorotate);
    viewer.setIdleMovement(3000, autorotate);
  }

  function stopAutorotate() {
    viewer.stopMovement();
    viewer.setIdleMovement(Infinity);
  }

  function toggleAutorotate() {
    if (!autorotateToggleElement) return;
    if (autorotateToggleElement.classList.contains('enabled')) {
      autorotateToggleElement.classList.remove('enabled');
      stopAutorotate();
    } else {
      autorotateToggleElement.classList.add('enabled');
      startAutorotate();
    }
  }

  function createLinkHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot');
    wrapper.classList.add('link-hotspot');

    var icon = document.createElement('img');
    icon.src = 'img/link.png';
    icon.classList.add('link-hotspot-icon');

    var transformProperties = [
      '-ms-transform',
      '-webkit-transform',
      'transform'
    ];
    for (var i = 0; i < transformProperties.length; i++) {
      var property = transformProperties[i];
      icon.style[property] = 'rotate(' + hotspot.rotation + 'rad)';
    }

    wrapper.addEventListener('click', function () {
      var targetScene = findSceneById(hotspot.target);
      if (targetScene) {
        switchScene(targetScene);
      }
    });

    stopTouchAndScrollEventPropagation(wrapper);

    var tooltip = document.createElement('div');
    tooltip.classList.add('hotspot-tooltip');
    tooltip.classList.add('link-hotspot-tooltip');
    tooltip.innerHTML = findSceneDataById(hotspot.target).name;

    wrapper.appendChild(icon);
    wrapper.appendChild(tooltip);

    return wrapper;
  }

  function createInfoHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot');
    wrapper.classList.add('info-hotspot');

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

    wrapper
      .querySelector('.info-hotspot-header')
      .addEventListener('click', toggle);
    modal
      .querySelector('.info-hotspot-close-wrapper')
      .addEventListener('click', toggle);

    stopTouchAndScrollEventPropagation(wrapper);

    return wrapper;
  }

  function stopTouchAndScrollEventPropagation(element) {
    var eventList = [
      'touchstart',
      'touchmove',
      'touchend',
      'touchcancel',
      'wheel',
      'mousewheel'
    ];
    for (var i = 0; i < eventList.length; i++) {
      element.addEventListener(eventList[i], function (event) {
        event.stopPropagation();
      });
    }
  }

  function findSceneById(id) {
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === id) {
        return scenes[i];
      }
    }
    return null;
  }

  function findSceneDataById(id) {
    for (var i = 0; i < data.scenes.length; i++) {
      if (data.scenes[i].id === id) {
        return data.scenes[i];
      }
    }
    return null;
  }

  // ====== TRACKING HÍBRIDO (WEBXR + GIROSCÓPIO + MOUSE) ======

  function initHybridTracking() {
    // 1) Se tiver WebXR → tenta usar (inline + immersive)
    if ('xr' in navigator) {
      initWebXRHybrid();
      return;
    }

    // 2) Se não tiver XR, mas for mobile → usa giroscópio
    if (isMobile && typeof DeviceOrientationEvent !== 'undefined') {
      initMobileGyro();
      return;
    }

    // 3) Caso contrário, só mouse/controles manuais.
    console.log('ℹ️ Sem WebXR nem giroscópio — usando mouse/controles.');
  }

  // GIROSCÓPIO PARA CELULAR (quando não há XR)
  function initMobileGyro() {
    console.log('📱 Ativando giroscópio mobile (DeviceOrientationEvent).');

    function startGyro() {
      window.addEventListener('deviceorientation', function (event) {
        if (event.alpha == null || event.beta == null) return;
        var view = viewer.view();
        var yaw = (event.alpha * Math.PI) / 180;
        var pitch = (event.beta * Math.PI) / 180;
        view.setYaw(-yaw);
        view.setPitch(pitch / 2);
      });
    }

    // iOS exige permissão explícita
    if (
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      DeviceOrientationEvent.requestPermission()
        .then(function (res) {
          if (res === 'granted') {
            startGyro();
          } else {
            console.warn('Permissão de giroscópio negada.');
          }
        })
        .catch(function (err) {
          console.warn('Erro ao pedir permissão do giroscópio:', err);
        });
    } else {
      // Android / navegadores que não exigem permissão
      startGyro();
    }
  }

  // CONFIGURAÇÃO WEBXR HÍBRIDA (inline + immersive-vr)
  function initWebXRHybrid() {
    console.log('🕶 WebXR disponível — preparando modo híbrido.');

    // 1) Tenta sessão INLINE automaticamente (não abre tela dividida, mas rastreia a cabeça)
    navigator.xr
      .isSessionSupported('inline')
      .then(function (supportedInline) {
        if (supportedInline) {
          startXRSession('inline');
        }
      })
      .catch(function () {});

    // 2) Se immersive-vr for suportado, usamos o botão "Entrar em VR" (enterVRButton)
    navigator.xr
      .isSessionSupported('immersive-vr')
      .then(function (supportedImmersive) {
        if (!supportedImmersive || !enterVRButton) return;

        enterVRButton.style.display = 'block';
        var started = false;

        enterVRButton.addEventListener('click', function () {
          if (started) return;
          started = true;
          startXRSession('immersive-vr');
          // Opcionalmente você pode esconder o botão depois:
          // enterVRButton.style.display = 'none';
        });
      })
      .catch(function () {});
  }

  function startXRSession(mode) {
    navigator.xr
      .requestSession(mode, {
        requiredFeatures: ['local'],
        optionalFeatures: ['local-floor']
      })
      .then(function (session) {
        console.log('✅ Sessão WebXR iniciada:', mode);
        stopAutorotate(); // deixa XR controlar a câmera
        runXRLoop(session);
      })
      .catch(function (err) {
        console.warn('Falha ao iniciar sessão WebXR:', err);
      });
  }

  function runXRLoop(session) {
    var refSpaceType = 'local';
    var refSpace = null;

    session.requestReferenceSpace(refSpaceType).then(function (space) {
      refSpace = space;
    });

    session.addEventListener('end', function () {
      console.log('ℹ️ Sessão WebXR encerrada. Voltando ao modo normal.');
      startAutorotate();
    });

    function onXRFrame(time, frame) {
      if (!refSpace) {
        session.requestAnimationFrame(onXRFrame);
        return;
      }

      var pose = frame.getViewerPose(refSpace);
      if (pose) {
        // Usamos a primeira view (um olho) para orientar a câmera.
        var viewPose = pose.views[0];
        var q = viewPose.transform.orientation;

        // Conversão simples de quaternion → yaw/pitch
        var ysqr = q.y * q.y;

        var t0 = 2.0 * (q.w * q.y + q.x * q.z);
        var t1 = 1.0 - 2.0 * (ysqr + q.z * q.z);
        var yaw = Math.atan2(t0, t1);

        var t2 = 2.0 * (q.w * q.x - q.z * q.y);
        if (t2 > 1.0) t2 = 1.0;
        if (t2 < -1.0) t2 = -1.0;
        var pitch = Math.asin(t2);

        var view = viewer.view();
        view.setYaw(-yaw);
        view.setPitch(pitch);
      }

      session.requestAnimationFrame(onXRFrame);
    }

    session.requestAnimationFrame(onXRFrame);
  }

  // ===== INICIALIZAÇÃO =====

  // 1) Cena inicial
  switchScene(scenes[0]);

  // 2) Inicia tracking híbrido (XR → giroscópio → mouse)
  initHybridTracking();
})();
