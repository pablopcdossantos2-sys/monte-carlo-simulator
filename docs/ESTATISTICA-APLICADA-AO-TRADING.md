# Estatística aplicada ao trading

Este material complementa o laboratório de Probabilidade e Expectativa Matemática da aplicação.

O objetivo não é transformar o trader em estatístico, e sim fornecer intuição suficiente para evitar conclusões enganosas ao analisar win rate, payoff, amostras de trades, backtests e simulações de Monte Carlo.

## 1. Probabilidade condicional

Uma taxa de acerto global é uma média.

Ela pode esconder situações muito diferentes.

Imagine que uma estratégia opere em dois contextos:

- Contexto A: 40% dos trades, com 60% de acerto.
- Contexto B: 60% dos trades, com 35% de acerto.

O win rate global é:

    P(win) = P(A) × P(win|A) + P(B) × P(win|B)

    P(win) = 0,40 × 0,60 + 0,60 × 0,35
           = 0,45

Logo, o sistema apresenta 45% de acerto no agregado.

Mas dizer apenas “meu win rate é 45%” perde uma informação importante: a estratégia se comporta de modo muito diferente nos dois contextos.

### Aplicação prática

Em trading, o “contexto” pode ser:

- tendência versus range;
- abertura versus meio do pregão;
- volatilidade alta versus baixa;
- acima ou abaixo da VWAP;
- dia com evento macroeconômico versus dia comum;
- determinados regimes de correlação entre ativos.

A pergunta mais útil pode deixar de ser:

> Qual é meu win rate?

e passar a ser:

> Qual é meu win rate quando estas condições estão presentes?

### Relação com Monte Carlo

Um Monte Carlo paramétrico que usa sempre o mesmo win rate presume implicitamente que a probabilidade é estável.

Quando regimes diferentes possuem distribuições diferentes, pode ser melhor:

- simular os regimes separadamente;
- criar modelos que alternem regimes;
- ou reamostrar blocos históricos que preservem parte dessa estrutura.

## 2. Variância e desvio-padrão

Expectativa matemática descreve o centro de uma distribuição.

Ela não informa, sozinha, quanto os resultados oscilam.

A variância mede a dispersão:

    Var(R) = Σ pᵢ × (Rᵢ − E[R])²

O desvio-padrão é:

    σ = √Var(R)

Duas estratégias podem ter a mesma expectativa de +0,20R por trade e ainda gerar experiências completamente diferentes.

Por exemplo:

### Estratégia A

- win rate alto;
- ganho médio relativamente pequeno;
- perdas menos frequentes.

### Estratégia B

- win rate baixo;
- ganhos maiores;
- perdas mais frequentes.

As duas podem apresentar a mesma média teórica, mas a Estratégia B pode produzir losing streaks maiores e uma distribuição de resultados mais larga.

### Relação com Monte Carlo

É justamente aqui que Monte Carlo se torna especialmente útil.

A expectativa diz onde está o centro.

Monte Carlo ajuda a enxergar:

- P5;
- P50;
- P95;
- drawdowns;
- losing streaks;
- probabilidade de terminar negativo;
- probabilidade de violar limites.

## 3. Independência versus dependência serial

Um modelo simples pode assumir:

    P(perda | perda anterior) = P(perda)

Isso representa independência entre trades.

Mas imagine uma estratégia com taxa média de perdas de 55%.

Se o mercado entrar num regime desfavorável, pode ocorrer:

    P(perda | perda anterior) > 55%

Nesse caso, as perdas passam a se agrupar.

O ponto importante é que a taxa média de perdas pode continuar próxima de 55%, mas o risco de sequências longas aumenta.

### Por que isso importa?

Dois históricos podem ter:

- o mesmo número de trades;
- o mesmo win rate;
- o mesmo payoff;
- a mesma expectativa;

e ainda assim apresentar riscos de sequência diferentes.

### Relação com Bootstrap

Um bootstrap simples sorteia trades individualmente e pode destruir dependência local.

O block bootstrap sorteia grupos de trades.

Isso ajuda a preservar parte de estruturas como:

- clusters de perdas;
- clusters de ganhos;
- regimes temporários;
- autocorrelação local.

Ele não resolve todos os problemas de dependência, mas é uma aproximação mais adequada quando a ordem contém informação.

## 4. Lei dos Grandes Números

Se um processo possui uma probabilidade estável e repetimos esse processo muitas vezes, a média observada tende a se aproximar da média teórica.

Isso não significa que a convergência será suave.

Uma estratégia com win rate verdadeiro de 45% pode apresentar:

- 30% numa pequena amostra;
- depois 55%;
- depois 48%;
- e só mais tarde se aproximar de 45%.

A Lei dos Grandes Números não promete que pequenas amostras serão representativas.

Ela explica por que amostras maiores geralmente fornecem estimativas mais estáveis.

## 5. Regressão à média

Imagine 100 estratégias que, na verdade, possuem exatamente o mesmo edge.

Todas são testadas em apenas 20 trades.

Por puro acaso, algumas terão resultados extraordinários.

Se selecionarmos a melhor e concluirmos:

> Esta é claramente a melhor estratégia.

estaremos selecionando simultaneamente:

- o edge comum;
- mais uma parcela de sorte excepcional daquela amostra.

Ao testar a “campeã” novamente, é comum que o resultado fique menos extremo.

Isso é regressão à média.

## 6. Relação com seleção de backtests

Esse efeito aparece com frequência quando se testa:

- dezenas de indicadores;
- centenas de combinações de parâmetros;
- vários horários;
- vários stops;
- vários alvos;
- vários ativos.

Quanto mais alternativas são testadas, maior a chance de alguma parecer excelente apenas por variabilidade estatística.

Por isso o melhor resultado in-sample precisa ser tratado com cautela.

Ferramentas importantes para reduzir esse problema incluem:

- out-of-sample;
- walk-forward;
- validação cruzada temporal;
- análise de estabilidade dos parâmetros;
- Monte Carlo;
- testes de sensibilidade;
- redução da quantidade de graus de liberdade.

## 7. O que os laboratórios da aplicação demonstram

A aplicação possui quatro ferramentas adicionais nesta etapa:

### Calculadora de Probabilidade Condicional

Mostra:

- win rate global;
- P(Contexto A | vitória);
- P(Contexto A | perda);
- diferença de desempenho entre contextos.

### Mesma Expectância, Dispersão Diferente

Calcula para duas estratégias:

- E[R];
- desvio-padrão por trade;
- distribuição Monte Carlo de R acumulado;
- P5;
- P50;
- P95;
- percentual de caminhos negativos.

### Laboratório de Clusters de Perdas

Compara:

- trades independentes;
- trades com dependência serial;

mantendo aproximadamente a mesma taxa média de perdas.

O foco é observar como muda a distribuição das maiores losing streaks.

### Laboratório de Regressão à Média

Cria várias estratégias artificialmente idênticas.

Depois:

1. testa todas numa amostra pequena;
2. escolhe a melhor;
3. testa a mesma “campeã” numa nova amostra.

Isso permite observar quanto um resultado excepcional pode desaparecer sem qualquer mudança real no edge.

## Aviso metodológico

Essas ferramentas usam modelos simplificados para ensinar conceitos.

O mercado real pode apresentar:

- probabilidades variáveis;
- caudas pesadas;
- assimetria;
- saltos;
- dependência serial complexa;
- regimes;
- custos variáveis;
- slippage;
- restrições de liquidez.

O propósito dos laboratórios é melhorar a qualidade das perguntas feitas pelo trader, e não produzir certezas sobre resultados futuros.
