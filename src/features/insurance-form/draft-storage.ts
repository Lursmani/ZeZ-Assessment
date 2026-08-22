import { z } from "zod";
import type {
  InsuranceData,
  InsuranceFormStepId,
  InsuranceFormValues,
} from "./types";
import { insuranceFormSchema } from "./validation";

export const insuranceFormDraftStorageKey =
  "zez:insurance-application:draft:v1";

const draftValuesSchema = z.object({
  personal: z.object({
    firstName: z.string(),
    lastName: z.string(),
    birthDate: z.string(),
    email: z.string(),
    address: z.string(),
  }),
  basicInsuranceId: z.string(),
  additionalInsuranceIds: z.array(z.string()),
});

const insuranceFormDraftSchema = z.object({
  version: z.literal(1),
  savedAt: z.string(),
  currentStepId: z.enum(["personal", "basic", "additional"]),
  values: draftValuesSchema,
});

export type InsuranceFormDraft = z.infer<typeof insuranceFormDraftSchema>;

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function removeStoredDraft(storage: Storage) {
  try {
    storage.removeItem(insuranceFormDraftStorageKey);
  } catch {
    // Storage is optional; the form must keep working if it is unavailable.
  }
}

function normalizeDraft(
  draft: InsuranceFormDraft,
  insuranceData: InsuranceData,
): InsuranceFormDraft {
  const basicInsuranceIds = new Set(
    insuranceData.basicInsurance.map((insurance) => insurance.id),
  );
  const additionalInsuranceIds = new Set(
    insuranceData.additionalInsurance.map((insurance) => insurance.id),
  );
  const basicInsuranceId = basicInsuranceIds.has(draft.values.basicInsuranceId)
    ? draft.values.basicInsuranceId
    : "";
  const selectedAdditionalInsuranceIds = [
    ...new Set(
      draft.values.additionalInsuranceIds.filter((insuranceId) =>
        additionalInsuranceIds.has(insuranceId),
      ),
    ),
  ];
  const values: InsuranceFormValues = {
    ...draft.values,
    basicInsuranceId,
    additionalInsuranceIds: selectedAdditionalInsuranceIds,
  };

  let currentStepId = draft.currentStepId;
  const isPersonalStepValid = insuranceFormSchema.shape.personal.safeParse(
    values.personal,
  ).success;

  if (currentStepId !== "personal" && !isPersonalStepValid) {
    currentStepId = "personal";
  } else if (currentStepId === "additional" && !basicInsuranceId) {
    currentStepId = "basic";
  }

  return {
    ...draft,
    currentStepId,
    values,
  };
}

export function loadInsuranceFormDraft(
  insuranceData: InsuranceData,
): InsuranceFormDraft | null {
  const storage = getSessionStorage();

  if (!storage) {
    return null;
  }

  try {
    const storedDraft = storage.getItem(insuranceFormDraftStorageKey);

    if (!storedDraft) {
      return null;
    }

    const result = insuranceFormDraftSchema.safeParse(JSON.parse(storedDraft));

    if (!result.success) {
      removeStoredDraft(storage);
      return null;
    }

    return normalizeDraft(result.data, insuranceData);
  } catch {
    removeStoredDraft(storage);
    return null;
  }
}

export function saveInsuranceFormDraft(
  values: InsuranceFormValues,
  currentStepId: InsuranceFormStepId,
): void {
  const storage = getSessionStorage();

  if (!storage) {
    return;
  }

  const draft: InsuranceFormDraft = {
    version: 1,
    savedAt: new Date().toISOString(),
    currentStepId,
    values,
  };

  try {
    storage.setItem(insuranceFormDraftStorageKey, JSON.stringify(draft));
  } catch {
    // Storage is optional; the form must keep working if it is unavailable.
  }
}

export function clearInsuranceFormDraft(): void {
  const storage = getSessionStorage();

  if (storage) {
    removeStoredDraft(storage);
  }
}
