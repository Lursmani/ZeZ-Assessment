// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SubmissionSuccess } from "./SubmissionSuccess";

describe("SubmissionSuccess", () => {
  it("focuses the confirmation and can start a new application", async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();

    render(<SubmissionSuccess onRestart={onRestart} />);

    const heading = screen.getByRole("heading", {
      name: "Aanvraag verzonden",
    });
    expect(document.activeElement).toBe(heading);

    await user.click(screen.getByRole("button", { name: "Nieuwe aanvraag" }));
    expect(onRestart).toHaveBeenCalledOnce();
  });
});
