import "@fontsource-variable/public-sans";
import "@fontsource-variable/baskervville";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { CtaBanner } from "@/components/Banner";

export const metadata = {
  title: {
    default: "FutureMedPrep | Health science learning",
    template: "%s | FutureMedPrep",
  },
  description:
    "Study guides and study planners for HOSA competitive events: format, what the test covers, official references, and a plan built around your date.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <header className="site-header">
          <div className="wrap header-inner">
            <Link href="/" className="brand" aria-label="FutureMedPrep home">
              <Image src="/logo.png" alt="FutureMedPrep: health science learning" width={760} height={287} priority />
            </Link>
            <nav aria-label="Main">
              <Link href="/#events">Events</Link>
              <Link href="/about">About</Link>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <CtaBanner />
        <footer className="site-footer">
          <div className="wrap footer-inner">
            <p>
              FutureMedPrep is an independent student project. It is not
              affiliated with or endorsed by HOSA-Future Health Professionals.
              Always confirm details in the official event guidelines at hosa.org.
            </p>
            <nav aria-label="Footer">
              <Link href="/about">About</Link>
              <Link href="/privacy">Privacy policy</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
