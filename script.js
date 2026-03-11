// Custom audio player logic for Echoes of the Hollow landing page
// Assumes audio.mp3 is in the same folder

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const audioPlayer = document.getElementById('audio-player');
  const playPauseBtn = document.getElementById('play-pause');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');

  // Create audio element
  const audio = new Audio('audio.mp3');
  let isPlaying = false;
  let duration = 0;
  let animationFrame;

  // Graceful error handling if audio is missing
  audio.addEventListener('error', function () {
    playPauseBtn.disabled = true;
    playPauseBtn.innerHTML = '<span style="font-size:1.2em;">✖</span>';
    playPauseBtn.title = 'Audio unavailable';
    progressBar.style.background = '#555';
    durationEl.textContent = '0:00';
    currentTimeEl.textContent = '0:00';
  });

  // Format time as M:SS
  function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // Update progress bar and time
  function updateProgress() {
    if (!isNaN(audio.duration)) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = percent + '%';
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
    animationFrame = requestAnimationFrame(updateProgress);
  }

  // Set duration when loaded
  audio.addEventListener('loadedmetadata', function () {
    duration = audio.duration;
    durationEl.textContent = formatTime(duration);
  });

  // SVG icons for play/pause
  const playIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:auto;"><polygon points="6,4 20,12 6,20"/></svg>';
  const pauseIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:auto;"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';

  // Set initial icon
  playPauseBtn.innerHTML = playIcon;

  // Play/pause toggle
  playPauseBtn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', function () {
    isPlaying = true;
    playPauseBtn.innerHTML = pauseIcon;
    playPauseBtn.setAttribute('aria-label', 'Pause audio');
    animationFrame = requestAnimationFrame(updateProgress);
  });

  audio.addEventListener('pause', function () {
    isPlaying = false;
    playPauseBtn.innerHTML = playIcon;
    playPauseBtn.setAttribute('aria-label', 'Play audio');
    cancelAnimationFrame(animationFrame);
  });

  audio.addEventListener('ended', function () {
    isPlaying = false;
    playPauseBtn.innerHTML = playIcon;
    playPauseBtn.setAttribute('aria-label', 'Play audio');
    progressBar.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    cancelAnimationFrame(animationFrame);
  });

  // Seek on progress bar click
  progressContainer.addEventListener('click', function (e) {
    if (!isNaN(audio.duration)) {
      const rect = progressContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      audio.currentTime = percent * audio.duration;
      updateProgress();
    }
  });

  // Optional: Keyboard accessibility for play/pause
  playPauseBtn.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      playPauseBtn.click();
    }
  });

  // Subtle entrance animation for card
  document.querySelector('.hero-card').classList.add('animate');
});
