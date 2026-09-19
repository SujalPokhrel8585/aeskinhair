import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme";
import { Button } from "./Button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/navigation/NavigationMenu";
import logo from "/logo.webp";
import logoDark from "/logo-dark.webp";
import { NAV_LINKS, SERVICE_LINKS } from "@/constants";
import { SERVICES } from "@/features/services/data/servicesData";

// for the smooth hover underline effect
const navLinkClasses = cn(
  // Base
  "group relative inline-flex h-9 w-max items-center justify-center px-0.5 py-2 font-semibold text-sm transition-colors after:pointer-events-none after:absolute after:-inset-x-3 after:-inset-y-2 after:content-['']",

  // Underline (pseudo overlays are hit-testable by default and would sit on
  // top of the inner Services <Link>, eating its clicks, keep them
  // pointer-events-none)
  "before:pointer-events-none after:pointer-events-none",
  "before:absolute before:inset-x-0 before:bottom-0 before:h-[2px] before:scale-x-0 before:bg-primary before:transition-transform before:origin-left",

  // Hover / Focus / Active → only underline + text color
  "hover:text-accent-foreground hover:before:scale-x-100",
  "focus:text-accent-foreground focus:outline-none focus:before:scale-x-100",
  "data-active:before:scale-x-100 data-[state=open]:before:scale-x-100",

  // Force remove ALL backgrounds
  "!bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent",
  "data-[active]:!bg-transparent data-[state=open]:!bg-transparent",
  "aria-expanded:!bg-transparent",
);

/* Chromium touch hit-testing retargets a tap that lands on a bare,
click-less element (the whitespace between two menu links) onto the
nearest link and even rewrites the tap coordinates INTO that link, so
tapping the gap silently navigated - and while the target route chunk
was loading, the page appeared blank. Delegated React listeners and
addEventListener do NOT prevent the retargeting (verified with device
emulation); the element under the tap must itself be a tap target via
an event-handler PROPERTY. InertZone fillers seal every whitespace
area in the mobile menu: a tap there lands on the filler and is
swallowed - no navigation, no dismissal. */
function InertZone({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.onclick = (e) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest("a")) return; // a real link tap
      e.preventDefault();
      e.stopPropagation();
    };
    return () => {
      el.onclick = null;
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const location = useLocation();

  return (
    <nav className="navbar-bg blurred-fixed-bar sticky top-0 z-1000 w-full border-b border-primary/20 py-3 backdrop-blur-sm backdrop-saturate-150">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5"
          aria-label="AestheticEssence Skin & Hair Clinic, Home"
        >
          <img
            src={logo}
            alt="AestheticEssence Skin & Hair Clinic"
            className="navbar-logo-img h-14 w-auto object-contain sm:h-16 lg:h-20 dark:hidden"
          />
          <img
            src={logoDark}
            alt="AestheticEssence Skin & Hair Clinic"
            className="navbar-logo-img hidden h-14 w-auto object-contain sm:h-16 lg:h-20 dark:block"
          />
        </Link>

        {/* Desktop nav */}
        <NavigationMenu align="center" className="hidden lg:flex">
          <NavigationMenuList className="space-x-8">
            {/* Home */}
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link to="/" />}
                active={location.pathname === "/"}
                className={navLinkClasses}
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Gallery, About Us, Contact */}
            {/* slice seperates the links to individual items */}
            {NAV_LINKS.slice(1).map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink
                    render={<Link to={item.href} />}
                    active={isActive}
                    className={navLinkClasses}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
            {/* Services Dropdown - click label → /services, hover → sub-links */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={navLinkClasses}>
                <Link
                  to="/services"
                  className="mr-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  Services
                </Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                {/* All 15 treatments in a 3 x 5 grid */}
                <ul className="grid w-[44rem] auto-rows-fr grid-cols-3 gap-1 p-2">
                  {SERVICES.map((service) => (
                    <li key={service.id}>
                      <NavigationMenuLink
                        render={<Link to={`/services/${service.id}`} />}
                        className="block rounded-lg px-3 py-2 text-sm font-medium leading-snug hover:bg-accent hover:text-accent-foreground"
                      >
                        {service.title}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop CTA + theme */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Button
            className="book-cta-pulse rounded-full bg-primary px-5 shadow-sm hover:bg-primary/90"
            asChild
          >
            <Link to="/book">Book Appointment</Link>
          </Button>
        </div>

        {/* Mobile theme + menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground"
            aria-controls="mobile-nav"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav. The InertZone fillers seal the whitespace between and
          around the items - see the InertZone comment for why. */}
      {mobileOpen && (
        <div id="mobile-nav" className="mt-3 border-t px-4 pb-2 pt-1 lg:hidden">
          <InertZone className="h-2" />
          <Link
            to="/"
            className="block rounded-full px-3 py-2 text-sm font-semibold hover:bg-accent"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>

          {NAV_LINKS.slice(1).map((item) => (
            <Fragment key={item.title}>
              <InertZone className="h-1" />
              <Link
                to={item.href}
                className="block rounded-full px-3 py-2 text-sm font-semibold hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                {item.title}
              </Link>
            </Fragment>
          ))}

          <InertZone className="h-1" />
          <Link
            to="/services"
            className="block rounded-full px-3 py-2 text-sm font-semibold hover:bg-accent"
            onClick={() => setMobileOpen(false)}
          >
            Services
          </Link>
          <InertZone className="h-1" />
          <InertZone className="px-3 pb-1 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
            Browse by treatment
          </InertZone>
          {SERVICE_LINKS.map((service) => (
            <Fragment key={service.title}>
              <InertZone className="h-1" />
              <Link
                to={service.href}
                className="block rounded-full px-6 py-2 text-sm font-medium hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                {service.title}
              </Link>
            </Fragment>
          ))}
          <InertZone className="h-1" />
          <Button
            className="book-cta-pulse mt-3 w-full rounded-full bg-primary hover:bg-primary/90"
            asChild
          >
            <Link to="/book" onClick={() => setMobileOpen(false)}>
              Book Appointment
            </Link>
          </Button>
          <InertZone className="h-2" />
        </div>
      )}
    </nav>
  );
}
