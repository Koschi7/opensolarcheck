"use client";

import { useTranslations } from "next-intl";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { Link } from "@/lib/i18n/navigation";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="rule-t bg-paper">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-display text-[15px] font-medium text-ink">
              OpenSolarCheck
            </div>
            <p className="mt-2 text-[13px] text-muted-ink max-w-sm leading-relaxed">
              {t("footer.tagline")} — {t("privacy.overview.local")}
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="small-caps text-[11px] text-faint-ink mb-3">
              Navigation
            </div>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link href="/konfigurator" className="text-muted-ink hover:text-ink">
                  {t("nav.configurator")}
                </Link>
              </li>
              <li>
                <Link href="/methodik" className="text-muted-ink hover:text-ink">
                  {t("nav.methodology")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="small-caps text-[11px] text-faint-ink mb-3">Legal</div>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link href="/impressum" className="text-muted-ink hover:text-ink">
                  {t("nav.imprint")}
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-muted-ink hover:text-ink">
                  {t("nav.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="small-caps text-[11px] text-faint-ink mb-3">Source</div>
            <a
              href="https://github.com/Koschi7/opensolarcheck"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[13px] text-muted-ink hover:text-ink"
            >
              <GitHubIcon className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-10 pt-4 rule-t flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div className="font-mono-ui text-[11px] text-faint-ink tracking-wide">
            © {year} OpenSolarCheck — MIT License
          </div>
          <div className="font-mono-ui text-[11px] text-faint-ink tracking-wide">
            PVGIS · HTW Berlin · Fraunhofer ISE · BDEW H0
          </div>
        </div>
      </div>
    </footer>
  );
}
