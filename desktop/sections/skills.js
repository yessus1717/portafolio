/* ==========================================================
   Skills · Renderizado
   Lee Portfolio.content.skills (skills.data.js) y lo monta dentro
   de la ventana "Skills" mediante Portfolio.windows.register.
   Sin barras ni porcentajes: cada elemento muestra nombre, icono y
   descripción; el campo opcional "level" queda listo para uso manual.
   ========================================================== */
(() => {
  'use strict';

  const P = window.Portfolio;
  if (!P || !P.windows || !P.content || !P.content.skills) {
    console.warn('skills.js: faltan windows.js o skills.data.js');
    return;
  }

  const NS = 'http://www.w3.org/2000/svg';
  const ICONS = {
    lock:     '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    target:   '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    bug:      '<rect x="8" y="8" width="8" height="11" rx="4"/><path d="M9 5l2 2M15 5l-2 2M4 12h4M16 12h4M5 18l3-2M19 18l-3-2"/>',
    eye:      '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    shield:   '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    network:  '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M12 12l-6 5M12 12l6 5"/>',
    activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    packet:   '<path d="M12 3l8 4v10l-8 4-8-4V7z"/><path d="M4 7l8 4 8-4M12 11v10"/>',
    radar:    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 12l6-6"/>',
    file:     '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    wifi:     '<path d="M2 9a14 14 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/>',
    wifilock: '<path d="M2 9a14 14 0 0 1 12-3.5M5 12.5a10 10 0 0 1 6-2.4"/><rect x="12" y="14" width="9" height="7" rx="1.5"/><path d="M14 14v-2a2.5 2.5 0 0 1 5 0v2"/>',
    plug:     '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/>',
    penguin:  '<circle cx="12" cy="8" r="4"/><path d="M6 20c0-4 2-7 6-7s6 3 6 7z"/>',
    cog:      '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
    code:     '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
    tags:     '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4"/>',
    palette:  '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-2 0-3 2-1 4-1a3 3 0 0 0 3-3c0-5-4-9-9-9z"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16" cy="10" r="1"/>',
    braces:   '<path d="M9 4c-2 0-3 1-3 3v2c0 1-1 3-3 3 2 0 3 2 3 3v2c0 2 1 3 3 3M15 4c2 0 3 1 3 3v2c0 1 1 3 3 3-2 0-3 2-3 3v2c0 2-1 3-3 3"/>',
    script:   '<path d="M5 4h10l4 4v12H5z"/><path d="M9 12l-2 2 2 2M13 16h3"/>',
    globe:    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    table:    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>',
    window:   '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 14l-2 2 2 2M15 14l2 2-2 2"/>',
    blocks:   '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
    wrench:   '<path d="M15 4a4 4 0 0 0-3.5 5.5L4 17a2 2 0 0 0 3 3l7.5-7.5A4 4 0 0 0 20 9l-3 3-3-1-1-3z"/>',
    layers:   '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
    flag:     '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'
  };

  /* ---------- Helpers ---------- */
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const icon = (name, cls = 'sk-i') => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', cls);
    s.innerHTML = ICONS[name] || ICONS.layers;
    return s;
  };
  const arr = v => (Array.isArray(v) ? v : []);

  /* ---------- Bloques ---------- */
  function header(d) {
    const head = el('header', 'sk-head');
    const ico = el('span', 'sk-headico');
    ico.appendChild(icon('terminal'));
    const txt = el('div');
    txt.appendChild(el('h1', null, d.title || 'Skills'));
    if (d.intro) txt.appendChild(el('p', null, d.intro));
    if (d.note) txt.appendChild(el('p', 'sk-note', d.note));
    head.append(ico, txt);
    return head;
  }

  function interests(s) {
    const c = el('section', 'sk-card sk-interests');
    const h = el('h2');
    const ic = el('span', 'sk-cico');
    ic.appendChild(icon(s.icon || 'flag'));
    h.append(ic, s.title || 'Areas of Interest');
    c.appendChild(h);
    if (s.note) c.appendChild(el('p', 'sk-cdesc', s.note));
    const ul = el('ul', 'sk-chips');
    arr(s.items).forEach(t => ul.appendChild(el('li', 'sk-chip', t)));
    c.appendChild(ul);
    return c;
  }

  function itemRow(it) {
    const li = el('li', 'sk-item');
    const tile = el('span', 'sk-tile');
    tile.appendChild(icon(it.icon));
    const txt = el('div', 'sk-txt');
    const name = el('h3', 'sk-name');
    name.append(it.name);
    if (it.level) name.appendChild(el('span', 'sk-level', it.level));
    txt.appendChild(name);
    if (it.description) txt.appendChild(el('p', null, it.description));
    li.append(tile, txt);
    return li;
  }

  function related(cat, byId) {
    const found = arr(cat.related).map(id => {
      const it = byId.get(id);
      if (!it) console.warn('skills.js: related apunta a un id que no existe:', id);
      return it;
    }).filter(Boolean);
    if (!found.length) return null;

    const box = el('div', 'sk-related');
    box.appendChild(el('h3', null, cat.relatedTitle || 'Herramientas relacionadas'));
    const ul = el('ul', 'sk-chips');
    found.forEach(it => {
      const li = el('li', 'sk-chip has-icon');
      li.append(icon(it.icon), it.name);
      ul.appendChild(li);
    });
    box.appendChild(ul);
    return box;
  }

  function category(cat, byId) {
    const items = arr(cat.items).filter(it => it && it.name);
    const c = el('section', 'sk-card');

    const h = el('h2');
    const ic = el('span', 'sk-cico');
    ic.appendChild(icon(cat.icon));
    h.append(ic, cat.title);
    h.appendChild(el('span', 'sk-count', String(items.length)));
    c.appendChild(h);

    if (cat.description) c.appendChild(el('p', 'sk-cdesc', cat.description));

    const list = el('ul', 'sk-items');
    items.forEach(it => list.appendChild(itemRow(it)));
    c.appendChild(list);

    const rel = related(cat, byId);
    if (rel) c.appendChild(rel);
    return c;
  }

  /* ---------- Montaje ---------- */
  function render(slot) {
    const d = P.content.skills;
    const cats = arr(d.categories).filter(c => c && c.title);

    // Índice de items con id, para las "Herramientas relacionadas"
    const byId = new Map();
    cats.forEach(c => arr(c.items).forEach(it => { if (it && it.id) byId.set(it.id, it); }));

    const root = el('div', 'sk-root');
    const wrap = el('div', 'sk-wrap');
    wrap.appendChild(header(d));
    if (d.interests) wrap.appendChild(interests(d.interests));

    const grid = el('div', 'sk-grid');
    cats.forEach(c => grid.appendChild(category(c, byId)));
    wrap.appendChild(grid);

    root.appendChild(wrap);
    slot.appendChild(root);
  }

  P.windows.register('skills', render);
})();
