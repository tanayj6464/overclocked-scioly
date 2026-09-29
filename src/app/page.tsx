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
import { results, site, support } from "@/content/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsTeam",
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  logo: `${site.url}/brand/phoenix-color.svg`,
  sport: "Science Olympiad",
  foundingDate: String(site.established),
  location: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Beaverton", addressRegion: "OR", addressCountry: "US" } },
  sponsor: { "@type": "Organization", name: support.fiscalSponsor },
  award: results.placements.map((p) => `${p.place}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[p.place] ?? "th"} place, ${p.event}, ${results.tournament}`),
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
