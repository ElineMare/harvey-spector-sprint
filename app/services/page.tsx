"use client";

import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { client } from "@/lib/sanity";
import ContactModal from "@/components/ContactModal";

const fullBleedImage = "https://www.figma.com/api/mcp/asset/c92c7704-4d6e-424d-b0ff-eae0512604e7";

function CornerBracket({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
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

const defaultServices = [
  {
    num: "[ 1 ]",
    name: "Brand Discovery",
    img: "https://www.figma.com/api/mcp/asset/30f9ae19-136b-4feb-abc5-6ee4831088ad",
    tagline: "Identiteit die blijft hangen.",
    desc: "Een sterk merk begint met een scherp inzicht. We duiken in je organisatie, je markt en je doelgroep — en vertalen dat naar een visuele taal die precies klopt. Van logo en typografie tot kleurpalet en tone of voice.",
    deliverables: ["Merkstrategie & positionering", "Logo & huisstijl", "Typografie & kleurpalet", "Brand guidelines", "Tone of voice document"],
  },
  {
    num: "[ 2 ]",
    name: "Web Design & Dev",
    img: "https://www.figma.com/api/mcp/asset/1d4c857a-c76f-4c65-99b5-391e8be32d01",
    tagline: "Digitale ervaringen die converteren.",
    desc: "Websites die niet alleen mooi zijn, maar ook werken. We ontwerpen en bouwen digitale ervaringen die bezoekers omzetten in klanten — met aandacht voor snelheid, toegankelijkheid en detail.",
    deliverables: ["UX/UI design", "Responsive webdesign", "Frontend development", "CMS integratie", "SEO-optimalisatie"],
  },
  {
    num: "[ 3 ]",
    name: "Marketing",
    img: "https://www.figma.com/api/mcp/asset/e128feda-e695-4f1d-80ec-6a4aa1007b08",
    tagline: "Zichtbaarheid met impact.",
    desc: "Van campagnestrategie tot creatieve executie. We ontwikkelen marketingcontent die past bij je merk en resoneert met je publiek — op elk kanaal en in elk formaat.",
    deliverables: ["Campagnestrategie", "Social media content", "E-mail marketing", "Advertentie creatives", "Content planning"],
  },
  {
    num: "[ 4 ]",
    name: "Photography",
    img: "https://www.figma.com/api/mcp/asset/145214b5-9f4d-405c-b885-dbcf8f692437",
    tagline: "Beelden die een verhaal vertellen.",
    desc: "Editorial, portret of product — elk beeld wordt gemaakt met een scherp oog voor compositie, licht en sfeer. Fotografie die je merk versterkt en meteen de aandacht trekt.",
    deliverables: ["Editorial fotografie", "Portretfotografie", "Productfotografie", "Post-processing & retouche", "Gelicenseerde beeldlevering"],
  },
];

const servicesQuery = `*[_type == "service"] | order(order asc) { number, name, tagline, description, deliverables, imageUrl }`

const process = [
  { num: "01", title: "Kennismaking", desc: "We beginnen met een vrijblijvend gesprek. Jij vertelt over je project, wij stellen de juiste vragen. Zo begrijpen we wat je écht nodig hebt." },
  { num: "02", title: "Strategie", desc: "Op basis van de intake maken we een heldere projectscope en aanpak. Geen verrassingen achteraf — alleen een duidelijk plan." },
  { num: "03", title: "Creatie", desc: "We gaan aan de slag. Tussentijdse presentaties zorgen dat je altijd weet waar we staan en dat het resultaat aansluit op je verwachtingen." },
  { num: "04", title: "Oplevering", desc: "Het eindresultaat wordt volledig klaargemaakt voor gebruik. Inclusief overdracht van bestanden, instructies en nazorg." },
];

export default function ServicesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navDark, setNavDark] = useState(true);
  const [services, setServices] = useState(defaultServices);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!client) return;
    client.fetch(servicesQuery).then((data) => {
      if (data?.length > 0) {
        setServices(data.map((s: { number: string; name: string; tagline: string; description: string; deliverables: string[]; imageUrl: string }) => ({
          num: s.number, name: s.name, tagline: s.tagline,
          desc: s.description, deliverables: s.deliverables ?? [], img: s.imageUrl,
        })));
      }
    }).catch(() => {});
  }, []);

  // Navbar kleur — hero is dark, light sections flip naar zwart
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];

    document.querySelectorAll("[data-srv-light]").forEach((section) => {
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

  // Service namen: hover slide + underline (via GSAP)
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    document.querySelectorAll("[data-srv-name]").forEach((el) => {
      const underline = el.querySelector("[data-underline]") as HTMLElement;
      if (underline) {
        gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });
        const enter = () => { gsap.killTweensOf(underline); gsap.to(underline, { scaleX: 1, duration: 0.3, ease: "power3.out", transformOrigin: "left center" }); gsap.to(el, { x: 14, duration: 0.3, ease: "power2.out" }); };
        const leave = () => { gsap.killTweensOf(underline); gsap.to(underline, { scaleX: 0, duration: 0.2, ease: "power3.in", transformOrigin: "right center" }); gsap.to(el, { x: 0, duration: 0.25, ease: "power2.inOut" }); };
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        cleanups.push(() => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); });
      }
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  // Blur reveal full-bleed
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const img = document.querySelector("[data-srv-blur-img]");
    const section = document.querySelector("[data-srv-blur-section]");
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
              <a key={label} href={href} className={`relative pb-[2px] ${label === "Services" ? "opacity-50 pointer-events-none" : ""}`} data-nav-link>
                {label}
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
            <button onClick={() => setMenuOpen(false)} className="cursor-pointer text-white" aria-label="Close menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-6 mt-16">
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)}
                className="font-semibold text-[36px] tracking-[-0.04em] capitalize text-white inline-block"
                data-mobile-nav-link>
                {label}
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

      <main className="relative z-10">

        {/* ── Hero (donker) ── */}
        <section className="bg-black h-screen flex flex-col justify-end px-4 pb-12 md:px-8 md:pb-20 overflow-hidden">
          <div className="flex flex-col gap-4 relative z-10">
            <p className="font-mono text-[14px] uppercase text-white/40 tracking-[-0.04em]">[ wat we doen ]</p>
            <h1
              className="font-medium text-white capitalize leading-[0.9]"
              style={{ fontSize: "clamp(64px, 10vw, 160px)", letterSpacing: "-0.07em" }}
            >
              Services
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-8 h-px bg-white/30" />
              <p className="text-[14px] text-white/40 tracking-[-0.56px]">[4] disciplines — full-service creatief bureau</p>
            </div>
          </div>

          {/* Achtergrond nummers decoratief */}
          <div className="absolute bottom-0 right-0 font-semibold text-white/[0.03] leading-none select-none pointer-events-none"
            style={{ fontSize: "clamp(200px, 40vw, 600px)", letterSpacing: "-0.07em", lineHeight: "0.8" }}>
            4
          </div>
        </section>

        {/* ── Services lijst (licht) ── */}
        <section data-srv-light className="bg-[#fafafa] px-4 py-16 md:px-8 md:py-[120px] flex flex-col gap-0">
          {services.map((service, i) => (
            <div key={service.num} className="flex flex-col gap-0 border-t border-[#1f1f1f]/20 py-12 md:py-16">

              {/* Header rij */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-16">

                {/* Links: nummer + naam */}
                <div className="flex flex-col gap-3 md:w-[55%]">
                  <p className="font-mono text-[12px] text-[#1f1f1f]/40 uppercase">{service.num}</p>
                  <div className="relative inline-block cursor-default" data-srv-name>
                    <h2
                      className="font-bold italic text-[#1f1f1f] uppercase leading-[1.05] tracking-[-0.05em]"
                      style={{ fontSize: "clamp(32px, 5vw, 72px)" }}
                    >
                      {service.name}
                    </h2>
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-current block" data-underline />
                  </div>
                  <p className="font-light italic text-[18px] text-[#1f1f1f]/60 tracking-[-0.04em] mt-1">
                    {service.tagline}
                  </p>
                </div>

                {/* Rechts: foto */}
                <div className="relative w-full md:w-[200px] md:shrink-0 h-[220px] md:h-[160px] overflow-hidden group cursor-pointer">
                  <img src={service.img} alt={service.name}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                </div>
              </div>

              {/* Body: beschrijving + deliverables */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-16 mt-8">
                <p className="text-[15px] text-[#1f1f1f] leading-[1.5] tracking-[-0.56px] md:w-[45%]">
                  {service.desc}
                </p>
                <div className="flex flex-col gap-3 flex-1">
                  <p className="font-mono text-[11px] text-[#1f1f1f]/40 uppercase mb-1">[ deliverables ]</p>
                  {service.deliverables.map((d) => (
                    <div key={d} className="flex items-center gap-3 border-b border-[#1f1f1f]/10 pb-3">
                      <div className="w-1 h-1 rounded-full bg-[#1f1f1f]/30 shrink-0" />
                      <span className="text-[13px] text-[#1f1f1f] tracking-[-0.52px]">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </section>

        {/* ── Full-bleed foto met blur reveal ── */}
        <section data-srv-blur-section className="relative w-full h-[400px] md:h-[700px] overflow-hidden shrink-0">
          <img data-srv-blur-img src={fullBleedImage} alt=""
            className="absolute inset-0 size-full object-cover object-[65%_center]" />
        </section>

        {/* ── Werkproces (licht) ── */}
        <section data-srv-light className="bg-[#fafafa] px-4 py-16 md:px-8 md:py-[120px]">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
              <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] uppercase">[ werkproces ]</p>
              <h2 className="font-light uppercase tracking-[-0.07em] leading-[0.9]"
                style={{ fontSize: "clamp(28px, 4.5vw, 64px)" }}>
                Zo werken we samen
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
              {process.map((step) => (
                <div key={step.num} className="flex flex-col gap-4 border-t border-[#1f1f1f]/20 pt-8 pb-10 md:pr-8">
                  <p className="font-mono text-[12px] text-[#1f1f1f]/30 uppercase">{step.num}</p>
                  <p className="font-bold italic text-[22px] text-[#1f1f1f] tracking-[-0.06em] uppercase leading-[1.1]">{step.title}</p>
                  <p className="text-[13px] text-[#1f1f1f]/60 leading-[1.5] tracking-[-0.52px]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tarieven intro (licht) ── */}
        <section data-srv-light className="bg-[#f3f3f3] px-4 py-16 md:px-8 md:py-[120px]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="flex flex-col gap-6 md:max-w-[55%]">
              <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] uppercase">[ tarieven ]</p>
              <h2 className="font-light uppercase tracking-[-0.07em] leading-[0.9]"
                style={{ fontSize: "clamp(28px, 4.5vw, 64px)" }}>
                Transparant &amp; op maat
              </h2>
              <p className="text-[15px] text-[#1f1f1f] leading-[1.5] tracking-[-0.56px]">
                Elk project is anders, dus elk tarief ook. We werken op basis van een vaste projectprijs of een dagtarief — altijd vooraf helder gecommuniceerd. Geen verborgen kosten, geen verrassingen.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  ["Dagtarief", "op aanvraag"],
                  ["Minimale projectgrootte", "€ 2.500"],
                  ["Doorlooptijd", "2 – 8 weken"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-[#1f1f1f]/15 pb-3">
                    <span className="font-mono text-[12px] text-[#1f1f1f]/50 uppercase">{label}</span>
                    <span className="font-medium text-[14px] text-[#1f1f1f] tracking-[-0.56px]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 items-start md:items-end shrink-0">
              <div className="flex gap-3 items-stretch max-w-[340px]">
                <div className="flex flex-col justify-between shrink-0 text-[#1f1f1f]">
                  <CornerBracket />
                  <CornerBracket className="-rotate-90" />
                </div>
                <p className="flex-1 text-[14px] text-[#1f1f1f] leading-[1.4] tracking-[-0.56px] py-3 italic">
                  &ldquo;We houden van uitdagende projecten en goede samenwerking. Plan een kennismaking — vrijblijvend, altijd prettig.&rdquo;
                </p>
                <div className="flex flex-col justify-between shrink-0 text-[#1f1f1f]">
                  <CornerBracket className="rotate-90" />
                  <CornerBracket className="rotate-180" />
                </div>
              </div>
              <a href="/#contact" className="flex items-center gap-2 border-b border-black pb-1 self-start md:self-end">
                <span className="font-medium text-[14px] text-black tracking-[-0.56px]">Plan een gesprek</span>
                <ArrowDiagonal className="w-[18px] h-[18px] text-black" />
              </a>
            </div>
          </div>
        </section>

        {/* ── CTA (donker) ── */}
        <section className="bg-black px-4 py-16 md:px-8 md:py-[120px] flex flex-col gap-8">
          <p className="font-mono text-[14px] leading-[1.1] text-white/40 uppercase">[ start jouw project ]</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <h2 className="font-light text-white uppercase leading-[0.9] tracking-[-0.07em]"
              style={{ fontSize: "clamp(40px, 7vw, 110px)" }}>
              Klaar om te<br />
              <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>bouwen</span>?
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
      <footer className="sticky bottom-0 z-0 bg-black px-4 pt-12 lg:px-8 flex flex-col gap-12 lg:gap-[120px] overflow-hidden">
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
            style={{ fontSize: "clamp(80px, 24vw, 290px)", letterSpacing: "-0.06em" }}>H.Studio</p>
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
