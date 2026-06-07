(function () {
  'use strict';

  /* ── palette data ── */
  var PALETTES = [
    { id: '90s',            label: '90s',            color: '#0860b8' },
    { id: 'Modern',         label: 'Modern',         color: '#2563eb' },
    { id: 'Neon',           label: 'Neon',           color: '#c900c9' },
    { id: 'Anime',          label: 'Anime',          color: '#e84a7a' },
    { id: 'Maharaja',       label: 'Maharaja',       color: '#c0392b' },
    { id: 'Nature',         label: 'Nature',         color: '#2d7d46' },
    { id: 'Galaxy',         label: 'Galaxy',         color: '#7c4dff' },
    { id: 'Ocean',          label: 'Ocean',          color: '#0077b6' },
    { id: 'BlackWhite',     label: 'Black & White',  color: '#000000' },
    { id: 'C-Looney-Tunes', label: 'Looney Tunes',   color: '#7c3aed' },
    { id: 'C-Disney',       label: 'Disney',         color: '#1a3d7c' },
    { id: 'Hacker',         label: 'Hacker',         color: '#1a7a1a' },
    { id: '2d-game',        label: '2D Game',        color: '#e63946' },

    { sep: 'dark' },
    { id: 'Herdr',           label: 'herdr',          color: '#4a9eff' },
    { id: 'Taat',            label: 'taat',           color: '#4a9eff' },
    { id: 'Catppuccin',      label: 'catppuccin',     color: '#89b4fa' },
    { id: 'Terminal',        label: 'terminal',       color: '#4a9eff' },
    { id: 'Tokyo-Night',     label: 'tokyo night',    color: '#7aa2f7' },
    { id: 'Dracula',         label: 'dracula',        color: '#bd93f9' },
    { id: 'Nord',            label: 'nord',           color: '#88c0d0' },
    { id: 'Gruvbox',         label: 'gruvbox',        color: '#d79921' },
    { id: 'One-Dark',        label: 'one dark',       color: '#61afef' },
    { id: 'Solarized',       label: 'solarized',      color: '#268bd2' },
    { id: 'Kanagawa',        label: 'kanagawa',       color: '#7e9cd8' },
    { id: 'Rose-Pine',       label: 'rose pine',      color: '#c4a7e7' },
    { id: 'Vesper',          label: 'vesper',          color: '#ffc799' },

    { sep: 'light' },
    { id: 'Catppuccin-Latte',   label: 'catppuccin latte',  color: '#1e66f5' },
    { id: 'Tokyo-Night-Day',    label: 'tokyo day',         color: '#2e7de9' },
    { id: 'Gruvbox-Light',      label: 'gruvbox light',     color: '#076678' },
    { id: 'One-Light',          label: 'one light',         color: '#4078f2' },
    { id: 'Solarized-Light',    label: 'solarized light',   color: '#268bd2' },
    { id: 'Kanagawa-Lotus',     label: 'kanagawa lotus',    color: '#4d699b' },
    { id: 'Rose-Pine-Dawn',     label: 'rose pine dawn',    color: '#907aa9' },
  ];

  var PALETTE_THEME = {};
  (function () {
    var group = 'general';
    PALETTES.forEach(function (p) {
      if (p.sep) { group = p.sep; return; }
      PALETTE_THEME[p.id] = group;
    });
  })();

  var dropdown, btn, saved;

  window.clearPalette = function () {
    document.documentElement.removeAttribute('data-palette');
    try { localStorage.removeItem('palette'); saved = null; } catch (_) {}
    updateUI('');
  };

  function init() {
    btn = document.getElementById('sbtn-palette');
    if (!btn) return;

    try { saved = localStorage.getItem('palette'); } catch (_) {}
    ensureDropdown();
    document.addEventListener('click', onDocClick);
  }

  function ensureDropdown() {
    if (dropdown) return;
    dropdown = document.createElement('div');
    dropdown.id = 'palette-dropdown';
    dropdown.className = 'palette-dropdown';
    dropdown.setAttribute('data-testid', 'palette-dropdown');
    dropdown.hidden = true;

    var list = document.createElement('div');
    list.className = 'palette-dropdown-list';
    list.setAttribute('data-testid', 'palette-list');

    var activeId = currentPalette();

    PALETTES.forEach(function (p) {
      if (p.sep) {
        var sep = document.createElement('div');
        sep.className = 'palette-sep';
        sep.setAttribute('data-testid', 'palette-sep-' + p.sep);
        sep.textContent = p.sep;
        list.appendChild(sep);
        return;
      }

      var row = document.createElement('div');
      row.className = 'palette-row';
      row.setAttribute('data-testid', 'palette-row-' + p.id);
      row.setAttribute('data-palette', p.id);
      row.setAttribute('aria-pressed', p.id === activeId ? 'true' : 'false');

      var name = document.createElement('span');
      name.className = 'palette-name';
      name.setAttribute('data-testid', 'palette-name-' + p.id);
      name.textContent = p.label;

      row.addEventListener('click', function () { select(p.id); });
      row.addEventListener('mouseenter', function () { preview(p.id); });
      row.appendChild(name);
      list.appendChild(row);
    });

    dropdown.addEventListener('mouseleave', function () {
      var cur = currentPalette();
      if (cur !== (saved || '')) {
        if (saved) {
          document.documentElement.setAttribute('data-palette', saved);
          updateUI(saved);
        } else {
          document.documentElement.removeAttribute('data-palette');
          updateUI('');
        }
      }
    });

    dropdown.appendChild(list);

    // Insert right after the theme's setting-row, so it sits below it
    var row = btn.closest('.setting-row');
    if (row && row.parentNode) {
      row.parentNode.insertBefore(dropdown, row.nextSibling);
    }
  }

  function currentPalette() {
    return document.documentElement.getAttribute('data-palette') || '';
  }

  function setPalette(value) {
    value = value || 'Modern';
    document.documentElement.setAttribute('data-palette', value);
    try { localStorage.setItem('palette', value); saved = value; } catch (_) {}
    updateUI(value);
  }

  function updateUI(value) {
    if (!dropdown) return;
    var cur = value != null && value !== '' ? value : document.documentElement.getAttribute('data-palette') || '';
    var rows = dropdown.querySelectorAll('.palette-row');
    for (var i = 0; i < rows.length; i++) {
      var active = rows[i].getAttribute('data-palette') === cur;
      rows[i].setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  }

  function select(value) {
    setPalette(value);
    var group = PALETTE_THEME[value];
    if (group === 'dark' || group === 'light') {
      var root = document.documentElement;
      root.setAttribute('data-theme', group);
      try { localStorage.setItem('theme', group); } catch (_) {}
      if (window.updateThemeIcons) window.updateThemeIcons();
      if (window.renderMermaid) window.renderMermaid();
      if (window.renderKaTeX) window.renderKaTeX();
      if (window.__refreshThemeButtons) window.__refreshThemeButtons();
    }
    close();
  }
  function preview(value) {
    document.documentElement.setAttribute('data-palette', value);
    updateUI(value);
  }

  function toggle() {
    if (dropdown.hidden) open();
    else close();
  }

  function open() {
    dropdown.hidden = false;
    updateUI(currentPalette());
    var active = dropdown.querySelector('[aria-pressed="true"]');
    if (active) active.focus();
  }

  function close() {
    dropdown.hidden = true;
    var cur = currentPalette();
    if (cur !== (saved || '')) {
      if (saved) {
        setPalette(saved);
      } else {
        window.clearPalette();
      }
    }
  }

  function onDocClick(e) {
    if (!dropdown || dropdown.hidden) return;
    if (!dropdown.contains(e.target) && e.target !== btn) {
      close();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  window.__togglePaletteDropdown = toggle;
})();
