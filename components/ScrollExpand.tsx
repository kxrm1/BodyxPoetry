"use client";

import React, { useCallback, useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

type ConfigKey =
  | 'startWidth'
  | 'startHeight'
  | 'startRadius'
  | 'endRadius'
  | 'mediaZoom'
  | 'heroExpandedScale'
  | 'scrollDistance'
  | 'holdDistance'
  | 'curtainDistance'
  | 'smoothing'
  | 'overlayScrim'
  | 'useWindowScroll'
  | 'enabled'
  | 'matchTitleWidth'
  | 'titleWidthPadding';

export interface ScrollExpandProps {
  src?: string;
  mediaType?: 'image' | 'video';
  poster?: string;
  alt?: string;
  title?: ReactNode;
  scrollHint?: string;
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  heroExpandedScale?: number;
  scrollDistance?: number;
  holdDistance?: number;
  curtainDistance?: number;
  smoothing?: number;
  overlayScrim?: number;
  useWindowScroll?: boolean;
  enabled?: boolean;
  matchTitleWidth?: boolean;
  titleWidthPadding?: number;
  onThemeChange?: (theme: 'dark' | 'white') => void;
  bottomGradient?: boolean;
  bottomGradientClassName?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  customMedia?: ReactNode;
  [key: string]: unknown;
}

const ScrollExpand: React.FC<ScrollExpandProps> = ({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  title = '',
  scrollHint = '',
  startWidth = 46,
  startHeight = 60,
  startRadius = 28,
  endRadius = 0,
  mediaZoom = 1.35,
  heroExpandedScale = 1.08,
  scrollDistance = 1.3,
  holdDistance = 0.4,
  curtainDistance = 1.0,
  smoothing = 0.08,
  overlayScrim = 0.48,
  useWindowScroll = false,
  enabled = true,
  matchTitleWidth = false,
  titleWidthPadding = 0,
  onThemeChange,
  bottomGradient = true,
  bottomGradientClassName = 'bg-[linear-gradient(to_top,rgba(0,0,0,0.76)_0%,rgba(0,0,0,0.52)_28%,rgba(0,0,0,0.22)_60%,rgba(0,0,0,0.06)_82%,rgba(0,0,0,0)_100%)]',
  children,
  customMedia,
  className = '',
  style,
  ...rest
}: ScrollExpandProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<(HTMLImageElement & HTMLVideoElement) | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);

  const insetsRef = useRef({
    startIx: 0,
    startIy: 0,
  });
  const lastProgressRef = useRef<number>(0);
  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isIntroActiveRef = useRef<boolean>(false);

  const propsRef = useRef<Required<Pick<ScrollExpandProps, ConfigKey>>>(
    {} as Required<Pick<ScrollExpandProps, ConfigKey>>
  );
  propsRef.current = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    heroExpandedScale,
    scrollDistance,
    holdDistance,
    curtainDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
    matchTitleWidth,
    titleWidthPadding,
  };

  const measureDimensions = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const stageRect = stage.getBoundingClientRect();
    const stageW = stageRect.width || (typeof window !== 'undefined' ? window.innerWidth : 1200);
    const stageH = stageRect.height || (typeof window !== 'undefined' ? window.innerHeight : 800);
    const c = propsRef.current;

    let targetW = stageW * (c.startWidth / 100);

    if (c.matchTitleWidth && titleRef.current) {
      const textEl =
        titleRef.current.querySelector('[data-title-target]') ||
        titleRef.current.querySelector('h1') ||
        titleRef.current.firstElementChild ||
        titleRef.current;

      if (textEl) {
        const textRect = textEl.getBoundingClientRect();
        if (textRect.width > 0) {
          targetW = Math.max(targetW, textRect.width + c.titleWidthPadding);
        }
      }
    }

    const startIx = Math.max(0, (stageW - targetW) / 2);
    const startIy = (stageH * (1 - c.startHeight / 100)) / 2;

    insetsRef.current = {
      startIx,
      startIy,
    };
  }, []);

  const applyProgress = useCallback((p: number) => {
    if (isIntroActiveRef.current && p <= 0.003) {
      return;
    }
    lastProgressRef.current = p;
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = propsRef.current;

    const e = smoothstep(0, 1, p);
    const { startIx, startIy } = insetsRef.current;

    const currentIx = startIx * (1 - e);
    const currentIy = startIy * (1 - e);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;

    if (startIx === 0 && startIy === 0 && r === 0) {
      frame.style.clipPath = 'none';
    } else {
      frame.style.clipPath = `inset(${currentIy}px ${currentIx}px ${currentIy}px ${currentIx}px round ${r}px)`;
    }

    const targetExpandedScale = c.heroExpandedScale ?? 1.08;
    media.style.transform = `scale(${c.mediaZoom + (targetExpandedScale - c.mediaZoom) * e})`;

    if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`;

    if (titleRef.current) {
      const out = smoothstep(0.3, 0.85, p);
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-36 * out}px, 0) scale(${1 + 0.05 * out})`;
      titleRef.current.style.filter = `blur(${16 * out}px)`;
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.15, p);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${12 * gone}px, 0)`;
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.60, 0.96, p);
      overlayRef.current.style.opacity = `${inn}`;
      overlayRef.current.style.transform = `translate3d(0, ${22 * (1 - inn)}px, 0)`;
      overlayRef.current.style.pointerEvents = inn > 0.85 ? 'auto' : 'none';

      // Granular blur & stagger reveals for statement, meta, and button:
      const statementEl = overlayRef.current.querySelector('[data-hero-statement]') as HTMLElement | null;
      const metaEl = overlayRef.current.querySelector('[data-hero-meta]') as HTMLElement | null;
      const buttonEl = overlayRef.current.querySelector('[data-hero-button]') as HTMLElement | null;

      if (statementEl) {
        const stP = smoothstep(0.64, 0.93, p);
        statementEl.style.opacity = `${stP}`;
        statementEl.style.transform = `translate3d(0, ${32 * (1 - stP)}px, 0)`;
        statementEl.style.filter = `blur(${14 * (1 - stP)}px)`;
      }
      if (metaEl) {
        const metaP = smoothstep(0.72, 0.96, p);
        metaEl.style.opacity = `${metaP}`;
        metaEl.style.transform = `translate3d(0, ${24 * (1 - metaP)}px, 0)`;
        metaEl.style.filter = `blur(${10 * (1 - metaP)}px)`;
      }
      if (buttonEl) {
        const btnP = smoothstep(0.78, 1.0, p);
        buttonEl.style.opacity = `${btnP}`;
        buttonEl.style.transform = `translate3d(0, ${24 * (1 - btnP)}px, 0) scale(${0.92 + 0.08 * btnP})`;
        buttonEl.style.filter = `blur(${12 * (1 - btnP)}px)`;
      }
    }
  }, []);

  const currentThemeRef = useRef<'dark' | 'white'>('dark');

  const updateNavTheme = useCallback(
    (newTheme: 'dark' | 'white') => {
      if (currentThemeRef.current !== newTheme) {
        currentThemeRef.current = newTheme;
        onThemeChange?.(newTheme);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('nav-theme-change', { detail: { theme: newTheme } })
          );
        }
      }
    },
    [onThemeChange]
  );

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    if (reduceMotion) {
      applyProgress(1);
      return;
    }

    const c = propsRef.current;

    measureDimensions();

    // When useWindowScroll is enabled, use GSAP ScrollTrigger to pin stage in the viewport
    // ensuring the section DOES NOT scroll away until the expand animation is 100% complete
    if (useWindowScroll) {
      const totalDistance = Math.max(0.4, c.scrollDistance);
      const hold = Math.max(0.1, c.holdDistance);
      const curtain = Math.max(0.2, c.curtainDistance ?? 1.0);
      const totalScrollSpan = totalDistance + hold + curtain;
      const expandRatio = totalDistance / totalScrollSpan;
      const holdRatio = (totalDistance + hold) / totalScrollSpan;

      const ctx = gsap.context(() => {
        const hasScrolled = typeof window !== 'undefined' && window.scrollY > 15;

        const isFullScreenHero = c.startWidth >= 100 && c.startHeight >= 100;

        if (hasScrolled) {
          isIntroActiveRef.current = false;
          applyProgress(0);
          updateNavTheme(isFullScreenHero ? 'white' : 'dark');
        } else {
          isIntroActiveRef.current = true;
          updateNavTheme(isFullScreenHero ? 'white' : 'dark');

          // 1. Initial State before entrance begins:
          if (frameRef.current) {
            frameRef.current.style.clipPath = isFullScreenHero ? 'none' : 'inset(0px 0px 0px 0px round 0px)';
          }
          if (mediaRef.current) {
            mediaRef.current.style.transform = `scale(${isFullScreenHero ? c.mediaZoom : 1.44})`;
          }
          if (titleRef.current) {
            titleRef.current.style.opacity = '0';
            titleRef.current.style.filter = 'blur(36px)';
            titleRef.current.style.transform = 'translate3d(0, 36px, 0) scale(0.92)';
          }
          if (hintRef.current) {
            hintRef.current.style.opacity = '0';
            hintRef.current.style.transform = 'translate3d(0, 24px, 0)';
          }

          // 2. Play initial reveal animation:
          const animState = { factor: 0, mediaScale: isFullScreenHero ? c.mediaZoom : 1.44 };
          const { startIx, startIy } = insetsRef.current;
          const initialMediaZoom = c.mediaZoom;
          const initialRadius = c.startRadius;

          const tlEntrance = gsap.timeline({
            delay: 0.15,
            onUpdate: () => {
              if (isIntroActiveRef.current && frameRef.current && mediaRef.current) {
                if (isFullScreenHero) {
                  frameRef.current.style.clipPath = 'none';
                  mediaRef.current.style.transform = `scale(${initialMediaZoom})`;
                } else {
                  const f = animState.factor;
                  const iy = startIy * f;
                  const ix = startIx * f;
                  const r = initialRadius * f;
                  frameRef.current.style.clipPath = `inset(${iy}px ${ix}px ${iy}px ${ix}px round ${r}px)`;
                  mediaRef.current.style.transform = `scale(${animState.mediaScale})`;
                }
              }
            },
            onComplete: () => {
              isIntroActiveRef.current = false;
              entranceTimelineRef.current = null;
              applyProgress(0);
            },
          });

          entranceTimelineRef.current = tlEntrance;

          // Blur reveal for the title: "Body × Poetry"
          if (titleRef.current) {
            tlEntrance.to(
              titleRef.current,
              {
                opacity: 1,
                filter: 'blur(0px)',
                transform: 'translate3d(0, 0, 0) scale(1)',
                duration: 1.35,
                ease: 'power3.out',
              },
              0.1
            );
          }

          // When not full screen, the margins slide in. When full screen, image stays full screen.
          if (!isFullScreenHero) {
            tlEntrance.to(
              animState,
              {
                factor: 1,
                mediaScale: initialMediaZoom,
                duration: 1.45,
                ease: 'power3.inOut',
              },
              0.45
            );
          }

          // Scroll hint gently slides up into place
          if (hintRef.current) {
            tlEntrance.to(
              hintRef.current,
              {
                opacity: 1,
                transform: 'translate3d(0, 0, 0)',
                duration: 0.85,
                ease: 'power2.out',
              },
              1.25
            );
          }
        }

        ScrollTrigger.create({
          trigger: track,
          start: 'top top',
          end: () => `+=${window.innerHeight * totalScrollSpan}`,
          pin: stage,
          pinSpacing: true,
          scrub: c.smoothing > 0 ? 0.5 : true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;

            // If user scrolled while intro is running, cancel intro and let scroll take over:
            if (p > 0.003 && isIntroActiveRef.current) {
              isIntroActiveRef.current = false;
              if (entranceTimelineRef.current) {
                entranceTimelineRef.current.kill();
                entranceTimelineRef.current = null;
              }
            }

            // Guard: don't let initial ScrollTrigger progress 0 overwrite running intro
            if (isIntroActiveRef.current && p <= 0.003) {
              return;
            }

            const targetExpandedScale = c.heroExpandedScale ?? 1.08;

            // Phase 1: Expand from initial card to fullscreen
            if (p <= expandRatio) {
              const expandP = clamp(p / expandRatio, 0, 1);
              applyProgress(expandP);

              if (parallaxRef.current) {
                parallaxRef.current.style.transform = 'translate3d(0, 0, 0)';
                parallaxRef.current.style.filter = 'brightness(1)';
              }
            } else if (p <= holdRatio) {
              // Phase 2: Hold fullscreen state slightly oversized (e.g. 1.08)
              applyProgress(1);

              if (mediaRef.current) {
                mediaRef.current.style.transform = `scale(${targetExpandedScale})`;
              }
              if (parallaxRef.current) {
                parallaxRef.current.style.transform = 'translate3d(0, 0, 0)';
                parallaxRef.current.style.filter = 'brightness(1)';
              }
            } else {
              // Phase 3: Parallax curtain phase - section underneath slides up over the hero
              // The hero maintains 100% fullscreen coverage of the viewport at all times,
              // smoothly shrinking from oversized (1.08) down to the exact size of the viewport (1.0)
              applyProgress(1);

              const curtainP = clamp((p - holdRatio) / (1 - holdRatio), 0, 1);

              if (mediaRef.current) {
                const currentScale = targetExpandedScale - (targetExpandedScale - 1.0) * curtainP;
                mediaRef.current.style.transform = `scale(${currentScale})`;
              }

              if (parallaxRef.current) {
                // Subtle lighting depth without moving the stage or shrinking below viewport
                const brightness = 1 - curtainP * 0.18;
                parallaxRef.current.style.transform = 'translate3d(0, 0, 0)';
                parallaxRef.current.style.filter = `brightness(${brightness})`;
              }
            }

            // Navigation Theme synchronization:
            // 1. First half of expansion: dark (#2C2C2C, matching page text)
            // 2. Second half of expansion through fullscreen hold: white (#FFFFFF)
            // 3. As underneath section slides over top navigation (curtainP >= 0.78): returns to dark (#2C2C2C)
            let navTheme: 'dark' | 'white' = isFullScreenHero ? 'white' : 'dark';
            if (p <= 0) {
              navTheme = isFullScreenHero ? 'white' : 'dark';
            } else if (p < expandRatio) {
              const expandP = p / expandRatio;
              navTheme = isFullScreenHero || expandP >= 0.5 ? 'white' : 'dark';
            } else if (p <= holdRatio) {
              navTheme = 'white';
            } else {
              const curtainP = (p - holdRatio) / (1 - holdRatio);
              navTheme = curtainP >= 0.78 ? 'dark' : 'white';
            }
            updateNavTheme(navTheme);
          },
          onLeave: () => {
            updateNavTheme('dark');
            if (mediaRef.current) {
              mediaRef.current.style.transform = 'scale(1)';
            }
            if (parallaxRef.current) {
              parallaxRef.current.style.transform = 'translate3d(0, 0, 0)';
              parallaxRef.current.style.filter = 'brightness(0.82)';
            }
          },
          onEnterBack: () => {
            updateNavTheme('dark');
          },
          onLeaveBack: () => {
            updateNavTheme(isFullScreenHero ? 'white' : 'dark');
            if (parallaxRef.current) {
              parallaxRef.current.style.transform = 'translate3d(0, 0, 0)';
              parallaxRef.current.style.filter = 'brightness(1)';
            }
          },
        });
      }, root);

      const handleEarlyScroll = () => {
        if (isIntroActiveRef.current && window.scrollY > 8) {
          isIntroActiveRef.current = false;
          if (entranceTimelineRef.current) {
            entranceTimelineRef.current.kill();
            entranceTimelineRef.current = null;
          }
          applyProgress(lastProgressRef.current);
        }
      };
      window.addEventListener('scroll', handleEarlyScroll, { passive: true });

      const onResize = () => {
        measureDimensions();
        if (!isIntroActiveRef.current) {
          applyProgress(lastProgressRef.current);
        }
      };

      window.addEventListener('resize', onResize);
      if (typeof document !== 'undefined' && document.fonts) {
        document.fonts.ready.then(onResize);
      }

      return () => {
        window.removeEventListener('scroll', handleEarlyScroll);
        window.removeEventListener('resize', onResize);
        if (entranceTimelineRef.current) {
          entranceTimelineRef.current.kill();
          entranceTimelineRef.current = null;
        }
        ctx.revert();
      };
    }

    // Fallback for internal container scroll mode
    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;

    const measure = () => {
      measureDimensions();
      stageH = root.clientHeight;
      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`;

      const w = root.clientWidth || stageH;
      stage.style.setProperty('--se-title-size', `${clamp(w * 0.075, 20, 84)}px`);
    };

    const readProgress = () => {
      if (!c.enabled) return 1;
      const span = stageH * Math.max(0.01, c.scrollDistance);
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (propsRef.current.smoothing <= 0) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    root.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      root.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [applyProgress, useWindowScroll, measureDimensions]);

  const media = customMedia ? (
    <div
      ref={mediaRef as unknown as React.RefObject<HTMLDivElement>}
      className="absolute inset-0 w-full h-full origin-center select-none [will-change:transform]"
    >
      {customMedia}
    </div>
  ) : mediaType === 'video' ? (
    <video
      ref={mediaRef as unknown as React.RefObject<HTMLVideoElement>}
      className="absolute inset-0 w-full h-full object-cover origin-center select-none [will-change:transform]"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
    />
  ) : (
    <img
      ref={mediaRef as unknown as React.RefObject<HTMLImageElement>}
      className="absolute inset-0 w-full h-full object-cover origin-center select-none [will-change:transform]"
      src={src}
      alt={alt}
      draggable={false}
    />
  );

  return (
    <div
      ref={rootRef}
      className={`relative w-full ${useWindowScroll ? '' : 'h-full overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'} ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="relative w-full">
        <div ref={stageRef} className="relative z-10 w-full h-[100dvh] overflow-hidden bg-bg [--se-title-size:4rem]">
          <div ref={parallaxRef} className="w-full h-full relative [will-change:transform,filter] origin-center">
            <div
              ref={frameRef}
              className="absolute inset-0 [will-change:clip-path] shadow-2xl"
            >
              {media}
              <div
                ref={scrimRef}
                className="absolute inset-0 opacity-0 pointer-events-none bg-[linear-gradient(to_top,rgba(0,0,0,0.78),rgba(0,0,0,0.2)_45%,rgba(0,0,0,0.4))]"
              />
              {children ? (
                <div
                  ref={overlayRef}
                  className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-12 lg:p-16 opacity-0 [will-change:opacity,transform] z-10 pointer-events-none"
                >
                  {/* Bottom-to-top gradient behind the paragraph and button for optimal legibility */}
                  {bottomGradient ? (
                    <div
                      aria-hidden="true"
                      className={`absolute inset-x-0 -bottom-8 h-[65%] min-h-[360px] max-h-[720px] pointer-events-none ${bottomGradientClassName}`.trim()}
                    />
                  ) : null}
                  <div className="relative z-10 w-full">
                    {children}
                  </div>
                </div>
              ) : null}
            </div>
            {title ? (
              <div
                ref={titleRef}
                className="absolute inset-0 flex items-center justify-center m-0 px-4 text-center pointer-events-none [will-change:opacity,transform,filter] z-20"
              >
                {typeof title === 'string' ? (
                  <span className="font-bold leading-none tracking-[-0.03em] text-white [font-size:var(--se-title-size)] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
                    {title}
                  </span>
                ) : (
                  title
                )}
              </div>
            ) : null}
            {scrollHint ? (
              <div
                ref={hintRef}
                className="absolute inset-x-0 bottom-6 text-center text-xs tracking-[0.25em] text-white/75 uppercase pointer-events-none [will-change:opacity,transform] z-20 flex flex-col items-center gap-2 font-serif"
              >
                <span>{scrollHint}</span>
                <div className="w-3.5 h-6 rounded-full border border-white/30 flex items-start justify-center p-1">
                  <div className="w-1 h-1.5 rounded-full bg-matcha animate-bounce" />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollExpand;
