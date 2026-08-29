// games.js - behavior for Games dashboard (demo mode)

(() => {
  const frame = document.getElementById('game-frame');
  const launchButtons = Array.from(document.querySelectorAll('.game-launch'));
  const stopBtn = document.getElementById('game-stop');

  // Build a likely external URL (source repo) from the data-slug stored on the card.
  // These are placeholders; when you're ready we can replace them with exact URLs or local copies.
  function externalUrlFromSlug(slug) {
    // GitHub Pages site for the public collection we referenced earlier
    return `https://git-hub-games.github.io/play/${slug}.html`;
  }

  function loadDemoInFrame(title, slug) {
    if (!frame) return;
    const ext = externalUrlFromSlug(slug);
    const demoHtml = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial;display:flex;align-items:center;justify-content:center;height:100vh;background:#0b0d12;color:#e2e8f0"><div style="text-align:center;padding:20px;max-width:760px"><h2 style="color:#00ff9d">${escapeHtml(title)}</h2><p style="color:#94a3b8">This is a demo placeholder for the game. When you add the real game files or a direct link, this iframe will load the game. For now you can open the original source in a new tab.</p><p style=\"margin-top:18px\"><a href=\"${ext}\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"padding:10px 14px;background:#00ff9d;color:#000;border-radius:8px;text-decoration:none;font-weight:700\">Open original source</a></p></div></body></html>`;
    // Use srcdoc so we don't try to load external content yet
    frame.srcdoc = demoHtml;
    frame.removeAttribute('src');
    frame.focus();
  }

  function stopFrame() {
    if (!frame) return;
    frame.srcdoc = '';
    frame.src = '';
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  launchButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.game-card');
      const title = card ? (card.querySelector('h4')||{textContent:''}).textContent : 'Game';
      const slug = card ? (card.getAttribute('data-slug')||'') : '';
      loadDemoInFrame(title, slug);
    });
  });

  // Allow keyboard Enter on the card to launch
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const btn = card.querySelector('.game-launch');
        if (btn) btn.click();
      }
    });
  });

  if (stopBtn) stopBtn.addEventListener('click', (e) => { e.preventDefault(); stopFrame(); });

})();
