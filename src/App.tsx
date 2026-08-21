import { useState } from 'react'

const steps = [
  { id: 'personal', label: 'Persoonlijke gegevens' },
  { id: 'basic', label: 'Basisverzekering' },
  { id: 'additional', label: 'Aanvullende verzekering' },
] as const

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const activeStep = steps[currentStep]

  const goBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0))
  }

  const goForward = () => {
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1))
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-3xl">
        <header className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Zorgverzekering
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Verzekering aanvragen
          </h1>
        </header>

        <form
          className="overflow-hidden rounded-card border border-border bg-surface shadow-card"
          onSubmit={(event) => event.preventDefault()}
        >
          <nav
            className="border-b border-border px-4 py-6 sm:px-8"
            aria-label="Voortgang aanvraag"
          >
            <p className="sr-only" aria-live="polite">
              Stap {currentStep + 1} van {steps.length}: {activeStep.label}
            </p>

            <ol className="grid grid-cols-3">
              {steps.map((step, index) => {
                const isActive = index === currentStep
                const isCompleted = index < currentStep

                return (
                  <li
                    key={step.id}
                    className="relative flex flex-col items-center gap-2 text-center"
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {index < steps.length - 1 && (
                      <span
                        className={`absolute left-[calc(50%+1rem)] top-4 h-0.5 w-[calc(100%-2rem)] ${
                          isCompleted ? 'bg-primary' : 'bg-border'
                        }`}
                        aria-hidden="true"
                      />
                    )}

                    <span
                      className={`relative z-10 flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                        isActive || isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-surface-muted text-muted-foreground'
                      }`}
                      aria-hidden="true"
                    >
                      {isCompleted ? '✓' : index + 1}
                    </span>

                    <span
                      className={`max-w-28 text-xs font-medium sm:max-w-none sm:text-sm ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </span>
                  </li>
                )
              })}
            </ol>
          </nav>

          <section
            className="min-h-72 px-6 py-8 sm:px-10"
            aria-labelledby={`${activeStep.id}-heading`}
          >
            <h2
              id={`${activeStep.id}-heading`}
              className="text-xl font-semibold text-foreground"
            >
              {activeStep.label}
            </h2>
          </section>

          <footer className="flex items-center justify-between border-t border-border bg-surface-muted px-6 py-4 sm:px-10">
            <button
              type="button"
              className="rounded-control px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-40"
              onClick={goBack}
              disabled={currentStep === 0}
            >
              Vorige
            </button>

            <button
              type="button"
              className="rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-40"
              onClick={goForward}
              disabled={currentStep === steps.length - 1}
            >
              Volgende
            </button>
          </footer>
        </form>
      </div>
    </main>
  )
}

export default App
