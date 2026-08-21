import { TextInputField } from '../../../components/form/TextInputField'
import type { InsuranceFormValues } from '../types'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function PersonalInfoStep() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextInputField<InsuranceFormValues>
        name="personal.firstName"
        label="Voornaam"
        autoComplete="given-name"
        validationMode="onBlur"
        required
      />

      <TextInputField<InsuranceFormValues>
        name="personal.lastName"
        label="Achternaam"
        autoComplete="family-name"
        validationMode="onBlur"
        required
      />

      <div className="sm:col-span-2">
        <TextInputField<InsuranceFormValues>
          name="personal.email"
          label="E-mailadres"
          type="email"
          inputMode="email"
          autoComplete="email"
          validationMode="onBlur"
          rules={{
            pattern: {
              value: emailPattern,
              message: 'Vul een geldig e-mailadres in.',
            },
          }}
          required
        />
      </div>

      <div className="sm:col-span-2">
        <TextInputField<InsuranceFormValues>
          name="personal.address"
          label="Adres"
          autoComplete="street-address"
          validationMode="onBlur"
          required
        />
      </div>
    </div>
  )
}
