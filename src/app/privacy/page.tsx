import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Container } from "@/components/ui";
import { contact, site, support } from "@/content/site";

const updated = "September 29, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How the ${site.legalName} website handles information, including email and donations made through HCB.`,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    url: `${site.url}/privacy`,
    siteName: site.legalName,
    title: `Privacy Policy | ${site.legalName}`,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: site.description }],
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-rule py-8">
      <h2 className="font-display text-[22px] font-semibold tracking-[-0.025em] text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-[16px] leading-[1.7] text-muted">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="py-16 sm:py-24">
        <Container>
          <div className="max-w-[46rem]">
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.035em] text-ink">
              Privacy Policy
            </h1>
            <p className="mt-4 text-[15px] text-muted">Last updated {updated}</p>
            <p className="mt-8 text-[17px] leading-[1.7] text-ink">
              This policy covers {site.domain}, the website of {site.legalName}, the Science Olympiad
              team at {site.school} ({site.schoolShort}) in {site.location}. The site is
              informational: it has no accounts, sign-up forms, newsletters, or advertising.
            </p>

            <div className="mt-10">
              <Section title="Information we collect">
                <p>
                  We do not ask you to enter personal information on this website, and we do not use
                  analytics, advertising trackers, or cookies of our own.
                </p>
                <p>
                  Like any website, the site is delivered through a hosting provider (Vercel), which
                  processes standard technical data such as IP addresses and browser details to serve
                  pages and protect against abuse. That processing is governed by Vercel&apos;s own
                  privacy policy.
                </p>
              </Section>

              <Section title="Email">
                <p>
                  If you email{" "}
                  {contact.email ? (
                    <a href={`mailto:${contact.email}`} className="link-underline font-semibold text-blue">
                      {contact.email}
                    </a>
                  ) : (
                    "the team"
                  )}
                  , we receive your name, email address, and whatever you include in your message.
                  Messages are delivered to team leadership through an email forwarding service and a
                  standard email provider. We use them only to reply and to coordinate team
                  activities, and we do not sell or share them for marketing.
                </p>
              </Section>

              <Section title="Donations through HCB">
                <p>
                  Donations are processed by HCB, a fiscal sponsorship and banking platform operated
                  by {support.fiscalSponsor}. When you donate, you provide payment and contact details
                  directly to HCB and its payment processors, not to this website. HCB&apos;s privacy
                  policy governs that information.
                </p>
                <p>
                  HCB may share donation details, such as your name, email address, and donation
                  amount, with the team so we can acknowledge your support. We do not publish donor
                  names or amounts without permission.
                </p>
              </Section>

              <Section title="Employer matching">
                <p>
                  Matching requests are made through your employer&apos;s own portal. Any information
                  you submit there is handled by your employer and its matching provider.
                </p>
              </Section>

              <Section title="Links to other sites">
                <p>
                  This site links to third-party services such as HCB. Their privacy practices are
                  their own, so please review their policies when you visit them.
                </p>
              </Section>

              <Section title="Changes and contact">
                <p>
                  If this policy changes, we will update this page and the date above. Questions can
                  be sent to{" "}
                  {contact.email ? (
                    <a href={`mailto:${contact.email}`} className="link-underline font-semibold text-blue">
                      {contact.email}
                    </a>
                  ) : (
                    "the team"
                  )}
                  .
                </p>
              </Section>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
