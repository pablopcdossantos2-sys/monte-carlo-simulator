const val$ = (id) => document.getElementById(id);
const valLocale = () => window.I18N?.getLanguage?.() || "pt-BR";
const valPick = (pt,en,es) => valLocale()==="en"?en:valLocale()==="es"?es:pt;
const valFmt = (v,d=2) => new Intl.NumberFormat(valLocale(),{maximumFractionDigits:d}).format(v);
const valPct = (v,d=1) => `${valFmt(v,d)}%`;
const valEsc = (value) => String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

const valState = {
  interval: { wins: 45, losses: 55, confidence: 95, margin: 5 },
  multiple: { trueRate: 50, candidates: 50, inSample: 40, outSample: 200, repetitions: 1500, seed: 41031 },
  walk: { windows: 8, train: 60, test: 30, regimeBlock: 2, seed: 71291 },
  stability: { peakRate: 56, curvature: 0.18, trades: 80, seed: 20481 },
};

function valRng(seed){
  let a=seed>>>0;
  return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
}
function valRead(id,fallback){const n=Number(val$(id)?.value);return Number.isFinite(n)?n:fallback;}
function valField(id,label,value,min,max,step){return `<label>${valEsc(label)}<input id="${id}" type="number" value="${value}" min="${min}" max="${max}" step="${step}"></label>`;}
function valMetric(items){return items.map(([l,v])=>`<div><span>${valEsc(l)}</span><strong>${valEsc(v)}</strong></div>`).join("");}
function valQuantile(values,q){const s=[...values].sort((a,b)=>a-b);if(!s.length)return NaN;const p=(s.length-1)*q,l=Math.floor(p),h=Math.ceil(p);return l===h?s[l]:s[l]+(s[h]-s[l])*(p-l);}
function valBinomial(n,p,rng){let w=0;for(let i=0;i<n;i++)if(rng()<p)w++;return w;}

function valArticle(number,title,lead,body){
  return `<details class="concept-article"><summary><span class="concept-number">${number}</span><span><strong>${valEsc(title)}</strong><small>${valEsc(lead)}</small></span></summary><div class="concept-article__body">${body}</div></details>`;
}

function valIntervalArticle(){
  return valArticle(
    "11",
    valPick("Incerteza de estimativa e tamanho de amostra","Estimation uncertainty and sample size","Incertidumbre de estimación y tamaño de muestra"),
    valPick("Um win rate observado é uma estimativa, não o parâmetro verdadeiro.","An observed win rate is an estimate, not the true parameter.","Un win rate observado es una estimación, no el parámetro verdadero."),
    valPick(
      `<p>Se uma estratégia venceu 9 de 20 trades, observamos 45%. Mas outra amostra de 20 trades da mesma estratégia poderia produzir 35%, 50% ou 60%.</p>
      <p>Um <strong>intervalo de confiança</strong> ajuda a mostrar quanta incerteza existe ao redor da estimativa. Neste laboratório usamos o intervalo de Wilson, mais adequado para proporções do que a aproximação ingênua p ± 1,96×erro-padrão em amostras pequenas.</p>
      <div class="formula-box">mais trades → intervalo geralmente mais estreito</div>
      <p>Na interpretação frequentista, não dizemos que “há 95% de probabilidade de p estar neste intervalo” depois de observados os dados. Dizemos que o <strong>procedimento</strong>, repetido muitas vezes, cobre o verdadeiro p na proporção nominal.</p>
      <p><strong>Aplicação:</strong> antes de confiar numa diferença de poucos pontos percentuais entre duas estratégias, compare essa diferença com a incerteza gerada pelo tamanho da amostra.</p>`,
      `<p>If a strategy won 9 of 20 trades, we observed 45%. But another 20-trade sample from the same strategy could produce 35%, 50% or 60%.</p>
      <p>A <strong>confidence interval</strong> helps show uncertainty around the estimate. This lab uses the Wilson interval, which is preferable for proportions to the naive p ± 1.96×standard-error approximation in small samples.</p>
      <div class="formula-box">more trades → generally narrower interval</div>
      <p>Under the frequentist interpretation, after observing data we do not say “there is a 95% probability that p lies in this interval.” We say the <strong>procedure</strong>, under repeated sampling, covers the true p at the nominal rate.</p>
      <p><strong>Application:</strong> before trusting a few percentage points of difference between strategies, compare that difference with the uncertainty created by sample size.</p>`,
      `<p>Si una estrategia ganó 9 de 20 trades, observamos 45%. Pero otra muestra de 20 trades de la misma estrategia podría producir 35%, 50% o 60%.</p>
      <p>Un <strong>intervalo de confianza</strong> ayuda a mostrar la incertidumbre alrededor de la estimación. Este laboratorio usa el intervalo de Wilson, preferible para proporciones frente a la aproximación ingenua p ± 1,96×error estándar en muestras pequeñas.</p>
      <div class="formula-box">más trades → intervalo generalmente más estrecho</div>
      <p>En la interpretación frecuentista, después de observar los datos no decimos que “hay 95% de probabilidad de que p esté en este intervalo”. Decimos que el <strong>procedimiento</strong>, repetido muchas veces, cubre el verdadero p con la frecuencia nominal.</p>
      <p><strong>Aplicación:</strong> antes de confiar en pocos puntos porcentuales de diferencia entre estrategias, compáralos con la incertidumbre producida por el tamaño de la muestra.</p>`
    )
  );
}

function valMultipleArticle(){
  return valArticle(
    "12",
    valPick("Múltiplos testes, data snooping e overfitting","Multiple testing, data snooping and overfitting","Pruebas múltiples, data snooping y overfitting"),
    valPick("Quanto mais alternativas você testa, mais fácil encontrar um campeão por acaso.","The more alternatives you test, the easier it is to find a champion by chance.","Cuantas más alternativas pruebas, más fácil es encontrar una campeona por azar."),
    valPick(
      `<p>Imagine 100 estratégias que possuem exatamente o mesmo edge verdadeiro. Se todas forem testadas numa amostra curta, algumas parecerão extraordinárias apenas por sorte.</p>
      <p>Se escolhemos a melhor entre muitas alternativas, o resultado vencedor sofre um <strong>viés de seleção</strong>. Isso aparece em otimização de stop, alvo, horário, indicador, período e filtros.</p>
      <div class="formula-box">mais candidatos × amostra curta → maior risco de “campeão por acaso”</div>
      <p>O problema não desaparece porque o backtest foi calculado corretamente. O erro está em usar o mesmo conjunto de dados tanto para procurar quanto para confirmar a melhor configuração.</p>
      <p><strong>Monte Carlo:</strong> repetir artificialmente o processo “testar muitos → escolher o melhor → retestar” permite medir o otimismo criado pela própria seleção.</p>`,
      `<p>Imagine 100 strategies with exactly the same true edge. If all are tested on a short sample, some will look extraordinary purely by chance.</p>
      <p>Choosing the best among many alternatives creates <strong>selection bias</strong>. This appears when optimizing stops, targets, times, indicators, lookbacks and filters.</p>
      <div class="formula-box">more candidates × shorter sample → greater chance of a lucky champion</div>
      <p>The problem does not disappear because the backtest was calculated correctly. The error is using the same data both to search for and to confirm the best configuration.</p>
      <p><strong>Monte Carlo:</strong> repeatedly simulating “test many → pick best → retest” measures optimism created by selection itself.</p>`,
      `<p>Imagina 100 estrategias con exactamente el mismo edge verdadero. Si todas se prueban en una muestra corta, algunas parecerán extraordinarias solo por suerte.</p>
      <p>Elegir la mejor entre muchas alternativas crea <strong>sesgo de selección</strong>. Esto aparece al optimizar stops, objetivos, horarios, indicadores, períodos y filtros.</p>
      <div class="formula-box">más candidatos × muestra corta → mayor riesgo de una campeona afortunada</div>
      <p>El problema no desaparece porque el backtest esté bien calculado. El error consiste en usar los mismos datos tanto para buscar como para confirmar la mejor configuración.</p>
      <p><strong>Monte Carlo:</strong> repetir artificialmente “probar muchas → elegir la mejor → volver a probar” permite medir el optimismo creado por la selección.</p>`
    )
  );
}

function valOosArticle(){
  return valArticle(
    "13",
    valPick("In-sample e out-of-sample","In-sample and out-of-sample","In-sample y out-of-sample"),
    valPick("Dados usados para escolher não deveriam ser os únicos usados para confirmar.","Data used to choose should not be the only data used to confirm.","Los datos usados para elegir no deberían ser los únicos usados para confirmar."),
    valPick(
      `<p><strong>In-sample (IS)</strong> é a parte usada para desenvolver, escolher ou ajustar a estratégia. <strong>Out-of-sample (OOS)</strong> é uma parte preservada para avaliar o que acontece sem reutilizar exatamente os dados da escolha.</p>
      <p>Se uma configuração tem 70% de acerto no IS e 49% no OOS, isso não prova automaticamente que ela não funciona — mas é um forte sinal de que o desempenho inicial continha otimismo, sorte, overfitting ou mudança de regime.</p>
      <div class="formula-box">desempenho IS muito superior ao OOS = sinal para investigar</div>
      <p>O OOS também não é mágico: se for consultado repetidamente e usado para novas decisões, ele deixa de ser verdadeiramente “não visto”.</p>`,
      `<p><strong>In-sample (IS)</strong> data are used to develop, select or tune the strategy. <strong>Out-of-sample (OOS)</strong> data are preserved to evaluate what happens without reusing exactly the same selection data.</p>
      <p>If a configuration wins 70% in-sample and 49% out-of-sample, that does not automatically prove it fails — but it strongly suggests the initial result contained optimism, luck, overfitting or regime change.</p>
      <div class="formula-box">IS performance far above OOS = a signal to investigate</div>
      <p>OOS is not magical either: if repeatedly inspected and used for new decisions, it stops being truly unseen.</p>`,
      `<p>Los datos <strong>in-sample (IS)</strong> se usan para desarrollar, elegir o ajustar la estrategia. Los datos <strong>out-of-sample (OOS)</strong> se preservan para evaluar qué ocurre sin reutilizar exactamente los datos de selección.</p>
      <p>Si una configuración gana 70% en IS y 49% en OOS, eso no prueba automáticamente que no funcione, pero sugiere fuertemente que el resultado inicial contenía optimismo, suerte, overfitting o cambio de régimen.</p>
      <div class="formula-box">rendimiento IS muy superior al OOS = señal para investigar</div>
      <p>El OOS tampoco es mágico: si se consulta repetidamente y se usa para nuevas decisiones, deja de ser realmente no visto.</p>`
    )
  );
}

function valWalkArticle(){
  return valArticle(
    "14",
    valPick("Walk-forward e mudança de regime","Walk-forward and regime change","Walk-forward y cambio de régimen"),
    valPick("Validar em várias janelas é mais informativo do que uma única divisão temporal.","Validation across multiple windows is more informative than one temporal split.","Validar en varias ventanas es más informativo que una sola división temporal."),
    valPick(
      `<p>No walk-forward, uma janela passada é usada para escolher ou calibrar a estratégia; a configuração é então aplicada à janela seguinte, ainda não usada naquele ciclo. Depois a janela avança e o processo se repete.</p>
      <p>Isso aproxima a validação do processo real de atualização de um sistema ao longo do tempo e ajuda a enxergar mudanças de regime.</p>
      <div class="formula-box">treinar → testar à frente → avançar a janela → repetir</div>
      <p>Walk-forward não garante robustez. Janelas muito curtas aumentam ruído; reotimização excessiva pode continuar produzindo overfitting. O interesse está na <strong>consistência entre várias janelas OOS</strong>.</p>`,
      `<p>In walk-forward analysis, a past window is used to select or calibrate a strategy; that configuration is then applied to the next, not-yet-used window. The window advances and the process repeats.</p>
      <p>This better resembles how a system is updated over time and helps expose regime change.</p>
      <div class="formula-box">train → test forward → advance window → repeat</div>
      <p>Walk-forward does not guarantee robustness. Very short windows increase noise, and excessive reoptimization can still overfit. The important evidence is <strong>consistency across multiple OOS windows</strong>.</p>`,
      `<p>En walk-forward, una ventana pasada se usa para elegir o calibrar la estrategia; esa configuración se aplica después a la siguiente ventana aún no utilizada. Luego la ventana avanza y el proceso se repite.</p>
      <p>Esto se parece más al proceso real de actualización de un sistema a lo largo del tiempo y ayuda a mostrar cambios de régimen.</p>
      <div class="formula-box">entrenar → probar hacia adelante → avanzar ventana → repetir</div>
      <p>Walk-forward no garantiza robustez. Ventanas muy cortas aumentan el ruido y una reoptimización excesiva puede seguir generando overfitting. La evidencia importante es la <strong>consistencia entre varias ventanas OOS</strong>.</p>`
    )
  );
}

function valStabilityArticle(){
  return valArticle(
    "15",
    valPick("Estabilidade de parâmetros: platô versus pico","Parameter stability: plateau versus spike","Estabilidad de parámetros: meseta versus pico"),
    valPick("Uma configuração robusta costuma ter vizinhos razoáveis, não apenas um ponto mágico.","A robust configuration often has reasonable neighbors, not just one magic point.","Una configuración robusta suele tener vecinos razonables, no solo un punto mágico."),
    valPick(
      `<p>Se o melhor resultado aparece apenas no parâmetro 17, enquanto 16 e 18 são ruins, pode existir um <strong>pico estreito</strong> provocado por ruído ou ajuste excessivo.</p>
      <p>Quando uma faixa de parâmetros vizinhos apresenta desempenho semelhante, temos um <strong>platô</strong>. Isso não prova que o sistema seja bom, mas normalmente é um sinal mais confortável de estabilidade.</p>
      <div class="formula-box">robustez ≠ encontrar o máximo; robustez inclui tolerar pequenas mudanças</div>
      <p>A ferramenta abaixo conhece o “terreno verdadeiro” porque ele é sintético. Assim podemos ver como uma amostra curta pode deslocar o melhor parâmetro observado para longe do ótimo real.</p>`,
      `<p>If the best result appears only at parameter 17 while 16 and 18 are poor, there may be a <strong>narrow spike</strong> caused by noise or overfitting.</p>
      <p>When a range of neighboring parameters performs similarly, we have a <strong>plateau</strong>. This does not prove the system is good, but it is generally a more comfortable sign of stability.</p>
      <div class="formula-box">robustness ≠ finding the maximum; robustness includes tolerating small changes</div>
      <p>The tool below knows the “true landscape” because it is synthetic. This lets us see how a short sample can move the observed best parameter away from the true optimum.</p>`,
      `<p>Si el mejor resultado aparece solo en el parámetro 17 mientras 16 y 18 son malos, puede existir un <strong>pico estrecho</strong> provocado por ruido u overfitting.</p>
      <p>Cuando una franja de parámetros vecinos presenta rendimiento similar, tenemos una <strong>meseta</strong>. Esto no prueba que el sistema sea bueno, pero suele ser una señal más cómoda de estabilidad.</p>
      <div class="formula-box">robustez ≠ encontrar el máximo; robustez incluye tolerar pequeños cambios</div>
      <p>La herramienta inferior conoce el “terreno verdadero” porque es sintético. Así podemos ver cómo una muestra corta puede desplazar el mejor parámetro observado lejos del óptimo real.</p>`
    )
  );
}

function valIntervalTool(){
  const s=valState.interval;
  return `<article class="edu-tool">
    <div class="edu-tool__head"><span class="tool-number">11</span><div><h4>${valEsc(valPick("Intervalo de Win Rate e Tamanho de Amostra","Win-Rate Interval and Sample Size","Intervalo de Win Rate y Tamaño de Muestra"))}</h4><p>${valEsc(valPick("Meça a incerteza da taxa de acerto observada e estime quantos trades seriam necessários para uma margem desejada.","Measure uncertainty around observed win rate and estimate the sample needed for a target margin.","Mide la incertidumbre de la tasa observada y estima cuántos trades se necesitarían para un margen objetivo."))}</p></div></div>
    <div class="edu-form cols-3">
      ${valField("val-int-wins",valPick("Vitórias","Wins","Victorias"),s.wins,0,100000,1)}
      ${valField("val-int-losses",valPick("Perdas","Losses","Pérdidas"),s.losses,0,100000,1)}
      <label>${valEsc(valPick("Nível de confiança","Confidence level","Nivel de confianza"))}<select id="val-int-confidence"><option value="90">90%</option><option value="95" selected>95%</option><option value="99">99%</option></select></label>
      ${valField("val-int-margin",valPick("Margem desejada (p.p.)","Target margin (p.p.)","Margen objetivo (p.p.)"),s.margin,.5,25,.5)}
    </div>
    <div id="val-int-results" class="edu-results"></div>
    <div id="val-int-meter" class="val-interval-meter"></div>
    <div id="val-int-explain" class="edu-explain"></div>
  </article>`;
}

function valMultipleTool(){
  const s=valState.multiple;
  return `<article class="edu-tool edu-tool--wide">
    <div class="edu-tool__head"><span class="tool-number">12</span><div><h4>${valEsc(valPick("Armadilha dos Múltiplos Testes","Multiple-Testing Trap","Trampa de las Pruebas Múltiples"))}</h4><p>${valEsc(valPick("Todas as estratégias terão o mesmo win rate verdadeiro. A única diferença entre elas será sorte amostral.","All strategies have the same true win rate. Their only difference is sampling luck.","Todas las estrategias tendrán el mismo win rate verdadero. La única diferencia será la suerte muestral."))}</p></div></div>
    <div class="edu-form cols-3">
      ${valField("val-mul-rate",valPick("Win rate verdadeiro (%)","True win rate (%)","Win rate verdadero (%)"),s.trueRate,1,99,.1)}
      ${valField("val-mul-candidates",valPick("Configurações testadas","Configurations tested","Configuraciones probadas"),s.candidates,2,500,1)}
      ${valField("val-mul-is",valPick("Trades in-sample por configuração","In-sample trades per configuration","Trades in-sample por configuración"),s.inSample,5,500,5)}
      ${valField("val-mul-oos",valPick("Trades out-of-sample","Out-of-sample trades","Trades out-of-sample"),s.outSample,20,2000,10)}
      ${valField("val-mul-reps",valPick("Experimentos Monte Carlo","Monte Carlo experiments","Experimentos Monte Carlo"),s.repetitions,200,5000,100)}
      ${valField("val-mul-seed",valPick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions"><button id="val-mul-run" class="primary">${valEsc(valPick("Simular seleção e reteste","Simulate selection and retest","Simular selección y retest"))}</button></div>
    <div id="val-mul-results" class="edu-results"></div>
    <div id="val-mul-explain" class="edu-explain"></div>
  </article>`;
}

function valWalkTool(){
  const s=valState.walk;
  return `<article class="edu-tool edu-tool--wide">
    <div class="edu-tool__head"><span class="tool-number">14</span><div><h4>${valEsc(valPick("Laboratório Walk-Forward com Regimes","Walk-Forward Regime Lab","Laboratorio Walk-Forward con Regímenes"))}</h4><p>${valEsc(valPick("Três configurações sintéticas reagem de formas diferentes a dois regimes de mercado.","Three synthetic configurations react differently to two market regimes.","Tres configuraciones sintéticas reaccionan de forma distinta a dos regímenes de mercado."))}</p></div></div>
    <div class="val-regime-legend">
      <span><strong>Fast:</strong> A 58% · B 42%</span>
      <span><strong>Balanced:</strong> A 52% · B 52%</span>
      <span><strong>Slow:</strong> A 44% · B 57%</span>
    </div>
    <div class="edu-form cols-3">
      ${valField("val-walk-windows",valPick("Janelas OOS","OOS windows","Ventanas OOS"),s.windows,4,20,1)}
      ${valField("val-walk-train",valPick("Trades de treino por janela","Training trades per window","Trades de entrenamiento por ventana"),s.train,20,500,10)}
      ${valField("val-walk-test",valPick("Trades OOS por janela","OOS trades per window","Trades OOS por ventana"),s.test,10,300,5)}
      ${valField("val-walk-block",valPick("Janelas por regime","Windows per regime","Ventanas por régimen"),s.regimeBlock,1,10,1)}
      ${valField("val-walk-seed",valPick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions"><button id="val-walk-run" class="primary">${valEsc(valPick("Executar walk-forward","Run walk-forward","Ejecutar walk-forward"))}</button></div>
    <div id="val-walk-results" class="edu-results"></div>
    <div id="val-walk-table"></div>
    <div id="val-walk-explain" class="edu-explain"></div>
  </article>`;
}

function valStabilityTool(){
  const s=valState.stability;
  return `<article class="edu-tool edu-tool--wide">
    <div class="edu-tool__head"><span class="tool-number">15</span><div><h4>${valEsc(valPick("Mapa de Estabilidade de Parâmetros","Parameter Stability Map","Mapa de Estabilidad de Parámetros"))}</h4><p>${valEsc(valPick("Compare o desempenho verdadeiro sintético com o resultado observado em uma amostra limitada.","Compare a synthetic true landscape with the observed result from a limited sample.","Compara el terreno verdadero sintético con el resultado observado en una muestra limitada."))}</p></div></div>
    <div class="edu-form cols-3">
      ${valField("val-stab-peak",valPick("Win rate no ótimo verdadeiro (%)","Win rate at true optimum (%)","Win rate en óptimo verdadero (%)"),s.peakRate,40,80,.1)}
      ${valField("val-stab-curvature",valPick("Curvatura / sensibilidade","Curvature / sensitivity","Curvatura / sensibilidad"),s.curvature,.02,1,.02)}
      ${valField("val-stab-trades",valPick("Trades por parâmetro","Trades per parameter","Trades por parámetro"),s.trades,10,1000,10)}
      ${valField("val-stab-seed",valPick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions"><button id="val-stab-run" class="primary">${valEsc(valPick("Gerar mapa de parâmetros","Generate parameter map","Generar mapa de parámetros"))}</button></div>
    <div id="val-stab-results" class="edu-results"></div>
    <div id="val-stab-map" class="val-parameter-map"></div>
    <div id="val-stab-explain" class="edu-explain"></div>
  </article>`;
}

function renderValidationLab(){
  const root=val$("validation-root");if(!root)return;
  root.innerHTML=`
    <div class="education-head">
      <div>
        <p class="eyebrow">${valEsc(valPick("VALIDAÇÃO DE ESTRATÉGIAS","STRATEGY VALIDATION","VALIDACIÓN DE ESTRATEGIAS"))}</p>
        <h2>${valEsc(valPick("Incerteza, Overfitting, Out-of-Sample e Robustez","Uncertainty, Overfitting, Out-of-Sample and Robustness","Incertidumbre, Overfitting, Out-of-Sample y Robustez"))}</h2>
        <p class="section-explain">${valEsc(valPick(
          "Este bloco ensina por que um backtest excelente não basta. O foco passa a ser a qualidade da evidência: tamanho da amostra, seleção entre alternativas, repetibilidade fora da amostra e estabilidade dos parâmetros.",
          "This block explains why an excellent backtest is not enough. The focus shifts to evidence quality: sample size, selection among alternatives, out-of-sample repeatability and parameter stability.",
          "Este bloque enseña por qué un backtest excelente no basta. El foco pasa a la calidad de la evidencia: tamaño de muestra, selección entre alternativas, repetibilidad fuera de muestra y estabilidad de parámetros."
        ))}</p>
      </div>
      <div class="education-path">
        <span>11 · ${valEsc(valPick("Intervalo","Interval","Intervalo"))}</span>
        <span>12 · Overfitting</span>
        <span>13 · OOS</span>
        <span>14 · Walk-forward</span>
        <span>15 · ${valEsc(valPick("Estabilidade","Stability","Estabilidad"))}</span>
      </div>
    </div>
    <div class="article-grid">
      ${valIntervalArticle()}
      ${valMultipleArticle()}
      ${valOosArticle()}
      ${valWalkArticle()}
      ${valStabilityArticle()}
    </div>
    <div class="education-tools-intro"><p class="eyebrow">${valEsc(valPick("LABORATÓRIOS DE VALIDAÇÃO","VALIDATION LABS","LABORATORIOS DE VALIDACIÓN"))}</p><h3>${valEsc(valPick("Teste a evidência, não apenas o resultado","Test the evidence, not just the result","Prueba la evidencia, no solo el resultado"))}</h3></div>
    <div class="education-tools">
      ${valIntervalTool()}
      ${valMultipleTool()}
      ${valWalkTool()}
      ${valStabilityTool()}
    </div>
  `;
  ["val-int-wins","val-int-losses","val-int-margin"].forEach(id=>val$(id)?.addEventListener("input",valUpdateInterval));
  val$("val-int-confidence")?.addEventListener("change",valUpdateInterval);
  val$("val-mul-run")?.addEventListener("click",valRunMultiple);
  val$("val-walk-run")?.addEventListener("click",valRunWalk);
  val$("val-stab-run")?.addEventListener("click",valRunStability);
  valUpdateInterval();
  valRunMultiple();
  valRunWalk();
  valRunStability();
}

function valZ(level){
  return Number(level)>=99?2.575829:Number(level)>=95?1.959964:1.644854;
}
function valWilson(wins,n,z){
  if(n<=0)return {low:0,high:1,center:0};
  const p=wins/n, z2=z*z, denom=1+z2/n;
  const center=(p+z2/(2*n))/denom;
  const half=z*Math.sqrt(p*(1-p)/n+z2/(4*n*n))/denom;
  return {low:Math.max(0,center-half),high:Math.min(1,center+half),center};
}
function valUpdateInterval(){
  const wins=Math.max(0,Math.floor(valRead("val-int-wins",45)));
  const losses=Math.max(0,Math.floor(valRead("val-int-losses",55)));
  const n=wins+losses, conf=Number(val$("val-int-confidence")?.value||95), z=valZ(conf);
  const p=n?wins/n:0, margin=Math.max(.005,valRead("val-int-margin",5)/100);
  const ci=valWilson(wins,n,z);
  const nEst=Math.ceil(z*z*Math.max(.0001,p*(1-p))/(margin*margin));
  const nWorst=Math.ceil(z*z*.25/(margin*margin));
  val$("val-int-results").innerHTML=valMetric([
    [valPick("Win rate observado","Observed win rate","Win rate observado"),n?valPct(p*100,1):"—"],
    [`${conf}% Wilson`,n?`${valPct(ci.low*100,1)} – ${valPct(ci.high*100,1)}`:"—"],
    [valPick("Largura do intervalo","Interval width","Anchura del intervalo"),n?valFmt((ci.high-ci.low)*100,1)+" p.p.":"—"],
    [valPick("n aprox. para margem desejada","Approx. n for target margin","n aprox. para margen objetivo"),String(nEst)],
    [valPick("n conservador (p=50%)","Conservative n (p=50%)","n conservador (p=50%)"),String(nWorst)],
  ]);
  val$("val-int-meter").innerHTML=n?`<div class="val-meter-line"><span style="left:${ci.low*100}%"></span><i style="left:${p*100}%"></i><span style="left:${ci.high*100}%"></span></div><small>${valPct(ci.low*100,1)} · ${valPct(p*100,1)} · ${valPct(ci.high*100,1)}</small>`:"";
  val$("val-int-explain").innerHTML=valPick(
    n<30
      ? `A amostra possui apenas <strong>${n} trades</strong>; o intervalo continua largo. Isso é um lembrete visual de que uma taxa observada em poucas operações pode se mover bastante em novas amostras.`
      : `Com <strong>${n} trades</strong>, a faixa de valores compatíveis ainda mede cerca de <strong>${valFmt((ci.high-ci.low)*100,1)} p.p.</strong>. Para uma margem aproximada de ±${valFmt(margin*100,1)} p.p., a fórmula simples sugere algo perto de ${nEst} trades usando o p observado.`,
    n<30
      ? `The sample contains only <strong>${n} trades</strong>; the interval remains wide. This visually reminds us that a win rate observed over few trades can move substantially in new samples.`
      : `With <strong>${n} trades</strong>, the compatible range is still about <strong>${valFmt((ci.high-ci.low)*100,1)} percentage points</strong> wide. For an approximate ±${valFmt(margin*100,1)} p.p. margin, the simple formula suggests around ${nEst} trades using observed p.`,
    n<30
      ? `La muestra contiene solo <strong>${n} trades</strong>; el intervalo sigue siendo amplio. Esto recuerda visualmente que una tasa observada en pocas operaciones puede cambiar mucho en nuevas muestras.`
      : `Con <strong>${n} trades</strong>, la franja de valores compatibles todavía mide cerca de <strong>${valFmt((ci.high-ci.low)*100,1)} p.p.</strong>. Para un margen aproximado de ±${valFmt(margin*100,1)} p.p., la fórmula simple sugiere unos ${nEst} trades usando el p observado.`
  );
}

function valRunMultiple(){
  const p=Math.min(.99,Math.max(.01,valRead("val-mul-rate",50)/100));
  const candidates=Math.min(500,Math.max(2,Math.floor(valRead("val-mul-candidates",50))));
  const nIS=Math.min(500,Math.max(5,Math.floor(valRead("val-mul-is",40))));
  const nOOS=Math.min(2000,Math.max(20,Math.floor(valRead("val-mul-oos",200))));
  const reps=Math.min(5000,Math.max(200,Math.floor(valRead("val-mul-reps",1500))));
  const seed=Math.max(1,Math.floor(valRead("val-mul-seed",41031)));
  const rng=valRng(seed),bestIS=[],oos=[],gaps=[];
  let beat60=0,oosBelowTrue=0;
  for(let r=0;r<reps;r++){
    let bestRate=-1;
    for(let c=0;c<candidates;c++){
      const rate=valBinomial(nIS,p,rng)/nIS;
      if(rate>bestRate)bestRate=rate;
    }
    const out=valBinomial(nOOS,p,rng)/nOOS;
    bestIS.push(bestRate);oos.push(out);gaps.push(bestRate-out);
    if(bestRate>=.60)beat60++;
    if(out<p)oosBelowTrue++;
  }
  const avg=a=>a.reduce((s,v)=>s+v,0)/a.length;
  val$("val-mul-results").innerHTML=valMetric([
    [valPick("Win rate verdadeiro","True win rate","Win rate verdadero"),valPct(p*100,1)],
    [valPick("Campeã IS · média","IS champion · average","Campeona IS · media"),valPct(avg(bestIS)*100,1)],
    [valPick("Mesma campeã OOS · média","Same champion OOS · average","Misma campeona OOS · media"),valPct(avg(oos)*100,1)],
    [valPick("Otimismo médio IS−OOS","Average IS−OOS optimism","Optimismo medio IS−OOS"),valFmt(avg(gaps)*100,1)+" p.p."],
    [valPick("P(campeã IS ≥ 60%)","P(IS champion ≥ 60%)","P(campeona IS ≥ 60%)"),valPct(beat60/reps*100,1)],
    [valPick("P95 da campeã IS","P95 of IS champion","P95 de campeona IS"),valPct(valQuantile(bestIS,.95)*100,1)],
  ]);
  val$("val-mul-explain").innerHTML=valPick(
    `Todas as ${candidates} configurações tinham exatamente <strong>${valPct(p*100,1)}</strong> de win rate verdadeiro. Mesmo assim, escolher a melhor entre elas elevou o resultado IS médio para <strong>${valPct(avg(bestIS)*100,1)}</strong>. No OOS, a mesma “campeã” voltou em média para <strong>${valPct(avg(oos)*100,1)}</strong>. Isso é viés de seleção em ação — não uma falha do cálculo do backtest.`,
    `All ${candidates} configurations had exactly <strong>${valPct(p*100,1)}</strong> true win rate. Yet selecting the best pushed average IS performance to <strong>${valPct(avg(bestIS)*100,1)}</strong>. OOS, the same “champion” returned on average to <strong>${valPct(avg(oos)*100,1)}</strong>. This is selection bias in action — not an error in backtest arithmetic.`,
    `Las ${candidates} configuraciones tenían exactamente <strong>${valPct(p*100,1)}</strong> de win rate verdadero. Aun así, elegir la mejor elevó el resultado IS medio a <strong>${valPct(avg(bestIS)*100,1)}</strong>. En OOS, la misma “campeona” volvió en promedio a <strong>${valPct(avg(oos)*100,1)}</strong>. Esto es sesgo de selección en acción, no un error del cálculo del backtest.`
  );
}

const VAL_STRATEGIES=[
  {name:"Fast",A:.58,B:.42},
  {name:"Balanced",A:.52,B:.52},
  {name:"Slow",A:.44,B:.57},
];
function valRunWalk(){
  const windows=Math.min(20,Math.max(4,Math.floor(valRead("val-walk-windows",8))));
  const train=Math.min(500,Math.max(20,Math.floor(valRead("val-walk-train",60))));
  const test=Math.min(300,Math.max(10,Math.floor(valRead("val-walk-test",30))));
  const block=Math.min(10,Math.max(1,Math.floor(valRead("val-walk-block",2))));
  const seed=Math.max(1,Math.floor(valRead("val-walk-seed",71291)));
  const rng=valRng(seed);
  const rows=[];
  let wfWins=0,staticWins=0,oracleWins=0,total=0,switches=0,last=null,staticChoice=null;
  for(let w=0;w<windows;w++){
    const regime=(Math.floor(w/block)%2===0)?"A":"B";
    const training=VAL_STRATEGIES.map(s=>({s,wins:valBinomial(train,s[regime],rng)}));
    training.sort((x,y)=>y.wins-x.wins);
    const choice=training[0].s;
    if(staticChoice===null) staticChoice=choice;
    if(last && choice.name!==last) switches++;
    last=choice.name;
    const oracle=[...VAL_STRATEGIES].sort((a,b)=>b[regime]-a[regime])[0];
    const wf=valBinomial(test,choice[regime],rng);
    const st=valBinomial(test,staticChoice[regime],rng);
    const or=valBinomial(test,oracle[regime],rng);
    wfWins+=wf;staticWins+=st;oracleWins+=or;total+=test;
    rows.push({w:w+1,regime,choice:choice.name,trainRate:training[0].wins/train,wf:wf/test,static:st/test,oracle:or/test});
  }
  val$("val-walk-results").innerHTML=valMetric([
    [valPick("Walk-forward OOS","Walk-forward OOS","Walk-forward OOS"),valPct(wfWins/total*100,1)],
    [valPick("Configuração estática OOS","Static configuration OOS","Configuración estática OOS"),valPct(staticWins/total*100,1)],
    [valPick("Oracle teórico OOS","Theoretical oracle OOS","Oracle teórico OOS"),valPct(oracleWins/total*100,1)],
    [valPick("Trocas de configuração","Configuration switches","Cambios de configuración"),String(switches)],
    [valPick("Configuração estática","Static configuration","Configuración estática"),staticChoice.name],
  ]);
  val$("val-walk-table").innerHTML=`<div class="table-scroll"><table class="lesson-comparison"><thead><tr><th>${valEsc(valPick("Janela","Window","Ventana"))}</th><th>${valEsc(valPick("Regime","Regime","Régimen"))}</th><th>${valEsc(valPick("Escolhida no treino","Chosen in training","Elegida en entrenamiento"))}</th><th>Train</th><th>WF OOS</th><th>Static OOS</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.w}</td><td>${r.regime}</td><td>${r.choice}</td><td>${valPct(r.trainRate*100,0)}</td><td>${valPct(r.wf*100,0)}</td><td>${valPct(r.static*100,0)}</td></tr>`).join("")}</tbody></table></div>`;
  val$("val-walk-explain").innerHTML=valPick(
    `Os regimes alternam a cada ${block} janela(s). A estratégia Fast favorece A, Slow favorece B e Balanced é estável. O walk-forward escolhe pela amostra de treino de cada janela, portanto pode adaptar-se — mas também pode escolher errado por ruído. Compare a consistência OOS, não apenas o melhor número agregado.`,
    `Regimes alternate every ${block} window(s). Fast favors A, Slow favors B and Balanced is stable. Walk-forward selects from each window's training sample, so it can adapt — but it can also choose incorrectly because of noise. Compare OOS consistency, not only the best aggregate number.`,
    `Los regímenes alternan cada ${block} ventana(s). Fast favorece A, Slow favorece B y Balanced es estable. Walk-forward elige usando la muestra de entrenamiento de cada ventana, por lo que puede adaptarse, pero también equivocarse por ruido. Compara la consistencia OOS, no solo el mejor número agregado.`
  );
}

function valRunStability(){
  const peak=Math.min(.80,Math.max(.40,valRead("val-stab-peak",56)/100));
  const curvature=Math.min(1,Math.max(.02,valRead("val-stab-curvature",.18)));
  const trades=Math.min(1000,Math.max(10,Math.floor(valRead("val-stab-trades",80))));
  const seed=Math.max(1,Math.floor(valRead("val-stab-seed",20481)));
  const rng=valRng(seed),center=11,rows=[];
  for(let param=1;param<=21;param++){
    const d=param-center;
    const trueP=Math.max(.05,peak-(curvature/100)*d*d);
    const observed=valBinomial(trades,trueP,rng)/trades;
    rows.push({param,trueP,observed});
  }
  const best=[...rows].sort((a,b)=>b.observed-a.observed)[0];
  const near=rows.filter(r=>Math.abs(r.param-best.param)<=2);
  const neighborAvg=near.reduce((a,r)=>a+r.observed,0)/near.length;
  const plateau=rows.filter(r=>peak-r.trueP<=.01).length;
  val$("val-stab-results").innerHTML=valMetric([
    [valPick("Ótimo verdadeiro","True optimum","Óptimo verdadero"),"11"],
    [valPick("Melhor observado","Observed best","Mejor observado"),String(best.param)],
    [valPick("Win rate observado do melhor","Observed win rate of best","Win rate observado del mejor"),valPct(best.observed*100,1)],
    [valPick("Média dos vizinhos ±2","Neighbor average ±2","Media de vecinos ±2"),valPct(neighborAvg*100,1)],
    [valPick("Parâmetros no platô verdadeiro (≤1 p.p.)","Parameters in true plateau (≤1 p.p.)","Parámetros en meseta verdadera (≤1 p.p.)"),String(plateau)],
  ]);
  const maxObs=Math.max(...rows.map(r=>r.observed)),maxTrue=Math.max(...rows.map(r=>r.trueP));
  val$("val-stab-map").innerHTML=rows.map(r=>`<div class="val-param-row ${r.param===best.param?"best":""}"><small>${r.param}</small><div class="val-param-bars"><span class="true" style="width:${r.trueP/maxTrue*100}%"></span><i class="observed" style="width:${r.observed/maxObs*100}%"></i></div><b>${valPct(r.observed*100,0)}</b></div>`).join("");
  const offset=Math.abs(best.param-center);
  val$("val-stab-explain").innerHTML=valPick(
    `O parâmetro verdadeiro ótimo é 11, mas a amostra escolheu <strong>${best.param}</strong> (${offset} passo(s) de distância). A barra fina representa a superfície verdadeira sintética e a barra forte o resultado observado. Aumente o número de trades para reduzir ruído; aumente a curvatura para transformar o platô em um pico mais sensível.`,
    `The true optimum is parameter 11, but the sample selected <strong>${best.param}</strong> (${offset} step(s) away). The thin bar represents the synthetic true surface and the stronger bar the observed result. Increase trades to reduce noise; increase curvature to turn the plateau into a more sensitive spike.`,
    `El óptimo verdadero es el parámetro 11, pero la muestra eligió <strong>${best.param}</strong> (a ${offset} paso(s)). La barra fina representa la superficie verdadera sintética y la barra fuerte el resultado observado. Aumenta los trades para reducir ruido; aumenta la curvatura para transformar la meseta en un pico más sensible.`
  );
}

document.addEventListener("i18n:change",renderValidationLab);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",renderValidationLab,{once:true});else renderValidationLab();
