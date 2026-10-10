import Link from "next/link";
import { events, categories } from "@/data/events";
import { HeroBanner } from "@/components/Banner";

export default function Home() {
  return (
    <>
      <HeroBanner title="Know what’s on the test before you study for it.">
        Pick a HOSA event to see its format, what each topic is worth, the
        official study references, and a study plan built around your
        competition date.
      </HeroBanner>

      <div className="wrap">
        <section className="section">
          <h2>Our purpose</h2>
          <div className="prose">
            <p>
              HOSA&rsquo;s competitive event guidelines are thorough, but the
              details live in separate documents that change every year.
              FutureMedPrep brings the essentials for each event onto one
              page, so you can see what to study and how to spend your time.
            </p>
            <p>
              Every page links back to HOSA&rsquo;s official guidelines. Use
              this site to plan, and use the official guidelines to confirm.{" "}
              <Link href="/about">More about this site</Link>.
            </p>
          </div>
        </section>

        <section className="section" id="events">
          <h2>Events</h2>
          {categories.map((cat) => {
            const list = events.filter((e) => e.category === cat);
            return (
              <div className="category" key={cat}>
                <h3>{cat}</h3>
                {list.length === 0 ? (
                  <div className="empty">Events in this category are being added.</div>
                ) : (
                  list.map((e) => (
                    <Link className="event-row" href={`/events/${e.slug}`} key={e.slug}>
                      <span className="event-name">{e.name}</span>
                      <span className="event-meta">
                        {e.format.type}, {e.format.questions} questions, {e.format.minutes} min
                      </span>
                    </Link>
                  ))
                )}
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
}
