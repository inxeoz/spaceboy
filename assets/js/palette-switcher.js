(function () {
  'use strict';

  /* ── palette data ── */
  var PALETTES = [
    { id: '90s',            label: '90s' },
    { id: 'Modern',         label: 'Modern' },
    { id: 'Neon',           label: 'Neon' },
    { id: 'Anime',          label: 'Anime' },
    { id: 'Maharaja',       label: 'Maharaja' },
    { id: 'Nature',         label: 'Nature' },
    { id: 'Galaxy',         label: 'Galaxy' },
    { id: 'Ocean',          label: 'Ocean' },
    { id: 'BlackWhite',     label: 'Black & White' },
    { id: 'C-Looney-Tunes', label: 'Looney Tunes' },
    { id: 'C-Disney',       label: 'Disney' },
    { id: 'Hacker',         label: 'Hacker' },
    { id: '2d-game',        label: '2D Game' },

    { sep: 'dark' },
    { id: 'Herdr',           label: 'herdr' },
    { id: 'Taat',            label: 'taat' },
    { id: 'Catppuccin',      label: 'catppuccin' },
    { id: 'Terminal',        label: 'terminal' },
    { id: 'Tokyo-Night',     label: 'tokyo night' },
    { id: 'Dracula',         label: 'dracula' },
    { id: 'Nord',            label: 'nord' },
    { id: 'Gruvbox',         label: 'gruvbox' },
    { id: 'One-Dark',        label: 'one dark' },
    { id: 'Solarized',       label: 'solarized' },
    { id: 'Kanagawa',        label: 'kanagawa' },
    { id: 'Rose-Pine',       label: 'rose pine' },
    { id: 'Vesper',          label: 'vesper' },

    { sep: 'light' },
    { id: 'Catppuccin-Latte',   label: 'catppuccin latte' },
    { id: 'Tokyo-Night-Day',    label: 'tokyo day' },
    { id: 'Gruvbox-Light',      label: 'gruvbox light' },
    { id: 'One-Light',          label: 'one light' },
    { id: 'Solarized-Light',    label: 'solarized light' },
    { id: 'Kanagawa-Lotus',     label: 'kanagawa lotus' },
    { id: 'Rose-Pine-Dawn',     label: 'rose pine dawn' },
  ];

  var dropdown, btn, saved;

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
    dropdown.hidden = true;

    var list = document.createElement('div');
    list.className = 'palette-dropdown-list';

    var activeId = currentPalette();

    PALETTES.forEach(function (p) {
      if (p.sep) {
        var sep = document.createElement('div');
        sep.className = 'palette-sep';
        sep.textContent = p.sep;
        list.appendChild(sep);
        return;
      }

      var row = document.createElement('div');
      row.className = 'palette-row';

      var name = document.createElement('span');
      name.className = 'palette-name';
      name.textContent = p.label;

      var tog = document.createElement('button');
      tog.type = 'button';
      tog.className = 'palette-tog';
      tog.setAttribute('data-palette', p.id);
      tog.setAttribute('aria-pressed', p.id === activeId ? 'true' : 'false');
      tog.textContent = p.id === activeId ? 'On' : 'Off';

      tog.addEventListener('click', function (e) {
        e.stopPropagation();
        select(p.id);
      });

      row.addEventListener('mouseenter', function () { preview(p.id); });

      row.appendChild(name);
      row.appendChild(tog);
      list.appendChild(row);
    });

    dropdown.appendChild(list);

    // Insert right after the theme's setting-row, so it sits below it
    var row = btn.closest('.setting-row');
    if (row && row.parentNode) {
      row.parentNode.insertBefore(dropdown, row.nextSibling);
    }
  }

  function currentPalette() {
    return document.documentElement.getAttribute('data-palette') || 'Modern';
  }

  function setPalette(value) {
    value = value || 'Modern';
    document.documentElement.setAttribute('data-palette', value);
    try { localStorage.setItem('palette', value); } catch (_) {}
    updateUI(value);
  }

  function updateUI(value) {
    if (!dropdown) return;
    value = value || 'Modern';
    var togs = dropdown.querySelectorAll('.palette-tog');
    for (var i = 0; i < togs.length; i++) {
      var active = togs[i].getAttribute('data-palette') === value;
      togs[i].setAttribute('aria-pressed', active ? 'true' : 'false');
      togs[i].textContent = active ? 'On' : 'Off';
    }
  }

  function select(value) {
    setPalette(value);
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
    if (saved && cur !== saved) {
      setPalette(saved);
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
