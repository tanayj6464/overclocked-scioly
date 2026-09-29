import Image from "next/image";
import { photos, site, snapshot } from "@/content/site";
import { ButtonLink, Container, Phoenix } from "./ui";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="paper-grid relative border-b border-rule">
      <Container className="pt-8 sm:pt-12 lg:pt-14">
        <h1 id="hero-title" className="relative">
          <span className="sr-only">{site.legalName}: {site.schoolShort} Science Olympiad</span>
          <span aria-hidden="true" className="mb-2 block font-display text-[clamp(1rem,1.9vw,1.5rem)] font-bold leading-none tracking-[0.22em] text-blue sm:mb-3">
            {site.schoolShort}
          </span>
          <span
            aria-hidden="true"
            data-hero-reveal
            data-hero-title
            className="block font-display text-[clamp(2.6rem,12.2vw,9.4rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.05em] text-ink"
          >
            Overclocked
          </span>
        </h1>

        <div className="mt-8 grid gap-10 pb-12 sm:mt-10 lg:mt-12 lg:grid-cols-12 lg:gap-8 lg:pb-16">
          <div className="flex flex-col lg:col-span-6 xl:col-span-6" data-hero-copy>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-ink/15 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-blue">
              <span>Science Olympiad</span>
              <span aria-hidden="true" className="text-blue/40">/</span>
              <span>{site.division}</span>
              <span aria-hidden="true" className="hidden text-blue/40 sm:inline">/</span>
              <span className="basis-full whitespace-nowrap sm:basis-auto">{site.location}</span>
            </p>
            <p className="mt-7 max-w-[20ch] font-display text-[clamp(1.6rem,3vw,2.35rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              Competing across science, engineering, and technology.
            </p>
            <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.6] text-muted">
              BASE Overclocked is a student-led Science Olympiad team from {site.school},
              competing across 23 events in engineering, life science, physical science, earth
              science, and technology.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#results">View Results</ButtonLink>
              <ButtonLink href="#support" variant="outline">
                Support the Team
              </ButtonLink>
            </div>
          </div>

          <figure className="lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-8" data-hero-reveal data-hero-plate>
            <div
              className="crop-marks relative aspect-[5/4] overflow-hidden rounded-sheet border border-[#cdd6ea] [--mark:#8ea2d2]"
            >
              {photos.hero ? (
                <Image
                  src={photos.hero}
                  alt={photos.heroAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div data-hero-phoenix className="h-[78%]">
                    <Phoenix className="h-full w-auto" priority />
                  </div>
                </div>
              )}
            </div>
            <figcaption className="mt-3 flex items-center justify-between text-[13px] font-medium text-muted">
              <span>{site.legalName} · Est. {site.established}</span>
              <span>{site.season} season</span>
            </figcaption>
          </figure>
        </div>
      </Container>

      <div className="border-t-[1.5px] border-ink bg-white">
        <Container>
          <dl className="grid grid-cols-2 md:grid-cols-4" data-hero-stats>
            {snapshot.map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col border-rule py-6 pl-5 sm:pl-8 md:py-8 [&:nth-child(2n)]:border-l [&:nth-child(n+3)]:border-t [&:nth-child(2n+1)]:pl-0 md:[&:nth-child(n+2)]:border-l md:[&:nth-child(n+3)]:border-t-0 md:[&:nth-child(3)]:pl-8"
              >
                <dt className="order-2 mt-3 text-[15px] font-semibold leading-snug text-ink">
                  {stat.label}
                  <span className="mt-0.5 block text-[13px] font-normal text-muted">{stat.note}</span>
                </dt>
                <dd className="order-1 font-display text-[clamp(2.75rem,6vw,4.75rem)] font-extrabold leading-none tracking-[-0.05em] text-ink tabular">
                  <span className={i === 0 ? "text-blue" : ""}>{stat.value}</span>
                  {stat.suffix ? (
                    <span className="ml-0.5 align-top text-[0.42em] tracking-[-0.02em] text-blue">
                      {stat.suffix.toUpperCase()}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>
    </section>
  );
}
