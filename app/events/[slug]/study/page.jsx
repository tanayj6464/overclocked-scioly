import Link from "next/link";
import { notFound } from "next/navigation";
import { events, getEvent } from "@/data/events";
import { HeroBanner, Crumbs } from "@/components/Banner";
import StudyHubList from "@/components/StudyHubList";
import { getDecks } from "@/data/flashcards";
import { hasPractice } from "@/lib/practice/index";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }) {
  const event = getEvent(params.slug);
  return { title: event ? `Study ${event.name}` : "Study" };
}

export default function StudyHub({ params }) {
  const event = getEvent(params.slug);
  if (!event) notFound();
  const decks = getDecks(event.slug);
  const practice = hasPractice(event.slug);

  return (
    <>
      <HeroBanner
        title={`Study ${event.name}`}
        crumb={<Crumbs items={[{ label: "Events", href: "/#events" }, { label: event.name, href: `/events/${event.slug}` }]} />}
      >
        Pick a topic. They&rsquo;re listed by how much of the test they cover, so the top of the list is worth the most points.
      </HeroBanner>

      <div className="wrap">
        <section>
          <h2>Topics</h2>
          <StudyHubList eventSlug={event.slug} topics={event.topics} />
        </section>

        {practice && (
          <section>
            <h2>Practice</h2>
            <div className="soon-grid">
              <Link className="deck-card" href={`/events/${event.slug}/study/practice-test`}>
                <h3>Full practice test</h3>
                <p>{event.format.questions} questions in {event.format.minutes} minutes, weighted like the real test, with a score for each topic.</p>
                <span className="tag">Timed</span>
              </Link>
              <div className="deck-card is-static">
                <h3>Practice by topic</h3>
                <p>Pick a topic above. Every topic has unlimited practice questions with step-by-step explanations.</p>
              </div>
            </div>
          </section>
        )}

        {decks.length > 0 && (
          <section>
            <h2>Flashcards</h2>
            <div className="soon-grid">
              {decks.map((d) => (
                <Link key={d.slug} className="deck-card" href={`/events/${event.slug}/study/flashcards/${d.slug}`}>
                  <h3>{d.title}</h3>
                  <p>{d.description}</p>
                  <span className="tag">{d.cards.length} cards</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!(practice && decks.length > 0) && (
        <section>
          <h2>Coming soon</h2>
          <div className="soon-grid">
            {decks.length === 0 && (
              <div className="soon"><h3>Flashcards</h3><p>Quick-review cards for every topic.</p><span className="tag muted">Coming soon</span></div>
            )}
            {!practice && (
              <>
                <div className="soon"><h3>Practice questions</h3><p>Questions by topic, with explanations.</p><span className="tag muted">Coming soon</span></div>
                <div className="soon"><h3>Full practice test</h3><p>A timed test at the real event&rsquo;s length and pace.</p><span className="tag muted">Coming soon</span></div>
              </>
            )}
          </div>
        </section>
        )}

        <p className="source">
          Need a schedule? <Link href={`/events/${event.slug}#plan`}>Build your study plan</Link>.
        </p>
      </div>
    </>
  );
}
