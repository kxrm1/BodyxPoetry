"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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
      "Our three-course lunch is entirely plant-forward, made with locally grown produce, and naturally dairy-free. We gladly accommodate gluten-free, nut-free, and specific allergy requests indicated during reservation.",
  },
  {
    question: "What happens in case of seasonal rain or cold weather?",
    answer:
      "The sanctuary includes both the open-air cedar platform and our 18-inch climate-regulated rammed-earth pavilion with heated radiant hearths. The gathering proceeds in sheltered warmth regardless of the weather.",
  },
];

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative z-20 w-full bg-cream text-[#111111] pt-4 sm:pt-6 pb-20 sm:pb-28 md:pb-32 px-6 sm:px-10 lg:px-16 select-none scroll-mt-12 rounded-b-[2.5rem] sm:rounded-b-[3.5rem] md:rounded-b-[4.5rem]"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.22em] font-serif text-[#6B6B6B] block mb-2 font-medium">
            Questions &amp; Details
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#111111] font-normal">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl bg-[#E6E6E6] hover:bg-[#DDDDDD] border border-[#D4D4D4] overflow-hidden transition-colors duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif text-base sm:text-lg text-[#111111] font-normal">
                    {faq.question}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full bg-[#111111]/10 flex items-center justify-center text-[#111111] shrink-0 text-lg transition-transform duration-300 ${
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
                      <div className="px-5 pb-6 sm:px-6 font-serif text-sm sm:text-base text-[#2B2B2B] leading-relaxed font-light border-t border-[#D4D4D4] pt-4">
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
    </section>
  );
}
