import { HeroBanner } from "@/components/Banner";
import ContactLine from "@/components/ContactLine";

export const metadata = { title: "About" };

export default function About() {
  return (
    <>
      <HeroBanner title="About FutureMedPrep">
        An independent study guide for HOSA competitive events.
      </HeroBanner>

      <div className="wrap">
        <div className="prose">
          <h2>Our purpose</h2>
          <p>
            HOSA&rsquo;s competitive event guidelines are detailed, and they are
            published as separate documents that change every year.
            FutureMedPrep brings the essentials for each event into one clear
            page, so you can see what is on the test and plan your study time
            around it.
          </p>
          <p>
            The goal is simple: help HOSA members walk into their event
            knowing what to expect and how they prepared.
          </p>

          <h2>What each event page includes</h2>
          <ul>
            <li>The format and rules at a glance</li>
            <li>What the test covers and how much each topic is worth</li>
            <li>The official study references</li>
            <li>A study planner built around your competition date and how well you know each topic</li>
            <li>A study page for each topic, with a progress checklist</li>
            <li>A test-day checklist</li>
          </ul>

          <h2>Who it&rsquo;s for</h2>
          <p>
            FutureMedPrep covers HOSA&rsquo;s secondary (high school) and
            postsecondary/collegiate events. It&rsquo;s meant for students 13
            and older, and it doesn&rsquo;t cover the middle school events.
          </p>

          <h2>Where the information comes from</h2>
          <p>
            Each event page is based on HOSA&rsquo;s current official
            guidelines. It links straight to the source and shows the date we
            last checked it. Topic weights come from the event&rsquo;s official
            test plan, and everything is written in our own words.
          </p>
          <p>
            Some parts are our own suggestions, not HOSA&rsquo;s: for example,
            the study planner splits time evenly within a topic area, adjusts it
            by how well you know each topic, and saves the last tenth of your
            hours for review. The planner says so
            wherever it applies.
          </p>

          <h2>Accuracy</h2>
          <p>
            Guidelines change every year, and mistakes can happen. If anything
            here differs from HOSA&rsquo;s official guidelines, the official
            guidelines are correct. Always confirm the details at hosa.org
            before you compete.
          </p>

          <h2>Independence</h2>
          <p>
            FutureMedPrep is an independent student project. It is not
            affiliated with, sponsored by, or endorsed by HOSA-Future Health
            Professionals or any state association. &ldquo;HOSA&rdquo; is the
            name of that organization and is used here only to describe what
            this site is for.
          </p>
          <ContactLine prefix="Questions or corrections? Email" />
        </div>
      </div>
    </>
  );
}
