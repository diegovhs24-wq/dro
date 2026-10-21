type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

// JSON in een <script>-tag: "<" escapen zodat CMS-tekst met "</script>" de tag
// niet kan afsluiten (XSS) en U+2028/U+2029 niet als regeleinde breken.
export function serializeJsonLd(data: JsonLdProps["data"]) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(new RegExp("\\u2028", "g"), "\\u2028")
    .replace(new RegExp("\\u2029", "g"), "\\u2029");
}

export default function JsonLd({data}: JsonLdProps) {
  return (
    <script
      dangerouslySetInnerHTML={{__html: serializeJsonLd(data)}}
      type="application/ld+json"
    />
  );
}
