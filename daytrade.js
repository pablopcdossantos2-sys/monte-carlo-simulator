const dt$ = (id) => document.getElementById(id);
const dtLocale = () => window.I18N?.getLanguage?.() || "pt-BR";
const dtPick = (pt,en,es) => dtLocale()==="en"?en:dtLocale()==="es"?es:pt;
const dtFmt = (v,d=2) => new Intl.NumberFormat(dtLocale(),{maximumFractionDigits:d}).format(v);
const dtPct = (v,d=1) => `${dtFmt(v,d)}%`;
const dtEsc = (value) => String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

const dtState={
  session:{winRate:45,rr:1.5,tradesDay:4,days:60,sims:2500,seed:8162},
  overtrade:{winRate:48,rr:1.35,deterioration:2,maxTrades:8,sims:2200,seed:7718},
  stop:{winRate:45,rr:1.5,maxTrades:6,stopR:3,days:3000,seed:5321},
  costs:{winRate:48,rr:1.35,costR:.05,tradesDay:5,days:20},
  bootstrap:{days:60,sims:3000,seed:9127},
  coin:{stopR:1,winR:2,costR:.05,trades:100,sims:3000,seed:5050},
};

const DT_SAMPLE_DAYS=[
  1.4,-1.0,.8,2.2,-.6,1.1,-1.8,.5,1.7,-.9,0.3,2.5,-1.1,.7,-.4,1.6,-2.0,.9,1.2,-.7,
  0.6,-1.3,1.9,.4,-.8,1.5,-1.0,2.1,.2,-.5,1.3,-1.6,.8,1.0,-.9,1.8,-.3,.6,-1.2,2.4
];

function dtRng(seed){
  let a=seed>>>0;
  return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
}
function dtRead(id,fallback){const n=Number(dt$(id)?.value);return Number.isFinite(n)?n:fallback;}
function dtField(id,label,value,min,max,step){return `<label>${dtEsc(label)}<input id="${id}" type="number" value="${value}" min="${min}" max="${max}" step="${step}"></label>`;}
function dtMetric(items){return items.map(([l,v])=>`<div><span>${dtEsc(l)}</span><strong>${dtEsc(v)}</strong></div>`).join("");}
function dtQuantile(values,q){if(!values.length)return NaN;const s=[...values].sort((a,b)=>a-b),p=(s.length-1)*q,l=Math.floor(p),h=Math.ceil(p);return l===h?s[l]:s[l]+(s[h]-s[l])*(p-l);}
function dtTrade(p,rr,rng){return rng()<p?rr:-1;}
function dtLongestNegativeStreak(values){let best=0,cur=0;for(const v of values){if(v<0){cur++;best=Math.max(best,cur);}else cur=0;}return best;}
function dtMaxDrawdown(values){let eq=0,peak=0,worst=0;for(const v of values){eq+=v;peak=Math.max(peak,eq);worst=Math.max(worst,peak-eq);}return worst;}
function dtMaxUnderwater(values){
  let eq=0,peak=0,current=0,worst=0;
  for(const v of values){
    eq+=v;
    if(eq>=peak){peak=eq;current=0;}
    else {current++;worst=Math.max(worst,current);}
  }
  return worst;
}

function dtArticle(number,title,lead,body){
  return `<details class="concept-article"><summary><span class="concept-number">${number}</span><span><strong>${dtEsc(title)}</strong><small>${dtEsc(lead)}</small></span></summary><div class="concept-article__body">${body}</div></details>`;
}

function dtArticles(){
  return [
    dtArticle("16",dtPick("O pregão como unidade de análise","The session as the unit of analysis","La sesión como unidad de análisis"),
      dtPick("No day trade, trades pertencem a dias — e isso contém informação.","In day trading, trades belong to sessions — and that contains information.","En day trading, los trades pertenecen a sesiones, y eso contiene información."),
      dtPick(
        `<p>Uma sequência de 200 trades perde informação quando ignoramos quais operações ocorreram no mesmo pregão. Para um day trader, a hierarquia útil é <strong>trade → pregão → semana → distribuição de pregões</strong>.</p><p>Isso permite estudar P&L diário, losing days, stop diário, giveback e recuperação em número de sessões.</p><div class="formula-box">Monte Carlo por pregão ≠ apenas Monte Carlo por trade</div><p>Ao reamostrar pregões inteiros, preservamos dentro de cada dia a combinação original de trades, custos e contexto daquela sessão.</p>`,
        `<p>A sequence of 200 trades loses information when we ignore which trades occurred in the same session. For a day trader, a useful hierarchy is <strong>trade → session → week → distribution of sessions</strong>.</p><p>This enables analysis of daily P&L, losing days, daily stops, giveback and recovery measured in sessions.</p><div class="formula-box">session Monte Carlo ≠ only trade Monte Carlo</div><p>Resampling whole sessions preserves the original within-day combination of trades, costs and context.</p>`,
        `<p>Una secuencia de 200 trades pierde información cuando ignoramos qué operaciones ocurrieron en la misma sesión. Para un day trader, una jerarquía útil es <strong>trade → sesión → semana → distribución de sesiones</strong>.</p><p>Esto permite estudiar P&L diario, losing days, stop diario, giveback y recuperación en número de sesiones.</p><div class="formula-box">Monte Carlo por sesión ≠ solo Monte Carlo por trade</div><p>Al remuestrear sesiones completas preservamos la combinación intradía original de trades, costes y contexto.</p>`
      )),
    dtArticle("17",dtPick("Horário e expectativa intradiária","Time-of-day and intraday expectancy","Horario y expectativa intradía"),
      dtPick("Uma expectativa global pode esconder uma faixa horária negativa.","Overall expectancy can hide a negative time window.","Una expectativa global puede ocultar una franja horaria negativa."),
      dtPick(
        `<p>Abertura, meio da manhã, almoço e tarde podem ter liquidez, volatilidade e comportamento diferentes. Por isso, <strong>E[R|horário]</strong> pode ser mais útil do que um único E[R] global.</p><p>Separar horários também ajuda a detectar overtrading tardio: a estratégia pode ser positiva até 11h e negativa depois disso.</p>`,
        `<p>The open, mid-morning, lunch and afternoon can have different liquidity, volatility and behavior. Therefore <strong>E[R|time window]</strong> may be more useful than one overall E[R].</p><p>Time segmentation also helps detect late-session overtrading: a strategy can be positive before 11:00 and negative afterward.</p>`,
        `<p>La apertura, media mañana, almuerzo y tarde pueden tener distinta liquidez, volatilidad y comportamiento. Por eso <strong>E[R|franja horaria]</strong> puede ser más útil que un único E[R] global.</p><p>Separar horarios también ayuda a detectar overtrading tardío: una estrategia puede ser positiva antes de las 11:00 y negativa después.</p>`
      )),
    dtArticle("18",dtPick("MFE, MAE e eficiência da saída","MFE, MAE and exit efficiency","MFE, MAE y eficiencia de salida"),
      dtPick("Resultado final não conta toda a história do trade.","Final P&L does not tell the whole trade story.","El resultado final no cuenta toda la historia del trade."),
      dtPick(
        `<p><strong>MFE</strong> mede o máximo movimento favorável enquanto o trade esteve aberto. <strong>MAE</strong> mede o máximo movimento adverso.</p><p>Comparar MFE, MAE e resultado realizado ajuda a responder: o stop está apertado? o alvo é irrealista? quanto do movimento favorável é devolvido antes da saída?</p><div class="formula-box">captura ≈ resultado realizado / MFE</div><p>Essa razão deve ser interpretada com cuidado e principalmente em trades vencedores; ela não substitui análise do caminho intratrade.</p>`,
        `<p><strong>MFE</strong> is the maximum favorable excursion while the trade was open. <strong>MAE</strong> is the maximum adverse excursion.</p><p>Comparing MFE, MAE and realized P&L helps answer: is the stop too tight? is the target unrealistic? how much favorable movement is given back before exit?</p><div class="formula-box">capture ≈ realized result / MFE</div><p>Use this ratio carefully, mainly for winning trades; it does not replace analysis of the intratrade path.</p>`,
        `<p><strong>MFE</strong> es la máxima excursión favorable mientras el trade estuvo abierto. <strong>MAE</strong> es la máxima excursión adversa.</p><p>Comparar MFE, MAE y resultado realizado ayuda a responder: ¿el stop es demasiado ajustado? ¿el objetivo es irrealista? ¿cuánto movimiento favorable se devuelve antes de salir?</p><div class="formula-box">captura ≈ resultado realizado / MFE</div><p>Esta razón debe interpretarse con cuidado, sobre todo en trades ganadores; no sustituye el análisis del camino intratrade.</p>`
      )),
    dtArticle("19",dtPick("Overtrading e deterioração ao longo do dia","Overtrading and intraday deterioration","Overtrading y deterioro intradía"),
      dtPick("Mais trades não significam necessariamente mais oportunidade.","More trades do not necessarily mean more opportunity.","Más trades no significan necesariamente más oportunidad."),
      dtPick(
        `<p>O 1º e o 2º trade podem ocorrer nos melhores setups, enquanto operações posteriores podem surgir de tédio, recuperação de prejuízo ou redução da qualidade do contexto.</p><p>Por isso é útil medir <strong>expectância por número ordinal do trade</strong>: 1º, 2º, 3º, 4º...</p><p>Um limite de trades só faz sentido se for apoiado por dados e comportamento; não existe número universal.</p>`,
        `<p>The 1st and 2nd trades may occur on the best setups, while later trades can come from boredom, loss recovery or weaker context.</p><p>It is therefore useful to measure <strong>expectancy by trade number</strong>: 1st, 2nd, 3rd, 4th...</p><p>A trade limit only makes sense when supported by data and behavior; there is no universal number.</p>`,
        `<p>El 1º y 2º trade pueden ocurrir en los mejores setups, mientras operaciones posteriores pueden surgir por aburrimiento, recuperación de pérdidas o peor contexto.</p><p>Por eso conviene medir la <strong>expectativa por número ordinal del trade</strong>: 1º, 2º, 3º, 4º...</p><p>Un límite de trades solo tiene sentido si está respaldado por datos y comportamiento; no existe un número universal.</p>`
      )),
    dtArticle("20",dtPick("Stop diário, pico do dia e giveback","Daily stop, intraday peak and giveback","Stop diario, pico del día y giveback"),
      dtPick("Parar cedo reduz cauda negativa, mas também pode cortar recuperações.","Stopping early reduces downside tail risk but can also cut recoveries.","Parar temprano reduce la cola negativa, pero también puede cortar recuperaciones."),
      dtPick(
        `<p>Um stop diário de -3R muda a distribuição da sessão: limita algumas perdas, porém impede qualquer recuperação depois que o limite é atingido.</p><p><strong>Giveback</strong> é a diferença entre o pico de P&L intradiário e o resultado ao encerrar o pregão.</p><div class="formula-box">giveback = pico intradiário − P&L final</div><p>A pergunta correta não é “stop diário é bom ou ruim?”, mas “como diferentes regras alteram expectativa, cauda, frequência de dias ruins e comportamento?”.</p>`,
        `<p>A -3R daily stop changes the session distribution: it limits some losses but prevents any recovery after the threshold is hit.</p><p><strong>Giveback</strong> is the difference between the intraday P&L peak and the closing result.</p><div class="formula-box">giveback = intraday peak − final P&L</div><p>The right question is not “is a daily stop good or bad?” but “how do different rules change expectancy, tails, bad-day frequency and behavior?”.</p>`,
        `<p>Un stop diario de -3R cambia la distribución de la sesión: limita algunas pérdidas, pero impide cualquier recuperación después de alcanzar el límite.</p><p><strong>Giveback</strong> es la diferencia entre el pico de P&L intradía y el resultado al cierre.</p><div class="formula-box">giveback = pico intradía − P&L final</div><p>La pregunta correcta no es “¿el stop diario es bueno o malo?”, sino “¿cómo cambian distintas reglas la expectativa, las colas, la frecuencia de días malos y el comportamiento?”.</p>`
      )),
    dtArticle("21",dtPick("Custos e slippage no day trade","Costs and slippage in day trading","Costes y slippage en day trading"),
      dtPick("Alta frequência operacional transforma custos pequenos em efeito estrutural.","High trading frequency turns small costs into a structural effect.","La alta frecuencia convierte pequeños costes en un efecto estructural."),
      dtPick(
        `<p>No day trade, corretagem, emolumentos, spread e slippage são pagos repetidamente. Um custo aparentemente pequeno por operação pode consumir grande parte de uma expectância modesta.</p><div class="formula-box">E líquido[R] = E bruto[R] − custo médio[R/trade]</div><p>O custo também pode variar por horário e volatilidade; o valor fixo usado no laboratório é uma simplificação didática.</p>`,
        `<p>In day trading, commissions, fees, spread and slippage are paid repeatedly. A seemingly small per-trade cost can consume a large share of a modest edge.</p><div class="formula-box">net E[R] = gross E[R] − average cost[R/trade]</div><p>Costs can also vary by time and volatility; the fixed value used in the lab is an educational simplification.</p>`,
        `<p>En day trading, comisiones, tasas, spread y slippage se pagan repetidamente. Un coste aparentemente pequeño por operación puede consumir gran parte de un edge modesto.</p><div class="formula-box">E neta[R] = E bruta[R] − coste medio[R/trade]</div><p>El coste también puede variar por horario y volatilidad; el valor fijo usado en el laboratorio es una simplificación didáctica.</p>`
      )),
    dtArticle("22",dtPick("Cara ou coroa: o que o trader realmente controla?","Heads or tails: what does the trader actually control?","Cara o cruz: ¿qué controla realmente el trader?"),
      dtPick("Você não controla o próximo resultado; controla a estrutura de risco e saída.","You do not control the next outcome; you control risk and exit structure.","No controlas el próximo resultado; controlas la estructura de riesgo y salida."),
      dtPick(
        `<p>Imagine, apenas como analogia, que cada operação começasse como um lançamento de moeda: você não sabe se o próximo movimento será favorável ou contrário.</p>
        <p>O trader <strong>não controla qual lado da moeda aparecerá</strong>. Mas pode definir quanto aceita perder quando o cenário falha, quanto espaço concede a uma operação favorável, o tamanho da posição, os custos que tolera e se respeita a saída planejada.</p>
        <div class="formula-box">resultado incerto + perda limitada + ganho assimétrico → expectativa diferente</div>
        <p>Num jogo didático 50/50, perder 1R quando erra e ganhar 2R quando acerta produz expectativa bruta de +0,50R por tentativa. Ganhar e perder 1R produz expectativa bruta zero. A probabilidade do próximo lançamento continua exatamente 50/50.</p>
        <p><strong>O ponto não é dizer que trading é literalmente uma moeda.</strong> No mercado real, win rate, stop, alvo, saída discricionária, slippage e contexto interagem. Aumentar o alvo, por exemplo, pode reduzir a frequência com que ele é atingido. A analogia serve para separar duas coisas: <em>incerteza do resultado</em> e <em>controle sobre risco/exposição</em>.</p>`,
        `<p>Imagine, only as an analogy, that every trade began like a coin flip: you do not know whether the next move will be favorable or adverse.</p>
        <p>The trader <strong>does not control which side appears</strong>. But the trader can define how much to lose when the idea fails, how much room to give a favorable trade, position size, tolerated costs and whether the planned exit is respected.</p>
        <div class="formula-box">uncertain outcome + limited loss + asymmetric gain → different expectancy</div>
        <p>In a 50/50 teaching game, losing 1R when wrong and earning 2R when right gives gross expectancy of +0.50R per attempt. Winning and losing 1R gives zero gross expectancy. The next flip is still exactly 50/50.</p>
        <p><strong>The point is not that trading is literally a coin toss.</strong> In real markets, win rate, stops, targets, discretionary exits, slippage and context interact. Increasing the target, for example, may reduce how often it is reached. The analogy separates two ideas: <em>outcome uncertainty</em> and <em>control over risk/exposure</em>.</p>`,
        `<p>Imagina, solo como analogía, que cada trade comenzara como un lanzamiento de moneda: no sabes si el próximo movimiento será favorable o adverso.</p>
        <p>El trader <strong>no controla qué lado aparece</strong>. Pero puede definir cuánto perder cuando la idea falla, cuánto espacio conceder a una operación favorable, el tamaño de posición, los costes tolerados y si respeta la salida planificada.</p>
        <div class="formula-box">resultado incierto + pérdida limitada + ganancia asimétrica → expectativa diferente</div>
        <p>En un juego didáctico 50/50, perder 1R al fallar y ganar 2R al acertar produce una expectativa bruta de +0,50R por intento. Ganar y perder 1R produce expectativa bruta cero. El siguiente lanzamiento sigue siendo exactamente 50/50.</p>
        <p><strong>La idea no es que el trading sea literalmente una moneda.</strong> En el mercado real, win rate, stop, objetivo, salidas discrecionales, slippage y contexto interactúan. Aumentar el objetivo, por ejemplo, puede reducir la frecuencia con que se alcanza. La analogía separa dos ideas: <em>incertidumbre del resultado</em> y <em>control sobre riesgo/exposición</em>.</p>`
      ))
  ].join("");
}

function dtSessionTool(){
  const s=dtState.session;
  return `<article class="edu-tool edu-tool--wide">
    <div class="edu-tool__head"><span class="tool-number">16</span><div><h4>${dtEsc(dtPick("Monte Carlo por Pregão","Session-Level Monte Carlo","Monte Carlo por Sesión"))}</h4><p>${dtEsc(dtPick("Agrupe trades em dias e observe P&L diário, losing days e drawdown medido em sessões.","Group trades into days and study daily P&L, losing days and drawdown measured in sessions.","Agrupa trades en días y observa P&L diario, losing days y drawdown medido en sesiones."))}</p></div></div>
    <div class="edu-form cols-3">
      ${dtField("dt-ses-rate","Win rate (%)",s.winRate,1,99,.1)}
      ${dtField("dt-ses-rr","Reward : Risk",s.rr,0,20,.1)}
      ${dtField("dt-ses-trades",dtPick("Trades por pregão","Trades per session","Trades por sesión"),s.tradesDay,1,20,1)}
      ${dtField("dt-ses-days",dtPick("Pregões por caminho","Sessions per path","Sesiones por trayectoria"),s.days,10,500,10)}
      ${dtField("dt-ses-sims",dtPick("Simulações","Simulations","Simulaciones"),s.sims,200,10000,100)}
      ${dtField("dt-ses-seed",dtPick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions"><button id="dt-ses-run" class="primary">${dtEsc(dtPick("Simular pregões","Simulate sessions","Simular sesiones"))}</button></div>
    <div id="dt-ses-results" class="edu-results"></div>
    <div id="dt-ses-explain" class="edu-explain"></div>
  </article>`;
}

function dtTimeTool(){
  const rows=[
    ["09:00–10:00",52,1.35,30],
    ["10:00–11:00",48,1.40,30],
    ["11:00–12:00",43,1.20,20],
    ["14:00–16:00",40,1.10,20],
  ];
  return `<article class="edu-tool edu-tool--wide">
    <div class="edu-tool__head"><span class="tool-number">17</span><div><h4>${dtEsc(dtPick("Expectativa por Faixa Horária","Expectancy by Time Window","Expectativa por Franja Horaria"))}</h4><p>${dtEsc(dtPick("Separe a estratégia por horário e compare contribuição para cada 100 trades.","Split the strategy by time and compare contribution per 100 trades.","Separa la estrategia por horario y compara la contribución por cada 100 trades."))}</p></div></div>
    <div class="table-scroll"><table class="lesson-comparison"><thead><tr><th>${dtEsc(dtPick("Horário","Time","Horario"))}</th><th>Win rate</th><th>R:R</th><th>${dtEsc(dtPick("Participação (%)","Share (%)","Participación (%)"))}</th></tr></thead><tbody>
      ${rows.map((r,i)=>`<tr><td>${r[0]}</td><td><input id="dt-time-rate-${i}" type="number" value="${r[1]}" min="1" max="99" step=".1"></td><td><input id="dt-time-rr-${i}" type="number" value="${r[2]}" min="0" max="20" step=".1"></td><td><input id="dt-time-share-${i}" type="number" value="${r[3]}" min="0" max="100" step="1"></td></tr>`).join("")}
    </tbody></table></div>
    <div class="actions"><button id="dt-time-run" class="primary">${dtEsc(dtPick("Calcular por horário","Calculate by time","Calcular por horario"))}</button></div>
    <div id="dt-time-results"></div>
    <div id="dt-time-explain" class="edu-explain"></div>
  </article>`;
}

function dtOvertradeTool(){
  const s=dtState.overtrade;
  return `<article class="edu-tool edu-tool--wide">
    <div class="edu-tool__head"><span class="tool-number">18</span><div><h4>${dtEsc(dtPick("Laboratório de Overtrading","Overtrading Lab","Laboratorio de Overtrading"))}</h4><p>${dtEsc(dtPick("Faça o win rate se deteriorar a cada trade adicional e compare limites diários.","Let win rate deteriorate with each additional trade and compare daily limits.","Haz que el win rate se deteriore con cada trade adicional y compara límites diarios."))}</p></div></div>
    <div class="edu-form cols-3">
      ${dtField("dt-ov-rate",dtPick("Win rate do 1º trade (%)","Win rate of 1st trade (%)","Win rate del 1º trade (%)"),s.winRate,1,99,.1)}
      ${dtField("dt-ov-rr","Reward : Risk",s.rr,0,20,.1)}
      ${dtField("dt-ov-decay",dtPick("Queda de win rate por trade (p.p.)","Win-rate drop per trade (p.p.)","Caída de win rate por trade (p.p.)"),s.deterioration,0,10,.5)}
      ${dtField("dt-ov-max",dtPick("Máximo analisado de trades/dia","Maximum trades/day analyzed","Máximo de trades/día analizado"),s.maxTrades,2,12,1)}
      ${dtField("dt-ov-sims",dtPick("Dias simulados por limite","Simulated days per limit","Días simulados por límite"),s.sims,500,10000,100)}
      ${dtField("dt-ov-seed",dtPick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions"><button id="dt-ov-run" class="primary">${dtEsc(dtPick("Comparar limites de trades","Compare trade limits","Comparar límites de trades"))}</button></div>
    <div id="dt-ov-table"></div><div id="dt-ov-explain" class="edu-explain"></div>
  </article>`;
}

function dtMfeTool(){
  return `<article class="edu-tool">
    <div class="edu-tool__head"><span class="tool-number">19</span><div><h4>${dtEsc(dtPick("MFE / MAE e Captura","MFE / MAE and Capture","MFE / MAE y Captura"))}</h4><p>${dtEsc(dtPick("Use uma amostra didática de trades vencedores e veja quanto do movimento favorável virou resultado.","Use a teaching sample of winning trades and see how much favorable excursion became realized P&L.","Usa una muestra didáctica de trades ganadores y observa cuánto movimiento favorable se convirtió en resultado."))}</p></div></div>
    <div class="edu-form cols-3">
      ${dtField("dt-mfe-mfe",dtPick("MFE médio (R)","Average MFE (R)","MFE medio (R)"),1.8,.1,10,.1)}
      ${dtField("dt-mfe-result",dtPick("Ganho realizado médio (R)","Average realized win (R)","Ganancia realizada media (R)"),.9,.01,10,.1)}
      ${dtField("dt-mfe-mae",dtPick("MAE médio dos vencedores (R)","Average MAE of winners (R)","MAE medio de ganadores (R)"),.45,0,10,.05)}
    </div>
    <div id="dt-mfe-results" class="edu-results"></div><div id="dt-mfe-explain" class="edu-explain"></div>
  </article>`;
}

function dtStopTool(){
  const s=dtState.stop;
  return `<article class="edu-tool edu-tool--wide">
    <div class="edu-tool__head"><span class="tool-number">20</span><div><h4>${dtEsc(dtPick("Stop Diário e Giveback","Daily Stop and Giveback","Stop Diario y Giveback"))}</h4><p>${dtEsc(dtPick("Compare continuar até o fim do plano com interromper o pregão ao tocar um limite negativo.","Compare trading the full plan with stopping the session after a negative threshold is reached.","Compara operar todo el plan con detener la sesión al alcanzar un límite negativo."))}</p></div></div>
    <div class="edu-form cols-3">
      ${dtField("dt-stop-rate","Win rate (%)",s.winRate,1,99,.1)}
      ${dtField("dt-stop-rr","Reward : Risk",s.rr,0,20,.1)}
      ${dtField("dt-stop-trades",dtPick("Máximo de trades/dia","Maximum trades/day","Máximo de trades/día"),s.maxTrades,1,20,1)}
      ${dtField("dt-stop-r",dtPick("Stop diário (R positivo informado)","Daily stop (enter positive R)","Stop diario (R positivo informado)"),s.stopR,.5,20,.5)}
      ${dtField("dt-stop-days",dtPick("Pregões simulados","Simulated sessions","Sesiones simuladas"),s.days,500,20000,500)}
      ${dtField("dt-stop-seed",dtPick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions"><button id="dt-stop-run" class="primary">${dtEsc(dtPick("Comparar regra diária","Compare daily rule","Comparar regla diaria"))}</button></div>
    <div id="dt-stop-results" class="stats-compare-results"></div><div id="dt-stop-explain" class="edu-explain"></div>
  </article>`;
}

function dtCostsTool(){
  const s=dtState.costs;
  return `<article class="edu-tool">
    <div class="edu-tool__head"><span class="tool-number">21</span><div><h4>${dtEsc(dtPick("Custos e Slippage em R","Costs and Slippage in R","Costes y Slippage en R"))}</h4><p>${dtEsc(dtPick("Converta um custo médio por trade em erosão diária e mensal da expectativa.","Convert average per-trade cost into daily and monthly expectancy erosion.","Convierte el coste medio por trade en erosión diaria y mensual de la expectativa."))}</p></div></div>
    <div class="edu-form cols-3">
      ${dtField("dt-cost-rate","Win rate (%)",s.winRate,1,99,.1)}
      ${dtField("dt-cost-rr","Reward : Risk",s.rr,0,20,.1)}
      ${dtField("dt-cost-r",dtPick("Custo médio por trade (R)","Average cost per trade (R)","Coste medio por trade (R)"),s.costR,0,2,.01)}
      ${dtField("dt-cost-trades",dtPick("Trades por dia","Trades per day","Trades por día"),s.tradesDay,1,30,1)}
      ${dtField("dt-cost-days",dtPick("Pregões no mês","Sessions in month","Sesiones en el mes"),s.days,1,31,1)}
    </div>
    <div id="dt-cost-results" class="edu-results"></div><div id="dt-cost-explain" class="edu-explain"></div>
  </article>`;
}

function dtCoinTool(){
  const s=dtState.coin;
  return `<article class="edu-tool edu-tool--wide dt-coin-tool">
    <div class="edu-tool__head"><span class="tool-number">23</span><div><h4>${dtEsc(dtPick("Cara ou Coroa: Stop, Ganho e Expectativa","Heads or Tails: Stop, Gain and Expectancy","Cara o Cruz: Stop, Ganancia y Expectativa"))}</h4><p>${dtEsc(dtPick("Mantenha a chance em 50/50 e altere apenas aquilo que o trader pode estruturar neste modelo didático.","Keep probability at 50/50 and change only what the trader can structure in this teaching model.","Mantén la probabilidad en 50/50 y cambia solo lo que el trader puede estructurar en este modelo didáctico."))}</p></div></div>
    <div class="dt-control-map">
      <div><span>🎲</span><strong>${dtEsc(dtPick("Você não controla","You do not control","No controlas"))}</strong><small>${dtEsc(dtPick("o próximo cara/coroa, nem o próximo movimento do mercado","the next heads/tails outcome or the market's next move","el próximo cara/cruz ni el próximo movimiento del mercado"))}</small></div>
      <div><span>🎛️</span><strong>${dtEsc(dtPick("Você estrutura","You structure","Tú estructuras"))}</strong><small>${dtEsc(dtPick("stop, ganho permitido, tamanho, custos e disciplina de saída","stop, allowed gain, size, costs and exit discipline","stop, ganancia permitida, tamaño, costes y disciplina de salida"))}</small></div>
    </div>
    <div class="edu-form cols-3">
      ${dtField("dt-coin-stop",dtPick("Perda quando dá errado (R)","Loss when wrong (R)","Pérdida cuando sale mal (R)"),s.stopR,.1,20,.1)}
      ${dtField("dt-coin-win",dtPick("Ganho quando dá certo (R)","Gain when right (R)","Ganancia cuando sale bien (R)"),s.winR,.1,50,.1)}
      ${dtField("dt-coin-cost",dtPick("Custo por tentativa (R)","Cost per attempt (R)","Coste por intento (R)"),s.costR,0,5,.01)}
      ${dtField("dt-coin-trades",dtPick("Lançamentos / trades por caminho","Flips / trades per path","Lanzamientos / trades por trayectoria"),s.trades,10,1000,10)}
      ${dtField("dt-coin-sims",dtPick("Caminhos Monte Carlo","Monte Carlo paths","Trayectorias Monte Carlo"),s.sims,200,10000,100)}
      ${dtField("dt-coin-seed",dtPick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions dt-coin-presets">
      <button type="button" class="secondary" data-coin-preset="1,1">${dtEsc(dtPick("Simétrico 1R / 1R","Symmetric 1R / 1R","Simétrico 1R / 1R"))}</button>
      <button type="button" class="secondary" data-coin-preset="1,2">${dtEsc(dtPick("Corta em 1R / deixa 2R","Cut at 1R / allow 2R","Corta en 1R / deja 2R"))}</button>
      <button type="button" class="secondary" data-coin-preset="1,.5">${dtEsc(dtPick("Perde 1R / ganha 0,5R","Lose 1R / gain 0.5R","Pierde 1R / gana 0,5R"))}</button>
      <button id="dt-coin-run" type="button" class="primary">${dtEsc(dtPick("Lançar milhares de moedas","Flip thousands of coins","Lanzar miles de monedas"))}</button>
    </div>
    <div id="dt-coin-results" class="edu-results"></div>
    <div class="dt-coin-sequence-wrap">
      <strong>${dtEsc(dtPick("Um caminho possível — 40 primeiros resultados","One possible path — first 40 outcomes","Una trayectoria posible — primeros 40 resultados"))}</strong>
      <div id="dt-coin-sequence" class="dt-coin-sequence"></div>
    </div>
    <div id="dt-coin-explain" class="edu-explain"></div>
    <p class="hint warning">${dtEsc(dtPick(
      "Limitação essencial: este laboratório mantém 50% fixos de propósito. Num trading system real, mudar stop ou alvo pode mudar também o win rate e a distribuição dos resultados; por isso a relação precisa ser validada com dados.",
      "Essential limitation: this lab deliberately keeps probability fixed at 50%. In a real trading system, changing stop or target can also change win rate and the outcome distribution, so the relationship must be validated with data.",
      "Limitación esencial: este laboratorio mantiene el 50% fijo a propósito. En un sistema real, cambiar stop u objetivo también puede cambiar el win rate y la distribución de resultados; la relación debe validarse con datos."
    ))}</p>
  </article>`;
}

function dtBootstrapTool(){
  const s=dtState.bootstrap;
  return `<article class="edu-tool edu-tool--wide">
    <div class="edu-tool__head"><span class="tool-number">24</span><div><h4>${dtEsc(dtPick("Bootstrap de Pregões Históricos","Historical Session Bootstrap","Bootstrap de Sesiones Históricas"))}</h4><p>${dtEsc(dtPick("Cole o resultado diário em R. Cada valor representa um pregão inteiro e será reamostrado como unidade.","Paste daily P&L in R. Each value represents one whole session and is resampled as a unit.","Pega el resultado diario en R. Cada valor representa una sesión completa y se remuestrea como unidad."))}</p></div></div>
    <label>${dtEsc(dtPick("P&L diário em R — separado por vírgula, espaço ou quebra de linha","Daily P&L in R — comma, space or newline separated","P&L diario en R — separado por coma, espacio o salto de línea"))}<textarea id="dt-boot-data">${DT_SAMPLE_DAYS.join(", ")}</textarea></label>
    <div class="edu-form cols-3">
      ${dtField("dt-boot-days",dtPick("Pregões futuros por caminho","Future sessions per path","Sesiones futuras por trayectoria"),s.days,10,500,10)}
      ${dtField("dt-boot-sims",dtPick("Simulações","Simulations","Simulaciones"),s.sims,200,10000,100)}
      ${dtField("dt-boot-seed",dtPick("Semente","Seed","Semilla"),s.seed,1,999999999,1)}
    </div>
    <div class="actions"><button id="dt-boot-run" class="primary">${dtEsc(dtPick("Executar bootstrap por pregão","Run session bootstrap","Ejecutar bootstrap por sesión"))}</button></div>
    <div id="dt-boot-results" class="edu-results"></div><div id="dt-boot-explain" class="edu-explain"></div>
  </article>`;
}

function renderDayTradeLab(){
  const root=dt$("daytrade-root");if(!root)return;
  root.innerHTML=`
    <div class="education-head">
      <div>
        <p class="eyebrow">${dtEsc(dtPick("DAY TRADE · ANÁLISE POR PREGÃO","DAY TRADING · SESSION ANALYSIS","DAY TRADE · ANÁLISIS POR SESIÓN"))}</p>
        <h2>${dtEsc(dtPick("Estatística da Sessão de Day Trade","Day-Trading Session Statistics","Estadística de la Sesión de Day Trade"))}</h2>
        <p class="section-explain">${dtEsc(dtPick(
          "Este bloco assume operações abertas e encerradas no mesmo pregão. O foco deixa de ser apenas a sequência de trades e passa a incluir P&L diário, horário, quantidade de operações, stop diário, giveback, custos e Monte Carlo por sessão.",
          "This block assumes positions are opened and closed within the same session. The focus expands from trade sequences to daily P&L, time-of-day, trade count, daily stop, giveback, costs and session-level Monte Carlo.",
          "Este bloque supone operaciones abiertas y cerradas en la misma sesión. El foco pasa de la secuencia de trades a incluir P&L diario, horario, cantidad de operaciones, stop diario, giveback, costes y Monte Carlo por sesión."
        ))}</p>
      </div>
      <div class="education-path"><span>Trade</span><span>→ ${dtEsc(dtPick("Pregão","Session","Sesión"))}</span><span>→ ${dtEsc(dtPick("Semana","Week","Semana"))}</span><span>→ Monte Carlo</span></div>
    </div>
    <div class="lesson-callout"><strong>${dtEsc(dtPick("Escopo do projeto:","Project scope:","Alcance del proyecto:"))}</strong> ${dtEsc(dtPick("day trade apenas. As análises pressupõem que não há posições carregadas para o pregão seguinte.","day trading only. Analyses assume no positions are carried into the next session.","solo day trade. Los análisis suponen que no se mantienen posiciones para la sesión siguiente."))}</div>
    <div class="article-grid">${dtArticles()}</div>
    <div class="education-tools-intro"><p class="eyebrow">${dtEsc(dtPick("LABORATÓRIOS INTRADIÁRIOS","INTRADAY LABS","LABORATORIOS INTRADÍA"))}</p><h3>${dtEsc(dtPick("Do trade isolado ao comportamento do pregão","From individual trade to session behavior","Del trade aislado al comportamiento de la sesión"))}</h3></div>
    <div class="education-tools">
      ${dtSessionTool()}
      ${dtTimeTool()}
      ${dtOvertradeTool()}
      ${dtMfeTool()}
      ${dtStopTool()}
      ${dtCostsTool()}
      ${dtCoinTool()}
      ${dtBootstrapTool()}
    </div>
  `;
  dt$("dt-ses-run")?.addEventListener("click",dtRunSession);
  dt$("dt-time-run")?.addEventListener("click",dtRunTime);
  dt$("dt-ov-run")?.addEventListener("click",dtRunOvertrade);
  ["dt-mfe-mfe","dt-mfe-result","dt-mfe-mae"].forEach(id=>dt$(id)?.addEventListener("input",dtRunMfe));
  dt$("dt-stop-run")?.addEventListener("click",dtRunStop);
  ["dt-cost-rate","dt-cost-rr","dt-cost-r","dt-cost-trades","dt-cost-days"].forEach(id=>dt$(id)?.addEventListener("input",dtRunCosts));
  dt$("dt-coin-run")?.addEventListener("click",dtRunCoin);
  document.querySelectorAll("[data-coin-preset]").forEach(btn=>btn.addEventListener("click",()=>{
    const [stop,win]=btn.dataset.coinPreset.split(",").map(Number);
    dt$("dt-coin-stop").value=stop;dt$("dt-coin-win").value=win;dtRunCoin();
  }));
  ["dt-coin-stop","dt-coin-win","dt-coin-cost","dt-coin-trades","dt-coin-sims","dt-coin-seed"].forEach(id=>dt$(id)?.addEventListener("input",dtRunCoin));
  dt$("dt-boot-run")?.addEventListener("click",dtRunBootstrap);
  dtRunSession();dtRunTime();dtRunOvertrade();dtRunMfe();dtRunStop();dtRunCosts();dtRunCoin();dtRunBootstrap();
}

function dtRunSession(){
  const p=Math.min(.99,Math.max(.01,dtRead("dt-ses-rate",45)/100)),rr=Math.max(0,dtRead("dt-ses-rr",1.5));
  const tpd=Math.min(20,Math.max(1,Math.floor(dtRead("dt-ses-trades",4)))),days=Math.min(500,Math.max(10,Math.floor(dtRead("dt-ses-days",60))));
  const sims=Math.min(10000,Math.max(200,Math.floor(dtRead("dt-ses-sims",2500)))),seed=Math.max(1,Math.floor(dtRead("dt-ses-seed",8162)));
  const rng=dtRng(seed),totals=[],streaks=[],dds=[],underwater=[],allDays=[],allWeeks=[];let positiveDays=0,totalDays=0;
  for(let s=0;s<sims;s++){
    const ds=[];
    for(let d=0;d<days;d++){let r=0;for(let t=0;t<tpd;t++)r+=dtTrade(p,rr,rng);ds.push(r);allDays.push(r);if(r>0)positiveDays++;totalDays++;}
    for(let i=0;i<ds.length;i+=5) allWeeks.push(ds.slice(i,i+5).reduce((a,b)=>a+b,0));
    totals.push(ds.reduce((a,b)=>a+b,0));streaks.push(dtLongestNegativeStreak(ds));dds.push(dtMaxDrawdown(ds));underwater.push(dtMaxUnderwater(ds));
  }
  dt$("dt-ses-results").innerHTML=dtMetric([
    [dtPick("Pregão positivo","Positive session","Sesión positiva"),dtPct(positiveDays/totalDays*100,1)],
    ["P5 "+dtPick("P&L diário","daily P&L","P&L diario"),dtFmt(dtQuantile(allDays,.05),2)+"R"],
    ["P50 "+dtPick("P&L diário","daily P&L","P&L diario"),dtFmt(dtQuantile(allDays,.50),2)+"R"],
    ["P95 "+dtPick("P&L diário","daily P&L","P&L diario"),dtFmt(dtQuantile(allDays,.95),2)+"R"],
    [`P5 · ${days} ${dtPick("pregões","sessions","sesiones")}`,dtFmt(dtQuantile(totals,.05),1)+"R"],
    [`P50 · ${days} ${dtPick("pregões","sessions","sesiones")}`,dtFmt(dtQuantile(totals,.50),1)+"R"],
    [dtPick("Losing days P95","P95 losing-day streak","Racha P95 de días negativos"),dtFmt(dtQuantile(streaks,.95),0)],
    [dtPick("Semana negativa","Negative week","Semana negativa"),dtPct(allWeeks.filter(v=>v<0).length/allWeeks.length*100,1)],
    [dtPick("Drawdown diário acumulado P95","P95 session-equity drawdown","Drawdown acumulado diario P95"),dtFmt(dtQuantile(dds,.95),1)+"R"],
    [dtPick("Tempo submerso P95","P95 underwater duration","Duración bajo máximo P95"),dtFmt(dtQuantile(underwater,.95),0)+" "+dtPick("pregões","sessions","sesiones")],
  ]);
  dt$("dt-ses-explain").innerHTML=dtPick(
    `A mesma hipótese por trade foi reorganizada em <strong>pregões de ${tpd} operações</strong>. Isso permite medir coisas que uma lista contínua de trades não mostra diretamente: distribuição diária, sequências de dias negativos e drawdown em unidades de sessão.`,
    `The same per-trade hypothesis was reorganized into <strong>sessions of ${tpd} trades</strong>. This reveals quantities a continuous trade list does not show directly: daily distribution, losing-day streaks and drawdown in session units.`,
    `La misma hipótesis por trade fue reorganizada en <strong>sesiones de ${tpd} operaciones</strong>. Esto permite medir distribución diaria, rachas de días negativos y drawdown en unidades de sesión.`
  );
}

function dtRunTime(){
  const rows=[];
  let shareTotal=0;
  for(let i=0;i<4;i++){const p=Math.min(.99,Math.max(.01,dtRead(`dt-time-rate-${i}`,50)/100)),rr=Math.max(0,dtRead(`dt-time-rr-${i}`,1)),share=Math.max(0,dtRead(`dt-time-share-${i}`,25));shareTotal+=share;rows.push({i,p,rr,share,e:p*rr-(1-p)});}
  const names=["09:00–10:00","10:00–11:00","11:00–12:00","14:00–16:00"];
  let total=0,posOnly=0,posShare=0;
  rows.forEach(r=>{const w=shareTotal?r.share/shareTotal:0;total+=w*r.e;if(r.e>0){posOnly+=w*r.e;posShare+=w;}});
  const normalizedPositive=posShare>0?posOnly/posShare:0;
  dt$("dt-time-results").innerHTML=`<div class="table-scroll"><table class="lesson-comparison"><thead><tr><th>${dtEsc(dtPick("Faixa","Window","Franja"))}</th><th>E[R]/trade</th><th>${dtEsc(dtPick("Contribuição / 100 trades","Contribution / 100 trades","Contribución / 100 trades"))}</th></tr></thead><tbody>${rows.map((r,i)=>{const w=shareTotal?r.share/shareTotal:0;return `<tr><td>${names[i]}</td><td>${r.e>=0?"+":""}${dtFmt(r.e,3)}R</td><td>${dtFmt(w*r.e*100,2)}R</td></tr>`}).join("")}</tbody></table></div>`;
  const worst=[...rows].sort((a,b)=>a.e-b.e)[0];
  dt$("dt-time-explain").innerHTML=dtPick(
    `Com a distribuição de horários informada, a expectativa global é <strong>${total>=0?"+":""}${dtFmt(total,3)}R/trade</strong>. A faixa mais fraca é <strong>${names[worst.i]}</strong> (${dtFmt(worst.e,3)}R). Se apenas faixas com E[R] positivo fossem mantidas e redistribuídas entre si, a média seria ${normalizedPositive>=0?"+":""}${dtFmt(normalizedPositive,3)}R/trade. Isso é um diagnóstico, não uma recomendação automática de cortar horários.`,
    `With the supplied time mix, overall expectancy is <strong>${total>=0?"+":""}${dtFmt(total,3)}R/trade</strong>. The weakest window is <strong>${names[worst.i]}</strong> (${dtFmt(worst.e,3)}R). If only positive-E[R] windows were retained and renormalized, average expectancy would be ${normalizedPositive>=0?"+":""}${dtFmt(normalizedPositive,3)}R/trade. This is a diagnostic, not an automatic recommendation to remove a time window.`,
    `Con la mezcla horaria informada, la expectativa global es <strong>${total>=0?"+":""}${dtFmt(total,3)}R/trade</strong>. La franja más débil es <strong>${names[worst.i]}</strong> (${dtFmt(worst.e,3)}R). Si solo se mantuvieran franjas con E[R] positivo y se renormalizaran, la media sería ${normalizedPositive>=0?"+":""}${dtFmt(normalizedPositive,3)}R/trade. Es un diagnóstico, no una recomendación automática de eliminar horarios.`
  );
}

function dtRunOvertrade(){
  const base=Math.min(.99,Math.max(.01,dtRead("dt-ov-rate",48)/100)),rr=Math.max(0,dtRead("dt-ov-rr",1.35)),decay=Math.max(0,dtRead("dt-ov-decay",2)/100);
  const maxT=Math.min(12,Math.max(2,Math.floor(dtRead("dt-ov-max",8)))),sims=Math.min(10000,Math.max(500,Math.floor(dtRead("dt-ov-sims",2200)))),seed=Math.max(1,Math.floor(dtRead("dt-ov-seed",7718)));
  const rows=[];
  for(let limit=1;limit<=maxT;limit++){let theoretical=0;for(let i=0;i<limit;i++){const p=Math.max(.01,base-i*decay);theoretical+=p*rr-(1-p);}const rng=dtRng(seed+limit*97);let neg=0;const vals=[];for(let s=0;s<sims;s++){let r=0;for(let i=0;i<limit;i++){const p=Math.max(.01,base-i*decay);r+=dtTrade(p,rr,rng);}vals.push(r);if(r<0)neg++;}rows.push({limit,theoretical,neg:neg/sims,p50:dtQuantile(vals,.5)});}
  const best=[...rows].sort((a,b)=>b.theoretical-a.theoretical)[0];
  dt$("dt-ov-table").innerHTML=`<div class="table-scroll"><table class="lesson-comparison"><thead><tr><th>${dtEsc(dtPick("Limite","Limit","Límite"))}</th><th>E[R]/${dtEsc(dtPick("dia","day","día"))}</th><th>${dtEsc(dtPick("Dia negativo","Negative day","Día negativo"))}</th><th>P50</th></tr></thead><tbody>${rows.map(r=>`<tr class="${r.limit===best.limit?"dt-best-row":""}"><td>${r.limit}</td><td>${r.theoretical>=0?"+":""}${dtFmt(r.theoretical,3)}R</td><td>${dtPct(r.neg*100,1)}</td><td>${dtFmt(r.p50,2)}R</td></tr>`).join("")}</tbody></table></div>`;
  dt$("dt-ov-explain").innerHTML=dtPick(
    `Sob a hipótese didática de queda de <strong>${dtFmt(decay*100,1)} p.p.</strong> no win rate a cada nova operação, o maior E[R] diário aparece com limite de <strong>${best.limit} trade(s)</strong>. Na prática, essa deterioração precisa ser estimada com dados reais por número ordinal do trade.`,
    `Under the teaching assumption that win rate falls <strong>${dtFmt(decay*100,1)} p.p.</strong> with each additional trade, the highest daily E[R] occurs at a limit of <strong>${best.limit} trade(s)</strong>. In practice, deterioration must be estimated from real data by trade number.`,
    `Bajo la hipótesis didáctica de que el win rate cae <strong>${dtFmt(decay*100,1)} p.p.</strong> con cada operación adicional, el mayor E[R] diario aparece con un límite de <strong>${best.limit} trade(s)</strong>. En la práctica, el deterioro debe estimarse con datos reales por número ordinal del trade.`
  );
}

function dtRunMfe(){
  const mfe=Math.max(.001,dtRead("dt-mfe-mfe",1.8)),real=Math.max(0,dtRead("dt-mfe-result",.9)),mae=Math.max(0,dtRead("dt-mfe-mae",.45));
  const capture=real/mfe, giveback=Math.max(0,mfe-real);
  dt$("dt-mfe-results").innerHTML=dtMetric([
    [dtPick("Captura média","Average capture","Captura media"),dtPct(capture*100,1)],
    [dtPick("Giveback médio do MFE","Average MFE giveback","Giveback medio del MFE"),dtFmt(giveback,2)+"R"],
    [dtPick("MFE / MAE","MFE / MAE","MFE / MAE"),mae>0?dtFmt(mfe/mae,2):"∞"],
    [dtPick("Resultado / MAE","Result / MAE","Resultado / MAE"),mae>0?dtFmt(real/mae,2):"∞"],
  ]);
  dt$("dt-mfe-explain").innerHTML=dtPick(
    `Se vencedores chegaram em média a <strong>${dtFmt(mfe,2)}R</strong> e realizaram <strong>${dtFmt(real,2)}R</strong>, cerca de ${dtPct(capture*100,1)} do MFE foi capturado. Isso não prova que um alvo maior seria melhor: para responder isso, precisamos conhecer a ordem temporal de MFE e MAE e como a regra de saída mudaria cada trade.`,
    `If winners reached an average <strong>${dtFmt(mfe,2)}R</strong> MFE and realized <strong>${dtFmt(real,2)}R</strong>, about ${dtPct(capture*100,1)} of MFE was captured. This does not prove a larger target would be better: that requires the time ordering of MFE/MAE and a counterfactual exit rule.`,
    `Si los ganadores alcanzaron en promedio <strong>${dtFmt(mfe,2)}R</strong> de MFE y realizaron <strong>${dtFmt(real,2)}R</strong>, se capturó cerca del ${dtPct(capture*100,1)} del MFE. Esto no prueba que un objetivo mayor sea mejor: hace falta conocer el orden temporal de MFE/MAE y aplicar una regla de salida contrafactual.`
  );
}

function dtEvalDay(sequence,stopR=0){
  let pnl=0,peak=0,trades=0;
  for(const result of sequence){pnl+=result;trades++;peak=Math.max(peak,pnl);if(stopR>0 && pnl<=-stopR)break;}
  return {pnl,peak,giveback:Math.max(0,peak-pnl),trades};
}
function dtRunStop(){
  const p=Math.min(.99,Math.max(.01,dtRead("dt-stop-rate",45)/100)),rr=Math.max(0,dtRead("dt-stop-rr",1.5)),maxT=Math.min(20,Math.max(1,Math.floor(dtRead("dt-stop-trades",6))));
  const stop=Math.max(.5,dtRead("dt-stop-r",3)),days=Math.min(20000,Math.max(500,Math.floor(dtRead("dt-stop-days",3000)))),seed=Math.max(1,Math.floor(dtRead("dt-stop-seed",5321)));
  const rng=dtRng(seed);
  const no=[],yes=[];
  for(let d=0;d<days;d++){
    const sequence=Array.from({length:maxT},()=>dtTrade(p,rr,rng));
    no.push(dtEvalDay(sequence,0));
    yes.push(dtEvalDay(sequence,stop));
  }
  const card=(title,a)=>{const pnls=a.map(x=>x.pnl),avg=pnls.reduce((s,v)=>s+v,0)/a.length,g=a.reduce((s,x)=>s+x.giveback,0)/a.length,t=a.reduce((s,x)=>s+x.trades,0)/a.length;return `<div class="stats-result-card"><strong>${dtEsc(title)}</strong><div class="edu-results">${dtMetric([
    [dtPick("Média diária","Daily average","Media diaria"),dtFmt(avg,3)+"R"],
    ["P5",dtFmt(dtQuantile(pnls,.05),2)+"R"],
    [dtPick("Dias negativos","Negative days","Días negativos"),dtPct(pnls.filter(v=>v<0).length/pnls.length*100,1)],
    [dtPick("Giveback médio","Average giveback","Giveback medio"),dtFmt(g,2)+"R"],
    [dtPick("Trades médios","Average trades","Trades medios"),dtFmt(t,2)],
  ])}</div></div>`;};
  dt$("dt-stop-results").innerHTML=card(dtPick("Sem stop diário","No daily stop","Sin stop diario"),no)+card(dtPick(`Stop diário -${stop}R`,`Daily stop -${stop}R`,`Stop diario -${stop}R`),yes);
  const avg=a=>a.reduce((s,x)=>s+x.pnl,0)/a.length;
  dt$("dt-stop-explain").innerHTML=dtPick(
    `Nesta hipótese, a regra de -${dtFmt(stop,1)}R muda a média diária de <strong>${dtFmt(avg(no),3)}R</strong> para <strong>${dtFmt(avg(yes),3)}R</strong>. Ela também altera a cauda e o número médio de trades. O objetivo do laboratório é mostrar o trade-off — não afirmar que um stop diário específico é universalmente melhor.`,
    `Under this hypothesis, the -${dtFmt(stop,1)}R rule changes average daily P&L from <strong>${dtFmt(avg(no),3)}R</strong> to <strong>${dtFmt(avg(yes),3)}R</strong>. It also changes the tail and average number of trades. The lab shows the trade-off; it does not claim one daily stop is universally better.`,
    `Bajo esta hipótesis, la regla de -${dtFmt(stop,1)}R cambia la media diaria de <strong>${dtFmt(avg(no),3)}R</strong> a <strong>${dtFmt(avg(yes),3)}R</strong>. También cambia la cola y el número medio de trades. El laboratorio muestra el trade-off; no afirma que un stop diario sea universalmente mejor.`
  );
}

function dtRunCosts(){
  const p=Math.min(.99,Math.max(.01,dtRead("dt-cost-rate",48)/100)),rr=Math.max(0,dtRead("dt-cost-rr",1.35)),cost=Math.max(0,dtRead("dt-cost-r",.05));
  const trades=Math.max(1,Math.floor(dtRead("dt-cost-trades",5))),days=Math.max(1,Math.floor(dtRead("dt-cost-days",20)));
  const gross=p*rr-(1-p),net=gross-cost;
  dt$("dt-cost-results").innerHTML=dtMetric([
    [dtPick("Expectância bruta/trade","Gross expectancy/trade","Expectativa bruta/trade"),`${gross>=0?"+":""}${dtFmt(gross,3)}R`],
    [dtPick("Expectância líquida/trade","Net expectancy/trade","Expectativa neta/trade"),`${net>=0?"+":""}${dtFmt(net,3)}R`],
    [dtPick("Custo por dia","Cost per day","Coste por día"),dtFmt(cost*trades,2)+"R"],
    [dtPick("Custo por mês","Cost per month","Coste por mes"),dtFmt(cost*trades*days,2)+"R"],
    [dtPick("E líquido mensal teórico","Theoretical monthly net E","E neta mensual teórica"),dtFmt(net*trades*days,2)+"R"],
  ]);
  const erosion=gross!==0?cost/Math.abs(gross):Infinity;
  dt$("dt-cost-explain").innerHTML=dtPick(
    `Um custo médio de <strong>${dtFmt(cost,3)}R por trade</strong> consome ${Number.isFinite(erosion)?dtPct(erosion*100,1):"—"} do tamanho da expectância bruta por operação. Em day trade, repetir esse custo ${trades} vezes por dia torna a modelagem de custos parte central da análise.`,
    `An average cost of <strong>${dtFmt(cost,3)}R per trade</strong> consumes ${Number.isFinite(erosion)?dtPct(erosion*100,1):"—"} of gross per-trade expectancy magnitude. In day trading, paying that cost ${trades} times per day makes cost modeling central to the analysis.`,
    `Un coste medio de <strong>${dtFmt(cost,3)}R por trade</strong> consume ${Number.isFinite(erosion)?dtPct(erosion*100,1):"—"} del tamaño de la expectativa bruta por operación. En day trade, repetir ese coste ${trades} veces por día hace que modelar costes sea central.`
  );
}

function dtRunCoin(){
  const loss=Math.max(.1,dtRead("dt-coin-stop",1));
  const gain=Math.max(.1,dtRead("dt-coin-win",2));
  const cost=Math.max(0,dtRead("dt-coin-cost",.05));
  const trades=Math.min(1000,Math.max(10,Math.floor(dtRead("dt-coin-trades",100))));
  const sims=Math.min(10000,Math.max(200,Math.floor(dtRead("dt-coin-sims",3000))));
  const seed=Math.max(1,Math.floor(dtRead("dt-coin-seed",5050)));
  const expectancy=.5*gain-.5*loss-cost;
  const breakEvenWin=(loss+cost)/(gain+loss);
  const breakEvenGain=loss+2*cost;
  const rng=dtRng(seed),totals=[],dds=[];
  let profitable=0,example=[];
  for(let s=0;s<sims;s++){
    let total=0,peak=0,worst=0;
    const seq=[];
    for(let i=0;i<trades;i++){
      const heads=rng()<.5;
      const result=(heads?gain:-loss)-cost;
      total+=result;peak=Math.max(peak,total);worst=Math.max(worst,peak-total);
      if(s===0 && i<40) seq.push({heads,result});
    }
    if(s===0) example=seq;
    totals.push(total);dds.push(worst);if(total>0)profitable++;
  }
  dt$("dt-coin-results").innerHTML=dtMetric([
    [dtPick("Probabilidade do resultado","Outcome probability","Probabilidad del resultado"),"50% / 50%"],
    [dtPick("Expectância líquida/tentativa","Net expectancy/attempt","Expectativa neta/intento"),`${expectancy>=0?"+":""}${dtFmt(expectancy,3)}R`],
    [dtPick("Win rate de equilíbrio","Break-even win rate","Win rate de equilibrio"),dtPct(breakEvenWin*100,1)],
    [dtPick("Ganho necessário com p=50%","Required gain at p=50%","Ganancia necesaria con p=50%"),dtFmt(breakEvenGain,2)+"R"],
    [dtPick("Caminhos positivos","Positive paths","Trayectorias positivas"),dtPct(profitable/sims*100,1)],
    ["P5",dtFmt(dtQuantile(totals,.05),1)+"R"],
    ["P50",dtFmt(dtQuantile(totals,.50),1)+"R"],
    ["P95",dtFmt(dtQuantile(totals,.95),1)+"R"],
    [dtPick("Drawdown P95","P95 drawdown","Drawdown P95"),dtFmt(dtQuantile(dds,.95),1)+"R"],
  ]);
  dt$("dt-coin-sequence").innerHTML=example.map((x,i)=>`<span class="${x.heads?"heads":"tails"}" title="${x.heads?dtPick("Cara / favorável","Heads / favorable","Cara / favorable"):dtPick("Coroa / contrário","Tails / adverse","Cruz / adverso")} · ${x.result>=0?"+":""}${dtFmt(x.result,2)}R"><b>${x.heads?"C":"K"}</b><small>${x.result>=0?"+":""}${dtFmt(x.result,1)}R</small></span>`).join("");
  const status=expectancy>0?dtPick("positiva","positive","positiva"):expectancy<0?dtPick("negativa","negative","negativa"):dtPick("neutra","neutral","neutral");
  dt$("dt-coin-explain").innerHTML=dtPick(
    `A moeda continua <strong>50/50</strong>. O que mudou foi o contrato econômico do jogo: você aceita perder <strong>${dtFmt(loss,2)}R</strong> no lado desfavorável e permite <strong>${dtFmt(gain,2)}R</strong> no favorável, pagando ${dtFmt(cost,2)}R de custo por tentativa. A expectância fica <strong>${status}: ${expectancy>=0?"+":""}${dtFmt(expectancy,3)}R</strong>. É esta a mensagem didática: <strong>controle não significa controlar o mercado; significa controlar a exposição e executar uma assimetria que tenha sido validada.</strong>`,
    `The coin remains <strong>50/50</strong>. What changed is the economics of the game: you accept a <strong>${dtFmt(loss,2)}R</strong> loss on the adverse side and allow <strong>${dtFmt(gain,2)}R</strong> on the favorable side, with ${dtFmt(cost,2)}R cost per attempt. Expectancy becomes <strong>${status}: ${expectancy>=0?"+":""}${dtFmt(expectancy,3)}R</strong>. That is the teaching point: <strong>control does not mean controlling the market; it means controlling exposure and executing an asymmetry that has been validated.</strong>`,
    `La moneda sigue <strong>50/50</strong>. Lo que cambió es la economía del juego: aceptas perder <strong>${dtFmt(loss,2)}R</strong> en el lado adverso y permites <strong>${dtFmt(gain,2)}R</strong> en el favorable, con ${dtFmt(cost,2)}R de coste por intento. La expectativa queda <strong>${status}: ${expectancy>=0?"+":""}${dtFmt(expectancy,3)}R</strong>. Ese es el mensaje: <strong>control no significa controlar el mercado; significa controlar la exposición y ejecutar una asimetría que haya sido validada.</strong>`
  );
}

function dtParseDays(text){
  const matches=String(text).match(/[-+]?\d+(?:[.,]\d+)?/g)||[];
  return matches.map(x=>Number(x.replace(",","."))).filter(Number.isFinite);
}
function dtRunBootstrap(){
  const data=dtParseDays(dt$("dt-boot-data")?.value||""),days=Math.min(500,Math.max(10,Math.floor(dtRead("dt-boot-days",60)))),sims=Math.min(10000,Math.max(200,Math.floor(dtRead("dt-boot-sims",3000)))),seed=Math.max(1,Math.floor(dtRead("dt-boot-seed",9127)));
  if(!data.length){dt$("dt-boot-results").innerHTML="";dt$("dt-boot-explain").textContent=dtPick("Insira ao menos um resultado diário válido.","Enter at least one valid daily result.","Introduce al menos un resultado diario válido.");return;}
  const rng=dtRng(seed),totals=[],streaks=[],dds=[],underwater=[];
  for(let s=0;s<sims;s++){const path=[];for(let d=0;d<days;d++)path.push(data[Math.floor(rng()*data.length)]);totals.push(path.reduce((a,b)=>a+b,0));streaks.push(dtLongestNegativeStreak(path));dds.push(dtMaxDrawdown(path));underwater.push(dtMaxUnderwater(path));}
  const mean=data.reduce((a,b)=>a+b,0)/data.length;
  dt$("dt-boot-results").innerHTML=dtMetric([
    [dtPick("Pregões históricos","Historical sessions","Sesiones históricas"),String(data.length)],
    [dtPick("Média histórica/dia","Historical mean/day","Media histórica/día"),dtFmt(mean,2)+"R"],
    [`P5 · ${days} ${dtPick("pregões","sessions","sesiones")}`,dtFmt(dtQuantile(totals,.05),1)+"R"],
    [`P50 · ${days} ${dtPick("pregões","sessions","sesiones")}`,dtFmt(dtQuantile(totals,.50),1)+"R"],
    [`P95 · ${days} ${dtPick("pregões","sessions","sesiones")}`,dtFmt(dtQuantile(totals,.95),1)+"R"],
    [dtPick("Losing days P95","P95 losing-day streak","Racha P95 de días negativos"),dtFmt(dtQuantile(streaks,.95),0)],
    [dtPick("Drawdown P95","P95 drawdown","Drawdown P95"),dtFmt(dtQuantile(dds,.95),1)+"R"],
    [dtPick("Tempo submerso P95","P95 underwater duration","Duración bajo máximo P95"),dtFmt(dtQuantile(underwater,.95),0)+" "+dtPick("pregões","sessions","sesiones")],
  ]);
  dt$("dt-boot-explain").innerHTML=dtPick(
    `Aqui cada amostra sorteada é um <strong>pregão inteiro</strong>, não um trade. Isso preserva o P&L diário observado como unidade e responde melhor a perguntas sobre sequências de dias negativos e drawdown por sessão. Ainda assim, bootstrap supõe que os pregões históricos sejam uma base representativa e, neste formato simples, sorteia dias independentemente.`,
    `Each draw here is a <strong>whole session</strong>, not a trade. This preserves observed daily P&L as the unit and better addresses losing-day streaks and session drawdown. Bootstrap still assumes historical sessions are representative and, in this simple form, samples days independently.`,
    `Aquí cada muestra sorteada es una <strong>sesión completa</strong>, no un trade. Esto preserva el P&L diario observado como unidad y responde mejor a rachas de días negativos y drawdown por sesión. Aun así, el bootstrap supone que las sesiones históricas son representativas y, en esta versión simple, sortea días independientemente.`
  );
}

document.addEventListener("i18n:change",renderDayTradeLab);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",renderDayTradeLab,{once:true});else renderDayTradeLab();
