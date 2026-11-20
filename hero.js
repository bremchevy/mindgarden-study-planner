(function () {
  "use strict";
  var hero = document.getElementById("gardenHero");
  var control = document.getElementById("sceneControl");
  var controlText = document.getElementById("sceneControlText");
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var connection = navigator.connection;
  var paused = motion.matches || Boolean(connection && connection.saveData);
  var inView = true;
  function syncScene() {
    hero.classList.toggle("is-paused", paused || !inView || document.hidden);
    control.setAttribute("aria-pressed", String(paused));
    control.setAttribute("aria-label", paused ? "Play garden animation" : "Pause garden animation");
    controlText.textContent = paused ? "Play motion" : "Pause motion";
    control.querySelector(".scene-icon").textContent = paused ? "▷" : "Ⅱ";
  }
  control.addEventListener("click", function () { paused = !paused; syncScene(); });
  motion.addEventListener("change", function (event) {
    paused = event.matches || Boolean(connection && connection.saveData);
    syncScene();
  });
  document.addEventListener("visibilitychange", syncScene);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      syncScene();
    }, { threshold: 0 }).observe(hero);
  }
  // Mirror the existing planner clock rather than introducing a second timer.
  var clock = document.getElementById("clock");
  var heroClock = document.getElementById("heroClock");
  function syncClock() { heroClock.textContent = clock.textContent; }
  new MutationObserver(syncClock).observe(clock, { childList: true, characterData: true, subtree: true });
  syncClock();
  syncScene();
})();
