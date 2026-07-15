'use strict';

/* ── THEME TOGGLE (light / dark) ── */
(function(){
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const label = document.getElementById('tt-label');
  // saved preference, else default dark
  let theme = 'dark';
  try { theme = localStorage.getItem('sk-theme') || 'dark'; } catch (e) {}
  function apply(t) {
    if (t === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    if (label) label.textContent = (t === 'light') ? 'Light · Calm' : 'Dark · Star Wars';
  }
  apply(theme);
  btn?.addEventListener('click', () => {
    theme = (theme === 'light') ? 'dark' : 'light';
    apply(theme);
    try { localStorage.setItem('sk-theme', theme); } catch (e) {}
  });
})();

/* ── TAB SWITCHING ── */
function switchTab(target) {
  const btns = document.querySelectorAll('.nav-btn');
  const panels = document.querySelectorAll('.tab-panel');
  btns.forEach(b => b.classList.toggle('active', b.dataset.tab === target));
  panels.forEach(p => p.classList.toggle('active', p.id === 'tab-' + target));
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('mobile-menu-btn')?.classList.remove('open');
  window.scrollTo(0, 0);
}
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});
/* hero inline links that jump to tabs */
document.querySelectorAll('[data-goto]').forEach(a => {
  a.addEventListener('click', e => { e.preventDefault(); switchTab(a.dataset.goto); });
});

/* ── MOBILE MENU ── */
(function(){
  const btn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  if (!btn || !sidebar) return;
  btn.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    btn.classList.toggle('open', open);
  });
})();

/* ── FILE READER ── */
function readImg(file, cb) {
  const r = new FileReader();
  r.onload = e => cb(e.target.result);
  r.readAsDataURL(file);
}

/* ── LIGHTBOX ── */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
function openLightbox(src) {
  lbImg.src = src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ── STARFIELD (hero, Star Wars touch) ── */
(function(){
  const field = document.getElementById('starfield');
  if (!field) return;
  const STARS = 64;
  for (let i = 0; i < STARS; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    const size = Math.random() < 0.85 ? 1 : 2;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDuration = (2.5 + Math.random() * 4) + 's';
    s.style.animationDelay = (Math.random() * 5) + 's';
    field.appendChild(s);
  }
})();

/* ── HERO PHOTO (sidebar) ── */
(function(){
  const input = document.getElementById('hero-photo-input');
  const frame = document.getElementById('hero-photo-frame');
  const ph = document.getElementById('hero-placeholder');
  if (!input || !frame) return;
  frame.addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    const f = input.files[0]; if (!f) return;
    readImg(f, url => {
      let img = frame.querySelector('img');
      if (!img) { img = document.createElement('img'); img.alt = 'Samhitha'; frame.appendChild(img); }
      img.src = url;
      if (ph) ph.style.display = 'none';
    });
  });
})();

/* ── BLOG FILTER ── */
(function(){
  const pills = document.querySelectorAll('.blog-pill');
  function apply(cat) {
    document.querySelectorAll('.blog-post').forEach(post => {
      post.style.display = (cat === 'all' || post.dataset.cat === cat) ? '' : 'none';
    });
  }
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      apply(pill.dataset.cat);
    });
  });
})();

/* ── ADD BLOG POST ── */
document.getElementById('add-post-btn')?.addEventListener('click', () => {
  const list = document.getElementById('blog-list');
  if (!list) return;
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const post = document.createElement('article');
  post.className = 'blog-post';
  post.dataset.cat = 'llms';
  post.innerHTML =
    '<div class="bp-meta"><span class="bp-cat llms">LLMs</span><span class="bp-date">' + today + '</span></div>' +
    '<h3 class="bp-title" contenteditable="true">New post title — click to edit</h3>' +
    '<p class="bp-excerpt" contenteditable="true">Write your post here. Tip: change the category label above to Quantum, Security, or LLMs.</p>';
  list.prepend(post);
  post.querySelector('.bp-title').focus();
});

/* ── ADVENTURE / GALLERY ITEMS ── */
function wireAdventure(item) {
  const input = item.querySelector('input[type="file"]');
  const slot = item.querySelector('.adv-photo');
  if (!input || !slot) return;
  item.addEventListener('click', e => {
    if (e.target.isContentEditable) return;
    const img = slot.querySelector('img');
    if (img) openLightbox(img.src); else input.click();
  });
  input.addEventListener('click', e => e.stopPropagation());
  input.addEventListener('change', () => {
    const f = input.files[0]; if (!f) return;
    readImg(f, url => {
      let img = slot.querySelector('img');
      const ph = slot.querySelector('.adv-ph');
      if (!img) { img = document.createElement('img'); img.alt = ''; slot.appendChild(img); }
      img.src = url;
      if (ph) ph.style.display = 'none';
    });
  });
}
document.querySelectorAll('.adv-item').forEach(wireAdventure);

/* ── ADD GALLERY PHOTO ── */
document.getElementById('add-adventure-btn')?.addEventListener('click', () => {
  const grid = document.getElementById('adventures-grid');
  const div = document.createElement('div');
  div.className = 'adv-item';
  div.innerHTML = '<div class="adv-photo" style="height:210px"><div class="adv-ph"><p>Click to add photo</p></div></div><div class="adv-body"><h4 contenteditable="true">New Memory</h4><p contenteditable="true">Write a caption...</p><div class="adv-loc">📍 <span contenteditable="true">Add location</span></div></div><input type="file" accept="image/*" style="display:none"/>';
  grid.appendChild(div);
  wireAdventure(div);
  requestAnimationFrame(() => div.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
});

/* ── RECIPE UPLOADS ── */
document.querySelectorAll('.recipe-card').forEach(card => {
  const input = card.querySelector('.recipe-upload-input');
  const slot = card.querySelector('.rec-img');
  if (!input || !slot) return;
  slot.addEventListener('click', () => {
    const img = slot.querySelector('img');
    if (img) openLightbox(img.src); else input.click();
  });
  input.addEventListener('click', e => e.stopPropagation());
  input.addEventListener('change', () => {
    const f = input.files[0]; if (!f) return;
    readImg(f, url => {
      let img = slot.querySelector('img');
      if (!img) { img = document.createElement('img'); slot.appendChild(img); }
      img.src = url;
      const em = slot.querySelector('.rec-emoji');
      if (em) em.style.display = 'none';
    });
  });
});

/* ── SINGING PHOTO SLOTS ── */
document.querySelectorAll('.s-slot').forEach(slot => {
  const input = slot.querySelector('input[type="file"]');
  if (!input) return;
  slot.addEventListener('click', () => {
    const img = slot.querySelector('img');
    if (img) openLightbox(img.src); else input.click();
  });
  input.addEventListener('click', e => e.stopPropagation());
  input.addEventListener('change', () => {
    const f = input.files[0]; if (!f) return;
    readImg(f, url => {
      let img = slot.querySelector('img');
      const ph = slot.querySelector('.s-ph');
      if (!img) { img = document.createElement('img'); img.alt = ''; slot.appendChild(img); }
      img.src = url;
      if (ph) ph.style.display = 'none';
    });
  });
});

/* ── CONTACT FORM ── */
(function(){
  const send = document.getElementById('cf-send');
  const note = document.getElementById('cf-note');
  if (!send) return;
  const name = document.getElementById('cf-name');
  const email = document.getElementById('cf-email');
  const subject = document.getElementById('cf-subject');
  const message = document.getElementById('cf-message');
  send.addEventListener('click', () => {
    const n = (name.value || '').trim();
    const e = (email.value || '').trim();
    const m = (message.value || '').trim();
    if (!n || !e || !m) {
      note.textContent = '// please fill in name, email, and message.';
      note.style.color = 'var(--crimson)';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      note.textContent = '// that email address looks off.';
      note.style.color = 'var(--crimson)';
      return;
    }
    // open the user's mail client pre-filled
    const subj = encodeURIComponent((subject.value || 'Hello from your site').trim());
    const body = encodeURIComponent('From: ' + n + ' (' + e + ')\n\n' + m);
    window.location.href = 'mailto:samk_13@tamu.edu?subject=' + subj + '&body=' + body;
    note.textContent = '// opening your mail app...';
    note.style.color = 'var(--accent)';
  });
})();
