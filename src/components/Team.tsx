import Image from "next/image";
import { members, photos, site, snapshot } from "@/content/site";
import { Container, Phoenix, SectionHeading } from "./ui";

export function Team() {
  const competitors = snapshot.find((s) => s.label === "Competitors")?.value ?? "15";
  return (
    <section id="team" aria-labelledby="team-title" className="border-y border-rule bg-white py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <SectionHeading id="team-title">The Team</SectionHeading>
            <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.65] text-muted">
              Overclocked brings together students across science, engineering, research, and
              technology disciplines. Members prepare in small event teams while contributing to
              the team&apos;s overall competitive performance.
            </p>
            <dl className="mt-10 grid max-w-md grid-cols-2 border-t-[1.5px] border-ink">
              <div className="py-4 pr-4">
                <dt className="text-[13px] text-muted">Competitors</dt>
                <dd className="font-display text-3xl font-bold tracking-[-0.04em] text-ink tabular">{competitors}</dd>
              </div>
              <div className="border-l border-rule py-4 pl-5">
                <dt className="text-[13px] text-muted">Division</dt>
                <dd className="font-display text-3xl font-bold tracking-[-0.04em] text-ink">C</dd>
              </div>
            </dl>
          </div>

          <figure className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-sheet bg-blue">
              {photos.team ? (
                <Image
                  src={photos.team}
                  alt={photos.teamAlt}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:40px_40px]"
                  />
                  <Phoenix
                    tone="white"
                    className="absolute -right-[24%] top-1/2 h-[128%] w-auto -translate-y-[46%] opacity-40 sm:-right-[6%] sm:opacity-95"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-[-0.03em] text-white">
                      {site.season} roster
                    </p>
                    <p className="mt-1 text-[15px] text-[#e8eefd]">
                      {competitors} competitors · {site.division} · {site.location}
                    </p>
                  </div>
                </>
              )}
            </div>
          </figure>
        </div>

        {members.length > 0 ? (
          <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {members.map((m) => (
              <li key={m.name}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-sheet bg-sky">
                  {m.photo ? (
                    <Image src={m.photo} alt={m.name} fill sizes="(min-width: 1024px) 20vw, 45vw" className="object-cover" />
                  ) : null}
                </div>
                <p className="mt-3 font-display text-[17px] font-semibold tracking-[-0.02em] text-ink">{m.name}</p>
                {m.role ? <p className="text-[14px] text-muted">{m.role}</p> : null}
                {m.events?.length ? <p className="mt-1 text-[13px] text-muted">{m.events.join(" · ")}</p> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
