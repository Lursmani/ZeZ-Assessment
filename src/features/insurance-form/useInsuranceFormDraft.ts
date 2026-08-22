import { useCallback, useEffect } from "react";
import { useWatch } from "react-hook-form";
import type { Control, UseFormGetValues } from "react-hook-form";
import {
  clearInsuranceFormDraft,
  saveInsuranceFormDraft,
} from "./draft-storage";
import type { InsuranceFormStepId, InsuranceFormValues } from "./types";

const saveDelayMilliseconds = 250;

type UseInsuranceFormDraftOptions = {
  control: Control<InsuranceFormValues>;
  currentStepId: InsuranceFormStepId;
  getValues: UseFormGetValues<InsuranceFormValues>;
};

function hasMeaningfulProgress(values: InsuranceFormValues) {
  return (
    Object.values(values.personal).some((value) => value.trim().length > 0) ||
    values.basicInsuranceId.length > 0 ||
    values.additionalInsuranceIds.length > 0
  );
}

export function useInsuranceFormDraft({
  control,
  currentStepId,
  getValues,
}: UseInsuranceFormDraftOptions) {
  const watchedValues = useWatch({ control });
  const persistDraft = useCallback(() => {
    const values = getValues();

    if (hasMeaningfulProgress(values)) {
      saveInsuranceFormDraft(values, currentStepId);
    } else {
      clearInsuranceFormDraft();
    }
  }, [currentStepId, getValues]);

  useEffect(() => {
    const timeout = window.setTimeout(persistDraft, saveDelayMilliseconds);

    return () => window.clearTimeout(timeout);
  }, [persistDraft, watchedValues]);

  useEffect(() => {
    window.addEventListener("pagehide", persistDraft);

    return () => window.removeEventListener("pagehide", persistDraft);
  }, [persistDraft]);
}
