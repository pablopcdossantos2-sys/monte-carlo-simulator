import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");

let html = read("index.html");
const css = read("styles.css");
const core = read("core.js");
const i18n = read("i18n.js");
const app = read("app.js");
const intermediate = read("intermediate.js");

html = html.replace(
  '  <link rel="stylesheet" href="styles.css" />',
  `  <style>\n${css}\n  </style>`
);

html = html.replace('  <script src="i18n.js"></script>', `  <script>\n${i18n}\n  </script>`);
html = html.replace('  <script type="module" src="app.js"></script>', "");
html = html.replace('  <script type="module" src="intermediate.js"></script>', "");

const coreClassic = core.replace(/\bexport\s+(?=(function|const|let|class)\b)/g, "");
const appClassic = app.replace(
  /^import\s+\{[^}]+\}\s+from\s+["']\.\/core\.js["'];\s*/m,
  ""
);
const intermediateClassic = intermediate.replace(
  /^import\s+\{[^}]+\}\s+from\s+["']\.\/core\.js["'];\s*/m,
  ""
);

html = html.replace(
  "</body>",
  `  <script>\n${coreClassic}\n\n${appClassic}\n\n${intermediateClassic}\n  </script>\n</body>`
);

html = html.replace(
  "<title>Monte Carlo Trading Simulator</title>",
  "<title>Monte Carlo Trading Simulator — Offline</title>"
);

html = html.replace(
  '<div class="hero__badge">100% no navegador<br><span>seus dados não são enviados</span></div>',
  '<div class="hero__badge">VERSÃO OFFLINE<br><span>abra este arquivo com duplo clique</span></div>'
);

html = html.replace(
  /<a href="offline\.html" download>Baixar versão offline<\/a>/g,
  '<a href="https://github.com/pablopcdossantos2-sys/monte-carlo-simulator">Ver projeto no GitHub</a>'
);

html = html.replace(
`    <section class="panel compact access-panel">
      <p class="eyebrow">ONDE USAR</p>
      <h2>Web ou computador local</h2>
      <div class="mode-explainer">
        <div><strong>GitHub Pages</strong><span>Abra no navegador e use normalmente. Todo o cálculo continua sendo feito no seu dispositivo.</span></div>
        <div><strong>Versão offline</strong><span>Baixe <code>offline.html</code> e abra com dois cliques. Não exige terminal, Python, Node.js ou instalação.</span></div>
      </div>
      <div class="actions">
        <a class="secondary button-link" href="offline.html" download>Baixar offline.html</a>
        <a class="secondary button-link" href="docs/USO-LOCAL.md">Ver tutorial de uso local</a>
        <a class="secondary button-link" href="docs/GUIA-DIDATICO.md">Abrir guia didático</a>
      </div>
    </section>`,
`    <section class="panel compact access-panel">
      <p class="eyebrow">VOCÊ ESTÁ NA VERSÃO OFFLINE</p>
      <h2>Pronta para uso local</h2>
      <p>Este arquivo é autossuficiente: a interface, os gráficos e o motor estatístico estão incorporados nele. Você pode guardá-lo em qualquer pasta e abri-lo novamente com dois cliques.</p>
      <div class="actions">
        <a class="secondary button-link" href="https://github.com/pablopcdossantos2-sys/monte-carlo-simulator">Ver projeto e documentação no GitHub</a>
      </div>
    </section>`
);

fs.writeFileSync("offline.html", html);
console.log("offline.html atualizado.");
