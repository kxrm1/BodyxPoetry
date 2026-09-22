"use client";

import { useState, useEffect, useRef } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MANIFESTO_TEXT =
  "Where the physical body meets conscious breath. Where intentional movement becomes living meditation. A sacred pause carved within the relentless noise. Slow down to listen. Soften to receive. Reconnect. Realign. Return to your true center.";

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
          toggleActions: "play reverse play reverse",
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
      className="relative z-20 min-h-screen py-28 sm:py-36 md:py-44 w-full bg-[#FAF7F2] rounded-t-[2.5rem] sm:rounded-t-[3.5rem] md:rounded-t-[4.5rem] shadow-[0_-30px_60px_rgba(0,0,0,0.18)] flex items-center justify-center px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 overflow-hidden select-none"
    >
      {/* Subtle warm background ambient glows */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-matcha/8 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[40vw] h-[40vw] rounded-full bg-sand/20 blur-[130px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14 xl:gap-20">
        {/* Left Column: Text Reveal (resets on scroll up and reveals on enter) */}
        <div className="w-full lg:max-w-[58%] xl:max-w-[62%] flex-1">
          <ScrollReveal
            autoPlay={true}
            scrub={false}
            triggerRef={sectionRef}
            triggerStart="top 75%"
            triggerEnd="bottom top"
            toggleActions="play reverse play reverse"
            baseRotation={1.5}
            baseOpacity={0.12}
            blurStrength={5}
            stagger={0.026}
            duration={0.65}
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
                src="/images/photo-05.webp"
                alt="Body × Poetry sanctuary"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
