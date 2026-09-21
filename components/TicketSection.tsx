"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";

const FAQS = [
  {
    question: "What should I wear or bring with me?",
    answer:
      "Wear soft, breathable layers suitable for movement and deep relaxation. All yoga mats, organic wool bolsters, weighted silk eye masks, and hydration are prepared for you. You only need to bring yourself.",
  },
  {
    question: "Can beginners or first-time movers participate?",
    answer:
      "Absolutely. Our movement is somatic and intuitive rather than performative. The flow is guided with multiple gentle modifications designed to honor your body's energy and pace.",
  },
  {
    question: "How are dietary accommodations handled at the Harvest Table?",
    answer:
      "Our three-course lunch is entirely plant-forward, biodynamically grown in Ojai soil, and naturally dairy-free. We gladly accommodate gluten-free, nut-free, and specific allergy requests indicated during reservation.",
  },
  {
    question: "What happens in case of seasonal rain or cold weather?",
    answer:
      "The sanctuary includes both the open-air cedar platform and our 18-inch climate-regulated rammed-earth pavilion with heated radiant hearths. The gathering proceeds in sheltered warmth regardless of mountain weather.",
  },
];

export default function TicketSection() {
  const prefersReduced = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      id="ticket"
      className="relative z-20 w-full bg-[#8B9E6B] text-[#1C2716] pt-20 sm:pt-28 md:pt-32 pb-20 sm:pb-28 px-6 sm:px-10 lg:px-16 overflow-hidden select-none scroll-mt-12"
    >
      <div className="max-w-4xl mx-auto relative z-20">
        {/* Simple Ticket Sale Section */}
        <div className="text-center mb-16 sm:mb-24">
          <motion.h2
            initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#1C2716] leading-[1.02] tracking-tight mb-8"
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
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#1C2716] text-[#FAF7F2] hover:bg-[#FAF7F2] hover:text-[#1C2716] transition-all duration-300 font-serif font-medium uppercase tracking-[0.18em] text-sm cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Your Ticket</span>
              <span className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                <ArrowRight weight="light" className="w-4 h-4" />
              </span>
            </a>
          </motion.div>
        </div>

        {/* Frequently Asked Questions Section */}
        <div className="max-w-3xl mx-auto pt-16 border-t border-[#1C2716]/15">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.22em] font-serif text-[#1C2716]/70 block mb-2 font-medium">
              Questions &amp; Details
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1C2716] font-normal">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl bg-[#FAF7F2]/30 hover:bg-[#FAF7F2]/45 border border-[#1C2716]/10 overflow-hidden transition-colors duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-serif text-base sm:text-lg text-[#1C2716] font-normal">
                      {faq.question}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full bg-[#1C2716]/10 flex items-center justify-center text-[#1C2716] shrink-0 text-lg transition-transform duration-300 ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 sm:px-6 font-serif text-sm sm:text-base text-[#1C2716]/80 leading-relaxed font-light border-t border-[#1C2716]/10 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
