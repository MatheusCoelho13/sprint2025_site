console.log("🚀 APP.JS carregado — aguardando A-Frame…");

AFRAME.registerComponent("init-tour", {
  init: function () {
    console.log("🎉 A-Frame iniciou — carregando tour…");

    const sceneEl = document.querySelector("#scene");
    const skyEl = document.querySelector("#sky");

    if (!sceneEl || !skyEl) {
      console.error("❌ ERRO: #scene ou #sky não foram encontrados no DOM!");
      return;
    }

    let cenaAtual = null;

    // ------------------------------------
    // 🔄 TROCAR DE CENA
    // ------------------------------------
    function trocarCena(id) {
      const cena = APP_DATA.scenes.find(s => s.id === id);
      if (!cena) {
        console.error("❌ Cena não encontrada:", id);
        return;
      }

      console.log("🔄 Carregando cena:", id);
      cenaAtual = cena;

      // Caminho correto para sua estrutura:
      // public/tour/index.html
      // public/tour/tiles/id/preview.jpg
      const url = `./tiles/${id}/preview.jpg`;
    


      console.log("🟦 URL do preview:", url);
      skyEl.setAttribute("src", url);

      // Remover hotspots antigos
      document.querySelectorAll(".hotspot-entity").forEach(h => h.remove());

      // Criar novos hotspots desta cena
      cena.linkHotspots.forEach(h => criarHotspot(h));
    }

    // ------------------------------------
    // ➕ CRIAR HOTSPOT NO A-FRAME
    // ------------------------------------
    function criarHotspot(h) {
      const hotspot = document.createElement("a-image");

      // Caminho correto do ícone do hotspot
      hotspot.setAttribute("src", "./img/link.png");
      hotspot.setAttribute("width", 0.6);
      hotspot.setAttribute("height", 0.6);
      hotspot.classList.add("hotspot-entity");

      const pos = yawPitchToPosition(h.yaw, h.pitch, 9);
      hotspot.setAttribute("position", `${pos.x} ${pos.y} ${pos.z}`);
      hotspot.setAttribute("look-at", "#camera");

      hotspot.addEventListener("click", () => {
        console.log(`🟦 Indo para: ${h.target}`);
        trocarCena(h.target);
      });

      sceneEl.appendChild(hotspot);
    }

    // ------------------------------------
    // 📐 Converter yaw/pitch para posição 3D
    // ------------------------------------
    function yawPitchToPosition(yaw, pitch, radius) {
      return {
        x: radius * Math.sin(yaw) * Math.cos(pitch),
        y: radius * Math.sin(pitch),
        z: -radius * Math.cos(yaw) * Math.cos(pitch)
      };
    }

    // ------------------------------------
    // 🥽 Detectar Meta Quest
    // ------------------------------------
    const ua = navigator.userAgent || "";
    const isQuest = /OculusBrowser|Meta|Quest/i.test(ua);
    console.log("🟦 Detecção:", { isQuest });

    // ------------------------------------
    // 🚀 Inicia na PRIMEIRA CENA
    // ------------------------------------
    trocarCena(APP_DATA.scenes[0].id);
  }
});
