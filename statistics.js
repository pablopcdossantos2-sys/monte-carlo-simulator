const stats$ = (id) => document.getElementById(id);
const statsLocale = () => window.I18N?.getLanguage?.() || "pt-BR";
const statsPick = (pt, en, es) => statsLocale() === "en" ? en : statsLocale() === "es" ? es : pt;
const statsFmt = (value, digits = 2) => new Intl.NumberFormat(statsLocale(), { maximumFractionDigits: digits }).format(value);
const statsPct = (value, digits = 1) => `${statsFmt(value, digits)}%`;
const statsEsc = (value) => String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));

const statsState = {
  conditional: { shareA: 40, winA: 60, winB: 35 },
  variance: {
    a: { winRate: 70, win: 0.714, loss: 1 },
    b: { winRate: 35, win: 2.429, loss: 1 },
    trades: 100,
    simulations: 4000,
    seed: 3107,
  },
  dependence: { lossRate: 55, cluster: 65, trades: 200, simulations: 1500, seed: 90210 },
  regression: { winRate: 45, candidates: 100, sample: 20, followup: 200, seed: 77123 },
};

function statsRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function statsQuantile(values, q) {
  if (!values.length) return NaN;
  const sorted = [...values].sort((a,b) => a-b);
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

function statsRead(id, fallback) {
  const n = Number(stats$(id)?.value);
  return Number.isFinite(n) ? n : fallback;
}

function statsField(id, label, value, min, max, step) {
  return `<label>${statsEsc(label)}<input id="${id}" type="number" value="${value}" min="${min}" max="${max}" step="${step}"></label>`;
}

function statsArticle(number, title, lead, body) {
  return `<details class="concept-article stats-article">
    <summary><span class="concept-number">${number}</span><span><strong>${statsEsc(title)}</strong><small>${statsEsc(lead)}</small></span></summary>
    <div class="concept-article__body">${body}</div>
  </details>`;
}

function statsConditionalArticle() {
  return statsArticle(
    "05",
    statsPick("Probabilidade condicional e contexto", "Conditional probability and context", "Probabilidad condicional y contexto"),
    statsPick("A probabilidade pode mudar quando o contexto muda.", "Probability can change when context changes.", "La probabilidad puede cambiar cuando cambia el contexto."),
    statsPick(
      `<p>Uma taxa de acerto global pode esconder comportamentos muito diferentes. Uma estratégia pode funcionar melhor em tendência e pior em range, melhor na abertura e pior no meio do dia, ou vice-versa.</p>
      <div class="formula-box">P(vitória) = P(A) × P(vitória|A) + P(B) × P(vitória|B)</div>
      <p>O símbolo <strong>|</strong> significa “dado que”. Assim, P(vitória|A) é a probabilidade de vitória <em>dado que</em> o contexto A está presente.</p>
      <p>Isso muda a pergunta do trader. Em vez de “qual é meu win rate?”, passa a ser “qual é meu win rate <strong>neste contexto</strong>?”.</p>
      <p><strong>Conexão com Monte Carlo:</strong> se regimes diferentes possuem distribuições diferentes, uma única probabilidade fixa pode ser simplista. Simulações por regime ou reamostragem que preserve blocos podem ser mais informativas.</p>`,
      `<p>An overall win rate can hide very different behaviors. A strategy may work better in trends and worse in ranges, better at the open and worse midday, or vice versa.</p>
      <div class="formula-box">P(win) = P(A) × P(win|A) + P(B) × P(win|B)</div>
      <p>The symbol <strong>|</strong> means “given that”. So P(win|A) is the probability of a win <em>given that</em> context A is present.</p>
      <p>This changes the trader's question from “what is my win rate?” to “what is my win rate <strong>in this context</strong>?”.</p>
      <p><strong>Monte Carlo connection:</strong> if regimes have different distributions, one fixed probability may be too simple. Regime-aware simulations or block-preserving resampling can be more informative.</p>`,
      `<p>Una tasa de acierto global puede ocultar comportamientos muy distintos. Una estrategia puede funcionar mejor en tendencia y peor en rango, mejor en la apertura y peor al mediodía, o al revés.</p>
      <div class="formula-box">P(victoria) = P(A) × P(victoria|A) + P(B) × P(victoria|B)</div>
      <p>El símbolo <strong>|</strong> significa “dado que”. Así, P(victoria|A) es la probabilidad de victoria <em>dado que</em> el contexto A está presente.</p>
      <p>Esto cambia la pregunta del trader: de “¿cuál es mi win rate?” a “¿cuál es mi win rate <strong>en este contexto</strong>?”.</p>
      <p><strong>Conexión con Monte Carlo:</strong> si los regímenes tienen distribuciones distintas, una probabilidad fija puede ser demasiado simple. Simulaciones por régimen o remuestreo que preserve bloques pueden ser más informativos.</p>`
    )
  );
}

function statsVarianceArticle() {
  return statsArticle(
    "06",
    statsPick("Variância e desvio-padrão", "Variance and standard deviation", "Varianza y desviación estándar"),
    statsPick("A mesma média pode esconder riscos muito diferentes.", "The same average can hide very different risks.", "La misma media puede ocultar riesgos muy distintos."),
    statsPick(
      `<p>A expectativa matemática mede o centro da distribuição. A <strong>variância</strong> mede quanto os resultados se espalham ao redor desse centro; o <strong>desvio-padrão</strong> é a raiz quadrada da variância e volta à mesma unidade do resultado.</p>
      <div class="formula-box">Var(R) = Σ pᵢ × (Rᵢ − E[R])²</div>
      <p>Duas estratégias podem ter E[R] = +0,20R e ainda produzir experiências muito diferentes. Uma pode ganhar com frequência e pouco; outra pode perder frequentemente e compensar com ganhos grandes.</p>
      <p><strong>Conexão com Monte Carlo:</strong> Monte Carlo transforma essa dispersão por trade em dispersão de caminhos, saldos finais, drawdowns e losing streaks.</p>`,
      `<p>Expectancy measures the center of a distribution. <strong>Variance</strong> measures how widely outcomes spread around that center; <strong>standard deviation</strong> is the square root of variance and returns to the same unit as the outcome.</p>
      <div class="formula-box">Var(R) = Σ pᵢ × (Rᵢ − E[R])²</div>
      <p>Two strategies can both have E[R] = +0.20R and still feel completely different. One may win often and small; another may lose often and compensate with large wins.</p>
      <p><strong>Monte Carlo connection:</strong> Monte Carlo turns per-trade dispersion into dispersion of paths, final balances, drawdowns and losing streaks.</p>`,
      `<p>La expectativa mide el centro de una distribución. La <strong>varianza</strong> mide cuánto se dispersan los resultados alrededor de ese centro; la <strong>desviación estándar</strong> es la raíz cuadrada de la varianza y vuelve a la misma unidad del resultado.</p>
      <div class="formula-box">Var(R) = Σ pᵢ × (Rᵢ − E[R])²</div>
      <p>Dos estrategias pueden tener E[R] = +0,20R y aun producir experiencias muy distintas. Una puede ganar frecuentemente y poco; otra perder a menudo y compensar con grandes ganancias.</p>
      <p><strong>Conexión con Monte Carlo:</strong> Monte Carlo transforma la dispersión por trade en dispersión de trayectorias, saldos finales, drawdowns y rachas de pérdidas.</p>`
    )
  );
}

function statsDependenceArticle() {
  return statsArticle(
    "07",
    statsPick("Independência, dependência e clusters", "Independence, dependence and clustering", "Independencia, dependencia y clusters"),
    statsPick("Perdas podem se agrupar mesmo sem mudar a taxa média.", "Losses can cluster even when the average loss rate stays the same.", "Las pérdidas pueden agruparse aunque la tasa media no cambie."),
    statsPick(
      `<p>O modelo mais simples assume que o resultado do próximo trade não depende do anterior. Isso é <strong>independência</strong>. Mas mercados podem apresentar regimes e persistência: condições ruins para uma estratégia podem durar vários trades.</p>
      <div class="formula-box">independência: P(perda|perda anterior) = P(perda)</div>
      <p>Se P(perda|perda anterior) for maior que a taxa média de perdas, surgem <strong>clusters</strong>. O número total de perdas pode ser semelhante, mas as sequências consecutivas podem ficar maiores.</p>
      <p><strong>Conexão com Monte Carlo:</strong> um bootstrap simples pode quebrar essa estrutura. O block bootstrap existe justamente para preservar parte da dependência local observada.</p>`,
      `<p>The simplest model assumes the next trade does not depend on the previous one. That is <strong>independence</strong>. But markets can exhibit regimes and persistence: unfavorable conditions for a strategy may last several trades.</p>
      <div class="formula-box">independence: P(loss|previous loss) = P(loss)</div>
      <p>If P(loss|previous loss) is above the average loss rate, <strong>clusters</strong> emerge. The total number of losses can be similar while consecutive losing streaks become longer.</p>
      <p><strong>Monte Carlo connection:</strong> simple bootstrap can break this structure. Block bootstrap exists precisely to preserve part of the observed local dependence.</p>`,
      `<p>El modelo más simple supone que el resultado del próximo trade no depende del anterior. Eso es <strong>independencia</strong>. Pero los mercados pueden presentar regímenes y persistencia: condiciones desfavorables para una estrategia pueden durar varios trades.</p>
      <div class="formula-box">independencia: P(pérdida|pérdida anterior) = P(pérdida)</div>
      <p>Si P(pérdida|pérdida anterior) supera la tasa media de pérdidas, aparecen <strong>clusters</strong>. El número total de pérdidas puede ser similar, pero las rachas consecutivas pueden ser mayores.</p>
      <p><strong>Conexión con Monte Carlo:</strong> un bootstrap simple puede romper esta estructura. El block bootstrap existe precisamente para preservar parte de la dependencia local observada.</p>`
    )
  );
}

function statsRegressionArticle() {
  return statsArticle(
    "08",
    statsPick("Lei dos Grandes Números e regressão à média", "Law of Large Numbers and regression to the mean", "Ley de los Grandes Números y regresión a la media"),
    statsPick("Resultados extremos de amostras pequenas costumam parecer menos extremos depois.", "Extreme small-sample results often look less extreme later.", "Los resultados extremos de muestras pequeñas suelen verse menos extremos después."),
    statsPick(
      `<p>A Lei dos Grandes Números ajuda a entender por que médias observadas tendem a se aproximar da média teórica conforme a amostra cresce, se o processo permanecer comparável.</p>
      <p>A <strong>regressão à média</strong> aparece quando selecionamos um resultado extremo influenciado por sorte e depois observamos uma nova amostra. O desempenho seguinte tende a ser menos extremo, mesmo sem qualquer mudança real no processo.</p>
      <p>No trading isso é crucial: escolher a “melhor” estratégia entre dezenas de backtests curtos pode selecionar, em parte, a estratégia que teve mais sorte.</p>
      <div class="formula-box">seleção pelo melhor resultado histórico ≠ prova do melhor edge</div>
      <p><strong>Conexão com Monte Carlo:</strong> repetir a seleção em milhares de amostras ajuda a medir quanto do “melhor resultado” pode surgir apenas da variabilidade e do número de alternativas testadas.</p>`,
      `<p>The Law of Large Numbers helps explain why observed averages tend to approach the theoretical mean as sample size grows, if the process remains comparable.</p>
      <p><strong>Regression to the mean</strong> appears when we select an extreme result influenced by luck and then observe a new sample. The next result tends to be less extreme even if the underlying process did not change.</p>
      <p>This matters greatly in trading: choosing the “best” strategy among dozens of short backtests can partly mean choosing the strategy that got the luckiest.</p>
      <div class="formula-box">selecting the best historical result ≠ proof of the best edge</div>
      <p><strong>Monte Carlo connection:</strong> repeating this selection across thousands of samples helps estimate how much of the “best result” can arise from variability and the number of alternatives tested.</p>`,
      `<p>La Ley de los Grandes Números ayuda a entender por qué las medias observadas tienden a acercarse a la media teórica cuando crece la muestra, si el proceso sigue siendo comparable.</p>
      <p>La <strong>regresión a la media</strong> aparece cuando seleccionamos un resultado extremo influido por suerte y después observamos una nueva muestra. El rendimiento posterior tiende a ser menos extremo incluso sin cambios reales en el proceso.</p>
      <p>En trading esto es crucial: elegir la “mejor” estrategia entre decenas de backtests cortos puede significar, en parte, elegir la estrategia que tuvo más suerte.</p>
      <div class="formula-box">seleccionar el mejor resultado histórico ≠ prueba del mejor edge</div>
      <p><strong>Conexión con Monte Carlo:</strong> repetir esta selección en miles de muestras ayuda a medir cuánto del “mejor resultado” puede surgir solo de la variabilidad y del número de alternativas probadas.</p>`
    )
  );
}

function statsConditionalTool() {
  const s = statsState.conditional;
  return `<article class="edu-tool">
    <div class="edu-tool__head"><span class="tool-number">05</span><div><h4>${statsEsc(statsPick("Calculadora de Probabilidade Condicional", "Conditional Probability Calculator", "Calculadora de Probabilidad Condicional"))}</h4><p>${statsEsc(statsPick("Veja como o contexto altera a taxa global e use Bayes para inverter a pergunta.", "See how context changes the overall rate and use Bayes to reverse the question.", "Observa cómo el contexto cambia la tasa global y usa Bayes para invertir la pregunta."))}</p></div></div>
    <div class="edu-form cols-3">
      ${statsField("stats-cond-share", statsPick("Trades no contexto A (%)","Trades in context A (%)","Trades en contexto A (%)"), s.shareA, 0, 100, 0.1)}
      ${statsField("stats-cond-a", statsPick("Win rate no contexto A (%)","Win rate in context A (%)","Win rate en contexto A (%)"), s.winA, 0, 100, 0.1)}
      ${statsField("stats-cond-b", statsPick("Win rate no contexto B (%)","Win rate in context B (%)","Win rate en contexto B (%)"), s.winB, 0, 100, 0.1)}
    </div>
    <div id="stats-cond-results" class="edu-results"></div>
    <div id="stats-cond-explain" class="edu-explain"></div>
  </article>`;
}

function statsVarianceTool() {
  const s = statsState.variance;
  return `<article class="edu-tool edu-tool--wide">
    <div class="edu-tool__head"><span class="tool-number">06</span><div><h4>${statsEsc(statsPick("Mesma Expectância, Dispersão Diferente", "Same Expectancy, Different Dispersion", "Misma Expectativa, Distinta Dispersión"))}</h4><p>${statsEsc(statsPick("Compare duas estratégias e simule a distribuição de R acumulado.", "Compare two strategies and simulate the distribution of cumulative R.", "Compara dos estrategias y simula la distribución de R acumulado."))}</p></div></div>
    <div class="stats-strategy-grid">
      <div class="stats-strategy-box">
        <strong>${statsEsc(statsPick("Estratégia A","Strategy A","Estrategia A"))}</strong>
        <div class="edu-form cols-3">
          ${statsField("stats-var-a-rate","Win rate (%)",s.a.winRate,0,100,0.1)}
          ${statsField("stats-var-a-win",statsPick("Ganho (R)","Win (R)","Ganancia (R)"),s.a.win,0,20,0.001)}
          ${statsField("stats-var-a-loss",statsPick("Perda (R)","Loss (R)","Pérdida (R)"),s.a.loss,0.001,20,0.001)}
        </div>
      </div>
      <div class="stats-strategy-box">
        <strong>${statsEsc(statsPick("Estratégia B","Strategy B","Estrategia B"))}</strong>
        <div class="edu-form cols-3">
          ${statsField("stats-var-b-rate","Win rate (%)",s.b.winRate,0,100,0.1)}
          ${statsField("stats-var-b-win",statsPick("Ganho (R)","Win (R)","Ganancia (R)"),s.b.win,0,20,0.001)}
          ${statsField("stats-var-b-loss",statsPick("Perda (R)","Loss (R)","Pérdida (R)"),s.b.loss,0.001,20,0.001)}
        </div>
      </div>
    </div>
    <div class="edu-form cols-3">
      ${statsField("stats-var-trades",statsPick("Trades por caminho","Trades per path","Trades por trayectoria"),s.trades,10,1000,10)}
      ${statsField("stats-var-sims",statsPick("Simulações","Simulations","Simulaciones"),s.simulations,500,10000,500)}
      ${statsField("stats-var-seed",statsPick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions"><button id="stats-var-run" class="primary">${statsEsc(statsPick("Comparar distribuições", "Compare distributions", "Comparar distribuciones"))}</button></div>
    <div id="stats-var-results" class="stats-compare-results"></div>
    <div id="stats-var-explain" class="edu-explain"></div>
  </article>`;
}

function statsDependenceTool() {
  const s=statsState.dependence;
  return `<article class="edu-tool edu-tool--wide">
    <div class="edu-tool__head"><span class="tool-number">07</span><div><h4>${statsEsc(statsPick("Laboratório de Clusters de Perdas", "Loss Clustering Lab", "Laboratorio de Clusters de Pérdidas"))}</h4><p>${statsEsc(statsPick("Mantenha a mesma taxa média de perdas e altere apenas a dependência entre trades.", "Keep the same average loss rate and change only dependence between trades.", "Mantén la misma tasa media de pérdidas y cambia solo la dependencia entre trades."))}</p></div></div>
    <div class="edu-form cols-3">
      ${statsField("stats-dep-loss",statsPick("Taxa média de perdas (%)","Average loss rate (%)","Tasa media de pérdidas (%)"),s.lossRate,1,99,0.1)}
      ${statsField("stats-dep-cluster",statsPick("Intensidade do cluster (%)","Clustering intensity (%)","Intensidad del cluster (%)"),s.cluster,0,95,1)}
      ${statsField("stats-dep-trades",statsPick("Trades por sequência","Trades per sequence","Trades por secuencia"),s.trades,20,1000,10)}
      ${statsField("stats-dep-sims",statsPick("Sequências simuladas","Simulated sequences","Secuencias simuladas"),s.simulations,200,5000,100)}
      ${statsField("stats-dep-seed",statsPick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions"><button id="stats-dep-run" class="primary">${statsEsc(statsPick("Comparar independência e cluster", "Compare independence and clustering", "Comparar independencia y cluster"))}</button></div>
    <div id="stats-dep-results" class="stats-compare-results"></div>
    <div class="stats-sequence-wrap">
      <div><strong>${statsEsc(statsPick("Exemplo independente","Independent example","Ejemplo independiente"))}</strong><div id="stats-dep-seq-i" class="stats-sequence"></div></div>
      <div><strong>${statsEsc(statsPick("Exemplo com cluster","Clustered example","Ejemplo con cluster"))}</strong><div id="stats-dep-seq-c" class="stats-sequence"></div></div>
    </div>
    <div id="stats-dep-explain" class="edu-explain"></div>
  </article>`;
}

function statsRegressionTool() {
  const s=statsState.regression;
  return `<article class="edu-tool edu-tool--wide">
    <div class="edu-tool__head"><span class="tool-number">08</span><div><h4>${statsEsc(statsPick("Laboratório de Regressão à Média", "Regression-to-the-Mean Lab", "Laboratorio de Regresión a la Media"))}</h4><p>${statsEsc(statsPick("Crie muitas estratégias idênticas, escolha a campeã de uma amostra curta e veja o que acontece depois.", "Create many identical strategies, select the short-sample champion and see what happens next.", "Crea muchas estrategias idénticas, elige la campeona de una muestra corta y observa qué ocurre después."))}</p></div></div>
    <div class="edu-form cols-3">
      ${statsField("stats-reg-rate",statsPick("Probabilidade verdadeira (%)","Underlying win probability (%)","Probabilidad verdadera (%)"),s.winRate,1,99,0.1)}
      ${statsField("stats-reg-candidates",statsPick("Estratégias candidatas","Candidate strategies","Estrategias candidatas"),s.candidates,5,500,5)}
      ${statsField("stats-reg-sample",statsPick("Trades no teste inicial","Trades in initial test","Trades en prueba inicial"),s.sample,5,200,5)}
      ${statsField("stats-reg-follow",statsPick("Trades no teste seguinte","Trades in follow-up","Trades en prueba posterior"),s.followup,20,1000,10)}
      ${statsField("stats-reg-seed",statsPick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions"><button id="stats-reg-run" class="primary">${statsEsc(statsPick("Selecionar a campeã e testar novamente", "Select champion and retest", "Seleccionar campeona y volver a probar"))}</button></div>
    <div id="stats-reg-results" class="edu-results"></div>
    <div id="stats-reg-table"></div>
    <div id="stats-reg-explain" class="edu-explain"></div>
  </article>`;
}

function renderStatisticsLab() {
  const root=stats$("statistics-root");
  if(!root) return;
  root.innerHTML=`
    <div class="education-head">
      <div>
        <p class="eyebrow">${statsEsc(statsPick("ESTATÍSTICA APLICADA AO TRADING", "APPLIED STATISTICS FOR TRADING", "ESTADÍSTICA APLICADA AL TRADING"))}</p>
        <h2>${statsEsc(statsPick("Contexto, Dispersão, Dependência e Regressão à Média", "Context, Dispersion, Dependence and Regression to the Mean", "Contexto, Dispersión, Dependencia y Regresión a la Media"))}</h2>
        <p class="section-explain">${statsEsc(statsPick(
          "Este segundo bloco vai além da probabilidade fixa. Ele mostra por que o contexto importa, por que médias iguais não significam o mesmo risco e como a seleção de resultados extremos pode enganar.",
          "This second block goes beyond fixed probability. It shows why context matters, why equal averages do not imply equal risk, and how selecting extreme results can mislead.",
          "Este segundo bloque va más allá de la probabilidad fija. Muestra por qué importa el contexto, por qué medias iguales no implican el mismo riesgo y cómo seleccionar resultados extremos puede engañar."
        ))}</p>
      </div>
      <div class="education-path">
        <span>5 · ${statsEsc(statsPick("Condicional","Conditional","Condicional"))}</span>
        <span>6 · ${statsEsc(statsPick("Variância","Variance","Varianza"))}</span>
        <span>7 · ${statsEsc(statsPick("Dependência","Dependence","Dependencia"))}</span>
        <span>8 · ${statsEsc(statsPick("Regressão","Regression","Regresión"))}</span>
      </div>
    </div>
    <div class="article-grid">
      ${statsConditionalArticle()}
      ${statsVarianceArticle()}
      ${statsDependenceArticle()}
      ${statsRegressionArticle()}
    </div>
    <div class="education-tools-intro">
      <p class="eyebrow">${statsEsc(statsPick("LABORATÓRIOS", "LABS", "LABORATORIOS"))}</p>
      <h3>${statsEsc(statsPick("Da fórmula à intuição estatística", "From formula to statistical intuition", "De la fórmula a la intuición estadística"))}</h3>
    </div>
    <div class="education-tools">
      ${statsConditionalTool()}
      ${statsVarianceTool()}
      ${statsDependenceTool()}
      ${statsRegressionTool()}
    </div>
  `;
  statsBind();
  statsUpdateConditional();
  statsRunVariance();
  statsRunDependence();
  statsRunRegression();
}

function statsBind(){
  ["stats-cond-share","stats-cond-a","stats-cond-b"].forEach(id=>stats$(id)?.addEventListener("input",statsUpdateConditional));
  stats$("stats-var-run")?.addEventListener("click",statsRunVariance);
  stats$("stats-dep-run")?.addEventListener("click",statsRunDependence);
  stats$("stats-reg-run")?.addEventListener("click",statsRunRegression);
}

function statsMetricGrid(items){
  return items.map(([l,v])=>`<div><span>${statsEsc(l)}</span><strong>${statsEsc(v)}</strong></div>`).join("");
}

function statsUpdateConditional(){
  const share=Math.min(100,Math.max(0,statsRead("stats-cond-share",40)))/100;
  const a=Math.min(100,Math.max(0,statsRead("stats-cond-a",60)))/100;
  const b=Math.min(100,Math.max(0,statsRead("stats-cond-b",35)))/100;
  statsState.conditional={shareA:share*100,winA:a*100,winB:b*100};
  const overall=share*a+(1-share)*b;
  const pAGivenWin=overall>0?share*a/overall:0;
  const loss=1-overall;
  const pAGivenLoss=loss>0?share*(1-a)/loss:0;
  stats$("stats-cond-results").innerHTML=statsMetricGrid([
    [statsPick("Win rate global","Overall win rate","Win rate global"),statsPct(overall*100,1)],
    [statsPick("P(A | vitória)","P(A | win)","P(A | victoria)"),statsPct(pAGivenWin*100,1)],
    [statsPick("P(A | perda)","P(A | loss)","P(A | pérdida)"),statsPct(pAGivenLoss*100,1)],
    [statsPick("Diferença A − B","Difference A − B","Diferencia A − B"),`${statsFmt((a-b)*100,1)} p.p.`],
  ]);
  stats$("stats-cond-explain").innerHTML=statsPick(
    `Embora o contexto A represente <strong>${statsPct(share*100,1)}</strong> dos trades, ele responde por <strong>${statsPct(pAGivenWin*100,1)}</strong> das vitórias. A média global de <strong>${statsPct(overall*100,1)}</strong> mistura dois contextos diferentes.`,
    `Although context A represents <strong>${statsPct(share*100,1)}</strong> of trades, it accounts for <strong>${statsPct(pAGivenWin*100,1)}</strong> of wins. The overall rate of <strong>${statsPct(overall*100,1)}</strong> mixes two different contexts.`,
    `Aunque el contexto A representa <strong>${statsPct(share*100,1)}</strong> de los trades, explica <strong>${statsPct(pAGivenWin*100,1)}</strong> de las victorias. La tasa global de <strong>${statsPct(overall*100,1)}</strong> mezcla dos contextos distintos.`
  );
}

function statsStrategyMoments(ratePct,win,loss){
  const p=Math.min(1,Math.max(0,ratePct/100)), q=1-p;
  const mean=p*win-q*loss;
  const variance=p*Math.pow(win-mean,2)+q*Math.pow(-loss-mean,2);
  return {p,mean,variance,sd:Math.sqrt(variance)};
}

function statsSimTotals(config,trades,simulations,rng){
  const totals=[];
  for(let s=0;s<simulations;s++){
    let total=0;
    for(let i=0;i<trades;i++) total += rng()<config.p ? config.win : -config.loss;
    totals.push(total);
  }
  return totals;
}

function statsRunVariance(){
  const A={
    rate:Math.min(100,Math.max(0,statsRead("stats-var-a-rate",70))),
    win:Math.max(0,statsRead("stats-var-a-win",0.714)),
    loss:Math.max(.001,statsRead("stats-var-a-loss",1)),
  };
  const B={
    rate:Math.min(100,Math.max(0,statsRead("stats-var-b-rate",35))),
    win:Math.max(0,statsRead("stats-var-b-win",2.429)),
    loss:Math.max(.001,statsRead("stats-var-b-loss",1)),
  };
  const trades=Math.min(1000,Math.max(10,Math.floor(statsRead("stats-var-trades",100))));
  const sims=Math.min(10000,Math.max(500,Math.floor(statsRead("stats-var-sims",4000))));
  const seed=Math.max(1,Math.floor(statsRead("stats-var-seed",3107)));
  const ma=statsStrategyMoments(A.rate,A.win,A.loss), mb=statsStrategyMoments(B.rate,B.win,B.loss);
  const rngA=statsRng(seed), rngB=statsRng(seed+991);
  const ta=statsSimTotals({...ma,win:A.win,loss:A.loss},trades,sims,rngA);
  const tb=statsSimTotals({...mb,win:B.win,loss:B.loss},trades,sims,rngB);
  const row=(name,m,t)=>`<div class="stats-result-card"><strong>${statsEsc(name)}</strong>
    <div class="edu-results">
      ${statsMetricGrid([
        ["E[R]",`${m.mean>=0?"+":""}${statsFmt(m.mean,3)}R`],
        [statsPick("Desvio-padrão/trade","Std. dev./trade","Desv. estándar/trade"),`${statsFmt(m.sd,3)}R`],
        ["P5",`${statsFmt(statsQuantile(t,.05),1)}R`],
        ["P50",`${statsFmt(statsQuantile(t,.50),1)}R`],
        ["P95",`${statsFmt(statsQuantile(t,.95),1)}R`],
        [statsPick("Caminhos negativos","Negative paths","Trayectorias negativas"),statsPct(t.filter(v=>v<0).length/t.length*100,1)],
      ])}
    </div></div>`;
  stats$("stats-var-results").innerHTML=row(statsPick("Estratégia A","Strategy A","Estrategia A"),ma,ta)+row(statsPick("Estratégia B","Strategy B","Estrategia B"),mb,tb);
  const same=Math.abs(ma.mean-mb.mean)<.01;
  stats$("stats-var-explain").innerHTML=statsPick(
    `${same?"As duas estratégias têm expectâncias praticamente iguais. ":""}O desvio-padrão por trade é <strong>${statsFmt(ma.sd,3)}R</strong> em A e <strong>${statsFmt(mb.sd,3)}R</strong> em B. Em ${trades} trades, essa diferença aparece nos percentis da distribuição acumulada. Média igual não implica risco igual.`,
    `${same?"The two strategies have almost identical expectancy. ":""}Per-trade standard deviation is <strong>${statsFmt(ma.sd,3)}R</strong> for A and <strong>${statsFmt(mb.sd,3)}R</strong> for B. Over ${trades} trades, that difference appears in cumulative-distribution percentiles. Equal mean does not imply equal risk.`,
    `${same?"Las dos estrategias tienen expectativas prácticamente iguales. ":""}La desviación estándar por trade es <strong>${statsFmt(ma.sd,3)}R</strong> en A y <strong>${statsFmt(mb.sd,3)}R</strong> en B. En ${trades} trades, esa diferencia aparece en los percentiles de la distribución acumulada. Misma media no implica mismo riesgo.`
  );
}

function statsLongestLoss(seq){
  let best=0,cur=0;
  for(const loss of seq){ if(loss){cur++;best=Math.max(best,cur);} else cur=0; }
  return best;
}

function statsIndependentSequence(n,pLoss,rng){
  return Array.from({length:n},()=>rng()<pLoss);
}

function statsClusteredSequence(n,pLoss,intensity,rng){
  const a=pLoss+intensity*(1-pLoss);
  const b=pLoss*(1-intensity);
  const seq=[];
  let prev=rng()<pLoss;
  seq.push(prev);
  for(let i=1;i<n;i++){
    const p=prev?a:b;
    prev=rng()<p;
    seq.push(prev);
  }
  return {seq,pLossAfterLoss:a,pLossAfterWin:b};
}

function statsSequenceHtml(seq){
  return seq.slice(0,100).map(loss=>`<span class="${loss?"loss":"win"}" title="${loss?statsPick("Perda","Loss","Pérdida"):statsPick("Vitória","Win","Victoria")}"></span>`).join("");
}

function statsRunDependence(){
  const pLoss=Math.min(.99,Math.max(.01,statsRead("stats-dep-loss",55)/100));
  const intensity=Math.min(.95,Math.max(0,statsRead("stats-dep-cluster",65)/100));
  const trades=Math.min(1000,Math.max(20,Math.floor(statsRead("stats-dep-trades",200))));
  const sims=Math.min(5000,Math.max(200,Math.floor(statsRead("stats-dep-sims",1500))));
  const seed=Math.max(1,Math.floor(statsRead("stats-dep-seed",90210)));
  const rngI=statsRng(seed), rngC=statsRng(seed+1337);
  const streakI=[],streakC=[];
  let exampleI=null,exampleC=null,meta=null;
  for(let s=0;s<sims;s++){
    const iSeq=statsIndependentSequence(trades,pLoss,rngI);
    const cObj=statsClusteredSequence(trades,pLoss,intensity,rngC);
    if(s===0){exampleI=iSeq;exampleC=cObj.seq;meta=cObj;}
    streakI.push(statsLongestLoss(iSeq));streakC.push(statsLongestLoss(cObj.seq));
  }
  const card=(name,arr)=>`<div class="stats-result-card"><strong>${statsEsc(name)}</strong><div class="edu-results">${statsMetricGrid([
    [statsPick("Streak P50","P50 streak","Racha P50"),statsFmt(statsQuantile(arr,.5),0)],
    [statsPick("Streak P95","P95 streak","Racha P95"),statsFmt(statsQuantile(arr,.95),0)],
    [statsPick("Pior observado","Worst observed","Peor observado"),statsFmt(Math.max(...arr),0)],
  ])}</div></div>`;
  stats$("stats-dep-results").innerHTML=card(statsPick("Trades independentes","Independent trades","Trades independientes"),streakI)+card(statsPick("Mesmo loss rate, com clusters","Same loss rate, clustered","Mismo loss rate, con clusters"),streakC);
  stats$("stats-dep-seq-i").innerHTML=statsSequenceHtml(exampleI);
  stats$("stats-dep-seq-c").innerHTML=statsSequenceHtml(exampleC);
  stats$("stats-dep-explain").innerHTML=statsPick(
    `Nos dois modelos, a taxa estacionária de perdas é aproximadamente <strong>${statsPct(pLoss*100,1)}</strong>. No modelo com cluster, P(perda | perda anterior) sobe para <strong>${statsPct(meta.pLossAfterLoss*100,1)}</strong>. O P95 da maior losing streak passou de <strong>${statsFmt(statsQuantile(streakI,.95),0)}</strong> para <strong>${statsFmt(statsQuantile(streakC,.95),0)}</strong>. É por isso que dependência serial pode tornar o risco de sequência muito maior sem alterar a taxa média de perdas.`,
    `Both models have a stationary loss rate of about <strong>${statsPct(pLoss*100,1)}</strong>. In the clustered model, P(loss | previous loss) rises to <strong>${statsPct(meta.pLossAfterLoss*100,1)}</strong>. P95 longest losing streak moved from <strong>${statsFmt(statsQuantile(streakI,.95),0)}</strong> to <strong>${statsFmt(statsQuantile(streakC,.95),0)}</strong>. Serial dependence can therefore greatly increase sequence risk without changing the average loss rate.`,
    `Ambos modelos tienen una tasa estacionaria de pérdidas de aproximadamente <strong>${statsPct(pLoss*100,1)}</strong>. En el modelo con clusters, P(pérdida | pérdida anterior) sube a <strong>${statsPct(meta.pLossAfterLoss*100,1)}</strong>. El P95 de la racha máxima pasó de <strong>${statsFmt(statsQuantile(streakI,.95),0)}</strong> a <strong>${statsFmt(statsQuantile(streakC,.95),0)}</strong>. La dependencia serial puede aumentar mucho el riesgo de secuencia sin cambiar la tasa media de pérdidas.`
  );
}

function statsWins(n,p,rng){
  let wins=0;
  for(let i=0;i<n;i++) if(rng()<p) wins++;
  return wins;
}

function statsRunRegression(){
  const p=Math.min(.99,Math.max(.01,statsRead("stats-reg-rate",45)/100));
  const candidates=Math.min(500,Math.max(5,Math.floor(statsRead("stats-reg-candidates",100))));
  const sample=Math.min(200,Math.max(5,Math.floor(statsRead("stats-reg-sample",20))));
  const follow=Math.min(1000,Math.max(20,Math.floor(statsRead("stats-reg-follow",200))));
  const seed=Math.max(1,Math.floor(statsRead("stats-reg-seed",77123)));
  const rng=statsRng(seed);
  const rows=[];
  for(let i=0;i<candidates;i++){
    const w1=statsWins(sample,p,rng);
    const w2=statsWins(follow,p,rng);
    rows.push({id:i+1,w1,w2,r1:w1/sample,r2:w2/follow,total:(w1+w2)/(sample+follow)});
  }
  rows.sort((a,b)=>b.r1-a.r1 || a.id-b.id);
  const champion=rows[0];
  const avgInitial=rows.reduce((sum,r)=>sum+r.r1,0)/rows.length;
  stats$("stats-reg-results").innerHTML=statsMetricGrid([
    [statsPick("Probabilidade verdadeira","Underlying probability","Probabilidad verdadera"),statsPct(p*100,1)],
    [statsPick("Campeã no teste inicial","Initial-test champion","Campeona en prueba inicial"),statsPct(champion.r1*100,1)],
    [statsPick("Mesma campeã no teste seguinte","Same champion in follow-up","Misma campeona en prueba posterior"),statsPct(champion.r2*100,1)],
    [statsPick("Taxa combinada","Combined rate","Tasa combinada"),statsPct(champion.total*100,1)],
  ]);
  const top=rows.slice(0,5);
  stats$("stats-reg-table").innerHTML=`<div class="table-scroll"><table class="lesson-comparison"><thead><tr>
    <th>#</th><th>${statsEsc(statsPick("Teste inicial","Initial test","Prueba inicial"))}</th><th>${statsEsc(statsPick("Teste seguinte","Follow-up","Prueba posterior"))}</th><th>${statsEsc(statsPick("Combinado","Combined","Combinado"))}</th>
  </tr></thead><tbody>${top.map((r,idx)=>`<tr><td>${idx+1}</td><td>${statsPct(r.r1*100,1)}</td><td>${statsPct(r.r2*100,1)}</td><td>${statsPct(r.total*100,1)}</td></tr>`).join("")}</tbody></table></div>`;
  const diff=(champion.r1-champion.r2)*100;
  stats$("stats-reg-explain").innerHTML=statsPick(
    `Todas as ${candidates} “estratégias” tinham exatamente a mesma probabilidade verdadeira de <strong>${statsPct(p*100,1)}</strong>. Mesmo assim, ao escolher a melhor entre apenas ${sample} trades, encontramos uma campeã com <strong>${statsPct(champion.r1*100,1)}</strong>. Nos ${follow} trades seguintes ela marcou <strong>${statsPct(champion.r2*100,1)}</strong>, uma queda de ${statsFmt(diff,1)} p.p. Isso ilustra regressão à média e o perigo de selecionar sistemas apenas pelo melhor backtest curto. A média inicial de todas as candidatas foi ${statsPct(avgInitial*100,1)}.`,
    `All ${candidates} “strategies” had exactly the same underlying win probability of <strong>${statsPct(p*100,1)}</strong>. Yet selecting the best after only ${sample} trades produced a champion at <strong>${statsPct(champion.r1*100,1)}</strong>. Over the next ${follow} trades it recorded <strong>${statsPct(champion.r2*100,1)}</strong>, a drop of ${statsFmt(diff,1)} percentage points. This illustrates regression to the mean and the danger of selecting systems only by the best short backtest. The average initial rate across all candidates was ${statsPct(avgInitial*100,1)}.`,
    `Las ${candidates} “estrategias” tenían exactamente la misma probabilidad verdadera de <strong>${statsPct(p*100,1)}</strong>. Aun así, al elegir la mejor tras solo ${sample} trades apareció una campeona con <strong>${statsPct(champion.r1*100,1)}</strong>. En los ${follow} trades siguientes registró <strong>${statsPct(champion.r2*100,1)}</strong>, una caída de ${statsFmt(diff,1)} p.p. Esto ilustra regresión a la media y el peligro de seleccionar sistemas solo por el mejor backtest corto. La tasa inicial media de todas las candidatas fue ${statsPct(avgInitial*100,1)}.`
  );
}

document.addEventListener("i18n:change",renderStatisticsLab);
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",renderStatisticsLab,{once:true});
else renderStatisticsLab();
