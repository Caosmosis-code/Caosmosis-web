"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MotionButton } from "@/components/EditorialMotion";

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  return (
    <form
      role="search"
      className={`search-box ${compact ? "search-box-compact" : ""}`}
      onSubmit={(event) => { event.preventDefault(); if (query.trim()) router.push(`/buscar?q=${encodeURIComponent(query.trim())}`); }}
    >
      <label className="sr-only" htmlFor="site-search">Buscar artículos</label>
      <input id="site-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar" />
      <button aria-label="Buscar" type="submit"><SearchIcon /></button>
    </form>
  );
}

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);
  return (
    <form className={`newsletter-form ${compact ? "newsletter-form-compact" : ""}`} onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
      {sent ? <p role="status" className="newsletter-success">Gracias por tu interés. La suscripción estará disponible pronto.</p> : <>
        <label className="sr-only" htmlFor={compact ? "newsletter-footer" : "newsletter-hero"}>Tu correo electrónico</label>
        <input id={compact ? "newsletter-footer" : "newsletter-hero"} type="email" required placeholder="Tu correo electrónico" />
        <MotionButton type="submit" className="button button-dark">Suscribirme <span aria-hidden="true">↗</span></MotionButton>
      </>}
    </form>
  );
}

export function SectionHeading({ eyebrow, title, href, linkLabel = "Ver todo" }: { eyebrow?: string; title: string; href?: string; linkLabel?: string }) {
  return <div className="section-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2></div>{href && <Link href={href}>{linkLabel} <span aria-hidden="true">↗</span></Link>}</div>;
}

function SearchIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="icon"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7"/><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;
}
