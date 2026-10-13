(function () {
  "use strict";

  var CFG = window.TRANSILVANIA_CONFIG || {};
  var track = window.trackEvent || function () {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ── Enlaces configurables ──────────────────────────── */
  document.querySelectorAll("[data-tickets]").forEach(function (a) {
    if (CFG.ticketsUrl) {
      a.href = CFG.ticketsUrl;
      a.target = "_blank";
      a.rel = "noopener";
    }
    a.addEventListener("click", function () {
      track("ticket_click", {
        location: a.getAttribute("data-track") || "unknown",
        destination: CFG.ticketsUrl || "#boletos",
      });
    });
  });

  document.querySelectorAll("[data-maps]").forEach(function (a) {
    if (CFG.mapsUrl) a.href = CFG.mapsUrl;
    a.addEventListener("click", function () { track("maps_click"); });
  });

  Object.keys(CFG.social || {}).forEach(function (k) {
    var url = CFG.social[k];
    var li = document.querySelector('[data-social="' + k + '"]');
    if (url && li) { li.hidden = false; li.querySelector("a").href = url; }
  });
  Object.keys(CFG.legal || {}).forEach(function (k) {
    var url = CFG.legal[k];
    var li = document.querySelector('[data-legal="' + k + '"]');
    if (url && li) { li.hidden = false; li.querySelector("a").href = url; }
  });

  /* ── Nav: fondo al hacer scroll + menú mobile ───────── */
  var nav = document.querySelector("[data-nav]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var sticky = document.querySelector("[data-sticky-buy]");
  var hero = document.querySelector(".hero");

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle("is-solid", y > 40);
    if (sticky && hero) sticky.classList.toggle("is-visible", y > hero.offsetHeight * 0.75);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav__links a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { closeMenu(); toggle.focus(); }
  });

  /* Sección activa en el menú */
  if ("IntersectionObserver" in window) {
    var links = {};
    document.querySelectorAll(".nav__links a").forEach(function (a) { links[a.hash.slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = links[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
          a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ── Hero video: solo descarga la versión adecuada ──── */
  var video = document.querySelector("[data-hero-video]");
  var saveData = navigator.connection && navigator.connection.saveData;
  var portrait = window.matchMedia("(max-aspect-ratio: 1/1)");

  function loadHero() {
    if (!video || reduceMotion.matches || saveData) return;
    var src = portrait.matches ? video.dataset.srcMobile : video.dataset.srcDesktop;
    if (video.getAttribute("src") === src) return;
    video.classList.remove("is-playing");
    video.src = src;
    video.load();
    var p = video.play();
    if (p && p.catch) p.catch(function () {}); // autoplay bloqueado → queda el poster
  }
  if (video) {
    video.addEventListener("playing", function () { video.classList.add("is-playing"); });
    // Esperar a que el póster y el contenido carguen antes de pedir el video
    if (document.readyState === "complete") loadHero();
    else window.addEventListener("load", loadHero);
    portrait.addEventListener && portrait.addEventListener("change", loadHero);
    reduceMotion.addEventListener && reduceMotion.addEventListener("change", function () {
      if (reduceMotion.matches) { video.pause(); video.classList.remove("is-playing"); }
      else loadHero();
    });
    // Pausar cuando no está a la vista (ahorra batería/CPU)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        if (!video.src || reduceMotion.matches) return;
        if (en[0].isIntersecting) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
        else video.pause();
      }).observe(video);
    }
  }

  /* ── Reproductor modal ──────────────────────────────── */
  var dialog = document.querySelector("[data-player]");
  var pVideo = document.querySelector("[data-player-video]");
  var pTitle = document.querySelector("[data-player-title]");
  var lastTrigger = null;

  function openPlayer(btn) {
    lastTrigger = btn;
    pTitle.textContent = btn.dataset.videoTitle || "";
    pVideo.poster = btn.dataset.videoPoster || "";
    pVideo.src = btn.dataset.videoOpen;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.documentElement.style.overflow = "hidden";
    if (video) video.pause();
    var p = pVideo.play();
    if (p && p.catch) p.catch(function () {});
    track("video_play", { video: btn.dataset.videoTitle || btn.dataset.videoOpen });
  }
  function closePlayer() {
    pVideo.pause();
    pVideo.removeAttribute("src");
    pVideo.load();
    if (dialog.open && typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }
  dialog.addEventListener("close", function () {
    document.documentElement.style.overflow = "";
    pVideo.pause();
    pVideo.removeAttribute("src");
    if (video && video.src && !reduceMotion.matches) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
    if (lastTrigger) lastTrigger.focus();
  });
  document.querySelectorAll("[data-video-open]").forEach(function (btn) {
    btn.addEventListener("click", function () { openPlayer(btn); });
  });
  document.querySelector("[data-player-close]").addEventListener("click", closePlayer);
  dialog.addEventListener("click", function (e) { if (e.target === dialog) closePlayer(); });

  /* ── Aparición sutil al hacer scroll ────────────────── */
  var reveals = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion.matches) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    // Escalonar elementos hermanos
    reveals.forEach(function (el) {
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains("reveal"); });
      el.style.setProperty("--d", Math.min(sibs.indexOf(el), 6) * 0.08 + "s");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }
})();
