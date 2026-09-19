import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { ExternalLink, Quote, Star } from "lucide-react";

import { testimonials, type TestimonialItem } from "../data/testimonialsData";

/* All 4 Google reviews rotate on the homepage with profile photos; the
   shortest review is featured at the bottom of the Gallery page instead. */
const homepageTestimonials = testimonials;

/* Reviewers are real Google users; show branded initials instead of
   impersonating them with stock photos. */
const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const COUNT = homepageTestimonials.length;
const TAU = Math.PI * 2;

/* Renders the reviewer's photo, falling back to the branded initials avatar if
   the image is missing or fails to load (e.g. a 404 on a new host) - so the
   orbit never shows an empty broken circle after a deployment. */
function ReviewerAvatar({
  item,
  imgClassName,
  fallbackClassName,
  initialsClassName,
}: {
  item: TestimonialItem;
  imgClassName: string;
  fallbackClassName: string;
  initialsClassName: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  if (item.imageSrc && !imgFailed) {
    return (
      <img
        src={item.imageSrc}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setImgFailed(true)}
        className={imgClassName}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={fallbackClassName}
    >
      <span className={initialsClassName}>{initialsOf(item.name)}</span>
    </div>
  );
}

/* Every avatar occupies the same fixed square box; the visual size comes from
   `scale`, so the revolving orbit can never cause layout shift. */
const AVATAR_BOX = 96;

const AUTO_ROTATE_MS = 3000;
const ORBIT_DURATION = 0.9;
const ORBIT_EASE: [number, number, number, number] = [0.45, 0.05, 0.25, 1];

/* Avatar centers travel on a vertical ellipse; the active slot (slot 0) is the
   right-most point so the active avatar sits closest to the quote. */
interface OrbitGeometry {
  width: number;
  height: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /* Global size multiplier so smaller viewports keep avatars clear of
     each other while passing on the orbit. */
  unit: number;
}

const ORBIT_DESKTOP: OrbitGeometry = {
  width: 460,
  height: 440,
  cx: 128,
  cy: 220,
  rx: 64,
  ry: 176,
  unit: 1,
};

const ORBIT_COMPACT: OrbitGeometry = {
  width: 310,
  height: 340,
  cx: 92,
  cy: 170,
  rx: 52,
  ry: 132,
  unit: 0.8,
};

/* 1 at the active (front) slot, 0 at the slot diametrically opposite. */
const depthAt = (slot: number) => (1 + Math.cos((slot * TAU) / COUNT)) / 2;

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

interface OrbitAvatarProps {
  item: TestimonialItem;
  index: number;
  target: number;
  geometry: OrbitGeometry;
  isActive: boolean;
  reducedMotion: boolean;
  onSelect: () => void;
}

function OrbitAvatar({
  item,
  index,
  target,
  geometry,
  isActive,
  reducedMotion,
  onSelect,
}: OrbitAvatarProps) {
  /* Continuous position on the orbit (in slot units). Animating this value
     instead of x/y directly, makes avatars travel along the elliptical path
     rather than cutting straight across it. */
  /* Geometry lives in a ref so the transforms below always read the latest
     orbit size; the nudge on breakpoint change re-projects current positions. */
  const geometryRef = useRef(geometry);
  const progress = useMotionValue(index);

  useEffect(() => {
    if (geometryRef.current !== geometry) {
      geometryRef.current = geometry;
      progress.set(progress.get() + 1e-4);
    }
  }, [geometry, progress]);

  useEffect(() => {
    const controls = animate(progress, target, {
      duration: reducedMotion ? 0 : ORBIT_DURATION,
      ease: ORBIT_EASE,
    });
    return () => controls.stop();
  }, [target, reducedMotion, progress]);

  const x = useTransform(progress, (v) => {
    const angle = (v * TAU) / COUNT;
    return (
      geometryRef.current.cx +
      geometryRef.current.rx * Math.cos(angle) -
      AVATAR_BOX / 2
    );
  });
  const y = useTransform(progress, (v) => {
    const angle = (v * TAU) / COUNT;
    return (
      geometryRef.current.cy +
      geometryRef.current.ry * Math.sin(angle) -
      AVATAR_BOX / 2
    );
  });
  const scale = useTransform(
    progress,
    (v) => geometryRef.current.unit * (0.6 + 0.55 * depthAt(v)),
  );
  const opacity = useTransform(progress, (v) => 0.45 + 0.55 * depthAt(v));
  const filter = useTransform(
    progress,
    (v) => `grayscale(${((1 - depthAt(v)) * 0.85).toFixed(3)})`,
  );
  // Kept below the fixed mobile action bar (z-40) and back-to-top (z-50) so
  // the avatars never float over them on phones.
  const zIndex = useTransform(progress, (v) => Math.round(2 + 28 * depthAt(v)));
  /* Name labels fade out while an avatar passes behind the orbit. */
  const labelOpacity = useTransform(progress, (v) => {
    const d = depthAt(v);
    return Math.max(0, Math.min(1, (d - 0.2) / 0.22));
  });

  return (
    <motion.div className="absolute left-0 top-0" style={{ x, y, zIndex }}>
      <motion.div
        className="h-24 w-24"
        style={{ scale, opacity, filter }}
      >
        <button
          type="button"
          onClick={onSelect}
          aria-label={`Show review from ${item.name}`}
          aria-current={isActive}
          className={`group block h-full w-full cursor-pointer rounded-full transition-shadow duration-500 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none ${
            isActive ? "shadow-[0_20px_44px_-14px_rgba(168,132,28,0.5)]" : ""
          }`}
        >
          <ReviewerAvatar
            item={item}
            imgClassName={`h-full w-full rounded-full object-cover ring-2 transition-[ring-color] duration-500 ${
              isActive ? "ring-primary/70" : "ring-border group-hover:ring-primary/40"
            }`}
            fallbackClassName={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${item.avatarBg} ring-2 transition-[ring-color] duration-500 ${
              isActive ? "ring-primary/70" : "ring-border group-hover:ring-primary/40"
            }`}
            initialsClassName={`text-2xl font-bold tracking-wide text-white transition-transform duration-500 ${
              isActive ? "" : "group-hover:scale-105"
            }`}
          />
        </button>

        <motion.div
          style={{ opacity: labelOpacity }}
          className="pointer-events-none absolute top-1/2 left-full ml-4 hidden -translate-y-1/2 sm:block"
        >
          <p
            className={`whitespace-nowrap text-sm transition-colors duration-500 ${
              isActive
                ? "font-bold text-foreground"
                : "font-medium text-muted-foreground"
            }`}
          >
            {item.name}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {(item.rating ?? 5).toFixed(1)}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export const Testimonials: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const isCompact = useMediaQuery("(max-width: 639px)");
  const geometry = isCompact ? ORBIT_COMPACT : ORBIT_DESKTOP;

  /* Deep links (e.g. "/#testimonials" from the About stats) land after the
     SPA renders, so scroll to the section ourselves once it mounts. */
  const location = useLocation();
  useEffect(() => {
    if (location.hash === "#testimonials") {
      document
        .getElementById("testimonials")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  const [activeIndex, setActiveIndex] = useState(0);
  /* Monotonic counter of orbit steps taken; keeps each avatar's animated
     position continuous instead of snapping between modular slots. */
  const [turns, setTurns] = useState(0);
  const [paused, setPaused] = useState(false);
  // Autoplay is also paused while the section is scrolled out of view.
  const sectionRef = useRef<HTMLElement>(null);
  const [sectionVisible, setSectionVisible] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) =>
      setSectionVisible(entry.isIntersecting),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const select = useCallback(
    (next: number) => {
      const steps = (next - activeIndex + COUNT) % COUNT;
      if (steps === 0) return;
      setTurns((t) => t + steps);
      setActiveIndex(next);
    },
    [activeIndex],
  );

  useEffect(() => {
    if (paused || reducedMotion || !sectionVisible) return;
    const id = window.setInterval(
      () => select((activeIndex + 1) % COUNT),
      AUTO_ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, sectionVisible, activeIndex, select]);

  const active = homepageTestimonials[activeIndex];

  const textTransition = reducedMotion
    ? { duration: 0, delay: 0 }
    : { duration: 0.55, delay: 0.25, ease: ORBIT_EASE };
  const exitTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: "easeIn" as const };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative overflow-hidden py-20 md:py-28"
      aria-labelledby="testimonials-heading"
    >
      {/* Decorative circle, bottom-right, secondary tone */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -bottom-20 h-40 w-40 rounded-full bg-secondary md:h-52 md:w-52"
        animate={reducedMotion ? undefined : { scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-6 rounded-full border border-secondary-foreground/10 md:inset-8" />
      </motion.div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="bg-soft-badge mb-3 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold tracking-wider text-foreground uppercase shadow-sm">
            Testimonials
          </span>
          <h2
            id="testimonials-heading"
            className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          >
            See what others have to say
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          {/* Revolving avatar orbit */}
          <div className="lg:col-span-5">
            <div
              className="relative mx-auto"
              style={{ width: geometry.width, height: geometry.height }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <svg
                className="absolute inset-0"
                width={geometry.width}
                height={geometry.height}
                viewBox={`0 0 ${geometry.width} ${geometry.height}`}
                fill="none"
                aria-hidden="true"
              >
                <ellipse
                  cx={geometry.cx}
                  cy={geometry.cy}
                  rx={geometry.rx}
                  ry={geometry.ry}
                  stroke="var(--border)"
                  strokeWidth="1.5"
                />
              </svg>

              {homepageTestimonials.map((item, index) => (
                <OrbitAvatar
                  key={item.name}
                  item={item}
                  index={index}
                  target={index - turns}
                  geometry={geometry}
                  isActive={index === activeIndex}
                  reducedMotion={Boolean(reducedMotion)}
                  onSelect={() => select(index)}
                />
              ))}
            </div>
          </div>

          {/* Active testimonial */}
          <div
            className="lg:col-span-7"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="min-h-[19rem] sm:min-h-[17rem] lg:min-h-[21rem]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.figure
                  key={active.name}
                  className="max-w-2xl"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: textTransition,
                  }}
                  exit={{ opacity: 0, y: -14, transition: exitTransition }}
                >
                  <Quote className="h-10 w-10 fill-primary/15 text-primary/30" />

                  <blockquote className="mt-5 text-lg leading-relaxed font-medium text-foreground/90 sm:text-xl md:text-2xl md:leading-relaxed">
                    &ldquo;{active.text}&rdquo;
                  </blockquote>

                  <figcaption className="mt-8 flex items-center gap-4">
                    <ReviewerAvatar
                      item={active}
                      imgClassName="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-primary/25"
                      fallbackClassName={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${active.avatarBg} ring-2 ring-primary/25`}
                      initialsClassName="text-sm font-bold tracking-wide text-white"
                    />
                    <div>
                      <p className="font-bold text-foreground">{active.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        {active.rating && (
                          <div className="flex gap-0.5">
                            {[...Array(active.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                        )}
                        {active.sourceUrl ? (
                          <a
                            href={active.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary underline-offset-2 hover:underline"
                          >
                            Verified Google Review
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Verified Patient
                          </span>
                        )}
                      </div>
                    </div>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
