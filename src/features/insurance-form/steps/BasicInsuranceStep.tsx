import { useEffect, useRef } from 'react'
import {
  FieldError,
  Label,
  RadioButton,
  RadioField,
  RadioGroup,
  Text,
} from 'react-aria-components'
import { useController, useFormContext } from 'react-hook-form'
import type { InsuranceFormValues } from '../types'
import { useInsuranceData } from '../useInsuranceData'

const priceFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
})

export function BasicInsuranceStep() {
  const { control, trigger } = useFormContext<InsuranceFormValues>()
  const { data, error, isLoading, mutate } = useInsuranceData()
  const {
    field: { ref: focusTargetRef, ...field },
    fieldState,
  } = useController({
    name: 'basicInsuranceId',
    control,
  })
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    focusTargetRef(firstInputRef.current)
  }, [data, focusTargetRef])

  if (isLoading) {
    return (
      <div
        className="rounded-card border border-border bg-surface-muted px-5 py-8 text-center text-sm text-muted-foreground"
        role="status"
      >
        Basisverzekeringen laden…
      </div>
    )
  }

  if (error || !data?.basicInsurance.length) {
    return (
      <div
        className="rounded-card border border-danger/30 bg-danger/5 px-5 py-5"
        role="alert"
      >
        <p className="text-sm font-medium text-danger">
          De basisverzekeringen konden niet worden geladen.
        </p>
        <button
          type="button"
          className="mt-3 rounded-control border border-danger/30 bg-surface px-3 py-2 text-sm font-semibold text-danger outline-none transition hover:bg-danger/5 focus-visible:ring-2 focus-visible:ring-focus"
          onClick={() => void mutate()}
        >
          Opnieuw proberen
        </button>
      </div>
    )
  }

  const selectedInsurance = data.basicInsurance.find(
    (insurance) => insurance.id === field.value,
  )

  const selectInsurance = (insuranceId: string) => {
    field.onChange(insuranceId)
    void trigger('basicInsuranceId')
  }

  return (
    <RadioGroup
      name={field.name}
      value={field.value}
      isRequired
      isInvalid={fieldState.invalid}
      validationBehavior="aria"
      onBlur={field.onBlur}
      onChange={selectInsurance}
      className="min-w-0"
    >
      <Label className="text-sm font-semibold text-foreground">
        Kies één basisverzekering
        <span className="text-danger" aria-hidden="true">
          {' '}
          *
        </span>
        <span className="sr-only"> (verplicht)</span>
      </Label>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {data.basicInsurance.map((insurance, index) => {
          return (
            <RadioField
              key={insurance.id}
              inputRef={index === 0 ? firstInputRef : undefined}
              value={insurance.id}
              className="relative"
            >
              <RadioButton
                className={({
                  isFocusVisible,
                  isHovered,
                  isInvalid,
                  isSelected,
                }) =>
                  [
                    'flex min-h-28 cursor-pointer flex-col justify-between rounded-card border p-4 outline-none transition',
                    isSelected
                      ? 'border-primary bg-primary-soft shadow-sm'
                      : isInvalid
                        ? 'border-danger/50 bg-surface'
                        : isHovered
                          ? 'border-primary/60 bg-surface shadow-sm'
                          : 'border-border bg-surface',
                    isFocusVisible
                      ? 'ring-2 ring-focus ring-offset-2 ring-offset-surface'
                      : '',
                  ].join(' ')
                }
              >
                {({ isSelected }) => (
                  <>
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-foreground">
                        {insurance.name}
                      </span>
                      <span
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground/50 bg-surface'
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && (
                          <span className="size-2 rounded-full bg-primary-foreground" />
                        )}
                      </span>
                    </span>

                    <span>
                      <span className="text-lg font-bold text-foreground">
                        {priceFormatter.format(insurance.price)}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        per maand
                      </span>
                    </span>
                  </>
                )}
              </RadioButton>
            </RadioField>
          )
        })}
      </div>

      <div className="mt-4 min-h-32 sm:min-h-24">
        {selectedInsurance ? (
          <Text
            slot="description"
            elementType="div"
            className="min-h-32 rounded-card border border-border bg-surface-muted px-5 py-4 sm:min-h-24"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="text-sm font-semibold text-foreground">
              {selectedInsurance.name}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {selectedInsurance.description}
            </p>
          </Text>
        ) : (
          <Text
            slot="description"
            className="block px-5 py-4 text-sm text-muted-foreground"
          >
            Selecteer een verzekering voor meer informatie
          </Text>
        )}
      </div>

      {fieldState.invalid && (
        <FieldError className="mt-2 text-sm font-medium text-danger">
          {fieldState.error?.message ?? 'Controleer dit veld.'}
        </FieldError>
      )}
    </RadioGroup>
  )
}
