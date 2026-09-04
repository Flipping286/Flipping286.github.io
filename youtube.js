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
      }
    } catch (e) {}
    const m = input.match(/[A-Za-z0-9_-]{11}/);
    return m ? m[0] : '';
  }

  function setPlayerSrc(value) {
    const player = document.getElementById('player');
    if (!player) return;
    if (!value) { player.src = ''; return; }
    if (value.includes('youtube-nocookie.com/embed')) {
      player.src = value;
    } else {
      player.src = `https://www.youtube-nocookie.com/embed/${value}`;
    }
  }

  // Global function so onclick="loadVideo()" in your HTML works instantly!
  window.loadVideo = function() {
    const input = document.getElementById('videoUrl');
    if (!input) return;
    const raw = input.value.trim();
    if (!raw) return;
    const idOrSrc = extractVideoId(raw);
    if (!idOrSrc) return;
    setPlayerSrc(idOrSrc);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('videoUrl');
    const loadBtn = document.getElementById('loadBtn');

    if (loadBtn && input) {
      loadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.loadVideo();
      });
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { 
          e.preventDefault(); 
          window.loadVideo(); 
        }
      });
    }
  });

  // Stealth Tab Disguise specifically for the YouTube page
  let originalTitleYT = document.title;
  window.addEventListener("blur", () => { document.title = "Home - Classroom"; });
  window.addEventListener("focus", () => { document.title = originalTitleYT; });
})();
