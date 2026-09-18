/* 3DOR 2027 site interactions */
(function () {
  "use strict";

  /* Mobile navigation ------------------------------------------------ */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    });
  }

  /* Dropdown menus --------------------------------------------------- */
  const groups = Array.from(document.querySelectorAll(".nav__group"));

  const closeGroups = (except) => {
    groups.forEach((g) => {
      if (g === except) return;
      g.classList.remove("is-open");
      g.querySelector(".nav__trigger").setAttribute("aria-expanded", "false");
    });
  };

  groups.forEach((group) => {
    const trigger = group.querySelector(".nav__trigger");

    trigger.addEventListener("click", () => {
      const open = !group.classList.contains("is-open");
      closeGroups(group);
      group.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", String(open));
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav__group")) closeGroups(null);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeGroups(null);
    if (toggle && nav) {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }
  });

  /* Footer year ------------------------------------------------------ */
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
