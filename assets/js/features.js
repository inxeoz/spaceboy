(function() {
  var S = window.__SPACEBOY__;
  if (!S) return;

  function loadScriptWithFallback(localSrc, cdnSrc, done, integrity) {
    if (!localSrc && !cdnSrc) {
      if (done) done();
      return;
    }

    function inject(src, onError) {
      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      if (integrity && src === cdnSrc) {
        script.integrity = integrity;
        script.crossOrigin = 'anonymous';
      }
      script.onload = function() { if (done) done(); };
      script.onerror = onError || function() { if (done) done(); };
      document.head.appendChild(script);
    }

    if (localSrc && cdnSrc && localSrc !== cdnSrc) {
      inject(localSrc, function() { inject(cdnSrc); });
    } else {
      inject(localSrc || cdnSrc);
    }
  }

  function closest(el, selector) {
    return el && el.nodeType === 1 ? el.closest(selector) : null;
  }


  // Smooth scroll to a heading with an ease-out curve and a highlight flash.
  // Exposed on window so toc.js (loaded after the core bundle) can reuse it.
  function scrollToHeading(target, done) {
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function flashHeading() {
      target.classList.remove('heading-highlight');
      void target.offsetWidth;
      target.classList.add('heading-highlight');
      setTimeout(function() { target.classList.remove('heading-highlight'); }, 1600);
    }
    if (prefersReducedMotion) {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      flashHeading();
      if (done) done();
      return;
    }
    var offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 90;
    var targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;
    var startY = window.pageYOffset;
    var distance = targetY - startY;
    if (Math.abs(distance) < 5) { flashHeading(); if (done) done(); return; }
    var duration = Math.min(800, Math.max(250, Math.abs(distance) * 0.4));
    var startTime = null;
    function step(now) {
      if (!startTime) startTime = now;
      var p = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeOutCubic(p));
      if (p < 1) { requestAnimationFrame(step); } else { flashHeading(); if (done) done(); }
    }
    requestAnimationFrame(step);
  }
  window.__sbScrollToHeading = scrollToHeading;

  function announce(msg) {
    var ann = document.getElementById('copy-announcement');
    if (!ann) return;
    ann.textContent = msg;
    setTimeout(function() { ann.textContent = ''; }, 2000);
  }

  var CHECK_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  // Copy with execCommand fallback for insecure contexts / older engines
  function copyText(text, onSuccess) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { if (document.execCommand('copy') && onSuccess) onSuccess(); } catch (_err) {}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess || function() {}, fallback);
    } else {
      fallback();
    }
  }

  // Swap a button's icon for a green checkmark for 2s and announce to SRs
  function flashCheckmark(btn, msg) {
    var origHTML = btn.innerHTML;
    btn.innerHTML = CHECK_SVG;
    announce(msg);
    setTimeout(function() { btn.innerHTML = origHTML; }, 2000);
  }

  if (S.enableCopyCode && !S.legacyMode) {
    document.addEventListener('click', function(e) {
      var btn = closest(e.target, '.copy-code-btn');
      if (!btn) return;
      var block = closest(btn, '.code-block-wrapper');
      var code = block && block.querySelector('code, pre');
      var text = code ? code.textContent || '' : '';
      if (!text) return;
      copyText(text, function() { flashCheckmark(btn, 'Copied!'); });
    });
  }

  if (S.lazyImage && !S.legacyMode) {
    var articleEl = document.getElementById('article');
    if (typeof LazyLoad !== 'undefined' && articleEl) {
      new LazyLoad({ container: articleEl });
    }
  }

  if (!S.legacyMode) {
    var progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      function updateProgress() {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;
        var pct = (window.pageYOffset / docHeight) * 100;
        progressBar.style.width = Math.min(100, Math.max(0, pct)) + '%';
      }
      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress, { passive: true });
      updateProgress();
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (!S.legacyMode) {
      // Back-to-top button
      var backToTop = document.getElementById('back-to-top');
      if (backToTop) {
        var bttVisible = false;
        window.addEventListener('scroll', function() {
          var shouldShow = (window.pageYOffset || document.documentElement.scrollTop) > 300;
          if (shouldShow !== bttVisible) {
            bttVisible = shouldShow;
            if (shouldShow) {
              backToTop.removeAttribute('hidden');
            } else {
              backToTop.setAttribute('hidden', '');
            }
          }
        }, { passive: true });
        backToTop.addEventListener('click', function() {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      // Heading anchor links
      var content = document.querySelector('.post-content');
      if (content) {
        var headings = content.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
        for (var i = 0; i < headings.length; i++) {
          (function(h) {
            var anchor = document.createElement('a');
            anchor.className = 'heading-anchor';
            anchor.href = '#' + h.id;
            anchor.setAttribute('aria-hidden', 'true');
            anchor.setAttribute('tabindex', '-1');
            anchor.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
            anchor.addEventListener('click', function(e) {
              e.preventDefault();
              var url = window.location.pathname + window.location.search + '#' + h.id;
              copyText(window.location.origin + url);
              history.pushState(null, '', url);
              scrollToHeading(h);
              announce('Link copied!');
            });
            h.appendChild(anchor);
          })(headings[i]);
        }

        // Wrap tables in a scrollable container
        content.querySelectorAll('table').forEach(function(table) {
          if (table.parentNode.classList.contains('table-scroll')) return;
          var wrapper = document.createElement('div');
          wrapper.className = 'table-scroll';
          table.parentNode.insertBefore(wrapper, table);
          wrapper.appendChild(table);
        });

        // ── Resizable table columns + row height ───────────────────────────
        // Session-only. The affordances are the table's own borders; the
        // cursor plus a faint highlight of the native gridline reveal them
        // (no separate handles). Column separators drag from the header row;
        // the table's bottom edge drags to grow vertical row padding.
        // Keyboard: focus a separator and use arrows (Shift = bigger step);
        // Esc cancels an in-progress drag.
        function enableTableResize() {
          if (S.enableTableResize === false) return;
          content.querySelectorAll('.table-scroll').forEach(function(wrapper) {
            if (wrapper.classList.contains('has-col-resize')) return;
            var table = wrapper.querySelector('table');
            if (!table || !table.rows.length) return;
            var headerRow = (table.tHead && table.tHead.rows[0]) || table.rows[0];
            var colCount = headerRow ? headerRow.cells.length : 0;
            if (colCount < 2) return;
            wrapper.classList.add('has-col-resize');

            var colgroup = null;

            function measureColWidths() {
              var widths = [];
              for (var i = 0; i < colCount; i++) {
                widths.push(headerRow.cells[i].getBoundingClientRect().width);
              }
              return widths;
            }

            function ensureColgroup() {
              if (colgroup) return colgroup;
              colgroup = document.createElement('colgroup');
              for (var i = 0; i < colCount; i++) colgroup.appendChild(document.createElement('col'));
              table.insertBefore(colgroup, table.firstChild);
              return colgroup;
            }

            function applyColWidths(widths) {
              var group = ensureColgroup();
              for (var i = 0; i < widths.length; i++) {
                group.children[i].style.width = Math.round(widths[i]) + 'px';
              }
            }

            // Clamp a column pair to the minimum while preserving their sum,
            // so the table's total width never drifts.
            function clampPair(a, b) {
              var min = 48;
              if (a < min) { b += min - a; a = min; }
              if (b < min) { a += min - b; b = min; }
              return [a, b];
            }

            // Freeze the current render into px so drags reproduce it exactly.
            // Widths must be measured BEFORE switching to fixed layout — fixed
            // with no colgroup yet distributes columns equally, which would
            // corrupt the baseline.
            function lockLayout() {
              if (table.style.tableLayout === 'fixed') return;
              var widths = measureColWidths();
              var measured = table.getBoundingClientRect().width;
              table.style.tableLayout = 'fixed';
              table.style.width = Math.round(measured) + 'px';
              table.style.minWidth = '0';
              applyColWidths(widths);
              wrapper.classList.add('is-resized');
            }

            // Column handles live inside header cells, straddling the table's
            // native column border — the header separator itself is the grip.
            for (var i = 0; i < colCount - 1; i++) {
              (function(idx) {
                var cell = headerRow.cells[idx];
                var handle = document.createElement('div');
                handle.className = 'table-col-resizer';
                handle.setAttribute('role', 'separator');
                handle.setAttribute('aria-orientation', 'vertical');
                handle.setAttribute('aria-label', 'Resize column');
                handle.setAttribute('data-testid', 'table-col-resizer');
                handle.tabIndex = 0;
                cell.appendChild(handle);

                var startX, startWidths, lastX, rafId, dragging;

                function applyResize(x) {
                  var pair = clampPair(startWidths[idx] + (x - startX), startWidths[idx + 1] - (x - startX));
                  var widths = startWidths.slice();
                  widths[idx] = pair[0];
                  widths[idx + 1] = pair[1];
                  applyColWidths(widths);
                }

                function onMove(e) {
                  lastX = e.clientX;
                  if (rafId) return;
                  rafId = requestAnimationFrame(function() {
                    rafId = null;
                    applyResize(lastX);
                  });
                }

                function onUp(cancelled) {
                  if (lastX !== undefined && !cancelled) applyResize(lastX);
                  if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
                  dragging = false;
                  document.body.classList.remove('table-col-resize-active');
                  window.removeEventListener('pointermove', onMove);
                  window.removeEventListener('pointerup', onUp);
                  window.removeEventListener('pointercancel', onUp);
                  window.removeEventListener('keydown', onKeyDown);
                }

                function onKeyDown(e) {
                  if (e.key === 'Escape') {
                    if (!dragging) return;
                    applyColWidths(startWidths);
                    onUp(true);
                    return;
                  }
                  var step = e.shiftKey ? 30 : 10;
                  var dir = e.key === 'ArrowRight' ? step : (e.key === 'ArrowLeft' ? -step : 0);
                  if (!dir) return;
                  e.preventDefault();
                  lockLayout();
                  var widths = measureColWidths();
                  var pair = clampPair(widths[idx] + dir, widths[idx + 1] - dir);
                  widths[idx] = pair[0];
                  widths[idx + 1] = pair[1];
                  applyColWidths(widths);
                }

                function onDown(e) {
                  if (e.button !== 0) return;
                  lockLayout();
                  startX = e.clientX;
                  startWidths = measureColWidths();
                  lastX = undefined;
                  dragging = true;
                  document.body.classList.add('table-col-resize-active');
                  if (handle.setPointerCapture) {
                    try { handle.setPointerCapture(e.pointerId); } catch (_err) {}
                  }
                  window.addEventListener('pointermove', onMove);
                  window.addEventListener('pointerup', onUp);
                  window.addEventListener('pointercancel', onUp);
                  window.addEventListener('keydown', onKeyDown);
                  e.preventDefault();
                }

                handle.addEventListener('pointerdown', onDown);
                handle.addEventListener('keydown', onKeyDown);
              })(i);
            }

            // Row-height handle: an invisible strip on the table's own bottom
            // edge, spanning the full table width so wide (scrolled) tables
            // stay grabbable. Dragging it grows/shrinks vertical row padding.
            var rowHandle = document.createElement('div');
            rowHandle.className = 'table-row-resizer';
            rowHandle.setAttribute('role', 'separator');
            rowHandle.setAttribute('aria-orientation', 'horizontal');
            rowHandle.setAttribute('aria-label', 'Adjust row height');
            rowHandle.setAttribute('data-testid', 'table-row-resizer');
            rowHandle.tabIndex = 0;
            wrapper.appendChild(rowHandle);

            function positionRowHandle() {
              rowHandle.style.width = Math.round(table.getBoundingClientRect().width) + 'px';
              rowHandle.style.bottom = (wrapper.offsetHeight - wrapper.clientHeight) + 'px';
            }
            positionRowHandle();
            window.addEventListener('resize', positionRowHandle, { passive: true });
            if (document.fonts && document.fonts.ready) {
              document.fonts.ready.then(positionRowHandle);
            }

            var rowStartY, rowStartPad, rowLastY, rowRafId, rowDragging;

            function applyRowPad(y) {
              var pad = Math.max(0, Math.min(60, Math.round(rowStartPad + (y - rowStartY))));
              wrapper.style.setProperty('--table-row-extra', pad + 'px');
            }

            function rowOnMove(e) {
              rowLastY = e.clientY;
              if (rowRafId) return;
              rowRafId = requestAnimationFrame(function() {
                rowRafId = null;
                applyRowPad(rowLastY);
              });
            }

            function rowOnUp(cancelled) {
              if (rowLastY !== undefined && !cancelled) applyRowPad(rowLastY);
              if (rowRafId) { cancelAnimationFrame(rowRafId); rowRafId = null; }
              rowDragging = false;
              document.body.classList.remove('table-row-resize-active');
              window.removeEventListener('pointermove', rowOnMove);
              window.removeEventListener('pointerup', rowOnUp);
              window.removeEventListener('pointercancel', rowOnUp);
              window.removeEventListener('keydown', rowOnKeyDown);
            }

            function rowOnKeyDown(e) {
              if (e.key === 'Escape') {
                if (!rowDragging) return;
                wrapper.style.setProperty('--table-row-extra', rowStartPad + 'px');
                rowOnUp(true);
                return;
              }
              var step = e.shiftKey ? 12 : 4;
              var dir = e.key === 'ArrowDown' ? step : (e.key === 'ArrowUp' ? -step : 0);
              if (!dir) return;
              e.preventDefault();
              var cur = parseFloat(getComputedStyle(wrapper).getPropertyValue('--table-row-extra')) || 0;
              wrapper.style.setProperty('--table-row-extra', Math.max(0, Math.min(60, Math.round(cur + dir))) + 'px');
            }

            function rowOnDown(e) {
              if (e.button !== 0) return;
              rowStartY = e.clientY;
              rowStartPad = parseFloat(getComputedStyle(wrapper).getPropertyValue('--table-row-extra')) || 0;
              rowLastY = undefined;
              rowDragging = true;
              document.body.classList.add('table-row-resize-active');
              if (rowHandle.setPointerCapture) {
                try { rowHandle.setPointerCapture(e.pointerId); } catch (_err) {}
              }
              window.addEventListener('pointermove', rowOnMove);
              window.addEventListener('pointerup', rowOnUp);
              window.addEventListener('pointercancel', rowOnUp);
              window.addEventListener('keydown', rowOnKeyDown);
              e.preventDefault();
            }

            rowHandle.addEventListener('pointerdown', rowOnDown);
            rowHandle.addEventListener('keydown', rowOnKeyDown);
          });
        }
        enableTableResize();
      }

      // Share: copy-link button
      document.addEventListener('click', function(e) {
        var btn = closest(e.target, '.post-share-copy');
        if (!btn) return;
        copyText(window.location.href, function() { flashCheckmark(btn, 'Link copied!'); });
      });

      // ── Image / diagram lightbox ──────────────────────────────────────
      var lightbox = null;
      var lastLightboxFocus = null;

      function closeLightbox() {
        if (!lightbox || lightbox.hasAttribute('hidden')) return;
        lightbox.classList.remove('open');
        lightbox.setAttribute('hidden', '');
        document.body.style.overflow = '';
        if (lastLightboxFocus && lastLightboxFocus.focus) lastLightboxFocus.focus();
        lastLightboxFocus = null;
      }

      function openLightbox(node) {
        if (!lightbox) {
          lightbox = document.createElement('div');
          lightbox.className = 'lightbox-overlay';
          lightbox.setAttribute('role', 'dialog');
          lightbox.setAttribute('aria-label', 'Image viewer');
          lightbox.setAttribute('aria-modal', 'true');
          lightbox.setAttribute('tabindex', '-1');
          lightbox.setAttribute('data-testid', 'lightbox');
          lightbox.setAttribute('hidden', '');
          lightbox.addEventListener('click', closeLightbox);
          lightbox.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') { e.preventDefault(); lightbox.focus(); }
          });
          document.body.appendChild(lightbox);
        }
        lastLightboxFocus = document.activeElement;
        lightbox.innerHTML = '';
        lightbox.appendChild(node);
        lightbox.removeAttribute('hidden');
        requestAnimationFrame(function() { lightbox.classList.add('open'); lightbox.focus(); });
        document.body.style.overflow = 'hidden';
      }

      document.addEventListener('click', function(e) {
        if (closest(e.target, '.lightbox-overlay')) return;
        var img = closest(e.target, '.post-content img');
        if (img && !closest(img, 'a') && !img.classList.contains('post-cover-image') && !img.classList.contains('post-hero-image')) {
          openLightbox(img.cloneNode(true));
          return;
        }
        var diagram = closest(e.target, '.mermaid-diagram');
        if (diagram) {
          var svg = diagram.querySelector('svg');
          if (svg) openLightbox(svg.cloneNode(true));
        }
      });

      // ── Collapsible long code blocks ──────────────────────────────────
      // --code-max-height defines roughly how many lines (X) stay visible.
      // Up to X+5 lines: show the whole block, no controls — a "Show more"
      // that reveals a couple of lines is just noise. From X+6 lines on:
      // cut exactly after line X and add Show more / Show less.
      // Caps are responsive, so everything is re-measured on resize.
      var GRACE_LINES = 5;

      function refreshCodeCollapse() {
        var rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        document.querySelectorAll('.code-block-wrapper').forEach(function(wrapper) {
          // Show the wrap toggle only when lines actually overflow the block,
          // so desktop (wide content) doesn't get a useless button. Run before
          // the is-expanded early return so expanded blocks stay correct too.
          var pre = wrapper.querySelector('pre');
          if (pre) {
            var overflows = pre.scrollWidth > pre.clientWidth + 1;
            // While wrapped there is no horizontal overflow to measure — keep
            // the button so the user can still unwrap.
            if (wrapper.classList.contains('is-wrapped')) overflows = true;
            wrapper.classList.toggle('has-h-overflow', overflows);
          }
          if (wrapper.classList.contains('is-expanded')) return;
          if (!pre) return;
          var cs = getComputedStyle(pre);

          var capRaw = cs.getPropertyValue('--code-max-height').trim();
          var capPx;
          if (capRaw.slice(-3) === 'rem') capPx = parseFloat(capRaw) * rootFont;
          else if (capRaw.slice(-2) === 'vh') capPx = parseFloat(capRaw) / 100 * window.innerHeight;
          else capPx = parseFloat(capRaw);
          if (!isFinite(capPx)) capPx = parseFloat(cs.maxHeight);
          if (!isFinite(capPx)) return;

          var lineH = parseFloat(cs.lineHeight);
          if (!isFinite(lineH)) lineH = 1.6 * parseFloat(cs.fontSize);
          var padV = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
          var totalLines = Math.round((pre.scrollHeight - padV) / lineH);
          var visibleLines = Math.max(3, Math.floor((capPx - padV) / lineH));

          var btn = wrapper.querySelector('.code-expand-btn');
          if (totalLines <= visibleLines + GRACE_LINES) {
            // Within the grace zone — show everything, no clipping, no button
            wrapper.classList.remove('is-collapsed');
            wrapper.classList.toggle('is-uncapped', totalLines > visibleLines);
            pre.style.maxHeight = '';
            if (btn) btn.remove();
            return;
          }

          // Long block — collapse to exactly `visibleLines` whole lines
          var cutPx = Math.round(visibleLines * lineH + padV);
          wrapper.dataset.codeCut = cutPx + 'px';
          wrapper.classList.remove('is-uncapped');
          wrapper.classList.add('is-collapsed');
          pre.style.maxHeight = cutPx + 'px';
          if (!btn) {
            btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'code-expand-btn';
            btn.textContent = 'Show more';
            btn.setAttribute('data-testid', 'code-expand-btn');
            btn.setAttribute('aria-expanded', 'false');
            btn.addEventListener('click', function() {
              btn.blur();
              var scroller = document.scrollingElement || document.documentElement;
              var prevY = scroller.scrollTop;
              var expanded = wrapper.classList.toggle('is-expanded');
              wrapper.classList.toggle('is-collapsed', !expanded);
              pre.style.maxHeight = expanded ? 'none' : (wrapper.dataset.codeCut || '');
              btn.textContent = expanded ? 'Show less' : 'Show more';
              btn.setAttribute('aria-expanded', String(expanded));
              if (!expanded) {
                wrapper.scrollIntoView({ block: 'nearest' });
              } else {
                scroller.scrollTop = prevY;
                requestAnimationFrame(function() { scroller.scrollTop = prevY; });
              }
            });
            wrapper.appendChild(btn);
          }
        });
      }
      refreshCodeCollapse();
      // Re-measure once webfonts land — fallback-font metrics differ enough
      // to flip blocks across the collapse threshold.
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(refreshCodeCollapse);
      }
      var codeCollapseTimer;
      window.addEventListener('resize', function() {
        clearTimeout(codeCollapseTimer);
        codeCollapseTimer = setTimeout(refreshCodeCollapse, 200);
      }, { passive: true });

      // ── Code line-wrap toggle ─────────────────────────────────────────
      document.addEventListener('click', function(e) {
        var btn = closest(e.target, '.wrap-code-btn');
        if (!btn) return;
        var wrapper = closest(btn, '.code-block-wrapper');
        if (!wrapper) return;
        wrapper.classList.toggle('is-wrapped');
        refreshCodeCollapse(); // wrapping changes the line count
      });

      // ── Keyboard shortcuts (j/k/t/?) ──────────────────────────────────
      var kbdOverlay = null;

      function toggleKbdOverlay() {
        if (!kbdOverlay) {
          kbdOverlay = document.createElement('div');
          kbdOverlay.className = 'kbd-overlay';
          kbdOverlay.setAttribute('role', 'dialog');
          kbdOverlay.setAttribute('aria-label', 'Keyboard shortcuts');
          kbdOverlay.setAttribute('data-testid', 'kbd-overlay');
          kbdOverlay.innerHTML =
            '<div class="kbd-panel">' +
              '<h2>Keyboard shortcuts</h2>' +
              '<div class="kbd-row"><span>Search</span><span><kbd>Ctrl</kbd> <kbd>K</kbd></span></div>' +
              '<div class="kbd-row"><span>Toggle theme</span><kbd>t</kbd></div>' +
              '<div class="kbd-row"><span>Older post</span><kbd>j</kbd></div>' +
              '<div class="kbd-row"><span>Newer post</span><kbd>k</kbd></div>' +
              '<div class="kbd-row"><span>This help</span><kbd>?</kbd></div>' +
              '<div class="kbd-row"><span>Close</span><kbd>Esc</kbd></div>' +
            '</div>';
          kbdOverlay.addEventListener('click', function(e) {
            if (!closest(e.target, '.kbd-panel')) kbdOverlay.setAttribute('hidden', '');
          });
          document.body.appendChild(kbdOverlay);
          return;
        }
        if (kbdOverlay.hasAttribute('hidden')) {
          kbdOverlay.removeAttribute('hidden');
        } else {
          kbdOverlay.setAttribute('hidden', '');
        }
      }

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          closeLightbox();
          if (kbdOverlay) kbdOverlay.setAttribute('hidden', '');
          return;
        }
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        var t = e.target;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
        var modal = document.getElementById('search-modal');
        if (modal && !modal.hasAttribute('hidden')) return;

        if (e.key === '?') {
          e.preventDefault();
          toggleKbdOverlay();
        } else if (e.key === 'j' || e.key === 'k') {
          var link = document.querySelector(e.key === 'j' ? '.post-nav-older' : '.post-nav-newer');
          if (link) window.location.href = link.href;
        } else if (e.key === 't') {
          if (window.toggleTheme) window.toggleTheme();
        }
      });
    }

    // ── Search ────────────────────────────────────────────────────────────
    var searchModal   = document.getElementById('search-modal');
    var searchInput   = document.getElementById('search-input');
    if (S.enableSearch && !S.legacyMode && searchModal && searchInput) {
      var searchResults = document.getElementById('search-results');
      var searchToggle  = document.getElementById('search-toggle');
      var searchClose   = document.getElementById('search-close');
      var searchBackdrop = document.getElementById('search-backdrop');

      var fuseInstance  = null;
      var searchLoading = false;
      var searchDebounce = null;
      var activeIdx     = -1;
      var searchIdleHTML = searchResults.innerHTML;

      var indexUrl = (S.staticPrefix || '') + '/index.json';

      function openSearch() {
        searchModal.removeAttribute('hidden');
        searchInput.focus();
        document.body.style.overflow = 'hidden';
      }

      function closeSearch() {
        searchModal.setAttribute('hidden', '');
        searchInput.value = '';
        searchResults.innerHTML = searchIdleHTML;
        activeIdx = -1;
        document.body.style.overflow = '';
        if (searchToggle) searchToggle.focus();
      }

      function setActive(idx) {
        var items = searchResults.querySelectorAll('.search-result-item');
        if (!items.length) return;
        if (activeIdx >= 0 && items[activeIdx]) items[activeIdx].setAttribute('aria-selected', 'false');
        activeIdx = Math.max(0, Math.min(idx, items.length - 1));
        var el = items[activeIdx];
        if (el) {
          el.setAttribute('aria-selected', 'true');
          el.scrollIntoView({ block: 'nearest' });
        }
      }

      function escapeHtml(s) {
        return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      }

      function renderResults(results, query) {
        if (!results.length) {
          searchResults.innerHTML = '<p class="search-no-results">No results for <strong>' + escapeHtml(query) + '</strong></p>';
          return;
        }
        var html = '';
        results.slice(0, 12).forEach(function(r) {
          var item = r.item;
          var tags = (item.tags || []).slice(0, 4).map(function(t) {
            return '<span class="search-tag">' + escapeHtml(t) + '</span>';
          }).join('');
          html += '<a class="search-result-item" href="' + escapeHtml(item.url) + '" role="option" aria-selected="false" data-testid="search-result">' +
            '<div class="search-result-title">' + escapeHtml(item.title) + '</div>' +
            '<div class="search-result-meta">' +
              '<span class="search-result-date">' + escapeHtml(item.date) + '</span>' +
              (tags ? '<span class="search-result-tags">' + tags + '</span>' : '') +
            '</div>' +
            (item.summary ? '<div class="search-result-summary">' + escapeHtml(item.summary.slice(0, 120)) + '…</div>' : '') +
          '</a>';
        });
        searchResults.innerHTML = html;
        activeIdx = -1;
      }

      function runSearch(q) {
        q = q.trim();
        if (!q) {
          searchResults.innerHTML = searchIdleHTML;
          activeIdx = -1;
          return;
        }
        if (!fuseInstance) {
          searchResults.innerHTML = '<p class="search-hint">Loading…</p>';
          loadFuse(function() { runSearch(q); });
          return;
        }
        renderResults(fuseInstance.search(q), q);
      }

      function loadFuse(cb) {
        if (fuseInstance) { cb(); return; }
        if (searchLoading) { return; }
        searchLoading = true;
        function fuseLoaded() {
          if (typeof Fuse === 'undefined') { searchLoading = false; return; }
          fetch(indexUrl)
            .then(function(r) { return r.json(); })
            .then(function(data) {
              fuseInstance = new Fuse(data, {
                keys: [
                  { name: 'title',      weight: 0.5  },
                  { name: 'tags',       weight: 0.25 },
                  { name: 'categories', weight: 0.15 },
                  { name: 'summary',    weight: 0.05 },
                  { name: 'date',       weight: 0.025 },
                  { name: 'imageAlts',  weight: 0.025 }
                ],
                threshold: 0.35,
                ignoreLocation: true,
                includeMatches: true,
                minMatchCharLength: 2
              });
              searchLoading = false;
              cb();
            })
            .catch(function() { searchLoading = false; });
        }
        loadScriptWithFallback(S.fuseJSLocal, S.fuseJSCDN, fuseLoaded, S.fuseJSCDNIntegrity || undefined);
      }

      // open/close wiring
      if (searchToggle) {
        searchToggle.addEventListener('click', openSearch);
      }
      if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
      }
      if (searchBackdrop) {
        searchBackdrop.addEventListener('click', closeSearch);
      }

      // Ctrl+K / Cmd+K global shortcut
      document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          if (searchModal.hasAttribute('hidden')) { openSearch(); } else { closeSearch(); }
        }
        if (!searchModal.hasAttribute('hidden')) {
          if (e.key === 'Escape') { closeSearch(); }
          if (e.key === 'Tab') {
            // Keep focus inside the modal
            var focusables = searchModal.querySelectorAll('input, button, a[href]');
            if (focusables.length) {
              var first = focusables[0];
              var last = focusables[focusables.length - 1];
              if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
              else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
          }
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIdx + 1); }
          if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(activeIdx - 1); }
          if (e.key === 'Enter') {
            var items = searchResults.querySelectorAll('.search-result-item');
            var pick = activeIdx >= 0 ? items[activeIdx] : items[0];
            if (pick) {
              window.location.href = pick.getAttribute('href');
            }
          }
        }
      });

      // debounced input
      searchInput.addEventListener('input', function() {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(function() { runSearch(searchInput.value); }, 150);
      });

      // click result → close modal
      searchResults.addEventListener('click', function(e) {
        if (closest(e.target, '.search-result-item')) closeSearch();
      });

      // prefetch index on first hover of the search toggle (optional UX)
      if (searchToggle) {
        searchToggle.addEventListener('mouseenter', function() { loadFuse(function() {}); }, { once: true });
      }
    }
  });
})();
