import Link from "next/link";
import { HeroBanner } from "@/components/Banner";
import ContactLine from "@/components/ContactLine";
import { site } from "@/data/site";

export const metadata = { title: "Privacy policy" };

export default function Privacy() {
  return (
    <>
      <HeroBanner title="Privacy policy">
        Last updated {site.privacyUpdated}.
      </HeroBanner>

      <div className="wrap">
        <div className="prose">
          <h2>The short version</h2>
          <p>
            FutureMedPrep does not ask for your name, email address, or any
            other personal information, and it does not require an account.
            Your study plan and progress stay on your own device. You can use
            the whole site without telling us anything about yourself.
          </p>

          <h2>Your study plan and progress</h2>
          <p>
            The study planner, topic checklists, flashcards, practice
            questions, and practice tests run entirely in your browser. To
            remember your plan, what you&rsquo;ve checked off, which questions
            and cards you missed, and your practice test scores, they save it
            in your browser&rsquo;s local storage on your device. Your answers
            are checked in your browser too.
            It is never sent to us, we can&rsquo;t see it, and it isn&rsquo;t
            shared across your devices. You can remove a plan with the
            &ldquo;Clear my plan&rdquo; button, reset flashcards with
            &ldquo;Reset my progress,&rdquo; or clear all of it by clearing
            this site&rsquo;s data in your browser settings.
          </p>

          <h2>Hosting and technical data</h2>
          <p>
            This site is hosted by Vercel. When you visit, Vercel&rsquo;s
            servers receive standard technical information, such as your IP
            address, browser type, and the page you asked for. Vercel uses it
            to deliver and secure the site, as described in Vercel&rsquo;s own
            privacy policy. We do not use it to identify visitors.
          </p>

          <h2>Cookies, analytics, and fonts</h2>
          <p>
            FutureMedPrep does not set cookies of its own and does not use
            advertising, analytics, or tracking tools. The only thing it
            stores is the study data described above, on your own device. Fonts and images are
            served from this site, so your browser does not contact other
            companies to load them.
          </p>

          <h2>Links to other sites</h2>
          <p>
            Event pages link to HOSA&rsquo;s official guidelines and may link
            to other sources. Those sites have their own privacy practices,
            which we do not control.
          </p>

          <h2>Who this site is for</h2>
          <p>
            FutureMedPrep is made for high school and college students
            preparing for HOSA events, and it is not intended for children
            under 13. It does not cover HOSA&rsquo;s middle school events.
            Because we do not collect personal information, we do not
            knowingly collect it from anyone, including children under 13.
          </p>

          <h2>If we add accounts later</h2>
          <p>
            We may add optional accounts in the future so students can save
            their events and progress across devices. Accounts would be for
            people 13 and older. Before we collect anything, we will
            update this policy to explain what we collect, why, who handles
            it, and how to delete it. Nothing will be collected until the
            updated policy is posted here.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            If this policy changes, we will post the new version on this page
            and update the date at the top.
          </p>
          <ContactLine prefix="Questions about this policy? Email" />
          <p>
            <Link href="/about">About FutureMedPrep</Link>
          </p>
        </div>
      </div>
    </>
  );
}
