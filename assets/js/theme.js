(function() {
  var S = window.__SPACEBOY__;
  if (!S) return;

  var root = document.documentElement;

  function safeGet(key) {
    try {
      return window.sessionStorage && window.sessionStorage.getItem(key);
    } catch (_err) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      if (window.sessionStorage) window.sessionStorage.setItem(key, value);
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

  // Exactly two states, light or dark — no palette, no third theme.
  // head.html picks the initial value before first paint: the OS preference,
  // unless the user pinned one. While unpinned we keep following the OS live;
  // the header toggle pins the choice for the session.
  function setTheme(next) {
    root.setAttribute('data-theme', next);
  }

  if (!safeGet('theme')) {
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    function followSystem(e) {
      setTheme(e.matches ? 'dark' : 'light');
    }
    systemDark.addEventListener('change', followSystem);
  }

  function updateThemeIcons() {
    swapIcons('theme-toggle', '.moon-icon', '.sun-icon', root.getAttribute('data-theme') === 'dark');
  }

  window.toggleTheme = function() {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    safeSet('theme', root.getAttribute('data-theme'));
    updateThemeIcons();
  };

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

  window.updateTocIcons = updateTocIcons;

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

  // head.html before first paint (anti-FOUC). Here we only sync the header
  // icons to whatever state is already active.
  updateThemeIcons();
  updateLayoutIcons();
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
