"use client";

import { useTranslations } from "next-intl";
import { Sun } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { Link } from "@/lib/i18n/navigation";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">
              OpenSolarCheck – {t("footer.tagline")}
            </span>
          </div>

          {/* Center */}
          <nav className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/impressum" className="hover:text-gray-700">
              {t("nav.imprint")}
            </Link>
            <Link href="/datenschutz" className="hover:text-gray-700">
              {t("nav.privacy")}
            </Link>
            <Link href="/methodik" className="hover:text-gray-700">
              {t("nav.methodology")}
            </Link>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Koschi7/opensolarcheck"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
            >
              <GitHubIcon className="h-4 w-4" />
              GitHub
            </a>
            <span className="text-xs text-gray-400">
              Made with <Sun className="inline h-3 w-3 text-amber-500" /> and
              Open Source
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
