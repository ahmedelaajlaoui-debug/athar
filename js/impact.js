/* impact.js — animated demo counters (illustrative numbers only) */
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function countUp(el) {
    const target = Number(el.dataset.target);
    if (reduceMotion) { el.textContent = target; return; }
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * progress);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll("[data-target]");
  if (!("IntersectionObserver" in window)) { counters.forEach(countUp); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { countUp(entry.target); observer.unobserve(entry.target); }
    });
  });
  counters.forEach((c) => observer.observe(c));
});
