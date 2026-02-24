"use client";

import { useEffect, type ReactNode } from "react";
import type {
  DocumentMetaEntry,
  DocumentNavItem,
  FooterColumnData,
  HeaderNavItem,
} from "./types";

const cx = (...classes: Array<string | undefined | false>) => classes.filter(Boolean).join(" ");

export function DocumentPage({ children }: { children: ReactNode }) {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(
      ".section[id], .section__subtitle[id], .section__sub-subtitle[id]"
    );
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".side-nav a[href^='#']");

    const setActiveNav = (id: string | null) => {
      navLinks.forEach((link) => {
        link.classList.remove("active", "active-parent");
      });

      if (!id) return;
      const activeLink = document.querySelector<HTMLAnchorElement>(`.side-nav a[href=\"#${id}\"]`);
      if (!activeLink) return;

      activeLink.classList.add("active");
      const parentId = activeLink.dataset.parent;
      if (!parentId) return;

      const parentLink = document.querySelector<HTMLAnchorElement>(
        `.side-nav a[href=\"#${parentId}\"]`
      );
      parentLink?.classList.add("active-parent");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveNav(entry.target.getAttribute("id"));
        });
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}

type DocumentHeaderProps = {
  brandHref?: string;
  logoSrc: string;
  logoAlt: string;
  logoHeight?: number;
  department?: string;
  navLinks?: HeaderNavItem[];
  navAriaLabel?: string;
};

export function DocumentHeader({
  brandHref = "/",
  logoSrc,
  logoAlt,
  logoHeight = 11,
  department,
  navLinks = [],
  navAriaLabel = "Primary navigation",
}: DocumentHeaderProps) {
  return (
    <header className="cds--header" role="banner">
      <a className="cds--header__name" href={brandHref} aria-label={logoAlt}>
        <img src={logoSrc} alt={logoAlt} style={{ height: logoHeight }} />
      </a>
      {department ? <span className="cds--header__dept">{department}</span> : null}
      <nav className="cds--header__nav" aria-label={navAriaLabel}>
        {navLinks.map((link) => (
          <a className={link.active ? "active" : undefined} href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

type DocumentHeroProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  meta?: DocumentMetaEntry[];
};

export function DocumentHero({ eyebrow, title, subtitle, meta = [] }: DocumentHeroProps) {
  return (
    <section className="hero" role="banner">
      <div className="hero__grid-overlay" aria-hidden="true" />
      <div className="cds--grid">
        <div className="hero__inner">
          <div className="hero__eyebrow">{eyebrow}</div>
          <h1 className="hero__title">{title}</h1>
          <p className="hero__subtitle">{subtitle}</p>
        </div>
        {meta.length ? (
          <div className="hero__meta">
            {meta.map((item) => (
              <div className="hero__meta-item" key={item.label}>
                <span className="hero__meta-label">{item.label}</span>
                <span className="hero__meta-value">{item.value}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function DocumentLayout({
  sideNav,
  children,
}: {
  sideNav: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="page-layout">
      {sideNav}
      {children}
    </div>
  );
}

type DocumentSideNavProps = {
  heading?: string;
  items: DocumentNavItem[];
  ariaLabel?: string;
};

export function DocumentSideNav({
  heading = "Contents",
  items,
  ariaLabel = "Document sections",
}: DocumentSideNavProps) {
  return (
    <aside className="side-nav" id="sideNav" role="navigation" aria-label={ariaLabel}>
      <div className="side-nav__heading">{heading}</div>
      {items.map((item) => {
        const itemVariant = item.variant ?? (item.parentId ? "child" : "title");
        const className = itemVariant === "child" ? "indent" : "side-nav__title";

        return (
          <a
            className={className}
            data-parent={item.parentId}
            href={item.href ?? `#${item.id}`}
            key={`${item.id}-${item.label}`}
          >
            {item.label}
          </a>
        );
      })}
    </aside>
  );
}

export function DocumentMain({ children }: { children: ReactNode }) {
  return (
    <main className="main-content" role="main">
      {children}
    </main>
  );
}

type DocumentSectionProps = {
  id: string;
  title: ReactNode;
  eyebrow?: ReactNode;
  titleVariant?: "default" | "lead";
  children: ReactNode;
};

export function DocumentSection({
  id,
  title,
  eyebrow,
  titleVariant = "default",
  children,
}: DocumentSectionProps) {
  return (
    <section className="section" id={id}>
      {eyebrow ? <div className="section__eyebrow">{eyebrow}</div> : null}
      <h2 className={cx("section__title", titleVariant === "lead" && "section__title--lead")}>{title}</h2>
      {children}
    </section>
  );
}

export function DocumentSectionSubtitle({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <h3 className="section__subtitle" id={id}>
      {children}
    </h3>
  );
}

export function DocumentSectionSubSubtitle({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <h4 className="section__sub-subtitle" id={id}>
      {children}
    </h4>
  );
}

export function DocumentFooter({ columns }: { columns: FooterColumnData[] }) {
  return (
    <footer className="page-footer" role="contentinfo">
      <div className="cds--grid">
        {columns.map((column) => (
          <div className="footer__col" key={column.heading}>
            <div className="footer__heading">{column.heading}</div>
            {column.lines.map((line) => (
              <div className="footer__text" key={`${column.heading}-${line}`}>
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
