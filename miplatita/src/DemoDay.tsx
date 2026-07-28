import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';

const LIVE_URL = 'https://vercel.com/mi-platita/mi-platita';
const TOTAL = 6;

type SlideProps = { id: string };

function SlideShell({
  id,
  children,
  className = '',
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-roledescription="slide"
      className={`h-full w-full max-w-6xl mx-auto flex flex-col justify-center px-5 sm:px-8 md:px-12 py-8 md:py-10 ${className}`}
    >
      {children}
    </section>
  );
}

function Slide1(_props: SlideProps) {
  return (
    <SlideShell id="slide-1">
      <p className="font-label-caps text-fog mb-4 md:mb-6">Demo Day</p>
      <h1 className="font-display text-forest-ink text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.15] tracking-tight">
        MiPlatita:{' '}
        <span className="text-forest-ink">Registra gastos mensuales en segundos</span>
      </h1>
      <p className="mt-6 md:mt-8 font-body-lg text-fog text-lg sm:text-xl md:text-2xl leading-[1.5] max-w-3xl">
        Para personas organizadas con sus finanzas
      </p>
      <p className="mt-8 md:mt-10 font-body-lg text-forest-ink text-base sm:text-lg md:text-xl leading-[1.5] break-all">
        Disponible en:{' '}
        <a
          href={LIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-lime-volt decoration-4 underline-offset-4 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-lime-volt rounded-sm"
        >
          {LIVE_URL}
        </a>
      </p>
    </SlideShell>
  );
}

function Slide2(_props: SlideProps) {
  return (
    <SlideShell id="slide-2">
      <p className="font-label-caps text-fog mb-3 md:mb-4">0:00 – 0:30</p>
      <h2 className="font-display text-forest-ink text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-6 md:mb-10">
        El problema
      </h2>
      <ul className="space-y-4 md:space-y-5 list-none">
        {[
          'Hoy usas Excel con una pestaña por mes',
          'Tedioso, requiere conocimiento de la herramienta',
          'No hay vista rápida del % pagado sin abrir el archivo',
          'Necesitas: registrar en 20 segundos y ver progreso al instante',
        ].map((item) => (
          <li
            key={item}
            className="flex gap-3 md:gap-4 font-body-lg text-forest-ink text-lg sm:text-xl md:text-2xl leading-[1.5]"
          >
            <span
              className="mt-2.5 shrink-0 w-2.5 h-2.5 rounded-full bg-lime-volt border-2 border-forest-ink"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </SlideShell>
  );
}

function FlowCard({
  title,
  fields,
  outcome,
}: {
  title: string;
  fields: string[];
  outcome: string;
}) {
  return (
    <article className="bg-white border border-surface-container-high rounded-[24px] md:rounded-[28px] p-4 sm:p-5 md:p-6 flex flex-col gap-3 min-w-0">
      <h3 className="font-section-title text-forest-ink text-xl sm:text-2xl leading-[1.3]">
        {title}
      </h3>
      <ul className="space-y-2 list-none">
        {fields.map((f) => (
          <li
            key={f}
            className="font-body-lg text-fog text-base sm:text-lg leading-[1.5] border border-surface-container rounded-full px-4 py-2 bg-surface-container-low"
          >
            {f}
          </li>
        ))}
      </ul>
      <p className="font-body-lg text-forest-ink text-base sm:text-lg leading-[1.5] mt-1">
        <span className="font-semibold">Logro:</span> {outcome}
      </p>
    </article>
  );
}

function Slide3(_props: SlideProps) {
  return (
    <SlideShell id="slide-3">
      <p className="font-label-caps text-fog mb-3 md:mb-4">0:30 – 2:30</p>
      <h2 className="font-display text-forest-ink text-[2rem] sm:text-4xl md:text-5xl font-extrabold leading-[1.15] mb-4 md:mb-6">
        Ver en vivo
      </h2>
      <a
        href={LIVE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 self-start min-h-14 px-6 sm:px-8 py-3 rounded-full bg-lime-volt text-forest-ink border-[3px] border-forest-ink font-display font-bold text-lg sm:text-xl md:text-2xl focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-forest-ink"
      >
        Abrir MiPlatita
        <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" aria-hidden />
      </a>
      <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <FlowCard
          title='Pantalla 1 — "Registrar gasto"'
          fields={[
            'Nombre del gasto',
            'Moneda ARS',
            'Monto',
            'Estado: pagado / sin pagar',
          ]}
          outcome="gasto guardado (registro en ~20 s)"
        />
        <FlowCard
          title='Pantalla 2 — "Confirmación en tabla"'
          fields={[
            'El gasto aparece en la tabla del dashboard',
            'Registro visible al instante',
          ]}
          outcome="verifica que funciona"
        />
      </div>
      <p className="mt-5 md:mt-6 font-body-lg text-fog text-base sm:text-lg leading-[1.5]">
        Pantalla no mostrada: Análisis (en progreso, fuera de alcance).
      </p>
    </SlideShell>
  );
}

function Slide4(_props: SlideProps) {
  return (
    <SlideShell id="slide-4">
      <p className="font-label-caps text-fog mb-3 md:mb-4">2:30 – 4:30</p>
      <h2 className="font-display text-forest-ink text-[2rem] sm:text-4xl md:text-5xl font-extrabold leading-[1.15] mb-6 md:mb-10">
        Decisiones: Delegación
      </h2>
      <dl className="space-y-5 md:space-y-6">
        {[
          {
            dt: 'Decidí yo',
            dd: 'Features del MVP, criterio visual, mi voz',
          },
          {
            dt: 'La IA asistió',
            dd: 'Ideación de componentes, propuestas de estructura, bench de features',
          },
          {
            dt: 'Modo de delegación',
            dd: 'Agencia (complemento)',
          },
          {
            dt: 'Por qué lo retuve',
            dd: 'Validar usabilidad y funcionamiento',
          },
        ].map(({ dt, dd }) => (
          <div key={dt} className="border-l-4 border-lime-volt pl-4 md:pl-5">
            <dt className="font-section-title text-forest-ink text-xl sm:text-2xl leading-[1.3]">
              {dt}
            </dt>
            <dd className="mt-1 font-body-lg text-fog text-lg sm:text-xl md:text-2xl leading-[1.5]">
              {dd}
            </dd>
          </div>
        ))}
      </dl>
    </SlideShell>
  );
}

function Slide5(_props: SlideProps) {
  return (
    <SlideShell id="slide-5">
      <p className="font-label-caps text-fog mb-3 md:mb-4">2:30 – 4:30</p>
      <h2 className="font-display text-forest-ink text-[2rem] sm:text-4xl md:text-5xl font-extrabold leading-[1.15] mb-6 md:mb-8">
        Transparencia y verificación
      </h2>
      <div className="space-y-5 md:space-y-6">
        <div>
          <h3 className="font-section-title text-forest-ink text-xl sm:text-2xl leading-[1.3] mb-2">
            Herramientas
          </h3>
          <ul className="space-y-2 list-none">
            {[
              'Stitch — explorar diseños',
              'IA Studio — generar pantallas y flujos',
              'Cursor — mejorar flujos y código',
              'Vercel — deploy',
            ].map((t) => (
              <li
                key={t}
                className="font-body-lg text-forest-ink text-lg sm:text-xl md:text-2xl leading-[1.5]"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-section-title text-forest-ink text-xl sm:text-2xl leading-[1.3] mb-2">
            Verifiqué
          </h3>
          <p className="font-body-lg text-fog text-lg sm:text-xl md:text-2xl leading-[1.5]">
            Flujos en desktop y mobile; la acción principal funciona.
          </p>
        </div>
        <div>
          <h3 className="font-section-title text-forest-ink text-xl sm:text-2xl leading-[1.3] mb-2">
            Hallazgo
          </h3>
          <p className="font-body-lg text-fog text-lg sm:text-xl md:text-2xl leading-[1.5]">
            Error 404 detectado y arreglado con Cursor.
          </p>
        </div>
        <div>
          <h3 className="font-section-title text-forest-ink text-xl sm:text-2xl leading-[1.3] mb-2">
            No alcancé
          </h3>
          <p className="font-body-lg text-fog text-lg sm:text-xl md:text-2xl leading-[1.5]">
            Pruebas con usuarios reales.
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

function Slide6(_props: SlideProps) {
  return (
    <SlideShell id="slide-6">
      <p className="font-label-caps text-fog mb-3 md:mb-4">4:30 – 5:00</p>
      <h2 className="font-display text-forest-ink text-[2rem] sm:text-4xl md:text-5xl font-extrabold leading-[1.15] mb-6 md:mb-10">
        Cierre: Postmortem
      </h2>
      <dl className="space-y-5 md:space-y-6">
        {[
          {
            dt: 'Pensaba que lo difícil',
            dd: 'Layout mobile y accesibilidad',
          },
          {
            dt: 'Realmente fue',
            dd: 'Tener en cuenta todos los flujos que genera la IA',
          },
          {
            dt: 'Si reiniciara',
            dd: 'Indicaciones más concretas desde el inicio',
          },
          {
            dt: 'Aprendizaje #1',
            dd: 'No plantear límites rígidos: dejar que la IA explore sin miedo a inventar',
          },
        ].map(({ dt, dd }) => (
          <div key={dt}>
            <dt className="font-section-title text-forest-ink text-xl sm:text-2xl leading-[1.3]">
              {dt}
            </dt>
            <dd className="mt-1 font-body-lg text-fog text-lg sm:text-xl md:text-2xl leading-[1.5]">
              {dd}
            </dd>
          </div>
        ))}
      </dl>
    </SlideShell>
  );
}

const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6] as const;

export default function DemoDay() {
  const [index, setIndex] = useState(0);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(TOTAL - 1, i + 1));
  }, []);

  const reset = useCallback(() => {
    setIndex(0);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        reset();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev, reset]);

  const Slide = SLIDES[index];
  const atStart = index === 0;
  const atEnd = index === TOTAL - 1;

  return (
    <div className="min-h-dvh bg-surface text-forest-ink flex flex-col">
      <a
        href="#demo-day-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-lime-volt focus:text-forest-ink focus:px-4 focus:py-2 focus:rounded-full focus:outline focus:outline-4 focus:outline-forest-ink font-bold"
      >
        Saltar al contenido
      </a>

      <header className="shrink-0 border-b border-surface-container-high bg-white px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <p className="font-display font-bold text-forest-ink text-lg sm:text-xl truncate">
          MiPlatita · Demo Day
        </p>
        <p
          className="font-label-caps text-forest-ink bg-lime-volt border-2 border-forest-ink rounded-full px-3 py-1 tabular-nums shrink-0"
          aria-live="polite"
          aria-atomic="true"
        >
          {index + 1}/{TOTAL}
        </p>
      </header>

      <main
        id="demo-day-main"
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
        aria-live="polite"
      >
        <Slide id={`slide-${index + 1}`} />
      </main>

      <nav
        className="shrink-0 border-t border-surface-container-high bg-white px-4 sm:px-6 py-3 flex items-center justify-between gap-3"
        aria-label="Navegación de diapositivas"
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={atStart}
          className="min-h-12 min-w-12 px-4 rounded-full border-2 border-forest-ink bg-white text-forest-ink font-bold text-base sm:text-lg disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-lime-volt"
          aria-label="Diapositiva anterior"
        >
          ←
        </button>
        <p className="font-body-lg text-fog text-sm sm:text-base text-center leading-[1.5] px-2">
          ← → navegar · Enter reinicia
        </p>
        <button
          type="button"
          onClick={goNext}
          disabled={atEnd}
          className="min-h-12 min-w-12 px-4 rounded-full border-2 border-forest-ink bg-forest-ink text-white font-bold text-base sm:text-lg disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-lime-volt"
          aria-label="Diapositiva siguiente"
        >
          →
        </button>
      </nav>
    </div>
  );
}
