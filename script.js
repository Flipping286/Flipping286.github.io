// V!deo Loading Engine
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

// sTealtH Logic 
let typedKeys = "";
document.addEventListener('keydown', function(event) {
  
  // Panic Mode (Escape Key)
  if (event.key === 'Escape') {
    document.getElementById('mainUI').style.display = 'none';
    document.getElementById('decorLeft').style.display = 'none';
    document.getElementById('decorRight').style.display = 'none';
    document.getElementById('footerUI').style.display = 'none';
    
    document.getElementById('panicUI').style.display = 'block';
    document.getElementById('player').src = ''; // Kill audio
    document.body.style.backgroundColor = '#ffffff';
    typedKeys = ""; 
  }

  // Un-Panic Mode (Type "back")
  typedKeys += event.key.toLowerCase();
  if (typedKeys.endsWith("back")) {
    document.getElementById('mainUI').style.display = 'block';
    document.getElementById('decorLeft').style.display = 'flex';
    document.getElementById('decorRight').style.display = 'flex';
    document.getElementById('footerUI').style.display = 'block';
    
    document.getElementById('panicUI').style.display = 'none';
    document.body.style.backgroundColor = '#0b0d12'; 
    typedKeys = "";
  }
});
