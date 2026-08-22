import { DatePickerField } from "../../../components/form/DatePickerField";
import { TextInputField } from "../../../components/form/TextInputField";
import type { InsuranceFormValues } from "../types";
import { birthDateBounds } from "../validation";

export function PersonalInfoStep() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextInputField<InsuranceFormValues>
        name="personal.firstName"
        label="Voornaam"
        autoComplete="given-name"
        validateOn="blur"
        isRequired
      />

      <TextInputField<InsuranceFormValues>
        name="personal.lastName"
        label="Achternaam"
        autoComplete="family-name"
        validateOn="blur"
        isRequired
      />

      <DatePickerField<InsuranceFormValues>
        name="personal.birthDate"
        label="Geboortedatum"
        minDate={birthDateBounds.minimum}
        maxDate={birthDateBounds.maximum}
        validateOn="blur"
        isRequired
      />

      <div>
        <TextInputField<InsuranceFormValues>
          name="personal.email"
          label="E-mailadres"
          type="email"
          inputMode="email"
          autoComplete="email"
          validateOn="blur"
          isRequired
        />
      </div>

      <div className="sm:col-span-2">
        <TextInputField<InsuranceFormValues>
          name="personal.address"
          label="Adres"
          autoComplete="street-address"
          validateOn="blur"
          isRequired
        />
      </div>
    </div>
  );
}
