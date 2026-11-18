/**
 * quadratic_calculator.js - Calculadora Interactiva de Fórmula General (ax^2 + bx + c = 0)
 * Integrada con KaTeX y Plotly.js en Material Design 3
 */

document.addEventListener('DOMContentLoaded', () => {
  const inputA = document.getElementById('qf-input-a');
  const inputB = document.getElementById('qf-input-b');
  const inputC = document.getElementById('qf-input-c');
  const calcBtn = document.getElementById('qf-calculate-btn');
  const errorBox = document.getElementById('qf-error-box');
  const equationDisplay = document.getElementById('qf-equation-display');
  const discriminantBadge = document.getElementById('qf-discriminant-badge');
  const x1Output = document.getElementById('qf-x1-output');
  const x2Output = document.getElementById('qf-x2-output');
  const vertexOutput = document.getElementById('qf-vertex-output');
  const stepsContainer = document.getElementById('qf-steps-container');
  const plotContainer = document.getElementById('qf-plotly-chart');
  const presetBtns = document.querySelectorAll('.qf-preset-btn');

  if (!inputA || !inputB || !inputC) return;

  function formatNumber(num) {
    if (Math.abs(num) < 1e-10) return '0';
    return Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(4)).toString();
  }

  function formatSignedTerm(coef, variablePart, isFirst = false) {
    if (coef === 0) return '';
    const absVal = Math.abs(coef);
    const numStr = variablePart && absVal === 1 ? '' : formatNumber(absVal);
    if (isFirst) {
      return `${coef < 0 ? '-' : ''}${numStr}${variablePart}`;
    }
    return `${coef < 0 ? ' - ' : ' + '}${numStr}${variablePart}`;
  }

  function buildEquationLatex(a, b, c) {
    let expr = formatSignedTerm(a, 'x^2', true);
    expr += formatSignedTerm(b, 'x', false);
    if (c !== 0) expr += formatSignedTerm(c, '', false);
    return `${expr} = 0`;
  }

  function renderMathIn(element) {
    if (typeof renderMathInElement === 'function' && element) {
      renderMathInElement(element, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  function calculateQuadratic() {
    const a = parseFloat(inputA.value);
    const b = parseFloat(inputB.value);
    const c = parseFloat(inputC.value);

    if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(c)) {
      errorBox.textContent = 'Por favor ingresa valores numéricos válidos para a, b y c.';
      errorBox.classList.remove('hidden');
      return;
    }

    if (Math.abs(a) < 1e-12) {
      errorBox.textContent = 'El coeficiente "a" no puede ser 0 en una ecuación cuadrática (ax² + bx + c = 0).';
      errorBox.classList.remove('hidden');
      return;
    }

    errorBox.classList.add('hidden');

    const delta = b * b - 4 * a * c;
    const h = -b / (2 * a);
    const k = a * h * h + b * h + c;
    const denom = 2 * a;

    equationDisplay.innerHTML = `$$${buildEquationLatex(a, b, c)}$$`;
    vertexOutput.textContent = `V(${formatNumber(h)}, ${formatNumber(k)})`;

    let rootsTypeLabel = '';
    let badgeClasses = '';
    let x1Latex = '';
    let x2Latex = '';
    let x1Text = '';
    let x2Text = '';
    let realRoots = [];

    if (delta > 1e-10) {
      const sqrtDelta = Math.sqrt(delta);
      const x1 = (-b + sqrtDelta) / denom;
      const x2 = (-b - sqrtDelta) / denom;
      realRoots = [x1, x2];
      rootsTypeLabel = `Δ = ${formatNumber(delta)} > 0 • 2 Raíces Reales Distintas`;
      badgeClasses = 'bg-emerald-100 text-emerald-900 border-emerald-200';
      x1Text = formatNumber(x1);
      x2Text = formatNumber(x2);
      x1Latex = `x_1 = \\frac{${formatNumber(-b)} + \\sqrt{${formatNumber(delta)}}}{${formatNumber(denom)}} = ${x1Text}`;
      x2Latex = `x_2 = \\frac{${formatNumber(-b)} - \\sqrt{${formatNumber(delta)}}}{${formatNumber(denom)}} = ${x2Text}`;
    } else if (Math.abs(delta) <= 1e-10) {
      const x0 = -b / denom;
      realRoots = [x0];
      rootsTypeLabel = `Δ = 0 • 1 Raíz Real Doble`;
      badgeClasses = 'bg-amber-100 text-amber-900 border-amber-200';
      x1Text = formatNumber(x0);
      x2Text = formatNumber(x0);
      x1Latex = `x_1 = x_2 = \\frac{${formatNumber(-b)}}{${formatNumber(denom)}} = ${x1Text}`;
      x2Latex = x1Latex;
    } else {
      const realPart = -b / denom;
      const imagPart = Math.sqrt(Math.abs(delta)) / Math.abs(denom);
      rootsTypeLabel = `Δ = ${formatNumber(delta)} < 0 • 2 Raíces Complejas Conjugadas`;
      badgeClasses = 'bg-purple-100 text-purple-900 border-purple-200';
      const realStr = formatNumber(realPart);
      const imagStr = formatNumber(imagPart);
      x1Text = `${realStr} + ${imagStr}i`;
      x2Text = `${realStr} - ${imagStr}i`;
      x1Latex = `x_1 = ${realStr} + ${imagStr}i`;
      x2Latex = `x_2 = ${realStr} - ${imagStr}i`;
    }

    discriminantBadge.className = `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeClasses}`;
    discriminantBadge.innerHTML = `<span class="material-symbols-outlined text-sm">analytics</span><span>${rootsTypeLabel}</span>`;

    x1Output.textContent = x1Text;
    x2Output.textContent = x2Text;

    const bParen = b < 0 ? `(${formatNumber(b)})` : formatNumber(b);
    const aParen = a < 0 ? `(${formatNumber(a)})` : formatNumber(a);
    const cParen = c < 0 ? `(${formatNumber(c)})` : formatNumber(c);

    stepsContainer.innerHTML = `
      <div class="m3-card-sub p-4">
        <div class="text-xs font-bold text-[#123062] uppercase tracking-wider mb-1">Paso 1: Identificar coeficientes y fórmula general</div>
        <div class="text-sm text-slate-700">$$a = ${formatNumber(a)}, \\quad b = ${formatNumber(b)}, \\quad c = ${formatNumber(c)} \\qquad\\Longrightarrow\\qquad x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$</div>
      </div>
      <div class="m3-card-sub p-4">
        <div class="text-xs font-bold text-[#123062] uppercase tracking-wider mb-1">Paso 2: Calcular el discriminante</div>
        <div class="text-sm text-slate-700">$$\\Delta = ${bParen}^2 - 4${aParen}${cParen} = ${formatNumber(b * b)} - (${formatNumber(4 * a * c)}) = ${formatNumber(delta)}$$</div>
      </div>
      <div class="m3-card-sub p-4">
        <div class="text-xs font-bold text-[#123062] uppercase tracking-wider mb-1">Paso 3: Sustituir y obtener las raíces</div>
        <div class="text-sm text-slate-700">$$x = \\frac{-(${formatNumber(b)}) \\pm \\sqrt{${formatNumber(delta)}}}{2${aParen}} \\quad\\Longrightarrow\\quad ${x1Latex}, \\quad ${x2Latex}$$</div>
      </div>
    `;

    renderMathIn(equationDisplay);
    renderMathIn(stepsContainer);
    renderParabolaPlot(a, b, c, h, k, realRoots);
  }

  function renderParabolaPlot(a, b, c, h, k, realRoots) {
    if (typeof Plotly === 'undefined' || !plotContainer) return;

    const spread = realRoots.length === 2
      ? Math.max(3, Math.abs(realRoots[1] - realRoots[0]) * 1.2)
      : 5;
    const xMin = h - spread;
    const xMax = h + spread;
    const numPts = 300;
    const xs = [];
    const ys = [];
    for (let i = 0; i < numPts; i++) {
      const x = xMin + (i / (numPts - 1)) * (xMax - xMin);
      xs.push(x);
      ys.push(a * x * x + b * x + c);
    }

    const traces = [
      {
        x: xs,
        y: ys,
        type: 'scatter',
        mode: 'lines',
        name: 'f(x) = ax² + bx + c',
        line: { color: '#123062', width: 3 }
      },
      {
        x: [h],
        y: [k],
        type: 'scatter',
        mode: 'markers+text',
        name: 'Vértice',
        text: [`V(${formatNumber(h)}, ${formatNumber(k)})`],
        textposition: a > 0 ? 'bottom center' : 'top center',
        marker: { color: '#f59e0b', size: 10, symbol: 'diamond' }
      }
    ];

    if (realRoots.length > 0) {
      traces.push({
        x: realRoots,
        y: realRoots.map(() => 0),
        type: 'scatter',
        mode: 'markers+text',
        name: 'Raíces reales',
        text: realRoots.map((r, idx) => `x${idx + 1}=${formatNumber(r)}`),
        textposition: 'top center',
        marker: { color: '#dc2626', size: 10 }
      });
    }

    const layout = {
      title: { text: `Gráfica de f(x) = ${buildEquationLatex(a, b, c).replace(' = 0', '')}`, font: { size: 14, color: '#123062' } },
      margin: { t: 45, r: 25, b: 45, l: 50 },
      xaxis: { title: 'x', zeroline: true, zerolinecolor: '#334155', zerolinewidth: 1.5, gridcolor: '#e2e8f0' },
      yaxis: { title: 'f(x)', zeroline: true, zerolinecolor: '#334155', zerolinewidth: 1.5, gridcolor: '#e2e8f0' },
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#f8fafc',
      legend: { orientation: 'h', y: -0.18 }
    };

    Plotly.newPlot(plotContainer, traces, layout, { responsive: true, displayModeBar: true });
  }

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      inputA.value = btn.getAttribute('data-a');
      inputB.value = btn.getAttribute('data-b');
      inputC.value = btn.getAttribute('data-c');
      calculateQuadratic();
    });
  });

  calcBtn.addEventListener('click', calculateQuadratic);
  [inputA, inputB, inputC].forEach((inp) => inp.addEventListener('input', calculateQuadratic));

  window.renderQuadraticCalculator = calculateQuadratic;
  calculateQuadratic();
});
