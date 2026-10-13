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
    setBusy($("run-trades"), true, "Simulando...");
    const mode = document.querySelector('input[name="trade-source"]:checked').value;
    let config;
    if (mode === "historical") {
      const trades = parsePnlText($("trade-data").value);
      if (trades.length < 2) throw new Error("Cole pelo menos dois resultados de trades válidos.");
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
    setBusy($("run-trades"), false, "Executar simulação");
  }
});

$("run-gbm").addEventListener("click", () => {
  try {
    setBusy($("run-gbm"), true, "Simulando...");
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
    setBusy($("run-gbm"), false, "Executar GBM");
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
  $("lesson-workspace").classList.add("hidden");
  $("lesson-finish").classList.add("hidden");
  $("lesson-intro").classList.remove("hidden");
  $("lesson-start-wrap").classList.remove("hidden");
  $("lesson-status").className = "lesson-status";
  $("lesson-status").textContent = "Não iniciada";
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
  const step = LESSON_STEPS[lessonState.index];
  const existing = lessonState.results[step.id];

  $("lesson-status").textContent = `Experimento ${lessonState.index + 1} de ${LESSON_STEPS.length}`;
  $("lesson-step-kicker").textContent = `Experimento ${lessonState.index + 1}`;
  $("lesson-step-title").textContent = step.title;
  $("lesson-step-tag").textContent = step.tag;
  $("lesson-step-objective").textContent = step.objective;
  $("lesson-question").textContent = step.question;
  $("lesson-controlled").innerHTML = lessonList(step.controlled);
  $("lesson-watch").innerHTML = lessonList(step.watch);
  $("lesson-config-preview").innerHTML = step.preview
    .map((item) => `<span class="lesson-chip">${escapeHtml(item)}</span>`)
    .join("");

  $("lesson-prev").disabled = lessonState.index === 0;
  $("lesson-next").disabled = !existing;
  $("lesson-next").textContent = lessonState.index === LESSON_STEPS.length - 1
    ? "Concluir aula →"
    : "Próximo experimento →";
  $("lesson-run").textContent = existing
    ? "Executar novamente"
    : step.type === "prop-comparison"
      ? "Executar comparação de riscos"
      : "Aplicar configuração e simular";

  if (existing) {
    renderLessonAnalysis(step, existing, false);
  } else {
    $("lesson-analysis").classList.add("hidden");
  }

  applyLessonConfig(step, false);
  updateLessonProgress();
}

function lessonList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
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
  try {
    setBusy($("lesson-run"), true, "Simulando...");
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
    $("lesson-next").disabled = false;
    $("lesson-run").textContent = step.type === "prop-comparison"
      ? "Executar comparação novamente"
      : "Executar novamente";
    updateLessonProgress();
  } catch (error) {
    alert(error?.message || String(error));
  } finally {
    setBusy($("lesson-run"), false, lessonState.results[step.id]
      ? (step.type === "prop-comparison" ? "Executar comparação novamente" : "Executar novamente")
      : "Aplicar configuração e simular");
  }
}

function renderLessonAnalysis(step, payload, shouldScroll = true) {
  const analysis = lessonAnalysisFor(step, payload);
  $("lesson-analysis-title").textContent = analysis.title;
  $("lesson-analysis-metrics").innerHTML = analysis.metrics
    .map((item) => `<div class="lesson-analysis-metric"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`)
    .join("");
  $("lesson-analysis-text").innerHTML = analysis.html + '<p><a href="#results">Ver gráficos e distribuição completos ↓</a></p>';
  $("lesson-analysis").classList.remove("hidden");
  if (shouldScroll) $("lesson-analysis").scrollIntoView({ behavior: "smooth", block: "center" });
}

function lessonAnalysisFor(step, payload) {
  if (step.id === "risk-low") {
    const s = payload.summary;
    return {
      title: "A referência já mostra que edge positivo não elimina períodos difíceis",
      metrics: [
        { label: "Drawdown P95", value: pct(s.maxDrawdownPct.p95) },
        { label: "Saldo P5", value: money(s.finalBalance.p05) },
        { label: "Seq. perdas P95", value: number(s.losingStreak.p95, 0) },
        { label: "Prob. lucro", value: pct(s.probabilityProfitPct) },
      ],
      html: `<p>Com apenas <strong>0,5% de risco por trade</strong>, já existe uma distribuição de drawdowns e sequências de perdas. Isso é normal: expectância positiva descreve uma média de longo prazo, não uma trajetória lisa.</p><p>Guarde o <strong>P95 de drawdown de ${pct(s.maxDrawdownPct.p95)}</strong>. Ele será nossa referência quando aumentarmos o tamanho da posição.</p>`,
    };
  }

  if (step.id === "risk-medium" || step.id === "risk-high") {
    const s = payload.summary;
    const baseline = lessonState.results["risk-low"]?.summary;
    const prior = step.id === "risk-high" ? lessonState.results["risk-medium"]?.summary : baseline;
    const risk = step.config.riskPct;
    const baselineRatio = baseline ? s.maxDrawdownPct.p95 / Math.max(0.0001, baseline.maxDrawdownPct.p95) : NaN;
    const priorDelta = prior ? s.maxDrawdownPct.p95 - prior.maxDrawdownPct.p95 : NaN;
    return {
      title: step.id === "risk-medium"
        ? "O edge ficou igual; o caminho ficou mais agressivo"
        : "Position sizing pode transformar a experiência sem alterar a estratégia",
      metrics: [
        { label: "Risco por trade", value: pct(risk) },
        { label: "Drawdown P95", value: pct(s.maxDrawdownPct.p95) },
        { label: "Aumento vs. etapa anterior", value: Number.isFinite(priorDelta) ? `+${pct(priorDelta)}` : "—" },
        { label: "Saldo P5", value: money(s.finalBalance.p05) },
      ],
      html: `<p>A taxa de acerto e o Reward:Risk não mudaram. Portanto, <strong>a vantagem estatística teórica é a mesma</strong>. O que mudou foi o tamanho financeiro de cada acerto e de cada erro.</p>
      <p>O P95 de drawdown agora é <strong>${pct(s.maxDrawdownPct.p95)}</strong>${Number.isFinite(baselineRatio) ? `, cerca de ${number(baselineRatio, 2)}× o valor da referência de 0,5%` : ""}. A probabilidade de lucro pode permanecer semelhante enquanto a experiência de risco se torna muito mais severa.</p>`,
    };
  }

  if (step.id === "reshuffle") {
    const s = payload.summary;
    const spread = s.finalBalance.p95 - s.finalBalance.p05;
    return {
      title: "O saldo final quase não muda, mas o caminho até ele muda muito",
      metrics: [
        { label: "Faixa P5–P95 saldo", value: money(spread) },
        { label: "Drawdown P50", value: pct(s.maxDrawdownPct.p50) },
        { label: "Drawdown P95", value: pct(s.maxDrawdownPct.p95) },
        { label: "Seq. perdas P95", value: number(s.losingStreak.p95, 0) },
      ],
      html: `<p>No Reshuffle, cada caminho contém <strong>os mesmos trades</strong>. Por isso o saldo final é praticamente o mesmo em todas as simulações — a faixa P5–P95 ficou em ${money(spread)}.</p><p>Mas os drawdowns não são iguais. Esta é a demonstração de <strong>sequence risk</strong>: a ordem dos mesmos resultados altera a pressão sobre a conta e sobre o trader.</p>`,
    };
  }

  if (step.id === "bootstrap") {
    const s = payload.summary;
    const reshuffle = lessonState.results["reshuffle"]?.summary;
    const spread = s.finalBalance.p95 - s.finalBalance.p05;
    const reshuffleSpread = reshuffle ? reshuffle.finalBalance.p95 - reshuffle.finalBalance.p05 : 0;
    return {
      title: "Bootstrap adiciona incerteza sobre quais resultados voltarão a aparecer",
      metrics: [
        { label: "Faixa P5–P95 saldo", value: money(spread) },
        { label: "Faixa no Reshuffle", value: money(reshuffleSpread) },
        { label: "Drawdown P95", value: pct(s.maxDrawdownPct.p95) },
        { label: "Saldo P5", value: money(s.finalBalance.p05) },
      ],
      html: `<p>Agora não mudamos apenas a ordem. Como o sorteio é com reposição, alguns trades aparecem várias vezes e outros desaparecem. Por isso o saldo final passa a formar uma distribuição muito mais ampla.</p><p>Reshuffle estuda principalmente <strong>risco de sequência</strong>; Bootstrap adiciona <strong>incerteza de amostragem</strong>. Eles respondem perguntas diferentes e não devem ser confundidos.</p>`,
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
    const table = `<table class="lesson-comparison"><thead><tr><th>Risco</th><th>Meta antes da violação</th><th>Violação</th><th>DD P95</th></tr></thead><tbody>${rows.map((row) =>
      `<tr><td>${pct(row.risk)}</td><td class="${row.success === bestSuccess ? "best" : ""}">${pct(row.success)}</td><td>${pct(row.breach)}</td><td>${pct(row.dd)}</td></tr>`
    ).join("")}</tbody></table>`;
    const low = rows[0];
    const high = rows[rows.length - 1];
    return {
      title: "Em contas com regras, retorno e sobrevivência precisam ser analisados juntos",
      metrics: [
        { label: "Sucesso 0,5%", value: pct(low.success) },
        { label: "Sucesso 2%", value: pct(high.success) },
        { label: "Violação 0,5%", value: pct(low.breach) },
        { label: "Violação 2%", value: pct(high.breach) },
      ],
      html: `<p>Quando há meta e limites, a pergunta profissional muda: não basta saber se a estratégia tende a ganhar. Precisamos saber se ela consegue <strong>chegar à meta antes de quebrar uma regra</strong>.</p>${table}<p>Não trate o maior percentual da tabela como uma recomendação automática. O objetivo é enxergar o trade-off: mais risco pode acelerar a chegada à meta, mas também pode aumentar a chance de violação.</p>`,
    };
  }

  return { title: "Experimento concluído", metrics: [], html: "" };
}

function updateLessonProgress() {
  const completed = Object.keys(lessonState.results).length;
  const pctDone = Math.round(completed / LESSON_STEPS.length * 100);
  $("lesson-progress-label").textContent = `${completed} de ${LESSON_STEPS.length} experimentos`;
  $("lesson-progress-percent").textContent = `${pctDone}%`;
  $("lesson-progress-bar").style.width = `${pctDone}%`;
}

function finishLesson() {
  const baseline = lessonState.results["risk-low"]?.summary;
  const high = lessonState.results["risk-high"]?.summary;
  const prop = lessonState.results["prop-firm"];
  let summary = "<p>Você concluiu todos os experimentos.</p>";

  if (baseline && high) {
    summary += `<p>Na sua execução, elevar o risco de <strong>0,5% para 2%</strong> levou o P95 do drawdown de <strong>${pct(baseline.maxDrawdownPct.p95)}</strong> para <strong>${pct(high.maxDrawdownPct.p95)}</strong>, sem alterar o edge da estratégia.</p>`;
  }
  if (prop?.comparisons) {
    const rows = prop.comparisons.map(({ risk, result }) => ({
      risk,
      success: result.summary.probabilityTargetBeforeBreachPct,
    }));
    const top = [...rows].sort((a, b) => b.success - a.success)[0];
    summary += `<p>No experimento de prop firm, o maior percentual de meta antes da violação nesta simulação apareceu com <strong>${pct(top.risk)} de risco</strong> (${pct(top.success)}). Isso é um resultado deste conjunto de hipóteses, não uma recomendação universal.</p>`;
  }

  $("lesson-final-summary").innerHTML = summary;
  $("lesson-workspace").classList.add("hidden");
  $("lesson-finish").classList.remove("hidden");
  $("lesson-status").className = "lesson-status done";
  $("lesson-status").textContent = "Concluída";
  updateLessonProgress();
  $("aula-guiada").scrollIntoView({ behavior: "smooth", block: "start" });
}

function numValue(id) {
  const value = Number($(id).value);
  if (!Number.isFinite(value)) throw new Error(`Valor inválido em ${id}.`);
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
    $("trade-data-status").textContent = "Aceita um número por linha ou CSV delimitado por vírgula, ponto e vírgula ou tabulação.";
    return;
  }
  const wins = trades.filter((x) => x > 0).length;
  const losses = trades.filter((x) => x < 0).length;
  $("trade-data-status").textContent = `${trades.length} trades detectados · ${wins} ganhos · ${losses} perdas · média ${money(trades.reduce((a,b) => a+b,0)/trades.length)}`;
}

function renderTradeResults(result, options = {}) {
  const s = result.summary;
  $("results-title").textContent = "Distribuição da estratégia";
  $("run-meta").textContent = `${number(s.simulations, 0)} simulações · semente ${result.config.seed}`;
  $("metric-cards").innerHTML = [
    card("Prob. de lucro", pct(s.probabilityProfitPct), "terminou acima do capital inicial"),
    card("Risco de violação", pct(s.probabilityBreachPct), "ruína, perda máx. ou perda diária"),
    card("Meta antes da violação", pct(s.probabilityTargetBeforeBreachPct), "atingiu a meta primeiro"),
    card("Saldo mediano", money(s.finalBalance.p50), `P5 ${money(s.finalBalance.p05)} · P95 ${money(s.finalBalance.p95)}`),
    card("Drawdown mediano", pct(s.maxDrawdownPct.p50), `P95 ${pct(s.maxDrawdownPct.p95)}`),
    card("Pior DD observado", pct(s.maxDrawdownPct.max), "máximo entre as simulações"),
    card("Seq. perdas P95", number(s.losingStreak.p95, 0), `máximo ${number(s.losingStreak.max, 0)}`),
    result.config.mode === "historical"
      ? card("Win rate da amostra", pct(s.inputWinRatePct), `PF ${Number.isFinite(s.inputProfitFactor) ? number(s.inputProfitFactor) : "∞"}`)
      : card("Expectância", `${number(s.expectedRPerTrade, 3)}R`, `Kelly ${pct(s.kellyFraction * 100)}`),
  ].join("");

  drawPaths($("paths-chart"), result.samplePaths.map((p) => p.equity), { baseline: result.config.startingCapital, yFormatter: compactCurrency });
  $("hist-title").textContent = "Distribuição do saldo final";
  drawHistogram($("hist-chart"), result.distributions.finalBalances, compactCurrency);

  $("percentile-table-wrap").innerHTML = percentileTable(
    "Saldo final",
    ["P5", "P25", "P50", "P75", "P95"],
    [s.finalBalance.p05, s.finalBalance.p25, s.finalBalance.p50, s.finalBalance.p75, s.finalBalance.p95].map(money)
  );

  const ddMessage = s.maxDrawdownPct.p95 > 30
    ? "O P95 de drawdown é elevado; o dimensionamento merece atenção."
    : "O P95 de drawdown está abaixo de 30% nesta configuração, mas ainda depende das hipóteses da amostra.";
  $("interpretation-text").textContent =
    `Em 95% das simulações, o drawdown máximo ficou em até aproximadamente ${pct(s.maxDrawdownPct.p95)}. ` +
    `O saldo final P5 foi ${money(s.finalBalance.p05)} e o P95 foi ${money(s.finalBalance.p95)}. ${ddMessage} ` +
    "Use esses percentis como faixa de stress test, não como promessa de resultado.";

  revealResults(options.scroll !== false);
}

function renderGbmResults(result) {
  const s = result.summary;
  $("results-title").textContent = "Distribuição de preço — GBM";
  $("run-meta").textContent = `${number(s.simulations, 0)} simulações · semente ${result.config.seed}`;
  $("metric-cards").innerHTML = [
    card("Preço mediano", number(s.finalPrice.p50), `retorno ${pct(s.medianReturnPct)}`),
    card("Preço P5", number(s.finalPrice.p05), `retorno ${pct(s.p05ReturnPct)}`),
    card("Preço P95", number(s.finalPrice.p95), `retorno ${pct(s.p95ReturnPct)}`),
    card("Prob. acima do início", pct(s.probabilityAboveStartPct), "preço final > preço inicial"),
    card("VaR empírico 95%", number(s.empiricalVaR95Amount), pct(s.empiricalVaR95Pct)),
  ].join("");

  drawPaths($("paths-chart"), result.samplePaths, { baseline: result.config.startPrice, yFormatter: compactNumber });
  $("hist-title").textContent = "Distribuição do preço final";
  drawHistogram($("hist-chart"), result.distributions.finalPrices, compactNumber);
  $("percentile-table-wrap").innerHTML = percentileTable(
    "Preço final",
    ["P5", "P25", "P50", "P75", "P95"],
    [s.finalPrice.p05, s.finalPrice.p25, s.finalPrice.p50, s.finalPrice.p75, s.finalPrice.p95].map((x) => number(x))
  );
  $("interpretation-text").textContent =
    `Sob as hipóteses de retorno e volatilidade fornecidas, metade das simulações terminou abaixo de ${number(s.finalPrice.p50)} e metade acima. ` +
    `A faixa P5–P95 foi de ${number(s.finalPrice.p05)} a ${number(s.finalPrice.p95)}. GBM não modela saltos, volatilidade variável nem regimes.`;
  revealResults();
}

function revealResults(shouldScroll = true) {
  $("results").classList.remove("hidden");
  if (shouldScroll) $("results").scrollIntoView({ behavior: "smooth", block: "start" });
}

function card(label, value, sub = "") {
  return `<article class="metric"><div class="metric__label">${escapeHtml(label)}</div><div class="metric__value">${escapeHtml(value)}</div><div class="metric__sub">${escapeHtml(sub)}</div></article>`;
}

function percentileTable(label, headers, values) {
  return `<table><thead><tr><th>${escapeHtml(label)}</th>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody><tr><td>Distribuição</td>${values.map((v) => `<td>${escapeHtml(v)}</td>`).join("")}</tr></tbody></table>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[char]));
}

function compactCurrency(value) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", style: "currency", currency: "BRL", maximumFractionDigits: 1 }).format(value);
}

function compactNumber(value) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
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
