// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InsuranceForm } from "./InsuranceForm";
import {
  clearInsuranceFormDraft,
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
    {
      id: "travel",
      name: "Reizen",
      price: 5,
      description: "Reisdekking",
    },
  ],
};

const completedValues: InsuranceFormValues = {
  personal: {
    firstName: "Robin",
    lastName: "Jansen",
    birthDate: "1990-01-01",
    email: "robin@example.com",
    address: "Dorpsstraat 1",
  },
  basicInsuranceId: "basis",
  additionalInsuranceIds: [],
};

afterEach(() => {
  cleanup();
  clearInsuranceFormDraft();
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
    saveInsuranceFormDraft(completedValues, "basic");

    render(<InsuranceForm insuranceData={insuranceData} onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Basisverzekering" }),
    ).toBeTruthy();
    expect(screen.getByText("Basisdekking")).toBeTruthy();
  });

  it("focuses each new step and keeps an unselected radio group in Tab order", async () => {
    saveInsuranceFormDraft(completedValues, "personal");

    const user = userEvent.setup();

    render(<InsuranceForm insuranceData={insuranceData} onSubmit={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Volgende" }));

    const heading = await screen.findByRole("heading", {
      name: "Basisverzekering",
    });
    const firstRadio = screen.getByRole("radio", { name: /Basis/ });
    const descriptionId = firstRadio.getAttribute("aria-describedby");

    expect(document.activeElement).toBe(heading);
    expect((firstRadio as HTMLInputElement).tabIndex).toBe(0);
    expect(descriptionId).toBeTruthy();
    expect(document.getElementById(descriptionId!)?.textContent).toBe(
      "Basisdekking",
    );

    await user.tab();

    expect(document.activeElement).toBe(firstRadio);
  });

  it("selects add-ons, updates the total, and submits the full payload", async () => {
    saveInsuranceFormDraft(completedValues, "personal");
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<InsuranceForm insuranceData={insuranceData} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Volgende" }));
    await user.click(screen.getByRole("button", { name: "Volgende" }));

    expect(onSubmit).not.toHaveBeenCalled();

    const dentalInsurance = screen.getByRole("checkbox", {
      name: /Tandarts/,
    });
    const travelInsurance = screen.getByRole("checkbox", { name: /Reizen/ });

    await user.click(dentalInsurance);
    await user.click(travelInsurance);

    expect((dentalInsurance as HTMLInputElement).checked).toBe(true);
    expect((travelInsurance as HTMLInputElement).checked).toBe(true);
    expect(screen.getByText(/€\s*162,95/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Versturen" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      personal: completedValues.personal,
      basicInsurance: insuranceData.basicInsurance[0],
      additionalInsurance: insuranceData.additionalInsurance,
    });
  });
});
