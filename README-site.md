# BRS Administração de Obras | Site e materiais digitais

Projeto estático que reúne o site institucional, portfólio institucional, proposta-modelo, briefing de orçamento, página de contato e página compacta de links.

## Estrutura

`dist/` é a raiz publicada, definida em `.openai/hosting.json`.

```text
dist/
  index.html
  contato/index.html
  orcamento/index.html
  portfolio/index.html
  propostas/index.html
  assets/
    branding/       # versões otimizadas usadas pelo site
    images/titles/  # títulos convertidos em imagens
    icons/
    fonts/
    css/
    js/
```

As pastas `sobre/`, `empreendimentos/`, `investidores/`, `portfolio/projeto-01/`, `portfolio/projeto-02/` e `propostas/proposta-cliente/` têm arquivos de orientação para futuras páginas e cases. Elas não são páginas publicadas e não contêm cases inventados.

## Edição centralizada

Edite primeiro `dist/assets/js/config.js`. Esse arquivo concentra nome, tagline, região, links de contato, serviços, método e dados da proposta-modelo. Os textos institucionais permanecem no HTML.

Antes de publicar para clientes, substitua os placeholders de WhatsApp e e-mail indicados em `contact.whatsappLabel`, `contact.whatsappUrl`, `contact.emailLabel` e `contact.emailUrl`.

## Portfólio

- Tela: `/portfolio/`
- A4: `/portfolio/?layout=a4`
- Impressão/PDF: use o botão “Salvar em PDF”.

Os cases seguem como placeholders até a BRS aprovar dados, imagens e autorização de divulgação.

## Propostas

- Modelo: `/propostas/?id=modelo`
- Dados: objeto `proposals` em `dist/assets/js/config.js`.

A rota usa `noindex,nofollow` e é bloqueada em `robots.txt`, mas isso não protege informação confidencial. Propostas reais precisam de autenticação, links assinados com expiração ou área privada no servidor.

## Tipografia

- Textos: Roboto local em WOFF2.
- Títulos Ethnocentric: imagens finais em `dist/assets/images/titles/`.

A fonte Ethnocentric não é incorporada. Para atualizar os títulos, execute `scripts/generate-title-assets.mjs` com `ETHNOCENTRIC_FONT` apontando para uma cópia licenciada instalada localmente.

## Exportação de PDF

Com Python 3 e as dependências `weasyprint` e `lxml` instaladas:

```bash
python3 scripts/render-pdfs.py
```

Os arquivos são gravados em `exports/`; `BRS_OUTPUT_DIR` permite selecionar outro destino.

## Identidade oficial

Os masters recebidos estão em `assets/branding/kit-oficial/` e são mantidos separados dos arquivos otimizados servidos pelo site em `dist/assets/branding/`. Trate o kit como referência somente leitura.

Formulários, armazenamento de propostas e acesso privado exigem integração de servidor antes do uso com dados reais de clientes.
