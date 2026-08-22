import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import insuranceData from "../insuranceData.json";
import { InsuranceForm } from "./features/insurance-form/InsuranceForm";
import { SubmissionSuccess } from "./features/insurance-form/SubmissionSuccess";
import {
  createInsuranceApplicationPayload,
  submitInsuranceApplication,
} from "./features/insurance-form/submission";
import type { InsuranceFormValues } from "./features/insurance-form/types";
import type { InsuranceData } from "./features/insurance-form/useInsuranceData";

type SubmissionState = "idle" | "success" | "error";

function App() {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");

  const handleFormSubmit: SubmitHandler<InsuranceFormValues> = async (
    values,
  ) => {
    setSubmissionState("idle");

    try {
      const payload = createInsuranceApplicationPayload(
        values,
        insuranceData as InsuranceData,
      );

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

            <InsuranceForm onSubmit={handleFormSubmit} />
          </>
        )}
      </div>
    </main>
  );
}

export default App;
