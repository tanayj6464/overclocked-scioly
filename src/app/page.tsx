import { About } from "@/components/About";
import { DividerTabs } from "@/components/DividerTabs";
import { Events } from "@/components/Events";
import { Hero } from "@/components/Hero";
import { Matching } from "@/components/Matching";
import { Motion } from "@/components/Motion";
import { Results } from "@/components/Results";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Support } from "@/components/Support";
import { Supporters } from "@/components/Supporters";
import { Team } from "@/components/Team";
import { contact, results, site, support } from "@/content/site";

const ordinal = (n: number) => `${n}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n] ?? "th"}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.legalName,
      alternateName: site.alternateNames,
      description: site.description,
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.legalName,
      alternateName: site.alternateNames,
      url: site.url,
      logo: `${site.url}/apple-icon.png`,
      image: `${site.url}/opengraph-image.png`,
      description: site.description,
      email: contact.email || undefined,
      foundingDate: String(site.established),
      address: {
        "@type": "PostalAddress",
        addressLocality: "Beaverton",
        addressRegion: "OR",
        addressCountry: "US",
      },
      parentOrganization: {
        "@type": "HighSchool",
        name: site.school,
        alternateName: site.schoolShort,
        address: { "@type": "PostalAddress", addressLocality: "Beaverton", addressRegion: "OR", addressCountry: "US" },
      },
      sponsor: { "@type": "Organization", name: support.fiscalSponsor },
      knowsAbout: ["Science Olympiad", "Science Olympiad Division C"],
      award: results.placements.map((p) => `${ordinal(p.place)} place, ${p.event}, ${results.tournament}`),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteHeader />
      <DividerTabs />
      <main id="main">
        <Hero />
        <About />
        <Results />
        <Events />
        <Team />
        <Support />
        <Matching />
        <Supporters />
      </main>
      <SiteFooter />
      <Motion />
    </>
  );
}
