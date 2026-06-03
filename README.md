## Portfólio — Versão atualizada (React + Vite)

Esta cópia do portfólio adiciona interações avançadas, um grid de projetos com pré-visualização, um componente hero 3D leve e pequenas animações de shader para dar mais profundidade.

Como rodar localmente

```bash
npm install
npm run dev
```

Build de produção

```bash
npm run build
npm run preview
```

Principais funcionalidades

- Grid de projetos interativo com pré-visualização em modal
- Animações com `GSAP` e `Framer Motion`
- Pequeno shader de fundo em `PreviewModal` usando `three.js`
- Cena 3D no hero usando `@react-three/fiber`
- Preloader e cursor customizado
- Acessibilidade básica: navegação por teclado, roles e fechamento com `Escape`

Configuração de email

- Crie um arquivo `.env` na raiz do projeto.
- Adicione `RESEND_API_KEY=seu_token_aqui` para habilitar envio de e-mails (server.js já espera essa variável).

Fontes e assets

- A tipografia `Citadel` está sendo importada via CDN em `src/index.css`. Se o CDN retornar erro (500), copie os arquivos de fonte para `public/fonts/` e adicione um `@font-face` em `src/index.css`.
- Substitua imagens em `src/data/projects.js` pelos seus próprios thumbnails e atualize `repo`/`deploy`.

Otimização e deploy

- Recomendo converter imagens para WebP e usar compressão.
- Para deploy estático, utilize Vercel, Netlify ou Cloudflare Pages apontando para a pasta `dist` gerada por `npm run build`.

Próximos passos sugeridos

- Ajustar mobile/fallbacks de shader (remoção em dispositivos lentos)
- Implementar pré-busca de imagens e placeholders (blur-up)
- Testes E2E e otimização de bundle

Licença

- Código: livre para uso.
- Imagens: verifique licenças antes de publicar.
