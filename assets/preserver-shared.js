/* preserver-shared.js — nav, footer, cookie banner injected on every page */
/* Brand: #FF4500 accent, #1a1a1a dark, system-ui font stack */
(function(){

/* ── Life ring SVG (white torus, 4 red bands — matches cropped-icon.png) ── */
function ring(sz) {
  var cx=sz/2, cy=sz/2, ro=sz/2-0.5, ri=ro*0.52;
  var bh=22*Math.PI/180; /* 44deg band width */
  var red='#E81C00', white='#D0D0D0';
  function band(cDeg){
    var c=cDeg*Math.PI/180, a1=c-bh, a2=c+bh;
    var ox1=cx+ro*Math.sin(a1),oy1=cy-ro*Math.cos(a1);
    var ox2=cx+ro*Math.sin(a2),oy2=cy-ro*Math.cos(a2);
    var ix1=cx+ri*Math.sin(a2),iy1=cy-ri*Math.cos(a2);
    var ix2=cx+ri*Math.sin(a1),iy2=cy-ri*Math.cos(a1);
    return '<path d="M'+ox1.toFixed(2)+' '+oy1.toFixed(2)+' A'+ro.toFixed(2)+' '+ro.toFixed(2)+' 0 0 1 '+ox2.toFixed(2)+' '+oy2.toFixed(2)+' L'+ix1.toFixed(2)+' '+iy1.toFixed(2)+' A'+ri.toFixed(2)+' '+ri.toFixed(2)+' 0 0 0 '+ix2.toFixed(2)+' '+iy2.toFixed(2)+' Z" fill="'+red+'"/>';
  }
  function wseg(a1,a2){
    var lg=(a2-a1>Math.PI)?1:0;
    var ox1=cx+ro*Math.sin(a1),oy1=cy-ro*Math.cos(a1);
    var ox2=cx+ro*Math.sin(a2),oy2=cy-ro*Math.cos(a2);
    var ix1=cx+ri*Math.sin(a2),iy1=cy-ri*Math.cos(a2);
    var ix2=cx+ri*Math.sin(a1),iy2=cy-ri*Math.cos(a1);
    return '<path d="M'+ox1.toFixed(2)+' '+oy1.toFixed(2)+' A'+ro.toFixed(2)+' '+ro.toFixed(2)+' 0 '+lg+' 1 '+ox2.toFixed(2)+' '+oy2.toFixed(2)+' L'+ix1.toFixed(2)+' '+iy1.toFixed(2)+' A'+ri.toFixed(2)+' '+ri.toFixed(2)+' 0 '+lg+' 0 '+ix2.toFixed(2)+' '+iy2.toFixed(2)+' Z" fill="'+white+'"/>';
  }
  var t=0,q=Math.PI/2,h=Math.PI,tq=3*Math.PI/2,tw=2*Math.PI;
  return '<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 '+sz+' '+sz+'" fill="none" aria-hidden="true" style="display:block;flex-shrink:0">'+
    wseg(t+bh,q-bh)+wseg(q+bh,h-bh)+wseg(h+bh,tq-bh)+wseg(tq+bh,tw-bh)+
    band(0)+band(90)+band(180)+band(270)+
    '<circle cx="'+cx+'" cy="'+cy+'" r="'+ro.toFixed(2)+'" fill="none" stroke="#aaa" stroke-width="0.5"/>'+
    '<circle cx="'+cx+'" cy="'+cy+'" r="'+ri.toFixed(2)+'" fill="none" stroke="#aaa" stroke-width="0.5"/>'+
    '</svg>';
}

/* ── NAV ── */
var NAV = '<header><nav class="nav" aria-label="Main navigation"><div class="container"><div class="nav__inner">'+
  '<a href="/" class="nav__logo" aria-label="Preserver home">'+ring(32)+' Preserver</a>'+
  '<div class="nav__links" id="navLinks">'+
    '<a href="/">Home</a>'+
    '<a href="/uses/">Use cases</a>'+
    '<a href="/faq/">FAQ</a>'+
    '<a href="/blog/">Blog</a>'+
    '<a href="/white-labeling/">White-label</a>'+
    '<a href="/contactus/" class="btn btn-outline" style="padding:8px 20px;font-size:14px">Feedback</a>'+
    '<a href="/#download" class="btn btn-primary" style="padding:8px 20px;font-size:14px">$49 — perpetual licence. No subscription!</a>'+
  '</div>'+
  '<button class="nav__hamburger" id="navToggle" aria-expanded="false" aria-controls="mobileMenu" aria-label="Toggle menu">☰</button>'+
'</div></div>'+
'<div class="nav__mobile container" id="mobileMenu">'+
  '<a href="/">Home</a><a href="/uses/">Use cases</a><a href="/faq/">FAQ</a>'+
  '<a href="/blog/">Blog</a>'+
  '<a href="/white-labeling/">White-label</a><a href="/contactus/">Feedback</a>'+
  '<a href="/#download" class="btn btn-primary" style="display:inline-flex;margin:8px 0 4px">$49 — perpetual licence. No subscription!</a>'+
'</div>'+
'</nav></header>';

/* ── FOOTER ── */
var FOOTER = '<footer class="footer" aria-label="Site footer"><div class="container">'+
  '<div class="footer-main">'+
    '<div class="footer-brand">'+
      '<div class="footer-brand__logo">'+ring(32)+' Preserver</div>'+
      '<p>Record your life\'s events, hobbies and work with text, audio, photos and video. Location-stamped. Private. Truly free.</p>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">'+
        '<a href="https://www.facebook.com/Preserver.me/" target="_blank" rel="noopener" aria-label="Facebook" style="color:#999">Facebook</a>'+
        '<span style="color:#444">·</span>'+
        '<a href="https://x.com/Preserver_app" target="_blank" rel="noopener" aria-label="X/Twitter" style="color:#999">X</a>'+
        '<span style="color:#444">·</span>'+
        '<a href="https://www.instagram.com/preserver.me/" target="_blank" rel="noopener" aria-label="Instagram" style="color:#999">Instagram</a>'+
        '<span style="color:#444">·</span>'+
        '<a href="https://www.youtube.com/channel/UChjYgN_uHQcsjE_IYkWSioQ" target="_blank" rel="noopener" aria-label="YouTube" style="color:#999">YouTube</a>'+
        '<span style="color:#444">·</span>'+
        '<a href="https://www.linkedin.com/company/98613970/" target="_blank" rel="noopener" aria-label="LinkedIn" style="color:#999">LinkedIn</a>'+
        '<span style="color:#444">·</span>'+
        '<a href="https://www.threads.net/@preserver.me" target="_blank" rel="noopener" aria-label="Threads" style="color:#999">Threads</a>'+
        '<span style="color:#444">·</span>'+
        '<a href="https://www.tiktok.com/@preserver.me" target="_blank" rel="noopener" aria-label="TikTok" style="color:#999">TikTok</a>'+
      '</div>'+
    '</div>'+
    '<div class="footer-links"><h4>Product</h4><ul>'+
      '<li><a href="/#features">Features</a></li>'+
      '<li><a href="/uses/">Use cases</a></li>'+
      '<li><a href="/faq/">FAQ</a></li>'+
      '<li><a href="/white-labeling/">White-label</a></li>'+
    '</ul></div>'+
    '<div class="footer-links"><h4>Company</h4><ul>'+
      '<li><a href="/blog/">Blog</a></li>'+
      '<li><a href="/contactus/">Feedback</a></li>'+
      '<li><a href="https://www.google.com/maps/search/?api=1&amp;query=Preserver+Brisbane+Australia" target="_blank" rel="noopener">Brisbane Australia</a></li>'+
    '</ul></div>'+
    '<div class="footer-links"><h4>Legal</h4><ul>'+
      '<li><a href="/legals/privacy/" class="legal">Privacy policy</a></li>'+
      '<li><a href="/legals/terms/" class="legal">Terms &amp; conditions</a></li>'+
      '<li><a href="/legals/cookies/" class="legal">Cookie policy</a></li>'+
      '<li><a href="/legals/eula/" class="legal">EULA</a></li>'+
      '<li><a href="/legals/disclaimer/" class="legal">Disclaimer</a></li>'+
    '</ul></div>'+
  '</div>'+
  '<div class="footer-legal">'+
    '<a href="/legals/privacy/">Privacy Policy</a><span class="sep">|</span>'+
    '<a href="/legals/cookies/">Cookie Policy</a><span class="sep">|</span>'+
    '<a href="/legals/terms/">Terms &amp; Conditions</a><span class="sep">|</span>'+
    '<a href="/legals/disclaimer/">Disclaimer</a><span class="sep">|</span>'+
    '<a href="/legals/eula/">EULA</a><span class="sep">|</span>'+
    '<a href="https://app.termly.io/notify/ffaca08d-90b2-4b26-aea2-17f957d53ae4" target="_blank" rel="noopener">Do Not Sell or Share My Personal Information</a><span class="sep">|</span>'+
    '<a href="https://app.termly.io/notify/ffaca08d-90b2-4b26-aea2-17f957d53ae4" target="_blank" rel="noopener">Limit the Use of My Sensitive Personal Information</a><span class="sep">|</span>'+
    '<a href="/sitemap.xml">Sitemap</a>'+
  '</div>'+
  '<div class="footer-copy">&copy; <span class="js-year"></span> Preserver.me LLC. All rights reserved. Header images by Brookey, Currimundi Lake, Sunshine Coast QLD.</div>'+
'</div></footer>';

/* ── COOKIE BANNER ── */
var COOKIE = '<div class="cookie-banner" id="cookieBanner" role="dialog" aria-label="Cookie consent">'+
  '<p class="cookie-banner__text">We use cookies to improve your experience. By continuing you agree to our <a href="/legals/cookies/">Cookie Policy</a> and <a href="/legals/privacy/">Privacy Policy</a>.</p>'+
  '<div class="cookie-banner__actions">'+
    '<button class="cookie-btn-decline" id="cookieDecline">Decline</button>'+
    '<button class="cookie-btn-accept" id="cookieAccept">Accept</button>'+
  '</div>'+
'</div>';

/* ── Inject ── */
document.body.insertAdjacentHTML('afterbegin', NAV);
document.body.insertAdjacentHTML('beforeend', FOOTER + COOKIE);

/* ── Copyright year ── */
document.querySelectorAll('.js-year').forEach(function(el){ el.textContent = new Date().getFullYear(); });

/* ── Mobile nav ── */
var tog = document.getElementById('navToggle');
var menu = document.getElementById('mobileMenu');
if (tog && menu) {
  tog.addEventListener('click', function(){
    var open = menu.classList.toggle('open');
    tog.setAttribute('aria-expanded', open);
    tog.textContent = open ? '✕' : '☰';
  });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ menu.classList.remove('open'); tog.setAttribute('aria-expanded','false'); tog.textContent='☰'; });
  });
}

/* ── Active nav link ── */
var path = window.location.pathname;
document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(function(a){
  if (a.getAttribute('href') === path) a.classList.add('active');
});

/* ── Cookie consent ── */
var banner = document.getElementById('cookieBanner');
var KEY = 'preserver_cookie_consent';
if (localStorage.getItem(KEY)) banner.classList.add('is-hidden');
document.getElementById('cookieAccept').addEventListener('click', function(){ localStorage.setItem(KEY,'accepted'); banner.classList.add('is-hidden'); });
document.getElementById('cookieDecline').addEventListener('click', function(){ localStorage.setItem(KEY,'declined'); banner.classList.add('is-hidden'); });

/* ── FAQ / Accordion ── */
document.querySelectorAll('.faq-q, .accordion__btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    var item = btn.closest('.faq-item, .accordion__item');
    var open = item.classList.contains('open');
    var parent = item.parentElement;
    parent.querySelectorAll('.faq-item, .accordion__item').forEach(function(i){ i.classList.remove('open'); });
    if (!open) item.classList.add('open');
  });
});

})();
