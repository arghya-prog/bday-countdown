const letters = document.querySelectorAll('.letter');

letters.forEach((letter) => {
  let startY = 0;
  let moved = 0;
  let dragging = false;

  const begin = (clientY) => {
    dragging = true;
    startY = clientY;
    moved = letter.classList.contains('open') ? -120 : 0;
  };

  const update = (clientY) => {
    if (!dragging) return;
    const delta = clientY - startY;
    moved = Math.max(-120, Math.min(0, moved + delta));
    startY = clientY;
    letter.style.transform = `translateY(${moved}px)`;
  };

  const finish = () => {
    if (!dragging) return;
    dragging = false;

    if (moved < -55) {
      letter.classList.add('open');
      letter.style.transform = 'translateY(-58%)';
    } else {
      letter.classList.remove('open');
      letter.style.transform = 'translateY(0)';
    }
  };

  letter.addEventListener('pointerdown', (event) => {
    letter.setPointerCapture(event.pointerId);
    begin(event.clientY);
  });

  letter.addEventListener('pointermove', (event) => {
    update(event.clientY);
  });

  letter.addEventListener('pointerup', finish);
  letter.addEventListener('pointercancel', finish);

  letter.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      letter.classList.add('open');
      letter.style.transform = 'translateY(-58%)';
    }
    if (event.key === 'ArrowDown' || event.key === 'Escape') {
      event.preventDefault();
      letter.classList.remove('open');
      letter.style.transform = 'translateY(0)';
    }
  });
});
