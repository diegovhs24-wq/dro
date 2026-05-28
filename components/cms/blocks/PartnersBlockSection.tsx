import Partners from "@/components/Partners";
import { getPartners, type PartnersBlock } from "@/lib/cms";

type PartnersBlockSectionProps = Pick<PartnersBlock, "eyebrow" | "title" | "text">;

export default async function PartnersBlockSection({
  eyebrow,
  title,
  text,
}: PartnersBlockSectionProps = {}) {
  const partners = await getPartners();
  return <Partners partners={partners} eyebrow={eyebrow} title={title} text={text} />;
}
