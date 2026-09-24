import { isLocale, translate, type Locale, type Msg } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export function useLocale(): Locale {
  const raw = useAppStore((s) => s.settings.locale);
  return isLocale(raw) ? raw : "en";
}

export function useT() {
  const locale = useLocale();
  return (key: Msg, vars?: Record<string, string | number>) =>
    translate(locale, key, vars);
}
