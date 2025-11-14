'use strict';

(function () {
  var Marzipano = window.Marzipano;
  var data = window.APP_DATA;

  var ua = navigator.userAgent || "";
  var isQuest = /OculusBrowser|Meta Quest|Quest/i.test(ua);
  var isMobile = /Android|iPhone|iPad|iPod/i.test(ua) && !isQuest;

  console.log("🟦 Device Detect:", ua, { isQuest: isQuest, isMobile: isMobile });

  var panoEl = document.getElementById("pano");
  var viewer = new Marzipano.Viewer(panoEl);

  var limiter = Marzipano.RectilinearView.limit.traditional(
    4096,
    (100 * Math.PI) / 180,
    (90 * Math.PI) / 180
  );

  var scenes = [];
  var dynamicList = document.getElementById("dynamicSceneList");

  // Criar lista de cenas automática no HTML
  function buildSceneList() {
    for (var i = 0; i < data.scenes.length; i++) {
      var sc = data.scenes[i];

      var item = document.createElement("a");
      item.href = "#";
      item.className = "scene";
      item.setAttribute("data-id", sc.id);

      var li = document.createElement("li");
      li.className = "text";
      li.innerText = sc.name;

      item.appendChild(li);
      dynamicList.appendChild(item);
    }
  }

  buildSceneList();

  var htmlSceneEls = document.querySelectorAll("#dynamicSceneList .scene");

  // Criar cenas do Marzipano
  for (var i = 0; i < data.scenes.length; i++) {
    var s = data.scenes[i];

    var source = Marzipano.ImageUrlSource.fromString(
      "tiles/" + s.id + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: "tiles/" + s.id + "/preview.jpg" }
    );

    var geometry = new Marzipano.CubeGeometry(s.levels);
    var view = new Marzipano.RectilinearView(s.initialViewParameters, limiter);

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // Hotspots
    if (s.linkHotspots) {
      for (var h = 0; h < s.linkHotspots.length; h++) {
        var hs = s.linkHotspots[h];
        var hsEl = createLinkHotspot(hs);
        scene.hotspotContainer().createHotspot(hsEl, {
          yaw: hs.yaw,
          pitch: hs.pitch
        });
      }
    }

    scenes.push({ data: s, scene: scene, view: view });
  }

  // Criar hotspot de link
  function createLinkHotspot(h) {
    var el = document.createElement("div");
    el.className = "link-hotspot";

    var icon = document.createElement("img");
    icon.src = "img/link.png";
    icon.className = "link-hotspot-icon";
    el.appendChild(icon);

    el.addEventListener("click", function () {
      var target = findScene(h.target);
      if (target) switchScene(target);
    });

    return el;
  }

  function findScene(id) {
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === id) return scenes[i];
    }
    return null;
  }

  // Trocar cena
  function switchScene(s) {
    console.log("🔄 Switch:", s.data.id);
    s.scene.switchTo();
    updateUI(s);
  }

  // Atualizar lista
  function updateUI(active) {
    for (var i = 0; i < htmlSceneEls.length; i++) {
      var el = htmlSceneEls[i];
      if (el.getAttribute("data-id") === active.data.id) {
        el.classList.add("current");
      } else {
        el.classList.remove("current");
      }
    }

    var title = document.querySelector(".sceneName");
    if (title) {
      title.textContent = active.data.name;
    }
  }

  // Clique na lista
  for (var i = 0; i < htmlSceneEls.length; i++) {
    (function (el) {
      var id = el.getAttribute("data-id");
      var sc = findScene(id);
      if (!sc) return;

      el.addEventListener("click", function () {
        switchScene(sc);
      });
    })(htmlSceneEls[i]);
  }

  // 🥽 META QUEST — ativa look tracking
  if (isQuest) {
    console.log("🥽 Meta Quest detectado → Look ON");
    viewer.controls().enableMethod("look", true);
  }

  // 📱 MOBILE — giroscópio nativo
  if (isMobile) {
    window.addEventListener("deviceorientation", function (e) {
      if (!e.alpha && !e.beta) return;

      var yaw = (e.alpha * Math.PI) / 180;
      var pitch = (e.beta * Math.PI) / 180;

      viewer.view().setYaw(-yaw);
      viewer.view().setPitch(pitch / 3);
    });
  }

  // Cena inicial
  switchScene(scenes[0]);

})();
