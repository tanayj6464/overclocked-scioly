import Image from "next/image";
import { contact, sponsors } from "@/content/site";
import { Container, SectionHeading } from "./ui";

export function Supporters() {
  return (
    <section id="supporters" aria-labelledby="supporters-title" className="border-t border-rule bg-white py-20 sm:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <SectionHeading id="supporters-title">Supporters</SectionHeading>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-2">
            {sponsors.length === 0 ? (
              <>
                <p className="max-w-[48ch] text-[17px] leading-[1.65] text-muted">
                  Organizations and families supporting the 2026–27 season will be recognized
                  here.
                </p>
                <p className="mt-4 text-[17px] leading-[1.65] text-ink">
                  Interested in supporting as a business or organization?{" "}
                  {contact.email ? (
                    <a href={`mailto:${contact.email}`} className="link-underline font-semibold text-blue">
                      {contact.email}
                    </a>
                  ) : (
                    <a href="#support" className="link-underline font-semibold text-blue">
                      See how to support the team
                    </a>
                  )}
                </p>
              </>
            ) : (
              <p className="max-w-[48ch] text-[17px] leading-[1.65] text-muted">
                Thank you to the organizations supporting the season.
              </p>
            )}
          </div>
        </div>

        {sponsors.length > 0 ? (
          <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-sheet border border-rule bg-rule sm:grid-cols-3 lg:grid-cols-4">
            {sponsors.map((s) => {
              const inner = s.logo ? (
                <Image src={s.logo} alt={s.name} width={200} height={80} className="h-12 w-auto object-contain" />
              ) : (
                <span className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">{s.name}</span>
              );
              return (
                <li key={s.name} className="flex h-32 items-center justify-center bg-white p-6">
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
        ) : null}
      </Container>
    </section>
  );
}
