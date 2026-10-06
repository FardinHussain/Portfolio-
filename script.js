document.documentElement.classList.add('js');
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* Mobile menu */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  function closeMenu() {
    if (!toggle || !nav) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open navigation');
    var icon = toggle.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-bars';
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      var icon = toggle.querySelector('i');
      if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
    nav.addEventListener('click', function(e){ if(e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && nav.classList.contains('open')){ closeMenu(); toggle.focus(); }});
    window.addEventListener('resize', function(){ if(window.innerWidth > 760) closeMenu(); });
  }

  /* Scroll reveal + stagger */
  var items = document.querySelectorAll('.reveal');
  items.forEach(function(el){
    var parent = el.parentNode;
    if (!parent) return;
    var siblings = Array.prototype.filter.call(parent.children, function(n){ return n.classList && n.classList.contains('reveal'); });
    el.style.transitionDelay = (Math.max(siblings.indexOf(el),0) % 4) * 110 + 'ms';
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('visible'); io.unobserve(entry.target); }
      });
    }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
    items.forEach(function(el){ io.observe(el); });
  } else items.forEach(function(el){ el.classList.add('visible'); });

  /* Active navigation */
  var links = document.querySelectorAll('.site-nav a[href^="#"]:not(.nav-cta)');
  var map = {};
  links.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting && map[entry.target.id]){
          links.forEach(function(a){ a.classList.remove('active'); });
          map[entry.target.id].classList.add('active');
        }
      });
    }, {rootMargin:'-45% 0px -50% 0px'});
    Object.keys(map).forEach(function(id){ var section=document.getElementById(id); if(section) so.observe(section); });
  }

  /* Scroll progress + header shadow + desktop hero parallax */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  var heroVisual = document.querySelector('.hero-visual');
  var ticking = false;
  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y/max,1) : 0) + ')';
    if(header) header.classList.toggle('scrolled', y > 8);
    if(heroVisual && !reduce && y < 900 && window.innerWidth > 900) heroVisual.style.transform = 'translateY(' + (y * -.018) + 'px)';
    else if(heroVisual && window.innerWidth <= 900) heroVisual.style.transform = '';
    ticking = false;
  }
  window.addEventListener('scroll',function(){ if(!ticking){ ticking=true; requestAnimationFrame(onScroll); } },{passive:true});
  onScroll();

  /* Certificate lightbox */
  var lb = document.createElement('div');
  lb.className='lightbox'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true'); lb.setAttribute('aria-label','Certificate preview');
  lb.innerHTML='<button type="button" aria-label="Close preview"><i class="fa-solid fa-xmark"></i></button><img alt="">';
  document.body.appendChild(lb);
  var lbImg=lb.querySelector('img'), lbClose=lb.querySelector('button'), lastFocus=null;
  function closeLb(){ lb.classList.remove('open'); lbImg.removeAttribute('src'); document.body.style.overflow=''; if(lastFocus) lastFocus.focus(); }
  document.querySelectorAll('[data-lightbox]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault(); var img=a.querySelector('img'); if(!img) return;
      lastFocus=a; lbImg.src=a.getAttribute('href'); lbImg.alt=img.alt || 'Certificate preview'; lb.classList.add('open'); document.body.style.overflow='hidden'; lbClose.focus();
    });
  });
  lb.addEventListener('click',function(e){ if(e.target===lb || e.target===lbClose || lbClose.contains(e.target)) closeLb(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape' && lb.classList.contains('open')) closeLb(); });
})();
