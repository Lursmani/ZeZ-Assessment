import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { InsuranceForm } from "./features/insurance-form/InsuranceForm";
import { SubmissionSuccess } from "./features/insurance-form/SubmissionSuccess";
import {
  createInsuranceApplicationPayload,
  submitInsuranceApplication,
} from "./features/insurance-form/submission";
import type { InsuranceFormValues } from "./features/insurance-form/types";
import { useInsuranceData } from "./features/insurance-form/useInsuranceData";

type SubmissionState = "idle" | "success" | "error";

function App() {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const { data: insuranceData, error, isLoading, mutate } = useInsuranceData();

  const handleFormSubmit: SubmitHandler<InsuranceFormValues> = async (
    values,
  ) => {
    setSubmissionState("idle");

    if (!insuranceData) {
      setSubmissionState("error");
      return;
    }

    try {
      const payload = createInsuranceApplicationPayload(values, insuranceData);

      await submitInsuranceApplication(payload);
      setSubmissionState("success");
    } catch {
      setSubmissionState("error");
    }
  };

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

        {submissionState === "success" ? (
          <SubmissionSuccess onRestart={() => setSubmissionState("idle")} />
        ) : isLoading ? (
          <div
            className="rounded-card border border-border bg-surface px-5 py-10 text-center text-sm text-muted-foreground shadow-card"
            role="status"
          >
            Verzekeringen laden…
          </div>
        ) : error || !insuranceData ? (
          <div
            className="rounded-card border border-danger/30 bg-surface px-5 py-8 text-center shadow-card"
            role="alert"
          >
            <p className="text-sm font-medium text-danger">
              De verzekeringen konden niet worden geladen.
            </p>
            <button
              type="button"
              className="mt-4 rounded-control border border-danger/30 bg-surface px-3 py-2 text-sm font-semibold text-danger outline-none transition hover:bg-danger/5 focus-visible:ring-2 focus-visible:ring-focus"
              onClick={() => void mutate()}
            >
              Opnieuw proberen
            </button>
          </div>
        ) : (
          <>
            {submissionState === "error" && (
              <div
                className="mb-5 rounded-card border border-danger/30 bg-danger/5 px-5 py-4 text-sm font-medium text-danger"
                role="alert"
              >
                Je aanvraag kon niet worden verzonden. Probeer het opnieuw.
              </div>
            )}

            <InsuranceForm
              insuranceData={insuranceData}
              onSubmit={handleFormSubmit}
            />
          </>
        )}
      </div>
    </main>
  );
}

export default App;
