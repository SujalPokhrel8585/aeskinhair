import { Plus } from "lucide-react";

import { BeforeAfterSlider } from "./BeforeAfterSlider";

// Dermatology treatment progress photos (Unsplash, free stock). The srcset
// variants let phones pick the smallest width that stays sharp instead of
// always downloading the 800w image (~21 KB at 400w vs ~107 KB at 1200w).
const BEFORE_PHOTO = "photo-1570172619644-dfd03ed5d881";
const AFTER_PHOTO = "photo-1616394584738-fc6e612e71b9";
const WIDTHS = [400, 800, 1200] as const;

function unsplashSrc(photoId: string, width: number): string {
  return `https://images.unsplash.com/${photoId}?q=80&w=${width}&auto=format&fit=crop`;
}

function unsplashSrcset(photoId: string): string {
  return WIDTHS.map((w) => `${unsplashSrc(photoId, w)} ${w}w`).join(", ");
}

const before = unsplashSrc(BEFORE_PHOTO, 800);
const after = unsplashSrc(AFTER_PHOTO, 800);
const beforeSrcset = unsplashSrcset(BEFORE_PHOTO);
const afterSrcset = unsplashSrcset(AFTER_PHOTO);

export const BeforeAfter = () => {
  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center md:px-8">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground">
          <Plus className="size-3.5" />
          Before And After Results
        </span>

        <h2 className="text-3xl leading-tight font-semibold tracking-tight text-foreground md:text-4xl">
          See The Difference Expert
          <br />
          Dermatology Care Can Make
        </h2>

        <div className="mt-10">
          <BeforeAfterSlider
            beforeSrc={before}
            afterSrc={after}
            beforeSrcset={beforeSrcset}
            afterSrcset={afterSrcset}
            // Container is max-w-md (448 px) inside padded sections, so the
            // slot never exceeds 448 px — this keeps desktop honest and lets
            // low-DPR screens pick the 400w variant.
            sizes="(max-width: 640px) calc(100vw - 3rem), 448px"
            beforeAlt="Skin before dermatology treatment at AestheticEssence Clinic"
            afterAlt="Skin after dermatology treatment at AestheticEssence Clinic"
            className="aspect-3/4 sm:aspect-3/4 mx-auto w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
};
