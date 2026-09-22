"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ChamberItem {
  image: string;
  label: React.ReactNode;
  alt: string;
}

const CHAMBERS: ChamberItem[] = [
  {
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    label: (
      <span>
        01 · <span className="font-serif text-matcha text-[1.22em] mx-1">Nami</span> · Vinyasa &amp; Prana
      </span>
    ),
    alt: "01 · Nami · Vinyasa & Prana",
  },
  {
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    label: (
      <span>
        02 · <span className="font-serif text-matcha text-[1.22em] mx-1">Jiku</span> · Somatic Reform
      </span>
    ),
    alt: "02 · Jiku · Somatic Reform",
  },
  {
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    label: (
      <span>
        03 · <span className="font-serif text-matcha text-[1.22em] mx-1">Fure</span> · Restorative Bodywork
      </span>
    ),
    alt: "03 · Fure · Restorative Bodywork",
  },
  {
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80",
    label: (
      <span>
        04 · <span className="font-serif text-matcha text-[1.22em] mx-1">Hibiki</span> · 432Hz Sound Bath
      </span>
    ),
    alt: "04 · Hibiki · 432Hz Sound Bath",
  },
  {
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
    label: (
      <span>
        05 · <span className="font-serif text-matcha text-[1.22em] mx-1">Cha</span> · Ceremonial Nourishment
      </span>
    ),
    alt: "05 · Cha · Ceremonial Nourishment",
  },
];

export default function ActivitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const updateHorizontalParallax = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    if (!containerRect.width) return;
    const containerCenter = containerRect.left + containerRect.width / 2;

    const cards = container.querySelectorAll<HTMLElement>("[data-chamber-card]");
    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const diff = (cardCenter - containerCenter) / (containerRect.width / 2);
      const clampedDiff = Math.max(-1.5, Math.min(1.5, diff));
      // Parallax horizontal counter-drift: shifts image counter to horizontal scroll angle
      const shiftX = clampedDiff * -36;

      const hTarget = card.querySelector<HTMLElement>("[data-parallax-h]");
      if (hTarget) {
        gsap.set(hTarget, { x: shiftX });
      }
    });
  }, []);

  const checkScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const card = el.querySelector("[data-chamber-card]") as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth : 420;
    const gap = 20;
    const idx = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(Math.max(idx, 0), CHAMBERS.length - 1));
  }, []);

  const handleScroll = useCallback(() => {
    checkScrollState();
    updateHorizontalParallax();
  }, [checkScrollState, updateHorizontalParallax]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-chamber-card]") as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth : 420;
    const gap = 20;
    const scrollAmount = cardWidth + gap;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const el = scrollContainerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    el.scrollLeft = scrollLeftRef.current - walk;
    handleScroll();
  };

  const onMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollState();
    updateHorizontalParallax();

    const onResize = () => {
      checkScrollState();
      updateHorizontalParallax();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [checkScrollState, updateHorizontalParallax]);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    if (prefersReduced) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Ambient background orbs drift attached to scroll
      if (orb1Ref.current) {
        gsap.fromTo(
          orb1Ref.current,
          { y: -70, x: -35, scale: 0.85 },
          {
            y: 80,
            x: 35,
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      if (orb2Ref.current) {
        gsap.fromTo(
          orb2Ref.current,
          { y: 85, x: 35, scale: 1.15 },
          {
            y: -75,
            x: -30,
            scale: 0.88,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      // 2. Header blur reveal & 3D tilt attached to scroll
      if (headerRef.current) {
        const tlHeader = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 88%",
            end: "top 45%",
            scrub: 0.8,
          },
        });

        if (titleRef.current) {
          tlHeader.fromTo(
            titleRef.current,
            { opacity: 0, y: 45, filter: "blur(12px)", rotateX: 16 },
            { opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0, ease: "power2.out" },
            0
          );
        }

        if (descRef.current) {
          tlHeader.fromTo(
            descRef.current,
            { opacity: 0, y: 35, filter: "blur(8px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out" },
            0.1
          );
        }
      }

      // 3. Gallery container subtle float attached to scroll
      if (galleryRef.current) {
        gsap.fromTo(
          galleryRef.current,
          { opacity: 0.3, filter: "blur(10px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: galleryRef.current,
              start: "top 90%",
              end: "top 40%",
              scrub: 0.8,
            },
          }
        );
      }

      // 4. Optical vertical parallax on chamber card photos
      const vertElements = section.querySelectorAll("[data-parallax-v]");
      if (vertElements.length) {
        gsap.fromTo(
          vertElements,
          {
            yPercent: -12,
          },
          {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="w-full bg-[#FAF7F2] text-fg relative z-20 overflow-hidden py-20 md:py-28 flex flex-col justify-center select-none"
    >
      {/* Organic ambient background */}
      <div
        ref={orb1Ref}
        className="absolute top-1/3 left-1/4 w-[55vw] h-[55vw] rounded-full bg-sand/15 blur-[150px] pointer-events-none [will-change:transform]"
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-10 right-1/4 w-[40vw] h-[40vw] rounded-full bg-matcha/10 blur-[140px] pointer-events-none [will-change:transform]"
      />

      {/* Header Bar */}
      <div
        ref={headerRef}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-8 md:mb-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h2
            ref={titleRef}
            className="text-[clamp(1.75rem,3.8vw,3.2rem)] leading-[1.15] text-earth [perspective:1000px] [will-change:transform,filter,opacity]"
          >
            <span className="font-serif font-display text-[1.28em] sm:text-[1.34em] tracking-tight font-normal block">
              Sensory Architecture
            </span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between md:justify-end gap-6">
          <p
            ref={descRef}
            className="max-w-md font-serif text-sm sm:text-base text-stone font-light leading-relaxed [will-change:transform,filter,opacity]"
          >
            Five immersive chambers curated for somatic alignment, acoustic restoration, and mindful nourishment. Scroll or drag horizontally to explore each passage.
          </p>

          {/* Horizontal navigation arrow buttons & progress */}
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-end">
            <span className="text-xs font-serif text-stone/70 tracking-widest uppercase mr-1">
              0{activeIndex + 1} / 0{CHAMBERS.length}
            </span>
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous chamber"
              className={`w-10 h-10 rounded-full border border-earth/25 flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? "text-earth hover:bg-earth hover:text-cream cursor-pointer active:scale-95 shadow-sm"
                  : "text-earth/25 border-earth/10 cursor-not-allowed opacity-40"
              }`}
            >
              <ArrowLeft weight="light" className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next chamber"
              className={`w-10 h-10 rounded-full border border-earth/25 flex items-center justify-center transition-all duration-200 ${
                canScrollRight
                  ? "text-earth hover:bg-earth hover:text-cream cursor-pointer active:scale-95 shadow-sm"
                  : "text-earth/25 border-earth/10 cursor-not-allowed opacity-40"
              }`}
            >
              <ArrowRight weight="light" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontally Scrollable Card Gallery */}
      <div
        ref={galleryRef}
        className="w-full relative z-10 [will-change:transform,filter,opacity]"
      >
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          className="w-full overflow-x-auto flex gap-5 md:gap-6 px-6 sm:px-10 md:px-12 xl:px-[calc((100vw-80rem)/2+3rem)] py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none snap-x snap-mandatory scroll-smooth"
        >
          {CHAMBERS.map((chamber, idx) => (
            <div
              key={idx}
              data-chamber-card
              className="relative shrink-0 w-[84vw] sm:w-[380px] md:w-[420px] lg:w-[460px] h-[480px] sm:h-[520px] rounded-[24px] overflow-hidden shadow-[0_14px_44px_rgba(44,38,32,0.12)] group snap-start bg-[#1F1A16]"
            >
              {/* Inner Parallax Viewport */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Vertical Parallax Layer (GSAP ScrollTrigger scrubs yPercent) */}
                <div
                  data-parallax-v
                  className="absolute -top-[16%] -left-[16%] w-[132%] h-[132%] [will-change:transform]"
                >
                  {/* Horizontal Parallax Layer (drifts with horizontal carousel scroll) */}
                  <div
                    data-parallax-h
                    className="w-full h-full [will-change:transform]"
                  >
                    <img
                      src={chamber.image}
                      alt={chamber.alt}
                      draggable={false}
                      className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              {/* Dark bottom gradient overlay matching the previous design */}
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(31,26,22,0.85)_100%)]"
                aria-hidden="true"
              />

              {/* Chamber Label */}
              <div
                className="pointer-events-none absolute bottom-6 left-6 right-6 z-10 flex items-center"
                aria-hidden="true"
              >
                <span className="text-[clamp(1.1rem,1.5vw,1.4rem)] font-serif font-display tracking-tight text-[#FAF7F2] [text-shadow:0_2px_14px_rgba(0,0,0,0.65)]">
                  {chamber.label}
                </span>
              </div>
            </div>
          ))}
          {/* Right end padding spacer */}
          <div className="shrink-0 w-6 sm:w-12" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
