import { support } from "@/content/site";
import { Container, SectionHeading } from "./ui";

export function Matching() {
  const [primaryName, secondaryName] = support.matchingSearchNames;
  const steps = [
    <>
      Make your contribution through Overclocked&apos;s official{" "}
      {support.donateUrl ? (
        <a href={support.donateUrl} target="_blank" rel="noopener noreferrer" className="link-underline font-semibold text-blue">
          HCB fund
        </a>
      ) : (
        <span className="font-semibold text-ink">HCB fund</span>
      )}
      .
    </>,
    <>Open your employer&apos;s charitable matching portal.</>,
    <>
      Search for <strong className="font-semibold text-ink">{primaryName}</strong> or{" "}
      <strong className="font-semibold text-ink">{secondaryName}</strong>, depending on your
      employer&apos;s system.
    </>,
    <>Submit the matching request and designate Overclocked when possible.</>,
  ];

  return (
    <section id="matching" aria-labelledby="matching-title" className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <SectionHeading id="matching-title">Employer matching</SectionHeading>
            <p className="mt-6 max-w-[40ch] text-[17px] leading-[1.65] text-muted">
              Many employers match charitable contributions. If yours does, you can request a
              match after you give.
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <ol className="border-t-[1.5px] border-ink">
              {steps.map((step, i) => (
                <li key={i} className="grid grid-cols-[3.25rem_1fr] items-start gap-4 border-b border-rule py-6 sm:grid-cols-[4.5rem_1fr]">
                  <span aria-hidden="true" className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-none tracking-[-0.05em] text-blue tabular">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-[17px] leading-[1.6] text-muted sm:pt-2">{step}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10 grid gap-6 rounded-sheet border border-rule bg-sky p-6 sm:grid-cols-[auto_1fr] sm:p-8">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 text-deep" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 2.8 4 6v5.6c0 4.6 3.3 8.7 8 9.6 4.7-.9 8-5 8-9.6V6l-8-3.2Z" />
                <path d="m8.6 12 2.3 2.3 4.5-4.6" />
              </svg>
              <div>
                <p className="text-[16px] font-medium leading-[1.6] text-ink">
                  Overclocked Science Olympiad is fiscally sponsored by {support.fiscalSponsor}, a
                  registered 501(c)(3) nonprofit.
                </p>
                <p className="mt-2 text-[14px] leading-[1.6] text-muted">
                  Matching eligibility, limits, and procedures vary by employer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
