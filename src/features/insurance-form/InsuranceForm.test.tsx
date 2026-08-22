// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InsuranceForm } from "./InsuranceForm";
import { formDefaultValues } from "./form-config";
import type { InsuranceData } from "./types";

const insuranceData: InsuranceData = {
  basicInsurance: [
    {
      id: "basis",
      name: "Basis",
      price: 145.45,
      description: "Basisdekking",
    },
  ],
  additionalInsurance: [],
};

const originalValues = structuredClone(formDefaultValues);

afterEach(() => {
  Object.assign(formDefaultValues, structuredClone(originalValues));
});

describe("InsuranceForm navigation", () => {
  it("does not submit while moving from step two to step three", async () => {
    Object.assign(formDefaultValues.personal, {
      firstName: "Robin",
      lastName: "Jansen",
      birthDate: "1990-01-01",
      email: "robin@example.com",
      address: "Dorpsstraat 1",
    });
    formDefaultValues.basicInsuranceId = "basis";

    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<InsuranceForm insuranceData={insuranceData} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Volgende" }));
    expect(
      await screen.findByRole("heading", { name: "Basisverzekering" }),
    ).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Volgende" }));
    expect(
      await screen.findByRole("heading", {
        name: "Aanvullende verzekering",
      }),
    ).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Versturen" })).toBeTruthy();
  });
});
