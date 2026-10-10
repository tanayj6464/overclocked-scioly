import { site } from "@/data/site";

// Renders nothing until a contact email is set in data/site.js.
export default function ContactLine({ prefix }) {
  if (!site.contactEmail) return null;
  return (
    <p>
      {prefix} <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
    </p>
  );
}
