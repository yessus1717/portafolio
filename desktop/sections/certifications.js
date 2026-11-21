/* ==========================================================
   Certifications · Renderizado
   Lee Portfolio.content.certifications (certifications.data.js) y lo
   monta dentro de la ventana "Certifications" mediante
   Portfolio.windows.register.
   Dos vistas en la misma ventana: catálogo (con filtros por categoría)
   y detalle de credencial (botón "Volver" o tecla Escape).
   Sin insignias oficiales: si no hay imagen propia se usa un icono genérico.
   ========================================================== */
(() => {
  'use strict';

  const P = window.Portfolio;
  if (!P || !P.windows || !P.content || !P.content.certifications) {
    console.warn('certifications.js: faltan windows.js o certifications.data.js');
    return;
  }

  const NS = 'http://www.w3.org/2000/svg';
  const OTHER = 'General Technology';
  const STATUS = { 'obtained': 'Obtained', 'in-progress': 'In Progress', 'planned': 'Planned' };
  const ICONS = {
    award:    '<circle cx="12" cy="9" r="5"/><path d="M9 13.5L7.5 21 12 18.5 16.5 21 15 13.5"/>',
    shield:   '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    lock:     '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    network:  '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M12 12l-6 5M12 12l6 5"/>',
    penguin:  '<circle cx="12" cy="8" r="4"/><path d="M6 20c0-4 2-7 6-7s6 3 6 7z"/>',
    code:     '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
    layers:   '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
    file:     '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    doc:      '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10h10M7 14h6"/>',
    back:     '<path d="M15 5l-7 7 7 7"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'
  };

  /* ---------- Helpers ---------- */
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const icon = (name, cls = 'ct-i') => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', cls);
    s.innerHTML = ICONS[name] || ICONS.layers;
    return s;
  };
  // Solo enlaces absolutos http(s)
  const safeUrl = u => {
    try {
      const x = new URL(u);
      return /^https?:$/.test(x.protocol) ? x.href : null;
    } catch (e) { return null; }
  };
  // Solo rutas relativas a un PDF (sin protocolo ni "..")
  const safeFile = f => (typeof f === 'string' && /^[\w][\w./-]*\.pdf$/i.test(f) && !f.includes('..')) ? encodeURI(f) : null;
  const plural = n => n + (n === 1 ? ' credencial' : ' credenciales');
  // '2026-03-15' | '2026-03' | '2026' → texto en español; otro formato se muestra tal cual
  const formatDate = v => {
    if (!v) return '';
    const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(String(v).trim());
    if (!m) return String(v);
    const y = +m[1], mo = m[2] ? +m[2] : 0, d = m[3] ? +m[3] : 0;
    if (!mo) return String(y);
    const opts = d ? { day: 'numeric', month: 'long', year: 'numeric' } : { month: 'long', year: 'numeric' };
    return new Date(Date.UTC(y, mo - 1, d || 1)).toLocaleDateString('es', Object.assign({ timeZone: 'UTC' }, opts));
  };

  /* ---------- Datos ---------- */
  function prepare(data) {
    const cats = (Array.isArray(data.categories) ? data.categories : []).filter(c => c && c.id);
    if (!cats.some(c => c.id === OTHER)) cats.push({ id: OTHER, icon: 'layers' });
    const catById = new Map(cats.map(c => [c.id, c]));

    const seen = new Set();
    const items = (Array.isArray(data.items) ? data.items : []).filter(p => {
      if (!p || !p.id || !p.name) { console.warn('certifications.js: credencial sin id o name, se omite', p); return false; }
      if (seen.has(p.id)) { console.warn('certifications.js: id repetido, se omite:', p.id); return false; }
      seen.add(p.id);
      return true;
    });

    // Una categoría desconocida o vacía cae en "General Technology"
    const catId = p => (catById.has(p.category) ? p.category : OTHER);
    return { cats, catById, items, catId };
  }

  /* ---------- Piezas reutilizables ---------- */
  function tag(cat) {
    const t = el('span', 'ct-tag');
    t.append(icon(cat.icon), cat.label || cat.id);
    return t;
  }

  function statusChip(p) {
    const label = STATUS[p.status];
    return label ? el('span', 'ct-status is-' + p.status, label) : null;
  }

  function badge(p, big) {
    const b = el('div', 'ct-badge' + (big ? ' is-big' : ''));
    const fallback = () => { b.classList.add('is-empty'); b.prepend(icon('award')); };
    if (p.image) {
      const img = el('img');
      img.src = p.image;
      img.alt = 'Imagen de ' + p.name;
      img.loading = 'lazy';
      img.addEventListener('error', () => { img.remove(); fallback(); }, { once: true });
      b.appendChild(img);
    } else {
      fallback();
    }
    return b;
  }

  // Estado + etiqueta Demo + categoría
  function labels(p, cat) {
    const row = el('div', 'ct-labels');
    const st = statusChip(p);
    if (st) row.appendChild(st);
    if (p.demo) row.appendChild(el('span', 'ct-demo', 'Demo'));
    row.appendChild(tag(cat));
    return row;
  }

  function section(title, iconName, content) {
    const s = el('section', 'ct-sec');
    const h = el('h3');
    h.append(icon(iconName), title);
    s.append(h, content);
    return s;
  }

  function head(data) {
    const h = el('header', 'ct-head');
    const ico = el('span', 'ct-headico');
    ico.appendChild(icon('award'));
    const txt = el('div');
    txt.appendChild(el('h1', null, data.title || 'Certifications'));
    if (data.description) txt.appendChild(el('p', null, data.description));
    h.append(ico, txt);
    return h;
  }

  /* ---------- Aplicación (una por ventana) ---------- */
  function render(slot) {
    const data = P.content.certifications;
    const { cats, catById, items, catId } = prepare(data);
    const catInfo = id => catById.get(id) || { id, icon: 'layers' };

    const state = { filter: 'all', open: null };
    const root = el('div', 'ct-root');
    slot.appendChild(root);

    // La barra de ruta de la ventana refleja dónde estás (como un explorador)
    const loc = slot.closest('.dk-win') && slot.closest('.dk-win').querySelector('.dk-wloc');
    const basePath = loc ? loc.textContent : '';
    const setPath = tail => { if (loc) loc.textContent = basePath + tail; };

    const mount = view => { root.replaceChildren(view); slot.scrollTop = 0; };

    /* ----- Tarjeta ----- */
    function card(p) {
      const cat = catInfo(catId(p));
      const b = el('button', 'ct-card');
      b.type = 'button';
      b.dataset.id = p.id;
      b.setAttribute('aria-label', 'Ver credencial: ' + p.name);

      const top = el('div', 'ct-top');
      const ttl = el('div', 'ct-ttl');
      ttl.appendChild(el('h2', null, p.name));
      if (p.issuer) ttl.appendChild(el('p', 'ct-issuer', p.issuer));
      top.append(badge(p), ttl);
      b.appendChild(top);

      if (p.description) b.appendChild(el('p', 'ct-desc', p.description));
      if (safeFile(p.file)) {
        const f = el('span', 'ct-hasfile');
        f.append(icon('doc'), 'Certificado en PDF');
        b.appendChild(f);
      }
      b.appendChild(labels(p, cat));
      b.addEventListener('click', () => showDetail(p));
      return b;
    }

    /* ----- Vista: catálogo ----- */
    function emptyAll() {
      const box = el('div', 'ct-soon');
      box.appendChild(icon('award'));
      box.appendChild(el('h2', null, 'Próximamente'));
      box.appendChild(el('p', null, 'Aún no hay credenciales publicadas. Pronto añadiré mis certificaciones y cursos.'));
      return box;
    }

    function breakdown(shown) {
      const n = {};
      shown.forEach(p => { if (STATUS[p.status]) n[p.status] = (n[p.status] || 0) + 1; });
      return Object.keys(STATUS).filter(k => n[k]).map(k => n[k] + ' ' + STATUS[k]);
    }

    function catalogView() {
      const v = el('div', 'ct-view');
      v.appendChild(head(data));
      if (!items.length) { v.appendChild(emptyAll()); return v; }

      const counts = new Map();
      items.forEach(p => counts.set(catId(p), (counts.get(catId(p)) || 0) + 1));
      const defs = [{ id: 'all', label: 'All', icon: 'award', n: items.length }]
        .concat(cats.map(c => ({ id: c.id, label: c.label || c.id, icon: c.icon, n: counts.get(c.id) || 0 })));

      const filters = el('div', 'ct-filters');
      filters.setAttribute('role', 'group');
      filters.setAttribute('aria-label', 'Filtrar por categoría');
      const count = el('p', 'ct-count');
      count.setAttribute('aria-live', 'polite');
      const grid = el('div', 'ct-grid');

      const apply = () => {
        const shown = state.filter === 'all' ? items : items.filter(p => catId(p) === state.filter);
        filters.querySelectorAll('.ct-filter').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === state.filter)));
        count.textContent = [plural(shown.length)].concat(breakdown(shown)).join(' · ');
        if (shown.length) {
          grid.replaceChildren(...shown.map(card));
        } else {
          grid.replaceChildren(el('div', 'ct-empty', 'Todavía no hay credenciales en esta categoría.'));
        }
      };

      defs.forEach(d => {
        const b = el('button', 'ct-filter' + (d.n === 0 && d.id !== 'all' ? ' is-empty' : ''));
        b.type = 'button';
        b.dataset.filter = d.id;
        b.append(icon(d.icon), d.label, el('small', null, String(d.n)));
        b.addEventListener('click', () => { state.filter = d.id; apply(); });
        filters.appendChild(b);
      });

      v.append(filters, count, grid);
      apply();
      return v;
    }

    /* ----- Visor del certificado (PDF incrustado + enlace) ----- */
    function certificateViewer(p, file) {
      const wrap = el('div', 'ct-doc');

      const obj = el('object', 'ct-pdf');
      obj.type = 'application/pdf';
      obj.data = file + '#toolbar=0&navpanes=0&view=Fit';
      obj.setAttribute('aria-label', 'Certificado de ' + p.name);

      // Si el navegador no puede mostrar el PDF (por ejemplo en móviles), queda el enlace
      const fb = el('p', 'ct-pdf-fallback', 'Tu navegador no puede mostrar el PDF aquí. Usa el botón para abrirlo.');
      obj.appendChild(fb);

      const a = el('a', 'ct-link');
      a.href = file;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.append(icon('external'), 'Abrir certificado en una pestaña nueva');

      wrap.append(obj, a);
      return wrap;
    }

    /* ----- Vista: detalle ----- */
    function detailView(p) {
      const cat = catInfo(catId(p));
      const v = el('article', 'ct-view ct-detail');

      const bar = el('div', 'ct-bar');
      const back = el('button', 'ct-back');
      back.type = 'button';
      back.append(icon('back'), 'Volver a ' + (data.title || 'Certifications'));
      back.addEventListener('click', () => showCatalog(p.id));
      bar.appendChild(back);

      const hero = el('header', 'ct-hero');
      const info = el('div', 'ct-info');
      info.appendChild(labels(p, cat));
      info.appendChild(el('h1', null, p.name));
      if (p.issuer) info.appendChild(el('p', 'ct-issuer', p.issuer));
      // Solo hay botón si existe un enlace de verificación válido
      const url = safeUrl(p.verificationUrl);
      if (url) {
        const a = el('a', 'ct-link');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.append(icon('external'), 'Verificar credencial');
        info.appendChild(a);
      }
      hero.append(badge(p, true), info);
      v.append(bar, hero);

      const file = safeFile(p.file);
      if (file) v.appendChild(section('Certificado', 'doc', certificateViewer(p, file)));

      const rows = [
        ['Institución', p.issuer],
        ['Categoría', cat.label || cat.id],
        ['Estado', STATUS[p.status]],
        ['Fecha de obtención', formatDate(p.issueDate)],
        ['Fecha de vencimiento', formatDate(p.expirationDate)],
        ['Código de credencial', p.credentialId, 'is-mono']
      ].filter(r => r[1]);
      const dl = el('dl', 'ct-meta');
      rows.forEach(r => {
        const row = el('div', 'ct-row');
        row.append(el('dt', null, r[0]), el('dd', r[2] || null, r[1]));
        dl.appendChild(row);
      });
      v.appendChild(section('Detalles', 'award', dl));

      if (p.description) v.appendChild(section('Descripción', 'file', el('p', null, p.description)));
      return v;
    }

    /* ----- Navegación ----- */
    function showCatalog(focusId) {
      state.open = null;
      setPath('');
      mount(catalogView());
      if (focusId) {
        const c = root.querySelector('.ct-card[data-id="' + CSS.escape(focusId) + '"]');
        if (c) c.focus();
      }
    }

    function showDetail(p) {
      state.open = p.id;
      setPath('/' + p.name);
      const v = detailView(p);
      mount(v);
      v.querySelector('.ct-back').focus({ preventScroll: true });
    }

    root.addEventListener('keydown', e => {
      if (e.key === 'Escape' && state.open) { e.preventDefault(); showCatalog(state.open); }
    });

    showCatalog();
  }

  P.windows.register('certifications', render);
})();
