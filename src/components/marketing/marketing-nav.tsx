"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { paths } from "@/paths";

const mainLinks = [
  { href: paths.marketing.howItWorks, label: "How it works" },
  { href: paths.marketing.comDash, label: "ComDash" },
  { href: paths.marketing.forChambers, label: "For chambers" },
];

export function MarketingNav() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const current = (href: string) => (pathname === href ? ("page" as const) : undefined);

  // Client-side navigation keeps this layout mounted, so the phone menu has to
  // be closed explicitly when the route changes.
  useEffect(() => {
    if (menuRef.current) menuRef.current.open = false;
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const menu = menuRef.current;
      if (event.key !== "Escape" || !menu?.open) return;
      menu.open = false;
      menu.querySelector("summary")?.focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function closeMenu() {
    if (menuRef.current) menuRef.current.open = false;
  }

  return (
    <header className="cl-site-nav">
      <div className="cl-nav-in">
        <Link className="cl-nav-brand" href={paths.home} aria-label="ComLinked home">
          <Image
            src="/assets/comlinked-logo.png"
            alt="ComLinked"
            width={160}
            height={32}
            priority
          />
        </Link>
        <nav aria-label="Main" className="cl-nav-desk">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              className="cl-nav-link"
              href={link.href}
              aria-current={current(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="cl-nav-act cl-nav-desk">
          <Link
            className="cl-nav-link"
            href={paths.auth.signIn}
            aria-current={current(paths.auth.signIn)}
          >
            Sign in
          </Link>
          <Link className="cl-btn cl-nav-cta" href={paths.marketing.join}>
            Join free
          </Link>
        </div>
        <details ref={menuRef} className="cl-mnav cl-nav-mob">
          <summary aria-label="Menu">
            <span className="cl-mnav-ico" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            Menu
          </summary>
          <div className="cl-mnav-panel">
            <nav aria-label="Main menu">
              {[...mainLinks, { href: paths.auth.signIn, label: "Sign in" }].map((link) => (
                <Link
                  key={link.href}
                  className="cl-mnav-link"
                  href={link.href}
                  aria-current={current(link.href)}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link
              className="cl-btn cl-nav-cta cl-mnav-cta"
              href={paths.marketing.join}
              onClick={closeMenu}
            >
              Join ComLinked free
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
