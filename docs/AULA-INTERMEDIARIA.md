# Aula intermediária — Expectância, Win Rate, Payoff e Risco de Ruína

Esta é a segunda aula guiada do simulador.

Ela foi criada para ser feita depois da aula introdutória sobre drawdown, position sizing, Reshuffle e Bootstrap.

## Objetivo

A aula procura desfazer quatro confusões comuns entre traders em formação:

1. taxa de acerto alta não significa automaticamente estratégia lucrativa;
2. taxa de acerto baixa não significa automaticamente estratégia ruim;
3. expectância igual não significa trajetória igual;
4. edge positivo não torna qualquer nível de risco aceitável.

A relação básica usada nos experimentos paramétricos é:

    E[R] = p × b − (1 − p) × 1

onde:

- `p` é a probabilidade de acerto;
- `b` é o ganho médio em R de um trade vencedor;
- uma perda vale `-1R`.

## Experimento 1 — 70% de acerto e expectância negativa

Hipóteses:

- win rate: 70%;
- ganho médio: +0,4R;
- perda: -1R.

Expectância:

    0,70 × 0,4 − 0,30 × 1 = -0,02R

O experimento mostra que uma estratégia pode acertar sete em cada dez trades e ainda ter matemática desfavorável.

## Experimento 2 — 35% de acerto e expectância positiva

Hipóteses:

- win rate: 35%;
- ganho médio: +2,2R;
- perda: -1R.

Expectância:

    0,35 × 2,2 − 0,65 × 1 = +0,12R

O objetivo é mostrar que payoff pode compensar uma taxa de acerto baixa.

## Experimento 3 — mesma expectância, experiências diferentes

São comparadas duas estratégias com E[R] próximo de +0,20R.

Estratégia A:

- win rate: 70%;
- payoff: aproximadamente 0,714R.

Estratégia B:

- win rate: 35%;
- payoff: aproximadamente 2,429R.

Embora a expectância seja praticamente igual, a estratégia B tende a produzir losing streaks maiores.

O aprendizado é que **expectância não descreve sozinha a distribuição dos caminhos**.

## Experimento 4 — payoff altera o edge

O win rate permanece em 40%.

Cenário A:

- R:R = 1:1;
- E[R] = -0,20R.

Cenário B:

- R:R = 2:1;
- E[R] = +0,20R.

A taxa de acerto não muda. Apenas o payoff muda.

## Experimento 5 — o mesmo edge, três riscos

Estratégia:

- win rate: 45%;
- R:R = 1,5;
- E[R] = +0,125R.

São comparados:

- 1% de risco;
- 3% de risco;
- 5% de risco.

O experimento considera violação quando a conta toca uma queda de 20% em relação ao capital inicial.

O objetivo é mostrar que o edge permanece o mesmo, mas a probabilidade de tocar o limite pode mudar radicalmente.

## Experimento 6 — Kelly não é conforto

Hipóteses:

- win rate: 40%;
- R:R = 2;
- Kelly teórico: 10%.

São comparados:

- 1%;
- 5%;
- 10% de risco por trade.

O sizing é composto e existe um limite experimental de perda de 30%.

A aula não apresenta Kelly como recomendação.

Ela enfatiza que a fórmula procura maximizar crescimento logarítmico esperado sob hipóteses específicas e não minimizar:

- drawdown;
- risco operacional;
- desconforto psicológico;
- probabilidade de violar regras externas.

## Desafios de previsão

Antes de cada experimento, o aluno precisa registrar uma previsão.

A simulação só é liberada depois disso.

Ao final, a ferramenta mostra quantos desafios foram respondidos corretamente, mas a pontuação é secundária.

O objetivo é criar o hábito:

> formular uma hipótese antes de olhar os resultados.

## Idiomas

A aula intermediária está integrada à mesma aplicação trilíngue:

- Português (Brasil);
- English;
- Español.

A troca de idioma preserva o progresso da aula atual.

## Uso em sala

Uma forma recomendada de conduzir a aula é pedir ao aluno que explique **por que** escolheu cada previsão antes de executar a simulação.

Especialmente nos experimentos 1 e 2, evite apresentar a fórmula da expectância antes da resposta inicial.

Isso permite observar se o aluno está usando intuitivamente a taxa de acerto como sinônimo de qualidade.

Depois, apresente a matemática e execute Monte Carlo para mostrar a diferença entre:

- média teórica;
- distribuição dos resultados;
- experiência de risco.
