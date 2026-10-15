# Validação de estratégias de trading

Este guia complementa os laboratórios de probabilidade, estatística aplicada e inferência da ferramenta.

O objetivo é mostrar por que um backtest aparentemente excelente ainda pode fornecer evidência fraca quando:

- a amostra é pequena;
- muitas configurações foram testadas;
- os mesmos dados foram usados para descobrir e validar a estratégia;
- o desempenho depende de um parâmetro muito específico;
- ou a estratégia não se mantém fora da amostra.

## 1. Intervalo de confiança e tamanho de amostra

Uma taxa de acerto observada é uma estimativa.

Se uma estratégia venceu 45 de 100 trades, observamos:

    win rate = 45%

Mas isso não significa que a probabilidade verdadeira seja exatamente 45%.

Amostras diferentes do mesmo processo podem produzir taxas diferentes.

O laboratório usa o **intervalo de Wilson** para proporções.

Ele foi escolhido porque se comporta melhor que a aproximação normal simples em várias situações, especialmente quando a amostra não é grande ou quando a proporção está distante de 50%.

### Por que isso importa?

Se duas estratégias apresentaram:

- Estratégia A: 48% de acerto;
- Estratégia B: 52% de acerto;

não devemos concluir automaticamente que B possui edge superior.

Primeiro precisamos perguntar:

- quantos trades existem em cada amostra?
- os intervalos são largos?
- essa diferença de 4 pontos percentuais é grande em relação à incerteza?

### Tamanho de amostra

O laboratório também calcula uma aproximação do número de trades necessário para uma margem desejada.

Quanto menor a margem de erro desejada, maior tende a ser a amostra necessária.

Isso não transforma um número mínimo de trades numa regra universal.

Mudanças de regime, dependência serial, payoff variável e outros fatores podem exigir análises adicionais.

## 2. Múltiplos testes e data snooping

Imagine que 100 configurações tenham exatamente o mesmo desempenho verdadeiro.

Se cada uma for testada em uma amostra curta, seus resultados observados serão diferentes por acaso.

Ao selecionar a melhor, estamos selecionando simultaneamente:

- o desempenho verdadeiro comum;
- mais uma parcela favorável de ruído.

Esse fenômeno é chamado aqui de **viés de seleção**.

No trading ele aparece ao testar muitas combinações de:

- stop;
- alvo;
- período de indicador;
- horário;
- filtro;
- ativo;
- timeframe;
- regra de entrada;
- regra de saída.

### Quanto mais alternativas, maior o risco

Se uma estratégia com 50% de win rate verdadeiro é testada apenas uma vez, é possível obter 60% numa amostra curta.

Se testamos 100 versões equivalentes e escolhemos somente a melhor, a chance de encontrar um resultado extremo aumenta muito.

O laboratório repete esse processo milhares de vezes:

1. gera várias configurações idênticas;
2. mede todas no in-sample;
3. escolhe a campeã;
4. testa a campeã em dados novos.

O objetivo é mostrar que o resultado out-of-sample tende a retornar em direção ao desempenho verdadeiro quando o “edge extra” da campeã era apenas sorte de seleção.

## 3. In-sample e out-of-sample

**In-sample (IS)** é o conjunto usado para desenvolver ou selecionar a estratégia.

**Out-of-sample (OOS)** é uma parte preservada para avaliação posterior.

Uma divisão simples pode ser:

    2019–2024 → in-sample
    2025       → out-of-sample

O objetivo é impedir que exatamente os mesmos dados sejam usados para:

1. procurar a melhor configuração;
2. provar que ela é boa.

### Contaminação do OOS

O OOS perde parte do valor quando o pesquisador:

- olha o resultado;
- modifica a estratégia;
- roda novamente;
- olha o resultado;
- modifica outra vez.

Depois de muitas iterações, o OOS também passou a influenciar o desenvolvimento.

Por isso validação exige disciplina de processo, não apenas separação de arquivos.

## 4. Walk-forward

Uma única divisão IS/OOS pode depender demais de um período específico.

O walk-forward repete o processo em várias janelas.

Exemplo:

    Janela 1:
    treino → teste seguinte

    Janela 2:
    novo treino → novo teste seguinte

    Janela 3:
    novo treino → novo teste seguinte

A ideia é aproximar a validação de como um sistema poderia ser recalibrado ao longo do tempo.

### O que observar

Mais importante que encontrar uma janela extraordinária é observar:

- consistência entre janelas OOS;
- quantidade de janelas positivas;
- estabilidade das configurações escolhidas;
- sensibilidade ao tamanho das janelas;
- comportamento em diferentes regimes.

### Limitação

Walk-forward também pode sofrer overfitting.

Se muitas escolhas forem feitas dentro de cada janela, o processo continua vulnerável a seleção excessiva.

## 5. Estabilidade de parâmetros

Considere um stop baseado em ATR.

O backtest mostra:

    ATR 1,7 → excelente
    ATR 1,6 → ruim
    ATR 1,8 → ruim

Isso pode indicar um pico muito estreito.

Agora imagine:

    ATR 1,5 → bom
    ATR 1,6 → bom
    ATR 1,7 → muito bom
    ATR 1,8 → bom
    ATR 1,9 → bom

Esse segundo cenário forma um platô.

Em geral, um platô é mais confortável porque pequenas mudanças não destroem o resultado.

Isso não prova que a estratégia continuará funcionando, mas reduz a dependência de um único ponto aparentemente mágico.

## 6. Pico observado versus terreno verdadeiro

No laboratório de estabilidade, o sistema conhece a superfície verdadeira porque ela é criada artificialmente.

O melhor parâmetro verdadeiro é fixado no centro.

Depois são simuladas amostras para todos os parâmetros.

Com poucos trades, o ruído pode fazer outro parâmetro parecer superior.

À medida que a amostra cresce:

- o ruído tende a diminuir;
- o melhor observado tende a se aproximar do melhor verdadeiro;
- o formato do platô fica mais visível.

Isso é uma analogia útil para entender otimizações reais, nas quais não conhecemos a superfície verdadeira.

## 7. Relação com Monte Carlo

Monte Carlo pode contribuir para a validação de várias formas.

### Medir viés de seleção

Podemos repetir milhares de vezes:

    testar muitas configurações
    → escolher a melhor
    → retestar fora da amostra

Isso mostra a distribuição do otimismo criado pela seleção.

### Stress test de amostra

Podemos reamostrar trades para verificar se uma conclusão depende excessivamente de poucas operações.

### Comparar estabilidade

Podemos observar se pequenas mudanças:

- na ordem;
- na composição da amostra;
- nos parâmetros;
- no período histórico;

destroem a conclusão.

### Incorporar incerteza de parâmetros

O laboratório bayesiano do projeto permite inclusive sortear o win rate de uma distribuição posterior antes de gerar cada caminho futuro.

Isso separa duas fontes de incerteza:

1. incerteza da sequência futura;
2. incerteza sobre os próprios parâmetros da estratégia.

## 8. Checklist mínimo de validação

Antes de tratar um backtest como evidência forte, vale perguntar:

- Quantos trades existem?
- Qual é a incerteza do win rate e da expectativa?
- Quantas configurações foram testadas antes de chegar à escolhida?
- Existe um período realmente out-of-sample?
- O OOS foi consultado repetidamente durante o desenvolvimento?
- O resultado aparece em várias janelas temporais?
- Parâmetros vizinhos também funcionam?
- Há dependência de poucos trades excepcionais?
- Custos e slippage são realistas?
- O comportamento muda por regime?
- Monte Carlo e reamostragem revelam fragilidade?
- A estratégia permanece plausível com hipóteses um pouco piores?

## Aviso

Nenhuma dessas técnicas garante desempenho futuro.

Validação serve para reduzir explicações frágeis e aumentar a qualidade da evidência.

O objetivo não é provar que uma estratégia funcionará.

O objetivo é tornar mais difícil que sorte, viés de seleção e overfitting sejam confundidos com edge.
