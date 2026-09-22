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
  autoPlay?: boolean;
  scrub?: boolean | number;
  triggerRef?: RefObject<HTMLElement | null>;
  triggerStart?: string;
  triggerEnd?: string;
  toggleActions?: string;
  stagger?: number;
  duration?: number;
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
  wordAnimationEnd = 'bottom bottom',
  autoPlay = true,
  scrub = false,
  triggerRef,
  triggerStart = 'top 75%',
  triggerEnd = 'bottom top',
  toggleActions = 'play reverse play reverse',
  stagger = 0.032,
  duration = 0.65,
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    return processWords(children);
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    const wordElements = el.querySelectorAll<HTMLElement>('.word');

    if (reduceMotion) {
      gsap.set(el, { rotate: 0 });
      gsap.set(wordElements, { opacity: 1, filter: 'none' });
      return;
    }

    const ctx = gsap.context(() => {
      const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
      const targetTrigger = (triggerRef && triggerRef.current) || el;

      if (autoPlay && !scrub) {
        // Auto-play mode: once triggered into view, plays to completion and reverses/resets on scroll up
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: targetTrigger,
            scroller,
            start: triggerStart,
            end: triggerEnd,
            toggleActions: toggleActions,
          },
        });

        tl.fromTo(
          el,
          { transformOrigin: '0% 50%', rotate: baseRotation },
          {
            ease: 'power2.out',
            rotate: 0,
            duration: duration * 1.6,
          },
          0
        );

        tl.fromTo(
          wordElements,
          {
            opacity: baseOpacity,
            ...(enableBlur ? { filter: `blur(${blurStrength}px)` } : {}),
            willChange: enableBlur ? 'opacity, filter' : 'opacity',
          },
          {
            ease: 'power2.out',
            opacity: 1,
            ...(enableBlur ? { filter: 'blur(0px)' } : {}),
            stagger: stagger,
            duration: duration,
            clearProps: 'willChange',
          },
          0.04
        );
      } else {
        // Scroll-scrubbed reading progression: animation progress is tied to scroll position
        const scrubValue = typeof scrub === 'number' ? scrub : (scrub ? 0.6 : true);
        const animStart = triggerStart || 'top bottom-=20%';
        const animEnd = triggerEnd || wordAnimationEnd || 'bottom center';

        if (baseRotation !== 0) {
          gsap.fromTo(
            el,
            { transformOrigin: '0% 50%', rotate: baseRotation },
            {
              ease: 'none',
              rotate: 0,
              scrollTrigger: {
                trigger: targetTrigger,
                scroller,
                start: animStart,
                end: rotationEnd || animEnd,
                scrub: scrubValue,
              },
            }
          );
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: targetTrigger,
            scroller,
            start: animStart,
            end: animEnd,
            scrub: scrubValue,
          },
        });

        tl.fromTo(
          wordElements,
          {
            opacity: baseOpacity,
            ...(enableBlur ? { filter: `blur(${blurStrength}px)` } : {}),
            willChange: 'opacity',
          },
          {
            ease: 'none',
            opacity: 1,
            ...(enableBlur ? { filter: 'blur(0px)' } : {}),
            stagger: stagger || 0.05,
            clearProps: 'willChange',
          }
        );
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [
    scrollContainerRef,
    triggerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
    autoPlay,
    scrub,
    triggerStart,
    triggerEnd,
    toggleActions,
    stagger,
    duration,
  ]);

  return (
    <h2 ref={containerRef} className={`my-5 ${containerClassName}`}>
      <div className={`text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] ${textClassName}`}>{splitText}</div>
    </h2>
  );
};

export default ScrollReveal;
