"use client";

import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { client } from "@/lib/sanity";
import ContactModal from "@/components/ContactModal";

const defaultProjects = [
  { num: "01", name: "Max Playground", category: "Art Direction", img: "https://www.figma.com/api/mcp/asset/e6244f13-ef51-44f3-b346-af5a662da544" },
  { num: "02", name: "Cyberpunk Cafe", category: "Web Design", img: "https://www.figma.com/api/mcp/asset/209ac55d-fee3-42e9-be25-1207e375a27f" },
  { num: "03", name: "Agency 976", category: "Branding", img: "https://www.figma.com/api/mcp/asset/ad724597-ef6e-43c9-93da-b980898c1a8c" },
  { num: "04", name: "Paradise Surf", category: "Photography", img: "https://www.figma.com/api/mcp/asset/477302e8-c80f-4260-8448-8a95f1765fee" },
];

const projectsQuery = `*[_type == "project"] | order(order asc) { number, title, category, imageUrl }`;

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

export default function ProjectsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navDark, setNavDark] = useState(true);
  const [projects, setProjects] = useState(defaultProjects);
  const [modalOpen, setModalOpen] = useState(false);

  // Sanity fetch
  useEffect(() => {
    if (!client) return;
    client.fetch(projectsQuery).then((data) => {
      if (data?.length > 0) {
        setProjects(data.map((p: { number: string; title: string; category: string; imageUrl: string }) => ({
          num: p.number, name: p.title, category: p.category, img: p.imageUrl,
        })));
      }
    }).catch(() => {});
  }, []);

  // Navbar kleur
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];

    document.querySelectorAll("[data-proj-light]").forEach((section) => {
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
              <a key={label} href={href} className={`relative pb-[2px] ${label === "Projects" ? "opacity-50 pointer-events-none" : ""}`} data-nav-link>
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
          {/* Decoratief groot getal */}
          <p
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 font-black text-white/5 leading-none select-none pointer-events-none"
            style={{ fontSize: "clamp(160px, 25vw, 360px)" }}
            aria-hidden
          >
            {String(projects.length).padStart(3, "0")}
          </p>

          <div className="relative flex flex-col gap-6">
            <p className="font-mono text-[14px] leading-[1.1] text-white/50 uppercase">[ portfolio ]</p>
            <h1
              className="font-light text-white uppercase tracking-[-0.08em] leading-[0.88]"
              style={{ fontSize: "clamp(56px, 10vw, 160px)" }}
            >
              Selected<br />Work
            </h1>
            <p className="font-mono text-[13px] text-white/40 uppercase tracking-widest">
              {String(projects.length).padStart(3, "0")} projects
            </p>
          </div>
        </section>

        {/* ── Projects grid: licht ── */}
        <section data-proj-light className="bg-[#fafafa] px-4 py-12 md:px-8 md:py-20 flex flex-col gap-4 md:gap-6">

          {/* Project 1: full-breedte hero-kaart */}
          {projects[0] && (
            <div className="relative overflow-hidden group cursor-pointer" style={{ height: "clamp(320px, 55vw, 680px)" }}>
              <img
                src={projects[0].img}
                alt={projects[0].name}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                <span className="font-mono text-[12px] text-white/60">{projects[0].num}</span>
                <span className="font-mono text-[11px] text-white bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full uppercase">{projects[0].category}</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between transition-transform duration-500 ease-out group-hover:-translate-y-2">
                <p
                  className="font-black text-white uppercase tracking-[-0.07em] leading-[1.0]"
                  style={{ fontSize: "clamp(28px, 5vw, 72px)" }}
                >
                  {projects[0].name}
                </p>
                <ArrowDiagonal className="text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0" />
              </div>
            </div>
          )}

          {/* Overige projecten: 2-koloms grid (1 kolom op mobile) */}
          {projects.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {projects.slice(1).map((project, i) => (
                <div
                  key={project.num}
                  className="relative overflow-hidden group cursor-pointer"
                  style={{ height: i % 3 === 1 ? "clamp(280px, 32vw, 560px)" : "clamp(240px, 28vw, 480px)" }}
                >
                  <img
                    src={project.img}
                    alt={project.name}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
                  <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                    <span className="font-mono text-[12px] text-white/60">{project.num}</span>
                    <span className="font-mono text-[11px] text-white bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full uppercase">{project.category}</span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between transition-transform duration-500 ease-out group-hover:-translate-y-2">
                    <p className="font-black text-white text-[28px] md:text-[36px] tracking-[-0.07em] uppercase leading-[1.05]">
                      {project.name}
                    </p>
                    <ArrowDiagonal className="text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── CTA sectie: donker ── */}
        <section className="bg-black px-4 py-20 md:px-8 md:py-28 flex flex-col gap-12 items-start">
          <p className="font-mono text-[14px] leading-[1.1] text-white/50 uppercase">[ contact ]</p>
          <h2
            className="font-light text-white uppercase tracking-[-0.08em] leading-[0.9] max-w-3xl"
            style={{ fontSize: "clamp(36px, 6vw, 96px)" }}
          >
            Let&apos;s build something great together
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
