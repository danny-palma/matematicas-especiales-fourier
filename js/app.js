/**
 * app.js - Controlador principal de la interfaz con especificación Material Design 3 (M3)
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

  // Inicializar UI de Portada en M3
  function updateHeaderStudentInfo() {
    studentBadge.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-blue-100">
        <span class="inline-flex items-center gap-1.5 font-bold text-white bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/25">
          <span class="material-symbols-outlined text-sm">person</span>
          ${state.studentData.studentName}
        </span>
        <span class="text-blue-300">•</span>
        <span class="bg-black/20 px-2.5 py-0.5 rounded-full font-mono">${state.studentData.studentCode}</span>
        <span class="text-blue-300">•</span>
        <span class="text-amber-300 font-semibold">${state.studentData.subject}</span>
        <span class="text-blue-300">•</span>
        <span class="text-blue-200">Docente: ${state.studentData.professorName}</span>
      </div>
    `;
  }

  // M3 Segmented Buttons: Selector de Taller (5 vs 6)
  const tabTaller5 = document.getElementById('tab-taller-5');
  const tabTaller6 = document.getElementById('tab-taller-6');
  const exercisesPillsContainer = document.getElementById('exercise-pills-container');

  function renderExerciseChips() {
    exercisesPillsContainer.innerHTML = '';
    const exercisesInTaller = Object.values(ExercisesData).filter(
      (ex) => ex.taller === state.currentTaller
    );

    exercisesInTaller.forEach((ex) => {
      const chip = document.createElement('button');
      const isSelected = ex.id === state.currentExerciseId;
      chip.className = `m3-chip ${isSelected ? 'active' : ''}`;
      chip.innerHTML = `
        <span class="material-symbols-outlined text-base chip-icon">${isSelected ? 'check_circle' : 'functions'}</span>
        <span>${ex.number}: ${ex.title}</span>
      `;
      chip.addEventListener('click', () => {
        state.currentExerciseId = ex.id;
        renderExerciseChips();
        loadCurrentExercise();
      });
      exercisesPillsContainer.appendChild(chip);
    });
  }

  tabTaller5.addEventListener('click', () => {
    state.currentTaller = 5;
    tabTaller5.classList.add('active');
    tabTaller6.classList.remove('active');
    state.currentExerciseId = 't5_ej1';
    renderExerciseChips();
    loadCurrentExercise();
  });

  tabTaller6.addEventListener('click', () => {
    state.currentTaller = 6;
    tabTaller6.classList.add('active');
    tabTaller5.classList.remove('active');
    state.currentExerciseId = 't6_ej2_gen';
    renderExerciseChips();
    loadCurrentExercise();
  });

  // Cargar datos y renderizar ejercicio actual
  function loadCurrentExercise() {
    const ex = ExercisesData[state.currentExerciseId];
    if (!ex) return;

    // Encabezado
    exerciseTitle.textContent = `${ex.section} - ${ex.number}: ${ex.title}`;
    exerciseSubtitle.textContent = `Taller ${ex.taller} • Intervalo de análisis: ${ex.interval}`;
    exerciseFormula.innerHTML = `$$${ex.definitionLatex}$$`;
    
    // Badges con iconos
    symmetryBadge.querySelector('.symmetry-text').textContent = ex.symmetry;
    periodBadge.querySelector('.period-text').textContent = ex.period;
    intervalBadge.querySelector('.interval-text').textContent = `Dominio: ${ex.interval}`;

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

    // Renderizar Memoria Analítica en M3 Cards
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

  // Renderizar Gráfica con Plotly en estética Material Design 3
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
        color: '#1e293b',
        width: 2.5,
        dash: 'dash'
      }
    });

    // Paleta M3 para las curvas
    const standardColors = ['#0284c7', '#10b981', '#f59e0b'];

    data.curves.forEach((curve, idx) => {
      if (curve.isCustom) {
        traces.push({
          x: curve.x,
          y: curve.y,
          name: curve.name,
          mode: 'lines',
          line: {
            color: '#dc2626',
            width: 2.8
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

    // Puntos de Dirichlet destacados
    if (data.discontinuities && data.discontinuities.length > 0) {
      const discX = data.discontinuities.map((d) => d.x);
      const discY = data.discontinuities.map((d) => d.midpoint);
      const discText = data.discontinuities.map(
        (d) => `Dirichlet: (${d.x.toFixed(2)}, ${d.midpoint})`
      );

      traces.push({
        x: discX,
        y: discY,
        name: 'Dirichlet',
        mode: 'markers',
        text: discText,
        marker: {
          color: '#e11d48',
          size: 10,
          symbol: 'diamond',
          line: { color: '#ffffff', width: 1.5 }
        }
      });
    }

    const layout = {
      title: {
        text: `<b>${ex.title}</b> • Superposición Armónica e Integral`,
        font: { size: 16, color: '#123062', family: 'Roboto, sans-serif' }
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
        x: 1,
        font: { family: 'Roboto, sans-serif', size: 12 }
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

  // Renderizar Pasos de la Memoria Analítica en tarjetas M3
  function renderAnalyticalSteps(ex) {
    analyticalContainer.innerHTML = '';
    ex.analyticalSteps.forEach((step, index) => {
      const stepCard = document.createElement('div');
      stepCard.className = 'm3-card-sub p-6';
      stepCard.innerHTML = `
        <h4 class="text-base font-bold text-[--md-sys-color-primary] mb-3 flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-full bg-[--md-sys-color-primary-container] text-[--md-sys-color-on-primary-container] text-xs flex items-center justify-center font-bold">
            ${index + 1}
          </span>
          <span>${step.title}</span>
        </h4>
        <div class="step-content text-slate-700 text-sm leading-relaxed">
          ${step.content.replace(/\n/g, '<br>')}
        </div>
      `;
      analyticalContainer.appendChild(stepCard);
    });
  }

  // Renderizar Análisis de Dirichlet y Fenómeno de Gibbs en M3
  function renderDirichletAnalysis(ex) {
    let dirichletRows = '';
    if (ex.dirichletPoints && ex.dirichletPoints.length > 0) {
      ex.dirichletPoints.forEach((pt) => {
        dirichletRows += `
          <tr class="border-b border-slate-200">
            <td class="py-2.5 px-3 font-mono font-medium">$x = ${pt.x}$</td>
            <td class="py-2.5 px-3 font-mono">$f(x^-) = ${pt.left}$</td>
            <td class="py-2.5 px-3 font-mono">$f(x^+) = ${pt.right}$</td>
            <td class="py-2.5 px-3 font-mono font-bold text-[--md-sys-color-primary]">$S(x) = \\frac{${pt.left} + ${pt.right}}{2} = ${pt.mean}$</td>
          </tr>
        `;
      });
    } else {
      dirichletRows = `
        <tr>
          <td colspan="4" class="py-4 px-3 text-emerald-700 font-medium">Función continua en todo su dominio. La aproximación converge exactamente a $f(x)$ para todo $x \\in \\mathbb{R}$.</td>
        </tr>
      `;
    }

    dirichletContainer.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Teorema de Dirichlet -->
        <div class="m3-card-sub p-6">
          <div class="flex items-center gap-2 text-sm font-bold text-[--md-sys-color-primary] uppercase tracking-wide mb-3">
            <span class="material-symbols-outlined text-blue-600">insights</span>
            <span>Teorema de Dirichlet en Discontinuidades</span>
          </div>
          <p class="text-xs text-slate-600 mb-4">En cada discontinuidad de salto $x_0$, la serie o integral converge exactamente a la semisuma de los límites laterales:</p>
          <div class="overflow-x-auto bg-white rounded-xl border border-slate-200">
            <table class="w-full text-xs text-left">
              <thead>
                <tr class="bg-slate-100 text-slate-800 border-b border-slate-200">
                  <th class="py-2 px-3 font-bold">Punto x</th>
                  <th class="py-2 px-3 font-bold">f(x⁻)</th>
                  <th class="py-2 px-3 font-bold">f(x⁺)</th>
                  <th class="py-2 px-3 font-bold">Convergencia Dirichlet</th>
                </tr>
              </thead>
              <tbody>
                ${dirichletRows}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Fenómeno de Gibbs y Velocidad -->
        <div class="m3-card-sub p-6">
          <div class="flex items-center gap-2 text-sm font-bold text-[--md-sys-color-primary] uppercase tracking-wide mb-3">
            <span class="material-symbols-outlined text-amber-600">warning</span>
            <span>Fenómeno de Gibbs y Velocidad</span>
          </div>
          <div class="space-y-3 text-xs text-slate-700">
            <div class="p-3 bg-white rounded-xl border border-slate-200">
              <span class="font-bold text-slate-900 block mb-0.5">Sobreimpulso de Gibbs:</span>
              <p class="text-slate-600">${ex.gibbsOvershoot}</p>
            </div>
            <div class="p-3 bg-white rounded-xl border border-slate-200">
              <span class="font-bold text-slate-900 block mb-0.5">Tasa de decaimiento asintótico:</span>
              <p class="font-mono text-blue-900 font-semibold">$${ex.decayRate}$</p>
            </div>
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span class="font-bold text-emerald-950 block mb-0.5">Armónicos / Corte Mínimo Recomendado:</span>
              <p class="text-emerald-800 font-semibold">$${ex.minHarmonicsRecommendation}$</p>
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

  // Manejo de Pestañas M3 (Memoria Analítica / Dirichlet / Código)
  const subTabBtns = document.querySelectorAll('.subtab-btn');
  subTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-subtab');
      subTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      document.getElementById('subtab-analitica-view').classList.toggle('hidden', targetTab !== 'analitica');
      document.getElementById('subtab-dirichlet-view').classList.toggle('hidden', targetTab !== 'dirichlet');
      document.getElementById('subtab-codigo-view').classList.toggle('hidden', targetTab !== 'codigo');
    });
  });

  // Botón Copiar Código Python con feedback M3
  const copyBtn = document.getElementById('copy-python-code-btn');
  copyBtn.addEventListener('click', () => {
    const code = pythonCodeBlock.textContent;
    navigator.clipboard.writeText(code).then(() => {
      copyBtn.innerHTML = `
        <span class="material-symbols-outlined text-sm text-emerald-600">done</span>
        <span>¡Copiado!</span>
      `;
      setTimeout(() => {
        copyBtn.innerHTML = `
          <span class="material-symbols-outlined text-sm">content_copy</span>
          <span>Copiar Código</span>
        `;
      }, 2000);
    });
  });

  // M3 Dialog para editar datos estudiantiles
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
  renderExerciseChips();
  loadCurrentExercise();
});
