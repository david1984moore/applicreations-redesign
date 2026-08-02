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

/** Real client work — homepage preview + /demos detail */
export const projects: Project[] = [
  {
    id: "caramel-jo",
    title: "Caramel & Jo",
    caption: "A warm bakery site that feels at home on a phone.",
    description:
      "Custom website for a bakery brand — clear story, product presence, and a layout that stays friendly on small screens.",
    features: [
      "Mobile-first layout",
      "Brand-forward homepage",
      "Product gallery & cart",
      "Simple email ordering system",
      "Bilingual EN / ES",
    ],
    image: "/images/caramel-jo/homepage.jpg",
    gallery: [
      { src: "/images/caramel-jo/homepage.jpg", label: "Homepage" },
      { src: "/images/caramel-jo/menu.jpg", label: "Menu" },
      { src: "/images/caramel-jo/product-berry.jpg", label: "Product — berry tart" },
      { src: "/images/caramel-jo/product-key-lime.jpg", label: "Product — key lime" },
    ],
    galleryShape: "phone",
    accent: "#c4a484",
    brandFont: "caramel",
    packageLabel: "Pro package · $1,000",
    siteUrl: "https://caramelandjo.com/",
    href: "/demos#caramel-jo",
  },
  {
    id: "mi-gente",
    title: "Mi Gente Bonita Market",
    shortTitle: "Mi Gente Bonita",
    caption: "A friendly market presence with room to grow.",
    description:
      "Neighborhood market site built for clarity — who they are, what they offer, and an easy path for customers to engage.",
    features: [
      "Business info, hours & locations",
      "Product photo gallery",
      "Bilingual EN / ES",
      "Call, directions & social links",
    ],
    image: "/images/mi-gente/homepage.jpg",
    gallery: [
      { src: "/images/mi-gente/homepage.jpg", shape: "phone", label: "Homepage" },
      { src: "/images/mi-gente/menu.jpg", shape: "phone", label: "Menu & hours" },
      { src: "/images/mi-gente/contact.png", shape: "phone", label: "Contact" },
      { src: "/images/mi-gente/about.jpg", shape: "phone", label: "About" },
      { src: "/images/mi-gente/products.jpg", shape: "phone", label: "Products" },
    ],
    galleryShape: "phone",
    accent: "#6a93a8",
    brandFont: "mi-gente",
    logo: "/images/mi-gente/logo.png",
    packageLabel: "Pro package · $1,000",
    siteUrl: "https://migentebonitamarket.com/",
    href: "/demos#mi-gente",
  },
]
