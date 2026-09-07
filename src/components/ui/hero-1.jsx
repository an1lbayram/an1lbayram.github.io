/**
 * 21st.dev bileseni — "Hero" (animated hero)
 * Yazar: Berat Berkay Gokdemir (@beratberkayg)
 * Kaynak: https://21st.dev/@beratberkayg/components/hero-1
 *
 * Uyarlamalar (frontend incelemesi sonrasi):
 * - TypeScript tipleri kaldirildi (.jsx)
 * - Orijinal radial accent iki temada da kirik goruntu veriyordu (koyuda dev beyaz
 *   daire, acikta siyah kama); yerine token tabanli yumusak bir isima kondu
 * - Yukseklik 100vh'ten makul bir degere cekildi, olu bosluk temizlendi
 * - Eyebrow olu "#" baglantisindan cikarildi ve kenarligi gorunur hale getirildi
 * - Ikincil CTA (CV) destegi eklendi
 */
"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero({
  eyebrow = "Innovate Without Limits",
  title,
  subtitle,
  ctaLabel = "Explore Now",
  ctaHref = "#",
  secondaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaIcon: SecondaryIcon,
}) {
  return (
    <section
      id="hero"
      className="relative mx-auto flex w-full flex-col items-center overflow-hidden
            px-6 pb-24 pt-36 text-center md:px-8 md:pt-40"
    >
      {/* Grid BG */}
      <div
        aria-hidden="true"
        className="absolute -z-10 inset-0 opacity-80 h-[600px] w-full
              bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)]
              bg-[size:6rem_5rem]
              [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      {/* Marka renginde yumusak isima */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]
              bg-[radial-gradient(58%_52%_at_50%_0%,hsl(var(--glow)/0.30)_0%,transparent_72%)]"
      />

      {/* Eyebrow */}
      {eyebrow && (
        <span
          className="mx-auto flex w-fit items-center justify-center rounded-3xl border border-border
              bg-card px-5 py-2 text-sm uppercase tracking-tight text-muted-foreground shadow-sm backdrop-blur-sm"
        >
          {eyebrow}
          <ChevronRight className="ml-2 inline h-4 w-4" />
        </span>
      )}

      {/* Title */}
      <h1
        className="animate-fade-in -translate-y-4 text-balance
              bg-gradient-to-br from-foreground from-25% to-primary/70
              bg-clip-text py-6 text-5xl font-bold leading-none tracking-tighter
              text-transparent opacity-0 sm:text-6xl md:text-7xl
              dark:from-white dark:to-primary/75"
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="animate-fade-in mb-10 -translate-y-4 max-w-2xl text-balance
              text-lg tracking-tight text-muted-foreground opacity-0 md:text-xl"
      >
        {subtitle}
      </p>

      {/* CTA */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {ctaLabel && (
          <Button asChild size="lg" className="w-fit text-base tracking-tight md:w-52">
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>
        )}
        {secondaryCtaLabel && (
          <Button asChild size="lg" variant="outline" className="w-fit text-base tracking-tight">
            <a href={secondaryCtaHref}>
              {SecondaryIcon && <SecondaryIcon className="h-4 w-4" />}
              {secondaryCtaLabel}
            </a>
          </Button>
        )}
      </div>
    </section>
  )
}
