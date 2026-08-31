(() => {
  const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;
  const MAX_KEY_BUFFER = 12;
  const SECRET = "back";

  const homeUI = document.getElementById("homeUI");
  const youtubeUI = document.getElementById("youtubeUI");
  const panicUI = document.getElementById("panicUI");

  const openYBtn = document.getElementById("openYBtn");
  const backHomeBtn = document.getElementById("backHomeBtn");
  const loadBtn = document.getElementById("loadBtn");
  const videoInput = document.getElementById("videoUrl");
  const player = document.getElementById("player");

  let keyBuffer = "";

  function showHome() {
    if (youtubeUI) youtubeUI.style.display = "none";
    if (homeUI) homeUI.style.display = "block";
    if (panicUI) panicUI.style.display = "none";
    if (player) player.src = "";
  }

  function showYDashboard() {
    if (homeUI) homeUI.style.display = "none";
    if (youtubeUI) youtubeUI.style.display = "block";
    if (panicUI) panicUI.style.display = "none";
  }

  function enterPanic() {
    if (homeUI) homeUI.style.display = "none";
    if (youtubeUI) youtubeUI.style.display = "none";
    if (panicUI) panicUI.style.display = "block";
    if (player) player.src = "";
    keyBuffer = "";
  }

  function exitPanic() {
    if (panicUI) panicUI.style.display = "none";
    showHome();
    keyBuffer = "";
  }

  function safeSetPlayerSrc(id) {
    if (!player) return;
    if (!VIDEO_ID_RE.test(id)) { return; }
    player.src = `https://www.youtube-nocookie.com/embed/${id}`;
  }

  function extractVideoId(input) {
    if (!input) return "";
    input = input.trim();
    try {
      const maybeUrl = input.startsWith("http") ? input : (input.includes(".") ? `https://${input}` : input);
      const u = new URL(maybeUrl);
      const host = u.hostname.toLowerCase();
      if (host.includes("youtu.be")) return u.pathname.replace(/^\/+/, "").split("/")[0] || "";
      if (host.includes("youtube.com")) return u.searchParams.get("v") || "";
    } catch (e) { }
    const m = input.match(/[A-Za-z0-9_-]{11}/);
    return m ? m[0] : "";
  }

  function loadVideoFromInput() {
    if (!videoInput) return;
    const id = extractVideoId(videoInput.value || "");
    if (id) {
      safeSetPlayerSrc(id);
      showYDashboard();
    } else {
      videoInput.classList.add("invalid");
      setTimeout(() => videoInput.classList.remove("invalid"), 900);
    }
  }

  if (openYBtn) openYBtn.addEventListener("click", (e) => { e.preventDefault(); showYDashboard(); if (videoInput) videoInput.focus(); });
  if (backHomeBtn) backHomeBtn.addEventListener("click", (e) => { e.preventDefault(); showHome(); });
  if (loadBtn) loadBtn.addEventListener("click", (e) => { e.preventDefault(); loadVideoFromInput(); });
  if (videoInput) videoInput.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); loadVideoFromInput(); } });

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") { enterPanic(); return; }
    const target = ev.target;
    const tag = target && target.tagName ? target.tagName.toUpperCase() : "";
    if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
    const k = ev.key.length === 1 ? ev.key.toLowerCase() : "";
    if (k && /[a-z0-9]/.test(k)) {
      keyBuffer = (keyBuffer + k).slice(-MAX_KEY_BUFFER);
      if (keyBuffer.endsWith(SECRET)) exitPanic();
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    if (homeUI) homeUI.style.display = "block";
    if (youtubeUI) youtubeUI.style.display = "none";
    if (panicUI) panicUI.style.display = "none";
  });
})();

// Tab discise. MAN I CANT SPELL DONT JUGE MEH
let originalTitle = document.title;
window.addEventListener("blur", () => { document.title = "Google Classroom"; });
window.addEventListener("focus", () => { document.title = originalTitle; });
