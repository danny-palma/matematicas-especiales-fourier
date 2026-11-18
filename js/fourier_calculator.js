/**
 * fourier_calculator.js - Calculadora General de Series e Integrales de Fourier
 * Permite ingresar cualquier función por tramos en la web, calcular coeficientes
 * numéricamente y graficar en tiempo real con Plotly.js y KaTeX.
 */

document.addEventListener('DOMContentLoaded', () => {
  const styleSelect = document.getElementById('fg-style-select');
  const numPartsInput = document.getElementById('fg-num-parts');
  const piecesContainer = document.getElementById('fg-pieces-container');
  const xMinInput = document.getElementById('fg-xmin');
  const xMaxInput = document.getElementById('fg-xmax');
  const sliderN = document.getElementById('fg-slider-n');
  const sliderNVal = document.getElementById('fg-slider-n-val');
  const compareCheck = document.getElementById('fg-compare-check');
  const calcBtn = document.getElementById('fg-calculate-btn');
  const errorBox = document.getElementById('fg-error-box');
  const infoBadge = document.getElementById('fg-info-badge');
  const coeffsBox = document.getElementById('fg-coeffs-output');
  const plotContainer = document.getElementById('fg-plotly-chart');
  const presetBtns = document.querySelectorAll('.fg-preset-btn');

  if (!styleSelect || !numPartsInput || !piecesContainer) return;

  const defaultPieces = [
    { inf: '-2', sup: '0', expr: '-1' },
    { inf: '0', sup: '2', expr: '1' }
  ];

  function sanitizeMathExpr(raw) {
    return String(raw)
      .trim()
      .replace(/\^/g, '**')
      .replace(/\bnp\./g, '')
      .replace(/\bsen\b/gi, 'sin');
  }

  function evalMathExpr(expr, xVal = 0) {
    const cleaned = sanitizeMathExpr(expr);
    const fn = new Function(
      'x', 'pi', 'e', 'sin', 'cos', 'tan', 'exp', 'abs', 'sqrt', 'log',
      `"use strict"; return (${cleaned});`
    );
    const res = fn(
      xVal, Math.PI, Math.E,
      Math.sin, Math.cos, Math.tan, Math.exp, Math.abs, Math.sqrt, Math.log
    );
    if (typeof res !== 'number' || Number.isNaN(res)) {
      throw new Error(`Expresión inválida: "${expr}"`);
    }
    return res;
  }

  function simpsonIntegrate(fn, a, b, steps = 120) {
    if (Math.abs(b - a) < 1e-12) return 0;
    const n = steps % 2 === 0 ? steps : steps + 1;
    const h = (b - a) / n;
    let sum = fn(a) + fn(b);
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      sum += (i % 2 === 0 ? 2 : 4) * fn(x);
    }
    return (h / 3) * sum;
  }

  function renderPieceRows(presetPieces = null) {
    const count = Math.max(1, Math.min(6, parseInt(numPartsInput.value, 10) || 2));
    numPartsInput.value = count;

    const existing = [];
    if (!presetPieces) {
      piecesContainer.querySelectorAll('.fg-piece-row').forEach((row) => {
        existing.push({
          inf: row.querySelector('.fg-inf').value,
          sup: row.querySelector('.fg-sup').value,
          expr: row.querySelector('.fg-expr').value
        });
      });
    }

    piecesContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const data = (presetPieces && presetPieces[i]) || existing[i] || defaultPieces[i] || { inf: '0', sup: '1', expr: 'x' };
      const row = document.createElement('div');
      row.className = 'fg-piece-row grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200';
      row.innerHTML = `
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1">Tramo ${i + 1}: Límite inferior</label>
          <input type="text" class="fg-inf w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white focus:ring-2 focus:ring-blue-500 outline-none" value="${data.inf}">
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1">Tramo ${i + 1}: Límite superior</label>
          <input type="text" class="fg-sup w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white focus:ring-2 focus:ring-blue-500 outline-none" value="${data.sup}">
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1">Expresión f(x)</label>
          <input type="text" class="fg-expr w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white focus:ring-2 focus:ring-blue-500 outline-none" value="${data.expr}">
        </div>
      `;
      piecesContainer.appendChild(row);
    }
  }

  function readPieces() {
    const pieces = [];
    piecesContainer.querySelectorAll('.fg-piece-row').forEach((row) => {
      const a = evalMathExpr(row.querySelector('.fg-inf').value, 0);
      const b = evalMathExpr(row.querySelector('.fg-sup').value, 0);
      const expr = row.querySelector('.fg-expr').value.trim();
      if (!expr) throw new Error('Todas las expresiones f(x) deben tener un valor.');
      if (b <= a) throw new Error('En cada tramo, el límite superior debe ser mayor al inferior.');
      evalMathExpr(expr, (a + b) / 2);
      pieces.push({ a, b, expr });
    });
    return pieces;
  }

  function evaluateOriginal(xs, pieces, isPeriodic) {
    const baseStart = pieces[0].a;
    const baseEnd = pieces[pieces.length - 1].b;
    const period = baseEnd - baseStart;

    return xs.map((xRaw) => {
      let x = xRaw;
      if (isPeriodic && period > 0) {
        x = baseStart + ((((xRaw - baseStart) % period) + period) % period);
      }
      for (const p of pieces) {
        if (x >= p.a - 1e-9 && x <= p.b + 1e-9) {
          return evalMathExpr(p.expr, x);
        }
      }
      return 0;
    });
  }

  function computeSeries(xs, pieces, nMax, style) {
    const p = (pieces[pieces.length - 1].b - pieces[0].a) / 2;
    let a0 = 0;
    if (style === 'serie_general' || style === 'serie_cosenos' || style === 'serie_compleja') {
      for (const tr of pieces) {
        a0 += (1 / p) * simpsonIntegrate((x) => evalMathExpr(tr.expr, x), tr.a, tr.b);
      }
    }

    const ans = [];
    const bns = [];
    for (let n = 1; n <= nMax; n++) {
      const w = (n * Math.PI) / p;
      let an = 0;
      let bn = 0;
      for (const tr of pieces) {
        if (style === 'serie_general' || style === 'serie_cosenos' || style === 'serie_compleja') {
          an += (1 / p) * simpsonIntegrate((x) => evalMathExpr(tr.expr, x) * Math.cos(w * x), tr.a, tr.b);
        }
        if (style === 'serie_general' || style === 'serie_senos' || style === 'serie_compleja') {
          bn += (1 / p) * simpsonIntegrate((x) => evalMathExpr(tr.expr, x) * Math.sin(w * x), tr.a, tr.b);
        }
      }
      ans.push(an);
      bns.push(bn);
    }

    const ys = xs.map((x) => {
      let val = a0 / 2;
      for (let n = 1; n <= nMax; n++) {
        const w = (n * Math.PI) / p;
        val += ans[n - 1] * Math.cos(w * x) + bns[n - 1] * Math.sin(w * x);
      }
      return val;
    });

    return { ys, p, a0, ans, bns };
  }

  function computeIntegral(xs, pieces, bMax, style) {
    const alphaSteps = 90;
    const dAlpha = bMax / alphaSteps;
    const alphas = [];
    const As = [];
    const Bs = [];

    for (let i = 0; i <= alphaSteps; i++) {
      const alpha = Math.max(1e-4, i * dAlpha);
      alphas.push(alpha);
      let A = 0;
      let B = 0;
      for (const tr of pieces) {
        if (style === 'integral_general' || style === 'integral_cosenos') {
          A += simpsonIntegrate((t) => evalMathExpr(tr.expr, t) * Math.cos(alpha * t), tr.a, tr.b, 80);
        }
        if (style === 'integral_general' || style === 'integral_senos') {
          B += simpsonIntegrate((t) => evalMathExpr(tr.expr, t) * Math.sin(alpha * t), tr.a, tr.b, 80);
        }
      }
      As.push(A);
      Bs.push(B);
    }

    const ys = xs.map((x) => {
      let integral = 0;
      for (let i = 0; i <= alphaSteps; i++) {
        const weight = (i === 0 || i === alphaSteps) ? 0.5 : 1.0;
        const alpha = alphas[i];
        integral += weight * (As[i] * Math.cos(alpha * x) + Bs[i] * Math.sin(alpha * x));
      }
      return (1 / Math.PI) * integral * dAlpha;
    });

    return { ys, As, Bs };
  }

  function calculateAndPlot() {
    try {
      errorBox.classList.add('hidden');
      const style = styleSelect.value;
      const pieces = readPieces();
      const xMin = evalMathExpr(xMinInput.value, 0);
      const xMax = evalMathExpr(xMaxInput.value, 0);
      if (xMax <= xMin) throw new Error('El límite derecho (x máximo) debe ser mayor al izquierdo (x mínimo).');

      const nVal = parseInt(sliderN.value, 10) || 5;
      sliderNVal.textContent = nVal;
      const isPeriodic = style.startsWith('serie');

      const numPts = 400;
      const xs = Array.from({ length: numPts }, (_, i) => xMin + (i / (numPts - 1)) * (xMax - xMin));
      const yOrig = evaluateOriginal(xs, pieces, isPeriodic);

      const traces = [
        {
          x: xs,
          y: yOrig,
          type: 'scatter',
          mode: 'lines',
          name: 'Función Original f(x)',
          line: { color: '#2563eb', width: 2.5, dash: 'dash' }
        }
      ];

      let summaryHtml = '';

      if (compareCheck.checked) {
        const configs = [
          { val: 5, color: '#f59e0b' },
          { val: 10, color: '#10b981' },
          { val: 20, color: '#dc2626' }
        ];
        configs.forEach(({ val, color }) => {
          const approx = isPeriodic
            ? computeSeries(xs, pieces, val, style).ys
            : computeIntegral(xs, pieces, val, style).ys;
          traces.push({
            x: xs,
            y: approx,
            type: 'scatter',
            mode: 'lines',
            name: `Aproximación (${isPeriodic ? 'n' : 'b'} = ${val})`,
            line: { color, width: 2 }
          });
        });
        summaryHtml = `<span class="font-bold text-[#123062]">Modo Comparativa Activo:</span> Superponiendo curvas para 5, 10 y 20 ${isPeriodic ? 'armónicos' : 'frecuencia máxima b'}.`;
      } else {
        if (isPeriodic) {
          const res = computeSeries(xs, pieces, nVal, style);
          traces.push({
            x: xs,
            y: res.ys,
            type: 'scatter',
            mode: 'lines',
            name: `Serie de Fourier (n = ${nVal})`,
            line: { color: '#dc2626', width: 2.5 }
          });
          const preview = [1, 2, 3]
            .filter((k) => k <= res.ans.length)
            .map((k) => `a_${k} = ${res.ans[k - 1].toFixed(3)}, \\; b_${k} = ${res.bns[k - 1].toFixed(3)}`)
            .join(' \\quad | \\quad ');
          summaryHtml = `$$p = ${res.p.toFixed(3)}, \\quad a_0 = ${res.a0.toFixed(4)} \\quad | \\quad ${preview}$$`;
        } else {
          const res = computeIntegral(xs, pieces, nVal, style);
          traces.push({
            x: xs,
            y: res.ys,
            type: 'scatter',
            mode: 'lines',
            name: `Integral de Fourier (b = ${nVal})`,
            line: { color: '#dc2626', width: 2.5 }
          });
          summaryHtml = `$$F_b(x) = \\frac{1}{\\pi}\\int_0^{${nVal}} [A(\\alpha)\\cos(\\alpha x) + B(\\alpha)\\sin(\\alpha x)]\\,d\\alpha$$`;
        }
      }

      const baseStart = pieces[0].a;
      const baseEnd = pieces[pieces.length - 1].b;
      infoBadge.textContent = `${isPeriodic ? 'Serie Periódica' : 'Integral No Periódica'} • Base [${baseStart.toFixed(2)}, ${baseEnd.toFixed(2)}]`;
      coeffsBox.innerHTML = summaryHtml;

      if (typeof renderMathInElement === 'function') {
        renderMathInElement(coeffsBox, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      }

      if (typeof Plotly !== 'undefined' && plotContainer) {
        Plotly.newPlot(
          plotContainer,
          traces,
          {
            title: { text: `Calculadora General de Fourier (${style})`, font: { size: 14, color: '#123062' } },
            margin: { t: 45, r: 25, b: 50, l: 50 },
            xaxis: { title: 'x', zeroline: true, zerolinecolor: '#334155', gridcolor: '#e2e8f0' },
            yaxis: { title: 'f(x) vs Aproximación', zeroline: true, zerolinecolor: '#334155', gridcolor: '#e2e8f0' },
            shapes: [
              {
                type: 'rect',
                xref: 'x',
                yref: 'paper',
                x0: baseStart,
                x1: baseEnd,
                y0: 0,
                y1: 1,
                fillcolor: 'rgba(148, 163, 184, 0.14)',
                line: { width: 0 }
              }
            ],
            paper_bgcolor: '#ffffff',
            plot_bgcolor: '#f8fafc',
            legend: { orientation: 'h', y: -0.2 }
          },
          { responsive: true, displayModeBar: true }
        );
      }
    } catch (err) {
      errorBox.textContent = err.message || 'Verifica los límites y expresiones ingresadas.';
      errorBox.classList.remove('hidden');
    }
  }

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      styleSelect.value = btn.getAttribute('data-style');
      const pieces = JSON.parse(btn.getAttribute('data-pieces'));
      numPartsInput.value = pieces.length;
      renderPieceRows(pieces);
      xMinInput.value = btn.getAttribute('data-xmin');
      xMaxInput.value = btn.getAttribute('data-xmax');
      calculateAndPlot();
    });
  });

  numPartsInput.addEventListener('change', () => renderPieceRows());
  calcBtn.addEventListener('click', calculateAndPlot);
  sliderN.addEventListener('input', calculateAndPlot);
  compareCheck.addEventListener('change', calculateAndPlot);
  styleSelect.addEventListener('change', calculateAndPlot);

  renderPieceRows();
  window.renderFourierGeneralCalculator = calculateAndPlot;
  calculateAndPlot();
});
