(function() {
  if (!document.querySelector || !document.addEventListener) return;

  function initDualTableOfContents() {
    var mainTocNav = document.getElementById('toc-nav');
    var subTocNav = document.getElementById('toc-sub-nav');
    if (!mainTocNav && !subTocNav) return;

    var article = document.getElementById('article');
    if (!article) return;

    // ── Collect headings ──
    var headings = [];
    article.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function(el) {
      if (el.id) {
        headings.push({
          id: el.id,
          el: el,
          level: parseInt(el.tagName[1]),
          text: el.textContent
        });
      }
    });
    if (!headings.length) return;

    // ── Determine content depth ──
    var hasH3 = headings.some(function(h) { return h.level >= 3; });
    var hasH2 = headings.some(function(h) { return h.level === 2; });

    // ── Inject dot spans into Hugo-generated left TOC links ──
    if (mainTocNav) {
      mainTocNav.querySelectorAll('a').forEach(function(a) {
        if (!a.querySelector('.dot')) {
          var dot = document.createElement('span');
          dot.className = 'dot';
          a.insertBefore(dot, a.firstChild);
        }
      });
    }

    // ── Scroll TOC container so the active link stays visible ──
    function scrollTocToActive(container, link) {
      var cRect = container.getBoundingClientRect();
      var lRect = link.getBoundingClientRect();
      if (lRect.top < cRect.top + 8) {
        container.scrollTop -= (cRect.top - lRect.top) + 8;
      } else if (lRect.bottom > cRect.bottom - 8) {
        container.scrollTop += (lRect.bottom - cRect.bottom) + 8;
      }
    }

    // ── Active index ──
    // Returns the index of the last heading that has scrolled past the 90px
    // threshold. Falls back to 0 (first heading) so there is always something
    // highlighted — including when the page is at the very top.
    function getActiveIndex() {
      for (var i = headings.length - 1; i >= 0; i--) {
        if (headings[i].el.getBoundingClientRect().top <= 90) return i;
      }
      return 0;
    }

    // ── Walk backwards from idx to find the nearest heading that has a
    //    link in tocNav. This handles the case where the active heading is
    //    an h3/h4 that only appears in the right TOC — we highlight its
    //    nearest ancestor h1/h2 in the left TOC instead. ──
    function findTocLink(tocNav, startIdx) {
      for (var i = startIdx; i >= 0; i--) {
        var link = tocNav.querySelector('a[href="#' + headings[i].id + '"]');
        if (link) return link;
      }
      return null;
    }

    // ── Update main (left) TOC ──
    function updateMain(activeIdx) {
      if (!mainTocNav) return;
      mainTocNav.querySelectorAll('a').forEach(function(a) { a.classList.remove('active'); });
      var link = findTocLink(mainTocNav, activeIdx);
      if (link) {
        link.classList.add('active');
        scrollTocToActive(mainTocNav, link);
      }
    }

    // ── Update sub (right) TOC ──
    function updateSub(activeIdx) {
      if (!subTocNav) return;

      var header = document.getElementById('sub-toc-header-text');
      if (!header) {
        var h = subTocNav.closest('.toc-card').querySelector('.toc-header');
        header = document.createElement('span');
        header.id = 'sub-toc-header-text';
        h.textContent = '';
        h.appendChild(header);
      }

      var subs = [];

      if (hasH3) {
        var currentH2 = null;
        for (var i = activeIdx; i >= 0; i--) {
          if (headings[i].level === 2) { currentH2 = headings[i]; break; }
        }
        header.textContent = currentH2 ? currentH2.text : 'In this section';

        if (currentH2) {
          var start = headings.indexOf(currentH2);
          for (var i = start + 1; i < headings.length; i++) {
            if (headings[i].level === 2) break;
            if (headings[i].level >= 3) subs.push(headings[i]);
          }
        }
      } else {
        header.textContent = 'Sections';
        if (hasH2) {
          headings.forEach(function(h) {
            if (h.level === 2) subs.push(h);
          });
        }
      }

      if (subs.length === 0) {
        subTocNav.innerHTML = '<p class="sub-toc-empty">No sub headings</p>';
        return;
      }

      var html = '<ul>';
      subs.forEach(function(h) {
        var displayLevel = h.level > 4 ? 4 : h.level;
        html += '<li><a href="#' + h.id + '" data-level="' + displayLevel + '"><span class="dot"></span>' + h.text + '</a></li>';
      });
      html += '</ul>';
      subTocNav.innerHTML = html;

      subTocNav.querySelectorAll('a').forEach(function(a) { a.classList.remove('active'); });
      subTocNav.querySelectorAll('a').forEach(function(a) {
        if (a.getAttribute('href') === '#' + headings[activeIdx].id) {
          a.classList.add('active');
          scrollTocToActive(subTocNav, a);
        }
      });
    }

    function updateBoth() {
      var idx = getActiveIndex();
      updateMain(idx);
      updateSub(idx);
    }

    // ── Smooth scroll on click ──
    function setupSmoothScroll(container) {
      if (!container) return;
      container.addEventListener('click', function(e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) return;
        e.preventDefault();
        var id = link.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;

        // Force the active class immediately so there is no flash of
        // un-highlighted state while the smooth scroll animates.
        if (container === mainTocNav) {
          mainTocNav.querySelectorAll('a').forEach(function(a) { a.classList.remove('active'); });
          link.classList.add('active');
        } else if (container === subTocNav) {
          subTocNav.querySelectorAll('a').forEach(function(a) { a.classList.remove('active'); });
          link.classList.add('active');
          // Also update the left TOC to reflect the parent section
          var idx = headings.findIndex(function(h) { return h.id === id; });
          if (idx >= 0) updateMain(idx);
        }

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', '#' + id);
      });
    }
    setupSmoothScroll(mainTocNav);
    setupSmoothScroll(subTocNav);

    // ── IntersectionObserver ──
    if (window.IntersectionObserver) {
      var obs = new IntersectionObserver(function() { updateBoth(); }, { rootMargin: '-90px 0px -75% 0px' });
      headings.forEach(function(h) { obs.observe(h.el); });
    } else {
      var ticking = false;
      window.addEventListener('scroll', function() {
        if (!ticking) {
          window.requestAnimationFrame(function() { updateBoth(); ticking = false; });
          ticking = true;
        }
      }, { passive: true });
    }

    // ── Mobile toggle ──
    var toggleBtn = document.getElementById('toc-mobile-toggle');
    var mobileContent = document.getElementById('toc-mobile-content');
    if (toggleBtn && mobileContent) {
      toggleBtn.addEventListener('click', function() {
        var expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', String(!expanded));
        mobileContent.hidden = expanded;
      });
      mobileContent.addEventListener('click', function(e) {
        if (e.target.closest('a')) {
          mobileContent.hidden = true;
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // ── Init ──
    updateBoth();
  }

  window.initDualTableOfContents = initDualTableOfContents;
})();
