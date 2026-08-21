import { z } from 'zod'

function getLocalToday() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const birthDateBounds = {
  minimum: '1850-01-01',
  maximum: getLocalToday(),
} as const

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is verplicht.`)

const isoDateSchema = z.iso.date()

const birthDateSchema = z.string().superRefine((value, context) => {
  if (!value) {
    context.addIssue({
      code: 'custom',
      message: 'Geboortedatum is verplicht.',
    })
    return
  }

  if (!isoDateSchema.safeParse(value).success) {
    context.addIssue({
      code: 'custom',
      message: 'Vul een geldige datum in.',
    })
    return
  }

  if (value < birthDateBounds.minimum) {
    context.addIssue({
      code: 'custom',
      message: 'De geboortedatum mag niet voor 1 januari 1850 liggen.',
    })
  }

  if (value > birthDateBounds.maximum) {
    context.addIssue({
      code: 'custom',
      message: 'De geboortedatum mag niet in de toekomst liggen.',
    })
  }
})

export const insuranceFormSchema = z.object({
  personal: z.object({
    firstName: requiredText('Voornaam'),
    lastName: requiredText('Achternaam'),
    birthDate: birthDateSchema,
    email: requiredText('E-mailadres').pipe(
      z.email('Vul een geldig e-mailadres in.'),
    ),
    address: requiredText('Adres'),
  }),
  basicInsuranceId: z.string(),
  additionalInsuranceIds: z.array(z.string()),
})
