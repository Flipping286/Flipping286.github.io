// games.js - improved behavior: load local games into the iframe (in-page) and attempt fullscreen.
// For external games we try to load in the iframe first but do NOT redirect automatically.
// If embedding is not possible, an "Open in new tab" control will appear so the user can open it manually.
(function(){
  const frame = document.getElementById('game-frame');
  const stopBtn = document.getElementById('game-stop');
  const grid = document.getElementById('gamesGrid');

  // Helper: show the iframe area and set src
  function showInFrame(src) {
    if (!frame) return;
    frame.style.visibility = 'visible';
    frame.style.height = '560px';
    frame.style.border = '1px solid var(--border-color)';
    frame.src = src;
    // try to focus
    try { frame.focus(); } catch (e){}
    // try to request fullscreen on the iframe element (may be blocked for cross-origin)
    try {
      if (frame.requestFullscreen) frame.requestFullscreen();
      else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
    } catch (err) {
      // ignore; user can use the Open button if needed
    }
  }

  function clearFrame() {
    if (!frame) return;
    frame.src = '';
    frame.style.height = '0';
    frame.style.visibility = 'hidden';
    // try to exit fullscreen
    try { if (document.exitFullscreen) document.exitFullscreen(); } catch (e){}
    // hide external open button if present
    const openBtn = document.getElementById('open-external-btn');
    if (openBtn) openBtn.style.display = 'none';
  }

  // ensure stop button clears
  if (stopBtn) stopBtn.addEventListener('click', (e)=>{ e.preventDefault(); clearFrame(); });

  // create or return the Open in new tab button (placed next to stop)
  function ensureOpenButton() {
    let btn = document.getElementById('open-external-btn');
    if (btn) return btn;
    // find the controls area (same parent as stop button)
    const controls = stopBtn ? stopBtn.parentElement : document.body;
    btn = document.createElement('a');
    btn.id = 'open-external-btn';
    btn.textContent = 'Open in new tab';
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.style.marginLeft = '12px';
    btn.className = 'info-btn'; // reuse the same visual style
    btn.style.display = 'none';
    controls.appendChild(btn);
    return btn;
  }

  function isLocalSrc(src) {
    if (!src) return false;
    // treat relative paths or same-origin absolute URLs as local
    try {
      const u = new URL(src, location.href);
      return u.origin === location.origin;
    } catch (e) {
      // malformed -> treat as relative/local
      return true;
    }
  }

  // click handler: prefer data-src (local), then data-external, then data-slug
  grid && grid.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.game-launch');
    if (!btn) return;
    e.preventDefault();
    const card = btn.closest && btn.closest('.game-card');
    const slug = card ? card.getAttribute('data-slug') : '';
    const srcAttr = btn.getAttribute('data-src');
    const externalAttr = btn.getAttribute('data-external');

    // Determine target URL
    let target = '';
    if (srcAttr) target = srcAttr;
    else if (externalAttr) target = externalAttr;
    else if (slug) target = `https://git-hub-games.github.io/play/${slug}.html`;

    if (!target) return;

    // If it's local (same origin or relative path), load in iframe
    if (isLocalSrc(target)) {
      showInFrame(target);
      // hide open button (not needed)
      const ob = ensureOpenButton(); ob.style.display = 'none';
      return;
    }

    // External source: try to load in iframe first (doesn't redirect automatically)
    showInFrame(target);

    // show Open in new tab button so user can choose to open manually if embedding blocked
    const openBtn = ensureOpenButton();
    openBtn.href = target;
    openBtn.style.display = 'inline-flex';
  });

  // keyboard accessibility: allow Enter to activate Launch button when card is focused
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const btn = card.querySelector('.game-launch');
        if (btn) btn.click();
      }
    });
  });

  // Live Search Filter Function
  window.filterGames = function() {
    let input = document.getElementById('gameSearch');
    if (!input) return;
    let filter = input.value.toLowerCase();
    let cards = document.getElementsByClassName('game-card');
    let visibleCount = 0;

    for (let i = 0; i < cards.length; i++) {
      let title = cards[i].getElementsByClassName('game-title')[0];
      if (title) {
        let textValue = title.textContent || title.innerText;
        if (textValue.toLowerCase().indexOf(filter) > -1) {
          cards[i].style.display = "flex";
          visibleCount++;
        } else {
          cards[i].style.display = "none";
        }
      }
    }

    let noResultsMsg = document.getElementById('no-results');
    if (noResultsMsg) {
      if (visibleCount === 0) {
        noResultsMsg.style.display = "block";
      } else {
        noResultsMsg.style.display = "none";
      }
    }
  };

})();
