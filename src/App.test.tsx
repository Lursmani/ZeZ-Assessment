// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('insurance form validation', () => {
  it('validates every field in the active step when continuing', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      screen.getByRole('textbox', { name: /Adres.*verplicht/ }),
    )
    await user.click(screen.getByRole('button', { name: 'Volgende' }))

    expect(await screen.findByText('Voornaam is verplicht.')).toBeTruthy()
    expect(screen.getByText('Achternaam is verplicht.')).toBeTruthy()
    expect(screen.getByText('Geboortedatum is verplicht.')).toBeTruthy()
    expect(screen.getByText('E-mailadres is verplicht.')).toBeTruthy()
    expect(screen.getByText('Adres is verplicht.')).toBeTruthy()
  })
})
