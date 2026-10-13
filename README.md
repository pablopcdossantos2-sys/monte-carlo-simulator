# Simulador de Monte Carlo para Trading

Aplicação web gratuita, client-side e sem dependências de servidor para analisar incerteza, drawdown e risco de ruína em estratégias de trading e também simular trajetórias de preço por Movimento Browniano Geométrico (GBM).

> Projeto educacional. Simulações não são previsões e não constituem recomendação financeira.

## Formas de uso

O projeto foi desenhado deliberadamente para funcionar em dois contextos:

- **GitHub Pages** — versão web, sem backend e sem instalação;
- **PC local** — use `offline.html` com duplo clique, sem terminal e sem instalar dependências.

A versão de desenvolvimento também pode ser servida localmente para quem quiser modificar o código.

Enquanto o motor puder continuar 100% client-side, **GitHub Pages continuará sendo o modo web oficial**. Futuras funções que exijam credenciais, banco de dados, processamento pesado ou APIs privadas não serão incorporadas de maneira que quebre esse modo; deverão ser opcionais ou exclusivas da versão local.

## Objetivo educacional

A ferramenta não foi criada apenas para gerar curvas. Ela deve ensinar traders em formação a pensar em **distribuições de resultados, sobrevivência, drawdown e variabilidade**.

O principal aprendizado é:

> uma estratégia com vantagem estatística ainda pode atravessar sequências difíceis; o gerenciamento de risco determina se a conta consegue sobreviver tempo suficiente para que essa vantagem tenha chance de aparecer.

Para uma introdução passo a passo, veja [docs/GUIA-DIDATICO.md](docs/GUIA-DIDATICO.md).

## Objetivos

O projeto combina duas famílias de uso de Monte Carlo:

1. **Robustez de estratégias** — reordenação e reamostragem de trades, distribuição de equity curves, drawdown, sequências de perdas, probabilidade de lucro, risco de ruína e probabilidade de atingir uma meta antes de violar limites.
2. **Trajetórias de preço** — simulação GBM a partir de preço inicial, retorno esperado e volatilidade anualizada.

Toda a simulação roda localmente no navegador. Dados colados ou importados pelo usuário não são enviados para um servidor.

## Principais recursos

- Entrada por parâmetros: capital inicial, taxa de acerto, reward:risk, risco por trade, custos e quantidade de trades.
- Entrada por histórico: lista de P&L ou CSV com detecção de colunas comuns.
- Métodos de Monte Carlo para trades:
  - reshuffle / permutação sem reposição;
  - bootstrap com reposição;
  - block bootstrap para preservar parte da dependência serial e sequências.
- Position sizing fixo em moeda ou composto por percentual da equity.
- Regras opcionais de desafio/prop firm:
  - meta de lucro;
  - perda máxima estática;
  - trailing drawdown intraday ou EOD;
  - limite de perda diária;
  - quantidade aproximada de trades por dia.
- Métricas:
  - probabilidade de lucro;
  - risco de ruína / violação;
  - probabilidade de atingir a meta;
  - probabilidade de meta antes da violação;
  - saldo final P5/P25/P50/P75/P95;
  - drawdown máximo mediano e P95;
  - pior drawdown observado;
  - sequência máxima de perdas.
- Simulação de preço por GBM com distribuição de preços finais e VaR empírico.
- RNG com semente para resultados reproduzíveis.
- Exportação de resumo em JSON.
- Interface responsiva, adequada para GitHub Pages.
- Testes automatizados do motor matemático.

## Uso rápido

### Opção 1 — GitHub Pages

Publique o repositório com GitHub Pages e abra a URL gerada pelo GitHub.

### Opção 2 — Uso local sem terminal

Baixe `offline.html` e abra o arquivo com dois cliques. Ele é uma versão completa em arquivo único e não requer Python ou Node.js.

Tutorial detalhado: [docs/USO-LOCAL.md](docs/USO-LOCAL.md).

### Opção 3 — Projeto completo local para desenvolvimento

Como a versão de desenvolvimento usa módulos JavaScript, sirva a pasta por HTTP. Com Python 3 instalado:

    python -m http.server 8000

Depois abra no navegador:

    http://localhost:8000

Para testes locais com Node.js 20+:

    npm test

Há também um CSV de exemplo em examples/trades.csv.

## Estrutura

- index.html — interface usada no GitHub Pages.
- offline.html — versão completa em arquivo único para uso local por duplo clique.
- styles.css — estilos.
- app.js — integração entre interface, gráficos e motor.
- core.js — motor estatístico e Monte Carlo, sem dependências de DOM.
- tests/core.test.mjs — testes do motor.
- docs/METHODOLOGY.md — metodologia, premissas, limitações e referências.
- docs/GUIA-DIDATICO.md — introdução para traders que nunca usaram Monte Carlo.
- docs/USO-LOCAL.md — instruções locais para usuários sem familiaridade com terminal.
- .github/workflows/tests.yml — CI.
- package.json — comandos de teste.

## Princípios metodológicos

O simulador evita tratar uma única equity curve histórica como futuro determinístico. Ele gera distribuições de resultados e separa explicitamente métodos com objetivos diferentes:

- **Reshuffle** responde principalmente: “quanto a ordem dos mesmos trades altera o drawdown e as sequências?”
- **Bootstrap** responde: “o que ocorre se o futuro for uma nova amostra da mesma distribuição empírica?”
- **Block bootstrap** tenta preservar dependência local — útil quando ganhos e perdas aparecem em clusters.
- **Paramétrico** responde: “o que acontece sob uma hipótese explícita de win rate, payoff e position sizing?”
- **GBM** é um modelo simplificado de preço; não representa saltos, caudas pesadas, volatilidade variável nem regimes por si só.

Leia docs/METHODOLOGY.md antes de interpretar percentis como previsões.

## Fontes de inspiração e licença

A implementação deste repositório é original. Os projetos e ferramentas informados como referência foram usados para levantamento de funcionalidades e conceitos, não para copiar motores proprietários, interfaces ou datasets.

Entre os conceitos estudados estão: GBM e uso de dados históricos; VaR; reshuffle/resample de trades; Kelly; custos; distribuição de drawdowns; regras de prop firms; MFE/MAE e regimes; e execução 100% no navegador.

O repositório público do T58 informa que o motor real é proprietário; por isso apenas conceitos de alto nível foram considerados. O T58 Market Data também alerta sobre restrições de redistribuição de dados de terceiros; nenhum dataset dele é incluído aqui.

Consulte docs/METHODOLOGY.md para a matriz completa de referências.

## Publicação no GitHub Pages

Em Settings → Pages, selecione “Deploy from a branch”, escolha main e / (root). Como a aplicação é estática, não há build obrigatório.

## Aviso

Resultados de backtests e Monte Carlo dependem da qualidade e representatividade dos dados de entrada. Um Monte Carlo não corrige overfitting, viés de seleção, custos omitidos, mudanças de regime, problemas de execução ou erros no backtest original.

## Licença

MIT.