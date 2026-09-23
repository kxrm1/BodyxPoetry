"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";

export default function TicketSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="ticket"
      className="relative z-20 w-full bg-[#1C2716] text-[#FAF7F2] overflow-hidden select-none scroll-mt-12"
    >
      {/* Simple Ticket Sale Section — full-bleed photo band */}
      <div className="relative w-full min-h-[85vh] px-6 sm:px-10 lg:px-16 pt-24 sm:pt-32 md:pt-36">
        <img
          src="/images/ticket.jpeg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-[50%_55%] pointer-events-none"
        />
        {/* Top scrim for heading legibility, bottom fade into the footer green */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,39,22,0.55) 0%, rgba(28,39,22,0.25) 38%, rgba(28,39,22,0) 55%, rgba(28,39,22,0.55) 80%, #1C2716 100%)",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h2
            initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#FAF7F2] leading-[1.02] tracking-tight mb-8 drop-shadow-[0_2px_16px_rgba(28,39,22,0.35)]"
          >
            Get Your Ticket Today
          </motion.h2>

          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href="https://buy.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#FAF7F2] text-[#1C2716] hover:bg-[#D4C5A9] hover:text-[#1C2716] transition-all duration-300 font-serif font-medium uppercase tracking-[0.18em] text-sm cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Your Ticket</span>
              <span className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                <ArrowRight weight="light" className="w-4 h-4" />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
