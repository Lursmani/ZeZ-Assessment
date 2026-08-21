import { useController, useFormContext } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import type { FieldValidationMode, StringFieldPath } from './field-types'

type UseFormFieldControllerOptions<TFieldValues extends FieldValues> = {
  name: StringFieldPath<TFieldValues>
  validateOn: FieldValidationMode
}

export function useFormFieldController<TFieldValues extends FieldValues>({
  name,
  validateOn,
}: UseFormFieldControllerOptions<TFieldValues>) {
  const { control, trigger } = useFormContext<TFieldValues>()
  const {
    field: {
      name: fieldName,
      value: fieldValue,
      onBlur: markFieldTouched,
      onChange: updateFieldValue,
      ref: focusTargetRef,
    },
    fieldState,
  } = useController<TFieldValues>({ name, control })
  const errorMessage =
    typeof fieldState.error?.message === 'string'
      ? fieldState.error.message
      : 'Controleer dit veld.'

  const handleBlur = () => {
    markFieldTouched()

    if (validateOn === 'blur') {
      void trigger(name)
    }
  }

  const setValue = (value: string) => {
    updateFieldValue(value)

    if (validateOn === 'change') {
      void trigger(name)
    }
  }

  return {
    errorMessage,
    fieldName,
    fieldValue,
    focusTargetRef,
    handleBlur,
    isInvalid: fieldState.invalid,
    setValue,
  }
}
