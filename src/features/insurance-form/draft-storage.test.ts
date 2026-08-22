// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import {
  clearInsuranceFormDraft,
  insuranceFormDraftStorageKey,
  loadInsuranceFormDraft,
  saveInsuranceFormDraft,
} from "./draft-storage";
import type { InsuranceData, InsuranceFormValues } from "./types";

const insuranceData: InsuranceData = {
  basicInsurance: [
    {
      id: "basis",
      name: "Basis",
      price: 145.45,
      description: "Basisdekking",
    },
  ],
  additionalInsurance: [
    {
      id: "dental",
      name: "Tandarts",
      price: 12.5,
      description: "Tandartsdekking",
    },
  ],
};

const values: InsuranceFormValues = {
  personal: {
    firstName: "Robin",
    lastName: "Jansen",
    birthDate: "1990-01-01",
    email: "robin@example.com",
    address: "Dorpsstraat 1",
  },
  basicInsuranceId: "basis",
  additionalInsuranceIds: ["dental"],
};

afterEach(clearInsuranceFormDraft);

describe("insurance form draft storage", () => {
  it("removes unavailable insurance IDs and restores a reachable step", () => {
    saveInsuranceFormDraft(
      {
        ...values,
        basicInsuranceId: "retired-plan",
        additionalInsuranceIds: ["dental", "retired-addon"],
      },
      "additional",
    );

    const draft = loadInsuranceFormDraft(insuranceData);

    expect(draft?.currentStepId).toBe("basic");
    expect(draft?.values.basicInsuranceId).toBe("");
    expect(draft?.values.additionalInsuranceIds).toEqual(["dental"]);
  });

  it("ignores malformed stored data", () => {
    sessionStorage.setItem(insuranceFormDraftStorageKey, "not-json");

    expect(loadInsuranceFormDraft(insuranceData)).toBeNull();
    expect(sessionStorage.getItem(insuranceFormDraftStorageKey)).toBeNull();
  });
});
