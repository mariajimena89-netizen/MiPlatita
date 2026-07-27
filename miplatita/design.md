# Guía de Diseño y Decisiones de Interfaz — MiPlatita

Este documento reúne todas las definiciones estéticas, tokens de diseño, tipografía, paleta de colores y decisiones de layout aplicadas en **MiPlatita** para garantizar consistencia visual y de experiencia de usuario de alto impacto.

---

## 1. Paleta de Colores Exclusiva (Alto Contraste)

En línea con las últimas especificaciones, la paleta cromática se ha reducido a los siguientes colores estrictos, eliminando cualquier tonalidad secundaria ruidosa:

| Token / Nombre | Valor Hex | Propósito en la Interfaz |
| :--- | :--- | :--- |
| **Lime Volt** (Verde Principal) | `#87ea5c` | Tarjeta principal de progreso, acentos de interacción (botones móviles, bordes de enfoque). |
| **Forest Ink** (Contraste Oscuro) | `#083400` | Textos principales, fondo del header/footer móvil, botones de acción primarios. |
| **Gris Fog / Texto Secundario** | `#58717a` | Descripciones secundarias, placeholders, etiquetas de metadatos desactivadas. |
| **Gris Contenedor / Bordes** | `#eeeeee` (y `#f3f3f4`) | Fondos de inputs, tarjetas inactivas, líneas de separación y estados neutros. |

---

## 2. Tipografía y Escala Visual

Se importaron fuentes de Google Fonts optimizadas para dotar de dinamismo y personalidad al producto:

*   **Display (Sora):** Utilizada para titulares masivos, números de porcentaje de alto impacto y marcas principales. Genera una estética moderna y contundente.
*   **Sans (Inter):** La fuente primaria para lectura de textos largos, tablas, campos de formulario y botones. Garantiza legibilidad absoluta a cualquier densidad de pantalla.

### Escalas Aplicadas
*   `font-display-hero`: Tamaños extragrandes (`120px` en desktop, `64px` en mobile) con un interlineado ultra compacto (`line-height: 0.85`) para generar la sensación de cartel publicitario.
*   `font-headline-lg` / `md` / `sm`: Títulos de secciones principales.
*   `font-label-caps`: Para metadatos en mayúsculas, espaciado expandido (`letter-spacing: 0.05em`) y peso semibold.

---

## 3. Estructura y Layout (Mobile-First y Adaptativo)

El diseño del tablero principal se divide en secciones bien definidas para equilibrar jerarquía de información y facilidad de lectura en pantallas grandes y móviles por igual.

### Primera Parte: Sección Superior (Dashboard Hero)
*   **Desktop:** Grid dividido de forma exacta al 50%.
    *   **Lado Izquierdo (Hero Metric Card):** Tarjeta en verde brillante (`#87ea5c`) con esquinas supercurvadas (`48px`), el gran indicador de progreso del presupuesto en tipografía masiva, y barra plana de progreso. El botón CTA ("Registrar Gasto") se oculta en desktop en esta tarjeta para evitar redundancia con el botón del encabezado.
    *   **Lado Derecho (Estadísticas Rápidas):** Cuatro tarjetas estadísticas (Gasto Total, Pagado, Pendiente, Disponible) acomodadas en un orden limpio de **2x2** sin textos de encabezados adicionales redundantes para agilizar el peso de la pantalla.
*   **Mobile:** Estructura vertical apilada y fluida. La tarjeta verde conserva la visibilidad del botón CTA ("Registrar Gasto") para un acceso rápido y directo a nivel táctil.

### Segunda Parte: Registro de Gastos (Full-Width)
*   **Layout:** Ocupa el **100% del ancho máximo de pantalla** para asegurar que la tabla de transacciones de gastos se lea de forma natural y espaciosa sin saltos de línea innecesarios.
*   **Mobile Heuristics:** El buscador, filtro de estados rápidos y dropdown de categorías se rediseñaron con un enfoque mobile-first:
    *   Controles táctiles de alto tamaño con un mínimo de `44px` de altura física.
    *   Disposición en bloque estirable en dispositivos pequeños e integración limpia en una sola línea fluida en pantallas medianas y grandes.
*   **Tags de Categoría:** En la tabla de gastos, todos los badges de categoría fueron estandarizados a un fondo gris suave (`bg-surface-container`) con borde neutro y texto secundario (`text-fog`), evitando colores distractores para concentrar la atención en el estado de pago (Verde para Pagados, Rojo para Pendientes).

### Tercera Parte: Dashboard — Análisis por Rubro (Tarjetas de Altura Fija)
*   **Layout:** Posicionado directamente debajo de la sección de "Registro de Gastos" en el Dashboard. Se organiza en un sistema responsivo de tarjetas independientes (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`).
*   **Diseño Interactivo:** Cada tarjeta tiene una altura mínima de `176px` y un efecto hover suave (`y: -4`) para mayor dinamismo. Presenta:
    *   Un icono representativo en círculo gris que se enciende en verde brillante (`#87ea5c`) al pasar el cursor.
    *   Etiqueta de porcentaje de alto contraste, título del rubro, cantidad de gastos registrados y monto acumulado en tipografía Sora de gran peso.
    *   Una barra plana minimalista en la parte inferior para ilustrar el progreso de consumo.
    *   Tarjeta interactiva animada tipo formulario para agregar nuevos rubros al instante.

### Cuarta Parte: Menú de Análisis — Análisis de Gastos (Layout Asimétrico Ultra Clean)
*   **Layout:** Exclusivo de la sección de navegación "Análisis" para evitar repetir la misma información del Dashboard. Se organiza en un sistema de dos columnas asimétricas (`grid-cols-1 lg:grid-cols-12`) en pantallas grandes y se apila de forma fluida en móvil.
*   **Foco en Métricas (Columna de Ranking - `lg:col-span-7`):** Un leaderboard de consumo que lista de forma ordenada los rubros de **mayor a menor gasto**. Cada renglón está simplificado al máximo con:
    *   Un círculo numérico indicador de posición en el ranking (el primer lugar resalta con fondo verde brillante `#87ea5c`).
    *   Iconos minimalistas de rubro, nombre y cantidad de transacciones.
    *   Importe alineado a la derecha junto a su porcentaje correspondiente.
    *   Una barra micro-métrica de alta precisión que ilustra la proporción consumida de manera limpia utilizando el color verde brillante (`#87ea5c`) para el líder y gris para los demás rubros.
*   **Centro de Insights y Acción (Columna de Destacados - `lg:col-span-5`):** Diseñado para evitar la saturación visual mediante widgets específicos:
    *   **Rubro Líder (Mayor Impacto):** Una tarjeta destacada que proyecta en tipografía de gran escala Sora el importe del rubro con mayor gasto y su porcentaje de contribución, facilitando una rápida asimilación.
    *   **Promedio Mensual:** Un widget secundario de perfil bajo que expone el promedio invertido por categoría.
    *   **Añadir Nuevo Rubro:** Un formulario simplificado e integrado directamente en la columna de acción, que se activa sin interrumpir el flujo visual de la grilla.

---

## 4. Componentes Móviles Especiales

*   **Menú de Navegación Flotante Inferior:** Una barra de navegación con esquinas superiores redondeadas adherida a la base en pantallas móviles con iconos minimalistas de `lucide-react`.
*   **Mobile Action Button:** Un botón de registro de gastos en forma de círculo flotante en el centro de la barra inferior con fondo verde brillante (`#87ea5c`) y bordes oscuros súper definidos para fácil acceso con el pulgar.

---

## 5. Overhaul del Modal de Registro (UI Ultra Clean)

El modal de ingreso de transacciones fue completamente reestructurado visualmente para alejarse del estilo brutalista de bordes toscos e integrarse de manera fluida y minimalista con el dashboard:

*   **Esquinas Redondeadas Suaves:** Se aplicó una curvatura de `rounded-[32px]` sin bordes negros pesados, utilizando únicamente un sutil contorno neutro (`border-surface-container-high`) para dar una sensación ligera y flotante.
*   **Encabezado Minimalista:** El header pasó de un fondo de color sólido pesado con línea inferior gruesa a un lienzo blanco puro con una etiqueta compacta e hiper-legible en verde brillante (`bg-lime-volt text-forest-ink`) y tipografía de pantalla Sora. El botón de cerrar se rediseñó como un círculo gris sutil y flotante de transición suave.
*   **Inputs y Dropdowns Estilizados:** Todos los campos de texto, numéricos y selectores desplegables adoptaron el mismo patrón táctil redondeado (`rounded-full`) y un color de fondo neutro suave (`bg-surface-container-low`), con un indicador de flecha integrado por CSS SVG para el selector de rubros.
*   **Selector de Estados Integrado:** Los botones de "Pagado" y "Pendiente" dentro del formulario se unificaron en una barra integrada de fondo gris sutil con chips interactivos redondeados que resaltan en color sólido al ser seleccionados.
*   **Banner de Información:** Se integró un contenedor de información de bajo perfil visual en lugar de alertas llamativas, manteniendo la paleta estricta de grises y Forest Ink.

