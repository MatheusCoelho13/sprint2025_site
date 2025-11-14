'use strict';

(function () {
  var Marzipano = window.Marzipano;
  var data = window.APP_DATA;

  const ua = navigator.userAgent || "";
  const isQuest = /OculusBrowser|Meta Quest|Quest/i.test(ua);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua) && !isQuest;

  console.log("🟦 DEVICE:", { isQuest, isMobile });

  var panoElement = document.querySelector("#pano");
  var sceneEls = document.querySelectorAll("#sceneList .scene");

  var viewer = new Marzipano.Viewer(panoElement);

  var limiter = Marzipano.RectilinearView.limit.traditional(
    4096,
    (100 * Math.PI) / 180,
    (90 * Math.PI) / 180
  );

  var scenes = data.scenes.map(function (s) {
    var source = Marzipano.ImageUrlSource.fromString(
      "tiles/" + s.id + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: "tiles/" + s.id + "/preview.jpg" }
    );

    var geometry = new Marzipano.CubeGeometry(s.levels);
    var view = new Marzipano.RectilinearView(s.initialViewParameters, limiter);

    var scene = viewer.createScene({
      source,
      geometry,
      view,
      pinFirstLevel: true
    });

    s.linkHotspots.forEach(function (h) {
      var el = createLinkHotspot(h);
      scene.hotspotContainer().createHotspot(el, { yaw: h.yaw, pitch: h.pitch });
    });

    return { data: s, scene, view };
  });

  function createLinkHotspot(h) {
    var el = document.createElement("div");
    el.classList.add("link-hotspot");

    var icon = document.createElement("img");
    icon.src = "img/link.png";
    icon.classList.add("link-hotspot-icon");
    el.appendChild(icon);

    el.addEventListener("click", function () {
      var target = scenes.find(x => x.data.id === h.target);
      if (target) switchScene(target);
    });

    return el;
  }

  function switchScene(target) {
    console.log("🔄 Switch:", target.data.id);
    target.scene.switchTo();
    updateSceneUI(target);
  }

  function updateSceneUI(active) {
    sceneEls.forEach(el => {
      el.classList.toggle("current",
        el.getAttribute("data-id") === active.data.id
      );
    });
  }

  // QUEST
  if (isQuest) {
    viewer.controls().enableMethod("look", true);
  }

  // MOBILE gyro
  if (isMobile) {
    window.addEventListener("deviceorientation", function (e) {
      if (!e.alpha || !e.beta) return;

      viewer.view().setYaw(-(e.alpha * Math.PI) / 180);
      viewer.view().setPitch((e.beta * Math.PI) / 180 / 3);
    });
  }

  switchScene(scenes[0]);
})();
