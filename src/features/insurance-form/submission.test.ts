import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createInsuranceApplicationPayload,
  submitInsuranceApplication,
} from "./submission";
import type { InsuranceData } from "./types";

const insuranceData: InsuranceData = {
  basicInsurance: [
    {
      id: "standard",
      name: "Standaard",
      price: 159.75,
      description: "Standaarddekking",
    },
  ],
  additionalInsurance: [
    {
      id: "dental",
      name: "Tandarts",
      price: 12.5,
      description: "Tandartsdekking",
    },
    {
      id: "travel",
      name: "Reizen",
      price: 5,
      description: "Reisdekking",
    },
  ],
};

const values = {
  personal: {
    firstName: "Robin",
    lastName: "Jansen",
    birthDate: "1990-01-01",
    email: "robin@example.com",
    address: "Dorpsstraat 1",
  },
  basicInsuranceId: "standard",
  additionalInsuranceIds: ["travel"],
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("insurance application submission", () => {
  it("creates the complete API payload from the selected IDs", () => {
    expect(createInsuranceApplicationPayload(values, insuranceData)).toEqual({
      personal: values.personal,
      basicInsurance: insuranceData.basicInsurance[0],
      additionalInsurance: [insuranceData.additionalInsurance[1]],
    });
  });

  it("posts the application as JSON to the local mock endpoint", async () => {
    const payload = createInsuranceApplicationPayload(values, insuranceData);
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 201 }));

    await submitInsuranceApplication(payload);

    expect(fetchMock).toHaveBeenCalledWith("/api/insurance-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  });

  it("rejects an unsuccessful response", async () => {
    const payload = createInsuranceApplicationPayload(values, insuranceData);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    await expect(submitInsuranceApplication(payload)).rejects.toThrow(
      "De aanvraag kon niet worden verzonden.",
    );
  });
});
