(function() {
  var MIN_W = 140;
  var MAX_W = 450;

  var page = document.querySelector('.page');
  if (!page) return;

  function initHandle(handle) {
    if (!handle) return;
    var edge = handle.getAttribute('data-edge'); // 'left' or 'right'
    var sidebar = edge === 'right'
      ? document.getElementById('toc-left-sidebar')
      : document.getElementById('toc-right-sidebar');
    if (!sidebar) return;

    var cssVar = edge === 'right' ? '--toc-left-width' : '--toc-right-width';
    var startX, startW, rafId, lastX;

    function applyWidth(w) {
      sidebar.style.setProperty('width', w + 'px', 'important');
      page.style.setProperty(cssVar, w + 'px');
    }

    function computeWidth(x) {
      var dx = x - startX;
      var newW = edge === 'right' ? startW + dx : startW - dx;
      return Math.max(MIN_W, Math.min(MAX_W, Math.round(newW)));
    }

    function onMove(e) {
      lastX = e.clientX;
      if (rafId) return;
      rafId = requestAnimationFrame(function() {
        rafId = null;
        applyWidth(computeWidth(lastX));
      });
    }

    function onUp() {
      // Apply the final position synchronously, even if the last move and the
      // pointerup landed in the same frame.
      if (lastX !== undefined) {
        applyWidth(computeWidth(lastX));
      }
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      document.body.classList.remove('toc-resize-active');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    }

    function onDown(e) {
      if (e.button !== 0) return;
      startX = e.clientX;
      startW = sidebar.getBoundingClientRect().width;
      lastX = undefined;
      document.body.classList.add('toc-resize-active');
      if (handle.setPointerCapture) {
        try { handle.setPointerCapture(e.pointerId); } catch (_err) {}
      }
      // Window-level listeners survive pointer-capture failures and releases
      // outside the handle; events bubble once regardless of capture state.
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
      e.preventDefault();
    }

    handle.addEventListener('pointerdown', onDown);
  }

  // Wire handles — resizing is session-only: no localStorage, so a reload
  // restores the original (CSS-default) sidebar widths.
  document.querySelectorAll('.toc-resize-handle').forEach(initHandle);
})();
