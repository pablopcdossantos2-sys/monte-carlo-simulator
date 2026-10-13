# Como usar no computador — guia para iniciantes

Você pode usar o simulador de duas maneiras. A mais simples não exige instalação.

## Opção A — versão offline, recomendada

No repositório existe o arquivo:

    offline.html

Ele contém a interface, os estilos e o motor do simulador em um único arquivo.

### Como abrir

1. Baixe o arquivo `offline.html`.
2. Localize o arquivo na pasta Downloads.
3. Dê dois cliques nele.
4. O navegador padrão abrirá o simulador.

Não é necessário:

- instalar Python;
- instalar Node.js;
- usar PowerShell;
- usar Prompt de Comando;
- configurar um servidor.

Os cálculos são executados no próprio navegador.

### Como guardar uma cópia

Você pode colocar `offline.html` em qualquer pasta, pendrive ou computador. Ele não depende dos outros arquivos do repositório para funcionar.

## Opção B — executar o projeto completo localmente

Esta opção é mais indicada para quem deseja editar ou desenvolver o código.

### Pré-requisito

Tenha Python 3 instalado.

### Windows

1. Baixe o repositório como ZIP no GitHub.
2. Extraia o ZIP.
3. Abra a pasta extraída.
4. Clique na barra de endereço do Explorador de Arquivos.
5. Digite `cmd` e pressione Enter.
6. Na janela que abrir, digite:

       python -m http.server 8000

   Se o comando `python` não funcionar, tente:

       py -m http.server 8000

7. Abra o navegador e acesse:

       http://localhost:8000

### Para encerrar

Volte à janela do terminal e pressione:

    Ctrl + C

## Por que o projeto completo usa um pequeno servidor local?

A versão de desenvolvimento separa o código em arquivos diferentes, como:

- `index.html`;
- `styles.css`;
- `app.js`;
- `core.js`.

Navegadores aplicam restrições a módulos JavaScript quando um projeto é aberto diretamente por `file://`.

O pequeno servidor local resolve isso.

A versão `offline.html` existe justamente para quem não quer lidar com esse detalhe técnico.

## Privacidade

Nos dois modos, a simulação ocorre no navegador.

O projeto não possui backend próprio para receber o histórico de trades inserido pelo usuário.

## Qual opção devo escolher?

Se você quer **usar a ferramenta**, escolha `offline.html`.

Se você quer **estudar, modificar ou contribuir com o código**, use o projeto completo.
