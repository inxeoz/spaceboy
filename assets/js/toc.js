(function() {
  function initTableOfContents() {
    var mainTocNav = document.getElementById('toc-nav');
    var subTocNav = document.getElementById('toc-sub-nav');

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
          text: el.textContent.trim()
        });
      }
    });
    if (!headings.length) return;

    // ── Determine content depth ──
    var hasH3 = headings.some(function(h) { return h.level >= 3; });
    var hasH2 = headings.some(function(h) { return h.level === 2; });

    // ── Active index ──
    function getActiveIndex() {
      for (var i = headings.length - 1; i >= 0; i--) {
        if (headings[i].el.getBoundingClientRect().top <= 90) return i;
      }
      return 0;
    }

    // ── Walk backwards from idx to find the nearest heading that has a link in tocNav ──
    function findTocLink(tocNav, startIdx) {
      for (var i = startIdx; i >= 0; i--) {
        var link = tocNav.querySelector('a[href="#' + headings[i].id + '"]');
        if (link) return link;
      }
      return null;
    }

    function setActive(link) {
      if (!link) return;
      link.classList.add('active');
      link.setAttribute('aria-current', 'location');
    }

    function clearActive(container) {
      if (!container) return;
      container.querySelectorAll('a.active').forEach(function(a) {
        a.classList.remove('active');
        a.removeAttribute('aria-current');
      });
    }

    // ── Update main (left) TOC ──
    function updateMain(activeIdx) {
      if (!mainTocNav) return;
      clearActive(mainTocNav);
      var link = findTocLink(mainTocNav, activeIdx);
      if (link) {
        setActive(link);
        scrollTocToActive(mainTocNav, link);
      }
    }

    function scrollTocToActive(container, link) {
      var cRect = container.getBoundingClientRect();
      var lRect = link.getBoundingClientRect();
      if (lRect.top < cRect.top + 8) {
        container.scrollTop -= (cRect.top - lRect.top) + 8;
      } else if (lRect.bottom > cRect.bottom - 8) {
        container.scrollTop += (lRect.bottom - cRect.bottom) + 8;
      }
    }

    // ── Build sub items from headings ──
    var lastSubParentId = null;
    var subItemElements = [];

    function buildSubItems(activeIdx) {
      var subs = [];
      var currentH2 = null;
      var currentH2Id = null;

      if (hasH3) {
        for (var i = activeIdx; i >= 0; i--) {
          if (headings[i].level === 2) { currentH2 = headings[i]; currentH2Id = i; break; }
        }
        // Fallback to first h2 when scrolled above all h2s
        if (!currentH2 && hasH2) {
          for (var i = 0; i < headings.length; i++) {
            if (headings[i].level === 2) { currentH2 = headings[i]; currentH2Id = i; break; }
          }
        }
      }

      if (currentH2Id !== lastSubParentId) {
        lastSubParentId = currentH2Id;

        var header = document.getElementById('sub-toc-header');
        if (!header) {
          var h = subTocNav.closest('.toc-card').querySelector('.toc-header');
          header = document.createElement('span');
          header.id = 'sub-toc-header';
          h.textContent = '';
          h.appendChild(header);
        }

        if (hasH3) {
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
          subItemElements = [];
          return;
        }

        var html = '<ul>';
        subs.forEach(function(h) {
          var displayLevel = h.level > 5 ? 5 : h.level;
          html += '<li><a href="#' + h.id + '" data-level="' + displayLevel + '">' + h.text + '</a></li>';
        });
        html += '</ul>';
        subTocNav.innerHTML = html;
        subItemElements = Array.from(subTocNav.querySelectorAll('a'));
      }
    }

    // ── Update sub (right) TOC ──
    function updateSub(activeIdx) {
      if (!subTocNav) return;

      buildSubItems(activeIdx);
      var items = subItemElements;
      if (!items.length) return;

      // Range-based active: all items from first to current active
      var foundActive = false;
      for (var i = 0; i < items.length; i++) {
        var link = items[i];
        if (!foundActive) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'location');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
        if (link.getAttribute('href') === '#' + headings[activeIdx].id) {
          foundActive = true;
        }
      }

      // Scroll active into view
      var activeLink = subTocNav.querySelector('a.active');
      if (activeLink) scrollTocToActive(subTocNav, activeLink);
    }

    function updateBoth() {
      var idx = getActiveIndex();
      updateMain(idx);
      updateSub(idx);
    }

    // ── Force active state for a specific index ──
    function activateIndex(idx) {
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
        var rawId = link.getAttribute('href').slice(1);
        var target = document.getElementById(rawId);
        if (!target) return;

        var idx = headings.findIndex(function(h) { return h.id === rawId; });
        if (idx >= 0) activateIndex(idx);

        if (window.__sbScrollToHeading) {
          window.__sbScrollToHeading(target);
        } else {
          target.scrollIntoView({ block: 'center' });
        }

        if (window.history && window.history.pushState) {
          history.pushState(null, '', '#' + rawId);
        }
      });
    }
    setupSmoothScroll(mainTocNav);
    setupSmoothScroll(subTocNav);

    // ── IntersectionObserver ──
    if (window.IntersectionObserver) {
      var tocObs = new IntersectionObserver(function() { updateBoth(); }, { rootMargin: '-90px 0px -75% 0px' });
      headings.forEach(function(h) { tocObs.observe(h.el); });
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
      var mobileNav = mobileContent.querySelector('.toc-nav');
      if (mobileNav) setupSmoothScroll(mobileNav);
    }

    // ── Init ──
    updateBoth();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTableOfContents);
  } else {
    initTableOfContents();
  }
})();
