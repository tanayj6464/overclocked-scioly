import Link from "next/link";

// Page-top banner: maroon, dotted, serif headline, optional button.
export function HeroBanner({ crumb, title, children, action }) {
  return (
    <section className="banner banner-hero">
      <div className="wrap">
        {crumb}
        <h1>{title}</h1>
        {children && <p className="lede">{children}</p>}
        {action && <div className="banner-action">{action}</div>}
      </div>
    </section>
  );
}

// Bottom-of-page banner: headline on the left, button on the right.
export function CtaBanner() {
  return (
    <section className="banner banner-cta" aria-label="Browse events">
      <div className="wrap banner-inner">
        <h2>Know the test. Plan your time. Walk in ready.</h2>
        <Link className="btn" href="/#events">Browse events</Link>
      </div>
    </section>
  );
}

export function Crumbs({ items }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && " / "}
          {it.href ? <Link href={it.href}>{it.label}</Link> : it.label}
        </span>
      ))}
    </nav>
  );
}
