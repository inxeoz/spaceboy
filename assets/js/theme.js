(function() {
  var S = window.__SPACEBOY__;
  if (!S) return;

  var root = document.documentElement;
  var themeKey = 'theme';

  function safeGet(key) {
    try {
      if (window.localStorage) return window.localStorage.getItem(key);
    } catch (_err) {}
    return null;
  }

  function safeSet(key, value) {
    try {
      if (window.localStorage) window.localStorage.setItem(key, value);
    } catch (_err) {}
  }

  // Show `onSel` icon when `isOn`, otherwise `offSel`
  function swapIcons(btnId, offSel, onSel, isOn) {
    var btn = document.getElementById(btnId);
    if (!btn) return;
    var off = btn.querySelector(offSel);
    var on = btn.querySelector(onSel);
    if (off && on) {
      off.style.display = isOn ? 'none' : 'inline';
      on.style.display = isOn ? 'inline' : 'none';
    }
  }

  function updateThemeIcons() {
    swapIcons('theme-toggle', '.moon-icon', '.sun-icon', root.getAttribute('data-theme') === 'dark');
  }

  function updateLayoutIcons() {
    swapIcons('layout-toggle', '.grid-icon', '.list-icon', root.classList.contains('list-layout'));
  }

  function updateTocIcons() {
    var btn = document.getElementById('toc-toggle');
    if (!btn) return;
    var hidden = root.classList.contains('toc-hidden');
    btn.setAttribute('aria-pressed', String(!hidden));
    swapIcons('toc-toggle', '.toc-show-icon', '.toc-hide-icon', !hidden);
  }

  window.updateThemeIcons = updateThemeIcons;
  window.updateTocIcons = updateTocIcons;

  window.toggleTheme = function() {
    if (window.clearPalette) clearPalette();
    var isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    safeSet(themeKey, isDark ? 'light' : 'dark');
    updateThemeIcons();
  };

  window.toggleLayout = function() {
    var isList = root.classList.toggle('list-layout');
    safeSet('layout', isList ? 'list' : 'card');
    updateLayoutIcons();
  };

  window.toggleToc = function() {
    var isHidden = root.classList.toggle('toc-hidden');
    safeSet('toc', isHidden ? 'hide' : 'show');
    updateTocIcons();
  };

  var savedTheme = safeGet(themeKey);
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
  }
  updateThemeIcons();

  // Default is list layout; only an explicit 'card' choice opts out.
  // Must match the inline script in head.html to avoid a layout flash.
  if (safeGet('layout') !== 'card') {
    root.classList.add('list-layout');
  } else {
    root.classList.remove('list-layout');
  }
  updateLayoutIcons();

  // TOC visibility preference (toggled from the header). Only affects pages
  // that render the TOC layout. Must match the inline script in head.html.
  if (safeGet('toc') === 'hide') {
    root.classList.add('toc-hidden');
  } else {
    root.classList.remove('toc-hidden');
  }
  updateTocIcons();

  document.addEventListener('DOMContentLoaded', function() {
    var header = document.getElementById('site-header');
    if (header) {
      var lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
      window.addEventListener('scroll', function() {
        var currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollY > 10) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }

        if (currentScrollY <= 0) {
          header.classList.remove('nav-hidden');
          lastScrollY = currentScrollY;
          return;
        }

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          header.classList.add('nav-hidden');
        } else if (currentScrollY < lastScrollY) {
          header.classList.remove('nav-hidden');
        }
        lastScrollY = currentScrollY;
      }, { passive: true });
    }
  });
})();
