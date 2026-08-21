import { parseDate } from '@internationalized/date'
import { useCallback } from 'react'
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  FieldError,
  Group,
  I18nProvider,
  Label,
  Popover,
  Text,
} from 'react-aria-components'
import { useController, useFormContext } from 'react-hook-form'
import type { FieldPath, FieldValues } from 'react-hook-form'
import type { FieldValidationMode } from './TextInputField'

const earliestAllowedDate = '1850-01-01'

function getLocalToday() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function isValidIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    return false
  }

  const [, year, month, day] = match
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))

  return (
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day)
  )
}

function isEmptyOrOnOrAfter(value: unknown, minimum: string) {
  return value === '' || (typeof value === 'string' && value >= minimum)
}

function isEmptyOrOnOrBefore(value: unknown, maximum: string) {
  return value === '' || (typeof value === 'string' && value <= maximum)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

function toCalendarDate(value: unknown) {
  if (typeof value !== 'string' || !isValidIsoDate(value)) {
    return null
  }

  return parseDate(value)
}

type DatePickerFieldProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>
  label: string
  description?: string
  required?: boolean
  validationMode?: FieldValidationMode
  minDate?: string
  maxDate?: string
}

export function DatePickerField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  required = false,
  validationMode = 'onBlur',
  minDate = earliestAllowedDate,
  maxDate = getLocalToday(),
}: DatePickerFieldProps<TFieldValues>) {
  const { control, trigger } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController<TFieldValues>({
    name,
    control,
    rules: {
      required: required ? `${label} is verplicht.` : false,
      validate: {
        validDate: (value) =>
          value === '' ||
          (typeof value === 'string' && isValidIsoDate(value)) ||
          'Vul een geldige datum in.',
        notBeforeMinimum: (value) =>
          isEmptyOrOnOrAfter(value, minDate) ||
          `De datum mag niet voor ${formatDate(minDate)} liggen.`,
        notAfterMaximum: (value) =>
          isEmptyOrOnOrBefore(value, maxDate) ||
          `De datum mag niet na ${formatDate(maxDate)} liggen.`,
      },
    },
  })
  const dateDescription =
    description ??
    `Kies een datum tussen ${formatDate(minDate)} en ${formatDate(maxDate)}.`
  const errorMessage =
    typeof fieldState.error?.message === 'string'
      ? fieldState.error.message
      : 'Controleer dit veld.'
  const selectedDate = toCalendarDate(field.value)
  const minimumDate = parseDate(minDate)
  const maximumDate = parseDate(maxDate)

  const setDateInputRef = useCallback(
    (element: HTMLDivElement | null) => {
      const firstSegment =
        element?.querySelector<HTMLElement>('[role="spinbutton"]') ?? element

      field.ref(firstSegment)
    },
    [field],
  )

  const handleBlur = async () => {
    field.onBlur()

    if (validationMode === 'onBlur') {
      await trigger(name)
    }
  }

  const handleChange = async (value: typeof selectedDate) => {
    field.onChange(value?.toString() ?? '')

    if (validationMode === 'onChange') {
      await trigger(name)
    }
  }

  return (
    <I18nProvider locale="nl-NL">
      <DatePicker
        name={field.name}
        value={selectedDate}
        minValue={minimumDate}
        maxValue={maximumDate}
        isRequired={required}
        isInvalid={fieldState.invalid}
        validationBehavior="aria"
        onBlur={handleBlur}
        onChange={handleChange}
        className="w-full"
      >
        <Label className="mb-1.5 block text-sm font-semibold text-foreground">
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
        </Label>

        <Group
          className={`flex w-full items-center rounded-control border bg-surface text-base text-foreground shadow-sm transition ${
            fieldState.invalid
              ? 'border-danger focus-within:border-danger focus-within:ring-4 focus-within:ring-danger/10'
              : 'border-border hover:border-muted-foreground/60 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary-soft'
          }`}
        >
          <DateInput
            ref={setDateInputRef}
            className="flex min-w-0 flex-1 items-center px-3.5 py-2.5 outline-none"
          >
            {(segment) => (
              <DateSegment
                segment={segment}
                className="rounded px-0.5 outline-none data-[focused]:bg-primary data-[focused]:text-primary-foreground data-[placeholder]:text-muted-foreground"
              />
            )}
          </DateInput>

          <Button
            className="mr-1 flex size-9 shrink-0 items-center justify-center rounded-control text-muted-foreground outline-none transition hover:bg-primary-soft hover:text-primary focus-visible:ring-2 focus-visible:ring-focus"
            aria-label="Kalender openen"
          >
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden="true"
            >
              <path
                d="M7 3v3m10-3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </Group>

        <Text slot="description" className="mt-2 block text-sm text-muted-foreground">
          {dateDescription}
        </Text>

        {fieldState.invalid && (
          <FieldError
            className="mt-1.5 text-sm font-medium text-danger"
          >
            {errorMessage}
          </FieldError>
        )}

        <Popover
          placement="bottom start"
          offset={8}
          className="z-50 w-[min(20rem,calc(100vw-2rem))] rounded-card border border-border bg-surface p-4 text-foreground shadow-card outline-none"
        >
          <Dialog className="outline-none">
            <Calendar firstDayOfWeek="mon" className="w-full">
              <header className="mb-3 flex items-center justify-between gap-2">
                <Button
                  slot="previous"
                  className="flex size-9 items-center justify-center rounded-control text-muted-foreground outline-none transition hover:bg-primary-soft hover:text-primary focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-40"
                  aria-label="Vorige maand"
                >
                  <svg
                    className="size-4"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      d="m10 3-5 5 5 5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>

                <CalendarHeading className="text-sm font-semibold" />

                <Button
                  slot="next"
                  className="flex size-9 items-center justify-center rounded-control text-muted-foreground outline-none transition hover:bg-primary-soft hover:text-primary focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-40"
                  aria-label="Volgende maand"
                >
                  <svg
                    className="size-4"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      d="m6 3 5 5-5 5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </header>

              <CalendarGrid
                weekdayStyle="short"
                className="w-full border-separate border-spacing-1"
              >
                <CalendarGridHeader>
                  {(day) => (
                    <CalendarHeaderCell className="pb-1 text-center text-xs font-medium text-muted-foreground">
                      {day}
                    </CalendarHeaderCell>
                  )}
                </CalendarGridHeader>

                <CalendarGridBody>
                  {(date) => (
                    <CalendarCell
                      date={date}
                      className={({
                        isDisabled,
                        isFocusVisible,
                        isOutsideMonth,
                        isSelected,
                        isToday,
                      }) =>
                        [
                          'flex size-9 cursor-default items-center justify-center rounded-control text-sm outline-none transition',
                          isSelected
                            ? 'bg-primary font-semibold text-primary-foreground'
                            : 'hover:bg-primary-soft hover:text-primary',
                          isToday && !isSelected
                            ? 'font-semibold text-primary ring-1 ring-primary'
                            : '',
                          isOutsideMonth ? 'text-muted-foreground/50' : '',
                          isDisabled
                            ? 'pointer-events-none text-muted-foreground/35'
                            : '',
                          isFocusVisible
                            ? 'ring-2 ring-focus ring-offset-2 ring-offset-surface'
                            : '',
                        ].join(' ')
                      }
                    />
                  )}
                </CalendarGridBody>
              </CalendarGrid>
            </Calendar>
          </Dialog>
        </Popover>
      </DatePicker>
    </I18nProvider>
  )
}
