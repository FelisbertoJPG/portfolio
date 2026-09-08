/* o texto do idioma que entra chega embaralhado e se resolve caractere a
   caractere. fonte mono e frase curta aguentam isso sem mexer no layout;
   texto longo em fonte proporcional trocaria de largura a cada frame, então
   recebe um fade. só anima o que está na tela no momento do clique. */

const root = document.documentElement;

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const LETTER = /[0-9A-Za-zÀ-ÿ]/;
const SCRAMBLE_MAX = Infinity;   /* 40 devolve o fade aos textos de mais de uma linha */
const STEP = 34;           /* intervalo entre sorteios de caractere, em ms */
const FADE = 300;          /* precisa bater com a duração de .lang-fade em css/lang.css */
let running = null;

/* devolve sempre o mesmo número de caracteres do texto final; é isso que
   segura o layout no lugar durante a animação */
function scrambled(text, progress) {
  const cut = Math.ceil(text.length * progress);
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text.charAt(i);
    /* espaço e pontuação ficam de pé, o que segura o formato das palavras */
    out += (i < cut || !LETTER.test(ch)) ? ch : GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
  }
  return out;
}

export function decode() {
  if (running) { running(); }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const jobs = [];
  const faded = [];
  let total = 0;
  let order = 0;
  let node;

  while ((node = walker.nextNode())) {
    const text = node.nodeValue;
    const el = node.parentElement;
    if (!el || !LETTER.test(text)) { continue; }
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') { continue; }
    /* só entra o texto que de fato troca de idioma: o que está marcado com
       lang e o botão de idioma da nav, cujo rótulo o sync() reescreve (o de
       tema é um ícone, sem texto). nome próprio, título de projeto e nome de
       tecnologia ficam parados. */
    const scope = el.closest('[lang]');
    if ((!scope || scope === root) && !el.closest('.switch')) { continue; }
    /* rect zerado cobre o idioma inativo, o lightbox fechado e o que saiu da tela */
    const box = el.getBoundingClientRect();
    if (!box.width || box.bottom < 0 || box.top > window.innerHeight) { continue; }

    const delay = order * 15;
    order++;
    const mono = window.getComputedStyle(el).fontFamily.indexOf('Mono') !== -1;

    if (mono || text.trim().length <= SCRAMBLE_MAX) {
      const dur = Math.min(260 + text.length * 8, 900);
      jobs.push({ node, text, delay, dur, done: false });
      node.nodeValue = scrambled(text, 0);
      total = Math.max(total, delay + dur);
    } else if (faded.indexOf(el) === -1) {
      faded.push(el);
      el.style.animationDelay = delay + 'ms';
      el.classList.add('lang-fade');
      total = Math.max(total, delay + FADE);
    }
  }

  if (!total) { return; }
  document.body.setAttribute('aria-busy', 'true');

  let frame = 0;
  let start = 0;
  let lastDraw = 0;

  const finish = () => {
    cancelAnimationFrame(frame);
    for (const j of jobs) { j.node.nodeValue = j.text; }
    for (const el of faded) {
      el.classList.remove('lang-fade');
      el.style.animationDelay = '';
    }
    document.body.removeAttribute('aria-busy');
    running = null;
  };
  running = finish;

  const tick = (now) => {
    if (!start) { start = now; lastDraw = now - STEP; }
    const draw = now - lastDraw >= STEP;
    if (draw) { lastDraw = now; }

    for (const j of jobs) {
      if (j.done) { continue; }
      const p = (now - start - j.delay) / j.dur;
      if (p >= 1) { j.node.nodeValue = j.text; j.done = true; continue; }
      if (draw) { j.node.nodeValue = scrambled(j.text, p < 0 ? 0 : p); }
    }

    if (now - start < total) { frame = requestAnimationFrame(tick); } else { finish(); }
  };
  frame = requestAnimationFrame(tick);
}
