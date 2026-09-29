import { eventCategories, snapshot } from "@/content/site";
import { Container, SectionHeading } from "./ui";

export function Events() {
  const eventCount = snapshot.find((s) => s.label.includes("events"))?.value ?? "23";
  return (
    <section id="events" aria-labelledby="events-title" className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <SectionHeading id="events-title" className="lg:col-span-6">
            {eventCount} events. One team.
          </SectionHeading>
          <p className="max-w-[48ch] text-[17px] leading-[1.65] text-muted lg:col-span-5 lg:col-start-8 lg:pt-3">
            Division C spans six areas of science and engineering. Competitors prepare in small
            event teams, and every placement counts toward the team score.
          </p>
        </div>

        <ol className="mt-14 border-t-[1.5px] border-ink lg:mt-16">
          {eventCategories.map((cat) => (
            <li
              key={cat.name}
              className="group grid gap-3 border-b border-rule py-7 sm:py-8 md:grid-cols-12 md:gap-8"
            >
              <h3 className="flex items-center gap-4 font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-semibold leading-tight tracking-[-0.03em] text-ink md:col-span-5">
                <span
                  aria-hidden="true"
                  className="h-[3px] w-5 shrink-0 bg-blue transition-[width] duration-300 ease-out-expo group-hover:w-9"
                />
                {cat.name}
              </h3>
              <div className="md:col-span-7 md:pt-1.5">
                <p className="max-w-[56ch] text-[16px] leading-[1.6] text-muted">{cat.description}</p>
                {cat.note || cat.events.length > 0 ? (
                  <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold text-ink">
                    {cat.note ? (
                      <span className="inline-flex items-center gap-2">
                        <span aria-hidden="true" className="size-2 rounded-full bg-gold" />
                        {cat.note}
                      </span>
                    ) : null}
                    {cat.events.length > 0 ? (
                      <span className="font-medium text-ink/75">{cat.events.join(" · ")}</span>
                    ) : null}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
