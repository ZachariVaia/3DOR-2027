/* 3DOR 2027: a small rotating wireframe icosahedron, a nod to the
   conference subject (3D shape retrieval), not decoration for its own
   sake. Requires the Three.js UMD build loaded before this file. */
(function () {
  "use strict";

  var canvas = document.getElementById("shape3d");
  if (!canvas || typeof THREE === "undefined") return;

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var size = canvas.clientWidth || canvas.width;

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(size, size, false);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 10);
  camera.position.set(0, 0, 5.5);

  var geometry = new THREE.IcosahedronGeometry(1.3, 0);
  var edges = new THREE.EdgesGeometry(geometry);

  var styles = getComputedStyle(document.documentElement);
  var lineColor = styles.getPropertyValue("--accent").trim() || "#35556e";

  var material = new THREE.LineBasicMaterial({
    color: lineColor,
    transparent: true,
    opacity: 0.85,
  });

  var shape = new THREE.LineSegments(edges, material);
  scene.add(shape);

  renderer.render(scene, camera);

  if (reduceMotion) return;

  var lastTime = 0;

  function animate(time) {
    var delta = lastTime ? time - lastTime : 0;
    lastTime = time;
    shape.rotation.x += delta * 0.00012;
    shape.rotation.y += delta * 0.00018;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
