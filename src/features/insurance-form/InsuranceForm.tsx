import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { formDefaultValues, formSteps } from './form-config'
import type { InsuranceFormValues } from './types'
import { insuranceFormSchema } from './validation'

type InsuranceFormProps = {
  onSubmit: SubmitHandler<InsuranceFormValues>
}

export function InsuranceForm({ onSubmit }: InsuranceFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const form = useForm<InsuranceFormValues>({
    resolver: zodResolver(insuranceFormSchema, undefined, { mode: 'sync' }),
    defaultValues: formDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: false,
  })

  const activeStep = formSteps[currentStep]
  const ActiveStep = activeStep.component
  const isLastStep = currentStep === formSteps.length - 1

  const goBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0))
  }

  const goForward = async () => {
    const isStepValid = await form.trigger(activeStep.fields, {
      shouldFocus: true,
    })

    if (isStepValid) {
      setCurrentStep((step) => Math.min(step + 1, formSteps.length - 1))
    }
  }

  return (
    <FormProvider {...form}>
      <form
        className="overflow-hidden rounded-card border border-border bg-surface shadow-card"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <nav
          className="border-b border-border px-4 py-6 sm:px-8"
          aria-label="Voortgang aanvraag"
        >
          <p className="sr-only" aria-live="polite">
            Stap {currentStep + 1} van {formSteps.length}: {activeStep.label}
          </p>

          <ol className="grid grid-cols-3">
            {formSteps.map((step, index) => {
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <li
                  key={step.id}
                  className="relative flex flex-col items-center gap-2 text-center"
                  aria-current={isActive ? 'step' : undefined}
                >
                  {index < formSteps.length - 1 && (
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
                    {isCompleted ? (
                      <svg
                        className="size-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="m3.5 8 3 3 6-6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
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

          <div className="mt-6">
            <ActiveStep />
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-border bg-surface-muted px-6 py-4 sm:px-10">
          <button
            type="button"
            className="rounded-control px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-40"
            onClick={goBack}
            onPointerDown={(event) => event.preventDefault()}
            disabled={currentStep === 0}
          >
            Vorige
          </button>

          <button
            type={isLastStep ? 'submit' : 'button'}
            className="rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-40"
            onClick={isLastStep ? undefined : goForward}
            onPointerDown={(event) => event.preventDefault()}
            disabled={form.formState.isSubmitting}
          >
            {isLastStep ? 'Versturen' : 'Volgende'}
          </button>
        </footer>
      </form>
    </FormProvider>
  )
}
