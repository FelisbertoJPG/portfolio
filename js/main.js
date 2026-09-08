/* ponto de entrada. cada módulo cuida de uma coisa e expõe um init;
   a ordem aqui é a mesma do script único de antes. */

import { sync } from './strings.js';
import { initTheme } from './theme.js';
import { initLang } from './lang.js';
import { initVideos } from './motion.js';
import { initLightbox } from './lightbox.js';
import { initFilter } from './filter.js';

initTheme();
initLang();
sync();
initVideos();
initLightbox();
initFilter();
