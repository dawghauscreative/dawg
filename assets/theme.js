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
    box.addEventListener('mouseleave', function () { set(box.dataset.pinned || (box.classList.contains('is-single') ? (box.dataset.scrollStep || '0') : null)); });
    // Scroll-driven steps (Full scroll animations, see "Scroll motion" below). A layer the visitor tapped wins.
    box.addEventListener('scrollstep', function (e) { box.dataset.scrollStep = e.detail === null ? '' : String(e.detail); if (!box.dataset.pinned) set(e.detail === null ? null : String(e.detail)); });
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

/* Supr "Bundle & Save" as a dropdown (client review Nov 7). The tier list collapses to a select plus the chosen option's card.
   Choosing an option clicks Supr's own radio, so Supr stays in charge of prices, plans and the cart. */
(function () {
  function txt(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  // Consistent option names across products (Supr titles as set in its dashboard -> what shoppers see). Exact matches only,
  // so once the titles are corrected in Supr these simply stop matching. The order property (_bundle_block_name) is untouched.
  var TITLES = {
    'Twice a day (2 bottles)': 'Enhanced: twice a day (2 bottles)',
    'Enhanced Support': 'Enhanced: UV Shield+ twice a day',
    '3-Month Supply (3 sets)': '3-Month Supply (One-Time)',
    '3-Month Subscription (3 sets)': '3-Month Subscription'
  };
  function tidy(block) {
    block.querySelectorAll('.sss-bundle-block__tier-title').forEach(function (el) {
      var t = txt(el);
      if (TITLES[t] && el.textContent !== TITLES[t]) el.textContent = TITLES[t];
    });
    // Whole-number savings, rounded down so a saving is never overstated ("Save 10.61%" -> "Save 10%")
    block.querySelectorAll('[data-tier-savings]').forEach(function (el) {
      var t = el.textContent;
      var n = t.replace(/(\d+)\.\d+\s*%/g, '$1%');
      if (n !== t) el.textContent = n;
    });
  }
  function enhance(block) {
    if (block.getAttribute('data-amd-select')) return;
    var list = block.querySelector('.sss-bundle-block__tiers');
    if (!list) return;
    var tiers = Array.prototype.filter.call(list.children, function (c) { return c.classList.contains('sss-bundle-block__tier'); });
    if (tiers.length < 2) return;
    block.setAttribute('data-amd-select', '1');
    var id = 'amd-tier-' + Math.random().toString(36).slice(2, 8);
    var wrap = document.createElement('div');
    wrap.className = 'amd-tier-select';
    wrap.innerHTML = '<label class="visually-hidden" for="' + id + '">Choose your option</label><div class="amd-tier-select__field"><select class="amd-tier-select__control" id="' + id + '"></select></div>';
    list.parentNode.insertBefore(wrap, list);
    var sel = wrap.querySelector('select');
    block.classList.add('amd-tiers-select');
    function radioOf(t) { return t.querySelector('input.sss-bundle-block__radio'); }
    function sync() {
      tidy(block);
      tiers = Array.prototype.filter.call(list.children, function (c) { return c.classList.contains('sss-bundle-block__tier'); });
      var html = '';
      var current = 0;
      tiers.forEach(function (t, i) {
        var title = txt(t.querySelector('.sss-bundle-block__tier-title'));
        var price = txt(t.querySelector('[data-tier-total]'));
        var save = txt(t.querySelector('[data-tier-savings]'));
        var r = radioOf(t);
        if ((r && r.checked) || t.classList.contains('sss-bundle-block__tier--selected')) current = i;
        var off = t.classList.contains('sss-bundle-block__tier--sold-out') ? ' disabled' : '';
        html += '<option value="' + i + '"' + off + '>' + esc(title + (price ? ' — ' + price : '') + (save ? ' (' + save + ')' : '')) + '</option>';
      });
      if (sel.innerHTML !== html) sel.innerHTML = html;
      if (sel.selectedIndex !== current) sel.selectedIndex = current;
      tiers.forEach(function (t, i) { if (t.classList.contains('amd-tier-current') !== (i === current)) t.classList.toggle('amd-tier-current', i === current); });
    }
    sel.addEventListener('change', function () {
      var t = tiers[sel.selectedIndex];
      var r = t && radioOf(t);
      if (r && !r.checked) r.click(); else if (t) t.click();
      setTimeout(sync, 0);
    });
    list.addEventListener('change', function () { setTimeout(sync, 0); });
    if ('MutationObserver' in window) {
      var queued = false;
      new MutationObserver(function () {
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () { queued = false; sync(); });
      }).observe(list, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'checked'] });
    }
    sync();
  }
  function scan() { document.querySelectorAll('.buy-box .sss-bundle-block').forEach(enhance); }
  scan();
  // Supr can render after load (variant changes, late scripts): rescan for a short while
  if ('MutationObserver' in window) {
    var timer = null;
    var mo = new MutationObserver(function () { clearTimeout(timer); timer = setTimeout(scan, 120); });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); }, 20000);
  }
})();

/* Scroll motion. Theme setting "Scroll animations" (Theme settings > Animations), written to <html data-motion>.
   off:    nothing here runs; the site keeps only the original fade-ins.
   subtle: on every page, photos drift slightly slower than the page and images settle in as their card appears.
   full:   subtle, plus on the home page: Protect / Balance / Restore light up in turn and the layers graphic steps
           through as you scroll (held on screen while they fit, on desktop), and the bundle finder cards slide in.
   Nothing runs with reduced motion, in the theme editor, or without IntersectionObserver, and without this script
   everything simply shows. Product renders never get the drift, so jars are never cropped. */
(function () {
  var root = document.documentElement;
  var mode = root.getAttribute('data-motion') || 'full';
  if (mode === 'off') return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || (window.Shopify && window.Shopify.designMode) || !('IntersectionObserver' in window)) return;
  var full = mode === 'full' && document.body.classList.contains('template-index');
  var vh = window.innerHeight, lastW = window.innerWidth;
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  // Photos drift (parallax), only while on screen.
  var PRODUCT = /product-|system-|individual-three|systems-hero|_Studio|Bundle_|_EDU_|AMD_/i;
  var photos = [];
  document.querySelectorAll('main .lifestyle-tile .media img, main .edu-card .media img, main .feature-split__media:not(.feature-split__media--panel) .media img, main .founder-split__media .media img, main .sci-spotcard .media img').forEach(function (img) {
    if (PRODUCT.test((img.getAttribute('src') || '') + ' ' + (img.getAttribute('srcset') || ''))) return;
    var box = img.closest('.media');
    if (!box) return;
    img.classList.add('is-parallax');
    photos.push({ img: img, box: box, on: false });
  });
  if (photos.length) {
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { photos.forEach(function (ph) { if (ph.box === en.target) ph.on = en.isIntersecting; }); });
      schedule();
    }, { rootMargin: '15% 0px' });
    photos.forEach(function (ph) { pio.observe(ph.box); });
  }
  function drift() {
    photos.forEach(function (ph) {
      if (!ph.on) return;
      var r = ph.box.getBoundingClientRect();
      var c = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      c = c < -1 ? -1 : c > 1 ? 1 : c;
      ph.img.style.translate = '0 ' + (-c * r.height * 0.045).toFixed(1) + 'px';
    });
  }

  // Step-through sections (home page, Full): "lit" = items light up in turn and stay lit; "exclusive" = one at a time
  // (the layers graphic, via its 'scrollstep' event).
  var steppers = [];
  if (full) document.querySelectorAll('main [data-scroll-steps]').forEach(function (el) {
    // "single" (layers graphic, Nov 10): one description at a time, chosen by how far the section has scrolled; never held.
    var mode = el.getAttribute('data-scroll-steps');
    var single = mode === 'single';
    var exclusive = mode === 'exclusive' || single;
    var items = Array.prototype.slice.call(el.querySelectorAll(exclusive ? '.layers__list li' : '[data-step-item]'));
    if (items.length < 2) return;
    el.classList.add('is-stepping');
    if (single) el.classList.add('is-single');
    steppers.push({ el: el, items: items, exclusive: exclusive, single: single, spacer: null, pinned: false, last: undefined, h: 0 });
  });
  function headerH() { var h = document.querySelector('.site-header'); return h ? h.offsetHeight : 72; }
  function layout() {
    vh = window.innerHeight;
    var top = headerH() + 16;
    steppers.forEach(function (s) {
      if (s.spacer) { s.spacer.remove(); s.spacer = null; }
      s.el.classList.remove('is-pinned');
      s.el.style.top = '';
      s.h = s.el.offsetHeight;
      // Hold it on screen only on desktop and only when the whole element fits under the header.
      s.pinned = !s.single && window.innerWidth >= 990 && s.h + top + 24 <= vh;
      s.items.forEach(function (it, k) { it.style.setProperty('--k', s.pinned ? 0 : k); });
      s.last = undefined;
      if (!s.pinned) return;
      s.dist = Math.round(vh * 0.38 * s.items.length);
      var sp = document.createElement('div');
      sp.className = 'scroll-pin-spacer';
      sp.setAttribute('aria-hidden', 'true');
      sp.style.height = s.dist + 'px';
      // Hold it inside its own track (element + spacer only), so the hold ends before whatever follows it
      // (e.g. the layers callout) can scroll up underneath.
      if (!s.track) {
        s.track = document.createElement('div');
        s.track.className = 'scroll-pin-track';
        s.el.before(s.track);
        s.track.appendChild(s.el);
      }
      s.track.appendChild(sp);
      s.spacer = sp;
      s.delta = sp.offsetTop - s.el.offsetTop;
      s.top = top;
      s.el.style.top = top + 'px';
      s.el.classList.add('is-pinned');
    });
  }
  function steps() {
    steppers.forEach(function (s) {
      var n = s.items.length, idx;
      if (s.pinned) {
        var natTop = s.spacer.getBoundingClientRect().top - s.delta;
        var raw = (s.top - natTop) / s.dist;
        if (s.exclusive) idx = (raw < 0 || raw >= 0.9) ? null : Math.min(n - 1, Math.floor(raw / 0.9 * n));
        else if (raw < 0) idx = natTop < vh * 0.62 ? 0 : -1;
        else idx = raw >= 0.85 ? n : Math.min(n - 1, Math.floor(raw / 0.85 * n));
      } else if (s.single) {
        var sr = s.el.getBoundingClientRect();
        idx = Math.min(n - 1, Math.floor(clamp((vh * 0.85 - sr.top) / (sr.height + vh * 0.55)) * n));
      } else {
        var line = vh * (s.exclusive ? 0.55 : 0.72);
        idx = -1;
        s.items.forEach(function (it, k) { if (it.getBoundingClientRect().top < line) idx = k; });
        if (s.exclusive) { if (idx < 0 || s.el.getBoundingClientRect().bottom < vh * 0.3) idx = null; }
        else if (idx === n - 1) idx = n;
      }
      if (idx === s.last) return;
      s.last = idx;
      if (s.exclusive) { s.el.dispatchEvent(new CustomEvent('scrollstep', { detail: idx })); return; }
      s.items.forEach(function (it, k) { it.classList.toggle('is-lit', k <= idx); it.classList.toggle('is-current', k === idx); });
    });
  }

  // Bundle finder (home page, Full, desktop): the cards slide in from the right, the later ones from further out.
  var slides = [];
  if (full) document.querySelectorAll('main [data-scroll-slide]').forEach(function (row) {
    var cards = Array.prototype.slice.call(row.children);
    if (!cards.length) return;
    row.classList.add('is-sliding');
    var sec = row.closest('.section');
    if (sec) sec.classList.add('motion-clip');
    slides.push({ row: row, cards: cards });
  });
  function slide() {
    var wide = window.innerWidth >= 990;
    slides.forEach(function (s) {
      var r = s.row.getBoundingClientRect();
      var p = wide ? clamp((vh - r.top) / (vh * 0.6)) : 1;
      s.cards.forEach(function (c, i) {
        var q = clamp(p * 1.35 - i * 0.12);
        var x = (1 - (1 - Math.pow(1 - q, 3))) * (90 + i * 45);
        c.style.translate = x > 0.5 ? x.toFixed(1) + 'px 0' : '';
      });
    });
  }

  if (!photos.length && !steppers.length && !slides.length) return;
  root.classList.add('motion-on');
  var ticking = false;
  function frame() { ticking = false; drift(); steps(); slide(); }
  function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  layout();
  frame();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('load', function () {
    // Late fonts or images can change heights: re-measure if any step-through section changed size.
    if (steppers.some(function (s) { return s.el.offsetHeight !== s.h; })) layout();
    schedule();
  });
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      // Phone address bars change the height a little while scrolling; only re-measure for real resizes.
      if (window.innerWidth === lastW && Math.abs(window.innerHeight - vh) < 120) { vh = window.innerHeight; schedule(); return; }
      lastW = window.innerWidth;
      layout();
      schedule();
    }, 150);
  });
})();

/* Ingredient links: list items in page content that are just an ingredient name (bundle steps, "What's inside"
   comparisons, antioxidant / immune lists written in rich text) link to that ingredient on the Science page.
   Chips and tables rendered by sections link in Liquid (snippets/ingredient-anchor.liquid; keep both lists in step). */
(function () {
  var INGREDIENTS = [[/niacinamide/i, 'niacinamide'], [/polypodium/i, 'polypodium-leucotomos'], [/resveratrol/i, 'resveratrol'], [/egcg|green tea/i, 'egcg'], [/spirulina/i, 'spirulina'], [/akkermansia/i, 'akkermansia'], [/curcumin/i, 'curcumin'], [/astaxanthin/i, 'astaxanthin'], [/inulin/i, 'inulin'], [/bifidobacter/i, 'bifidobacterium'], [/lactobacillus|plantarum|rhamnosus/i, 'lactobacillus'], [/quercetin/i, 'quercetin'], [/vitamin c\b/i, 'vitamin-c'], [/vitamin d/i, 'vitamin-d3'], [/\bzinc\b/i, 'zinc']];
  document.querySelectorAll('main li').forEach(function (li) {
    if (li.querySelector('a, button, input, ul, ol') || li.closest('a, nav, form, [role="tablist"], .key-ingredients, .sci-chips')) return;
    var t = li.textContent.trim();
    if (!t || t.length > 48) return;
    for (var i = 0; i < INGREDIENTS.length; i++) {
      if (!INGREDIENTS[i][0].test(t)) continue;
      var a = document.createElement('a');
      a.className = 'ingredient-link';
      a.href = '/pages/science#' + INGREDIENTS[i][1];
      while (li.firstChild) a.appendChild(li.firstChild);
      li.appendChild(a);
      return;
    }
  });
})();


/* Quick view: hovering a bundle or product card (system-finder cards, product-selector cards) for a moment opens a
   panel beside it with photos, price, what's inside and a link to the product page (snippets/product-quickview).
   Phones and tablets: tapping the card photo opens the same panel as a bottom sheet. Hovering also prefetches the
   product page so the click feels instant. Nothing here touches the cart. */
(function () {
  var cards = document.querySelectorAll('[data-qv-card]');
  if (!cards.length || (window.Shopify && window.Shopify.designMode)) return;
  var hoverable = window.matchMedia('(hover: hover) and (pointer: fine)');
  var panel = document.createElement('div');
  panel.className = 'qv';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Quick view');
  panel.hidden = true;
  panel.innerHTML = '<button class="qv__close" type="button" aria-label="Close quick view">&times;</button><div class="qv__content"></div>';
  document.body.appendChild(panel);
  var content = panel.querySelector('.qv__content');
  var current = null, openTimer = null, closeTimer = null, prefetched = {};
  function prefetch(card) {
    var a = card.querySelector('a[href]');
    if (!a || prefetched[a.href]) return;
    prefetched[a.href] = true;
    var l = document.createElement('link'); l.rel = 'prefetch'; l.href = a.href; document.head.appendChild(l);
  }
  function place(card) {
    var sheet = !hoverable.matches || window.innerWidth < 990;
    panel.classList.toggle('qv--sheet', sheet);
    if (sheet) { panel.style.left = ''; panel.style.top = ''; return; }
    var r = card.getBoundingClientRect(), w = panel.offsetWidth, h = panel.offsetHeight, gap = 16;
    var left = r.right + gap + w <= window.innerWidth - gap ? r.right + gap : r.left - gap - w;
    if (left < gap) left = Math.max(gap, Math.min(window.innerWidth - w - gap, r.left));
    var top = Math.min(Math.max(gap, r.top), Math.max(gap, window.innerHeight - h - gap));
    panel.style.left = Math.round(left + window.scrollX) + 'px';
    panel.style.top = Math.round(top + window.scrollY) + 'px';
  }
  function open(card) {
    var t = card.querySelector('template[data-qv]');
    if (!t) return;
    if (current !== card) { content.innerHTML = ''; content.appendChild(t.content.cloneNode(true)); }
    current = card;
    panel.hidden = false;
    place(card);
    requestAnimationFrame(function () { panel.classList.add('is-open'); });
  }
  function close() {
    clearTimeout(openTimer);
    panel.classList.remove('is-open');
    panel.hidden = true;
    current = null;
  }
  cards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      if (!hoverable.matches) return;
      prefetch(card);
      clearTimeout(closeTimer);
      clearTimeout(openTimer);
      openTimer = setTimeout(function () { open(card); }, current ? 0 : 280);
    });
    card.addEventListener('mouseleave', function () {
      if (!hoverable.matches) return;
      clearTimeout(openTimer);
      closeTimer = setTimeout(close, 220);
    });
    var media = card.querySelector('.finder-card__media, .sel-card__media');
    if (media) media.addEventListener('click', function (e) {
      if (hoverable.matches && window.innerWidth >= 990) return;
      e.preventDefault();
      open(card);
    });
  });
  panel.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
  panel.addEventListener('mouseleave', function () { if (!panel.classList.contains('qv--sheet')) closeTimer = setTimeout(close, 220); });
  panel.querySelector('.qv__close').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });
  document.addEventListener('click', function (e) {
    if (panel.hidden || panel.contains(e.target)) return;
    if (current && current.contains(e.target) && e.target.closest('.finder-card__media, .sel-card__media')) return;
    close();
  });
  window.addEventListener('resize', function () { if (current) place(current); });
})();


/* Card flip (home Protect / Balance / Restore columns, sections/role-columns): hover flips the photo to its back
   (price, key ingredients, summary, Choose your plan). On touch screens the first tap on the photo flips it and a
   tap on the back's empty space flips it back; links on the back work as normal. */
(function () {
  var flips = document.querySelectorAll('[data-flip]');
  if (!flips.length) return;
  var hoverable = window.matchMedia('(hover: hover) and (pointer: fine)');
  flips.forEach(function (f) {
    f.addEventListener('click', function (e) {
      if (hoverable.matches) return;
      var link = e.target.closest('a');
      if (f.classList.contains('is-flipped')) {
        if (link && f.querySelector('.role-flip__back').contains(link)) return;
        e.preventDefault();
        f.classList.remove('is-flipped');
        return;
      }
      e.preventDefault();
      document.querySelectorAll('[data-flip].is-flipped').forEach(function (o) { o.classList.remove('is-flipped'); });
      f.classList.add('is-flipped');
    });
  });
})();


/* Colour bleeds: where a light section (white / beige) meets a green or black one, the top of the lower section fades
   in from the upper section's colour, so the change is a soft blend instead of a hard edge. Only between solid
   colour-scheme sections; photo heroes, videos and sections without a scheme are left alone. */
(function () {
  function lum(c) {
    var m = c && c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
    if (!m || (m[4] !== undefined && +m[4] < 0.9)) return null;
    return 0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3];
  }
  var prev = null;
  document.querySelectorAll('main > .shopify-section, main .shopify-section').forEach(function (wrap) {
    if (wrap.parentElement && wrap.parentElement.closest('.shopify-section')) return;
    var sec = wrap.firstElementChild;
    while (sec && (sec.tagName === 'SCRIPT' || sec.tagName === 'STYLE' || sec.tagName === 'LINK')) sec = sec.nextElementSibling;
    if (!sec || !sec.offsetHeight) return;
    var scheme = /(^|\s)scheme-/.test(sec.className) && !sec.querySelector(':scope > video, :scope > .home-slide__bg');
    var bg = scheme ? getComputedStyle(sec).backgroundColor : null;
    var L = scheme ? lum(bg) : null;
    if (prev && L !== null && prev.L !== null && Math.abs(prev.L - L) > 90) {
      sec.classList.add('has-bleed');
      sec.style.setProperty('--bleed-from', prev.bg);
    }
    prev = { L: L, bg: bg };
  });
})();
