"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ChamberItem {
  image: string;
  label: React.ReactNode;
  alt: string;
  /** CSS object-position, tuned per photo so the important subject isn't cropped out */
  focalPoint?: string;
}

const CHAMBERS: ChamberItem[] = [
  {
    image: "/images/activities/1.jpeg",
    label: (
      <span>
        01 · <span className="font-serif text-matcha text-[1.22em] mx-1">Yoga</span>
      </span>
    ),
    alt: "01 · Yoga",
    focalPoint: "50% 50%",
  },
  {
    image: "/images/activities/2.jpeg",
    label: (
      <span>
        02 · <span className="font-serif text-matcha text-[1.22em] mx-1">Massage</span>
      </span>
    ),
    alt: "02 · Massage",
    focalPoint: "50% 50%",
  },
  {
    image: "/images/activities/3.jpeg",
    label: (
      <span>
        03 · <span className="font-serif text-matcha text-[1.22em] mx-1">Acupuncture</span>
      </span>
    ),
    alt: "03 · Acupuncture",
    focalPoint: "50% 50%",
  },
  {
    image: "/images/activities/4.jpeg",
    label: (
      <span>
        04 · <span className="font-serif text-matcha text-[1.22em] mx-1">Sound Bath</span>
      </span>
    ),
    alt: "04 · Sound Bath",
    focalPoint: "50% 50%",
  },
  {
    image: "/images/activities/7.jpeg",
    label: (
      <span>
        05 · <span className="font-serif text-matcha text-[1.22em] mx-1">Delicious Food</span>
      </span>
    ),
    alt: "05 · Delicious Food",
    focalPoint: "50% 50%",
  },
  {
    image: "/images/activities/6.jpeg",
    label: (
      <span>
        06 · <span className="font-serif text-matcha text-[1.22em] mx-1">Local &amp; International Vendors</span>
      </span>
    ),
    alt: "06 · Local & International Vendors",
    focalPoint: "50% 50%",
  },
  {
    image: "/images/activities/5.jpeg",
    label: (
      <span>
        07 · <span className="font-serif text-matcha text-[1.22em] mx-1">Beautiful Spaces</span>
      </span>
    ),
    alt: "07 · Beautiful Spaces",
    focalPoint: "50% 50%",
  },
];

export default function ActivitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {


      // 2. Header blur reveal & 3D tilt attached to scroll
      if (headerRef.current) {
        const tlHeader = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 88%",
            end: "top 50%",
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
              end: "top 55%",
              scrub: 0.8,
            },
          }
        );
      }

      if (prefersReduced) return;

      // 4. Pinned horizontal scroll locked to vertical scroll
      const getScrollAmount = () => {
        if (!track) return 0;
        return Math.max(0, track.scrollWidth - window.innerWidth);
      };

      const updateParallax = () => {
        const vpCenter = window.innerWidth / 2;
        const cards = track.querySelectorAll<HTMLElement>("[data-chamber-card]");
        cards.forEach((card) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const diff = (cardCenter - vpCenter) / vpCenter;
          const clampedDiff = Math.max(-1.5, Math.min(1.5, diff));
          const shiftX = clampedDiff * -36;

          const hTarget = card.querySelector<HTMLElement>("[data-parallax-h]");
          if (hTarget) {
            gsap.set(hTarget, { x: shiftX });
          }
        });
      };

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 1.5, getScrollAmount())}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: () => {
            updateParallax();
          },
        },
      });
    }, sectionRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="w-full h-screen min-h-screen bg-cream text-fg relative z-20 overflow-hidden py-8 md:py-12 flex flex-col justify-center select-none"
    >
      {/* Header Bar */}
      <div
        ref={headerRef}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-6 sm:mb-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h2
            ref={titleRef}
            className="text-[clamp(1.75rem,3.8vw,3.2rem)] leading-[1.15] text-earth [perspective:1000px] [will-change:transform,filter,opacity]"
          >
            <span className="font-serif font-display text-[1.28em] sm:text-[1.34em] tracking-tight font-normal block">
              Available Activities
            </span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between md:justify-end gap-6">
          <p
            ref={descRef}
            className="max-w-md font-serif text-sm sm:text-base text-stone font-light leading-relaxed [will-change:transform,filter,opacity]"
          >
            Immersive chambers curated for somatic alignment, acoustic restoration, and mindful nourishment. Scroll through each passage below.
          </p>
        </div>
      </div>

      {/* Horizontally Scrollable Card Gallery Viewport */}
      <div
        ref={galleryRef}
        className="w-full relative z-10 overflow-hidden [will-change:transform,filter,opacity]"
      >
        <div
          ref={trackRef}
          className="flex gap-5 md:gap-6 pl-8 sm:pl-12 md:pl-16 lg:pl-20 xl:pl-[calc(50vw-37rem)] pr-8 sm:pr-12 md:pr-16 lg:pr-20 xl:pr-[calc(50vw-37rem)] py-3 will-change-transform"
        >
          {CHAMBERS.map((chamber, idx) => (
            <div
              key={idx}
              data-chamber-card
              className="relative shrink-0 w-[84vw] sm:w-[380px] md:w-[420px] lg:w-[460px] h-[440px] sm:h-[480px] md:h-[500px] lg:h-[520px] max-h-[62vh] rounded-[24px] overflow-hidden group bg-[#1F1A16]"
            >
              {/* Inner Parallax Viewport */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  data-parallax-v
                  className="absolute -top-[12%] -left-[12%] w-[124%] h-[124%] [will-change:transform]"
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
                      style={{ objectPosition: chamber.focalPoint ?? "50% 50%" }}
                      className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              {/* Dark bottom gradient overlay matching the design */}
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
          <div className="shrink-0 w-8 sm:w-16" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
