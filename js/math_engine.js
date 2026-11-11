/**
 * math_engine.js - Motor de cálculo analítico y numérico
 * Matemáticas Especiales - Corte 3 (Universidad ECCI)
 * Autor: Danny Palma
 */

const MathEngine = {
  // Cuadratura numérica para Fourier Integrals (Regla de Simpson Compuesta)
  simpsonIntegrate(f, a, b, nSteps = 300) {
    if (nSteps % 2 !== 0) nSteps++;
    const h = (b - a) / nSteps;
    let sum = f(a) + f(b);
    for (let i = 1; i < nSteps; i++) {
      const x = a + i * h;
      sum += (i % 2 === 0 ? 2 : 4) * f(x);
    }
    return (h / 3) * sum;
  },

  // -------------------------------------------------------------
  // TALLER 5: SERIES DE FOURIER
  // -------------------------------------------------------------

  // Ejercicio 1: Pulso rectangular en (-pi, pi)
  t5_ej1: {
    domain: [-2 * Math.PI, 2 * Math.PI],
    period: 2 * Math.PI,
    fOriginal(x) {
      // Reducción periódica a [-pi, pi)
      let p = ((x + Math.PI) % (2 * Math.PI));
      if (p < 0) p += 2 * Math.PI;
      p -= Math.PI;
      if (Math.abs(p) < 1e-6) return 0.5; // Punto medio
      return p >= 0 ? 1 : 0;
    },
    fFourier(x, N) {
      let sum = 0.5;
      for (let k = 1; k <= N; k += 2) {
        sum += (2 / (k * Math.PI)) * Math.sin(k * x);
      }
      return sum;
    },
    discontinuities: [
      { x: 0, left: 0, right: 1, midpoint: 0.5 },
      { x: -Math.PI, left: 1, right: 0, midpoint: 0.5 },
      { x: Math.PI, left: 1, right: 0, midpoint: 0.5 }
    ]
  },

  // Ejercicio 4: Rampa lineal f(x) = x + pi en (-pi, pi)
  t5_ej4: {
    domain: [-2 * Math.PI, 2 * Math.PI],
    period: 2 * Math.PI,
    fOriginal(x) {
      let p = ((x + Math.PI) % (2 * Math.PI));
      if (p < 0) p += 2 * Math.PI;
      p -= Math.PI;
      return p + Math.PI;
    },
    fFourier(x, N) {
      let sum = Math.PI;
      for (let n = 1; n <= N; n++) {
        const sign = (n + 1) % 2 === 0 ? 1 : -1;
        sum += (2 * sign / n) * Math.sin(n * x);
      }
      return sum;
    },
    discontinuities: [
      { x: -Math.PI, left: 2 * Math.PI, right: 0, midpoint: Math.PI },
      { x: Math.PI, left: 2 * Math.PI, right: 0, midpoint: Math.PI }
    ]
  },

  // Ejercicio 2 (Senos/Cosenos): f(x) = x^2 en (-1, 1)
  t5_ej2_sc: {
    domain: [-2.5, 2.5],
    period: 2,
    fOriginal(x) {
      let p = ((x + 1) % 2);
      if (p < 0) p += 2;
      p -= 1;
      return p * p;
    },
    fFourier(x, N) {
      let sum = 1 / 3;
      for (let n = 1; n <= N; n++) {
        const sign = n % 2 === 0 ? 1 : -1;
        sum += (4 * sign / (n * n * Math.PI * Math.PI)) * Math.cos(n * Math.PI * x);
      }
      return sum;
    },
    discontinuities: [] // Continua en todo R
  },

  // Ejercicio 4 (Senos/Cosenos): f(x) = x^3 en (-pi, pi)
  t5_ej4_sc: {
    domain: [-2 * Math.PI, 2 * Math.PI],
    period: 2 * Math.PI,
    fOriginal(x) {
      let p = ((x + Math.PI) % (2 * Math.PI));
      if (p < 0) p += 2 * Math.PI;
      p -= Math.PI;
      return p * p * p;
    },
    fFourier(x, N) {
      let sum = 0;
      for (let n = 1; n <= N; n++) {
        const sign = (n + 1) % 2 === 0 ? 1 : -1;
        const bn = 2 * sign * ((Math.PI * Math.PI) / n - 6 / (n * n * n));
        sum += bn * Math.sin(n * x);
      }
      return sum;
    },
    discontinuities: [
      { x: -Math.PI, left: Math.PI ** 3, right: -(Math.PI ** 3), midpoint: 0 },
      { x: Math.PI, left: Math.PI ** 3, right: -(Math.PI ** 3), midpoint: 0 }
    ]
  },

  // Ejercicio 1 (Compleja): Onda cuadrada en (-2, 2)
  t5_ej1_comp: {
    domain: [-4, 4],
    period: 4,
    fOriginal(x) {
      let p = ((x + 2) % 4);
      if (p < 0) p += 4;
      p -= 2;
      if (Math.abs(p) < 1e-6 || Math.abs(p - 2) < 1e-6 || Math.abs(p + 2) < 1e-6) return 0;
      return p > 0 ? 1 : -1;
    },
    fFourier(x, N) {
      let sum = 0;
      for (let k = 1; k <= N; k += 2) {
        sum += (4 / (k * Math.PI)) * Math.sin((k * Math.PI * x) / 2);
      }
      return sum;
    },
    discontinuities: [
      { x: 0, left: -1, right: 1, midpoint: 0 },
      { x: 2, left: 1, right: -1, midpoint: 0 },
      { x: -2, left: 1, right: -1, midpoint: 0 }
    ]
  },

  // Ejercicio 6 (Compleja): f(x) = e^{-|x|} en (-1, 1)
  t5_ej6_comp: {
    domain: [-2.5, 2.5],
    period: 2,
    fOriginal(x) {
      let p = ((x + 1) % 2);
      if (p < 0) p += 2;
      p -= 1;
      return Math.exp(-Math.abs(p));
    },
    fFourier(x, N) {
      const e_inv = Math.exp(-1);
      let sum = 1 - e_inv; // c0
      for (let n = 1; n <= N; n++) {
        const sign = n % 2 === 0 ? 1 : -1;
        const cn = (1 - e_inv * sign) / (1 + n * n * Math.PI * Math.PI);
        sum += 2 * cn * Math.cos(n * Math.PI * x);
      }
      return sum;
    },
    discontinuities: [] // Continua con cúspide en enteros
  },

  // -------------------------------------------------------------
  // TALLER 6: INTEGRALES DE FOURIER
  // -------------------------------------------------------------

  // Ejercicio 2 (General): f(x) = 4 en (pi, 2pi), 0 en otro caso
  t6_ej2_gen: {
    domain: [-2, 3 * Math.PI],
    fOriginal(x) {
      if (x > Math.PI && x < 2 * Math.PI) return 4;
      if (Math.abs(x - Math.PI) < 1e-5 || Math.abs(x - 2 * Math.PI) < 1e-5) return 2;
      return 0;
    },
    fFourierIntegral(x, b) {
      // fb(x) = (1/pi) * int_0^b [A(alpha)cos(alpha*x) + B(alpha)sin(alpha*x)] dalpha
      // A(alpha) = 4*(sin(2pi*a) - sin(pi*a))/a
      // B(alpha) = 4*(cos(pi*a) - cos(2pi*a))/a
      const integrand = (alpha) => {
        if (alpha < 1e-7) {
          // Limite cuando alpha -> 0:
          // A(alpha) -> 4*pi, B(alpha) -> 0
          return 4 * Math.PI;
        }
        const A = 4 * (Math.sin(2 * Math.PI * alpha) - Math.sin(Math.PI * alpha)) / alpha;
        const B = 4 * (Math.cos(Math.PI * alpha) - Math.cos(2 * Math.PI * alpha)) / alpha;
        return A * Math.cos(alpha * x) + B * Math.sin(alpha * x);
      };
      return (1 / Math.PI) * MathEngine.simpsonIntegrate(integrand, 1e-6, b, Math.max(120, Math.floor(b * 12)));
    },
    discontinuities: [
      { x: Math.PI, left: 0, right: 4, midpoint: 2 },
      { x: 2 * Math.PI, left: 4, right: 0, midpoint: 2 }
    ]
  },

  // Ejercicio 5 (General): f(x) = e^{-|x|} en todo R
  t6_ej5_gen: {
    domain: [-5, 5],
    fOriginal(x) {
      return Math.exp(-Math.abs(x));
    },
    fFourierIntegral(x, b) {
      // fb(x) = (2/pi) * int_0^b (cos(alpha*x) / (1 + alpha^2)) dalpha
      const integrand = (alpha) => {
        return Math.cos(alpha * x) / (1 + alpha * alpha);
      };
      return (2 / Math.PI) * MathEngine.simpsonIntegrate(integrand, 0, b, Math.max(100, Math.floor(b * 10)));
    },
    discontinuities: []
  },

  // Ejercicio 1 (Senos): f(x) = -5 en (-1, 0), 5 en (0, 1), 0 en |x|>1
  t6_ej1_sin: {
    domain: [-3, 3],
    fOriginal(x) {
      if (x > -1 && x < 0) return -5;
      if (x > 0 && x < 1) return 5;
      if (Math.abs(x) < 1e-5) return 0;
      if (Math.abs(x - 1) < 1e-5) return 2.5;
      if (Math.abs(x + 1) < 1e-5) return -2.5;
      return 0;
    },
    fFourierIntegral(x, b) {
      // fb(x) = (1/pi) * int_0^b [ 10*(1 - cos(alpha))/alpha * sin(alpha*x) ] dalpha
      const integrand = (alpha) => {
        if (alpha < 1e-7) return 0;
        const B = (10 * (1 - Math.cos(alpha))) / alpha;
        return B * Math.sin(alpha * x);
      };
      return (1 / Math.PI) * MathEngine.simpsonIntegrate(integrand, 1e-6, b, Math.max(120, Math.floor(b * 12)));
    },
    discontinuities: [
      { x: -1, left: 0, right: -5, midpoint: -2.5 },
      { x: 0, left: -5, right: 5, midpoint: 0 },
      { x: 1, left: 5, right: 0, midpoint: 2.5 }
    ]
  },

  // Ejercicio 2 (Cosenos): f(x) = pi en 1 < |x| < 2, 0 en otro caso
  t6_ej2_cos: {
    domain: [-4, 4],
    fOriginal(x) {
      const ax = Math.abs(x);
      if (ax > 1 && ax < 2) return Math.PI;
      if (Math.abs(ax - 1) < 1e-5 || Math.abs(ax - 2) < 1e-5) return Math.PI / 2;
      return 0;
    },
    fFourierIntegral(x, b) {
      // fb(x) = 2 * int_0^b [ (sin(2*alpha) - sin(alpha)) / alpha * cos(alpha*x) ] dalpha
      const integrand = (alpha) => {
        if (alpha < 1e-7) {
          // Limite: (sin(2a)-sin(a))/a -> 2 - 1 = 1
          return 1 * Math.cos(alpha * x);
        }
        return ((Math.sin(2 * alpha) - Math.sin(alpha)) / alpha) * Math.cos(alpha * x);
      };
      return 2 * MathEngine.simpsonIntegrate(integrand, 1e-6, b, Math.max(120, Math.floor(b * 12)));
    },
    discontinuities: [
      { x: -2, left: 0, right: Math.PI, midpoint: Math.PI / 2 },
      { x: -1, left: Math.PI, right: 0, midpoint: Math.PI / 2 },
      { x: 1, left: 0, right: Math.PI, midpoint: Math.PI / 2 },
      { x: 2, left: Math.PI, right: 0, midpoint: Math.PI / 2 }
    ]
  },

  // Generador de arreglos de coordenadas para graficación
  generateData(exerciseKey, params = {}) {
    const ex = this[exerciseKey];
    if (!ex) return null;

    const [xMin, xMax] = ex.domain;
    const nPoints = 400;
    const step = (xMax - xMin) / (nPoints - 1);

    const xVals = [];
    const yOrigVals = [];
    for (let i = 0; i < nPoints; i++) {
      const x = xMin + i * step;
      xVals.push(x);
      yOrigVals.push(ex.fOriginal(x));
    }

    const curves = [];

    // Series de Fourier
    if (ex.fFourier) {
      const harmonicList = params.harmonics || [5, 10, 20];
      harmonicList.forEach((N) => {
        const yFourier = xVals.map((x) => ex.fFourier(x, N));
        curves.push({
          name: `N = ${N} armónicos`,
          x: xVals,
          y: yFourier,
          N: N
        });
      });

      if (params.customN) {
        const yCustom = xVals.map((x) => ex.fFourier(x, params.customN));
        curves.push({
          name: `N = ${params.customN} (Personalizado)`,
          x: xVals,
          y: yCustom,
          N: params.customN,
          isCustom: true
        });
      }
    }

    // Integrales de Fourier
    if (ex.fFourierIntegral) {
      const cutoffList = params.cutoffs || [5, 20, 50];
      cutoffList.forEach((b) => {
        const yIntegral = xVals.map((x) => ex.fFourierIntegral(x, b));
        curves.push({
          name: `b = ${b} rad/u`,
          x: xVals,
          y: yIntegral,
          b: b
        });
      });

      if (params.customB) {
        const yCustom = xVals.map((x) => ex.fFourierIntegral(x, params.customB));
        curves.push({
          name: `b = ${params.customB} (Personalizado)`,
          x: xVals,
          y: yCustom,
          b: params.customB,
          isCustom: true
        });
      }
    }

    return {
      x: xVals,
      yOriginal: yOrigVals,
      curves: curves,
      discontinuities: ex.discontinuities || []
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MathEngine;
}
