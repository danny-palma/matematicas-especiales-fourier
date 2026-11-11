/**
 * app.js - Controlador principal de la interfaz y visualización interactiva
 * Matemáticas Especiales - Corte 3 (Universidad ECCI)
 * Autor: Danny Palma
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estado de la aplicación
  const state = {
    currentTaller: 5,
    currentExerciseId: 't5_ej1',
    customN: 15,
    customB: 25,
    activeSubTab: 'analitica',
    studentData: {
      studentName: 'Danny Palma',
      studentCode: 'Código Estudiantil',
      professorName: 'Docente de Matemáticas Especiales',
      subject: 'Matemáticas Especiales - Corte 3',
      university: 'Universidad ECCI'
    }
  };

  // Cargar datos institucionales desde localStorage si existen
  const savedData = localStorage.getItem('ecci_fourier_student_data');
  if (savedData) {
    try {
      state.studentData = Object.assign(state.studentData, JSON.parse(savedData));
    } catch (e) {
      console.error('Error al cargar datos guardados:', e);
    }
  }

  // Elementos DOM
  const studentBadge = document.getElementById('student-info-badge');
  const exerciseTitle = document.getElementById('exercise-title');
  const exerciseSubtitle = document.getElementById('exercise-subtitle');
  const exerciseFormula = document.getElementById('exercise-formula');
  const symmetryBadge = document.getElementById('symmetry-badge');
  const periodBadge = document.getElementById('period-badge');
  const intervalBadge = document.getElementById('interval-badge');
  const plotContainer = document.getElementById('plotly-chart');
  const analyticalContainer = document.getElementById('analytical-steps-container');
  const dirichletContainer = document.getElementById('dirichlet-analysis-container');
  const pythonCodeBlock = document.getElementById('python-code-content');
  const sliderNContainer = document.getElementById('slider-n-container');
  const sliderBContainer = document.getElementById('slider-b-container');
  const sliderNInput = document.getElementById('slider-n-input');
  const sliderBInput = document.getElementById('slider-b-input');
  const sliderNVal = document.getElementById('slider-n-value');
  const sliderBVal = document.getElementById('slider-b-value');

  // Inicializar UI de Portada
  function updateHeaderStudentInfo() {
    studentBadge.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 text-sm text-blue-100">
        <span class="font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-full">${state.studentData.studentName}</span>
        <span>•</span>
        <span>${state.studentData.studentCode}</span>
        <span>•</span>
        <span class="text-amber-300 font-medium">${state.studentData.subject}</span>
        <span>•</span>
        <span>Docente: ${state.studentData.professorName}</span>
      </div>
    `;
  }

  // Selector de Taller (5 vs 6)
  const tabTaller5 = document.getElementById('tab-taller-5');
  const tabTaller6 = document.getElementById('tab-taller-6');
  const exercisesPillsContainer = document.getElementById('exercise-pills-container');

  function renderExercisePills() {
    exercisesPillsContainer.innerHTML = '';
    const exercisesInTaller = Object.values(ExercisesData).filter(
      (ex) => ex.taller === state.currentTaller
    );

    exercisesInTaller.forEach((ex) => {
      const pill = document.createElement('button');
      pill.className = `exercise-pill px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
        ex.id === state.currentExerciseId
          ? 'active bg-[#123062] text-white border-[#123062] shadow-md'
          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
      }`;
      pill.textContent = `${ex.number}: ${ex.title}`;
      pill.addEventListener('click', () => {
        state.currentExerciseId = ex.id;
        renderExercisePills();
        loadCurrentExercise();
      });
      exercisesPillsContainer.appendChild(pill);
    });
  }

  tabTaller5.addEventListener('click', () => {
    state.currentTaller = 5;
    tabTaller5.classList.add('active', 'bg-[#123062]', 'text-white');
    tabTaller5.classList.remove('text-slate-600', 'hover:bg-slate-100');
    tabTaller6.classList.remove('active', 'bg-[#123062]', 'text-white');
    tabTaller6.classList.add('text-slate-600', 'hover:bg-slate-100');
    state.currentExerciseId = 't5_ej1';
    renderExercisePills();
    loadCurrentExercise();
  });

  tabTaller6.addEventListener('click', () => {
    state.currentTaller = 6;
    tabTaller6.classList.add('active', 'bg-[#123062]', 'text-white');
    tabTaller6.classList.remove('text-slate-600', 'hover:bg-slate-100');
    tabTaller5.classList.remove('active', 'bg-[#123062]', 'text-white');
    tabTaller5.classList.add('text-slate-600', 'hover:bg-slate-100');
    state.currentExerciseId = 't6_ej2_gen';
    renderExercisePills();
    loadCurrentExercise();
  });

  // Cargar datos y renderizar ejercicio actual
  function loadCurrentExercise() {
    const ex = ExercisesData[state.currentExerciseId];
    if (!ex) return;

    // Encabezado
    exerciseTitle.textContent = `${ex.section} - ${ex.number}: ${ex.title}`;
    exerciseSubtitle.textContent = `Taller ${ex.taller} | Intervalo: ${ex.interval}`;
    exerciseFormula.innerHTML = `$$${ex.definitionLatex}$$`;
    symmetryBadge.textContent = ex.symmetry;
    periodBadge.textContent = ex.period;
    intervalBadge.textContent = `Dominio: ${ex.interval}`;

    // Mostrar el slider correspondiente
    if (ex.type === 'series') {
      sliderNContainer.classList.remove('hidden');
      sliderBContainer.classList.add('hidden');
      sliderNVal.textContent = state.customN;
    } else {
      sliderNContainer.classList.add('hidden');
      sliderBContainer.classList.remove('hidden');
      sliderBVal.textContent = state.customB;
    }

    // Renderizar Gráfico Plotly
    renderPlot(ex);

    // Renderizar Memoria Analítica
    renderAnalyticalSteps(ex);

    // Renderizar Análisis de Dirichlet y Gibbs
    renderDirichletAnalysis(ex);

    // Código Python
    pythonCodeBlock.textContent = ex.pythonCode;

    // Renderizar fórmulas con KaTeX
    if (window.renderMathInElement) {
      renderMathInElement(document.getElementById('exercise-card-root'), {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  // Renderizar Gráfica Interactiva con Plotly.js
  function renderPlot(ex) {
    const params = {};
    if (ex.type === 'series') {
      params.harmonics = [5, 10, 20];
      params.customN = state.customN;
    } else {
      params.cutoffs = [5, 20, 50];
      params.customB = state.customB;
    }

    const data = MathEngine.generateData(ex.id, params);
    if (!data) return;

    const traces = [];

    // Traza de la señal original f(x)
    traces.push({
      x: data.x,
      y: data.yOriginal,
      name: 'f(x) Original',
      mode: 'lines',
      line: {
        color: '#0f172a',
        width: 2.5,
        dash: 'dash'
      }
    });

    // Colores para las curvas armónicas / cortes progresivos
    const standardColors = ['#0284c7', '#10b981', '#f59e0b'];

    data.curves.forEach((curve, idx) => {
      if (curve.isCustom) {
        traces.push({
          x: curve.x,
          y: curve.y,
          name: curve.name,
          mode: 'lines',
          line: {
            color: '#dc2626', // Rojo para el personalizado
            width: 2.5
          }
        });
      } else {
        traces.push({
          x: curve.x,
          y: curve.y,
          name: curve.name,
          mode: 'lines',
          line: {
            color: standardColors[idx % standardColors.length],
            width: 1.8
          }
        });
      }
    });

    // Puntos de Dirichlet
    if (data.discontinuities && data.discontinuities.length > 0) {
      const discX = data.discontinuities.map((d) => d.x);
      const discY = data.discontinuities.map((d) => d.midpoint);
      const discText = data.discontinuities.map(
        (d) => `Dirichlet: (${d.x.toFixed(2)}, ${d.midpoint})`
      );

      traces.push({
        x: discX,
        y: discY,
        name: 'Convergencia Dirichlet',
        mode: 'markers',
        text: discText,
        marker: {
          color: '#e11d48',
          size: 9,
          symbol: 'diamond'
        }
      });
    }

    const layout = {
      title: {
        text: `<b>${ex.title}</b> - Superposición Armónica e Integral`,
        font: { size: 16, color: '#123062', family: 'Noto Sans, sans-serif' }
      },
      xaxis: {
        title: 'Variable independiente x',
        zeroline: true,
        zerolinecolor: '#94a3b8',
        gridcolor: '#e2e8f0'
      },
      yaxis: {
        title: 'Amplitud f(x)',
        zeroline: true,
        zerolinecolor: '#94a3b8',
        gridcolor: '#e2e8f0'
      },
      legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: 1.02,
        xanchor: 'right',
        x: 1
      },
      margin: { l: 55, r: 25, t: 70, b: 50 },
      hovermode: 'closest',
      plot_bgcolor: '#ffffff',
      paper_bgcolor: '#ffffff'
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    Plotly.newPlot(plotContainer, traces, layout, config);
  }

  // Renderizar Pasos de la Memoria Analítica
  function renderAnalyticalSteps(ex) {
    analyticalContainer.innerHTML = '';
    ex.analyticalSteps.forEach((step, index) => {
      const stepCard = document.createElement('div');
      stepCard.className = 'border border-slate-200 rounded-lg p-5 bg-white shadow-sm hover:border-blue-200 transition-all';
      stepCard.innerHTML = `
        <h4 class="text-base font-bold text-[#123062] mb-3 flex items-center gap-2">
          <span class="w-7 h-7 rounded-full bg-blue-100 text-[#123062] text-xs flex items-center justify-center font-bold">${index + 1}</span>
          ${step.title}
        </h4>
        <div class="step-content text-slate-700 text-sm leading-relaxed">
          ${step.content.replace(/\n/g, '<br>')}
        </div>
      `;
      analyticalContainer.appendChild(stepCard);
    });
  }

  // Renderizar Análisis de Dirichlet y Fenómeno de Gibbs
  function renderDirichletAnalysis(ex) {
    let dirichletRows = '';
    if (ex.dirichletPoints && ex.dirichletPoints.length > 0) {
      ex.dirichletPoints.forEach((pt) => {
        dirichletRows += `
          <tr class="border-b border-slate-100">
            <td class="py-2 px-3 font-mono font-medium">$x = ${pt.x}$</td>
            <td class="py-2 px-3 font-mono">$f(x^-) = ${pt.left}$</td>
            <td class="py-2 px-3 font-mono">$f(x^+) = ${pt.right}$</td>
            <td class="py-2 px-3 font-mono font-bold text-[#123062]">$S(x) = \\frac{${pt.left} + ${pt.right}}{2} = ${pt.mean}$</td>
          </tr>
        `;
      });
    } else {
      dirichletRows = `
        <tr>
          <td colspan="4" class="py-3 px-3 text-emerald-700 font-medium">Función continua en todo su dominio. La serie/integral converge exactamente a $f(x)$ para todo $x$.</td>
        </tr>
      `;
    }

    dirichletContainer.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Teorema de Dirichlet -->
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <h4 class="text-sm font-bold text-[#123062] uppercase tracking-wide mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Teorema de Dirichlet en Discontinuidades
          </h4>
          <p class="text-xs text-slate-600 mb-3">En cada punto de discontinuidad de salto $x_0$, la serie o integral converge exactamente a la semisuma de los límites laterales:</p>
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left">
              <thead>
                <tr class="bg-slate-200 text-slate-700">
                  <th class="py-1 px-3">Punto x</th>
                  <th class="py-1 px-3">f(x⁻)</th>
                  <th class="py-1 px-3">f(x⁺)</th>
                  <th class="py-1 px-3">Convergencia Dirichlet</th>
                </tr>
              </thead>
              <tbody>
                ${dirichletRows}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Fenómeno de Gibbs y Velocidad -->
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <h4 class="text-sm font-bold text-[#123062] uppercase tracking-wide mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Fenómeno de Gibbs y Convergencia
          </h4>
          <div class="space-y-2.5 text-xs text-slate-700">
            <div>
              <span class="font-bold text-slate-900">Sobreimpulso de Gibbs:</span>
              <p class="text-slate-600">${ex.gibbsOvershoot}</p>
            </div>
            <div>
              <span class="font-bold text-slate-900">Tasa de decaimiento asintótico:</span>
              <p class="font-mono text-blue-800">$${ex.decayRate}$</p>
            </div>
            <div>
              <span class="font-bold text-slate-900">Armónicos/Corte Mínimo Recomendado:</span>
              <p class="text-emerald-700 font-semibold">$${ex.minHarmonicsRecommendation}$</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Manejo de Sliders en tiempo real
  sliderNInput.addEventListener('input', (e) => {
    state.customN = parseInt(e.target.value, 10);
    sliderNVal.textContent = state.customN;
    const ex = ExercisesData[state.currentExerciseId];
    renderPlot(ex);
  });

  sliderBInput.addEventListener('input', (e) => {
    state.customB = parseInt(e.target.value, 10);
    sliderBVal.textContent = state.customB;
    const ex = ExercisesData[state.currentExerciseId];
    renderPlot(ex);
  });

  // Manejo de Pestañas Interiores (Memoria Analítica / Dirichlet / Código)
  const subTabBtns = document.querySelectorAll('.subtab-btn');
  subTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-subtab');
      subTabBtns.forEach((b) => {
        b.classList.remove('text-[#123062]', 'border-[#123062]', 'border-b-2', 'font-bold');
        b.classList.add('text-slate-500', 'font-medium');
      });
      btn.classList.add('text-[#123062]', 'border-[#123062]', 'border-b-2', 'font-bold');
      btn.classList.remove('text-slate-500', 'font-medium');

      document.getElementById('subtab-analitica-view').classList.toggle('hidden', targetTab !== 'analitica');
      document.getElementById('subtab-dirichlet-view').classList.toggle('hidden', targetTab !== 'dirichlet');
      document.getElementById('subtab-codigo-view').classList.toggle('hidden', targetTab !== 'codigo');
    });
  });

  // Botón Copiar Código Python
  const copyBtn = document.getElementById('copy-python-code-btn');
  copyBtn.addEventListener('click', () => {
    const code = pythonCodeBlock.textContent;
    navigator.clipboard.writeText(code).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = `✓ ¡Copiado!`;
      copyBtn.classList.add('bg-emerald-600');
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.classList.remove('bg-emerald-600');
      }, 2000);
    });
  });

  // Modal para editar datos estudiantiles
  const editModal = document.getElementById('edit-student-modal');
  const openModalBtn = document.getElementById('open-edit-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const saveStudentDataBtn = document.getElementById('save-student-data-btn');

  const inputName = document.getElementById('modal-input-name');
  const inputCode = document.getElementById('modal-input-code');
  const inputProf = document.getElementById('modal-input-prof');

  openModalBtn.addEventListener('click', () => {
    inputName.value = state.studentData.studentName;
    inputCode.value = state.studentData.studentCode;
    inputProf.value = state.studentData.professorName;
    editModal.classList.remove('hidden');
    editModal.classList.add('flex');
  });

  closeModalBtn.addEventListener('click', () => {
    editModal.classList.add('hidden');
    editModal.classList.remove('flex');
  });

  saveStudentDataBtn.addEventListener('click', () => {
    state.studentData.studentName = inputName.value.trim() || 'Danny Palma';
    state.studentData.studentCode = inputCode.value.trim() || 'Código Estudiantil';
    state.studentData.professorName = inputProf.value.trim() || 'Docente de Matemáticas Especiales';
    localStorage.setItem('ecci_fourier_student_data', JSON.stringify(state.studentData));
    updateHeaderStudentInfo();
    editModal.classList.add('hidden');
    editModal.classList.remove('flex');
  });

  // Botón Imprimir / Exportar PDF
  const printBtn = document.getElementById('btn-export-pdf');
  printBtn.addEventListener('click', () => {
    window.print();
  });

  // Inicializar estado
  updateHeaderStudentInfo();
  renderExercisePills();
  loadCurrentExercise();
});
