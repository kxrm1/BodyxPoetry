"use client";

import ScrollExpand from "@/components/ScrollExpand";
import MorphSlider, { MorphItem } from "@/components/MorphSlider";
import { ArrowRight } from "@phosphor-icons/react";

const HERO_MORPH_ITEMS: MorphItem[] = [
  {
    image: "/images/hero/hero-1.jpeg",
    caption: "Mindful Movement & Somatic Flow",
  },
  {
    image: "/images/hero/hero-2.jpeg",
    caption: "Local Artisans & Adornment",
  },
  {
    image: "/images/hero/hero-3.jpeg",
    caption: "Crystal Sound Bath",
  },
];

export default function HeroSection() {
  return (
    <section className="relative z-10 w-full bg-bg">
      {/* Subtle organic grain */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none z-40 mix-blend-multiply bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

      {/* Ambient background glows */}
      <div className="absolute top-[8%] left-[18%] w-[45vw] h-[45vw] rounded-full bg-sand/20 blur-[140px] pointer-events-none" />
      <div className="absolute top-[28%] right-[15%] w-[45vw] h-[45vw] rounded-full bg-matcha/15 blur-[150px] pointer-events-none" />

      <ScrollExpand
        src="/images/hero/hero-1.jpeg"
        alt="Mindful movement sanctuary at Body × Poetry"
        customMedia={
          <MorphSlider
            items={HERO_MORPH_ITEMS}
            autoplay={true}
            autoplayDelay={4.5}
            loop={true}
            pauseOnHover={false}
            draggable={false}
            transition="melt"
            duration={1.2}
            intensity={0.45}
            scale={2.0}
            aberration={0.01}
            drift={0.3}
            radius={0}
            showCaptions={false}
            showControls={false}
            showIndicators={false}
            className="w-full h-full pointer-events-none"
          />
        }
        useWindowScroll={true}
        matchTitleWidth={false}
        titleWidthPadding={0}
        startWidth={100}
        startHeight={100}
        startRadius={0}
        endRadius={0}
        mediaZoom={1.08}
        heroExpandedScale={1.08}
        scrollDistance={1.3}
        holdDistance={0.45}
        curtainDistance={1.0}
        smoothing={0.04}
        overlayScrim={0.0}
        titleScrim={0.0}
        bottomGradient={true}
        scrollHint="Scroll to explore"
        title={
          <div className="flex flex-col items-center select-none text-center">
            <h1
              data-title-target
              className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10.5rem] text-white leading-[0.9] font-normal tracking-tight whitespace-nowrap inline-block"
            >
              Body <span className="font-serif text-[0.8em] text-white">×</span> Poetry
            </h1>
          </div>
        }
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-2 md:pb-4">
          {/* Left: Poetic Statement - Way Bigger */}
          <div
            data-hero-statement
            className="max-w-3xl text-left select-none [will-change:transform,opacity,filter]"
          >
            <p className="font-serif font-display text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] text-cream leading-[1.08] tracking-tight font-normal [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
              for the woman who holds everything together,
              <br />
              this is your day to be held.
            </p>
          </div>

          {/* Right: Metadata & Reservation CTA */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between lg:justify-end gap-6 text-left lg:text-right select-none shrink-0">
            <div
              data-hero-meta
              className="space-y-1 [will-change:transform,opacity,filter] [text-shadow:0_2px_16px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-center lg:justify-end gap-2.5 font-serif font-display text-lg sm:text-xl md:text-2xl text-sand tracking-tight">
                <span>November 7</span>
                <span className="text-sand/50 text-xs font-serif">·</span>
                <span>Newport Beach, California</span>
              </div>
              <p className="font-serif text-xs sm:text-sm text-cream/75 tracking-wide">
                11:00 AM – 3:00 PM · 40 Mats
              </p>
            </div>

            <div
              data-hero-button
              className="[will-change:transform,opacity,filter]"
            >
              <a
                href="#ticket"
                className="relative overflow-hidden group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-cream text-earth hover:bg-matcha-dark hover:text-cream transition-all duration-300 pointer-events-auto cursor-pointer shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95"
              >
                {/* Luminous light beam sweep across button */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                <span className="font-serif text-xs font-semibold uppercase tracking-[0.2em] relative z-10">
                  Reserve Your Mat
                </span>
                <ArrowRight weight="light" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
              </a>
            </div>
          </div>
        </div>
      </ScrollExpand>
    </section>
  );
}
