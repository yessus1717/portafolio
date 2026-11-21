/* ==========================================================
   Contact · Renderizado
   Lee Portfolio.content.contact (contact.data.js) y lo monta dentro
   de la ventana "Contact" mediante Portfolio.windows.register.
   Muestra únicamente los métodos definidos en los datos.
   ========================================================== */
(() => {
  'use strict';

  const P = window.Portfolio;
  if (!P || !P.windows || !P.content || !P.content.contact) {
    console.warn('contact.js: faltan windows.js o contact.data.js');
    return;
  }

  const NS = 'http://www.w3.org/2000/svg';
  const ICONS = {
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.5v.01M12 17v-6.5M12 13.5a3 3 0 0 1 6 0V17"/>',
    phone:    '<path d="M5 4h3.5l1.8 4.5-2.2 1.4a11 11 0 0 0 5 5l1.4-2.2L19 14.5V18a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    send:     '<path d="M21 3L3 10.5l7 2.5 2.5 7z"/><path d="M10 13l11-10"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/>'
  };

  /* ---------- Helpers ---------- */
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const icon = (name, cls = 'cn-i') => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', cls);
    s.innerHTML = ICONS[name] || ICONS.send;
    return s;
  };
  // Solo enlaces absolutos http(s)
  const safeUrl = u => {
    try {
      const x = new URL(u);
      return /^https?:$/.test(x.protocol) ? x.href : null;
    } catch (e) { return null; }
  };
  // Solo números en formato internacional: +507..., dígitos únicamente
  const safeTel = t => (typeof t === 'string' && /^\+?\d{6,15}$/.test(t) ? 'tel:' + t : null);

  // Devuelve { href, external } o null si el método no tiene un enlace válido
  function target(m) {
    const url = safeUrl(m.url);
    if (url) return { href: url, external: true };
    const tel = safeTel(m.tel);
    if (tel) return { href: tel, external: false };
    return null;
  }

  function link(cls, t, ...content) {
    const a = el('a', cls);
    a.href = t.href;
    if (t.external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    a.append(...content);
    return a;
  }

  /* ---------- Bloques ---------- */
  function header(d) {
    const head = el('header', 'cn-head');
    const ico = el('span', 'cn-headico');
    ico.appendChild(icon('send'));
    const txt = el('div');
    if (d.command) txt.appendChild(el('p', 'cn-cmd', d.command));
    txt.appendChild(el('h1', null, d.title || 'Get in Touch'));
    if (d.message) txt.appendChild(el('p', 'cn-msg', d.message));
    head.append(ico, txt);
    return head;
  }

  function card(m) {
    const t = target(m);
    const c = el('article', 'cn-card');
    c.dataset.method = m.id || '';

    const tile = el('span', 'cn-tile');
    tile.appendChild(icon(m.icon));

    const body = el('div', 'cn-body');
    body.appendChild(el('h2', null, m.label));
    // El valor es el propio enlace (tel: o https:) cuando existe
    body.appendChild(t ? link('cn-value', t, m.value) : el('p', 'cn-value is-plain', m.value));

    const act = el('div', 'cn-act');
    if (t) {
      act.appendChild(link('cn-btn', t, icon(t.external ? 'external' : m.icon), m.action || 'Abrir'));
    } else {
      act.appendChild(el('span', 'cn-btn is-off', 'No disponible'));
    }
    if (m.hint) act.appendChild(el('small', null, m.hint));

    c.append(tile, body, act);
    return c;
  }

  /* ---------- Montaje ---------- */
  function render(slot) {
    const d = P.content.contact;
    const methods = (Array.isArray(d.methods) ? d.methods : []).filter(m => m && m.label && m.value);

    const root = el('div', 'cn-root');
    const wrap = el('div', 'cn-wrap');
    wrap.appendChild(header(d));

    if (methods.length) {
      const grid = el('div', 'cn-grid');
      methods.forEach(m => grid.appendChild(card(m)));
      wrap.appendChild(grid);
    } else {
      wrap.appendChild(el('div', 'cn-empty', 'Los datos de contacto estarán disponibles próximamente.'));
    }

    root.appendChild(wrap);
    slot.appendChild(root);
  }

  P.windows.register('contact', render);
})();
