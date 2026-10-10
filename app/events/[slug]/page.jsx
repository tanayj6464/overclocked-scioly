import Link from "next/link";
import { notFound } from "next/navigation";
import { events, getEvent, testDay, paceText } from "@/data/events";
import StudyPlanner from "@/components/StudyPlanner";
import { HeroBanner, Crumbs } from "@/components/Banner";

const SEGMENTS = [
  { bg: "#246084", fg: "#fff" },
  { bg: "#87171d", fg: "#fff" },
  { bg: "#072621", fg: "#fff" },
  { bg: "#c8ad94", fg: "#072621" },
];

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }) {
  const event = getEvent(params.slug);
  return { title: event ? event.name : "Event" };
}

export default function EventPage({ params }) {
  const event = getEvent(params.slug);
  if (!event) notFound();
  const f = event.format;
  const studyHref = `/events/${event.slug}/study`;

  return (
    <>
      <HeroBanner
        title={event.name}
        crumb={<Crumbs items={[{ label: "Events", href: "/#events" }, { label: event.category }]} />}
        action={<Link className="btn" href={studyHref}>Start studying</Link>}
      >
        {event.summary}
      </HeroBanner>

      <div className="wrap">
        <dl className="facts">
          <div className="fact"><dt>Format</dt><dd>{f.type}</dd></div>
          <div className="fact"><dt>Questions</dt><dd>{f.questions}</dd></div>
          <div className="fact"><dt>Time</dt><dd>{f.minutes} minutes</dd></div>
          <div className="fact"><dt>Pace</dt><dd>{paceText(f).replace("About ", "~")}</dd></div>
          <div className="fact"><dt>Calculator</dt><dd>{event.calculator ? "Provided" : "None"}</dd></div>
        </dl>

        {event.newThisYear && (
          <p className="callout"><strong>New for 2026&ndash;2027:</strong> {event.newThisYear}</p>
        )}

        <section>
          <h2>What the test covers</h2>
          <div className="weightbar" role="img" aria-label="Share of the test by topic">
            {event.topics.map((t, i) => {
              const c = SEGMENTS[i % SEGMENTS.length];
              return (
                <div key={t.slug} title={`${t.name}: ${t.weight}%`} style={{ flex: t.weight, background: c.bg, color: c.fg }}>
                  {t.weight >= 10 ? `${t.weight}%` : ""}
                </div>
              );
            })}
          </div>
          <ul className="legend">
            {event.topics.map((t, i) => (
              <li key={t.slug} style={{ borderColor: SEGMENTS[i % SEGMENTS.length].bg }}>
                <span className="pct">{t.weight}%</span>
                <h3>{t.name}</h3>
                {t.subtopics.length > 0 && (
                  <ul>{t.subtopics.map((s) => <li key={s}>{s}</li>)}</ul>
                )}
                <Link className="study-link" href={`${studyHref}/${t.slug}`}>Study this topic</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Official study references</h2>
          <p className="intro">HOSA writes the test questions from these. Use the latest edition.</p>
          {event.resources.map((r) => (
            <div className="resource" key={r.title}>
              <h3>{r.title}<span className="badge">Official</span></h3>
              <div className="by">{r.author}, {r.publisher}</div>
              {r.note && <p className="note">{r.note}</p>}
              <div className="pending">Chapter-by-topic guide coming soon.</div>
            </div>
          ))}
        </section>

        {event.rules.length > 0 && (
          <section>
            <h2>Rules to know</h2>
            <ul className="rules">{event.rules.map((r) => <li key={r}>{r}</li>)}</ul>
          </section>
        )}

        <section id="plan">
          <h2>Build your study plan</h2>
          <StudyPlanner eventSlug={event.slug} topics={event.topics} studyHref={studyHref} />
        </section>

        <section>
          <h2>Test day</h2>
          <ul className="checklist">
            {testDay.bring.map((b) => <li key={b}>{b}</li>)}
            <li>{testDay.dress}</li>
            <li>{testDay.timing}</li>
            {event.calculator && <li>{event.calculator}</li>}
            <li>Tiebreaker: {event.tiebreaker}</li>
          </ul>
        </section>

        <p className="source">
          Source: <a href={event.sourceUrl}>HOSA 2026&ndash;2027 {event.name} guidelines (PDF)</a>. Last checked {event.lastChecked}.
          These are written for ILC, and your state may run things differently.
        </p>
      </div>
    </>
  );
}
