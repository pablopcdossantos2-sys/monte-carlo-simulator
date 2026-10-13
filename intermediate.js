import { runTradeMonteCarlo } from "./core.js";

const $i = (id) => document.getElementById(id);
const locale = () => window.I18N?.getLanguage?.() || "pt-BR";
const L = (pt, en, es) => locale() === "en" ? en : locale() === "es" ? es : pt;
const numberI = (value, digits = 2) => new Intl.NumberFormat(locale(), { maximumFractionDigits: digits }).format(value);
const moneyI = (value) => new Intl.NumberFormat(locale(), { style: "currency", currency: "BRL", maximumFractionDigits: 2 }).format(value);
const pctI = (value, digits = 1) => `${numberI(value, digits)}%`;
const escapeI = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[char]));

const OFF_RULES = {
  targetPct: 0,
  maxLossPct: 0,
  dailyLossPct: 0,
  ruinThresholdPct: 0,
  tradesPerDay: 5,
  trailingMode: "none",
};

function config({
  winRatePct,
  rewardRisk,
  riskPct = 1,
  positionSizing = "fixed",
  trades = 250,
  simulations = 3000,
  seed = 4242,
  rules = OFF_RULES,
}) {
  return {
    mode: "parameters",
    startingCapital: 10000,
    winRatePct,
    rewardRisk,
    riskPct,
    positionSizing,
    costPerTrade: 0,
    tradesPerSimulation: trades,
    simulations,
    seed,
    rules: { ...rules },
  };
}

const state = {
  started: false,
  index: 0,
  results: {},
  predictions: {},
};

function expectancy(winRatePct, rewardRisk) {
  const p = winRatePct / 100;
  return p * rewardRisk - (1 - p);
}

function steps() {
  return [
    {
      id: "high-win-negative",
      tag: L("Win rate", "Win rate", "Win rate"),
      title: L("70% de acerto pode perder dinheiro", "A 70% win rate can still lose money", "Un 70% de acierto aún puede perder dinero"),
      objective: L(
        "Começamos com uma estratégia que vence 70% dos trades, mas ganha apenas 0,4R quando acerta e perde 1R quando erra.",
        "We start with a strategy that wins 70% of trades but earns only 0.4R on a win and loses 1R on a loss.",
        "Comenzamos con una estrategia que gana el 70% de los trades, pero obtiene solo 0,4R al acertar y pierde 1R al fallar."
      ),
      controlled: [
        L("Win rate: 70%", "Win rate: 70%", "Win rate: 70%"),
        L("Ganho: +0,4R · perda: -1R", "Win: +0.4R · loss: -1R", "Ganancia: +0,4R · pérdida: -1R"),
        L("Risco: 1% por trade", "Risk: 1% per trade", "Riesgo: 1% por trade"),
        L("250 trades por caminho", "250 trades per path", "250 trades por trayectoria"),
      ],
      question: L(
        "Uma taxa de acerto de 70% é suficiente para tornar a estratégia lucrativa?",
        "Is a 70% win rate enough to make the strategy profitable?",
        "¿Una tasa de acierto del 70% es suficiente para que la estrategia sea rentable?"
      ),
      watch: [
        L("Expectância em R", "Expectancy in R", "Expectativa en R"),
        L("Probabilidade de lucro", "Profit probability", "Probabilidad de beneficio"),
        L("Saldo final P50", "P50 final balance", "Saldo final P50"),
      ],
      preview: ["70% win rate", "R:R = 0,4", "E[R] = -0,02R", "Risk = 1%"],
      prediction: {
        prompt: L(
          "Com 70% de acerto e payoff de apenas 0,4R, qual deve ser o sinal da expectância?",
          "With a 70% win rate and only 0.4R payoff, what should the sign of expectancy be?",
          "Con un 70% de acierto y payoff de solo 0,4R, ¿cuál debería ser el signo de la expectativa?"
        ),
        choices: [
          { id: "positive", label: L("Positiva", "Positive", "Positiva") },
          { id: "zero", label: L("Próxima de zero", "Near zero", "Cercana a cero") },
          { id: "negative", label: L("Negativa", "Negative", "Negativa") },
        ],
        correct: "negative",
        explanation: L(
          "E[R] = 0,70 × 0,4 − 0,30 × 1 = -0,02R. Acertar muito não basta quando o ganho médio é pequeno diante da perda.",
          "E[R] = 0.70 × 0.4 − 0.30 × 1 = -0.02R. Winning often is not enough when the average win is small relative to the loss.",
          "E[R] = 0,70 × 0,4 − 0,30 × 1 = -0,02R. Acertar mucho no basta cuando la ganancia media es pequeña frente a la pérdida."
        ),
      },
      run: () => runTradeMonteCarlo(config({ winRatePct: 70, rewardRisk: 0.4 })),
    },
    {
      id: "low-win-positive",
      tag: L("Payoff", "Payoff", "Payoff"),
      title: L("35% de acerto pode ter edge positivo", "A 35% win rate can have a positive edge", "Un 35% de acierto puede tener edge positivo"),
      objective: L(
        "Agora reduzimos muito a taxa de acerto, mas os trades vencedores passam a pagar 2,2R para cada 1R perdido.",
        "Now we greatly reduce win rate, but winning trades pay 2.2R for every 1R lost.",
        "Ahora reducimos mucho la tasa de acierto, pero los trades ganadores pagan 2,2R por cada 1R perdido."
      ),
      controlled: [
        L("Win rate: 35%", "Win rate: 35%", "Win rate: 35%"),
        L("Ganho: +2,2R · perda: -1R", "Win: +2.2R · loss: -1R", "Ganancia: +2,2R · pérdida: -1R"),
        L("Risco: 1% por trade", "Risk: 1% per trade", "Riesgo: 1% por trade"),
        L("Mesmos 250 trades e mesma semente", "Same 250 trades and same seed", "Mismos 250 trades y misma semilla"),
      ],
      question: L(
        "Uma estratégia que erra 65% das vezes pode ser melhor que a anterior de 70% de acerto?",
        "Can a strategy that loses 65% of the time be better than the previous 70%-win strategy?",
        "¿Puede una estrategia que falla el 65% de las veces ser mejor que la anterior con 70% de acierto?"
      ),
      watch: [
        L("Expectância", "Expectancy", "Expectativa"),
        L("Probabilidade de lucro", "Profit probability", "Probabilidad de beneficio"),
        L("Sequência de perdas P95", "P95 losing streak", "Racha de pérdidas P95"),
      ],
      preview: ["35% win rate", "R:R = 2,2", "E[R] = +0,12R", "Risk = 1%"],
      prediction: {
        prompt: L(
          "Qual é a expectância aproximada de 35% de acerto com ganho médio de 2,2R?",
          "What is the approximate expectancy of a 35% win rate with an average 2.2R win?",
          "¿Cuál es la expectativa aproximada de un 35% de acierto con ganancia media de 2,2R?"
        ),
        choices: [
          { id: "negative", label: "-0,12R" },
          { id: "positive", label: "+0,12R" },
          { id: "large", label: "+0,77R" },
        ],
        correct: "positive",
        explanation: L(
          "E[R] = 0,35 × 2,2 − 0,65 × 1 = +0,12R. O payoff compensa a baixa taxa de acerto.",
          "E[R] = 0.35 × 2.2 − 0.65 × 1 = +0.12R. The payoff compensates for the low win rate.",
          "E[R] = 0,35 × 2,2 − 0,65 × 1 = +0,12R. El payoff compensa la baja tasa de acierto."
        ),
      },
      run: () => runTradeMonteCarlo(config({ winRatePct: 35, rewardRisk: 2.2 })),
    },
    {
      id: "same-expectancy",
      tag: L("Mesma expectância", "Same expectancy", "Misma expectativa"),
      title: L("Mesmo E[R], experiências diferentes", "Same E[R], different experiences", "Mismo E[R], experiencias diferentes"),
      objective: L(
        "Comparamos duas estratégias com expectância teórica de aproximadamente +0,20R: uma acerta 70% com payoff baixo; a outra acerta 35% com payoff alto.",
        "We compare two strategies with theoretical expectancy of about +0.20R: one wins 70% with low payoff; the other wins 35% with high payoff.",
        "Comparamos dos estrategias con expectativa teórica de aproximadamente +0,20R: una acierta 70% con payoff bajo; la otra 35% con payoff alto."
      ),
      controlled: [
        L("Estratégia A: 70% · 0,714R", "Strategy A: 70% · 0.714R", "Estrategia A: 70% · 0,714R"),
        L("Estratégia B: 35% · 2,429R", "Strategy B: 35% · 2.429R", "Estrategia B: 35% · 2,429R"),
        L("Ambas: E[R] ≈ +0,20R", "Both: E[R] ≈ +0.20R", "Ambas: E[R] ≈ +0,20R"),
        L("Risco: 1% por trade", "Risk: 1% per trade", "Riesgo: 1% por trade"),
      ],
      question: L(
        "Se a expectância é a mesma, as duas estratégias devem ter losing streaks semelhantes?",
        "If expectancy is the same, should both strategies have similar losing streaks?",
        "Si la expectativa es la misma, ¿deberían ambas estrategias tener rachas de pérdidas similares?"
      ),
      watch: [
        L("Losing streak P95", "P95 losing streak", "Racha de pérdidas P95"),
        L("Drawdown P95", "P95 drawdown", "Drawdown P95"),
        L("Probabilidade de lucro", "Profit probability", "Probabilidad de beneficio"),
      ],
      preview: ["A: 70% / 0,714R", "B: 35% / 2,429R", "E[R] ≈ +0,20R"],
      prediction: {
        prompt: L(
          "Qual estratégia tende a apresentar a maior sequência de perdas?",
          "Which strategy tends to show the longer losing streak?",
          "¿Qué estrategia tiende a presentar la mayor racha de pérdidas?"
        ),
        choices: [
          { id: "a", label: L("A, com 70% de acerto", "A, with 70% win rate", "A, con 70% de acierto") },
          { id: "same", label: L("As duas devem ser iguais", "They should be the same", "Deben ser iguales") },
          { id: "b", label: L("B, com 35% de acerto", "B, with 35% win rate", "B, con 35% de acierto") },
        ],
        correct: "b",
        explanation: L(
          "Expectância igual não significa distribuição igual. A estratégia de 35% perde com muito mais frequência e tende a produzir losing streaks mais longos.",
          "Equal expectancy does not mean equal distribution. The 35% strategy loses far more often and tends to produce longer losing streaks.",
          "Misma expectativa no significa misma distribución. La estrategia del 35% pierde con mucha más frecuencia y tiende a producir rachas más largas."
        ),
      },
      run: () => ({
        a: runTradeMonteCarlo(config({ winRatePct: 70, rewardRisk: 5 / 7 })),
        b: runTradeMonteCarlo(config({ winRatePct: 35, rewardRisk: 17 / 7 })),
      }),
    },
    {
      id: "payoff-flip",
      tag: L("Payoff", "Payoff", "Payoff"),
      title: L("O payoff pode inverter o sinal da estratégia", "Payoff can flip the sign of a strategy", "El payoff puede invertir el signo de una estrategia"),
      objective: L(
        "Mantemos o win rate em 40% e alteramos somente o ganho médio: primeiro 1R, depois 2R.",
        "We keep win rate at 40% and change only the average win: first 1R, then 2R.",
        "Mantenemos el win rate en 40% y cambiamos solo la ganancia media: primero 1R y luego 2R."
      ),
      controlled: [
        L("Win rate fixo: 40%", "Fixed win rate: 40%", "Win rate fijo: 40%"),
        L("Cenário A: +1R / -1R", "Scenario A: +1R / -1R", "Escenario A: +1R / -1R"),
        L("Cenário B: +2R / -1R", "Scenario B: +2R / -1R", "Escenario B: +2R / -1R"),
        L("Mesmo risco e mesma semente", "Same risk and same seed", "Mismo riesgo y misma semilla"),
      ],
      question: L(
        "Sem mudar a taxa de acerto, dobrar o payoff pode transformar uma estratégia negativa em positiva?",
        "Without changing win rate, can doubling payoff turn a negative strategy into a positive one?",
        "Sin cambiar la tasa de acierto, ¿duplicar el payoff puede transformar una estrategia negativa en positiva?"
      ),
      watch: [
        L("E[R] dos dois cenários", "E[R] of both scenarios", "E[R] de ambos escenarios"),
        L("Probabilidade de lucro", "Profit probability", "Probabilidad de beneficio"),
        L("Saldo P50", "P50 balance", "Saldo P50"),
      ],
      preview: ["40% win rate", "A: R:R 1,0", "B: R:R 2,0"],
      prediction: {
        prompt: L(
          "Com 40% de acerto, qual cenário deve ter expectância positiva?",
          "With a 40% win rate, which scenario should have positive expectancy?",
          "Con un 40% de acierto, ¿qué escenario debería tener expectativa positiva?"
        ),
        choices: [
          { id: "a", label: "R:R 1,0" },
          { id: "b", label: "R:R 2,0" },
          { id: "both", label: L("Os dois", "Both", "Los dos") },
        ],
        correct: "b",
        explanation: L(
          "Com R:R 1, E[R] = -0,20R. Com R:R 2, E[R] = +0,20R. O win rate ficou idêntico.",
          "At R:R 1, E[R] = -0.20R. At R:R 2, E[R] = +0.20R. Win rate stayed identical.",
          "Con R:R 1, E[R] = -0,20R. Con R:R 2, E[R] = +0,20R. El win rate permaneció idéntico."
        ),
      },
      run: () => ({
        a: runTradeMonteCarlo(config({ winRatePct: 40, rewardRisk: 1 })),
        b: runTradeMonteCarlo(config({ winRatePct: 40, rewardRisk: 2 })),
      }),
    },
    {
      id: "ruin-sizing",
      tag: L("Risco de ruína", "Risk of ruin", "Riesgo de ruina"),
      title: L("O mesmo edge, três níveis de risco", "The same edge, three risk levels", "El mismo edge, tres niveles de riesgo"),
      objective: L(
        "Usamos a mesma estratégia de edge positivo e definimos como violação uma queda de 20% do capital inicial. Só o risco por trade muda.",
        "We use the same positive-edge strategy and define a 20% loss from starting capital as a breach. Only risk per trade changes.",
        "Usamos la misma estrategia con edge positivo y definimos como incumplimiento una caída del 20% del capital inicial. Solo cambia el riesgo por trade."
      ),
      controlled: [
        L("Win rate: 45%", "Win rate: 45%", "Win rate: 45%"),
        L("Reward:Risk: 1,5", "Reward:Risk: 1.5", "Reward:Risk: 1,5"),
        L("E[R] = +0,125R", "E[R] = +0.125R", "E[R] = +0,125R"),
        L("Limite de ruína do experimento: -20%", "Experimental ruin limit: -20%", "Límite de ruina del experimento: -20%"),
      ],
      question: L(
        "Se o edge permanece igual, aumentar o risco por trade altera a probabilidade de tocar o limite de -20%?",
        "If the edge remains the same, does increasing risk per trade change the probability of hitting the -20% limit?",
        "Si el edge permanece igual, ¿aumentar el riesgo por trade cambia la probabilidad de tocar el límite de -20%?"
      ),
      watch: [
        L("Probabilidade de violação", "Breach probability", "Probabilidad de incumplimiento"),
        L("Drawdown P95", "P95 drawdown", "Drawdown P95"),
        L("Saldo P5", "P5 balance", "Saldo P5"),
      ],
      preview: ["Risk: 1% × 3% × 5%", "E[R] = +0,125R", "Ruin limit = -20%"],
      prediction: {
        prompt: L(
          "Qual nível de risco deve apresentar a maior probabilidade de tocar o limite de -20%?",
          "Which risk level should have the highest probability of hitting the -20% limit?",
          "¿Qué nivel de riesgo debería presentar la mayor probabilidad de tocar el límite de -20%?"
        ),
        choices: [
          { id: "1", label: "1%" },
          { id: "3", label: "3%" },
          { id: "5", label: "5%" },
        ],
        correct: "5",
        explanation: L(
          "O edge é o mesmo, mas perdas individuais maiores aproximam a equity do limite muito mais rapidamente.",
          "The edge is the same, but larger individual losses move equity toward the limit much faster.",
          "El edge es el mismo, pero pérdidas individuales mayores acercan la equity al límite mucho más rápido."
        ),
      },
      run: () => {
        const rules = { ...OFF_RULES, ruinThresholdPct: 20 };
        return [1, 3, 5].map((risk) => ({
          risk,
          result: runTradeMonteCarlo(config({ winRatePct: 45, rewardRisk: 1.5, riskPct: risk, rules, trades: 300 })),
        }));
      },
    },
    {
      id: "kelly",
      tag: L("Kelly", "Kelly", "Kelly"),
      title: L("Kelly é referência de crescimento, não de conforto", "Kelly is a growth reference, not a comfort target", "Kelly es una referencia de crecimiento, no de comodidad"),
      objective: L(
        "Para 40% de acerto e payoff 2:1, a fração de Kelly teórica é 10%. Vamos comparar 1%, 5% e 10% com sizing composto e um limite de perda de 30%.",
        "For a 40% win rate and 2:1 payoff, the theoretical Kelly fraction is 10%. We compare 1%, 5% and 10% with compound sizing and a 30% loss limit.",
        "Para 40% de acierto y payoff 2:1, la fracción de Kelly teórica es 10%. Comparamos 1%, 5% y 10% con sizing compuesto y un límite de pérdida del 30%."
      ),
      controlled: [
        L("Win rate: 40% · R:R: 2", "Win rate: 40% · R:R: 2", "Win rate: 40% · R:R: 2"),
        L("Kelly teórico: 10%", "Theoretical Kelly: 10%", "Kelly teórico: 10%"),
        L("Sizing composto", "Compound sizing", "Sizing compuesto"),
        L("Limite de perda: -30%", "Loss limit: -30%", "Límite de pérdida: -30%"),
      ],
      question: L(
        "O fato de 10% ser a fração de Kelly teórica significa que ela será a opção mais confortável em drawdown?",
        "Does a theoretical 10% Kelly fraction mean it will be the most comfortable option in drawdown?",
        "¿Que 10% sea la fracción de Kelly teórica significa que será la opción más cómoda en drawdown?"
      ),
      watch: [
        L("Saldo mediano", "Median balance", "Saldo mediano"),
        L("Drawdown P95", "P95 drawdown", "Drawdown P95"),
        L("Probabilidade de violação", "Breach probability", "Probabilidad de incumplimiento"),
      ],
      preview: ["Kelly = 10%", "Risk: 1% × 5% × 10%", "Compound sizing", "Loss limit = -30%"],
      prediction: {
        prompt: L(
          "Kelly teórico deve ser interpretado como uma recomendação de risco confortável?",
          "Should theoretical Kelly be interpreted as a recommendation for comfortable risk?",
          "¿Debe interpretarse Kelly teórico como una recomendación de riesgo cómodo?"
        ),
        choices: [
          { id: "yes", label: L("Sim", "Yes", "Sí") },
          { id: "no", label: L("Não", "No", "No") },
        ],
        correct: "no",
        explanation: L(
          "Kelly maximiza crescimento logarítmico esperado sob hipóteses específicas; não minimiza drawdown nem garante tolerância psicológica ou operacional.",
          "Kelly maximizes expected logarithmic growth under specific assumptions; it does not minimize drawdown or guarantee psychological or operational tolerance.",
          "Kelly maximiza el crecimiento logarítmico esperado bajo hipótesis específicas; no minimiza drawdown ni garantiza tolerancia psicológica u operativa."
        ),
      },
      run: () => {
        const rules = { ...OFF_RULES, ruinThresholdPct: 30 };
        return [1, 5, 10].map((risk) => ({
          risk,
          result: runTradeMonteCarlo(config({
            winRatePct: 40,
            rewardRisk: 2,
            riskPct: risk,
            positionSizing: "compound",
            trades: 200,
            rules,
          })),
        }));
      },
    },
  ];
}

function listHtml(items) {
  return `<ul>${items.map((item) => `<li>${escapeI(item)}</li>`).join("")}</ul>`;
}

function metric(label, value) {
  return `<div class="lesson-analysis-metric"><span>${escapeI(label)}</span><strong>${escapeI(value)}</strong></div>`;
}

function setProgress() {
  const complete = Object.keys(state.results).length;
  const total = steps().length;
  const value = Math.round(complete / total * 100);
  $i("intermediate-progress-label").textContent = L(`${complete} de ${total} experimentos`, `${complete} of ${total} experiments`, `${complete} de ${total} experimentos`);
  $i("intermediate-progress-percent").textContent = `${value}%`;
  $i("intermediate-progress-bar").style.width = `${value}%`;
}

function start() {
  state.started = true;
  state.index = 0;
  state.results = {};
  state.predictions = {};
  $i("intermediate-intro").classList.add("hidden");
  $i("intermediate-start-wrap").classList.add("hidden");
  $i("intermediate-finish").classList.add("hidden");
  $i("intermediate-workspace").classList.remove("hidden");
  $i("intermediate-status").className = "lesson-status active";
  renderStep();
  setProgress();
  $i("aula-intermediaria").scrollIntoView({ behavior: "smooth", block: "start" });
}

function reset() {
  state.started = false;
  state.index = 0;
  state.results = {};
  state.predictions = {};
  $i("intermediate-workspace").classList.add("hidden");
  $i("intermediate-finish").classList.add("hidden");
  $i("intermediate-intro").classList.remove("hidden");
  $i("intermediate-start-wrap").classList.remove("hidden");
  $i("intermediate-status").className = "lesson-status";
  $i("intermediate-status").textContent = L("Não iniciada", "Not started", "No iniciada");
  setProgress();
}

function renderStep() {
  const all = steps();
  const step = all[state.index];
  const existing = state.results[step.id];
  const prediction = state.predictions[step.id];

  $i("intermediate-status").textContent = L(
    `Experimento ${state.index + 1} de ${all.length}`,
    `Experiment ${state.index + 1} of ${all.length}`,
    `Experimento ${state.index + 1} de ${all.length}`
  );
  $i("intermediate-step-kicker").textContent = L(`Experimento ${state.index + 1}`, `Experiment ${state.index + 1}`, `Experimento ${state.index + 1}`);
  $i("intermediate-step-title").textContent = step.title;
  $i("intermediate-step-tag").textContent = step.tag;
  $i("intermediate-step-objective").textContent = step.objective;
  $i("intermediate-controlled").innerHTML = listHtml(step.controlled);
  $i("intermediate-question").textContent = step.question;
  $i("intermediate-watch").innerHTML = listHtml(step.watch);
  $i("intermediate-config-preview").innerHTML = step.preview.map((item) => `<span class="lesson-chip">${escapeI(item)}</span>`).join("");

  $i("intermediate-prediction-question").textContent = step.prediction.prompt;
  $i("intermediate-prediction-options").innerHTML = step.prediction.choices.map((choice) =>
    `<button type="button" class="prediction-option ${prediction?.choice === choice.id ? "selected" : ""}" data-choice="${escapeI(choice.id)}" ${existing ? "disabled" : ""}>${escapeI(choice.label)}</button>`
  ).join("");

  $i("intermediate-prediction-options").querySelectorAll(".prediction-option").forEach((button) => {
    button.addEventListener("click", () => choosePrediction(step, button.dataset.choice));
  });

  if (existing && prediction) renderPredictionFeedback(step);
  else {
    $i("intermediate-prediction-feedback").className = "lesson-prediction-feedback hidden";
    $i("intermediate-prediction-feedback").innerHTML = "";
  }

  $i("intermediate-prev").disabled = state.index === 0;
  $i("intermediate-next").disabled = !existing;
  $i("intermediate-next").textContent = state.index === all.length - 1
    ? L("Concluir aula →", "Finish lesson →", "Finalizar clase →")
    : L("Próximo experimento →", "Next experiment →", "Siguiente experimento →");
  $i("intermediate-run").disabled = !prediction;
  $i("intermediate-run").textContent = existing
    ? L("Executar novamente", "Run again", "Ejecutar nuevamente")
    : L("Simular experimento", "Simulate experiment", "Simular experimento");

  if (existing) renderAnalysis(step, existing, false);
  else $i("intermediate-analysis").classList.add("hidden");

  setProgress();
}

function choosePrediction(step, choice) {
  if (state.results[step.id]) return;
  state.predictions[step.id] = { choice, correct: choice === step.prediction.correct };
  renderStep();
  $i("intermediate-prediction-feedback").className = "lesson-prediction-feedback";
  $i("intermediate-prediction-feedback").innerHTML = `<strong>${escapeI(L("Previsão registrada. Agora execute a simulação.", "Prediction recorded. Now run the simulation.", "Predicción registrada. Ahora ejecuta la simulación."))}</strong>`;
  $i("intermediate-run").disabled = false;
}

function renderPredictionFeedback(step) {
  const pred = state.predictions[step.id];
  if (!pred) return;
  $i("intermediate-prediction-feedback").className = `lesson-prediction-feedback ${pred.correct ? "correct" : "incorrect"}`;
  $i("intermediate-prediction-feedback").innerHTML =
    `<strong>${escapeI(pred.correct ? L("Acertou a previsão.", "Your prediction was correct.", "Acertaste la predicción.") : L("Sua previsão não se confirmou.", "Your prediction was not confirmed.", "Tu predicción no se confirmó."))}</strong><span>${escapeI(step.prediction.explanation)}</span>`;
}

function runCurrent() {
  const step = steps()[state.index];
  if (!state.predictions[step.id]) return;

  try {
    $i("intermediate-run").disabled = true;
    $i("intermediate-run").textContent = L("Simulando...", "Simulating...", "Simulando...");
    const result = step.run();
    state.results[step.id] = result;
    renderPredictionFeedback(step);
    renderAnalysis(step, result, true);
    $i("intermediate-next").disabled = false;
    setProgress();
  } finally {
    $i("intermediate-run").disabled = false;
    $i("intermediate-run").textContent = L("Executar novamente", "Run again", "Ejecutar nuevamente");
  }
}

function renderAnalysis(step, result, shouldScroll = true) {
  const analysis = analyze(step, result);
  $i("intermediate-analysis-title").textContent = analysis.title;
  $i("intermediate-analysis-metrics").innerHTML = analysis.metrics.map((item) => metric(item.label, item.value)).join("");
  $i("intermediate-analysis-text").innerHTML = analysis.html;
  $i("intermediate-analysis").classList.remove("hidden");
  if (shouldScroll) $i("intermediate-analysis").scrollIntoView({ behavior: "smooth", block: "center" });
}

function analyze(step, result) {
  if (step.id === "high-win-negative") {
    const s = result.summary;
    return {
      title: L("Win rate alto não salvou a expectância", "High win rate did not save expectancy", "El win rate alto no salvó la expectativa"),
      metrics: [
        { label: "E[R]", value: `${numberI(s.expectedRPerTrade, 3)}R` },
        { label: L("Prob. lucro", "Profit probability", "Prob. beneficio"), value: pctI(s.probabilityProfitPct) },
        { label: L("Saldo P50", "P50 balance", "Saldo P50"), value: moneyI(s.finalBalance.p50) },
        { label: "DD P95", value: pctI(s.maxDrawdownPct.p95) },
      ],
      html: L(
        "<p>A estratégia acerta muito, mas o ganho por acerto é pequeno demais. O resultado ensina que <strong>win rate é apenas uma parte da equação</strong>.</p>",
        "<p>The strategy wins often, but each win is too small. The result shows that <strong>win rate is only one part of the equation</strong>.</p>",
        "<p>La estrategia acierta mucho, pero cada ganancia es demasiado pequeña. El resultado muestra que <strong>el win rate es solo una parte de la ecuación</strong>.</p>"
      ),
    };
  }

  if (step.id === "low-win-positive") {
    const s = result.summary;
    const prior = state.results["high-win-negative"]?.summary;
    return {
      title: L("Menos acertos, mas uma matemática melhor", "Fewer wins, but better mathematics", "Menos aciertos, pero mejores matemáticas"),
      metrics: [
        { label: "E[R]", value: `+${numberI(s.expectedRPerTrade, 3)}R` },
        { label: L("Prob. lucro", "Profit probability", "Prob. beneficio"), value: pctI(s.probabilityProfitPct) },
        { label: L("Losing streak P95", "P95 losing streak", "Racha P95"), value: numberI(s.losingStreak.p95, 0) },
        { label: L("Anterior E[R]", "Previous E[R]", "E[R] anterior"), value: prior ? `${numberI(prior.expectedRPerTrade, 3)}R` : "—" },
      ],
      html: L(
        "<p>A estratégia perde mais vezes do que ganha, mas cada ganho compensa várias perdas. Isso é por que <strong>taxa de acerto não deve ser usada isoladamente para avaliar qualidade</strong>.</p>",
        "<p>The strategy loses more often than it wins, but each win pays for several losses. This is why <strong>win rate should not be used alone to judge quality</strong>.</p>",
        "<p>La estrategia pierde más veces de las que gana, pero cada ganancia compensa varias pérdidas. Por eso <strong>la tasa de acierto no debe usarse sola para evaluar calidad</strong>.</p>"
      ),
    };
  }

  if (step.id === "same-expectancy") {
    const a = result.a.summary;
    const b = result.b.summary;
    return {
      title: L("A mesma expectância pode exigir psicologias diferentes", "The same expectancy can require different psychology", "La misma expectativa puede exigir psicologías diferentes"),
      metrics: [
        { label: "A · E[R]", value: `${numberI(a.expectedRPerTrade, 3)}R` },
        { label: "B · E[R]", value: `${numberI(b.expectedRPerTrade, 3)}R` },
        { label: L("A · streak P95", "A · P95 streak", "A · racha P95"), value: numberI(a.losingStreak.p95, 0) },
        { label: L("B · streak P95", "B · P95 streak", "B · racha P95"), value: numberI(b.losingStreak.p95, 0) },
      ],
      html: L(
        `<p>As duas estratégias têm praticamente o mesmo E[R], mas a de 35% de acerto apresentou uma sequência de perdas P95 de <strong>${numberI(b.losingStreak.p95, 0)}</strong>, contra <strong>${numberI(a.losingStreak.p95, 0)}</strong> na de 70%. <strong>Expectância não descreve sozinha o caminho.</strong></p>`,
        `<p>Both strategies have almost the same E[R], but the 35% win-rate strategy produced a P95 losing streak of <strong>${numberI(b.losingStreak.p95, 0)}</strong>, versus <strong>${numberI(a.losingStreak.p95, 0)}</strong> for the 70% strategy. <strong>Expectancy alone does not describe the path.</strong></p>`,
        `<p>Ambas estrategias tienen casi el mismo E[R], pero la estrategia del 35% produjo una racha de pérdidas P95 de <strong>${numberI(b.losingStreak.p95, 0)}</strong>, frente a <strong>${numberI(a.losingStreak.p95, 0)}</strong> en la del 70%. <strong>La expectativa por sí sola no describe la trayectoria.</strong></p>`
      ),
    };
  }

  if (step.id === "payoff-flip") {
    const a = result.a.summary;
    const b = result.b.summary;
    return {
      title: L("O payoff mudou o edge sem mudar o win rate", "Payoff changed the edge without changing win rate", "El payoff cambió el edge sin cambiar el win rate"),
      metrics: [
        { label: "R:R 1 · E[R]", value: `${numberI(a.expectedRPerTrade, 2)}R` },
        { label: "R:R 2 · E[R]", value: `+${numberI(b.expectedRPerTrade, 2)}R` },
        { label: L("R:R 1 · prob. lucro", "R:R 1 · profit prob.", "R:R 1 · prob. beneficio"), value: pctI(a.probabilityProfitPct) },
        { label: L("R:R 2 · prob. lucro", "R:R 2 · profit prob.", "R:R 2 · prob. beneficio"), value: pctI(b.probabilityProfitPct) },
      ],
      html: L(
        "<p>O win rate ficou em 40% nos dois cenários. Apenas o payoff mudou, e isso foi suficiente para levar a expectância de negativa para positiva.</p>",
        "<p>Win rate stayed at 40% in both scenarios. Only payoff changed, and that was enough to move expectancy from negative to positive.</p>",
        "<p>El win rate se mantuvo en 40% en ambos escenarios. Solo cambió el payoff, y eso bastó para llevar la expectativa de negativa a positiva.</p>"
      ),
    };
  }

  if (step.id === "ruin-sizing") {
    const rows = result.map(({ risk, result: r }) => ({
      risk,
      breach: r.summary.probabilityBreachPct,
      dd: r.summary.maxDrawdownPct.p95,
      p5: r.summary.finalBalance.p05,
    }));
    const table = `<table class="lesson-comparison"><thead><tr><th>${escapeI(L("Risco", "Risk", "Riesgo"))}</th><th>${escapeI(L("Violação -20%", "Breach -20%", "Incumplimiento -20%"))}</th><th>DD P95</th><th>${escapeI(L("Saldo P5", "P5 balance", "Saldo P5"))}</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${pctI(row.risk)}</td><td>${pctI(row.breach)}</td><td>${pctI(row.dd)}</td><td>${moneyI(row.p5)}</td></tr>`).join("")}</tbody></table>`;
    return {
      title: L("O edge não mudou; a sobrevivência mudou", "The edge did not change; survival did", "El edge no cambió; la supervivencia sí"),
      metrics: rows.map((row) => ({ label: L(`Violação · ${row.risk}%`, `Breach · ${row.risk}%`, `Incumplimiento · ${row.risk}%`), value: pctI(row.breach) })),
      html: L(
        `<p>Todos os cenários usam a mesma estratégia. O que muda é quanto cada trade pode retirar do capital. A tabela mostra por que <strong>edge positivo não torna qualquer sizing aceitável</strong>.</p>${table}`,
        `<p>All scenarios use the same strategy. What changes is how much each trade can remove from capital. The table shows why <strong>positive edge does not make every sizing level acceptable</strong>.</p>${table}`,
        `<p>Todos los escenarios usan la misma estrategia. Lo que cambia es cuánto puede retirar cada trade del capital. La tabla muestra por qué <strong>un edge positivo no hace aceptable cualquier nivel de sizing</strong>.</p>${table}`
      ),
    };
  }

  if (step.id === "kelly") {
    const rows = result.map(({ risk, result: r }) => ({
      risk,
      median: r.summary.finalBalance.p50,
      breach: r.summary.probabilityBreachPct,
      dd: r.summary.maxDrawdownPct.p95,
    }));
    const kelly = result[result.length - 1].result.summary.kellyFraction * 100;
    const table = `<table class="lesson-comparison"><thead><tr><th>${escapeI(L("Risco", "Risk", "Riesgo"))}</th><th>${escapeI(L("Saldo P50", "P50 balance", "Saldo P50"))}</th><th>DD P95</th><th>${escapeI(L("Violação", "Breach", "Incumplimiento"))}</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${pctI(row.risk)}</td><td>${moneyI(row.median)}</td><td>${pctI(row.dd)}</td><td>${pctI(row.breach)}</td></tr>`).join("")}</tbody></table>`;
    return {
      title: L("Crescimento esperado e conforto são objetivos diferentes", "Expected growth and comfort are different objectives", "Crecimiento esperado y comodidad son objetivos distintos"),
      metrics: [
        { label: L("Kelly teórico", "Theoretical Kelly", "Kelly teórico"), value: pctI(kelly) },
        { label: "DD P95 · 1%", value: pctI(rows[0].dd) },
        { label: "DD P95 · 5%", value: pctI(rows[1].dd) },
        { label: "DD P95 · 10%", value: pctI(rows[2].dd) },
      ],
      html: L(
        `<p>A fórmula de Kelly produz aproximadamente <strong>${pctI(kelly)}</strong> para essas hipóteses, mas isso não significa que esse risco seja confortável, operacionalmente adequado ou compatível com limites de conta.</p>${table}<p>Kelly é uma referência matemática de crescimento sob hipóteses fortes — não uma recomendação automática.</p>`,
        `<p>The Kelly formula gives approximately <strong>${pctI(kelly)}</strong> under these assumptions, but that does not mean this risk is comfortable, operationally appropriate, or compatible with account limits.</p>${table}<p>Kelly is a mathematical growth reference under strong assumptions — not an automatic recommendation.</p>`,
        `<p>La fórmula de Kelly produce aproximadamente <strong>${pctI(kelly)}</strong> bajo estas hipótesis, pero eso no significa que ese riesgo sea cómodo, operativamente adecuado o compatible con límites de cuenta.</p>${table}<p>Kelly es una referencia matemática de crecimiento bajo hipótesis fuertes — no una recomendación automática.</p>`
      ),
    };
  }

  return { title: "", metrics: [], html: "" };
}

function move(delta) {
  const next = state.index + delta;
  const total = steps().length;
  if (next < 0) return;
  if (next >= total) {
    finish();
    return;
  }
  state.index = next;
  renderStep();
  $i("aula-intermediaria").scrollIntoView({ behavior: "smooth", block: "start" });
}

function finish() {
  const score = Object.values(state.predictions).filter((item) => item.correct).length;
  const total = steps().length;
  const high = state.results["high-win-negative"]?.summary;
  const low = state.results["low-win-positive"]?.summary;
  const ruin = state.results["ruin-sizing"];

  let html = `<p><span class="lesson-prediction-score">${escapeI(L(
    `Desafios de previsão: ${score}/${total} corretos.`,
    `Prediction challenges: ${score}/${total} correct.`,
    `Desafíos de predicción: ${score}/${total} correctos.`
  ))}</span></p>`;

  if (high && low) {
    html += L(
      `<p>A estratégia de 70% começou com <strong>${numberI(high.expectedRPerTrade, 2)}R</strong> de expectância; a de 35% apresentou <strong>+${numberI(low.expectedRPerTrade, 2)}R</strong>. A taxa de acerto, isoladamente, teria levado à conclusão errada.</p>`,
      `<p>The 70% strategy started with <strong>${numberI(high.expectedRPerTrade, 2)}R</strong> expectancy; the 35% strategy showed <strong>+${numberI(low.expectedRPerTrade, 2)}R</strong>. Win rate alone would have led to the wrong conclusion.</p>`,
      `<p>La estrategia del 70% comenzó con <strong>${numberI(high.expectedRPerTrade, 2)}R</strong> de expectativa; la del 35% mostró <strong>+${numberI(low.expectedRPerTrade, 2)}R</strong>. La tasa de acierto por sí sola habría llevado a una conclusión equivocada.</p>`
    );
  }
  if (Array.isArray(ruin)) {
    const lowRisk = ruin[0].result.summary.probabilityBreachPct;
    const highRisk = ruin[ruin.length - 1].result.summary.probabilityBreachPct;
    html += L(
      `<p>Com o mesmo edge, elevar o risco de 1% para 5% mudou a probabilidade de tocar o limite de -20% de <strong>${pctI(lowRisk)}</strong> para <strong>${pctI(highRisk)}</strong>.</p>`,
      `<p>With the same edge, increasing risk from 1% to 5% changed the probability of hitting the -20% limit from <strong>${pctI(lowRisk)}</strong> to <strong>${pctI(highRisk)}</strong>.</p>`,
      `<p>Con el mismo edge, aumentar el riesgo del 1% al 5% cambió la probabilidad de tocar el límite de -20% de <strong>${pctI(lowRisk)}</strong> a <strong>${pctI(highRisk)}</strong>.</p>`
    );
  }

  $i("intermediate-final-summary").innerHTML = html;
  $i("intermediate-workspace").classList.add("hidden");
  $i("intermediate-finish").classList.remove("hidden");
  $i("intermediate-status").className = "lesson-status done";
  $i("intermediate-status").textContent = L("Concluída", "Completed", "Completada");
  setProgress();
  $i("aula-intermediaria").scrollIntoView({ behavior: "smooth", block: "start" });
}

$i("intermediate-start").addEventListener("click", start);
$i("intermediate-restart").addEventListener("click", start);
$i("intermediate-exit").addEventListener("click", reset);
$i("intermediate-run").addEventListener("click", runCurrent);
$i("intermediate-prev").addEventListener("click", () => move(-1));
$i("intermediate-next").addEventListener("click", () => move(1));

document.addEventListener("i18n:change", () => {
  if (state.started && !$i("intermediate-workspace").classList.contains("hidden")) renderStep();
  else if (state.started && !$i("intermediate-finish").classList.contains("hidden")) finish();
  else reset();
});
