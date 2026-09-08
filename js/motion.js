/* quem pediu menos movimento no sistema: sem animação de troca, vídeo parado */

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* tira o autoplay dos vídeos e mostra os controles. age em qualquer
   video[autoplay], então vídeo novo já entra coberto. */
export function initVideos() {
  if (!reduceMotion) { return; }
  for (const video of document.querySelectorAll('video[autoplay]')) {
    video.removeAttribute('autoplay');
    video.controls = true;
    video.pause();
  }
}
