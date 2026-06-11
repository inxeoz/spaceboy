(function() {
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

    function onDown(e) {
      if (e.button !== 0) return;
      startX = e.clientX;
      startW = sidebar.getBoundingClientRect().width;
      document.body.classList.add('toc-resize-active');
      if (handle.setPointerCapture) {
        try { handle.setPointerCapture(e.pointerId); } catch (_err) {}
      }
      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
      handle.addEventListener('pointercancel', onUp);
      e.preventDefault();
    }

    function onMove(e) {
      if (rafId) return;
      var x = e.clientX;
      rafId = requestAnimationFrame(function() {
        rafId = null;
        var dx = x - startX;
        var newW = edge === 'right' ? startW + dx : startW - dx;
        newW = Math.max(MIN_W, Math.min(MAX_W, Math.round(newW)));
        sidebar.style.setProperty('width', newW + 'px', 'important');
        page.style.setProperty(edge === 'right' ? '--toc-left-width' : '--toc-right-width', newW + 'px');
      });
    }

    function onUp() {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      document.body.classList.remove('toc-resize-active');
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
      try {
        var w = sidebar.style.width;
        if (w) localStorage.setItem(edge === 'right' ? LS_LEFT : LS_RIGHT, parseInt(w) + 'px');
      } catch(e) {}
    }

    handle.addEventListener('pointerdown', onDown);
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
