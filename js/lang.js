/* troca de idioma. o idioma vive em data-lang no <html>; o CSS em css/lang.css
   esconde o inativo. o texto novo entra pela animação de decode.js. */

import { sync, currentLang } from './strings.js';
import { reduceMotion } from './motion.js';
import { decode } from './decode.js';

const root = document.documentElement;

export function initLang() {
  const langBtn = document.querySelector('.lang-toggle');
  langBtn.addEventListener('click', () => {
    const next = currentLang() === 'pt-BR' ? 'en' : 'pt-BR';
    root.setAttribute('data-lang', next);
    root.lang = next;
    try { localStorage.setItem('lang', next); } catch (e) {}
    sync();
    if (!reduceMotion) { decode(); }
  });
}
