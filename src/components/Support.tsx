import { contact, site, support } from "@/content/site";
import { ButtonLink, Container, PendingButton } from "./ui";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export function Support() {
  const hasDonate = support.donateUrl.length > 0;
  return (
    <section id="support" aria-labelledby="support-title" className="on-deep relative overflow-hidden bg-deep py-20 text-white sm:py-28">
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h2
              id="support-title"
              className="font-display text-[clamp(2.1rem,4.8vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.035em] text-white"
            >
              Support the {site.season} season
            </h2>
            <p className="mt-6 max-w-[50ch] text-[17px] leading-[1.65] text-on-deep">
              Contributions help cover tournament registration, engineering materials, laboratory
              supplies, team equipment, and competition-related expenses.
            </p>
            <ul className="mt-10 max-w-lg border-t border-white/25">
              {support.uses.map((u) => (
                <li
                  key={u}
                  className="flex items-center gap-3 border-b border-white/15 py-3.5 text-[16px] font-medium text-white"
                >
                  <span aria-hidden="true" className="size-1.5 bg-gold" />
                  {u}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <div className="rounded-sheet bg-white p-7 text-ink shadow-[0_24px_60px_-28px_rgba(4,12,40,0.55)] sm:p-9">
              <p className="text-[14px] font-semibold text-muted">Suggested donation</p>
              <p className="mt-2 font-display text-[clamp(4.5rem,9vw,6.5rem)] font-extrabold leading-[0.9] tracking-[-0.055em] text-deep tabular">
                {usd(support.suggestedDonation)}
              </p>
              <p className="mt-3 text-[15px] text-muted">Any amount helps the team compete.</p>

              <dl className="mt-8 border-t-[1.5px] border-ink">
                <div className="border-b border-rule py-5">
                  <dt className="font-display text-[17px] font-bold tracking-[-0.015em] text-ink">Donate</dt>
                  <dd className="mt-1.5 text-[15px] leading-[1.6] text-muted">
                    Give securely through Overclocked&apos;s official HCB fund.
                  </dd>
                </div>
                <div className="py-5">
                  <dt className="font-display text-[17px] font-bold tracking-[-0.015em] text-ink">Match your donation</dt>
                  <dd className="mt-1.5 text-[15px] leading-[1.6] text-muted">
                    Many employers match charitable donations. An eligible match can double
                    your gift.
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-col gap-3">
                {hasDonate ? (
                  <ButtonLink href={support.donateUrl} external className="w-full">
                    Donate to Overclocked
                  </ButtonLink>
                ) : (
                  <PendingButton variant="primary" className="w-full">
                    Donation link coming soon
                  </PendingButton>
                )}
                <ButtonLink href="#matching" variant="outline" className="w-full">
                  Employer Matching
                </ButtonLink>
              </div>

              {contact.email ? (
                <p className="mt-6 text-[14px] text-muted">
                  Questions?{" "}
                  <a href={`mailto:${contact.email}`} className="link-underline font-semibold text-blue">
                    {contact.email}
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
