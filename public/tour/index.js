/*
 * Marzipano VR Viewer - Ativação Automática WebXR + Giroscópio
 * Compatível com Meta Quest, Android e iOS
 * Versão otimizada (ChatGPT 2025)
 */
'use strict';

(function () {
  const Marzipano = window.Marzipano;
  const bowser = window.bowser;
  const screenfull = window.screenfull;
  const data = window.APP_DATA;

  const panoElement = document.querySelector('#pano');
  const viewer = new Marzipano.Viewer(panoElement, {
    controls: { mouseViewMode: data.settings.mouseViewMode },
  });

  // === Criação das cenas ===
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
    return { scene, view };
  });

  // === Mostra cena inicial ===
  scenes[0].scene.switchTo();

  // === Funções de VR/Giroscópio ===
  async function enableXRTracking() {
    try {
      const session = await navigator.xr.requestSession('inline');
      const refSpace = await session.requestReferenceSpace('viewer');
      session.requestAnimationFrame(function onXRFrame(t, frame) {
        const pose = frame.getViewerPose(refSpace);
        if (pose) {
          const q = pose.transform.orientation;
          const yaw = Math.atan2(2 * (q.y * q.w + q.x * q.z), 1 - 2 * (q.y * q.y + q.z * q.z));
          const pitch = Math.asin(2 * (q.x * q.w - q.y * q.z));
          const view = viewer.view();
          view.setYaw(-yaw);
          view.setPitch(pitch);
        }
        session.requestAnimationFrame(onXRFrame);
      });
      console.log('✅ WebXR tracking ativo');
    } catch (e) {
      console.warn('❌ Falha ao iniciar WebXR:', e);
    }
  }

  function enableGyroscope() {
    if (typeof DeviceOrientationEvent === 'undefined') return;
    const view = viewer.view();
    window.addEventListener('deviceorientation', (event) => {
      if (event.alpha == null || event.beta == null) return;
      const yaw = (event.alpha * Math.PI) / 180;
      const pitch = (event.beta * Math.PI) / 180;
      view.setYaw(-yaw);
      view.setPitch(pitch / 2);
    });
    console.log('✅ Giroscópio ativo');
  }

  // === Ativação automática ===
  async function startVRMode() {
    try {
      if (panoElement.requestFullscreen) await panoElement.requestFullscreen();
      else if (panoElement.webkitRequestFullscreen) await panoElement.webkitRequestFullscreen();

      const isQuest = /OculusBrowser|Meta Quest/i.test(navigator.userAgent);
      if (isQuest && 'xr' in navigator) {
        await enableXRTracking();
      } else if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        enableGyroscope();
      }
      console.log('🌐 VR/Giroscópio ativado automaticamente!');
    } catch (e) {
      console.warn('⚠️ Erro ao ativar modo VR:', e);
    }
  }

  // Espera o Marzipano renderizar completamente antes de ativar
  setTimeout(startVRMode, 2500);
})();
