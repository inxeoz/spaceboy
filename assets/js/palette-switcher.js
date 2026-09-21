(function () {
  'use strict';

  /* ── palette data ── */
  var PALETTES = [
    { id: '90s', label: '90s', color: '#0860b8' },
    { id: 'Nord', label: 'nord', color: '#88c0d0' },
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
    "Nord": {
        "bg": "#2e3440",
        "text": "#e6e6e6",
        "border": "#434c5e",
        "link": "#88c0d0"
    }
};

  var dropdown, btn, saved, focusedIdx, headerDropdown, themeBtn, paletteBtn, headerCloseTimer;

  window.clearPalette = function () {
    document.documentElement.removeAttribute('data-palette');
    try { sessionStorage.removeItem('palette'); saved = null; } catch (_) {}
    updateUI('');
    updateHeaderUI('');
  };

  function init() {
    try { saved = sessionStorage.getItem('palette'); } catch (_) {}

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
      try { sessionStorage.setItem('theme', group); } catch (_) {}
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
    value = value || (window.__SPACEBOY__ && window.__SPACEBOY__.defaultPaletteDark) || 'Nord';
    document.documentElement.setAttribute('data-palette', value);
    try { sessionStorage.setItem('palette', value); saved = value; } catch (_) {}
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
      try { sessionStorage.setItem('theme', group); } catch (_) {}
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
