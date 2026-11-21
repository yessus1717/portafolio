/* ==========================================================
   About Me · Renderizado
   Lee Portfolio.content.about (about.data.js) y lo monta dentro
   de la ventana "About Me" mediante Portfolio.windows.register.
   ========================================================== */
(() => {
  'use strict';

  const P = window.Portfolio;
  if (!P || !P.windows || !P.content || !P.content.about) {
    console.warn('about.js: faltan windows.js o about.data.js');
    return;
  }

  const NS = 'http://www.w3.org/2000/svg';
  const ICONS = {
    user:     '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/>',
    pin:      '<path d="M12 21s6-5.5 6-10a6 6 0 0 0-12 0c0 4.5 6 10 6 10z"/><circle cx="12" cy="11" r="2"/>',
    target:   '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    lock:     '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/>',
    network:  '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M12 12l-6 5M12 12l6 5"/>',
    eye:      '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    shield:   '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    code:     '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
    layers:   '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
    flag:     '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    globe:    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'
  };

  /* ---------- Helpers ---------- */
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const icon = (name, cls = 'ab-i') => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', cls);
    s.innerHTML = ICONS[name] || '';
    return s;
  };
  const card = (section, extra = '') => {
    const c = el('section', 'ab-card ' + extra);
    const h = el('h3');
    h.append(icon(section.icon), section.title);
    c.appendChild(h);
    return c;
  };
  const paragraphs = (parent, list) => list.forEach(t => parent.appendChild(el('p', null, t)));

  /* ---------- Bloques ---------- */
  function header(p) {
    const head = el('header', 'ab-head');

    const photo = el('div', 'ab-photo');
    if (p.photo) {
      const img = el('img');
      img.src = p.photo;
      img.alt = 'Fotografía de ' + p.name;
      photo.appendChild(img);
    } else {
      photo.classList.add('is-empty');
      photo.setAttribute('role', 'img');
      photo.setAttribute('aria-label', 'Espacio reservado para la fotografía');
      photo.appendChild(icon('user', 'ab-i ab-avatar'));
    }

    const id = el('div', 'ab-id');
    id.append(el('p', 'ab-cmd', '$ whoami'), el('h1', null, p.name), el('p', 'ab-title', p.title));
    const loc = el('p', 'ab-loc');
    loc.append(icon('pin'), p.location);
    id.appendChild(loc);

    head.append(photo, id);
    return head;
  }

  function story(s) {
    const c = card(s);
    paragraphs(c, s.paragraphs);
    return c;
  }

  function interests(s) {
    const c = card(s);
    const grid = el('div', 'ab-grid');
    s.items.forEach(i => {
      const item = el('div', 'ab-item');
      const tile = el('span', 'ab-tile');
      tile.appendChild(icon(i.icon));
      const txt = el('div');
      txt.append(el('h4', null, i.title), el('p', null, i.text));
      item.append(tile, txt);
      grid.appendChild(item);
    });
    c.appendChild(grid);
    return c;
  }

  function tools(s) {
    const c = card(s);
    if (s.note) c.appendChild(el('p', 'ab-note', s.note));
    s.categories.forEach(cat => {
      const block = el('div', 'ab-cat');
      const h = el('h4');
      h.append(icon(cat.icon), cat.title);
      const chips = el('ul', 'ab-chips');
      cat.items.forEach(t => chips.appendChild(el('li', 'ab-chip', t)));
      block.append(h, chips);
      c.appendChild(block);
    });
    return c;
  }

  function goals(s) {
    const c = card(s);
    paragraphs(c, s.paragraphs);
    return c;
  }

  function languages(s) {
    const c = card(s);
    const list = el('ul', 'ab-langs');
    s.items.forEach(l => {
      const li = el('li', 'ab-lang');
      li.append(el('span', null, l.name), el('span', 'ab-level', l.level));
      list.appendChild(li);
    });
    c.appendChild(list);
    return c;
  }

  /* ---------- Montaje ---------- */
  function render(slot) {
    const d = P.content.about;
    const root = el('div', 'ab-root');
    const ab = el('article', 'ab');
    const two = el('div', 'ab-two');
    two.append(goals(d.goals), languages(d.languages));
    ab.append(header(d.profile), story(d.story), interests(d.interests), tools(d.tools), two);
    root.appendChild(ab);
    slot.appendChild(root);
  }

  P.windows.register('about', render);
})();
