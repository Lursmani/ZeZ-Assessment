// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./features/insurance-form/useInsuranceData", () => ({
  useInsuranceData: () => ({
    data: {
      basicInsurance: [
        {
          id: "basis",
          name: "Basis",
          price: 145.45,
          description: "Basisdekking",
        },
      ],
      additionalInsurance: [],
    },
    error: undefined,
    isLoading: false,
    mutate: vi.fn(),
  }),
}));

afterEach(cleanup);

describe("insurance form validation", () => {
  it("validates every field in the active step when continuing", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("textbox", { name: /Adres.*verplicht/ }));
    await user.click(screen.getByRole("button", { name: "Volgende" }));

    expect(await screen.findByText("Voornaam is verplicht.")).toBeTruthy();
    expect(screen.getByText("Achternaam is verplicht.")).toBeTruthy();
    expect(screen.getByText("Geboortedatum is verplicht.")).toBeTruthy();
    expect(screen.getByText("E-mailadres is verplicht.")).toBeTruthy();
    expect(screen.getByText("Adres is verplicht.")).toBeTruthy();
  });

  it("revalidates invalid fields when autofill changes their values", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Volgende" }));
    expect(await screen.findByText("Voornaam is verplicht.")).toBeTruthy();

    fireEvent.change(screen.getByRole("textbox", { name: /Voornaam/ }), {
      target: { value: "Robin" },
    });

    await waitFor(() => {
      expect(screen.queryByText("Voornaam is verplicht.")).toBeNull();
    });
  });
});
