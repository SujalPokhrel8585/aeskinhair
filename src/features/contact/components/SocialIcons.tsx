import React from "react";
import { Phone, MapPin } from "lucide-react";
import { CLINIC_INFO } from "@/constants";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

export function SocialIcons() {
  return (
    <div className="mt-8 pt-6 border-t border-border">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">
        Connect on Socials
      </span>
      <div className="flex items-center gap-3">
        <a
          href={CLINIC_INFO.socials.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="size-10 rounded-full bg-muted hover:bg-[#1877F2] hover:text-white text-foreground flex items-center justify-center border border-border transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md"
          title="Facebook"
        >
          <FacebookIcon className="size-4.5" />
        </a>
        <a
          href={CLINIC_INFO.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="size-10 rounded-full bg-muted hover:bg-[#E4405F] hover:text-white text-foreground flex items-center justify-center border border-border transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md"
          title="Instagram"
        >
          <InstagramIcon className="size-4.5" />
        </a>
        <a
          href={CLINIC_INFO.socials.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="size-10 rounded-full bg-muted hover:bg-[#111111] hover:text-white text-foreground flex items-center justify-center border border-border transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md"
          title="TikTok"
        >
          <TikTokIcon className="size-4.5" />
        </a>
        <a
          href={CLINIC_INFO.socials.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="size-10 rounded-full bg-muted hover:bg-[#FF0000] hover:text-white text-foreground flex items-center justify-center border border-border transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md"
          title="YouTube"
        >
          <YoutubeIcon className="size-4.5" />
        </a>
      </div>
    </div>
  );
}

export { FacebookIcon, InstagramIcon, Phone, MapPin };
