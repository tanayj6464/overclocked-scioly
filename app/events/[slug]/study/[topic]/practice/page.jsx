import Link from "next/link";
import { notFound } from "next/navigation";
import { events, getEvent, getTopic } from "@/data/events";
import { hasPractice } from "@/lib/practice/index";
import { HeroBanner, Crumbs } from "@/components/Banner";
import Practice from "@/components/Practice";

export function generateStaticParams() {
  return events.flatMap((e) =>
    e.topics.filter((t) => hasPractice(e.slug, t.slug)).map((t) => ({ slug: e.slug, topic: t.slug }))
  );
}

export function generateMetadata({ params }) {
  const event = getEvent(params.slug);
  const topic = getTopic(event, params.topic);
  return { title: topic ? `Practice: ${topic.name} | ${event.name}` : "Practice" };
}

export default function TopicPracticePage({ params }) {
  const event = getEvent(params.slug);
  const topic = getTopic(event, params.topic);
  if (!event || !topic || !hasPractice(event.slug, topic.slug)) notFound();
  const base = `/events/${event.slug}/study`;

  return (
    <>
      <HeroBanner
        title={`Practice: ${topic.name}`}
        crumb={
          <Crumbs
            items={[
              { label: "Events", href: "/#events" },
              { label: event.name, href: `/events/${event.slug}` },
              { label: "Study", href: base },
              { label: topic.name, href: `${base}/${topic.slug}` },
            ]}
          />
        }
      >
        Original practice questions with step-by-step explanations. Type your answer the way you would grid it on the test.
      </HeroBanner>
      <div className="wrap">
        <section className="fc-section">
          <Practice eventSlug={event.slug} topicSlug={topic.slug} />
        </section>
        <p className="source">
          These are practice questions written for this site, not real HOSA test questions. They follow the rounding
          rules in HOSA&rsquo;s official guidelines. <Link href={`${base}/practice-test`}>Take a full practice test</Link>.
        </p>
      </div>
    </>
  );
}
