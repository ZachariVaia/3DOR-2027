/* 3DOR 2027: venue page interactions (hero motion, timeline, gallery, tabs) */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Hero: scroll parallax + cursor shift on the photo -------------------- */
  const hero = document.querySelector(".venue-hero");
  const heroMedia = document.querySelector(".venue-hero__media");

  if (hero && heroMedia && !reduceMotion) {
    let parallaxY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let ticking = false;

    const render = () => {
      heroMedia.style.transform = `translate3d(${cursorX}px, ${parallaxY + cursorY}px, 0)`;
      ticking = false;
    };

    const schedule = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(render);
    };

    window.addEventListener(
      "scroll",
      () => {
        const rect = hero.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        parallaxY = Math.max(-18, Math.min(18, rect.top * 0.08));
        schedule();
      },
      { passive: true }
    );

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      cursorX = Math.max(-10, Math.min(10, relX * 20));
      cursorY = Math.max(-10, Math.min(10, relY * 20));
      schedule();
    });

    hero.addEventListener("mouseleave", () => {
      cursorX = 0;
      cursorY = 0;
      schedule();
    });
  }

  /* History timeline: highlight the item in view ------------------------- */
  const timelineItems = Array.from(document.querySelectorAll(".timeline__item"));

  if (timelineItems.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-active", entry.isIntersecting);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    timelineItems.forEach((item) => observer.observe(item));
  }

  /* Gallery lightbox ------------------------------------------------------ */
  const galleryItems = Array.from(document.querySelectorAll(".gallery__item"));
  const lightbox = document.getElementById("venue-lightbox");

  if (galleryItems.length && lightbox) {
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeBtn = document.getElementById("lightbox-close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");
    let currentIndex = 0;
    let lastFocused = null;

    const show = (index) => {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[currentIndex];
      lightboxImg.src = item.dataset.full;
      lightboxImg.alt = item.dataset.alt || "";
      lightboxCaption.innerHTML = item.dataset.caption || "";
    };

    const open = (index) => {
      lastFocused = document.activeElement;
      show(index);
      lightbox.hidden = false;
      closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
    };

    const close = () => {
      lightbox.hidden = true;
      document.removeEventListener("keydown", onKeydown);
      if (lastFocused) lastFocused.focus();
    };

    function onKeydown(e) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(currentIndex + 1);
      if (e.key === "ArrowLeft") show(currentIndex - 1);
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener("click", () => open(index));
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => show(currentIndex - 1));
    nextBtn.addEventListener("click", () => show(currentIndex + 1));

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
  }

  /* Getting there: ARIA tabs ---------------------------------------------- */
  const tabs = Array.from(document.querySelectorAll(".transit-tabs__tab"));

  if (tabs.length) {
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

    const activate = (index) => {
      tabs.forEach((tab, i) => {
        const isActive = i === index;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
        if (panels[i]) panels[i].hidden = !isActive;
      });
      tabs[index].focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(index));
      tab.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") activate((index + 1) % tabs.length);
        if (e.key === "ArrowLeft") activate((index - 1 + tabs.length) % tabs.length);
      });
    });
  }

  /* Copy address button ---------------------------------------------------- */
  const copyBtn = document.getElementById("copy-address-btn");
  const addressText = document.getElementById("venue-address-text");

  if (copyBtn && addressText) {
    copyBtn.addEventListener("click", async () => {
      const text = addressText.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        const scratch = document.createElement("textarea");
        scratch.value = text;
        scratch.style.position = "fixed";
        scratch.style.opacity = "0";
        document.body.appendChild(scratch);
        scratch.select();
        try {
          document.execCommand("copy");
        } catch (err2) {
          /* clipboard unavailable, nothing further to do */
        }
        document.body.removeChild(scratch);
      }
      const label = copyBtn.querySelector(".copy-btn__label");
      const original = label.textContent;
      label.textContent = "Copied";
      copyBtn.classList.add("is-copied");
      setTimeout(() => {
        label.textContent = original;
        copyBtn.classList.remove("is-copied");
      }, 1800);
    });
  }
})();
