(function() {
  if (!document.querySelector || !document.addEventListener) return;

  var LS_LEFT  = 'toc-left-width';
  var LS_RIGHT = 'toc-right-width';
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

    var startX, startW, rafId;

    function pointerX(e) {
      return e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
    }

    function getWidth() {
      return sidebar.getBoundingClientRect().width;
    }

    function onDown(e) {
      // Only primary button for mouse
      if (e.button && e.button !== 0) return;
      startX = pointerX(e);
      startW = getWidth();
      document.body.style.cursor = 'col-resize';
      document.body.classList.add('toc-resize-active');
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
      // Fallback for environments without pointer events
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
      document.addEventListener('touchcancel', onUp);
    }

    function onMove(e) {
      e.preventDefault();
      if (rafId) return;
      rafId = requestAnimationFrame(function() {
        rafId = null;
        var dx = pointerX(e) - startX;
        var newW;
        if (edge === 'right') {
          newW = startW + dx;
        } else {
          newW = startW - dx;
        }
        newW = Math.max(MIN_W, Math.min(MAX_W, Math.round(newW)));
        sidebar.style.setProperty('width', newW + 'px', 'important');
        if (edge === 'right') {
          page.style.setProperty('--toc-left-width', newW + 'px');
        } else {
          page.style.setProperty('--toc-right-width', newW + 'px');
        }
      });
    }

    function onUp() {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      document.body.style.cursor = '';
      document.body.classList.remove('toc-resize-active');
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
      document.removeEventListener('touchcancel', onUp);
      try {
        var w = sidebar.style.width;
        if (w) localStorage.setItem(edge === 'right' ? LS_LEFT : LS_RIGHT, parseInt(w) + 'px');
      } catch(e) {}
    }

    handle.addEventListener('pointerdown', onDown);
    handle.addEventListener('mousedown', onDown);
    handle.addEventListener('touchstart', onDown, { passive: true });
  }

  // Restore saved widths
  try {
    var savedL = localStorage.getItem(LS_LEFT);
    if (savedL) {
      page.style.setProperty('--toc-left-width', savedL);
      var ls = document.getElementById('toc-left-sidebar');
      if (ls) ls.style.setProperty('width', savedL, 'important');
    }
    var savedR = localStorage.getItem(LS_RIGHT);
    if (savedR) {
      page.style.setProperty('--toc-right-width', savedR);
      var rs = document.getElementById('toc-right-sidebar');
      if (rs) rs.style.setProperty('width', savedR, 'important');
    }
  } catch(e) {}

  // Wire handles
  document.querySelectorAll('.toc-resize-handle').forEach(initHandle);
})();
