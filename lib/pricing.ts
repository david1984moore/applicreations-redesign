export type PlanId = "basic" | "pro" | "business";

export interface PlanDetailGroup {
  label: string;
  /** Optional line under the label (e.g. “Common examples:”) */
  lead?: string;
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
  /** Flat feature list (homepage / glance chips) */
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

/** Shared detail labels so package rows line up for comparison */
export const PACKAGE_DETAIL_LABELS = [
  "How big is the site",
  "What it looks like",
  "How customers use it",
  "How you manage it",
  "Help after it’s live",
] as const;

export const SUPPORT_DETAIL_LABELS = [
  "What’s included",
  "What we fix or update",
  "How you contact us",
  "Who it’s for",
] as const;

export const supportPlans: SupportPlan[] = [
  {
    id: "support",
    name: "Basic Support",
    price: 50,
    priceLabel: "$50/month",
    summary: "Monthly help after your site is live — we fix things and make small updates for you.",
    whyItHelps:
      "Hours change, photos need swapping, and sometimes a page stops working. We take care of that so you don’t have to figure it out alone.",
    details: [
      {
        label: "What’s included",
        items: [
          "Help during normal business hours",
          "We keep your live website working after it goes online",
        ],
      },
      {
        label: "What we fix or update",
        items: [
          "Pages, forms, or buttons that stop working",
          "Small changes like hours, photos, or wording",
          "Plain answers when you’re not sure how to change something",
        ],
      },
      {
        label: "How you contact us",
        items: ["Email — we’ll tell you how quickly we usually reply"],
      },
      {
        label: "Who it’s for",
        items: [
          "Owners who don’t want to handle the tech themselves",
          "Works with any website package",
        ],
      },
    ],
    features: [
      "Help during normal business hours",
      "Fixes when something breaks",
      "Small updates",
      "Email help",
      "Works with any package",
    ],
    highlighted: false,
    cta: "Ask about Basic Support",
    ctaHref: "/introspect",
  },
  {
    id: "ultimate",
    name: "Ultimate Support",
    price: 250,
    priceLabel: "$250/month",
    summary: "Help any time of day or night when a down website means lost sales.",
    whyItHelps:
      "If your site goes down overnight and you can’t wait until morning, someone is available around the clock.",
    details: [
      {
        label: "What’s included",
        items: [
          "Everything in Basic Support",
          "Help any hour of the day or night",
          "Your site gets first attention when something goes wrong",
        ],
      },
      {
        label: "What we fix or update",
        items: [
          "Website down or major problems, day or night",
          "Faster fixes and updates",
          "Extra help when a problem needs more work",
        ],
      },
      {
        label: "How you contact us",
        items: [
          "A faster way to reach us",
          "A way to reach us after hours in an emergency",
        ],
      },
      {
        label: "Who it’s for",
        items: [
          "Busy shops that take orders online",
          "Anyone who loses money when the website is down",
        ],
      },
    ],
    features: [
      "Everything in Basic Support",
      "Help day or night",
      "First in line for fixes",
      "Faster replies",
    ],
    highlighted: true,
    cta: "Ask about Ultimate",
    ctaHref: "/introspect",
  },
];

export const plans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 600,
    priceLabel: "$600",
    shortSummary: "A one-page website",
    summary: "A clear one-page website built around your business.",
    details: [
      {
        label: "How big is the site",
        items: ["One page — everything visitors need in one place"],
      },
      {
        label: "What it looks like",
        items: [
          "Designed for your business, not a fill-in-the-blank template",
          "Can include your story, hours, what you offer, and a photo gallery",
          "Looks good on phones and computers",
        ],
      },
      {
        label: "How customers use it",
        lead: "Common examples:",
        items: [
          "A contact form so people can message you",
          "Your phone number and email on the page",
          "Links to your social media",
          "Optional: a map to your location",
          "Optional: a tool for customers to set appointments",
        ],
      },
      {
        label: "How you manage it",
        items: [
          "We walk you through how to use your website before we’re done",
          "We make sure you’re comfortable with it before we call the project finished",
        ],
      },
      {
        label: "Help after it’s live",
        items: ["This package covers building the website"],
      },
    ],
    features: [
      "1 page",
      "Built for your business",
      "Contact options for your customers",
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
    summary: "A fuller website — up to five pages — with room for logins, online orders, and a page you use to make updates.",
    details: [
      {
        label: "How big is the site",
        items: [
          "Up to 5 pages",
          "Example pages: Home, About, Menu or Services, Gallery, Contact",
        ],
      },
      {
        label: "What it looks like",
        items: [
          "Everything Basic includes, spread across multiple pages",
          "Space to show more without crowding one page",
        ],
      },
      {
        label: "How customers use it",
        items: [
          "Customer login accounts when you need them",
          "Online ordering that matches how you sell",
          "Request forms when people need to ask for something",
          "Clear steps from looking around to contacting you or buying",
        ],
      },
      {
        label: "How you manage it",
        items: [
          "A private page where you can change everyday things yourself",
          "We show you how everything works before we’re done",
          "We make sure you’re comfortable using it before we call the project finished",
        ],
      },
      {
        label: "Help after it’s live",
        items: ["This package covers building the website"],
      },
    ],
    features: [
      "Up to 5 pages",
      "Logins & online orders",
      "Admin page for updating",
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
    shortSummary: "Custom tools built for how you work",
    summary: "Custom tools built around how your team actually works — more than a normal website.",
    details: [
      {
        label: "How big is the site",
        items: [
          "6+ pages. Bigger than a normal multi-page website, requiring complex infrastructure architecture.",
          "Your public website plus custom tools for how your business runs",
        ],
      },
      {
        label: "What it looks like",
        items: [
          "Everything from Basic and Pro that still applies",
          "Screens built around how your team works day to day",
        ],
      },
      {
        label: "How customers use it",
        items: [
          "Custom steps for customers, your staff, or both",
          "Built around how you take orders",
          "Built around how you set appointments",
          "Built around how you handle requests",
        ],
      },
      {
        label: "How you manage it",
        items: [
          "Custom tools so you and your team can run the business from the site",
          "Built so it can grow with you as needs change",
          "We make sure you’re comfortable using it before we call the project finished",
        ],
      },
      {
        label: "Help after it’s live",
        items: [
          "Help from Applicreations is part of the project",
          "You can also add a monthly plan for year-round help",
        ],
      },
    ],
    features: [
      "Custom tools",
      "Built for your process",
      "Grows with your team",
      "Help included",
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

/** sessionStorage key for pricing → Introspect handoff */
export const PRICING_SELECTION_STORAGE_KEY = "applicreations-pricing-selection";

export type PricingSelectionHandoff = {
  planId: PlanId | null;
  supportId: SupportPlanId | null;
};

/** Map website package → Introspect siteDepth (step 6 proxy). */
export function planIdToSiteDepth(
  planId: PlanId
): "basics" | "a-few-pages" | "fuller-site" {
  switch (planId) {
    case "basic":
      return "basics";
    case "pro":
      return "a-few-pages";
    case "business":
      return "fuller-site";
  }
}

export function isPlanId(value: unknown): value is PlanId {
  return value === "basic" || value === "pro" || value === "business";
}

export function isSupportPlanId(value: unknown): value is SupportPlanId {
  return value === "support" || value === "ultimate";
}

export function buildIntrospectHandoffHref(
  planId: PlanId | null,
  supportId: SupportPlanId | null
): string {
  const params = new URLSearchParams();
  params.set("from", "pricing");
  if (planId) params.set("plan", planId);
  if (supportId) params.set("support", supportId);
  return `/introspect?${params.toString()}`;
}

export function writePricingSelectionHandoff(
  planId: PlanId | null,
  supportId: SupportPlanId | null
): void {
  try {
    const payload: PricingSelectionHandoff = { planId, supportId };
    sessionStorage.setItem(PRICING_SELECTION_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota / private mode */
  }
}

export function readPricingSelectionHandoff(): PricingSelectionHandoff | null {
  try {
    const raw = sessionStorage.getItem(PRICING_SELECTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PricingSelectionHandoff>;
    return {
      planId: isPlanId(parsed.planId) ? parsed.planId : null,
      supportId: isSupportPlanId(parsed.supportId) ? parsed.supportId : null,
    };
  } catch {
    return null;
  }
}

/** Plain-text synopsis for the client’s mailbox (mailto / API log). */
export function formatSelectionForEmail(
  plan: PricingPlan | null,
  support: SupportPlan | null
): { subject: string; body: string } {
  const oneTime = plan?.price ?? 0;
  const monthly = support?.price ?? 0;
  const totalLine = [
    plan ? `${formatMoney(oneTime)} one-time` : null,
    support ? `${formatMoney(monthly)}/mo` : null,
  ]
    .filter(Boolean)
    .join(" + ");

  const lines = [
    "Your Applicreations selection",
    "",
    plan
      ? `Website package: ${plan.name} — ${plan.priceLabel} one-time`
      : "Website package: (none selected)",
    support
      ? `Monthly care: ${support.name} — ${support.priceLabel}`
      : "Monthly care: (none selected)",
    "",
    `Estimated total: ${totalLine || "$0"}`,
    "",
    "$0 due today — nothing is due until after your free preview is delivered.",
    "This is only an estimate of what to expect; final scope is confirmed together.",
    "",
    "— Applicreations",
    "https://applicreations.com/pricing",
  ];

  return {
    subject: plan
      ? `Your Applicreations selection — ${plan.name}${support ? ` + ${support.name}` : ""}`
      : support
        ? `Your Applicreations selection — ${support.name}`
        : "Your Applicreations selection",
    body: lines.join("\n"),
  };
}
