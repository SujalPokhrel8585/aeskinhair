import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "@/features/home/HomePage";

const GalleryPage = lazy(() => import("@/features/gallery/GalleryPage"));
const AboutPage = lazy(() => import("@/features/about/AboutPage"));
const ContactPage = lazy(() => import("@/features/contact/ContactPage"));
const ServicePage = lazy(() => import("@/features/services/ServicePage"));
const ServicesIndexPage = lazy(() => import("@/features/services/ServicesIndexPage"));
const BookAppointmentPage = lazy(() => import("@/features/booking/BookAppointmentPage"));
const DoctorsPage = lazy(() => import("@/features/doctors/DoctorsPage"));
const NotFoundPage = lazy(() => import("@/features/not-found/NotFoundPage"));
const PrivacyPolicyPage = lazy(() => import("@/features/legal/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("@/features/legal/TermsPage"));

/* Scroll to the top on EVERY navigation (footer/nav links, mobile
   included). location.key changes even when the path stays the same -
   e.g. clicking a footer link to the page you are already on - so those
   clicks scroll to the top too. Hash links like /#testimonials handle
   their own scrolling. */
function ScrollToTop() {
  const location = useLocation();
  const { hash } = location;
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.key, hash]);
  return null;
}

/* Visible loading state for lazy routes. The previous Suspense fallback of
null rendered NOTHING while a route chunk was loading, so navigation
(including touch-taps in the mobile menu) showed a blank page until the
chunk arrived - worst on slow mobile connections. A small spinner keeps
the app looking alive instead. */
function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="flex min-h-[60vh] w-full items-center justify-center"
    >
      <span className="size-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
    </div>
  );
}

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route
        path="/gallery"
        element={
          <Suspense fallback={<RouteFallback />}>
            <GalleryPage />
          </Suspense>
        }
      />
      <Route
        path="/about"
        element={
          <Suspense fallback={<RouteFallback />}>
            <AboutPage />
          </Suspense>
        }
      />
      <Route
        path="/contact"
        element={
          <Suspense fallback={<RouteFallback />}>
            <ContactPage />
          </Suspense>
        }
      />
      <Route
        path="/services"
        element={
          <Suspense fallback={<RouteFallback />}>
            <ServicesIndexPage />
          </Suspense>
        }
      />
      <Route
        path="/services/:id"
        element={
          <Suspense fallback={<RouteFallback />}>
            <ServicePage />
          </Suspense>
        }
      />
      <Route
        path="/doctors"
        element={
          <Suspense fallback={<RouteFallback />}>
            <DoctorsPage />
          </Suspense>
        }
      />
      <Route
        path="/book"
        element={
          <Suspense fallback={<RouteFallback />}>
            <BookAppointmentPage />
          </Suspense>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <Suspense fallback={<RouteFallback />}>
            <PrivacyPolicyPage />
          </Suspense>
        }
      />
      <Route
        path="/terms"
        element={
          <Suspense fallback={<RouteFallback />}>
            <TermsPage />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense fallback={<RouteFallback />}>
            <NotFoundPage />
          </Suspense>
        }
      />
      </Routes>
    </>
  );
}
