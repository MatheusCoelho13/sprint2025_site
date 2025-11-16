'use strict';

(function () {
  // ==============================
  // 🔹 DEBUG OVERLAY VISÍVEL NO META QUEST
  // ==============================
  function createDebugOverlay() {
    try {
      var el = document.createElement('div');
      el.id = 'debugOverlay';
      el.style.position = 'fixed';
      el.style.top = '8px';
      el.style.left = '8px';
      el.style.zIndex = '9999';
      el.style.maxWidth = '90vw';
      el.style.maxHeight = '40vh';
      el.style.overflowY = 'auto';
      el.style.padding = '6px 8px';
      el.style.fontSize = '11px';
      el.style.lineHeight = '1.3';
      el.style.fontFamily = 'monospace';
      el.style.background = 'rgba(0,0,0,0.7)';
      el.style.color = '#0f0';
      el.style.borderRadius = '4px';
      el.style.pointerEvents = 'none';
      document.body.appendChild(el);
      return el;
    } catch (e) {
      console.log('Falha ao criar overlay de debug:', e);
      return null;
    }
  }

  var debugEl = null;

  function log(msg) {
    console.log(msg);
    try {
      if (!debugEl) return;
      var line = document.createElement('div');
      line.textContent = msg;
      debugEl.appendChild(line);
    } catch (e) {
      console.log('Erro ao escrever no overlay:', e);
    }
  }

  // Cria overlay após DOM pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      debugEl = createDebugOverlay();
      log('🔍 Debug overlay iniciado (DOMContentLoaded).');
    });
  } else {
    debugEl = createDebugOverlay();
    log('🔍 Debug overlay iniciado (readyState=' + document.readyState + ').');
  }

  // Captura erros globais
  window.addEventListener('error', function (e) {
    log('❌ JS ERROR: ' + e.message);
  });

  window.addEventListener('unhandledrejection', function (e) {
    log('❌ Promise ERROR: ' + (e.reason && e.reason.message ? e.reason.message : e.reason));
  });

  // ==============================
  // 🔹 VERIFICAÇÕES INICIAIS
  // ==============================
  if (!window.Marzipano) {
    log('❌ Marzipano não encontrado em window.Marzipano');
    return;
  }

  var Marzipano = window.Marzipano;
  var data = window.APP_DATA;

  if (!data || !data.scenes || !data.scenes.length) {
    log('❌ APP_DATA inválido ou sem cenas.');
    return;
  }

  var ua = navigator.userAgent || '';
  var isQuest = /OculusBrowser|Meta Quest|Quest/i.test(ua);
  var isMobile = /Android|iPhone|iPad|iPod/i.test(ua) && !isQuest;

  log('UA: ' + ua);
  log('isQuest=' + isQuest + ' | isMobile=' + isMobile);
  log('Total de cenas em APP_DATA: ' + data.scenes.length);

  var panoEl = document.getElementById('pano');
  if (!panoEl) {
    log('❌ Elemento #pano não encontrado.');
    return;
  }

  var viewer;
  try {
    viewer = new Marzipano.Viewer(panoEl, {
      controls: { mouseViewMode: data.settings && data.settings.mouseViewMode ? data.settings.mouseViewMode : 'drag' }
    });
    log('✅ Viewer criado com sucesso.');
  } catch (e) {
    log('❌ Erro ao criar Viewer: ' + e.message);
    return;
  }

  var limiter = Marzipano.RectilinearView.limit.traditional(
    4096,
    100 * Math.PI / 180,
    90 * Math.PI / 180
  );

  var scenes = [];

  function buildScenes() {
    for (var i = 0; i < data.scenes.length; i++) {
      var s = data.scenes[i];
      try {
        var source = Marzipano.ImageUrlSource.fromString(
          'tiles/' + s.id + '/{z}/{f}/{y}/{x}.jpg',
          { cubeMapPreviewUrl: 'tiles/' + s.id + '/preview.jpg' }
        );
        var geometry = new Marzipano.CubeGeometry(s.levels);
        var view = new Marzipano.RectilinearView(
          s.initialViewParameters || { yaw: 0, pitch: 0, fov: Math.PI / 2 },
          limiter
        );
        var scene = viewer.createScene({
          source: source,
          geometry: geometry,
          view: view,
          pinFirstLevel: true
        });

        // Hotspots de link
        if (s.linkHotspots && s.linkHotspots.length) {
          for (var h = 0; h < s.linkHotspots.length; h++) {
            var hotspot = s.linkHotspots[h];
            var el = createLinkHotspotElement(hotspot);
            scene.hotspotContainer().createHotspot(el, {
              yaw: hotspot.yaw,
              pitch: hotspot.pitch
            });
          }
        }

        scenes.push({ data: s, scene: scene, view: view });
        log('✅ Cena carregada: ' + s.id);
      } catch (e) {
        log('❌ Erro ao criar cena "' + s.id + '": ' + e.message);
      }
    }
  }

  function createLinkHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.className = 'link-hotspot';

    var icon = document.createElement('img');
    icon.src = 'img/link.png';
    icon.className = 'link-hotspot-icon';
    wrapper.appendChild(icon);

    wrapper.addEventListener('click', function () {
      var target = findSceneById(hotspot.target);
      if (!target) {
        log('⚠️ Hotspot aponta para cena inexistente: ' + hotspot.target);
        return;
      }
      switchScene(target);
    });

    return wrapper;
  }

  function findSceneById(id) {
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === id) return scenes[i];
    }
    return null;
  }

  var sceneEls = document.querySelectorAll('#sceneList .scene');

  function attachSceneListEvents() {
    if (!sceneEls || !sceneEls.length) {
      log('⚠️ Nenhum item de cena na lista (#sceneList .scene).');
      return;
    }

    for (var i = 0; i < scenes.length; i++) {
      (function (sceneObj) {
        var selector = '#sceneList .scene[data-id="' + sceneObj.data.id + '"]';
        var el = document.querySelector(selector);
        if (!el) {
          log('⚠️ Cena sem item na lista: ' + sceneObj.data.id);
          return;
        }

        el.addEventListener('click', function () {
          switchScene(sceneObj);
        });
      })(scenes[i]);
    }
  }

  function updateSceneUI(active) {
    // Atualiza classe "current"
    if (sceneEls && sceneEls.length) {
      for (var i = 0; i < sceneEls.length; i++) {
        var el = sceneEls[i];
        if (el.getAttribute('data-id') === active.data.id) {
          el.classList.add('current');
        } else {
          el.classList.remove('current');
        }
      }
    }

    var titleEl = document.querySelector('.sceneName');
    if (titleEl) {
      titleEl.textContent = active.data.name || active.data.id;
    }
  }

  function switchScene(target) {
    if (!target) {
      log('❌ switchScene chamado com cena inválida.');
      return;
    }

    log('🔄 Trocando para cena: ' + target.data.id);
    try {
      target.scene.switchTo();
      updateSceneUI(target);
    } catch (e) {
      log('❌ Erro ao trocar cena: ' + e.message);
    }
  }

  // ==============================
  // 🔹 META QUEST / MOBILE GIROSCÓPIO
  // ==============================
  function setupDeviceOrientation() {
    if (!isQuest && !isMobile) {
      log('📌 DeviceOrientation não necessário neste dispositivo.');
      return;
    }

    log('📌 Registrando listener de deviceorientation.');

    var firstEvent = true;

    window.addEventListener('deviceorientation', function (e) {
      if (firstEvent) {
        firstEvent = false;
        log('✅ Primeiro deviceorientation recebido. alpha=' + e.alpha + ' beta=' + e.beta);
      }

      if (typeof e.alpha !== 'number' || typeof e.beta !== 'number') return;

      var yaw = (e.alpha * Math.PI) / 180;
      var pitch = (e.beta * Math.PI) / 180;

      try {
        viewer.view().setYaw(-yaw);
        viewer.view().setPitch(pitch / 3);
      } catch (err) {
        log('❌ Erro ao aplicar orientação: ' + err.message);
      }
    });
  }

  // Força controle de "look" no Quest
  if (isQuest) {
    try {
      viewer.controls().enableMethod('look', true);
      log('🥽 Meta Quest detectado — método "look" ativado.');
    } catch (e) {
      log('❌ Erro ao ativar look no Quest: ' + e.message);
    }
  }

  // ==============================
  // 🔹 INICIALIZAÇÃO
  // ==============================
  try {
    buildScenes();
    if (!scenes.length) {
      log('❌ Nenhuma cena foi criada. Verifique tiles/ e data.js.');
      return;
    }

    attachSceneListEvents();
    setupDeviceOrientation();

    switchScene(scenes[0]);
    log('✅ Cena inicial exibida: ' + scenes[0].data.id);
  } catch (e) {
    log('❌ Erro na inicialização geral: ' + e.message);
  }
})();
