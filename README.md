# Portfólio — João Pedro Felisberto Schmidt

Site estático, sem build. Arquitetura herdada do portfólio do Cristian Dreyer, com
conteúdo, paleta e camada de acento próprios.

## Rodar local

Módulo ES não carrega por `file://` — precisa de servidor:

```bash
cd meusite
python -m http.server 8080     # ou: npx serve .
```

Depois abra `http://localhost:8080`.

## Estrutura

```
index.html            markup e conteúdo (os textos vivem aqui)
content/projects.json fonte de autoria dos textos dos projetos, bilíngue
css/tokens.css        paleta: neutros frios + âmbar como único acento
css/accent.css        camada de identidade (só ela muda em relação ao original)
css/*.css             um arquivo por seção
js/main.js            ponto de entrada; cada módulo expõe um init
js/reel.js            carrossel de prévias; os cards saem dos próprios projetos
js/reveal.js          fade do conteúdo conforme ele entra na tela
media/                vídeos dos projetos (vazio por enquanto)
```

## Adicionar o vídeo de um projeto

1. Grave a tela, exporte em `.mp4` e, se puder, também em `.webm` (menor).
2. Salve em `media/` com o `id` do projeto: `media/berlim.mp4`.
3. No `index.html`, troque o bloco do placeholder daquele projeto:

```html
<div class="media-placeholder"><i>&#9654;</i><span lang="en">Recording soon</span><span lang="pt-BR">Vídeo em breve</span></div>
```

por:

```html
<button class="media-zoom" type="button" data-label-en="Enlarge the screen recording of Berlim" data-label-pt="Ampliar a gravação do Berlim">
  <video class="project-media" width="1440" height="820" autoplay loop muted playsinline preload="metadata">
    <source src="media/berlim.webm" type="video/webm">
    <source src="media/berlim.mp4" type="video/mp4">
  </video>
  <span class="media-zoom-hint"><span lang="en">enlarge</span><span lang="pt-BR">ampliar</span></span>
</button>
```

`width` e `height` são as dimensões reais do vídeo — servem para reservar o espaço
antes de ele carregar, evitando que a página pule. Atualize também o campo `media`
do projeto em `content/projects.json`:

```json
"media": { "type": "video", "name": "berlim", "width": 1440, "height": 820 }
```

O carrossel de prévias, no topo da página, não precisa de nada: ele clona a
mídia do card do projeto, então o vídeo aparece lá assim que aparecer aqui.
Enquanto não existe, o card do carrossel mostra o mesmo aviso de "em breve".

O lightbox e o `prefers-reduced-motion` passam a funcionar sozinhos: `js/lightbox.js`
clona a mídia para o `<dialog>` e `js/motion.js` tira o autoplay de quem pediu menos
movimento.

## Pendências

- [ ] Formação no bloco de experiência (curso, instituição, período).
- [ ] Gravar os seis vídeos.
- [ ] Decidir se `berlim_saas` vira repositório público, para o projeto ganhar link.
- [ ] WhatsApp na lista de contatos, se quiser esse canal.
