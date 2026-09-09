/* ponto de entrada. cada módulo cuida de uma coisa e expõe um init;
   a ordem aqui é a mesma do script único de antes. */

import { sync } from './strings.js';
import { initTheme } from './theme.js';
import { initLang } from './lang.js';
import { initReel } from './reel.js';
import { initVideos } from './motion.js';
import { initLightbox } from './lightbox.js';
import { initFilter } from './filter.js';
import { initReveal } from './reveal.js';

initTheme();
initLang();
/* antes do sync, que aplica os aria-label dos cards do carrossel */
initReel();
sync();
initVideos();
initLightbox();
initFilter();
/* por último: observa tudo que já está no DOM, carrossel incluído */
initReveal();
