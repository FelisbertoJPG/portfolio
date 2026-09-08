/* visualização ampliada da mídia dos projetos. a mídia é clonada para dentro
   do <dialog>; os controles ficam no clone, o original segue como está. */

import { reduceMotion } from './motion.js';

export function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  const inner = lightbox.querySelector('.lightbox-inner');

  const open = (media) => {
    const copy = media.cloneNode(true);
    copy.className = 'lightbox-media';
    copy.removeAttribute('width');
    copy.removeAttribute('height');
    if (copy.tagName === 'VIDEO') {
      copy.controls = true;
      copy.muted = true;
      copy.loop = true;
      if (reduceMotion) { copy.removeAttribute('autoplay'); }
    }
    inner.innerHTML = '';
    inner.appendChild(copy);
    lightbox.showModal();
    if (!reduceMotion && copy.play) {
      const started = copy.play();
      if (started && started.catch) { started.catch(() => {}); }
    }
  };

  for (const zoom of document.querySelectorAll('.media-zoom')) {
    zoom.addEventListener('click', () => {
      const media = zoom.querySelector('.project-media');
      if (media) { open(media); }
    });
  }

  /* fecha ao clicar fora da mídia, no botão, ou com Esc (nativo do dialog) */
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target === inner || event.target.closest('.lightbox-close')) {
      lightbox.close();
    }
  });
  lightbox.addEventListener('close', () => { inner.innerHTML = ''; });
}
