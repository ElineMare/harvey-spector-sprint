"use client";

import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { client } from "@/lib/sanity";
import ContactModal from "@/components/ContactModal";

const defaultNewsItems = [
  { img: "https://www.figma.com/api/mcp/asset/1ddc155b-64a8-47e3-b15c-0e3ff824e758", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { img: "https://www.figma.com/api/mcp/asset/7a25ac24-9f6f-43b5-9f34-3097b22a959c", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { img: "https://www.figma.com/api/mcp/asset/e787b73f-24e5-4c4e-8c03-38f783209bd8", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
];

const nieuwsQuery = `*[_type == "newsItem"] | order(order asc) { imageUrl, text }`;

function ArrowDiagonal({ className = "" }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className={className} aria-hidden>
      <path d="M6 22L22 6M22 6H10M22 6V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function NieuwsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navDark, setNavDark] = useState(true);
  const [newsItems, setNewsItems] = useState(defaultNewsItems);
  const [modalOpen, setModalOpen] = useState(false);

  // Sanity fetch
  useEffect(() => {
    if (!client) return;
    client.fetch(nieuwsQuery).then((data) => {
      if (data?.length > 0) {
        setNewsItems(data.map((n: { imageUrl: string; text: string }) => ({
          img: n.imageUrl, text: n.text,
        })));
      }
    }).catch(() => {});
  }, []);

  // Navbar kleur
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];

    document.querySelectorAll("[data-nieuws-light]").forEach((section) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top 72px",
          end: "bottom 0px",
          onEnter: () => setNavDark(false),
          onLeave: () => setNavDark(true),
          onEnterBack: () => setNavDark(false),
          onLeaveBack: () => setNavDark(true),
        })
      );
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  // Nav hover: underline + button scale
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      const underline = link.querySelector("[data-underline]") as HTMLElement | null;
      if (!underline) return;
      gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });
      const enter = () => gsap.to(underline, { scaleX: 1, duration: 0.25, ease: "power2.out" });
      const leave = () => gsap.to(underline, { scaleX: 0, duration: 0.2, ease: "power2.in" });
      link.addEventListener("mouseenter", enter);
      link.addEventListener("mouseleave", leave);
      cleanups.push(() => { link.removeEventListener("mouseenter", enter); link.removeEventListener("mouseleave", leave); });
    });

    const btn = document.querySelector("[data-btn]") as HTMLElement | null;
    if (btn) {
      const enter = () => gsap.to(btn, { scale: 1.05, duration: 0.2, ease: "power2.out" });
      const leave = () => gsap.to(btn, { scale: 1, duration: 0.2, ease: "power2.in" });
      btn.addEventListener("mouseenter", enter);
      btn.addEventListener("mouseleave", leave);
      cleanups.push(() => { btn.removeEventListener("mouseenter", enter); btn.removeEventListener("mouseleave", leave); });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [navDark]);

  // Nieuws card hover: subtiele schaal op foto
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    document.querySelectorAll("[data-nieuws-card]").forEach((card) => {
      const img = card.querySelector("img");
      if (!img) return;
      const enter = () => gsap.to(img, { scale: 1.04, duration: 0.5, ease: "power2.out" });
      const leave = () => gsap.to(img, { scale: 1, duration: 0.5, ease: "power2.out" });
      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
      cleanups.push(() => { card.removeEventListener("mouseenter", enter); card.removeEventListener("mouseleave", leave); });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [newsItems]);

  const navTextClass = `transition-colors duration-300 ${navDark ? "text-white" : "text-black"}`;
  const navUnderlineClass = "absolute bottom-0 left-0 w-full h-[1px] block bg-current";
  const navBtnClass = `hidden md:flex font-medium text-[14px] tracking-[-0.56px] px-4 py-3 rounded-[24px] cursor-pointer transition-colors duration-300 ${navDark ? "bg-white text-black" : "bg-black text-white"}`;

  const navLinks: [string, string][] = [["Over", "/over"], ["Services", "/services"], ["Projects", "/projects"], ["Nieuws", "/nieuws"], ["Contact", "/contact"]];

  return (
    <>
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      {/* ── Fixed Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8">
        <nav className="flex items-center justify-between py-6 w-full">
          <a href="/" className={`font-semibold text-[16px] tracking-[-0.64px] capitalize ${navTextClass}`}>
            H.Studio
          </a>

          <div className={`hidden md:flex gap-14 items-center font-semibold text-[16px] tracking-[-0.64px] capitalize ${navTextClass}`}>
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} className={`relative pb-[2px] ${label === "Nieuws" ? "opacity-50 pointer-events-none" : ""}`} data-nav-link>
                {label}
                <span className={navUnderlineClass} data-underline />
              </a>
            ))}
          </div>

          <button className={navBtnClass} data-btn onClick={() => setModalOpen(true)}>Let&apos;s talk</button>

          <button className={`md:hidden cursor-pointer ${navTextClass}`} aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </header>

      <main className="bg-[#fafafa] relative z-10">

        {/* ── Mobile menu ── */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col px-6 pt-6 pb-10 md:hidden">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[16px] tracking-[-0.64px] capitalize text-white">H.Studio</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="cursor-pointer text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-6 mt-16">
              {navLinks.map(([label, href]) => (
                <a key={label} href={href} onClick={() => setMenuOpen(false)}
                  className="font-semibold text-[36px] tracking-[-0.04em] capitalize text-white inline-block">
                  {label}
                </a>
              ))}
            </nav>
            <div className="mt-auto">
              <button className="bg-white text-black font-medium text-[14px] tracking-[-0.56px] px-5 py-3 rounded-[24px] cursor-pointer">
                Let&apos;s talk
              </button>
            </div>
          </div>
        )}

        {/* ── Hero: donker ── */}
        <section className="bg-black min-h-[60vh] flex flex-col justify-end px-4 pb-16 md:px-8 md:pb-20 pt-32 relative overflow-hidden">
          <p
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 font-black text-white/5 leading-none select-none pointer-events-none"
            style={{ fontSize: "clamp(160px, 25vw, 360px)" }}
            aria-hidden
          >
            {String(newsItems.length).padStart(3, "0")}
          </p>

          <div className="relative flex flex-col gap-6">
            <p className="font-mono text-[14px] leading-[1.1] text-white/50 uppercase">[ nieuws ]</p>
            <h1
              className="font-light text-white uppercase tracking-[-0.08em] leading-[0.88]"
              style={{ fontSize: "clamp(56px, 10vw, 160px)" }}
            >
              Nieuws &amp;<br />Prestaties
            </h1>
            <p className="font-mono text-[13px] text-white/40 uppercase tracking-widest">
              {String(newsItems.length).padStart(3, "0")} berichten
            </p>
          </div>
        </section>

        {/* ── Nieuwsberichten grid: licht ── */}
        <section data-nieuws-light className="bg-[#fafafa] px-4 py-12 md:px-8 md:py-20">

          {/* Desktop: 3-koloms grid, mobile: 1 kolom */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {newsItems.map((item, i) => (
              <article
                key={i}
                data-nieuws-card
                className="flex flex-col gap-4 cursor-pointer group"
              >
                {/* Foto */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={item.img}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                  />
                  {/* Dunne overlay bij hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
                </div>

                {/* Tekst */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#1f1f1f]/40 uppercase tracking-widest">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ArrowDiagonal className="w-4 h-4 text-[#1f1f1f]/30 group-hover:text-[#1f1f1f] transition-colors duration-300" />
                  </div>
                  <p className="text-[15px] text-[#1f1f1f] leading-[1.5] tracking-[-0.02em]">
                    {item.text}
                  </p>
                </div>

                {/* Scheidingslijn */}
                <div className="h-px bg-[#1f1f1f]/10 group-hover:bg-[#1f1f1f]/30 transition-colors duration-300 mt-auto" />
              </article>
            ))}
          </div>

          {/* Lege staat */}
          {newsItems.length === 0 && (
            <p className="font-mono text-[14px] text-[#1f1f1f]/40 uppercase text-center py-20">
              Geen berichten gevonden
            </p>
          )}
        </section>

        {/* ── CTA sectie: donker ── */}
        <section className="bg-black px-4 py-20 md:px-8 md:py-28 flex flex-col gap-12 items-start">
          <p className="font-mono text-[14px] leading-[1.1] text-white/50 uppercase">[ contact ]</p>
          <h2
            className="font-light text-white uppercase tracking-[-0.08em] leading-[0.9] max-w-3xl"
            style={{ fontSize: "clamp(36px, 6vw, 96px)" }}
          >
            Wil je samenwerken?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-black font-medium text-[14px] tracking-[-0.56px] px-6 py-3 rounded-[24px] cursor-pointer hover:opacity-80 transition-opacity">
              Let&apos;s talk
            </button>
            <a href="/over" className="flex items-center gap-2 font-medium text-[14px] tracking-[-0.56px] text-white/60 hover:text-white transition-colors">
              Over mij <ArrowDiagonal className="w-5 h-5" />
            </a>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="sticky bottom-0 z-0 bg-black px-4 py-10 md:px-8 md:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-[16px] tracking-[-0.64px] text-white">H.Studio</p>
            <p className="font-mono text-[12px] text-white/40 uppercase">Creative Director — Chicago</p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} className="font-medium text-[14px] tracking-[-0.56px] text-white/50 hover:text-white transition-colors capitalize">
                {label}
              </a>
            ))}
          </nav>
          <p className="font-mono text-[11px] text-white/25 uppercase">© {new Date().getFullYear()} H.Studio</p>
        </div>
      </footer>
    </>
  );
}
