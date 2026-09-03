// Video Dashboard Player
(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("videoUrl");
    const loadBtn = document.getElementById("loadBtn");
    const player = document.getElementById("player");

    if (!input || !loadBtn || !player) {
      console.error("Video dashboard: required elements were not found.");
      return;
    }

    function extractVideoId(value) {
      if (!value) return "";

      const inputValue = value.trim();

      // Plain 11-character video ID
      if (/^[A-Za-z0-9_-]{11}$/.test(inputValue)) {
        return inputValue;
      }

      try {
        let urlValue = inputValue;

        // Allow URLs without https://
        if (!/^https?:\/\//i.test(urlValue)) {
          urlValue = "https://" + urlValue;
        }

        const url = new URL(urlValue);
        const host = url.hostname.toLowerCase();

        // Short links
        if (host === "youtu.be" || host.endsWith(".youtu.be")) {
          const id = url.pathname.replace(/^\/+/, "").split("/")[0];

          if (/^[A-Za-z0-9_-]{11}$/.test(id)) {
            return id;
          }
        }

        // Normal watch links
        if (host === "youtube.com" || host.endsWith(".youtube.com")) {
          const watchId = url.searchParams.get("v");

          if (watchId && /^[A-Za-z0-9_-]{11}$/.test(watchId)) {
            return watchId;
          }

          // /embed/VIDEO_ID
          const embedMatch = url.pathname.match(/^\/embed\/([A-Za-z0-9_-]{11})/);

          if (embedMatch) {
            return embedMatch[1];
          }

          // /shorts/VIDEO_ID
          const shortsMatch = url.pathname.match(/^\/shorts\/([A-Za-z0-9_-]{11})/);

          if (shortsMatch) {
            return shortsMatch[1];
          }

          // /live/VIDEO_ID
          const liveMatch = url.pathname.match(/^\/live\/([A-Za-z0-9_-]{11})/);

          if (liveMatch) {
            return liveMatch[1];
          }
        }

        // Direct no-cookie embed URL
        if (
          host === "youtube-nocookie.com" ||
          host.endsWith(".youtube-nocookie.com")
        ) {
          const embedMatch = url.pathname.match(/^\/embed\/([A-Za-z0-9_-]{11})/);

          if (embedMatch) {
            return embedMatch[1];
          }
        }
      } catch (error) {
        console.warn("Could not parse video input:", error);
      }

      // Last-resort extraction from pasted text
      const fallback = inputValue.match(/[A-Za-z0-9_-]{11}/);

      return fallback ? fallback[0] : "";
    }

    function loadVideo() {
      const rawValue = input.value.trim();

      if (!rawValue) {
        player.src = "";
        input.focus();
        return;
      }

      const videoId = extractVideoId(rawValue);

      if (!videoId) {
        console.warn("No valid video ID found.");
        return;
      }

      // Normal no-cookie embed
      const embedUrl =
        `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` +
        `?rel=0`;

      player.src = embedUrl;

      console.log("Loaded video:", videoId);
    }

    // Load button
    loadBtn.addEventListener("click", loadVideo);

    // Enter key
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        loadVideo();
      }
    });
  });
})();
