import Image from "next/image";
import { contact, site, sponsors } from "@/content/site";
import { Container } from "./ui";

/**
 * Supporters and Contact share one compact band until there are supporter
 * logos; the logo wall appears automatically once `sponsors` has entries.
 */
export function Supporters() {
  return (
    <section aria-label="Supporters and contact" className="border-t border-rule bg-white">
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-8">
        <div id="supporters" className="lg:col-span-6">
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-[-0.03em] text-ink">
            Supporters
          </h2>
          {sponsors.length === 0 ? (
            <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.65] text-muted">
              Organizations supporting the {site.season} season will be recognized here.
              Businesses and organizations interested in supporting the team can reach us at{" "}
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="link-underline font-semibold text-blue">
                  {contact.email}
                </a>
              ) : null}
              .
            </p>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-sheet border border-rule bg-rule sm:grid-cols-3">
              {sponsors.map((s) => {
                const inner = s.logo ? (
                  <Image src={s.logo} alt={s.name} width={200} height={80} className="h-10 w-auto object-contain" />
                ) : (
                  <span className="font-display text-base font-semibold tracking-[-0.02em] text-ink">{s.name}</span>
                );
                return (
                  <li key={s.name} className="flex h-24 items-center justify-center bg-white p-5">
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div id="contact" className="border-t border-rule pt-10 lg:col-span-5 lg:col-start-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-[-0.03em] text-ink">
            Contact
          </h2>
          <address className="mt-4 not-italic">
            {contact.email ? (
              <a
                href={`mailto:${contact.email}`}
                className="link-underline font-display text-[clamp(1.125rem,2vw,1.375rem)] font-semibold tracking-[-0.015em] text-blue"
              >
                {contact.email}
              </a>
            ) : null}
            <p className="mt-3 text-[16px] leading-[1.6] text-muted">
              {site.legalName}
              <br />
              {site.school}
              <br />
              {site.location}
            </p>
          </address>
        </div>
      </Container>
    </section>
  );
}
