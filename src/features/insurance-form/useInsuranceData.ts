import useSWR from "swr";
import insuranceDataUrl from "../../data/insuranceData.json?url";
import type { InsuranceData } from "./types";

async function fetchInsuranceData(url: string): Promise<InsuranceData> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Verzekeringen konden niet worden geladen.");
  }

  return response.json() as Promise<InsuranceData>;
}

export function useInsuranceData() {
  return useSWR<InsuranceData>(insuranceDataUrl, fetchInsuranceData);
}
