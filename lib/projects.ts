import type { Dictionary } from '@/lib/i18n/dictionaries/types'
import { en } from '@/lib/i18n/dictionaries/en'
import { withLocale } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/config'
import { defaultLocale } from '@/lib/i18n/config'

export type GalleryShape = 'phone' | 'wide'

export type GalleryShot =
  | string
  | { src: string; shape?: GalleryShape; label?: string }

export type BrandFont = 'caramel' | 'mi-gente'

export interface Project {
  id: string
  title: string
  shortTitle?: string
  caption: string
  description: string
  features: string[]
  image: string
  /** Extra screenshots shown on /demos */
  gallery?: GalleryShot[]
  /** Default gallery frame shape — phone for mobile shots, wide for desktop */
  galleryShape?: GalleryShape
  accent: string
  /** Client brand typeface for picker cards */
  brandFont?: BrandFont
  /** Optional mark shown on the project picker card */
  logo?: string
  /** Package used for this build (shown on /demos) */
  packageLabel: string
  /** Live client site */
  siteUrl: string
  /** In-app demos page anchor */
  href: string
}

type ProjectBase = Omit<
  Project,
  'caption' | 'description' | 'features' | 'packageLabel' | 'gallery' | 'href'
> & {
  gallery?: { src: string; shape?: GalleryShape }[]
}

const PROJECT_BASE: ProjectBase[] = [
  {
    id: 'caramel-jo',
    title: 'Caramel & Jo',
    image: '/images/caramel-jo/homepage.jpg',
    gallery: [
      { src: '/images/caramel-jo/homepage.jpg' },
      { src: '/images/caramel-jo/menu.jpg' },
      { src: '/images/caramel-jo/product-berry.jpg' },
      { src: '/images/caramel-jo/product-key-lime.jpg' },
    ],
    galleryShape: 'phone',
    accent: '#c4a484',
    brandFont: 'caramel',
    siteUrl: 'https://caramelandjo.com/',
  },
  {
    id: 'mi-gente',
    title: 'Mi Gente Bonita Market',
    shortTitle: 'Mi Gente Bonita',
    image: '/images/mi-gente/homepage.jpg',
    gallery: [
      { src: '/images/mi-gente/homepage.jpg', shape: 'phone' },
      { src: '/images/mi-gente/menu.jpg', shape: 'phone' },
      { src: '/images/mi-gente/contact.png', shape: 'phone' },
      { src: '/images/mi-gente/about.jpg', shape: 'phone' },
      { src: '/images/mi-gente/products.jpg', shape: 'phone' },
    ],
    galleryShape: 'phone',
    accent: '#6a93a8',
    brandFont: 'mi-gente',
    logo: '/images/mi-gente/logo.png',
    siteUrl: 'https://migentebonitamarket.com/',
  },
]

export function gallerySrc(shot: GalleryShot): string {
  return typeof shot === 'string' ? shot : shot.src
}

export function galleryShotShape(
  shot: GalleryShot,
  fallback: GalleryShape = 'phone'
): GalleryShape {
  if (typeof shot === 'string') return fallback
  return shot.shape ?? fallback
}

export function galleryShotLabel(shot: GalleryShot): string | undefined {
  if (typeof shot === 'string') return undefined
  return shot.label
}

export function getProjects(
  dict: Dictionary = en,
  locale: Locale = defaultLocale
): Project[] {
  return PROJECT_BASE.map((base) => {
    const copy = dict.projects[base.id]
    const gallery = base.gallery?.map((shot) => ({
      ...shot,
      label: copy?.galleryLabels?.[shot.src],
    }))
    return {
      ...base,
      caption: copy?.caption ?? '',
      description: copy?.description ?? '',
      features: copy?.features ?? [],
      packageLabel: copy?.packageLabel ?? '',
      gallery,
      href: withLocale(`/demos#${base.id}`, locale),
    }
  })
}

/** English defaults — prefer getProjects(dict) in UI */
export const projects: Project[] = getProjects(en)
