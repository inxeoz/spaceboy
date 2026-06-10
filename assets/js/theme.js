(function() {
  var S = window.__SPACEBOY__;
  if (!S) return;

  if (!document.querySelector || !document.addEventListener) {
    return;
  }

  var root = document.documentElement;
  var themeKey = 'theme';

  window.katexDelimiters = S.katexDelimiters;

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

  function updateThemeIcons() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var moonIcon = btn.querySelector('.moon-icon');
    var sunIcon = btn.querySelector('.sun-icon');
    var isDark = root.getAttribute('data-theme') === 'dark';
    if (moonIcon && sunIcon) {
      moonIcon.style.display = isDark ? 'none' : 'inline';
      sunIcon.style.display = isDark ? 'inline' : 'none';
    }
  }

  function updateLayoutIcons() {
    var btn = document.getElementById('layout-toggle');
    if (!btn) return;
    var gridIcon = btn.querySelector('.grid-icon');
    var listIcon = btn.querySelector('.list-icon');
    var isList = document.documentElement.classList.contains('list-layout');
    if (gridIcon && listIcon) {
      gridIcon.style.display = isList ? 'none' : 'inline';
      listIcon.style.display = isList ? 'inline' : 'none';
    }
  }

  function renderKaTeX() {
    if (typeof renderMathInElement === 'undefined') return;
    try {
      var delimiters = window.katexDelimiters;
      if (typeof delimiters === 'string') {
        delimiters = JSON.parse(delimiters);
      }
      if (!delimiters) {
        delimiters = [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ];
      }
      renderMathInElement(document.body, {
        delimiters: delimiters
      });
    } catch(err) {
      console.error('KaTeX render failed:', err);
    }
  }

  window.renderKaTeX = renderKaTeX;
  window.updateThemeIcons = updateThemeIcons;

  window.toggleTheme = function() {
    if (window.clearPalette) clearPalette();
    var isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    safeSet(themeKey, isDark ? 'light' : 'dark');
    updateThemeIcons();
    renderKaTeX();
  };

  window.toggleLayout = function() {
    var isList = document.documentElement.classList.contains('list-layout');
    document.documentElement.classList.toggle('list-layout', !isList);
    safeSet('layout', !isList ? 'list' : 'card');
    updateLayoutIcons();
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

  var savedLayout = safeGet('layout');
  if (savedLayout === 'list') {
    root.classList.add('list-layout');
  } else if (savedLayout === null) {
    root.classList.add('list-layout');
  }
  updateLayoutIcons();

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
