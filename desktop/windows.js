/* ==========================================================
   PARTE 03 · Gestor de ventanas
   - Escucha "desktop:open" (lo emite desktop.js al hacer doble clic).
   - Una sola ventana por carpeta: si ya existe, se muestra/enfoca.
   - Ventanas estáticas: se colocan solas (mosaico), no se arrastran.
   - Contenido: Portfolio.windows.register(id, (slot, info) => { ... })
     monta el contenido real de cada sección en la Parte 04.
   - Eventos: "window:open|close|minimize|restore|focus" → { id }
   ========================================================== */
(() => {
  'use strict';

  const D = window.Portfolio && window.Portfolio.desktop;
  if (!D) { console.warn('windows.js: falta desktop.js'); return; }

  /* ---------- Configuración ---------- */
  const CFG = {
    margin: 10,          // separación con los bordes del área de ventanas
    gap: 10,             // separación entre ventanas
    maxW: 980,           // tamaño máximo de una ventana
    maxH: 680,
    minCellW: 280,       // si el mosaico queda más pequeño, pasa a modo "una ventana a pantalla completa"
    minCellH: 200,
    singleBelow: 640     // ancho útil bajo el cual se usa ese modo
  };

  const layer = D.layers.windows, tasksEl = D.layers.tasks, iconsEl = D.layers.icons;
  const wins = new Map();          // id → { id, label, el, task, min, order }
  const stack = [];                // ids visibles por orden de enfoque; el último es el activo
  const providers = {};            // id → función que monta el contenido
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let seq = 0, raf = 0;

  const emit = (name, id) => D.root.dispatchEvent(new CustomEvent('window:' + name, { bubbles: true, detail: { id } }));
  const unstack = id => { const i = stack.indexOf(id); if (i > -1) stack.splice(i, 1); };
  const focused = () => stack[stack.length - 1];

  /* ---------- Creación ---------- */
  function build(id, label) {
    const el = document.createElement('section');
    el.className = 'dk-win';
    el.dataset.id = id;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', label);
    el.innerHTML = `
<header class="dk-titlebar">
  <svg class="dk-wico" aria-hidden="true"><use href="#dk-folder"/></svg>
  <h2></h2>
  <div class="dk-wbtns">
    <button type="button" data-act="minimize" aria-label="Minimizar"><svg viewBox="0 0 14 14"><path d="M3 10h8"/></svg></button>
    <button type="button" data-act="close" aria-label="Cerrar"><svg viewBox="0 0 14 14"><path d="M3.5 3.5l7 7m0-7l-7 7"/></svg></button>
  </div>
</header>
<div class="dk-wloc"></div>
<div class="dk-wbody"></div>`;
    el.querySelector('h2').textContent = label;
    el.querySelector('.dk-wloc').textContent = '/home/kali/' + label;
    el.addEventListener('pointerdown', () => { const w = wins.get(id); if (w && !w.min) focus(id); });
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-act]');
      if (b) (b.dataset.act === 'close' ? close : minimize)(id);
    });

    const task = document.createElement('button');
    task.type = 'button';
    task.className = 'dk-task';
    task.title = label;
    task.innerHTML = '<svg aria-hidden="true"><use href="#dk-folder"/></svg><span></span>';
    task.lastChild.textContent = label;
    task.addEventListener('click', () => toggle(id));

    return { id, label, el, task, min: false, order: ++seq };
  }

  function fill(w) {
    const slot = w.el.querySelector('.dk-wbody');
    slot.dataset.slot = w.id;
    slot.textContent = '';
    if (providers[w.id]) return providers[w.id](slot, { id: w.id, label: w.label });
    const box = document.createElement('div');
    box.className = 'dk-empty';
    box.innerHTML = '<p>Carpeta vacía</p><small></small>';
    box.querySelector('small').textContent = `El contenido de “${w.label}” se añadirá más adelante.`;
    slot.appendChild(box);
  }

  /* ---------- Acciones ---------- */
  function open({ id, label }) {
    let w = wins.get(id);
    if (!w) {
      w = build(id, label || id);
      wins.set(id, w);
      layer.appendChild(w.el);
      tasksEl.appendChild(w.task);
      fill(w);
      emit('open', id);
    } else if (w.min) {
      w.min = false;
      emit('restore', id);
    }
    focus(id);
  }

  function focus(id) {
    const w = wins.get(id);
    if (!w) return;
    w.min = false;
    unstack(id); stack.push(id);
    render();
    emit('focus', id);
  }

  function minimize(id) {
    const w = wins.get(id);
    if (!w || w.min) return;
    w.min = true;
    unstack(id);
    render();
    emit('minimize', id);
  }

  function restore(id) { const w = wins.get(id); if (w && w.min) { emit('restore', id); focus(id); } }

  function close(id) {
    const w = wins.get(id);
    if (!w) return;
    wins.delete(id); unstack(id);
    w.task.remove();
    if (reduceMotion.matches) w.el.remove();
    else { w.el.classList.add('is-closing'); setTimeout(() => w.el.remove(), 150); }
    render();
    emit('close', id);
  }

  // Comportamiento de XFCE: minimizada → restaura; activa → minimiza; visible → enfoca
  function toggle(id) {
    const w = wins.get(id);
    if (!w) return;
    if (w.min) restore(id);
    else if (focused() === id) minimize(id);
    else focus(id);
  }

  /* ---------- Organización automática ---------- */
  function place(w, x, y, width, height) {
    const s = w.el.style;
    s.left = Math.round(x) + 'px'; s.top = Math.round(y) + 'px';
    s.width = Math.round(width) + 'px'; s.height = Math.round(height) + 'px';
  }

  function layout() {
    const vis = [...wins.values()].filter(w => !w.min).sort((a, b) => a.order - b.order);
    if (!vis.length) return;

    const { margin: M, gap: G } = CFG;
    const L = layer.getBoundingClientRect();
    // El área útil empieza a la derecha de las columnas de iconos
    const iconsRight = [...iconsEl.children].reduce((m, i) => Math.max(m, i.getBoundingClientRect().right), L.left);
    const ax = iconsRight - L.left + M, ay = M;
    const aw = L.width - ax - M, ah = L.height - 2 * M;

    const n = vis.length, cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n / cols);
    const cw = (aw - (cols - 1) * G) / cols, ch = (ah - (rows - 1) * G) / rows;

    // Pantallas pequeñas: una ventana a la vez ocupando toda el área
    if (aw < CFG.singleBelow || cw < CFG.minCellW || ch < CFG.minCellH) {
      const top = vis.find(w => w.id === focused()) || vis[vis.length - 1];
      vis.forEach(w => { place(w, M, ay, L.width - 2 * M, ah); w.el.classList.toggle('is-behind', w !== top); });
      return;
    }

    // Mosaico: filas completas y la última se reparte el ancho
    let i = 0;
    for (let r = 0; r < rows; r++) {
      const count = r < rows - 1 ? cols : n - cols * (rows - 1);
      const rw = (aw - (count - 1) * G) / count;
      for (let c = 0; c < count; c++, i++) {
        const w = Math.min(rw, CFG.maxW), h = Math.min(ch, CFG.maxH);
        place(vis[i], ax + c * (rw + G) + (rw - w) / 2, ay + r * (ch + G) + (ch - h) / 2, w, h);
        vis[i].el.classList.remove('is-behind');
      }
    }
  }

  function render() {
    layout();
    const f = focused();
    wins.forEach(w => {
      w.el.classList.toggle('is-min', w.min);
      w.el.classList.toggle('is-focused', w.id === f);
      w.el.style.zIndex = w.min ? 0 : stack.indexOf(w.id) + 1;
      w.task.classList.toggle('is-active', w.id === f);
      w.task.classList.toggle('is-min', w.min);
      w.task.setAttribute('aria-pressed', w.id === f);
    });
  }

  const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); };
  new ResizeObserver(schedule).observe(layer);

  /* ---------- Conexión con el escritorio ---------- */
  D.root.addEventListener('desktop:open', e => open(e.detail));

  /* ---------- API pública ---------- */
  window.Portfolio.windows = {
    open, close, minimize, restore, focus, toggle,
    get: id => wins.get(id) || null,
    list: () => [...wins.values()].map(({ id, label, min }) => ({ id, label, minimized: min, focused: id === focused() })),
    register(id, fn) { providers[id] = fn; const w = wins.get(id); if (w) fill(w); }
  };
})();
