import type { z } from 'zod'
import type { insuranceFormSchema } from './validation'

export type InsuranceFormValues = z.infer<typeof insuranceFormSchema>

export type PersonalInfo = InsuranceFormValues['personal']

export type InsuranceOption = {
  id: string
  name: string
  price: number
  description: string
}

export type Plan = InsuranceOption
export type Addon = InsuranceOption

export type InsuranceApplicationPayload = {
  personal: PersonalInfo
  basicInsurance: Plan
  additionalInsurance: Addon[]
}
