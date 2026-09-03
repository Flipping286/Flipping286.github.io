// youtube.js — loads a YouTube no-cookie embed from a URL or ID
(() => {
  function extractVideoId(input) {
    if (!input) return "";
    input = input.trim();
    if (input.includes('youtube-nocookie.com/embed')) return input;
    try {
      const maybeUrl = input.startsWith('http') ? input : (input.includes('.') ? `https://${input}` : input);
      const u = new URL(maybeUrl);
      const host = u.hostname.toLowerCase();
      if (host.includes('youtu.be')) {
        return u.pathname.replace(/^\/+/, '').split('?')[0];
      }
      if (host.includes('youtube.com')) {
        const v = u.searchParams.get('v');
        if (v) return v;
        // Added support for youtube.com/embed/ links too
        const segments = u.pathname.split('/');
        const embedIdx = segments.indexOf('embed');
        if (embedIdx !== -1 && segments[embedIdx + 1]) {
          return segments[embedIdx + 1];
        }
      }
    } catch (e) {}
    const m = input.match(/[A-Za-z0-9_-]{11}/);
    return m ? m[0] : '';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('videoUrl');
    const loadBtn = document.getElementById('loadBtn');
    const player = document.getElementById('player');
    const homeUI = document.getElementById('homeUI');
    const youtubeUI = document.getElementById('youtubeUI');
    const panicUI = document.getElementById('panicUI');

    // Helper to make sure the dashboard actually shows up when loaded
    function showYDashboard() {
      if (homeUI) homeUI.style.display = "none";
      if (youtubeUI) youtubeUI.style.display = "block";
      if (panicUI) panicUI.style.display = "none";
    }

    function setPlayerSrc(value) {
      if (!player) return;
      if (!value) { player.src = ''; return; }
      if (value.includes('youtube-nocookie.com/embed')) {
        player.src = value;
      } else {
        player.src = `https://www.youtube-nocookie.com/embed/${value}`;
      }
      // Reveal the YouTube dashboard UI once the source is set!
      showYDashboard();
    }

    if (loadBtn && input) {
      loadBtn.addEventListener('click', () => {
        const raw = input.value.trim();
        if (!raw) return;
        const idOrSrc = extractVideoId(raw);
        if (!idOrSrc) return;
        setPlayerSrc(idOrSrc);
      });
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); if (loadBtn) loadBtn.click(); }
      });
    }
  });

  // Stealth Tab Disguise specifically for the YouTube page
  let originalTitleYT = document.title;
  window.addEventListener("blur", () => { document.title = "Home - Classroom"; });
  window.addEventListener("focus", () => { document.title = originalTitleYT; });
})();
