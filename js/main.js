/* 3DOR 2027 — site interactions */
(function () {
  "use strict";

  /* ---------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1040) setOpen(false);
    });
  }

  /* ---------------------------------------------------------------
     Header shadow on scroll
     --------------------------------------------------------------- */
  const header = document.querySelector(".site-header");

  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------
     Countdown to the opening day of the symposium
     --------------------------------------------------------------- */
  const countdown = document.querySelector("[data-countdown]");

  if (countdown) {
    const target = new Date(countdown.dataset.countdown).getTime();
    const fields = {
      days: countdown.querySelector('[data-unit="days"]'),
      hours: countdown.querySelector('[data-unit="hours"]'),
      minutes: countdown.querySelector('[data-unit="minutes"]'),
      seconds: countdown.querySelector('[data-unit="seconds"]'),
    };

    const pad = (n, len) => String(n).padStart(len, "0");

    const tick = () => {
      const diff = target - Date.now();

      if (diff <= 0) {
        Object.values(fields).forEach((el) => el && (el.textContent = "00"));
        clearInterval(timer);
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (fields.days) fields.days.textContent = pad(days, 3);
      if (fields.hours) fields.hours.textContent = pad(hours, 2);
      if (fields.minutes) fields.minutes.textContent = pad(minutes, 2);
      if (fields.seconds) fields.seconds.textContent = pad(seconds, 2);
    };

    tick();
    const timer = setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------
     Current year in the footer
     --------------------------------------------------------------- */
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
