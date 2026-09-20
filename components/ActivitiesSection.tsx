"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AccordionGallery, { AccordionGalleryItem } from "@/components/AccordionGallery";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CHAMBERS: AccordionGalleryItem[] = [
  {
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    label: (
      <span>
        01 · <span className="font-script text-matcha text-[1.22em] mx-1">Nami</span> · Vinyasa &amp; Prana
      </span>
    ),
    alt: "01 · Nami · Vinyasa & Prana",
  },
  {
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    label: (
      <span>
        02 · <span className="font-script text-matcha text-[1.22em] mx-1">Jiku</span> · Somatic Reform
      </span>
    ),
    alt: "02 · Jiku · Somatic Reform",
  },
  {
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    label: (
      <span>
        03 · <span className="font-script text-matcha text-[1.22em] mx-1">Fure</span> · Restorative Bodywork
      </span>
    ),
    alt: "03 · Fure · Restorative Bodywork",
  },
  {
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80",
    label: (
      <span>
        04 · <span className="font-script text-matcha text-[1.22em] mx-1">Hibiki</span> · 432Hz Sound Bath
      </span>
    ),
    alt: "04 · Hibiki · 432Hz Sound Bath",
  },
  {
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
    label: (
      <span>
        05 · <span className="font-script text-matcha text-[1.22em] mx-1">Cha</span> · Ceremonial Nourishment
      </span>
    ),
    alt: "05 · Cha · Ceremonial Nourishment",
  },
];

export { AccordionGallery };

export default function ActivitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

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
        className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-10 md:mb-14 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
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

        <p
          ref={descRef}
          className="max-w-md font-serif text-sm sm:text-base text-stone font-light leading-relaxed [will-change:transform,filter,opacity]"
        >
          Five immersive chambers curated for somatic alignment, acoustic restoration, and mindful nourishment. Hover or click to explore each passage.
        </p>
      </div>

      {/* Accordion Gallery */}
      <div
        ref={galleryRef}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10 [will-change:transform,filter,opacity]"
      >
        <AccordionGallery
          items={CHAMBERS}
          defaultIndex={0}
          showLabels={true}
          accentColor="#8B9E6B"
          overlayColor="#1F1A16"
          textColor="#FAF7F2"
          height={520}
          gap={12}
          radius={24}
          expandRatio={0.52}
          tilt={7}
          parallax={0.4}
          enableScrollAnimation={true}
        />
      </div>
    </section>
  );
}
