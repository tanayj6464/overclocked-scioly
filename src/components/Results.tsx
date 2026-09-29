import { results } from "@/content/site";
import { Container } from "./ui";

const ordinal = (n: number) =>
  n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";

function MedalMark({ place }: { place: number }) {
  // Medal disc; the place numeral beside it carries the value.
  return (
    <svg aria-hidden="true" data-place={place} viewBox="0 0 28 28" className="size-5 shrink-0 sm:size-6">
      <circle cx="14" cy="14" r="13" fill="#D3AE36" />
      <circle cx="14" cy="14" r="9.5" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1" />
    </svg>
  );
}

export function Results() {
  return (
    <section id="results" aria-labelledby="results-title" className="border-y border-rule bg-white py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2
              id="results-title"
              className="font-display text-[clamp(2rem,4.4vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.035em] text-ink"
            >
              {results.tournament}
            </h2>
            <p className="mt-3 text-[16px] text-muted">State Tournament · Division C</p>

            <div className="mt-10 border-t-[1.5px] border-ink pt-6">
              <p className="font-display text-[clamp(6.5rem,15vw,11rem)] font-extrabold leading-[0.8] tracking-[-0.06em] text-blue tabular">
                {results.overall}
                <span className="align-top text-[0.34em] tracking-[-0.02em]">TH</span>
              </p>
              <p className="mt-3 font-display text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold uppercase leading-none tracking-[0.06em] text-ink">
                Overall
              </p>
            </div>
            <p className="mt-6 max-w-[36ch] text-[16px] leading-relaxed text-muted">
              Four state medals, all in engineering build events: devices the team designed,
              built, and tested itself.
            </p>
          </div>

          <div className="lg:col-span-7">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                {results.tournament} medal placements
              </caption>
              <thead>
                <tr className="border-b-[1.5px] border-ink text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                  <th scope="col" className="w-[26%] pb-3 font-semibold">Place</th>
                  <th scope="col" className="pb-3 font-semibold">Event</th>
                  <th scope="col" className="hidden pb-3 text-right font-semibold sm:table-cell">Category</th>
                </tr>
              </thead>
              <tbody>
                {results.placements.map((p) => (
                  <tr
                    key={p.event}
                    data-result-row
                    className="border-b border-rule transition-colors hover:bg-sky/60"
                  >
                    <td className="py-5 pr-4 sm:py-6">
                      <span className="flex items-center gap-3">
                        <MedalMark place={p.place} />
                        <span className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-[-0.05em] text-ink tabular">
                          {p.place}
                          <span className="align-top text-[0.4em] tracking-[-0.01em] text-muted">
                            {ordinal(p.place).toUpperCase()}
                          </span>
                        </span>
                      </span>
                    </td>
                    <th scope="row" className="py-5 font-display text-[clamp(1.25rem,2.4vw,1.75rem)] font-semibold tracking-[-0.025em] text-ink sm:py-6">
                      {p.event}
                      <span className="mt-1 block text-[13px] font-normal tracking-normal text-muted sm:hidden">
                        {p.category}
                      </span>
                    </th>
                    <td className="hidden py-5 text-right text-[15px] text-muted sm:table-cell sm:py-6">
                      {p.category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
}
