# Metodologia

## 1. Objetivo

Este projeto usa Monte Carlo para transformar uma única sequência histórica ou uma única hipótese de estratégia em uma **distribuição de caminhos possíveis**. O foco não é prever exatamente o futuro, mas medir a sensibilidade do resultado à ordem dos trades, à reamostragem dos resultados, ao position sizing e às regras de risco.

Há dois módulos independentes:

1. **Estratégia / Trades**
2. **Preço / GBM**

---

## 2. Estratégia / Trades

### 2.1 Modo paramétrico

O usuário fornece:

- capital inicial;
- taxa de acerto;
- reward:risk;
- risco percentual por trade;
- position sizing fixo ou composto;
- custos por trade;
- número de trades;
- regras opcionais de risco.

Em cada trade é sorteado um número pseudoaleatório uniforme. Se esse número ficar abaixo da taxa de acerto, o trade é vencedor; caso contrário, é perdedor.

Para position sizing composto:

    risco_em_dinheiro = equity_atual × risco_percentual

Para position sizing fixo:

    risco_em_dinheiro = capital_inicial × risco_percentual

Resultado bruto:

    vencedor = risco_em_dinheiro × reward_risk
    perdedor = -risco_em_dinheiro

Depois são descontados os custos por trade.

A expectância em R exibida no modo paramétrico é:

    EV_R = win_rate × reward_risk - (1 - win_rate)

A fração de Kelly é calculada por:

    Kelly = win_rate - (1 - win_rate) / reward_risk

Kelly é apresentado como referência matemática, não como recomendação de risco.

### 2.2 Histórico de trades

O usuário pode colar um P&L por linha ou um CSV. O parser procura nomes comuns como:

- pnl
- p&l
- profit
- net profit
- resultado
- lucro
- result
- pl

Também aceita valores monetários simples, negativos entre parênteses e números com convenções de separador decimal/ponto de milhar.

#### Reshuffle / permutação

Reordena os mesmos trades sem reposição. Quando o horizonte é igual ao tamanho do histórico, cada simulação contém exatamente os mesmos trades em ordem diferente.

É especialmente útil para estudar o impacto da **sequência** no drawdown e nas sequências de perdas.

#### Bootstrap com reposição

Cada trade é sorteado independentemente da amostra histórica, com reposição. Um mesmo trade pode aparecer várias vezes ou não aparecer.

Isso altera tanto a sequência quanto o P&L final e produz uma distribuição mais ampla de resultados.

#### Block bootstrap

Sorteia blocos contíguos da série histórica. O objetivo é preservar parte da dependência serial de curto prazo — por exemplo, períodos em que perdas ou ganhos aparecem agrupados.

O tamanho do bloco é configurável.

---

## 3. Drawdown

Para cada equity curve, o motor mantém o maior pico anterior e mede a queda até cada ponto seguinte:

    drawdown_percentual = (pico - equity_atual) / pico

O máximo entre todas as quedas é o Max Drawdown da simulação.

O projeto reporta:

- mediana;
- P90;
- P95;
- pior drawdown observado.

O P95 é particularmente útil como número de stress: 95% das simulações apresentaram drawdown máximo menor ou igual àquele valor, sob as hipóteses utilizadas.

---

## 4. Risco de ruína e regras de Prop Firm

O simulador suporta regras genéricas e configuráveis. Elas não representam automaticamente nenhuma firma específica.

### Ruin threshold

É um percentual de perda em relação ao capital inicial. Ao tocar esse limite, a simulação é marcada como evento de ruína.

### Perda máxima estática

Cria um piso baseado no capital inicial:

    piso = capital_inicial - limite_de_perda

### Trailing intraday

O piso acompanha o maior pico intraday observado:

    piso = max(piso_estático, maior_equity_intraday - limite_de_perda)

### Trailing EOD

O piso acompanha apenas novos máximos registrados no fechamento sintético do dia.

Como o simulador não conhece horários reais quando recebe apenas P&L por trade, o usuário informa uma quantidade aproximada de trades por dia.

### Perda diária

A perda diária é comparada com a equity registrada no começo de cada dia sintético.

### Meta

A simulação registra em qual trade a meta foi atingida e se isso ocorreu antes de qualquer violação.

Por isso são reportadas duas métricas diferentes:

- probabilidade de atingir a meta;
- probabilidade de atingir a meta **antes** de violar uma regra.

---

## 5. Percentis

Os resultados usam interpolação linear entre observações ordenadas.

Os percentis principais são:

- **P5**: somente 5% dos resultados foram piores;
- **P25**: quartil inferior;
- **P50**: mediana;
- **P75**: quartil superior;
- **P95**: somente 5% foram melhores.

Para saldo final, P5 é um cenário de cauda negativa útil. Para drawdown, P95 é uma medida conservadora de stress.

---

## 6. Simulação de preço por GBM

O módulo de preço usa Movimento Browniano Geométrico:

    S(t+dt) = S(t) × exp[(μ - 0.5σ²)dt + σ√dt × Z]

onde:

- S = preço;
- μ = retorno anual esperado;
- σ = volatilidade anual;
- dt = 1 / passos_por_ano;
- Z = variável normal padrão.

O modelo produz trajetórias lognormais e mantém preços positivos.

### Limitações do GBM

GBM assume, entre outras coisas:

- volatilidade constante;
- distribuição normal dos choques logarítmicos;
- ausência de saltos;
- parâmetros estacionários;
- ausência de regimes.

Mercados reais frequentemente violam essas hipóteses. Por isso o módulo é didático e de análise de cenários.

---

## 7. Reprodutibilidade

O motor usa um gerador pseudoaleatório com semente configurável. Com a mesma versão do código, mesma configuração e mesma semente, a simulação deve produzir o mesmo resultado.

Isso é importante para:

- comparar alterações de parâmetros;
- depurar;
- documentar testes;
- reproduzir resultados.

---

## 8. O que Monte Carlo não resolve

Monte Carlo não transforma um backtest ruim em estratégia robusta. Entre os riscos que continuam existindo:

- overfitting;
- lookahead bias;
- survivorship bias;
- seleção oportunista de parâmetros;
- custos e slippage subestimados;
- mudanças estruturais de regime;
- perda de edge;
- baixa liquidez;
- execução diferente da modelada;
- dados históricos incompletos ou contaminados.

Monte Carlo deve ser combinado, quando possível, com out-of-sample, walk-forward, testes de sensibilidade, análise por regime e validação de dados.

---

## 9. Referências de produto e pesquisa

A implementação deste repositório foi escrita do zero. As fontes abaixo foram estudadas para identificar conceitos, funcionalidades e padrões de UX.

| Fonte | Conceitos observados | Uso neste projeto |
|---|---|---|
| theanh97/Monte-Carlo-Simulation-for-Stock-Market | histórico via Yahoo Finance, trajetórias de preço, distribuição final | inspiração para módulo GBM |
| keithhb33/MonteCarloStockSimulator | drift, volatilidade, GBM, interface interativa | inspiração conceitual |
| JosephFrancisRe/Monte-Carlo-Simulation-App | Monte Carlo de portfólio e VaR | VaR empírico no módulo GBM |
| tradesdontlie/prop-firm-monte-carlo | regras de prop firm, trailing DD, sobrevivência, MFE/MAE e regimes | regras genéricas de risco; MFE/MAE fica como evolução futura |
| T58 Quant Algo Backtester / PUBLIC | validação, prop simulation, walk-forward, regimes, probabilidade de passar | inspiração de roadmap; nenhuma implementação proprietária foi copiada |
| T58 Market Data | formato OHLCV e importância de integridade/licenciamento | referência para futuro módulo de dados; nenhum dataset redistribuído |
| hasch74.github.io | aplicação client-side, Kelly, curvas e distribuições | UX e Kelly como referência |
| TradeZella Monte Carlo Simulator | sizing fixo/composto, risco de ruína, percentis e drawdown | seleção de métricas |
| SharePredictions Monte Carlo Simulator | win rate, R:R, Kelly, distribuição de resultados | seleção de métricas |
| HowToTrade Monte Carlo Simulation | uso educacional de Monte Carlo em trading | referência de UX |
| Build Alpha Monte Carlo | reshuffle, resample, drawdown e robustness testing | diferenciação dos métodos |
| TradeSearcher Equity Curve Simulation | fees, leverage e curvas de equity | custos como parâmetro |
| Switch Markets Monte Carlo Simulation | win rate, R:R, risco, custos, risco de ruína | parâmetros de estratégia |

Links:

- https://github.com/theanh97/Monte-Carlo-Simulation-for-Stock-Market
- https://github.com/keithhb33/MonteCarloStockSimulator
- https://github.com/okmantz/T58-QUANT-ALGO-BACKTESTER
- https://github.com/okmantz/T58-QUANT-ALGO-BACKTESTER-PUBLIC
- https://github.com/okmantz/T58-MARKET-DATA
- https://github.com/JosephFrancisRe/Monte-Carlo-Simulation-App
- https://github.com/tradesdontlie/prop-firm-monte-carlo
- https://hasch74.github.io/
- https://www.tradezella.com/tools/monte-carlo-simulator
- https://sharepredictions.com/tools/monte-carlo-simulator/
- https://howtotrade.com/trading-tools/monte-carlo-simulation/
- https://www.buildalpha.com/monte-carlo-simulation/
- https://tradesearcher.ai/tools/trading-equity-curve-simulation
- https://www.switchmarkets.com/tools/monte-carlo-simulation
- https://github.com/search?q=monte+carlo+trading&type=repositories

---

## 10. Cuidados de licença

Algumas referências são open source; outras são ferramentas comerciais ou documentação de software proprietário. Este projeto não incorpora código de terceiros.

Em especial:

- o repositório público do T58 afirma que o código do motor é proprietário;
- o T58 Market Data alerta que dados de terceiros podem ter restrições de redistribuição;
- quando um README de terceiros declara uma licença mas o arquivo de licença não está presente ou não foi verificado, este projeto trata a fonte apenas como referência conceitual.

Essa escolha mantém o simulador independente e reduz risco de contaminação de licença.

---

## 11. Próximas extensões recomendadas

1. Importação de relatórios de brokers com mapeamento manual de colunas.
2. Monte Carlo por R-multiple em vez de moeda.
3. MFE/MAE para modelar stop/target e sequência intratrade.
4. Regimes de volatilidade.
5. Markov bootstrap / transição entre regimes.
6. Slippage estocástico.
7. Consistency rules de prop firms.
8. Payout rules e múltiplas fases de avaliação.
9. Multi-strategy / portfólio com correlação.
10. Walk-forward e out-of-sample.
11. Comparação lado a lado entre configurações.
12. Exportação CSV de distribuições completas.
13. Testes de sensibilidade da taxa de acerto e payoff.
14. Importação opcional de OHLCV para calibrar GBM ou modelos mais realistas.

---

## 12. Aviso

Esta ferramenta é educacional e de pesquisa. Não é aconselhamento financeiro, não prevê retornos e não garante aprovação em avaliações de prop firms.
