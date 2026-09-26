import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LOCALE_META, LOCALES, type Locale } from "@/lib/i18n";
import { useLocale } from "@/lib/use-t";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale();
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const meta = LOCALE_META[locale];

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={LOCALE_META[locale].native}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-10 min-h-10 items-center gap-2 rounded-full bg-raised px-2.5 shadow-[var(--shadow-border)]",
          open && "shadow-[var(--shadow-border-hover)]",
        )}
      >
        <LangFlag locale={locale} />
        <span className="text-xs font-semibold tracking-wide text-fg">{meta.code}</span>
        <ChevronDown
          className={cn("size-3.5 text-muted transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-[14rem] overflow-hidden rounded-xl border border-[#e6e0d4] bg-white py-1 shadow-[0_16px_40px_rgba(7,16,44,0.16)]"
        >
          {LOCALES.map((id) => {
            const on = id === locale;
            return (
              <li key={id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={on}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 px-3 text-left text-sm",
                    on ? "bg-raised text-fg" : "text-fg/90 hover:bg-raised/80",
                  )}
                  onClick={() => {
                    updateSettings({ locale: id });
                    setOpen(false);
                    document.documentElement.lang = LOCALE_META[id].bcp47;
                  }}
                >
                  <LangFlag locale={id} />
                  <span>{LOCALE_META[id].native}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function LangFlag({ locale }: { locale: Locale }) {
  return (
    <span className="inline-flex h-[18px] w-[26px] overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]">
      <svg viewBox="0 0 60 40" className="h-full w-full" aria-hidden>
        {FLAGS[locale]}
      </svg>
    </span>
  );
}

const FLAGS: Record<Locale, ReactNode> = {
  en: (
    <>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0l60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0l60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="12" />
      <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="7" />
    </>
  ),
  es: (
    <>
      <rect width="60" height="40" fill="#AA151B" />
      <rect y="10" width="60" height="20" fill="#F1BF00" />
    </>
  ),
  de: (
    <>
      <rect width="60" height="40" fill="#000" />
      <rect y="13.3" width="60" height="13.4" fill="#D00" />
      <rect y="26.6" width="60" height="13.4" fill="#FFCE00" />
    </>
  ),
  ru: (
    <>
      <rect width="60" height="40" fill="#fff" />
      <rect y="13.3" width="60" height="13.4" fill="#0039A6" />
      <rect y="26.6" width="60" height="13.4" fill="#D52B1E" />
    </>
  ),
  sr: (
    <>
      <rect width="60" height="40" fill="#C6363C" />
      <rect y="13.3" width="60" height="13.4" fill="#0C4076" />
      <rect y="26.6" width="60" height="13.4" fill="#fff" />
    </>
  ),
  mn: (
    <>
      <rect width="20" height="40" fill="#C4272F" />
      <rect x="20" width="20" height="40" fill="#015197" />
      <rect x="40" width="20" height="40" fill="#C4272F" />
      <path
        fill="#F9CF31"
        d="M10 8l1.2 3.6H15l-3 2.2 1.2 3.6L10 15.2 6.8 17.4 8 13.8 5 11.6h3.8z"
      />
      <rect x="8.6" y="18" width="2.8" height="14" rx="0.6" fill="#F9CF31" />
    </>
  ),
};
