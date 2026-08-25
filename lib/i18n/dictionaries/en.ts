import type { Dictionary } from '@/lib/i18n/dictionaries/types'

export const en: Dictionary = {
  brand: { name: 'Applicreations' },
  meta: {
    homeTitle: 'Applicreations — Custom apps and websites',
    homeDescription:
      'Friendly custom websites and apps for local businesses. Simple pricing. Clear next steps.',
    aboutTitle: 'About — Applicreations',
    aboutDescription:
      'Meet David Moore — founder of Applicreations. Human-centered web design for small local businesses.',
    contactTitle: 'Contact — Applicreations',
    contactDescription:
      'Get in touch about a custom website or app. Tell us your name, email, and phone — we will reply soon.',
    introspectTitle: 'Introspect — Applicreations',
    introspectDescription:
      'A short questionnaire about your business so we can build a preview of your custom website.',
    pricingTitle: 'Pricing — Applicreations',
    pricingDescription:
      'Simple pricing for custom websites — one-time packages plus hosting & support from $19/month.',
    demosTitle: 'Projects — Applicreations',
    demosDescription:
      'Real client projects by Applicreations — see how each site looks and what went into it.',
  },
  nav: {
    introspect: 'Introspect',
    projects: 'Projects',
    pricing: 'Pricing',
    about: 'About',
    contact: 'Contact',
    homeAria: 'Applicreations home',
    languageToggleAria: 'Change language',
    languageEn: 'EN',
    languageEs: 'ES',
  },
  landing: {
    tagline: 'Custom apps and websites',
    websitePricing: 'Website Pricing',
    popularPackage: 'Popular',
    hostingFrom: '*Hosting & support from {price}',
    howItWorks: 'How it works',
    threeSteps: 'Three simple steps to get your website…',
    threeStepsRest: 'simple steps to get your website…',
    beginIntrospect: 'Begin Introspect',
    getFreePreview: 'Get Started',
    seeMore: 'See more',
    steps: {
      introspect: {
        label: 'Introspect',
        detail: 'Answer a few questions...',
      },
      livePreview: {
        label: 'Demo Site',
        detail: 'You get a custom demo site...',
        building: '...we get to work',
        buildingPreview: '...we get to work',
        phoneSuffix: 'even on your phone',
      },
      workingWebsite: {
        label: 'Going live',
        recapLabel: 'Go Live',
        detail: 'We review with you, make revisions. The build is finished and the real website is delivered.',
        review: 'We review',
        revise: 'Make revisions',
        justRight: 'Adjusting',
        justRightTune: 'Fine-tuning',
        justRightFinally: 'and then',
        goLive: 'the website is live.',
        suffix: "And you're in business!",
      },
    },
  },
  common: {
    more: 'More',
    contact: 'Contact',
    remove: 'Remove',
    back: 'Back',
    cancel: 'Cancel',
    close: 'Close',
    optional: 'Optional',
    notIncluded: 'Not included',
    errorGeneric: 'Something went wrong. Please try again.',
    emptyDash: '—',
  },
  about: {
    eyebrow: 'About',
    name: 'David Moore',
    role: 'Founder, Applicreations',
    p1: 'I grew up drawing with different mediums — pencil, pen and ink, charcoal, pastels, and watercolor. Eventually I worked as a chef, expressing my creative tendencies through flavor and presenting ingredients on a plate.',
    p2: "While teaching myself web design and software starting in 2021, along the way I've noticed that many small local businesses struggle to present themselves respectfully online — or end up with generic-looking sites from Wix, GoDaddy, Squarespace, and the like. Increasingly, in a world focused more on machines than people, I felt drawn to web development that puts people first — building exactly what each client wants, on their terms. So I started Applicreations in 2025.",
    p3: 'Generic website builders are often fast, but they can leave you feeling like a number. There are no generic templates at Applicreations — every project is original and custom tailored to what you actually want. Every business has a different identity, and that deserves a respectful online presence. I help people plant unique digital roots. I look forward to helping you plant yours.',
  },
  contact: {
    eyebrow: 'Contact',
    heading: 'Get in touch',
    respondWithin: 'We typically respond within 48 hours.',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    phoneLabel: 'Phone',
    phonePlaceholder: '(555) 555-5555',
    emailLabel: 'Email',
    emailPlaceholder: 'you@business.com',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell us about your idea, goals, or what you have in mind…',
    sendMessage: 'Send message',
    successHeading: 'Thanks for reaching out',
    successBody: 'We got your message and will reply soon.',
    sendAnother: 'Send another message',
    errorName: 'Please enter your name',
    errorEmail: 'Please enter a valid email',
    errorPhone: 'Please enter a valid phone number',
    errorMessageEmpty: 'Please enter a message',
    errorMessageShort: 'A bit more detail helps — at least a sentence',
    errorGeneric: 'Something went wrong. Please try again.',
  },
  demos: {
    title: 'Projects',
    chooseProjectAria: 'Choose a project',
    screensAria: '{title} screens',
    showLabel: 'Show {label}',
    showScreenOf: 'Show screen {index} of {total}',
    resumeScreenshots: 'Resume {title} screenshots',
    pauseScreenshots: 'Pause {title} screenshots',
    imageAltScreenOf: '{title} — screen {index} of {total}',
    imageAltLabeled: '{title} — {label}',
    imageAltScreen: '{title} — screen {index}',
    pausedHint: 'Paused — tap a thumbnail to switch',
    playHint: 'Tap a thumbnail · tap photo to zoom',
    openPhotoZoom: 'Open {title} photo to zoom',
    closePhotoZoom: 'Close photo',
    zoomHint: 'Pinch to zoom · drag to pan',
    visit: 'Visit {name}',
    wantLikeThis: 'Want something like this?',
    startOrEmail: 'Start with Introspect — or email us directly.',
    beginIntrospect: 'Begin Introspect',
    getStarted: 'Get Started',
    contact: 'Contact',
  },
  pricingPage: {
    title: 'Pricing',
    websitePlansHeading: 'Website',
    oneTime: 'one-time',
    whatsIncluded: "What's included",
    howYouWork: "How you'll work with us",
    afterLaunch: 'After launch',
    visitorsCan: 'Visitors can {list}',
    baselineNote:
      'Every Applicreations site is **built for speed**, **mobile-friendly**, and designed to be found by **AI**, **Google**, and **every major search engine**.',
    mostPopular: 'Most popular',
    seeFullComparison: 'See the full comparison',
    hideComparison: 'Hide comparison',
    comparison: {
      heading: 'Compare packages',
      featureCol: 'What you get',
      includedInEvery:
        'Every package includes original design, a phone-ready layout, speed & security, on-page SEO, your content, and contact info.',
      footer:
        'Each package includes everything in the one before it, plus what is marked in its column. Extra revision rounds are $75, except on Pro where they are included.',
      includedAria: 'Included',
      notIncludedAria: 'Not included',
      hintAria: 'More about {label}',
      sections: {
        included: 'Included',
        build: 'Build',
        visibility: 'Visibility',
        strategy: 'Polish',
        customTools: 'Extra features',
      },
      rows: {
        originalDesign: 'Original design',
        responsive: 'Responsive',
        speedSecurity: 'Speed & security',
        onPageSeo: 'On-page SEO',
        contentAsProvided: 'Content as provided',
        contactInfo: 'Contact & credibility',
        pages: 'Pages',
        revisionRounds: 'Revisions',
        extraRevision: 'Extra revision',
        walkthrough: 'Walkthrough',
        brandedMarketing: 'Branded marketing',
        localSeo: 'Search visibility check',
        visitorCounts: 'Visitor counts',
        adminPage: 'Admin page',
        extraFunctionality: 'Extra functionality',
        siteSearch: 'Site search',
        priorityBuild: 'Priority build',
      },
      hints: {
        localSeo:
          'A check that your business/project shows up correctly in local search results and Google Maps.',
        visitorCounts:
          'A simple count of how many people visit — not reports, charts, or a monthly dashboard.',
        adminPage:
          'A private dashboard to manage your own content without touching code.',
        siteSearch:
          'A search bar so visitors can find what they need on a larger site.',
        brandedMarketing:
          'Business is a starter kit — logo, colors, and how the site looks when someone shares the link. Pro is the full treatment: we make the logo, brand the links, and match Facebook, socials, Google, and print.',
        extraFunctionality:
          'Booking calendars, quote calculators, member logins, or other built-in tools your site needs.',
        priorityBuild: 'Your project starts at the front of the queue.',
        extraRevision:
          'One more round of edits after the rounds included in the package.',
      },
      values: {
        pagesStarter: '1',
        pagesBasic: '1–2',
        pagesBusiness: '3–5',
        pagesPro: 'Larger',
        revisionsStarter: '1',
        revisionsBasic: '1',
        revisionsBusiness: '2',
        revisionsPro: '3',
        brandedMarketingBusiness: 'Limited',
        brandedMarketingPro: 'Full',
        extraRevisionIncluded: 'Included',
      },
    },
    startingPriceNote:
      'This price is a starting point. After your website is built and live, any additional work, features, or services you request will be estimated by Applicreations before that work begins.',
    highlightsAria: '{name} highlights',
    exampleTotal:
      'Example: Basic ({basicPrice}) + Basic ({supportPrice}) — choose both to see a simple total.',
    hostingSupportHeading: 'Hosting & Support',
    hostingSupportLead:
      'Monthly care that keeps your site live — pick the reply speed that fits.',
    hostingWhoFor: 'Who it’s for',
    mixMatchHeading: 'Pricing Preview',
    redesignPrompt: '"I already have a website, I just need it redesigned."',
    redesignHint: 'Make sure to select "{choice}" when filling out the form.',
    redesignCta: 'Start Re-design',
    mixMatchLead:
      'Click a website package and a hosting plan to see your total.',
    mixMatchLeadTap:
      'Tap a website package and a hosting plan to see your total.',
    mixMatchWebsiteHeading: 'Choose a website package',
    mixMatchHostingHeading: 'Choose hosting & support',
    mixMatchEmptyPackage: 'Your website package',
    mixMatchEmptyHosting: 'Your hosting plan',
    hostingIntroBeforeRender: 'When we host your site, it runs on',
    hostingIntroRender: 'Render',
    goingLiveHeading: 'Going Live',
    goingLiveLead: 'What you need to get your site on the internet.',
    goingLiveStep1Title: 'Website package',
    goingLiveStep1Bullet:
      'Your package covers the build only — designing and delivering the site.',
    goingLiveStep2Title: 'Hosting & Support',
    goingLiveStep2BulletPlan:
      'Add a hosting & support plan so we can get your site live, keep it online, and handle technical issues.',
    goingLiveStep2CancellationHeading: 'Cancellation',
    goingLiveStep2BulletCancel:
      'You can cancel hosting and support at any time. Before we can transfer your website data, you must have your own Render account set up and active — that is mandatory. When you cancel, you take over the technical work we handle while you are with us — including:',
    goingLiveStep2CancelItems: [
      'Point your web address at the live site — DNS records (A/CNAME) at your domain registrar',
      'Keep the site secure in the browser — HTTPS certificates and forcing secure connections',
      'Own the hosting account — Render service settings, build commands, and runtime version',
      'Keep private keys private — production environment variables and secrets',
      'Ship updates without breaking the live site — git deploys, build logs, and rollbacks',
      'Fix it when something goes down — uptime checks, 5xx errors, and restoring a bad release',
      'Keep the software current — dependency updates and security patches',
      'Pay and manage the host yourself — Render login, limits, and billing after handoff',
    ],
    goingLiveStep2CancelClosing:
      'We strongly advise against the build & hand off option — it invites complex technical problems for your business or project later on. Once your website data has been transferred and the site is live on your Render account, you are solely responsible for everything from that moment forward. Applicreations is no longer responsible for any technical maintenance or support — no exceptions.',
    goingLiveStep2HandoffHeading: 'Build and hand off — no ongoing hosting',
    goingLiveStep2HandoffBodyBefore:
      'Want us to build your site, put it online, and then leave hosting and support to you? That option is available for an additional',
    goingLiveStep2HandoffFee: '$500',
    goingLiveStep2HandoffBodyAfterFee:
      '. We deploy only on Render — we do not set up or accept requests for other servers.',
    goingLiveStep2HandoffFeeCovers:
      'Your website package covers creating, designing, and delivering the site. The $500 one-time fee covers deploying it to your Render account and a short walkthrough so you — or whoever will handle technical maintenance — know the basics of accessing the site, deploying updates, and doing minor upkeep.',
    goingLiveStep2HandoffRenderAccount:
      'Before the site goes live, you are responsible for having your own Render account set up and active so we can deploy the website to your account.',
    goingLiveStep2HandoffSoleResponsibility:
      'Once the site is live on your Render account, you are solely responsible for updates, technical issues, and keeping the site running.',
    goingLiveStep2HandoffExample:
      'Example: {planName} ({planPrice}) + build & hand off ({handoffFee}) = {total} — we build the site and deploy it to your Render account, with no ongoing hosting & support plan.',
    buildHandoffName: 'Build & hand off',
    buildHandoffSelect: 'Select build & hand off instead of monthly hosting',
    buildHandoffSelected: 'Build & hand off selected',
    buildHandoffRemove: 'Remove',
    buildHandoffConfirmTitle: 'Select build & hand off?',
    buildHandoffConfirmBody:
      'We strongly advise against this option — it means you take on hosting and technical maintenance yourself, with no ongoing support from us. Are you sure you want to continue?',
    buildHandoffConfirmYes: "Yes, I'm sure",
    buildHandoffConfirmNo: 'Cancel',
    buildHandoffConfirmCloseAria: 'Close',
    buildHandoffResponsibilityHeading:
      'If you choose this, you are solely responsible for all of the following once the site is live on your Render account:',
    selectionEmailBuildHandoff: 'Build & hand off: {price} one-time (no monthly hosting)',
    selectionEmailBuildHandoffNote:
      'Before go-live you must have an active Render account. After the site is live on your account, you are solely responsible for:',
    goingLiveStep3Title: 'Domain name',
    goingLiveNeedDomainBefore:
      'Purchase a domain of your choice (your web address, like www.joescafe.com — you can buy one at ',
    goingLiveNeedDomainNamecheap: 'Namecheap',
    goingLiveNeedDomainAfter: ').',
    notSureHeading: 'Not sure which fits?',
    notSureBody:
      "Answer a few short questions and we'll help you choose — or email us with what you've picked.",
    introspectCta: 'Introspect',
    contactCta: 'Contact',
    choose: 'Choose {name}',
    chosen: 'Chosen',
    chosenAria: 'Chosen {name}',
    yourSelection: 'Payment Summary',
    packageSuffix: '{name} package',
    oneTimeSuffix: '{price} one-time',
    emptySelection:
      'Click a package and a hosting plan. They’ll show up here with your total.',
    emptySelectionTap:
      'Tap a package and a hosting plan. They’ll show up here with your total.',
    expandDetails: 'Show details',
    collapseDetails: 'Hide details',
    estimatedTotal: 'Estimated total',
    totalWithMonthly: '{oneTime} + {monthly}/mo',
    zeroDueToday: '$0 due today.',
    previewTerms:
      'Free preview in 72 hours, then three days to try it. Stop after the preview and you owe nothing.',
    continueAfterPreviewBefore: 'Want to continue after the three days? Then',
    fiftyPercentOneTime: '50% of the one-time fee',
    fiftyPercentOneTimeWithAmount: '50% of the one-time fee ({amount})',
    continueAfterPreviewAfter: 'will be due.',
    buildRealSiteBefore:
      "We build your real site (usually 14 days or less). When it's live and you're happy, the",
    remainingFifty: 'remaining 50%',
    remainingFiftyWithAmount: 'remaining 50% ({amount})',
    isDue: 'is due',
    alongWithFirstMonthly: ', along with your first monthly support payment ({amount})',
    alongWithBuildHandoff: ', along with the build & hand off fee ({amount})',
    monthlySupportStartsWith:
      'Monthly support ({monthly}/mo) starts when your site goes live — the first {monthly} is due then, with the remaining package balance.',
    monthlySupportStartsWithout:
      'If you add monthly support, that first payment starts when your site goes live — due then with the remaining package balance.',
    paymentScheduleHeading: 'Payment schedule',
    scheduleProjectStart: 'Project start',
    scheduleProjectStartDetail: '50% of package',
    scheduleGoLive: 'Website goes live',
    scheduleGoLivePackageOnly: 'Remaining 50% of package',
    scheduleGoLiveWithSupport:
      'Remaining 50% of package ({packageHalf}) + first monthly support ({monthly})',
    scheduleGoLiveWithHandoff:
      'Remaining 50% of package ({packageHalf}) + build & hand off ({handoff})',
    continueToIntrospect: 'Continue to Introspect',
    emailThisSelection: 'Email my selection',
    yourEmailSrOnly: 'Your email',
    emailPlaceholder: 'you@example.com',
    emailInvalid: 'Please enter a valid email.',
    emailSendFailed: 'Could not send the email. Please try again in a moment.',
    emailSendFailedNetwork:
      'Could not send the email. Please check your connection and try again.',
    emailSentFallback:
      'Sent! Check your inbox for your selection summary from Applicreations.',
    emailHint: 'We’ll email your selection summary from Applicreations to this address.',
    emailSent: 'Email sent',
    sendMySelection: 'Send my selection',
    noPackage: 'No package',
    noMonthlySupport: 'No monthly support',
    review: 'Review →',
    selectionEmailSubject: 'Your Applicreations selection',
    selectionEmailSubjectWithPlan: 'Your Applicreations selection — {name}',
    selectionEmailSubjectWithSupport: 'Your Applicreations selection — {name}',
    selectionEmailBodyHeader: 'Your Applicreations selection',
    selectionEmailWebsitePackage: 'Website package: {name} — {price}',
    selectionEmailWebsiteNone: 'Website package: (none selected)',
    selectionEmailMonthlyCare: 'Monthly care: {name} — {price}',
    selectionEmailMonthlyNone: 'Monthly care: (none selected)',
    selectionEmailEstimatedTotal: 'Estimated total: {total}',
    selectionEmailZeroDue:
      '$0 due today — nothing is due until after your free preview is delivered.',
    selectionEmailEstimateNote:
      'This is only an estimate of what to expect; final scope is confirmed together.',
    selectionEmailSignoff: '— Applicreations',
    selectionEmailWebsiteLabel: 'Website package',
    selectionEmailMonthlyLabel: 'Monthly care',
    selectionEmailTotalLabel: 'Estimated total',
    selectionEmailLinkLabel: 'View pricing on Applicreations',
  },
  introspectUi: {
    // Progress / chrome
    stepOf: 'Step {step} of {total}',
    review: 'Review',
    exit: 'Exit',
    back: 'Back',
    progressAria: 'Questionnaire progress',
    // Welcome
    welcomeEyebrow: 'Introspect',
    welcomeHeading: 'Welcome — let’s learn about your project',
    whatToExpect: 'What to expect',
    expect1: 'Answer a few questions.',
    expect2: 'Within two days, get a working preview website.',
    expect3: 'Try it out for 24 hours. Like what you see? We talk business.',
    getStarted: 'Start',
    // Step 1
    step1Title: 'First, a little about you',
    nameLabel: 'Your name',
    namePlaceholder: 'Jane Smith',
    emailLabel: 'Email',
    emailPlaceholder: 'jane@example.com',
    phoneLabel: 'Phone',
    phoneHint: "We'll text first if we contact you this way.",
    phonePlaceholder: '(555) 123-4567',
    phoneFullError: 'Please enter a full 10-digit phone number',
    phoneKeepTyping: 'Keep typing — a full number looks like (555) 123-4567',
    yesContinue: 'Yes, continue',
    // Step 2
    step2Title: 'Tell us about your business or project',
    businessNameLabel: 'Name of your business or project',
    businessNamePlaceholder: "Joe's Cafe",
    aboutBusinessLabel: 'What does it do or offer?',
    aboutBusinessPlaceholder: 'A neighborhood cafe that serves breakfast, lunch, and coffee',
    locationLabel: 'Where are you located?',
    locationPlaceholder: 'City, town, or area you serve',
    // Step 3
    step3Title: 'Your online presence today',
    step3Subtitle: "It's fine if you don't have a website yet.",
    hasOnlineLabel: 'Do you already have a website or online pages?',
    hasOnlineYes: 'I have a website',
    chooseOne: 'Please choose one',
    websiteUrlLabel: 'Link to your current website (if any)',
    websiteUrlPlaceholder: 'https://yourwebsite.com',
    socialLinksLabel: 'Links to your social media pages (if any)',
    socialLinksHint: 'Facebook, Instagram, LinkedIn, and the like — one link per box.',
    addSocialLink: 'Add another social link',
    admiredLabel: 'Websites you really admire',
    admiredHint:
      'Not required, but it helps us get a better feel for your design preferences.',
    addAdmiredSite: 'Add another site',
    linkPlaceholder: 'https://...',
    removeItem: 'Remove',
    removeItemAria: 'Remove item',
    // Step 4
    step4Title: 'Logo and pictures',
    step4Subtitle: "We'll work with what you have — or help figure out photos later.",
    hasLogoLabel: 'Do you already have a logo?',
    uploadLogoLabel: 'Upload your logo (optional)',
    uploadLogoHint: 'PNG, JPG, WebP, or SVG — up to 5 MB.',
    hasPhotosLabel: "Do you have pictures you'd like on the site?",
    uploadPhotosLabel: 'Upload pictures (optional)',
    uploadPhotosHint: 'PNG, JPG, or WebP — up to {max} files, 10 MB each.',
    needsPhotosLabel: 'Do you need new photos taken?',
    logoTooLarge: 'Logo must be 5 MB or smaller',
    photoTooLarge: '"{name}" is over 10 MB — please choose a smaller file',
    photoLimit: 'You can upload up to {max} pictures',
    chooseLogoFile: 'Choose logo file',
    replaceLogo: 'Replace logo',
    choosePictures: 'Choose pictures',
    addMorePictures: 'Add more pictures',
    removeFileAria: 'Remove {name}',
    uploadSecurityNotice:
      "Uploads are optional. Uploads are protected by Google's infrastructure-level encryption (AES-256 at rest, TLS in transit). Applicreations keeps the folder access restricted to Applicreations only, and files are deleted from the shared folder within 30 days of project completion.",
    // Step 5
    step5Title: 'What should people be able to do on your website?',
    step5Hint: 'Examples: call you, see a menu, book a visit, buy something, check events.',
    addAction: 'Add another action',
    actionPlaceholder: 'See our hours',
    visitorActionsError: 'Please list at least one thing people should be able to do',
    // Step 6
    step6Title: 'How developed should it be?',
    step6Subtitle: 'Pick the closest fit. We can refine this when we review your answers.',
    siteDepthError: 'Please choose how full you want the site to be',
    // Step 7
    step7Title: 'Design feel and colors',
    step7Subtitle: 'Choose all that apply — or leave it to us.',
    designFeelHeading: 'Design feel',
    colorsHeading: 'Colors',
    noPreference: 'No preference — you decide',
    matchLogoColors: 'Match colors from my logo',
    designFeelsError: 'Pick at least one design feel, or choose no preference',
    colorPalettesError:
      'Pick at least one color direction, match your logo, or choose no preference',
    colorNotesError: 'Tell us a bit about the colors you have in mind',
    colorNotesLabelCustom: 'Tell us about your colors',
    colorNotesLabelOptional: 'Anything else about colors or the look? (optional)',
    colorNotesHint: 'Brand colors, colors to avoid, or a quick description.',
    colorNotesPlaceholder: 'Deep blue and cream, like our storefront...',
    // Step 8
    step8Title: 'Anything we should steer clear of?',
    step8Aria: 'Anything we should steer clear of',
    step8Placeholder:
      "Optional — looks you dislike, tones that feel wrong, or styles that don't fit…",
    // Step 9
    step9Title: 'Is there anything else about your business that we should know?',
    step9Aria: 'Anything else about your business',
    step9Placeholder: 'Optional — hours, seasons, partners, must-haves…',
    // Buttons
    continue: 'Continue',
    continueToReview: 'Continue to Review',
    submitIntrospect: 'Submit Introspect',
    // Review
    reviewHeading: 'Review your answers',
    reviewSubtitle: 'Check everything below, then submit when it looks right.',
    reviewAboutYou: 'About you',
    reviewName: 'Name',
    reviewEmail: 'Email',
    reviewPhone: 'Phone',
    reviewYourBusiness: 'Your business',
    reviewBusinessProject: 'Business / project',
    reviewLocation: 'Location',
    reviewWhatYouDo: 'What you do',
    reviewOnlinePresence: 'Online presence',
    reviewAlreadyOnline: 'Already online?',
    reviewWebsite: 'Website',
    reviewSocialLinks: 'Social links',
    reviewSitesAdmire: 'Sites you admire',
    reviewLogoPhotos: 'Logo & photos',
    reviewHasLogo: 'Has a logo',
    reviewLogoFile: 'Logo file',
    reviewHasPhotos: 'Has photos',
    reviewPhotoFiles: 'Photo files',
    reviewNeedPhotos: 'Need photos taken',
    reviewVisitorsShouldDo: 'What visitors should do',
    reviewActions: 'Actions',
    reviewSiteScope: 'Site scope',
    reviewHowDeveloped: 'How developed',
    reviewDesignColors: 'Design feel & colors',
    reviewDesignFeel: 'Design feel',
    reviewColors: 'Colors',
    reviewColorNotes: 'Color notes',
    reviewSteerClear: 'Steer clear of',
    reviewAvoid: 'Avoid',
    reviewAnythingElse: 'Anything else',
    reviewNotes: 'Notes',
    // Success
    successEyebrow: "You're all set",
    successHeading: 'Thanks — we received your Introspect answers',
    successNextHeading: 'What happens next…',
    successNext1: 'Applicreations has started working on your free preview website.',
    successNext2:
      'You will receive a link to the free preview website by email in less than 72 hours.',
    successNext3:
      'Explore your preview website for 3 days. Then select start my real website or stop project.',
    successNext4:
      'If start my real website is selected, Applicreations will contact you to confirm the final project scope.',
    successFootnote: '*Please use the buttons in your email so that we know how to proceed.',
    successHomeAria: 'Applicreations home',
    // Errors
    errorGeneric: 'Something went wrong. Please try again.',
    errorTryEmail: 'Something went wrong. Please try again or email us directly.',
  },
  introspectValidation: {
    liveEmailAt: 'Please include an @ in your email',
    liveEmailComplete: 'Please enter a complete email (like jane@example.com)',
    liveEmailValid: 'Please enter a valid email (like jane@example.com)',
    businessName: 'Please enter the name of your business or project',
    aboutBusinessEmpty: 'Please tell us what your business or project does',
    aboutBusinessShort: 'Please add a bit more — a short sentence helps us get started',
    locationEmpty: 'Please tell us where you are located',
    locationShort: 'Please enter a real place — city, town, or area you serve',
    nameHardShort: 'Please enter your name',
    nameHardLetters: 'Please enter a real name (letters, not just numbers or symbols)',
    nameSoftWarning: "Hey — are you sure that's your name? Just double-checking.",
  },
  introspectOptions: {
    yesNoUnsure: { yes: 'Yes', no: 'No', unsure: 'Not sure' },
    siteDepth: {
      basics: {
        title: 'The basics',
        description:
          'One clear page: who you are, what you offer, hours or details that matter, and how people reach you.',
      },
      'a-few-pages': {
        title: 'A few pages and some tools',
        description:
          'A small set of pages with room to breathe — for example Home, About, Services or Menu, Gallery, and Contact.',
      },
      'fuller-site': {
        title: 'The ultimate site, custom tools and more',
        description:
          'Multiple pages plus things people (or you) interact with — like ordering, booking, accounts, or tools to update the site. Custom features built around how you work fit here too.',
      },
    },
    designFeels: {
      'clean-simple': { title: 'Clean & simple', description: 'Open space, easy reading' },
      'warm-friendly': {
        title: 'Warm & friendly',
        description: 'Welcoming, neighborhood feel',
      },
      'bold-modern': { title: 'Bold & modern', description: 'Strong contrast, clear shapes' },
      'classic-calm': { title: 'Classic & calm', description: 'Steady, polished, timeless' },
      'playful-fun': { title: 'Playful & fun', description: 'Lighthearted, energetic' },
      'elegant-refined': {
        title: 'Elegant & refined',
        description: 'Quiet luxury, careful detail',
      },
      'rustic-natural': {
        title: 'Rustic & natural',
        description: 'Organic, grounded, handmade',
      },
      'dark-dramatic': { title: 'Dark & dramatic', description: 'Moody, high impact' },
      'airy-light': { title: 'Airy & light', description: 'Bright, breezy, open' },
      editorial: { title: 'Editorial', description: 'Magazine-like, expressive type' },
    },
    colorPalettes: {
      'ocean-blues': { title: 'Ocean blues' },
      'coastal-teal': { title: 'Coastal teal' },
      'warm-earth': { title: 'Warm earth' },
      'sunset-coral': { title: 'Sunset coral' },
      'fresh-greens': { title: 'Fresh greens' },
      'soft-neutrals': { title: 'Soft neutrals' },
      'charcoal-gold': { title: 'Charcoal & gold' },
      'soft-blush': { title: 'Soft blush' },
      'bright-cheerful': { title: 'Bright & cheerful' },
      'deep-jewel': { title: 'Deep jewel' },
      custom: { title: 'I have my own' },
    },
    recommend: {
      choseOnPricing: 'Client already chose {name} on the pricing page.',
      pro:
        'You described a fuller site with interactive pieces or custom tools — that usually fits Pro.',
      businessInteractive:
        'You want visitors to do more than read (order, book, accounts, etc.) — that usually fits Business.',
      businessPages: 'A multi-page site usually fits Business.',
      businessPhotos:
        'A site that needs new photos or more room to grow usually fits Business.',
      basic: 'A clear site of one or two pages with the essentials usually fits Basic.',
    },
    emailLabels: {
      recommendedPackage: 'Recommended package',
      why: 'Why',
      pricingSelection: 'Pricing page selection',
      package: 'package',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      businessProject: 'Business / project',
      location: 'Location',
      whatItDoes: 'What it does / offers',
      onlinePresence: 'Online presence',
      website: 'Website',
      socialLinks: 'Social links',
      admiredSites: 'Admired sites',
      hasLogo: 'Has logo',
      logoUpload: 'Logo upload',
      hasPhotos: 'Has photos',
      photoUploads: 'Photo uploads',
      needsPhotosTaken: 'Needs photos taken',
      visitorActions: 'What people should be able to do',
      howDeveloped: 'How developed',
      fromPricingSelection: '(from pricing selection)',
      designFeel: 'Design feel',
      colorPalette: 'Color palette',
      colorNotes: 'Color notes',
      steerClearOf: 'Things to steer clear of',
      anythingElse: 'Anything else about the business',
      noPreference: 'No preference — you decide',
      matchLogo: 'Match colors from my logo',
      notAnswered: '(not answered)',
      none: '(none)',
    },
  },
  plans: {
    contactForPricing: 'Contact for pricing',
    basicSupport: {
      description:
        'Ongoing fixes and help for your site when something breaks or needs a small update.',
    },
    packageDetailLabels: {
      'how-big': 'How big is the site',
      'looks-like': 'What it looks like',
      'customers-use': 'How customers use it',
      'you-manage': 'How you manage it',
      'help-after': 'Help after it’s live',
    },
    supportDetailLabels: {
      'whats-included': 'What’s included',
      'fix-or-update': 'What we fix or update',
      'how-contact': 'How you contact us',
      'who-for': 'Who it’s for',
    },
    support: {
      support: {
        name: 'Basic',
        summary:
          'Monthly help after your site is live — we fix things and make small updates for you.',
        whyItHelps:
          'Hours change, photos need swapping, and sometimes a page stops working. We take care of that so you don’t have to figure it out alone.',
        details: [
          {
            id: 'whats-included',
            label: 'What’s included',
            items: [
              'Help during normal business hours',
              'We keep your live website working after it goes online',
              'Cancel anytime — when you cancel, you are responsible for deploying your site to the internet',
            ],
          },
          {
            id: 'fix-or-update',
            label: 'What we fix or update',
            items: [
              'Pages, forms, or buttons that stop working',
              'Small changes like hours, photos, or wording',
              'Plain answers when you’re not sure how to change something',
            ],
          },
          {
            id: 'how-contact',
            label: 'How you contact us',
            items: [
              'Email',
              'Phone',
              'We reply during business hours (Monday–Friday, 8 a.m.–4 p.m. EST)',
            ],
          },
          {
            id: 'who-for',
            label: 'Who it’s for',
            items: [
              'Owners who don’t want to handle the tech themselves',
              'Works with any website package',
            ],
          },
          {
            id: 'looks-like',
            label: 'Not included',
            items: [
              'Not included: Overnight coverage — help after 4 p.m. EST or on weekends',
              'Not included: Priority queue — requests wait in the regular line',
            ],
          },
          {
            id: 'help-after',
            label: 'Who it’s for',
            items: [
              'Owners who don’t want to handle the tech themselves. Works with any website package.',
            ],
          },
        ],
        features: [
          'Help during normal business hours',
          'Fixes when something breaks',
          'Small updates',
        ],
        included: [
          {
            icon: 'live-hosting',
            term: 'Keep the site live',
            description:
              'We host the site and keep it working after it goes online',
          },
          {
            icon: 'hours-help',
            term: 'Business-hours help',
            description:
              'We reply during business hours (Monday–Friday, 8 a.m.–4 p.m. EST)',
          },
          {
            icon: 'small-updates',
            term: 'Small updates',
            description: 'Hours, photos, wording, or a page that stops working',
          },
          {
            icon: 'email-phone',
            term: 'Email & phone',
            description: 'Reach us by email or phone during business hours',
          },
          {
            icon: 'cancel-anytime',
            term: 'Cancel anytime',
            description:
              'When you cancel, you are responsible for deploying your site to the internet',
          },
        ],
        cta: 'Ask about Basic',
      },
      'business-support': {
        name: 'Business',
        summary:
          'Priority help during business hours — faster replies and extra attention when something needs more work.',
        whyItHelps:
          'When you need answers sooner than Basic, we put your site first during the workday so small problems don’t sit.',
        details: [
          {
            id: 'whats-included',
            label: 'What’s included',
            items: [
              'Everything in Basic',
              'Priority during business hours — your requests go first',
              'Faster replies when something goes wrong',
              'Cancel anytime — when you cancel, you are responsible for deploying your site to the internet',
            ],
          },
          {
            id: 'fix-or-update',
            label: 'What we fix or update',
            items: [
              'Pages, forms, or buttons that stop working',
              'Small and medium updates like hours, photos, wording, or a new section',
              'Extra help when a problem needs more work',
            ],
          },
          {
            id: 'how-contact',
            label: 'How you contact us',
            items: [
              'Email',
              'Phone',
              'We reply first during business hours (Monday–Friday, 8 a.m.–4 p.m. EST)',
            ],
          },
          {
            id: 'who-for',
            label: 'Who it’s for',
            items: [
              'Owners who want quicker help without overnight coverage',
              'Works with any website package',
            ],
          },
          {
            id: 'looks-like',
            label: 'Not included',
            items: [
              'Not included: Overnight coverage — help after 4 p.m. EST or on weekends',
            ],
          },
          {
            id: 'help-after',
            label: 'Who it’s for',
            items: [
              'Owners who want quicker help without overnight coverage. Works with any website package.',
            ],
          },
        ],
        features: [
          'Priority during business hours',
          'Faster replies',
          'Small and medium updates',
        ],
        included: [
          {
            icon: 'priority-hours',
            term: 'Priority in business hours',
            description:
              'Your requests go first during the workday so small problems don’t sit',
          },
          {
            icon: 'medium-updates',
            term: 'Small and medium updates',
            description:
              'Hours, photos, wording, or a new section when you need a little more than a tweak',
          },
          {
            icon: 'faster-replies',
            term: 'Faster replies',
            description: 'We reply first when something goes wrong',
          },
        ],
        cta: 'Ask about Business',
      },
      ultimate: {
        name: 'Pro',
        summary: 'Help any time of day or night when a down website means lost sales.',
        whyItHelps:
          'If your site goes down overnight and you can’t wait until morning, someone is available around the clock.',
        details: [
          {
            id: 'whats-included',
            label: 'What’s included',
            items: [
              'Everything in Business',
              'Help any hour of the day or night',
              'Your site gets first attention when something goes wrong',
              'Cancel anytime — when you cancel, you are responsible for deploying your site to the internet',
            ],
          },
          {
            id: 'fix-or-update',
            label: 'What we fix or update',
            items: [
              'Website down or major problems, day or night',
              'Faster fixes and updates',
              'Extra help when a problem needs more work',
            ],
          },
          {
            id: 'how-contact',
            label: 'How you contact us',
            items: [
              'Email',
              'Phone',
              'We respond when you call anytime',
            ],
          },
          {
            id: 'who-for',
            label: 'Who it’s for',
            items: [
              'Busy shops that take orders online',
              'Anyone who loses money when the website is down',
            ],
          },
          {
            id: 'looks-like',
            label: 'Not included',
            items: [],
          },
          {
            id: 'help-after',
            label: 'Who it’s for',
            items: [
              'Busy shops that take orders online — anyone who loses money when the website is down.',
            ],
          },
        ],
        features: [
          'Help day or night',
          'First in line for fixes',
          'Faster replies',
        ],
        included: [
          {
            icon: 'anytime-help',
            term: 'Help any hour',
            description:
              'Someone is available around the clock if the site goes down overnight',
          },
          {
            icon: 'first-in-line',
            term: 'First in line',
            description:
              'Your site gets first attention when something goes wrong',
          },
          {
            icon: 'overnight-fixes',
            term: 'Down-site coverage',
            description: 'Website down or major problems, day or night',
          },
        ],
        cta: 'Ask about Pro',
      },
    },
    website: {
      starter: {
        name: 'Starter',
        shortSummary: 'One page. Everything you need to get found and get contacted.',
        summary:
          'One page. Everything you need to get found and get contacted.',
        details: [
          {
            id: 'how-big',
            label: 'How big is the site',
            items: [
              'One page — your whole site lives on a single scrolling page, no menu to click through',
            ],
          },
          {
            id: 'looks-like',
            label: 'What it looks like',
            items: [],
            segments: [
              {
                items: [
                  'Original design — the build is derived from your design preferences, not from a template like Squarespace, Wix, or other generic website builders',
                  'Responsive — looks right on a phone, a tablet, and a desktop',
                  'Speed & security — loads fast and protected against common threats',
                  'On-page SEO — structured so Google can find and understand your business/project',
                  'Content as provided — I build with the words and photos you give me; I’ll flag anything that reads like an error, but I won’t rewrite your voice',
                  'Contact & credibility basics — hours, location, contact info, and any testimonials or past work you provide, built in from the start',
                  'Not included: Plugins — extra tools beyond a standard website, like online booking (Calendly) or payments (PayPal)',
                  'Not included: Limited branded marketing — a starter logo, colors, and matching look on the site'
                ],
              },
            ],
          },
          {
            id: 'customers-use',
            label: 'How customers use it',
            items: ['Get found and get contacted'],
          },
          {
            id: 'you-manage',
            label: 'How you manage it',
            items: [
              '1 revision round — one round of edits after your first look',
            ],
          },
          {
            id: 'help-after',
            label: 'Help after it’s live',
            items: [
              'Build only — add a [hosting plan](#hosting-support) from $19/month.',
            ],
          },
        ],
        features: ['1 page', 'Original design', 'On-page SEO'],
        checklist: ['1 page'],
        included: [
          {
            icon: 'one-page',
            term: 'One page',
            description:
              'Your whole site lives on a single scrolling page, no menu to click through',
          },
          {
            icon: 'original-design',
            term: 'Original design',
            description:
              'The build is derived from your design preferences, not from a template like Squarespace, Wix, or other generic website builders.',
          },
          {
            icon: 'responsive',
            term: 'Responsive',
            description: 'Looks right on a phone, a tablet, and a desktop',
          },
          {
            icon: 'speed-security',
            term: 'Speed & security',
            description: 'Loads fast and protected against common threats',
          },
          {
            icon: 'on-page-seo',
            term: 'On-page SEO',
            description:
              'Structured so Google can find and understand your business/project'
          },
          {
            icon: 'content-as-provided',
            term: 'Content as provided',
            description:
              'I build with the words and photos you give me; I’ll flag anything that reads like an error, but I won’t rewrite your voice',
          },
          {
            icon: 'contact-credibility',
            term: 'Contact & credibility basics',
            description:
              'Hours, location, contact info, and any testimonials or past work you provide, built in from the start',
          },
          {
            icon: 'revision-1',
            term: '1 revision round',
            description: 'One round of edits after your first look',
          },
        ],
        cta: 'More',
      },
      basic: {
        name: 'Basic',
        shortSummary: 'Everything in Starter, plus a second page and a simple visitor count.',
        summary: 'Everything in Starter, plus a second page and a simple visitor count.',
        details: [
          {
            id: 'how-big',
            label: 'How big is the site',
            items: [
              '1–2 pages — separate your story from your offer instead of one long scroll',
            ],
          },
          {
            id: 'looks-like',
            label: 'What it looks like',
            items: [],
            segments: [
              {
                items: [
                  'Not included: Plugins — extra tools beyond a standard website, like online booking (Calendly) or payments (PayPal)',
                  'Not included: Limited branded marketing — a starter logo, colors, and matching look on the site'
                ],
              },
            ],
          },
          {
            id: 'customers-use',
            label: 'How customers use it',
            items: ['Read your story and your offer on separate pages'],
          },
          {
            id: 'you-manage',
            label: 'How you manage it',
            items: [
              '1 revision round — one round of edits after your first look',
            ],
          },
          {
            id: 'help-after',
            label: 'Help after it’s live',
            items: [
              'Build only — add a [hosting plan](#hosting-support) from $19/month.',
            ],
          },
        ],
        features: ['1–2 pages', 'Visitor counts'],
        checklist: ['1–2 pages', 'Visitor counts'],
        included: [
          {
            icon: 'speed-security',
            term: 'Speed & security',
            description:
              'Loads fast, with HTTPS so coffee-shop Wi-Fi can’t snoop a contact form and browsers show a padlock, not “Not Secure.”',
          },
          {
            icon: 'pages-1-2',
            term: '1–2 pages',
            description:
              'Separate your story from your offer instead of one long scroll',
          },
          {
            icon: 'visitor-counts',
            term: 'Visitor counts',
            description:
              'A simple count of how many people visit, so you can see if the site is working',
          },
        ],
        cta: 'More',
      },
      // Former Pro tier — renamed Business
      business: {
        name: 'Business',
        shortSummary:
          'Everything in Basic, plus the extra pages and polish a bigger site needs.',
        summary:
          'Everything in Basic, plus the extra pages and polish a bigger site needs.',
        details: [
          {
            id: 'how-big',
            label: 'How big is the site',
            items: [
              '3–5 pages — enough room for a full service breakdown, case studies, or a resource section',
            ],
          },
          {
            id: 'looks-like',
            label: 'What it looks like',
            items: [],
            segments: [
              {
                items: [
                  'Search visibility check — making sure your business/project shows up correctly in local search results and Google Maps',
                  'Limited branded marketing — logo, colors, a matching look on the site, and how it looks when someone shares the link (starter kit; full social, print, and branded links are in Pro)',
                  'Not included: Plugins — extra tools beyond a standard website, like online booking (Calendly) or payments (PayPal)',
                ],
              },
            ],
          },
          {
            id: 'customers-use',
            label: 'How customers use it',
            items: ['Compare services, see proof, and take the next step'],
          },
          {
            id: 'you-manage',
            label: 'How you manage it',
            items: [
              '2 revision rounds — an extra round included at no charge',
            ],
          },
          {
            id: 'help-after',
            label: 'Help after it’s live',
            items: [
              'Build only — add a [hosting plan](#hosting-support) from $19/month, or Business support at $39/month.',
            ],
          },
        ],
        features: ['3–5 pages', 'Search visibility'],
        checklist: ['3–5 pages', 'Search visibility'],
        included: [
          {
            icon: 'speed-security',
            term: 'Speed & security',
            description:
              'Loads fast over HTTPS, so a coffee-shop Wi-Fi snoop can’t read a contact form. Encrypted connections are forced, browsers show the padlock, and there’s no leftover template-plugin junk sitting around to get exploited.',
          },
          {
            icon: 'pages-3-5',
            term: '3–5 pages',
            description:
              'Enough room for a full service breakdown, case studies, or a resource section',
          },
          {
            icon: 'search-visibility',
            term: 'Search visibility check',
            description:
              'Making sure your business/project shows up correctly in local search results and Google Maps'
          },
          {
            icon: 'branded-marketing',
            term: 'Limited branded marketing',
            example: 'Like a matching logo, colors, a basic Facebook look, and a social sharing preview',
            description:
              'A starter kit for the site — logo and colors so the pages look like one business/project, plus how the site looks when someone links it. Full social, print, and branded links are in Pro.'
          },
          {
            icon: 'revision-2',
            term: '2 revision rounds',
            description: 'An extra round included at no charge',
          },
        ],
        cta: 'More',
      },
      // Former Business tier — renamed Pro
      pro: {
        name: 'Pro',
        shortSummary:
          'Everything in Business, plus the extra features a larger site needs to run.',
        summary:
          'Everything in Business, plus the extra features a larger site needs to run.',
        details: [
          {
            id: 'how-big',
            label: 'How big is the site',
            items: [
              'A larger site — extra features a bigger site needs to run',
            ],
          },
          {
            id: 'looks-like',
            label: 'What it looks like',
            items: [],
            segments: [
              {
                items: [
                  'Admin page — a private dashboard to manage your own content without touching code',
                  'Extra functionality — booking calendars, quote calculators, member logins, or other built-in tools your site needs to work the way your business/project does',
                  'Site search — a search bar so visitors can find what they need on a larger site',
                  'Full branded marketing — we make your logo, brand the text links, and match Facebook, socials, Google, and print — including how the site looks when someone shares the link'
                ],
              },
            ],
          },
          {
            id: 'customers-use',
            label: 'How customers use it',
            items: ['Use the built-in tools your site needs to run'],
          },
          {
            id: 'you-manage',
            label: 'How you manage it',
            items: [
              'Walkthrough — we sit down with you in person and walk through every detail of the finished product until you’re comfortable using your custom tool',
              'Priority build — your project starts at the front of the queue',
              '3 revision rounds',
            ],
          },
          {
            id: 'help-after',
            label: 'Help after it’s live',
            items: [
              'Build only — add a [hosting plan](#hosting-support) from $19/month, or Pro support at $99/month.',
            ],
          },
        ],
        features: ['Admin page', 'Extra functionality', 'Site search'],
        checklist: ['Admin page', 'Extra functionality', 'Site search'],
        included: [
          {
            icon: 'speed-security',
            term: 'Speed & security',
            description:
              'Ultimate hardening from the first request: TLS everywhere, forced HTTPS so the padlock never drops, production secrets kept off the page, and a clean custom build with no leftover template attack surface. Visitors get a fast, locked site; leftover builder junk doesn’t get a foothold.',
          },
          {
            icon: 'original-design',
            term: 'Original design',
            description:
              'Every aspect of every design decision is informed by your preferences. No stone is left unturned.',
          },
          {
            icon: 'branded-marketing',
            term: 'Full branded marketing',
            example: 'Like your logo, branded links, matching look on every social, and a social sharing preview',
            description:
              'The full treatment — we make your logo, brand the links, and match Facebook, socials, Google, and print so you look like the same business/project everywhere, including how the site looks when someone shares the link.',
            emphasis: true,
          },
          {
            icon: 'larger-site',
            term: 'Larger site',
            description:
              'Extra pages and the features a bigger site needs to run',
          },
          {
            icon: 'admin-page',
            term: 'Admin page',
            description:
              'A private dashboard to manage your own content without touching code',
          },
          {
            icon: 'extra-functionality',
            term: 'Extra functionality',
            description:
              'Booking calendars, quote calculators, member logins, or other built-in tools your site needs to work the way your business/project does'
          },
          {
            icon: 'site-search',
            term: 'Site search',
            description:
              'A search bar so visitors can find what they need on a larger site',
          },
          {
            icon: 'walkthrough',
            term: 'Walkthrough',
            description:
              'We sit down with you in person and walk through every detail of the finished product until you’re comfortable using your custom tool.',
          },
          {
            icon: 'priority-build',
            term: 'Priority build',
            description: 'Your project starts at the front of the queue',
          },
          {
            icon: 'revision-3',
            term: '3 revision rounds',
            description: 'Three rounds of edits after your first look',
          },
        ],
        cta: 'More',
      },
    },
  },
  projects: {
    'caramel-jo': {
      caption: 'A warm bakery site that feels at home on a phone.',
      description:
        'Custom website for a bakery brand — clear story, product presence, and a layout that stays friendly on small screens.',
      features: [
        'Mobile-first layout',
        'Brand-forward homepage',
        'Product gallery & cart',
        'Simple email ordering system',
        'Bilingual EN / ES',
      ],
      packageLabel: 'Business package · $999',
      galleryLabels: {
        '/images/caramel-jo/homepage.jpg': 'Homepage',
        '/images/caramel-jo/menu.jpg': 'Menu',
        '/images/caramel-jo/product-berry.jpg': 'Product — berry tart',
        '/images/caramel-jo/product-key-lime.jpg': 'Product — key lime',
      },
    },
    'mi-gente': {
      caption: 'A friendly market presence with room to grow.',
      description:
        'Neighborhood market site built for clarity — who they are, what they offer, and an easy path for customers to engage.',
      features: [
        'Business info, hours & locations',
        'Product photo gallery',
        'Bilingual EN / ES',
        'Call, directions & social links',
      ],
      packageLabel: 'Business package · $999',
      galleryLabels: {
        '/images/mi-gente/homepage.jpg': 'Homepage',
        '/images/mi-gente/menu.jpg': 'Menu & hours',
        '/images/mi-gente/contact.png': 'Contact',
        '/images/mi-gente/about.jpg': 'About',
        '/images/mi-gente/products.jpg': 'Products',
      },
    },
  },
  api: {
    contact: {
      invalidBody: 'Invalid request body.',
      nameRequired: 'Please enter your name.',
      emailInvalid: 'Please enter a valid email.',
      phoneInvalid: 'Please enter a valid phone number.',
      messageEmpty: 'Please enter a message.',
      messageShort: 'Please add a bit more detail to your message.',
      success: 'Thanks! We will respond soon.',
      clientEmailSubject: 'We received your message',
      clientEmailTitle: 'Thanks — we got your message',
      clientEmailIntro:
        'Here’s a copy of what you sent. We’ll review it and reply within about 48 hours.',
      clientEmailSignoff: '— Applicreations',
      clientEmailLinkLabel: 'Back to Applicreations',
      emailQuestions: 'Questions? Reply to this email or write solutions@applicreations.com.',
      ownerEmailSubject: 'Contact form: {name}',
      ownerEmailTitle: 'New contact form message',
      ownerEmailIntro: 'Someone submitted the contact form on Applicreations.',
    },
    introspect: {
      invalidBody: 'Invalid request body.',
      nameRequired: 'Please enter your name.',
      emailInvalid: 'Please enter a valid email.',
      phoneInvalid: 'Please enter a full 10-digit phone number.',
      success: 'Thanks! We received your Introspect answers.',
      clientEmailSubject: 'We received your Introspect answers',
      clientEmailTitle: 'Thanks — we got your Introspect',
      clientEmailIntro:
        'Below is everything you shared in Introspect. We’ll review your answers and follow up soon.',
      clientEmailRecommendedLabel: 'Suggested package',
      clientEmailPricingLabel: 'Your pricing selection',
      clientEmailSectionRecommendation: 'Our suggestion',
      clientEmailSectionContact: 'You & your business',
      clientEmailSectionOnline: 'Online presence',
      clientEmailSectionAssets: 'Logo & photos',
      clientEmailSectionDirection: 'Site direction',
      clientEmailSignoff: '— Applicreations',
      clientEmailLinkLabel: 'Continue on Applicreations',
      emailQuestions: 'Questions? Reply to this email or write solutions@applicreations.com.',
      ownerEmailSubject: 'Introspect: {business} — {plan}',
      ownerEmailTitle: 'New Introspect submission',
      ownerEmailIntro: 'A new questionnaire came in for {business}.',
    },
    pricingSelection: {
      invalidBody: 'Invalid request body.',
      emailInvalid: 'Please enter a valid email.',
      selectionRequired: 'Please select a package or support plan first.',
      success: 'Sent! Check your inbox for your selection summary.',
      emailQuestions: 'Questions? Reply to this email or write solutions@applicreations.com.',
      ownerEmailSubject: 'Pricing selection emailed to {email}',
      ownerEmailTitle: 'Pricing selection sent',
      ownerEmailIntro: 'A visitor emailed this selection to {email}.',
    },
  },
}
