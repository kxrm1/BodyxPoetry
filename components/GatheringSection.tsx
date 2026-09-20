"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowLeft } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MorphSlider, { MorphSliderRef, MorphItem } from "@/components/MorphSlider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SolarMoment {
  id: string;
  time: string;
  solarLabel: string;
  title: string;
  flourish: string;
  description: string;
  location: string;
  image: string;
  glowColor: string;
  coord: { x: number; y: number };
}

const SOLAR_MOMENTS: SolarMoment[] = [
  {
    id: "noon-arrival",
    time: "12:00 PM",
    solarLabel: "Midday Arrival",
    title: "Arrival & Ceremonial Matcha",
    flourish: "entering the stillness of the valley",
    description:
      "Cross the raw cedar threshold in silence as midday light warms the valley live oaks. Receive a warm, hand-whisked bowl of single-estate Uji matcha to settle the nervous system and anchor your awareness before movement begins.",
    location: "The Tea Pavilion",
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
    glowColor: "rgba(212, 197, 169, 0.28)",
    coord: { x: 80, y: 130 },
  },
  {
    id: "movement",
    time: "12:45 PM",
    solarLabel: "High Sun",
    title: "Breath-Led Movement on Cedar",
    flourish: "awakening fluidity in open mountain air",
    description:
      "Step onto the 2,200 sq.ft cantilevered cedar platform bathed in sun. Flow through an unhurried, breath-synchronized vinyasa and somatic fascial unwinding designed to restore spinal fluidity and open the chest.",
    location: "The Open-Air Cedar Deck",
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80",
    glowColor: "rgba(139, 158, 107, 0.22)",
    coord: { x: 240, y: 55 },
  },
  {
    id: "feast",
    time: "01:45 PM",
    solarLabel: "Afternoon Sun",
    title: "The Farm Harvest Table",
    flourish: "nourishment grown in Ojai soil",
    description:
      "Gather beneath the shaded pergola around our live-edge cedar table. Savor a three-course, plant-forward harvest feast prepared that morning with biodynamic produce from local Ojai growers, paired with chilled botanical tonics and wild mountain herbs.",
    location: "The Pergola & Gardens",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    glowColor: "rgba(217, 184, 142, 0.28)",
    coord: { x: 400, y: 30 },
  },
  {
    id: "sound",
    time: "02:45 PM",
    solarLabel: "Warm Light",
    title: "432Hz Crystal Sound Sanctuary",
    flourish: "pure quartz resonance in rammed earth",
    description:
      "Descend into our 18-inch rammed-earth pavilion, cool and quiet against the afternoon warmth. Recline onto organic wool bolsters with weighted silk lavender eye masks as pure 432Hz frosted quartz singing bowls wash through the floor, dissolving cognitive tension into deep theta rest.",
    location: "The Rammed-Earth Hall",
    image:
      "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80",
    glowColor: "rgba(184, 160, 138, 0.24)",
    coord: { x: 560, y: 55 },
  },
  {
    id: "closing",
    time: "03:30 PM",
    solarLabel: "Golden Hour",
    title: "Closing Circle & Keepsake",
    flourish: "sealing the day before your return",
    description:
      "Gather once more around the limestone hearth as golden afternoon light settles over the Topatopa mountains. Complete the arc with guided grounding breath, warm mountain chamomile, and the presentation of our bespoke linen departure box before your return at 4:00 PM.",
    location: "The Sunken Hearth",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    glowColor: "rgba(228, 155, 72, 0.26)",
    coord: { x: 720, y: 130 },
  },
];

const MORPH_ITEMS: MorphItem[] = SOLAR_MOMENTS.map((moment) => ({
  image: moment.image,
}));

export default function GatheringSection() {
  const [activeIdx, setActiveIdx] = useState(1);
  const morphSliderRef = useRef<MorphSliderRef | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const currentMoment = SOLAR_MOMENTS[activeIdx];

  const sectionRef = useRef<HTMLElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLSpanElement>(null);
  const title2Ref = useRef<HTMLSpanElement>(null);
  const arcWrapperRef = useRef<HTMLDivElement>(null);
  const arcPathRef = useRef<SVGPathElement>(null);
  const arcSunRef = useRef<SVGGElement>(null);
  const nodesRef = useRef<(SVGGElement | null)[]>([]);
  const stageFrameRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);

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
          { y: -65, x: -30, scale: 0.9 },
          {
            y: 75,
            x: 30,
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
          { y: 80, x: 35, scale: 1.15 },
          {
            y: -70,
            x: -25,
            scale: 0.9,
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

      // 2. Section Header blur reveal & calligraphic 3D tilt
      if (headerRef.current) {
        const tlHeader = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 88%",
            end: "top 45%",
            scrub: 0.8,
          },
        });

        if (title1Ref.current) {
          tlHeader.fromTo(
            title1Ref.current,
            { opacity: 0, y: 40, filter: "blur(14px)", rotateX: 14 },
            { opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0, ease: "power2.out" },
            0
          );
        }

        if (title2Ref.current) {
          tlHeader.fromTo(
            title2Ref.current,
            { opacity: 0, y: 30, filter: "blur(10px)", rotateX: -10 },
            { opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0, ease: "power2.out" },
            0.08
          );
        }
      }

      // 3. Circadian Sun Arc reveal: Calligraphic light path draw & sequential node bloom
      if (arcWrapperRef.current) {
        const tlArc = gsap.timeline({
          scrollTrigger: {
            trigger: arcWrapperRef.current,
            start: "top 88%",
            end: "top 38%",
            scrub: 0.8,
          },
        });

        // Arc Wrapper soft blur reveal
        tlArc.fromTo(
          arcWrapperRef.current,
          { opacity: 0.15, y: 35, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 0.6 },
          0
        );

        // Path draws smoothly from left to right like an arc of sunlight
        if (arcPathRef.current) {
          const pathLen = 780;
          tlArc.fromTo(
            arcPathRef.current,
            { strokeDashoffset: pathLen, opacity: 0.2 },
            { strokeDashoffset: 0, opacity: 1, ease: "none", duration: 1.0 },
            0.05
          );
        }

        // Sequential bloom for the 5 solar nodes along the drawn arc
        const nodes = nodesRef.current.filter(Boolean);
        if (nodes.length) {
          tlArc.fromTo(
            nodes,
            { scale: 0.35, opacity: 0, filter: "blur(8px)", transformOrigin: "50% 50%" },
            {
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              stagger: 0.12,
              ease: "back.out(1.5)",
              duration: 0.38,
            },
            0.15
          );
        }

        // Active glowing sun orb awakens with radiant solar bloom
        if (arcSunRef.current) {
          tlArc.fromTo(
            arcSunRef.current,
            { scale: 0.2, opacity: 0, filter: "blur(12px)", transformOrigin: "50% 50%" },
            { scale: 1, opacity: 1, filter: "blur(0px)", ease: "power2.out", duration: 0.4 },
            0.42
          );
        }
      }

      // 4. Central Double-Bezel Stage Frame blur reveal & elevation settle
      if (stageFrameRef.current) {
        gsap.fromTo(
          stageFrameRef.current,
          { opacity: 0.25, y: 50, filter: "blur(12px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: stageFrameRef.current,
              start: "top 88%",
              end: "top 38%",
              scrub: 0.8,
            },
          }
        );

        if (leftColumnRef.current) {
          gsap.fromTo(
            leftColumnRef.current,
            { opacity: 0.3, y: 20, filter: "blur(8px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              ease: "power2.out",
              scrollTrigger: {
                trigger: stageFrameRef.current,
                start: "top 86%",
                end: "top 38%",
                scrub: 0.8,
              },
            }
          );
        }

        if (rightColumnRef.current) {
          gsap.fromTo(
            rightColumnRef.current,
            { opacity: 0.3, y: 20, filter: "blur(8px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              ease: "power2.out",
              scrollTrigger: {
                trigger: stageFrameRef.current,
                start: "top 86%",
                end: "top 38%",
                scrub: 0.8,
              },
            }
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleNext = () => {
    morphSliderRef.current?.next();
  };

  const handlePrev = () => {
    morphSliderRef.current?.prev();
  };

  const handleSelectMoment = (idx: number) => {
    setActiveIdx(idx);
    morphSliderRef.current?.goToIndex(idx);
  };

  return (
    <section
      id="details"
      ref={sectionRef}
      className="relative z-20 py-20 md:py-32 bg-[#FAF7F2] text-fg px-4 sm:px-6 md:px-12 overflow-hidden transition-colors duration-1000 select-none rounded-b-[2.5rem] sm:rounded-b-[3.5rem] md:rounded-b-[4.5rem] shadow-[0_45px_75px_-10px_rgba(0,0,0,0.22)]"
    >
      {/* Dynamic atmospheric ambient glow linked to the active sun position */}
      <div
        ref={orb1Ref}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70vw] h-[55vw] rounded-full blur-[160px] pointer-events-none transition-colors duration-1000 [will-change:transform]"
        style={{ backgroundColor: currentMoment.glowColor }}
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-10 right-10 w-[40vw] h-[40vw] rounded-full bg-sand/15 blur-[140px] pointer-events-none [will-change:transform]"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header: Minimal & Clean */}
        <div ref={headerRef} className="max-w-3xl mb-10 md:mb-14">
          <h2 className="text-[clamp(1.75rem,3.8vw,3.2rem)] leading-[1.15] text-earth [perspective:1000px]">
            <span
              ref={title1Ref}
              className="font-serif font-display text-[1.28em] sm:text-[1.34em] tracking-tight font-normal inline-block [will-change:transform,filter,opacity]"
            >
              The Gathering
            </span>
            <span
              ref={title2Ref}
              className="font-script text-matcha-dark text-[1.14em] ml-3 sm:ml-4 font-normal inline-block [will-change:transform,filter,opacity]"
            >
              beneath the Ojai sun
            </span>
          </h2>
        </div>

        {/* =============================================================== */}
        {/* THE CIRCADIAN SUN ARC INTERACTIVE DIAL                          */}
        {/* =============================================================== */}
        <div ref={arcWrapperRef} className="w-full mb-10 md:mb-14 select-none [will-change:transform,filter,opacity]">
          <div className="relative w-full max-w-4xl mx-auto px-2 sm:px-6">
            {/* SVG Solar Trajectory Arc */}
            <svg
              viewBox="0 0 800 185"
              className="w-full h-auto overflow-visible select-none outline-none focus:outline-none"
              style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
              aria-label="Circadian sun path across the retreat"
            >
              <defs>
                {/* Radial gradient for glowing sun aura */}
                <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E49B48" stopOpacity="0.85" />
                  <stop offset="45%" stopColor="#E49B48" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#E49B48" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4C5A9" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#E49B48" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#D4C5A9" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Background ambient trajectory arc */}
              <path
                d="M 80 130 Q 400 -70 720 130"
                fill="none"
                stroke="rgba(212, 197, 169, 0.22)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />

              {/* Calligraphic animated stroke path */}
              <path
                ref={arcPathRef}
                d="M 80 130 Q 400 -70 720 130"
                fill="none"
                stroke="url(#arc-gradient)"
                strokeWidth="2.5"
                strokeDasharray="6 8"
                strokeLinecap="round"
                className="[will-change:stroke-dashoffset,opacity]"
              />

              {/* Static node markers along the trajectory */}
              {SOLAR_MOMENTS.map((moment, idx) => {
                const isSelected = idx === activeIdx;
                const { x, y } = moment.coord;

                return (
                  <g
                    key={moment.id}
                    ref={(el) => {
                      if (el) nodesRef.current[idx] = el;
                    }}
                    onClick={() => handleSelectMoment(idx)}
                    className="cursor-pointer group select-none outline-none focus:outline-none origin-center [will-change:transform,filter,opacity]"
                    style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
                  >
                    {/* Generous invisible hit zone */}
                    <circle cx={x} cy={y} r="28" fill="transparent" className="cursor-pointer" />

                    {/* Resting circle node */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? "6" : "4.5"}
                      fill={isSelected ? "#2A3723" : "#FAF7F2"}
                      stroke={isSelected ? "#E49B48" : "#B8A08A"}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                      className="transition-all duration-300 pointer-events-none"
                    />

                    {/* Text Label: positioned below the node */}
                    <text
                      x={x}
                      y={y + (idx === 0 || idx === 4 ? 22 : 24)}
                      textAnchor="middle"
                      className={`text-[11px] sm:text-[12px] font-serif tracking-wider transition-colors duration-300 uppercase pointer-events-none ${
                        isSelected
                          ? "fill-[#2A3723] font-medium tracking-normal text-[13px] sm:text-[14px]"
                          : "fill-[#9C8E7E] group-hover:fill-[#4A3F35]"
                      }`}
                    >
                      {moment.solarLabel}
                    </text>

                    {/* Time pill under the label */}
                    <text
                      x={x}
                      y={y + (idx === 0 || idx === 4 ? 35 : 37)}
                      textAnchor="middle"
                      className={`text-[9px] sm:text-[10px] font-serif tracking-widest pointer-events-none ${
                        isSelected ? "fill-[#6B7D50] font-medium" : "fill-[#B8A08A]"
                      }`}
                    >
                      {moment.time}
                    </text>
                  </g>
                );
              })}

              {/* Animated Glowing Sun Orb */}
              <g ref={arcSunRef} className="pointer-events-none [will-change:transform,filter,opacity]">
                <motion.circle
                  animate={{
                    cx: currentMoment.coord.x,
                    cy: currentMoment.coord.y,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: prefersReducedMotion ? 500 : 200,
                    damping: 24,
                  }}
                  r="24"
                  fill="url(#sun-glow)"
                  className="pointer-events-none"
                />
                <motion.circle
                  animate={{
                    cx: currentMoment.coord.x,
                    cy: currentMoment.coord.y,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: prefersReducedMotion ? 500 : 200,
                    damping: 24,
                  }}
                  r="8.5"
                  fill="#E49B48"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="pointer-events-none shadow-lg"
                />
                <motion.circle
                  animate={{
                    cx: currentMoment.coord.x,
                    cy: currentMoment.coord.y,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: prefersReducedMotion ? 500 : 200,
                    damping: 24,
                  }}
                  r="3"
                  fill="#FFFFFF"
                  className="pointer-events-none"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* =============================================================== */}
        {/* THE CENTRAL ATMOSPHERIC STAGE (Double-Bezel Luxury Frame)       */}
        {/* =============================================================== */}
        <div
          ref={stageFrameRef}
          className="rounded-[2.5rem] bg-transparent shadow-xl shadow-earth/5 [will-change:transform,filter,opacity]"
        >
          <div className="rounded-[calc(2.5rem-0.5rem)] sm:rounded-[calc(2.5rem-0.75rem)] bg-[#FAF7F2] p-6 sm:p-8 md:p-12 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch min-h-[440px] lg:min-h-[460px]">
              {/* WebGL MorphSlider Container: stays mounted continuously to preserve WebGL context & state */}
              <div
                ref={leftColumnRef}
                className="lg:col-span-6 relative w-full h-[280px] sm:h-[340px] lg:h-auto min-h-[280px] lg:min-h-[420px] rounded-[1.75rem] overflow-hidden shadow-md [will-change:transform,filter]"
              >
                <MorphSlider
                  ref={morphSliderRef}
                  items={MORPH_ITEMS}
                  startIndex={1}
                  currentIndex={activeIdx}
                  onIndexChange={setActiveIdx}
                  transition="melt"
                  duration={0.5}
                  intensity={0.45}
                  scale={2.2}
                  aberration={0.01}
                  drift={0.3}
                  radius={28}
                  showCaptions={false}
                  showControls={false}
                  showIndicators={false}
                  className="w-full h-full"
                />
              </div>

              {/* Narrative & Sensory Story */}
              <div
                ref={rightColumnRef}
                className="lg:col-span-6 flex flex-col justify-between py-1 min-h-[280px] lg:min-h-[420px] [will-change:transform,filter]"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMoment.id}
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1"
                  >
                    {/* Clean Time Tag */}
                    <div className="mb-2.5">
                      <span className="text-matcha-dark text-xs sm:text-sm uppercase tracking-widest font-serif font-medium">
                        {currentMoment.time}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="mb-4">
                      <h3 className="font-serif font-display text-2xl sm:text-3xl md:text-4xl text-earth tracking-tight leading-tight">
                        {currentMoment.title}
                      </h3>
                    </div>

                    {/* Narrative Description */}
                    <p className="font-serif text-stone text-base sm:text-lg leading-relaxed font-light">
                      {currentMoment.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Step Navigation Controls without text label */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-earth/10 mt-6">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous sun moment"
                    className="w-10 h-10 rounded-full border border-earth/20 flex items-center justify-center text-earth hover:bg-earth hover:text-cream transition-colors duration-200 cursor-pointer"
                  >
                    <ArrowLeft weight="light" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next sun moment"
                    className="w-10 h-10 rounded-full border border-earth/20 flex items-center justify-center text-earth hover:bg-earth hover:text-cream transition-colors duration-200 cursor-pointer"
                  >
                    <ArrowRight weight="light" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
