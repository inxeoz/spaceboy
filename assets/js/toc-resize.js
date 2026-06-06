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

    function getWidth() {
      return sidebar.getBoundingClientRect().width;
    }

    function onDown(e) {
      // Only primary button
      if (e.button !== 0) return;
      e.preventDefault();
      startX = e.clientX;
      startW = getWidth();
      document.body.style.cursor = 'col-resize';
      document.body.classList.add('toc-resize-active');
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    }

    function onMove(e) {
      if (rafId) return;
      rafId = requestAnimationFrame(function() {
        rafId = null;
        var dx = e.clientX - startX;
        var newW;
        if (edge === 'right') {
          // Left sidebar: drag right → wider
          newW = startW + dx;
        } else {
          // Right sidebar: drag right → narrower
          newW = startW - dx;
        }
        newW = Math.max(MIN_W, Math.min(MAX_W, Math.round(newW)));
        sidebar.style.setProperty('width', newW + 'px', 'important');
        // CSS variable for grid
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
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      // Persist
      try {
        var w = sidebar.style.width;
        if (w) localStorage.setItem(edge === 'right' ? LS_LEFT : LS_RIGHT, parseInt(w) + 'px');
      } catch(e) {}
    }

    handle.addEventListener('mousedown', onDown);
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
