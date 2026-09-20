"use client";

import { useState, useEffect } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ManifestoLine {
  text: string;
  emphasisWords?: string[];
  italicWords?: string[];
}

const MANIFESTO_LINES: ManifestoLine[] = [
  {
    text: "Where the physical body meets conscious breath.",
    emphasisWords: ["conscious", "breath."],
    italicWords: ["breath."],
  },
  {
    text: "Where intentional movement becomes living meditation.",
    emphasisWords: ["living", "meditation."],
    italicWords: ["meditation."],
  },
  {
    text: "A sacred pause carved within the relentless noise.",
    emphasisWords: ["sacred", "pause"],
    italicWords: [],
  },
  {
    text: "Slow down to listen. Soften to receive.",
    emphasisWords: ["listen.", "receive."],
    italicWords: ["Soften"],
  },
  {
    text: "Reconnect. Realign. Return to your true center.",
    emphasisWords: ["center."],
    italicWords: ["true"],
  },
];

export default function ManifestoSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        ScrollTrigger.refresh();
      }
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      style={{ marginTop: mounted ? "-100vh" : 0 }}
      className="relative z-20 min-h-screen py-32 sm:py-36 md:py-44 w-full bg-[#FAF7F2] rounded-t-[2.5rem] sm:rounded-t-[3.5rem] md:rounded-t-[4.5rem] shadow-[0_-30px_60px_rgba(0,0,0,0.18)] flex items-center justify-center px-6 sm:px-12 md:px-16 lg:px-20 overflow-hidden select-none"
    >
      {/* Subtle warm background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-matcha/8 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[40vw] h-[40vw] rounded-full bg-sand/20 blur-[130px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <ScrollReveal
          baseRotation={2.5}
          baseOpacity={0.12}
          blurStrength={5}
          rotationEnd="bottom 50%"
          wordAnimationEnd="bottom 40%"
          containerClassName="w-full my-0"
          textClassName="w-full text-[clamp(1.75rem,3.8vw,3.2rem)] leading-[1.38] md:leading-[1.42]"
        >
          <div className="space-y-4 sm:space-y-6 md:space-y-7 text-center md:text-left">
            {MANIFESTO_LINES.map((line, lineIdx) => (
              <div key={lineIdx} className="overflow-visible">
                {line.text.split(" ").map((word, wordIdx) => {
                  const cleanWord = word.replace(/[.,]/g, "");
                  const isItalic = line.italicWords?.some(
                    (iw) =>
                      cleanWord.toLowerCase() ===
                      iw.replace(/[.,]/g, "").toLowerCase()
                  );
                  const isEmphasized = line.emphasisWords?.some(
                    (ew) =>
                      cleanWord.toLowerCase() ===
                      ew.replace(/[.,]/g, "").toLowerCase()
                  );

                  if (isItalic) {
                    return (
                      <span
                        key={`${lineIdx}-${wordIdx}`}
                        className="font-script font-normal text-matcha-dark text-[1.14em] mr-[0.26em]"
                      >
                        {word}
                      </span>
                    );
                  }

                  return (
                    <span
                      key={`${lineIdx}-${wordIdx}`}
                      className={`font-serif font-display text-[1.28em] sm:text-[1.34em] text-earth tracking-tight font-normal mr-[0.24em] ${
                        isEmphasized ? "font-medium" : ""
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
