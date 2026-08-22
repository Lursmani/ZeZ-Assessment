// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InsuranceForm } from "./InsuranceForm";
import {
  clearInsuranceFormDraft,
  saveInsuranceFormDraft,
} from "./draft-storage";
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
  cleanup();
  clearInsuranceFormDraft();
  Object.assign(formDefaultValues, structuredClone(originalValues));
  vi.useRealTimers();
});

describe("InsuranceForm navigation", () => {
  it("autosaves changes and restores them after a remount", () => {
    vi.useFakeTimers();
    const firstRender = render(
      <InsuranceForm insuranceData={insuranceData} onSubmit={vi.fn()} />,
    );
    const firstNameInput = screen.getByRole("textbox", { name: /Voornaam/ });

    fireEvent.change(firstNameInput, { target: { value: "Robin" } });
    act(() => vi.advanceTimersByTime(250));
    firstRender.unmount();

    render(<InsuranceForm insuranceData={insuranceData} onSubmit={vi.fn()} />);

    expect(
      (screen.getByRole("textbox", { name: /Voornaam/ }) as HTMLInputElement)
        .value,
    ).toBe("Robin");
  });

  it("restores saved values and the active step", () => {
    saveInsuranceFormDraft(
      {
        personal: {
          firstName: "Robin",
          lastName: "Jansen",
          birthDate: "1990-01-01",
          email: "robin@example.com",
          address: "Dorpsstraat 1",
        },
        basicInsuranceId: "basis",
        additionalInsuranceIds: [],
      },
      "basic",
    );

    render(<InsuranceForm insuranceData={insuranceData} onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Basisverzekering" }),
    ).toBeTruthy();
    expect(screen.getByText("Basisdekking")).toBeTruthy();
  });

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

  it("focuses each new step and keeps an unselected radio group in Tab order", async () => {
    Object.assign(formDefaultValues.personal, {
      firstName: "Robin",
      lastName: "Jansen",
      birthDate: "1990-01-01",
      email: "robin@example.com",
      address: "Dorpsstraat 1",
    });

    const user = userEvent.setup();

    render(<InsuranceForm insuranceData={insuranceData} onSubmit={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Volgende" }));

    const heading = await screen.findByRole("heading", {
      name: "Basisverzekering",
    });
    const firstRadio = screen.getByRole("radio", { name: /Basis/ });

    expect(document.activeElement).toBe(heading);
    expect((firstRadio as HTMLInputElement).tabIndex).toBe(0);

    await user.tab();

    expect(document.activeElement).toBe(firstRadio);
  });
});
