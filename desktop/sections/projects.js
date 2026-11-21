/* ==========================================================
   Projects · Renderizado
   Lee Portfolio.content.projects (projects.data.js) y lo monta dentro
   de la ventana "Projects" mediante Portfolio.windows.register.
   Dos vistas dentro de la misma ventana: catálogo (con filtros por
   categoría) y detalle de proyecto (con botón/Escape para volver).
   ========================================================== */
(() => {
  'use strict';

  const P = window.Portfolio;
  if (!P || !P.windows || !P.content || !P.content.projects) {
    console.warn('projects.js: faltan windows.js o projects.data.js');
    return;
  }

  const NS = 'http://www.w3.org/2000/svg';
  const OTHER = 'Other Projects';
  const ICONS = {
    shield:   '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    target:   '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    network:  '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M12 12l-6 5M12 12l6 5"/>',
    code:     '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
    cog:      '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
    layers:   '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/>',
    flag:     '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    folder:   '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    branch:   '<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 8v8M18 10c0 4-6 3-12 6"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    back:     '<path d="M15 5l-7 7 7 7"/>'
  };

  /* ---------- Helpers ---------- */
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const icon = (name, cls = 'pj-i') => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', cls);
    s.innerHTML = ICONS[name] || ICONS.layers;
    return s;
  };
  // Acepta texto o lista de textos y siempre devuelve una lista sin vacíos
  const list = v => (v == null || v === '' ? [] : (Array.isArray(v) ? v : [v]).filter(Boolean));
  // Solo enlaces absolutos http(s)
  const safeUrl = u => {
    try {
      const x = new URL(u);
      return /^https?:$/.test(x.protocol) ? x.href : null;
    } catch (e) { return null; }
  };
  const plural = n => n + (n === 1 ? ' proyecto' : ' proyectos');

  /* ---------- Datos ---------- */
  function prepare(data) {
    const cats = (Array.isArray(data.categories) ? data.categories : []).filter(c => c && c.id);
    if (!cats.some(c => c.id === OTHER)) cats.push({ id: OTHER, icon: 'layers' });
    const catById = new Map(cats.map(c => [c.id, c]));

    const seen = new Set();
    const items = (Array.isArray(data.items) ? data.items : []).filter(p => {
      if (!p || !p.id || !p.title) { console.warn('projects.js: proyecto sin id o title, se omite', p); return false; }
      if (seen.has(p.id)) { console.warn('projects.js: id repetido, se omite:', p.id); return false; }
      seen.add(p.id);
      return true;
    });

    // Una categoría desconocida o vacía cae en "Other Projects"
    const catId = p => (catById.has(p.category) ? p.category : OTHER);
    return { cats, catById, items, catId };
  }

  /* ---------- Piezas reutilizables ---------- */
  function tag(cat) {
    const t = el('span', 'pj-tag');
    t.append(icon(cat.icon), cat.label || cat.id);
    return t;
  }

  function chips(items, max) {
    const ul = el('ul', 'pj-chips');
    const shown = max ? items.slice(0, max) : items;
    shown.forEach(t => ul.appendChild(el('li', 'pj-chip', t)));
    if (max && items.length > max) ul.appendChild(el('li', 'pj-chip is-more', '+' + (items.length - max)));
    return ul;
  }

  function thumb(p, cat) {
    const t = el('div', 'pj-thumb');
    const fallback = () => { t.classList.add('is-empty'); t.prepend(icon(cat.icon)); };
    if (p.image) {
      const img = el('img');
      img.src = p.image;
      img.alt = 'Captura de ' + p.title;
      img.loading = 'lazy';
      img.addEventListener('error', () => { img.remove(); fallback(); }, { once: true });
      t.appendChild(img);
    } else {
      fallback();
    }
    if (p.demo) t.appendChild(el('span', 'pj-badge', 'Demo Project'));
    return t;
  }

  function textBlock(values) {
    if (values.length === 1) return el('p', null, values[0]);
    const ul = el('ul', 'pj-list');
    values.forEach(v => ul.appendChild(el('li', null, v)));
    return ul;
  }

  function section(title, iconName, content) {
    const s = el('section', 'pj-sec');
    const h = el('h3');
    h.append(icon(iconName), title);
    s.append(h, content);
    return s;
  }

  function links(p) {
    const wrap = el('div', 'pj-links');
    const defs = [
      { key: 'githubUrl', on: 'Repositorio en GitHub', off: 'Repositorio no disponible', icon: 'branch' },
      { key: 'demoUrl',   on: 'Ver demostración',      off: 'Demo no disponible',        icon: 'external' }
    ];
    defs.forEach(d => {
      const url = safeUrl(p[d.key]);
      if (url) {
        const a = el('a', 'pj-link');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.append(icon(d.icon), d.on);
        wrap.appendChild(a);
      } else {
        const s = el('span', 'pj-link is-off');
        s.append(icon(d.icon), d.off);
        wrap.appendChild(s);
      }
    });
    return wrap;
  }

  /* ---------- Aplicación (una por ventana) ---------- */
  function render(slot) {
    const data = P.content.projects;
    const { cats, catById, items, catId } = prepare(data);
    const catInfo = id => catById.get(id) || { id, icon: 'layers' };

    const state = { filter: 'all', open: null };
    const root = el('div', 'pj-root');
    slot.appendChild(root);

    // La barra de ruta de la ventana refleja dónde estás (como un explorador)
    const loc = slot.closest('.dk-win') && slot.closest('.dk-win').querySelector('.dk-wloc');
    const basePath = loc ? loc.textContent : '';
    const setPath = tail => { if (loc) loc.textContent = basePath + tail; };

    const mount = view => { root.replaceChildren(view); slot.scrollTop = 0; };

    /* ----- Tarjeta ----- */
    function card(p) {
      const cat = catInfo(catId(p));
      const b = el('button', 'pj-card');
      b.type = 'button';
      b.dataset.id = p.id;
      b.setAttribute('aria-label', 'Abrir proyecto: ' + p.title);

      const body = el('div', 'pj-cbody');
      body.append(tag(cat), el('h2', null, p.title));
      if (p.description) body.appendChild(el('p', 'pj-desc', p.description));
      const tech = list(p.technologies);
      if (tech.length) body.appendChild(chips(tech, 4));

      b.append(thumb(p, cat), body);
      b.addEventListener('click', () => showDetail(p));
      return b;
    }

    /* ----- Vista: catálogo ----- */
    function catalogView() {
      const v = el('div', 'pj-view');

      const head = el('header', 'pj-head');
      const ico = el('span', 'pj-headico');
      ico.appendChild(icon('folder'));
      const txt = el('div');
      txt.append(el('h1', null, data.title || 'Projects'));
      if (data.description) txt.appendChild(el('p', null, data.description));
      head.append(ico, txt);

      const counts = new Map();
      items.forEach(p => counts.set(catId(p), (counts.get(catId(p)) || 0) + 1));
      const defs = [{ id: 'all', label: 'All', icon: 'folder', n: items.length }]
        .concat(cats.map(c => ({ id: c.id, label: c.label || c.id, icon: c.icon, n: counts.get(c.id) || 0 })));

      const filters = el('div', 'pj-filters');
      filters.setAttribute('role', 'group');
      filters.setAttribute('aria-label', 'Filtrar por categoría');
      const count = el('p', 'pj-count');
      count.setAttribute('aria-live', 'polite');
      const grid = el('div', 'pj-grid');

      const apply = () => {
        const shown = state.filter === 'all' ? items : items.filter(p => catId(p) === state.filter);
        filters.querySelectorAll('.pj-filter').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === state.filter)));
        count.textContent = plural(shown.length) + (state.filter === 'all' ? '' : ' · ' + state.filter);
        if (shown.length) {
          grid.replaceChildren(...shown.map(card));
        } else {
          grid.replaceChildren(el('div', 'pj-empty', 'Todavía no hay proyectos en esta categoría.'));
        }
      };

      defs.forEach(d => {
        const b = el('button', 'pj-filter' + (d.n === 0 && d.id !== 'all' ? ' is-empty' : ''));
        b.type = 'button';
        b.dataset.filter = d.id;
        b.append(icon(d.icon), d.label, el('small', null, String(d.n)));
        b.addEventListener('click', () => { state.filter = d.id; apply(); });
        filters.appendChild(b);
      });

      v.append(head, filters, count, grid);
      apply();
      return v;
    }

    /* ----- Vista: detalle ----- */
    function detailView(p) {
      const cat = catInfo(catId(p));
      const v = el('article', 'pj-view pj-detail');

      const bar = el('div', 'pj-bar');
      const back = el('button', 'pj-back');
      back.type = 'button';
      back.append(icon('back'), 'Volver a ' + (data.title || 'Projects'));
      back.addEventListener('click', () => showCatalog(p.id));
      bar.appendChild(back);

      const hero = el('header', 'pj-hero');
      const info = el('div', 'pj-info');
      info.append(tag(cat), el('h1', null, p.title));
      if (p.description) info.appendChild(el('p', null, p.description));
      info.appendChild(links(p));
      hero.append(thumb(p, cat), info);

      v.append(bar, hero);

      const objectives = list(p.objectives);
      if (objectives.length) v.appendChild(section('Objetivo', 'target', textBlock(objectives)));

      const tools = list(p.tools), tech = list(p.technologies);
      if (tools.length || tech.length) {
        const cols = el('div', 'pj-cols');
        if (tools.length) cols.appendChild(section('Herramientas', 'terminal', chips(tools)));
        if (tech.length) cols.appendChild(section('Tecnologías', 'code', chips(tech)));
        v.appendChild(cols);
      }

      const process = list(p.process);
      if (process.length) v.appendChild(section('Proceso de desarrollo', 'cog', textBlock(process)));

      const results = list(p.results);
      if (results.length) v.appendChild(section('Resultados y aprendizajes', 'flag', textBlock(results)));

      return v;
    }

    /* ----- Navegación ----- */
    function showCatalog(focusId) {
      state.open = null;
      setPath('');
      mount(catalogView());
      if (focusId) {
        const c = root.querySelector('.pj-card[data-id="' + CSS.escape(focusId) + '"]');
        if (c) c.focus();
      }
    }

    function showDetail(p) {
      state.open = p.id;
      setPath('/' + p.title);
      const v = detailView(p);
      mount(v);
      v.querySelector('.pj-back').focus({ preventScroll: true });
    }

    root.addEventListener('keydown', e => {
      if (e.key === 'Escape' && state.open) { e.preventDefault(); showCatalog(state.open); }
    });

    showCatalog();
  }

  P.windows.register('projects', render);
})();
