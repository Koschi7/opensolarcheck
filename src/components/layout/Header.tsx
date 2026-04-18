"use client";

import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/konfigurator", label: t("configurator") },
    { href: "/methodik", label: t("methodology") },
  ];

  const legalItems = [
    { href: "/datenschutz", label: t("privacy") },
    { href: "/impressum", label: t("imprint") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80 rule-b">
      <div className="mx-auto flex h-14 items-center justify-between px-5 md:px-8 max-w-[1400px]">
        <Link
          href="/"
          className="flex items-baseline gap-2 group"
          aria-label="OpenSolarCheck"
        >
          <span className="font-display text-[15px] font-medium tracking-tight text-ink">
            OpenSolarCheck
          </span>
          <span className="hidden sm:inline font-mono-ui text-[11px] text-faint-ink">
            v1.0
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] text-muted-ink hover:text-ink transition-colors tracking-tight"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <LanguageSwitcher />
          <span className="h-3 w-px bg-rule" aria-hidden="true" />
          <a
            href="https://github.com/Koschi7/opensolarcheck"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-ink hover:text-ink transition-colors"
            aria-label="GitHub"
          >
            <GitHubIcon className="h-[18px] w-[18px]" />
          </a>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex items-center justify-center p-2 text-muted-ink hover:text-ink"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(88vw,340px)] p-0 bg-paper border-l border-rule"
            >
              <div className="flex items-center justify-between px-6 h-14 rule-b">
                <SheetTitle className="font-display text-[15px] font-medium text-ink">
                  OpenSolarCheck
                </SheetTitle>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-ink hover:text-ink"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col">
                {navItems.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-baseline gap-4 px-6 py-5 rule-b text-ink hover:bg-secondary transition-colors ${
                      i === 0 ? "rule-t" : ""
                    }`}
                  >
                    <span className="font-mono-ui text-[11px] text-faint-ink w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[17px]">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col px-6 pt-6 gap-3">
                {legalItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-[13px] text-muted-ink hover:text-ink"
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href="https://github.com/Koschi7/opensolarcheck"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[13px] text-muted-ink hover:text-ink mt-2"
                >
                  <GitHubIcon className="h-4 w-4" />
                  GitHub
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
