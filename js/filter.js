/* filtro dos projetos por ferramenta. a lista de botões sai das tags dos
   próprios cards, então um projeto novo entra no filtro sem mexer aqui.
   clicar em mais de uma ferramenta mostra quem usa qualquer uma delas. */

export function initFilter() {
  const filter = document.querySelector('.filter');
  const cards = Array.from(document.querySelectorAll('.project'), (el) => ({
    el,
    tools: Array.from(el.querySelectorAll('.tags span'), (span) => span.textContent.trim())
  }));

  if (!filter || !cards.length) { return; }

  const names = [];
  for (const card of cards) {
    for (const tool of card.tools) {
      if (names.indexOf(tool) === -1) { names.push(tool); }
    }
  }
  names.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

  let selected = [];

  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = 'filter-all';
  allBtn.innerHTML = '<span lang="en">all</span><span lang="pt-BR">todas</span>';
  filter.appendChild(allBtn);

  const toolBtns = names.map((name) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-tool', name);
    btn.textContent = name;
    filter.appendChild(btn);
    return btn;
  });

  /* card fora do filtro fica hidden. como :first-of-type e :last-child deixam
     de valer, o primeiro e o último visíveis recebem .is-first e .is-last */
  const render = () => {
    const visible = [];
    for (const card of cards) {
      const match = !selected.length || card.tools.some((tool) => selected.indexOf(tool) !== -1);
      card.el.hidden = !match;
      card.el.classList.remove('is-first');
      card.el.classList.remove('is-last');
      if (match) { visible.push(card.el); }
    }
    if (visible.length) {
      visible[0].classList.add('is-first');
      visible[visible.length - 1].classList.add('is-last');
    }
    allBtn.setAttribute('aria-pressed', selected.length ? 'false' : 'true');
    for (const btn of toolBtns) {
      btn.setAttribute('aria-pressed', selected.indexOf(btn.getAttribute('data-tool')) !== -1 ? 'true' : 'false');
    }
  };

  allBtn.addEventListener('click', () => {
    selected = [];
    render();
  });

  for (const btn of toolBtns) {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-tool');
      const i = selected.indexOf(name);
      if (i === -1) { selected.push(name); } else { selected.splice(i, 1); }
      render();
    });
  }

  render();
}
