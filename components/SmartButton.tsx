import Link from "next/link";
import {resolveSmartLink} from "@/lib/smartLink";
import type {HeaderButton} from "@/lib/types";

const variantClass: Record<string, string> = {
  primary:
    "inline-flex min-h-10 items-center rounded-lg bg-brand-orange px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(255,106,0,0.20)] transition hover:-translate-y-0.5 hover:bg-brand-orange/90",
  outlined:
    "inline-flex min-h-10 items-center rounded-lg border border-black/15 bg-white px-5 text-sm font-bold text-brand-ink shadow-sm transition hover:-translate-y-0.5 hover:border-brand-orange/30",
};

type SmartButtonProps = {
  buttons: HeaderButton[];
  className?: string;
};

export default function SmartButton({buttons, className = ""}: SmartButtonProps) {
  if (!buttons.length) return null;

  return (
    <>
      {buttons.map((btn) => {
        const {href, openInNewTab} = resolveSmartLink(btn.link);
        return (
          <Link
            key={`${btn.label}-${href}`}
            href={href}
            target={openInNewTab ? "_blank" : undefined}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
            className={`${variantClass[btn.variant] ?? variantClass.primary} ${className}`}
          >
            {btn.label}
          </Link>
        );
      })}
    </>
  );
}
