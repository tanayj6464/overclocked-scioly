import Link from "next/link";
import { notFound } from "next/navigation";
import { events, getEvent, getTopic } from "@/data/events";
import { HeroBanner, Crumbs } from "@/components/Banner";
import TopicChecklist from "@/components/TopicChecklist";
import { decksForTopic } from "@/data/flashcards";
import { hasPractice } from "@/lib/practice/index";

export function generateStaticParams() {
  return events.flatMap((e) => e.topics.map((t) => ({ slug: e.slug, topic: t.slug })));
}

export function generateMetadata({ params }) {
  const event = getEvent(params.slug);
  const topic = getTopic(event, params.topic);
  return { title: topic ? `${topic.name} | ${event.name}` : "Study" };
}

export default function TopicPage({ params }) {
  const event = getEvent(params.slug);
  const topic = getTopic(event, params.topic);
  if (!event || !topic) notFound();

  const i = event.topics.indexOf(topic);
  const prev = event.topics[i - 1];
  const next = event.topics[i + 1];
  const items = topic.subtopics.length ? topic.subtopics : [`I've studied ${topic.name.toLowerCase()}`];
  const base = `/events/${event.slug}/study`;
  const decks = decksForTopic(event.slug, topic.slug);
  const practice = hasPractice(event.slug, topic.slug);

  return (
    <>
      <HeroBanner
        title={topic.name}
        crumb={
          <Crumbs
            items={[
              { label: "Events", href: "/#events" },
              { label: event.name, href: `/events/${event.slug}` },
              { label: "Study", href: base },
            ]}
          />
        }
      >
        Worth {topic.weight}% of the {event.name} test, about {Math.round((topic.weight / 100) * event.format.questions)} of
        the {event.format.questions} questions.
      </HeroBanner>

      <div className="wrap">
        <div className="topic-grid">
          <section>
            <h2>Track your progress</h2>
            <TopicChecklist eventSlug={event.slug} topicSlug={topic.slug} items={items} />
          </section>

          <section>
            <h2>Where to study it</h2>
            <p className="intro">
              HOSA writes the test from these references. A guide to which chapters cover this topic is coming soon.
            </p>
            <ul className="ref-list">
              {event.resources.map((r) => (
                <li key={r.title}><strong>{r.title}</strong><span>{r.author}</span></li>
              ))}
            </ul>
          </section>
        </div>

        <section>
          <h2>Study tools</h2>
          <div className="soon-grid">
            {decks.length > 0 ? (
              decks.map((d) => (
                <Link key={d.slug} className="deck-card" href={`${base}/flashcards/${d.slug}`}>
                  <h3>{d.title} flashcards</h3>
                  <p>{d.description}</p>
                  <span className="tag">{d.cards.length} cards</span>
                </Link>
              ))
            ) : (
              <div className="soon"><h3>Flashcards</h3><p>Key terms and facts for {topic.name.toLowerCase()}.</p><span className="tag muted">Coming soon</span></div>
            )}
            {practice ? (
              <Link className="deck-card" href={`${base}/${topic.slug}/practice`}>
                <h3>Practice questions</h3>
                <p>Unlimited questions on {topic.name.toLowerCase()}, with step-by-step explanations and a redo list.</p>
                <span className="tag">Start practicing</span>
              </Link>
            ) : (
              <div className="soon"><h3>Practice questions</h3><p>Questions on this topic, with explanations.</p><span className="tag muted">Coming soon</span></div>
            )}
          </div>
        </section>

        <nav className="topic-nav" aria-label="Other topics">
          {prev ? <Link href={`${base}/${prev.slug}`}>&larr; {prev.name}</Link> : <span />}
          <Link href={base}>All topics</Link>
          {next ? <Link href={`${base}/${next.slug}`}>{next.name} &rarr;</Link> : <span />}
        </nav>
      </div>
    </>
  );
}
