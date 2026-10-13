/* 3DOR 2027: a subtle 3D tilt on the venue photo, following the
   cursor, like looking into the building rather than at a flat
   picture of it. Spring-eased toward the pointer (and back to flat
   when the pointer leaves) rather than snapped, same principle as the
   wireframe shape: tying a transform directly to the pointer with no
   easing reads as mechanical. Pure CSS 3D transform, no library. */
(function () {
  "use strict";

  var img = document.querySelector(".tilt-photo");
  if (!img) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var maxTilt = 8; // degrees
  var targetX = 0;
  var targetY = 0;
  var currentX = 0;
  var currentY = 0;
  var targetScale = 1;
  var currentScale = 1;

  function onPointerMove(event) {
    var rect = img.getBoundingClientRect();
    var nx = (event.clientX - rect.left) / rect.width; // 0..1
    var ny = (event.clientY - rect.top) / rect.height; // 0..1
    targetY = (nx - 0.5) * 2 * maxTilt;
    targetX = (0.5 - ny) * 2 * maxTilt;
  }

  img.addEventListener("pointerenter", function () {
    targetScale = 1.015;
  });

  img.addEventListener("pointermove", onPointerMove, { passive: true });

  img.addEventListener("pointerleave", function () {
    targetX = 0;
    targetY = 0;
    targetScale = 1;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    currentScale += (targetScale - currentScale) * 0.08;

    img.style.transform =
      "perspective(1000px) rotateX(" +
      currentX.toFixed(2) +
      "deg) rotateY(" +
      currentY.toFixed(2) +
      "deg) scale(" +
      currentScale.toFixed(3) +
      ")";

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
