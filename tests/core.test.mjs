import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  longestLosingStreak,
  maxDrawdown,
  mulberry32,
  parsePnlText,
  percentile,
  runGbmMonteCarlo,
  runTradeMonteCarlo,
  sampleHistoricalTrades,
} from "../core.js";

test("seeded RNG is reproducible", () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  const seqA = Array.from({ length: 8 }, () => a());
  const seqB = Array.from({ length: 8 }, () => b());
  assert.deepEqual(seqA, seqB);
});

test("percentile interpolates correctly", () => {
  assert.equal(percentile([0, 10], 0.5), 5);
  assert.equal(percentile([1, 2, 3, 4, 5], 0.5), 3);
});

test("max drawdown uses peak-to-trough decline", () => {
  const dd = maxDrawdown([100, 120, 90, 110, 80, 130]);
  assert.equal(dd.amount, 40);
  assert.ok(Math.abs(dd.percent - 1 / 3) < 1e-12);
});

test("longest losing streak counts consecutive negative trades", () => {
  assert.equal(longestLosingStreak([1, -1, -2, -3, 4, -1]), 3);
});

test("reshuffle keeps the same trades when horizon equals sample size", () => {
  const source = [1, 2, 3, 4, 5];
  const sampled = sampleHistoricalTrades(source, "reshuffle", source.length, mulberry32(7));
  assert.deepEqual([...sampled].sort((a,b) => a-b), source);
});

test("P&L parser reads a simple CSV", () => {
  const values = parsePnlText("date,pnl\n2026-01-01,120.5\n2026-01-02,-75");
  assert.deepEqual(values, [120.5, -75]);
});

test("P&L parser reads semicolon CSV with Brazilian decimal comma", () => {
  const values = parsePnlText("data;resultado\n01/01/2026;120,50\n02/01/2026;-75,25");
  assert.deepEqual(values, [120.5, -75.25]);
});

test("parametric trade Monte Carlo is reproducible", () => {
  const config = {
    mode: "parameters",
    startingCapital: 10000,
    winRatePct: 55,
    rewardRisk: 1.5,
    riskPct: 1,
    positionSizing: "fixed",
    costPerTrade: 0,
    tradesPerSimulation: 50,
    simulations: 200,
    seed: 123,
    rules: {
      targetPct: 8,
      maxLossPct: 10,
      dailyLossPct: 4,
      ruinThresholdPct: 50,
      tradesPerDay: 5,
      trailingMode: "static",
    },
  };
  const a = runTradeMonteCarlo(config);
  const b = runTradeMonteCarlo(config);
  assert.deepEqual(a.summary, b.summary);
  assert.equal(a.summary.simulations, 200);
  assert.ok(a.summary.finalBalance.p05 <= a.summary.finalBalance.p50);
  assert.ok(a.summary.finalBalance.p50 <= a.summary.finalBalance.p95);
});

test("historical Monte Carlo returns expected distribution sizes", () => {
  const result = runTradeMonteCarlo({
    mode: "historical",
    trades: [100, -50, 125, -80, 60],
    startingCapital: 5000,
    method: "bootstrap",
    blockSize: 2,
    historicalScale: 1,
    costPerTrade: 0,
    tradesPerSimulation: 20,
    simulations: 150,
    seed: 9,
    rules: {
      targetPct: 0,
      maxLossPct: 0,
      dailyLossPct: 0,
      ruinThresholdPct: 0,
      tradesPerDay: 5,
      trailingMode: "none",
    },
  });
  assert.equal(result.distributions.finalBalances.length, 150);
  assert.equal(result.distributions.maxDrawdownsPct.length, 150);
  assert.equal(result.samplePaths[0].equity.length, 21);
});

test("GBM with zero volatility follows deterministic drift", () => {
  const result = runGbmMonteCarlo({
    startPrice: 100,
    annualReturnPct: 10,
    annualVolPct: 0,
    steps: 252,
    stepsPerYear: 252,
    simulations: 50,
    seed: 4,
  });
  const expected = 100 * Math.exp(0.10);
  assert.ok(Math.abs(result.summary.finalPrice.p50 - expected) < 1e-9);
  assert.equal(result.summary.finalPrice.p05, result.summary.finalPrice.p95);
});


test("web interface includes the six-step guided lesson", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const app = fs.readFileSync("app.js", "utf8");
  assert.match(html, /id="aula-guiada"/);
  assert.match(html, /id="lesson-start"/);
  assert.match(html, /id="lesson-analysis"/);
  assert.match(app, /const LESSON_STEPS = \[/);
  assert.match(app, /id: "prop-firm"/);
  assert.match(app, /riskPct: 0\.5/);
});

test("offline build is self-contained and includes educational onboarding", () => {
  const html = fs.readFileSync("offline.html", "utf8");
  assert.match(html, /VERSÃO OFFLINE/);
  assert.match(html, /id="aprender"/);
  assert.match(html, /id="aula-guiada"/);
  assert.match(html, /id="lesson-start"/);
  assert.match(html, /id="trades-panel"/);
  assert.doesNotMatch(html, /type="module"/);
  assert.doesNotMatch(html, /from\s+["']\.\/core\.js["']/);
});
