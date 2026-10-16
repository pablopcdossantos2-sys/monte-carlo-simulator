*Leia isto em outros idiomas: [Português](README.md)*

---

**Additional version:** [Español](README_ES.md)

# Monte Carlo and Statistics Simulator for Day Trading

A free, client-side web application built exclusively for **day traders**. It studies probability, expectancy, session P&L, drawdown, risk of ruin, validation, trading costs, overtrading, prop-firm rules and Monte Carlo while assuming positions are opened and closed within the same trading session.

> Educational project. Simulations are not forecasts and do not constitute financial advice.

## 👤 Authorship and development

Client-side educational web application and statistical simulator developed independently by Pablo Phillipe Cândido dos Santos to support the study of probability, mathematical expectancy, risk, and variability in day-trading strategies. The tool combines Monte Carlo simulations, trade and session analysis, interactive statistics labs, and strategy-validation resources, all running locally in the browser.

Generative AI tools were used as auxiliary resources during development. Responsibility for the project’s conception, implementation, integration, and verification remains with the author.

Currículo Lattes: [http://lattes.cnpq.br/9500873674712528](http://lattes.cnpq.br/9500873674712528)
## Ways to use it

The project is deliberately designed for two environments:

- **GitHub Pages** — web version, no backend and no installation;
- **Local PC** — open `offline.html` with a double click, with no terminal, Python or Node.js required.

The development version can also be served locally for anyone who wants to modify the code.

As long as the main engine can remain 100% client-side, **GitHub Pages will remain the official web mode**. Future features that require credentials, databases, heavy processing or private APIs should remain optional or local-only instead of breaking the static version.

## Educational goal

The tool was not built only to draw equity curves. It is meant to teach **day traders** to think in trade and session distributions, survival, expectancy, drawdown, variability, costs and statistical evidence quality.

A central lesson is:

> a strategy may have a statistical edge and still go through difficult sequences; risk management determines whether the account can survive long enough for that edge to have a chance to appear.

The application contains two educational tracks:

1. **Guided practical lesson** — six experiments on drawdown, risk per trade, Reshuffle, Bootstrap and prop-firm rules. Each experiment begins with a prediction challenge. See [docs/AULA-PRATICA-GUIADA.md](docs/AULA-PRATICA-GUIADA.md).
2. **Intermediate lesson** — six experiments on win rate, payoff, expectancy, risk of ruin and Kelly. It demonstrates, among other things, how a 70% win rate can still have negative expectancy and how a 35% win rate can have a positive edge. See [docs/AULA-INTERMEDIARIA.md](docs/AULA-INTERMEDIARIA.md).

## Scope: day trading only

The project assumes all positions are closed within the same trading session. It is not designed around swing trading, position trading or buy-and-hold. General statistical concepts still apply, but examples and new tools are prioritized for intraday trading.

The analysis hierarchy is:

    trade → session → week → session distribution → Monte Carlo

## Objectives

The project combines two families of Monte Carlo use:

1. **Strategy robustness** — trade reshuffling and resampling, equity-curve distributions, drawdown, losing streaks, probability of profit, risk of ruin, and probability of reaching a target before breaching configured limits.
2. **Price paths** — GBM simulation from an initial price, expected return, and annualized volatility.

All simulations run locally in the browser. Data pasted or imported by the user is not sent to a server.
## Main capabilities

- Parameter input: starting capital, win rate, reward:risk, risk per trade, costs and number of trades.
- Historical input: P&L list or CSV with detection of common result columns.
- Trade Monte Carlo methods:
  - reshuffle / permutation without replacement;
  - bootstrap with replacement;
  - block bootstrap to preserve part of local serial dependence.
- Fixed or compounded position sizing.
- Optional prop-firm / evaluation rules:
  - profit target;
  - static maximum loss;
  - intraday or EOD trailing drawdown;
  - daily loss limit;
  - approximate trades per day.
- Metrics:
  - probability of profit;
  - risk of ruin / breach;
  - probability of reaching a target;
  - probability of reaching the target before a breach;
  - final balance P5/P25/P50/P75/P95;
  - median and P95 maximum drawdown;
  - worst observed drawdown;
  - maximum losing streak.
- GBM price simulation with final-price distributions and empirical VaR.
- Seeded RNG for reproducible results.
- JSON summary export.
- Responsive interface suitable for GitHub Pages.
- Three-language interface: **Português (Brasil), English and Español**.
- Learning lab on **Probability, Mathematical Expectancy and Monte Carlo**, with four integrated articles:
  - probability in trading;
  - mathematical expectancy in R;
  - sample size, variance and convergence;
  - the connection between expectancy and Monte Carlo simulation.
- Interactive learning tools:
  - expectancy and break-even win-rate calculator;
  - binomial win distribution;
  - visual win-rate convergence lab;
  - mini Monte Carlo that turns theoretical expectancy into a distribution of outcomes.
- Second **Applied Statistics for Trading** lab covering:
  - conditional probability and market context;
  - variance and standard deviation;
  - independence versus serial dependence;
  - loss clustering;
  - Law of Large Numbers;
  - regression to the mean and misleading backtest selection.
- Additional tools:
  - conditional probability calculator;
  - same-expectancy / different-dispersion comparison;
  - serial-dependence losing-streak lab;
  - regression-to-the-mean lab that selects the best of many identical samples.
- Third lab on **Distributions and Uncertainty**:
  - R-return distributions;
  - rare events and tail risk;
  - skewness and dispersion;
  - Bayesian win-rate updating;
  - posterior distribution and credible interval;
  - predictive Monte Carlo with parameter uncertainty.
- Fourth **Strategy Validation** lab covering:
  - win-rate confidence intervals and sample size;
  - multiple testing, data snooping and overfitting;
  - in-sample versus out-of-sample;
  - walk-forward under regime change;
  - parameter stability, plateaus and narrow spikes.
- Validation tools:
  - Wilson interval and approximate sample-size estimator;
  - Monte Carlo simulation of the “champion” selected among many configurations;
  - walk-forward lab with three configurations and two regimes;
  - synthetic parameter-stability map.
- Fifth **Day-Trading Session Statistics** lab covering:
  - daily/session P&L and probability of a positive session;
  - P5/P50/P95 session outcomes;
  - losing-day streaks and negative weeks;
  - drawdown duration measured in sessions;
  - expectancy by time window;
  - overtrading by ordinal trade number;
  - MFE, MAE and capture efficiency;
  - daily stop and giveback;
  - costs and slippage in R;
  - bootstrap of historical sessions.
- Intraday tools:
  - session-level Monte Carlo;
  - expectancy-by-time comparison;
  - overtrading deterioration simulator;
  - MFE/MAE lab;
  - same-sequence comparison of no daily stop vs daily stop;
  - cost erosion calculator;
  - bootstrap where each resampled unit is a full trading session;
  - **Heads or Tails: Stop, Gain and Expectancy** lab, which deliberately holds probability at 50/50 to separate uncontrollable next-outcome uncertainty from controllable risk, payoff, costs and execution structure.
- Guided practical lesson with six experiments on risk, drawdown, sequence risk and prop-firm rules.
- Intermediate lesson with six experiments covering:
  - win rate versus payoff;
  - expectancy in R;
  - equal expectancy with different path distributions;
  - risk of ruin under different sizing levels;
  - critical interpretation of the Kelly fraction.
- Prediction challenges before each experiment.
- Educational interpretations generated from the actual numerical outputs of each simulation.
- Automated tests for the mathematical engine.

## Quick start

### Option 1 — GitHub Pages

The web version is available at:

    https://pablopcdossantos2-sys.github.io/monte-carlo-simulator/

### Option 2 — Local use without a terminal

Download `offline.html` and open it with a double click. It is a complete single-file version and does not require Python or Node.js.

See [docs/USO-LOCAL.md](docs/USO-LOCAL.md).

### Option 3 — Full local project for development

With Python 3:

    python -m http.server 8000

Then open:

    http://localhost:8000

For local tests with Node.js 20+:

    npm test

A sample CSV is available at `examples/trades.csv`.

## Project structure

- `index.html` — GitHub Pages interface.
- `offline.html` — self-contained local version.
- `styles.css` — styles.
- `i18n.js` — PT-BR / English / Spanish localization.
- `app.js` — main interface, charts and introductory lesson.
- `intermediate.js` — intermediate lesson.
- `education.js` — articles and interactive tools for probability, expectancy, sampling and Monte Carlo.
- `statistics.js` — applied-statistics lab for context, dispersion, dependence and regression to the mean.
- `inference.js` — distributions, tail risk and Bayesian-updating lab.
- `validation.js` — validation, overfitting, OOS, walk-forward and parameter-stability lab.
- `daytrade.js` — intraday statistics, session P&L, overtrading, daily stops, costs and session-bootstrap lab.
- `core.js` — statistical and Monte Carlo engine with no DOM dependency.
- `tests/core.test.mjs` — automated tests.
- `docs/METHODOLOGY.md` — methodology, assumptions, limitations and references.
- `docs/GUIA-DIDATICO.md` — beginner educational guide.
- `docs/AULA-PRATICA-GUIADA.md` — introductory guided-lesson syllabus.
- `docs/AULA-INTERMEDIARIA.md` — second-lesson syllabus on expectancy, payoff, ruin and Kelly.
- `docs/ESTATISTICA-APLICADA-AO-TRADING.md` — guide to conditional probability, variance, serial dependence, the Law of Large Numbers and regression to the mean.
- `docs/VALIDACAO-DE-ESTRATEGIAS.md` — guide to sample size, multiple testing, OOS, walk-forward and parameter robustness.
- `docs/ESTATISTICA-DA-SESSAO-DAY-TRADE.md` — guide to daily P&L, losing days, time windows, MFE/MAE, overtrading, daily stops, giveback, costs and session-level Monte Carlo.
- `docs/USO-LOCAL.md` — local-use instructions for users unfamiliar with the terminal.
- `docs/GITHUB-PAGES.md` — GitHub Pages publishing guide.
- `.github/workflows/tests.yml` — CI tests.

## Methodological principles

The simulator avoids treating a single historical equity curve as a deterministic future. It generates distributions and separates methods with different purposes:

- **Reshuffle** asks mainly: “How much does the order of the same trades change drawdown and losing streaks?”
- **Bootstrap** asks: “What happens if the future is another sample from the observed empirical distribution?”
- **Block bootstrap** attempts to preserve local dependence.
- **Parametric mode** asks: “What happens under an explicit win-rate, payoff and sizing hypothesis?”
- **GBM** is a simplified price model and does not by itself represent jumps, fat tails, changing volatility or market regimes.

Read `docs/METHODOLOGY.md` before interpreting percentiles as forecasts.

## Sources of inspiration and license

The implementation in this repository is original. Projects and tools listed as references were used to survey features and concepts, not to copy proprietary engines, interfaces or datasets.

Concepts studied include GBM and historical-data use, VaR, trade reshuffling/resampling, Kelly, costs, drawdown distributions, prop-firm rules, MFE/MAE and regimes, and fully browser-based execution.

The public T58 repository states that its actual engine is proprietary, so only high-level concepts were considered. T58 Market Data also warns about restrictions on redistributing third-party data; no dataset from that source is included here.

See `docs/METHODOLOGY.md` for the full reference matrix.
## Disclaimer

Backtests and Monte Carlo results depend on the quality and representativeness of the input assumptions and data. Monte Carlo does not fix overfitting, selection bias, omitted costs, regime changes, execution problems, liquidity constraints or errors in the original backtest.

## License

MIT.
