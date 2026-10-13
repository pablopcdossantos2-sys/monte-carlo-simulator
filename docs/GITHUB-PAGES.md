# Publicar o simulador no GitHub Pages

O repositório já contém o workflow:

`.github/workflows/pages.yml`

Ele publica a aplicação estática automaticamente usando GitHub Actions.

## Ativação inicial

Essa configuração precisa ser feita uma única vez no site do GitHub:

1. Abra o repositório `pablopcdossantos2-sys/monte-carlo-simulator`.
2. Clique em **Settings**.
3. No menu lateral, abra **Pages**.
4. Em **Build and deployment**, localize **Source**.
5. Escolha **GitHub Actions**.

Não é necessário criar outro workflow pelo assistente do GitHub, pois o projeto já possui `.github/workflows/pages.yml`.

Depois dessa seleção, abra a aba **Actions** do repositório.

O workflow **Deploy GitHub Pages** será executado automaticamente em novos pushes para a branch `main`. Ele também pode ser iniciado manualmente por **Run workflow**.

## URL esperada

Como este é um Project Site, a URL padrão deverá ser:

    https://pablopcdossantos2-sys.github.io/monte-carlo-simulator/

A URL só passa a responder depois que o primeiro deployment do GitHub Pages for concluído com sucesso.

## O que acontece depois

Cada alteração enviada à branch `main` dispara automaticamente uma nova publicação.

O workflow:

1. faz checkout do repositório;
2. configura o GitHub Pages;
3. envia os arquivos estáticos;
4. publica o site no ambiente `github-pages`.

Não existe build de framework nem servidor.

## Se aparecer erro antes da ativação

É normal que o workflow de Pages falhe enquanto o repositório ainda não estiver configurado em:

**Settings → Pages → Source → GitHub Actions**

Depois de selecionar essa opção, execute novamente o workflow.

## Idiomas

A mesma URL oferece:

- Português (Brasil);
- English;
- Español.

O seletor de idioma fica no topo da página. A preferência é salva no navegador.

## Versão local

A ativação do GitHub Pages não interfere na versão local.

O arquivo `offline.html` continua podendo ser aberto diretamente no PC com dois cliques.

## Segurança e privacidade

A publicação continua sendo uma aplicação client-side.

Os dados de trades inseridos pelo usuário são processados no navegador e o projeto não possui backend próprio para receber esses dados.
