/**
 * Introspect flow UI strings. Keyed explicitly so dictionary lookups are
 * non-optional under noUncheckedIndexedAccess and both locales stay complete.
 */
export type IntrospectUiKey =
  | 'stepOf'
  | 'review'
  | 'exit'
  | 'back'
  | 'progressAria'
  | 'welcomeEyebrow'
  | 'welcomeHeading'
  | 'whatToExpect'
  | 'expect1'
  | 'expect2'
  | 'expect3'
  | 'getStarted'
  | 'step1Title'
  | 'nameLabel'
  | 'namePlaceholder'
  | 'emailLabel'
  | 'emailPlaceholder'
  | 'phoneLabel'
  | 'phoneHint'
  | 'phonePlaceholder'
  | 'phoneFullError'
  | 'phoneKeepTyping'
  | 'yesContinue'
  | 'step2Title'
  | 'businessNameLabel'
  | 'businessNamePlaceholder'
  | 'aboutBusinessLabel'
  | 'aboutBusinessPlaceholder'
  | 'locationLabel'
  | 'locationPlaceholder'
  | 'step3Title'
  | 'step3Subtitle'
  | 'hasOnlineLabel'
  | 'chooseOne'
  | 'websiteUrlLabel'
  | 'websiteUrlPlaceholder'
  | 'socialLinksLabel'
  | 'socialLinksHint'
  | 'addSocialLink'
  | 'admiredLabel'
  | 'admiredHint'
  | 'addAdmiredSite'
  | 'linkPlaceholder'
  | 'removeItem'
  | 'removeItemAria'
  | 'step4Title'
  | 'step4Subtitle'
  | 'hasLogoLabel'
  | 'uploadLogoLabel'
  | 'uploadLogoHint'
  | 'hasPhotosLabel'
  | 'uploadPhotosLabel'
  | 'uploadPhotosHint'
  | 'needsPhotosLabel'
  | 'logoTooLarge'
  | 'photoTooLarge'
  | 'photoLimit'
  | 'chooseLogoFile'
  | 'replaceLogo'
  | 'choosePictures'
  | 'addMorePictures'
  | 'removeFileAria'
  | 'uploadSecurityNotice'
  | 'step5Title'
  | 'step5Hint'
  | 'addAction'
  | 'actionPlaceholder'
  | 'visitorActionsError'
  | 'step6Title'
  | 'step6Subtitle'
  | 'siteDepthError'
  | 'step7Title'
  | 'step7Subtitle'
  | 'designFeelHeading'
  | 'colorsHeading'
  | 'noPreference'
  | 'matchLogoColors'
  | 'designFeelsError'
  | 'colorPalettesError'
  | 'colorNotesError'
  | 'colorNotesLabelCustom'
  | 'colorNotesLabelOptional'
  | 'colorNotesHint'
  | 'colorNotesPlaceholder'
  | 'step8Title'
  | 'step8Aria'
  | 'step8Placeholder'
  | 'step9Title'
  | 'step9Aria'
  | 'step9Placeholder'
  | 'continue'
  | 'continueToReview'
  | 'submitIntrospect'
  | 'reviewHeading'
  | 'reviewSubtitle'
  | 'reviewAboutYou'
  | 'reviewName'
  | 'reviewEmail'
  | 'reviewPhone'
  | 'reviewYourBusiness'
  | 'reviewBusinessProject'
  | 'reviewLocation'
  | 'reviewWhatYouDo'
  | 'reviewOnlinePresence'
  | 'reviewAlreadyOnline'
  | 'reviewWebsite'
  | 'reviewSocialLinks'
  | 'reviewSitesAdmire'
  | 'reviewLogoPhotos'
  | 'reviewHasLogo'
  | 'reviewLogoFile'
  | 'reviewHasPhotos'
  | 'reviewPhotoFiles'
  | 'reviewNeedPhotos'
  | 'reviewVisitorsShouldDo'
  | 'reviewActions'
  | 'reviewSiteScope'
  | 'reviewHowDeveloped'
  | 'reviewDesignColors'
  | 'reviewDesignFeel'
  | 'reviewColors'
  | 'reviewColorNotes'
  | 'reviewSteerClear'
  | 'reviewAvoid'
  | 'reviewAnythingElse'
  | 'reviewNotes'
  | 'successEyebrow'
  | 'successHeading'
  | 'successNextHeading'
  | 'successNext1'
  | 'successNext2'
  | 'successNext3'
  | 'successNext4'
  | 'successFootnote'
  | 'successHomeAria'
  | 'errorGeneric'
  | 'errorTryEmail'

export type Dictionary = {
  brand: { name: string }
  meta: {
    homeTitle: string
    homeDescription: string
    aboutTitle: string
    aboutDescription: string
    contactTitle: string
    contactDescription: string
    introspectTitle: string
    introspectDescription: string
    pricingTitle: string
    pricingDescription: string
    demosTitle: string
    demosDescription: string
  }
  nav: {
    introspect: string
    projects: string
    pricing: string
    about: string
    contact: string
    homeAria: string
    languageToggleAria: string
    languageEn: string
    languageEs: string
  }
  landing: {
    tagline: string
    websitePricing: string
    fullPricingDetails: string
    /** Landing-only badge on the Basic package card */
    popularPackage: string
    hostingFrom: string
    howItWorks: string
    threeSteps: string
    beginIntrospect: string
    steps: {
      introspect: { label: string; detail: string }
      livePreview: { label: string; detail: string }
      workingWebsite: { label: string; detail: string }
    }
  }
  common: {
    more: string
    contact: string
    remove: string
    back: string
    cancel: string
    close: string
    optional: string
    notIncluded: string
    errorGeneric: string
    emptyDash: string
  }
  about: {
    eyebrow: string
    name: string
    role: string
    p1: string
    p2: string
    p3: string
  }
  contact: {
    eyebrow: string
    heading: string
    respondWithin: string
    nameLabel: string
    namePlaceholder: string
    phoneLabel: string
    phonePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    messageLabel: string
    messagePlaceholder: string
    sendMessage: string
    successHeading: string
    successBody: string
    sendAnother: string
    errorName: string
    errorEmail: string
    errorPhone: string
    errorMessageEmpty: string
    errorMessageShort: string
    errorGeneric: string
  }
  demos: {
    title: string
    intro: string
    chooseProjectAria: string
    screensAria: string
    showLabel: string
    showScreenOf: string
    resumeScreenshots: string
    pauseScreenshots: string
    imageAltScreenOf: string
    imageAltLabeled: string
    imageAltScreen: string
    pausedHint: string
    playHint: string
    openPhotoZoom: string
    closePhotoZoom: string
    zoomHint: string
    visit: string
    wantLikeThis: string
    startOrEmail: string
    beginIntrospect: string
    contact: string
  }
  pricingPage: {
    title: string
    websitePlansHeading: string
    oneTime: string
    whatsIncluded: string
    /** Footnote in expanded “what’s included” for website package prices */
    startingPriceNote: string
    highlightsAria: string
    exampleTotal: string
    hostingSupportHeading: string
    /** “When we host… on” + linked “Render” */
    hostingIntroBeforeRender: string
    hostingIntroRender: string
    goingLiveHeading: string
    goingLiveLead: string
    goingLiveStep1Title: string
    goingLiveStep1Bullet: string
    goingLiveStep2Title: string
    goingLiveStep2BulletPlan: string
    goingLiveStep2CancellationHeading: string
    goingLiveStep2BulletCancel: string
    goingLiveStep2CancelItems: string[]
    goingLiveStep2CancelClosing: string
    goingLiveStep2HandoffHeading: string
    goingLiveStep2HandoffBodyBefore: string
    goingLiveStep2HandoffFee: string
    goingLiveStep2HandoffBodyAfterFee: string
    goingLiveStep2HandoffFeeCovers: string
    goingLiveStep2HandoffRenderAccount: string
    goingLiveStep2HandoffSoleResponsibility: string
    goingLiveStep2HandoffExample: string
    buildHandoffName: string
    buildHandoffSelect: string
    buildHandoffSelected: string
    buildHandoffRemove: string
    buildHandoffConfirmTitle: string
    buildHandoffConfirmBody: string
    buildHandoffConfirmYes: string
    buildHandoffConfirmNo: string
    buildHandoffConfirmCloseAria: string
    buildHandoffResponsibilityHeading: string
    selectionEmailBuildHandoff: string
    selectionEmailBuildHandoffNote: string
    goingLiveStep3Title: string
    goingLiveNeedDomainBefore: string
    goingLiveNeedDomainNamecheap: string
    goingLiveNeedDomainAfter: string
    notSureHeading: string
    notSureBody: string
    introspectCta: string
    contactCta: string
    choose: string
    chosen: string
    chosenAria: string
    yourSelection: string
    packageSuffix: string
    oneTimeSuffix: string
    emptySelection: string
    estimatedTotal: string
    totalWithMonthly: string
    zeroDueToday: string
    previewTerms: string
    continueAfterPreviewBefore: string
    fiftyPercentOneTime: string
    fiftyPercentOneTimeWithAmount: string
    continueAfterPreviewAfter: string
    buildRealSiteBefore: string
    remainingFifty: string
    remainingFiftyWithAmount: string
    isDue: string
    alongWithFirstMonthly: string
    alongWithBuildHandoff: string
    monthlySupportStartsWith: string
    monthlySupportStartsWithout: string
    paymentScheduleHeading: string
    scheduleProjectStart: string
    scheduleProjectStartDetail: string
    scheduleGoLive: string
    scheduleGoLivePackageOnly: string
    scheduleGoLiveWithSupport: string
    scheduleGoLiveWithHandoff: string
    continueToIntrospect: string
    emailThisSelection: string
    yourEmailSrOnly: string
    emailPlaceholder: string
    emailInvalid: string
    emailSendFailed: string
    emailSendFailedNetwork: string
    emailSentFallback: string
    emailHint: string
    emailSent: string
    sendMySelection: string
    noPackage: string
    noMonthlySupport: string
    review: string
    selectionEmailSubject: string
    selectionEmailSubjectWithPlan: string
    selectionEmailSubjectWithSupport: string
    selectionEmailBodyHeader: string
    selectionEmailWebsitePackage: string
    selectionEmailWebsiteNone: string
    selectionEmailMonthlyCare: string
    selectionEmailMonthlyNone: string
    selectionEmailEstimatedTotal: string
    selectionEmailZeroDue: string
    selectionEmailEstimateNote: string
    selectionEmailSignoff: string
    selectionEmailWebsiteLabel: string
    selectionEmailMonthlyLabel: string
    selectionEmailTotalLabel: string
    selectionEmailLinkLabel: string
  }
  introspectUi: Record<IntrospectUiKey, string>
  introspectValidation: {
    liveEmailAt: string
    liveEmailComplete: string
    liveEmailValid: string
    businessName: string
    aboutBusinessEmpty: string
    aboutBusinessShort: string
    locationEmpty: string
    locationShort: string
    nameHardShort: string
    nameHardLetters: string
    nameSoftWarning: string
  }
  introspectOptions: {
    yesNoUnsure: { yes: string; no: string; unsure: string }
    siteDepth: Record<
      'basics' | 'a-few-pages' | 'fuller-site',
      { title: string; description: string }
    >
    designFeels: Record<
      | 'clean-simple'
      | 'warm-friendly'
      | 'bold-modern'
      | 'classic-calm'
      | 'playful-fun'
      | 'elegant-refined'
      | 'rustic-natural'
      | 'dark-dramatic'
      | 'airy-light'
      | 'editorial',
      { title: string; description: string }
    >
    colorPalettes: Record<
      | 'ocean-blues'
      | 'coastal-teal'
      | 'warm-earth'
      | 'sunset-coral'
      | 'fresh-greens'
      | 'soft-neutrals'
      | 'charcoal-gold'
      | 'soft-blush'
      | 'bright-cheerful'
      | 'deep-jewel'
      | 'custom',
      { title: string }
    >
    recommend: {
      choseOnPricing: string
      pro: string
      businessInteractive: string
      businessPages: string
      businessPhotos: string
      basic: string
    }
    emailLabels: Record<string, string>
  }
  plans: {
    basicSupport: { description: string }
    packageDetailLabels: Record<string, string>
    supportDetailLabels: Record<string, string>
    support: Record<
      'support' | 'ultimate',
      {
        name: string
        summary: string
        whyItHelps: string
        details: {
          id: string
          label: string
          lead?: string
          items: string[]
          segments?: { lead?: string; items: string[] }[]
        }[]
        features: string[]
        cta: string
      }
    >
    website: Record<
      'starter' | 'basic' | 'pro' | 'business',
      {
        name: string
        shortSummary: string
        summary: string
        details: {
          id: string
          label: string
          lead?: string
          items: string[]
          segments?: { lead?: string; items: string[] }[]
        }[]
        features: string[]
        cta: string
      }
    >
  }
  projects: Record<
    string,
    {
      caption: string
      description: string
      features: string[]
      packageLabel: string
      galleryLabels: Record<string, string>
    }
  >
  api: {
    contact: {
      invalidBody: string
      nameRequired: string
      emailInvalid: string
      phoneInvalid: string
      messageEmpty: string
      messageShort: string
      success: string
      clientEmailSubject: string
      clientEmailTitle: string
      clientEmailIntro: string
      clientEmailSignoff: string
      clientEmailLinkLabel: string
      emailQuestions: string
      ownerEmailSubject: string
    }
    introspect: {
      invalidBody: string
      nameRequired: string
      emailInvalid: string
      phoneInvalid: string
      success: string
      clientEmailSubject: string
      clientEmailTitle: string
      clientEmailIntro: string
      clientEmailRecommendedLabel: string
      clientEmailPricingLabel: string
      clientEmailSignoff: string
      clientEmailLinkLabel: string
      emailQuestions: string
      ownerEmailSubject: string
    }
    pricingSelection: {
      invalidBody: string
      emailInvalid: string
      selectionRequired: string
      success: string
      emailQuestions: string
    }
  }
}
