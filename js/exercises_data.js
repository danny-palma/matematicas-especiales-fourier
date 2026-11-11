/**
 * exercises_data.js - Base de datos analítica y teórica de los 10 ejercicios
 * Matemáticas Especiales - Corte 3 (Universidad ECCI)
 * Autor: Danny Palma
 */

const ExercisesData = {
  // -------------------------------------------------------------
  // TALLER 5: SERIES DE FOURIER (6 EJERCICIOS)
  // -------------------------------------------------------------

  t5_ej1: {
    id: "t5_ej1",
    taller: 5,
    section: "1. Series Clásicas",
    number: "Ejercicio 1",
    title: "Pulso Rectangular Periódico",
    definitionLatex: "f(x) = \\begin{cases} 0, & -\\pi < x < 0 \\\\ 1, & 0 \\le x < \\pi \\end{cases}, \\quad f(x+2\\pi) = f(x)",
    interval: "(-\\pi, \\pi)",
    period: "T = 2\\pi, \\; L = \\pi",
    symmetry: "Sin simetría definida (Posee componente continua no nula a_0/2 = 1/2)",
    type: "series",
    harmonics: [5, 10, 20],
    dirichletPoints: [
      { x: "0", left: "0", right: "1", mean: "1/2" },
      { x: "\\pm \\pi", left: "1", right: "0", mean: "1/2" }
    ],
    gibbsOvershoot: "8.95% sobre el salto unitario (pico máximo \\approx 1.0895 en x \\to 0^+)",
    decayRate: "\\mathcal{O}(1/n) \\text{ (Decaimiento lento debido a las discontinuidades de salto)}",
    minHarmonicsRecommendation: "n \\ge 19 \\text{ armónicos para reproducir adecuadamente el escalón}",

    analyticalSteps: [
      {
        title: "Paso 1: Análisis de simetría y bosquejo gráfico",
        content: `La función está definida en un período $T = 2\\pi$ con semiperíodo $L = \\pi$.
Evaluando la paridad:
$$f(-x) = \\begin{cases} 0, & 0 < x < \\pi \\\\ 1, & -\\pi < x \\le 0 \\end{cases} \\neq f(x) \\quad \\text{y} \\quad \\neq -f(x)$$
Por ende, **la función no posee simetría par ni impar**. Se deben calcular tanto los coeficientes $a_n$ como $b_n$, así como el término medio continuo $a_0$.`
      },
      {
        title: "Paso 2: Discontinuidades y límites laterales (Teorema de Dirichlet)",
        content: `La función presenta discontinuidades de salto finito en $x = 0$ y en los extremos del período $x = \\pm \\pi$:
- En $x = 0$:
  $$\\lim_{x \\to 0^-} f(x) = 0, \\quad \\lim_{x \\to 0^+} f(x) = 1$$
  Por el Teorema de Dirichlet, la serie de Fourier converge al promedio de los límites laterales:
  $$S(0) = \\frac{f(0^+) + f(0^-)}{2} = \\frac{1 + 0}{2} = \\frac{1}{2}$$
- En los extremos periódicos $x = \\pi$ (salto de $\\pi$ a $-\\pi$):
  $$f(\\pi^-) = 1, \\quad f(-\\pi^+) = 0 \\implies S(\\pm \\pi) = \\frac{1 + 0}{2} = \\frac{1}{2}$$`
      },
      {
        title: "Paso 3: Cálculo paso a paso del coeficiente a₀",
        content: `La fórmula del coeficiente constante en el intervalo $[-\\pi, \\pi]$ con $L = \\pi$ es:
$$a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x)\\,dx = \\frac{1}{\\pi} \\left[ \\int_{-\\pi}^0 0\\,dx + \\int_0^{\\pi} 1\\,dx \\right]$$
$$a_0 = \\frac{1}{\\pi} [x]_0^{\\pi} = \\frac{1}{\\pi} (\\pi - 0) = 1$$
Por tanto, el término constante de la serie es:
$$\\frac{a_0}{2} = \\frac{1}{2}$$`
      },
      {
        title: "Paso 4: Cálculo paso a paso de los coeficientes aₙ",
        content: `Para $n \\ge 1$:
$$a_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x)\\cos(nx)\\,dx = \\frac{1}{\\pi} \\int_0^{\\pi} 1 \\cdot \\cos(nx)\\,dx$$
Integrando directamente:
$$a_n = \\frac{1}{\\pi} \\left[ \\frac{\\sin(nx)}{n} \\right]_0^{\\pi} = \\frac{1}{n\\pi} (\\sin(n\\pi) - \\sin(0))$$
Dado que $\\sin(n\\pi) = 0$ para todo $n \\in \\mathbb{Z}^+$:
$$a_n = \\frac{1}{n\\pi}(0 - 0) = 0, \\quad \\forall n \\ge 1$$
*(La función desplazada $f(x) - 1/2$ es una función impar pura, por lo que todos los coeficientes de coseno se anulan).*`
      },
      {
        title: "Paso 5: Cálculo paso a paso de los coeficientes bₙ",
        content: `Para $n \\ge 1$:
$$b_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x)\\sin(nx)\\,dx = \\frac{1}{\\pi} \\int_0^{\\pi} 1 \\cdot \\sin(nx)\\,dx$$
Integrando la función seno:
$$b_n = \\frac{1}{\\pi} \\left[ -\\frac{\\cos(nx)}{n} \\right]_0^{\\pi} = -\\frac{1}{n\\pi} [\\cos(n\\pi) - \\cos(0)]$$
Sabiendo que $\\cos(n\\pi) = (-1)^n$ y $\\cos(0) = 1$:
$$b_n = -\\frac{1}{n\\pi} [(-1)^n - 1] = \\frac{1 - (-1)^n}{n\\pi}$$
Evaluando para valores pares e impares:
$$b_n = \\begin{cases} 0, & \\text{si } n \\text{ es par} \\\\ \\dfrac{2}{n\\pi}, & \\text{si } n \\text{ es impar} \\end{cases}$$
Haciendo el cambio de variable $n = 2k - 1$ con $k = 1, 2, 3, \\dots$:
$$b_{2k-1} = \\frac{2}{(2k-1)\\pi}$$`
      },
      {
        title: "Paso 6: Expresión canónica final de la serie de Fourier",
        content: `Sustituyendo $a_0$, $a_n$ y $b_n$ en la definición canónica de Fourier:
$$f(x) \\sim \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} [a_n\\cos(nx) + b_n\\sin(nx)]$$
$$\\mathbf{f(x) = \\frac{1}{2} + \\frac{2}{\\pi} \\sum_{k=1}^{\\infty} \\frac{\\sin((2k-1)x)}{2k-1} = \\frac{1}{2} + \\frac{2}{\\pi}\\left( \\sin(x) + \\frac{\\sin(3x)}{3} + \\frac{\\sin(5x)}{5} + \\dots \\right)}$$`
      }
    ],

    pythonCode: `import numpy as np
import matplotlib.pyplot as plt

# Definición del dominio
x = np.linspace(-2*np.pi, 2*np.pi, 1000)

# Señal original periódica
def f_original(x_val):
    p = (x_val + np.pi) % (2 * np.pi) - np.pi
    return np.where(p >= 0, 1.0, 0.0)

# Serie de Fourier truncada a N armónicos
def fourier_series(x_val, N):
    y = np.full_like(x_val, 0.5)
    for k in range(1, N + 1, 2):
        y += (2.0 / (k * np.pi)) * np.sin(k * x_val)
    return y

# Gráfica superpuesta
plt.figure(figsize=(10, 5), dpi=150)
plt.plot(x, f_original(x), 'k--', label='f(x) Original', linewidth=1.8)

for N in [5, 10, 20]:
    plt.plot(x, fourier_series(x, N), label=f'N = {N} armónicos')

plt.title('Taller 5 - Ejercicio 1: Pulso Rectangular (N = 5, 10, 20)')
plt.xlabel('x (radianes)')
plt.ylabel('f(x)')
plt.axhline(0.5, color='gray', linestyle=':', alpha=0.6)
plt.scatter([0, np.pi, -np.pi], [0.5, 0.5, 0.5], color='red', zorder=5, label='Dirichlet (0.5)')
plt.grid(True, alpha=0.3)
plt.legend(loc='upper right')
plt.show()`
  },

  t5_ej4: {
    id: "t5_ej4",
    taller: 5,
    section: "1. Series Clásicas",
    number: "Ejercicio 4",
    title: "Rampa Lineal Periódica",
    definitionLatex: "f(x) = x + \\pi, \\quad -\\pi < x < \\pi, \\quad f(x+2\\pi) = f(x)",
    interval: "(-\\pi, \\pi)",
    period: "T = 2\\pi, \\; L = \\pi",
    symmetry: "Sin simetría. Se compone de parte impar (x) y componente continua (\\pi).",
    type: "series",
    harmonics: [5, 10, 20],
    dirichletPoints: [
      { x: "\\pm \\pi", left: "2\\pi", right: "0", mean: "\\pi" }
    ],
    gibbsOvershoot: "Aparece en los extremos x = \\pm \\pi con un sobreimpulso de \\approx 8.95% del salto total de 2\\pi",
    decayRate: "\\mathcal{O}(1/n) \\text{ en los armónicos senoidales}",
    minHarmonicsRecommendation: "n \\ge 15 \\text{ armónicos para aproximar el tramo lineal}",

    analyticalSteps: [
      {
        title: "Paso 1: Análisis de simetría y propiedades de la función",
        content: `La función es $f(x) = x + \\pi$ en $(-\\pi, \\pi)$.
Descomponiendo en parte par e impar:
- Parte par: $f_p(x) = \\frac{f(x) + f(-x)}{2} = \\frac{(x+\\pi) + (-x+\\pi)}{2} = \\pi$ (término constante $a_0/2$).
- Parte impar: $f_i(x) = \\frac{f(x) - f(-x)}{2} = x$.
Como la componente no constante es estrictamente impar ($x$), todos los coeficientes de coseno $a_n$ con $n \\ge 1$ deben anularse analíticamente ($a_n = 0$).`
      },
      {
        title: "Paso 2: Discontinuidades y Teorema de Dirichlet",
        content: `La función $f(x)$ es continua en todo el intervalo abierto $(-\\pi, \\pi)$. Sin embargo, en los extremos de la extensión periódica $x = \\pm \\pi$:
$$f(\\pi^-) = \\lim_{x \\to \\pi^-} (x + \\pi) = 2\\pi$$
$$f(-\\pi^+) = \\lim_{x \\to -\\pi^+} (x + \\pi) = 0$$
El salto en la frontera periódica es $\\Delta f = 2\\pi - 0 = 2\\pi$.
Por Dirichlet:
$$S(\\pm \\pi) = \\frac{f(\\pi^-) + f(-\\pi^+)}{2} = \\frac{2\\pi + 0}{2} = \\pi$$`
      },
      {
        title: "Paso 3: Cálculo del coeficiente a₀",
        content: `$$a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} (x + \\pi)\\,dx = \\frac{1}{\\pi} \\left[ \\int_{-\\pi}^{\\pi} x\\,dx + \\pi \\int_{-\\pi}^{\\pi} 1\\,dx \\right]$$
Dado que $x$ es una función impar sobre un intervalo simétrico, $\\int_{-\\pi}^{\\pi} x\\,dx = 0$.
$$a_0 = \\frac{1}{\\pi} [ 0 + \\pi (2\\pi) ] = 2\\pi \\implies \\frac{a_0}{2} = \\pi$$`
      },
      {
        title: "Paso 4: Cálculo de los coeficientes aₙ",
        content: `$$a_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} (x + \\pi)\\cos(nx)\\,dx = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} x\\cos(nx)\\,dx + \\int_{-\\pi}^{\\pi} \\cos(nx)\\,dx$$
- El primer integrando $x\\cos(nx)$ es el producto de una función impar por una par = **impar**, luego su integral en $[-\\pi, \\pi]$ es cero.
- La segunda integral $\\int_{-\\pi}^{\\pi} \\cos(nx)\\,dx = [\\frac{\\sin(nx)}{n}]_{-\\pi}^{\\pi} = 0$.
Por lo tanto:
$$a_n = 0, \\quad \\forall n \\ge 1$$`
      },
      {
        title: "Paso 5: Cálculo de los coeficientes bₙ por integración por partes",
        content: `$$b_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} (x + \\pi)\\sin(nx)\\,dx = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} x\\sin(nx)\\,dx + \\int_{-\\pi}^{\\pi} \\sin(nx)\\,dx$$
La integral de $\\sin(nx)$ es cero por simetría impar.
Como $x\\sin(nx)$ es par:
$$b_n = \\frac{2}{\\pi} \\int_0^{\\pi} x\\sin(nx)\\,dx$$
Aplicando integración por partes:
Sean $u = x \\implies du = dx$ y $dv = \\sin(nx)\\,dx \\implies v = -\\frac{\\cos(nx)}{n}$:
$$\\int_0^{\\pi} x\\sin(nx)\\,dx = \\left[ -\\frac{x\\cos(nx)}{n} \\right]_0^{\\pi} - \\int_0^{\\pi} \\left(-\\frac{\\cos(nx)}{n}\\right)dx$$
$$= \\left( -\\frac{\\pi\\cos(n\\pi)}{n} - 0 \\right) + \\frac{1}{n} \\left[ \\frac{\\sin(nx)}{n} \\right]_0^{\\pi} = -\\frac{\\pi(-1)^n}{n} + 0$$
Multiplicando por el factor $\\frac{2}{\\pi}$:
$$b_n = \\frac{2}{\\pi} \\left( -\\frac{\\pi(-1)^n}{n} \\right) = -\\frac{2(-1)^n}{n} = \\frac{2(-1)^{n+1}}{n}$$`
      },
      {
        title: "Paso 6: Expresión canónica final",
        content: `$$\\mathbf{f(x) = \\pi + 2 \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n} \\sin(nx) = \\pi + 2\\left( \\sin(x) - \\frac{\\sin(2x)}{2} + \\frac{\\sin(3x)}{3} - \\dots \\right)}$$`
      }
    ],

    pythonCode: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-2*np.pi, 2*np.pi, 1000)

def f_original(x_val):
    p = (x_val + np.pi) % (2 * np.pi) - np.pi
    return p + np.pi

def fourier_series(x_val, N):
    y = np.full_like(x_val, np.pi)
    for n in range(1, N + 1):
        bn = 2.0 * ((-1)**(n + 1)) / n
        y += bn * np.sin(n * x_val)
    return y

plt.figure(figsize=(10, 5), dpi=150)
plt.plot(x, f_original(x), 'k--', label='f(x) Original: x + pi', linewidth=1.8)

for N in [5, 10, 20]:
    plt.plot(x, fourier_series(x, N), label=f'N = {N} armónicos')

plt.scatter([np.pi, -np.pi], [np.pi, np.pi], color='red', zorder=5, label='Dirichlet en ±pi (y = pi)')
plt.title('Taller 5 - Ejercicio 4: Rampa Lineal (N = 5, 10, 20)')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.grid(True, alpha=0.3)
plt.legend()
plt.show()`
  },

  t5_ej2_sc: {
    id: "t5_ej2_sc",
    taller: 5,
    section: "2. Senos y Cosenos (2° Gr.)",
    number: "Ejercicio 2",
    title: "Parábola Par en (-1, 1)",
    definitionLatex: "f(x) = x^2, \\quad -1 < x < 1, \\quad L = 1",
    interval: "(-1, 1)",
    period: "T = 2, \\; L = 1",
    symmetry: "Función PAR pura: f(-x) = (-x)^2 = x^2 = f(x) \\implies b_n = 0 \\quad (\\text{Serie de Cosenos})",
    type: "series",
    harmonics: [5, 10, 20],
    dirichletPoints: [
      { x: "\\pm 1", left: "1", right: "1", mean: "1 (Continua)" }
    ],
    gibbsOvershoot: "No se presenta fenómeno de Gibbs debido a la continuidad global de la extensión periódica",
    decayRate: "\\mathcal{O}(1/n^2) \\text{ (Convergencia cuadrática acelerada)}",
    minHarmonicsRecommendation: "n = 5 \\text{ armónicos son suficientes para un error relativo } < 0.8\\%",

    analyticalSteps: [
      {
        title: "Paso 1: Análisis de simetría y semiperíodo",
        content: `El dominio es $(-1, 1)$, por lo cual $L = 1$ y el período es $T = 2L = 2$.
Comprobando paridad:
$$f(-x) = (-x)^2 = x^2 = f(x)$$
Dado que $f(x)$ es una **función par**, el desarrollo de Fourier se reduce a una **Serie de Cosenos pura**:
$$b_n = 0, \\quad \\forall n \\ge 1$$`
      },
      {
        title: "Paso 2: Análisis de continuidad y Teorema de Dirichlet",
        content: `Evaluando en las fronteras $x = \\pm 1$:
$$f(1^-) = 1^2 = 1, \\quad f(-1^+) = (-1)^2 = 1$$
Como los valores en las fronteras coinciden ($f(1) = f(-1)$), la extensión periódica es **continua en toda la recta real $\\mathbb{R}$**.
Por Dirichlet:
$$S(x) = f(x), \\quad \\forall x \\in \\mathbb{R}$$
Al no existir discontinuidades de salto, **no hay fenómeno de Gibbs** y la serie converge uniformemente.`
      },
      {
        title: "Paso 3: Cálculo paso a paso del coeficiente a₀",
        content: `Aprovechando la simetría par en $[0, L]$ con $L = 1$:
$$a_0 = \\frac{2}{L} \\int_0^L x^2\\,dx = 2 \\int_0^1 x^2\\,dx = 2 \\left[ \\frac{x^3}{3} \\right]_0^1 = 2 \\left( \\frac{1}{3} - 0 \\right) = \\frac{2}{3}$$
El término constante es:
$$\\frac{a_0}{2} = \\frac{1}{3}$$`
      },
      {
        title: "Paso 4: Cálculo paso a paso de los coeficientes aₙ (Integración por partes doble)",
        content: `Con $L = 1$, el argumento es $\\frac{n\\pi x}{L} = n\\pi x$:
$$a_n = \\frac{2}{L} \\int_0^L x^2\\cos(n\\pi x)\\,dx = 2 \\int_0^1 x^2\\cos(n\\pi x)\\,dx$$
**Primera integración por partes:**
Sean $u = x^2 \\implies du = 2x\\,dx$ y $dv = \\cos(n\\pi x)\\,dx \\implies v = \\frac{\\sin(n\\pi x)}{n\\pi}$:
$$\\int_0^1 x^2\\cos(n\\pi x)\\,dx = \\left[ \\frac{x^2\\sin(n\\pi x)}{n\\pi} \\right]_0^1 - \\frac{2}{n\\pi} \\int_0^1 x\\sin(n\\pi x)\\,dx$$
Como $\\sin(n\\pi) = 0$ y $\\sin(0) = 0$, el término evaluado se anula:
$$= 0 - \\frac{2}{n\\pi} \\int_0^1 x\\sin(n\\pi x)\\,dx$$
**Segunda integración por partes:**
Para $\\int_0^1 x\\sin(n\\pi x)\\,dx$, sean $u_1 = x \\implies du_1 = dx$, $dv_1 = \\sin(n\\pi x)\\,dx \\implies v_1 = -\\frac{\\cos(n\\pi x)}{n\\pi}$:
$$\\int_0^1 x\\sin(n\\pi x)\\,dx = \\left[ -\\frac{x\\cos(n\\pi x)}{n\\pi} \\right]_0^1 - \\int_0^1 \\left(-\\frac{\\cos(n\\pi x)}{n\\pi}\\right)dx$$
$$= \\left( -\\frac{\\cos(n\\pi)}{n\\pi} - 0 \\right) + \\frac{1}{n\\pi} \\left[ \\frac{\\sin(n\\pi x)}{n\\pi} \\right]_0^1 = -\\frac{(-1)^n}{n\\pi} + 0$$
Sustituyendo hacia atrás:
$$\\int_0^1 x^2\\cos(n\\pi x)\\,dx = -\\frac{2}{n\\pi} \\left( -\\frac{(-1)^n}{n\\pi} \\right) = \\frac{2(-1)^n}{n^2\\pi^2}$$
Multiplicando por el factor 2 inicial:
$$a_n = 2 \\cdot \\frac{2(-1)^n}{n^2\\pi^2} = \\frac{4(-1)^n}{n^2\\pi^2}$$`
      },
      {
        title: "Paso 5: Expresión canónica final de la serie de Cosenos",
        content: `$$\\mathbf{f(x) = \\frac{1}{3} + \\frac{4}{\\pi^2} \\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n^2} \\cos(n\\pi x) = \\frac{1}{3} - \\frac{4}{\\pi^2}\\left( \\cos(\\pi x) - \\frac{\\cos(2\\pi x)}{4} + \\frac{\\cos(3\\pi x)}{9} - \\dots \\right)}$$`
      }
    ],

    pythonCode: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-2.5, 2.5, 1000)

def f_original(x_val):
    p = (x_val + 1) % 2 - 1
    return p**2

def fourier_series(x_val, N):
    y = np.full_like(x_val, 1.0 / 3.0)
    for n in range(1, N + 1):
        an = (4.0 * ((-1)**n)) / ((n * np.pi)**2)
        y += an * np.cos(n * np.pi * x_val)
    return y

plt.figure(figsize=(10, 5), dpi=150)
plt.plot(x, f_original(x), 'k--', label='f(x) Original: x^2 (Par)', linewidth=2)

for N in [5, 10, 20]:
    plt.plot(x, fourier_series(x, N), label=f'N = {N} armónicos')

plt.title('Taller 5 - Ejercicio 2: Serie de Cosenos x^2 (Convergencia O(1/n^2))')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.grid(True, alpha=0.3)
plt.legend()
plt.show()`
  },

  t5_ej4_sc: {
    id: "t5_ej4_sc",
    taller: 5,
    section: "2. Senos y Cosenos (2° Gr.)",
    number: "Ejercicio 4",
    title: "Cúbica Impar en (-pi, pi)",
    definitionLatex: "f(x) = x^3, \\quad -\\pi < x < \\pi, \\quad L = \\pi",
    interval: "(-\\pi, \\pi)",
    period: "T = 2\\pi, \\; L = \\pi",
    symmetry: "Función IMPAR pura: f(-x) = (-x)^3 = -x^3 = -f(x) \\implies a_0 = 0, \\; a_n = 0 \\quad (\\text{Serie de Senos})",
    type: "series",
    harmonics: [5, 10, 20],
    dirichletPoints: [
      { x: "\\pm \\pi", left: "\\pi^3", right: "-\\pi^3", mean: "0" }
    ],
    gibbsOvershoot: "Aparece en las discontinuidades periódicas x = \\pm \\pi con un sobreimpulso de \\approx 8.95% del salto (2\\pi^3)",
    decayRate: "\\mathcal{O}(1/n) \\text{ debido a la discontinuidad en los extremos de la extensión periódica}",
    minHarmonicsRecommendation: "n \\ge 20 \\text{ armónicos para atenuar el rizado cercano a } \\pm \\pi",

    analyticalSteps: [
      {
        title: "Paso 1: Análisis de simetría impar y coeficientes nulos",
        content: `Evaluando la paridad en $(-\\pi, \\pi)$ con $L = \\pi$:
$$f(-x) = (-x)^3 = -x^3 = -f(x)$$
Al ser $f(x)$ **impar**, la función centrada tiene promedio nulo y todos los términos de coseno se anulan:
$$a_0 = 0, \\quad a_n = 0, \\quad \\forall n \\ge 1$$
El desarrollo corresponde exclusivamente a una **Serie de Senos de Fourier**.`
      },
      {
        title: "Paso 2: Discontinuidades periódicas y Teorema de Dirichlet",
        content: `Dentro de $(-\\pi, \\pi)$, la función es suave y diferenciable. Sin embargo, en la frontera de extensión periódica:
$$f(\\pi^-) = \\pi^3 \\approx 31.006, \\quad f(-\\pi^+) = -\\pi^3 \\approx -31.006$$
El salto es $\\Delta f = 2\\pi^3$.
Por el Teorema de Dirichlet en $x = \\pm \\pi$:
$$S(\\pm \\pi) = \\frac{\\pi^3 + (-\\pi^3)}{2} = 0$$`
      },
      {
        title: "Paso 3: Cálculo de bₙ mediante integración por partes triple",
        content: `Por simetría impar:
$$b_n = \\frac{2}{\\pi} \\int_0^{\\pi} x^3\\sin(nx)\\,dx$$
Aplicando el método tabular de integración por partes:
| Signo | Derivadas de $u = x^3$ | Integrales de $dv = \\sin(nx)$ |
|:---:|:---:|:---:|
| $(+)$ | $x^3$ | $-\\frac{\\cos(nx)}{n}$ |
| $(-)$ | $3x^2$ | $-\\frac{\\sin(nx)}{n^2}$ |
| $(+)$ | $6x$ | $\\frac{\\cos(nx)}{n^3}$ |
| $(-)$ | $6$ | $\\frac{\\sin(nx)}{n^4}$ |
| $(+)$ | $0$ | $-\\frac{\\cos(nx)}{n^5}$ |

Multiplicando en diagonal y agrupando:
$$\\int_0^{\\pi} x^3\\sin(nx)\\,dx = \\left[ -\\frac{x^3\\cos(nx)}{n} + \\frac{3x^2\\sin(nx)}{n^2} + \\frac{6x\\cos(nx)}{n^3} - \\frac{6\\sin(nx)}{n^4} \\right]_0^{\\pi}$$
Evaluando en $\\pi$ y en $0$ (recordando que $\\sin(n\\pi)=0$ y $\\sin(0)=0$):
$$= \\left( -\\frac{\\pi^3(-1)^n}{n} + 0 + \\frac{6\\pi(-1)^n}{n^3} - 0 \\right) - (0) = (-1)^n \\left( -\\frac{\\pi^3}{n} + \\frac{6\\pi}{n^3} \\right)$$
Factorizando $(-1)$ y $\\pi$:
$$= (-1)^{n+1} \\pi \\left( \\frac{\\pi^2}{n} - \\frac{6}{n^3} \\right)$$
Multiplicando por el factor exterior $\\frac{2}{\\pi}$:
$$b_n = \\frac{2}{\\pi} \\cdot (-1)^{n+1} \\pi \\left( \\frac{\\pi^2}{n} - \\frac{6}{n^3} \\right) = 2(-1)^{n+1} \\left( \\frac{\\pi^2}{n} - \\frac{6}{n^3} \\right)$$`
      },
      {
        title: "Paso 4: Expresión canónica final de la serie de Senos",
        content: `$$\\mathbf{f(x) = 2 \\sum_{n=1}^{\\infty} (-1)^{n+1} \\left( \\frac{\\pi^2}{n} - \\frac{6}{n^3} \\right) \\sin(nx)}$$`
      }
    ],

    pythonCode: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-2*np.pi, 2*np.pi, 1000)

def f_original(x_val):
    p = (x_val + np.pi) % (2 * np.pi) - np.pi
    return p**3

def fourier_series(x_val, N):
    y = np.zeros_like(x_val)
    for n in range(1, N + 1):
        bn = 2.0 * ((-1)**(n + 1)) * ((np.pi**2)/n - 6.0/(n**3))
        y += bn * np.sin(n * x_val)
    return y

plt.figure(figsize=(10, 5), dpi=150)
plt.plot(x, f_original(x), 'k--', label='f(x) Original: x^3 (Impar)', linewidth=2)

for N in [5, 10, 20]:
    plt.plot(x, fourier_series(x, N), label=f'N = {N} armónicos')

plt.scatter([np.pi, -np.pi], [0, 0], color='red', zorder=5, label='Dirichlet en ±pi (y = 0)')
plt.title('Taller 5 - Ejercicio 4: Serie de Senos x^3 (N = 5, 10, 20)')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.grid(True, alpha=0.3)
plt.legend()
plt.show()`
  },

  t5_ej1_comp: {
    id: "t5_ej1_comp",
    taller: 5,
    section: "3. Series Complejas",
    number: "Ejercicio 1",
    title: "Onda Cuadrada Compleja en (-2, 2)",
    definitionLatex: "f(x) = \\begin{cases} -1, & -2 < x < 0 \\\\ 1, & 0 < x < 2 \\end{cases}, \\quad T = 4, \\; L = 2",
    interval: "(-2, 2)",
    period: "T = 4, \\; \\omega_0 = \\frac{2\\pi}{T} = \\frac{\\pi}{2}",
    symmetry: "Función impar pura. Los coeficientes complejos c_n son imaginarios puros.",
    type: "series",
    harmonics: [5, 10, 20],
    dirichletPoints: [
      { x: "0", left: "-1", right: "1", mean: "0" },
      { x: "\\pm 2", left: "1", right: "-1", mean: "0" }
    ],
    gibbsOvershoot: "8.95% en x = 0 y en los bordes x = \\pm 2 (salto total = 2)",
    decayRate: "\\mathcal{O}(1/n)",
    minHarmonicsRecommendation: "n \\ge 19 \\text{ armónicos para la formación de meseta cuadrada}",

    analyticalSteps: [
      {
        title: "Paso 1: Parámetros fundamentales de la forma exponencial compleja",
        content: `El período es $T = 4$, por lo tanto la frecuencia angular fundamental es:
$$\\omega_0 = \\frac{2\\pi}{T} = \\frac{2\\pi}{4} = \\frac{\\pi}{2}$$
La serie compleja de Fourier tiene la estructura:
$$f(x) = \\sum_{n=-\\infty}^{\\infty} c_n e^{in\\omega_0 x} = \\sum_{n=-\\infty}^{\\infty} c_n e^{in\\pi x/2}$$
Donde la fórmula integral de los coeficientes $c_n$ es:
$$c_n = \\frac{1}{T} \\int_{-T/2}^{T/2} f(x) e^{-in\\omega_0 x}\\,dx = \\frac{1}{4} \\int_{-2}^2 f(x) e^{-in\\pi x/2}\\,dx$$`
      },
      {
        title: "Paso 2: Cálculo del coeficiente medio c₀",
        content: `$$c_0 = \\frac{1}{4} \\int_{-2}^2 f(x)\\,dx = \\frac{1}{4} \\left[ \\int_{-2}^0 (-1)\\,dx + \\int_0^2 1\\,dx \\right] = \\frac{1}{4} [ -2 + 2 ] = 0$$`
      },
      {
        title: "Paso 3: Cálculo analítico de los coeficientes cₙ para n ≠ 0",
        content: `Descomponiendo en los dos intervalos:
$$c_n = \\frac{1}{4} \\left[ -\\int_{-2}^0 e^{-in\\pi x/2}\\,dx + \\int_0^2 e^{-in\\pi x/2}\\,dx \\right]$$
Evaluando las integrales exponenciales (usando $\\int e^{ax}dx = \\frac{1}{a}e^{ax}$ con $a = -in\\pi/2$):
$$\\int_0^2 e^{-in\\pi x/2}\\,dx = \\left[ \\frac{e^{-in\\pi x/2}}{-in\\pi/2} \\right]_0^2 = -\\frac{2}{in\\pi} [e^{-in\\pi} - 1] = \\frac{2(1 - (-1)^n)}{in\\pi}$$
$$\\int_{-2}^0 e^{-in\\pi x/2}\\,dx = \\left[ \\frac{e^{-in\\pi x/2}}{-in\\pi/2} \\right]_{-2}^0 = -\\frac{2}{in\\pi} [1 - e^{in\\pi}] = -\\frac{2(1 - (-1)^n)}{in\\pi}$$
Restando según la fórmula:
$$c_n = \\frac{1}{4} \\left[ -\\left(-\\frac{2(1 - (-1)^n)}{in\\pi}\\right) + \\frac{2(1 - (-1)^n)}{in\\pi} \\right] = \\frac{1}{4} \\left[ \\frac{4(1 - (-1)^n)}{in\\pi} \\right]$$
$$c_n = \\frac{1 - (-1)^n}{in\\pi} = \\begin{cases} 0, & \\text{si } n \\text{ es par} \\\\ \\dfrac{2}{in\\pi} = -\\dfrac{2i}{n\\pi}, & \\text{si } n \\text{ es impar} \\end{cases}$$`
      },
      {
        title: "Paso 4: Equivalencia trigonométrica y forma canónica",
        content: `Agrupando los términos positivos y negativos $c_n e^{in\\omega_0 x} + c_{-n} e^{-in\\omega_0 x}$:
Para $n$ impar, $c_{-n} = \\frac{2i}{n\\pi} = -c_n$.
$$c_n e^{in\\pi x/2} + c_{-n} e^{-in\\pi x/2} = -\\frac{2i}{n\\pi} (e^{in\\pi x/2} - e^{-in\\pi x/2})$$
Recordando la fórmula de Euler $\\sin(\\theta) = \\frac{e^{i\\theta} - e^{-i\\theta}}{2i}$:
$$= -\\frac{2i}{n\\pi} \\cdot (2i\\sin(n\\pi x/2)) = \\frac{4}{n\\pi} \\sin\\left(\\frac{n\\pi x}{2}\\right)$$
Por ende, la serie compleja es:
$$\\mathbf{f(x) = \\sum_{n=-\\infty, n \\neq 0}^{\\infty} \\left( -\\frac{2i}{n\\pi} \\right) e^{in\\pi x/2} = \\frac{4}{\\pi} \\sum_{k=1}^{\\infty} \\frac{1}{2k-1} \\sin\\left( \\frac{(2k-1)\\pi x}{2} \\right)}$$`
      }
    ],

    pythonCode: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-4, 4, 1000)

def f_original(x_val):
    p = (x_val + 2) % 4 - 2
    return np.where(p > 0, 1.0, -1.0)

def fourier_complex(x_val, N):
    y = np.zeros(len(x_val), dtype=complex)
    for n in range(-N, N + 1):
        if n % 2 != 0:
            cn = -2.0j / (n * np.pi)
            y += cn * np.exp(1j * n * np.pi * x_val / 2.0)
    return y.real

plt.figure(figsize=(10, 5), dpi=150)
plt.plot(x, f_original(x), 'k--', label='Onda Cuadrada Original', linewidth=2)

for N in [5, 10, 20]:
    plt.plot(x, fourier_complex(x, N), label=f'N = {N} armónicos complejos')

plt.scatter([0, 2, -2], [0, 0, 0], color='red', zorder=5, label='Dirichlet en discontinuidades (y = 0)')
plt.title('Taller 5 - Ejercicio 1 (Complejas): Onda Cuadrada en (-2, 2)')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.grid(True, alpha=0.3)
plt.legend()
plt.show()`
  },

  t5_ej6_comp: {
    id: "t5_ej6_comp",
    taller: 5,
    section: "3. Series Complejas",
    number: "Ejercicio 6",
    title: "Exponencial Par e^{-|x|} en (-1, 1)",
    definitionLatex: "f(x) = e^{-|x|}, \\quad -1 < x < 1, \\quad T = 2, \\; L = 1",
    interval: "(-1, 1)",
    period: "T = 2, \\; \\omega_0 = \\pi",
    symmetry: "Función par. Los coeficientes complejos c_n son reales puros.",
    type: "series",
    harmonics: [5, 10, 20],
    dirichletPoints: [
      { x: "\\pm 1", left: "e^{-1}", right: "e^{-1}", mean: "e^{-1} \\approx 0.3679" }
    ],
    gibbsOvershoot: "No se produce fenómeno de Gibbs (función continua periódicamente)",
    decayRate: "\\mathcal{O}(1/n^2) \\text{ debido a la cúspide no derivable en los enteros}",
    minHarmonicsRecommendation: "n = 10 \\text{ armónicos para capturar la curvatura de la cúspide}",

    analyticalSteps: [
      {
        title: "Paso 1: Parámetros y simetría par",
        content: `El período es $T = 2 \\implies L = 1$, por lo cual $\\omega_0 = \\frac{2\\pi}{2} = \\pi$.
Como $f(-x) = e^{-|-x|} = e^{-|x|} = f(x)$, la función es **par**.
Por simetría, los coeficientes complejos $c_n$ son números reales puros y cumplen $c_{-n} = c_n$.`
      },
      {
        title: "Paso 2: Cálculo del coeficiente medio c₀",
        content: `$$c_0 = \\frac{1}{2} \\int_{-1}^1 e^{-|x|}\\,dx = \\int_0^1 e^{-x}\\,dx = \\left[ -e^{-x} \\right]_0^1 = -e^{-1} - (-1) = 1 - e^{-1} \\approx 0.6321$$`
      },
      {
        title: "Paso 3: Cálculo analítico de los coeficientes complejos cₙ",
        content: `$$c_n = \\frac{1}{2} \\int_{-1}^1 e^{-|x|} e^{-in\\pi x}\\,dx$$
Usando la identidad de Euler $e^{-in\\pi x} = \\cos(n\\pi x) - i\\sin(n\\pi x)$:
Como $e^{-|x|}\\sin(n\\pi x)$ es impar, su integral se anula.
$$c_n = \\int_0^1 e^{-x}\\cos(n\\pi x)\\,dx$$
Aplicando la fórmula clásica de integración $\\int e^{ax}\\cos(bx)dx = \\frac{e^{ax}(a\\cos(bx) + b\\sin(bx))}{a^2 + b^2}$ con $a = -1, b = n\\pi$:
$$\\int_0^1 e^{-x}\\cos(n\\pi x)\\,dx = \\left[ \\frac{e^{-x}(-\\cos(n\\pi x) + n\\pi\\sin(n\\pi x))}{1 + n^2\\pi^2} \\right]_0^1$$
Evaluando en $x = 1$ y $x = 0$:
$$= \\frac{e^{-1}(-(-1)^n + 0)}{1 + n^2\\pi^2} - \\frac{e^0(-1 + 0)}{1 + n^2\\pi^2} = \\frac{1 - e^{-1}(-1)^n}{1 + n^2\\pi^2}$$
Por tanto:
$$c_n = \\frac{1 - e^{-1}(-1)^n}{1 + n^2\\pi^2}, \\quad \\forall n \\in \\mathbb{Z}$$`
      },
      {
        title: "Paso 4: Expresión canónica final",
        content: `$$\\mathbf{f(x) = (1 - e^{-1}) + 2 \\sum_{n=1}^{\\infty} \\frac{1 - e^{-1}(-1)^n}{1 + n^2\\pi^2} \\cos(n\\pi x)}$$`
      }
    ],

    pythonCode: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-2.5, 2.5, 1000)

def f_original(x_val):
    p = (x_val + 1) % 2 - 1
    return np.exp(-np.abs(p))

def fourier_complex(x_val, N):
    e_inv = np.exp(-1)
    y = np.full_like(x_val, 1.0 - e_inv)
    for n in range(1, N + 1):
        cn = (1.0 - e_inv * ((-1)**n)) / (1.0 + (n * np.pi)**2)
        y += 2.0 * cn * np.cos(n * np.pi * x_val)
    return y

plt.figure(figsize=(10, 5), dpi=150)
plt.plot(x, f_original(x), 'k--', label='f(x) Original: exp(-|x|)', linewidth=2)

for N in [5, 10, 20]:
    plt.plot(x, fourier_complex(x, N), label=f'N = {N} armónicos')

plt.title('Taller 5 - Ejercicio 6 (Complejas): exp(-|x|) en (-1, 1)')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.grid(True, alpha=0.3)
plt.legend()
plt.show()`
  },

  // -------------------------------------------------------------
  // TALLER 6: INTEGRALES DE FOURIER (4 EJERCICIOS)
  // -------------------------------------------------------------

  t6_ej2_gen: {
    id: "t6_ej2_gen",
    taller: 6,
    section: "1. Integral General",
    number: "Ejercicio 2",
    title: "Pulso Desplazado en (\\pi, 2\\pi)",
    definitionLatex: "f(x) = \\begin{cases} 4, & \\pi < x < 2\\pi \\\\ 0, & \\text{en otro caso} \\end{cases}",
    interval: "(\\pi, 2\\pi)",
    period: "No periódica en (-\\infty, \\infty)",
    symmetry: "Sin simetría (Requiere tanto A(\\alpha) como B(\\alpha) no nulos)",
    type: "integral",
    cutoffs: [5, 20, 50],
    dirichletPoints: [
      { x: "\\pi", left: "0", right: "4", mean: "2" },
      { x: "2\\pi", left: "4", right: "0", mean: "2" }
    ],
    gibbsOvershoot: "Rizado espectral y oscilación de Gibbs en las discontinuidades x = \\pi y x = 2\\pi",
    decayRate: "\\text{Atenuación del rizado espectral proporcional a } 1/b",
    minHarmonicsRecommendation: "b = 50 \\text{ rad/u para atenuar las oscilaciones fuera del soporte}",

    analyticalSteps: [
      {
        title: "Paso 1: Fundamento de la Representación Integral de Fourier",
        content: `Para una función no periódica integrable en $(-\\infty, \\infty)$, la representación de Fourier truncada a una frecuencia de corte finita $b$ es:
$$f_b(x) = \\frac{1}{\\pi} \\int_0^b [A(\\alpha)\\cos(\\alpha x) + B(\\alpha)\\sin(\\alpha x)]\\,d\\alpha$$
Donde los coeficientes espectrales continuos están dados por:
$$A(\\alpha) = \\int_{-\\infty}^{\\infty} f(x)\\cos(\\alpha x)\\,dx, \\quad B(\\alpha) = \\int_{-\\infty}^{\\infty} f(x)\\sin(\\alpha x)\\,dx$$`
      },
      {
        title: "Paso 2: Deducción analítica de A(α)",
        content: `Dado que $f(x) = 4$ únicamente en el soporte $(\\pi, 2\\pi)$:
$$A(\\alpha) = \\int_{\\pi}^{2\\pi} 4\\cos(\\alpha x)\\,dx = 4 \\left[ \\frac{\\sin(\\alpha x)}{\\alpha} \\right]_{\\pi}^{2\\pi} = \\frac{4[\\sin(2\\pi\\alpha) - \\sin(\\pi\\alpha)]}{\\alpha}$$
*(Para $\\alpha \\to 0$, aplicando L'Hôpital: $\\lim_{\\alpha \\to 0} A(\\alpha) = 4(2\\pi - \\pi) = 4\\pi$).*`
      },
      {
        title: "Paso 3: Deducción analítica de B(α)",
        content: `$$B(\\alpha) = \\int_{\\pi}^{2\\pi} 4\\sin(\\alpha x)\\,dx = 4 \\left[ -\\frac{\\cos(\\alpha x)}{\\alpha} \\right]_{\\pi}^{2\\pi} = \\frac{4[\\cos(\\pi\\alpha) - \\cos(2\\pi\\alpha)]}{\\alpha}$$`
      },
      {
        title: "Paso 4: Integral truncada y convergencia de Dirichlet",
        content: `Sustituyendo $A(\\alpha)$ y $B(\\alpha)$ en la fórmula de la integral truncada con corte $b$:
$$f_b(x) = \\frac{4}{\\pi} \\int_0^b \\frac{[\\sin(2\\pi\\alpha) - \\sin(\\pi\\alpha)]\\cos(\\alpha x) + [\\cos(\\pi\\alpha) - \\cos(2\\pi\\alpha)]\\sin(\\alpha x)}{\\alpha}\\,d\\alpha$$
Usando la identidad trigonométrica $\\sin(u)\\cos(v) + \\cos(u)\\sin(v) = \\sin(u+v)$ o evaluando numéricamente:
En los saltos de discontinuidad $x = \\pi$ y $x = 2\\pi$:
$$\\lim_{b \\to \\infty} f_b(\\pi) = \\frac{0 + 4}{2} = 2, \\quad \\lim_{b \\to \\infty} f_b(2\\pi) = \\frac{4 + 0}{2} = 2$$`
      }
    ],

    pythonCode: `import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import quad

def f_original(x):
    return np.where((x > np.pi) & (x < 2*np.pi), 4.0, 0.0)

def f_b(x_val, b):
    def integrand(alpha):
        if alpha == 0:
            return 4.0 * np.pi
        A = 4.0 * (np.sin(2*np.pi*alpha) - np.sin(np.pi*alpha)) / alpha
        B = 4.0 * (np.cos(np.pi*alpha) - np.cos(2*np.pi*alpha)) / alpha
        return A * np.cos(alpha * x_val) + B * np.sin(alpha * x_val)
    res, _ = quad(integrand, 0, b, limit=200)
    return res / np.pi

x_vec = np.linspace(-2, 3*np.pi, 400)
plt.figure(figsize=(10, 5), dpi=150)
plt.plot(x_vec, f_original(x_vec), 'k--', label='f(x) Original (Pulso 4 en [pi, 2pi])', linewidth=2)

for b_cut in [5, 20, 50]:
    y_approx = [f_b(x, b_cut) for x in x_vec]
    plt.plot(x_vec, y_approx, label=f'Corte b = {b_cut} rad/u')

plt.scatter([np.pi, 2*np.pi], [2, 2], color='red', zorder=5, label='Dirichlet en saltos (y = 2)')
plt.title('Taller 6 - Ejercicio 2: Integral General de Fourier')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.grid(True, alpha=0.3)
plt.legend()
plt.show()`
  },

  t6_ej5_gen: {
    id: "t6_ej5_gen",
    taller: 6,
    section: "1. Integral General",
    number: "Ejercicio 5",
    title: "Exponencial Par en Toda la Recta e^{-|x|}",
    definitionLatex: "f(x) = \\begin{cases} e^x, & x < 0 \\\\ e^{-x}, & x > 0 \\end{cases} = e^{-|x|}, \\quad x \\in (-\\infty, \\infty)",
    interval: "(-\\infty, \\infty)",
    period: "No periódica",
    symmetry: "Función par pura en todo R. B(\\alpha) = 0 \\implies Integral de Cosenos de Fourier.",
    type: "integral",
    cutoffs: [5, 20, 50],
    dirichletPoints: [
      { x: "0", left: "1", right: "1", mean: "1 (Cúspide continua)" }
    ],
    gibbsOvershoot: "Sin sobreimpulso de Gibbs debido a la continuidad global",
    decayRate: "\\mathcal{O}(1/b) \\text{ en el remanente de integración}",
    minHarmonicsRecommendation: "b = 20 \\text{ rad/u aproxima fielmente la cúspide con error < 2%}",

    analyticalSteps: [
      {
        title: "Paso 1: Clasificación de simetría y anulación de B(α)",
        content: `Evaluando en todo $\\mathbb{R}$:
$$f(-x) = e^{-|-x|} = e^{-|x|} = f(x)$$
Dado que la función es **estrictamente par**:
$$B(\\alpha) = \\int_{-\\infty}^{\\infty} f(x)\\sin(\\alpha x)\\,dx = 0, \\quad \\forall \\alpha$$
La representación es una **Integral de Cosenos de Fourier** pura:
$$f(x) = \\frac{1}{\\pi} \\int_0^{\\infty} A(\\alpha)\\cos(\\alpha x)\\,d\\alpha, \\quad \\text{con } A(\\alpha) = 2 \\int_0^{\\infty} f(x)\\cos(\\alpha x)\\,dx$$`
      },
      {
        title: "Paso 2: Deducción analítica de A(α) por integración elemental",
        content: `Para $x > 0$, $f(x) = e^{-x}$:
$$A(\\alpha) = 2 \\int_0^{\\infty} e^{-x}\\cos(\\alpha x)\\,dx$$
Usando la integral estándar $\\int_0^{\\infty} e^{-st}\\cos(\\omega t)dt = \\frac{s}{s^2 + \\omega^2}$ con $s = 1, \\omega = \\alpha$:
$$A(\\alpha) = 2 \\left[ \\frac{1}{1 + \\alpha^2} \\right] = \\frac{2}{1 + \\alpha^2}$$`
      },
      {
        title: "Paso 3: Expresión de la integral truncada f_b(x)",
        content: `$$\\mathbf{f_b(x) = \\frac{1}{\\pi} \\int_0^b \\left( \\frac{2}{1 + \\alpha^2} \\right) \\cos(\\alpha x)\\,d\\alpha = \\frac{2}{\\pi} \\int_0^b \\frac{\\cos(\\alpha x)}{1 + \\alpha^2}\\,d\\alpha}$$
Nótese que en $x = 0$:
$$f_b(0) = \\frac{2}{\\pi} \\int_0^b \\frac{1}{1 + \\alpha^2}\\,d\\alpha = \\frac{2}{\\pi} [\\arctan(b) - \\arctan(0)] = \\frac{2}{\\pi}\\arctan(b)$$
Cuando $b \\to \\infty$: $\\lim_{b \\to \\infty} f_b(0) = \\frac{2}{\\pi}\\left(\\frac{\\pi}{2}\\right) = 1 = f(0)$, verificando analíticamente la convergencia exacta.`
      }
    ],

    pythonCode: `import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import quad

def f_original(x):
    return np.exp(-np.abs(x))

def f_b(x_val, b):
    def integrand(alpha):
        return np.cos(alpha * x_val) / (1.0 + alpha**2)
    res, _ = quad(integrand, 0, b)
    return (2.0 / np.pi) * res

x_vec = np.linspace(-5, 5, 400)
plt.figure(figsize=(10, 5), dpi=150)
plt.plot(x_vec, f_original(x_vec), 'k--', label='f(x) Original: exp(-|x|)', linewidth=2)

for b_cut in [5, 20, 50]:
    y_approx = [f_b(x, b_cut) for x in x_vec]
    plt.plot(x_vec, y_approx, label=f'Corte b = {b_cut} rad/u')

plt.title('Taller 6 - Ejercicio 5: Integral Par exp(-|x|) en (-inf, inf)')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.grid(True, alpha=0.3)
plt.legend()
plt.show()`
  },

  t6_ej1_sin: {
    id: "t6_ej1_sin",
    taller: 6,
    section: "2. Senos y Cosenos",
    number: "Ejercicio 1",
    title: "Pulso Antisimétrico Impar (Integral de Senos)",
    definitionLatex: "f(x) = \\begin{cases} -5, & -1 < x < 0 \\\\ 5, & 0 < x < 1 \\\\ 0, & |x| > 1 \\end{cases}",
    interval: "(-1, 1)",
    period: "No periódica",
    symmetry: "Función impar pura en R. A(\\alpha) = 0 \\implies Integral de Senos de Fourier.",
    type: "integral",
    cutoffs: [5, 20, 50],
    dirichletPoints: [
      { x: "-1", left: "0", right: "-5", mean: "-2.5" },
      { x: "0", left: "-5", right: "5", mean: "0" },
      { x: "1", left: "5", right: "0", mean: "2.5" }
    ],
    gibbsOvershoot: "Aparece con sobreimpulso de \\approx 8.95% en los saltos x = 0 y x = \\pm 1",
    decayRate: "\\text{Rizado decrece con } 1/b \\text{ pero el sobreimpulso pico persiste}",
    minHarmonicsRecommendation: "b = 50 \\text{ rad/u para delimitar claramente los escalones de amplitud 5}",

    analyticalSteps: [
      {
        title: "Paso 1: Simetría impar y anulación de A(α)",
        content: `Evaluando paridad:
$$f(-x) = -f(x), \\quad \\forall x \\in \\mathbb{R}$$
Al ser estrictamente impar, la componente de cosenos se anula idénticamente:
$$A(\\alpha) = 0, \\quad \\forall \\alpha$$
La representación es una **Integral de Senos de Fourier**:
$$f_b(x) = \\frac{1}{\\pi} \\int_0^b B(\\alpha)\\sin(\\alpha x)\\,d\\alpha, \\quad \\text{con } B(\\alpha) = 2 \\int_0^{\\infty} f(x)\\sin(\\alpha x)\\,dx$$`
      },
      {
        title: "Paso 2: Deducción analítica de B(α)",
        content: `Como $f(x) = 5$ en $(0, 1)$ y $0$ en $x > 1$:
$$B(\\alpha) = 2 \\int_0^1 5\\sin(\\alpha x)\\,dx = 10 \\left[ -\\frac{\\cos(\\alpha x)}{\\alpha} \\right]_0^1 = \\frac{10(1 - \\cos\\alpha)}{\\alpha}$$
Usando la identidad del ángulo mitad $1 - \\cos\\alpha = 2\\sin^2(\\alpha/2)$:
$$B(\\alpha) = \\frac{20\\sin^2(\\alpha/2)}{\\alpha}$$`
      },
      {
        title: "Paso 3: Expresión de la integral truncada y Teorema de Dirichlet",
        content: `$$\\mathbf{f_b(x) = \\frac{1}{\\pi} \\int_0^b \\frac{10(1 - \\cos\\alpha)}{\\alpha} \\sin(\\alpha x)\\,d\\alpha}$$
En los puntos de salto:
- En $x = 0$: $f(0^+) = 5, f(0^-) = -5 \\implies \\lim_{b \\to \\infty} f_b(0) = \\frac{5 + (-5)}{2} = 0$.
- En $x = 1$: $f(1^-) = 5, f(1^+) = 0 \\implies \\lim_{b \\to \\infty} f_b(1) = \\frac{5 + 0}{2} = 2.5$.
- En $x = -1$: $f(-1^-) = 0, f(-1^+) = -5 \\implies \\lim_{b \\to \\infty} f_b(-1) = -2.5$.`
      }
    ],

    pythonCode: `import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import quad

def f_original(x):
    return np.where((x > 0) & (x < 1), 5.0, np.where((x > -1) & (x < 0), -5.0, 0.0))

def f_b(x_val, b):
    def integrand(alpha):
        if alpha == 0:
            return 0.0
        return (10.0 * (1.0 - np.cos(alpha)) / alpha) * np.sin(alpha * x_val)
    res, _ = quad(integrand, 0, b, limit=200)
    return res / np.pi

x_vec = np.linspace(-3, 3, 400)
plt.figure(figsize=(10, 5), dpi=150)
plt.plot(x_vec, f_original(x_vec), 'k--', label='f(x) Original (Impar: ±5)', linewidth=2)

for b_cut in [5, 20, 50]:
    y_approx = [f_b(x, b_cut) for x in x_vec]
    plt.plot(x_vec, y_approx, label=f'Corte b = {b_cut} rad/u')

plt.scatter([-1, 0, 1], [-2.5, 0, 2.5], color='red', zorder=5, label='Dirichlet en saltos')
plt.title('Taller 6 - Ejercicio 1 (Senos): Pulso Antisimétrico')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.grid(True, alpha=0.3)
plt.legend()
plt.show()`
  },

  t6_ej2_cos: {
    id: "t6_ej2_cos",
    taller: 6,
    section: "2. Senos y Cosenos",
    number: "Ejercicio 2",
    title: "Pulso Par Simétrico (Integral de Cosenos)",
    definitionLatex: "f(x) = \\begin{cases} \\pi, & 1 < |x| < 2 \\\\ 0, & \\text{en otro caso} \\end{cases}",
    interval: "1 < |x| < 2",
    period: "No periódica",
    symmetry: "Función par pura en R. B(\\alpha) = 0 \\implies Integral de Cosenos de Fourier.",
    type: "integral",
    cutoffs: [5, 20, 50],
    dirichletPoints: [
      { x: "\\pm 1", left: "\\pi/2", right: "\\pi/2", mean: "\\pi/2 \\approx 1.5708" },
      { x: "\\pm 2", left: "\\pi/2", right: "\\pi/2", mean: "\\pi/2 \\approx 1.5708" }
    ],
    gibbsOvershoot: "Sobreimpulso del ~8.95% en los cuatro puntos de discontinuidad x = \\pm 1 y x = \\pm 2",
    decayRate: "\\text{Rizado atenuado al aumentar b}",
    minHarmonicsRecommendation: "b = 50 \\text{ rad/u para definir ambas ventanas simétricas}",

    analyticalSteps: [
      {
        title: "Paso 1: Simetría par y anulación de B(α)",
        content: `Dado que $f(-x) = f(x)$, la función es **estrictamente par**.
Por consiguiente:
$$B(\\alpha) = 0, \\quad \\forall \\alpha$$
La representación es una **Integral de Cosenos de Fourier**:
$$f_b(x) = \\frac{1}{\\pi} \\int_0^b A(\\alpha)\\cos(\\alpha x)\\,d\\alpha, \\quad \\text{con } A(\\alpha) = 2 \\int_0^{\\infty} f(x)\\cos(\\alpha x)\\,dx$$`
      },
      {
        title: "Paso 2: Deducción analítica de A(α)",
        content: `Para $x > 0$, la función vale $\\pi$ solo en el intervalo $(1, 2)$:
$$A(\\alpha) = 2 \\int_1^2 \\pi\\cos(\\alpha x)\\,dx = 2\\pi \\left[ \\frac{\\sin(\\alpha x)}{\\alpha} \\right]_1^2 = \\frac{2\\pi(\\sin(2\\alpha) - \\sin\\alpha)}{\\alpha}$$`
      },
      {
        title: "Paso 3: Expresión de la integral truncada y convergencia en discontinuidades",
        content: `$$\\mathbf{f_b(x) = \\frac{1}{\\pi} \\int_0^b \\frac{2\\pi(\\sin(2\\alpha) - \\sin\\alpha)}{\\alpha} \\cos(\\alpha x)\\,d\\alpha = 2 \\int_0^b \\frac{\\sin(2\\alpha) - \\sin\\alpha}{\\alpha} \\cos(\\alpha x)\\,d\\alpha}$$
En los cuatro puntos de salto $x = \\pm 1$ y $x = \\pm 2$:
Por Dirichlet:
$$\\lim_{b \\to \\infty} f_b(\\pm 1) = \\frac{0 + \\pi}{2} = \\frac{\\pi}{2} \\approx 1.5708$$
$$\\lim_{b \\to \\infty} f_b(\\pm 2) = \\frac{\\pi + 0}{2} = \\frac{\\pi}{2} \\approx 1.5708$$`
      }
    ],

    pythonCode: `import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import quad

def f_original(x):
    ax = np.abs(x)
    return np.where((ax > 1.0) & (ax < 2.0), np.pi, 0.0)

def f_b(x_val, b):
    def integrand(alpha):
        if alpha == 0:
            return 1.0 * np.cos(0)
        return ((np.sin(2.0*alpha) - np.sin(alpha)) / alpha) * np.cos(alpha * x_val)
    res, _ = quad(integrand, 0, b, limit=200)
    return 2.0 * res

x_vec = np.linspace(-4, 4, 400)
plt.figure(figsize=(10, 5), dpi=150)
plt.plot(x_vec, f_original(x_vec), 'k--', label='f(x) Original (Ventanas par = pi)', linewidth=2)

for b_cut in [5, 20, 50]:
    y_approx = [f_b(x, b_cut) for x in x_vec]
    plt.plot(x_vec, y_approx, label=f'Corte b = {b_cut} rad/u')

plt.scatter([-2, -1, 1, 2], [np.pi/2]*4, color='red', zorder=5, label='Dirichlet (y = pi/2)')
plt.title('Taller 6 - Ejercicio 2 (Cosenos): Pulso Par Simétrico')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.grid(True, alpha=0.3)
plt.legend()
plt.show()`
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExercisesData;
}
