'use strict';

(function () {

  const Marzipano = window.Marzipano;
  const data = window.APP_DATA;

  const ua = navigator.userAgent || "";
  const isQuest = /OculusBrowser|Meta|Quest/i.test(ua);
  const isMobile = /Android|iPhone/i.test(ua) && !isQuest;

  console.log("🟦 Detectado:", { isQuest, isMobile });

  const pano = document.querySelector("#pano");

  const viewer = new Marzipano.Viewer(pano, {
    controls: {
      mouseViewMode: isQuest ? "drag" : "drag" // drag é o mais estável no Quest
    }
  });

  const limiter = Marzipano.RectilinearView.limit.traditional(
    4096,
    120 * Math.PI / 180,
    120 * Math.PI / 180
  );

  const scenes = data.scenes.map(sceneData => {

    const source = Marzipano.ImageUrlSource.fromString(
      `tiles/${sceneData.id}/{z}/{f}/{y}/{x}.jpg`,
      { cubeMapPreviewUrl: `tiles/${sceneData.id}/preview.jpg` }
    );

    const geometry = new Marzipano.CubeGeometry(sceneData.levels);
    const view = new Marzipano.RectilinearView(sceneData.initialViewParameters, limiter);

    const scene = viewer.createScene({
      source,
      geometry,
      view,
      pinFirstLevel: true
    });

    // HOTSPOTS
    sceneData.linkHotspots.forEach(h => {
      const el = document.createElement("div");
      el.classList.add("link-hotspot");

      const icon = document.createElement("img");
      icon.src = "img/link.png";
      el.appendChild(icon);

      el.addEventListener("click", () => {
        const target = scenes.find(s => s.data.id === h.target);
        if (target) switchScene(target);
      });

      scene.hotspotContainer().createHotspot(el, { yaw: h.yaw, pitch: h.pitch });
    });

    return { data: sceneData, scene, view };
  });

  function switchScene(s) {
    console.log("🔄 Cena:", s.data.id);
    s.scene.switchTo();
  }

  // GIROSCÓPIO PARA CELULAR
  if (isMobile) {
    window.addEventListener("deviceorientation", ev => {
      if (!ev.alpha && !ev.beta) return;
      viewer.view().setYaw(-(ev.alpha * Math.PI / 180));
      viewer.view().setPitch(ev.beta * Math.PI / 180 / 3);
    });
  }

  // META QUEST
  if (isQuest) {
    console.log("🥽 MODO QUEST ATIVADO");
    // NÃO existe "look" → NÃO habilite nada aqui
    // O Quest usa toque/drag + giroscópio interno
  }

  switchScene(scenes[0]);

})();
