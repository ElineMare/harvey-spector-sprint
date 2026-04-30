"use client";

import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { client } from "@/lib/sanity";
import ContactModal from "@/components/ContactModal";

const heroImage =
  "https://www.figma.com/api/mcp/asset/81b225f4-a09b-49a1-b427-30d4e9126536";

const aboutImage =
  "https://www.figma.com/api/mcp/asset/d133f71b-8ebb-4ab4-bab1-5cfa36a1ff7e";

const fullBleedImage =
  "https://www.figma.com/api/mcp/asset/c92c7704-4d6e-424d-b0ff-eae0512604e7";

const defaultProjects = [
  { num: "01", name: "Surfers Paradise", category: "Photography", img: "https://www.figma.com/api/mcp/asset/477302e8-c80f-4260-8448-8a95f1765fee" },
  { num: "02", name: "Cyberpunk Caffe", category: "Web Design", img: "https://www.figma.com/api/mcp/asset/209ac55d-fee3-42e9-be25-1207e375a27f" },
  { num: "03", name: "Agency 976", category: "Branding", img: "https://www.figma.com/api/mcp/asset/ad724597-ef6e-43c9-93da-b980898c1a8c" },
  { num: "04", name: "Minimal Playground", category: "Art Direction", img: "https://www.figma.com/api/mcp/asset/e6244f13-ef51-44f3-b346-af5a662da544" },
];

const defaultTestimonials = [
  {
    logo: "https://www.figma.com/api/mcp/asset/e272b28c-4d06-47a8-b751-0426169d433c",
    logoW: 143, logoH: 19,
    quote: "A brilliant creative partner who transformed our vision into a unique, high-impact brand identity. Their ability to craft everything from custom mascots to polished logos is truly impressive.",
    author: "Marko Stojković",
    rotation: -6.85,
    // desktop: behind the heading (z-0)
    desktop: { left: "7.1%", top: 142, zIndex: 0 },
  },
  {
    logo: "https://www.figma.com/api/mcp/asset/028056a6-ab17-47fa-b12f-837bde5a5a4c",
    logoW: 138, logoH: 19,
    quote: "Professional, precise, and incredibly fast at handling complex product visualizations and templates.",
    author: "Lukas Weber",
    rotation: 2.9,
    desktop: { left: "46.9%", top: 200, zIndex: 20 },
  },
  {
    logo: "https://www.figma.com/api/mcp/asset/e4631de2-a806-4dae-a3e6-1509ee0690b2",
    logoW: 109, logoH: 31,
    quote: "A strategic partner who balances stunning aesthetics with high-performance UX for complex platforms. They don't just make things look good; they solve business problems through visual clarity.",
    author: "Sarah Jenkins",
    rotation: 2.23,
    desktop: { left: "21.2%", top: 553, zIndex: 20 },
  },
  {
    logo: "https://www.figma.com/api/mcp/asset/502ce3d0-581e-4a67-a79b-72c9f13d55ed",
    logoW: 81, logoH: 36,
    quote: "An incredibly versatile designer who delivers consistent quality across a wide range of styles and formats.",
    author: "Sofia Martínez",
    rotation: -4.15,
    desktop: { left: "68.5%", top: 546, zIndex: 20 },
  },
];

const defaultNewsItems = [
  {
    img: "https://www.figma.com/api/mcp/asset/1ddc155b-64a8-47e3-b15c-0e3ff824e758",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    offset: false,
  },
  {
    img: "https://www.figma.com/api/mcp/asset/7a25ac24-9f6f-43b5-9f34-3097b22a959c",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    offset: true,
  },
  {
    img: "https://www.figma.com/api/mcp/asset/e787b73f-24e5-4c4e-8c03-38f783209bd8",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    offset: false,
  },
];

const defaultServices = [
  { num: "[ 1 ]", name: "Brand Discovery", img: "https://www.figma.com/api/mcp/asset/30f9ae19-136b-4feb-abc5-6ee4831088ad" },
  { num: "[ 2 ]", name: "Web Design & Dev", img: "https://www.figma.com/api/mcp/asset/1d4c857a-c76f-4c65-99b5-391e8be32d01" },
  { num: "[ 3 ]", name: "Marketing", img: "https://www.figma.com/api/mcp/asset/e128feda-e695-4f1d-80ec-6a4aa1007b08" },
  { num: "[ 4 ]", name: "Photography", img: "https://www.figma.com/api/mcp/asset/145214b5-9f4d-405c-b885-dbcf8f692437" },
];

// Decorative corner bracket — draws ┌, rotate CSS for other corners
function CornerBracket({ className = "", color = "#1f1f1f" }: { className?: string; color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M1 15L1 1L15 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Diagonal arrow (top-right direction) — use text-* to control colour
function ArrowDiagonal({ className = "" }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className={className} aria-hidden>
      <path d="M6 22L22 6M22 6H10M22 6V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const projectsQuery = `*[_type == "project"] | order(order asc) { number, title, category, imageUrl }`
const testimonialsQuery = `*[_type == "testimonial"] | order(order asc) { logoUrl, logoWidth, logoHeight, quote, author }`
const newsQuery = `*[_type == "newsItem"] | order(order asc) { imageUrl, text }`
const servicesQuery = `*[_type == "service"] | order(order asc) { number, name, imageUrl }`

// Design-layout per positie (niet in CMS — zijn opmaakbeslissingen)
const testimonialLayout = [
  { rotation: -6.85, desktop: { left: "7.1%", top: 142, zIndex: 0 } },
  { rotation: 2.9, desktop: { left: "46.9%", top: 200, zIndex: 20 } },
  { rotation: 2.23, desktop: { left: "21.2%", top: 553, zIndex: 20 } },
  { rotation: -4.15, desktop: { left: "68.5%", top: 546, zIndex: 20 } },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState(defaultProjects);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [newsItems, setNewsItems] = useState(defaultNewsItems);
  const [services, setServices] = useState(defaultServices);
  const [newsIndex, setNewsIndex] = useState(0);
  const [navDark, setNavDark] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // GSAP: navbar kleur op basis van donkere secties
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];

    document.querySelectorAll("[data-section-dark]").forEach((section) => {
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

  // GSAP: ScrollTrigger parallax op hero
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const hero = document.querySelector("[data-hero]");
    const harvey = document.querySelector("[data-harvey]");
    const specter = document.querySelector("[data-specter]");
    const hello = document.querySelector("[data-hello]");

    if (!hero || !harvey || !specter || !hello) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    tl.to([harvey, hello], { x: "-40vw", ease: "none" }, 0)
      .to(specter, { x: "40vw", ease: "none" }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // GSAP: desktop nav underlines + button scale
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    // Nav links + service names: underline animatie
    document.querySelectorAll("[data-nav-link], [data-service-name]").forEach((link) => {
      const underline = link.querySelector("[data-underline]") as HTMLElement;
      gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });

      const enter = () => {
        gsap.killTweensOf(underline);
        gsap.to(underline, { scaleX: 1, duration: 0.3, ease: "power3.out", transformOrigin: "left center" });
      };
      const leave = () => {
        gsap.killTweensOf(underline);
        gsap.to(underline, { scaleX: 0, duration: 0.2, ease: "power3.in", transformOrigin: "right center" });
      };
      link.addEventListener("mouseenter", enter);
      link.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        link.removeEventListener("mouseenter", enter);
        link.removeEventListener("mouseleave", leave);
      });
    });

    // Service names: extra slide naar rechts
    document.querySelectorAll("[data-service-name]").forEach((el) => {
      const enter = () => gsap.to(el, { x: 14, duration: 0.3, ease: "power2.out" });
      const leave = () => gsap.to(el, { x: 0, duration: 0.25, ease: "power2.inOut" });
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    });

    document.querySelectorAll("[data-btn]").forEach((btn) => {
      const enter = () => gsap.to(btn, { scale: 1.05, duration: 0.2, ease: "back.out(2)" });
      const leave = () => gsap.to(btn, { scale: 1, duration: 0.2, ease: "power2.inOut" });
      btn.addEventListener("mouseenter", enter);
      btn.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        btn.removeEventListener("mouseenter", enter);
        btn.removeEventListener("mouseleave", leave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  // GSAP: blur reveal op full-bleed image
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const img = document.querySelector("[data-blur-img]");
    const section = document.querySelector("[data-blur-section]");
    if (!img || !section) return;

    gsap.set(img, { filter: "blur(20px)" });

    const tween = gsap.to(img, {
      filter: "blur(0px)",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "center center",
        scrub: 1,
      },
    });

    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  // GSAP: testimonial kaarten parallax drift
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = document.querySelector("[data-testimonials-section]");
    if (!section) return;

    const sectionRect = section.getBoundingClientRect();
    const sectionCX = sectionRect.width / 2;
    const sectionCY = sectionRect.height / 2;
    const tweens: gsap.core.Tween[] = [];

    document.querySelectorAll("[data-testimonial-card]").forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCX = rect.left - sectionRect.left + rect.width / 2;
      const cardCY = rect.top - sectionRect.top + rect.height / 2;
      const dx = (cardCX - sectionCX) > 0 ? 30 : -30;
      const dy = (cardCY - sectionCY) > 0 ? 20 : -20;

      tweens.push(gsap.to(card, {
        x: dx,
        y: dy,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      }));
    });

    return () => tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
  }, []);

  // GSAP: about textbox slide naar links
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const box = document.querySelector("[data-about-textbox]");
    if (!box) return;

    const tween = gsap.to(box, {
      x: "-80px",
      ease: "none",
      scrollTrigger: {
        trigger: box,
        start: "top 80%",
        end: "bottom 10%",
        scrub: 1.5,
      },
    });

    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  // GSAP: tagline text fill scrubbing
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const container = document.querySelector("[data-tagline]");
    if (!container) return;

    const lines = container.querySelectorAll("[data-tagline-line]");
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        end: "bottom 30%",
        scrub: 1.2,
      },
    });

    lines.forEach((line, i) => {
      tl.fromTo(
        line,
        { color: "#d0d0d0" },
        { color: "#1f1f1f", duration: 1 },
        i * 0.6
      );
    });

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);

  // GSAP: mobile menu link slide
  useEffect(() => {
    if (!menuOpen) return;
    const cleanups: (() => void)[] = [];

    document.querySelectorAll("[data-mobile-nav-link]").forEach((link) => {
      const enter = () => gsap.to(link, { x: 12, duration: 0.2, ease: "power2.out" });
      const leave = () => gsap.to(link, { x: 0, duration: 0.2, ease: "power2.in" });
      link.addEventListener("mouseenter", enter);
      link.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        link.removeEventListener("mouseenter", enter);
        link.removeEventListener("mouseleave", leave);
        gsap.set(link, { x: 0 });
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [menuOpen]);

  useEffect(() => {
    if (!client) return;

    client.fetch(projectsQuery).then((data) => {
      if (data?.length > 0) {
        setProjects(data.map((p: { number: string; title: string; category: string; imageUrl: string }) => ({
          num: p.number, name: p.title, category: p.category, img: p.imageUrl,
        })));
      }
    }).catch(() => {});

    client.fetch(testimonialsQuery).then((data) => {
      if (data?.length > 0) {
        setTestimonials(data.map((t: { logoUrl: string; logoWidth: number; logoHeight: number; quote: string; author: string }, i: number) => ({
          logo: t.logoUrl, logoW: t.logoWidth, logoH: t.logoHeight,
          quote: t.quote, author: t.author,
          ...testimonialLayout[i % testimonialLayout.length],
        })));
      }
    }).catch(() => {});

    client.fetch(newsQuery).then((data) => {
      if (data?.length > 0) {
        setNewsItems(data.map((n: { imageUrl: string; text: string }, i: number) => ({
          img: n.imageUrl, text: n.text, offset: i % 2 !== 0,
        })));
      }
    }).catch(() => {});

    client.fetch(servicesQuery).then((data) => {
      if (data?.length > 0) {
        setServices(data.map((s: { number: string; name: string; imageUrl: string }) => ({
          num: s.number, name: s.name, img: s.imageUrl,
        })));
      }
    }).catch(() => {});
  }, []);

  const navTextClass = `transition-colors duration-300 ${navDark ? "text-white" : "text-black"}`;
  const navUnderlineClass = "absolute bottom-0 left-0 w-full h-[1px] block bg-current";
  const navBtnClass = `hidden md:flex font-medium text-[14px] tracking-[-0.56px] px-4 py-3 rounded-[24px] cursor-pointer transition-colors duration-300 ${navDark ? "bg-white text-black" : "bg-black text-white"}`;

  return (
    <>
    <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    {/* ── Fixed Navbar ─────────────────────────────────────────────── */}
    <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8">
      <nav className="flex items-center justify-between py-6 w-full">
        <span className={`font-semibold text-[16px] tracking-[-0.64px] capitalize ${navTextClass}`}>
          H.Studio
        </span>

        {/* Desktop: links */}
        <div className={`hidden md:flex gap-14 items-center font-semibold text-[16px] tracking-[-0.64px] capitalize ${navTextClass}`}>
          {[["Over", "/over"], ["Services", "/services"], ["Projects", "/projects"], ["Nieuws", "/nieuws"], ["Contact", "/contact"]].map(([label, href]) => (
            <a key={label} href={href} className="relative pb-[2px]" data-nav-link>
              {label}
              <span className={navUnderlineClass} data-underline />
            </a>
          ))}
        </div>

        {/* Desktop: CTA */}
        <button className={navBtnClass} data-btn onClick={() => setModalOpen(true)}>
          Let&apos;s talk
        </button>

        {/* Mobile: hamburger */}
        <button
          className={`md:hidden cursor-pointer ${navTextClass}`}
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>
    </header>

    <main className="bg-[#fafafa] relative z-10">
      {/* ── Mobile menu overlay ─────────────────────────────────────── */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col px-6 pt-6 pb-10 md:hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[16px] tracking-[-0.64px] capitalize text-white">
              H.Studio
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="cursor-pointer text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-6 mt-16">
            {[["Over", "/over"], ["Services", "/services"], ["Projects", "/projects"], ["Nieuws", "/nieuws"], ["Contact", "/contact"]].map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="font-semibold text-[36px] tracking-[-0.04em] capitalize text-white inline-block"
                data-mobile-nav-link
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="mt-auto">
            <button className="border border-white text-white font-medium text-[14px] tracking-[-0.56px] px-5 py-3 rounded-[24px] cursor-pointer" data-btn onClick={() => { setMenuOpen(false); setModalOpen(true); }}>
              Let&apos;s talk
            </button>
          </div>
        </div>
      )}

      {/* ── Hero + Navbar ───────────────────────────────────────────── */}
      <section
        data-hero
        className={[
          "relative flex flex-col items-center overflow-clip",
          // mobile: content at bottom, space for fixed navbar
          "h-screen px-4 pb-6 justify-end",
          // desktop: fixed height, top padding = navbar(72) + gap(240)
          "md:h-[847px] md:px-8 md:pb-0 md:justify-start md:pt-[312px]",
        ].join(" ")}
      >
        {/* Background image */}
        <div
          className={[
            "absolute -translate-y-1/2",
            // mobile: left-anchored, extends right
            "h-[847px] left-0 right-[-39.47%] top-1/2",
            // desktop: extends both sides, sits slightly low
            "md:h-auto md:aspect-[2291/1346] md:left-[-34.79%] md:right-[-34.79%] md:top-[calc(50%+88.84px)]",
          ].join(" ")}
        >
          <img
            alt="Harvey Specter"
            className="absolute inset-0 max-w-none object-cover md:object-bottom pointer-events-none size-full"
            src={heroImage}
          />
        </div>

        {/* Smooth gradient fade — replaces hard-edged backdrop-blur */}
        <div className="absolute bottom-0 h-[420px] left-0 w-full pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, rgba(250,250,250,0.6) 40%, rgba(250,250,250,0.92) 70%, #fafafa 100%)",
          }}
        />

        {/* ── Hero content ── */}
        <div
          className={[
            "flex flex-col items-center w-full relative z-10",
            // mobile: fixed height, name top / description bottom
            "justify-between h-[341px]",
            // desktop: stacked
            "md:h-auto md:justify-center",
          ].join(" ")}
        >
          {/* Name block */}
          <div className="flex flex-col items-center w-full md:items-start md:pb-[15px]">
            <div className="flex items-center justify-center px-[18px] w-full md:justify-start md:px-0 md:mb-[-15px]">
              <p className="font-mono leading-[1.1] mix-blend-overlay text-white uppercase whitespace-nowrap text-[14px]" data-hello>
                [ Hello i&apos;m ]
              </p>
            </div>

            {/* Fluid font size: scales with viewport, no hard breakpoint jump */}
            <div
              className={[
                "font-medium text-center md:text-left text-white mix-blend-overlay w-full capitalize",
                "leading-[0.85] md:mb-[-15px] md:leading-[1.1]",
              ].join(" ")}
              style={{ fontSize: "clamp(80px, 12.5vw, 198px)", letterSpacing: "-0.07em" }}
            >
              <p className="whitespace-pre-wrap">
                <span data-harvey style={{ display: "inline-block" }}>Harvey</span>
                {"   "}
                <span data-specter style={{ display: "inline-block" }}>Specter</span>
              </p>
            </div>
          </div>

          {/* Description + CTA */}
          <div className="flex flex-col items-center justify-center w-full md:items-end">
            <div className="flex flex-col gap-[17px] items-center md:items-start w-[293px] md:w-[294px]">
              <p className="font-bold italic text-[14px] tracking-[-0.56px] uppercase text-[#1f1f1f] leading-[1.1]">
                <span>H.Studio is a </span>
                <span className="font-normal">full-service</span>
                <span> creative studio creating beautiful digital experiences and products. We are an </span>
                <span className="font-normal">award winning</span>
                <span> design and art group specializing in branding, web design and engineering.</span>
              </p>
              <button className="bg-black text-white font-medium text-[14px] tracking-[-0.56px] px-4 py-3 rounded-[24px] cursor-pointer" data-btn>
                Let&apos;s talk
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Tagline ─────────────────────────────────────── */}
      <section id="about" className="px-4 py-12 md:px-8 md:py-[120px] overflow-hidden">
        <div className="flex flex-col gap-6 w-full">

          {/* [ 8+ years in industry ] + divider */}
          <div className="flex flex-col gap-3 items-end w-full">
            <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] text-right uppercase">
              [ 8+ years in industry ]
            </p>
            <div className="w-full h-px bg-[#1f1f1f]" />
          </div>

          {/* Tagline — staircase on desktop, centered on mobile */}
          <div className="flex flex-col gap-2 items-center md:items-start" data-tagline>

            {/* Mobile only: section number */}
            <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] md:hidden">001</p>

            {/* Line 1: "A creative director   /" + desktop section number */}
            <div className="flex gap-3 items-start justify-center md:justify-start w-full">
              <p
                data-tagline-line
                className="font-light leading-[0.84] tracking-[-0.08em] uppercase whitespace-pre"
                style={{ fontSize: "clamp(32px, 6.67vw, 96px)" }}
              >
                {`A creative director   /`}
              </p>
              <p className="hidden md:block font-mono text-[14px] leading-[1.1] text-[#1f1f1f] mt-1 shrink-0">
                001
              </p>
            </div>

            {/* Line 2: Photographer — 15% indent on desktop */}
            <div className="w-full flex justify-center md:block md:pl-[15%]">
              <p
                data-tagline-line
                className="font-light leading-[0.84] tracking-[-0.08em] uppercase whitespace-nowrap"
                style={{ fontSize: "clamp(32px, 6.67vw, 96px)" }}
              >
                Photographer
              </p>
            </div>

            {/* Line 3: Born & raised — 44% indent on desktop */}
            <div className="w-full flex justify-center md:block md:pl-[44%]">
              <p
                data-tagline-line
                className="font-light leading-[0.84] tracking-[-0.08em] uppercase whitespace-nowrap"
                style={{ fontSize: "clamp(32px, 6.67vw, 96px)" }}
              >
                {`Born `}
                <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>&amp;</span>
                {` raised`}
              </p>
            </div>

            {/* Line 4: on the south side — no indent */}
            <div className="w-full flex justify-center md:block">
              <p
                data-tagline-line
                className="font-light leading-[0.84] tracking-[-0.08em] uppercase whitespace-nowrap"
                style={{ fontSize: "clamp(32px, 6.67vw, 96px)" }}
              >
                on the south side
              </p>
            </div>

            {/* Line 5: of chicago. + [ creative freelancer ] */}
            {/* Desktop: side by side, 44% indent */}
            <div className="hidden md:flex items-baseline gap-4 pl-[44%]">
              <p
                data-tagline-line
                className="font-light leading-[0.84] tracking-[-0.08em] uppercase whitespace-nowrap"
                style={{ fontSize: "clamp(32px, 6.67vw, 96px)" }}
              >
                of chicago.
              </p>
              <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] whitespace-nowrap">
                [ creative freelancer ]
              </p>
            </div>
            {/* Mobile: stacked, centered */}
            <div className="md:hidden flex flex-col items-center gap-3">
              <p
                data-tagline-line
                className="font-light leading-[0.84] tracking-[-0.08em] uppercase whitespace-nowrap"
                style={{ fontSize: "clamp(32px, 6.67vw, 96px)" }}
              >
                of chicago.
              </p>
              <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f]">
                [ creative freelancer ]
              </p>
            </div>

          </div>
        </div>
      </section>
      {/* ── Section 3: About ───────────────────────────────────────── */}

      {/* Mobile layout (<lg) */}
      <section className="lg:hidden px-4 py-12 flex flex-col gap-5">
        <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] uppercase">002</p>
        <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] uppercase">[ Over ]</p>

        {/* Text with corner brackets */}
        <div className="flex gap-3 items-stretch">
          <div className="flex flex-col justify-between shrink-0">
            <CornerBracket />
            <CornerBracket className="-rotate-90" />
          </div>
          <p className="flex-1 text-[14px] text-[#1f1f1f] leading-[1.3] tracking-[-0.56px] py-3">
            Placeholder paragraph one. This is where you introduce yourself — your background, your passion for your craft, and what drives you creatively. Two to three sentences work best here. Placeholder paragraph two. Here you can describe your technical approach, how you collaborate with clients, or what sets your work apart from others in your field.
          </p>
          <div className="flex flex-col justify-between shrink-0">
            <CornerBracket className="rotate-90" />
            <CornerBracket className="rotate-180" />
          </div>
        </div>

        {/* Portrait photo */}
        <div className="relative overflow-hidden w-full aspect-[422/594]">
          <img
            alt="Harvey Specter"
            className="absolute h-[101.39%] left-[-0.71%] max-w-none top-[-0.69%] w-[101.42%] object-cover"
            src={aboutImage}
          />
        </div>
      </section>

      {/* Desktop layout (≥lg) */}
      <section className="hidden lg:flex items-start justify-between px-8 py-20 gap-8">
        {/* Left: section label */}
        <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] uppercase shrink-0 pt-1">
          [ Over ]
        </p>

        {/* Right column: text block + photo */}
        <div className="flex items-end gap-8 flex-1 justify-end">

          {/* Text with corner brackets — capped at 393px per design */}
          <div className="flex gap-3 items-stretch max-w-[393px]" data-about-textbox>
            <div className="flex flex-col justify-between shrink-0">
              <CornerBracket />
              <CornerBracket className="-rotate-90" />
            </div>
            <p className="flex-1 min-w-0 text-[14px] text-[#1f1f1f] leading-[1.3] tracking-[-0.56px] py-3">
              Placeholder paragraph one. This is where you introduce yourself — your background, your passion for your craft, and what drives you creatively. Two to three sentences work best here. Placeholder paragraph two. Here you can describe your technical approach, how you collaborate with clients, or what sets your work apart from others in your field.
            </p>
            <div className="flex flex-col justify-between shrink-0">
              <CornerBracket className="rotate-90" />
              <CornerBracket className="rotate-180" />
            </div>
          </div>

          {/* 002 label + portrait photo */}
          <div className="flex gap-6 items-start shrink-0">
            <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] uppercase pt-1">002</p>
            <div className="relative overflow-hidden w-[436px] h-[614px]">
              <img
                alt="Harvey Specter portrait"
                className="absolute h-[101.39%] left-[-0.71%] max-w-none top-[-0.69%] w-[101.42%] object-cover"
                src={aboutImage}
              />
            </div>
          </div>
        </div>
      </section>
      {/* ── Section 4: Full-bleed photo ────────────────────────────── */}
      <section data-blur-section className="relative w-full h-[500px] md:h-[900px] overflow-hidden shrink-0">
        <img
          data-blur-img
          alt="Harvey Specter photographing"
          className="absolute inset-0 size-full object-cover object-[65%_center]"
          src={fullBleedImage}
        />
      </section>

      {/* ── Section 5: Services / Deliverables ─────────────────────── */}
      <section id="services" data-section-dark className="bg-black px-4 py-12 md:px-8 md:py-20 flex flex-col gap-8 md:gap-12">

        {/* [ services ] label */}
        <p className="font-mono text-[14px] leading-[1.1] text-white uppercase">[ services ]</p>

        {/* [4]   DELIVERABLES — fluid scale */}
        <div
          className="flex items-center justify-between text-white font-light uppercase tracking-[-0.08em] leading-normal whitespace-nowrap"
          style={{ fontSize: "clamp(32px, 6.67vw, 96px)" }}
        >
          <span>[4]</span>
          <span>Deliverables</span>
        </div>

        {/* Service items */}
        <div className="flex flex-col gap-12">
          {services.map((service) => (
            <div key={service.num} className="flex flex-col gap-[9px]">

              {/* Number + white divider */}
              <div className="flex flex-col gap-[9px]">
                <p className="font-mono text-[14px] leading-[1.1] text-white uppercase">
                  {service.num}
                </p>
                <div className="w-full border-t border-white/30" />
              </div>

              {/* Content row: name left / description+image right */}
              <div className="flex flex-col gap-4 pt-1 lg:flex-row lg:items-start lg:justify-between">
                <div className="relative shrink-0 inline-block cursor-default" data-service-name>
                  <p className="font-bold italic text-[36px] text-white tracking-[-1.44px] uppercase leading-[1.1] whitespace-nowrap">
                    {service.name}
                  </p>
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-current block" data-underline />
                </div>
                <div className="flex flex-col gap-4 lg:flex-row lg:gap-6 lg:items-start shrink-0">
                  <p className="text-[14px] text-white leading-[1.3] tracking-[-0.56px] lg:w-[393px]">
                    Placeholder description of this service. Explain the value you provide and the outcomes clients can expect. Keep it to two or three sentences.
                  </p>
                  <div className="relative size-[151px] overflow-hidden shrink-0">
                    <img
                      alt={service.name}
                      className="absolute inset-0 size-full max-w-none object-cover pointer-events-none"
                      src={service.img}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 6: Selected Work ────────────────────────────────── */}
      <section id="projects" className="px-4 py-12 md:px-8 md:py-20">

        {/* Header row */}
        <div className="flex items-end justify-between mb-10 md:mb-16">
          <h2
            className="font-light uppercase tracking-[-0.08em] leading-[0.9]"
            style={{ fontSize: "clamp(32px, 6.67vw, 96px)" }}
          >
            Selected<br />Work
          </h2>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] uppercase">003</p>
            <p className="font-mono text-[14px] leading-[1.1] text-[#1f1f1f] uppercase">[ portfolio ]</p>
          </div>
        </div>

        {/* ── Mobile: single-column stack ── */}
        <div className="flex flex-col gap-4 lg:hidden">
          {projects.map((project) => (
            <div key={project.num} className="relative h-[390px] overflow-hidden group cursor-pointer">
              <img
                src={project.img}
                alt={project.name}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
              {/* Top row */}
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                <span className="font-mono text-[12px] text-white/60">{project.num}</span>
                <span className="font-mono text-[11px] text-white bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full uppercase">
                  {project.category}
                </span>
              </div>
              {/* Bottom row */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between transition-transform duration-500 ease-out group-hover:-translate-y-2">
                <p className="font-black text-white text-[24px] tracking-[-0.06em] uppercase leading-[1.05]">
                  {project.name}
                </p>
                <ArrowDiagonal className="text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>
          ))}

          {/* CTA box — mobile: below cards */}
          <div className="relative border border-[#1f1f1f] px-6 py-8 mt-4">
            <CornerBracket className="absolute top-3 left-3" />
            <CornerBracket className="rotate-90 absolute top-3 right-3" />
            <CornerBracket className="-rotate-90 absolute bottom-3 left-3" />
            <CornerBracket className="rotate-180 absolute bottom-3 right-3" />
            <div className="flex flex-col gap-6 items-start px-2">
              <p className="font-normal italic text-[16px] tracking-[-0.02em] leading-[1.4] text-[#1f1f1f] ">
                Discover how my creativity transforms ideas into impactful digital experiences — schedule a call with me to get started.
              </p>
              <button className="bg-black text-white font-medium text-[14px] tracking-[-0.56px] px-5 py-3 rounded-[24px] cursor-pointer hover:opacity-80 transition-opacity">
                Let&apos;s talk
              </button>
            </div>
          </div>
        </div>

        {/* ── Desktop: 2-column asymmetric grid ── */}
        <div className="hidden lg:flex gap-6 items-start">

          {/* Left column */}
          <div className="flex flex-col gap-6 flex-1">
            {/* Project 1 — tall */}
            <div className="relative h-[640px] overflow-hidden group cursor-pointer">
              <img src={projects[0].img} alt={projects[0].name} className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                <span className="font-mono text-[12px] text-white/60">{projects[0].num}</span>
                <span className="font-mono text-[11px] text-white bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full uppercase">{projects[0].category}</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between transition-transform duration-500 ease-out group-hover:-translate-y-2">
                <p className="font-black text-white text-[36px] tracking-[-0.07em] uppercase leading-[1.05]">{projects[0].name}</p>
                <ArrowDiagonal className="text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>

            {/* Project 2 */}
            <div className="relative h-[420px] overflow-hidden group cursor-pointer">
              <img src={projects[1].img} alt={projects[1].name} className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                <span className="font-mono text-[12px] text-white/60">{projects[1].num}</span>
                <span className="font-mono text-[11px] text-white bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full uppercase">{projects[1].category}</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between transition-transform duration-500 ease-out group-hover:-translate-y-2">
                <p className="font-black text-white text-[36px] tracking-[-0.07em] uppercase leading-[1.05]">{projects[1].name}</p>
                <ArrowDiagonal className="text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>

            {/* CTA box */}
            <div className="relative border border-[#1f1f1f] px-8 py-10">
              <CornerBracket className="absolute top-3 left-3" />
              <CornerBracket className="rotate-90 absolute top-3 right-3" />
              <CornerBracket className="-rotate-90 absolute bottom-3 left-3" />
              <CornerBracket className="rotate-180 absolute bottom-3 right-3" />
              <div className="flex flex-col gap-8 items-start px-2">
                <p className="font-normal italic text-[16px] tracking-[-0.02em] leading-[1.4] text-[#1f1f1f] ">
                  Discover how my creativity transforms ideas into impactful digital experiences — schedule a call with me to get started.
                </p>
                <button className="bg-black text-white font-medium text-[14px] tracking-[-0.56px] px-5 py-3 rounded-[24px] cursor-pointer hover:opacity-80 transition-opacity">
                  Let&apos;s talk
                </button>
              </div>
            </div>
          </div>

          {/* Right column — offset down 240px */}
          <div className="flex flex-col gap-6 flex-1 mt-[240px]">
            {/* Project 3 */}
            <div className="relative h-[420px] overflow-hidden group cursor-pointer">
              <img src={projects[2].img} alt={projects[2].name} className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                <span className="font-mono text-[12px] text-white/60">{projects[2].num}</span>
                <span className="font-mono text-[11px] text-white bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full uppercase">{projects[2].category}</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between transition-transform duration-500 ease-out group-hover:-translate-y-2">
                <p className="font-black text-white text-[36px] tracking-[-0.07em] uppercase leading-[1.05]">{projects[2].name}</p>
                <ArrowDiagonal className="text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>

            {/* Project 4 — tall */}
            <div className="relative h-[640px] overflow-hidden group cursor-pointer">
              <img src={projects[3].img} alt={projects[3].name} className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                <span className="font-mono text-[12px] text-white/60">{projects[3].num}</span>
                <span className="font-mono text-[11px] text-white bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full uppercase">{projects[3].category}</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between transition-transform duration-500 ease-out group-hover:-translate-y-2">
                <p className="font-black text-white text-[36px] tracking-[-0.07em] uppercase leading-[1.05]">{projects[3].name}</p>
                <ArrowDiagonal className="text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>
          </div>

        </div>
      </section>
      {/* ── Section 7: Testimonials ─────────────────────────────────── */}

      {/* Mobile: heading + horizontal scroll slider */}
      <section className="lg:hidden px-4 py-16 flex flex-col gap-8 overflow-hidden">
        <h2
          className="font-medium text-center capitalize"
          style={{ fontSize: "clamp(48px, 17vw, 64px)", letterSpacing: "-0.07em", lineHeight: "0.9" }}
        >
          Testimonials
        </h2>

        {/* Horizontal scroll — cards peek in from the right */}
        <div className="overflow-x-auto snap-x snap-mandatory pt-8 pb-4 -mx-4">
          <div className="flex pl-4 gap-6" style={{ paddingRight: "1rem" }}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="snap-start flex-none"
                style={{ transform: `rotate(${t.rotation}deg)` }}
              >
                <div className="bg-[#f1f1f1] border border-[#dddddd] rounded-[4px] p-6 flex flex-col gap-4 w-[270px]">
                  <div className="relative shrink-0" style={{ width: t.logoW * 0.74, height: t.logoH * 0.74 }}>
                    <img src={t.logo} alt="" className="absolute inset-0 size-full object-contain max-w-none" />
                  </div>
                  <p className="text-[16px] text-[#1f1f1f] leading-[1.3] tracking-[-0.64px]">
                    {t.quote}
                  </p>
                  <p className="font-black text-[14px] text-black leading-[1.1] tracking-[-0.56px] uppercase whitespace-nowrap">
                    {t.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop: scattered cards over large heading */}
      <section data-testimonials-section className="hidden lg:block relative h-[920px] overflow-hidden">

        {/* Cards with z < 10 go BEHIND the heading */}
        {testimonials.filter((t) => t.desktop.zIndex < 10).map((t, i, arr) => (
          <div
            key={i}
            data-testimonial-card={testimonials.indexOf(t)}
            className="absolute"
            style={{
              left: t.desktop.left,
              top: t.desktop.top,
              zIndex: t.desktop.zIndex,
              transform: `rotate(${t.rotation}deg)`,
            }}
          >
            <div className="bg-[#f1f1f1] border border-[#dddddd] rounded-[4px] p-6 flex flex-col gap-4 w-[353px]">
              <div className="relative shrink-0" style={{ width: t.logoW, height: t.logoH }}>
                <img src={t.logo} alt="" className="absolute inset-0 size-full object-contain max-w-none" />
              </div>
              <p className="text-[18px] text-[#1f1f1f] leading-[1.3] tracking-[-0.72px]">{t.quote}</p>
              <p className="font-black text-[16px] text-black leading-[1.1] tracking-[-0.64px] uppercase whitespace-nowrap">{t.author}</p>
            </div>
          </div>
        ))}

        {/* Heading — centered, z-10 */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
          <h2
            className="font-medium capitalize text-center text-black whitespace-nowrap pointer-events-none select-none"
            style={{ fontSize: "198px", letterSpacing: "-0.07em", lineHeight: "1.1" }}
          >
            Testimonials
          </h2>
        </div>

        {/* Cards with z > 10 go IN FRONT of the heading */}
        {testimonials.filter((t) => t.desktop.zIndex > 10).map((t, i) => (
          <div
            key={i}
            data-testimonial-card={testimonials.indexOf(t)}
            className="absolute"
            style={{
              left: t.desktop.left,
              top: t.desktop.top,
              zIndex: t.desktop.zIndex,
              transform: `rotate(${t.rotation}deg)`,
            }}
          >
            <div className="bg-[#f1f1f1] border border-[#dddddd] rounded-[4px] p-6 flex flex-col gap-4 w-[353px]">
              <div className="relative shrink-0" style={{ width: t.logoW, height: t.logoH }}>
                <img src={t.logo} alt="" className="absolute inset-0 size-full object-contain max-w-none" />
              </div>
              <p className="text-[18px] text-[#1f1f1f] leading-[1.3] tracking-[-0.72px]">{t.quote}</p>
              <p className="font-black text-[16px] text-black leading-[1.1] tracking-[-0.64px] uppercase whitespace-nowrap">{t.author}</p>
            </div>
          </div>
        ))}
      </section>
      {/* ── Section 8: News ─────────────────────────────────────────── */}

      {/* Mobile: heading + horizontal scroll */}
      <section className="lg:hidden bg-[#f3f3f3] px-4 py-16 flex flex-col gap-8 overflow-hidden">
        <h2
          className="font-light uppercase"
          style={{ fontSize: "clamp(24px, 8.5vw, 32px)", letterSpacing: "-0.08em", lineHeight: "0.86" }}
        >
          Blijf op de hoogte van mijn laatste nieuws &amp; prestaties
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="h-[398px] relative overflow-hidden">
              <img src={newsItems[newsIndex].img} alt="" className="absolute inset-0 size-full object-cover pointer-events-none" />
            </div>
            <p className="text-[14px] text-[#1f1f1f] leading-[1.3] tracking-[-0.56px]">{newsItems[newsIndex].text}</p>
            <a href="#" className="flex items-center gap-2 border-b border-black pb-1 self-start">
              <span className="font-medium text-[14px] text-black tracking-[-0.56px]">Read more</span>
              <ArrowDiagonal className="w-[18px] h-[18px] text-black shrink-0" />
            </a>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setNewsIndex((newsIndex - 1 + newsItems.length) % newsItems.length)}
              className="w-10 h-10 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              aria-label="Vorige"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="flex gap-2">
              {newsItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setNewsIndex(i)}
                  className={`rounded-full transition-all ${i === newsIndex ? "w-6 h-2 bg-black" : "w-2 h-2 bg-black/30"}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setNewsIndex((newsIndex + 1) % newsItems.length)}
              className="w-10 h-10 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              aria-label="Volgende"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Desktop: rotated title left + 3 staggered cards right */}
      <section className="hidden lg:flex bg-[#f3f3f3] px-8 py-[120px] items-end justify-between gap-8">

        {/* Rotated heading column */}
        <div className="relative shrink-0 w-[110px] h-[706px] flex items-center justify-center">
          <div className="-rotate-90 flex-none">
            <h2
              className="font-light uppercase whitespace-nowrap"
              style={{ fontSize: "64px", letterSpacing: "-0.08em", lineHeight: "0.86" }}
            >
              Blijf op de hoogte van mijn laatste<br />nieuws &amp; prestaties
            </h2>
          </div>
        </div>

        {/* Article cards */}
        <div className="flex gap-[31px] items-start flex-1">
          {newsItems.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <div className="w-px self-stretch bg-black/20 shrink-0" />
              )}
              <div className={`flex flex-col gap-4 flex-1 group cursor-pointer ${item.offset ? "pt-[120px]" : ""}`}>
                <div className="h-[469px] relative overflow-hidden shrink-0">
                  <img src={item.img} alt="" className="absolute inset-0 size-full object-cover pointer-events-none transition-transform duration-500 ease-out group-hover:scale-[1.03] group-hover:-translate-y-2" />
                </div>
                <p className="text-[14px] text-[#1f1f1f] leading-[1.3] tracking-[-0.56px]">{item.text}</p>
                <a href="#" className="flex items-center gap-2 border-b border-black pb-1 self-start">
                  <span className="font-medium text-[14px] text-black tracking-[-0.56px]">Read more</span>
                  <ArrowDiagonal className="w-[18px] h-[18px] text-black shrink-0" />
                </a>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>
    </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer data-section-dark className="sticky bottom-0 z-0 bg-black px-4 pt-12 lg:px-8 flex flex-col gap-12 lg:gap-[120px] overflow-hidden">

        {/* Top: CTA + social links */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

          {/* CTA block */}
          <div className="flex flex-col gap-3 shrink-0 lg:w-[298px]">
            <p className="font-light italic text-[24px] text-white tracking-[-0.96px] uppercase leading-[1.1]">
              Have a{" "}
              <span className="font-black not-italic">project</span>
              {" "}in mind?
            </p>
            <button className="border border-white text-white font-medium text-[14px] tracking-[-0.56px] px-4 py-3 rounded-[24px] self-start cursor-pointer hover:bg-white hover:text-black transition-colors">
              Let&apos;s talk
            </button>
          </div>

          {/* Social — mobile: 4 links stacked */}
          <div className="flex flex-col gap-4 lg:hidden">
            {["Facebook", "Instagram", "x.com", "Linkedin"].map((s) => (
              <a key={s} href="#" className="text-white text-[18px] tracking-[-0.72px] uppercase leading-[1.1] hover:opacity-60 transition-opacity">
                {s}
              </a>
            ))}
          </div>

          {/* Social — desktop: center column */}
          <div className="hidden lg:block w-[298px] text-center">
            {["Facebook", "Instagram"].map((s) => (
              <a key={s} href="#" className="block text-white text-[18px] tracking-[-0.72px] uppercase leading-[1.1] hover:opacity-60 transition-opacity">
                {s}
              </a>
            ))}
          </div>

          {/* Social — desktop: right column */}
          <div className="hidden lg:block w-[298px] text-right">
            {["x.com", "Linkedin"].map((s) => (
              <a key={s} href="#" className="block text-white text-[18px] tracking-[-0.72px] uppercase leading-[1.1] hover:opacity-60 transition-opacity">
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 w-full shrink-0" />

        {/* Bottom — mobile */}
        <div className="flex flex-col gap-4 lg:hidden overflow-hidden pb-0">
          <div className="flex items-center gap-8">
            <a href="#" className="text-white text-[12px] tracking-[-0.48px] uppercase underline hover:opacity-60 transition-opacity">Licences</a>
            <a href="#" className="text-white text-[12px] tracking-[-0.48px] uppercase underline hover:opacity-60 transition-opacity">Privacy policy</a>
          </div>
          <p className="font-mono text-[10px] text-white uppercase">[ Coded By Claude ]</p>
          <p
            className="font-semibold text-white capitalize leading-[0.8] whitespace-nowrap"
            style={{ fontSize: "clamp(80px, 24vw, 290px)", letterSpacing: "-0.06em" }}
          >
            H.Studio
          </p>
        </div>

        {/* Bottom — desktop */}
        <div className="hidden lg:flex items-end justify-between">

          {/* H.Studio + [ Coded By Claude ] — clipped container */}
          <div className="relative z-10 flex-1 min-w-0 h-[219px] flex items-center">

            {/* Rotated label — far left */}
            <div className="relative shrink-0 w-[15px] h-[160px] flex items-center justify-center mr-2">
              <div className="-rotate-90 flex-none">
                <p className="font-mono text-[14px] text-white uppercase whitespace-nowrap leading-[1.1]">
                  [ Coded By Claude ]
                </p>
              </div>
            </div>

            {/* H.Studio — vertically centered so it clips equally top + bottom */}
            <p
              className="font-semibold text-white capitalize whitespace-nowrap absolute left-0"
              style={{
                fontSize: "290px",
                letterSpacing: "-0.06em",
                lineHeight: "0.8",
                top: "50%",
                transform: "translateY(calc(-50% + 6.5px))",
              }}
            >
              H.Studio
            </p>
          </div>

          {/* Legal links */}
          <div className="relative z-0 flex items-center gap-[34px] pb-8 shrink-0">
            <a href="#" className="text-white text-[12px] tracking-[-0.48px] uppercase underline hover:opacity-60 transition-opacity">Licences</a>
            <a href="#" className="text-white text-[12px] tracking-[-0.48px] uppercase underline hover:opacity-60 transition-opacity">Privacy policy</a>
          </div>
        </div>

      </footer>
    </>
  );
}
