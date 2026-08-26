import type { Dictionary } from '@/lib/i18n/dictionaries/types'

export const es: Dictionary = {
  brand: { name: 'Applicreations' },
  meta: {
    homeTitle: 'Applicreations — Aplicaciones y sitios web a la medida',
    homeDescription:
      'Sitios web y aplicaciones a la medida para negocios locales, con un trato cercano. Precios simples. Pasos claros.',
    aboutTitle: 'Nosotros — Applicreations',
    aboutDescription:
      'Conoce a David Moore — fundador de Applicreations. Diseño web centrado en las personas para pequeños negocios locales.',
    contactTitle: 'Contacto — Applicreations',
    contactDescription:
      'Escríbenos sobre un sitio web o una aplicación a la medida. Déjanos tu nombre, correo y teléfono — te responderemos pronto.',
    introspectTitle: 'Introspección — Applicreations',
    introspectDescription:
      'Un cuestionario corto sobre tu negocio para que podamos crear una vista previa de tu sitio web a la medida.',
    redesignTitle: 'Introspección Rediseño — Applicreations',
    redesignDescription:
      'Un cuestionario corto sobre tu sitio actual para que podamos diseñar una vista previa del rediseño.',
    pricingTitle: 'Precios — Applicreations',
    pricingDescription:
      'Precios simples para sitios web a la medida — paquetes de pago único más hosting y soporte desde $19 al mes.',
    demosTitle: 'Proyectos — Applicreations',
    demosDescription:
      'Proyectos reales de clientes de Applicreations — mira cómo se ve cada sitio y qué incluyó.',
  },
  nav: {
    introspect: 'Introspección',
    projects: 'Proyectos',
    pricing: 'Precios',
    about: 'Nosotros',
    contact: 'Contacto',
    homeAria: 'Inicio de Applicreations',
    languageToggleAria: 'Cambiar idioma',
    languageEn: 'EN',
    languageEs: 'ES',
  },
  landing: {
    tagline: 'Aplicaciones y sitios web a la medida',
    websitePricing: 'Precios de sitios web',
    popularPackage: 'Popular',
    hostingFrom: '*Hosting y soporte desde {price}',
    howItWorks: 'Cómo funciona',
    threeSteps: 'Tres pasos simples para tener tu sitio web…',
    threeStepsRest: 'pasos simples para tener tu sitio web…',
    beginIntrospect: 'Comenzar la Introspección',
    getFreePreview: 'Comenzar',
    seeMore: 'Ver más',
    steps: {
      introspect: {
        label: 'Introspección',
        detail: 'Responde unas preguntas sobre tu proyecto.',
      },
      livePreview: {
        label: 'Sitio demo',
        detail: 'Tienes un sitio demo personalizado',
        building: '...nos ponemos a trabajar',
        buildingPreview: '...nos ponemos a trabajar',
        actuallyWorks: 'que de verdad funciona',
        phoneSuffix: 'Incluso en tu teléfono',
      },
      workingWebsite: {
        label: 'En vivo',
        recapLabel: 'Publicar',
        detail: 'Lo revisamos contigo, hacemos revisiones. La construcción está terminada y el sitio web real está entregado.',
        review: 'Lo revisamos',
        revise: 'Hacemos revisiones',
        justRight: 'Ajustando',
        justRightTune: 'Afinando',
        justRightFinally: 'cuando todo se ve bien...',
        goLive: 'salimos en vivo...',
        suffix: '¡Y ya estás en el negocio!',
      },
    },
  },
  common: {
    more: 'Más',
    contact: 'Contacto',
    remove: 'Quitar',
    back: 'Atrás',
    cancel: 'Cancelar',
    close: 'Cerrar',
    optional: 'Opcional',
    notIncluded: 'No incluido',
    errorGeneric: 'Algo salió mal. Por favor intenta de nuevo.',
    emptyDash: '—',
  },
  about: {
    eyebrow: 'Nosotros',
    name: 'David Moore',
    role: 'Fundador, Applicreations',
    p1: 'Llené muchos cuadernos de bocetos de pequeño — lápiz, tinta, carboncillo, acuarela. Más tarde, como chef, encontré un nuevo lienzo en el sabor y la presentación.',
    p2: 'Al enseñarme por mi cuenta diseño web y software en 2021, vi con qué frecuencia los pequeños negocios terminaban con sitios genéricos y de plantilla que no reflejaban quiénes eran. Quería construir algo distinto — trabajo moldeado por completo alrededor de las necesidades de cada cliente. Applicreations fue el resultado, lanzado en 2025.',
    p3: 'Los creadores de plantillas son rápidos y cada vez más automatizados, pero pueden hacerte sentir como un número. Applicreations no funciona así — cada proyecto es original, construido alrededor de tu negocio y de lo que lo hace distinto. Ayudo a echar raíces digitales únicas, y me encantaría ayudarte a echar las tuyas.',
  },
  contact: {
    eyebrow: 'Contacto',
    heading: 'Escríbenos',
    respondWithin: 'Normalmente respondemos en menos de 48 horas.',
    nameLabel: 'Nombre',
    namePlaceholder: 'Tu nombre',
    phoneLabel: 'Teléfono',
    phonePlaceholder: '(555) 555-5555',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'tu@negocio.com',
    messageLabel: 'Mensaje',
    messagePlaceholder: 'Cuéntanos sobre tu idea, tus metas o lo que tienes en mente…',
    sendMessage: 'Enviar mensaje',
    successHeading: 'Gracias por escribirnos',
    successBody: 'Recibimos tu mensaje y te responderemos pronto.',
    sendAnother: 'Enviar otro mensaje',
    errorName: 'Por favor escribe tu nombre',
    errorEmail: 'Por favor escribe un correo válido',
    errorPhone: 'Por favor escribe un número de teléfono válido',
    errorMessageEmpty: 'Por favor escribe un mensaje',
    errorMessageShort: 'Un poco más de detalle ayuda — al menos una oración',
    errorGeneric: 'Algo salió mal. Por favor intenta de nuevo.',
  },
  demos: {
    title: 'Proyectos',
    chooseProjectAria: 'Elige un proyecto',
    screensAria: 'Pantallas de {title}',
    showLabel: 'Mostrar {label}',
    showScreenOf: 'Mostrar pantalla {index} de {total}',
    resumeScreenshots: 'Reanudar capturas de {title}',
    pauseScreenshots: 'Pausar capturas de {title}',
    imageAltScreenOf: '{title} — pantalla {index} de {total}',
    imageAltLabeled: '{title} — {label}',
    imageAltScreen: '{title} — pantalla {index}',
    pausedHint: 'En pausa — toca una miniatura para cambiar',
    playHint: 'Toca una miniatura · toca la foto para ampliar',
    openPhotoZoom: 'Abrir foto de {title} para ampliar',
    closePhotoZoom: 'Cerrar foto',
    zoomHint: 'Pellizca para ampliar · arrastra para mover',
    visit: 'Visitar {name}',
    wantLikeThis: '¿Quieres algo así?',
    startOrEmail: 'Comienza con la Introspección — o escríbenos directamente.',
    beginIntrospect: 'Comenzar la Introspección',
    getStarted: 'Comenzar',
    contact: 'Contacto',
  },
  pricingPage: {
    title: 'Precios',
    websitePlansHeading: 'Sitio web',
    oneTime: 'pago único',
    whatsIncluded: 'Qué incluye',
    howYouWork: 'Cómo trabajarás con nosotros',
    afterLaunch: 'Después del lanzamiento',
    visitorsCan: 'Los visitantes pueden {list}',
    baselineNote:
      'Cada sitio de Applicreations se construye para ser **rápido**, **se ve bien en el teléfono**, y está pensado para que lo encuentren la **IA**, **Google** y **todos los buscadores importantes**.',
    mostPopular: 'El más popular',
    seeFullComparison: 'Ver la comparación completa',
    hideComparison: 'Ocultar comparación',
    comparison: {
      heading: 'Compara los paquetes',
      featureCol: 'Qué incluye',
      includedInEvery:
        'Cada paquete incluye diseño original, listo para teléfono, velocidad y seguridad, SEO en la página, tu contenido y datos de contacto.',
      footer:
        'Cada paquete incluye todo lo del anterior, más lo marcado en su columna. Las rondas de revisión extra cuestan $75, excepto en Pro donde van incluidas.',
      includedAria: 'Incluido',
      notIncludedAria: 'No incluido',
      hintAria: 'Más sobre {label}',
      sections: {
        included: 'Incluido',
        build: 'Construcción',
        visibility: 'Visibilidad',
        strategy: 'Pulido',
        customTools: 'Funciones extra',
      },
      rows: {
        originalDesign: 'Diseño original',
        responsive: 'Responsivo',
        speedSecurity: 'Velocidad y seguridad',
        onPageSeo: 'SEO en la página',
        contentAsProvided: 'Contenido tal cual',
        contactInfo: 'Contacto y credibilidad',
        pages: 'Páginas',
        revisionRounds: 'Revisiones',
        extraRevision: 'Revisión extra',
        walkthrough: 'Recorrido',
        brandedMarketing: 'Marketing de marca',
        localSeo: 'Visibilidad en búsqueda',
        visitorCounts: 'Conteo de visitas',
        adminPage: 'Página de administración',
        extraFunctionality: 'Funciones extra',
        siteSearch: 'Búsqueda en el sitio',
        priorityBuild: 'Construcción prioritaria',
      },
      hints: {
        localSeo:
          'Una comprobación de que tu negocio/proyecto aparece bien en los resultados de búsqueda local y en Google Maps.',
        visitorCounts:
          'Un conteo simple de cuántas personas visitan — sin reportes, gráficos ni un panel mensual.',
        adminPage:
          'Un panel privado para manejar tu contenido sin tocar código.',
        siteSearch:
          'Una barra de búsqueda para que los visitantes encuentren lo que necesitan en un sitio más grande.',
        brandedMarketing:
          'Business es un kit inicial — logo, colores y cómo se ve el sitio cuando alguien comparte el enlace. Pro es el tratamiento completo: hacemos el logo, marcamos los enlaces y unificamos Facebook, redes, Google e impresos.',
        extraFunctionality:
          'Calendarios de reservas, calculadoras de cotización, accesos de miembros u otras herramientas integradas que tu sitio necesita.',
        priorityBuild: 'Tu proyecto empieza al frente de la fila.',
        extraRevision:
          'Una ronda más de cambios después de las rondas incluidas en el paquete.',
      },
      values: {
        pagesStarter: '1',
        pagesBasic: '1–2',
        pagesBusiness: '3–5',
        pagesPro: 'Más grande',
        revisionsStarter: '1',
        revisionsBasic: '1',
        revisionsBusiness: '2',
        revisionsPro: '3',
        brandedMarketingBusiness: 'Limitado',
        brandedMarketingPro: 'Completo',
        extraRevisionIncluded: 'Incluido',
      },
    },
    startingPriceNote:
      'Este precio es un punto de partida. Después de que tu sitio web esté construido y en línea, cualquier trabajo, función o servicio adicional que solicites será estimado por Applicreations antes de comenzar ese trabajo.',
    highlightsAria: 'Puntos destacados de {name}',
    hostingSupportHeading: 'Hosting y Soporte',
    hostingSupportLead:
      'Cuidado mensual que mantiene tu sitio en línea — elige la rapidez de respuesta que te convenga.',
    hostingWhoFor: 'Para quién es',
    mixMatchHeading: 'Combina y estima',
    redesignPrompt: 'Tengo un sitio web, solo necesito una actualización.',
    redesignHint: 'Empezaremos desde tu sitio actual',
    redesignCta: 'Empezar el rediseño',
    mixMatchLead:
      'Elige un paquete de sitio web y un plan de hosting para ver el total.',
    mixMatchLeadTap:
      'Toca un paquete de sitio web y un plan de hosting para ver el total.',
    mixMatchWebsiteHeading: 'Elige un paquete de sitio web',
    mixMatchHostingHeading: 'Elige hosting y soporte',
    mixMatchEmptyPackage: 'Tu paquete de sitio web',
    mixMatchEmptyHosting: 'Tu plan de hosting',
    hostingIntroBeforeRender: 'Cuando nosotros alojamos tu sitio, funciona en',
    hostingIntroRender: 'Render',
    goingLiveHeading: 'Para publicar tu sitio',
    goingLiveLead: 'Lo que necesitas para poner tu sitio en internet.',
    goingLiveStep1Title: 'Paquete de sitio web',
    goingLiveStep1Bullet:
      'Tu paquete cubre solo la construcción — diseñar y entregar el sitio.',
    goingLiveStep2Title: 'Hosting y Soporte',
    goingLiveStep2BulletPlan:
      'Añade un plan de hosting y soporte para que publiquemos tu sitio, lo mantengamos en línea y resolvamos los problemas técnicos.',
    goingLiveStep2CancellationHeading: 'Cancelación',
    goingLiveStep2CancelBuildHeading: 'Construcción del sitio',
    goingLiveStep2BulletCancelBuild:
      'La vista previa / sitio de demostración es gratuita. El primer pago es un anticipo no reembolsable. Si cancelas después de que haya comenzado la construcción de tu sitio, te transferiremos todos los datos en su estado actual.',
    goingLiveStep2BulletCancel:
      'Puedes cancelar el hosting y el soporte en cualquier momento. Antes de que podamos transferir los datos de tu sitio, es obligatorio que tengas tu propia cuenta de Render configurada y activa. Cuando cancelas, tú asumes el trabajo técnico que nosotros manejamos mientras estás con nosotros — incluyendo:',
    goingLiveStep2CancelItems: [
      'Apuntar tu dirección web al sitio en vivo — registros DNS (A/CNAME) en tu registrador de dominio',
      'Mantener el sitio seguro en el navegador — certificados HTTPS y forzar conexiones seguras',
      'Ser dueño de la cuenta de hosting — ajustes del servicio en Render, comandos de build y versión de runtime',
      'Mantener las claves privadas en privado — variables de entorno y secretos de producción',
      'Publicar actualizaciones sin romper el sitio — deploys desde git, logs de build y rollbacks',
      'Arreglarlo cuando algo cae — monitoreo de uptime, errores 5xx y restaurar una release defectuosa',
      'Mantener el software al día — actualizaciones de dependencias y parches de seguridad',
      'Pagar y gestionar el host tú mismo — acceso a Render, límites y facturación después de la entrega',
    ],
    goingLiveStep2CancelClosing:
      'Desaconsejamos firmemente la opción de construir y entregar — invita a problemas técnicos complejos para tu negocio o proyecto más adelante. Una vez que los datos de tu sitio hayan sido transferidos y el sitio esté en vivo en tu cuenta de Render, tú eres el único responsable de todo a partir de ese momento. Applicreations ya no es responsable de ningún mantenimiento técnico ni soporte — sin excepciones.',
    goingLiveStep2HandoffHeading: 'Construir y entregar — sin hosting continuo',
    goingLiveStep2HandoffBodyBefore:
      '¿Quieres que construyamos tu sitio, lo pongamos en línea y luego dejes el hosting y el soporte en tus manos? Esa opción está disponible por',
    goingLiveStep2HandoffFee: '$500',
    goingLiveStep2HandoffBodyAfterFee:
      ' adicionales. Desplegamos solo en Render — no configuramos ni aceptamos solicitudes de otros servidores.',
    goingLiveStep2HandoffFeeCovers:
      'Tu paquete de sitio web cubre crear, diseñar y entregar el sitio. La tarifa única de $500 cubre desplegarlo en tu cuenta de Render y una breve orientación para que tú — o quien se encargue del mantenimiento técnico — conozca lo básico: acceder al sitio, desplegar actualizaciones y hacer mantenimiento menor.',
    goingLiveStep2HandoffRenderAccount:
      'Antes de que el sitio salga en vivo, eres responsable de tener tu propia cuenta de Render configurada y activa para que podamos desplegar el sitio en tu cuenta.',
    goingLiveStep2HandoffSoleResponsibility:
      'Una vez que el sitio esté en vivo en tu cuenta de Render, tú eres el único responsable de las actualizaciones, los problemas técnicos y de mantener el sitio funcionando.',
    goingLiveStep2HandoffExample:
      'Ejemplo: {planName} ({planPrice}) + construir y entregar ({handoffFee}) = {total} — construimos el sitio y lo desplegamos en tu cuenta de Render, sin un plan continuo de hosting y soporte.',
    buildHandoffName: 'Construir y entregar',
    buildHandoffSelect: 'Elegir construir y entregar en lugar de hosting mensual',
    buildHandoffSelected: 'Construir y entregar seleccionado',
    buildHandoffRemove: 'Quitar',
    buildHandoffConfirmTitle: '¿Elegir construir y entregar?',
    buildHandoffConfirmBody:
      'Desaconsejamos firmemente esta opción — significa que asumes el hosting y el mantenimiento técnico por tu cuenta, sin soporte continuo de nuestra parte. ¿Seguro que quieres continuar?',
    buildHandoffConfirmYes: 'Sí, estoy seguro',
    buildHandoffConfirmNo: 'Cancelar',
    buildHandoffConfirmCloseAria: 'Cerrar',
    buildHandoffResponsibilityHeading:
      'Si eliges esta opción, eres el único responsable de todo lo siguiente una vez que el sitio esté en vivo en tu cuenta de Render:',
    selectionEmailBuildHandoff:
      'Construir y entregar: {price} pago único (sin hosting mensual)',
    selectionEmailBuildHandoffNote:
      'Antes de salir en vivo debes tener una cuenta de Render activa. Cuando el sitio esté en vivo en tu cuenta, eres el único responsable de:',
    goingLiveStep3Title: 'Nombre de dominio',
    goingLiveNeedDomainBefore:
      'Compra un dominio de tu elección (tu dirección web, como www.joescafe.com — puedes comprar uno en ',
    goingLiveNeedDomainNamecheap: 'Namecheap',
    goingLiveNeedDomainAfter: ').',
    notSureHeading: '¿No sabes cuál te conviene?',
    notSureBody:
      'Responde unas preguntas cortas y te ayudamos a elegir — o envíanos un correo con lo que hayas escogido.',
    introspectCta: 'Introspección',
    contactCta: 'Contacto',
    choose: 'Elegir {name}',
    chosen: 'Elegido',
    chosenAria: 'Elegido {name}',
    yourSelection: 'Vista previa del pago',
    packageSuffix: 'Paquete {name}',
    oneTimeSuffix: '{price} pago único',
    emptySelection:
      'Elige un paquete y un plan de hosting. Aparecerán aquí con el total.',
    emptySelectionTap:
      'Toca un paquete y un plan de hosting. Aparecerán aquí con el total.',
    expandDetails: 'Ver detalles',
    collapseDetails: 'Ocultar detalles',
    estimatedTotal: 'Total estimado',
    totalWithMonthly: '{oneTime} + {monthly}/mes',
    zeroDueToday: 'Hoy pagas $0.',
    previewTerms:
      'Vista previa gratis en 72 horas y tres días para probarla. Si te detienes después, no debes nada.',
    continueAfterPreviewBefore: '¿Quieres continuar después de los tres días? Entonces',
    fiftyPercentOneTime: 'el 50% del pago único',
    fiftyPercentOneTimeWithAmount: 'el 50% del pago único ({amount})',
    continueAfterPreviewAfter: 'será lo que corresponde pagar.',
    buildRealSiteBefore:
      'Construimos tu sitio real (normalmente en 14 días o menos). Cuando esté en línea y estés satisfecho,',
    remainingFifty: 'el 50% restante',
    remainingFiftyWithAmount: 'el 50% restante ({amount})',
    isDue: 'se paga en ese momento',
    alongWithFirstMonthly: ', junto con tu primer pago mensual de soporte ({amount})',
    alongWithBuildHandoff: ', junto con la tarifa de construir y entregar ({amount})',
    monthlySupportStartsWith:
      'El soporte mensual ({monthly}/mes) comienza cuando tu sitio queda en línea — el primer pago de {monthly} se hace en ese momento, junto con el saldo restante del paquete.',
    monthlySupportStartsWithout:
      'Si agregas soporte mensual, ese primer pago comienza cuando tu sitio queda en línea — se paga en ese momento, junto con el saldo restante del paquete.',
    paymentScheduleHeading: 'Calendario de pagos',
    scheduleProjectStart: 'Inicio del proyecto',
    scheduleProjectStartDetail: '50% del paquete',
    scheduleGoLive: 'El sitio web queda en línea',
    scheduleGoLivePackageOnly: '50% restante del paquete',
    scheduleGoLiveWithSupport:
      '50% restante del paquete ({packageHalf}) + primer soporte mensual ({monthly})',
    scheduleGoLiveWithHandoff:
      '50% restante del paquete ({packageHalf}) + construir y entregar ({handoff})',
    continueToIntrospect: 'Continuar a la Introspección',
    emailThisSelection: 'Enviar mi selección por correo',
    yourEmailSrOnly: 'Tu correo electrónico',
    emailPlaceholder: 'tu@ejemplo.com',
    emailInvalid: 'Por favor escribe un correo válido.',
    emailSendFailed: 'No pudimos enviar el correo. Por favor intenta de nuevo en un momento.',
    emailSendFailedNetwork:
      'No pudimos enviar el correo. Por favor revisa tu conexión e intenta de nuevo.',
    emailSentFallback:
      '¡Enviado! Revisa tu bandeja de entrada para ver el resumen de tu selección de Applicreations.',
    emailHint: 'Enviaremos el resumen de tu selección de Applicreations a esta dirección.',
    emailSent: 'Correo enviado',
    sendMySelection: 'Enviar mi selección',
    noPackage: 'Sin paquete',
    noMonthlySupport: 'Sin soporte mensual',
    review: 'Revisar →',
    selectionEmailSubject: 'Tu selección de Applicreations',
    selectionEmailSubjectWithPlan: 'Tu selección de Applicreations — {name}',
    selectionEmailSubjectWithSupport: 'Tu selección de Applicreations — {name}',
    selectionEmailBodyHeader: 'Tu selección de Applicreations',
    selectionEmailWebsitePackage: 'Paquete de sitio web: {name} — {price}',
    selectionEmailWebsiteNone: 'Paquete de sitio web: (ninguno seleccionado)',
    selectionEmailMonthlyCare: 'Cuidado mensual: {name} — {price}',
    selectionEmailMonthlyNone: 'Cuidado mensual: (ninguno seleccionado)',
    selectionEmailEstimatedTotal: 'Total estimado: {total}',
    selectionEmailZeroDue:
      'Hoy pagas $0 — no se debe nada hasta después de que se entregue tu vista previa gratis.',
    selectionEmailEstimateNote:
      'Esto es solo un estimado de lo que puedes esperar; el alcance final se confirma juntos.',
    selectionEmailSignoff: '— Applicreations',
    selectionEmailWebsiteLabel: 'Paquete de sitio web',
    selectionEmailMonthlyLabel: 'Cuidado mensual',
    selectionEmailTotalLabel: 'Total estimado',
    selectionEmailLinkLabel: 'Ver precios en Applicreations',
  },
  introspectUi: {
    // Progress / chrome
    stepOf: 'Paso {step} de {total}',
    review: 'Revisión',
    exit: 'Salir',
    back: 'Atrás',
    progressAria: 'Progreso del cuestionario',
    // Welcome
    welcomeEyebrow: 'Introspección',
    welcomeHeading: 'Bienvenido — conozcamos tu proyecto',
    welcomeGreeting: 'Bienvenido',
    welcomeContinue: 'Conozcamos tu proyecto',
    redesignWelcomeContinue: 'Veamos tu sitio actual',
    redesignWelcomeHeading: 'Bienvenido — veamos tu sitio actual',
    getStarted: 'Comenzar',
    // Step 1
    step1Title: 'Primero, un poco sobre ti',
    nameLabel: 'Tu nombre',
    namePlaceholder: 'Juana Pérez',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'juana@ejemplo.com',
    phoneLabel: 'Teléfono',
    phoneHint: 'Si te contactamos por este medio, primero te enviaremos un mensaje de texto.',
    phonePlaceholder: '(555) 123-4567',
    phoneFullError: 'Por favor escribe un número de teléfono completo de 10 dígitos',
    phoneKeepTyping: 'Sigue escribiendo — un número completo se ve así: (555) 123-4567',
    yesContinue: 'Sí, continuar',
    // Step 2
    step2Title: 'Cuéntanos sobre tu negocio o proyecto',
    step2SubtitleRedesign:
      'Aunque el sitio actual ya lo diga — cuéntalo con tus propias palabras.',
    businessNameLabel: 'Nombre de tu negocio o proyecto',
    businessNamePlaceholder: 'Café de Joe',
    aboutBusinessLabel: '¿Qué hace o qué ofrece?',
    aboutBusinessPlaceholder: 'Un café de barrio que sirve desayuno, almuerzo y café',
    locationLabel: '¿Dónde están ubicados?',
    locationCityLabel: 'Ciudad',
    locationCityPlaceholder: 'Ciudad o pueblo',
    locationStateLabel: 'Estado',
    locationStatePlaceholder: 'Estado o región',
    locationCountryLabel: 'País',
    locationNoMatches: 'Sin coincidencias',
    // Step 3
    step3Title: 'Tu presencia en línea hoy',
    step3Subtitle: 'No pasa nada si todavía no tienes un sitio web.',
    step3TitleRedesign: 'Tu sitio web actual',
    step3SubtitleRedesign: 'Empezaremos desde el sitio en vivo y luego decidiremos qué conservar.',
    hasOnlineLabel: '¿Ya tienes un sitio web o páginas en línea?',
    hasOnlineYes: 'Tengo un sitio web',
    chooseOne: 'Por favor elige una opción',
    websiteUrlLabel: 'Enlace a tu sitio web actual (si tienes)',
    websiteUrlLabelHasSite: 'Enlace a tu sitio web actual',
    websiteUrlLabelRedesign: 'Enlace al sitio que quieres rediseñar',
    websiteUrlRequired: 'Por favor escribe la dirección del sitio que quieres rediseñar',
    websiteUrlPlaceholder: 'tusitioweb.com',
    socialLinksLabel: 'Enlaces a tus redes sociales (si tienes)',
    socialLinksHint: 'Facebook, Instagram, LinkedIn y similares — un enlace por casilla.',
    addSocialLink: 'Agregar otro enlace de redes',
    admiredLabel: 'Sitios web que realmente admiras',
    admiredHint:
      'No es obligatorio, pero nos ayuda a entender mejor tus preferencias de diseño.',
    addAdmiredSite: 'Agregar otro sitio',
    linkPlaceholder: 'tusitio.com',
    removeItem: 'Quitar',
    removeItemAria: 'Quitar elemento',
    // Step 4
    step4Title: 'Logo y fotos',
    step4Subtitle: 'Trabajamos con lo que tengas — o te ayudamos a resolver las fotos después.',
    step4SubtitleRedesign: 'También vamos a revisar lo que ya está en tu sitio.',
    hasLogoLabel: '¿Ya tienes un logo?',
    uploadLogoLabel: 'Sube tu logo (opcional)',
    uploadLogoHint: 'PNG, JPG, WebP o SVG — hasta 5 MB.',
    hasPhotosLabel: '¿Tienes fotos que te gustaría poner en el sitio?',
    uploadPhotosLabel: 'Subir fotos (opcional)',
    uploadPhotosHint: 'PNG, JPG o WebP — hasta {max} archivos, 10 MB cada uno.',
    needsPhotosLabel: '¿Necesitas que se tomen fotos nuevas?',
    logoTooLarge: 'El logo debe pesar 5 MB o menos',
    photoTooLarge: '"{name}" pesa más de 10 MB — por favor elige un archivo más pequeño',
    photoLimit: 'Puedes subir hasta {max} fotos',
    chooseLogoFile: 'Elegir archivo del logo',
    replaceLogo: 'Reemplazar logo',
    choosePictures: 'Elegir fotos',
    addMorePictures: 'Agregar más fotos',
    removeFileAria: 'Quitar {name}',
    uploadSecurityNotice:
      'Subir archivos es opcional. Los archivos están protegidos por el cifrado a nivel de infraestructura de Google (AES-256 en reposo, TLS en tránsito). Applicreations mantiene el acceso a la carpeta restringido únicamente a Applicreations, y los archivos se eliminan de la carpeta compartida dentro de los 30 días posteriores a la finalización del proyecto.',
    keepChangeTitle: '¿Qué debemos conservar — y qué tiene que cambiar?',
    keepChangeSubtitle:
      'Elige todas las que apliquen. Podemos afinarlo cuando revisemos tu sitio.',
    keepHeading: '¿Qué debemos conservar?',
    changeHeading: '¿Qué es lo que más necesita cambiar?',
    keepItemsError: 'Elige al menos una cosa para conservar — o empezar de cero',
    changePrioritiesError: 'Elige al menos una cosa que necesita cambiar',
    keepChangeNotesLabel: '¿Algo específico del sitio actual que debamos saber?',
    keepChangeNotesPlaceholder:
      'Opcional — páginas que importan, cosas que no funcionan, o detalles que debamos notar…',
    // Step 5
    step5Title: '¿Qué debería poder hacer la gente en tu sitio web?',
    step5Hint: 'Elige todas las que apliquen — las que quieras.',
    step5TitleRedesign: 'En el sitio nuevo, ¿qué debería poder hacer la gente?',
    step5HintRedesign: 'Incluye lo que tu sitio actual ya hace, y también lo que quieras agregar.',
    visitorActionsError: 'Por favor elige al menos una cosa que la gente debería poder hacer',
    // Step 6
    step6Title: '¿Qué tan desarrollado debería ser?',
    step6Subtitle:
      'Elige la opción más cercana. Podemos afinarla cuando revisemos tus respuestas.',
    step6SubtitleRedesign: 'Piensa en el sitio nuevo, no en cuántas páginas tienes ahora.',
    siteDepthError: 'Por favor elige qué tan completo quieres el sitio',
    // Step 7
    step7Title: 'Estilo de diseño y colores',
    step7Subtitle: 'Elige todas las que apliquen — o déjalo en nuestras manos.',
    designFeelHeading: 'Estilo de diseño',
    colorsHeading: 'Colores',
    noPreference: 'Sin preferencia — ustedes deciden',
    matchLogoColors: 'Usar los colores de mi logo',
    keepCurrentLook: 'Conservar el look de mi sitio actual',
    designFeelsError: 'Elige al menos un estilo de diseño, o marca sin preferencia',
    colorPalettesError:
      'Elige al menos una dirección de color, usa los colores de tu logo, o marca sin preferencia',
    colorNotesError: 'Cuéntanos un poco sobre los colores que tienes en mente',
    colorNotesLabelCustom: 'Cuéntanos sobre tus colores',
    colorNotesLabelOptional: '¿Algo más sobre los colores o el estilo? (opcional)',
    colorNotesHint: 'Colores de tu marca, colores a evitar, o una descripción rápida.',
    colorNotesPlaceholder: 'Azul profundo y crema, como nuestra fachada...',
    // Step 8
    step8Title: '¿Hay algo que debamos evitar?',
    step8Aria: 'Algo que debamos evitar',
    step8Placeholder:
      'Opcional — estilos que no te gustan, tonos que no encajan, o looks que no van contigo…',
    // Step 9
    step9Title: '¿Hay algo más sobre tu negocio que debamos saber?',
    step9Aria: 'Algo más sobre tu negocio',
    step9Placeholder: 'Opcional — horarios, temporadas, socios, cosas imprescindibles…',
    step9PlaceholderRedesign:
      'Opcional — imprescindibles del sitio actual, páginas que importan, o algo que no debamos pasar por alto…',
    // Buttons
    continue: 'Continuar',
    continueToReview: 'Continuar a la revisión',
    submitIntrospect: 'Enviar Introspección',
    // Review
    reviewHeading: 'Revisa tus respuestas',
    reviewSubtitle: 'Revisa todo lo de abajo y envíalo cuando se vea bien.',
    reviewEdit: 'Editar',
    reviewDone: 'Listo',
    reviewAboutYou: 'Sobre ti',
    reviewName: 'Nombre',
    reviewEmail: 'Correo',
    reviewPhone: 'Teléfono',
    reviewYourBusiness: 'Tu negocio',
    reviewBusinessProject: 'Negocio / proyecto',
    reviewLocation: 'Ubicación',
    reviewWhatYouDo: 'A qué te dedicas',
    reviewOnlinePresence: 'Presencia en línea',
    reviewCurrentWebsite: 'Sitio actual',
    reviewAlreadyOnline: '¿Ya en línea?',
    reviewWebsite: 'Sitio web',
    reviewKeepChange: 'Conservar o cambiar',
    reviewKeep: 'Conservar',
    reviewChange: 'Cambiar',
    reviewCurrentSiteNotes: 'Notas sobre el sitio actual',
    reviewSocialLinks: 'Redes sociales',
    reviewSitesAdmire: 'Sitios que admiras',
    reviewLogoPhotos: 'Logo y fotos',
    reviewHasLogo: 'Tiene logo',
    reviewLogoFile: 'Archivo del logo',
    reviewHasPhotos: 'Tiene fotos',
    reviewPhotoFiles: 'Archivos de fotos',
    reviewNeedPhotos: 'Necesita fotos nuevas',
    reviewVisitorsShouldDo: 'Qué deberían hacer los visitantes',
    reviewActions: 'Acciones',
    reviewSiteScope: 'Alcance del sitio',
    reviewHowDeveloped: 'Qué tan desarrollado',
    reviewDesignColors: 'Estilo de diseño y colores',
    reviewDesignFeel: 'Estilo de diseño',
    reviewColors: 'Colores',
    reviewColorNotes: 'Notas de color',
    reviewSteerClear: 'Cosas a evitar',
    reviewAvoid: 'Evitar',
    reviewAnythingElse: 'Algo más',
    reviewNotes: 'Notas',
    // Success
    successEyebrow: 'Todo listo',
    successThanks: 'Gracias',
    successHeading: 'Gracias — recibimos tus respuestas de la Introspección',
    successHeadingRest: '— recibimos tus respuestas de la Introspección',
    successHeadingRedesign: 'Gracias — recibimos tus respuestas del rediseño',
    successHeadingRestRedesign: '— recibimos tus respuestas del rediseño',
    successNextHeading: 'Qué sigue…',
    successNext1:
      'En dos días o menos, se envía por correo un enlace al sitio de demostración.',
    successNext1Redesign:
      'En dos días o menos, se envía por correo un enlace a la demostración rediseñada.',
    successNext2:
      'Cuando recibas el sitio de demostración por correo, tendrás 24 horas para probarlo.',
    successClosing: 'Gracias por usar la Introspección.',
    successClosingRedesign: 'Gracias por usar la Introspección.',
    // Errors
    errorGeneric: 'Algo salió mal. Por favor intenta de nuevo.',
    errorTryEmail:
      'Algo salió mal. Por favor intenta de nuevo o escríbenos directamente por correo.',
  },
  introspectValidation: {
    liveEmailAt: 'Por favor incluye una @ en tu correo',
    liveEmailComplete: 'Por favor escribe un correo completo (como juana@ejemplo.com)',
    liveEmailValid: 'Por favor escribe un correo válido (como juana@ejemplo.com)',
    businessName: 'Por favor escribe el nombre de tu negocio o proyecto',
    aboutBusinessEmpty: 'Por favor cuéntanos qué hace tu negocio o proyecto',
    aboutBusinessShort: 'Por favor agrega un poco más — una oración corta nos ayuda a empezar',
    locationCityEmpty: 'Por favor escribe una ciudad o pueblo',
    locationCityShort: 'Por favor escribe una ciudad o pueblo real',
    locationStateEmpty: 'Por favor escribe un estado o región',
    locationCountryEmpty: 'Por favor elige un país',
    nameHardShort: 'Por favor escribe tu nombre',
    nameHardLetters: 'Por favor escribe un nombre real (letras, no solo números o símbolos)',
    nameSoftWarning: 'Oye — ¿seguro que ese es tu nombre? Solo para confirmar.',
  },
  introspectOptions: {
    yesNoUnsure: { yes: 'Sí', no: 'No', unsure: 'No estoy seguro' },
    siteDepth: {
      basics: {
        title: 'Lo básico',
        description:
          'Una página clara: quién eres, qué ofreces, horarios o detalles importantes, y cómo contactarte.',
      },
      'a-few-pages': {
        title: 'Unas cuantas páginas y algunas herramientas',
        description:
          'Un conjunto pequeño de páginas con espacio para respirar — por ejemplo Inicio, Nosotros, Servicios o Menú, Galería y Contacto.',
      },
      'fuller-site': {
        title: 'El sitio máximo, herramientas a la medida y más',
        description:
          'Varias páginas más cosas con las que la gente (o tú) interactúa — como pedidos, reservaciones, cuentas o herramientas para actualizar el sitio. Las funciones a la medida construidas alrededor de cómo trabajas también entran aquí.',
      },
    },
    visitorActions: {
      'call-you': 'Llamarte',
      'email-you': 'Enviarte un correo',
      'see-hours': 'Ver tu horario',
      'find-you': 'Encontrar dónde estás',
      'get-directions': 'Obtener indicaciones',
      'see-photos': 'Ver fotos',
      'read-about-you': 'Leer sobre ti',
      'see-a-menu': 'Ver un menú',
      'see-prices': 'Ver precios',
      'see-what-you-offer': 'Ver lo que ofreces',
      'see-events': 'Ver próximos eventos',
      'see-a-calendar': 'Ver un calendario',
      'browse-a-gallery': 'Recorrer una galería',
      'watch-a-video': 'Ver un video',
      listen: 'Escuchar música o audio',
      'read-updates': 'Leer noticias o novedades',
      'read-stories': 'Leer historias',
      'meet-the-people': 'Conocer a las personas',
      'see-a-portfolio': 'Ver un portafolio',
      'download-a-file': 'Descargar un archivo',
      'ask-a-question': 'Hacer una pregunta',
      'fill-out-a-form': 'Llenar un formulario',
      'join-email-list': 'Unirse a una lista de correo',
      'leave-a-review': 'Dejar una reseña',
      rsvp: 'Confirmar asistencia',
      volunteer: 'Apuntarse a ayudar',
      share: 'Compartir con amigos',
      'book-a-visit': 'Agendar una visita',
      'make-a-reservation': 'Hacer una reservación',
      'schedule-an-appointment': 'Programar una cita',
      'request-a-quote': 'Pedir una cotización',
      donate: 'Hacer una donación',
      'buy-something': 'Comprar algo',
      'place-an-order': 'Hacer un pedido',
      'pay-online': 'Pagar en línea',
      'create-an-account': 'Crear una cuenta',
      apply: 'Postularse a algo',
      'search-the-site': 'Buscar en el sitio',
      chat: 'Chatear contigo',
      'sign-up-for-a-class': 'Inscribirse a una clase',
    },
    designFeels: {
      'clean-simple': {
        title: 'Limpio y simple',
        description: 'Espacio abierto, lectura fácil',
      },
      'warm-friendly': {
        title: 'Cálido y amigable',
        description: 'Acogedor, con sabor de barrio',
      },
      'bold-modern': {
        title: 'Atrevido y moderno',
        description: 'Contraste fuerte, formas claras',
      },
      'classic-calm': {
        title: 'Clásico y sereno',
        description: 'Estable, pulido, atemporal',
      },
      'playful-fun': { title: 'Juguetón y divertido', description: 'Ligero, con energía' },
      'elegant-refined': {
        title: 'Elegante y refinado',
        description: 'Lujo discreto, detalle cuidadoso',
      },
      'rustic-natural': {
        title: 'Rústico y natural',
        description: 'Orgánico, con los pies en la tierra, artesanal',
      },
      'dark-dramatic': {
        title: 'Oscuro y dramático',
        description: 'Con atmósfera, de alto impacto',
      },
      'airy-light': { title: 'Aireado y ligero', description: 'Brillante, fresco, abierto' },
      editorial: { title: 'Editorial', description: 'Estilo revista, tipografía expresiva' },
    },
    colorPalettes: {
      'ocean-blues': { title: 'Azules de océano' },
      'coastal-teal': { title: 'Verde azulado costero' },
      'warm-earth': { title: 'Tierra cálida' },
      'sunset-coral': { title: 'Coral de atardecer' },
      'fresh-greens': { title: 'Verdes frescos' },
      'soft-neutrals': { title: 'Neutros suaves' },
      'charcoal-gold': { title: 'Carbón y dorado' },
      'soft-blush': { title: 'Rosa suave' },
      'bright-cheerful': { title: 'Brillante y alegre' },
      'deep-jewel': { title: 'Tonos joya profundos' },
      custom: { title: 'Tengo los míos' },
    },
    keepItems: {
      logo: 'Mi logo',
      colors: 'Mis colores',
      photos: 'Mis fotos',
      words: 'Las palabras / cómo describo el negocio',
      pages: 'Las mismas páginas (Inicio, Nosotros y similares)',
      contact: 'Cómo me contactan',
      'start-fresh': 'Nada — empezar de cero',
    },
    changePriorities: {
      'looks-old': 'Se ve viejo o no se parece a mi negocio',
      'hard-on-phone': 'Es difícil de usar en el celular',
      'hard-to-find': 'La gente no encuentra lo que necesita',
      'easier-to-update': 'Quiero que sea más fácil de actualizar',
      'new-things': 'Quiero cosas nuevas que ahora no puede hacer',
      'words-off': 'Las palabras no suenan como nosotros',
      'hard-to-search': 'La gente no nos encuentra cuando busca',
      'slow-or-broken': 'Está lento o hay cosas que no funcionan',
    },
    recommend: {
      choseOnPricing: 'El cliente ya eligió {name} en la página de precios.',
      pro:
        'Describiste un sitio más completo con piezas interactivas o herramientas a la medida — eso normalmente encaja con Pro.',
      businessInteractive:
        'Quieres que los visitantes hagan más que leer (pedir, reservar, cuentas, etc.) — eso normalmente encaja con Business.',
      businessPages: 'Un sitio de varias páginas normalmente encaja con Business.',
      businessPhotos:
        'Un sitio que necesita fotos nuevas o más espacio para crecer normalmente encaja con Business.',
      basic: 'Un sitio claro de una o dos páginas con lo esencial normalmente encaja con Basic.',
    },
    emailLabels: {
      recommendedPackage: 'Paquete recomendado',
      why: 'Por qué',
      pricingSelection: 'Selección en la página de precios',
      package: 'paquete',
      name: 'Nombre',
      email: 'Correo',
      phone: 'Teléfono',
      businessProject: 'Negocio / proyecto',
      location: 'Ubicación',
      whatItDoes: 'Qué hace / ofrece',
      onlinePresence: 'Presencia en línea',
      website: 'Sitio web',
      socialLinks: 'Redes sociales',
      admiredSites: 'Sitios admirados',
      hasLogo: 'Tiene logo',
      logoUpload: 'Logo subido',
      hasPhotos: 'Tiene fotos',
      photoUploads: 'Fotos subidas',
      needsPhotosTaken: 'Necesita fotos nuevas',
      visitorActions: 'Qué debería poder hacer la gente',
      howDeveloped: 'Qué tan desarrollado',
      fromPricingSelection: '(de la selección de precios)',
      designFeel: 'Estilo de diseño',
      colorPalette: 'Paleta de colores',
      colorNotes: 'Notas de color',
      steerClearOf: 'Cosas a evitar',
      anythingElse: 'Algo más sobre el negocio',
      noPreference: 'Sin preferencia — ustedes deciden',
      matchLogo: 'Usar los colores de mi logo',
      keepCurrentLook: 'Conservar el look de mi sitio actual',
      keepItems: 'Qué conservar',
      changePriorities: 'Qué necesita cambiar',
      currentSiteNotes: 'Notas sobre el sitio actual',
      flow: 'Flujo',
      flowRedesign: 'Rediseño',
      notAnswered: '(sin responder)',
      none: '(ninguno)',
    },
  },
  plans: {
    contactForPricing: 'Contactar para precio',
    basicSupport: {
      description:
        'Arreglos y ayuda continua para tu sitio cuando algo se descompone o necesita una actualización pequeña.',
    },
    packageDetailLabels: {
      'how-big': 'Qué tan grande es el sitio',
      'looks-like': 'Cómo se ve',
      'customers-use': 'Cómo lo usan tus clientes',
      'you-manage': 'Cómo lo administras',
      'help-after': 'Ayuda después de publicarlo',
    },
    supportDetailLabels: {
      'whats-included': 'Qué incluye',
      'fix-or-update': 'Qué arreglamos o actualizamos',
      'how-contact': 'Cómo nos contactas',
      'who-for': 'Para quién es',
    },
    support: {
      support: {
        name: 'Basic',
        summary:
          'Ayuda mensual después de que tu sitio esté en línea — arreglamos cosas y hacemos actualizaciones pequeñas por ti.',
        whyItHelps:
          'Los horarios cambian, hay que reemplazar fotos y, a veces, una página deja de funcionar. Nosotros nos encargamos para que no tengas que resolverlo solo.',
        details: [
          {
            id: 'whats-included',
            label: 'Qué incluye',
            items: [
              'Ayuda durante horario laboral normal',
              'Mantenemos tu sitio web funcionando después de que queda en línea',
              'Cancela cuando quieras — al cancelar, tú eres responsable de publicar tu sitio en internet',
            ],
          },
          {
            id: 'fix-or-update',
            label: 'Qué arreglamos o actualizamos',
            items: [
              'Páginas, formularios o botones que dejan de funcionar',
              'Cambios pequeños como horarios, fotos o textos',
              'Respuestas claras cuando no sabes cómo cambiar algo',
            ],
          },
          {
            id: 'how-contact',
            label: 'Cómo nos contactas',
            items: [
              'Correo',
              'Teléfono',
              'Respondemos en horario laboral (lunes a viernes, 8 a.m.–4 p.m. EST)',
            ],
          },
          {
            id: 'who-for',
            label: 'Para quién es',
            items: [
              'Dueños que no quieren encargarse de la parte técnica',
              'Funciona con cualquier paquete de sitio web',
            ],
          },
          {
            id: 'looks-like',
            label: 'No incluido',
            items: [
              'Not included: Cobertura nocturna — ayuda después de las 4 p.m. EST o los fines de semana',
              'Not included: Fila prioritaria — las solicitudes esperan en la fila regular',
            ],
          },
          {
            id: 'help-after',
            label: 'Para quién es',
            items: [
              'Dueños que no quieren encargarse de la parte técnica. Funciona con cualquier paquete de sitio web.',
            ],
          },
        ],
        features: [
          'Ayuda en horario laboral normal',
          'Arreglos cuando algo se descompone',
          'Actualizaciones pequeñas',
        ],
        included: [
          {
            icon: 'live-hosting',
            term: 'Mantener el sitio en línea',
            description:
              'Alojamos el sitio y lo mantenemos funcionando después de que queda en línea',
          },
          {
            icon: 'hours-help',
            term: 'Ayuda en horario laboral',
            description:
              'Respondemos en horario laboral (lunes a viernes, 8 a.m.–4 p.m. EST)',
          },
          {
            icon: 'small-updates',
            term: 'Actualizaciones pequeñas',
            description: 'Horarios, fotos, textos o una página que deja de funcionar',
          },
          {
            icon: 'email-phone',
            term: 'Correo y teléfono',
            description: 'Escríbenos o llámanos en horario laboral',
          },
          {
            icon: 'cancel-anytime',
            term: 'Cancela cuando quieras',
            description:
              'Al cancelar, tú eres responsable de publicar tu sitio en internet',
          },
        ],
        cta: 'Preguntar por Basic',
      },
      'business-support': {
        name: 'Business',
        summary:
          'Ayuda prioritaria en horario laboral — respuestas más rápidas y atención extra cuando algo requiere más trabajo.',
        whyItHelps:
          'Cuando necesitas respuestas antes que con Basic, ponemos tu sitio primero durante el día laboral para que los problemas pequeños no se queden esperando.',
        details: [
          {
            id: 'whats-included',
            label: 'Qué incluye',
            items: [
              'Todo lo de Basic',
              'Prioridad en horario laboral — tus solicitudes van primero',
              'Respuestas más rápidas cuando algo sale mal',
              'Cancela cuando quieras — al cancelar, tú eres responsable de publicar tu sitio en internet',
            ],
          },
          {
            id: 'fix-or-update',
            label: 'Qué arreglamos o actualizamos',
            items: [
              'Páginas, formularios o botones que dejan de funcionar',
              'Actualizaciones pequeñas y medianas como horarios, fotos, textos o una sección nueva',
              'Ayuda adicional cuando un problema requiere más trabajo',
            ],
          },
          {
            id: 'how-contact',
            label: 'Cómo nos contactas',
            items: [
              'Correo',
              'Teléfono',
              'Respondemos primero en horario laboral (lunes a viernes, 8 a.m.–4 p.m. EST)',
            ],
          },
          {
            id: 'who-for',
            label: 'Para quién es',
            items: [
              'Dueños que quieren ayuda más rápida sin cobertura nocturna',
              'Funciona con cualquier paquete de sitio web',
            ],
          },
          {
            id: 'looks-like',
            label: 'No incluido',
            items: [
              'Not included: Cobertura nocturna — ayuda después de las 4 p.m. EST o los fines de semana',
            ],
          },
          {
            id: 'help-after',
            label: 'Para quién es',
            items: [
              'Dueños que quieren ayuda más rápida sin cobertura nocturna. Funciona con cualquier paquete de sitio web.',
            ],
          },
        ],
        features: [
          'Prioridad en horario laboral',
          'Respuestas más rápidas',
          'Actualizaciones pequeñas y medianas',
        ],
        included: [
          {
            icon: 'priority-hours',
            term: 'Prioridad en horario laboral',
            description:
              'Tus solicitudes van primero durante el día laboral para que los problemas pequeños no se queden esperando',
          },
          {
            icon: 'medium-updates',
            term: 'Actualizaciones pequeñas y medianas',
            description:
              'Horarios, fotos, textos o una sección nueva cuando necesitas un poco más que un ajuste',
          },
          {
            icon: 'faster-replies',
            term: 'Respuestas más rápidas',
            description: 'Respondemos primero cuando algo sale mal',
          },
        ],
        cta: 'Preguntar por Business',
      },
      ultimate: {
        name: 'Pro',
        summary:
          'Ayuda a cualquier hora del día o de la noche cuando un sitio caído significa ventas perdidas.',
        whyItHelps:
          'Si tu sitio se cae de madrugada y no puedes esperar hasta la mañana, hay alguien disponible las 24 horas.',
        details: [
          {
            id: 'whats-included',
            label: 'Qué incluye',
            items: [
              'Todo lo de Business',
              'Ayuda a cualquier hora del día o de la noche',
              'Tu sitio recibe atención prioritaria cuando algo sale mal',
              'Cancela cuando quieras — al cancelar, tú eres responsable de publicar tu sitio en internet',
            ],
          },
          {
            id: 'fix-or-update',
            label: 'Qué arreglamos o actualizamos',
            items: [
              'Sitio caído o problemas graves, de día o de noche',
              'Arreglos y actualizaciones más rápidos',
              'Ayuda adicional cuando un problema requiere más trabajo',
            ],
          },
          {
            id: 'how-contact',
            label: 'Cómo nos contactas',
            items: [
              'Correo',
              'Teléfono',
              'Respondemos cuando llamas a cualquier hora',
            ],
          },
          {
            id: 'who-for',
            label: 'Para quién es',
            items: [
              'Negocios con mucho movimiento que toman pedidos en línea',
              'Cualquiera que pierde dinero cuando el sitio web está caído',
            ],
          },
          {
            id: 'looks-like',
            label: 'No incluido',
            items: [],
          },
          {
            id: 'help-after',
            label: 'Para quién es',
            items: [
              'Negocios con mucho movimiento que toman pedidos en línea — cualquiera que pierde dinero cuando el sitio web está caído.',
            ],
          },
        ],
        features: [
          'Ayuda de día o de noche',
          'Primero en la fila para arreglos',
          'Respuestas más rápidas',
        ],
        included: [
          {
            icon: 'anytime-help',
            term: 'Ayuda a cualquier hora',
            description:
              'Hay alguien disponible las 24 horas si el sitio se cae de madrugada',
          },
          {
            icon: 'first-in-line',
            term: 'Primero en la fila',
            description:
              'Tu sitio recibe atención prioritaria cuando algo sale mal',
          },
          {
            icon: 'overnight-fixes',
            term: 'Cobertura si el sitio cae',
            description: 'Sitio caído o problemas graves, de día o de noche',
          },
        ],
        cta: 'Preguntar por Pro',
      },
    },
    website: {
      starter: {
        name: 'Starter',
        shortSummary: 'Una página. Todo lo que necesitas para que te encuentren y te contacten.',
        summary:
          'Una página. Todo lo que necesitas para que te encuentren y te contacten.',
        details: [
          {
            id: 'how-big',
            label: 'Qué tan grande es el sitio',
            items: [
              'Una página — todo el sitio vive en una sola página que se recorre, sin menú para hacer clic',
            ],
          },
          {
            id: 'looks-like',
            label: 'Cómo se ve',
            items: [],
            segments: [
              {
                items: [
                  'Diseño original — la construcción se deriva de tus preferencias de diseño, no de una plantilla de Squarespace, Wix u otros creadores genéricos de sitios',
                  'Responsivo — se ve bien en teléfono, tablet y escritorio',
                  'Velocidad y seguridad — carga rápido y protegido contra amenazas comunes',
                  'SEO en la página — estructurado para que Google encuentre y entienda tu negocio/proyecto',
                  'Contenido tal cual — construyo con las palabras y fotos que me das; señalaré cualquier cosa que parezca un error, pero no reescribiré tu voz',
                  'Contacto y credibilidad — horario, ubicación, datos de contacto, y testimonios o trabajos anteriores si los tienes, incluidos desde el inicio',
                  'Not included: Plugins — herramientas extra más allá de un sitio web estándar, como reservas en línea (Calendly) o pagos (PayPal)',
                  'Not included: Marketing de marca limitado — un logo, colores y look inicial en el sitio',
                ],
              },
            ],
          },
          {
            id: 'customers-use',
            label: 'Cómo lo usan tus clientes',
            items: ['Que te encuentren y te contacten'],
          },
          {
            id: 'you-manage',
            label: 'Cómo lo administras',
            items: [
              '1 ronda de revisión — una ronda de cambios después de tu primera mirada',
            ],
          },
          {
            id: 'help-after',
            label: 'Ayuda después de publicarlo',
            items: [
              'Solo la construcción — agrega un [plan de hosting](#hosting-support) desde $19 al mes.',
            ],
          },
        ],
        features: ['1 página', 'Diseño original', 'SEO en la página'],
        checklist: ['1 página'],
        included: [
          {
            icon: 'one-page',
            term: 'Una página',
            description:
              'Todo el sitio vive en una sola página que se recorre, sin menú para hacer clic',
          },
          {
            icon: 'original-design',
            term: 'Diseño original',
            description:
              'La construcción se deriva de tus preferencias de diseño, no de una plantilla de Squarespace, Wix u otros creadores genéricos de sitios.',
          },
          {
            icon: 'responsive',
            term: 'Responsivo',
            description: 'Se ve bien en teléfono, tablet y escritorio',
          },
          {
            icon: 'speed-security',
            term: 'Velocidad y seguridad',
            description: 'Carga rápido y protegido contra amenazas comunes',
          },
          {
            icon: 'on-page-seo',
            term: 'SEO en la página',
            description:
              'Estructurado para que Google encuentre y entienda tu negocio/proyecto'
          },
          {
            icon: 'content-as-provided',
            term: 'Contenido tal cual',
            description:
              'Construyo con las palabras y fotos que me das; señalaré cualquier cosa que parezca un error, pero no reescribiré tu voz',
          },
          {
            icon: 'contact-credibility',
            term: 'Contacto y credibilidad',
            description:
              'Horario, ubicación, datos de contacto, y testimonios o trabajos anteriores si los tienes, incluidos desde el inicio',
          },
          {
            icon: 'revision-1',
            term: '1 ronda de revisión',
            description: 'Una ronda de cambios después de tu primera mirada',
          },
        ],
        cta: 'Más',
      },
      basic: {
        name: 'Basic',
        shortSummary: 'Todo lo de Starter, más una segunda página y un conteo simple de visitas.',
        summary: 'Todo lo de Starter, más una segunda página y un conteo simple de visitas.',
        details: [
          {
            id: 'how-big',
            label: 'Qué tan grande es el sitio',
            items: [
              '1–2 páginas — separa tu historia de tu oferta en vez de un solo scroll largo',
            ],
          },
          {
            id: 'looks-like',
            label: 'Cómo se ve',
            items: [],
            segments: [
              {
                items: [
                  'Not included: Plugins — herramientas extra más allá de un sitio web estándar, como reservas en línea (Calendly) o pagos (PayPal)',
                  'Not included: Marketing de marca limitado — un logo, colores y look inicial en el sitio',
                ],
              },
            ],
          },
          {
            id: 'customers-use',
            label: 'Cómo lo usan tus clientes',
            items: ['Leer tu historia y tu oferta en páginas separadas'],
          },
          {
            id: 'you-manage',
            label: 'Cómo lo administras',
            items: [
              '1 ronda de revisión — una ronda de cambios después de tu primera mirada',
            ],
          },
          {
            id: 'help-after',
            label: 'Ayuda después de publicarlo',
            items: [
              'Solo la construcción — agrega un [plan de hosting](#hosting-support) desde $19 al mes.',
            ],
          },
        ],
        features: ['1–2 páginas', 'Conteo de visitas'],
        checklist: ['1–2 páginas', 'Conteo de visitas'],
        included: [
          {
            icon: 'speed-security',
            term: 'Velocidad y seguridad',
            description:
              'Carga rápido, con HTTPS para que el Wi-Fi de un café no pueda espiar un formulario de contacto y el navegador muestre el candado, no “No seguro.”',
          },
          {
            icon: 'pages-1-2',
            term: '1–2 páginas',
            description:
              'Separa tu historia de tu oferta en vez de un solo scroll largo',
          },
          {
            icon: 'visitor-counts',
            term: 'Conteo de visitas',
            description:
              'Un conteo simple de cuántas personas visitan, para que veas si el sitio está funcionando',
          },
        ],
        cta: 'Más',
      },
      // Former Pro tier — renamed Business
      business: {
        name: 'Business',
        shortSummary:
          'Todo lo de Basic, más las páginas extra y el pulido que un sitio más grande necesita.',
        summary:
          'Todo lo de Basic, más las páginas extra y el pulido que un sitio más grande necesita.',
        details: [
          {
            id: 'how-big',
            label: 'Qué tan grande es el sitio',
            items: [
              '3–5 páginas — espacio para un desglose de servicios, casos de estudio o una sección de recursos',
            ],
          },
          {
            id: 'looks-like',
            label: 'Cómo se ve',
            items: [],
            segments: [
              {
                items: [
                  'Comprobación de visibilidad — que tu negocio/proyecto aparezca bien en los resultados de búsqueda local y en Google Maps',
                  'Marketing de marca limitado — logo, colores, un look que combine en el sitio y cómo se ve cuando alguien comparte el enlace (kit inicial; el tratamiento completo en redes, impresos y enlaces está en Pro)',
                  'Not included: Plugins — herramientas extra más allá de un sitio web estándar, como reservas en línea (Calendly) o pagos (PayPal)',
                ],
              },
            ],
          },
          {
            id: 'customers-use',
            label: 'Cómo lo usan tus clientes',
            items: ['Comparar servicios, ver pruebas y dar el siguiente paso'],
          },
          {
            id: 'you-manage',
            label: 'Cómo lo administras',
            items: [
              '2 rondas de revisión — una ronda extra incluida sin costo',
            ],
          },
          {
            id: 'help-after',
            label: 'Ayuda después de publicarlo',
            items: [
              'Solo la construcción — agrega un [plan de hosting](#hosting-support) desde $19 al mes, o soporte Business a $39 al mes.',
            ],
          },
        ],
        features: ['3–5 páginas', 'Visibilidad en búsqueda'],
        checklist: ['3–5 páginas', 'Visibilidad'],
        included: [
          {
            icon: 'speed-security',
            term: 'Velocidad y seguridad',
            description:
              'Carga rápido por HTTPS, para que alguien en el Wi-Fi de un café no pueda leer un formulario de contacto. Las conexiones cifradas se fuerzan, el navegador muestra el candado, y no queda basura de plugins de plantilla que alguien pueda explotar.',
          },
          {
            icon: 'pages-3-5',
            term: '3–5 páginas',
            description:
              'Espacio para un desglose de servicios, casos de estudio o una sección de recursos',
          },
          {
            icon: 'search-visibility',
            term: 'Comprobación de visibilidad',
            description:
              'Que tu negocio/proyecto aparezca bien en los resultados de búsqueda local y en Google Maps'
          },
          {
            icon: 'branded-marketing',
            term: 'Marketing de marca limitado',
            example: 'Como un logo, colores, un look básico en Facebook y una vista previa al compartir',
            description:
              'Un kit inicial para el sitio — logo y colores para que las páginas se vean como un solo negocio/proyecto, más cómo se ve el sitio cuando alguien lo enlaza. El tratamiento completo en redes, impresos y enlaces está en Pro.'
          },
          {
            icon: 'revision-2',
            term: '2 rondas de revisión',
            description: 'Una ronda extra incluida sin costo',
          },
        ],
        cta: 'Más',
      },
      // Former Business tier — renamed Pro
      pro: {
        name: 'Pro',
        shortSummary:
          'Todo lo de Business, más las funciones extra que un sitio más grande necesita para funcionar.',
        summary:
          'Todo lo de Business, más las funciones extra que un sitio más grande necesita para funcionar.',
        details: [
          {
            id: 'how-big',
            label: 'Qué tan grande es el sitio',
            items: [
              'Un sitio más grande — las funciones extra que un sitio más grande necesita para funcionar',
            ],
          },
          {
            id: 'looks-like',
            label: 'Cómo se ve',
            items: [],
            segments: [
              {
                items: [
                  'Página de administración — un panel privado para manejar tu contenido sin tocar código',
                  'Funciones extra — calendarios de reservas, calculadoras de cotización, accesos de miembros u otras herramientas integradas que tu sitio necesita',
                  'Búsqueda en el sitio — una barra de búsqueda para que los visitantes encuentren lo que necesitan en un sitio más grande',
                  'Marketing de marca completo — hacemos tu logo, marcamos los enlaces y unificamos Facebook, redes, Google e impresos, incluido cómo se ve el sitio cuando alguien comparte el enlace'
                ],
              },
            ],
          },
          {
            id: 'customers-use',
            label: 'Cómo lo usan tus clientes',
            items: ['Usar las herramientas integradas que tu sitio necesita para funcionar'],
          },
          {
            id: 'you-manage',
            label: 'Cómo lo administras',
            items: [
              'Recorrido — nos sentamos contigo en persona y te recorremos cada detalle del producto terminado hasta que te sientas cómodo usando tu herramienta a medida',
              'Construcción prioritaria — tu proyecto empieza al frente de la fila',
              '3 rondas de revisión',
            ],
          },
          {
            id: 'help-after',
            label: 'Ayuda después de publicarlo',
            items: [
              'Solo la construcción — agrega un [plan de hosting](#hosting-support) desde $19 al mes, o soporte Pro a $99 al mes.',
            ],
          },
        ],
        features: [
          'Página de administración',
          'Funciones extra',
          'Búsqueda en el sitio',
        ],
        checklist: [
          'Página de administración',
          'Funciones extra',
          'Búsqueda en el sitio',
        ],
        included: [
          {
            icon: 'speed-security',
            term: 'Velocidad y seguridad',
            description:
              'Endurecimiento máximo desde la primera solicitud: TLS en todas partes, HTTPS forzado para que el candado no se caiga, secretos de producción fuera de la página, y una construcción a medida sin superficie de ataque de plantillas. Los visitantes reciben un sitio rápido y cerrado; la basura de los constructores genéricos no entra.',
          },
          {
            icon: 'original-design',
            term: 'Diseño original',
            description:
              'Cada aspecto de cada decisión de diseño está informado por tus preferencias. No se deja piedra sin remover.',
          },
          {
            icon: 'branded-marketing',
            term: 'Marketing de marca completo',
            example: 'Como tu logo, enlaces de marca, un look que combine en todas las redes y una vista previa al compartir',
            description:
              'El tratamiento completo — hacemos tu logo, marcamos los enlaces y unificamos Facebook, redes, Google e impresos para que te reconozcan donde te encuentren, incluido cómo se ve el sitio cuando alguien comparte el enlace.',
            emphasis: true,
          },
          {
            icon: 'larger-site',
            term: 'Sitio más grande',
            description:
              'Páginas extra y las funciones que un sitio más grande necesita para funcionar',
          },
          {
            icon: 'admin-page',
            term: 'Página de administración',
            description:
              'Un panel privado para manejar tu contenido sin tocar código',
          },
          {
            icon: 'extra-functionality',
            term: 'Funciones extra',
            description:
              'Calendarios de reservas, calculadoras de cotización, accesos de miembros u otras herramientas integradas que tu sitio necesita',
          },
          {
            icon: 'site-search',
            term: 'Búsqueda en el sitio',
            description:
              'Una barra de búsqueda para que los visitantes encuentren lo que necesitan en un sitio más grande',
          },
          {
            icon: 'walkthrough',
            term: 'Recorrido',
            description:
              'Nos sentamos contigo en persona y te recorremos cada detalle del producto terminado hasta que te sientas cómodo usando tu herramienta a medida.',
          },
          {
            icon: 'priority-build',
            term: 'Construcción prioritaria',
            description: 'Tu proyecto empieza al frente de la fila',
          },
          {
            icon: 'revision-3',
            term: '3 rondas de revisión',
            description: 'Tres rondas de cambios después de tu primera mirada',
          },
        ],
        cta: 'Más',
      },
    },
  },
  projects: {
    'caramel-jo': {
      caption: 'Un sitio cálido de panadería que se siente como en casa en un teléfono.',
      description:
        'Sitio web a la medida para una marca de panadería — historia clara, presencia de productos y un diseño que se mantiene amigable en pantallas pequeñas.',
      features: [
        'Diseño pensado primero para móvil',
        'Página de inicio centrada en la marca',
        'Galería de productos y carrito',
        'Sistema simple de pedidos por correo',
        'Bilingüe EN / ES',
      ],
      packageLabel: 'Paquete Business · $999',
      galleryLabels: {
        '/images/caramel-jo/homepage.jpg': 'Página de inicio',
        '/images/caramel-jo/menu.jpg': 'Menú',
        '/images/caramel-jo/product-berry.jpg': 'Producto — tarta de frutos rojos',
        '/images/caramel-jo/product-key-lime.jpg': 'Producto — pay de limón',
      },
    },
    'mi-gente': {
      caption: 'Una presencia de mercado amigable con espacio para crecer.',
      description:
        'Sitio de mercado de barrio construido para la claridad — quiénes son, qué ofrecen y un camino fácil para que los clientes se acerquen.',
      features: [
        'Información del negocio, horarios y ubicaciones',
        'Galería de fotos de productos',
        'Bilingüe EN / ES',
        'Llamadas, direcciones y enlaces a redes',
      ],
      packageLabel: 'Paquete Business · $999',
      galleryLabels: {
        '/images/mi-gente/homepage.jpg': 'Página de inicio',
        '/images/mi-gente/menu.jpg': 'Menú y horarios',
        '/images/mi-gente/contact.png': 'Contacto',
        '/images/mi-gente/about.jpg': 'Nosotros',
        '/images/mi-gente/products.jpg': 'Productos',
      },
    },
  },
  api: {
    contact: {
      invalidBody: 'Solicitud inválida.',
      nameRequired: 'Por favor escribe tu nombre.',
      emailInvalid: 'Por favor escribe un correo válido.',
      phoneInvalid: 'Por favor escribe un número de teléfono válido.',
      messageEmpty: 'Por favor escribe un mensaje.',
      messageShort: 'Por favor agrega un poco más de detalle a tu mensaje.',
      success: '¡Gracias! Te responderemos pronto.',
      clientEmailSubject: 'Recibimos tu mensaje',
      clientEmailTitle: 'Gracias — recibimos tu mensaje',
      clientEmailIntro:
        'Aquí tienes una copia de lo que enviaste. Lo revisaremos y te responderemos en unas 48 horas.',
      clientEmailSignoff: '— Applicreations',
      clientEmailLinkLabel: 'Volver a Applicreations',
      emailQuestions:
        '¿Preguntas? Responde a este correo o escribe a solutions@applicreations.com.',
      ownerEmailSubject: 'Formulario de contacto: {name}',
      ownerEmailTitle: 'Nuevo mensaje de contacto',
      ownerEmailIntro: 'Alguien envió el formulario de contacto de Applicreations.',
    },
    introspect: {
      invalidBody: 'Solicitud inválida.',
      nameRequired: 'Por favor escribe tu nombre.',
      emailInvalid: 'Por favor escribe un correo válido.',
      phoneInvalid: 'Por favor escribe un número de teléfono completo de 10 dígitos.',
      success: '¡Gracias! Recibimos tus respuestas de la Introspección.',
      clientEmailSubject: 'Recibimos tus respuestas de la Introspección',
      clientEmailTitle: 'Gracias — recibimos tu Introspección',
      clientEmailIntro:
        'Estamos construyendo una demo de tu sitio a partir de tus respuestas. Revisa tu bandeja de entrada y la carpeta de spam para el enlace de vista previa. Abajo está una copia de todo lo que compartiste.',
      clientEmailSubjectRedesign: 'Recibimos tus respuestas del rediseño',
      clientEmailTitleRedesign: 'Gracias — recibimos tu Introspección de rediseño',
      clientEmailIntroRedesign:
        'Estamos construyendo una demo de tu nuevo sitio a partir de estas respuestas. Revisa tu bandeja de entrada y la carpeta de spam para el enlace de vista previa. Abajo está una copia de todo lo que compartiste.',
      clientEmailRecommendedLabel: 'Paquete sugerido',
      clientEmailPricingLabel: 'Tu selección de precios',
      clientEmailSectionRecommendation: 'Nuestra sugerencia',
      clientEmailSectionContact: 'Tú y tu negocio',
      clientEmailSectionOnline: 'Presencia en línea',
      clientEmailSectionKeepChange: 'Conservar o cambiar',
      clientEmailSectionAssets: 'Logo y fotos',
      clientEmailSectionDirection: 'Dirección del sitio',
      clientEmailSignoff: '— Applicreations',
      clientEmailLinkLabel: 'Continuar en Applicreations',
      emailQuestions:
        '¿Preguntas? Responde a este correo o escribe a solutions@applicreations.com.',
      ownerEmailSubject: 'Introspección: {business} — {plan}',
      ownerEmailTitle: 'Nueva Introspección',
      ownerEmailIntro: 'Llegó un cuestionario nuevo para {business}.',
      ownerEmailSubjectRedesign: 'Introspección rediseño: {business} — {plan}',
      ownerEmailTitleRedesign: 'Nueva Introspección de rediseño',
      ownerEmailIntroRedesign: 'Llegó un cuestionario de rediseño para {business}.',
      websiteUrlRequired: 'Por favor escribe la dirección del sitio que quieres rediseñar.',
      keepChangeRequired: 'Por favor dinos qué conservar y qué necesita cambiar.',
    },
    pricingSelection: {
      invalidBody: 'Solicitud inválida.',
      emailInvalid: 'Por favor escribe un correo válido.',
      selectionRequired: 'Por favor selecciona primero un paquete o un plan de soporte.',
      success: '¡Enviado! Revisa tu bandeja de entrada para ver el resumen de tu selección.',
      emailQuestions:
        '¿Preguntas? Responde a este correo o escribe a solutions@applicreations.com.',
      ownerEmailSubject: 'Selección de precios enviada a {email}',
      ownerEmailTitle: 'Selección de precios enviada',
      ownerEmailIntro: 'Un visitante se envió esta selección a {email}.',
    },
  },
}
