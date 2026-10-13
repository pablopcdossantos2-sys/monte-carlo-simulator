import { parsePnlText, runGbmMonteCarlo, runTradeMonteCarlo } from "./core.js";

const $ = (id) => document.getElementById(id);
const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 }).format(value);
const number = (value, digits = 2) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: digits }).format(value);
const pct = (value, digits = 1) => `${number(value, digits)}%`;
let lastResult = null;

document.querySelectorAll(".mode-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mode-btn").forEach((b) => b.classList.toggle("active", b === button));
    const mode = button.dataset.mode;
    $("trades-panel").classList.toggle("hidden", mode !== "trades");
    $("gbm-panel").classList.toggle("hidden", mode !== "gbm");
    $("results").classList.add("hidden");
  });
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
  const sample = [
    185,-110,240,95,-135,310,-105,160,-125,275,-90,205,-145,120,355,-100,
    -115,225,80,-130,290,-95,140,-155,260,105,-120,195,-85,330,-140,175,
    -100,215,-125,300,90,-150,245,-110,155,-95,280,-135,125,340,-105,190,
    -120,235,-90,145,-160,315,-100,180,-115,265,75,-130,220,-105,295,-145
  ];
  const radio = document.querySelector('input[name="trade-source"][value="historical"]');
  radio.checked = true;
  radio.dispatchEvent(new Event("change"));
  $("trade-data").value = "pnl\n" + sample.join("\n");
  $("trades-count").value = sample.length;
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

function renderTradeResults(result) {
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

  revealResults();
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

function revealResults() {
  $("results").classList.remove("hidden");
  $("results").scrollIntoView({ behavior: "smooth", block: "start" });
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
