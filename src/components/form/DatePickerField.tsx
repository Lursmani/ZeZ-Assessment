import { parseDate } from "@internationalized/date";
import { useCallback } from "react";
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
} from "react-aria-components";
import type { FieldValues } from "react-hook-form";
import type { BaseFormFieldProps } from "./field-types";
import { useFormFieldController } from "./useFormFieldController";

function isValidIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  return (
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day)
  );
}

function toCalendarDate(value: unknown) {
  if (typeof value !== "string" || !isValidIsoDate(value)) {
    return null;
  }

  return parseDate(value);
}

export type DatePickerFieldProps<TFieldValues extends FieldValues> =
  BaseFormFieldProps<TFieldValues> & {
    minDate?: string;
    maxDate?: string;
  };

export function DatePickerField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  isRequired = false,
  validateOn = "blur",
  minDate,
  maxDate,
}: DatePickerFieldProps<TFieldValues>) {
  const {
    errorMessage,
    fieldName,
    fieldValue,
    focusTargetRef,
    handleBlur,
    isInvalid,
    setValue,
  } = useFormFieldController<TFieldValues>({ name, validateOn });
  const selectedDate = toCalendarDate(fieldValue);
  const minimumDate = minDate ? parseDate(minDate) : undefined;
  const maximumDate = maxDate ? parseDate(maxDate) : undefined;

  const setDateInputRef = useCallback(
    (element: HTMLDivElement | null) => {
      const firstSegment =
        element?.querySelector<HTMLElement>('[role="spinbutton"]') ?? element;

      focusTargetRef(firstSegment);
    },
    [focusTargetRef],
  );

  const handleChange = (value: typeof selectedDate) => {
    setValue(value?.toString() ?? "");
  };

  return (
    <I18nProvider locale="nl-NL">
      <DatePicker
        name={fieldName}
        value={selectedDate}
        minValue={minimumDate}
        maxValue={maximumDate}
        isRequired={isRequired}
        isInvalid={isInvalid}
        validationBehavior="aria"
        onBlur={handleBlur}
        onChange={handleChange}
        className="w-full"
      >
        <Label className="mb-1.5 block text-sm font-semibold text-foreground">
          {label}
          {isRequired && (
            <>
              <span className="text-danger" aria-hidden="true">
                {" "}
                *
              </span>
              <span className="sr-only"> (verplicht)</span>
            </>
          )}
        </Label>

        <Group
          className={`flex w-full items-center rounded-control border bg-surface text-base text-foreground shadow-sm transition ${
            isInvalid
              ? "border-danger focus-within:border-danger focus-within:ring-4 focus-within:ring-danger/10"
              : "border-control-border hover:border-primary focus-within:border-primary focus-within:ring-4 focus-within:ring-primary-soft"
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

        {description && (
          <Text
            slot="description"
            className="mt-2 block text-sm text-muted-foreground"
          >
            {description}
          </Text>
        )}

        {isInvalid && (
          <FieldError className="mt-1.5 text-sm font-medium text-danger">
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
                          "flex size-9 cursor-default items-center justify-center rounded-control text-sm outline-none transition",
                          isSelected
                            ? "bg-primary font-semibold text-primary-foreground"
                            : "hover:bg-primary-soft hover:text-primary",
                          isToday && !isSelected
                            ? "font-semibold text-primary ring-1 ring-primary"
                            : "",
                          isOutsideMonth ? "text-muted-foreground/50" : "",
                          isDisabled
                            ? "pointer-events-none text-muted-foreground/35"
                            : "",
                          isFocusVisible
                            ? "ring-2 ring-focus ring-offset-2 ring-offset-surface"
                            : "",
                        ].join(" ")
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
  );
}
