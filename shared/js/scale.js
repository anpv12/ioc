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

    stage.style.transform       = `scale(${scale})`;
    stage.style.transformOrigin = 'top left';

    // Cho body khớp kích thước stage đã scale để không sinh scrollbar
    document.body.style.width    = Math.round(DESIGN_W * scale) + 'px';
    document.body.style.height   = Math.round(DESIGN_H * scale) + 'px';
    document.body.style.overflow = 'hidden';
  }

  scaleStage();
  window.addEventListener('resize', scaleStage);
})();
