"use client";

import React, { useEffect, useRef, useMemo, type ReactNode, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

// Recursively processes children so every word has the .word class for GSAP targeting
function processWords(node: ReactNode, keyPrefix = 'w'): ReactNode {
  if (typeof node === 'string') {
    return node.split(/(\s+)/).map((part, index) => {
      if (part.match(/^\s+$/)) return part;
      return (
        <span className="inline-block word" key={`${keyPrefix}-${index}`}>
          {part}
        </span>
      );
    });
  }

  if (React.isValidElement(node)) {
    const props = node.props as { className?: string; children?: ReactNode };
    const currentClass = props.className || '';

    // If this element already has the word class, keep it
    if (currentClass.includes('word')) {
      return node;
    }

    // Terminal leaf element with pure text children
    if (typeof props.children === 'string') {
      const parts = props.children.split(/(\s+)/).map((part, index) => {
        if (part.match(/^\s+$/)) return part;
        return (
          <span
            className={`inline-block word ${currentClass}`}
            key={`${keyPrefix}-${index}`}
          >
            {part}
          </span>
        );
      });
      return parts;
    }

    // Otherwise clone and recursively process nested children
    if (props.children) {
      return React.cloneElement(
        node,
        undefined,
        React.Children.map(props.children, (child, idx) =>
          processWords(child, `${keyPrefix}-${idx}`)
        )
      );
    }
  }

  if (Array.isArray(node)) {
    return node.map((child, idx) => processWords(child, `${keyPrefix}-${idx}`));
  }

  return node;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    return processWords(children);
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom',
            end: rotationEnd,
            scrub: true
          }
        }
      );

      const wordElements = el.querySelectorAll<HTMLElement>('.word');

      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: 'opacity' },
        {
          ease: 'none',
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true
          }
        }
      );

      if (enableBlur) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: 'none',
            filter: 'blur(0px)',
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom-=20%',
              end: wordAnimationEnd,
              scrub: true
            }
          }
        );
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`my-5 ${containerClassName}`}>
      <div className={`text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] ${textClassName}`}>{splitText}</div>
    </h2>
  );
};

export default ScrollReveal;
