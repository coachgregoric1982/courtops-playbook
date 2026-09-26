import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { BrandTheme } from "@/components/brand-theme";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Splash } from "@/components/splash";
import {
  clearShareParam,
  readShareParam,
  unpackPlay,
} from "@/lib/share";
import { useAppStore } from "@/lib/store";
import { translate, isLocale } from "@/lib/i18n";
import appCss from "../styles.css?url";

const APP_NAME = "CourtOps Playbook";

function HydrateStore() {
  const hydrate = useAppStore((s) => s.hydrate);
  const importPlay = useAppStore((s) => s.importPlay);
  const navigate = useNavigate();
  useEffect(() => {
    hydrate();
    const consume = async () => {
      const packed = readShareParam();
      if (!packed) return;
      const locRaw = useAppStore.getState().settings.locale;
      const loc = isLocale(locRaw) ? locRaw : "en";
      try {
        const play = await unpackPlay(packed);
        const id = importPlay(play);
        clearShareParam();
        toast(translate(loc, "toast.playLink"));
        void navigate({ to: "/playbook/$playId", params: { playId: id } });
      } catch {
        clearShareParam();
        toast(translate(loc, "toast.playLinkFail"));
      }
    };
    void consume();
    const onHash = () => void consume();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [hydrate, importPlay, navigate]);
  return null;
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      {
        name: "description",
        content: "Visual drill software. Draw set plays and drills on a FIBA court, then run timed practice.",
      },
      { name: "theme-color", content: "#07102c" },
      { name: "application-name", content: APP_NAME },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg?v=courtops" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700;1,800&family=Barlow:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-transparent text-fg">
        <PreviewHostBridge />
        <AuthProvider>
          <BrandTheme />
          <HydrateStore />
          <Splash />
          <Outlet />
          <Toaster
            theme="light"
            position="top-center"
            toastOptions={{
              className: "rounded-[22px] border-0 bg-white text-[#07102c] shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_2px_3px_rgba(80,45,10,.18),0_18px_34px_-14px_rgba(80,45,10,.55)]",
            }}
          />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
