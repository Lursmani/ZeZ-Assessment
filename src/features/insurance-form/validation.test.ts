import { describe, expect, it } from 'vitest'
import { formDefaultValues } from './form-config'
import { birthDateBounds, insuranceFormSchema } from './validation'

function getIssuePaths(result: ReturnType<typeof insuranceFormSchema.safeParse>) {
  return result.success
    ? []
    : result.error.issues.map((issue) => issue.path.join('.'))
}

describe('insuranceFormSchema', () => {
  it('reports every required personal field for an empty form', () => {
    const result = insuranceFormSchema.safeParse(formDefaultValues)

    expect(getIssuePaths(result)).toEqual([
      'personal.firstName',
      'personal.lastName',
      'personal.birthDate',
      'personal.email',
      'personal.address',
    ])
  })

  it('enforces the supported birth date range', () => {
    const beforeMinimum = insuranceFormSchema.safeParse({
      ...formDefaultValues,
      personal: {
        ...formDefaultValues.personal,
        birthDate: '1849-12-31',
      },
    })
    const afterMaximum = insuranceFormSchema.safeParse({
      ...formDefaultValues,
      personal: {
        ...formDefaultValues.personal,
        birthDate: '9999-12-31',
      },
    })

    expect(getIssuePaths(beforeMinimum)).toContain('personal.birthDate')
    expect(getIssuePaths(afterMaximum)).toContain('personal.birthDate')
    expect(birthDateBounds.minimum).toBe('1850-01-01')
  })
})
