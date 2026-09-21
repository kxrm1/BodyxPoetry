"use client";

import { ArrowUp } from "@phosphor-icons/react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative w-full bg-[#8B9E6B] text-[#1C2716]/80 py-16 px-6 sm:px-10 lg:px-16 border-t border-[#1C2716]/15 font-serif select-none">
      {/* Organic Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none z-10 mix-blend-multiply bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

      <div className="max-w-6xl mx-auto relative z-20 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand identity */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-serif text-3xl sm:text-4xl text-[#1C2716] tracking-tight font-normal">
            Body <span className="font-serif text-[0.8em] text-[#1C2716]/60">×</span> Poetry
          </span>
          <span className="text-xs text-[#1C2716]/60 tracking-wider">
            Ojai Valley, California
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs uppercase tracking-[0.2em] text-[#1C2716]/75">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1C2716] transition-colors duration-200"
          >
            Instagram
          </a>
          <a
            href="#manifesto"
            className="hover:text-[#1C2716] transition-colors duration-200"
          >
            Manifesto
          </a>
          <a
            href="#activities"
            className="hover:text-[#1C2716] transition-colors duration-200"
          >
            Chambers
          </a>
          <a
            href="mailto:sanctuary@bodyxpoetry.com"
            className="hover:text-[#1C2716] transition-colors duration-200"
          >
            Contact
          </a>
        </div>

        {/* Right side: Copyright & Back to Top */}
        <div className="flex items-center gap-6 text-xs text-[#1C2716]/55">
          <span>© {new Date().getFullYear()} Body × Poetry</span>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="group flex items-center gap-1.5 hover:text-[#1C2716] transition-colors duration-200 cursor-pointer"
          >
            <span className="uppercase tracking-widest text-[10px]">Top</span>
            <ArrowUp
              weight="light"
              className="w-3.5 h-3.5 text-[#1C2716] group-hover:-translate-y-0.5 transition-transform duration-200"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
