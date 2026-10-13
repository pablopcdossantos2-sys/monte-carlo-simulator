# Guia didático — primeiro contato com Monte Carlo no trading

Este guia foi escrito para quem nunca usou uma simulação de Monte Carlo.

## 1. A ideia em linguagem simples

Imagine que uma estratégia realizou 100 operações no passado. Essas 100 operações aconteceram em uma ordem específica: ganho, perda, perda, ganho, e assim por diante.

O resultado acumulado observado é apenas **uma das ordens possíveis**.

Se os mesmos tipos de ganhos e perdas aparecessem em outra ordem, o lucro final poderia até ser parecido, mas o caminho até lá poderia ter:

- um drawdown maior;
- uma sequência de perdas mais longa;
- uma violação de limite de risco;
- uma experiência psicológica muito mais difícil.

Monte Carlo serve para repetir o experimento muitas vezes e observar a distribuição dos caminhos.

Ele não pergunta apenas:

> “Quanto essa estratégia ganhou?”

Ele pergunta:

> “O que poderia acontecer com uma estratégia com estas características se a sequência dos resultados fosse diferente?”

---

## 2. Por que isso importa para um trader profissional

Um trader não controla a ordem dos próximos ganhos e perdas.

Por isso, uma estratégia não deve ser avaliada apenas pelo lucro acumulado. Também é importante saber se o trader e a conta conseguem **sobreviver à variabilidade** necessária para que a vantagem estatística tenha tempo de aparecer.

Monte Carlo pode ajudar em quatro decisões práticas:

### Risco por operação

Uma estratégia pode ter expectância positiva e ainda assim se tornar perigosa quando o percentual arriscado em cada trade é alto.

O simulador permite alterar somente o risco e observar quanto o drawdown e o risco de violação mudam.

### Expectativas realistas

Uma sequência de oito perdas pode parecer uma catástrofe para alguém que nunca estudou a distribuição de resultados.

Se a simulação mostra que sequências desse tamanho aparecem com frequência razoável, o trader consegue distinguir melhor entre:

- variabilidade normal;
- possível deterioração real da estratégia.

### Limites de conta

Em contas próprias ou avaliações de prop firms, não basta ter lucro esperado positivo. A estratégia precisa chegar à meta **antes** de tocar limites de perda.

Por isso o simulador separa:

- probabilidade de atingir a meta;
- probabilidade de atingir a meta antes de uma violação.

### Preparação psicológica

Conhecer previamente drawdowns e losing streaks plausíveis não elimina o desconforto das perdas, mas evita tratar todo período ruim como uma surpresa estatística.

---

## 3. Aula prática guiada na própria ferramenta

A interface possui um modo chamado **Aula prática guiada**. Para um primeiro contato, ele é o caminho recomendado.

A aula conduz o usuário por seis experimentos e aplica as configurações automaticamente:

1. risco de 0,5% como referência;
2. risco de 1%, mantendo o mesmo edge;
3. risco de 2%, mantendo o mesmo edge;
4. Reshuffle dos mesmos trades;
5. Bootstrap do mesmo histórico;
6. comparação de 0,5%, 1% e 2% sob regras de prop firm.

Antes de cada experimento há uma **Pergunta para pensar**. Depois da execução, a ferramenta interpreta as métricas calculadas e explica o que mudou.

O aluno pode voltar a etapas anteriores, repetir uma simulação e, ao final, recebe um resumo dos principais aprendizados.

Para o roteiro pedagógico detalhado, veja [AULA-PRATICA-GUIADA.md](AULA-PRATICA-GUIADA.md).

## 4. Exercício didático recomendado fora do modo guiado

### Etapa A — Execute o exemplo

1. Abra a ferramenta.
2. Selecione **Estratégia / Trades**.
3. Clique em **Carregar exemplo didático**.
4. Execute a simulação.

Não tente interpretar tudo ao mesmo tempo.

Primeiro observe apenas:

- saldo mediano;
- P5 do saldo;
- drawdown mediano;
- P95 do drawdown;
- sequência de perdas P95;
- risco de violação.

### Etapa B — Entenda a mediana

P50 é a mediana.

Se o saldo final P50 for R$ 12.000, isso não significa que a ferramenta está prevendo R$ 12.000.

Significa apenas que, entre os caminhos simulados:

- aproximadamente metade terminou abaixo;
- aproximadamente metade terminou acima.

### Etapa C — Entenda o P95 de drawdown

Se o drawdown P95 for 22%, a leitura aproximada é:

> em cerca de 95% das simulações, o drawdown máximo ficou em até 22%.

Isso pode ser mais útil para planejamento de risco do que olhar somente para o drawdown do backtest original.

### Etapa D — Faça o experimento mais importante

Volte ao modo por parâmetros.

Mantenha iguais:

- taxa de acerto;
- reward:risk;
- número de trades;
- custos.

Altere apenas **Risco por trade**.

Compare, por exemplo:

- 0,5%;
- 1%;
- 2%.

Observe especialmente:

- P95 do drawdown;
- risco de violação;
- saldo P5;
- amplitude entre resultados bons e ruins.

A estratégia continua com o mesmo edge teórico. O que mudou foi a agressividade do gerenciamento de risco.

Este é um dos principais aprendizados da ferramenta.

---

## 5. Reshuffle, Bootstrap e Block Bootstrap

### Reshuffle

Usa os mesmos trades e muda a ordem.

Pergunta principal:

> “Quanto a sequência, sozinha, pode mudar a experiência?”

É uma ótima primeira análise quando já existe um histórico de trades.

### Bootstrap

Sorteia trades do histórico com reposição.

Alguns trades podem aparecer várias vezes e outros podem não aparecer.

Pergunta principal:

> “O que acontece se o futuro for outra amostra da distribuição que observei?”

### Block Bootstrap

Sorteia blocos de trades consecutivos.

Ele tenta preservar parte da tendência de ganhos e perdas aparecerem em grupos.

É mais interessante quando há suspeita de dependência temporal ou regimes.

---

## 6. Glossário essencial

### Equity

Valor acumulado da conta ao longo das operações.

### Drawdown

Queda entre um pico anterior da equity e um ponto posterior mais baixo.

### Max Drawdown

Maior drawdown observado em um caminho.

### Win rate

Percentual de operações vencedoras.

Uma taxa de acerto alta não garante lucro.

### Reward : Risk

Relação entre ganho médio de um trade vencedor e perda média de um trade perdedor.

### Expectância

Resultado médio esperado por trade, dadas as probabilidades e payoffs do modelo.

### R

Unidade de risco.

Se o stop planejado equivale a R$ 100, então:

- -1R = -R$ 100;
- +1,5R = +R$ 150.

### P5, P50 e P95

Percentis da distribuição simulada.

Eles descrevem onde diferentes partes dos resultados ficaram; não são garantias.

### Risco de ruína / violação

Frequência com que os caminhos atingiram os limites definidos na simulação.

---

## 7. O que a ferramenta não pode afirmar

A simulação não sabe se a estratégia continuará funcionando no futuro.

Ela também não corrige:

- overfitting;
- lookahead bias;
- dados ruins;
- custos omitidos;
- mudanças de regime;
- slippage irreal;
- baixa liquidez;
- execução diferente do backtest.

Monte Carlo é uma camada de **stress test**, não uma máquina de previsão.

---

## 8. Regra de interpretação

Evite perguntar:

> “Qual resultado o simulador prevê?”

Prefira:

> “Qual faixa de resultados este conjunto de hipóteses produz?”

E, para gerenciamento de risco:

> “Meu tamanho de posição permite sobreviver a uma parte razoável dessa distribuição?”

---

## 9. Uso em sala ou mentoria

Uma aula curta pode seguir esta sequência:

1. mostrar uma única curva de backtest;
2. perguntar aos alunos se aquela curva é o único futuro possível;
3. executar Monte Carlo;
4. mostrar a dispersão de equity curves;
5. comparar mediana e caudas;
6. aumentar o risco por trade sem mudar o edge;
7. observar o aumento do drawdown e risco de violação;
8. discutir a diferença entre **ter vantagem estatística** e **sobreviver tempo suficiente para realizá-la**.

Essa distinção é o principal objetivo educacional deste projeto.
