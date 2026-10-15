(function () {
  const phraseTranslations = {
    "Entender primeiro": { en: "Understand first", es: "Entender primero" },
    "Aula prática guiada": { en: "Guided practical lesson", es: "Clase práctica guiada" },
    "Ir ao simulador": { en: "Go to simulator", es: "Ir al simulador" },
    "Glossário": { en: "Glossary", es: "Glosario" },
    "Baixar versão offline": { en: "Download offline version", es: "Descargar versión offline" },
    "100% no navegador": { en: "100% in your browser", es: "100% en tu navegador" },
    "seus dados não são enviados": { en: "your data is not sent anywhere", es: "tus datos no se envían" },
    "VERSÃO OFFLINE": { en: "OFFLINE VERSION", es: "VERSIÓN OFFLINE" },
    "abra este arquivo com duplo clique": { en: "open this file with a double click", es: "abre este archivo con doble clic" },
    "MONTE CARLO · TRADING · RISCO": { en: "MONTE CARLO · TRADING · RISK", es: "MONTE CARLO · TRADING · RIESGO" },
    "Simulador de Monte Carlo": { en: "Monte Carlo Simulator", es: "Simulador de Monte Carlo" },
    "Uma ferramenta educacional para aprender a pensar em probabilidades, e não em uma única curva de resultados. Teste milhares de futuros possíveis para uma estratégia, estime drawdowns, sequências de perdas, risco de violação e probabilidade de atingir metas.": { en: "An educational tool for learning to think in probabilities instead of a single equity curve. Test thousands of possible futures for a strategy and estimate drawdowns, losing streaks, breach risk and the probability of reaching targets.", es: "Una herramienta educativa para aprender a pensar en probabilidades, y no en una sola curva de resultados. Prueba miles de futuros posibles para una estrategia y estima drawdowns, rachas de pérdidas, riesgo de incumplimiento y probabilidad de alcanzar objetivos." },
    "ANTES DE SIMULAR": { en: "BEFORE YOU SIMULATE", es: "ANTES DE SIMULAR" },
    "Por que Monte Carlo importa para um trader?": { en: "Why does Monte Carlo matter to a trader?", es: "¿Por qué Monte Carlo es importante para un trader?" },
    "Um backtest mostra uma sequência histórica. O problema é que duas estratégias com a mesma média de ganhos podem produzir experiências muito diferentes quando a ordem dos ganhos e perdas muda. Monte Carlo cria muitas sequências plausíveis para revelar essa incerteza.": { en: "A backtest shows one historical sequence. Two strategies with the same average results can create very different experiences when the order of wins and losses changes. Monte Carlo creates many plausible sequences to expose that uncertainty.", es: "Un backtest muestra una secuencia histórica. Dos estrategias con los mismos resultados medios pueden producir experiencias muy distintas cuando cambia el orden de ganancias y pérdidas. Monte Carlo crea muchas secuencias plausibles para revelar esa incertidumbre." },
    "O backtest é só um caminho": { en: "The backtest is only one path", es: "El backtest es solo un camino" },
    "A curva que aconteceu no passado não é a única curva compatível com aquela taxa de acerto, payoff e distribuição de trades.": { en: "The curve observed in the past is not the only curve compatible with that win rate, payoff and trade distribution.", es: "La curva observada en el pasado no es la única compatible con esa tasa de acierto, payoff y distribución de trades." },
    "O risco está na sequência": { en: "Risk is also in the sequence", es: "El riesgo también está en la secuencia" },
    "Uma sequência desfavorável pode produzir um drawdown grande mesmo quando a estratégia tem expectância positiva.": { en: "An unfavorable sequence can create a large drawdown even when the strategy has positive expectancy.", es: "Una secuencia desfavorable puede producir un drawdown grande incluso cuando la estrategia tiene expectativa positiva." },
    "Profissional pensa em sobrevivência": { en: "Professionals think about survival", es: "El profesional piensa en supervivencia" },
    "O objetivo não é descobrir “quanto vou ganhar”, mas avaliar quanto risco a estratégia pode exigir antes que sua vantagem estatística tenha tempo de aparecer.": { en: "The goal is not to discover “how much I will make”, but to evaluate how much risk the strategy may demand before its statistical edge has time to appear.", es: "El objetivo no es descubrir “cuánto voy a ganar”, sino evaluar cuánto riesgo puede exigir la estrategia antes de que su ventaja estadística tenga tiempo de aparecer." },
    "Ideia central:": { en: "Core idea:", es: "Idea central:" },
    "Monte Carlo não prevê o próximo trade. Ele ajuda a responder perguntas como “Que drawdown preciso estar preparado para suportar?”, “Qual sequência de perdas é plausível?” e “Meu risco por operação é compatível com os limites da conta?”.": { en: "Monte Carlo does not predict the next trade. It helps answer questions such as “What drawdown should I be prepared to withstand?”, “What losing streak is plausible?” and “Is my risk per trade compatible with the account limits?”.", es: "Monte Carlo no predice el próximo trade. Ayuda a responder preguntas como “¿Qué drawdown debo estar preparado para soportar?”, “¿Qué racha de pérdidas es plausible?” y “¿Mi riesgo por operación es compatible con los límites de la cuenta?”." },
    "Primeiro contato: use nesta ordem": { en: "First contact: use it in this order", es: "Primer contacto: úsalo en este orden" },
    "Carregue o exemplo didático.": { en: "Load the educational example.", es: "Carga el ejemplo didáctico." },
    "Veja como a ferramenta funciona sem precisar ter um histórico próprio.": { en: "See how the tool works before using your own history.", es: "Observa cómo funciona la herramienta sin necesitar un historial propio." },
    "Observe o P50 e o P95 de drawdown.": { en: "Observe P50 and P95 drawdown.", es: "Observa el P50 y el P95 del drawdown." },
    "A mediana mostra um cenário típico; o P95 é um cenário de stress muito mais exigente.": { en: "The median shows a typical scenario; P95 is a much more demanding stress scenario.", es: "La mediana muestra un escenario típico; el P95 es un escenario de estrés mucho más exigente." },
    "Mude apenas o risco por trade.": { en: "Change only the risk per trade.", es: "Cambia solo el riesgo por trade." },
    "Compare 0,5%, 1% e 2% e veja como o risco muda sem alterar o “edge”.": { en: "Compare 0.5%, 1% and 2% and see how risk changes without changing the edge.", es: "Compara 0,5%, 1% y 2% y observa cómo cambia el riesgo sin modificar el edge." },
    "Só depois use seus próprios trades.": { en: "Only then use your own trades.", es: "Solo después usa tus propios trades." },
    "O histórico precisa representar a estratégia que você realmente executa.": { en: "The history must represent the strategy you actually trade.", es: "El historial debe representar la estrategia que realmente ejecutas." },
    "USO PROFISSIONAL": { en: "PROFESSIONAL USE", es: "USO PROFESIONAL" },
    "O que um trader pode aprender com a ferramenta": { en: "What a trader can learn from this tool", es: "Qué puede aprender un trader con esta herramienta" },
    "Dimensionamento": { en: "Position sizing", es: "Dimensionamiento" },
    "Descobrir se o risco por trade transforma uma estratégia razoável em uma trajetória difícil de sobreviver.": { en: "Discover whether risk per trade turns a reasonable strategy into a path that is difficult to survive.", es: "Descubrir si el riesgo por trade transforma una estrategia razonable en una trayectoria difícil de sobrevivir." },
    "Expectativas realistas": { en: "Realistic expectations", es: "Expectativas realistas" },
    "Entender que períodos ruins e sequências de perdas podem ser normais, sem concluir cedo demais que o método “parou de funcionar”.": { en: "Understand that bad periods and losing streaks may be normal without concluding too early that the method “stopped working”.", es: "Entender que los períodos malos y las rachas de pérdidas pueden ser normales, sin concluir demasiado pronto que el método “dejó de funcionar”." },
    "Planejamento de drawdown": { en: "Drawdown planning", es: "Planificación del drawdown" },
    "Comparar o capital disponível e os limites da conta com drawdowns plausíveis, não apenas com o pior drawdown já observado.": { en: "Compare available capital and account limits with plausible drawdowns, not only the worst drawdown already observed.", es: "Comparar el capital disponible y los límites de la cuenta con drawdowns plausibles, no solo con el peor drawdown ya observado." },
    "Prop firms": { en: "Prop firms", es: "Prop firms" },
    "Estimar a chance de atingir uma meta antes de tocar perda diária, perda máxima ou trailing drawdown.": { en: "Estimate the chance of reaching a target before hitting daily loss, maximum loss or trailing drawdown.", es: "Estimar la probabilidad de alcanzar un objetivo antes de tocar pérdida diaria, pérdida máxima o trailing drawdown." },
    "Disciplina": { en: "Discipline", es: "Disciplina" },
    "Preparar-se antecipadamente para variabilidade estatística reduz a tentação de aumentar risco depois de perdas ou abandonar uma estratégia por uma sequência normal.": { en: "Preparing in advance for statistical variability reduces the temptation to increase risk after losses or abandon a strategy because of a normal sequence.", es: "Prepararse de antemano para la variabilidad estadística reduce la tentación de aumentar el riesgo después de pérdidas o abandonar una estrategia por una secuencia normal." },
    "Validação": { en: "Validation", es: "Validación" },
    "Usar Monte Carlo como uma camada de stress test — nunca como substituto de backtest, out-of-sample, custos e análise de regime.": { en: "Use Monte Carlo as a stress-testing layer — never as a substitute for backtesting, out-of-sample validation, costs and regime analysis.", es: "Usar Monte Carlo como una capa de stress test — nunca como sustituto del backtest, out-of-sample, costes y análisis de régimen." },
    "LABORATÓRIO INTERATIVO": { en: "INTERACTIVE LAB", es: "LABORATORIO INTERACTIVO" },
    "Aprenda Monte Carlo executando seis experimentos. A aula configura o simulador por você, mantém as demais variáveis controladas e explica o que mudou depois de cada execução.": { en: "Learn Monte Carlo by running six experiments. The lesson configures the simulator for you, keeps the other variables controlled and explains what changed after each run.", es: "Aprende Monte Carlo ejecutando seis experimentos. La clase configura el simulador por ti, mantiene las demás variables controladas y explica qué cambió después de cada ejecución." },
    "Não iniciada": { en: "Not started", es: "No iniciada" },
    "0 de 6 experimentos": { en: "0 of 6 experiments", es: "0 de 6 experimentos" },
    "Você não precisa preparar dados.": { en: "You do not need to prepare data.", es: "No necesitas preparar datos." },
    "A aula usa uma estratégia hipotética e um histórico demonstrativo já incluídos no projeto.": { en: "The lesson uses a hypothetical strategy and a demonstration trade history already included in the project.", es: "La clase usa una estrategia hipotética y un historial demostrativo ya incluido en el proyecto." },
    "Uma variável por vez.": { en: "One variable at a time.", es: "Una variable a la vez." },
    "Nos primeiros experimentos, somente o risco por trade muda. Assim você consegue enxergar causa e efeito.": { en: "In the first experiments only risk per trade changes, making cause and effect easier to see.", es: "En los primeros experimentos solo cambia el riesgo por trade, para que puedas ver causa y efecto." },
    "Os números serão reais.": { en: "The numbers will be real.", es: "Los números serán reales." },
    "As explicações da aula usam os percentis e probabilidades calculados pelo próprio motor Monte Carlo.": { en: "The lesson explanations use percentiles and probabilities calculated by the Monte Carlo engine itself.", es: "Las explicaciones usan percentiles y probabilidades calculados por el propio motor Monte Carlo." },
    "Objetivo da aula:": { en: "Lesson goal:", es: "Objetivo de la clase:" },
    "perceber a diferença entre possuir uma vantagem estatística e escolher um nível de risco que permita sobreviver à variabilidade dessa vantagem.": { en: "understand the difference between having a statistical edge and choosing a risk level that lets you survive the variability of that edge.", es: "comprender la diferencia entre tener una ventaja estadística y elegir un nivel de riesgo que permita sobrevivir a la variabilidad de esa ventaja." },
    "O que será controlado": { en: "What will be controlled", es: "Qué se controlará" },
    "Pergunta para pensar": { en: "Question to think about", es: "Pregunta para pensar" },
    "Observe principalmente": { en: "Watch especially", es: "Observa principalmente" },
    "O QUE O EXPERIMENTO MOSTROU": { en: "WHAT THE EXPERIMENT SHOWED", es: "QUÉ MOSTRÓ EL EXPERIMENTO" },
    "← Experimento anterior": { en: "← Previous experiment", es: "← Experimento anterior" },
    "Aplicar configuração e simular": { en: "Apply configuration and simulate", es: "Aplicar configuración y simular" },
    "Próximo experimento →": { en: "Next experiment →", es: "Siguiente experimento →" },
    "Encerrar aula": { en: "End lesson", es: "Finalizar clase" },
    "AULA CONCLUÍDA": { en: "LESSON COMPLETED", es: "CLASE COMPLETADA" },
    "Agora você já sabe o que procurar em um Monte Carlo": { en: "Now you know what to look for in a Monte Carlo analysis", es: "Ahora ya sabes qué buscar en un análisis de Monte Carlo" },
    "Edge ≠ trajetória suave": { en: "Edge ≠ smooth path", es: "Edge ≠ trayectoria suave" },
    "Uma estratégia lucrativa pode atravessar sequências difíceis.": { en: "A profitable strategy can go through difficult sequences.", es: "Una estrategia rentable puede atravesar secuencias difíciles." },
    "Risco amplifica tudo": { en: "Risk amplifies everything", es: "El riesgo amplifica todo" },
    "Aumentar o risco não altera o edge; altera a dispersão, o drawdown e a chance de sobreviver.": { en: "Increasing risk does not change the edge; it changes dispersion, drawdown and the chance of survival.", es: "Aumentar el riesgo no cambia el edge; cambia la dispersión, el drawdown y la probabilidad de sobrevivir." },
    "Ordem importa": { en: "Order matters", es: "El orden importa" },
    "Os mesmos trades em outra sequência podem exigir muito mais tolerância ao drawdown.": { en: "The same trades in another order can require much greater drawdown tolerance.", es: "Los mismos trades en otro orden pueden exigir mucha más tolerancia al drawdown." },
    "Reamostragem importa": { en: "Resampling matters", es: "El remuestreo importa" },
    "Bootstrap mostra incerteza não só da ordem, mas também da composição dos resultados futuros.": { en: "Bootstrap shows uncertainty not only in order but also in the composition of future results.", es: "Bootstrap muestra incertidumbre no solo del orden, sino también de la composición de los resultados futuros." },
    "Limites mudam a pergunta": { en: "Limits change the question", es: "Los límites cambian la pregunta" },
    "Em uma prop firm, não basta ganhar: é preciso atingir a meta antes de violar regras.": { en: "At a prop firm, making money is not enough: the target must be reached before violating rules.", es: "En una prop firm no basta con ganar: hay que alcanzar la meta antes de violar reglas." },
    "Monte Carlo é stress test": { en: "Monte Carlo is a stress test", es: "Monte Carlo es un stress test" },
    "Ele não prevê o futuro e não substitui validação da estratégia.": { en: "It does not predict the future and does not replace strategy validation.", es: "No predice el futuro ni sustituye la validación de la estrategia." },
    "Refazer a aula": { en: "Restart lesson", es: "Repetir la clase" },
    "Explorar o simulador livremente": { en: "Explore the simulator freely", es: "Explorar el simulador libremente" },
    "Iniciar aula prática": { en: "Start practical lesson", es: "Iniciar clase práctica" },
    "Leva apenas alguns experimentos; não há respostas certas ou erradas.": { en: "It only takes a few experiments; the goal is to reason before seeing the result.", es: "Solo toma unos pocos experimentos; el objetivo es razonar antes de ver el resultado." },
    "ESCOLHA O EXPERIMENTO": { en: "CHOOSE THE EXPERIMENT", es: "ELIGE EL EXPERIMENTO" },
    "Dois simuladores, duas perguntas diferentes": { en: "Two simulators, two different questions", es: "Dos simuladores, dos preguntas diferentes" },
    "Estratégia / Trades": { en: "Strategy / Trades", es: "Estrategia / Trades" },
    "Use para estudar a robustez de uma estratégia, equity, drawdown, risco de ruína e regras de conta.": { en: "Use it to study strategy robustness, equity, drawdown, risk of ruin and account rules.", es: "Úsalo para estudiar robustez de estrategia, equity, drawdown, riesgo de ruina y reglas de cuenta." },
    "Preço / GBM": { en: "Price / GBM", es: "Precio / GBM" },
    "Use para aprender como retorno e volatilidade geram diferentes trajetórias possíveis de preço. É didático, não um modelo de previsão.": { en: "Use it to learn how return and volatility generate different possible price paths. It is educational, not a forecasting model.", es: "Úsalo para aprender cómo retorno y volatilidad generan distintas trayectorias de precio. Es didáctico, no un modelo de predicción." },
    "ROBUSTEZ DA ESTRATÉGIA": { en: "STRATEGY ROBUSTNESS", es: "ROBUSTEZ DE LA ESTRATEGIA" },
    "Monte Carlo de operações": { en: "Trade Monte Carlo", es: "Monte Carlo de operaciones" },
    "Carregar exemplo didático": { en: "Load educational example", es: "Cargar ejemplo didáctico" },
    "Neste modo, você pode começar por uma hipótese simples de estratégia ou usar resultados reais de operações passadas. Para aprender, comece por Parâmetros; para analisar uma estratégia existente, prefira Histórico de trades.": { en: "In this mode you can start from a simple strategy hypothesis or use real past trade results. To learn, start with Parameters; to analyze an existing strategy, prefer Trade history.", es: "En este modo puedes comenzar con una hipótesis simple de estrategia o usar resultados reales de operaciones pasadas. Para aprender, comienza con Parámetros; para analizar una estrategia existente, usa Historial de trades." },
    "O que significam estes campos?": { en: "What do these fields mean?", es: "¿Qué significan estos campos?" },
    "Capital inicial": { en: "Starting capital", es: "Capital inicial" },
    "É o ponto de partida da equity. Ele serve de referência para risco, metas e limites.": { en: "The starting point of the equity curve and the reference for risk, targets and limits.", es: "Es el punto de partida de la equity y la referencia para riesgo, metas y límites." },
    "Taxa de acerto": { en: "Win rate", es: "Tasa de acierto" },
    "Percentual de trades vencedores. Sozinha, ela não diz se uma estratégia é boa.": { en: "Percentage of winning trades. By itself it does not tell you whether a strategy is good.", es: "Porcentaje de trades ganadores. Por sí sola no dice si una estrategia es buena." },
    "Reward : Risk": { en: "Reward : Risk", es: "Reward : Risk" },
    "Quanto se ganha, em média, para cada unidade arriscada. Ex.: 1,5 significa ganhar 1,5R quando acerta e perder 1R quando erra.": { en: "How much is gained on average for each unit risked. Example: 1.5 means +1.5R on a win and -1R on a loss.", es: "Cuánto se gana en promedio por cada unidad arriesgada. Ej.: 1,5 significa +1,5R al ganar y -1R al perder." },
    "Risco por trade": { en: "Risk per trade", es: "Riesgo por trade" },
    "Percentual do capital exposto em cada operação. Pequenas mudanças aqui podem alterar muito o drawdown.": { en: "Percentage of capital exposed on each trade. Small changes here can greatly change drawdown.", es: "Porcentaje del capital expuesto en cada operación. Pequeños cambios aquí pueden alterar mucho el drawdown." },
    "Position sizing": { en: "Position sizing", es: "Position sizing" },
    "No composto, o tamanho acompanha a equity; no fixo, o risco monetário parte sempre do capital inicial.": { en: "With compounding, size follows equity; with fixed sizing, monetary risk is based on starting capital.", es: "En compuesto, el tamaño sigue la equity; en fijo, el riesgo monetario parte siempre del capital inicial." },
    "Custo por trade": { en: "Cost per trade", es: "Coste por trade" },
    "Corretagem, taxas e outros custos. Ignorar custos costuma superestimar o desempenho.": { en: "Commissions, fees and other costs. Ignoring costs often overstates performance.", es: "Comisiones, tasas y otros costes. Ignorar costes suele sobreestimar el rendimiento." },
    "Parâmetros": { en: "Parameters", es: "Parámetros" },
    "Histórico de trades": { en: "Trade history", es: "Historial de trades" },
    "Composto (% da equity)": { en: "Compound (% of equity)", es: "Compuesto (% de equity)" },
    "Fixo (% do capital inicial)": { en: "Fixed (% of starting capital)", es: "Fijo (% del capital inicial)" },
    "Método": { en: "Method", es: "Método" },
    "Bootstrap com reposição": { en: "Bootstrap with replacement", es: "Bootstrap con reposición" },
    "Reshuffle / permutação": { en: "Reshuffle / permutation", es: "Reshuffle / permutación" },
    "Block bootstrap": { en: "Block bootstrap", es: "Block bootstrap" },
    "Tamanho do bloco": { en: "Block size", es: "Tamaño del bloque" },
    "Multiplicador do P&L": { en: "P&L multiplier", es: "Multiplicador del P&L" },
    "Custo adicional por trade": { en: "Additional cost per trade", es: "Coste adicional por trade" },
    "Cole o P&L dos trades ou um CSV": { en: "Paste trade P&L or a CSV", es: "Pega el P&L de los trades o un CSV" },
    "Trades por simulação": { en: "Trades per simulation", es: "Trades por simulación" },
    "Simulações": { en: "Simulations", es: "Simulaciones" },
    "Semente": { en: "Seed", es: "Semilla" },
    "Trades por dia": { en: "Trades per day", es: "Trades por día" },
    "Regras de risco / Prop Firm": { en: "Risk / Prop Firm rules", es: "Reglas de riesgo / Prop Firm" },
    "Use esta seção quando quiser descobrir não apenas se a estratégia ganha dinheiro, mas se ela consegue sobreviver às regras da conta até chegar à meta.": { en: "Use this section when you want to know not only whether the strategy makes money, but whether it can survive the account rules until reaching the target.", es: "Usa esta sección cuando quieras saber no solo si la estrategia gana dinero, sino si puede sobrevivir a las reglas de la cuenta hasta llegar a la meta." },
    "Meta de lucro (%)": { en: "Profit target (%)", es: "Meta de beneficio (%)" },
    "Perda máxima (%)": { en: "Maximum loss (%)", es: "Pérdida máxima (%)" },
    "Perda diária (%)": { en: "Daily loss (%)", es: "Pérdida diaria (%)" },
    "Ruin threshold (%)": { en: "Ruin threshold (%)", es: "Umbral de ruina (%)" },
    "Regra de drawdown": { en: "Drawdown rule", es: "Regla de drawdown" },
    "Estático": { en: "Static", es: "Estático" },
    "Desativado": { en: "Disabled", es: "Desactivado" },
    "Trailing intraday": { en: "Intraday trailing", es: "Trailing intradía" },
    "Trailing EOD": { en: "EOD trailing", es: "Trailing EOD" },
    "As regras são genéricas. Confira a metodologia e adapte os valores às regras reais da firma que deseja estudar.": { en: "These rules are generic. Check the methodology and adapt the values to the actual rules of the firm you want to study.", es: "Estas reglas son genéricas. Consulta la metodología y adapta los valores a las reglas reales de la firma que quieras estudiar." },
    "Executar simulação": { en: "Run simulation", es: "Ejecutar simulación" },
    "Exportar resumo JSON": { en: "Export JSON summary", es: "Exportar resumen JSON" },
    "TRAJETÓRIAS DE PREÇO": { en: "PRICE PATHS", es: "TRAYECTORIAS DE PRECIO" },
    "Movimento Browniano Geométrico": { en: "Geometric Brownian Motion", es: "Movimiento Browniano Geométrico" },
    "Preço inicial": { en: "Starting price", es: "Precio inicial" },
    "Retorno anual esperado (%)": { en: "Expected annual return (%)", es: "Retorno anual esperado (%)" },
    "Volatilidade anual (%)": { en: "Annual volatility (%)", es: "Volatilidad anual (%)" },
    "Passos": { en: "Steps", es: "Pasos" },
    "Passos por ano": { en: "Steps per year", es: "Pasos por año" },
    "Executar GBM": { en: "Run GBM", es: "Ejecutar GBM" },
    "Como pensar neste módulo:": { en: "How to think about this module:", es: "Cómo pensar en este módulo:" },
    "ele mostra por que dois ativos com o mesmo retorno esperado podem terminar em lugares muito diferentes quando a volatilidade muda.": { en: "it shows why two assets with the same expected return can end in very different places when volatility changes.", es: "muestra por qué dos activos con el mismo retorno esperado pueden terminar en lugares muy distintos cuando cambia la volatilidad." },
    "GBM é um modelo didático: assume retorno lognormal com volatilidade constante e não captura saltos, caudas pesadas ou mudanças de regime. Não use este módulo como previsão de preço.": { en: "GBM is an educational model: it assumes lognormal returns with constant volatility and does not capture jumps, fat tails or regime changes. Do not use this module as a price forecast.", es: "GBM es un modelo didáctico: asume retornos lognormales con volatilidad constante y no captura saltos, colas pesadas ni cambios de régimen. No uses este módulo como predicción de precio." },
    "RESULTADOS": { en: "RESULTS", es: "RESULTADOS" },
    "Distribuição simulada": { en: "Simulated distribution", es: "Distribución simulada" },
    "Trajetórias": { en: "Paths", es: "Trayectorias" },
    "Distribuição final": { en: "Final distribution", es: "Distribución final" },
    "Como interpretar": { en: "How to interpret", es: "Cómo interpretar" },
    "GLOSSÁRIO DO RESULTADO": { en: "RESULT GLOSSARY", es: "GLOSARIO DE RESULTADOS" },
    "Como ler as principais métricas": { en: "How to read the main metrics", es: "Cómo leer las métricas principales" },
    "P5 do saldo": { en: "P5 balance", es: "P5 del saldo" },
    "Um cenário de cauda negativa: apenas cerca de 5% das simulações terminaram abaixo desse valor.": { en: "A negative-tail scenario: only about 5% of simulations finished below this value.", es: "Un escenario de cola negativa: solo cerca del 5% de las simulaciones terminaron por debajo de este valor." },
    "P50 / Mediana": { en: "P50 / Median", es: "P50 / Mediana" },
    "Metade das simulações ficou abaixo e metade acima. É um centro da distribuição, não uma previsão.": { en: "Half of simulations finished below and half above. It is a center of the distribution, not a forecast.", es: "La mitad de las simulaciones quedó por debajo y la mitad por encima. Es un centro de la distribución, no una predicción." },
    "P95 de drawdown": { en: "P95 drawdown", es: "P95 de drawdown" },
    "Em aproximadamente 95% das simulações o drawdown máximo ficou até esse valor. É útil como cenário de stress.": { en: "In about 95% of simulations, maximum drawdown stayed at or below this value. It is useful as a stress scenario.", es: "En aproximadamente el 95% de las simulaciones, el drawdown máximo quedó hasta este valor. Es útil como escenario de estrés." },
    "Risco de violação": { en: "Breach risk", es: "Riesgo de incumplimiento" },
    "Percentual de caminhos que tocaram algum limite configurado, como ruína, perda diária ou perda máxima.": { en: "Percentage of paths that hit a configured limit such as ruin, daily loss or maximum loss.", es: "Porcentaje de trayectorias que tocaron algún límite configurado, como ruina, pérdida diaria o pérdida máxima." },
    "Meta antes da violação": { en: "Target before breach", es: "Meta antes del incumplimiento" },
    "Mais útil em prop firms: mede quantos caminhos chegaram à meta antes de quebrar alguma regra.": { en: "Especially useful for prop firms: measures how many paths reached the target before breaking a rule.", es: "Especialmente útil en prop firms: mide cuántas trayectorias alcanzaron la meta antes de romper alguna regla." },
    "Sequência de perdas": { en: "Losing streak", es: "Racha de pérdidas" },
    "Ajuda a preparar risco e comportamento. Uma estratégia lucrativa pode atravessar várias perdas consecutivas.": { en: "Helps prepare risk and behavior. A profitable strategy can go through several consecutive losses.", es: "Ayuda a preparar el riesgo y el comportamiento. Una estrategia rentable puede atravesar varias pérdidas consecutivas." },
    "ONDE USAR": { en: "WHERE TO USE IT", es: "DÓNDE USARLO" },
    "Web ou computador local": { en: "Web or local computer", es: "Web o computadora local" },
    "GitHub Pages": { en: "GitHub Pages", es: "GitHub Pages" },
    "Abra no navegador e use normalmente. Todo o cálculo continua sendo feito no seu dispositivo.": { en: "Open it in the browser and use it normally. All calculations continue to run on your device.", es: "Ábrelo en el navegador y úsalo normalmente. Todos los cálculos siguen ejecutándose en tu dispositivo." },
    "Versão offline": { en: "Offline version", es: "Versión offline" },
    "Baixe offline.html e abra com dois cliques. Não exige terminal, Python, Node.js ou instalação.": { en: "Download offline.html and open it with a double click. No terminal, Python, Node.js or installation is required.", es: "Descarga offline.html y ábrelo con doble clic. No requiere terminal, Python, Node.js ni instalación." },
    "Baixar offline.html": { en: "Download offline.html", es: "Descargar offline.html" },
    "Ver tutorial de uso local": { en: "View local-use tutorial", es: "Ver tutorial de uso local" },
    "Abrir guia didático": { en: "Open educational guide", es: "Abrir guía didáctica" },
    "O que este simulador responde — e o que não responde": { en: "What this simulator answers — and what it does not", es: "Qué responde este simulador — y qué no responde" },
    "Ele mede a variabilidade dos resultados sob as hipóteses fornecidas. Não prova que uma estratégia continuará tendo edge, não corrige overfitting e não substitui validação fora da amostra, custos realistas, slippage, liquidez e testes por regime.": { en: "It measures result variability under the supplied assumptions. It does not prove a strategy will keep its edge, does not fix overfitting, and does not replace out-of-sample validation, realistic costs, slippage, liquidity and regime testing.", es: "Mide la variabilidad de los resultados bajo las hipótesis suministradas. No prueba que una estrategia mantendrá su edge, no corrige overfitting y no sustituye validación fuera de muestra, costes realistas, slippage, liquidez y pruebas por régimen." },
    "Leia a metodologia completa →": { en: "Read the full methodology →", es: "Lee la metodología completa →" },
    "Ferramenta educacional. Resultados simulados não garantem desempenho futuro.": { en: "Educational tool. Simulated results do not guarantee future performance.", es: "Herramienta educativa. Los resultados simulados no garantizan rendimiento futuro." },
    "VOCÊ ESTÁ NA VERSÃO OFFLINE": { en: "YOU ARE USING THE OFFLINE VERSION", es: "ESTÁS USANDO LA VERSIÓN OFFLINE" },
    "Pronta para uso local": { en: "Ready for local use", es: "Lista para uso local" },
    "Este arquivo é autossuficiente: a interface, os gráficos e o motor estatístico estão incorporados nele. Você pode guardá-lo em qualquer pasta e abri-lo novamente com dois cliques.": { en: "This file is self-contained: the interface, charts and statistical engine are embedded in it. You can keep it in any folder and open it again with a double click.", es: "Este archivo es autosuficiente: la interfaz, los gráficos y el motor estadístico están incorporados. Puedes guardarlo en cualquier carpeta y abrirlo de nuevo con doble clic." },
    "Ver projeto e documentação no GitHub": { en: "View project and documentation on GitHub", es: "Ver proyecto y documentación en GitHub" },
    "DESAFIO DE PREVISÃO": { en: "PREDICTION CHALLENGE", es: "DESAFÍO DE PREDICCIÓN" },
    "Escolha sua previsão antes de simular": { en: "Choose your prediction before simulating", es: "Elige tu predicción antes de simular" },
    "Sua previsão": { en: "Your prediction", es: "Tu predicción" },
    "Previsão registrada. Agora execute a simulação.": { en: "Prediction recorded. Now run the simulation.", es: "Predicción registrada. Ahora ejecuta la simulación." },
    "Acertou a previsão.": { en: "Your prediction was correct.", es: "Acertaste la predicción." },
    "Sua previsão não se confirmou.": { en: "Your prediction was not confirmed.", es: "Tu predicción no se confirmó." },
    "Ver gráficos e distribuição completos ↓": { en: "View full charts and distribution ↓", es: "Ver gráficos y distribución completos ↓" }
  };

  Object.assign(phraseTranslations, {
    "Uma ferramenta educacional para aprender a pensar em": { en: "An educational tool for learning to think in", es: "Una herramienta educativa para aprender a pensar en" },
    "probabilidades": { en: "probabilities", es: "probabilidades" },
    ", e não em uma única curva de resultados. Teste milhares de futuros possíveis para uma estratégia, estime drawdowns, sequências de perdas, risco de violação e probabilidade de atingir metas.": { en: ", not in a single equity curve. Test thousands of possible futures for a strategy and estimate drawdowns, losing streaks, breach risk and target probabilities.", es: ", y no en una sola curva de resultados. Prueba miles de futuros posibles para una estrategia y estima drawdowns, rachas de pérdidas, riesgo de incumplimiento y probabilidades de alcanzar metas." },
    "Um backtest mostra": { en: "A backtest shows", es: "Un backtest muestra" },
    "uma sequência histórica": { en: "one historical sequence", es: "una secuencia histórica" },
    ". O problema é que duas estratégias com a mesma média de ganhos podem produzir experiências muito diferentes quando a ordem dos ganhos e perdas muda. Monte Carlo cria muitas sequências plausíveis para revelar essa incerteza.": { en: ". The problem is that two strategies with the same average results can create very different experiences when the order of wins and losses changes. Monte Carlo creates many plausible sequences to reveal that uncertainty.", es: ". El problema es que dos estrategias con los mismos resultados medios pueden producir experiencias muy distintas cuando cambia el orden de ganancias y pérdidas. Monte Carlo crea muchas secuencias plausibles para revelar esa incertidumbre." },
    "Neste modo, você pode começar por uma hipótese simples de estratégia ou usar resultados reais de operações passadas. Para aprender, comece por": { en: "In this mode you can start from a simple strategy hypothesis or use real past trade results. To learn, start with", es: "En este modo puedes comenzar con una hipótesis simple de estrategia o usar resultados reales de operaciones pasadas. Para aprender, comienza con" },
    "; para analisar uma estratégia existente, prefira": { en: "; to analyze an existing strategy, prefer", es: "; para analizar una estrategia existente, usa" },
    ".": { en: ".", es: "." },
    "Use esta seção quando quiser descobrir não apenas se a estratégia ganha dinheiro, mas se ela consegue": { en: "Use this section when you want to know not only whether the strategy makes money, but whether it can", es: "Usa esta sección cuando quieras saber no solo si la estrategia gana dinero, sino si puede" },
    "sobreviver às regras da conta": { en: "survive the account rules", es: "sobrevivir a las reglas de la cuenta" },
    "até chegar à meta.": { en: "until reaching the target.", es: "hasta alcanzar la meta." },
    "Taxa de acerto (%)": { en: "Win rate (%)", es: "Tasa de acierto (%)" },
    "Risco por trade (%)": { en: "Risk per trade (%)", es: "Riesgo por trade (%)" },
    "Custo por trade": { en: "Cost per trade", es: "Coste por trade" },
    "Aceita um número por linha ou CSV delimitado por vírgula, ponto e vírgula ou tabulação.": { en: "Accepts one number per line or CSV delimited by comma, semicolon or tab.", es: "Acepta un número por línea o CSV delimitado por coma, punto y coma o tabulación." },
    "Antes de cada simulação, faça uma previsão. O objetivo é comparar sua intuição com o comportamento estatístico observado.": { en: "Before each simulation, make a prediction. The goal is to compare your intuition with the statistical behavior you observe.", es: "Antes de cada simulación, haz una predicción. El objetivo es comparar tu intuición con el comportamiento estadístico observado." },
    "Preço / GBM": { en: "Price / GBM", es: "Precio / GBM" },
    "P5 do saldo final": { en: "P5 final balance", es: "P5 del saldo final" },
    "Sequência de perdas P95": { en: "P95 losing streak", es: "Racha de pérdidas P95" },
    "Pior drawdown observado": { en: "Worst observed drawdown", es: "Peor drawdown observado" },
    "Amplitude entre cenários bons e ruins": { en: "Spread between good and bad scenarios", es: "Amplitud entre escenarios buenos y malos" },
    "Simulando...": { en: "Simulating...", es: "Simulando..." }
  });

  Object.assign(phraseTranslations, {
    "Aula intermediária": { en: "Intermediate lesson", es: "Clase intermedia" },
    "LABORATÓRIO INTERMEDIÁRIO": { en: "INTERMEDIATE LAB", es: "LABORATORIO INTERMEDIO" },
    "Expectância, Win Rate, Payoff e Risco de Ruína": { en: "Expectancy, Win Rate, Payoff and Risk of Ruin", es: "Expectativa, Win Rate, Payoff y Riesgo de Ruina" },
    "Depois de entender drawdown e variabilidade, avance para a relação entre taxa de acerto, payoff, expectância e dimensionamento. São seis experimentos com desafios de previsão antes de cada simulação.": { en: "After understanding drawdown and variability, move on to the relationship between win rate, payoff, expectancy and position sizing. Six experiments include prediction challenges before each simulation.", es: "Después de comprender drawdown y variabilidad, avanza hacia la relación entre tasa de acierto, payoff, expectativa y dimensionamiento. Son seis experimentos con desafíos de predicción antes de cada simulación." },
    "Win rate não é qualidade.": { en: "Win rate is not quality.", es: "Win rate no es calidad." },
    "Uma estratégia pode acertar muito e ainda perder dinheiro se os ganhos forem pequenos diante das perdas.": { en: "A strategy can win often and still lose money if wins are small relative to losses.", es: "Una estrategia puede acertar mucho y aun perder dinero si las ganancias son pequeñas frente a las pérdidas." },
    "Expectância combina probabilidade e payoff.": { en: "Expectancy combines probability and payoff.", es: "La expectativa combina probabilidad y payoff." },
    "A aula usa a relação E[R] = p × ganho em R − (1 − p) × 1R para comparar estratégias.": { en: "The lesson uses E[R] = p × win in R − (1 − p) × 1R to compare strategies.", es: "La clase usa E[R] = p × ganancia en R − (1 − p) × 1R para comparar estrategias." },
    "Edge não define o risco aceitável.": { en: "Edge does not define acceptable risk.", es: "El edge no define el riesgo aceptable." },
    "Mesmo com expectância positiva, um sizing agressivo pode elevar drawdown e probabilidade de atingir um limite de perda.": { en: "Even with positive expectancy, aggressive sizing can raise drawdown and the probability of hitting a loss limit.", es: "Incluso con expectativa positiva, un sizing agresivo puede elevar drawdown y la probabilidad de alcanzar un límite de pérdida." },
    "Pré-requisito recomendado:": { en: "Recommended prerequisite:", es: "Prerrequisito recomendado:" },
    "conclua primeiro a Aula prática guiada sobre drawdown, risco por trade, Reshuffle e Bootstrap.": { en: "complete the guided practical lesson on drawdown, risk per trade, Reshuffle and Bootstrap first.", es: "completa primero la clase práctica guiada sobre drawdown, riesgo por trade, Reshuffle y Bootstrap." },
    "Hipóteses do experimento": { en: "Experiment assumptions", es: "Hipótesis del experimento" },
    "Simular experimento": { en: "Simulate experiment", es: "Simular experimento" },
    "AULA INTERMEDIÁRIA CONCLUÍDA": { en: "INTERMEDIATE LESSON COMPLETED", es: "CLASE INTERMEDIA COMPLETADA" },
    "Win rate, payoff e risco agora podem ser lidos em conjunto": { en: "Win rate, payoff and risk can now be read together", es: "Win rate, payoff y riesgo ahora pueden leerse en conjunto" },
    "Win rate isolado engana": { en: "Win rate alone can mislead", es: "El win rate aislado engaña" },
    "70% de acerto pode ter expectância negativa.": { en: "A 70% win rate can have negative expectancy.", es: "Un 70% de acierto puede tener expectativa negativa." },
    "Payoff compensa baixa precisão": { en: "Payoff can compensate for low accuracy", es: "El payoff compensa baja precisión" },
    "Uma estratégia de 35% pode ter edge positivo se os ganhos forem suficientemente maiores.": { en: "A 35% strategy can have a positive edge if wins are sufficiently larger.", es: "Una estrategia del 35% puede tener edge positivo si las ganancias son suficientemente mayores." },
    "Mesma expectância ≠ mesma experiência": { en: "Same expectancy ≠ same experience", es: "Misma expectativa ≠ misma experiencia" },
    "Estratégias com o mesmo E[R] podem produzir losing streaks e drawdowns diferentes.": { en: "Strategies with the same E[R] can produce different losing streaks and drawdowns.", es: "Estrategias con el mismo E[R] pueden producir rachas de pérdidas y drawdowns distintos." },
    "Risco de ruína depende do sizing": { en: "Risk of ruin depends on sizing", es: "El riesgo de ruina depende del sizing" },
    "O mesmo edge pode gerar probabilidades de violação muito diferentes.": { en: "The same edge can generate very different breach probabilities.", es: "El mismo edge puede generar probabilidades de incumplimiento muy diferentes." },
    "Kelly não é sinônimo de conforto": { en: "Kelly does not mean comfort", es: "Kelly no es sinónimo de comodidad" },
    "Uma fração teoricamente orientada a crescimento pode implicar drawdowns difíceis de tolerar.": { en: "A theoretically growth-oriented fraction can imply drawdowns that are hard to tolerate.", es: "Una fracción teóricamente orientada al crecimiento puede implicar drawdowns difíciles de tolerar." },
    "Profissional combina métricas": { en: "Professionals combine metrics", es: "El profesional combina métricas" },
    "Win rate, payoff, expectância, drawdown e sobrevivência precisam ser avaliados juntos.": { en: "Win rate, payoff, expectancy, drawdown and survival must be evaluated together.", es: "Win rate, payoff, expectativa, drawdown y supervivencia deben evaluarse juntos." },
    "Refazer aula intermediária": { en: "Restart intermediate lesson", es: "Repetir clase intermedia" },
    "Testar minhas próprias hipóteses": { en: "Test my own hypotheses", es: "Probar mis propias hipótesis" },
    "Iniciar aula intermediária": { en: "Start intermediate lesson", es: "Iniciar clase intermedia" },
    "Faça uma previsão em cada etapa antes de ver os resultados.": { en: "Make a prediction at each step before seeing the results.", es: "Haz una predicción en cada etapa antes de ver los resultados." },
    "Progresso da aula intermediária": { en: "Intermediate lesson progress", es: "Progreso de la clase intermedia" }
  });

  Object.assign(phraseTranslations, {
    "Probabilidade e Expectância": { en: "Probability and Expectancy", es: "Probabilidad y Expectativa" }
  });

  Object.assign(phraseTranslations, {
    "Estatística aplicada": { en: "Applied statistics", es: "Estadística aplicada" }
  });

  Object.assign(phraseTranslations, {
    "Distribuições e Bayes": { en: "Distributions and Bayes", es: "Distribuciones y Bayes" }
  });

  Object.assign(phraseTranslations, {
    "Validação de estratégias": { en: "Strategy validation", es: "Validación de estrategias" }
  });

  Object.assign(phraseTranslations, {
    "Sessão Day Trade": { en: "Day-Trading Session", es: "Sesión Day Trade" },
    "MONTE CARLO · DAY TRADE · RISCO": { en: "MONTE CARLO · DAY TRADING · RISK", es: "MONTE CARLO · DAY TRADE · RIESGO" },
    "Por que Monte Carlo importa para um day trader?": { en: "Why does Monte Carlo matter to a day trader?", es: "¿Por qué Monte Carlo es importante para un day trader?" },
    "Uma ferramenta educacional voltada exclusivamente a day traders para aprender a pensar em probabilidades, sessões e distribuições — não em uma única curva de resultados. Todas as análises pressupõem operações abertas e encerradas no mesmo pregão.": {
      en: "An educational tool built exclusively for day traders to learn to think in probabilities, sessions and distributions — not a single equity curve. All analyses assume positions are opened and closed within the same trading session.",
      es: "Una herramienta educativa creada exclusivamente para day traders para aprender a pensar en probabilidades, sesiones y distribuciones, y no en una sola curva de resultados. Todos los análisis suponen operaciones abiertas y cerradas dentro de la misma sesión."
    }
  });

  Object.assign(phraseTranslations, {
    "Cara ou Coroa": { en: "Heads or Tails", es: "Cara o Cruz" }
  });

  const messages = {
    "lesson.experiment": { pt: "Experimento {current} de {total}", en: "Experiment {current} of {total}", es: "Experimento {current} de {total}" },
    "lesson.progress": { pt: "{completed} de {total} experimentos", en: "{completed} of {total} experiments", es: "{completed} de {total} experimentos" },
    "lesson.kicker": { pt: "Experimento {n}", en: "Experiment {n}", es: "Experimento {n}" },
    "lesson.completed": { pt: "Concluída", en: "Completed", es: "Completada" },
    "lesson.rerun": { pt: "Executar novamente", en: "Run again", es: "Ejecutar nuevamente" },
    "lesson.compareAgain": { pt: "Executar comparação novamente", en: "Run comparison again", es: "Ejecutar comparación nuevamente" },
    "lesson.runComparison": { pt: "Executar comparação de riscos", en: "Run risk comparison", es: "Ejecutar comparación de riesgos" },
    "lesson.finish": { pt: "Concluir aula →", en: "Finish lesson →", es: "Finalizar clase →" },
    "lesson.predictionScore": { pt: "Desafios de previsão: {score}/{total} respostas corretas.", en: "Prediction challenges: {score}/{total} correct answers.", es: "Desafíos de predicción: {score}/{total} respuestas correctas." },
    "trade.detected": { pt: "{count} trades detectados · {wins} ganhos · {losses} perdas · média {avg}", en: "{count} trades detected · {wins} wins · {losses} losses · average {avg}", es: "{count} trades detectados · {wins} ganancias · {losses} pérdidas · media {avg}" },
    "trade.empty": { pt: "Aceita um número por linha ou CSV delimitado por vírgula, ponto e vírgula ou tabulação.", en: "Accepts one number per line or CSV delimited by comma, semicolon or tab.", es: "Acepta un número por línea o CSV delimitado por coma, punto y coma o tabulación." },
    "results.strategy": { pt: "Distribuição da estratégia", en: "Strategy distribution", es: "Distribución de la estrategia" },
    "results.gbm": { pt: "Distribuição de preço — GBM", en: "Price distribution — GBM", es: "Distribución de precio — GBM" },
    "results.meta": { pt: "{sims} simulações · semente {seed}", en: "{sims} simulations · seed {seed}", es: "{sims} simulaciones · semilla {seed}" },
    "results.profitProb": { pt: "Prob. de lucro", en: "Profit probability", es: "Prob. de beneficio" },
    "results.profitProbSub": { pt: "terminou acima do capital inicial", en: "finished above starting capital", es: "terminó por encima del capital inicial" },
    "results.breach": { pt: "Risco de violação", en: "Breach risk", es: "Riesgo de incumplimiento" },
    "results.breachSub": { pt: "ruína, perda máx. ou perda diária", en: "ruin, max loss or daily loss", es: "ruina, pérdida máx. o pérdida diaria" },
    "results.targetBefore": { pt: "Meta antes da violação", en: "Target before breach", es: "Meta antes del incumplimiento" },
    "results.targetBeforeSub": { pt: "atingiu a meta primeiro", en: "target was reached first", es: "alcanzó la meta primero" },
    "results.medianBalance": { pt: "Saldo mediano", en: "Median balance", es: "Saldo mediano" },
    "results.medianDd": { pt: "Drawdown mediano", en: "Median drawdown", es: "Drawdown mediano" },
    "results.worstDd": { pt: "Pior DD observado", en: "Worst observed DD", es: "Peor DD observado" },
    "results.maxAmong": { pt: "máximo entre as simulações", en: "maximum across simulations", es: "máximo entre las simulaciones" },
    "results.lossStreak": { pt: "Seq. perdas P95", en: "P95 losing streak", es: "Racha de pérdidas P95" },
    "results.winRateSample": { pt: "Win rate da amostra", en: "Sample win rate", es: "Win rate de la muestra" },
    "results.expectancy": { pt: "Expectância", en: "Expectancy", es: "Expectativa" },
    "results.finalBalanceDistribution": { pt: "Distribuição do saldo final", en: "Final balance distribution", es: "Distribución del saldo final" },
    "results.finalBalance": { pt: "Saldo final", en: "Final balance", es: "Saldo final" },
    "results.distribution": { pt: "Distribuição", en: "Distribution", es: "Distribución" },
    "results.interpretTrade": { pt: "Em 95% das simulações, o drawdown máximo ficou em até aproximadamente {dd}. O saldo final P5 foi {p5} e o P95 foi {p95}. {ddMessage} Use esses percentis como faixa de stress test, não como promessa de resultado.", en: "In 95% of simulations, maximum drawdown stayed at or below approximately {dd}. Final balance P5 was {p5} and P95 was {p95}. {ddMessage} Use these percentiles as a stress-test range, not as a promise of performance.", es: "En el 95% de las simulaciones, el drawdown máximo quedó en aproximadamente {dd} o menos. El saldo final P5 fue {p5} y el P95 fue {p95}. {ddMessage} Usa estos percentiles como rango de stress test, no como promesa de resultado." },
    "results.ddHigh": { pt: "O P95 de drawdown é elevado; o dimensionamento merece atenção.", en: "P95 drawdown is high; position sizing deserves attention.", es: "El P95 de drawdown es elevado; el dimensionamiento merece atención." },
    "results.ddLow": { pt: "O P95 de drawdown está abaixo de 30% nesta configuração, mas ainda depende das hipóteses da amostra.", en: "P95 drawdown is below 30% in this configuration, but still depends on the sample assumptions.", es: "El P95 de drawdown está por debajo del 30% en esta configuración, pero sigue dependiendo de las hipótesis de la muestra." },
    "results.priceMedian": { pt: "Preço mediano", en: "Median price", es: "Precio mediano" },
    "results.priceP5": { pt: "Preço P5", en: "P5 price", es: "Precio P5" },
    "results.priceP95": { pt: "Preço P95", en: "P95 price", es: "Precio P95" },
    "results.aboveStart": { pt: "Prob. acima do início", en: "Prob. above start", es: "Prob. por encima del inicio" },
    "results.aboveStartSub": { pt: "preço final > preço inicial", en: "final price > starting price", es: "precio final > precio inicial" },
    "results.var": { pt: "VaR empírico 95%", en: "Empirical VaR 95%", es: "VaR empírico 95%" },
    "results.finalPriceDistribution": { pt: "Distribuição do preço final", en: "Final price distribution", es: "Distribución del precio final" },
    "results.finalPrice": { pt: "Preço final", en: "Final price", es: "Precio final" },
    "results.gbmInterpret": { pt: "Sob as hipóteses de retorno e volatilidade fornecidas, metade das simulações terminou abaixo de {median} e metade acima. A faixa P5–P95 foi de {p5} a {p95}. GBM não modela saltos, volatilidade variável nem regimes.", en: "Under the supplied return and volatility assumptions, half the simulations finished below {median} and half above. The P5–P95 range was {p5} to {p95}. GBM does not model jumps, changing volatility or regimes.", es: "Bajo las hipótesis de retorno y volatilidad suministradas, la mitad de las simulaciones terminó por debajo de {median} y la mitad por encima. El rango P5–P95 fue de {p5} a {p95}. GBM no modela saltos, volatilidad variable ni regímenes." }
  };

  const nodeOriginal = new WeakMap();
  const attrOriginal = new WeakMap();
  let current = "pt-BR";
  let applying = false;

  function localeKey(lang = current) {
    return lang === "en" ? "en" : lang === "es" ? "es" : "pt";
  }

  function interpolate(value, vars = {}) {
    return String(value).replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
  }

  function t(key, vars = {}) {
    const entry = messages[key];
    if (!entry) return key;
    return interpolate(entry[localeKey()] ?? entry.pt, vars);
  }

  function text(value) {
    const clean = String(value ?? "").trim();
    const entry = phraseTranslations[clean];
    if (!entry || current === "pt-BR") return clean;
    return entry[localeKey()] ?? clean;
  }

  function translatedPhrase(original) {
    const clean = original.trim();
    const entry = phraseTranslations[clean];
    if (!entry || current === "pt-BR") return original;
    const translated = entry[localeKey()] ?? clean;
    const prefix = original.match(/^\s*/)?.[0] ?? "";
    const suffix = original.match(/\s*$/)?.[0] ?? "";
    return prefix + translated + suffix;
  }

  function translateTextNode(node) {
    if (!node.nodeValue || !node.nodeValue.trim()) return;
    if (!nodeOriginal.has(node)) nodeOriginal.set(node, node.nodeValue);
    node.nodeValue = translatedPhrase(nodeOriginal.get(node));
  }

  function translateAttributes(element) {
    if (!(element instanceof Element)) return;
    const attrs = ["placeholder", "title", "aria-label"];
    if (!attrOriginal.has(element)) attrOriginal.set(element, {});
    const originals = attrOriginal.get(element);
    attrs.forEach((attr) => {
      if (!element.hasAttribute(attr)) return;
      if (!(attr in originals)) originals[attr] = element.getAttribute(attr);
      const original = originals[attr];
      const clean = String(original ?? "").trim();
      const entry = phraseTranslations[clean];
      element.setAttribute(attr, current === "pt-BR" || !entry ? original : (entry[localeKey()] ?? original));
    });
  }

  function translateTree(root = document.body) {
    if (!root) return;
    applying = true;
    try {
      if (root.nodeType === Node.TEXT_NODE) {
        translateTextNode(root);
        return;
      }
      if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root);
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeType === Node.TEXT_NODE) {
          const parent = node.parentElement;
          if (parent && !["SCRIPT", "STYLE", "CODE"].includes(parent.tagName)) translateTextNode(node);
        } else {
          translateAttributes(node);
        }
      }
    } finally {
      applying = false;
    }
  }

  function setLanguage(lang) {
    current = ["pt-BR", "en", "es"].includes(lang) ? lang : "pt-BR";
    document.documentElement.lang = current;
    try { localStorage.setItem("mc-language", current); } catch {}
    const selector = document.getElementById("language-selector");
    if (selector) selector.value = current;
    translateTree(document.body);
    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { language: current } }));
  }

  function detectLanguage() {
    try {
      const saved = localStorage.getItem("mc-language");
      if (["pt-BR", "en", "es"].includes(saved)) return saved;
    } catch {}
    const nav = (navigator.language || "").toLowerCase();
    if (nav.startsWith("es")) return "es";
    if (nav.startsWith("en")) return "en";
    return "pt-BR";
  }

  function init() {
    const selector = document.getElementById("language-selector");
    if (selector) selector.addEventListener("change", () => setLanguage(selector.value));
    const observer = new MutationObserver((mutations) => {
      if (applying) return;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
          else if (node.nodeType === Node.ELEMENT_NODE) translateTree(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setLanguage(detectLanguage());
  }

  window.I18N = {
    init,
    setLanguage,
    getLanguage: () => current,
    t,
    text,
    translateTree
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();