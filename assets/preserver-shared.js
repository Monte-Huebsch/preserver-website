/* ── Analytics (all three) ── */

/* GA4 — consent-aware: only fires after cookie accept */
function loadGA4(){
  if (window._ga4Loaded) return;
  window._ga4Loaded = true;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-GEKDCSFJJM';
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-GEKDCSFJJM');
}
/* Meta Pixel — consent-aware: only fires after cookie accept */
function loadMetaPixel(){
  if (window._metaPixelLoaded) return;
  window._metaPixelLoaded = true;
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window,document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init','854876167371717');
  fbq('track','PageView');

  /* ── Meta Pixel + GA4: App Store / Google Play click tracking ── */
  /* Explicit code-owned GA4 events (app_store_click / play_store_click) —
     previously GA4's only signal for this was its own automatic Enhanced
     Measurement outbound-click detection plus an unverifiable admin-console
     key-event rule; these calls fire a named event directly so it can be
     checked/reported on without depending on that config. */
  document.querySelectorAll('a[href*="apps.apple.com"]').forEach(function(el){
    el.addEventListener('click', function(){
      fbq('track', 'Lead', {
        content_name: 'App Store Click',
        content_category: 'iOS'
      });
      if (window.gtag) gtag('event', 'app_store_click', {
        event_category: 'engagement',
        event_label: window.location.pathname
      });
    });
  });
  document.querySelectorAll('a[href*="play.google.com"]').forEach(function(el){
    el.addEventListener('click', function(){
      fbq('track', 'Lead', {
        content_name: 'Google Play Click',
        content_category: 'Android'
      });
      if (window.gtag) gtag('event', 'play_store_click', {
        event_category: 'engagement',
        event_label: window.location.pathname
      });
    });
  });
}
/* Fire immediately if user already accepted cookies */
if (localStorage.getItem('preserver_cookie_consent') === 'accepted') { loadGA4(); loadMetaPixel(); }

/* Microsoft Clarity — fires immediately (no PII, cookieless-compatible) */
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "x5mp720fnd");

/* Cloudflare Web Analytics — fires immediately (privacy-first, no cookies) */
(function(){
  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', '{"token": "331e49e95afc4a8d96dda36e2a36bfb5"}');
  document.head.appendChild(s);
})();

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
  '</div>'+
  '<button class="nav__hamburger" id="navToggle" aria-expanded="false" aria-controls="mobileMenu" aria-label="Toggle menu">☰</button>'+
'</div></div>'+
'<div class="nav__mobile container" id="mobileMenu">'+
  '<a href="/">Home</a><a href="/uses/">Use cases</a><a href="/faq/">FAQ</a>'+
  '<a href="/blog/">Blog</a>'+
  '<a href="/white-labeling/">White-label</a><a href="/contactus/">Feedback</a>'+
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
document.getElementById('cookieAccept').addEventListener('click', function(){ localStorage.setItem(KEY,'accepted'); banner.classList.add('is-hidden'); loadGA4(); loadMetaPixel(); });
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

/* ── Site chatbot (self-hosted RAG, replaces the old Dante AI embed) ──
   Talks to /api/chat (functions/api/chat.js), a Cloudflare Pages Function
   backed by Workers AI + Vectorize, both in this same Cloudflare account —
   no third-party vendor sees visitor conversations.
   Knowledge base freshness is NOT automatic: see tools/chatbot/README.md —
   after editing the homepage, FAQ, a use-case card or a blog post, re-run
   extract_content.py + embed_and_upsert.py or the bot answers from stale
   content. This widget itself needs no changes when content changes. */
(function initChatWidget(){
  var css = '' +
    '#pv-chat-btn{position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:50%;' +
    'background:#FF4500;color:#fff;border:none;box-shadow:0 4px 16px rgba(0,0,0,.25);cursor:pointer;' +
    'font-size:24px;z-index:9998;display:flex;align-items:center;justify-content:center}' +
    '#pv-chat-panel{position:fixed;bottom:88px;right:20px;width:340px;max-width:calc(100vw - 32px);' +
    'height:460px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;' +
    'box-shadow:0 12px 40px rgba(0,0,0,.22);display:none;flex-direction:column;overflow:hidden;z-index:9999;' +
    'font-family:inherit}' +
    '#pv-chat-panel.open{display:flex}' +
    '#pv-chat-head{background:#1a1a1a;color:#fff;padding:14px 16px;font-weight:700;font-size:14px;' +
    'display:flex;justify-content:space-between;align-items:center}' +
    '#pv-chat-head button{background:none;border:none;color:#aaa;font-size:18px;cursor:pointer}' +
    '#pv-chat-msgs{flex:1;overflow-y:auto;padding:14px;font-size:13px;line-height:1.5}' +
    '.pv-msg{margin-bottom:12px;max-width:90%}' +
    '.pv-msg.user{margin-left:auto;text-align:right}' +
    '.pv-msg .bubble{display:inline-block;padding:9px 13px;border-radius:14px;text-align:left}' +
    '.pv-msg.user .bubble{background:#FF4500;color:#fff;border-bottom-right-radius:4px}' +
    '.pv-msg.bot .bubble{background:#f2f2f2;color:#222;border-bottom-left-radius:4px}' +
    '.pv-msg .sources{margin-top:4px;font-size:11px}' +
    '.pv-msg .sources a{color:#FF4500;text-decoration:none;margin-right:8px}' +
    '#pv-chat-form{display:flex;border-top:1px solid #eee;padding:8px}' +
    '#pv-chat-input{flex:1;border:none;outline:none;font-size:13px;padding:8px;font-family:inherit}' +
    '#pv-chat-form button{background:#FF4500;color:#fff;border:none;border-radius:8px;padding:0 14px;' +
    'font-weight:700;cursor:pointer}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'pv-chat-btn';
  btn.setAttribute('aria-label', 'Chat with Preserver Assistant');
  btn.textContent = '💬';

  var panel = document.createElement('div');
  panel.id = 'pv-chat-panel';
  panel.innerHTML =
    '<div id="pv-chat-head"><span>Preserver Assistant</span><button id="pv-chat-close" aria-label="Close">✕</button></div>' +
    '<div id="pv-chat-msgs"></div>' +
    '<form id="pv-chat-form"><input id="pv-chat-input" type="text" placeholder="Ask about Preserver…" autocomplete="off"><button type="submit">Send</button></form>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var msgsEl = panel.querySelector('#pv-chat-msgs');
  var history = [];
  var greeted = false;

  function addMessage(role, text, sources){
    var wrap = document.createElement('div');
    wrap.className = 'pv-msg ' + role;
    var bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    if (sources && sources.length){
      var s = document.createElement('div');
      s.className = 'sources';
      sources.forEach(function(src){
        var a = document.createElement('a');
        a.href = src.url; a.textContent = (src.title || src.url).split(' — ')[0];
        s.appendChild(a);
      });
      wrap.appendChild(s);
    }
    msgsEl.appendChild(wrap);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  btn.addEventListener('click', function(){
    panel.classList.toggle('open');
    if (!greeted){
      greeted = true;
      addMessage('bot', "Hi! I'm the Preserver Assistant. Ask me anything about how the app works, pricing, privacy, or whether it fits your use case.");
    }
  });
  panel.querySelector('#pv-chat-close').addEventListener('click', function(){ panel.classList.remove('open'); });

  panel.querySelector('#pv-chat-form').addEventListener('submit', function(e){
    e.preventDefault();
    var input = panel.querySelector('#pv-chat-input');
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMessage('user', text);
    history.push({ role: 'user', content: text });

    var thinking = document.createElement('div');
    thinking.className = 'pv-msg bot';
    thinking.innerHTML = '<div class="bubble">…</div>';
    msgsEl.appendChild(thinking);
    msgsEl.scrollTop = msgsEl.scrollHeight;

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: history.slice(-6) })
    }).then(function(r){ return r.json(); }).then(function(data){
      thinking.remove();
      var reply = data.reply || "Sorry, something went wrong — try preserver.me/faq/ or the contact page.";
      addMessage('bot', reply, data.sources);
      history.push({ role: 'assistant', content: reply });
    }).catch(function(){
      thinking.remove();
      addMessage('bot', "I'm having trouble connecting right now — try preserver.me/faq/ or get in touch via the contact page.");
    });
  });
})();

})();
