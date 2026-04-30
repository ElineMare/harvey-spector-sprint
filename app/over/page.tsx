"use client";

import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactModal from "@/components/ContactModal";

const heroImage = "https://www.figma.com/api/mcp/asset/81b225f4-a09b-49a1-b427-30d4e9126536";
const aboutImage = "https://www.figma.com/api/mcp/asset/d133f71b-8ebb-4ab4-bab1-5cfa36a1ff7e";
const fullBleedImage = "https://www.figma.com/api/mcp/asset/c92c7704-4d6e-424d-b0ff-eae0512604e7";

function CornerBracket({ className = "", color = "#1f1f1f" }: { className?: string; color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M1 15L1 1L15 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowDiagonal({ className = "" }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className={className} aria-hidden>
      <path d="M6 22L22 6M22 6H10M22 6V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const timeline = [
  { year: "2012", title: "Start", desc: "Begon als junior creative bij een klein bureau in Chicago. Eerste stappen in branding en fotografie." },
  { year: "2015", title: "Freelance", desc: "Stapte over naar freelance. Eerste internationale opdrachten voor merken in Europa en de VS." },
  { year: "2018", title: "H.Studio", desc: "Richtte H.Studio op — een full-service creatief bureau dat design, fotografie en strategie combineert." },
  { year: "2021", title: "Award", desc: "Winnaar van de D&AD Pencil voor Brand Identity. Erkend als een van de top 50 creative directors onder 40." },
  { year: "2024", title: "Nu", desc: "Werkt samen met toonaangevende merken wereldwijd. Focus op visuele identiteit en digitale ervaringen." },
];

export default function OverPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navDark, setNavDark] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Navbar kleur op basis van donkere secties
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];
    document.querySelectorAll("[data-over-dark]").forEach((section) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top 72px",
          end: "bottom 0px",
          onEnter: () => setNavDark(true),
          onLeave: () => setNavDark(false),
          onEnterBack: () => setNavDark(true),
          onLeaveBack: () => setNavDark(false),
        })
      );
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);

  // Navbar hover: underline + button scale
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      const underline = link.querySelector("[data-underline]") as HTMLElement;
      gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });
      const enter = () => { gsap.killTweensOf(underline); gsap.to(underline, { scaleX: 1, duration: 0.3, ease: "power3.out", transformOrigin: "left center" }); };
      const leave = () => { gsap.killTweensOf(underline); gsap.to(underline, { scaleX: 0, duration: 0.2, ease: "power3.in", transformOrigin: "right center" }); };
      link.addEventListener("mouseenter", enter);
      link.addEventListener("mouseleave", leave);
      cleanups.push(() => { link.removeEventListener("mouseenter", enter); link.removeEventListener("mouseleave", leave); });
    });
    document.querySelectorAll("[data-btn]").forEach((btn) => {
      const enter = () => gsap.to(btn, { scale: 1.05, duration: 0.2, ease: "back.out(2)" });
      const leave = () => gsap.to(btn, { scale: 1, duration: 0.2, ease: "power2.inOut" });
      btn.addEventListener("mouseenter", enter);
      btn.addEventListener("mouseleave", leave);
      cleanups.push(() => { btn.removeEventListener("mouseenter", enter); btn.removeEventListener("mouseleave", leave); });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  // Mobile menu hover
  useEffect(() => {
    if (!menuOpen) return;
    const cleanups: (() => void)[] = [];
    document.querySelectorAll("[data-mobile-nav-link]").forEach((link) => {
      const enter = () => gsap.to(link, { x: 12, duration: 0.2, ease: "power2.out" });
      const leave = () => gsap.to(link, { x: 0, duration: 0.2, ease: "power2.in" });
      link.addEventListener("mouseenter", enter);
      link.addEventListener("mouseleave", leave);
      cleanups.push(() => { link.removeEventListener("mouseenter", enter); link.removeEventListener("mouseleave", leave); gsap.set(link, { x: 0 }); });
    });
    return () => cleanups.forEach((fn) => fn());
  }, [menuOpen]);

  // Bio tekst fill scrub
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const container = document.querySelector("[data-bio-tagline]");
    if (!container) return;
    const lines = container.querySelectorAll("[data-bio-line]");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: container, start: "top 85%", end: "bottom 30%", scrub: 1.2 },
    });
    lines.forEach((line, i) => {
      tl.fromTo(line, { color: "#d0d0d0" }, { color: "#1f1f1f", duration: 1 }, i * 0.6);
    });
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);

  // Blur reveal op full-bleed image
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const img = document.querySelector("[data-over-blur-img]");
    const section = document.querySelector("[data-over-blur-section]");
    if (!img || !section) return;
    gsap.set(img, { filter: "blur(20px)" });
    const tween = gsap.to(img, {
      filter: "blur(0px)", ease: "none",
      scrollTrigger: { trigger: section, start: "top bottom", end: "center center", scrub: 1 },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  const navTextClass = `transition-colors duration-300 ${navDark ? "text-white" : "text-black"}`;
  const navUnderlineClass = "absolute bottom-0 left-0 w-full h-[1px] block bg-current";
  const navBtnClass = `hidden md:flex font-medium text-[14px] tracking-[-0.56px] px-4 py-3 rounded-[24px] cursor-pointer transition-colors duration-300 ${navDark ? "bg-white text-black" : "bg-black text-white"}`;

  const navLinks = ["Home", "Over", "Services", "Projects", "Contact"];
  const navHrefs: Record<string, string> = {
    Home: "/", Over: "/over", Services: "/services", Projects: "/projects", Contact: "/#contact",
  };

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
            {navLinks.map((item) => (
              <a key={item} href={navHrefs[item]} className={`relative pb-[2px] ${item === "Over" ? "opacity-50 pointer-events-none" : ""}`} data-nav-link>
                {item}
                <span className={navUnderlineClass} data-underline />
              </a>
            ))}
          </div>
          <button className={navBtnClass} data-btn onClick={() => setModalOpen(true)}>Let&apos;s talk</button>
          <button className={`md:hidden cursor-pointer ${navTextClass}`} aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </header>

      {/* ── Mobile menu ── */}
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
            {navLinks.map((item) => (
              <a key={item} href={navHrefs[item]} onClick={() => setMenuOpen(false)}
                className="font-semibold text-[36px] tracking-[-0.04em] capitalize text-white inline-block"
                data-mobile-nav-link>
                {item}
              </a>
            ))}
          </nav>
          <div className="mt-auto">
            <button className="border border-white text-white font-medium text-[14px] tracking-[-0.56px] px-5 py-3 rounded-[24px] cursor-pointer" data-btn>
              Let&apos;s talk
            </button>
          </div>
        </div>
      )}

      <main className="bg-[#fafafa] relative z-10">

        {/* ── Hero ── */}
        <section className="relative h-screen flex flex-col items-center justify-end overflow-clip px-4 pb-10 md:px-8 md:pb-16 md:pt-[312px]">
          <div className="absolute inset-0">
            <img src={heroImage} alt="Harvey Specter" className="absolute inset-0 size-full object-cover object-top pointer-events-none" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-0 h-[50%] left-0 w-full pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(250,250,250,0.7) 60%, #fafafa 100%)" }} />
          </div>

          <div className="relative z-10 w-full flex flex-col items-center md:items-start gap-2">
            <p className="font-mono text-[14px] uppercase text-white/80 tracking-[-0.04em]">[ Who I am ]</p>
            <h1
              className="font-medium text-white mix-blend-overlay w-full capitalize md:text-left text-center"
              style={{ fontSize: "clamp(72px, 11vw, 180px)", letterSpacing: "-0.07em", lineHeight: "0.9" }}
            >
              Over
            </h1>
          </div>
        </section>

        {/* ── Bio staircase ── */}
        <section className="px-4 py-16 md:px-8 md:py-[120px] overflow-hidden">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-3 items-end w-full">
              <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] text-right uppercase">[ 8+ years in industry ]</p>
              <div className="w-full h-px bg-[#1f1f1f]" />
            </div>

            <div className="flex flex-col gap-2 items-center md:items-start" data-bio-tagline>
              <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] md:hidden">001</p>

              <div className="flex gap-3 items-start justify-center md:justify-start w-full">
                <p data-bio-line className="font-light leading-[0.84] tracking-[-0.08em] uppercase whitespace-nowrap"
                  style={{ fontSize: "clamp(28px, 5.5vw, 80px)" }}>
                  Creative director
                </p>
                <p className="hidden md:block font-mono text-[14px] leading-[1.1] text-[#1f1f1f] mt-1 shrink-0">001</p>
              </div>

              <div className="w-full flex justify-center md:block md:pl-[12%]">
                <p data-bio-line className="font-light leading-[0.84] tracking-[-0.08em] uppercase whitespace-nowrap"
                  style={{ fontSize: "clamp(28px, 5.5vw, 80px)" }}>
                  Photographer
                </p>
              </div>

              <div className="w-full flex justify-center md:block md:pl-[28%]">
                <p data-bio-line className="font-light leading-[0.84] tracking-[-0.08em] uppercase whitespace-nowrap"
                  style={{ fontSize: "clamp(28px, 5.5vw, 80px)" }}>
                  <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>&amp;</span>
                  {` Storyteller`}
                </p>
              </div>

              <div className="w-full flex justify-center md:block">
                <p data-bio-line className="font-light leading-[0.84] tracking-[-0.08em] uppercase whitespace-nowrap"
                  style={{ fontSize: "clamp(28px, 5.5vw, 80px)" }}>
                  Based in New York.
                </p>
              </div>

              <div className="hidden md:flex items-baseline gap-4 pl-[28%]">
                <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] whitespace-nowrap">[ creative freelancer ]</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Portrait + bio tekst ── */}
        <section className="px-4 py-12 md:px-8 md:py-20 flex flex-col md:flex-row gap-12 md:gap-16 items-start">

          {/* Foto */}
          <div className="w-full md:w-[45%] relative overflow-hidden aspect-[3/4] shrink-0">
            <img src={aboutImage} alt="Harvey Specter portrait" className="absolute inset-0 size-full object-cover" />
          </div>

          {/* Tekst */}
          <div className="flex flex-col gap-8 md:pt-16 flex-1">
            <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] uppercase">[ over harvey ]</p>

            <div className="flex gap-3 items-stretch max-w-[480px]">
              <div className="flex flex-col justify-between shrink-0">
                <CornerBracket />
                <CornerBracket className="-rotate-90" />
              </div>
              <div className="flex flex-col gap-5 py-3 flex-1">
                <p className="text-[15px] text-[#1f1f1f] leading-[1.5] tracking-[-0.56px]">
                  Harvey Specter is een creative director en fotograaf met meer dan acht jaar ervaring in het bouwen van krachtige visuele identiteiten. Van Chicago tot New York — zijn werk verbindt storytelling met strategie.
                </p>
                <p className="text-[15px] text-[#1f1f1f] leading-[1.5] tracking-[-0.56px]">
                  Met H.Studio brengt hij merken tot leven via branding, fotografie en digitale ervaringen die blijven hangen. Zijn aanpak is altijd menselijk, altijd precies — en nooit saai.
                </p>
              </div>
              <div className="flex flex-col justify-between shrink-0">
                <CornerBracket className="rotate-90" />
                <CornerBracket className="rotate-180" />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {[
                ["Locatie", "New York, NY"],
                ["Beschikbaar", "Q3 2025"],
                ["Talen", "EN / NL / DE"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-[#1f1f1f]/20 pb-3">
                  <span className="font-mono text-[12px] text-[#1f1f1f]/50 uppercase tracking-[-0.04em]">{label}</span>
                  <span className="font-medium text-[14px] text-[#1f1f1f] tracking-[-0.56px]">{value}</span>
                </div>
              ))}
            </div>

            <a href="/#contact" className="flex items-center gap-2 border-b border-black pb-1 self-start">
              <span className="font-medium text-[14px] text-black tracking-[-0.56px]">Plan een gesprek</span>
              <ArrowDiagonal className="w-[18px] h-[18px] text-black" />
            </a>
          </div>
        </section>

        {/* ── Full-bleed foto met blur reveal ── */}
        <section data-over-blur-section className="relative w-full h-[500px] md:h-[800px] overflow-hidden shrink-0">
          <img data-over-blur-img src={fullBleedImage} alt=""
            className="absolute inset-0 size-full object-cover object-[65%_center]" />
        </section>

        {/* ── Tijdlijn / Ervaring ── */}
        <section className="px-4 py-16 md:px-8 md:py-[120px]">
          <div className="flex flex-col gap-12 md:gap-0">
            <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between mb-12 md:mb-16">
              <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] uppercase">[ ervaring ]</p>
              <h2 className="font-light uppercase tracking-[-0.07em] leading-[0.9]"
                style={{ fontSize: "clamp(32px, 5vw, 72px)" }}>
                Een pad vol werk
              </h2>
            </div>

            <div className="flex flex-col">
              {timeline.map((item, i) => (
                <div key={item.year} className="flex flex-col md:flex-row md:items-start gap-4 md:gap-0 border-t border-[#1f1f1f]/20 py-8 group">
                  <span className="font-mono text-[12px] text-[#1f1f1f]/40 uppercase tracking-[-0.04em] md:w-[120px] shrink-0 pt-1">{item.year}</span>
                  <div className="flex flex-col md:flex-row gap-3 md:gap-16 flex-1">
                    <p className="font-bold italic text-[20px] text-[#1f1f1f] tracking-[-0.06em] uppercase leading-[1.1] md:w-[200px] shrink-0 transition-colors duration-300 group-hover:text-black">
                      {item.title}
                    </p>
                    <p className="text-[14px] text-[#1f1f1f] leading-[1.4] tracking-[-0.56px] flex-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Filosofie quote ── */}
        <section data-over-dark className="bg-black px-4 py-16 md:px-8 md:py-[120px]">
          <div className="flex flex-col gap-8 max-w-[900px]">
            <p className="font-mono text-[14px] leading-[1.1] text-white/40 uppercase">[ filosofie ]</p>
            <blockquote
              className="font-light text-white leading-[0.9] tracking-[-0.07em] uppercase"
              style={{ fontSize: "clamp(32px, 5.5vw, 80px)" }}
            >
              &ldquo;Goed design is niet wat mooi <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>oogt</span> — het is wat werkt, raakt en beklijft.&rdquo;
            </blockquote>
            <div className="flex items-center gap-4 pt-4">
              <div className="w-8 h-px bg-white/40" />
              <p className="font-mono text-[12px] text-white/40 uppercase tracking-[-0.04em]">Harvey Specter — H.Studio</p>
            </div>
          </div>
        </section>

        {/* ── Skills grid ── */}
        <section className="px-4 py-16 md:px-8 md:py-[120px]">
          <div className="flex flex-col gap-12">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] uppercase">[ expertise ]</p>
              <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f]/40">[ 6 disciplines ]</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
              {[
                { num: "01", name: "Brand Identity", desc: "Van strategie tot visueel systeem — merken die direct herkenbaar zijn." },
                { num: "02", name: "Photography", desc: "Editorial, portret en productfotografie met een scherp oog voor compositie." },
                { num: "03", name: "Art Direction", desc: "Regie over de volledige creatieve output — consistent en purposeful." },
                { num: "04", name: "Web Design", desc: "Digitale ervaringen die visueel kloppen én technisch solide zijn." },
                { num: "05", name: "Motion Design", desc: "Animaties en video die een merk leven inblazen." },
                { num: "06", name: "Consultancy", desc: "Strategisch advies over positionering, visuele taal en creatieve richting." },
              ].map((skill) => (
                <div key={skill.num} className="flex flex-col gap-3 border-t border-[#1f1f1f]/20 py-8 md:pr-8 group">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[12px] text-[#1f1f1f]/40 uppercase">{skill.num}</p>
                  </div>
                  <p className="font-bold italic text-[20px] text-[#1f1f1f] tracking-[-0.06em] uppercase leading-[1.1]">{skill.name}</p>
                  <p className="text-[13px] text-[#1f1f1f]/60 leading-[1.4] tracking-[-0.52px]">{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact CTA ── */}
        <section data-over-dark className="bg-black px-4 py-16 md:px-8 md:py-[120px] flex flex-col gap-8">
          <p className="font-mono text-[14px] leading-[1.1] text-white/40 uppercase">[ samenwerken ]</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <h2
              className="font-light text-white uppercase leading-[0.9] tracking-[-0.07em]"
              style={{ fontSize: "clamp(40px, 7vw, 110px)" }}
            >
              Heb je een<br />
              <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>project</span> in gedachten?
            </h2>
            <div className="flex flex-col gap-4 shrink-0">
              <button className="border border-white text-white font-medium text-[14px] tracking-[-0.56px] px-6 py-4 rounded-[32px] cursor-pointer hover:bg-white hover:text-black transition-colors self-start" data-btn>
                Let&apos;s talk
              </button>
              <p className="font-mono text-[12px] text-white/30 uppercase">hello@hstudio.com</p>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer data-over-dark className="sticky bottom-0 z-0 bg-black px-4 pt-12 lg:px-8 flex flex-col gap-12 lg:gap-[120px] overflow-hidden">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-3 shrink-0 lg:w-[298px]">
            <p className="font-light italic text-[24px] text-white tracking-[-0.96px] uppercase leading-[1.1]">
              Have a <span className="font-black not-italic">project</span> in mind?
            </p>
            <button className="border border-white text-white font-medium text-[14px] tracking-[-0.56px] px-4 py-3 rounded-[24px] self-start cursor-pointer hover:bg-white hover:text-black transition-colors">
              Let&apos;s talk
            </button>
          </div>
          <div className="flex flex-col gap-4 lg:hidden">
            {["Facebook", "Instagram", "x.com", "Linkedin"].map((s) => (
              <a key={s} href="#" className="text-white text-[18px] tracking-[-0.72px] uppercase leading-[1.1] hover:opacity-60 transition-opacity">{s}</a>
            ))}
          </div>
          <div className="hidden lg:block w-[298px] text-center">
            {["Facebook", "Instagram"].map((s) => (
              <a key={s} href="#" className="block text-white text-[18px] tracking-[-0.72px] uppercase leading-[1.1] hover:opacity-60 transition-opacity">{s}</a>
            ))}
          </div>
          <div className="hidden lg:block w-[298px] text-right">
            {["x.com", "Linkedin"].map((s) => (
              <a key={s} href="#" className="block text-white text-[18px] tracking-[-0.72px] uppercase leading-[1.1] hover:opacity-60 transition-opacity">{s}</a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/20 w-full shrink-0" />

        <div className="flex flex-col gap-4 lg:hidden overflow-hidden pb-0">
          <div className="flex items-center gap-8">
            <a href="#" className="text-white text-[12px] tracking-[-0.48px] uppercase underline hover:opacity-60 transition-opacity">Licences</a>
            <a href="#" className="text-white text-[12px] tracking-[-0.48px] uppercase underline hover:opacity-60 transition-opacity">Privacy policy</a>
          </div>
          <p className="font-mono text-[10px] text-white uppercase">[ Coded By Claude ]</p>
          <p className="font-semibold text-white capitalize leading-[0.8] whitespace-nowrap"
            style={{ fontSize: "clamp(80px, 24vw, 290px)", letterSpacing: "-0.06em" }}>
            H.Studio
          </p>
        </div>

        <div className="hidden lg:flex items-end justify-between">
          <div className="relative z-10 flex-1 min-w-0 h-[219px] flex items-center">
            <div className="relative shrink-0 w-[15px] h-[160px] flex items-center justify-center mr-2">
              <div className="-rotate-90 flex-none">
                <p className="font-mono text-[14px] text-white uppercase whitespace-nowrap leading-[1.1]">[ Coded By Claude ]</p>
              </div>
            </div>
            <p className="font-semibold text-white capitalize whitespace-nowrap absolute left-0"
              style={{ fontSize: "290px", letterSpacing: "-0.06em", lineHeight: "0.8", top: "50%", transform: "translateY(calc(-50% + 6.5px))" }}>
              H.Studio
            </p>
          </div>
          <div className="relative z-0 flex items-center gap-[34px] pb-8 shrink-0">
            <a href="#" className="text-white text-[12px] tracking-[-0.48px] uppercase underline hover:opacity-60 transition-opacity">Licences</a>
            <a href="#" className="text-white text-[12px] tracking-[-0.48px] uppercase underline hover:opacity-60 transition-opacity">Privacy policy</a>
          </div>
        </div>

      </footer>
    </>
  );
}
