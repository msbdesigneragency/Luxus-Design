"use client";
import { useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { locales, type Locale } from "@/lib/i18n";

export function DesktopLanguage({ locale, label, onChange }: { locale: Locale; label: string; onChange: (value: string) => void }) {
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node) && menu.current) menu.current.open = false;
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  return <details ref={menu} className="desktop-language-menu" onKeyDown={event => {
    if (event.key === "Escape" && menu.current) {
      menu.current.open = false;
      menu.current.querySelector("summary")?.focus();
    }
  }}>
    <summary aria-label={label}>{locale.toUpperCase()}<ChevronDown size={13} /></summary>
    <div className="desktop-language-options" aria-label={label}>
      {locales.map(language => <button key={language} type="button" aria-pressed={language === locale} onClick={() => {
        if (menu.current) menu.current.open = false;
        if (language !== locale) onChange(language);
      }}>{language.toUpperCase()}{language === locale && <Check size={12} />}</button>)}
    </div>
  </details>;
}
