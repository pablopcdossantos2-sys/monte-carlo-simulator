export function mulberry32(seed = 123456789) {
  let a = Number(seed) >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function normalRandom(rng = Math.random) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function mean(values) {
  if (!values.length) return NaN;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function stdDev(values, sample = false) {
  if (!values.length || (sample && values.length < 2)) return NaN;
  const m = mean(values);
  const divisor = sample ? values.length - 1 : values.length;
  return Math.sqrt(values.reduce((sum, value) => sum + (value - m) ** 2, 0) / divisor);
}

export function percentile(values, p) {
  if (!values.length) return NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const clamped = Math.min(1, Math.max(0, p));
  const index = (sorted.length - 1) * clamped;
  const lo = Math.floor(index);
  const hi = Math.ceil(index);
  if (lo === hi) return sorted[lo];
  const weight = index - lo;
  return sorted[lo] * (1 - weight) + sorted[hi] * weight;
}

export function fisherYates(values, rng = Math.random) {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function maxDrawdown(equity) {
  if (!equity.length) return { amount: 0, percent: 0, peakIndex: 0, troughIndex: 0 };
  let peak = equity[0];
  let peakIndex = 0;
  let bestPeakIndex = 0;
  let troughIndex = 0;
  let maxAmount = 0;
  let maxPercent = 0;

  for (let i = 1; i < equity.length; i += 1) {
    const value = equity[i];
    if (value > peak) {
      peak = value;
      peakIndex = i;
    }
    const amount = Math.max(0, peak - value);
    const percent = peak > 0 ? amount / peak : 0;
    if (percent > maxPercent) {
      maxPercent = percent;
      maxAmount = amount;
      bestPeakIndex = peakIndex;
      troughIndex = i;
    }
  }

  return {
    amount: maxAmount,
    percent: maxPercent,
    peakIndex: bestPeakIndex,
    troughIndex,
  };
}

export function longestLosingStreak(pnls) {
  let current = 0;
  let longest = 0;
  for (const pnl of pnls) {
    if (pnl < 0) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

export function sampleHistoricalTrades(trades, method, count, rng, blockSize = 5) {
  if (!Array.isArray(trades) || trades.length === 0) {
    throw new Error("É necessário fornecer ao menos um trade histórico.");
  }
  const n = Math.max(1, Math.floor(count));

  if (method === "bootstrap") {
    return Array.from({ length: n }, () => trades[Math.floor(rng() * trades.length)]);
  }

  if (method === "block") {
    const result = [];
    const block = Math.max(1, Math.min(trades.length, Math.floor(blockSize)));
    while (result.length < n) {
      const start = Math.floor(rng() * trades.length);
      for (let offset = 0; offset < block && result.length < n; offset += 1) {
        result.push(trades[(start + offset) % trades.length]);
      }
    }
    return result;
  }

  const result = [];
  while (result.length < n) {
    const shuffled = fisherYates(trades, rng);
    const remaining = n - result.length;
    result.push(...shuffled.slice(0, remaining));
  }
  return result;
}

function normalizeRiskRules(rules = {}, startingCapital = 10000) {
  const maxLossPct = Math.max(0, Number(rules.maxLossPct) || 0);
  const dailyLossPct = Math.max(0, Number(rules.dailyLossPct) || 0);
  const targetPct = Math.max(0, Number(rules.targetPct) || 0);
  const ruinThresholdPct = Math.max(0, Number(rules.ruinThresholdPct) || 0);
  const tradesPerDay = Math.max(1, Math.floor(Number(rules.tradesPerDay) || 1));
  const trailingMode = ["none", "static", "intraday", "eod"].includes(rules.trailingMode)
    ? rules.trailingMode
    : "none";

  return {
    maxLossPct,
    dailyLossPct,
    targetPct,
    ruinThresholdPct,
    tradesPerDay,
    trailingMode,
    maxLossAmount: startingCapital * maxLossPct / 100,
    dailyLossAmount: startingCapital * dailyLossPct / 100,
    targetBalance: targetPct > 0 ? startingCapital * (1 + targetPct / 100) : Infinity,
    ruinBalance: ruinThresholdPct > 0 ? startingCapital * (1 - ruinThresholdPct / 100) : -Infinity,
  };
}

function assessPathStep(state, equity, tradeNumber, rules, startingCapital) {
  state.peakIntraday = Math.max(state.peakIntraday, equity);

  if (rules.targetPct > 0 && state.targetHitTrade == null && equity >= rules.targetBalance) {
    state.targetHitTrade = tradeNumber;
  }

  if (rules.ruinThresholdPct > 0 && state.ruinHitTrade == null && equity <= rules.ruinBalance) {
    state.ruinHitTrade = tradeNumber;
    state.breachReason = state.breachReason || "ruin";
  }

  if (rules.maxLossPct > 0) {
    let floor = startingCapital - rules.maxLossAmount;

    if (rules.trailingMode === "intraday") {
      floor = Math.max(floor, state.peakIntraday - rules.maxLossAmount);
    } else if (rules.trailingMode === "eod") {
      floor = Math.max(floor, state.peakEod - rules.maxLossAmount);
    }

    if (equity <= floor && state.lossLimitHitTrade == null) {
      state.lossLimitHitTrade = tradeNumber;
      state.breachReason = state.breachReason || "max-loss";
    }
  }

  if (rules.dailyLossPct > 0 && equity <= state.dayStartEquity - rules.dailyLossAmount && state.dailyLossHitTrade == null) {
    state.dailyLossHitTrade = tradeNumber;
    state.breachReason = state.breachReason || "daily-loss";
  }

  const endOfDay = tradeNumber % rules.tradesPerDay === 0;
  if (endOfDay) {
    state.peakEod = Math.max(state.peakEod, equity);
    state.dayStartEquity = equity;
  }
}

function finalizePath(equity, pnls, state, startingCapital) {
  const dd = maxDrawdown(equity);
  const breached = state.ruinHitTrade != null || state.lossLimitHitTrade != null || state.dailyLossHitTrade != null;
  const targetHit = state.targetHitTrade != null;
  const targetBeforeBreach = targetHit && (!breached || state.targetHitTrade < Math.min(
    state.ruinHitTrade ?? Infinity,
    state.lossLimitHitTrade ?? Infinity,
    state.dailyLossHitTrade ?? Infinity,
  ));

  return {
    equity,
    pnls,
    finalBalance: equity[equity.length - 1],
    returnPct: ((equity[equity.length - 1] / startingCapital) - 1) * 100,
    maxDrawdownAmount: dd.amount,
    maxDrawdownPct: dd.percent * 100,
    longestLosingStreak: longestLosingStreak(pnls),
    targetHit,
    breached,
    targetBeforeBreach,
    targetHitTrade: state.targetHitTrade,
    ruinHitTrade: state.ruinHitTrade,
    lossLimitHitTrade: state.lossLimitHitTrade,
    dailyLossHitTrade: state.dailyLossHitTrade,
    breachReason: state.breachReason,
  };
}

export function simulateTradePath(config, rng) {
  const startingCapital = Math.max(0.01, Number(config.startingCapital) || 10000);
  const count = Math.max(1, Math.floor(Number(config.tradesPerSimulation) || 100));
  const rules = normalizeRiskRules(config.rules, startingCapital);
  const equity = [startingCapital];
  const pnls = [];
  const state = {
    targetHitTrade: null,
    ruinHitTrade: null,
    lossLimitHitTrade: null,
    dailyLossHitTrade: null,
    breachReason: null,
    peakIntraday: startingCapital,
    peakEod: startingCapital,
    dayStartEquity: startingCapital,
  };

  let historicalSequence = null;
  if (config.mode === "historical") {
    historicalSequence = sampleHistoricalTrades(
      config.trades,
      config.method || "bootstrap",
      count,
      rng,
      config.blockSize || 5,
    );
  }

  for (let i = 0; i < count; i += 1) {
    const currentEquity = equity[equity.length - 1];
    let pnl;

    if (config.mode === "historical") {
      pnl = Number(historicalSequence[i]) || 0;
      const scale = Number(config.historicalScale);
      if (Number.isFinite(scale) && scale > 0) pnl *= scale;
      pnl -= Math.max(0, Number(config.costPerTrade) || 0);
    } else {
      const winRate = Math.min(1, Math.max(0, (Number(config.winRatePct) || 0) / 100));
      const rewardRisk = Math.max(0, Number(config.rewardRisk) || 0);
      const riskPct = Math.max(0, Number(config.riskPct) || 0) / 100;
      const riskBase = config.positionSizing === "fixed"
        ? startingCapital
        : Math.max(0, currentEquity);
      const riskAmount = riskBase * riskPct;
      const gross = rng() < winRate ? riskAmount * rewardRisk : -riskAmount;
      pnl = gross - Math.max(0, Number(config.costPerTrade) || 0);
    }

    let nextEquity = currentEquity + pnl;
    if (!Number.isFinite(nextEquity)) nextEquity = 0;
    nextEquity = Math.max(0, nextEquity);
    pnl = nextEquity - currentEquity;

    pnls.push(pnl);
    equity.push(nextEquity);
    assessPathStep(state, nextEquity, i + 1, rules, startingCapital);

    if (nextEquity <= 0) {
      if (state.ruinHitTrade == null) state.ruinHitTrade = i + 1;
      state.breachReason = state.breachReason || "account-zero";
      for (let j = i + 1; j < count; j += 1) {
        pnls.push(0);
        equity.push(0);
      }
      break;
    }
  }

  return finalizePath(equity, pnls, state, startingCapital);
}

function buildTradeSummary(paths, config) {
  const finals = paths.map((path) => path.finalBalance);
  const returns = paths.map((path) => path.returnPct);
  const dds = paths.map((path) => path.maxDrawdownPct);
  const streaks = paths.map((path) => path.longestLosingStreak);
  const start = Number(config.startingCapital) || 10000;

  const summary = {
    simulations: paths.length,
    probabilityProfitPct: 100 * paths.filter((p) => p.finalBalance > start).length / paths.length,
    probabilityBreachPct: 100 * paths.filter((p) => p.breached).length / paths.length,
    probabilityTargetPct: 100 * paths.filter((p) => p.targetHit).length / paths.length,
    probabilityTargetBeforeBreachPct: 100 * paths.filter((p) => p.targetBeforeBreach).length / paths.length,
    finalBalance: {
      p05: percentile(finals, 0.05),
      p25: percentile(finals, 0.25),
      p50: percentile(finals, 0.50),
      p75: percentile(finals, 0.75),
      p95: percentile(finals, 0.95),
      min: Math.min(...finals),
      max: Math.max(...finals),
      mean: mean(finals),
    },
    returnPct: {
      p05: percentile(returns, 0.05),
      p50: percentile(returns, 0.50),
      p95: percentile(returns, 0.95),
      mean: mean(returns),
    },
    maxDrawdownPct: {
      p50: percentile(dds, 0.50),
      p90: percentile(dds, 0.90),
      p95: percentile(dds, 0.95),
      max: Math.max(...dds),
    },
    losingStreak: {
      p50: percentile(streaks, 0.50),
      p90: percentile(streaks, 0.90),
      p95: percentile(streaks, 0.95),
      max: Math.max(...streaks),
    },
  };

  if (config.mode === "historical") {
    summary.inputExpectancy = mean(config.trades);
    summary.inputStdDev = stdDev(config.trades, true);
    const grossProfit = config.trades.filter((x) => x > 0).reduce((a, b) => a + b, 0);
    const grossLoss = Math.abs(config.trades.filter((x) => x < 0).reduce((a, b) => a + b, 0));
    summary.inputProfitFactor = grossLoss > 0 ? grossProfit / grossLoss : Infinity;
    summary.inputWinRatePct = 100 * config.trades.filter((x) => x > 0).length / config.trades.length;
  } else {
    const wr = Math.min(1, Math.max(0, (Number(config.winRatePct) || 0) / 100));
    const rr = Math.max(0, Number(config.rewardRisk) || 0);
    summary.expectedRPerTrade = wr * rr - (1 - wr);
    summary.kellyFraction = rr > 0 ? Math.max(0, wr - (1 - wr) / rr) : 0;
  }

  return summary;
}

export function runTradeMonteCarlo(config) {
  const simulations = Math.max(1, Math.min(50000, Math.floor(Number(config.simulations) || 1000)));
  const seed = Number.isFinite(Number(config.seed)) ? Number(config.seed) : 42;
  const rng = mulberry32(seed);
  const paths = [];
  for (let i = 0; i < simulations; i += 1) {
    paths.push(simulateTradePath(config, rng));
  }

  const summary = buildTradeSummary(paths, config);
  const byFinal = [...paths].sort((a, b) => a.finalBalance - b.finalBalance);
  const sampleCount = Math.min(60, paths.length);
  const samplePaths = [];
  if (sampleCount === 1) {
    samplePaths.push(byFinal[0]);
  } else {
    for (let i = 0; i < sampleCount; i += 1) {
      const idx = Math.round(i * (byFinal.length - 1) / (sampleCount - 1));
      samplePaths.push(byFinal[idx]);
    }
  }

  return {
    type: "trades",
    config: structuredCloneSafe(config),
    summary,
    distributions: {
      finalBalances: paths.map((p) => p.finalBalance),
      maxDrawdownsPct: paths.map((p) => p.maxDrawdownPct),
      losingStreaks: paths.map((p) => p.longestLosingStreak),
    },
    samplePaths,
  };
}

export function simulateGbmPath(config, rng) {
  const startPrice = Math.max(0.0000001, Number(config.startPrice) || 100);
  const annualReturn = (Number(config.annualReturnPct) || 0) / 100;
  const annualVol = Math.max(0, Number(config.annualVolPct) || 0) / 100;
  const steps = Math.max(1, Math.floor(Number(config.steps) || 252));
  const stepsPerYear = Math.max(1, Number(config.stepsPerYear) || 252);
  const dt = 1 / stepsPerYear;
  const path = [startPrice];
  let price = startPrice;

  for (let i = 0; i < steps; i += 1) {
    const shock = normalRandom(rng);
    price *= Math.exp((annualReturn - 0.5 * annualVol ** 2) * dt + annualVol * Math.sqrt(dt) * shock);
    path.push(price);
  }
  return path;
}

export function runGbmMonteCarlo(config) {
  const simulations = Math.max(1, Math.min(50000, Math.floor(Number(config.simulations) || 1000)));
  const seed = Number.isFinite(Number(config.seed)) ? Number(config.seed) : 42;
  const rng = mulberry32(seed);
  const startPrice = Math.max(0.0000001, Number(config.startPrice) || 100);
  const paths = [];
  const finals = [];

  for (let i = 0; i < simulations; i += 1) {
    const path = simulateGbmPath(config, rng);
    paths.push(path);
    finals.push(path[path.length - 1]);
  }

  const sorted = [...paths].sort((a, b) => a[a.length - 1] - b[b.length - 1]);
  const sampleCount = Math.min(60, sorted.length);
  const samplePaths = [];
  if (sampleCount === 1) {
    samplePaths.push(sorted[0]);
  } else {
    for (let i = 0; i < sampleCount; i += 1) {
      const idx = Math.round(i * (sorted.length - 1) / (sampleCount - 1));
      samplePaths.push(sorted[idx]);
    }
  }

  const p05 = percentile(finals, 0.05);
  const p50 = percentile(finals, 0.50);
  const p95 = percentile(finals, 0.95);

  return {
    type: "gbm",
    config: structuredCloneSafe(config),
    summary: {
      simulations,
      probabilityAboveStartPct: 100 * finals.filter((x) => x > startPrice).length / finals.length,
      finalPrice: {
        p05,
        p25: percentile(finals, 0.25),
        p50,
        p75: percentile(finals, 0.75),
        p95,
        min: Math.min(...finals),
        max: Math.max(...finals),
        mean: mean(finals),
      },
      empiricalVaR95Amount: Math.max(0, startPrice - p05),
      empiricalVaR95Pct: Math.max(0, (1 - p05 / startPrice) * 100),
      medianReturnPct: (p50 / startPrice - 1) * 100,
      p05ReturnPct: (p05 / startPrice - 1) * 100,
      p95ReturnPct: (p95 / startPrice - 1) * 100,
    },
    distributions: {
      finalPrices: finals,
    },
    samplePaths,
  };
}

export function parsePnlText(text) {
  const raw = String(text || "").trim();
  if (!raw) return [];

  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const looksLikeSingleBrazilianNumbers =
    !/[A-Za-zÀ-ÿ]/.test(lines[0]) &&
    lines.every((line) => /^[-+]?\\s*(?:R\\$\\s*)?\\d{1,3}(?:\\.\\d{3})*,\\d+\\s*$|^[-+]?\\s*(?:R\\$\\s*)?\\d+,\\d+\\s*$/.test(line));

  let delimiter = null;
  if (!looksLikeSingleBrazilianNumbers) {
    if (lines[0].includes(";")) delimiter = ";";
    else if (lines[0].includes("\\t")) delimiter = "\\t";
    else if (lines[0].includes(",")) delimiter = ",";
    else {
      const delimiters = [",", ";", "\\t"];
      const scoreDelimiter = (candidate) => lines.slice(0, 5).reduce((score, line) => score + (line.split(candidate).length - 1), 0);
      delimiter = delimiters.sort((a, b) => scoreDelimiter(b) - scoreDelimiter(a))[0];
      if (scoreDelimiter(delimiter) === 0) delimiter = null;
    }
  }

  const normalizedNumber = (value) => {
    let s = String(value).trim().replace(/[R$€£%\s]/g, "");
    const negativeByParens = /^\(.*\)$/.test(s);
    s = s.replace(/[()]/g, "");
    if (s.includes(",") && s.includes(".")) {
      if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
        s = s.replace(/\./g, "").replace(",", ".");
      } else {
        s = s.replace(/,/g, "");
      }
    } else if (s.includes(",") && !s.includes(".")) {
      const parts = s.split(",");
      s = parts.length === 2 && parts[1].length <= 2 ? parts.join(".") : parts.join("");
    }
    const n = Number(s);
    return Number.isFinite(n) ? (negativeByParens ? -Math.abs(n) : n) : NaN;
  };

  if (!delimiter) {
    return lines.map(normalizedNumber).filter(Number.isFinite);
  }

  const rows = lines.map((line) => line.split(delimiter).map((cell) => cell.trim()));
  const header = rows[0].map((cell) => cell.toLowerCase());
  const aliases = ["pnl", "p&l", "profit", "net profit", "netprofit", "resultado", "lucro", "result", "pl"];
  let column = header.findIndex((cell) => aliases.some((alias) => cell === alias || cell.includes(alias)));
  let startRow = column >= 0 ? 1 : 0;

  if (column < 0) {
    const width = Math.max(...rows.map((row) => row.length));
    let bestColumn = 0;
    let bestCount = -1;
    for (let c = 0; c < width; c += 1) {
      const count = rows.reduce((acc, row) => acc + (Number.isFinite(normalizedNumber(row[c] ?? "")) ? 1 : 0), 0);
      if (count > bestCount || (count === bestCount && c > bestColumn)) {
        bestCount = count;
        bestColumn = c;
      }
    }
    column = bestColumn;
  }

  return rows.slice(startRow)
    .map((row) => normalizedNumber(row[column] ?? ""))
    .filter(Number.isFinite);
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
