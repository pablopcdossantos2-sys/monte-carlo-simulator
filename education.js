import { runTradeMonteCarlo } from "./core.js";

const $e = (id) => document.getElementById(id);
const eduLocale = () => window.I18N?.getLanguage?.() || "pt-BR";
const pick = (pt, en, es) => eduLocale() === "en" ? en : eduLocale() === "es" ? es : pt;
const fmt = (value, digits = 2) => new Intl.NumberFormat(eduLocale(), { maximumFractionDigits: digits }).format(value);
const pct = (value, digits = 1) => `${fmt(value, digits)}%`;
const esc = (value) => String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));

const eduState = {
  expectancy: { winRate: 45, avgWin: 1.5, avgLoss: 1, costR: 0, trades: 100 },
  binomial: { winRate: 45, trades: 20, targetWins: 10 },
  convergence: { trueWinRate: 45, trades: 300, seed: 2026 },
  monteCarlo: { winRate: 45, rewardRisk: 1.5, riskPct: 1, trades: 200, simulations: 2500, seed: 2026 },
};

function renderEducation() {
  const root = $e("education-root");
  if (!root) return;
  root.innerHTML = `
    <div class="education-head">
      <div>
        <p class="eyebrow">${esc(pick("BASE MATEMÁTICA DO TRADING", "MATHEMATICAL FOUNDATIONS OF TRADING", "BASE MATEMÁTICA DEL TRADING"))}</p>
        <h2>${esc(pick("Probabilidade, Expectativa Matemática e Monte Carlo", "Probability, Mathematical Expectancy and Monte Carlo", "Probabilidad, Expectativa Matemática y Monte Carlo"))}</h2>
        <p class="section-explain">${esc(pick(
          "Esta seção foi criada para quem ainda não se sente confortável com estatística. Primeiro leia os artigos curtos; depois altere os números nas ferramentas e observe como as conclusões mudam.",
          "This section is for people who are not yet comfortable with statistics. Read the short articles first, then change the numbers in the tools and observe how the conclusions change.",
          "Esta sección fue creada para quien todavía no se siente cómodo con estadística. Primero lee los artículos breves; después cambia los números en las herramientas y observa cómo cambian las conclusiones."
        ))}</p>
      </div>
      <div class="education-path">
        <span>1 · ${esc(pick("Probabilidade", "Probability", "Probabilidad"))}</span>
        <span>2 · ${esc(pick("Expectância", "Expectancy", "Expectativa"))}</span>
        <span>3 · ${esc(pick("Amostra", "Sample", "Muestra"))}</span>
        <span>4 · Monte Carlo</span>
      </div>
    </div>

    <div class="article-grid">
      ${articleProbability()}
      ${articleExpectancy()}
      ${articleSample()}
      ${articleMonteCarlo()}
    </div>

    <div class="education-tools-intro">
      <p class="eyebrow">${esc(pick("FERRAMENTAS DIDÁTICAS", "LEARNING TOOLS", "HERRAMIENTAS DIDÁCTICAS"))}</p>
      <h3>${esc(pick("Mude os números e veja a matemática acontecer", "Change the numbers and watch the mathematics happen", "Cambia los números y observa cómo actúa la matemática"))}</h3>
    </div>

    <div class="education-tools">
      ${expectancyTool()}
      ${binomialTool()}
      ${convergenceTool()}
      ${monteCarloBridge()}
    </div>
  `;

  bindEducation();
  updateExpectancy();
  updateBinomial();
  updateConvergence();
  updateMonteCarloLabels();
}

function articleShell(number, title, lead, body) {
  return `<details class="concept-article">
    <summary><span class="concept-number">${number}</span><span><strong>${esc(title)}</strong><small>${esc(lead)}</small></span></summary>
    <div class="concept-article__body">${body}</div>
  </details>`;
}

function articleProbability() {
  return articleShell(
    "01",
    pick("Probabilidade no trading", "Probability in trading", "Probabilidad en trading"),
    pick("Probabilidade não diz o que vai acontecer no próximo trade.", "Probability does not tell you what will happen on the next trade.", "La probabilidad no dice qué ocurrirá en el próximo trade."),
    pick(
      `<p>Quando dizemos que uma estratégia possui <strong>45% de taxa de acerto</strong>, não estamos dizendo que a cada 100 trades exatamente 45 serão vencedores, nem que depois de algumas perdas “está na hora” de vir um ganho.</p>
      <p>Estamos descrevendo uma <strong>frequência de longo prazo sob determinadas condições</strong>. Em amostras pequenas, os resultados observados podem ficar bem distantes dessa taxa.</p>
      <div class="formula-box">P(vitória) = 0,45 &nbsp; e &nbsp; P(perda) = 0,55</div>
      <p>Se os trades forem tratados como independentes, cinco perdas consecutivas em uma posição específica da sequência têm probabilidade de <strong>0,55⁵ ≈ 5,0%</strong>. Isso não significa que a estratégia deixou de funcionar. Significa apenas que sequências são parte natural de processos probabilísticos.</p>
      <p><strong>Aplicação no trading:</strong> pensar probabilisticamente reduz a tendência de interpretar cada trade isolado como prova de que uma estratégia é boa ou ruim.</p>`,
      `<p>When we say a strategy has a <strong>45% win rate</strong>, we are not saying that exactly 45 out of every 100 trades will win, nor that after a few losses a win is “due”.</p>
      <p>We are describing a <strong>long-run frequency under certain conditions</strong>. In small samples, observed results can be far from that rate.</p>
      <div class="formula-box">P(win) = 0.45 &nbsp; and &nbsp; P(loss) = 0.55</div>
      <p>If trades are treated as independent, five consecutive losses at a specific position in a sequence have probability <strong>0.55⁵ ≈ 5.0%</strong>. That does not mean the strategy stopped working. Sequences are a natural part of probabilistic processes.</p>
      <p><strong>Trading application:</strong> probabilistic thinking reduces the tendency to treat each individual trade as proof that a strategy is good or bad.</p>`,
      `<p>Cuando decimos que una estrategia tiene <strong>45% de tasa de acierto</strong>, no decimos que exactamente 45 de cada 100 trades serán ganadores, ni que después de varias pérdidas “ya toca” una ganancia.</p>
      <p>Describimos una <strong>frecuencia de largo plazo bajo determinadas condiciones</strong>. En muestras pequeñas, los resultados observados pueden quedar lejos de esa tasa.</p>
      <div class="formula-box">P(ganancia) = 0,45 &nbsp; y &nbsp; P(pérdida) = 0,55</div>
      <p>Si los trades se tratan como independientes, cinco pérdidas consecutivas en una posición específica de la secuencia tienen probabilidad <strong>0,55⁵ ≈ 5,0%</strong>. Eso no significa que la estrategia dejó de funcionar. Las secuencias son parte natural de los procesos probabilísticos.</p>
      <p><strong>Aplicación al trading:</strong> pensar probabilísticamente reduce la tendencia a interpretar cada trade aislado como prueba de que una estrategia es buena o mala.</p>`
    )
  );
}

function articleExpectancy() {
  return articleShell(
    "02",
    pick("Expectativa matemática: a média por trade", "Mathematical expectancy: the average per trade", "Expectativa matemática: la media por trade"),
    pick("Win rate e payoff precisam ser lidos juntos.", "Win rate and payoff must be read together.", "Win rate y payoff deben leerse juntos."),
    pick(
      `<p>A expectativa matemática resume o resultado médio esperado por repetição de um processo. No trading, é comum expressá-la em unidades de risco, ou <strong>R</strong>.</p>
      <div class="formula-box">E[R] = P(win) × ganho médio − P(loss) × perda média − custos</div>
      <p>Exemplo: 45% de acerto, ganho médio de 1,5R e perda média de 1R:</p>
      <div class="formula-box">E[R] = 0,45 × 1,5 − 0,55 × 1 = +0,125R</div>
      <p>Isso não quer dizer que cada trade renderá 0,125R. Quer dizer que, <strong>se as hipóteses forem estáveis e a amostra for suficientemente grande</strong>, a média tende a gravitar em torno desse valor.</p>
      <p>Uma estratégia pode acertar 70% e perder dinheiro; outra pode acertar 35% e ganhar. Por isso taxa de acerto isolada é uma métrica incompleta.</p>`,
      `<p>Mathematical expectancy summarizes the average result expected per repetition of a process. In trading it is often expressed in units of risk, or <strong>R</strong>.</p>
      <div class="formula-box">E[R] = P(win) × average win − P(loss) × average loss − costs</div>
      <p>Example: 45% win rate, 1.5R average win and 1R average loss:</p>
      <div class="formula-box">E[R] = 0.45 × 1.5 − 0.55 × 1 = +0.125R</div>
      <p>This does not mean every trade will earn 0.125R. It means that, <strong>if the assumptions remain stable and the sample is large enough</strong>, the average tends to gravitate around that value.</p>
      <p>A strategy can win 70% of the time and lose money; another can win only 35% and make money. Win rate alone is therefore incomplete.</p>`,
      `<p>La expectativa matemática resume el resultado medio esperado por repetición de un proceso. En trading suele expresarse en unidades de riesgo, o <strong>R</strong>.</p>
      <div class="formula-box">E[R] = P(win) × ganancia media − P(loss) × pérdida media − costes</div>
      <p>Ejemplo: 45% de acierto, ganancia media de 1,5R y pérdida media de 1R:</p>
      <div class="formula-box">E[R] = 0,45 × 1,5 − 0,55 × 1 = +0,125R</div>
      <p>Esto no significa que cada trade rendirá 0,125R. Significa que, <strong>si las hipótesis permanecen estables y la muestra es suficientemente grande</strong>, la media tiende a gravitar alrededor de ese valor.</p>
      <p>Una estrategia puede acertar el 70% y perder dinero; otra puede acertar solo el 35% y ganar. Por eso la tasa de acierto aislada es incompleta.</p>`
    )
  );
}

function articleSample() {
  return articleShell(
    "03",
    pick("Amostra, variância e convergência", "Sample size, variance and convergence", "Muestra, varianza y convergencia"),
    pick("Uma boa probabilidade pode parecer ruim por bastante tempo.", "A good probability can look bad for quite a while.", "Una buena probabilidad puede parecer mala durante bastante tiempo."),
    pick(
      `<p>Mesmo que a probabilidade “verdadeira” de vitória fosse 45%, uma amostra de 20 trades poderia mostrar 30%, 50% ou 60% de acerto sem existir qualquer contradição.</p>
      <p>Quanto menor a amostra, maior a oscilação da estatística observada. À medida que o número de repetições cresce, a frequência observada <strong>tende</strong> a se aproximar da probabilidade subjacente — mas o caminho pode ser irregular.</p>
      <div class="formula-box">vitórias esperadas em n trades = n × p</div>
      <p>Em 20 trades com p = 45%, o número esperado é 9 vitórias. “Esperado” aqui significa média teórica entre muitas repetições de amostras de 20 trades, e não garantia de obter exatamente 9.</p>
      <p><strong>Conexão prática:</strong> antes de alterar ou abandonar uma estratégia, é importante separar evidência real de mudança do edge de variabilidade normal de uma amostra pequena.</p>`,
      `<p>Even if the “true” probability of winning were 45%, a 20-trade sample could show 30%, 50% or 60% wins without any contradiction.</p>
      <p>The smaller the sample, the larger the variation in the observed statistic. As repetitions increase, the observed frequency <strong>tends</strong> to approach the underlying probability — but the path can be irregular.</p>
      <div class="formula-box">expected wins in n trades = n × p</div>
      <p>With 20 trades and p = 45%, the expected count is 9 wins. “Expected” means the theoretical average across many 20-trade samples, not a guarantee of exactly 9.</p>
      <p><strong>Practical connection:</strong> before changing or abandoning a strategy, distinguish real evidence of edge deterioration from normal small-sample variability.</p>`,
      `<p>Incluso si la probabilidad “verdadera” de ganar fuera 45%, una muestra de 20 trades podría mostrar 30%, 50% o 60% de aciertos sin contradicción.</p>
      <p>Cuanto menor la muestra, mayor la oscilación de la estadística observada. A medida que crecen las repeticiones, la frecuencia observada <strong>tiende</strong> a acercarse a la probabilidad subyacente, aunque la trayectoria puede ser irregular.</p>
      <div class="formula-box">ganancias esperadas en n trades = n × p</div>
      <p>En 20 trades con p = 45%, el número esperado es 9 ganancias. “Esperado” significa la media teórica entre muchas muestras de 20 trades, no una garantía de obtener exactamente 9.</p>
      <p><strong>Conexión práctica:</strong> antes de cambiar o abandonar una estrategia, conviene separar evidencia real de deterioro del edge de la variabilidad normal de una muestra pequeña.</p>`
    )
  );
}

function articleMonteCarlo() {
  return articleShell(
    "04",
    pick("Onde entra Monte Carlo?", "Where does Monte Carlo fit?", "¿Dónde entra Monte Carlo?"),
    pick("Expectância é uma média; Monte Carlo mostra a distribuição de caminhos.", "Expectancy is an average; Monte Carlo shows the distribution of paths.", "La expectativa es una media; Monte Carlo muestra la distribución de trayectorias."),
    pick(
      `<p>Uma estratégia com E[R] positivo ainda pode produzir dezenas de sequências plausíveis: algumas começam muito bem; outras começam com drawdown; algumas chegam à meta; outras tocam um limite antes.</p>
      <p>A simulação de Monte Carlo repete o processo muitas vezes, alterando a realização aleatória dos resultados ou reamostrando trades históricos. Em vez de uma única curva, obtemos uma <strong>distribuição de curvas</strong>.</p>
      <div class="formula-box">probabilidade + payoff + sizing + sequência → distribuição de resultados</div>
      <p>Por isso Monte Carlo complementa a expectativa matemática. A expectância responde “qual é a média teórica por trade?”. Monte Carlo ajuda a responder “que caminhos podem ocorrer antes de essa média aparecer?”.</p>
      <p><strong>Limitação:</strong> Monte Carlo não cria um edge que não existe e não garante que as probabilidades do passado continuarão válidas no futuro.</p>`,
      `<p>A strategy with positive E[R] can still produce many plausible sequences: some start very well; others start with drawdown; some reach a target; others hit a limit first.</p>
      <p>Monte Carlo simulation repeats the process many times, changing random outcomes or resampling historical trades. Instead of one equity curve, we obtain a <strong>distribution of curves</strong>.</p>
      <div class="formula-box">probability + payoff + sizing + sequence → distribution of outcomes</div>
      <p>Monte Carlo therefore complements mathematical expectancy. Expectancy asks “what is the theoretical average per trade?”. Monte Carlo helps ask “what paths can occur before that average emerges?”.</p>
      <p><strong>Limitation:</strong> Monte Carlo does not create an edge that is not there and does not guarantee that past probabilities will remain valid.</p>`,
      `<p>Una estrategia con E[R] positivo todavía puede producir muchas secuencias plausibles: algunas comienzan muy bien; otras con drawdown; algunas alcanzan la meta; otras tocan un límite antes.</p>
      <p>La simulación de Monte Carlo repite el proceso muchas veces, cambiando los resultados aleatorios o remuestreando trades históricos. En lugar de una sola curva obtenemos una <strong>distribución de curvas</strong>.</p>
      <div class="formula-box">probabilidad + payoff + sizing + secuencia → distribución de resultados</div>
      <p>Monte Carlo complementa así la expectativa matemática. La expectativa pregunta “¿cuál es la media teórica por trade?”. Monte Carlo ayuda a preguntar “¿qué trayectorias pueden ocurrir antes de que esa media aparezca?”.</p>
      <p><strong>Limitación:</strong> Monte Carlo no crea un edge inexistente ni garantiza que las probabilidades del pasado sigan siendo válidas.</p>`
    )
  );
}

function field(id, label, value, min, max, step) {
  return `<label>${esc(label)}<input id="${id}" type="number" value="${value}" min="${min}" max="${max}" step="${step}"></label>`;
}

function expectancyTool() {
  const s=eduState.expectancy;
  return `<article class="edu-tool">
    <div class="edu-tool__head"><span class="tool-number">01</span><div><h4>${esc(pick("Calculadora de Expectativa Matemática", "Mathematical Expectancy Calculator", "Calculadora de Expectativa Matemática"))}</h4><p>${esc(pick("Descubra quanto uma estratégia ganha ou perde, em média, por trade.", "See how much a strategy gains or loses on average per trade.", "Descubre cuánto gana o pierde una estrategia, en promedio, por trade."))}</p></div></div>
    <div class="edu-form cols-3">
      ${field("edu-exp-winrate", pick("Taxa de acerto (%)","Win rate (%)","Tasa de acierto (%)"),s.winRate,0,100,0.1)}
      ${field("edu-exp-win", pick("Ganho médio (R)","Average win (R)","Ganancia media (R)"),s.avgWin,0,100,0.1)}
      ${field("edu-exp-loss", pick("Perda média (R)","Average loss (R)","Pérdida media (R)"),s.avgLoss,0.0001,100,0.1)}
      ${field("edu-exp-cost", pick("Custo por trade (R)","Cost per trade (R)","Coste por trade (R)"),s.costR,0,10,0.01)}
      ${field("edu-exp-trades", pick("Quantidade de trades","Number of trades","Cantidad de trades"),s.trades,1,10000,1)}
    </div>
    <div id="edu-exp-results" class="edu-results"></div>
    <div id="edu-exp-explain" class="edu-explain"></div>
  </article>`;
}

function binomialTool() {
  const s=eduState.binomial;
  return `<article class="edu-tool">
    <div class="edu-tool__head"><span class="tool-number">02</span><div><h4>${esc(pick("Distribuição de Vitórias", "Win Distribution", "Distribución de Victorias"))}</h4><p>${esc(pick("Veja quantas vitórias são plausíveis numa amostra mesmo quando a probabilidade é conhecida.", "See how many wins are plausible in a sample even when the probability is known.", "Observa cuántas victorias son plausibles en una muestra incluso cuando la probabilidad es conocida."))}</p></div></div>
    <div class="edu-form cols-3">
      ${field("edu-bin-winrate", pick("Probabilidade de vitória (%)","Win probability (%)","Probabilidad de victoria (%)"),s.winRate,0,100,0.1)}
      ${field("edu-bin-trades", pick("Trades na amostra","Trades in sample","Trades en la muestra"),s.trades,1,100,1)}
      ${field("edu-bin-target", pick("Número de vitórias k","Number of wins k","Número de victorias k"),s.targetWins,0,100,1)}
    </div>
    <div id="edu-bin-results" class="edu-results"></div>
    <div id="edu-bin-chart" class="binomial-chart" aria-label="${esc(pick("Distribuição binomial", "Binomial distribution", "Distribución binomial"))}"></div>
    <div id="edu-bin-explain" class="edu-explain"></div>
  </article>`;
}

function convergenceTool() {
  const s=eduState.convergence;
  return `<article class="edu-tool">
    <div class="edu-tool__head"><span class="tool-number">03</span><div><h4>${esc(pick("Laboratório de Convergência", "Convergence Lab", "Laboratorio de Convergencia"))}</h4><p>${esc(pick("Acompanhe a taxa de acerto observada à medida que a amostra cresce.", "Watch the observed win rate as the sample grows.", "Observa la tasa de acierto medida a medida que crece la muestra."))}</p></div></div>
    <div class="edu-form cols-3">
      ${field("edu-conv-rate", pick("Probabilidade verdadeira (%)","Underlying probability (%)","Probabilidad subyacente (%)"),s.trueWinRate,0,100,0.1)}
      ${field("edu-conv-trades", pick("Número de trades","Number of trades","Número de trades"),s.trades,10,2000,10)}
      ${field("edu-conv-seed", pick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions"><button id="edu-conv-new" class="secondary">${esc(pick("Gerar outra sequência", "Generate another sequence", "Generar otra secuencia"))}</button></div>
    <canvas id="edu-conv-chart" class="edu-canvas" height="300"></canvas>
    <div id="edu-conv-results" class="edu-results"></div>
    <div class="edu-explain">${esc(pick(
      "A linha observada pode ficar acima ou abaixo da probabilidade verdadeira por longos trechos. Convergência não significa aproximação suave.",
      "The observed line can stay above or below the underlying probability for long stretches. Convergence does not mean smooth convergence.",
      "La línea observada puede permanecer por encima o por debajo de la probabilidad subyacente durante largos tramos. Convergencia no significa aproximación suave."
    ))}</div>
  </article>`;
}

function monteCarloBridge() {
  const s=eduState.monteCarlo;
  return `<article class="edu-tool edu-tool--wide">
    <div class="edu-tool__head"><span class="tool-number">04</span><div><h4>${esc(pick("Da Expectância ao Monte Carlo", "From Expectancy to Monte Carlo", "De la Expectativa a Monte Carlo"))}</h4><p>${esc(pick("Use uma hipótese simples e transforme a média teórica em milhares de caminhos possíveis.", "Take a simple hypothesis and turn its theoretical average into thousands of possible paths.", "Toma una hipótesis simple y transforma su media teórica en miles de trayectorias posibles."))}</p></div></div>
    <div class="edu-form cols-3">
      ${field("edu-mc-rate", pick("Taxa de acerto (%)","Win rate (%)","Tasa de acierto (%)"),s.winRate,0,100,0.1)}
      ${field("edu-mc-rr", "Reward : Risk",s.rewardRisk,0,20,0.1)}
      ${field("edu-mc-risk", pick("Risco por trade (%)","Risk per trade (%)","Riesgo por trade (%)"),s.riskPct,0,20,0.1)}
      ${field("edu-mc-trades", pick("Trades por caminho","Trades per path","Trades por trayectoria"),s.trades,1,2000,1)}
      ${field("edu-mc-sims", pick("Simulações","Simulations","Simulaciones"),s.simulations,100,10000,100)}
      ${field("edu-mc-seed", pick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions"><button id="edu-mc-run" class="primary">${esc(pick("Executar mini Monte Carlo", "Run mini Monte Carlo", "Ejecutar mini Monte Carlo"))}</button></div>
    <div id="edu-mc-theory" class="edu-theory"></div>
    <div id="edu-mc-results" class="edu-results"></div>
    <div id="edu-mc-explain" class="edu-explain"></div>
  </article>`;
}

function readNumber(id, fallback) {
  const n=Number($e(id)?.value);
  return Number.isFinite(n)?n:fallback;
}

function bindEducation() {
  ["edu-exp-winrate","edu-exp-win","edu-exp-loss","edu-exp-cost","edu-exp-trades"].forEach(id=>$e(id)?.addEventListener("input", updateExpectancy));
  ["edu-bin-winrate","edu-bin-trades","edu-bin-target"].forEach(id=>$e(id)?.addEventListener("input", updateBinomial));
  ["edu-conv-rate","edu-conv-trades","edu-conv-seed"].forEach(id=>$e(id)?.addEventListener("input", updateConvergence));
  $e("edu-conv-new")?.addEventListener("click",()=>{
    eduState.convergence.seed = Math.max(1, readNumber("edu-conv-seed", eduState.convergence.seed)+1);
    $e("edu-conv-seed").value=eduState.convergence.seed;
    updateConvergence();
  });
  ["edu-mc-rate","edu-mc-rr","edu-mc-risk","edu-mc-trades","edu-mc-sims","edu-mc-seed"].forEach(id=>$e(id)?.addEventListener("input", updateMonteCarloLabels));
  $e("edu-mc-run")?.addEventListener("click", runMiniMonteCarlo);
}

function updateExpectancy() {
  const winRate=Math.min(100,Math.max(0,readNumber("edu-exp-winrate",45)));
  const p=winRate/100;
  const win=Math.max(0,readNumber("edu-exp-win",1.5));
  const loss=Math.max(0.0001,readNumber("edu-exp-loss",1));
  const cost=Math.max(0,readNumber("edu-exp-cost",0));
  const trades=Math.max(1,Math.floor(readNumber("edu-exp-trades",100)));
  eduState.expectancy={winRate,avgWin:win,avgLoss:loss,costR:cost,trades};
  const exp=p*win-(1-p)*loss-cost;
  const breakeven=(loss+cost)/(win+loss)*100;
  const grossPf=(1-p)*loss>0?(p*win)/((1-p)*loss):Infinity;
  const total=exp*trades;
  const sign=exp>0?pick("positiva","positive","positiva"):exp<0?pick("negativa","negative","negativa"):pick("neutra","neutral","neutral");
  $e("edu-exp-results").innerHTML=[
    [pick("Expectância por trade","Expectancy per trade","Expectativa por trade"),`${exp>=0?"+":""}${fmt(exp,3)}R`],
    [pick("Win rate de equilíbrio","Break-even win rate","Win rate de equilibrio"),pct(Math.min(100,breakeven),1)],
    [pick("Profit Factor bruto","Gross Profit Factor","Profit Factor bruto"),Number.isFinite(grossPf)?fmt(grossPf,2):"∞"],
    [pick(`Expectância em ${trades} trades`,`Expectancy over ${trades} trades`,`Expectativa en ${trades} trades`),`${total>=0?"+":""}${fmt(total,2)}R`],
  ].map(([l,v])=>`<div><span>${esc(l)}</span><strong>${esc(v)}</strong></div>`).join("");
  $e("edu-exp-explain").innerHTML=pick(
    `Com esses números, a expectativa é <strong>${sign}</strong>. Isso é uma média teórica; uma sequência real de ${trades} trades pode terminar muito acima ou abaixo de ${fmt(total,2)}R.`,
    `With these inputs, expectancy is <strong>${sign}</strong>. This is a theoretical average; an actual sequence of ${trades} trades can finish far above or below ${fmt(total,2)}R.`,
    `Con estos números, la expectativa es <strong>${sign}</strong>. Es una media teórica; una secuencia real de ${trades} trades puede terminar muy por encima o por debajo de ${fmt(total,2)}R.`
  );
}

function binomialDistribution(n,p) {
  if(p<=0) return Array.from({length:n+1},(_,i)=>i===0?1:0);
  if(p>=1) return Array.from({length:n+1},(_,i)=>i===n?1:0);
  const q=1-p;
  const probs=new Array(n+1);
  probs[0]=Math.pow(q,n);
  for(let k=0;k<n;k++) probs[k+1]=probs[k]*((n-k)/(k+1))*(p/q);
  const sum=probs.reduce((a,b)=>a+b,0);
  return probs.map(v=>v/sum);
}

function updateBinomial() {
  const winRate=Math.min(100,Math.max(0,readNumber("edu-bin-winrate",45)));
  const n=Math.min(100,Math.max(1,Math.floor(readNumber("edu-bin-trades",20))));
  const k=Math.min(n,Math.max(0,Math.floor(readNumber("edu-bin-target",10))));
  if($e("edu-bin-target")) $e("edu-bin-target").max=n;
  eduState.binomial={winRate,trades:n,targetWins:k};
  const probs=binomialDistribution(n,winRate/100);
  const exact=probs[k]*100;
  const atLeast=probs.slice(k).reduce((a,b)=>a+b,0)*100;
  const expected=n*winRate/100;
  const sd=Math.sqrt(n*(winRate/100)*(1-winRate/100));
  $e("edu-bin-results").innerHTML=[
    [pick("Vitórias esperadas","Expected wins","Victorias esperadas"),fmt(expected,1)],
    [pick(`P(exatamente ${k})`,`P(exactly ${k})`,`P(exactamente ${k})`),pct(exact,2)],
    [pick(`P(${k} ou mais)`,`P(${k} or more)`,`P(${k} o más)`),pct(atLeast,2)],
    [pick("Desvio-padrão da contagem","Count standard deviation","Desviación estándar del conteo"),fmt(sd,2)],
  ].map(([l,v])=>`<div><span>${esc(l)}</span><strong>${esc(v)}</strong></div>`).join("");

  const max=Math.max(...probs);
  const start=n>35?Math.max(0,Math.floor(expected-4*sd)):0;
  const end=n>35?Math.min(n,Math.ceil(expected+4*sd)):n;
  let bars="";
  for(let i=start;i<=end;i++){
    const h=max>0?Math.max(2,(probs[i]/max)*100):2;
    bars+=`<div class="bin-bar ${i===k?"selected":""}" title="${i}: ${pct(probs[i]*100,2)}"><span style="height:${h}%"></span><small>${i}</small></div>`;
  }
  $e("edu-bin-chart").innerHTML=bars;
  $e("edu-bin-explain").textContent=pick(
    `Mesmo com p = ${pct(winRate)}, uma amostra de ${n} trades não precisa ter exatamente ${fmt(expected,1)} vitórias. A distribuição mostra a variedade de contagens plausíveis.`,
    `Even with p = ${pct(winRate)}, a ${n}-trade sample does not have to contain exactly ${fmt(expected,1)} wins. The distribution shows the range of plausible counts.`,
    `Incluso con p = ${pct(winRate)}, una muestra de ${n} trades no tiene que contener exactamente ${fmt(expected,1)} victorias. La distribución muestra la variedad de conteos plausibles.`
  );
}

function mulberry32Edu(seed) {
  let a=seed>>>0;
  return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
}

function updateConvergence() {
  const p=Math.min(100,Math.max(0,readNumber("edu-conv-rate",45)))/100;
  const n=Math.min(2000,Math.max(10,Math.floor(readNumber("edu-conv-trades",300))));
  const seed=Math.max(1,Math.floor(readNumber("edu-conv-seed",2026)));
  eduState.convergence={trueWinRate:p*100,trades:n,seed};
  const rng=mulberry32Edu(seed);
  const rates=[];let wins=0,maxDev=0;
  for(let i=1;i<=n;i++){
    if(rng()<p) wins++;
    const r=wins/i;
    rates.push(r);
    maxDev=Math.max(maxDev,Math.abs(r-p));
  }
  drawConvergence(rates,p);
  $e("edu-conv-results").innerHTML=[
    [pick("Probabilidade definida","Defined probability","Probabilidad definida"),pct(p*100,1)],
    [pick("Taxa observada final","Final observed rate","Tasa observada final"),pct(rates.at(-1)*100,1)],
    [pick("Vitórias observadas","Observed wins","Victorias observadas"),`${wins} / ${n}`],
    [pick("Maior desvio durante o caminho","Largest deviation along the path","Mayor desviación durante la trayectoria"),pct(maxDev*100,1)],
  ].map(([l,v])=>`<div><span>${esc(l)}</span><strong>${esc(v)}</strong></div>`).join("");
}

function drawConvergence(rates,trueP){
  const canvas=$e("edu-conv-chart"); if(!canvas)return;
  const ratio=window.devicePixelRatio||1;
  const w=Math.max(320,canvas.clientWidth||800),h=300;
  canvas.width=w*ratio;canvas.height=h*ratio;
  const ctx=canvas.getContext("2d");ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);
  const pad={l:48,r:16,t:18,b:34};
  const min=Math.max(0,Math.min(trueP,...rates)-0.15),max=Math.min(1,Math.max(trueP,...rates)+0.15);
  const x=i=>pad.l+(i/Math.max(1,rates.length-1))*(w-pad.l-pad.r);
  const y=v=>pad.t+(max-v)/(max-min||1)*(h-pad.t-pad.b);
  ctx.strokeStyle="#263244";ctx.lineWidth=1;
  for(let g=0;g<=4;g++){const gy=pad.t+g*(h-pad.t-pad.b)/4;ctx.beginPath();ctx.moveTo(pad.l,gy);ctx.lineTo(w-pad.r,gy);ctx.stroke();}
  ctx.setLineDash([6,5]);ctx.strokeStyle="rgba(110,231,183,.75)";ctx.beginPath();ctx.moveTo(pad.l,y(trueP));ctx.lineTo(w-pad.r,y(trueP));ctx.stroke();ctx.setLineDash([]);
  ctx.strokeStyle="#60a5fa";ctx.lineWidth=2;ctx.beginPath();
  rates.forEach((v,i)=>{if(i===0)ctx.moveTo(x(i),y(v));else ctx.lineTo(x(i),y(v));});ctx.stroke();
  ctx.fillStyle="#9aa7b8";ctx.font="12px system-ui";ctx.textAlign="right";
  for(let g=0;g<=4;g++){const v=max-g*(max-min)/4;ctx.fillText(pct(v*100,0),pad.l-7,pad.t+g*(h-pad.t-pad.b)/4+4);}
  ctx.textAlign="left";ctx.fillText("1",pad.l,h-10);ctx.textAlign="right";ctx.fillText(String(rates.length),w-pad.r,h-10);
}

function updateMonteCarloLabels(){
  const winRate=Math.min(100,Math.max(0,readNumber("edu-mc-rate",45)));
  const rr=Math.max(0,readNumber("edu-mc-rr",1.5));
  const risk=Math.max(0,readNumber("edu-mc-risk",1));
  const trades=Math.min(2000,Math.max(1,Math.floor(readNumber("edu-mc-trades",200))));
  const simulations=Math.min(10000,Math.max(100,Math.floor(readNumber("edu-mc-sims",2500))));
  const seed=Math.max(1,Math.floor(readNumber("edu-mc-seed",2026)));
  eduState.monteCarlo={winRate,rewardRisk:rr,riskPct:risk,trades,simulations,seed};
  const e=(winRate/100)*rr-(1-winRate/100);
  $e("edu-mc-theory").innerHTML=pick(
    `Antes de simular: <strong>E[R] = ${e>=0?"+":""}${fmt(e,3)}R por trade</strong>. Em ${trades} trades, a média teórica linear seria ${e>=0?"+":""}${fmt(e*trades,2)}R — mas nenhum caminho individual é obrigado a terminar nessa média.`,
    `Before simulation: <strong>E[R] = ${e>=0?"+":""}${fmt(e,3)}R per trade</strong>. Over ${trades} trades, the linear theoretical average would be ${e>=0?"+":""}${fmt(e*trades,2)}R — but no individual path is required to finish at that average.`,
    `Antes de simular: <strong>E[R] = ${e>=0?"+":""}${fmt(e,3)}R por trade</strong>. En ${trades} trades, la media teórica lineal sería ${e>=0?"+":""}${fmt(e*trades,2)}R — pero ninguna trayectoria individual está obligada a terminar en esa media.`
  );
  $e("edu-mc-results").innerHTML="";
  $e("edu-mc-explain").innerHTML=pick(
    "Clique em executar para transformar essa hipótese em uma distribuição de resultados.",
    "Run the simulation to turn this hypothesis into a distribution of outcomes.",
    "Ejecuta la simulación para transformar esta hipótesis en una distribución de resultados."
  );
}

function runMiniMonteCarlo(){
  updateMonteCarloLabels();
  const s=eduState.monteCarlo;
  const btn=$e("edu-mc-run");
  btn.disabled=true;btn.textContent=pick("Simulando...","Simulating...","Simulando...");
  try{
    const result=runTradeMonteCarlo({
      mode:"parameters",startingCapital:10000,winRatePct:s.winRate,rewardRisk:s.rewardRisk,riskPct:s.riskPct,
      positionSizing:"fixed",costPerTrade:0,tradesPerSimulation:s.trades,simulations:s.simulations,seed:s.seed,
      rules:{targetPct:0,maxLossPct:0,dailyLossPct:0,ruinThresholdPct:0,tradesPerDay:5,trailingMode:"none"}
    });
    const x=result.summary;
    $e("edu-mc-results").innerHTML=[
      [pick("Probabilidade de lucro","Profit probability","Probabilidad de beneficio"),pct(x.probabilityProfitPct,1)],
      [pick("Saldo final P5","P5 final balance","Saldo final P5"),new Intl.NumberFormat(eduLocale(),{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(x.finalBalance.p05)],
      [pick("Saldo final P50","P50 final balance","Saldo final P50"),new Intl.NumberFormat(eduLocale(),{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(x.finalBalance.p50)],
      [pick("Saldo final P95","P95 final balance","Saldo final P95"),new Intl.NumberFormat(eduLocale(),{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(x.finalBalance.p95)],
      ["Drawdown P95",pct(x.maxDrawdownPct.p95,1)],
      [pick("Sequência de perdas P95","P95 losing streak","Racha de pérdidas P95"),fmt(x.losingStreak.p95,0)],
    ].map(([l,v])=>`<div><span>${esc(l)}</span><strong>${esc(v)}</strong></div>`).join("");
    $e("edu-mc-explain").innerHTML=pick(
      `A expectativa matemática continuou sendo apenas uma média. Monte Carlo mostrou a <strong>dispersão</strong>: 90% dos saldos finais ficaram aproximadamente entre o P5 e o P95, enquanto o drawdown P95 chegou a <strong>${pct(x.maxDrawdownPct.p95,1)}</strong>.`,
      `Mathematical expectancy remained only an average. Monte Carlo exposed the <strong>dispersion</strong>: roughly 90% of final balances fell between P5 and P95, while P95 drawdown reached <strong>${pct(x.maxDrawdownPct.p95,1)}</strong>.`,
      `La expectativa matemática siguió siendo solo una media. Monte Carlo mostró la <strong>dispersión</strong>: aproximadamente el 90% de los saldos finales quedó entre P5 y P95, mientras el drawdown P95 llegó a <strong>${pct(x.maxDrawdownPct.p95,1)}</strong>.`
    );
  }finally{
    btn.disabled=false;btn.textContent=pick("Executar mini Monte Carlo","Run mini Monte Carlo","Ejecutar mini Monte Carlo");
  }
}

window.addEventListener("resize",()=>{if($e("edu-conv-chart"))updateConvergence();});
document.addEventListener("i18n:change",renderEducation);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",renderEducation,{once:true});else renderEducation();
