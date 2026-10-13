import { parsePnlText, runGbmMonteCarlo, runTradeMonteCarlo } from "./core.js";

const $ = (id) => document.getElementById(id);
const currentLocale = () => window.I18N?.getLanguage?.() || "pt-BR";
const tr = (key, vars = {}) => window.I18N?.t?.(key, vars) || key;
const trText = (value) => window.I18N?.text?.(value) || value;
const langPick = (pt, en, es) => currentLocale() === "en" ? en : currentLocale() === "es" ? es : pt;
const money = (value) => new Intl.NumberFormat(currentLocale(), { style: "currency", currency: "BRL", maximumFractionDigits: 2 }).format(value);
const number = (value, digits = 2) => new Intl.NumberFormat(currentLocale(), { maximumFractionDigits: digits }).format(value);
const pct = (value, digits = 1) => `${number(value, digits)}%`;
let lastResult = null;

const DEMO_TRADES = [
  185,-110,240,95,-135,310,-105,160,-125,275,-90,205,-145,120,355,-100,
  -115,225,80,-130,290,-95,140,-155,260,105,-120,195,-85,330,-140,175,
  -100,215,-125,300,90,-150,245,-110,155,-95,280,-135,125,340,-105,190,
  -120,235,-90,145,-160,315,-100,180,-115,265,75,-130,220,-105,295,-145
];

const LESSON_BASE_RULES = {
  targetPct: 0,
  maxLossPct: 0,
  dailyLossPct: 0,
  ruinThresholdPct: 0,
  tradesPerDay: 5,
  trailingMode: "none",
};

const lessonParamConfig = (riskPct, rules = LESSON_BASE_RULES) => ({
  mode: "parameters",
  startingCapital: 10000,
  winRatePct: 45,
  rewardRisk: 1.5,
  riskPct,
  positionSizing: "fixed",
  costPerTrade: 0,
  tradesPerSimulation: 200,
  simulations: 2500,
  seed: 2026,
  rules: { ...rules },
});

const LESSON_STEPS = [
  {
    id: "risk-low",
    tag: "Risco por trade",
    title: "Crie uma referência com risco baixo",
    objective: "Vamos começar com uma estratégia hipotética de expectância positiva e arriscar apenas 0,5% do capital por operação. Este resultado será nossa referência para os próximos experimentos.",
    question: "Se o edge da estratégia é positivo, isso significa que a curva de capital será sempre tranquila?",
    prediction: {
      prompt: "Uma estratégia com expectância positiva terá uma curva de capital sempre suave?",
      choices: [
        { id: "yes", label: "Sim, o edge elimina sequências difíceis" },
        { id: "no", label: "Não, ainda podem existir drawdowns e losing streaks" },
      ],
      correct: "no",
      explanation: "Expectância positiva descreve uma média, não a ordem dos resultados. Mesmo uma estratégia com edge pode atravessar sequências desfavoráveis.",
    },
    controlled: [
      "Taxa de acerto: 45%",
      "Reward:Risk: 1,5 : 1",
      "200 trades por caminho",
      "2.500 simulações com a mesma semente",
      "Sem limites de prop firm neste primeiro experimento",
    ],
    watch: ["P95 do drawdown", "P5 do saldo final", "Sequência de perdas P95"],
    preview: ["Risco: 0,5%", "Win rate: 45%", "R:R: 1,5", "Sizing: fixo", "Regras: desativadas"],
    config: lessonParamConfig(0.5),
    focusId: "risk-pct",
  },
  {
    id: "risk-medium",
    tag: "Risco por trade",
    title: "Dobre o risco sem mudar a estratégia",
    objective: "Agora mudaremos somente o risco por trade de 0,5% para 1%. A taxa de acerto, o payoff, a quantidade de trades e a sequência pseudoaleatória permanecerão iguais.",
    question: "Dobrar o risco deveria melhorar a vantagem estatística da estratégia — ou apenas ampliar seus resultados?",
    prediction: {
      prompt: "Ao passar de 0,5% para 1% de risco, o que você espera para o P95 do drawdown?",
      choices: [
        { id: "down", label: "Deve diminuir" },
        { id: "same", label: "Deve ficar praticamente igual" },
        { id: "up", label: "Deve aumentar" },
      ],
      correct: "up",
      explanation: "O edge não mudou, mas cada perda pesa mais sobre o capital. O esperado é que o drawdown financeiro e percentual aumente.",
    },
    controlled: [
      "Mesmo win rate de 45%",
      "Mesmo Reward:Risk de 1,5 : 1",
      "Mesmos 200 trades e mesma semente",
      "Somente o risco muda: 0,5% → 1%",
    ],
    watch: ["Mudança no P95 do drawdown", "Mudança no P5 do saldo", "Probabilidade de terminar no lucro"],
    preview: ["Risco: 1%", "Edge: inalterado", "Sizing: fixo", "Regras: desativadas"],
    config: lessonParamConfig(1),
    focusId: "risk-pct",
  },
  {
    id: "risk-high",
    tag: "Dimensionamento",
    title: "Veja o que acontece com 2% de risco",
    objective: "O terceiro experimento mantém exatamente a mesma estratégia e eleva o risco para 2% por trade. Este é o teste mais importante da aula sobre position sizing.",
    question: "Uma estratégia pode continuar tendo expectância positiva e, mesmo assim, ficar desconfortável ou impraticável por causa do tamanho da posição?",
    prediction: {
      prompt: "Ao elevar o risco para 2%, o edge matemático da estratégia muda?",
      choices: [
        { id: "higher", label: "Sim, o edge aumenta" },
        { id: "same", label: "Não, o edge permanece o mesmo" },
        { id: "lower", label: "Sim, o edge diminui" },
      ],
      correct: "same",
      explanation: "Position sizing muda a magnitude dos ganhos e perdas, mas não altera a taxa de acerto nem o payoff usados para definir o edge.",
    },
    controlled: [
      "Mesmo edge dos experimentos anteriores",
      "Mesma semente e mesmo número de trades",
      "Risco agora é quatro vezes o da referência inicial",
    ],
    watch: ["P95 do drawdown", "Pior drawdown observado", "Amplitude entre cenários bons e ruins"],
    preview: ["Risco: 2%", "Edge: inalterado", "Sizing: fixo", "Regras: desativadas"],
    config: lessonParamConfig(2),
    focusId: "risk-pct",
  },
  {
    id: "reshuffle",
    tag: "Ordem dos trades",
    title: "Os mesmos trades, em ordens diferentes",
    objective: "Agora abandonamos a hipótese paramétrica e usamos um histórico demonstrativo. O método Reshuffle mantém exatamente os mesmos trades em cada caminho e altera apenas sua ordem.",
    question: "Se todos os caminhos contêm exatamente os mesmos ganhos e perdas, o saldo final muda? E o drawdown?",
    prediction: {
      prompt: "No Reshuffle dos mesmos trades, o que deve variar mais entre as simulações?",
      choices: [
        { id: "final", label: "O saldo final" },
        { id: "path", label: "O drawdown e o caminho da equity" },
        { id: "nothing", label: "Praticamente nada" },
      ],
      correct: "path",
      explanation: "Como os mesmos trades estão presentes em todos os caminhos, o saldo final tende a ser igual; o que muda fortemente é a ordem e, portanto, o drawdown.",
    },
    controlled: [
      "Mesmos 64 trades em todos os caminhos",
      "Nenhum trade é criado ou removido",
      "Somente a ordem é embaralhada",
      "Sem regras de prop firm",
    ],
    watch: ["Dispersão do saldo final", "P50 e P95 do drawdown", "Sequências de perdas"],
    preview: ["Método: Reshuffle", "Trades: 64", "Amostra: fixa", "Ordem: aleatória"],
    config: {
      mode: "historical",
      trades: DEMO_TRADES,
      startingCapital: 10000,
      method: "reshuffle",
      blockSize: 5,
      historicalScale: 1,
      costPerTrade: 0,
      tradesPerSimulation: DEMO_TRADES.length,
      simulations: 2500,
      seed: 2026,
      rules: { ...LESSON_BASE_RULES },
    },
    focusId: "historical-method",
  },
  {
    id: "bootstrap",
    tag: "Incerteza da amostra",
    title: "Agora permita que a composição também mude",
    objective: "No Bootstrap, cada trade é sorteado com reposição. Um resultado histórico pode aparecer várias vezes ou não aparecer. Agora variam tanto a ordem quanto a composição da amostra.",
    question: "Por que a distribuição do saldo final deve ficar mais larga do que no Reshuffle?",
    prediction: {
      prompt: "Comparado ao Reshuffle, o Bootstrap deve produzir uma distribuição de saldo final...",
      choices: [
        { id: "narrower", label: "Mais estreita" },
        { id: "same", label: "Praticamente igual" },
        { id: "wider", label: "Mais ampla" },
      ],
      correct: "wider",
      explanation: "No Bootstrap, além da ordem, a composição da amostra muda porque os trades são sorteados com reposição.",
    },
    controlled: [
      "Mesmo histórico demonstrativo",
      "Mesmo número de trades por caminho",
      "Método muda de Reshuffle para Bootstrap",
    ],
    watch: ["Faixa P5–P95 do saldo", "P95 do drawdown", "Diferença em relação ao Reshuffle"],
    preview: ["Método: Bootstrap", "Trades: 64", "Com reposição", "Composição: variável"],
    config: {
      mode: "historical",
      trades: DEMO_TRADES,
      startingCapital: 10000,
      method: "bootstrap",
      blockSize: 5,
      historicalScale: 1,
      costPerTrade: 0,
      tradesPerSimulation: DEMO_TRADES.length,
      simulations: 2500,
      seed: 2026,
      rules: { ...LESSON_BASE_RULES },
    },
    focusId: "historical-method",
  },
  {
    id: "prop-firm",
    tag: "Sobrevivência",
    title: "Meta versus limites de uma prop firm",
    objective: "No último experimento, aplicamos uma meta de 8%, perda máxima de 10% e perda diária de 4%. A aula compara automaticamente riscos de 0,5%, 1% e 2% com o mesmo edge.",
    question: "Mais risco sempre aumenta a chance de passar uma avaliação — ou pode elevar a chance de violar regras antes de chegar à meta?",
    prediction: {
      prompt: "Com limites de prop firm, aumentar o risco sempre melhora a chance de atingir a meta antes da violação?",
      choices: [
        { id: "yes", label: "Sim, mais risco sempre ajuda" },
        { id: "no", label: "Não, existe um trade-off entre velocidade e sobrevivência" },
      ],
      correct: "no",
      explanation: "Mais risco pode acelerar a meta, mas também aproxima a conta dos limites de perda. A relação não é monotônica nem universal.",
    },
    controlled: [
      "Win rate: 45% e Reward:Risk: 1,5 : 1",
      "Meta: +8%",
      "Perda máxima: 10%",
      "Perda diária: 4%",
      "Mesma semente para os três níveis de risco",
    ],
    watch: ["Meta antes da violação", "Risco de violação", "Trade-off entre velocidade e sobrevivência"],
    preview: ["Comparação: 0,5% × 1% × 2%", "Meta: 8%", "Max loss: 10%", "Daily loss: 4%"],
    type: "prop-comparison",
    focusId: "target-pct",
  },
];

const LESSON_TRANSLATIONS = {
  en: {
    "risk-low": {
      tag: "Risk per trade",
      title: "Create a low-risk baseline",
      objective: "We will start with a hypothetical positive-expectancy strategy and risk only 0.5% of capital per trade. This result will be our baseline for the next experiments.",
      question: "If the strategy has a positive edge, does that mean the equity curve will always be smooth?",
      controlled: ["Win rate: 45%", "Reward:Risk: 1.5 : 1", "200 trades per path", "2,500 simulations with the same seed", "No prop-firm limits in this first experiment"],
      watch: ["P95 drawdown", "P5 final balance", "P95 losing streak"],
      preview: ["Risk: 0.5%", "Win rate: 45%", "R:R: 1.5", "Sizing: fixed", "Rules: disabled"],
      prediction: {
        prompt: "Will a positive-expectancy strategy always have a smooth equity curve?",
        choices: [
          { id: "yes", label: "Yes, the edge eliminates difficult sequences" },
          { id: "no", label: "No, drawdowns and losing streaks can still occur" }
        ],
        explanation: "Positive expectancy describes an average, not the order of results. Even a strategy with an edge can go through unfavorable sequences."
      }
    },
    "risk-medium": {
      tag: "Risk per trade",
      title: "Double risk without changing the strategy",
      objective: "Now we will change only risk per trade from 0.5% to 1%. Win rate, payoff, number of trades and the pseudo-random sequence remain the same.",
      question: "Should doubling risk improve the strategy's statistical edge — or only amplify its results?",
      controlled: ["Same 45% win rate", "Same 1.5 : 1 Reward:Risk", "Same 200 trades and same seed", "Only risk changes: 0.5% → 1%"],
      watch: ["Change in P95 drawdown", "Change in P5 balance", "Probability of finishing profitable"],
      preview: ["Risk: 1%", "Edge: unchanged", "Sizing: fixed", "Rules: disabled"],
      prediction: {
        prompt: "When risk rises from 0.5% to 1%, what do you expect for P95 drawdown?",
        choices: [
          { id: "down", label: "It should decrease" },
          { id: "same", label: "It should remain almost the same" },
          { id: "up", label: "It should increase" }
        ],
        explanation: "The edge did not change, but each loss weighs more on capital. Financial and percentage drawdown should increase."
      }
    },
    "risk-high": {
      tag: "Position sizing",
      title: "See what happens with 2% risk",
      objective: "The third experiment keeps exactly the same strategy and raises risk to 2% per trade. This is the lesson's main position-sizing experiment.",
      question: "Can a strategy remain positive-expectancy and still become uncomfortable or impractical because of position size?",
      controlled: ["Same edge as previous experiments", "Same seed and same number of trades", "Risk is now four times the initial baseline"],
      watch: ["P95 drawdown", "Worst observed drawdown", "Spread between good and bad scenarios"],
      preview: ["Risk: 2%", "Edge: unchanged", "Sizing: fixed", "Rules: disabled"],
      prediction: {
        prompt: "When risk rises to 2%, does the strategy's mathematical edge change?",
        choices: [
          { id: "higher", label: "Yes, the edge increases" },
          { id: "same", label: "No, the edge remains the same" },
          { id: "lower", label: "Yes, the edge decreases" }
        ],
        explanation: "Position sizing changes the magnitude of wins and losses, but it does not change the win rate or payoff that define the edge."
      }
    },
    reshuffle: {
      tag: "Trade order",
      title: "The same trades in different orders",
      objective: "Now we leave the parametric model and use a demonstration trade history. Reshuffle keeps exactly the same trades in every path and changes only their order.",
      question: "If every path contains exactly the same wins and losses, does final balance change? What about drawdown?",
      controlled: ["Same 64 trades in every path", "No trade is created or removed", "Only the order is shuffled", "No prop-firm rules"],
      watch: ["Final-balance dispersion", "P50 and P95 drawdown", "Losing streaks"],
      preview: ["Method: Reshuffle", "Trades: 64", "Sample: fixed", "Order: random"],
      prediction: {
        prompt: "When reshuffling the same trades, what should vary the most across simulations?",
        choices: [
          { id: "final", label: "The final balance" },
          { id: "path", label: "Drawdown and the equity path" },
          { id: "nothing", label: "Almost nothing" }
        ],
        explanation: "Because the same trades are present in every path, final balance tends to be the same; what changes strongly is their order and therefore drawdown."
      }
    },
    bootstrap: {
      tag: "Sample uncertainty",
      title: "Now allow the composition to change too",
      objective: "In Bootstrap, each trade is sampled with replacement. A historical result may appear several times or not at all. Both order and sample composition now vary.",
      question: "Why should the final-balance distribution be wider than under Reshuffle?",
      controlled: ["Same demonstration history", "Same number of trades per path", "Method changes from Reshuffle to Bootstrap"],
      watch: ["P5–P95 balance range", "P95 drawdown", "Difference versus Reshuffle"],
      preview: ["Method: Bootstrap", "Trades: 64", "With replacement", "Composition: variable"],
      prediction: {
        prompt: "Compared with Reshuffle, Bootstrap should produce a final-balance distribution that is...",
        choices: [
          { id: "narrower", label: "Narrower" },
          { id: "same", label: "Almost the same" },
          { id: "wider", label: "Wider" }
        ],
        explanation: "With Bootstrap, sample composition changes in addition to order because trades are drawn with replacement."
      }
    },
    "prop-firm": {
      tag: "Survival",
      title: "Target versus prop-firm limits",
      objective: "In the last experiment we apply an 8% target, 10% maximum loss and 4% daily loss. The lesson automatically compares 0.5%, 1% and 2% risk with the same edge.",
      question: "Does more risk always increase the chance of passing an evaluation — or can it raise the chance of breaching rules before reaching the target?",
      controlled: ["Win rate: 45% and Reward:Risk: 1.5 : 1", "Target: +8%", "Maximum loss: 10%", "Daily loss: 4%", "Same seed for all three risk levels"],
      watch: ["Target before breach", "Breach risk", "Trade-off between speed and survival"],
      preview: ["Comparison: 0.5% × 1% × 2%", "Target: 8%", "Max loss: 10%", "Daily loss: 4%"],
      prediction: {
        prompt: "With prop-firm limits, does increasing risk always improve the chance of reaching the target before a breach?",
        choices: [
          { id: "yes", label: "Yes, more risk always helps" },
          { id: "no", label: "No, there is a trade-off between speed and survival" }
        ],
        explanation: "More risk can accelerate progress toward the target, but it also moves the account closer to loss limits. The relationship is not monotonic or universal."
      }
    }
  },
  es: {
    "risk-low": {
      tag: "Riesgo por trade",
      title: "Crea una referencia con riesgo bajo",
      objective: "Comenzaremos con una estrategia hipotética de expectativa positiva y arriesgaremos solo el 0,5% del capital por operación. Este resultado será nuestra referencia para los siguientes experimentos.",
      question: "Si la estrategia tiene edge positivo, ¿significa que la curva de capital siempre será tranquila?",
      controlled: ["Tasa de acierto: 45%", "Reward:Risk: 1,5 : 1", "200 trades por trayectoria", "2.500 simulaciones con la misma semilla", "Sin límites de prop firm en este primer experimento"],
      watch: ["P95 del drawdown", "P5 del saldo final", "Racha de pérdidas P95"],
      preview: ["Riesgo: 0,5%", "Win rate: 45%", "R:R: 1,5", "Sizing: fijo", "Reglas: desactivadas"],
      prediction: {
        prompt: "¿Una estrategia con expectativa positiva tendrá siempre una curva de capital suave?",
        choices: [
          { id: "yes", label: "Sí, el edge elimina las secuencias difíciles" },
          { id: "no", label: "No, todavía pueden existir drawdowns y rachas de pérdidas" }
        ],
        explanation: "La expectativa positiva describe una media, no el orden de los resultados. Incluso una estrategia con edge puede atravesar secuencias desfavorables."
      }
    },
    "risk-medium": {
      tag: "Riesgo por trade",
      title: "Duplica el riesgo sin cambiar la estrategia",
      objective: "Ahora cambiaremos solo el riesgo por trade del 0,5% al 1%. La tasa de acierto, payoff, cantidad de trades y secuencia pseudoaleatoria permanecerán iguales.",
      question: "¿Duplicar el riesgo debería mejorar la ventaja estadística de la estrategia o solo ampliar sus resultados?",
      controlled: ["Mismo win rate del 45%", "Mismo Reward:Risk de 1,5 : 1", "Mismos 200 trades y misma semilla", "Solo cambia el riesgo: 0,5% → 1%"],
      watch: ["Cambio en P95 del drawdown", "Cambio en P5 del saldo", "Probabilidad de terminar con beneficio"],
      preview: ["Riesgo: 1%", "Edge: sin cambios", "Sizing: fijo", "Reglas: desactivadas"],
      prediction: {
        prompt: "Al pasar del 0,5% al 1% de riesgo, ¿qué esperas para el P95 del drawdown?",
        choices: [
          { id: "down", label: "Debe disminuir" },
          { id: "same", label: "Debe quedar casi igual" },
          { id: "up", label: "Debe aumentar" }
        ],
        explanation: "El edge no cambió, pero cada pérdida pesa más sobre el capital. Se espera que aumente el drawdown financiero y porcentual."
      }
    },
    "risk-high": {
      tag: "Dimensionamiento",
      title: "Observa qué ocurre con 2% de riesgo",
      objective: "El tercer experimento mantiene exactamente la misma estrategia y eleva el riesgo al 2% por trade. Es la prueba principal de position sizing de la clase.",
      question: "¿Puede una estrategia mantener expectativa positiva y aun así volverse incómoda o impracticable por el tamaño de la posición?",
      controlled: ["Mismo edge de los experimentos anteriores", "Misma semilla y mismo número de trades", "El riesgo ahora es cuatro veces la referencia inicial"],
      watch: ["P95 del drawdown", "Peor drawdown observado", "Amplitud entre escenarios buenos y malos"],
      preview: ["Riesgo: 2%", "Edge: sin cambios", "Sizing: fijo", "Reglas: desactivadas"],
      prediction: {
        prompt: "Al elevar el riesgo al 2%, ¿cambia el edge matemático de la estrategia?",
        choices: [
          { id: "higher", label: "Sí, el edge aumenta" },
          { id: "same", label: "No, el edge permanece igual" },
          { id: "lower", label: "Sí, el edge disminuye" }
        ],
        explanation: "El position sizing cambia la magnitud de ganancias y pérdidas, pero no la tasa de acierto ni el payoff que definen el edge."
      }
    },
    reshuffle: {
      tag: "Orden de trades",
      title: "Los mismos trades en órdenes diferentes",
      objective: "Ahora dejamos el modelo paramétrico y usamos un historial demostrativo. Reshuffle mantiene exactamente los mismos trades en cada trayectoria y solo cambia su orden.",
      question: "Si todas las trayectorias contienen exactamente las mismas ganancias y pérdidas, ¿cambia el saldo final? ¿Y el drawdown?",
      controlled: ["Los mismos 64 trades en todas las trayectorias", "No se crea ni elimina ningún trade", "Solo se baraja el orden", "Sin reglas de prop firm"],
      watch: ["Dispersión del saldo final", "P50 y P95 del drawdown", "Rachas de pérdidas"],
      preview: ["Método: Reshuffle", "Trades: 64", "Muestra: fija", "Orden: aleatorio"],
      prediction: {
        prompt: "Al reordenar los mismos trades, ¿qué debería variar más entre simulaciones?",
        choices: [
          { id: "final", label: "El saldo final" },
          { id: "path", label: "El drawdown y la trayectoria de equity" },
          { id: "nothing", label: "Prácticamente nada" }
        ],
        explanation: "Como los mismos trades están presentes en todas las trayectorias, el saldo final tiende a ser igual; lo que cambia fuertemente es el orden y, por tanto, el drawdown."
      }
    },
    bootstrap: {
      tag: "Incertidumbre de muestra",
      title: "Ahora permite que también cambie la composición",
      objective: "En Bootstrap, cada trade se sortea con reposición. Un resultado histórico puede aparecer varias veces o no aparecer. Ahora varían tanto el orden como la composición de la muestra.",
      question: "¿Por qué la distribución del saldo final debería ser más amplia que en Reshuffle?",
      controlled: ["Mismo historial demostrativo", "Mismo número de trades por trayectoria", "El método cambia de Reshuffle a Bootstrap"],
      watch: ["Rango P5–P95 del saldo", "P95 del drawdown", "Diferencia frente a Reshuffle"],
      preview: ["Método: Bootstrap", "Trades: 64", "Con reposición", "Composición: variable"],
      prediction: {
        prompt: "Comparado con Reshuffle, Bootstrap debería producir una distribución de saldo final...",
        choices: [
          { id: "narrower", label: "Más estrecha" },
          { id: "same", label: "Prácticamente igual" },
          { id: "wider", label: "Más amplia" }
        ],
        explanation: "En Bootstrap, además del orden, cambia la composición de la muestra porque los trades se sortean con reposición."
      }
    },
    "prop-firm": {
      tag: "Supervivencia",
      title: "Meta frente a límites de una prop firm",
      objective: "En el último experimento aplicamos una meta del 8%, pérdida máxima del 10% y pérdida diaria del 4%. La clase compara automáticamente riesgos del 0,5%, 1% y 2% con el mismo edge.",
      question: "¿Más riesgo siempre aumenta la probabilidad de aprobar una evaluación o puede elevar la probabilidad de violar reglas antes de llegar a la meta?",
      controlled: ["Win rate: 45% y Reward:Risk: 1,5 : 1", "Meta: +8%", "Pérdida máxima: 10%", "Pérdida diaria: 4%", "Misma semilla para los tres niveles de riesgo"],
      watch: ["Meta antes del incumplimiento", "Riesgo de incumplimiento", "Trade-off entre velocidad y supervivencia"],
      preview: ["Comparación: 0,5% × 1% × 2%", "Meta: 8%", "Max loss: 10%", "Daily loss: 4%"],
      prediction: {
        prompt: "Con límites de prop firm, ¿aumentar el riesgo siempre mejora la probabilidad de alcanzar la meta antes de incumplir?",
        choices: [
          { id: "yes", label: "Sí, más riesgo siempre ayuda" },
          { id: "no", label: "No, existe un trade-off entre velocidad y supervivencia" }
        ],
        explanation: "Más riesgo puede acelerar el avance hacia la meta, pero también acerca la cuenta a los límites de pérdida. La relación no es monótona ni universal."
      }
    }
  }
};

function localizedStep(step) {
  const lang = currentLocale();
  if (lang === "pt-BR") return step;
  const translated = LESSON_TRANSLATIONS[lang]?.[step.id];
  if (!translated) return step;
  return {
    ...step,
    ...translated,
    prediction: {
      ...step.prediction,
      ...translated.prediction,
      choices: translated.prediction?.choices || step.prediction.choices,
    },
  };
}

const lessonState = {
  started: false,
  index: 0,
  results: {},
  predictions: {},
};

document.querySelectorAll(".mode-btn").forEach((button) => {
  button.addEventListener("click", () => activateMode(button.dataset.mode));
});

document.querySelectorAll('input[name="trade-source"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const historical = document.querySelector('input[name="trade-source"]:checked').value === "historical";
    $("parameter-fields").classList.toggle("hidden", historical);
    $("historical-fields").classList.toggle("hidden", !historical);
    updateTradeStatus();
  });
});

$("trade-data").addEventListener("input", updateTradeStatus);
$("historical-method").addEventListener("change", () => {
  $("block-size").disabled = $("historical-method").value !== "block";
});
$("historical-method").dispatchEvent(new Event("change"));

$("load-sample").addEventListener("click", () => {
  const radio = document.querySelector('input[name="trade-source"][value="historical"]');
  radio.checked = true;
  radio.dispatchEvent(new Event("change"));
  $("trade-data").value = "pnl\n" + DEMO_TRADES.join("\n");
  $("trades-count").value = DEMO_TRADES.length;
  updateTradeStatus();
});

$("run-trades").addEventListener("click", () => {
  try {
    setBusy($("run-trades"), true, trText("Simulando..."));
    const mode = document.querySelector('input[name="trade-source"]:checked').value;
    let config;
    if (mode === "historical") {
      const trades = parsePnlText($("trade-data").value);
      if (trades.length < 2) throw new Error(langPick(
        "Cole pelo menos dois resultados de trades válidos.",
        "Paste at least two valid trade results.",
        "Pega al menos dos resultados de trades válidos."
      ));
      config = {
        mode: "historical",
        trades,
        startingCapital: numValue("historical-starting-capital"),
        method: $("historical-method").value,
        blockSize: numValue("block-size"),
        historicalScale: numValue("historical-scale"),
        costPerTrade: numValue("historical-cost"),
        tradesPerSimulation: numValue("trades-count"),
        simulations: numValue("simulations"),
        seed: numValue("seed"),
        rules: getRules(),
      };
    } else {
      config = {
        mode: "parameters",
        startingCapital: numValue("starting-capital"),
        winRatePct: numValue("win-rate"),
        rewardRisk: numValue("reward-risk"),
        riskPct: numValue("risk-pct"),
        positionSizing: $("position-sizing").value,
        costPerTrade: numValue("cost-per-trade"),
        tradesPerSimulation: numValue("trades-count"),
        simulations: numValue("simulations"),
        seed: numValue("seed"),
        rules: getRules(),
      };
    }

    lastResult = runTradeMonteCarlo(config);
    renderTradeResults(lastResult);
    $("export-results").disabled = false;
  } catch (error) {
    alert(error?.message || String(error));
  } finally {
    setBusy($("run-trades"), false, trText("Executar simulação"));
  }
});

$("run-gbm").addEventListener("click", () => {
  try {
    setBusy($("run-gbm"), true, trText("Simulando..."));
    const config = {
      startPrice: numValue("gbm-start"),
      annualReturnPct: numValue("gbm-return"),
      annualVolPct: numValue("gbm-vol"),
      steps: numValue("gbm-steps"),
      stepsPerYear: numValue("gbm-steps-year"),
      simulations: numValue("gbm-simulations"),
      seed: numValue("gbm-seed"),
    };
    lastResult = runGbmMonteCarlo(config);
    renderGbmResults(lastResult);
    $("export-results").disabled = false;
  } catch (error) {
    alert(error?.message || String(error));
  } finally {
    setBusy($("run-gbm"), false, trText("Executar GBM"));
  }
});

$("export-results").addEventListener("click", () => {
  if (!lastResult) return;
  const payload = {
    exportedAt: new Date().toISOString(),
    type: lastResult.type,
    config: lastResult.config,
    summary: lastResult.summary,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `monte-carlo-${lastResult.type}-${Date.now()}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
});


$("lesson-start").addEventListener("click", startLesson);
$("lesson-run").addEventListener("click", runLessonExperiment);
$("lesson-prev").addEventListener("click", () => moveLesson(-1));
$("lesson-next").addEventListener("click", () => moveLesson(1));
$("lesson-exit").addEventListener("click", resetLesson);
$("lesson-restart").addEventListener("click", startLesson);

document.addEventListener("i18n:change", () => {
  updateTradeStatus();
  if (lessonState.started && !$("lesson-workspace").classList.contains("hidden")) {
    renderLessonStep();
  } else if (lessonState.started && !$("lesson-finish").classList.contains("hidden")) {
    finishLesson();
  }
  if (lastResult) {
    if (lastResult.type === "gbm") renderGbmResults(lastResult, { scroll: false });
    else renderTradeResults(lastResult, { scroll: false });
  }
});

function activateMode(mode, hideResults = true) {
  document.querySelectorAll(".mode-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  $("trades-panel").classList.toggle("hidden", mode !== "trades");
  $("gbm-panel").classList.toggle("hidden", mode !== "gbm");
  if (hideResults) $("results").classList.add("hidden");
}

function startLesson() {
  lessonState.started = true;
  lessonState.index = 0;
  lessonState.results = {};
  lessonState.predictions = {};
  $("lesson-intro").classList.add("hidden");
  $("lesson-start-wrap").classList.add("hidden");
  $("lesson-finish").classList.add("hidden");
  $("lesson-workspace").classList.remove("hidden");
  $("lesson-status").className = "lesson-status active";
  renderLessonStep();
  updateLessonProgress();
  $("aula-guiada").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetLesson() {
  lessonState.started = false;
  lessonState.index = 0;
  lessonState.results = {};
  lessonState.predictions = {};
  $("lesson-workspace").classList.add("hidden");
  $("lesson-finish").classList.add("hidden");
  $("lesson-intro").classList.remove("hidden");
  $("lesson-start-wrap").classList.remove("hidden");
  $("lesson-status").className = "lesson-status";
  $("lesson-status").textContent = trText("Não iniciada");
  clearLessonHighlights();
  updateLessonProgress();
}

function moveLesson(delta) {
  const next = lessonState.index + delta;
  if (next < 0) return;
  if (next >= LESSON_STEPS.length) {
    finishLesson();
    return;
  }
  lessonState.index = next;
  renderLessonStep();
  $("aula-guiada").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderLessonStep() {
  const baseStep = LESSON_STEPS[lessonState.index];
  const step = localizedStep(baseStep);
  const existing = lessonState.results[baseStep.id];
  const prediction = lessonState.predictions[baseStep.id];

  $("lesson-status").textContent = tr("lesson.experiment", { current: lessonState.index + 1, total: LESSON_STEPS.length });
  $("lesson-step-kicker").textContent = tr("lesson.kicker", { n: lessonState.index + 1 });
  $("lesson-step-title").textContent = step.title;
  $("lesson-step-tag").textContent = step.tag;
  $("lesson-step-objective").textContent = step.objective;
  $("lesson-question").textContent = step.question;
  $("lesson-controlled").innerHTML = lessonList(step.controlled);
  $("lesson-watch").innerHTML = lessonList(step.watch);
  $("lesson-config-preview").innerHTML = step.preview
    .map((item) => `<span class="lesson-chip">${escapeHtml(item)}</span>`)
    .join("");

  renderPrediction(baseStep, step, Boolean(existing));

  $("lesson-prev").disabled = lessonState.index === 0;
  $("lesson-next").disabled = !existing;
  $("lesson-next").textContent = lessonState.index === LESSON_STEPS.length - 1
    ? tr("lesson.finish")
    : trText("Próximo experimento →");
  $("lesson-run").textContent = existing
    ? (baseStep.type === "prop-comparison" ? tr("lesson.compareAgain") : tr("lesson.rerun"))
    : baseStep.type === "prop-comparison"
      ? tr("lesson.runComparison")
      : trText("Aplicar configuração e simular");
  $("lesson-run").disabled = !prediction;

  if (existing) {
    renderLessonAnalysis(baseStep, existing, false);
  } else {
    $("lesson-analysis").classList.add("hidden");
  }

  applyLessonConfig(baseStep, false);
  updateLessonProgress();
}

function lessonList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderPrediction(baseStep, step, hasResult) {
  const selected = lessonState.predictions[baseStep.id];
  $("lesson-prediction-question").textContent = step.prediction.prompt;
  $("lesson-prediction-options").innerHTML = step.prediction.choices.map((choice) =>
    `<button type="button" class="prediction-option ${selected?.choice === choice.id ? "selected" : ""}" data-prediction="${escapeHtml(choice.id)}" ${hasResult ? "disabled" : ""}>${escapeHtml(choice.label)}</button>`
  ).join("");

  $("lesson-prediction-options").querySelectorAll(".prediction-option").forEach((button) => {
    button.addEventListener("click", () => choosePrediction(baseStep, button.dataset.prediction));
  });

  if (hasResult && selected) {
    renderPredictionFeedback(baseStep, step);
  } else {
    $("lesson-prediction-feedback").className = "lesson-prediction-feedback hidden";
    $("lesson-prediction-feedback").innerHTML = selected
      ? `<strong>${escapeHtml(trText("Previsão registrada. Agora execute a simulação."))}</strong>`
      : "";
  }
}

function choosePrediction(baseStep, choice) {
  if (lessonState.results[baseStep.id]) return;
  lessonState.predictions[baseStep.id] = {
    choice,
    correct: choice === baseStep.prediction.correct,
  };
  const step = localizedStep(baseStep);
  renderPrediction(baseStep, step, false);
  $("lesson-run").disabled = false;
  $("lesson-prediction-feedback").className = "lesson-prediction-feedback";
  $("lesson-prediction-feedback").innerHTML = `<strong>${escapeHtml(trText("Previsão registrada. Agora execute a simulação."))}</strong>`;
}

function renderPredictionFeedback(baseStep, step) {
  const prediction = lessonState.predictions[baseStep.id];
  if (!prediction) return;
  const correct = prediction.correct;
  $("lesson-prediction-feedback").className = `lesson-prediction-feedback ${correct ? "correct" : "incorrect"}`;
  $("lesson-prediction-feedback").innerHTML =
    `<strong>${escapeHtml(trText(correct ? "Acertou a previsão." : "Sua previsão não se confirmou."))}</strong><span>${escapeHtml(step.prediction.explanation)}</span>`;
}

function applyLessonConfig(step, highlight = true) {
  activateMode("trades", false);
  const config = step.type === "prop-comparison"
    ? lessonParamConfig(1, {
        targetPct: 8,
        maxLossPct: 10,
        dailyLossPct: 4,
        ruinThresholdPct: 0,
        tradesPerDay: 5,
        trailingMode: "static",
      })
    : step.config;

  if (config.mode === "historical") {
    const radio = document.querySelector('input[name="trade-source"][value="historical"]');
    radio.checked = true;
    radio.dispatchEvent(new Event("change"));
    $("historical-starting-capital").value = config.startingCapital;
    $("historical-method").value = config.method;
    $("historical-method").dispatchEvent(new Event("change"));
    $("block-size").value = config.blockSize;
    $("historical-scale").value = config.historicalScale;
    $("historical-cost").value = config.costPerTrade;
    $("trade-data").value = "pnl\n" + config.trades.join("\n");
    updateTradeStatus();
  } else {
    const radio = document.querySelector('input[name="trade-source"][value="parameters"]');
    radio.checked = true;
    radio.dispatchEvent(new Event("change"));
    $("starting-capital").value = config.startingCapital;
    $("win-rate").value = config.winRatePct;
    $("reward-risk").value = config.rewardRisk;
    $("risk-pct").value = config.riskPct;
    $("position-sizing").value = config.positionSizing;
    $("cost-per-trade").value = config.costPerTrade;
  }

  $("trades-count").value = config.tradesPerSimulation;
  $("simulations").value = config.simulations;
  $("seed").value = config.seed;
  $("target-pct").value = config.rules.targetPct;
  $("max-loss-pct").value = config.rules.maxLossPct;
  $("daily-loss-pct").value = config.rules.dailyLossPct;
  $("ruin-threshold-pct").value = config.rules.ruinThresholdPct;
  $("trades-per-day").value = config.rules.tradesPerDay;
  $("trailing-mode").value = config.rules.trailingMode;
  document.querySelector(".rules").open = config.rules.targetPct > 0 || config.rules.maxLossPct > 0 || config.rules.dailyLossPct > 0;

  clearLessonHighlights();
  if (highlight && step.focusId) {
    const target = $(step.focusId);
    const box = target?.closest("label") || target;
    box?.classList.add("lesson-highlight");
    window.setTimeout(() => box?.classList.remove("lesson-highlight"), 2200);
  }
}

function clearLessonHighlights() {
  document.querySelectorAll(".lesson-highlight").forEach((element) => element.classList.remove("lesson-highlight"));
}

function runLessonExperiment() {
  const step = LESSON_STEPS[lessonState.index];
  if (!lessonState.predictions[step.id]) {
    alert(langPick(
      "Escolha sua previsão antes de executar a simulação.",
      "Choose your prediction before running the simulation.",
      "Elige tu predicción antes de ejecutar la simulación."
    ));
    return;
  }
  try {
    setBusy($("lesson-run"), true, langPick("Simulando...", "Simulating...", "Simulando..."));
    applyLessonConfig(step, true);

    let payload;
    if (step.type === "prop-comparison") {
      const propRules = {
        targetPct: 8,
        maxLossPct: 10,
        dailyLossPct: 4,
        ruinThresholdPct: 0,
        tradesPerDay: 5,
        trailingMode: "static",
      };
      const comparisons = [0.5, 1, 2].map((risk) => ({
        risk,
        result: runTradeMonteCarlo(lessonParamConfig(risk, propRules)),
      }));
      const main = comparisons.find((item) => item.risk === 1).result;
      payload = { main, comparisons };
      lastResult = main;
      renderTradeResults(main, { scroll: false });
    } else {
      const result = runTradeMonteCarlo(step.config);
      payload = result;
      lastResult = result;
      renderTradeResults(result, { scroll: false });
    }

    lessonState.results[step.id] = payload;
    $("export-results").disabled = false;
    renderLessonAnalysis(step, payload, true);
    renderPredictionFeedback(step, localizedStep(step));
    $("lesson-next").disabled = false;
    $("lesson-run").textContent = step.type === "prop-comparison"
      ? tr("lesson.compareAgain")
      : tr("lesson.rerun");
    updateLessonProgress();
  } catch (error) {
    alert(error?.message || String(error));
  } finally {
    setBusy($("lesson-run"), false, lessonState.results[step.id]
      ? (step.type === "prop-comparison" ? tr("lesson.compareAgain") : tr("lesson.rerun"))
      : trText("Aplicar configuração e simular"));
  }
}

function renderLessonAnalysis(step, payload, shouldScroll = true) {
  const analysis = lessonAnalysisFor(step, payload);
  $("lesson-analysis-title").textContent = analysis.title;
  $("lesson-analysis-metrics").innerHTML = analysis.metrics
    .map((item) => `<div class="lesson-analysis-metric"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`)
    .join("");
  $("lesson-analysis-text").innerHTML = analysis.html + `<p><a href="#results">${escapeHtml(trText("Ver gráficos e distribuição completos ↓"))}</a></p>`;
  $("lesson-analysis").classList.remove("hidden");
  if (shouldScroll) $("lesson-analysis").scrollIntoView({ behavior: "smooth", block: "center" });
}

function lessonAnalysisFor(step, payload) {
  if (step.id === "risk-low") {
    const s = payload.summary;
    return {
      title: langPick(
        "A referência já mostra que edge positivo não elimina períodos difíceis",
        "The baseline already shows that positive edge does not eliminate difficult periods",
        "La referencia ya muestra que un edge positivo no elimina períodos difíciles"
      ),
      metrics: [
        { label: "Drawdown P95", value: pct(s.maxDrawdownPct.p95) },
        { label: langPick("Saldo P5", "P5 balance", "Saldo P5"), value: money(s.finalBalance.p05) },
        { label: langPick("Seq. perdas P95", "P95 losing streak", "Racha de pérdidas P95"), value: number(s.losingStreak.p95, 0) },
        { label: langPick("Prob. lucro", "Profit probability", "Prob. beneficio"), value: pct(s.probabilityProfitPct) },
      ],
      html: langPick(
        `<p>Com apenas <strong>0,5% de risco por trade</strong>, já existe uma distribuição de drawdowns e sequências de perdas. Expectância positiva descreve uma média de longo prazo, não uma trajetória lisa.</p><p>Guarde o <strong>P95 de drawdown de ${pct(s.maxDrawdownPct.p95)}</strong>. Ele será nossa referência quando aumentarmos o tamanho da posição.</p>`,
        `<p>Even with only <strong>0.5% risk per trade</strong>, there is already a distribution of drawdowns and losing streaks. Positive expectancy describes a long-run average, not a smooth path.</p><p>Remember the <strong>P95 drawdown of ${pct(s.maxDrawdownPct.p95)}</strong>. It will be our baseline when position size increases.</p>`,
        `<p>Incluso con solo <strong>0,5% de riesgo por trade</strong>, ya existe una distribución de drawdowns y rachas de pérdidas. La expectativa positiva describe una media de largo plazo, no una trayectoria suave.</p><p>Guarda el <strong>P95 de drawdown de ${pct(s.maxDrawdownPct.p95)}</strong>. Será nuestra referencia al aumentar el tamaño de la posición.</p>`
      ),
    };
  }

  if (step.id === "risk-medium" || step.id === "risk-high") {
    const s = payload.summary;
    const baseline = lessonState.results["risk-low"]?.summary;
    const prior = step.id === "risk-high" ? lessonState.results["risk-medium"]?.summary : baseline;
    const risk = step.config.riskPct;
    const baselineRatio = baseline ? s.maxDrawdownPct.p95 / Math.max(0.0001, baseline.maxDrawdownPct.p95) : NaN;
    const priorDelta = prior ? s.maxDrawdownPct.p95 - prior.maxDrawdownPct.p95 : NaN;
    const ratioText = Number.isFinite(baselineRatio)
      ? langPick(
          `, cerca de ${number(baselineRatio, 2)}× o valor da referência de 0,5%`,
          `, about ${number(baselineRatio, 2)}× the 0.5% baseline`,
          `, cerca de ${number(baselineRatio, 2)}× el valor de la referencia de 0,5%`
        )
      : "";
    return {
      title: step.id === "risk-medium"
        ? langPick("O edge ficou igual; o caminho ficou mais agressivo", "The edge stayed the same; the path became more aggressive", "El edge quedó igual; la trayectoria se volvió más agresiva")
        : langPick("Position sizing pode transformar a experiência sem alterar a estratégia", "Position sizing can transform the experience without changing the strategy", "El position sizing puede transformar la experiencia sin cambiar la estrategia"),
      metrics: [
        { label: langPick("Risco por trade", "Risk per trade", "Riesgo por trade"), value: pct(risk) },
        { label: "Drawdown P95", value: pct(s.maxDrawdownPct.p95) },
        { label: langPick("Aumento vs. etapa anterior", "Increase vs. previous step", "Aumento vs. etapa anterior"), value: Number.isFinite(priorDelta) ? `+${pct(priorDelta)}` : "—" },
        { label: langPick("Saldo P5", "P5 balance", "Saldo P5"), value: money(s.finalBalance.p05) },
      ],
      html: langPick(
        `<p>A taxa de acerto e o Reward:Risk não mudaram. Portanto, <strong>a vantagem estatística teórica é a mesma</strong>. O que mudou foi o tamanho financeiro de cada acerto e de cada erro.</p><p>O P95 de drawdown agora é <strong>${pct(s.maxDrawdownPct.p95)}</strong>${ratioText}. A probabilidade de lucro pode permanecer semelhante enquanto a experiência de risco se torna muito mais severa.</p>`,
        `<p>Win rate and Reward:Risk did not change. Therefore, <strong>the theoretical statistical edge is the same</strong>. What changed is the financial size of each win and loss.</p><p>P95 drawdown is now <strong>${pct(s.maxDrawdownPct.p95)}</strong>${ratioText}. Profit probability may remain similar while the risk experience becomes much more severe.</p>`,
        `<p>La tasa de acierto y el Reward:Risk no cambiaron. Por tanto, <strong>la ventaja estadística teórica es la misma</strong>. Lo que cambió fue el tamaño financiero de cada acierto y error.</p><p>El P95 del drawdown ahora es <strong>${pct(s.maxDrawdownPct.p95)}</strong>${ratioText}. La probabilidad de beneficio puede seguir siendo similar mientras la experiencia de riesgo se vuelve mucho más severa.</p>`
      ),
    };
  }

  if (step.id === "reshuffle") {
    const s = payload.summary;
    const spread = s.finalBalance.p95 - s.finalBalance.p05;
    return {
      title: langPick(
        "O saldo final quase não muda, mas o caminho até ele muda muito",
        "Final balance barely changes, but the path to it changes a lot",
        "El saldo final casi no cambia, pero la trayectoria cambia mucho"
      ),
      metrics: [
        { label: langPick("Faixa P5–P95 saldo", "P5–P95 balance range", "Rango P5–P95 saldo"), value: money(spread) },
        { label: "Drawdown P50", value: pct(s.maxDrawdownPct.p50) },
        { label: "Drawdown P95", value: pct(s.maxDrawdownPct.p95) },
        { label: langPick("Seq. perdas P95", "P95 losing streak", "Racha pérdidas P95"), value: number(s.losingStreak.p95, 0) },
      ],
      html: langPick(
        `<p>No Reshuffle, cada caminho contém <strong>os mesmos trades</strong>. Por isso o saldo final é praticamente o mesmo em todas as simulações — a faixa P5–P95 ficou em ${money(spread)}.</p><p>Mas os drawdowns não são iguais. Esta é a demonstração de <strong>sequence risk</strong>: a ordem dos mesmos resultados altera a pressão sobre a conta e sobre o trader.</p>`,
        `<p>Under Reshuffle, every path contains <strong>the same trades</strong>. Final balance is therefore virtually the same across simulations — the P5–P95 range was ${money(spread)}.</p><p>But drawdowns are not the same. This demonstrates <strong>sequence risk</strong>: the order of identical outcomes changes the pressure on the account and the trader.</p>`,
        `<p>En Reshuffle, cada trayectoria contiene <strong>los mismos trades</strong>. Por eso el saldo final es prácticamente igual en todas las simulaciones — el rango P5–P95 fue de ${money(spread)}.</p><p>Pero los drawdowns no son iguales. Esta es una demostración de <strong>sequence risk</strong>: el orden de los mismos resultados cambia la presión sobre la cuenta y sobre el trader.</p>`
      ),
    };
  }

  if (step.id === "bootstrap") {
    const s = payload.summary;
    const reshuffle = lessonState.results["reshuffle"]?.summary;
    const spread = s.finalBalance.p95 - s.finalBalance.p05;
    const reshuffleSpread = reshuffle ? reshuffle.finalBalance.p95 - reshuffle.finalBalance.p05 : 0;
    return {
      title: langPick(
        "Bootstrap adiciona incerteza sobre quais resultados voltarão a aparecer",
        "Bootstrap adds uncertainty about which outcomes will appear again",
        "Bootstrap añade incertidumbre sobre qué resultados volverán a aparecer"
      ),
      metrics: [
        { label: langPick("Faixa P5–P95 saldo", "P5–P95 balance range", "Rango P5–P95 saldo"), value: money(spread) },
        { label: langPick("Faixa no Reshuffle", "Reshuffle range", "Rango en Reshuffle"), value: money(reshuffleSpread) },
        { label: "Drawdown P95", value: pct(s.maxDrawdownPct.p95) },
        { label: langPick("Saldo P5", "P5 balance", "Saldo P5"), value: money(s.finalBalance.p05) },
      ],
      html: langPick(
        "<p>Agora não mudamos apenas a ordem. Como o sorteio é com reposição, alguns trades aparecem várias vezes e outros desaparecem. Por isso o saldo final passa a formar uma distribuição muito mais ampla.</p><p>Reshuffle estuda principalmente <strong>risco de sequência</strong>; Bootstrap adiciona <strong>incerteza de amostragem</strong>. Eles respondem perguntas diferentes.</p>",
        "<p>Now we are changing more than order. Because sampling is with replacement, some trades appear several times and others disappear. Final balance therefore forms a much wider distribution.</p><p>Reshuffle mainly studies <strong>sequence risk</strong>; Bootstrap adds <strong>sampling uncertainty</strong>. They answer different questions.</p>",
        "<p>Ahora no cambiamos solo el orden. Como el muestreo es con reposición, algunos trades aparecen varias veces y otros desaparecen. Por eso el saldo final forma una distribución mucho más amplia.</p><p>Reshuffle estudia principalmente <strong>riesgo de secuencia</strong>; Bootstrap añade <strong>incertidumbre de muestreo</strong>. Responden preguntas diferentes.</p>"
      ),
    };
  }

  if (step.id === "prop-firm") {
    const rows = payload.comparisons.map(({ risk, result }) => ({
      risk,
      success: result.summary.probabilityTargetBeforeBreachPct,
      breach: result.summary.probabilityBreachPct,
      dd: result.summary.maxDrawdownPct.p95,
    }));
    const bestSuccess = Math.max(...rows.map((row) => row.success));
    const table = `<table class="lesson-comparison"><thead><tr><th>${escapeHtml(langPick("Risco", "Risk", "Riesgo"))}</th><th>${escapeHtml(langPick("Meta antes da violação", "Target before breach", "Meta antes del incumplimiento"))}</th><th>${escapeHtml(langPick("Violação", "Breach", "Incumplimiento"))}</th><th>DD P95</th></tr></thead><tbody>${rows.map((row) =>
      `<tr><td>${pct(row.risk)}</td><td class="${row.success === bestSuccess ? "best" : ""}">${pct(row.success)}</td><td>${pct(row.breach)}</td><td>${pct(row.dd)}</td></tr>`
    ).join("")}</tbody></table>`;
    const low = rows[0];
    const high = rows[rows.length - 1];
    return {
      title: langPick(
        "Em contas com regras, retorno e sobrevivência precisam ser analisados juntos",
        "With account rules, return and survival must be analyzed together",
        "Con reglas de cuenta, retorno y supervivencia deben analizarse juntos"
      ),
      metrics: [
        { label: langPick("Sucesso 0,5%", "Success 0.5%", "Éxito 0,5%"), value: pct(low.success) },
        { label: langPick("Sucesso 2%", "Success 2%", "Éxito 2%"), value: pct(high.success) },
        { label: langPick("Violação 0,5%", "Breach 0.5%", "Incumplimiento 0,5%"), value: pct(low.breach) },
        { label: langPick("Violação 2%", "Breach 2%", "Incumplimiento 2%"), value: pct(high.breach) },
      ],
      html: langPick(
        `<p>Quando há meta e limites, a pergunta profissional muda: precisamos saber se a estratégia consegue <strong>chegar à meta antes de quebrar uma regra</strong>.</p>${table}<p>Não trate o maior percentual como uma recomendação automática. O objetivo é enxergar o trade-off entre velocidade e sobrevivência.</p>`,
        `<p>When targets and limits exist, the professional question changes: we need to know whether the strategy can <strong>reach the target before breaking a rule</strong>.</p>${table}<p>Do not treat the highest percentage as an automatic recommendation. The goal is to see the trade-off between speed and survival.</p>`,
        `<p>Cuando existen metas y límites, la pregunta profesional cambia: necesitamos saber si la estrategia puede <strong>alcanzar la meta antes de romper una regla</strong>.</p>${table}<p>No trates el porcentaje más alto como una recomendación automática. El objetivo es ver el trade-off entre velocidad y supervivencia.</p>`
      ),
    };
  }

  return { title: langPick("Experimento concluído", "Experiment completed", "Experimento completado"), metrics: [], html: "" };
}

function updateLessonProgress() {
  const completed = Object.keys(lessonState.results).length;
  const pctDone = Math.round(completed / LESSON_STEPS.length * 100);
  $("lesson-progress-label").textContent = tr("lesson.progress", { completed, total: LESSON_STEPS.length });
  $("lesson-progress-percent").textContent = `${pctDone}%`;
  $("lesson-progress-bar").style.width = `${pctDone}%`;
}

function finishLesson() {
  const baseline = lessonState.results["risk-low"]?.summary;
  const high = lessonState.results["risk-high"]?.summary;
  const prop = lessonState.results["prop-firm"];
  const score = Object.values(lessonState.predictions).filter((item) => item.correct).length;
  let summary = `<p><span class="lesson-prediction-score">${escapeHtml(tr("lesson.predictionScore", { score, total: LESSON_STEPS.length }))}</span></p>`;

  summary += langPick(
    "<p>Você concluiu todos os experimentos.</p>",
    "<p>You completed all experiments.</p>",
    "<p>Completaste todos los experimentos.</p>"
  );

  if (baseline && high) {
    summary += langPick(
      `<p>Na sua execução, elevar o risco de <strong>0,5% para 2%</strong> levou o P95 do drawdown de <strong>${pct(baseline.maxDrawdownPct.p95)}</strong> para <strong>${pct(high.maxDrawdownPct.p95)}</strong>, sem alterar o edge da estratégia.</p>`,
      `<p>In your run, increasing risk from <strong>0.5% to 2%</strong> moved P95 drawdown from <strong>${pct(baseline.maxDrawdownPct.p95)}</strong> to <strong>${pct(high.maxDrawdownPct.p95)}</strong>, without changing the strategy's edge.</p>`,
      `<p>En tu ejecución, aumentar el riesgo de <strong>0,5% a 2%</strong> llevó el P95 del drawdown de <strong>${pct(baseline.maxDrawdownPct.p95)}</strong> a <strong>${pct(high.maxDrawdownPct.p95)}</strong>, sin cambiar el edge de la estrategia.</p>`
    );
  }
  if (prop?.comparisons) {
    const rows = prop.comparisons.map(({ risk, result }) => ({
      risk,
      success: result.summary.probabilityTargetBeforeBreachPct,
    }));
    const top = [...rows].sort((a, b) => b.success - a.success)[0];
    summary += langPick(
      `<p>No experimento de prop firm, o maior percentual de meta antes da violação nesta simulação apareceu com <strong>${pct(top.risk)} de risco</strong> (${pct(top.success)}). Isso é um resultado deste conjunto de hipóteses, não uma recomendação universal.</p>`,
      `<p>In the prop-firm experiment, the highest target-before-breach percentage in this simulation appeared at <strong>${pct(top.risk)} risk</strong> (${pct(top.success)}). This is a result of these assumptions, not a universal recommendation.</p>`,
      `<p>En el experimento de prop firm, el mayor porcentaje de meta antes del incumplimiento apareció con <strong>${pct(top.risk)} de riesgo</strong> (${pct(top.success)}). Es un resultado de estas hipótesis, no una recomendación universal.</p>`
    );
  }

  $("lesson-final-summary").innerHTML = summary;
  $("lesson-workspace").classList.add("hidden");
  $("lesson-finish").classList.remove("hidden");
  $("lesson-status").className = "lesson-status done";
  $("lesson-status").textContent = tr("lesson.completed");
  updateLessonProgress();
  $("aula-guiada").scrollIntoView({ behavior: "smooth", block: "start" });
}

function numValue(id) {
  const value = Number($(id).value);
  if (!Number.isFinite(value)) throw new Error(langPick(
    `Valor inválido em ${id}.`,
    `Invalid value in ${id}.`,
    `Valor inválido en ${id}.`
  ));
  return value;
}

function getRules() {
  return {
    targetPct: numValue("target-pct"),
    maxLossPct: numValue("max-loss-pct"),
    dailyLossPct: numValue("daily-loss-pct"),
    ruinThresholdPct: numValue("ruin-threshold-pct"),
    tradesPerDay: numValue("trades-per-day"),
    trailingMode: $("trailing-mode").value,
  };
}

function setBusy(button, busy, text) {
  button.disabled = busy;
  button.textContent = text;
}

function updateTradeStatus() {
  const trades = parsePnlText($("trade-data").value);
  if (!trades.length) {
    $("trade-data-status").textContent = tr("trade.empty");
    return;
  }
  const wins = trades.filter((x) => x > 0).length;
  const losses = trades.filter((x) => x < 0).length;
  $("trade-data-status").textContent = tr("trade.detected", {
    count: trades.length,
    wins,
    losses,
    avg: money(trades.reduce((a,b) => a+b,0)/trades.length),
  });
}

function renderTradeResults(result, options = {}) {
  const s = result.summary;
  $("results-title").textContent = tr("results.strategy");
  $("run-meta").textContent = tr("results.meta", { sims: number(s.simulations, 0), seed: result.config.seed });
  $("metric-cards").innerHTML = [
    card(tr("results.profitProb"), pct(s.probabilityProfitPct), tr("results.profitProbSub")),
    card(tr("results.breach"), pct(s.probabilityBreachPct), tr("results.breachSub")),
    card(tr("results.targetBefore"), pct(s.probabilityTargetBeforeBreachPct), tr("results.targetBeforeSub")),
    card(tr("results.medianBalance"), money(s.finalBalance.p50), `P5 ${money(s.finalBalance.p05)} · P95 ${money(s.finalBalance.p95)}`),
    card(tr("results.medianDd"), pct(s.maxDrawdownPct.p50), `P95 ${pct(s.maxDrawdownPct.p95)}`),
    card(tr("results.worstDd"), pct(s.maxDrawdownPct.max), tr("results.maxAmong")),
    card(tr("results.lossStreak"), number(s.losingStreak.p95, 0), `${langPick("máximo", "maximum", "máximo")} ${number(s.losingStreak.max, 0)}`),
    result.config.mode === "historical"
      ? card(tr("results.winRateSample"), pct(s.inputWinRatePct), `PF ${Number.isFinite(s.inputProfitFactor) ? number(s.inputProfitFactor) : "∞"}`)
      : card(tr("results.expectancy"), `${number(s.expectedRPerTrade, 3)}R`, `Kelly ${pct(s.kellyFraction * 100)}`),
  ].join("");

  drawPaths($("paths-chart"), result.samplePaths.map((p) => p.equity), { baseline: result.config.startingCapital, yFormatter: compactCurrency });
  $("hist-title").textContent = tr("results.finalBalanceDistribution");
  drawHistogram($("hist-chart"), result.distributions.finalBalances, compactCurrency);

  $("percentile-table-wrap").innerHTML = percentileTable(
    tr("results.finalBalance"),
    ["P5", "P25", "P50", "P75", "P95"],
    [s.finalBalance.p05, s.finalBalance.p25, s.finalBalance.p50, s.finalBalance.p75, s.finalBalance.p95].map(money)
  );

  const ddMessage = s.maxDrawdownPct.p95 > 30 ? tr("results.ddHigh") : tr("results.ddLow");
  $("interpretation-text").textContent = tr("results.interpretTrade", {
    dd: pct(s.maxDrawdownPct.p95),
    p5: money(s.finalBalance.p05),
    p95: money(s.finalBalance.p95),
    ddMessage,
  });

  revealResults(options.scroll !== false);
}

function renderGbmResults(result, options = {}) {
  const s = result.summary;
  $("results-title").textContent = tr("results.gbm");
  $("run-meta").textContent = tr("results.meta", { sims: number(s.simulations, 0), seed: result.config.seed });
  $("metric-cards").innerHTML = [
    card(tr("results.priceMedian"), number(s.finalPrice.p50), `${langPick("retorno", "return", "retorno")} ${pct(s.medianReturnPct)}`),
    card(tr("results.priceP5"), number(s.finalPrice.p05), `${langPick("retorno", "return", "retorno")} ${pct(s.p05ReturnPct)}`),
    card(tr("results.priceP95"), number(s.finalPrice.p95), `${langPick("retorno", "return", "retorno")} ${pct(s.p95ReturnPct)}`),
    card(tr("results.aboveStart"), pct(s.probabilityAboveStartPct), tr("results.aboveStartSub")),
    card(tr("results.var"), number(s.empiricalVaR95Amount), pct(s.empiricalVaR95Pct)),
  ].join("");

  drawPaths($("paths-chart"), result.samplePaths, { baseline: result.config.startPrice, yFormatter: compactNumber });
  $("hist-title").textContent = tr("results.finalPriceDistribution");
  drawHistogram($("hist-chart"), result.distributions.finalPrices, compactNumber);
  $("percentile-table-wrap").innerHTML = percentileTable(
    tr("results.finalPrice"),
    ["P5", "P25", "P50", "P75", "P95"],
    [s.finalPrice.p05, s.finalPrice.p25, s.finalPrice.p50, s.finalPrice.p75, s.finalPrice.p95].map((x) => number(x))
  );
  $("interpretation-text").textContent = tr("results.gbmInterpret", {
    median: number(s.finalPrice.p50),
    p5: number(s.finalPrice.p05),
    p95: number(s.finalPrice.p95),
  });
  revealResults(options.scroll !== false);
}

function revealResults(shouldScroll = true) {
  $("results").classList.remove("hidden");
  if (shouldScroll) $("results").scrollIntoView({ behavior: "smooth", block: "start" });
}

function card(label, value, sub = "") {
  return `<article class="metric"><div class="metric__label">${escapeHtml(label)}</div><div class="metric__value">${escapeHtml(value)}</div><div class="metric__sub">${escapeHtml(sub)}</div></article>`;
}

function percentileTable(label, headers, values) {
  return `<table><thead><tr><th>${escapeHtml(label)}</th>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody><tr><td>${escapeHtml(tr("results.distribution"))}</td>${values.map((v) => `<td>${escapeHtml(v)}</td>`).join("")}</tr></tbody></table>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[char]));
}

function compactCurrency(value) {
  return new Intl.NumberFormat(currentLocale(), { notation: "compact", style: "currency", currency: "BRL", maximumFractionDigits: 1 }).format(value);
}

function compactNumber(value) {
  return new Intl.NumberFormat(currentLocale(), { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function prepCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const cssWidth = Math.max(300, canvas.clientWidth || 900);
  const cssHeight = Math.max(240, Number(canvas.getAttribute("height")) || 340);
  canvas.width = Math.floor(cssWidth * ratio);
  canvas.height = Math.floor(cssHeight * ratio);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, width: cssWidth, height: cssHeight };
}

function drawPaths(canvas, paths, options = {}) {
  const { ctx, width, height } = prepCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  if (!paths.length) return;

  const pad = { left: 64, right: 16, top: 18, bottom: 34 };
  const values = paths.flat();
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) { min -= 1; max += 1; }
  const steps = Math.max(...paths.map((p) => p.length)) - 1;
  const x = (i) => pad.left + (i / Math.max(1, steps)) * (width - pad.left - pad.right);
  const y = (v) => pad.top + (max - v) / (max - min) * (height - pad.top - pad.bottom);

  ctx.strokeStyle = "#263244";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let g = 0; g <= 4; g += 1) {
    const gy = pad.top + g * (height - pad.top - pad.bottom) / 4;
    ctx.moveTo(pad.left, gy); ctx.lineTo(width - pad.right, gy);
  }
  ctx.stroke();

  paths.forEach((path, idx) => {
    const edge = idx === 0 || idx === paths.length - 1;
    const median = idx === Math.floor(paths.length / 2);
    ctx.strokeStyle = median ? "#6ee7b7" : edge ? "#fb7185" : "rgba(96,165,250,.16)";
    ctx.lineWidth = median ? 2.4 : edge ? 1.5 : 1;
    ctx.beginPath();
    path.forEach((value, i) => {
      const px = x(i);
      const py = y(value);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
  });

  if (Number.isFinite(options.baseline)) {
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = "rgba(238,243,251,.45)";
    ctx.beginPath(); ctx.moveTo(pad.left, y(options.baseline)); ctx.lineTo(width - pad.right, y(options.baseline)); ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.fillStyle = "#9aa7b8";
  ctx.font = "12px system-ui";
  ctx.textAlign = "right";
  for (let g = 0; g <= 4; g += 1) {
    const value = max - g * (max - min) / 4;
    const gy = pad.top + g * (height - pad.top - pad.bottom) / 4;
    ctx.fillText((options.yFormatter || compactNumber)(value), pad.left - 8, gy + 4);
  }
  ctx.textAlign = "center";
  ctx.fillText("0", pad.left, height - 10);
  ctx.fillText(String(steps), width - pad.right, height - 10);
}

function drawHistogram(canvas, values, formatter = compactNumber) {
  const { ctx, width, height } = prepCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  if (!values.length) return;

  const pad = { left: 64, right: 16, top: 18, bottom: 42 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binsCount = Math.min(35, Math.max(10, Math.round(Math.sqrt(values.length))));
  const span = max - min || 1;
  const bins = Array.from({ length: binsCount }, () => 0);
  values.forEach((value) => {
    const idx = Math.min(binsCount - 1, Math.floor((value - min) / span * binsCount));
    bins[idx] += 1;
  });
  const maxCount = Math.max(...bins);
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const barW = chartW / binsCount;

  ctx.fillStyle = "rgba(96,165,250,.62)";
  bins.forEach((count, i) => {
    const h = count / maxCount * chartH;
    ctx.fillRect(pad.left + i * barW + 1, pad.top + chartH - h, Math.max(1, barW - 2), h);
  });

  ctx.strokeStyle = "#263244";
  ctx.strokeRect(pad.left, pad.top, chartW, chartH);
  ctx.fillStyle = "#9aa7b8";
  ctx.font = "12px system-ui";
  ctx.textAlign = "left";
  ctx.fillText(formatter(min), pad.left, height - 14);
  ctx.textAlign = "right";
  ctx.fillText(formatter(max), width - pad.right, height - 14);
}
