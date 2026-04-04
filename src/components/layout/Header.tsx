"use client";

import { useTranslations } from "next-intl";
import { Sun, Menu } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto relative flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Sun className="h-8 w-8 text-amber-500" />
          <span className="text-xl font-bold text-blue-800">OpenSolarCheck</span>
        </Link>

        {/* Desktop Navigation – absolutely centered */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-blue-800 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href="https://github.com/Koschi7/opensolarcheck"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6 pt-5">
              <SheetTitle className="flex items-center gap-2 pr-8 pb-4 border-b">
                <Sun className="h-6 w-6 text-amber-500" />
                <span className="font-bold text-blue-800">OpenSolarCheck</span>
              </SheetTitle>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 rounded-lg px-3 py-2.5 -mx-1"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="border-t pt-3 flex flex-col gap-1">
                {legalItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg px-3 py-2 -mx-1"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto border-t pt-4 flex items-center justify-between">
                <a
                  href="https://github.com/Koschi7/opensolarcheck"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
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
