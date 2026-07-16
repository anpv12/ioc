/**
 * scale.js — Shared Stage Scaler
 * Co/phóng .stage (1920×929) vừa viewport, giữ nguyên tỉ lệ.
 * Load sau khi DOM ready.
 */
(function () {
  const DESIGN_W = 1920;
  const DESIGN_H = 929;

  function scaleStage() {
    const stage = document.querySelector('.stage');
    if (!stage) return;

    const scaleX = window.innerWidth  / DESIGN_W;
    const scaleY = window.innerHeight / DESIGN_H;
    const scale  = Math.min(scaleX, scaleY);

    const scaledW = Math.round(DESIGN_W * scale);
    const scaledH = Math.round(DESIGN_H * scale);

    // Căn giữa stage trong viewport
    const offsetX = Math.max(0, Math.floor((window.innerWidth  - scaledW) / 2));
    const offsetY = Math.max(0, Math.floor((window.innerHeight - scaledH) / 2));

    stage.style.transform       = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    stage.style.transformOrigin = 'top left';

    document.body.style.width    = window.innerWidth  + 'px';
    document.body.style.height   = window.innerHeight + 'px';
    document.body.style.overflow = 'hidden';
  }

  scaleStage();
  window.addEventListener('resize', scaleStage);
})();
