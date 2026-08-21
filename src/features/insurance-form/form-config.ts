import type { FieldPath } from 'react-hook-form'
import type { InsuranceFormValues } from './types'

export type FormStep = {
  id: string
  label: string
  fields: FieldPath<InsuranceFormValues>[]
}

export const formSteps: FormStep[] = [
  {
    id: 'personal',
    label: 'Persoonlijke gegevens',
    fields: [
      'personal.firstName',
      'personal.lastName',
      'personal.email',
      'personal.address',
    ],
  },
  {
    id: 'basic',
    label: 'Basisverzekering',
    fields: ['basicInsuranceId'],
  },
  {
    id: 'additional',
    label: 'Aanvullende verzekering',
    fields: ['additionalInsuranceIds'],
  },
]

export const formDefaultValues: InsuranceFormValues = {
  personal: {
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    address: '',
  },
  basicInsuranceId: '',
  additionalInsuranceIds: [],
}
