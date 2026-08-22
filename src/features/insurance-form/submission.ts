import type {
  InsuranceApplicationPayload,
  InsuranceData,
  InsuranceFormValues,
} from "./types";

export const insuranceApplicationEndpoint = "/api/insurance-applications";

export function createInsuranceApplicationPayload(
  values: InsuranceFormValues,
  insuranceData: InsuranceData,
): InsuranceApplicationPayload {
  const basicInsurance = insuranceData.basicInsurance.find(
    (insurance) => insurance.id === values.basicInsuranceId,
  );

  if (!basicInsurance) {
    throw new Error("De gekozen basisverzekering is niet beschikbaar.");
  }

  const additionalInsuranceIds = new Set(values.additionalInsuranceIds);

  return {
    personal: values.personal,
    basicInsurance,
    additionalInsurance: insuranceData.additionalInsurance.filter((insurance) =>
      additionalInsuranceIds.has(insurance.id),
    ),
  };
}

export async function submitInsuranceApplication(
  payload: InsuranceApplicationPayload,
): Promise<void> {
  const response = await fetch(insuranceApplicationEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("De aanvraag kon niet worden verzonden.");
  }
}
