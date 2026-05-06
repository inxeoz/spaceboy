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
    var isList = document.body.classList.contains('list-layout');
    if (gridIcon && listIcon) {
      gridIcon.style.display = isList ? 'none' : 'inline';
      listIcon.style.display = isList ? 'inline' : 'none';
    }
  }

  function decodeHtml(html) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  function renderMermaid() {
    if (typeof mermaid === 'undefined') return;
    var diagrams = document.querySelectorAll('.mermaid');
    if (!diagrams.length) return;

    for (var i = 0; i < diagrams.length; i++) {
      var el = diagrams[i];
      var raw = el.getAttribute('data-raw');
      if (!raw) {
        raw = (el.textContent || '').trim();
        el.setAttribute('data-raw', raw);
      }
      el.removeAttribute('data-processed');
      el.innerHTML = raw;
    }

    var isDark = root.getAttribute('data-theme') === 'dark';
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      themeVariables: isDark ? {
        background: '#46494c',
        mainBkg: '#4c5c68'
      } : {}
    });
    if (typeof mermaid.run === 'function') {
      mermaid.run({ querySelector: '.mermaid' }).catch(function(err) { console.error('Mermaid render failed:', err); });
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

  window.toggleTheme = function() {
    var isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    safeSet(themeKey, isDark ? 'light' : 'dark');
    updateThemeIcons();
    renderMermaid();
    renderKaTeX();
  };

  window.toggleLayout = function() {
    var isList = document.body.classList.contains('list-layout');
    document.body.classList.toggle('list-layout', !isList);
    safeSet('layout', !isList ? 'list' : 'card');
    updateLayoutIcons();
  };

  var savedLayout = safeGet('layout');
  if (savedLayout === 'list') {
    document.body.classList.add('list-layout');
  }
  updateLayoutIcons();

  var savedTheme = safeGet(themeKey);
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
  }
  updateThemeIcons();

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
        renderMermaid
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
            renderKaTeX
          );
        }
      );
    }

    initDualTableOfContents();

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

  function initDualTableOfContents() {
    var mainTocNav = document.getElementById('toc-nav');
    var subTocNav = document.getElementById('toc-sub-nav');

    if (!mainTocNav && !subTocNav) return;

    function getHeadings() {
      var headings = [];
      var article = document.getElementById('article');
      if (!article) return headings;

      var h2s = article.querySelectorAll('h2, h3, h4, h5, h6');
      for (var i = 0; i < h2s.length; i++) {
        var heading = h2s[i];
        if (heading.id) {
          headings.push({
            id: heading.id,
            element: heading,
            level: parseInt(heading.tagName[1]),
            text: heading.textContent
          });
        }
      }
      return headings;
    }

    function getMainHeadings() {
      var headings = getHeadings();
      return headings.filter(function(h) { return h.level === 2; });
    }

    function updateMainTOC() {
      if (!mainTocNav) return;
      var links = mainTocNav.querySelectorAll('a');
      if (!links.length) return;

      var scrollPosition = window.scrollY + 150;
      var currentHeading = null;
      var headings = getHeadings();

      for (var i = 0; i < headings.length; i++) {
        var heading = headings[i];
        if (heading.element.offsetTop <= scrollPosition) {
          currentHeading = heading;
        } else {
          break;
        }
      }

      links.forEach(function(link) {
        link.classList.remove('active');
      });

      if (currentHeading) {
        for (var j = 0; j < links.length; j++) {
          if (links[j].getAttribute('href') === '#' + currentHeading.id) {
            links[j].classList.add('active');
            break;
          }
        }
      }
    }

    function updateSubTOC() {
      if (!subTocNav) return;

      var scrollPosition = window.scrollY + 150;
      var headings = getHeadings();
      var currentMainHeading = null;

      for (var i = 0; i < headings.length; i++) {
        var heading = headings[i];
        if (heading.level === 2 && heading.element.offsetTop <= scrollPosition) {
          currentMainHeading = heading;
        }
      }

      var subHeadings = [];
      if (currentMainHeading) {
        var mainIndex = headings.indexOf(currentMainHeading);
        for (var i = mainIndex + 1; i < headings.length; i++) {
          var heading = headings[i];
          if (heading.level === 2) break;
          if (heading.level === 3) {
            subHeadings.push(heading);
          }
        }
      }

      var header = document.getElementById('sub-toc-header');
      if (header && currentMainHeading) {
        header.textContent = currentMainHeading.text;
      }

      var html = '';
      if (subHeadings.length > 0) {
        html += '<ul>';
        for (var i = 0; i < subHeadings.length; i++) {
          var heading = subHeadings[i];
          html += '<li><a href="#' + heading.id + '">' + heading.text + '</a></li>';
        }
        html += '</ul>';
      } else {
        html = '<p style="color: var(--secondary-text); font-size: 0.85rem;">No sub-topics</p>';
      }

      subTocNav.innerHTML = html;

      var links = subTocNav.querySelectorAll('a');
      links.forEach(function(link) {
        link.addEventListener('click', function(e) {
          var href = this.getAttribute('href');
          if (href && href.startsWith('#')) {
            e.preventDefault();
            var target = document.getElementById(href.substring(1));
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              window.history.pushState(null, '', href);
            }
          }
        });
      });
    }

    if (mainTocNav) {
      var mainLinks = mainTocNav.querySelectorAll('a');
      mainLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
          var href = this.getAttribute('href');
          if (href && href.startsWith('#')) {
            e.preventDefault();
            var target = document.getElementById(href.substring(1));
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              window.history.pushState(null, '', href);
              updateMainTOC();
            }
          }
        });
      });
    }

    var scrollTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        updateMainTOC();
        updateSubTOC();
      }, 50);
    }, false);

    updateMainTOC();
    updateSubTOC();
  }
})();
