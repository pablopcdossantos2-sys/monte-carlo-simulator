**Read this in other languages:** [Português](README.md) · [English](README-en.md) · [Español](README_ES.md)

# Simulador de Monte Carlo y Estadística para Day Trade

Aplicación web gratuita, client-side y sin dependencias de servidor creada exclusivamente para **day traders**. Estudia probabilidad, expectativa, P&L por sesión, drawdown, riesgo de ruina, validación, costes, overtrading, reglas de prop firms y Monte Carlo, suponiendo operaciones abiertas y cerradas dentro de la misma sesión.

> Proyecto educativo. Las simulaciones no son predicciones ni constituyen asesoramiento financiero.

## Formas de uso

El proyecto está diseñado deliberadamente para dos contextos:

- **GitHub Pages** — versión web, sin backend ni instalación;
- **PC local** — abre `offline.html` con doble clic, sin terminal, Python ni Node.js.

La versión de desarrollo también puede ejecutarse localmente para quienes quieran modificar el código.

Mientras el motor principal pueda seguir siendo 100% client-side, **GitHub Pages seguirá siendo el modo web oficial**. Las funciones futuras que requieran credenciales, bases de datos, procesamiento pesado o APIs privadas deberán ser opcionales o exclusivas de la versión local.

## Objetivo educativo

La herramienta no fue creada solo para generar curvas. Su objetivo es enseñar a **day traders** a pensar en distribuciones de trades y sesiones, supervivencia, expectativa, drawdown, variabilidad, costes y calidad de la evidencia estadística.

Una idea central es:

> una estrategia puede tener ventaja estadística y aun atravesar secuencias difíciles; la gestión de riesgo determina si la cuenta puede sobrevivir el tiempo suficiente para que esa ventaja tenga oportunidad de aparecer.

La aplicación contiene dos recorridos educativos:

1. **Clase práctica guiada** — seis experimentos sobre drawdown, riesgo por trade, Reshuffle, Bootstrap y reglas de prop firms. Cada experimento comienza con un desafío de predicción. Consulta [docs/AULA-PRATICA-GUIADA.md](docs/AULA-PRATICA-GUIADA.md).
2. **Clase intermedia** — seis experimentos sobre win rate, payoff, expectativa, riesgo de ruina y Kelly. Muestra, entre otras cosas, cómo un 70% de acierto puede tener expectativa negativa y cómo un 35% puede tener edge positivo. Consulta [docs/AULA-INTERMEDIARIA.md](docs/AULA-INTERMEDIARIA.md).

## Alcance: solo day trade

El proyecto supone que todas las posiciones se cierran dentro de la misma sesión. No está orientado a swing trading, position trading ni buy and hold. Los conceptos estadísticos generales siguen siendo válidos, pero los ejemplos y nuevas herramientas se priorizan para la operativa intradía.

La jerarquía de análisis es:

    trade → sesión → semana → distribución de sesiones → Monte Carlo

## Funciones principales

- Entrada por parámetros: capital inicial, win rate, reward:risk, riesgo por trade, costes y cantidad de trades.
- Entrada histórica: lista de P&L o CSV con detección de columnas comunes.
- Métodos Monte Carlo para trades:
  - reshuffle / permutación sin reposición;
  - bootstrap con reposición;
  - block bootstrap para conservar parte de la dependencia serial local.
- Position sizing fijo o compuesto.
- Reglas opcionales de evaluación / prop firm:
  - meta de beneficio;
  - pérdida máxima estática;
  - trailing drawdown intradía o EOD;
  - límite de pérdida diaria;
  - cantidad aproximada de trades por día.
- Métricas:
  - probabilidad de beneficio;
  - riesgo de ruina / incumplimiento;
  - probabilidad de alcanzar la meta;
  - probabilidad de alcanzar la meta antes del incumplimiento;
  - saldo final P5/P25/P50/P75/P95;
  - drawdown máximo mediano y P95;
  - peor drawdown observado;
  - racha máxima de pérdidas.
- Simulación GBM con distribución de precios finales y VaR empírico.
- RNG con semilla para resultados reproducibles.
- Exportación de resumen JSON.
- Interfaz responsive adecuada para GitHub Pages.
- Interfaz en **Português (Brasil), English y Español**.
- Laboratorio didáctico de **Probabilidad, Expectativa Matemática y Monte Carlo**, con cuatro artículos integrados:
  - probabilidad en trading;
  - expectativa matemática en R;
  - tamaño de muestra, varianza y convergencia;
  - conexión entre expectativa y simulación de Monte Carlo.
- Herramientas didácticas interactivas:
  - calculadora de expectativa y win rate de equilibrio;
  - distribución binomial de victorias;
  - laboratorio visual de convergencia de la tasa de acierto;
  - mini Monte Carlo que transforma una expectativa teórica en una distribución de resultados.
- Segundo laboratorio de **Estadística Aplicada al Trading**, sobre:
  - probabilidad condicional y contexto de mercado;
  - varianza y desviación estándar;
  - independencia versus dependencia serial;
  - clusters de pérdidas;
  - Ley de los Grandes Números;
  - regresión a la media y selección engañosa de backtests.
- Herramientas adicionales:
  - calculadora de probabilidad condicional;
  - comparador de misma expectativa y distinta dispersión;
  - laboratorio de rachas con dependencia serial;
  - laboratorio de regresión a la media seleccionando la mejor entre muchas muestras idénticas.
- Tercer laboratorio sobre **Distribuciones e Incertidumbre**:
  - distribuciones de retornos en R;
  - eventos raros y riesgo de cola;
  - asimetría y dispersión;
  - actualización bayesiana del win rate;
  - distribución posterior e intervalo de credibilidad;
  - Monte Carlo predictivo con incertidumbre de parámetro.
- Cuarto laboratorio de **Validación de Estrategias**:
  - intervalos de confianza del win rate y tamaño de muestra;
  - pruebas múltiples, data snooping y overfitting;
  - in-sample versus out-of-sample;
  - walk-forward con cambio de régimen;
  - estabilidad de parámetros, mesetas y picos estrechos.
- Herramientas de validación:
  - intervalo de Wilson y estimador aproximado de tamaño de muestra;
  - simulación Monte Carlo de la “campeona” elegida entre muchas configuraciones;
  - laboratorio walk-forward con tres configuraciones y dos regímenes;
  - mapa sintético de estabilidad de parámetros.
- Quinto laboratorio de **Estadística de la Sesión de Day Trade**:
  - P&L diario y probabilidad de sesión positiva;
  - P5/P50/P95 del resultado por sesión;
  - rachas de losing days y semanas negativas;
  - duración del drawdown medida en sesiones;
  - expectativa por franja horaria;
  - overtrading por número ordinal del trade;
  - MFE, MAE y eficiencia de captura;
  - stop diario y giveback;
  - costes y slippage en R;
  - bootstrap de sesiones históricas.
- Herramientas intradía:
  - Monte Carlo por sesión;
  - comparador de expectativa por horario;
  - simulador de deterioro por overtrading;
  - laboratorio de MFE/MAE;
  - comparación de las mismas secuencias sin stop diario y con stop diario;
  - calculadora de erosión por costes;
  - bootstrap donde cada unidad remuestreada es una sesión completa;
  - laboratorio **Cara o Cruz: Stop, Ganancia y Expectativa**, que mantiene deliberadamente 50/50 para separar la incertidumbre del próximo resultado de la estructura controlable de riesgo, payoff, costes y ejecución.
- Clase práctica guiada con desafíos de predicción.
- Clase intermedia sobre:
  - win rate versus payoff;
  - expectativa en R;
  - misma expectativa con distribuciones distintas;
  - riesgo de ruina con diferentes niveles de sizing;
  - interpretación crítica de la fracción de Kelly.
- Tests automatizados del motor y validación de las versiones web/offline.

## Inicio rápido

### Opción 1 — GitHub Pages

La versión web está disponible en:

    https://pablopcdossantos2-sys.github.io/monte-carlo-simulator/

### Opción 2 — Uso local sin terminal

Descarga `offline.html` y ábrelo con doble clic. Es una versión completa en un único archivo y no requiere Python ni Node.js.

Consulta [docs/USO-LOCAL.md](docs/USO-LOCAL.md).

### Opción 3 — Proyecto completo local para desarrollo

Con Python 3:

    python -m http.server 8000

Después abre:

    http://localhost:8000

Para ejecutar tests locales con Node.js 20+:

    npm test

Hay un CSV de ejemplo en `examples/trades.csv`.

## Estructura

- `index.html` — interfaz de GitHub Pages.
- `offline.html` — versión local autosuficiente.
- `styles.css` — estilos.
- `i18n.js` — localización PT-BR / English / Español.
- `app.js` — interfaz principal, gráficos y clase introductoria.
- `intermediate.js` — clase intermedia.
- `education.js` — artículos y herramientas interactivas sobre probabilidad, expectativa, muestreo y Monte Carlo.
- `statistics.js` — laboratorio de estadística aplicada sobre contexto, dispersión, dependencia y regresión a la media.
- `inference.js` — laboratorio de distribuciones, riesgo de cola y actualización bayesiana.
- `validation.js` — laboratorio de validación, overfitting, OOS, walk-forward y estabilidad de parámetros.
- `daytrade.js` — laboratorio de estadística intradía, P&L por sesión, overtrading, stop diario, costes y bootstrap de sesiones.
- `core.js` — motor estadístico y Monte Carlo sin dependencia del DOM.
- `tests/core.test.mjs` — tests automatizados.
- `docs/METHODOLOGY.md` — metodología, hipótesis, limitaciones y referencias.
- `docs/GUIA-DIDATICO.md` — guía educativa para principiantes.
- `docs/AULA-PRATICA-GUIADA.md` — programa de la clase introductoria.
- `docs/AULA-INTERMEDIARIA.md` — clase sobre expectativa, payoff, ruina y Kelly.
- `docs/USO-LOCAL.md` — instrucciones de uso local.
- `docs/GITHUB-PAGES.md` — guía de publicación en GitHub Pages.
- `.github/workflows/tests.yml` — CI.
- `.github/workflows/pages.yml` — deployment de GitHub Pages.

## Principios metodológicos

El simulador evita tratar una única equity curve histórica como un futuro determinista. Genera distribuciones y separa métodos con objetivos distintos:

- **Reshuffle** pregunta principalmente cuánto cambia el drawdown al variar el orden de los mismos trades.
- **Bootstrap** pregunta qué ocurre si el futuro es otra muestra de la distribución empírica observada.
- **Block bootstrap** intenta conservar dependencia local.
- **Modo paramétrico** analiza una hipótesis explícita de win rate, payoff y sizing.
- **GBM** es un modelo simplificado de precio y no representa por sí solo saltos, colas pesadas, volatilidad variable ni regímenes.

Lee `docs/METHODOLOGY.md` antes de interpretar percentiles como predicciones.

## GitHub Pages

El repositorio ya incluye `.github/workflows/pages.yml`. Los pushes a `main` publican automáticamente la aplicación estática actual.

Guía: [docs/GITHUB-PAGES.md](docs/GITHUB-PAGES.md).

## Aviso

Los resultados de backtests y Monte Carlo dependen de la calidad y representatividad de los datos y supuestos de entrada. Monte Carlo no corrige overfitting, sesgo de selección, costes omitidos, cambios de régimen, problemas de ejecución, liquidez ni errores del backtest original.

## Licencia

MIT.
