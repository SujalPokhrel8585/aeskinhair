import {
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
  Component,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Stethoscope, Star, MessageCircle, MapPin } from "lucide-react";
import { CLINIC_INFO } from "@/constants";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getPerfTier } from "@/lib/deviceCapability";
import { whatsappAnchorProps } from "@/lib/whatsapp";
import stethoscopeLight from "@/assets/stethoscope-light.webp";
import stethoscopeDark from "@/assets/stethoscope-dark.webp";
import {
  getClinicStatus,
  formatDuration,
  formatHour12,
  CLINIC_OPEN_HOUR,
  CLINIC_CLOSE_HOUR,
} from "@/lib/clinicStatus";
import { FLOATING_BADGES } from "@/features/home/data/heroData";
import { GOOGLE_REVIEWS_URL } from "@/features/home/data/testimonialsData";

// three.js is heavy, load the 3D canvas in its own chunk after first paint
const HeroCanvas = lazy(() => import("@/components/three/HeroCanvas"));

/* Static stethoscope for low-tier devices (old phones, data-saver, reduced
   motion): no WebGL, no three.js chunk, no GLB download - just a
   pre-rendered photo of the model (theme-aware) with a gentle CSS float. */
function HeroStaticModel() {
  const { theme } = useTheme();
  return (
    <div className="relative z-10 flex h-full w-full items-center justify-center">
      <img
        src={theme === "dark" ? stethoscopeDark : stethoscopeLight}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
        className="hero-static-model h-full w-auto max-w-full object-contain"
      />
    </div>
  );
}

/**
 * Crash-proofing for the 3D hero. Without an error boundary here, ANY failure
 * in the three.js stack (WebGL context loss, HDR/GLB load failure, shader
 * compile error) propagated to the root and unmounted the ENTIRE page - the
 * "homepage loads for a second, then disappears" bug. Now any failure degrades
 * to the same static model used on low-tier devices, and the rest of the page
 * keeps working.
 */
class HeroErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Hero 3D canvas failed - falling back to static model:", error);
  }

  render() {
    return this.state.failed ? <HeroStaticModel /> : this.props.children;
  }
}

export default function Hero() {
  // Live open/closed badge, recomputed every minute (Nepal Time, 10 AM-6 PM)
  const [status, setStatus] = useState(() => getClinicStatus());
  // The card flips between the status face and "Book Online" every 3s
  const [flipped, setFlipped] = useState(false);
  const [flipPaused, setFlipPaused] = useState(false);
  // Off-screen hero: every interval and infinite CSS animation below is
  // paused while the hero is scrolled away (measured idle-jank on mobile).
  const heroRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) =>
      setHeroVisible(entry.isIntersecting),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!heroVisible) return;
    const id = setInterval(() => setStatus(getClinicStatus()), 60_000);
    return () => clearInterval(id);
  }, [heroVisible]);

  useEffect(() => {
    if (flipPaused || !heroVisible) return;
    const id = setInterval(() => setFlipped((f) => !f), 3000);
    return () => clearInterval(id);
  }, [flipPaused, heroVisible]);

  return (
    <>
      <main
        ref={heroRef}
        id="main"
        className={`page-gradient-bg relative flex flex-grow items-center overflow-hidden pt-10 ${heroVisible ? "" : "hero-offscreen"}`}
      >
        <div className="w-full px-4 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Hero Text Content */}
            <div className="relative z-10">
              {/* Top Pill: Location */}
              <span className="bg-soft-badge mb-3 inline-flex items-center rounded-full px-3 py-2 text-sm font-medium text-foreground shadow-sm">
                📍 Samakhushi, Kathmandu • AestheticEssence Skin & Hair Clinic
              </span>

              {/* Main Heading, carries the what + where for first-glance clarity */}
              <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Advanced Skin &amp; Hair Clinic in Samakhushi, Kathmandu
              </h1>

              {/* Supporting Paragraph */}
              <p className="mb-4 max-w-[520px] text-lg font-normal leading-relaxed text-muted-foreground">
                Reveal, renew, rejuvenate. Your trusted destination for
                advanced dermatology, HydraFacial, acne treatments, melasma
                care, anti-aging Botox, and regenerative PRP & GFC hair care.
              </p>

              {/* Action Buttons - now using Link */}
              <div className="mb-3 flex flex-wrap gap-3">
                <Link
                  to="/book"
                  className="book-cta-pulse inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  Book Appointment
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/services"
                  className="services-cta-3d inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-base font-medium text-foreground shadow-sm"
                >
                  <Stethoscope className="h-4 w-4 text-foreground" />
                  Our Services
                </Link>
              </div>

              {/* Quick actions, directions to the clinic + WhatsApp chat,
                  with a small gap so the two stay scannable */}
              <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <a
                  href={CLINIC_INFO.socials.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-1 font-semibold text-primary underline-offset-2 hover:underline"
                >
                  <MapPin className="size-4" />
                  Get Direction
                </a>
                <a
                  {...whatsappAnchorProps(CLINIC_INFO.whatsappNumber)}
                  className="relative inline-flex items-center gap-1 font-semibold text-primary underline-offset-2 hover:underline"
                >
                  <MessageCircle className="size-4" />
                  Chat with us on WhatsApp
                </a>
              </div>

              {/* Reviews Preview, links to the live Google Maps listing
                  (4.9 rating only; review counts are never shown) */}
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-3 border-t border-border pt-4 transition-opacity hover:opacity-80"
              >
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <div>
                  <span className="mr-1 font-bold text-foreground">4.9/5</span>
                  <span className="text-sm text-muted-foreground">
                    Rated by patients on Google
                  </span>
                </div>
              </a>
            </div>

            {/* Hero Visual & 3D Canvas */}
            <div className="hero-visual">
              {/* Background Glow Circles */}
              <div className="circle circle-gold" />
              <div className="circle circle-orange" />
              <div className="circle circle-yellow" />
              <div className="circle circle-green" />

              {/* Live Status Floating Card, styled like the floating badges
                  (stays a light box in dark mode too). Flows above the canvas
                  on mobile; floats mid-left from sm up. Flips to a "Book
                  Online" face every 3s; hovering pins that face so it can be
                  clicked. */}
              <div
                className="hero-status-card relative z-30 mx-auto flex w-fit items-center gap-2 rounded-2xl border bg-[rgba(255,255,255,0.92)] p-3 shadow-[0_4px_16px_rgba(18,49,45,0.10)] backdrop-blur-md sm:absolute sm:left-0 sm:top-[46%] sm:mx-0 sm:-translate-y-1/2"
                onMouseEnter={() => {
                  setFlipPaused(true);
                  setFlipped(true);
                }}
                onMouseLeave={() => {
                  setFlipPaused(false);
                  setFlipped(false);
                }}
              >
                {flipped ? (
                  <Link
                    to="/book"
                    key="book"
                    className="hero-status-face flex items-center gap-2"
                  >
                    <div className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                      <Calendar className="size-4.5" />
                    </div>
                    <div>
                      <p className="mb-0 text-sm font-bold text-[#1e3a5f]">
                        Book Online
                      </p>
                      <small className="text-[11px] font-bold text-[#a8841c]">
                        Schedule your visit
                      </small>
                    </div>
                  </Link>
                ) : (
                  <div key="status" className="hero-status-face flex items-center gap-2">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        status.open ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    <div>
                      {status.open ? (
                        <>
                          <p className="mb-0 text-sm font-bold text-[#1e3a5f]">
                            Closes at {formatHour12(CLINIC_CLOSE_HOUR)}
                          </p>
                          <small className="text-[11px] font-bold text-[#a8841c]">
                            {formatDuration(status.closesInMinutes ?? 0)} left
                          </small>
                        </>
                      ) : (
                        <>
                          <p className="mb-0 text-sm font-bold text-[#1e3a5f]">
                            Opens at {formatHour12(CLINIC_OPEN_HOUR)}
                          </p>
                          <small className="text-[11px] font-bold text-[#a8841c]">
                            reopens in {formatDuration(status.opensInMinutes ?? 0)}
                          </small>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Badges (external links stay as <a>) */}
              {FLOATING_BADGES.map(
                ({ href, icon: Icon, label, badgeClass }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    className={`badge-icon ${badgeClass}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ),
              )}

              {/* 3D Model Canvas Container */}
              <div className="canvas-wrapper">
                <div className="model-backdrop-blob model-backdrop-blob-1" />
                <div className="model-backdrop-blob model-backdrop-blob-2" />

                {getPerfTier() === "low" ? (
                  <HeroStaticModel />
                ) : (
                  <HeroErrorBoundary>
                    <Suspense fallback={null}>
                      <HeroCanvas />
                    </Suspense>
                  </HeroErrorBoundary>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      
    </>
  );
}
