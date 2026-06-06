(function () {
  'use strict';

  var overlay = document.getElementById('theme-overlay');
  var list    = document.getElementById('theme-overlay-list');
  if (!overlay || !list) return;

  var options = Array.prototype.slice.call(
    list.querySelectorAll('[role="option"]')
  );
  var saved   = null;
  try { saved = localStorage.getItem('palette'); } catch (_) {}

  function currentPalette() {
    return document.documentElement.getAttribute('data-palette') || '';
  }

  function setPalette(value) {
    document.documentElement.setAttribute('data-palette', value || 'Modern');
    try { localStorage.setItem('palette', value || 'Modern'); } catch (_) {}
    updateUI(value || 'Modern');
  }

  function updateUI(value) {
    value = value || 'Modern';
    options.forEach(function (opt) {
      opt.setAttribute(
        'aria-selected',
        String(opt.getAttribute('data-palette') === value)
      );
    });
  }

  function openOverlay() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    updateUI(currentPalette() || 'Modern');
    var active = list.querySelector('[aria-selected="true"]') || options[0];
    if (active) active.focus();
  }

  function closeOverlay() {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  function toggleOverlay() {
    if (overlay.hidden) openOverlay();
    else closeOverlay();
  }

  function preview(value) {
    document.documentElement.setAttribute('data-palette', value);
    updateUI(value);
  }

  function commit(value) {
    setPalette(value);
    closeOverlay();
  }

  function revert() {
    setPalette(saved || 'Modern');
    closeOverlay();
  }

  // Click commits, hover previews
  options.forEach(function (opt) {
    opt.addEventListener('click', function () {
      commit(opt.getAttribute('data-palette'));
    });
    opt.addEventListener('mouseenter', function () {
      preview(opt.getAttribute('data-palette'));
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (overlay.hidden) {
      // t shortcut to toggle overlay (outside form fields)
      if (e.key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        var tag = document.activeElement && document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        e.preventDefault();
        toggleOverlay();
      }
      return;
    }

    var idx = options.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      var next = idx >= 0 ? Math.min(options.length - 1, idx + 1) : 0;
      preview(options[next].getAttribute('data-palette'));
      options[next].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      var prev = idx >= 0 ? Math.max(0, idx - 1) : options.length - 1;
      preview(options[prev].getAttribute('data-palette'));
      options[prev].focus();
    } else if (e.key === 'Enter' && idx >= 0) {
      e.preventDefault();
      commit(options[idx].getAttribute('data-palette'));
    } else if (e.key === 'Escape') {
      e.preventDefault();
      revert();
    }
  });

  // Close on backdrop click
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) revert();
  });

  document.getElementById('theme-close-btn').addEventListener('click', revert);

  // Expose toggle globally for the "more" button
  window.__togglePaletteOverlay = toggleOverlay;
})();
