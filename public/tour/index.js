'use strict';

(function () {
  const Marzipano = window.Marzipano;
  const screenfull = window.screenfull;
  const data = window.APP_DATA;

  // ===============================
  // 🔹 VIEWER PRINCIPAL
  // ===============================
  const panoElement = document.querySelector('#pano');
  const viewer = new Marzipano.Viewer(panoElement, {
    controls: { mouseViewMode: data.settings.mouseViewMode },
  });
  const controls = viewer.controls();

  // ===============================
  // 🔹 CENAS
  // ===============================
  const scenes = data.scenes.map((sceneData) => {
    const source = Marzipano.ImageUrlSource.fromString(
      `tiles/${sceneData.id}/{z}/{f}/{y}/{x}.jpg`,
      { cubeMapPreviewUrl: `tiles/${sceneData.id}/preview.jpg` }
    );

    const geometry = new Marzipano.CubeGeometry(sceneData.levels);
    const limiter = Marzipano.RectilinearView.limit.traditional(
      sceneData.faceSize,
      (100 * Math.PI) / 180,
      (120 * Math.PI) / 180
    );

    const view = new Marzipano.RectilinearView(sceneData.initialViewParameters, limiter);
    const scene = viewer.createScene({ source, geometry, view, pinFirstLevel: true });
    return { data: sceneData, scene, view };
  });

  // ===============================
  // 🔹 CONTROLE DE GIROSCÓPIO
  // ===============================
  let deviceOrientationControl = null;

  if (typeof Marzipano.DeviceOrientationControlMethod === 'function') {
    try {
      deviceOrientationControl = new Marzipano.DeviceOrientationControlMethod();
    } catch (e) {
      console.warn('⚠️ Falha ao criar DeviceOrientationControlMethod:', e);
    }
  }

  async function enableGyroscope() {
    if (!deviceOrientationControl) {
      console.warn('⚠️ Giroscópio não disponível neste dispositivo.');
      return;
    }

    try {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          controls.registerMethod('device', deviceOrientationControl);
          controls.enableMethod('device');
          console.log('✅ Giroscópio ativado (com permissão).');
        } else {
          alert('❌ Permissão negada. Vá em Configurações → Movimento do Sensor.');
        }
      } else {
        // Wolvic, Meta Quest, Android antigos
        controls.registerMethod('device', deviceOrientationControl);
        controls.enableMethod('device');
        console.log('✅ Giroscópio ativado automaticamente.');
      }
    } catch (err) {
      console.error('❌ Erro ao ativar giroscópio:', err);
    }
  }

  // ===============================
  // 🔹 SPLASH / BOTÃO DE ENTRADA
  // ===============================
  function createStartOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'startOverlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      transition: 'opacity 0.6s ease',
    });

    const logo = document.createElement('h1');
    logo.textContent = 'Bioproject 360°';
    Object.assign(logo.style, {
      color: '#e8b443',
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontWeight: '700',
      fontSize: '32px',
      marginBottom: '20px',
      textAlign: 'center',
      textShadow: '0 0 20px rgba(255,255,255,0.3)',
    });

    const btn = document.createElement('button');
    btn.textContent = '🎥 Entrar no Tour 360°';
    Object.assign(btn.style, {
      background: '#0a3d5a',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '16px 28px',
      fontSize: '18px',
      cursor: 'pointer',
      pointerEvents: 'auto',
      transition: 'transform 0.2s ease, opacity 0.2s ease',
      boxShadow: '0 0 15px rgba(0,0,0,0.3)',
    });

    btn.addEventListener('mouseenter', () => (btn.style.transform = 'scale(1.05)'));
    btn.addEventListener('mouseleave', () => (btn.style.transform = 'scale(1)'));

    btn.onclick = () => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 600);
      scenes[0].scene.switchTo();
      enableGyroscope();
    };

    overlay.appendChild(logo);
    overlay.appendChild(btn);
    document.body.appendChild(overlay);
  }

  // ===============================
  // 🔹 DETECÇÃO AUTOMÁTICA
  // ===============================
  window.addEventListener('load', () => {
    const isWolvic = /Wolvic|Igalia/i.test(navigator.userAgent);
    const isMeta = /OculusBrowser|Meta Quest/i.test(navigator.userAgent);
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

    // Sempre carrega a primeira cena
    scenes[0].scene.switchTo();

    if (isWolvic) {
      // Wolvic já ativa o sensor automaticamente
      console.log('🌐 Wolvic detectado — iniciando automaticamente');
      enableGyroscope();
    } else if (isMeta || isMobile) {
      // Meta Quest / Celulares: exige interação
      console.log('🥽 Meta Quest / Mobile detectado — aguardando clique');
      createStartOverlay();
    } else {
      // Desktop
      console.log('💻 Modo desktop — giroscópio desativado');
    }
  });
})();
