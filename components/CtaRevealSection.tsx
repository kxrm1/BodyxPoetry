"use client";

import { useEffect, useRef, useState } from "react";
import TicketSection from "./TicketSection";
import Footer from "./Footer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CtaRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const measure = () => {
      if (contentRef.current) {
        const height = contentRef.current.offsetHeight;
        setContentHeight(height);
        if (typeof window !== "undefined") {
          ScrollTrigger.refresh();
        }
      }
    };

    measure();
    window.addEventListener("resize", measure);

    const ro = new ResizeObserver(() => {
      measure();
    });

    if (contentRef.current) {
      ro.observe(contentRef.current);
    }

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(measure);
    }

    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!container || !content) return;

    // Initialize content inside container with matcha green background visible
    gsap.set(content, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      visibility: "visible",
      pointerEvents: "none",
      zIndex: 10,
    });

    const ctx = gsap.context(() => {
      const vh = window.innerHeight;
      const ch = content.offsetHeight || vh;
      const isOverflown = ch > vh;
      const diff = Math.max(0, ch - vh);

      const syncState = (self: ScrollTrigger) => {
        if (self.isActive) {
          gsap.set(content, {
            position: "fixed",
            top: 0,
            bottom: "auto",
            left: 0,
            width: "100%",
            visibility: "visible",
            pointerEvents: "auto",
            zIndex: 10,
          });
        } else if (self.progress >= 1) {
          // Scrolled completely to bottom: anchor to bottom of spacer
          gsap.set(content, {
            position: "absolute",
            top: "auto",
            bottom: 0,
            left: 0,
            width: "100%",
            visibility: "visible",
            pointerEvents: "auto",
            zIndex: 10,
            y: 0,
          });
        } else {
          // Above section: keep absolute at top of container with zero flash
          gsap.set(content, {
            position: "absolute",
            top: 0,
            bottom: "auto",
            left: 0,
            width: "100%",
            visibility: "visible",
            pointerEvents: "none",
            zIndex: 10,
            y: 0,
          });
        }
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
          onEnter: (self) => syncState(self),
          onLeave: (self) => syncState(self),
          onEnterBack: (self) => syncState(self),
          onLeaveBack: (self) => syncState(self),
          onUpdate: (self) => syncState(self),
          onRefresh: (self) => syncState(self),
        },
      });

      if (isOverflown && !prefersReduced) {
        // Phase 1: Keep content stationary at y: 0 while GatheringSection lifts off the screen.
        // This guarantees the top ("Get Your Ticket Today") is NEVER covered by GatheringSection!
        tl.to(content, {
          y: 0,
          ease: "none",
          duration: vh,
        });

        // Phase 2: Once GatheringSection has cleared the screen, smoothly scroll the remaining content.
        tl.to(content, {
          y: -diff,
          ease: "none",
          duration: diff,
        });
      } else if (inner && !prefersReduced) {
        tl.fromTo(
          inner,
          { y: -25, opacity: 0.88 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            duration: 1,
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, [prefersReduced, contentHeight]);

  return (
    <div
      ref={containerRef}
      id="ticket-container"
      className="relative w-full z-10 bg-[#24331C]"
      style={{
        height: contentHeight ? `${contentHeight}px` : "auto",
        minHeight: "100vh",
      }}
    >
      <div
        ref={contentRef}
        className="w-full z-10 bg-[#24331C] text-cream overflow-hidden"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          visibility: "visible",
          willChange: "transform",
        }}
      >
        <div ref={innerRef} className="w-full will-change-transform">
          <TicketSection />
          <Footer />
        </div>
      </div>
    </div>
  );
}
