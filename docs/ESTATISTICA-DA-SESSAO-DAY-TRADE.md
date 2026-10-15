# Estatística da Sessão de Day Trade

Este projeto agora é orientado exclusivamente a **day trade**.

Isso significa que as análises pressupõem que as posições são abertas e encerradas dentro do mesmo pregão. O objetivo deixa de ser apenas estudar uma sequência abstrata de trades e passa a estudar também a estrutura intradiária e a distribuição dos pregões.

## 1. Hierarquia correta para day trade

Uma análise útil deve considerar diferentes níveis:

    trade
      ↓
    pregão
      ↓
    semana
      ↓
    distribuição de pregões
      ↓
    Monte Carlo

Dois traders podem ter exatamente os mesmos 100 trades e ainda apresentar experiências muito diferentes caso esses trades estejam agrupados de forma distinta entre os pregões.

Por isso, para day traders, faz sentido analisar:

- P&L diário;
- percentual de pregões positivos;
- P5, P50 e P95 do resultado diário;
- sequência de losing days;
- drawdown medido em R e em número de pregões;
- semanas negativas;
- recuperação de drawdowns;
- pico de lucro intradiário e giveback;
- quantidade de trades por dia;
- expectativa por horário.

## 2. P&L diário

A expectativa por trade não substitui a expectativa por pregão.

Se uma estratégia apresenta:

    +0,10R por trade

e o trader realiza quatro operações por dia, não significa que todo dia terminará próximo de +0,40R.

O resultado diário é uma distribuição.

Alguns pregões podem terminar:

- +3R;
- +1R;
- 0R;
- -2R;
- -4R.

O laboratório **Monte Carlo por Pregão** agrupa trades em sessões e permite estudar essa distribuição.

## 3. Losing days

Uma sequência de trades perdedores e uma sequência de pregões perdedores são riscos diferentes.

Para o day trader, muitas vezes é psicologicamente e operacionalmente mais relevante saber:

> Quantos pregões negativos consecutivos são plausíveis?

do que saber apenas a maior losing streak em trades.

O projeto calcula o P95 da sequência máxima de losing days nas simulações.

## 4. Drawdown medido em pregões

Além da profundidade do drawdown em R, o day trader deve observar sua duração.

Uma estratégia pode sofrer um drawdown relativamente pequeno, mas permanecer semanas sem superar um pico anterior.

Por isso o laboratório calcula também o **tempo submerso**:

    número de pregões consecutivos abaixo do pico anterior

Esse valor ajuda a criar expectativas mais realistas sobre a duração de períodos ruins.

## 5. Expectativa por faixa horária

O comportamento de uma estratégia pode mudar ao longo do pregão.

Exemplo:

    09:00–10:00 → +0,18R/trade
    10:00–11:00 → +0,10R/trade
    11:00–12:00 → -0,05R/trade
    14:00–16:00 → -0,12R/trade

Uma expectativa global pode esconder que parte do resultado positivo ocorre apenas em determinados horários.

A ferramenta permite informar:

- win rate;
- payoff;
- participação de cada faixa no total de operações.

Ela calcula:

    E[R] = P(win) × ganho − P(loss) × perda

para cada horário e sua contribuição para cada 100 trades.

Isso não significa que uma faixa negativa deva ser automaticamente removida.

Pode existir:

- diferença de regime;
- amostra pequena;
- interação com setup;
- viés de seleção.

O objetivo é sinalizar onde vale investigar.

## 6. Primeiro trade versus trades posteriores

Overtrading não deve ser tratado apenas como um conceito psicológico.

Ele pode ser investigado estatisticamente.

O trader pode calcular:

    E[R | 1º trade do dia]
    E[R | 2º trade do dia]
    E[R | 3º trade do dia]
    ...

Se a qualidade cai progressivamente, um limite de operações pode melhorar o resultado esperado.

O laboratório de overtrading permite simular uma deterioração gradual do win rate a cada trade adicional.

Essa deterioração é apenas um modelo didático.

Na prática ela deve ser estimada a partir dos próprios dados do trader.

## 7. MFE e MAE

**MFE — Maximum Favorable Excursion**

É o maior avanço favorável alcançado pelo trade antes do encerramento.

**MAE — Maximum Adverse Excursion**

É o maior movimento adverso enquanto a operação estava aberta.

Exemplo:

    entrada
    → chegou a +2,0R
    → caiu para +0,7R
    → saída em +0,9R

Nesse trade:

    MFE = +2,0R
    resultado = +0,9R

Uma métrica didática é:

    captura = resultado realizado / MFE

Neste exemplo:

    0,9 / 2,0 = 45%

Isso não significa que a estratégia deveria obrigatoriamente capturar mais.

Para testar alternativas de saída de forma correta é necessário conhecer o caminho temporal intratrade.

MFE e MAE isolados não informam qual nível foi atingido primeiro.

## 8. Stop diário

Um stop diário pode reduzir a cauda negativa da distribuição de P&L.

Mas ele também muda o processo.

Considere um dia que começa:

    -1R
    -1R
    -1R

Se o stop diário for -3R, a sessão termina.

Sem essa regra, talvez os próximos trades fossem:

    +1,5R
    +1,5R
    +1,5R

e parte da perda fosse recuperada.

A pergunta correta é:

> Qual o impacto estatístico da regra no conjunto dos pregões?

Por isso o laboratório compara a mesma sequência intradiária de trades em dois cenários:

1. executar todos os trades planejados;
2. interromper ao tocar o stop diário.

Assim, a diferença observada vem da regra e não de uma sequência aleatória diferente.

## 9. Giveback

O giveback diário é:

    pico intradiário de P&L − resultado final do pregão

Exemplo:

    pico do dia = +4R
    fechamento = +1,5R

Logo:

    giveback = 2,5R

Giveback pode ser estudado em conjunto com:

- horário;
- quantidade de trades;
- lucro máximo do dia;
- resultado depois de determinado número de operações;
- mudança de lote;
- violação de regras.

Um giveback alto não significa automaticamente que o trader deveria parar ao atingir o pico.

O pico só é conhecido retrospectivamente.

O objetivo é procurar padrões operacionais que possam ser transformados em regras testáveis.

## 10. Custos e slippage

No day trade, custos pequenos são repetidos muitas vezes.

A expectativa líquida pode ser representada de forma simplificada por:

    E líquido[R]
    =
    E bruto[R]
    − custo médio[R/trade]

Exemplo:

    expectativa bruta = +0,10R/trade
    custo médio = 0,04R/trade

Resultado:

    expectativa líquida = +0,06R/trade

Quarenta por cento da vantagem foi consumida.

Em cinco operações por dia e vinte pregões:

    100 trades/mês

O custo mensal equivalente seria:

    100 × 0,04R = 4R

Na prática o custo pode variar por:

- ativo;
- horário;
- spread;
- volatilidade;
- liquidez;
- tamanho da posição;
- execução.

## 11. Monte Carlo por pregão

O modo tradicional de Monte Carlo pode sortear trades individuais.

Para day traders também é útil sortear **pregões inteiros**.

Exemplo de histórico:

    Dia 1 = +1,4R
    Dia 2 = -1,0R
    Dia 3 = +0,8R
    Dia 4 = +2,2R
    Dia 5 = -0,6R

O bootstrap de sessões sorteia valores dessa lista para construir novos caminhos de pregões.

Isso permite estimar:

- P5/P50/P95 do resultado acumulado;
- losing days P95;
- drawdown P95;
- tempo submerso P95.

## 12. Limitação do bootstrap de pregões

No modo simples implementado, os pregões são sorteados de forma independente.

Se houver dependência entre dias — por exemplo, vários dias ruins em determinado regime — essa estrutura pode ser perdida.

Uma extensão futura importante é o **block bootstrap de pregões**, em que grupos consecutivos de sessões são reamostrados juntos.

## 13. Checklist de análise para um day trader

Além das métricas por trade, vale acompanhar:

### Por trade

- win rate;
- payoff;
- expectativa;
- MFE;
- MAE;
- custo;
- slippage;
- setup;
- horário;
- trade ordinal do dia.

### Por pregão

- P&L diário;
- número de trades;
- maior perda intradiária;
- maior lucro intradiário;
- giveback;
- atingiu stop diário?;
- atingiu meta?;
- primeira operação;
- resultado após uma perda;
- resultado após duas perdas.

### Por distribuição de pregões

- percentual de dias positivos;
- P5/P50/P95 diário;
- losing days;
- semanas negativas;
- drawdown;
- duração do drawdown;
- probabilidade de violação de limite diário.

## 14. Escopo

O projeto não foi desenhado para avaliar:

- swing trade;
- position trade;
- buy and hold;
- carregamento overnight como parte da estratégia.

Conceitos estatísticos gerais continuam válidos, mas todas as ferramentas e exemplos futuros deverão ser interpretados prioritariamente sob a perspectiva de operações intradiárias.

## 15. Cara ou coroa: o que o trader controla?

Uma analogia útil para ensinar gerenciamento de risco é imaginar que cada operação comece como um lançamento de moeda.

A analogia não afirma que um trading system real possua 50% de chance de ganho.

Ela serve para separar duas coisas:

1. **o resultado do próximo evento é incerto**;
2. **o trader consegue estruturar sua exposição a esse evento**.

Num jogo didático com:

    P(cara) = 50%
    P(coroa) = 50%

suponha:

    cara  → +2R
    coroa → -1R

A expectativa bruta é:

    E[R]
    =
    0,50 × 2R
    − 0,50 × 1R

    E[R] = +0,50R

Agora mantenha exatamente a mesma moeda, mas use:

    cara  → +1R
    coroa → -1R

A expectativa passa a ser:

    E[R] = 0R

E com:

    cara  → +0,5R
    coroa → -1R

temos:

    E[R] = -0,25R

A moeda não mudou.

O que mudou foi a assimetria entre ganho e perda.

### O que o trader não controla

O trader não controla:

- o próximo movimento do mercado;
- a ordem futura de gains e losses;
- se o próximo trade será vencedor;
- quando uma sequência negativa aparecerá.

### O que o trader consegue estruturar

O trader consegue estruturar:

- stop;
- tamanho da posição;
- perda máxima aceitável;
- regra de saída;
- quanto espaço concede a um trade favorável;
- custos que aceita;
- quantidade máxima de operações;
- stop diário;
- disciplina para executar as regras.

É nesse sentido que dizemos que o trader possui “controle”.

**Controle não é controle sobre o mercado. É controle sobre exposição e execução.**

### Custos

Se existe um custo médio de 0,05R por tentativa:

    E líquido[R]
    =
    P(win) × ganho
    − P(loss) × perda
    − custo

No exemplo 50/50 com +2R / -1R:

    E líquido
    =
    0,50 × 2
    − 0,50 × 1
    − 0,05

    E líquido = +0,45R

O laboratório calcula também o ganho necessário para break-even quando a probabilidade é mantida artificialmente em 50%.

### Relação com “deixar o trade correr”

A frase “cortar as perdas e deixar os ganhos correrem” descreve uma intenção de criar assimetria favorável.

Mas existe uma limitação importante.

No mercado real:

- aumentar o alvo pode reduzir o win rate;
- apertar o stop pode aumentar a frequência de stops;
- trailing stops alteram a distribuição dos ganhos;
- slippage altera perdas e ganhos reais;
- diferentes contextos de mercado mudam as probabilidades.

Portanto não é correto pegar uma taxa de acerto fixa e assumir que podemos aumentar indefinidamente o ganho médio sem modificar mais nada.

A relação entre:

    win rate
    stop
    payoff
    MFE
    MAE
    custos
    horário
    contexto

precisa ser validada empiricamente.

### Função do laboratório

O laboratório **Cara ou Coroa: Stop, Ganho e Expectativa** fixa deliberadamente a probabilidade em 50/50 para isolar uma única ideia:

> mesmo quando você não controla qual será o próximo resultado, a estrutura de risco e payoff muda a expectativa e a distribuição dos caminhos.

Depois dessa intuição, o trader deve voltar aos dados reais e verificar se a assimetria que deseja executar existe de fato em seu trading system.


## Aviso

Nenhum limite de stop diário, quantidade de trades ou horário é recomendado universalmente.

Os laboratórios existem para que regras possam ser comparadas sob hipóteses explícitas.

A função da estatística é tornar essas decisões mais informadas, não produzir regras mágicas.
