import { useEffect, useRef } from "react";

type SubmissionSuccessProps = {
  onRestart: () => void;
};

export function SubmissionSuccess({ onRestart }: SubmissionSuccessProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section
      className="rounded-card border border-border bg-surface px-6 py-12 text-center shadow-card sm:px-10"
      aria-labelledby="submission-success-heading"
    >
      <span
        className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/10 text-success"
        aria-hidden="true"
      >
        <svg
          className="size-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="m5 12 4 4L19 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <h2
        ref={headingRef}
        id="submission-success-heading"
        className="mt-5 text-2xl font-bold tracking-tight text-foreground outline-none"
        tabIndex={-1}
      >
        Aanvraag verzonden
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        Bedankt voor je aanvraag. We hebben je gegevens goed ontvangen en nemen
        zo snel mogelijk contact met je op.
      </p>

      <button
        type="button"
        className="mt-7 rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        onClick={onRestart}
      >
        Nieuwe aanvraag
      </button>
    </section>
  );
}
