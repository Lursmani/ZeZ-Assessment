import { useEffect, useRef } from "react";
import {
  FieldError,
  Label,
  RadioButton,
  RadioField,
  RadioGroup,
  Text,
} from "react-aria-components";
import { useController, useFormContext } from "react-hook-form";
import type { InsuranceData, InsuranceFormValues } from "../types";

const priceFormatter = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

type BasicInsuranceStepProps = {
  insuranceData: InsuranceData;
};

export function BasicInsuranceStep({ insuranceData }: BasicInsuranceStepProps) {
  const { control, trigger } = useFormContext<InsuranceFormValues>();
  const {
    field: { ref: focusTargetRef, ...field },
    fieldState,
  } = useController({
    name: "basicInsuranceId",
    control,
  });
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    focusTargetRef(firstInputRef.current);
  }, [focusTargetRef]);

  const selectedInsurance = insuranceData.basicInsurance.find(
    (insurance) => insurance.id === field.value,
  );

  const selectInsurance = (insuranceId: string) => {
    field.onChange(insuranceId);
    void trigger("basicInsuranceId");
  };

  return (
    <RadioGroup
      name={field.name}
      value={field.value || null}
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
          {" "}
          *
        </span>
        <span className="sr-only"> (verplicht)</span>
      </Label>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {insuranceData.basicInsurance.map((insurance, index) => {
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
                    "flex min-h-28 cursor-pointer flex-col justify-between rounded-card border p-4 outline-none transition",
                    isSelected
                      ? "border-primary bg-primary-soft shadow-sm"
                      : isInvalid
                        ? "border-danger bg-surface"
                        : isHovered
                          ? "border-primary bg-surface shadow-sm"
                          : "border-control-border bg-surface",
                    isFocusVisible
                      ? "ring-2 ring-focus ring-offset-2 ring-offset-surface"
                      : "",
                  ].join(" ")
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
                            ? "border-primary bg-primary"
                            : "border-control-border bg-surface"
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
          );
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
          {fieldState.error?.message ?? "Controleer dit veld."}
        </FieldError>
      )}
    </RadioGroup>
  );
}
