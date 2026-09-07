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
    { id: 'Herdr',           label: 'herdr',          color: '#cba6f7' },
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

  var PALETTE_DEMO = {
    "90s": {
        "bg": "#e8e8e8",
        "text": "#404040",
        "border": "#c8c8c8",
        "link": "#0860b8"
    },
    "Modern": {
        "bg": "#ffffff",
        "text": "#6b7280",
        "border": "#d8dbe1",
        "link": "#2563eb"
    },
    "Neon": {
        "bg": "#f5f5fc",
        "text": "#15152a",
        "border": "#d0cfe6",
        "link": "#bf00bf"
    },
    "Anime": {
        "bg": "#fdf6f0",
        "text": "#3d2e2a",
        "border": "#e4d1c3",
        "link": "#d91c55"
    },
    "Maharaja": {
        "bg": "#faf3e8",
        "text": "#3a2a1a",
        "border": "#dcc8a8",
        "link": "#c0392b"
    },
    "Nature": {
        "bg": "#f5f0e8",
        "text": "#2a2a1a",
        "border": "#d0c8b8",
        "link": "#2a7642"
    },
    "Galaxy": {
        "bg": "#f0edf5",
        "text": "#1a1830",
        "border": "#c8c4d8",
        "link": "#7443ff"
    },
    "Ocean": {
        "bg": "#f0f5f8",
        "text": "#0a1a28",
        "border": "#c0d0da",
        "link": "#0070ac"
    },
    "BlackWhite": {
        "bg": "#ffffff",
        "text": "#000000",
        "border": "#d0d0d0",
        "link": "#000000"
    },
    "C-Looney-Tunes": {
        "bg": "#fff7e8",
        "text": "#2a1a0a",
        "border": "#dcc8a8",
        "link": "#7c3aed"
    },
    "C-Disney": {
        "bg": "#fef8f0",
        "text": "#2a1a10",
        "border": "#dccfc0",
        "link": "#1a3d7c"
    },
    "Hacker": {
        "bg": "#f2f7ec",
        "text": "#0a1a0a",
        "border": "#c8d8c0",
        "link": "#1a7a1a"
    },
    "2d-game": {
        "bg": "#fef8e8",
        "text": "#1a1a0a",
        "border": "#dccca8",
        "link": "#db1c2a"
    },
    "Herdr": {
        "bg": "#17171a",
        "text": "#eae8ee",
        "border": "#26262b",
        "link": "#cba6f7"
    },
    "Taat": {
        "bg": "#0c0c0b",
        "text": "#f0ece0",
        "border": "#292926",
        "link": "#4a9eff"
    },
    "Catppuccin": {
        "bg": "#11111b",
        "text": "#f5e0dc",
        "border": "#313244",
        "link": "#89b4fa"
    },
    "Terminal": {
        "bg": "#0a0a0a",
        "text": "#e6e6e6",
        "border": "#222222",
        "link": "#4a9eff"
    },
    "Tokyo-Night": {
        "bg": "#1a1b26",
        "text": "#d5dcff",
        "border": "#2f3549",
        "link": "#7aa2f7"
    },
    "Dracula": {
        "bg": "#282a36",
        "text": "#e6e6e6",
        "border": "#44475a",
        "link": "#bd93f9"
    },
    "Nord": {
        "bg": "#2e3440",
        "text": "#e6e6e6",
        "border": "#434c5e",
        "link": "#88c0d0"
    },
    "Gruvbox": {
        "bg": "#282828",
        "text": "#fbf1c7",
        "border": "#504945",
        "link": "#d79921"
    },
    "One-Dark": {
        "bg": "#282c34",
        "text": "#d7dae0",
        "border": "#3e4451",
        "link": "#61afef"
    },
    "Solarized": {
        "bg": "#002b36",
        "text": "#eee8d5",
        "border": "#164a57",
        "link": "#3295da"
    },
    "Kanagawa": {
        "bg": "#1f1f28",
        "text": "#f3ead3",
        "border": "#363646",
        "link": "#7e9cd8"
    },
    "Rose-Pine": {
        "bg": "#191724",
        "text": "#f4f0ff",
        "border": "#312f45",
        "link": "#c4a7e7"
    },
    "Vesper": {
        "bg": "#101010",
        "text": "#e6e6e6",
        "border": "#2c2c2c",
        "link": "#ffc799"
    },
    "Catppuccin-Latte": {
        "bg": "#eff1f5",
        "text": "#1e1e2e",
        "border": "#ccd0da",
        "link": "#145ff5"
    },
    "Tokyo-Night-Day": {
        "bg": "#e1e2e7",
        "text": "#1f2f66",
        "border": "#b6bbd1",
        "link": "#155fc5"
    },
    "Gruvbox-Light": {
        "bg": "#fbf1c7",
        "text": "#282828",
        "border": "#d5c4a1",
        "link": "#076678"
    },
    "One-Light": {
        "bg": "#fafafa",
        "text": "#202228",
        "border": "#d9d9db",
        "link": "#2d6af1"
    },
    "Solarized-Light": {
        "bg": "#fdf6e3",
        "text": "#073642",
        "border": "#d6ceb8",
        "link": "#2074af"
    },
    "Kanagawa-Lotus": {
        "bg": "#f2ecbc",
        "text": "#2a2a37",
        "border": "#c7c7cd",
        "link": "#4d699b"
    },
    "Rose-Pine-Dawn": {
        "bg": "#faf4ed",
        "text": "#191724",
        "border": "#ddd2c9",
        "link": "#7b6298"
    }
};

  var dropdown, btn, saved, focusedIdx, headerDropdown, themeBtn, paletteBtn, headerCloseTimer;

  window.clearPalette = function () {
    document.documentElement.removeAttribute('data-palette');
    try { localStorage.removeItem('palette'); saved = null; } catch (_) {}
    updateUI('');
    updateHeaderUI('');
  };

  function init() {
    try { saved = localStorage.getItem('palette'); } catch (_) {}

    themeBtn = document.getElementById('theme-toggle');
    paletteBtn = document.getElementById('palette-toggle');
    if (themeBtn && paletteBtn) setupHeaderPalette();
    else if (themeBtn) { /* fallback: theme only, no palette toggle */ }

    btn = document.getElementById('sbtn-palette');
    if (!btn) return;

    ensureDropdown();
    document.addEventListener('click', onDocClick);
  }

  function setupHeaderPalette() {
    ensureHeaderDropdown();
    paletteBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (headerDropdown.hidden) openHeader();
      else closeHeader();
    });
    // close when hovering away from split (optional hover preview kept for quick glance)
    var split = paletteBtn.closest('.theme-split');
    if (split) {
      split.addEventListener('mouseleave', function () { scheduleHeaderClose(); });
      split.addEventListener('mouseenter', function () { clearTimeout(headerCloseTimer); });
    }
    headerDropdown.addEventListener('mouseleave', function () { scheduleHeaderClose(); });
    headerDropdown.addEventListener('mouseenter', function () { clearTimeout(headerCloseTimer); });
    document.addEventListener('click', onHeaderDocClick);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !headerDropdown.hidden) { closeHeader(); } });
  }

  function ensureHeaderDropdown() {
    if (headerDropdown) return;
    headerDropdown = document.createElement('div');
    headerDropdown.id = 'palette-dropdown-header';
    headerDropdown.className = 'palette-dropdown palette-dropdown--header';
    headerDropdown.setAttribute('data-testid', 'palette-dropdown-header');
    headerDropdown.hidden = true;

    var list = document.createElement('div');
    list.className = 'palette-dropdown-list';
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', 'Color palettes');
    list.setAttribute('data-testid', 'palette-list-header');

    var activeId = currentPalette();
    PALETTES.forEach(function (p) {
      if (p.sep) {
        var sep = document.createElement('div');
        sep.className = 'palette-sep';
        sep.setAttribute('role', 'presentation');
        sep.setAttribute('data-testid', 'palette-sep-header-' + p.sep);
        sep.textContent = p.sep;
        list.appendChild(sep);
        return;
      }
      var row = document.createElement('div');
      row.className = 'palette-row';
      row.setAttribute('role', 'option');
      row.setAttribute('data-testid', 'palette-row-header-' + p.id);
      row.setAttribute('data-palette', p.id);
      row.setAttribute('aria-pressed', p.id === activeId ? 'true' : 'false');
      row.setAttribute('aria-selected', p.id === activeId ? 'true' : 'false');
      row.tabIndex = 0;
      var name = document.createElement('span');
      name.className = 'palette-name';
      name.setAttribute('data-testid', 'palette-name-header-' + p.id);
      name.textContent = p.label;
      var demo = PALETTE_DEMO[p.id];
      if (demo) {
        row.style.backgroundColor = demo.bg;
        row.style.color = demo.text;
        row.style.borderColor = demo.border;
        row.style.borderLeftColor = demo.link;
        name.style.color = demo.text;
      }
      row.addEventListener('click', function (e) { e.stopPropagation(); selectHeader(p.id); });
      row.addEventListener('mouseenter', function () { preview(p.id); highlightHeaderRow(row); });
      row.appendChild(name);
      list.appendChild(row);
    });

    list.addEventListener('mouseleave', function () {
      var cur = currentPalette();
      if (cur !== (saved || '')) {
        if (saved) { document.documentElement.setAttribute('data-palette', saved); updateHeaderUI(saved); updateUI(saved); }
        else { document.documentElement.removeAttribute('data-palette'); updateHeaderUI(''); updateUI(''); }
      }
    });

    headerDropdown.appendChild(list);
    headerDropdown.addEventListener('mouseenter', function () { clearTimeout(headerCloseTimer); });
    headerDropdown.addEventListener('mouseleave', function () { scheduleHeaderClose(); });
    headerDropdown.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeHeader(); themeBtn.focus(); }
    });

    var group = themeBtn.closest('.toggle-group');
    if (group) group.appendChild(headerDropdown);
    else document.body.appendChild(headerDropdown);
  }

  function openHeader() {
    if (!headerDropdown) return;
    headerDropdown.hidden = false;
    if (paletteBtn) paletteBtn.setAttribute('aria-expanded', 'true');
    updateHeaderUI(currentPalette());
  }

  function closeHeader() {
    if (!headerDropdown || headerDropdown.hidden) return;
    headerDropdown.hidden = true;
    if (paletteBtn) paletteBtn.setAttribute('aria-expanded', 'false');
    var cur = currentPalette();
    if (cur !== (saved || '')) {
      if (saved) { document.documentElement.setAttribute('data-palette', saved); updateHeaderUI(saved); updateUI(saved); }
      else { document.documentElement.removeAttribute('data-palette'); updateHeaderUI(''); updateUI(''); clearPalette(); }
    }
  }

  function scheduleHeaderClose() {
    clearTimeout(headerCloseTimer);
    headerCloseTimer = setTimeout(function () { closeHeader(); }, 180);
  }

  function updateHeaderUI(value) {
    if (!headerDropdown) return;
    var cur = value != null && value !== '' ? value : document.documentElement.getAttribute('data-palette') || '';
    var rows = headerDropdown.querySelectorAll('.palette-row');
    for (var i = 0; i < rows.length; i++) {
      var active = rows[i].getAttribute('data-palette') === cur;
      rows[i].setAttribute('aria-pressed', active ? 'true' : 'false');
      rows[i].setAttribute('aria-selected', active ? 'true' : 'false');
    }
  }

  function highlightHeaderRow(row) {
    if (!headerDropdown) return;
    var rows = headerDropdown.querySelectorAll('.palette-row');
    rows.forEach(function (r) { r.classList.remove('palette-focused'); });
    if (row) row.classList.add('palette-focused');
  }

  function selectHeader(value) {
    setPalette(value);
    var group = PALETTE_THEME[value];
    if (group === 'dark' || group === 'light') {
      var root = document.documentElement;
      root.setAttribute('data-theme', group);
      try { localStorage.setItem('theme', group); } catch (_) {}
      if (window.updateThemeIcons) window.updateThemeIcons();
      if (window.__refreshThemeButtons) window.__refreshThemeButtons();
    }
    updateHeaderUI(value);
    updateUI(value);
    closeHeader();
  }

  function onHeaderDocClick(e) {
    if (!headerDropdown || headerDropdown.hidden) return;
    var split = paletteBtn ? paletteBtn.closest('.theme-split') : null;
    var inSplit = split && split.contains(e.target);
    if (!headerDropdown.contains(e.target) && !inSplit && e.target !== themeBtn && !(themeBtn && themeBtn.contains(e.target))) {
      closeHeader();
    }
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
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', 'Color palettes');
    list.setAttribute('data-testid', 'palette-list');

    var activeId = currentPalette();

    PALETTES.forEach(function (p) {
      if (p.sep) {
        var sep = document.createElement('div');
        sep.className = 'palette-sep';
        sep.setAttribute('role', 'presentation');
        sep.setAttribute('data-testid', 'palette-sep-' + p.sep);
        sep.textContent = p.sep;
        list.appendChild(sep);
        return;
      }

      var row = document.createElement('div');
      row.className = 'palette-row';
      row.setAttribute('role', 'option');
      row.setAttribute('data-testid', 'palette-row-' + p.id);
      row.setAttribute('data-palette', p.id);
      row.setAttribute('aria-pressed', p.id === activeId ? 'true' : 'false');
      row.setAttribute('aria-selected', p.id === activeId ? 'true' : 'false');
      row.tabIndex = 0;

      var name = document.createElement('span');
      name.className = 'palette-name';
      name.setAttribute('data-testid', 'palette-name-' + p.id);
      name.textContent = p.label;

      // Demo theme effect: each row previews its palette's bg/text/border
      var demo = PALETTE_DEMO[p.id];
      if (demo) {
        row.style.backgroundColor = demo.bg;
        row.style.color = demo.text;
        row.style.borderColor = demo.border;
        row.style.borderLeftColor = demo.link;
        name.style.color = demo.text;
      }
      row.addEventListener('click', function () { select(p.id); });
      row.addEventListener('mouseenter', function () {
        focusedIdx = getRowFocusIndex(row);
        highlightRow(row);
        preview(p.id);
      });
      row.appendChild(name);
      list.appendChild(row);
    });

    list.addEventListener('mouseleave', function () {
      focusedIdx = -1;
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

    // Keyboard navigation
    dropdown.addEventListener('keydown', function (e) {
      var rows = getFocusableRows();
      if (!rows.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusedIdx = focusedIdx < 0 ? 0 : Math.min(focusedIdx + 1, rows.length - 1);
        highlightRow(rows[focusedIdx]);
        rows[focusedIdx].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusedIdx = focusedIdx < 0 ? rows.length - 1 : Math.max(focusedIdx - 1, 0);
        highlightRow(rows[focusedIdx]);
        rows[focusedIdx].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        focusedIdx = 0;
        highlightRow(rows[focusedIdx]);
        rows[focusedIdx].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        focusedIdx = rows.length - 1;
        highlightRow(rows[focusedIdx]);
        rows[focusedIdx].focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
        btn.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedIdx >= 0 && rows[focusedIdx]) {
          var palId = rows[focusedIdx].getAttribute('data-palette');
          select(palId);
        }
      }
    });

    // Insert right after the theme's setting-row, so it sits below it
    var settingRow = btn.closest('.setting-row');
    if (settingRow && settingRow.parentNode) {
      settingRow.parentNode.insertBefore(dropdown, settingRow.nextSibling);
    }
  }

  function getFocusableRows() {
    if (!dropdown) return [];
    return Array.prototype.slice.call(dropdown.querySelectorAll('.palette-row'));
  }

  function getRowFocusIndex(row) {
    var rows = getFocusableRows();
    return rows.indexOf(row);
  }

  function highlightRow(row) {
    var rows = getFocusableRows();
    rows.forEach(function (r) { r.classList.remove('palette-focused'); });
    if (row) row.classList.add('palette-focused');
  }

  function currentPalette() {
    return document.documentElement.getAttribute('data-palette') || '';
  }

  function setPalette(value) {
    value = value || 'Herdr';
    document.documentElement.setAttribute('data-palette', value);
    try { localStorage.setItem('palette', value); saved = value; } catch (_) {}
    updateUI(value);
    updateHeaderUI(value);
  }

  function updateUI(value) {
    if (!dropdown) return;
    var cur = value != null && value !== '' ? value : document.documentElement.getAttribute('data-palette') || '';
    var rows = dropdown.querySelectorAll('.palette-row');
    focusedIdx = -1;
    for (var i = 0; i < rows.length; i++) {
      var active = rows[i].getAttribute('data-palette') === cur;
      rows[i].setAttribute('aria-pressed', active ? 'true' : 'false');
      rows[i].setAttribute('aria-selected', active ? 'true' : 'false');
      if (active) focusedIdx = i;
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
      if (window.__refreshThemeButtons) window.__refreshThemeButtons();
    }
    close();
  }
  function preview(value) {
    document.documentElement.setAttribute('data-palette', value);
    updateUI(value);
    updateHeaderUI(value);
  }

  function toggle() {
    if (dropdown.hidden) open();
    else close();
  }

  function open() {
    dropdown.hidden = false;
    updateUI(currentPalette());
    highlightRow(null);
    var rows = getFocusableRows();
    if (focusedIdx >= 0 && rows[focusedIdx]) {
      rows[focusedIdx].focus();
    } else if (rows.length) {
      rows[0].focus();
      focusedIdx = 0;
    }
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
