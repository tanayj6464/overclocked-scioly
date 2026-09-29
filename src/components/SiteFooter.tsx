import Link from "next/link";
import { contact, site, social, support } from "@/content/site";
import { Container, Phoenix } from "./ui";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#results", label: "Results" },
  { href: "/#events", label: "Events" },
  { href: "/#support", label: "Support" },
  { href: "/#matching", label: "Employer Matching" },
  { href: "/#contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteFooter() {
  return (
    <footer className="border-t-[1.5px] border-ink bg-paper">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="flex items-start gap-4 md:col-span-5">
            <Phoenix className="h-16 w-auto shrink-0" />
            <div>
              <p className="font-display text-[19px] font-bold tracking-[-0.02em] text-ink">{site.legalName}</p>
              <p className="mt-1 text-[15px] text-muted">{site.location}</p>
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="link-underline mt-1 inline-block text-[15px] text-blue">
                  {contact.email}
                </a>
              ) : null}
              <p className="mt-4 max-w-[38ch] text-[14px] leading-[1.6] text-muted">
                {site.legalName} is the Science Olympiad team at {site.school} ({site.schoolShort})
                in {site.location}.
              </p>
            </div>
          </div>

          <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 md:grid-cols-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] font-medium text-ink/80 transition-colors hover:text-blue">
                    {l.label}
                  </Link>
                </li>
              ))}
              {social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-[15px] font-medium text-ink/80 transition-colors hover:text-blue">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-[14px] leading-[1.6] text-muted md:col-span-3">
            {site.legalName} is fiscally sponsored by {support.fiscalSponsor}, a registered
            501(c)(3) nonprofit.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-rule pt-6 text-[13px] text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName}</p>
          <p>{site.domain}</p>
        </div>
      </Container>
    </footer>
  );
}
