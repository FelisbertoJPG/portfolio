/* carrossel das prévias. os cards saem dos próprios projetos: cada .project
   entrega o título e a mídia, então projeto novo aparece aqui sem mexer neste
   arquivo. enquanto o vídeo não existe, o card mostra o mesmo aviso de "em
   breve" do card do projeto, clonado de lá — assim o texto tem um dono só.

   o tempo de cada card não é um setTimeout: quem conta é a animação da barra
   (reel-fill, em css/reel.css) e o fim dela vira o card. pausar é parar essa
   animação, o que mantém barra e virada sempre no mesmo compasso. sob
   prefers-reduced-motion o css/base.css desliga animação, a barra nunca
   termina e o carrossel não gira sozinho: sobram as setas, que é o
   comportamento certo para quem pediu menos movimento. */

import { reduceMotion } from './motion.js';

const SIDE = 2;      /* cards visíveis de cada lado do central */
const STEP = 0.6;    /* distância entre cards, em fração da largura do card */
const SMALL = 0.78;  /* escala dos laterais */
const SWIPE = 40;    /* px de arrasto que contam como virada */

/* clona a mídia do projeto, ou o aviso de vídeo em breve quando não há mídia */
function build(project) {
  const title = project.querySelector('.project-title');
  const name = title ? title.textContent.trim() : '';

  const el = document.createElement('li');
  el.className = 'reel-card';

  const hit = document.createElement('button');
  hit.type = 'button';
  hit.className = 'reel-hit';
  hit.setAttribute('data-label-en', 'Show ' + name + ' in the project list');
  hit.setAttribute('data-label-pt', 'Ver ' + name + ' na lista de projetos');

  /* span, e não div: o quadro vive dentro de um <button>, que só aceita
     conteúdo em linha. o display vem do CSS. */
  const frame = document.createElement('span');
  frame.className = 'reel-frame';

  const source = project.querySelector('.project-media');
  let video = null;
  const copy = source ? source.cloneNode(true) : null;
  if (copy) {
    copy.className = 'reel-media';
    copy.removeAttribute('width');
    copy.removeAttribute('height');
    copy.removeAttribute('autoplay');
    if (copy.tagName === 'VIDEO') {
      copy.muted = true;
      copy.loop = true;
      copy.playsInline = true;
      copy.preload = 'metadata';
      video = copy;
    }
    frame.appendChild(copy);
  } else {
    const soon = project.querySelector('.media-placeholder');
    const wait = document.createElement('span');
    wait.className = 'reel-soon';
    if (soon) { wait.innerHTML = soon.innerHTML; }
    frame.appendChild(wait);
  }

  const label = document.createElement('span');
  label.className = 'reel-name';
  label.textContent = name;
  frame.appendChild(label);

  hit.appendChild(frame);
  el.appendChild(hit);
  return { el, hit, video, project };
}

export function initReel() {
  const reel = document.querySelector('.reel');
  const projects = Array.from(document.querySelectorAll('.project'));
  if (!reel || !projects.length) { return; }

  const stage = reel.querySelector('.reel-stage');
  const track = reel.querySelector('.reel-track');
  const meter = reel.querySelector('.reel-progress');
  if (!stage || !track || !meter) { return; }

  const cards = projects.map(build);
  for (const card of cards) { track.appendChild(card.el); }

  let active = 0;
  let hover = false;
  let held = false;      /* foco dentro do carrossel */
  let onscreen = true;

  /* distribui os cards em volta do central. a distância é a menor das duas no
     círculo, então o card dá a volta em vez de atravessar a fila inteira. */
  const place = () => {
    const n = cards.length;
    const step = cards[0].el.offsetWidth * STEP;
    cards.forEach((card, i) => {
      let d = i - active;
      if (d > n / 2) { d -= n; }
      if (d < -n / 2) { d += n; }
      const far = Math.abs(d);
      const shown = far <= SIDE;
      card.el.style.transform = 'translate(-50%, 0) translateX(' + (d * step) + 'px) scale(' + (far ? SMALL : 1) + ')';
      card.el.style.opacity = far === 0 ? '1' : (far === 1 ? '0.5' : (far === 2 ? '0.22' : '0'));
      card.el.style.zIndex = String(10 - far);
      card.el.style.pointerEvents = shown ? 'auto' : 'none';
      card.el.classList.toggle('is-active', far === 0);
      card.hit.tabIndex = shown ? 0 : -1;
    });
  };

  /* só o card central toca; os outros ficam parados no primeiro quadro */
  const play = () => {
    cards.forEach((card, i) => {
      if (!card.video) { return; }
      if (i === active && !reduceMotion) {
        const started = card.video.play();
        if (started && started.catch) { started.catch(() => {}); }
      } else {
        card.video.pause();
      }
    });
  };

  const pace = () => {
    const run = !hover && !held && onscreen && !document.hidden;
    meter.style.animationPlayState = run ? 'running' : 'paused';
  };

  /* tirar e repor a animação obriga o navegador a recomeçar a contagem */
  const restart = () => {
    meter.style.animation = 'none';
    void meter.offsetWidth;
    meter.style.animation = '';
    pace();
  };

  const go = (i) => {
    const n = cards.length;
    active = ((i % n) + n) % n;
    place();
    play();
    restart();
  };

  meter.addEventListener('animationend', () => { go(active + 1); });

  const prev = reel.querySelector('.reel-prev');
  const next = reel.querySelector('.reel-next');
  prev.addEventListener('click', () => { go(active - 1); });
  next.addEventListener('click', () => { go(active + 1); });
  if (cards.length < 2) {
    prev.hidden = true;
    next.hidden = true;
  }

  /* card lateral vem para o centro; o central leva à lista de projetos */
  cards.forEach((card, i) => {
    card.hit.addEventListener('click', () => {
      if (i !== active) { go(i); return; }
      card.project.scrollIntoView({ block: 'center' });
    });
  });

  stage.addEventListener('mouseenter', () => { hover = true; pace(); });
  stage.addEventListener('mouseleave', () => { hover = false; pace(); });
  reel.addEventListener('focusin', () => { held = true; pace(); });
  reel.addEventListener('focusout', () => { held = false; pace(); });
  document.addEventListener('visibilitychange', pace);

  reel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { go(active - 1); }
    if (event.key === 'ArrowRight') { go(active + 1); }
  });

  window.addEventListener('resize', place);

  /* carrossel fora da tela não gasta contagem nem vídeo */
  if (window.IntersectionObserver) {
    const watch = new IntersectionObserver((entries) => {
      onscreen = entries[0].isIntersecting;
      pace();
    }, { threshold: 0.2 });
    watch.observe(stage);
  }

  let from = null;
  stage.addEventListener('touchstart', (event) => { from = event.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (event) => {
    if (from === null) { return; }
    const moved = event.changedTouches[0].clientX - from;
    if (Math.abs(moved) > SWIPE) { go(active + (moved < 0 ? 1 : -1)); }
    from = null;
  });

  /* a marca liga o CSS da seção; sem ela o card não teria largura para medir */
  document.documentElement.setAttribute('data-reel', 'on');
  go(0);
}
