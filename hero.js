(function () {
  "use strict";

  var hero = document.getElementById("gardenHero");
  var film = document.getElementById("gardenFilm");
  var control = document.getElementById("sceneControl");
  var controlText = document.getElementById("sceneControlText");
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var connection = navigator.connection;
  var paused = motion.matches || Boolean(connection && connection.saveData);
  var inView = true;
  var loaded = false;

  function syncScene() {
    var stopped = paused || !inView || document.hidden;
    // Finish the entrance permanently on the first stop, so resuming ambient
    // motion never hides the copy or makes a mature plant grow in again.
    if (stopped) hero.classList.add("is-settled");
    hero.classList.toggle("is-paused", stopped);
    control.setAttribute("aria-pressed", String(paused));
    control.setAttribute("aria-label", paused ? "Play garden animation" : "Pause garden animation");
    controlText.textContent = paused ? "Play scene" : "Pause scene";
    control.querySelector(".scene-icon").textContent = paused ? "▷" : "Ⅱ";

    if (stopped) {
      film.pause();
      return;
    }
    // Don't even request the film for reduced-motion or data-saving visitors
    // unless they explicitly opt in. The poster always paints immediately.
    if (!loaded) {
      var source = film.querySelector("source");
      source.src = source.dataset.src;
      film.load();
      loaded = true;
    }
    var play = film.play();
    if (play) play.catch(function () { /* A blocked autoplay keeps the poster. */ });
  }

  control.addEventListener("click", function () {
    paused = !paused;
    syncScene();
  });
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
  syncScene();
})();
