# Aula prática guiada — roteiro pedagógico

A interface do simulador contém um modo interativo de seis experimentos. Este arquivo registra a lógica pedagógica da aula e pode ser usado por instrutores, mentores ou alunos que desejem revisar os conceitos.

## Objetivo central

A aula procura demonstrar, por experiência, que:

> **ter edge e sobreviver ao caminho produzido por esse edge são problemas diferentes.**

Nos primeiros experimentos, a taxa de acerto e o Reward:Risk permanecem fixos. Apenas o risco por trade muda. Assim, o aluno consegue atribuir as mudanças de drawdown e dispersão ao dimensionamento, e não a uma estratégia diferente.

## Experimento 1 — referência com 0,5%

Configuração principal:

- capital inicial: R$ 10.000;
- win rate: 45%;
- Reward:Risk: 1,5 : 1;
- risco: 0,5%;
- sizing fixo;
- 200 trades;
- 2.500 simulações;
- regras de prop firm desativadas.

Aprendizado: uma estratégia de expectância positiva ainda possui drawdowns e losing streaks.

## Experimento 2 — risco de 1%

Tudo permanece igual, exceto o risco, que passa de 0,5% para 1%.

O aluno deve comparar principalmente:

- P95 do drawdown;
- P5 do saldo;
- probabilidade de lucro.

Aprendizado: aumentar o risco não aumenta o edge. Ele amplia financeiramente os resultados.

## Experimento 3 — risco de 2%

A estratégia continua igual e o risco passa a 2%.

Aprendizado: position sizing pode transformar uma estratégia estatisticamente aceitável em uma experiência difícil de executar ou sobreviver.

A interface calcula a comparação com a referência de 0,5% automaticamente.

## Experimento 4 — Reshuffle

A aula passa para um histórico demonstrativo de trades e usa **Reshuffle**.

Cada simulação recebe exatamente os mesmos trades; somente a ordem muda.

O aluno deve observar que:

- o saldo final fica praticamente igual;
- o drawdown varia;
- as sequências de perdas variam.

Aprendizado: **sequence risk**.

## Experimento 5 — Bootstrap

O mesmo histórico passa a ser reamostrado com reposição.

Agora podem variar:

- ordem;
- frequência de cada resultado;
- saldo final;
- drawdown.

Aprendizado: Bootstrap adiciona incerteza de amostragem ao risco de sequência.

## Experimento 6 — Prop firm

A aula retorna ao modelo paramétrico e aplica:

- meta: +8%;
- perda máxima: 10%;
- perda diária: 4%;
- drawdown estático.

São executados automaticamente três cenários:

- risco de 0,5%;
- risco de 1%;
- risco de 2%.

A tabela compara:

- probabilidade de atingir a meta antes da violação;
- probabilidade de violação;
- P95 do drawdown.

Aprendizado: com regras de conta, a pergunta deixa de ser apenas “a estratégia é lucrativa?” e passa a ser “ela consegue atingir o objetivo antes de violar os limites?”.

## Por que a aula usa a mesma semente?

Nos experimentos paramétricos, a mesma semente pseudoaleatória ajuda a manter comparabilidade entre os cenários. Quando somente o risco muda, queremos reduzir diferenças causadas por sorteios diferentes e deixar mais evidente o efeito do position sizing.

## Como as explicações são produzidas

A aula não exibe números pré-gravados. Depois de cada execução, lê o resultado real do motor e monta a explicação a partir de métricas como:

- saldo P5/P50/P95;
- drawdown P50/P95;
- sequência de perdas P95;
- risco de violação;
- meta antes da violação.

Portanto, a explicação permanece ligada à simulação que acabou de ser executada.

## Sugestão para uso em aula presencial

Antes de cada botão **Aplicar configuração e simular**, peça ao aluno que responda verbalmente à “Pergunta para pensar”.

Não corrija imediatamente.

Execute a simulação e use os números para confrontar a hipótese.

O objetivo não é decorar percentis, mas desenvolver uma forma probabilística de pensar sobre risco.

## Limite pedagógico importante

A aula usa uma estratégia hipotética deliberadamente simples. Ela não tenta provar que 0,5%, 1% ou 2% são riscos adequados para um trader real.

Esses valores são instrumentos do experimento.

A conclusão correta é:

> **o risco adequado depende da distribuição da estratégia, do capital, dos limites, da tolerância ao drawdown e da qualidade dos dados.**
