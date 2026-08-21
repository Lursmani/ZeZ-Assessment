import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { get, useFormContext } from 'react-hook-form'
import type {
  FieldError,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form'

type TextInputFieldProps<TFieldValues extends FieldValues> = Omit<
  ComponentPropsWithoutRef<'input'>,
  'id' | 'name' | 'required'
> & {
  id?: string
  name: FieldPath<TFieldValues>
  label: string
  description?: string
  required?: boolean
  validationMode?: FieldValidationMode
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>
}

export type FieldValidationMode = 'onBlur' | 'onChange'

export function TextInputField<TFieldValues extends FieldValues>({
  id,
  name,
  label,
  description,
  required = false,
  validationMode = 'onBlur',
  rules,
  className = '',
  onBlur: onInputBlur,
  onChange: onInputChange,
  ...inputProps
}: TextInputFieldProps<TFieldValues>) {
  const generatedId = useId()
  const inputId = id ?? `text-input-${generatedId}`
  const descriptionId = `${inputId}-description`
  const errorId = `${inputId}-error`
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext<TFieldValues>()

  const fieldError = get(errors, name) as FieldError | undefined
  const errorMessage =
    typeof fieldError?.message === 'string'
      ? fieldError.message
      : 'Controleer dit veld.'
  const describedBy = [
    description ? descriptionId : undefined,
    fieldError ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(' ')
  const validationRules = {
    ...rules,
    ...(required && rules?.required === undefined
      ? { required: `${label} is verplicht.` }
      : {}),
  } as RegisterOptions<TFieldValues, FieldPath<TFieldValues>>
  const registration = register(name, validationRules)

  const handleBlur: NonNullable<ComponentPropsWithoutRef<'input'>['onBlur']> =
    async (event) => {
      await registration.onBlur(event)
      onInputBlur?.(event)

      if (validationMode === 'onBlur') {
        await trigger(name)
      }
    }

  const handleChange: NonNullable<
    ComponentPropsWithoutRef<'input'>['onChange']
  > = async (event) => {
    await registration.onChange(event)
    onInputChange?.(event)

    if (validationMode === 'onChange') {
      await trigger(name)
    }
  }

  return (
    <div className="w-full">
      <label
        className="mb-1.5 block text-sm font-semibold text-foreground"
        htmlFor={inputId}
      >
        {label}
        {required && (
          <>
            <span className="text-danger" aria-hidden="true">
              {' '}
              *
            </span>
            <span className="sr-only"> (verplicht)</span>
          </>
        )}
      </label>

      {description && (
        <p
          id={descriptionId}
          className="mb-2 text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}

      <input
        {...inputProps}
        {...registration}
        id={inputId}
        className={`block w-full rounded-control border bg-surface px-3.5 py-2.5 text-base text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground ${
          fieldError
            ? 'border-danger focus:border-danger focus:ring-4 focus:ring-danger/10'
            : 'border-border hover:border-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary-soft'
        } ${className}`}
        aria-invalid={fieldError ? true : undefined}
        aria-describedby={describedBy || undefined}
        required={required}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      {fieldError && (
        <p
          id={errorId}
          className="mt-1.5 text-sm font-medium text-danger"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </div>
  )
}
