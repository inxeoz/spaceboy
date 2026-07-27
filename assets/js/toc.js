(function() {
  function initCurvyTableOfContents() {
    var mainTocNav = document.getElementById('toc-nav');
    var subTocNav = document.getElementById('toc-sub-nav');

    var article = document.getElementById('article');
    if (!article) return;

    // ── SVG elements ──
    var bgPath = document.getElementById('bg-curvy-path');
    var activePath = document.getElementById('active-curvy-path');
    var svg = document.getElementById('toc-sub-svg');

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

    // ── Curvy SVG path helpers ──
    var LEVEL_X = { 3: 8, 4: 18, 5: 28 };

    function getItemCoords(items, item) {
      var level = parseInt(item.getAttribute('data-level')) || 3;
      var x = LEVEL_X[level] || 28;
      var y = item.offsetTop + item.offsetHeight / 2;
      return { x: x, y: y };
    }

    function generateSmoothDiagonalPath(items, itemArray) {
      if (itemArray.length === 0) return '';
      if (itemArray.length === 1) {
        var c = getItemCoords(items, itemArray[0]);
        return 'M ' + c.x + ',' + c.y + ' L ' + c.x + ',' + c.y;
      }

      var d = '';
      var first = getItemCoords(items, itemArray[0]);
      d += 'M ' + first.x + ',' + first.y + ' ';

      for (var i = 0; i < itemArray.length - 1; i++) {
        var curr = getItemCoords(items, itemArray[i]);
        var next = getItemCoords(items, itemArray[i + 1]);

        if (curr.x !== next.x) {
          var dy = next.y - curr.y;
          var startY = curr.y + dy * 0.2;
          var endY = curr.y + dy * 0.8;
          var midY = (startY + endY) / 2;

          d += 'L ' + curr.x + ',' + startY + ' ';
          d += 'C ' + curr.x + ',' + midY + ' ' + next.x + ',' + midY + ' ' + next.x + ',' + endY + ' ';
          d += 'L ' + next.x + ',' + next.y + ' ';
        } else {
          d += 'L ' + next.x + ',' + next.y + ' ';
        }
      }

      return d;
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

    // ── Update sub (right) curvy TOC ──
    function updateSubCurvy(activeIdx) {
      if (!subTocNav) return;

      buildSubItems(activeIdx);
      var items = subItemElements;
      if (!items.length) {
        if (svg) svg.style.height = '0';
        return;
      }

      // Set SVG height to match the nav content
      if (svg) svg.style.height = subTocNav.offsetHeight + 'px';

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

      // Update SVG paths
      if (svg && bgPath && activePath) {
        var fullPath = generateSmoothDiagonalPath(items, items);

        // Find active range
        var activeItems = items.filter(function(a) { return a.classList.contains('active'); });
        var activeRangePath = '';
        if (activeItems.length > 0) {
          var firstIdx = items.indexOf(activeItems[0]);
          var lastIdx = items.indexOf(activeItems[activeItems.length - 1]);
          var activeRange = items.slice(firstIdx, lastIdx + 1);
          activeRangePath = generateSmoothDiagonalPath(items, activeRange);
        }

        bgPath.setAttribute('d', fullPath);
        activePath.setAttribute('d', activeRangePath);
      }

      // Scroll active into view
      var activeLink = subTocNav.querySelector('a.active');
      if (activeLink) scrollTocToActive(subTocNav, activeLink);
    }

    function updateBoth() {
      var idx = getActiveIndex();
      updateMain(idx);
      updateSubCurvy(idx);
    }

    // ── Force active state for a specific index ──
    function activateIndex(idx) {
      updateMain(idx);
      updateSubCurvy(idx);
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

    // ── Resize handler for SVG ──
    window.addEventListener('resize', function() {
      if (subTocNav && svg) {
        svg.style.height = subTocNav.offsetHeight + 'px';
      }
    });

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
    document.addEventListener('DOMContentLoaded', initCurvyTableOfContents);
  } else {
    initCurvyTableOfContents();
  }
})();
