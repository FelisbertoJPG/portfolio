/* o conteúdo aparece em fade quando entra na tela, uma vez cada. a marca
   data-reveal="on" no <html> é posta aqui: sem JS, ou se o navegador não
   tiver IntersectionObserver, nada é escondido e a página vem inteira.

   o atraso em cascata vale só para quem chega na mesma leva — um card que
   entra sozinho não espera nada. */

const TARGETS = [
  '#reel .section-head',
  '.reel-stage',
  '.reel-meter',
  '#projects .section-head',
  '#projects .filter',
  '.project',
  '#experience .section-head',
  '.exp-block',
  '#stack .section-head',
  '.stack-grid > div',
  '#contact .section-head',
  '.contact-list',
  'footer .wrap'
].join(', ');

const STEP = 70;   /* ms entre um elemento e o seguinte da mesma leva */

export function initReveal() {
  if (!window.IntersectionObserver) { return; }
  const targets = Array.from(document.querySelectorAll(TARGETS));
  if (!targets.length) { return; }

  for (const el of targets) { el.setAttribute('data-reveal', ''); }
  document.documentElement.setAttribute('data-reveal', 'on');

  const watch = new IntersectionObserver((entries, self) => {
    const arrived = entries.filter((entry) => entry.isIntersecting);
    arrived.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    arrived.forEach((entry, i) => {
      entry.target.style.setProperty('--reveal-delay', (i * STEP) + 'ms');
      entry.target.classList.add('is-in');
      self.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

  for (const el of targets) { watch.observe(el); }
}
