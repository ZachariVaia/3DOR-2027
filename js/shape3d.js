/* 3DOR 2027: a small rotating wireframe icosahedron, a nod to the
   conference subject (3D shape retrieval), not decoration for its own
   sake. Rotates continuously and tilts toward the cursor, spring-eased
   rather than snapped straight to the mouse position (tying a visual
   directly to mouse position with no easing reads as artificial).
   Requires the Three.js UMD build loaded before this file. */
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

  // Target tilt derived from the pointer, eased toward with a simple
  // damped interpolation instead of applied instantly, so the motion
  // has a touch of lag rather than feeling mechanically 1:1.
  var pointerTiltX = 0;
  var pointerTiltY = 0;
  var currentTiltX = 0;
  var currentTiltY = 0;
  var maxTilt = 0.6;

  function onPointerMove(event) {
    var nx = (event.clientX / window.innerWidth) * 2 - 1;
    var ny = (event.clientY / window.innerHeight) * 2 - 1;
    pointerTiltY = nx * maxTilt;
    pointerTiltX = ny * maxTilt;
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });

  var lastTime = 0;
  var autoRotX = 0;
  var autoRotY = 0;

  function animate(time) {
    var delta = lastTime ? time - lastTime : 0;
    lastTime = time;

    // Continuous spin, always accumulating.
    autoRotX += delta * 0.00012;
    autoRotY += delta * 0.00018;

    // Pointer tilt, eased toward its target each frame rather than
    // snapped, so it settles into place instead of reacting instantly.
    currentTiltX += (pointerTiltX - currentTiltX) * 0.06;
    currentTiltY += (pointerTiltY - currentTiltY) * 0.06;

    shape.rotation.x = autoRotX + currentTiltX;
    shape.rotation.y = autoRotY + currentTiltY;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
