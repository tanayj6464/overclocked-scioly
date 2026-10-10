import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent, getTopic } from "@/data/events";
import { decks, getDeck } from "@/data/flashcards";
import { HeroBanner, Crumbs } from "@/components/Banner";
import Flashcards from "@/components/Flashcards";

export function generateStaticParams() {
  return decks.map((d) => ({ slug: d.eventSlug, deck: d.slug }));
}

export function generateMetadata({ params }) {
  const deck = getDeck(params.slug, params.deck);
  const event = getEvent(params.slug);
  return { title: deck ? `${deck.title} flashcards | ${event.name}` : "Flashcards" };
}

export default function DeckPage({ params }) {
  const event = getEvent(params.slug);
  const deck = getDeck(params.slug, params.deck);
  if (!event || !deck) notFound();
  const topic = getTopic(event, deck.topicSlug);
  const base = `/events/${event.slug}/study`;

  return (
    <>
      <HeroBanner
        title={`${deck.title} flashcards`}
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
        {deck.description}
      </HeroBanner>

      <div className="wrap">
        <section className="fc-section">
          <Flashcards eventSlug={event.slug} deckSlug={deck.slug} cards={deck.cards} />
        </section>
        <p className="source">
          Facts from the <a href={deck.sourceUrl}>{deck.source}</a>, written in our own words.
          {topic && (
            <> Part of <Link href={`${base}/${topic.slug}`}>{topic.name}</Link>.</>
          )}
        </p>
      </div>
    </>
  );
}
