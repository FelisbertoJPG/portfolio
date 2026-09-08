/* troca de tema. o tema novo entra pela View Transitions API, por dentro de um
   círculo que nasce no botão (a animação está em css/theme.css). navegador sem
   suporte e quem pede menos movimento trocam direto. */

import { reduceMotion } from './motion.js';

const root = document.documentElement;

/* põe o centro do círculo no meio do botão e o raio na distância até o canto
   mais longe da tela, que é o quanto ele precisa crescer para cobrir tudo. */
function setOrigin(btn) {
  const box = btn.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.style.setProperty('--vt-x', x + 'px');
  root.style.setProperty('--vt-y', y + 'px');
  root.style.setProperty('--vt-r', r + 'px');
}

function applyTheme(next) {
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
}

export function initTheme() {
  const themeBtn = document.querySelector('.theme-toggle');
  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    if (reduceMotion || !document.startViewTransition) {
      applyTheme(next);
      return;
    }
    setOrigin(themeBtn);
    document.startViewTransition(() => applyTheme(next));
  });
}
