"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { trackEvent } = useAnalytics();

  const switchLocale = (newLocale: string) => {
    trackEvent({ name: "language_switched", data: { locale: newLocale } });
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-gray-50 p-0.5">
      <Button
        variant={locale === "de" ? "default" : "ghost"}
        size="sm"
        onClick={() => switchLocale("de")}
        className="h-7 px-2 text-xs"
      >
        DE
      </Button>
      <Button
        variant={locale === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => switchLocale("en")}
        className="h-7 px-2 text-xs"
      >
        EN
      </Button>
    </div>
  );
}
