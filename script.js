(function () {
  'use strict';

  var bg = document.getElementById('bgVideo');
  var soundBtn = document.getElementById('soundBtn');
  var soundLabel = document.getElementById('soundLabel');
  var modal = document.getElementById('videoModal');
  var pdfModal = document.getElementById('pdfModal');
  var cardVideo = document.getElementById('cardVideo');
  var toast = document.getElementById('toast');
  var toastTimer;
  var soundOn = false;
  var bgWasPlaying = false;

  function setSoundUI(on) {
    soundBtn.classList.toggle('on', on);
    soundBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    soundLabel.textContent = on ? 'SOUND ON' : 'SOUND OFF';
  }

  function enableSound() {
    bg.muted = false;
    bg.volume = 0.85;
    var p = bg.play();
    if (p && p.catch) p.catch(function () {});
    soundOn = true;
    setSoundUI(true);
  }

  function disableSound() {
    bg.muted = true;
    soundOn = false;
    setSoundUI(false);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3400);
  }

  var initial = bg.play();
  if (initial && initial.catch) initial.catch(function () {});

  soundBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    if (soundOn) disableSound(); else enableSound();
  });

  document.addEventListener('pointerdown', function (event) {
    if (event.target && event.target.closest && event.target.closest('#soundBtn')) return;
    if (!soundOn) enableSound();
  }, { passive: true });

  document.addEventListener('keydown', function (event) {
    if (!soundOn && (event.key === 'Enter' || event.key === ' ')) enableSound();
    if (event.key === 'Escape' && (!modal.hidden || !pdfModal.hidden)) closeAll();
  });

  function openModal() {
    bgWasPlaying = !bg.paused;
    bg.pause();
    modal.hidden = false;
    cardVideo.load();
    var p = cardVideo.play();
    if (p && p.catch) p.catch(function () {});
  }

  function openPdf() {
    bgWasPlaying = !bg.paused;
    bg.pause();
    pdfModal.hidden = false;
  }

  function closeAll() {
    cardVideo.pause();
    modal.hidden = true;
    pdfModal.hidden = true;
    if (bgWasPlaying) {
      var p = bg.play();
      if (p && p.catch) p.catch(function () {});
    }
  }

  document.querySelectorAll('[data-close]').forEach(function (element) {
    element.addEventListener('click', closeAll);
  });

  document.querySelectorAll('.option').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!soundOn) enableSound();
      var action = button.getAttribute('data-action');

      if (action === 'pdf') {
        window.location.href = 'pdf.html';
      } else if (action === 'video') {
        openModal();
      } else if (action === 'patrika') {
        window.location.href = 'patrika.html';
      } else {
        showToast('तीसरा विकल्प जल्द ही आएगा।');
      }
    });
  });
})();
