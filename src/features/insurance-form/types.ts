export type PersonalInfo = {
  firstName: string
  lastName: string
  birthDate: string
  email: string
  address: string
}

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

export type InsuranceFormValues = {
  personal: PersonalInfo
  basicInsuranceId: string
  additionalInsuranceIds: string[]
}
