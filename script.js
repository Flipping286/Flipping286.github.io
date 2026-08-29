//  VidEo Loading Engine
function loadVideo() {
  const input = document.getElementById('videoUrl').value.trim();
  const player = document.getElementById('player');
  
  let videoId = input;
  if (input.includes('v=')) {
    videoId = input.split('v=')[1].split('&')[0];
  } else if (input.includes('youtu.be/')) {
    videoId = input.split('youtu.be/')[1].split('?')[0];
  }

  if (videoId) {
    player.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
  }
}

// Google Classroom Panic Button & Secret Un-Panic Key
let typedKeys = "";
document.addEventListener('keydown', function(event) {
  // Panic Mode Trigger (Escape Key)
  if (event.key === 'Escape') {
    document.getElementById('mainUI').style.display = 'none';
    document.getElementById('panicUI').style.display = 'block';
    document.getElementById('player').src = ''; // Kills the audio instantly
    document.body.style.backgroundColor = '#ffffff'; // Changes to boring white
    typedKeys = ""; // Reset secret key tracker
  }

  // Secret Un-Panic Trigger (Type "back")
  typedKeys += event.key.toLowerCase();
  if (typedKeys.endsWith("back")) {
    document.getElementById('mainUI').style.display = 'block';
    document.getElementById('panicUI').style.display = 'none';
    document.body.style.backgroundColor = '#0b0d12'; // Restores dark theme
    typedKeys = "";
  }
});
