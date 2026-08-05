# Background Image Responsive — Desktop 16:9 / Mobile Flexible

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** On desktop, background images are 16:9 and section content fits absolutely within the image frame. On desktop, sections with overflowing content use carousel or nested scroll. On mobile, images adapt to content height (no aspect-ratio constraint).

**Architecture:** BackgroundSection currently constrains images to 16:9 via `aspect-ratio: 16/9` on a `w-full` div inside a flex centering shim. This creates letterboxing on non-16:9 viewports. On desktop, the section uses `min-h-screen` which can grow beyond the viewport, causing the image to not fill the visible area. Fix: (1) On desktop, section is `h-screen` (fixed height), image fills as 16:9 within it, content is constrained. (2) On mobile, section is `min-h-screen` (flexible), image fills naturally. (3) Two sections (Identity, Experience) overflow 16:9 height → restructure as carousels on desktop.

**Tech Stack:** Next.js Image, Tailwind CSS, Framer Motion, React useState for carousel index

---

## Task 1: BackgroundSection — responsive desktop/mobile split

**Files:**
- Modify: `/Users/johtnd/portfolio/app/components/BackgroundSection.tsx`

**Current state (line 29):** Section is `min-h-screen`. Image container uses `flex h-full w-full items-center justify-center` with a child `div.relative.w-full` at `aspect-ratio: 16/9`.

**Target state:**
- Desktop (md+): Section is `h-screen` (fixed). Image is 16:9, centered, fills width or height depending on viewport. Content overflow → scrollable.
- Mobile (<md): Section is `min-h-screen` (flexible). Image fills section height. No aspect-ratio constraint.

- [ ] **Step 1: Rewrite BackgroundSection with responsive logic**

```tsx
import Image from "next/image";

interface BackgroundSectionProps {
  id: string;
  backgroundImage: string;
  contentPosition: "left" | "right";
  wideContent?: boolean;
  /** On desktop, if content overflows the viewport, enable nested scroll. Default true. */
  scrollable?: boolean;
  children: React.ReactNode;
}

export function BackgroundSection({
  id,
  backgroundImage,
  contentPosition,
  wideContent = false,
  scrollable = true,
  children,
}: BackgroundSectionProps) {
  return (
    <section
      id={id}
      className="relative min-h-screen w-full overflow-hidden md:h-screen"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Mobile: image fills section (no aspect constraint) */}
        <div className="absolute inset-0 md:hidden">
          <Image
            src={backgroundImage}
            fill
            className="object-cover object-center"
            priority
            quality={85}
            alt=""
            sizes="100vw"
          />
        </div>
        {/* Desktop: image constrained to 16:9, centered in viewport */}
        <div className="hidden md:flex h-full w-full items-center justify-center">
          <div
            className="relative w-full"
            style={{ aspectRatio: "16 / 9" }}
          >
            <Image
              src={backgroundImage}
              fill
              className="object-cover object-center"
              priority
              quality={85}
              alt=""
              sizes="100vw"
            />
          </div>
        </div>
        {/* Directional gradient overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              contentPosition === "right"
                ? "linear-gradient(to right, rgba(10,14,20,0.85) 0%, rgba(10,14,20,0.65) 30%, rgba(10,14,20,0.25) 55%, rgba(10,14,20,0.05) 100%)"
                : "linear-gradient(to left, rgba(10,14,20,0.85) 0%, rgba(10,14,20,0.65) 30%, rgba(10,14,20,0.25) 55%, rgba(10,14,20,0.05) 100%)",
          }}
        />
      </div>

      {/* Content — on desktop, constrained to viewport with optional nested scroll */}
      <div
        className={`relative z-20 flex min-h-screen items-center md:h-screen md:overflow-hidden ${
          contentPosition === "right" ? "justify-end" : "justify-start"
        } px-6 py-24 md:px-12 lg:px-20`}
      >
        <div className={`w-full ${wideContent ? "max-w-7xl" : "max-w-2xl"}`}>
          {scrollable ? (
            <div className="md:max-h-[calc(100vh-12rem)] md:overflow-y-auto md:scrollbar-hide">
              {children}
            </div>
          ) : (
            <div>{children}</div>
          )}
        </div>
      </div>
    </section>
  );
}
```

Key changes:
- Section: `md:h-screen` added (fixed height on desktop)
- Image: Two divs — `md:hidden` for mobile (fills section), `hidden md:flex` for desktop (16:9 centered)
- Content container: `md:h-screen md:overflow-hidden` on the flex parent
- Nested scroll: `md:max-h-[calc(100vh-12rem)] md:overflow-y-auto md:scrollbar-hide` on the children wrapper (12rem = py-24 padding)
- `scrollable` prop defaults to `true` — sections that fit don't need scroll
- `scrollbar-hide` class needed in globals.css (hide scrollbar but keep scroll functionality)

- [ ] **Step 2: Add scrollbar-hide utility to globals.css**

Add to `/Users/johtnd/portfolio/app/globals.css`:

```css
/* Hide scrollbar but keep scroll functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 3: Set scrollable=false on sections that fit in 16:9**

These sections have content < 810px height on desktop → no scroll needed:

| Section | File | Change |
|---------|------|--------|
| HeroSection | `app/sections/HeroSection.tsx` | Add `scrollable={false}` to BackgroundSection |
| InterestFeedSection | `app/sections/InterestFeedSection.tsx` | Add `scrollable={false}` |
| ContactTerminalSection | `app/sections/ContactTerminalSection.tsx` | Add `scrollable={false}` |
| MissionsArchiveSection | `app/sections/MissionsArchiveSection.tsx` | Add `scrollable={false}` |
| FutureRoadmapSection | `app/sections/FutureRoadmapSection.tsx` | Add `scrollable={false}` |
| TechArsenalSection | `app/sections/TechArsenalSection.tsx` | Add `scrollable={false}` |
| HumanProtocolsSection | `app/sections/HumanProtocolsSection.tsx` | Add `scrollable={false}` |
| LanguageModulesSection | `app/sections/LanguageModulesSection.tsx` | Add `scrollable={false}` |

For each file, find the `<BackgroundSection` tag and add `scrollable={false}` prop.

- [ ] **Step 4: Keep scrollable={true} (default) on overflowing sections**

These sections need nested scroll on desktop:
- IdentitySection (keep default — no change needed)
- ExperienceLogSection (keep default — no change needed)

- [ ] **Step 5: Test desktop viewport (1440x900)**

Verify:
- Hero: image fills viewport, no letterboxing, content visible
- Identity: image is 16:9, content scrollable within the image frame
- Experience: image is 16:9, experience cards scrollable within the image frame
- TechArsenal: image fills, 4-col grid visible
- All other sections: image fills, content fits without scroll

- [ ] **Step 6: Test mobile viewport (390x844)**

Verify:
- All sections: image fills section height (which grows with content), no letterboxing
- Identity: full content visible, no scroll needed
- Experience: full content visible, no scroll needed
- No horizontal overflow

- [ ] **Step 7: Commit**

```bash
git add app/components/BackgroundSection.tsx app/globals.css app/sections/*.tsx
git commit -m "feat: responsive background images — 16:9 desktop, flexible mobile

- Desktop: section h-screen, image 16:9 centered, content nested-scrollable
- Mobile: section min-h-screen, image fills naturally
- scrollable prop controls nested scroll (default true)
- scrollbar-hide utility for clean nested scroll"
```

---

## Task 2: IdentitySection — carousel on desktop (if scrollable not enough)

**Files:**
- Modify: `/Users/johtnd/portfolio/app/sections/IdentitySection.tsx`

**Problem:** IdentitySection has a 2-col grid (avatar+name left, info+stats right). On 1440x900, the right pane (title + 4 stats + bio + separators) is ~800px tall. With py-24 (96px top+bottom), available height = 900 - 96 = 804px. This barely fits.

**Decision:** If Task 1's nested scroll works well enough (content scrolls within the image frame), skip this task. If the user wants a more polished experience, restructure as a 2-panel carousel:
- Panel 1: Avatar + Name + Location/Status badges
- Panel 2: Bio + Stats grid + Speciality/Years

This is a fallback task — only execute if Task 1's scroll solution is insufficient.

- [ ] **Step 1: Restructure as horizontal carousel on desktop**

Replace the 2-col grid with a flex row of panels on desktop, single column on mobile.

Use the same carousel pattern as MissionsArchiveSection (scroll-snap, arrows).

---

## Task 3: ExperienceLogSection — carousel on desktop

**Files:**
- Modify: `/Users/johtnd/portfolio/app/sections/ExperienceLogSection.tsx`

**Problem:** 5 experience cards stacked vertically. Each card is ~150-200px. Total content height ~900-1100px. Overflows 16:9 frame significantly.

**Decision:** If Task 1's nested scroll works well enough, skip this task. If the user wants a carousel, restructure as horizontal scroll with one card visible at a time on desktop.

- [ ] **Step 1: Restructure as horizontal carousel on desktop**

Replace vertical stack with horizontal scroll-snap on desktop. Keep vertical on mobile.

Use similar pattern to MissionsArchiveSection.

---

## Verification Checklist

After Task 1:
- [ ] Desktop 1440x900: Hero image fills viewport, no letterboxing
- [ ] Desktop 1440x900: Identity content scrollable within image frame
- [ ] Desktop 1440x900: Experience cards scrollable within image frame
- [ ] Desktop 1440x900: TechArsenal 4-col grid fits without scroll
- [ ] Desktop 1920x1080: All images fill viewport perfectly (native 16:9)
- [ ] Desktop 2560x1080: Images are 16:9 centered, no stretching
- [ ] Mobile 390x844: All images fill section height, no letterboxing
- [ ] Mobile 390x844: All content visible without horizontal overflow
- [ ] Navigation still works (scroll-snap not broken)
- [ ] Reduced motion still works

---

## Notes

- The `scrollbar-hide` class may already exist in globals.css from the MissionsArchive carousel. Check before adding duplicates.
- The `md:h-screen` on the section means desktop sections are exactly viewport height. This is essential for the 16:9 image to fill properly.
- The nested scroll (`md:overflow-y-auto`) uses `-webkit-overflow-scrolling: touch` for smooth scroll on iOS. Add this to the scrollbar-hide class or the scrollable div.
- For the gradient overlay: on mobile it should cover the full section height (which may be taller than viewport). On desktop it covers exactly the viewport. The current `absolute inset-0` handles both cases correctly.
