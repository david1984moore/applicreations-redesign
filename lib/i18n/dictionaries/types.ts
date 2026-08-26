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
  | 'welcomeGreeting'
  | 'welcomeContinue'
  | 'redesignWelcomeContinue'
  | 'redesignWelcomeHeading'
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
  | 'step2SubtitleRedesign'
  | 'businessNameLabel'
  | 'businessNamePlaceholder'
  | 'aboutBusinessLabel'
  | 'aboutBusinessPlaceholder'
  | 'locationLabel'
  | 'locationCityLabel'
  | 'locationCityPlaceholder'
  | 'locationStateLabel'
  | 'locationStatePlaceholder'
  | 'locationCountryLabel'
  | 'locationNoMatches'
  | 'step3Title'
  | 'step3Subtitle'
  | 'step3TitleRedesign'
  | 'step3SubtitleRedesign'
  | 'hasOnlineLabel'
  | 'hasOnlineYes'
  | 'chooseOne'
  | 'websiteUrlLabel'
  | 'websiteUrlLabelHasSite'
  | 'websiteUrlLabelRedesign'
  | 'websiteUrlRequired'
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
  | 'step4SubtitleRedesign'
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
  | 'keepChangeTitle'
  | 'keepChangeSubtitle'
  | 'keepHeading'
  | 'changeHeading'
  | 'keepItemsError'
  | 'changePrioritiesError'
  | 'keepChangeNotesLabel'
  | 'keepChangeNotesPlaceholder'
  | 'step5Title'
  | 'step5Hint'
  | 'step5TitleRedesign'
  | 'step5HintRedesign'
  | 'visitorActionsError'
  | 'step6Title'
  | 'step6Subtitle'
  | 'step6SubtitleRedesign'
  | 'siteDepthError'
  | 'step7Title'
  | 'step7Subtitle'
  | 'designFeelHeading'
  | 'colorsHeading'
  | 'noPreference'
  | 'matchLogoColors'
  | 'keepCurrentLook'
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
  | 'step9PlaceholderRedesign'
  | 'continue'
  | 'continueToReview'
  | 'submitIntrospect'
  | 'reviewHeading'
  | 'reviewSubtitle'
  | 'reviewEdit'
  | 'reviewDone'
  | 'reviewAboutYou'
  | 'reviewName'
  | 'reviewEmail'
  | 'reviewPhone'
  | 'reviewYourBusiness'
  | 'reviewBusinessProject'
  | 'reviewLocation'
  | 'reviewWhatYouDo'
  | 'reviewOnlinePresence'
  | 'reviewCurrentWebsite'
  | 'reviewAlreadyOnline'
  | 'reviewWebsite'
  | 'reviewKeepChange'
  | 'reviewKeep'
  | 'reviewChange'
  | 'reviewCurrentSiteNotes'
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
  | 'successThanks'
  | 'successHeading'
  | 'successHeadingRest'
  | 'successHeadingRedesign'
  | 'successHeadingRestRedesign'
  | 'successNextHeading'
  | 'successNext1'
  | 'successNext1Redesign'
  | 'successNext2'
  | 'successClosing'
  | 'successClosingRedesign'
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
    redesignTitle: string
    redesignDescription: string
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
    popularPackage: string
    hostingFrom: string
    howItWorks: string
    threeSteps: string
    /** Finale line after the intro “3” — English starts at “simple”. */
    threeStepsRest: string
    beginIntrospect: string
    getFreePreview: string
    seeMore: string
    steps: {
      introspect: { label: string; detail: string }
      livePreview: {
        label: string
        detail: string
        building: string
        buildingPreview: string
        actuallyWorks: string
        phoneSuffix: string
      }
      workingWebsite: {
        label: string
        recapLabel: string
        detail: string
        review: string
        revise: string
        justRight: string
        justRightTune: string
        justRightFinally: string
        goLive: string
        suffix: string
      }
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
    getStarted: string
    contact: string
  }
  pricingPage: {
    title: string
    websitePlansHeading: string
    oneTime: string
    whatsIncluded: string
    howYouWork: string
    afterLaunch: string
    visitorsCan: string
    baselineNote: string
    mostPopular: string
    seeFullComparison: string
    hideComparison: string
    comparison: {
      heading: string
      featureCol: string
      includedInEvery: string
      footer: string
      includedAria: string
      notIncludedAria: string
      hintAria: string
      sections: {
        included: string
        build: string
        visibility: string
        strategy: string
        customTools: string
      }
      rows: {
        originalDesign: string
        responsive: string
        speedSecurity: string
        onPageSeo: string
        contentAsProvided: string
        contactInfo: string
        pages: string
        revisionRounds: string
        extraRevision: string
        walkthrough: string
        brandedMarketing: string
        localSeo: string
        visitorCounts: string
        adminPage: string
        extraFunctionality: string
        siteSearch: string
        priorityBuild: string
      }
      hints: {
        localSeo: string
        visitorCounts: string
        adminPage: string
        siteSearch: string
        brandedMarketing: string
        extraFunctionality: string
        priorityBuild: string
        extraRevision: string
      }
      values: {
        pagesStarter: string
        pagesBasic: string
        pagesBusiness: string
        pagesPro: string
        revisionsStarter: string
        revisionsBasic: string
        revisionsBusiness: string
        revisionsPro: string
        brandedMarketingBusiness: string
        brandedMarketingPro: string
        extraRevisionIncluded: string
      }
    }
    /** Footnote in expanded “what’s included” for website package prices */
    startingPriceNote: string
    highlightsAria: string
    hostingSupportHeading: string
    hostingSupportLead: string
    hostingWhoFor: string
    mixMatchHeading: string
    /** Quiet prompt under the mix-and-match preview — not a full section. */
    redesignPrompt: string
    redesignHint: string
    redesignCta: string
    mixMatchLead: string
    /** Mobile — same sentence, “tap” instead of “click”. */
    mixMatchLeadTap: string
    mixMatchWebsiteHeading: string
    mixMatchHostingHeading: string
    mixMatchEmptyPackage: string
    mixMatchEmptyHosting: string
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
    goingLiveStep2CancelBuildHeading: string
    goingLiveStep2BulletCancelBuild: string
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
    emptySelectionTap: string
    expandDetails: string
    collapseDetails: string
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
    locationCityEmpty: string
    locationCityShort: string
    locationStateEmpty: string
    locationCountryEmpty: string
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
    visitorActions: Record<
      | 'call-you'
      | 'email-you'
      | 'see-hours'
      | 'find-you'
      | 'get-directions'
      | 'see-photos'
      | 'read-about-you'
      | 'see-a-menu'
      | 'see-prices'
      | 'see-what-you-offer'
      | 'see-events'
      | 'see-a-calendar'
      | 'browse-a-gallery'
      | 'watch-a-video'
      | 'listen'
      | 'read-updates'
      | 'read-stories'
      | 'meet-the-people'
      | 'see-a-portfolio'
      | 'download-a-file'
      | 'ask-a-question'
      | 'fill-out-a-form'
      | 'join-email-list'
      | 'leave-a-review'
      | 'rsvp'
      | 'volunteer'
      | 'share'
      | 'book-a-visit'
      | 'make-a-reservation'
      | 'schedule-an-appointment'
      | 'request-a-quote'
      | 'donate'
      | 'buy-something'
      | 'place-an-order'
      | 'pay-online'
      | 'create-an-account'
      | 'apply'
      | 'search-the-site'
      | 'chat'
      | 'sign-up-for-a-class',
      string
    >
    keepItems: Record<
      | 'logo'
      | 'colors'
      | 'photos'
      | 'words'
      | 'pages'
      | 'contact'
      | 'start-fresh',
      string
    >
    changePriorities: Record<
      | 'looks-old'
      | 'hard-on-phone'
      | 'hard-to-find'
      | 'easier-to-update'
      | 'new-things'
      | 'words-off'
      | 'hard-to-search'
      | 'slow-or-broken',
      string
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
    contactForPricing: string
    basicSupport: { description: string }
    packageDetailLabels: Record<string, string>
    supportDetailLabels: Record<string, string>
    support: Record<
      'support' | 'business-support' | 'ultimate',
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
        included: {
          icon: string
          term: string
          description: string
          example?: string
          emphasis?: boolean
        }[]
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
        checklist: string[]
        included: {
          icon: string
          term: string
          description: string
          example?: string
          emphasis?: boolean
        }[]
        includedLead?: string
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
      ownerEmailTitle: string
      ownerEmailIntro: string
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
      clientEmailSubjectRedesign: string
      clientEmailTitleRedesign: string
      clientEmailIntroRedesign: string
      clientEmailRecommendedLabel: string
      clientEmailPricingLabel: string
      clientEmailSectionRecommendation: string
      clientEmailSectionContact: string
      clientEmailSectionOnline: string
      clientEmailSectionKeepChange: string
      clientEmailSectionAssets: string
      clientEmailSectionDirection: string
      clientEmailSignoff: string
      clientEmailLinkLabel: string
      emailQuestions: string
      ownerEmailSubject: string
      ownerEmailTitle: string
      ownerEmailIntro: string
      ownerEmailSubjectRedesign: string
      ownerEmailTitleRedesign: string
      ownerEmailIntroRedesign: string
      websiteUrlRequired: string
      keepChangeRequired: string
    }
    pricingSelection: {
      invalidBody: string
      emailInvalid: string
      selectionRequired: string
      success: string
      emailQuestions: string
      ownerEmailSubject: string
      ownerEmailTitle: string
      ownerEmailIntro: string
    }
  }
}
