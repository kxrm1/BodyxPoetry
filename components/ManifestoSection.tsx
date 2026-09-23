"use client";

import { useState, useEffect, useRef } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoLoop, { LogoItem } from "@/components/LogoLoop";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PARTNER_LOGOS: LogoItem[] = [
  { src: "/logos/logo1.png", alt: "Wellness Partner 1" },
  { src: "/logos/logo2.png", alt: "Wellness Partner 2" },
  { src: "/logos/logo3.png", alt: "Wellness Partner 3" },
  { src: "/logos/logo4.png", alt: "Wellness Partner 4" },
  { src: "/logos/logo5.png", alt: "Wellness Partner 5" },
  { src: "/logos/logo6.png", alt: "Wellness Partner 6" },
  { src: "/logos/logo7.png", alt: "Wellness Partner 7" },
  { src: "/logos/logo8.png", alt: "Wellness Partner 8" },
  { src: "/logos/logo9.png", alt: "Wellness Partner 9" },
  { src: "/logos/logo10.png", alt: "Wellness Partner 10" },
  { src: "/logos/logo11.png", alt: "Wellness Partner 11" },
  { src: "/logos/logo12.png", alt: "Wellness Partner 12" },
];

const renderPartnerLogo = (item: LogoItem) => {
  if (!("src" in item)) return null;
  return (
    <div
      className="relative inline-flex items-center justify-center opacity-75 hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-110"
      style={{
        height: "var(--logoloop-logoHeight, 36px)",
      }}
    >
      <img
        src={item.src}
        alt={item.alt || "Wellness Partner"}
        className="h-full w-auto max-w-none block object-contain pointer-events-none select-none"
        style={{
          height: "var(--logoloop-logoHeight, 36px)",
          maxHeight: "var(--logoloop-logoHeight, 36px)",
          filter:
            "brightness(0) saturate(100%) invert(24%) sepia(18%) saturate(676%) hue-rotate(349deg) brightness(95%) contrast(88%)",
        }}
        loading="eager"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[#4A3F35] pointer-events-none"
        style={{
          WebkitMaskImage: `url("${item.src}")`,
          maskImage: `url("${item.src}")`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
        }}
      />
    </div>
  );
};

const MANIFESTO_TEXT =
  "on saturday, november 7, step away from everyday noise and into a private newport beach sanctuary made for your restoration. this intimate four-hour women's retreat invites you to slow down and reconnect with your body. your day includes gentle yoga, guided meditation, a sound bath, restorative treatments, acupuncture and a chef-prepared meal. between each experience, you'll have space to breathe, connect with our wellness partners, and enjoy having nowhere else to be. this is more than a wellness event. it is a full pause from the outside world, and a day to remember the woman beneath every role you carry.";

export default function ManifestoSection() {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const archWrapperRef = useRef<HTMLDivElement>(null);
  const archImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        ScrollTrigger.refresh();
      }
    }, 80);

    const section = sectionRef.current;
    const archWrapper = archWrapperRef.current;
    const archImage = archImageRef.current;

    if (!section || !archWrapper || !archImage) {
      return () => clearTimeout(timer);
    }

    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    if (reduceMotion) {
      gsap.set(archWrapper, { opacity: 1, filter: "none", y: 0, scale: 1 });
      return () => clearTimeout(timer);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom top",
          toggleActions: "play none none reverse",
        },
      });

      // Arch picture wrapper blur reveal & settle into place
      tl.fromTo(
        archWrapper,
        {
          opacity: 0,
          filter: "blur(28px)",
          scale: 0.92,
          y: 35,
          willChange: "opacity, filter, transform",
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          clearProps: "willChange,filter",
        },
        0.12
      );

      // Subtle breath/counter-scale on the image inside the arch
      tl.fromTo(
        archImage,
        {
          scale: 1.15,
        },
        {
          scale: 1,
          duration: 1.8,
          ease: "power2.out",
        },
        0.12
      );
    }, section);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [mounted]);

  return (
    <section
      ref={sectionRef}
      style={{ marginTop: mounted ? "-100vh" : 0 }}
      className="relative z-20 min-h-screen py-24 sm:py-28 md:py-32 w-full bg-cream rounded-t-[2.5rem] sm:rounded-t-[3.5rem] md:rounded-t-[4.5rem] shadow-[0_-30px_60px_rgba(0,0,0,0.18)] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Main Row: Text Reveal & Arch Image */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14 xl:gap-20">
        {/* Left Column: Text Reveal (resets on scroll up and reveals on enter) */}
        <div className="w-full lg:max-w-[58%] xl:max-w-[62%] flex-1">
          <h2 className="text-[clamp(1.75rem,3.8vw,3.2rem)] leading-[1.15] text-earth mb-6 sm:mb-8 text-center lg:text-left">
            <span className="font-serif font-display text-[1.28em] sm:text-[1.34em] tracking-tight font-normal block">
              About our upcoming event
            </span>
          </h2>
          <ScrollReveal
            autoPlay={false}
            scrub={0.6}
            triggerStart="top 82%"
            triggerEnd="bottom 42%"
            enableBlur={false}
            baseRotation={0}
            baseOpacity={0.16}
            stagger={0.03}
            containerClassName="w-full my-0"
            textClassName="w-full text-[clamp(1.22rem,2.1vw,1.9rem)] leading-[1.64] sm:leading-[1.72] text-earth font-serif font-display font-normal tracking-tight text-center lg:text-left"
          >
            {MANIFESTO_TEXT}
          </ScrollReveal>
        </div>

        {/* Right Column: Arch Top Picture with blur reveal animation */}
        <div className="w-full lg:w-auto self-center flex justify-center lg:justify-end shrink-0">
          <div
            ref={archWrapperRef}
            className="relative shrink-0 w-[260px] sm:w-[300px] md:w-[330px] lg:w-[360px] xl:w-[410px] h-[380px] sm:h-[460px] md:h-[520px] lg:h-[580px] xl:h-[640px] select-none overflow-hidden rounded-t-full rounded-b-2xl shadow-[0_20px_50px_rgba(44,38,32,0.14)]"
            style={{ willChange: "opacity, filter, transform" }}
          >
            <div ref={archImageRef} className="w-full h-full">
              <img
                src="/images/arch.jpeg"
                alt="Body × Poetry sanctuary"
                className="w-full h-full object-cover object-[58%_50%] transform transition-transform duration-700 ease-out hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wellness Partners Infinite Logo Loop */}
      <div className="relative z-10 w-full mt-14 sm:mt-18 md:mt-22 flex flex-col items-center">
        <p className="text-center font-serif text-xs sm:text-[13px] tracking-[0.24em] uppercase text-earth/60 mb-6 sm:mb-8 select-none">
          Trusted By
        </p>
        <LogoLoop
          logos={PARTNER_LOGOS}
          speed={45}
          direction="left"
          logoHeight={34}
          gap={56}
          pauseOnHover={true}
          fadeOut={true}
          fadeOutColor="#FAF7F2"
          scaleOnHover={true}
          renderItem={renderPartnerLogo}
          ariaLabel="Wellness Partners"
        />
      </div>
    </section>
  );
}
