import type { ComponentType } from "react";
import type { FieldPath } from "react-hook-form";
import { AdditionalInsuranceStep } from "./steps/AdditionalInsuranceStep";
import { BasicInsuranceStep } from "./steps/BasicInsuranceStep";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import type { InsuranceData, InsuranceFormValues } from "./types";

export type FormStep = {
  id: string;
  label: string;
  fields: FieldPath<InsuranceFormValues>[];
  component: ComponentType<{ insuranceData: InsuranceData }>;
};

export const formSteps: FormStep[] = [
  {
    id: "personal",
    label: "Persoonlijke gegevens",
    component: PersonalInfoStep,
    fields: [
      "personal.firstName",
      "personal.lastName",
      "personal.birthDate",
      "personal.email",
      "personal.address",
    ],
  },
  {
    id: "basic",
    label: "Basisverzekering",
    component: BasicInsuranceStep,
    fields: ["basicInsuranceId"],
  },
  {
    id: "additional",
    label: "Aanvullende verzekering",
    component: AdditionalInsuranceStep,
    fields: ["additionalInsuranceIds"],
  },
];

export const formDefaultValues: InsuranceFormValues = {
  personal: {
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    address: "",
  },
  basicInsuranceId: "",
  additionalInsuranceIds: [],
};
