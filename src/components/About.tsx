import { Container, SectionHeading } from "./ui";

const formats = [
  "Written tests",
  "Laboratory events",
  "Engineering builds",
  "Research",
  "Technical problem-solving",
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          <SectionHeading id="about-title" className="lg:col-span-5">
            Built for competition.
          </SectionHeading>
          <div className="space-y-5 text-[18px] leading-[1.65] text-muted lg:col-span-6 lg:col-start-7 lg:pt-2">
            <p className="text-ink">
              BASE Overclocked is the Division C Science Olympiad team at Beaverton Academy of
              Science &amp; Engineering (BASE) in Beaverton, Oregon. Our students prepare year-round
              for events spanning engineering, biology, chemistry, physics, earth and space science,
              and technology.
            </p>
            <p>
              We compete through written tests, laboratory events, engineering builds, research,
              and technical problem-solving.
            </p>
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-2 border-t-[1.5px] border-ink sm:grid-cols-3 lg:mt-20 lg:grid-cols-5">
          {formats.map((f) => (
            <li
              key={f}
              className="border-b border-rule py-5 pr-4 font-display text-[17px] font-semibold tracking-[-0.015em] text-ink lg:border-b-0 lg:border-l lg:px-5 lg:first:border-l-0 lg:first:pl-0"
            >
              {f}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
