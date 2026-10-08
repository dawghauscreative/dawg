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
        if (srcset) main.srcset = srcset;
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
})();
