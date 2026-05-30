(function() {
  var S = window.__SPACEBOY__;
  if (!S) return;

  if (!document.querySelector || !document.addEventListener) {
    return;
  }

  function loadScriptWithFallback(localSrc, cdnSrc, done) {
    if (!localSrc && !cdnSrc) {
      if (done) done();
      return;
    }

    function inject(src, onError) {
      var script = document.createElement('script');
      script.src = src;
      script.async = true;
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

  function matchesSelector(el, selector) {
    var fn = el.matches || el.msMatchesSelector || el.webkitMatchesSelector;
    return fn ? fn.call(el, selector) : false;
  }

  function closest(el, selector) {
    while (el && el.nodeType === 1) {
      if (matchesSelector(el, selector)) return el;
      el = el.parentElement;
    }
    return null;
  }

  window._closest_ = closest;
  window._matchesSelector_ = matchesSelector;

  function announce(msg) {
    var ann = document.getElementById('copy-announcement');
    if (!ann) return;
    ann.textContent = msg;
    setTimeout(function() { ann.textContent = ''; }, 2000);
  }

  if (S.enableCopyCode && !S.legacyMode) {
    document.addEventListener('click', function(e) {
      var btn = closest(e.target, '.copy-code-btn');
      if (!btn) return;

      var block = closest(btn, '.code-block-wrapper');
      var text = '';

      if (block) {
        var code = block.querySelector('code, pre');
        if (code) {
          if (code.classList.contains('mermaid')) {
            text = code.getAttribute('data-raw') || code.textContent || '';
          } else {
            text = code.textContent || '';
          }
        } else {
          var mermaidEl = block.querySelector('.mermaid');
          if (mermaidEl) text = mermaidEl.getAttribute('data-raw') || mermaidEl.textContent || '';
        }
      }

      if (!text) return;

      var origHTML = btn.innerHTML;
      function showCopied() {
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        announce('Copied!');
        setTimeout(function() {
          btn.innerHTML = origHTML;
        }, 2000);
      }

      function fallbackCopy(t) {
        var ta = document.createElement('textarea');
        ta.value = t;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try { if (document.execCommand('copy')) showCopied(); } catch (_err) {}
        document.body.removeChild(ta);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showCopied, function() { fallbackCopy(text); });
      } else {
        fallbackCopy(text);
      }
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
      updateProgress();
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (S.needsFancybox && !S.legacyMode) {
      loadScriptWithFallback(
        S.fancyboxJSLocal,
        S.fancyboxJSCDN,
        function() {
          if (window.Fancybox && typeof window.Fancybox.bind === 'function') {
            window.Fancybox.bind('[data-fancybox]', {
              Toolbar: { display: { left: [], middle: [], right: ['zoomIn', 'zoomOut', 'close'] } }
            });
          }
        }
      );
    }

    if (S.needsMermaid && !S.legacyMode) {
      loadScriptWithFallback(
        S.mermaidJSLocal,
        S.mermaidJSCDN,
        window.renderMermaid
      );
    }

    if (S.needsKaTeX && !S.legacyMode) {
      loadScriptWithFallback(
        S.katexJSLocal,
        S.katexJSCDN,
        function() {
          loadScriptWithFallback(
            S.katexAutoRenderJSLocal,
            S.katexAutoRenderJSCDN,
            window.renderKaTeX
          );
        }
      );
    }

    if (!S.legacyMode) {
      // Language tooltip that follows the cursor inside code blocks
      var langTooltip = document.createElement('div');
      langTooltip.className = 'code-lang-tooltip';
      document.body.appendChild(langTooltip);

      document.addEventListener('mousemove', function(e) {
        if (closest(e.target, '.copy-code-btn, .export-code-btn')) {
          langTooltip.classList.remove('visible');
          return;
        }
        var wrapper = closest(e.target, '.code-block-wrapper[data-lang]');
        if (wrapper) {
          var lang = wrapper.getAttribute('data-lang');
          if (lang) {
            langTooltip.textContent = lang;
            var x = e.clientX + 14;
            var y = e.clientY + 14;
            if (x + 80 > window.innerWidth) x = e.clientX - langTooltip.offsetWidth - 8;
            if (y + 24 > window.innerHeight) y = e.clientY - 24;
            langTooltip.style.left = x + 'px';
            langTooltip.style.top = y + 'px';
            langTooltip.classList.add('visible');
          }
        } else {
          langTooltip.classList.remove('visible');
        }
      });

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
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(window.location.origin + url).catch(function() {});
              }
              history.pushState(null, '', url);
              h.scrollIntoView({ behavior: 'smooth', block: 'start' });
              announce('Link copied!');
            });
            h.appendChild(anchor);
          })(headings[i]);
        }
      }

      // Share: copy-link button
      document.addEventListener('click', function(e) {
        var btn = closest(e.target, '.post-share-copy');
        if (!btn) return;
        var url = window.location.href;
        var origHTML = btn.innerHTML;
        function showShareCopied() {
          btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          announce('Link copied!');
          setTimeout(function() { btn.innerHTML = origHTML; }, 2000);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(showShareCopied, function() {});
        }
      });
    }

    // ── Search ────────────────────────────────────────────────────────────
    if (S.enableSearch && !S.legacyMode) {
      var searchModal   = document.getElementById('search-modal');
      var searchInput   = document.getElementById('search-input');
      var searchResults = document.getElementById('search-results');
      var searchToggle  = document.getElementById('search-toggle');
      var searchClose   = document.getElementById('search-close');
      var searchBackdrop = document.getElementById('search-backdrop');

      if (!searchModal || !searchInput) return;

      var fuseInstance  = null;
      var searchLoading = false;
      var searchDebounce = null;
      var activeIdx     = -1;

      var indexUrl = (S.staticPrefix || '') + '/index.json';

      function openSearch() {
        searchModal.removeAttribute('hidden');
        searchInput.focus();
        document.body.style.overflow = 'hidden';
      }

      function closeSearch() {
        searchModal.setAttribute('hidden', '');
        searchInput.value = '';
        searchResults.innerHTML = '<p class="search-hint">Type to search…</p>';
        activeIdx = -1;
        document.body.style.overflow = '';
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
          searchResults.innerHTML = '<p class="search-hint">Type to search…</p>';
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
        loadScriptWithFallback(S.fuseJSLocal, S.fuseJSCDN, function() {
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
        });
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
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIdx + 1); }
          if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(activeIdx - 1); }
          if (e.key === 'Enter') {
            var items = searchResults.querySelectorAll('.search-result-item');
            if (activeIdx >= 0 && items[activeIdx]) {
              window.location.href = items[activeIdx].getAttribute('href');
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
