import {
  CheckboxButton,
  CheckboxField,
  CheckboxGroup,
  Label,
  Text,
} from "react-aria-components";
import { useController, useFormContext, useWatch } from "react-hook-form";
import type { InsuranceData, InsuranceFormValues } from "../types";

const priceFormatter = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

type AdditionalInsuranceStepProps = {
  insuranceData: InsuranceData;
};

export function AdditionalInsuranceStep({
  insuranceData,
}: AdditionalInsuranceStepProps) {
  const { control } = useFormContext<InsuranceFormValues>();
  const { field } = useController({
    name: "additionalInsuranceIds",
    control,
  });
  const basicInsuranceId = useWatch({
    name: "basicInsuranceId",
    control,
  });

  const basicInsurance = insuranceData.basicInsurance.find(
    (insurance) => insurance.id === basicInsuranceId,
  );
  const selectedAdditionalInsurance = insuranceData.additionalInsurance.filter(
    (insurance) => field.value.includes(insurance.id),
  );
  const additionalPrice = selectedAdditionalInsurance.reduce(
    (total, insurance) => total + insurance.price,
    0,
  );
  const totalPrice = (basicInsurance?.price ?? 0) + additionalPrice;

  return (
    <div className="grid gap-6">
      <CheckboxGroup
        name={field.name}
        value={field.value}
        onBlur={field.onBlur}
        onChange={field.onChange}
        className="min-w-0"
      >
        <Label className="text-sm font-semibold text-foreground">
          Kies je aanvullende verzekeringen
          <span className="ml-1 font-normal text-muted-foreground">
            (optioneel)
          </span>
        </Label>

        <Text
          slot="description"
          className="mt-1 block text-sm text-muted-foreground"
        >
          Je kunt meerdere opties selecteren.
        </Text>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {insuranceData.additionalInsurance.map((insurance) => (
            <CheckboxField
              key={insurance.id}
              value={insurance.id}
              className="relative"
            >
              <CheckboxButton
                className={({ isFocusVisible, isHovered, isSelected }) =>
                  [
                    "flex min-h-40 cursor-pointer flex-col rounded-card border p-4 outline-none transition",
                    isSelected
                      ? "border-primary bg-primary-soft shadow-sm"
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
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-control border ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-control-border bg-surface"
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && (
                          <svg
                            className="size-3.5"
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
                        )}
                      </span>
                    </span>

                    <span className="mt-2 text-sm leading-5 text-muted-foreground">
                      {insurance.description}
                    </span>

                    <span className="mt-auto pt-4">
                      <span className="text-lg font-bold text-foreground">
                        + {priceFormatter.format(insurance.price)}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        per maand
                      </span>
                    </span>
                  </>
                )}
              </CheckboxButton>
            </CheckboxField>
          ))}
        </div>
      </CheckboxGroup>

      <section
        className="rounded-card border border-border bg-surface-muted px-5 py-4"
        aria-labelledby="premium-summary-heading"
      >
        <h3
          id="premium-summary-heading"
          className="text-sm font-semibold text-foreground"
        >
          Maandelijkse premie
        </h3>

        <dl className="mt-3 grid gap-2 text-sm">
          {basicInsurance && (
            <div className="flex items-start justify-between gap-4">
              <dt className="text-muted-foreground">
                Basisverzekering: {basicInsurance.name}
              </dt>
              <dd className="shrink-0 font-medium text-foreground">
                {priceFormatter.format(basicInsurance.price)}
              </dd>
            </div>
          )}

          <div className="flex items-start justify-between gap-4">
            <dt className="text-muted-foreground">
              Aanvullende verzekeringen
              <span className="ml-1 text-xs">
                ({selectedAdditionalInsurance.length} gekozen)
              </span>
            </dt>
            <dd className="shrink-0 font-medium text-foreground">
              + {priceFormatter.format(additionalPrice)}
            </dd>
          </div>

          <div className="mt-1 flex items-end justify-between gap-4 border-t border-border pt-3">
            <dt className="font-semibold text-foreground">Totaal per maand</dt>
            <dd>
              <output
                className="text-xl font-bold text-primary"
                aria-live="polite"
                aria-atomic="true"
              >
                {priceFormatter.format(totalPrice)}
              </output>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
