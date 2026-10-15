import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");

let html = read("index.html");
const css = read("styles.css");
const core = read("core.js");
const i18n = read("i18n.js");
const app = read("app.js");
const education = read("education.js");
const intermediate = read("intermediate.js");

html = html.replace(
  '  <link rel="stylesheet" href="styles.css" />',
  `  <style>\n${css}\n  </style>`
);

html = html.replace('  <script src="i18n.js"></script>', `  <script>\n${i18n}\n  </script>`);
html = html.replace('  <script type="module" src="app.js"></script>', "");
html = html.replace('  <script type="module" src="education.js"></script>', "");
html = html.replace('  <script type="module" src="intermediate.js"></script>', "");

const coreClassic = core.replace(/\bexport\s+(?=(function|const|let|class)\b)/g, "");
const appClassic = app.replace(
  /^import\s+\{[^}]+\}\s+from\s+["']\.\/core\.js["'];\s*/m,
  ""
);
const educationClassic = education.replace(
  /^import\s+\{[^}]+\}\s+from\s+["']\.\/core\.js["'];\s*/m,
  ""
);
const intermediateClassic = intermediate.replace(
  /^import\s+\{[^}]+\}\s+from\s+["']\.\/core\.js["'];\s*/m,
  ""
);

html = html.replace(
  "</body>",
  `  <script>\n${coreClassic}\n\n${appClassic}\n\n${educationClassic}\n\n${intermediateClassic}\n  </script>\n</body>`
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


fs.writeFileSync("offline.html", html);
console.log("offline.html atualizado.");
