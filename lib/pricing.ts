export type PlanId = "basic" | "pro" | "business";

export interface PlanDetailGroup {
  label: string;
  items: string[];
}

export interface PricingPlan {
  id: PlanId;
  name: string;
  price: number;
  priceLabel: string;
  /** One short line for the landing viewport */
  shortSummary: string;
  summary: string;
  /** Parallel detail groups — same labels across plans for easy scanning */
  details: PlanDetailGroup[];
  /** Flat feature list (homepage / legacy consumers) */
  features: string[];
  highlighted?: boolean;
  cta: string;
  ctaHref: string;
}

export type SupportPlanId = "support" | "ultimate";

export interface SupportPlan {
  id: SupportPlanId;
  name: string;
  price: number;
  priceLabel: string;
  summary: string;
  /** Plain-language “why this helps” line for non-technical owners */
  whyItHelps: string;
  details: PlanDetailGroup[];
  features: string[];
  highlighted?: boolean;
  cta: string;
  ctaHref: string;
}

/** Ongoing Support — $50/month */
export const BASIC_SUPPORT = {
  price: 50,
  priceLabel: "$50/month",
  description: "Ongoing fixes and help for your site when something breaks or needs a small update.",
};

/** @deprecated Use BASIC_SUPPORT */
export const BASIC_HOSTING = BASIC_SUPPORT;

/** Shared detail labels so package cards line up for comparison */
export const PACKAGE_DETAIL_LABELS = [
  "Site scope",
  "Content & design",
  "Customer tools",
  "Behind the scenes",
  "Support after launch",
] as const;

export const SUPPORT_DETAIL_LABELS = [
  "Coverage",
  "What we handle",
  "How you reach us",
  "Best for",
] as const;

export const supportPlans: SupportPlan[] = [
  {
    id: "support",
    name: "Support",
    price: 50,
    priceLabel: "$50/month",
    summary:
      "A monthly care plan for everyday site needs — fixes, small updates, and someone to call when something looks off.",
    whyItHelps:
      "Once your site is live, menus change, photos need swapping, and the occasional glitch pops up. Support keeps those from becoming your problem.",
    details: [
      {
        label: "Coverage",
        items: [
          "Business-hours help for issues and small changes",
          "Keeps your live site maintained after launch",
        ],
      },
      {
        label: "What we handle",
        items: [
          "Fixes when a page, form, or link stops working",
          "Small content and layout updates (hours, photos, copy tweaks)",
          "Guidance when you’re unsure how to change something",
        ],
      },
      {
        label: "How you reach us",
        items: ["Email support with a clear response window"],
      },
      {
        label: "Best for",
        items: [
          "Owners who want peace of mind without managing the tech themselves",
          "Pairs with any website package",
        ],
      },
    ],
    features: [
      "Fixes when something breaks",
      "Small content & layout updates",
      "Email support",
      "Available as an add-on to any package",
    ],
    highlighted: false,
    cta: "Ask about Support",
    ctaHref: "/#introspect",
  },
  {
    id: "ultimate",
    name: "Ultimate Support",
    price: 250,
    priceLabel: "$250/month",
    summary:
      "Round-the-clock coverage when downtime costs you customers — priority hosting plus faster response and escalation.",
    whyItHelps:
      "“Uptime” just means your site stays online. Ultimate is for businesses that can’t afford to wait until morning if something goes down overnight.",
    details: [
      {
        label: "Coverage",
        items: [
          "Everything in Support, plus 24/7 on-call help",
          "Priority hosting so your site gets preferential infrastructure attention",
        ],
      },
      {
        label: "What we handle",
        items: [
          "Urgent outages and critical bugs any time of day",
          "Faster turnaround on fixes and updates",
          "Escalation when an issue needs deeper engineering attention",
        ],
      },
      {
        label: "How you reach us",
        items: [
          "Priority response channel",
          "On-call path for after-hours emergencies",
        ],
      },
      {
        label: "Best for",
        items: [
          "Busy shops, restaurants, and teams that take orders online",
          "Anyone for whom an offline site means lost sales",
        ],
      },
    ],
    features: [
      "Everything in Support",
      "24/7 on-call support",
      "Priority hosting",
      "Priority response & escalation",
    ],
    highlighted: true,
    cta: "Ask about Ultimate",
    ctaHref: "/#introspect",
  },
];

export const plans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 600,
    priceLabel: "$600",
    shortSummary: "A one-page website",
    summary:
      "A polished one-page website built around your business. We’ll shape the sections to what you actually need — common starting points include your story, hours, social links, and a product or photo gallery.",
    details: [
      {
        label: "Site scope",
        items: ["One focused page, designed around your goals"],
      },
      {
        label: "Content & design",
        items: [
          "Sections tailored to your business — not a fixed template checklist",
          "Common examples: name & story, hours, services, gallery, social links",
          "Mobile-friendly layout and clear contact paths",
        ],
      },
      {
        label: "Customer tools",
        items: [
          "Ways for visitors to reach you (contact, links, calls-to-action)",
          "Optional embeds when they fit (maps, booking widgets, and similar)",
        ],
      },
      {
        label: "Behind the scenes",
        items: ["Launch-ready site handed off cleanly"],
      },
      {
        label: "Support after launch",
        items: [
          "Build only — ongoing help available as a separate monthly add-on",
        ],
      },
    ],
    features: [
      "1-page",
      "Tailored sections",
      "Contact paths",
      "Support add-on",
    ],
    highlighted: false,
    cta: "More",
    ctaHref: "/pricing#basic",
  },
  {
    id: "pro",
    name: "Pro",
    price: 1000,
    priceLabel: "$1,000",
    shortSummary: "Up to five pages",
    summary:
      "Everything you’d expect from Basic, grown into a fuller site — up to five pages — with room for tools like accounts, ordering, and an admin area when your business needs them.",
    details: [
      {
        label: "Site scope",
        items: ["Up to 5 pages (for example: Home, About, Menu/Services, Gallery, Contact)"],
      },
      {
        label: "Content & design",
        items: [
          "Everything Basic covers, expanded across multiple pages",
          "Room to organize offers, stories, and details without cramming one screen",
        ],
      },
      {
        label: "Customer tools",
        items: [
          "Customer accounts when your workflow needs them",
          "Ordering or request flows suited to how you sell",
          "Clear paths from browse → inquire or buy",
        ],
      },
      {
        label: "Behind the scenes",
        items: [
          "Admin page so you can manage day-to-day updates",
          "Structured handoff so you’re not guessing how things work",
        ],
      },
      {
        label: "Support after launch",
        items: [
          "Build only — ongoing help available as a separate monthly add-on",
        ],
      },
    ],
    features: [
      "Up to 5 pages",
      "Accounts & ordering",
      "Admin page",
      "Support add-on",
    ],
    highlighted: true,
    cta: "More",
    ctaHref: "/pricing#pro",
  },
  {
    id: "business",
    name: "Business",
    price: 3000,
    priceLabel: "$3,000",
    shortSummary: "Custom apps tailored to your business",
    summary:
      "Built for established teams in active growth. Starts from what Pro covers, then adds custom-built applications shaped around how your business actually runs — workflows and tools unique to you, not a one-size site.",
    details: [
      {
        label: "Site scope",
        items: [
          "Custom scope beyond a standard multi-page site",
          "Web presence plus application features tailored to your operations",
        ],
      },
      {
        label: "Content & design",
        items: [
          "Everything Basic and Pro cover where it still applies",
          "Interfaces designed around your team’s real processes",
        ],
      },
      {
        label: "Customer tools",
        items: [
          "Custom flows for customers, staff, or both",
          "Features built to match how you take orders, bookings, or requests",
        ],
      },
      {
        label: "Behind the scenes",
        items: [
          "Custom applications and admin tools for your business",
          "Built with room to grow as your team does",
        ],
      },
      {
        label: "Support after launch",
        items: [
          "Personalized support as part of the engagement",
          "Ongoing monthly plans available when you want year-round coverage",
        ],
      },
    ],
    features: [
      "Custom apps",
      "Your workflows",
      "Growing teams",
      "Support included",
    ],
    highlighted: false,
    cta: "More",
    ctaHref: "/pricing#business",
  },
];

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
