import { site, support } from "@/content/site";
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
              <p className="text-[14px] font-semibold text-muted">Target support per competitor</p>
              <p className="mt-2 font-display text-[clamp(4.5rem,9vw,6.5rem)] font-extrabold leading-[0.9] tracking-[-0.055em] text-deep tabular">
                {usd(support.targetPerCompetitor)}
              </p>

              <div className="mt-8 border-t-[1.5px] border-ink pt-6">
                <h3 className="font-display text-[15px] font-bold uppercase tracking-[0.08em] text-ink">
                  Employer matching
                </h3>
                <dl className="mt-5 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-x-2 sm:gap-x-3">
                  <div className="flex flex-col">
                    <dt className="order-2 mt-1 text-[12px] leading-tight text-muted">Your contribution</dt>
                    <dd className="order-1 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-bold tracking-[-0.04em] tabular">
                      {usd(support.targetPerCompetitor)}
                    </dd>
                  </div>
                  <span aria-hidden="true" className="pt-2 font-display text-xl font-bold text-muted">+</span>
                  <div className="flex flex-col">
                    <dt className="order-2 mt-1 text-[12px] leading-tight text-muted">Employer match</dt>
                    <dd className="order-1 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-bold tracking-[-0.04em] text-blue tabular">
                      {usd(support.matchedTotal - support.targetPerCompetitor)}
                    </dd>
                  </div>
                  <span aria-hidden="true" className="pt-2 font-display text-xl font-bold text-muted">=</span>
                  <div className="flex flex-col">
                    <dt className="order-2 mt-1 text-[12px] leading-tight text-muted">Total support</dt>
                    <dd className="order-1 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-bold tracking-[-0.04em] text-deep tabular">
                      {usd(support.matchedTotal)}
                    </dd>
                  </div>
                </dl>
                <p className="mt-6 text-[15px] leading-[1.6] text-muted">
                  Eligible employer matching programs may increase a {usd(support.targetPerCompetitor)}{" "}
                  contribution to {usd(support.matchedTotal)} in total support.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                {hasDonate ? (
                  <ButtonLink href={support.donateUrl} external className="w-full">
                    Support Overclocked
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
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
