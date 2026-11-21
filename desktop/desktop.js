/* ==========================================================
   PARTE 02 · Escritorio
   - Se monta solo dentro de #desktop-root (lo crea la Parte 01).
   - Es visible cuando #desktop-root tiene data-ready="true".
   - Para añadir carpetas: editar CONFIG.items (o Portfolio.desktop.addIcon).
   - Eventos para la Parte 03 (ventanas):
       "desktop:open"  → { id, type, label }  (doble clic, Enter o toque)
       "desktop:panel" → { app }              (botones del panel)
   ========================================================== */
(() => {
  'use strict';

  const root = document.getElementById('desktop-root');
  if (!root) return;

  /* ---------- Configuración ---------- */
  const CONFIG = {
    lockScroll: true,          // congela el scroll de la página al mostrar el escritorio
    items: [
      { id: 'about',          label: 'About Me',       type: 'folder' },
      { id: 'projects',       label: 'Projects',       type: 'folder' },
      { id: 'skills',         label: 'Skills',         type: 'folder' },
      { id: 'certifications', label: 'Certifications', type: 'folder' },
      { id: 'contact',        label: 'Contact',        type: 'folder' }
    ]
  };
  const ICON_SYMBOL = { folder: 'dk-folder' };   // tipo de icono → símbolo del sprite

  /* ---------- Sprite SVG (iconos reutilizables) ---------- */
  const SPRITE = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <linearGradient id="dk-fg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6aa6e0"/><stop offset="1" stop-color="#3b7cc2"/>
    </linearGradient>
  </defs>
  <symbol id="dk-folder" viewBox="0 0 48 48">
    <path d="M4 10a3 3 0 0 1 3-3h12l4 4h18a3 3 0 0 1 3 3v6H4z" fill="#2f5f96"/>
    <path d="M4 17h40v21a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="url(#dk-fg)"/>
    <path d="M4.5 17.5h39" stroke="#9cc8f2" stroke-opacity=".6" fill="none"/>
  </symbol>
  <symbol id="dk-dragon" viewBox="-240 -130 450 350" fill="none" stroke="currentColor" stroke-linecap="round">
    <path stroke-width="34" d="M130 -60C60 -100 -20 -40 40 0C100 40 190 30 200 110C205 150 185 185 165 205"/>
    <path stroke-width="18" d="M45 -72Q-60 -112 -230 -125M45 -72Q-60 -112 -190 -75M45 -72Q-60 -112 -150 -25"/>
    <path fill="currentColor" stroke="none" d="M128 -62L152 -76L178 -46L150 -48Z"/>
  </symbol>
  <symbol id="dk-term" viewBox="0 0 16 16" fill="none" stroke="currentColor">
    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5"/><path d="M4 6l2.5 2L4 10M8 10.5h4"/>
  </symbol>
  <symbol id="dk-web" viewBox="0 0 16 16" fill="none" stroke="currentColor">
    <circle cx="8" cy="8" r="6"/><ellipse cx="8" cy="8" rx="2.6" ry="6"/><path d="M2 8h12"/>
  </symbol>
  <symbol id="dk-net" viewBox="0 0 16 16" fill="none" stroke="currentColor">
    <path d="M2 6.5a8 8 0 0 1 12 0M4.3 9a5 5 0 0 1 7.4 0"/><circle cx="8" cy="11.8" r="1" fill="currentColor"/>
  </symbol>
  <symbol id="dk-vol" viewBox="0 0 16 16" fill="none" stroke="currentColor">
    <path d="M2.5 6.5H5L8.5 3.5v9L5 9.5H2.5z" fill="currentColor"/><path d="M11 6a3 3 0 0 1 0 4"/>
  </symbol>
</svg>`;

  const glyph = id => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
  const panelBtn = (app, label, id) =>
    `<button class="dk-btn" type="button" data-app="${app}" aria-label="${label}" disabled>${glyph(id)}</button>`;

  /* ---------- Estructura ---------- */
  root.innerHTML = SPRITE + `
<header class="dk-panel">
  ${panelBtn('menu', 'Menú de aplicaciones', 'dk-dragon')}
  <i class="dk-sep"></i>
  ${panelBtn('terminal', 'Terminal', 'dk-term')}
  ${panelBtn('files', 'Archivos', 'dk-folder')}
  ${panelBtn('browser', 'Navegador', 'dk-web')}
  <div class="dk-tasks"></div>
  <div class="dk-tray">
    ${panelBtn('network', 'Red', 'dk-net')}
    ${panelBtn('volume', 'Volumen', 'dk-vol')}
    <div class="dk-clock"><span class="dk-date"></span><time></time></div>
  </div>
</header>
<div class="dk-icons" role="group" aria-label="Escritorio"></div>
<div class="dk-windows"></div>`;

  const area = root.querySelector('.dk-icons');
  const noHover = matchMedia('(hover: none)');          // dispositivos táctiles: un toque abre la carpeta
  const emit = (name, detail) => root.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));

  /* ---------- Iconos ---------- */
  function addIcon(item) {
    const type = item.type || 'folder';
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'dk-icon';
    el.dataset.id = item.id;
    el.dataset.type = type;
    el.innerHTML = `<svg class="dk-ico" aria-hidden="true"><use href="#${ICON_SYMBOL[type]}"/></svg><span></span>`;
    el.lastChild.textContent = item.label;
    area.appendChild(el);
    return el;
  }

  function select(id) {
    area.querySelectorAll('.dk-icon').forEach(el => {
      const on = el.dataset.id === id;
      el.classList.toggle('is-selected', on);
      el.setAttribute('aria-pressed', on);
    });
  }

  const open = el => emit('desktop:open', { id: el.dataset.id, type: el.dataset.type, label: el.textContent });

  area.addEventListener('click', e => {
    const el = e.target.closest('.dk-icon');
    select(el ? el.dataset.id : null);                 // clic en vacío = deseleccionar
    if (el && (e.pointerType === 'touch' || noHover.matches)) open(el);     // en táctil, un toque abre
  });
  area.addEventListener('dblclick', e => {
    const el = e.target.closest('.dk-icon');
    if (el) open(el);
  });
  area.addEventListener('keydown', e => {
    const el = e.target.closest('.dk-icon');
    if (el && e.key === 'Enter') { e.preventDefault(); select(el.dataset.id); open(el); }
  });
  root.querySelector('.dk-panel').addEventListener('click', e => {
    const b = e.target.closest('[data-app]');
    if (b) emit('desktop:panel', { app: b.dataset.app });
  });

  CONFIG.items.forEach(addIcon);

  /* ---------- Reloj del panel ---------- */
  const time = root.querySelector('time'), date = root.querySelector('.dk-date');
  const tick = () => {
    const d = new Date();
    time.textContent = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    date.textContent = d.toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' });
  };
  // Se actualiza justo al cambiar el minuto y al volver a la pestaña (sin intervalos constantes)
  const loopClock = () => { tick(); setTimeout(loopClock, 60000 - (Date.now() % 60000) + 50); };
  loopClock();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });

  /* ---------- Conexión con la Parte 01 ---------- */
  let locked = false;
  const sync = () => {
    const on = root.dataset.ready === 'true';
    root.setAttribute('aria-hidden', on ? 'false' : 'true');
    if (on && CONFIG.lockScroll && !locked) { locked = true; document.documentElement.style.overflow = 'hidden'; }
  };
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-ready'] });
  if (location.hash === '#desktop') root.dataset.ready = 'true';   // atajo para probar sin hacer scroll
  sync();

  /* ---------- API pública ---------- */
  window.Portfolio = window.Portfolio || {};
  window.Portfolio.desktop = {
    root, config: CONFIG, addIcon, select,
    layers: { icons: area, windows: root.querySelector('.dk-windows'), tasks: root.querySelector('.dk-tasks') }
  };
})();
