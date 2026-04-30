"use client";

import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactModal from "@/components/ContactModal";

function CornerBracket({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M1 15L1 1L15 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const contactInfo = [
  { label: "E-mail", value: "harvey@hstudio.com", href: "mailto:harvey@hstudio.com" },
  { label: "Instagram", value: "@hstudio", href: "#" },
  { label: "LinkedIn", value: "Harvey Specter", href: "#" },
  { label: "Locatie", value: "Chicago, IL", href: null },
  { label: "Beschikbaarheid", value: "Open voor projecten", href: null },
];

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [navDark, setNavDark] = useState(true);

  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [bericht, setBericht] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Navbar kleur
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];

    document.querySelectorAll("[data-contact-light]").forEach((section) => {
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

  // Nav hover
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // TODO: koppel hier een e-maildienst (bijv. Resend, Formspree)
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

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
          <a href="/" className={`font-semibold text-[16px] tracking-[-0.64px] capitalize ${navTextClass}`}>H.Studio</a>

          <div className={`hidden md:flex gap-14 items-center font-semibold text-[16px] tracking-[-0.64px] capitalize ${navTextClass}`}>
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} className={`relative pb-[2px] ${label === "Contact" ? "opacity-50 pointer-events-none" : ""}`} data-nav-link>
                {label}
                <span className={navUnderlineClass} data-underline />
              </a>
            ))}
          </div>

          <button className={navBtnClass} data-btn onClick={() => setModalOpen(true)}>
            Let&apos;s talk
          </button>

          <button className={`md:hidden cursor-pointer ${navTextClass}`} aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </header>

      <main className="bg-[#fafafa] relative z-10">

        {/* Mobile menu */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col px-6 pt-6 pb-10 md:hidden">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[16px] tracking-[-0.64px] capitalize text-white">H.Studio</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="cursor-pointer text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-6 mt-16">
              {navLinks.map(([label, href]) => (
                <a key={label} href={href} onClick={() => setMenuOpen(false)} className="font-semibold text-[36px] tracking-[-0.04em] capitalize text-white inline-block">
                  {label}
                </a>
              ))}
            </nav>
            <div className="mt-auto">
              <button onClick={() => { setMenuOpen(false); setModalOpen(true); }} className="bg-white text-black font-medium text-[14px] tracking-[-0.56px] px-5 py-3 rounded-[24px] cursor-pointer">
                Let&apos;s talk
              </button>
            </div>
          </div>
        )}

        {/* ── Hero: donker ── */}
        <section className="bg-black min-h-[60vh] flex flex-col justify-end px-4 pb-16 md:px-8 md:pb-20 pt-32 relative overflow-hidden">
          <p
            className="absolute right-4 md:right-8 bottom-8 font-black text-white/5 leading-none select-none pointer-events-none"
            style={{ fontSize: "clamp(120px, 20vw, 280px)" }}
            aria-hidden
          >
            SAY<br />HI
          </p>
          <div className="relative flex flex-col gap-6">
            <p className="font-mono text-[14px] leading-[1.1] text-white/50 uppercase">[ contact ]</p>
            <h1
              className="font-light text-white uppercase tracking-[-0.08em] leading-[0.88]"
              style={{ fontSize: "clamp(56px, 10vw, 160px)" }}
            >
              Laten we<br />praten
            </h1>
            <a
              href="mailto:harvey@hstudio.com"
              className="font-mono text-[14px] text-white/40 hover:text-white/80 transition-colors tracking-wider mt-2"
            >
              harvey@hstudio.com
            </a>
          </div>
        </section>

        {/* ── Contact sectie: licht ── */}
        <section data-contact-light className="bg-[#fafafa] px-4 py-16 md:px-8 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl">

            {/* Links: contactinfo */}
            <div className="flex flex-col gap-10">
              <div>
                <p className="font-mono text-[11px] text-[#1f1f1f]/40 uppercase tracking-widest mb-6">[ gegevens ]</p>
                <div className="flex flex-col divide-y divide-[#1f1f1f]/8">
                  {contactInfo.map(({ label, value, href }) => (
                    <div key={label} className="flex items-center justify-between py-4">
                      <span className="font-mono text-[12px] text-[#1f1f1f]/40 uppercase tracking-wider">{label}</span>
                      {href ? (
                        <a href={href} className="font-medium text-[14px] text-[#1f1f1f] tracking-[-0.02em] hover:opacity-50 transition-opacity">
                          {value}
                        </a>
                      ) : (
                        <span className="font-medium text-[14px] text-[#1f1f1f] tracking-[-0.02em]">{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Decoratief kader */}
              <div className="relative border border-[#1f1f1f]/15 px-6 py-8 hidden md:block">
                <CornerBracket className="absolute top-3 left-3 text-[#1f1f1f]/20" />
                <CornerBracket className="rotate-90 absolute top-3 right-3 text-[#1f1f1f]/20" />
                <CornerBracket className="-rotate-90 absolute bottom-3 left-3 text-[#1f1f1f]/20" />
                <CornerBracket className="rotate-180 absolute bottom-3 right-3 text-[#1f1f1f]/20" />
                <p className="font-normal italic text-[15px] tracking-[-0.02em] leading-[1.6] text-[#1f1f1f]/60">
                  &ldquo;Good suits are a must. So is a great brief. Let&apos;s start with the latter.&rdquo;
                </p>
              </div>
            </div>

            {/* Rechts: formulier */}
            <div>
              <p className="font-mono text-[11px] text-[#1f1f1f]/40 uppercase tracking-widest mb-6">[ stuur een bericht ]</p>

              {sent ? (
                <div className="flex flex-col gap-5 py-12 items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 11l5 5 9-9" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-[20px] tracking-[-0.04em]">Bericht verzonden!</h3>
                  <p className="text-[14px] text-[#1f1f1f]/55 leading-[1.6] max-w-sm">
                    Bedankt voor je bericht. Ik neem zo snel mogelijk contact met je op.
                  </p>
                  <button
                    onClick={() => { setSent(false); setNaam(""); setEmail(""); setBericht(""); }}
                    className="mt-4 border border-[#1f1f1f]/20 text-[#1f1f1f] font-medium text-[14px] tracking-[-0.56px] px-6 py-3 rounded-[24px] cursor-pointer hover:border-black transition-colors"
                  >
                    Nieuw bericht
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#1f1f1f]/40">Naam</label>
                    <input
                      type="text" required value={naam} onChange={(e) => setNaam(e.target.value)}
                      placeholder="Jouw naam"
                      className="border border-[#e0e0e0] rounded-xl px-4 py-3.5 text-[14px] text-[#1f1f1f] placeholder:text-[#1f1f1f]/25 focus:outline-none focus:border-black transition-colors bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#1f1f1f]/40">E-mail</label>
                    <input
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="jouw@email.nl"
                      className="border border-[#e0e0e0] rounded-xl px-4 py-3.5 text-[14px] text-[#1f1f1f] placeholder:text-[#1f1f1f]/25 focus:outline-none focus:border-black transition-colors bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#1f1f1f]/40">Bericht</label>
                    <textarea
                      required value={bericht} onChange={(e) => setBericht(e.target.value)}
                      placeholder="Vertel iets over je project of vraag…"
                      rows={5}
                      className="border border-[#e0e0e0] rounded-xl px-4 py-3.5 text-[14px] text-[#1f1f1f] placeholder:text-[#1f1f1f]/25 focus:outline-none focus:border-black transition-colors resize-none bg-white"
                    />
                  </div>
                  <button
                    type="submit" disabled={sending}
                    className="mt-2 bg-black text-white font-medium text-[14px] tracking-[-0.56px] px-6 py-3.5 rounded-[24px] cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40"
                  >
                    {sending ? "Verzenden…" : "Versturen"}
                  </button>
                </form>
              )}
            </div>
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
