(function () {
  'use strict';

  // Mobile menu drawer
  var drawer = document.getElementById('MenuDrawer');
  document.querySelectorAll('[data-menu-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!drawer) return;
      drawer.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var close = drawer.querySelector('[data-menu-close]');
      if (close) close.focus();
    });
  });
  document.querySelectorAll('[data-menu-close]').forEach(function (btn) {
    btn.addEventListener('click', closeDrawer);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });
  function closeDrawer() {
    if (!drawer || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
    document.querySelectorAll('[data-menu-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  }

  // Close desktop dropdown when clicking elsewhere
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.nav details[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute('open');
    });
  });

  // PDP gallery thumbnails
  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var main = gallery.querySelector('[data-gallery-main]');
    gallery.querySelectorAll('[data-thumb]').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var src = thumb.getAttribute('data-src');
        var srcset = thumb.getAttribute('data-srcset');
        if (!main) return;
        main.src = src;
        if (srcset) { main.srcset = srcset; } else { main.removeAttribute('srcset'); }
        gallery.querySelectorAll('[data-thumb]').forEach(function (t) { t.setAttribute('aria-current', 'false'); });
        thumb.setAttribute('aria-current', 'true');
      });
    });
  });

  // Sticky CTA: scroll-to-buy-box only. Never submits the form, never adds to cart.
  var sticky = document.querySelector('[data-sticky-cta]');
  var target = document.getElementById('buy-box');
  if (sticky && target) {
    sticky.querySelector('[data-sticky-scroll]').addEventListener('click', function (e) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var focusable = target.querySelector('input, button, select, a');
      if (focusable) setTimeout(function () { focusable.focus({ preventScroll: true }); }, 500);
    });
    document.body.classList.add('has-sticky-cta');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          // Visible whenever the buy box is out of view (before it on mobile, or after scrolling past it)
          sticky.classList.toggle('is-visible', !en.isIntersecting);
          sticky.setAttribute('aria-hidden', en.isIntersecting ? 'true' : 'false');
          sticky.toggleAttribute('inert', en.isIntersecting);
        });
      }, { threshold: 0.05 });
      io.observe(target);
    } else {
      sticky.classList.add('is-visible');
    }
  }

  // Header: scrolled state + hide on scroll down / show on scroll up
  var header = document.querySelector('.site-header');
  if (header) {
    var lastY = window.scrollY, ticking = false;
    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 8);
      var drawerOpen = drawer && drawer.classList.contains('is-open');
      var navOpen = header.querySelector('.nav details[open]');
      if (!drawerOpen && !navOpen && y > 240 && y > lastY + 6) header.classList.add('is-hidden');
      else if (y < lastY - 6 || y <= 240) header.classList.remove('is-hidden');
      lastY = y; ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
    onScroll();
  }

  // Scroll reveal. Skipped for reduced motion, in the theme editor, and without IntersectionObserver.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var inEditor = window.Shopify && window.Shopify.designMode;
  if ('IntersectionObserver' in window && !reduce && !inEditor) {
    var targets = document.querySelectorAll('main .section > .container > *, main .section--tight > .container > *, main .cols > *, main .steps > *, main .faq > details, main .bundle-panel, main .founder-split__copy, main .founder-split__media, main .stagger > *');
    if (targets.length) {
      document.documentElement.classList.add('reveal-on');
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io2.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      targets.forEach(function (el) {
        // Stagger siblings (cards in a row, steps, etc.) about 110ms apart, capped so the last one never lags.
        var n = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
        el.classList.add('reveal'); el.style.transitionDelay = (Math.min(n, 5) * 110) + 'ms'; io2.observe(el);
      });
      setTimeout(function () { document.querySelectorAll('.reveal:not(.is-visible)').forEach(function (el) { el.classList.add('is-visible'); }); }, 4000);
    }
  }
})();

/* Research library: filter chips + search (no network, filters the rendered list) */
(function () {
  document.querySelectorAll('[data-library]').forEach(function (lib) {
    var chips = lib.querySelectorAll('[data-filter]');
    var entries = lib.querySelectorAll('.sci-entry');
    var search = lib.querySelector('[data-search]');
    var empty = lib.querySelector('[data-empty]');
    var active = 'all';
    var perPage = parseInt(lib.getAttribute('data-per-page'), 10) || 0;
    var pager = lib.querySelector('[data-pager]');
    var page = 0;
    var matches = [];
    function render() {
      var pages = perPage ? Math.ceil(matches.length / perPage) : 1;
      if (page > pages - 1) page = Math.max(pages - 1, 0);
      entries.forEach(function (el) { el.hidden = true; });
      matches.forEach(function (el, i) {
        el.hidden = perPage ? Math.floor(i / perPage) !== page : false;
      });
      if (empty) empty.hidden = matches.length !== 0;
      if (!pager) return;
      pager.innerHTML = '';
      if (!perPage || pages < 2) { pager.hidden = true; return; }
      pager.hidden = false;
      function btn(label, target, opts) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn btn--outline sci-lib__pagebtn' + (opts && opts.current ? ' is-active' : '');
        b.textContent = label;
        if (opts && opts.aria) b.setAttribute('aria-label', opts.aria);
        if (opts && opts.current) b.setAttribute('aria-current', 'page');
        if (opts && opts.disabled) b.disabled = true;
        b.addEventListener('click', function () {
          page = target;
          render();
          lib.querySelector('.sci-lib__controls').scrollIntoView({ block: 'start' });
        });
        pager.appendChild(b);
      }
      // Same style as "Research worth reading": Previous · 1 / N · Next (client review Nov 7)
      btn('Previous', page - 1, { disabled: page === 0 });
      var count = document.createElement('span');
      count.className = 'sci-spot__count';
      count.setAttribute('aria-live', 'polite');
      count.textContent = (page + 1) + ' / ' + pages;
      pager.appendChild(count);
      btn('Next', page + 1, { disabled: page === pages - 1 });
    }
    function apply() {
      var q = (search && search.value || '').toLowerCase().trim();
      matches = [];
      entries.forEach(function (el) {
        var cats = (el.getAttribute('data-cats') || '').split('|');
        var okCat = active === 'all' || cats.indexOf(active) !== -1;
        var okText = !q || (el.getAttribute('data-text') || '').indexOf(q) !== -1;
        if (okCat && okText) matches.push(el);
      });
      page = 0;
      render();
    }
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        active = chip.getAttribute('data-filter');
        chips.forEach(function (c) { var on = c === chip; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        apply();
      });
    });
    if (search) search.addEventListener('input', apply);
    apply();
  });
})();

/* Individual products selector: reveals the chosen formula's plan area. Without JS the Choose buttons link
   straight to the product page purchase box. Nothing here touches the cart or any selling plan. */
(function () {
  document.querySelectorAll('[data-selector]').forEach(function (root) {
    var cards = root.querySelectorAll('[data-sel-card]');
    var panels = root.querySelectorAll('[data-sel-panel]');
    var empty = root.querySelector('[data-sel-empty]');
    var plan = root.querySelector('[data-sel-plan]');
    function choose(handle) {
      cards.forEach(function (c) { c.classList.toggle('is-selected', c.getAttribute('data-sel-card') === handle); });
      panels.forEach(function (p) { p.hidden = p.getAttribute('data-sel-panel') !== handle; });
      if (empty) empty.hidden = true;
      if (plan) {
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        plan.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        plan.focus({ preventScroll: true });
      }
    }
    root.querySelectorAll('[data-sel-choose]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        if (!plan) return;
        e.preventDefault();
        choose(btn.getAttribute('data-sel-choose'));
      });
    });
  });
})();

/* Skin Edu ingredient search and formula filter (filters the rendered cards only) */
(function () {
  document.querySelectorAll('[data-edu-ingredients]').forEach(function (root) {
    var cards = root.querySelectorAll('[data-edu-ing]');
    var chips = root.querySelectorAll('[data-edu-filter]');
    var search = root.querySelector('[data-edu-search]');
    var empty = root.querySelector('[data-edu-empty]');
    var active = 'all';
    function apply() {
      var q = (search && search.value || '').toLowerCase().trim();
      var shown = 0;
      cards.forEach(function (el) {
        var okF = active === 'all' || (el.getAttribute('data-formulas') || '').indexOf(active) !== -1;
        var okT = !q || (el.getAttribute('data-text') || '').indexOf(q) !== -1;
        el.hidden = !(okF && okT);
        if (!el.hidden) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    }
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        active = chip.getAttribute('data-edu-filter');
        chips.forEach(function (c) { var on = c === chip; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        apply();
      });
    });
    if (search) search.addEventListener('input', apply);
  });
})();

/* Video slots: autoplay muted and looping while in view, with a button to turn sound on.
   Respects reduced motion (no autoplay, normal controls) and pauses when scrolled out of view. */
(function () {
  var frames = document.querySelectorAll('.video-frame');
  if (!frames.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  frames.forEach(function (frame) {
    var video = frame.querySelector('video[autoplay], video[loop]');
    var btn = frame.querySelector('[data-video-sound]');
    if (!video || !btn) return;
    var label = btn.querySelector('[data-video-sound-label]');
    if (reduce) {
      video.removeAttribute('autoplay');
      video.pause();
      video.controls = true;
      return;
    }
    btn.hidden = false;
    function sync() {
      var on = !video.muted;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
      btn.classList.toggle('is-on', on);
      if (label) label.textContent = on ? 'Sound off' : 'Sound on';
    }
    btn.addEventListener('click', function () {
      video.muted = !video.muted;
      if (!video.muted) { video.volume = 1; var p = video.play(); if (p && p.catch) p.catch(function () {}); }
      sync();
    });
    sync();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
          else video.pause();
        });
      }, { threshold: 0.25 }).observe(frame);
    }
  });
})();

/* Floating "Choose your plan" link and mobile back-to-top: their own block so they run on every page,
   not only pages that have a video. */
(function () {
  // "Choose your plan" link on every non-product page: appears after a short scroll, or straight away on short pages
  var planCta = document.querySelector('[data-plan-cta]');
  if (planCta) {
    document.body.classList.add('has-sticky-cta');
    var planTick = false;
    var planUpdate = function () {
      planTick = false;
      var room = document.documentElement.scrollHeight - window.innerHeight;
      var on = window.scrollY > 300 || room < 300;
      planCta.classList.toggle('is-visible', on);
      planCta.setAttribute('aria-hidden', on ? 'false' : 'true');
      planCta.toggleAttribute('inert', !on);
    };
    window.addEventListener('scroll', function () {
      if (!planTick) { planTick = true; requestAnimationFrame(planUpdate); }
    }, { passive: true });
    planUpdate();
  }

  // Mobile back-to-top button: appears after scrolling, CSS hides it on desktop
  var toTop = document.querySelector('[data-back-to-top]');
  if (toTop) {
    var toTopTick = false;
    var toTopUpdate = function () {
      toTopTick = false;
      toTop.hidden = window.scrollY < 600;
    };
    window.addEventListener('scroll', function () {
      if (!toTopTick) { toTopTick = true; requestAnimationFrame(toTopUpdate); }
    }, { passive: true });
    toTop.addEventListener('click', function () {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
    toTopUpdate();
  }
})();

/* Interactive Venn (Science page, Tria Prima): hovering or tapping a circle, an overlap or the centre shows that region's
   panel. The region comes from which circles contain the pointer; keyboard users focus the labels and dots. */
(function () {
  document.querySelectorAll('[data-venn]').forEach(function (venn) {
    var svg = venn.querySelector('[data-venn-svg]');
    if (!svg || !svg.createSVGPoint) return;
    var circles = {};
    var panels = {};
    var current = null;
    venn.querySelectorAll('[data-venn-circle]').forEach(function (c) { circles[c.getAttribute('data-venn-circle')] = c; });
    venn.querySelectorAll('[data-venn-panel]').forEach(function (p) { panels[p.getAttribute('data-venn-panel')] = p; });
    function show(key) {
      if (!key || !panels[key] || key === current) return;
      current = key;
      Object.keys(panels).forEach(function (k) { panels[k].classList.toggle('is-active', k === key); });
      Object.keys(circles).forEach(function (k) { circles[k].classList.toggle('is-on', key.indexOf(k) !== -1); });
      venn.classList.add('is-open');
    }
    function hide() {
      current = null;
      venn.classList.remove('is-open');
      Object.keys(circles).forEach(function (k) { circles[k].classList.remove('is-on'); });
    }
    function regionAt(evt) {
      var m = svg.getScreenCTM();
      if (!m) return null;
      var pt = svg.createSVGPoint();
      pt.x = evt.clientX; pt.y = evt.clientY;
      var p = pt.matrixTransform(m.inverse());
      var inside = [];
      var nearest = null;
      var nearestD = Infinity;
      ['a', 'b', 'c'].forEach(function (k) {
        var c = circles[k];
        if (!c) return;
        var dx = p.x - c.cx.baseVal.value;
        var dy = p.y - c.cy.baseVal.value;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d <= c.r.baseVal.value) inside.push(k);
        if (d < nearestD) { nearestD = d; nearest = k; }
      });
      if (!inside.length) return null;
      var key = inside.join('');
      if (!panels[key]) key = inside.length === 3 && panels.abc ? 'abc' : nearest;
      return key;
    }
    svg.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') show(regionAt(e)); });
    svg.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') show(regionAt(e)); });
    venn.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hide(); });
    var lastPointer = 'mouse';
    var beforeTap = null;
    venn.addEventListener('pointerdown', function (e) { lastPointer = e.pointerType; beforeTap = current; }, true);
    venn.querySelectorAll('[data-venn-focus]').forEach(function (el) {
      el.addEventListener('focus', function () { show(el.getAttribute('data-venn-focus')); });
      // Touch: the first tap on a product name opens its info; a second tap follows the link
      el.addEventListener('click', function (e) {
        var key = el.getAttribute('data-venn-focus');
        if (lastPointer !== 'mouse' && beforeTap !== key) { e.preventDefault(); beforeTap = key; show(key); }
      });
      el.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && el.tagName.toLowerCase() !== 'a') { e.preventDefault(); show(el.getAttribute('data-venn-focus')); }
      });
    });
    venn.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  });
})();

/* Interactive layers: hover, focus or tap a layer to highlight it and its explanation; slide in on scroll. */
(function () {
  document.querySelectorAll('[data-layers]').forEach(function (box) {
    var bars = box.querySelectorAll('.layers__bar');
    var items = box.querySelectorAll('.layers__list li');
    function set(i) {
      box.classList.toggle('has-active', i !== null);
      bars.forEach(function (b) { var on = b.getAttribute('data-layer') === i; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      items.forEach(function (li) { li.classList.toggle('is-active', li.getAttribute('data-layer') === i); });
    }
    bars.forEach(function (b) {
      var i = b.getAttribute('data-layer');
      b.addEventListener('mouseenter', function () { set(i); });
      b.addEventListener('focus', function () { set(i); });
      b.addEventListener('click', function () { if (box.dataset.pinned === i) { box.dataset.pinned = ''; set(null); } else { box.dataset.pinned = i; set(i); } });
    });
    items.forEach(function (li) { li.addEventListener('mouseenter', function () { set(li.getAttribute('data-layer')); }); });
    box.addEventListener('mouseleave', function () { set(box.dataset.pinned || null); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { box.classList.add('is-in'); io.disconnect(); } }); }, { threshold: 0.2 });
      io.observe(box);
    } else { box.classList.add('is-in'); }
  });
})();


/* Interactive flow steps: steps light up in turn on scroll; with details, the first step opens and the chain plays through once
   (unless reduced motion); hover, focus or tap shows a step's detail and stops the autoplay. */
(function () {
  document.querySelectorAll('[data-flow]').forEach(function (box) {
    var steps = Array.prototype.slice.call(box.querySelectorAll('.flow__step'));
    var details = box.querySelectorAll('.flow__detail');
    var hasDetail = details.length > 0;
    var timer = null;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function set(i) {
      box.classList.add('has-active');
      steps.forEach(function (s) { var on = s.getAttribute('data-step') === String(i); s.classList.toggle('is-active', on); if (hasDetail) s.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      details.forEach(function (d) { d.classList.toggle('is-active', d.getAttribute('data-step') === String(i)); });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    if (hasDetail) {
      steps.forEach(function (s) {
        var i = s.getAttribute('data-step');
        s.addEventListener('mouseenter', function () { stop(); set(i); });
        s.addEventListener('focus', function () { stop(); set(i); });
        s.addEventListener('click', function () { stop(); set(i); });
        s.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stop(); set(i); } });
      });
    }
    function start() {
      box.classList.add('is-in');
      if (!hasDetail) return;
      set(0);
      if (reduce) return;
      var i = 0;
      timer = setInterval(function () { i += 1; if (i >= steps.length) { stop(); return; } set(i); }, 2600);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { start(); io.disconnect(); } }); }, { threshold: 0.35 });
      io.observe(box);
    } else { start(); }
  });
})();

/* Tabs (bundle tabs on product pages): click or arrow keys switch panels. */
(function () {
  document.querySelectorAll('[data-tabs]').forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });
})();

/* Founder timeline: on scroll the milestones play through once and the line fills; hover, focus or tap shows a milestone. */
(function () {
  document.querySelectorAll('[data-timeline]').forEach(function (box) {
    var items = Array.prototype.slice.call(box.querySelectorAll('.tl__item'));
    var details = box.querySelectorAll('.tl__detail');
    var n = items.length;
    var timer = null;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function set(i) {
      i = Number(i);
      box.style.setProperty('--p', n > 1 ? i / (n - 1) : 1);
      items.forEach(function (it, k) { it.classList.toggle('is-active', k === i); it.classList.toggle('is-done', k < i); it.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      details.forEach(function (d) { d.classList.toggle('is-active', Number(d.getAttribute('data-step')) === i); });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    items.forEach(function (it) {
      var i = it.getAttribute('data-step');
      it.addEventListener('mouseenter', function () { stop(); set(i); });
      it.addEventListener('focus', function () { stop(); set(i); });
      it.addEventListener('click', function () { stop(); set(i); });
      it.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stop(); set(i); } });
    });
    function start() {
      set(0);
      if (reduce) return;
      var i = 0;
      timer = setInterval(function () { i += 1; if (i >= n) { stop(); return; } set(i); }, 2800);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { start(); io.disconnect(); } }); }, { threshold: 0.4 });
      io.observe(box);
    } else { start(); }
  });
})();
