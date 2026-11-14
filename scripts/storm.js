const pointerMotion = matchMedia('(prefers-reduced-motion: no-preference)');
const pointerDuration = 3000;

function pointerPosition({ from, to, start }, now) {
  const progress = Math.max(0, Math.min(1, (now - start) / pointerDuration));
  return from + (to - from) * (1 - (1 - progress) ** 4);
}

function attachPointerFollow(scene) {
  let frame = 0;
  let position = 0;
  let clock = null;
  let tween = null;
  const targets = [];

  function updatePointer(now) {
    // Advance the running tween before a queued mouse event takes over.
    if (tween) position = pointerPosition(tween, now);
    for (const target of targets) {
      tween = { from: position, to: target, start: clock };
      position = pointerPosition(tween, now);
    }
    targets.length = 0;
    scene.style.setProperty('--pointer-shift', position + 'px');

    if (now - tween.start < pointerDuration) {
      clock = now;
      frame = requestAnimationFrame(updatePointer);
    } else {
      tween = null;
      clock = null;
      frame = 0;
    }
  }

  scene.addEventListener('mousemove', event => {
    if (!pointerMotion.matches) return;
    const { left, width } = scene.getBoundingClientRect();
    targets.push((event.clientX - left - width / 2) / 100);
    clock ??= performance.now();
    if (!frame) frame = requestAnimationFrame(updatePointer);
  });

  pointerMotion.addEventListener('change', () => {
    if (pointerMotion.matches) return;
    cancelAnimationFrame(frame);
    frame = 0;
    position = 0;
    clock = tween = null;
    targets.length = 0;
    scene.style.removeProperty('--pointer-shift');
  });
}

document.querySelectorAll('.storm-scene, .closing-scene').forEach(attachPointerFollow);
