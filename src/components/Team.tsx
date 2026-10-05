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
            <div className="relative flex aspect-[4/3] flex-col overflow-hidden rounded-sheet bg-blue sm:aspect-[16/10]">
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
                  <div className="relative min-h-0 flex-1">
                    <Phoenix
                      tone="duo"
                      className="absolute inset-0 m-auto h-[86%] w-auto"
                    />
                  </div>
                  <div className="relative border-t border-white/25 px-5 py-3.5 sm:px-8 sm:py-4">
                    <p className="font-display text-[clamp(1.125rem,2.2vw,1.5rem)] font-bold leading-tight tracking-[-0.03em] text-white">
                      {site.season} roster
                    </p>
                    <p className="mt-0.5 text-[13px] text-[#e8eefd] sm:text-[15px]">
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
