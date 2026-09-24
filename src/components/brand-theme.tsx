import { useEffect } from "react";
import { applyBrandColor } from "@/lib/brand";
import { useAppStore } from "@/lib/store";

export function BrandTheme() {
  const color = useAppStore((s) => s.settings.primaryColor);
  useEffect(() => {
    applyBrandColor(color || "#f07828");
  }, [color]);
  return null;
}
