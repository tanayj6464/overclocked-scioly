import { notFound } from "next/navigation";
import { events, getEvent } from "@/data/events";
import { hasPractice } from "@/lib/practice/index";
import { HeroBanner, Crumbs } from "@/components/Banner";
import PracticeTest from "@/components/PracticeTest";

export function generateStaticParams() {
  return events.filter((e) => hasPractice(e.slug)).map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }) {
  const event = getEvent(params.slug);
  return { title: event ? `Practice test | ${event.name}` : "Practice test" };
}

export default function PracticeTestPage({ params }) {
  const event = getEvent(params.slug);
  if (!event || !hasPractice(event.slug)) notFound();
  const topics = event.topics.map(({ slug, name, weight }) => ({ slug, name, weight }));

  return (
    <>
      <HeroBanner
        title={`${event.name} practice test`}
        crumb={
          <Crumbs
            items={[
              { label: "Events", href: "/#events" },
              { label: event.name, href: `/events/${event.slug}` },
              { label: "Study", href: `/events/${event.slug}/study` },
            ]}
          />
        }
      >
        {event.format.questions} questions, {event.format.minutes} minutes, weighted like the real test.
      </HeroBanner>
      <div className="wrap">
        <section className="fc-section pt-section">
          <PracticeTest
            eventSlug={event.slug}
            topics={topics}
            total={event.format.questions}
            minutes={event.format.minutes}
            calculator={event.calculator}
          />
        </section>
        <p className="source">
          Original questions written for this site, not real HOSA test questions. The topic split follows HOSA&rsquo;s
          official 2026&ndash;2027 test plan.
        </p>
      </div>
    </>
  );
}
