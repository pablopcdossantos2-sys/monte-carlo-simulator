const inf$ = (id) => document.getElementById(id);
const infLocale = () => window.I18N?.getLanguage?.() || "pt-BR";
const infPick = (pt,en,es) => infLocale()==="en"?en:infLocale()==="es"?es:pt;
const infFmt = (v,d=2) => new Intl.NumberFormat(infLocale(),{maximumFractionDigits:d}).format(v);
const infPct = (v,d=1) => `${infFmt(v,d)}%`;
const infEsc = (value) => String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

const infState={
  distribution:{
    outcomes:[
      {p:55,r:1},
      {p:43,r:-0.8},
      {p:2,r:-5},
    ],
    trades:100,
    simulations:4000,
    seed:55109,
  },
  bayes:{
    priorMean:45,
    priorStrength:20,
    wins:25,
    losses:25,
    breakEven:40,
    payoff:1.5,
    forecastTrades:100,
    simulations:4000,
    seed:60177,
  }
};

function infRng(seed){
  let a=seed>>>0;
  return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
}
function infRead(id,fallback){const n=Number(inf$(id)?.value);return Number.isFinite(n)?n:fallback;}
function infField(id,label,value,min,max,step){return `<label>${infEsc(label)}<input id="${id}" type="number" value="${value}" min="${min}" max="${max}" step="${step}"></label>`;}
function infQuantile(values,q){const s=[...values].sort((a,b)=>a-b);if(!s.length)return NaN;const p=(s.length-1)*q,l=Math.floor(p),h=Math.ceil(p);return l===h?s[l]:s[l]+(s[h]-s[l])*(p-l);}
function infMetric(items){return items.map(([l,v])=>`<div><span>${infEsc(l)}</span><strong>${infEsc(v)}</strong></div>`).join("");}

function infArticle(number,title,lead,body){
  return `<details class="concept-article"><summary><span class="concept-number">${number}</span><span><strong>${infEsc(title)}</strong><small>${infEsc(lead)}</small></span></summary><div class="concept-article__body">${body}</div></details>`;
}

function infDistributionArticle(){
  return infArticle(
    "09",
    infPick("Distribuição de retornos e caudas","Return distributions and tails","Distribución de retornos y colas"),
    infPick("A média não mostra onde os resultados estão nem quão ruins podem ser as caudas.","The average does not show where outcomes lie or how bad tails can be.","La media no muestra dónde están los resultados ni cuán malas pueden ser las colas."),
    infPick(
      `<p>Win rate e payoff médio resumem muita informação. Duas estratégias podem ter a mesma média e ainda diferir na frequência de ganhos pequenos, perdas comuns e eventos raros muito grandes.</p>
      <p>Uma <strong>distribuição</strong> descreve quais resultados são possíveis e com que probabilidades. Em trading, isso ajuda a enxergar assimetria e risco de cauda.</p>
      <div class="formula-box">E[R] = Σ pᵢRᵢ &nbsp; · &nbsp; Var(R) = Σ pᵢ(Rᵢ−E[R])²</div>
      <p>Um evento de -5R com probabilidade de apenas 2% pode parecer pouco importante olhando somente o win rate. Em centenas de trades, porém, sua ocorrência se torna plausível e altera os percentis negativos.</p>
      <p><strong>Conexão com Monte Carlo:</strong> a simulação sorteia repetidamente dessa distribuição e mostra como eventos raros se propagam para o resultado acumulado.</p>`,
      `<p>Win rate and average payoff compress a lot of information. Two strategies can share the same average while differing in small wins, common losses and rare large events.</p>
      <p>A <strong>distribution</strong> describes possible outcomes and their probabilities. In trading this helps reveal asymmetry and tail risk.</p>
      <div class="formula-box">E[R] = Σ pᵢRᵢ &nbsp; · &nbsp; Var(R) = Σ pᵢ(Rᵢ−E[R])²</div>
      <p>A -5R event with only 2% probability can look unimportant when viewing win rate alone. Across hundreds of trades, however, its occurrence becomes plausible and changes negative percentiles.</p>
      <p><strong>Monte Carlo connection:</strong> simulation repeatedly samples from this distribution and shows how rare events propagate into cumulative outcomes.</p>`,
      `<p>Win rate y payoff medio comprimen mucha información. Dos estrategias pueden compartir la misma media y aun diferir en pequeñas ganancias, pérdidas comunes y eventos raros muy grandes.</p>
      <p>Una <strong>distribución</strong> describe qué resultados son posibles y con qué probabilidades. En trading ayuda a revelar asimetría y riesgo de cola.</p>
      <div class="formula-box">E[R] = Σ pᵢRᵢ &nbsp; · &nbsp; Var(R) = Σ pᵢ(Rᵢ−E[R])²</div>
      <p>Un evento de -5R con solo 2% de probabilidad puede parecer poco importante mirando solo el win rate. En cientos de trades, sin embargo, su ocurrencia se vuelve plausible y cambia los percentiles negativos.</p>
      <p><strong>Conexión con Monte Carlo:</strong> la simulación toma repetidamente muestras de esta distribución y muestra cómo los eventos raros se propagan al resultado acumulado.</p>`
    )
  );
}

function infBayesArticle(){
  return infArticle(
    "10",
    infPick("Atualização bayesiana da probabilidade","Bayesian updating of probability","Actualización bayesiana de la probabilidad"),
    infPick("Uma estimativa de win rate também possui incerteza.","A win-rate estimate also has uncertainty.","Una estimación de win rate también tiene incertidumbre."),
    infPick(
      `<p>Dizer “meu win rate é 45%” costuma esconder uma pergunta: <strong>quão confiável é essa estimativa?</strong> Dez trades e mil trades não fornecem o mesmo grau de evidência.</p>
      <p>A abordagem bayesiana começa com uma distribuição <strong>prior</strong>, incorpora novos dados e produz uma distribuição <strong>posterior</strong>.</p>
      <div class="formula-box">posterior ∝ prior × evidência</div>
      <p>Neste laboratório usamos o modelo Beta-Binomial para o win rate. O “peso do prior” pode ser entendido como uma quantidade de trades equivalentes. Quanto mais dados reais entram, menor tende a ser a influência do prior.</p>
      <p><strong>Conexão com Monte Carlo:</strong> em vez de simular todos os caminhos com um único p fixo, podemos sortear um p da posterior em cada caminho. Assim a simulação incorpora também <strong>incerteza de parâmetro</strong>.</p>`,
      `<p>Saying “my win rate is 45%” often hides another question: <strong>how reliable is that estimate?</strong> Ten trades and one thousand trades do not provide the same evidence.</p>
      <p>A Bayesian approach starts with a <strong>prior</strong> distribution, incorporates new data and produces a <strong>posterior</strong> distribution.</p>
      <div class="formula-box">posterior ∝ prior × evidence</div>
      <p>This lab uses the Beta-Binomial model for win rate. “Prior strength” can be interpreted as an equivalent number of trades. As real observations accumulate, the prior usually has less influence.</p>
      <p><strong>Monte Carlo connection:</strong> instead of simulating every path with one fixed p, we can draw p from the posterior for each path. The simulation then incorporates <strong>parameter uncertainty</strong>.</p>`,
      `<p>Decir “mi win rate es 45%” suele ocultar otra pregunta: <strong>¿qué tan confiable es esa estimación?</strong> Diez trades y mil trades no aportan la misma evidencia.</p>
      <p>El enfoque bayesiano comienza con una distribución <strong>prior</strong>, incorpora nuevos datos y produce una distribución <strong>posterior</strong>.</p>
      <div class="formula-box">posterior ∝ prior × evidencia</div>
      <p>Este laboratorio usa el modelo Beta-Binomial para el win rate. El “peso del prior” puede entenderse como una cantidad equivalente de trades. Cuantos más datos reales entran, menor suele ser la influencia del prior.</p>
      <p><strong>Conexión con Monte Carlo:</strong> en vez de simular todas las trayectorias con un único p fijo, podemos sortear un p de la posterior para cada trayectoria. Así incorporamos también <strong>incertidumbre del parámetro</strong>.</p>`
    )
  );
}

function infDistributionTool(){
  const s=infState.distribution;
  return `<article class="edu-tool edu-tool--wide">
    <div class="edu-tool__head"><span class="tool-number">09</span><div><h4>${infEsc(infPick("Construtor de Distribuição de R e Caudas","R-Distribution and Tail Builder","Constructor de Distribución de R y Colas"))}</h4><p>${infEsc(infPick("Defina três resultados possíveis e veja como um evento raro afeta média, dispersão e percentis acumulados.","Define three possible outcomes and see how a rare event affects mean, dispersion and cumulative percentiles.","Define tres resultados posibles y observa cómo un evento raro afecta media, dispersión y percentiles acumulados."))}</p></div></div>
    <div class="stats-strategy-grid">
      ${s.outcomes.map((o,i)=>`<div class="stats-strategy-box"><strong>${infEsc(infPick(`Resultado ${i+1}`,`Outcome ${i+1}`,`Resultado ${i+1}`))}</strong><div class="edu-form cols-3">
        ${infField(`inf-dist-p-${i}`,infPick("Probabilidade (%)","Probability (%)","Probabilidad (%)"),o.p,0,100,.1)}
        ${infField(`inf-dist-r-${i}`,"R",o.r,-20,20,.1)}
      </div></div>`).join("")}
    </div>
    <div class="edu-form cols-3">
      ${infField("inf-dist-trades",infPick("Trades por caminho","Trades per path","Trades por trayectoria"),s.trades,10,1000,10)}
      ${infField("inf-dist-sims",infPick("Simulações","Simulations","Simulaciones"),s.simulations,500,10000,500)}
      ${infField("inf-dist-seed",infPick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions"><button id="inf-dist-run" class="primary">${infEsc(infPick("Analisar distribuição","Analyze distribution","Analizar distribución"))}</button></div>
    <div id="inf-dist-bars" class="inf-outcome-bars"></div>
    <div id="inf-dist-results" class="edu-results"></div>
    <div id="inf-dist-explain" class="edu-explain"></div>
  </article>`;
}

function infBayesTool(){
  const s=infState.bayes;
  return `<article class="edu-tool edu-tool--wide">
    <div class="edu-tool__head"><span class="tool-number">10</span><div><h4>${infEsc(infPick("Atualizador Bayesiano de Win Rate","Bayesian Win-Rate Updater","Actualizador Bayesiano de Win Rate"))}</h4><p>${infEsc(infPick("Combine uma crença inicial com novos trades e leve a incerteza do win rate para uma simulação preditiva.","Combine an initial belief with new trades and carry win-rate uncertainty into a predictive simulation.","Combina una creencia inicial con nuevos trades y lleva la incertidumbre del win rate a una simulación predictiva."))}</p></div></div>
    <div class="edu-form cols-3">
      ${infField("inf-bayes-prior",infPick("Média do prior (%)","Prior mean (%)","Media del prior (%)"),s.priorMean,1,99,.1)}
      ${infField("inf-bayes-strength",infPick("Peso do prior (trades equivalentes)","Prior strength (equivalent trades)","Peso del prior (trades equivalentes)"),s.priorStrength,1,1000,1)}
      ${infField("inf-bayes-wins",infPick("Vitórias observadas","Observed wins","Victorias observadas"),s.wins,0,10000,1)}
      ${infField("inf-bayes-losses",infPick("Perdas observadas","Observed losses","Pérdidas observadas"),s.losses,0,10000,1)}
      ${infField("inf-bayes-break",infPick("Win rate de referência (%)","Reference win rate (%)","Win rate de referencia (%)"),s.breakEven,1,99,.1)}
      ${infField("inf-bayes-payoff","Reward : Risk",s.payoff,0,20,.1)}
      ${infField("inf-bayes-forecast",infPick("Trades futuros por caminho","Future trades per path","Trades futuros por trayectoria"),s.forecastTrades,10,1000,10)}
      ${infField("inf-bayes-sims",infPick("Simulações preditivas","Predictive simulations","Simulaciones predictivas"),s.simulations,500,10000,500)}
      ${infField("inf-bayes-seed",infPick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions"><button id="inf-bayes-run" class="primary">${infEsc(infPick("Atualizar e simular","Update and simulate","Actualizar y simular"))}</button></div>
    <div id="inf-bayes-results" class="edu-results"></div>
    <div id="inf-bayes-meter" class="inf-bayes-meter"></div>
    <div id="inf-bayes-predictive" class="edu-results"></div>
    <div id="inf-bayes-explain" class="edu-explain"></div>
  </article>`;
}

function renderInferenceLab(){
  const root=inf$("inference-root"); if(!root)return;
  root.innerHTML=`
    <div class="education-head">
      <div>
        <p class="eyebrow">${infEsc(infPick("DISTRIBUIÇÕES E INCERTEZA","DISTRIBUTIONS AND UNCERTAINTY","DISTRIBUCIONES E INCERTIDUMBRE"))}</p>
        <h2>${infEsc(infPick("Caudas, Incerteza de Parâmetro e Atualização Bayesiana","Tails, Parameter Uncertainty and Bayesian Updating","Colas, Incertidumbre de Parámetro y Actualización Bayesiana"))}</h2>
        <p class="section-explain">${infEsc(infPick(
          "Neste terceiro bloco, a probabilidade deixa de ser tratada como um número perfeitamente conhecido. Também passamos a olhar para distribuições com resultados raros, não apenas para win rate e payoff médios.",
          "In this third block, probability is no longer treated as perfectly known. We also study distributions with rare outcomes instead of only average win rate and payoff.",
          "En este tercer bloque, la probabilidad deja de tratarse como un número perfectamente conocido. También estudiamos distribuciones con resultados raros, no solo win rate y payoff medios."
        ))}</p>
      </div>
      <div class="education-path"><span>9 · ${infEsc(infPick("Caudas","Tails","Colas"))}</span><span>10 · Bayes</span></div>
    </div>
    <div class="article-grid">${infDistributionArticle()}${infBayesArticle()}</div>
    <div class="education-tools-intro"><p class="eyebrow">${infEsc(infPick("LABORATÓRIOS","LABS","LABORATORIOS"))}</p><h3>${infEsc(infPick("Da incerteza teórica à distribuição preditiva","From theoretical uncertainty to predictive distribution","De la incertidumbre teórica a la distribución predictiva"))}</h3></div>
    <div class="education-tools">${infDistributionTool()}${infBayesTool()}</div>
  `;
  inf$("inf-dist-run")?.addEventListener("click",infRunDistribution);
  inf$("inf-bayes-run")?.addEventListener("click",infRunBayes);
  infRunDistribution();
  infRunBayes();
}

function infDistributionMoments(outcomes){
  const sum=outcomes.reduce((a,o)=>a+o.p,0);
  const normalized=outcomes.map(o=>({p:sum>0?o.p/sum:1/outcomes.length,r:o.r}));
  const mean=normalized.reduce((a,o)=>a+o.p*o.r,0);
  const variance=normalized.reduce((a,o)=>a+o.p*Math.pow(o.r-mean,2),0);
  const sd=Math.sqrt(variance);
  const skew=sd>0?normalized.reduce((a,o)=>a+o.p*Math.pow((o.r-mean)/sd,3),0):0;
  const lossProb=normalized.filter(o=>o.r<0).reduce((a,o)=>a+o.p,0);
  return {normalized,mean,variance,sd,skew,lossProb,sum};
}

function infSampleOutcome(outcomes,rng){
  const u=rng();let acc=0;
  for(const o of outcomes){acc+=o.p;if(u<=acc)return o.r;}
  return outcomes.at(-1).r;
}

function infRunDistribution(){
  const outcomes=[0,1,2].map(i=>({p:Math.max(0,infRead(`inf-dist-p-${i}`,infState.distribution.outcomes[i].p)),r:infRead(`inf-dist-r-${i}`,infState.distribution.outcomes[i].r)}));
  const trades=Math.min(1000,Math.max(10,Math.floor(infRead("inf-dist-trades",100))));
  const sims=Math.min(10000,Math.max(500,Math.floor(infRead("inf-dist-sims",4000))));
  const seed=Math.max(1,Math.floor(infRead("inf-dist-seed",55109)));
  const m=infDistributionMoments(outcomes);
  const rng=infRng(seed),totals=[];
  for(let s=0;s<sims;s++){let total=0;for(let i=0;i<trades;i++)total+=infSampleOutcome(m.normalized,rng);totals.push(total);}
  inf$("inf-dist-bars").innerHTML=m.normalized.map((o,i)=>{
    const width=Math.max(3,o.p*100);
    return `<div><span>${infEsc(infPick(`Resultado ${i+1}`,`Outcome ${i+1}`,`Resultado ${i+1}`))}: ${infPct(o.p*100,1)} · ${infFmt(o.r,2)}R</span><div class="inf-bar-track"><i style="width:${width}%"></i></div></div>`;
  }).join("");
  inf$("inf-dist-results").innerHTML=infMetric([
    ["E[R]",`${m.mean>=0?"+":""}${infFmt(m.mean,3)}R`],
    [infPick("Desvio-padrão","Standard deviation","Desviación estándar"),`${infFmt(m.sd,3)}R`],
    [infPick("Assimetria","Skewness","Asimetría"),infFmt(m.skew,2)],
    [infPick("Prob. de R negativo","Probability of negative R","Prob. de R negativo"),infPct(m.lossProb*100,1)],
    [`P5 · ${trades} trades`,`${infFmt(infQuantile(totals,.05),1)}R`],
    [`P50 · ${trades} trades`,`${infFmt(infQuantile(totals,.50),1)}R`],
    [`P95 · ${trades} trades`,`${infFmt(infQuantile(totals,.95),1)}R`],
    [infPick("Caminhos negativos","Negative paths","Trayectorias negativas"),infPct(totals.filter(v=>v<0).length/totals.length*100,1)],
  ]);
  const normalized=Math.abs(m.sum-100)>.01;
  inf$("inf-dist-explain").innerHTML=infPick(
    `${normalized?`As probabilidades informadas somaram ${infPct(m.sum,1)}; para a análise elas foram normalizadas para 100%. `:""}A média por trade é <strong>${m.mean>=0?"+":""}${infFmt(m.mean,3)}R</strong>, mas o P5 após ${trades} trades ficou em <strong>${infFmt(infQuantile(totals,.05),1)}R</strong>. Altere o evento raro e observe como a cauda muda mesmo quando a média se move pouco.`,
    `${normalized?`The probabilities summed to ${infPct(m.sum,1)}; they were normalized to 100% for analysis. `:""}Mean per trade is <strong>${m.mean>=0?"+":""}${infFmt(m.mean,3)}R</strong>, but P5 after ${trades} trades is <strong>${infFmt(infQuantile(totals,.05),1)}R</strong>. Change the rare event and observe how the tail moves even when the mean changes little.`,
    `${normalized?`Las probabilidades sumaron ${infPct(m.sum,1)}; se normalizaron a 100% para el análisis. `:""}La media por trade es <strong>${m.mean>=0?"+":""}${infFmt(m.mean,3)}R</strong>, pero el P5 después de ${trades} trades quedó en <strong>${infFmt(infQuantile(totals,.05),1)}R</strong>. Cambia el evento raro y observa cómo se mueve la cola aunque la media cambie poco.`
  );
}

function infNormal(rng){
  let u=0,v=0;while(u===0)u=rng();while(v===0)v=rng();
  return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
}
function infGamma(shape,rng){
  if(shape<1){const u=rng();return infGamma(shape+1,rng)*Math.pow(u,1/shape);}
  const d=shape-1/3,c=1/Math.sqrt(9*d);
  while(true){
    let x=infNormal(rng),v=1+c*x;if(v<=0)continue;v=v*v*v;const u=rng();
    if(u<1-.0331*Math.pow(x,4))return d*v;
    if(Math.log(u)<.5*x*x+d*(1-v+Math.log(v)))return d*v;
  }
}
function infBeta(alpha,beta,rng){
  const x=infGamma(alpha,rng),y=infGamma(beta,rng);return x/(x+y);
}

function infRunBayes(){
  const priorMean=Math.min(.99,Math.max(.01,infRead("inf-bayes-prior",45)/100));
  const strength=Math.max(1,infRead("inf-bayes-strength",20));
  const wins=Math.max(0,Math.floor(infRead("inf-bayes-wins",25)));
  const losses=Math.max(0,Math.floor(infRead("inf-bayes-losses",25)));
  const reference=Math.min(.99,Math.max(.01,infRead("inf-bayes-break",40)/100));
  const payoff=Math.max(0,infRead("inf-bayes-payoff",1.5));
  const future=Math.min(1000,Math.max(10,Math.floor(infRead("inf-bayes-forecast",100))));
  const sims=Math.min(10000,Math.max(500,Math.floor(infRead("inf-bayes-sims",4000))));
  const seed=Math.max(1,Math.floor(infRead("inf-bayes-seed",60177)));
  const a0=priorMean*strength,b0=(1-priorMean)*strength;
  const a=a0+wins,b=b0+losses;
  const posteriorMean=a/(a+b);
  const sampleRate=wins+losses>0?wins/(wins+losses):NaN;
  const rng=infRng(seed),pSamples=[],predictive=[];
  for(let s=0;s<sims;s++){
    const p=infBeta(a,b,rng);pSamples.push(p);
    let total=0;
    for(let i=0;i<future;i++) total += rng()<p ? payoff : -1;
    predictive.push(total);
  }
  const p05=infQuantile(pSamples,.05),p50=infQuantile(pSamples,.5),p95=infQuantile(pSamples,.95);
  const probAbove=pSamples.filter(p=>p>reference).length/pSamples.length;
  const fixedExpectancy=posteriorMean*payoff-(1-posteriorMean);
  inf$("inf-bayes-results").innerHTML=infMetric([
    [infPick("Média do prior","Prior mean","Media del prior"),infPct(priorMean*100,1)],
    [infPick("Win rate observado","Observed win rate","Win rate observado"),Number.isFinite(sampleRate)?infPct(sampleRate*100,1):"—"],
    [infPick("Média posterior","Posterior mean","Media posterior"),infPct(posteriorMean*100,1)],
    [infPick("Intervalo posterior 90%","90% posterior interval","Intervalo posterior 90%"),`${infPct(p05*100,1)} – ${infPct(p95*100,1)}`],
    [infPick("P(p > referência)","P(p > reference)","P(p > referencia)"),infPct(probAbove*100,1)],
    ["E[R] @ posterior",`${fixedExpectancy>=0?"+":""}${infFmt(fixedExpectancy,3)}R`],
  ]);
  inf$("inf-bayes-meter").innerHTML=`<div class="inf-meter-track"><span style="left:${p05*100}%"></span><i style="left:${p50*100}%"></i><span style="left:${p95*100}%"></span></div><small>P5 · P50 · P95</small>`;
  inf$("inf-bayes-predictive").innerHTML=infMetric([
    [`P5 · ${future} trades`,`${infFmt(infQuantile(predictive,.05),1)}R`],
    [`P50 · ${future} trades`,`${infFmt(infQuantile(predictive,.50),1)}R`],
    [`P95 · ${future} trades`,`${infFmt(infQuantile(predictive,.95),1)}R`],
    [infPick("Caminhos negativos","Negative paths","Trayectorias negativas"),infPct(predictive.filter(v=>v<0).length/predictive.length*100,1)],
  ]);
  inf$("inf-bayes-explain").innerHTML=infPick(
    `Depois de incorporar ${wins+losses} trades, o win rate não virou um único número certo: a posterior central é <strong>${infPct(posteriorMean*100,1)}</strong>, com 90% das amostras bayesianas aproximadamente entre <strong>${infPct(p05*100,1)}</strong> e <strong>${infPct(p95*100,1)}</strong>. A simulação preditiva sorteia um p dessa posterior em cada caminho, levando a incerteza da estimativa para os resultados futuros.`,
    `After incorporating ${wins+losses} trades, win rate did not become one certain number: posterior mean is <strong>${infPct(posteriorMean*100,1)}</strong>, with roughly 90% of Bayesian samples between <strong>${infPct(p05*100,1)}</strong> and <strong>${infPct(p95*100,1)}</strong>. The predictive simulation draws a p from the posterior for each path, carrying estimation uncertainty into future outcomes.`,
    `Después de incorporar ${wins+losses} trades, el win rate no se convirtió en un único número cierto: la media posterior es <strong>${infPct(posteriorMean*100,1)}</strong>, con aproximadamente 90% de las muestras bayesianas entre <strong>${infPct(p05*100,1)}</strong> y <strong>${infPct(p95*100,1)}</strong>. La simulación predictiva sortea un p de la posterior en cada trayectoria, llevando la incertidumbre de estimación a los resultados futuros.`
  );
}

document.addEventListener("i18n:change",renderInferenceLab);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",renderInferenceLab,{once:true});else renderInferenceLab();
