import type { SubmitHandler } from 'react-hook-form'
import { InsuranceForm } from './features/insurance-form/InsuranceForm'
import type { InsuranceFormValues } from './features/insurance-form/types'

function App() {
  const handleFormSubmit: SubmitHandler<InsuranceFormValues> = (values) => {
    console.info('Insurance form submitted', values)
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-3xl">
        <header className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Zorgverzekering
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Verzekering aanvragen
          </h1>
        </header>

        <InsuranceForm onSubmit={handleFormSubmit} />
      </div>
    </main>
  )
}

export default App
