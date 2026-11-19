// accent.js: add <script src="accent.js"></script> to any page to get the color picker (bottom-left).
(function () {
  const COLORS = { green: '#00ff9d', cyan: '#22d3ee', orange: '#ff8a1f', pink: '#f472b6', purple: '#a78bfa' };
  const root = document.documentElement;
  const read = () => { try { return localStorage.getItem('f286-accent'); } catch (e) { return null; } };

  function apply(name) {
    if (!COLORS[name]) name = 'green';
    root.style.setProperty('--accent-color', COLORS[name]);
    root.style.setProperty('--accent-glow', COLORS[name] + '33');
    root.dataset.accent = name;
    try { localStorage.setItem('f286-accent', name); } catch (e) {}
    document.querySelectorAll('.accent-dot').forEach(b => b.classList.toggle('on', b.dataset.c === name));
  }
  apply(read());

  // recolor the glows that style.css hard-codes in green
  const css = document.createElement('style');
  css.textContent = `
    .container{box-shadow:0 8px 32px rgba(0,0,0,.5),0 0 20px var(--accent-glow)}
    .arcade-container{box-shadow:0 0 25px var(--accent-glow)}
    .info-btn{box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 18px var(--accent-glow)}
    .game-card:hover{box-shadow:0 8px 22px rgba(0,0,0,.45),0 0 14px var(--accent-glow)}
    .feature-item:hover{border-color:var(--accent-color)}
    button:hover{box-shadow:0 0 12px var(--accent-glow)}
    #accentPicker{position:fixed;left:20px;bottom:20px;display:flex;gap:8px;z-index:100;padding:8px 10px;background:var(--card-bg,#161922);border:1px solid var(--border-color,#262b38);border-radius:20px}
    .accent-dot{width:18px;height:18px;padding:0;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:transform .12s}
    .accent-dot:hover{transform:scale(1.2);box-shadow:none}
    .accent-dot.on{border-color:#fff}
    @media(max-width:700px){#accentPicker{left:12px;bottom:12px}}`;
  document.head.appendChild(css);

  document.addEventListener('DOMContentLoaded', () => {
    const box = document.createElement('div');
    box.id = 'accentPicker';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Accent color');
    Object.keys(COLORS).forEach(n => {
      const b = document.createElement('button');
      b.className = 'accent-dot'; b.dataset.c = n; b.type = 'button';
      b.setAttribute('aria-label', n); b.title = n;
      b.style.background = COLORS[n];
      b.addEventListener('click', () => apply(n));
      box.appendChild(b);
    });
    document.body.appendChild(box);
    apply(read());
  });

  window.F286 = { setAccent: apply, colors: Object.keys(COLORS) };
})();
