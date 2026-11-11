# Matemáticas Especiales — Corte 3: Series e Integrales de Fourier
### Universidad ECCI — Departamento de Ciencias Básicas

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Sitio%20en%20Vivo-blue?style=for-the-badge&logo=github)](https://danny-palma.github.io/matematicas-especiales-fourier/)
[![Open In Colab](https://img.shields.io/badge/Google%20Colab-Abrir%20Notebook-orange?style=for-the-badge&logo=googlecolab)](https://colab.research.google.com/github/danny-palma/matematicas-especiales-fourier/blob/main/notebooks/Matematicas_Especiales_Fourier_ECCI.ipynb)
[![Licencia](https://img.shields.io/badge/Universidad-ECCI%20Bogot%C3%A1-123062?style=for-the-badge)](https://www.ecci.edu.co/)

---

## 📌 Acceso Rápido
- 🌐 **Sitio Web Interactivo (GitHub Pages):** [https://danny-palma.github.io/matematicas-especiales-fourier/](https://danny-palma.github.io/matematicas-especiales-fourier/)
- 📓 **Jupyter Notebook Oficial:** [`notebooks/Matematicas_Especiales_Fourier_ECCI.ipynb`](notebooks/Matematicas_Especiales_Fourier_ECCI.ipynb)
- 📑 **Informe para PDF:** Accesible directamente desde la plataforma web mediante el botón **"Imprimir / Guardar PDF"** con maquetación académica optimizada.

---

## 📚 Descripción del Proyecto
Plataforma computacional e interactiva desarrollada para la sustentación y entrega del **Corte 3 de Matemáticas Especiales** en la **Universidad ECCI**. Contiene la resolución rigurosa, paso a paso y letra por letra, de los 10 ejercicios obligatorios de la guía técnica, integrando:
1. **Memoria Analítica Detallada:** Deducción completa de coeficientes ($a_0, a_n, b_n, c_n, A(\alpha), B(\alpha)$), análisis de simetría (par, impar o sin simetría), límites laterales en discontinuidades y expresiones canónicas finales.
2. **Visualización Interactiva con Plotly.js:** Gráficas en tiempo real que superponen la señal original junto a las aproximaciones para $N = 5, 10, 20$ armónicos y cortes de frecuencia $b = 5, 20, 50$ rad/u, además de controles deslizantes dinámicos para explorar armónicos personalizados.
3. **Análisis del Teorema de Dirichlet y Fenómeno de Gibbs:** Verificación visual y cuantitativa de la convergencia al punto medio en los saltos y documentación del sobreimpulso del $\approx 8.95\%$.
4. **Reporte Computacional:** Código Python documentado y reproducible con `numpy`, `matplotlib` y `scipy.integrate`.

---

## 📋 Ejercicios Resueltos

### Parte I: Taller 5 (Series de Fourier)
| Sección | Ejercicio | Función $f(x)$ | Dominio / Intervalo | Tipo y Simetría | Coeficientes Clave |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Series Clásicas** | **Ejercicio 1** | Pulso rectangular ($0$ si $x<0$, $1$ si $x \ge 0$) | $(-\pi, \pi)$ | Sin simetría | $a_0 = 1, \; a_n = 0, \; b_n = \frac{1 - (-1)^n}{n\pi}$ |
| **1. Series Clásicas** | **Ejercicio 4** | Rampa lineal: $f(x) = x + \pi$ | $(-\pi, \pi)$ | Sin simetría | $a_0 = 2\pi, \; a_n = 0, \; b_n = \frac{2(-1)^{n+1}}{n}$ |
| **2. Senos y Cosenos** | **Ejercicio 2** | Parábola: $f(x) = x^2$ | $(-1, 1)$ | Par $\implies$ Cosenos | $a_0 = 2/3, \; a_n = \frac{4(-1)^n}{n^2\pi^2}, \; b_n = 0$ |
| **2. Senos y Cosenos** | **Ejercicio 4** | Cúbica: $f(x) = x^3$ | $(-\pi, \pi)$ | Impar $\implies$ Senos | $a_0 = a_n = 0, \; b_n = 2(-1)^{n+1}\left(\frac{\pi^2}{n} - \frac{6}{n^3}\right)$ |
| **3. Series Complejas** | **Ejercicio 1** | Onda cuadrada ($\pm 1$) | $(-2, 2)$ | Impar (Imaginaria pura) | $c_0 = 0, \; c_n = -\frac{2i}{n\pi} \quad (n \text{ impar})$ |
| **3. Series Complejas** | **Ejercicio 6** | Exponencial: $f(x) = e^{-\|x\|}$ | $(-1, 1)$ | Par (Real pura) | $c_0 = 1 - e^{-1}, \; c_n = \frac{1 - e^{-1}(-1)^n}{1 + n^2\pi^2}$ |

---

### Parte II: Taller 6 (Integrales de Fourier)
| Sección | Ejercicio | Función $f(x)$ | Clasificación Integral | Coeficientes Espectrales |
| :--- | :--- | :--- | :--- | :--- |
| **1. Integral General** | **Ejercicio 2** | $f(x) = 4$ en $(\pi, 2\pi)$, $0$ en otro caso | Integral general | $A(\alpha) = \frac{4(\sin 2\pi\alpha - \sin\pi\alpha)}{\alpha}, \; B(\alpha) = \frac{4(\cos\pi\alpha - \cos 2\pi\alpha)}{\alpha}$ |
| **1. Integral General** | **Ejercicio 5** | $f(x) = e^{-\|x\|}$ en todo $\mathbb{R}$ | Integral Par de Cosenos | $B(\alpha) = 0, \; A(\alpha) = \frac{2}{1 + \alpha^2}$ |
| **2. Senos y Cosenos** | **Ejercicio 1** | Pulso antisimétrico: $-5$ en $(-1,0)$, $5$ en $(0,1)$ | Integral Impar de Senos | $A(\alpha) = 0, \; B(\alpha) = \frac{10(1 - \cos\alpha)}{\alpha}$ |
| **2. Senos y Cosenos** | **Ejercicio 2** | Pulso par: $\pi$ en $1 < \|x\| < 2$ | Integral Par de Cosenos | $B(\alpha) = 0, \; A(\alpha) = \frac{2\pi(\sin 2\alpha - \sin\alpha)}{\alpha}$ |

---

## 🎯 Conceptos Fundamentales para la Sustentación Oral

1. **Teorema de Dirichlet en Discontinuidades:**
   En cada punto de salto finito $x_0$, la serie periódica o integral truncada converge a la semisuma de los límites laterales:
   $$S(x_0) = \frac{f(x_0^+) + f(x_0^-)}{2}$$
2. **Fenómeno de Gibbs (Wilbraham-Gibbs):**
   En proximidades de un salto de discontinuidad $\Delta f$, las sumas parciales sobrepasan el valor de la función en un porcentaje constante del $\approx 8.95\%$. Incrementar el número de armónicos ($N \to \infty$) no disminuye la altura del sobreimpulso, sino que lo aproxima más al punto de salto.
3. **Velocidad de Convergencia:**
   - Funciones con discontinuidades de salto: los coeficientes decaen a razón de $\mathcal{O}(1/n)$ (convergencia lenta).
   - Funciones continuas con derivadas seccionales (e.g. $x^2, e^{-\|x\|}$): los coeficientes decaen a razón de $\mathcal{O}(1/n^2)$ (convergencia rápida).
4. **Atenuación del Rizado Espectral en Integrales de Fourier:**
   Al ampliar la frecuencia de corte superior $b$ ($5 \to 20 \to 50$ rad/u), el espectro capturado aumenta y el rizado residual en las regiones suaves decae proporcionalmente a $1/b$.

---

## 💻 Ejecución Local

Para clonar y abrir localmente la plataforma web interactiva:
```bash
git clone https://github.com/danny-palma/matematicas-especiales-fourier.git
cd matematicas-especiales-fourier
```
Basta con abrir `index.html` en cualquier navegador web moderno (no requiere Node.js ni servidor backend).

Para ejecutar el notebook con Jupyter:
```bash
jupyter notebook notebooks/Matematicas_Especiales_Fourier_ECCI.ipynb
```

---

## 👨‍🎓 Información Académica
- **Estudiante / Autor:** Danny Palma
- **Institución:** Universidad ECCI — Bogotá D.C., Colombia
- **Materia:** Matemáticas Especiales (Corte 3)
- **Área Curricular:** Matemáticas — Departamento de Ciencias Básicas
