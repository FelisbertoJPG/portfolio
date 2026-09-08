/* texto que não existe como elemento no HTML e precisa dos dois idiomas:
   rótulo do botão de idioma, aria-label dos botões da nav e do lightbox
   e o que vive em data-label-en / data-label-pt. */

const root = document.documentElement;

const STRINGS = {
  'en': {
    themeLabel: 'Toggle light and dark theme',
    langButton: 'PT',
    langLabel: 'Ver este site em português',
    lightboxLabel: 'Enlarged view'
  },
  'pt-BR': {
    themeLabel: 'Alternar tema claro e escuro',
    langButton: 'EN',
    langLabel: 'View this site in English',
    lightboxLabel: 'Visualização ampliada'
  }
};

export function currentLang() {
  return root.getAttribute('data-lang') === 'pt-BR' ? 'pt-BR' : 'en';
}

/* reaplica todo texto que vive em atributo ou é gerado aqui */
export function sync() {
  const lang = currentLang();
  const t = STRINGS[lang];
  const themeBtn = document.querySelector('.theme-toggle');
  const langBtn = document.querySelector('.lang-toggle');
  const lightbox = document.querySelector('.lightbox');

  themeBtn.setAttribute('aria-label', t.themeLabel);
  langBtn.textContent = t.langButton;
  langBtn.setAttribute('aria-label', t.langLabel);
  lightbox.setAttribute('aria-label', t.lightboxLabel);
  for (const el of document.querySelectorAll('[data-label-en]')) {
    el.setAttribute('aria-label', lang === 'pt-BR' ? el.getAttribute('data-label-pt') : el.getAttribute('data-label-en'));
  }
}
