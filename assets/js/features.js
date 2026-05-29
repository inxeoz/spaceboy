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

  if (S.enableCopyCode && !S.legacyMode) {
    document.addEventListener('click', function(e) {
      var btn = closest(e.target, '.copy-code-btn');
      if (!btn) return;

      var block = closest(btn, '.code-block-wrapper');
      var text = '';

      if (block) {
        var code = block.querySelector('code, pre');
        if (code) {
          text = code.textContent || '';
          if (!text && code.classList.contains('mermaid')) {
            text = code.getAttribute('data-raw') || '';
          }
        } else {
          var mermaid = block.querySelector('.mermaid');
          if (mermaid) text = mermaid.getAttribute('data-raw') || mermaid.textContent || '';
        }
      }

      if (!text) return;

      var origHTML = btn.innerHTML;
      function showCopied() {
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
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
    if (typeof LazyLoad !== 'undefined') {
      new LazyLoad({ container: document.getElementById('article') });
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
  });
})();
