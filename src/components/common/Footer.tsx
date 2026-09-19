import { Link } from "react-router-dom";
import { Phone, MapPin, Clock } from "lucide-react";
import { isMobileDevice } from "@/lib/whatsapp";
import { SERVICES } from "@/features/services/data/servicesData";
import {
  CLINIC_INFO,
  DEFAULT_FOOTER_MENU_ITEMS,
  type FooterMenuItem,
} from "@/constants";

interface FooterProps {
  logo?: {
    url: string;
    src?: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: FooterMenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

export function Footer({
  logo = {
    url: "/",
    alt: CLINIC_INFO.name,
    title: CLINIC_INFO.shortName,
  },
  tagline = CLINIC_INFO.tagline,
  menuItems = DEFAULT_FOOTER_MENU_ITEMS,
  copyright = `© ${new Date().getFullYear()} ${CLINIC_INFO.name}. All rights reserved.`,
  bottomLinks = [
    { text: "Privacy Policy", url: "/privacy-policy" },
    { text: "Terms of Service", url: "/terms" },
  ],
}: FooterProps) {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-7">
          {/* Brand + Contact Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Link
              to={logo.url}
              className="inline-flex items-center gap-2.5"
              aria-label={logo.alt}
            >
              <img
                src="/logo.webp"
                alt=""
                className="size-11 rounded-lg object-contain"
              />
              <span className="flex flex-col leading-none">
                <span className="text-xl font-extrabold tracking-wide text-foreground">
                  Aesthetic
                </span>
                <span className="text-xl font-extrabold tracking-wide text-foreground">
                  Essence
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Skin &amp; Hair Clinic
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {tagline}
            </p>

            {/* Contact details */}
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{CLINIC_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-muted-foreground" />
                <a
                  href={`tel:${CLINIC_INFO.phoneTel}`}
                  className="hover:text-foreground transition-colors"
                >
                  {CLINIC_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 text-muted-foreground" />
                <span>{CLINIC_INFO.businessHours}</span>
              </li>
            </ul>
          </div>

          {/* Menu columns */}
          {menuItems.map((section, sectionIdx) => (
            <div key={sectionIdx} className="lg:col-span-1">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.external ? (
                      <a
                        href={link.url}
                        // Same-tab on phones: required for WhatsApp's app
                        // hand-off (new-tab opens show the "Install" page);
                        // the back button returns here afterwards anyway.
                        target={isMobileDevice() ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className="font-medium transition-colors hover:text-foreground"
                      >
                        {link.text}
                      </a>
                    ) : (
                      <Link
                        to={link.url}
                        className="font-medium transition-colors hover:text-foreground"
                      >
                        {link.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Services, full treatment listing, generated from the same
              data source as the services pages so it never goes stale */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Treatments
            </h3>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services/${service.id}`}
                    className="font-medium transition-colors hover:text-foreground"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row md:items-center">
          <p>{copyright}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {bottomLinks.map((link, linkIdx) => (
              <li key={linkIdx}>
                <Link
                  to={link.url}
                  className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
