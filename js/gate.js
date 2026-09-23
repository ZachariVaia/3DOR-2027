/* 3DOR 2027 preview gate. Client-side only: stops casual visitors, not a real access control. */
(function () {
  "use strict";

  var KEY = "3dor27_unlocked_v1";
  var HASH =
    "ef550e6b4c3f74719fc57b3679d814b2aa0250fbfc3ee16af29367fe71ada90b";

  var form = document.getElementById("gate-form");
  var input = document.getElementById("gate-password");
  var error = document.getElementById("gate-error");

  if (!form || !input) return;

  function toHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(function (b) {
        return b.toString(16).padStart(2, "0");
      })
      .join("");
  }

  function sha256Hex(text) {
    var data = new TextEncoder().encode(text);
    return crypto.subtle.digest("SHA-256", data).then(toHex);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    sha256Hex(input.value).then(function (hash) {
      if (hash === HASH) {
        try {
          localStorage.setItem(KEY, "1");
        } catch (err) {}
        document.documentElement.classList.add("gate-unlocked");
        if (error) error.hidden = true;
      } else {
        if (error) error.hidden = false;
        input.value = "";
        input.focus();
      }
    });
  });
})();
