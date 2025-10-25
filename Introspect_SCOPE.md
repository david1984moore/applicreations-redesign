# Introspect: Build Strategy Scope

**Project Name:** Introspect - Intelligent Project Requirements Questionnaire  
**Project Type:** Web Application (Next.js)  
**Version:** 1.0  
**Generated:** October 24, 2025  
**Target Launch:** 6-8 weeks from start  

---

## ✅ IN SCOPE (What We're Building)

### Core Application Flow

1. **Adaptive Multi-Page Questionnaire**
   - Description: 18-question form with conditional logic that adapts to user's business type
   - Technical approach: React state machine with question branching based on Q1 answer
   - Priority: Must-have
   - Details: One question per screen on mobile, grouped sections on desktop (5 sections total)

2. **Real-Time Cost Calculator**
   - Description: Running total visible at all times, updates as user selects features
   - Technical approach: Client-side calculation engine with feature cost database
   - Priority: Must-have
   - Details: Feature costs include platform multipliers (iOS/Android 1.5x), integration costs, complexity factors

3. **Automated Scope Document Generation**
   - Description: Generate comprehensive 24-40 page PDF scope upon completion, auto-sent to solutions@applicreations.com
   - Technical approach: React-PDF or Puppeteer, structured template with user responses
   - Priority: Must-have
   - Details: Contains business context, functional requirements, technical specs, risk assessment

4. **Session Persistence System**
   - Description: Auto-save progress to localStorage, survive browser close/refresh
   - Technical approach: Debounced localStorage writes (500ms), state rehydration on load
   - Priority: Must-have
   - Details: Persist for 7 days, clear after submission

5. **Client Prototype & Spec Delivery System**
   - Description: 48-hour delivery of interactive prototype + 8-12 page PDF spec to client
   - Technical approach: Email service integration (SendGrid/Postmark) + manual prototype creation workflow
   - Priority: Must-have
   - Details: Email contains PDF attachment + prototype link, triggered by internal team after scope review

### Question Architecture & UX Patterns

6. **Trust Bank Opening Sequence (Q1-Q3)**
   - Description: Easy momentum-building questions that establish context
   - Technical approach: Q1 (business type) triggers Q2 adaptive wording, Q2 answer pre-fills Q3 with smart default
   - Priority: Must-have
   - Research basis: Zeigarnik Effect, 53% conversion rate pattern (Venture Harbour)

7. **Progressive Disclosure by Device**
   - Description: Desktop groups 3-5 questions per screen, mobile shows one at a time
   - Technical approach: CSS Grid + media queries, conditional rendering based on viewport
   - Priority: Must-have
   - Research basis: Baymard Institute—forms over 20 fields need one-thing-per-page

8. **Accessibility Compliance (WCAG 2.1 AA)**
   - Description: Keyboard navigation, screen reader support, high contrast, 44px touch targets
   - Technical approach: Semantic HTML, ARIA labels, focus management, skip links
   - Priority: Must-have
   - Details: Tab order, error announcements, clear focus indicators

### Must-Have Requirements

- **Performance:** First contentful paint <1.5s, form interaction <100ms response, cost calculation <50ms
- **Compatibility:** Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+), iOS 14+, Android 10+
- **Security:** HTTPS only, rate limiting (10 submissions/hour/IP), input sanitization, no session hijacking
- **Data Flow:** Form → localStorage → submission → Supabase → scope generation → email to solutions@applicreations.com
- **Mobile-First:** 60% of traffic expected mobile, keyboard doesn't obscure fields, smooth scrolling

### Success Criteria

- [ ] User can complete entire questionnaire without errors on mobile and desktop
- [ ] Cost calculator updates in <50ms as features are selected
- [ ] Session persists after browser close and reopens with all answers intact
- [ ] Scope PDF generates automatically within 5 seconds of form submission
- [ ] Email with scope arrives at solutions@applicreations.com within 30 seconds
- [ ] Form passes WCAG 2.1 AA automated testing (axe DevTools)
- [ ] 70%+ completion rate after Q3 (measured in analytics)
- [ ] Average completion time 4-8 minutes for typical user

---

## ❌ OUT OF SCOPE (NOT Building)

- **User authentication system** - Why: MVP users are anonymous until Q18, no login needed
- **Payment processing integration** - Why: This tool captures requirements; payment happens in sales process
- **Client portal/dashboard** - Why: Deferred to Phase 3 (post-MVP), clients receive email only for now
- **Multi-language support** - Why: Phase 2 enhancement, starting with English only
- **Voice input functionality** - Why: Phase 3 feature, requires extensive testing
- **AI chat clarification** - Why: Phase 3, structured questionnaire sufficient for MVP
- **CRM integration** - Why: Manual email handoff sufficient for launch, automate later
- **File upload for design assets** - Why: Phase 2, collect via follow-up email for now
- **Real-time collaborative editing** - Why: Phase 3, single user completing form is primary use case

---

## 🅿️ PARKING LOT (Great Ideas for Later)

1. **Save & Resume via Email Link (Phase 2)**
   - Capture email after Q3, send magic link for recovery
   - Why not now: Adds complexity, localStorage sufficient for MVP
   - Revisit when: After 1 month of data shows abandonment patterns
   - Estimated effort: 1 week

2. **Industry-Specific Question Branches (Phase 2)**
   - Restaurant-specific: Kitchen display integration, loyalty programs
   - E-commerce: Inventory, shipping, marketplace integrations
   - Why not now: 18 questions cover 80% of cases, specialization can wait
   - Revisit when: After identifying top 3 business types in data
   - Estimated effort: 2 weeks per industry

3. **A/B Testing Framework (Phase 2)**
   - Test question wording, order, grouping strategies
   - Why not now: Need baseline data first before optimizing
   - Revisit when: After 100+ completed submissions
   - Estimated effort: 1 week

4. **Regional Pricing Models (Phase 2)**
   - Adjust costs based on client location (SF 1.4x, NYC 1.3x)
   - Why not now: Starting with base pricing, expand after validation
   - Revisit when: Expanding beyond local market
   - Estimated effort: 1 week

---

## 📋 Technical Stack & Constraints

**Frontend Framework:** Next.js 14 (App Router)  
**Language:** TypeScript (strict mode)  
**Styling:** Tailwind CSS (utility-first, mobile-first approach)  
**State Management:** React Context + useReducer (no external state library)  
**Forms:** React Hook Form + Zod validation  
**Database:** Supabase (PostgreSQL, real-time subscriptions)  
**Email Service:** SendGrid or Postmark (scope delivery)  
**PDF Generation:** React-PDF or Puppeteer (scope document)  
**Analytics:** Plausible or Simple Analytics (privacy-focused)  
**Hosting:** Vercel (serverless, edge functions)  
**Domain:** introspect.applicreations.com  

**Design Constraints:**
- Jobs/Ives principle: Invisible sophistication, effortless progress
- No celebratory animations or visual clutter
- Plain English at 6th-8th grade reading level
- Helper text only where it adds measurable value
- Professional design builds trust (no playful illustrations)

**Performance Budget:**
- Initial bundle size: <250KB gzipped
- Time to interactive: <3s on 4G connection
- Lighthouse score: 90+ across all metrics

---

## 🎯 Assumptions & Dependencies

**We assume:**
- Users have modern browser (released within last 3 years)
- JavaScript enabled (progressive enhancement not required for MVP)
- User completes form in single session (session recovery is enhancement)
- Solutions@applicreations.com monitored daily for incoming scopes
- Manual prototype creation workflow in place (team creates Figma mockups within 48 hours)

**Team provides:**
- [ ] Feature cost database (CSV or JSON with all pricing data)
- [ ] Scope document template (structured format for PDF generation)
- [ ] Email template copy (for client prototype delivery)
- [ ] Brand assets (logo, colors, typography) for questionnaire interface
- [ ] Content for Q1 business type options (finalized list of 8-12 categories)

**Blockers if missing:**
- Feature cost data → Cannot calculate real-time costs
- Scope template → Cannot generate consistent documents
- Email copy → Cannot deliver client-facing materials
- Team bandwidth → 48-hour delivery promise fails

---

## 🔍 DEVELOPER REVIEW NEEDED

**Technical decisions to validate:**
- [ ] Supabase vs. Firebase vs. custom API (database choice)
- [ ] React-PDF vs. Puppeteer (PDF generation approach—tradeoffs in complexity vs. control)
- [ ] SendGrid vs. Postmark vs. AWS SES (email service—cost vs. deliverability)
- [ ] Client-side vs. server-side cost calculation (security vs. performance)
- [ ] localStorage vs. cookies vs. sessionStorage (persistence mechanism)

**Question architecture to finalize:**
- [ ] Exact wording for all 18 questions (provided in research doc but needs product owner approval)
- [ ] Feature list for Q6-Q13 (must match cost database exactly)
- [ ] Conditional logic rules (when do Q9, Q11-Q12 appear?)
- [ ] Budget range options for Q16 (must align with realistic project costs)
- [ ] Timeline options for Q17 (must be achievable by team)

**Integration details needed:**
- [ ] solutions@applicreations.com inbox setup (forwarding, monitoring)
- [ ] Domain DNS configuration (introspect.applicreations.com → Vercel)
- [ ] Analytics account setup (Plausible or Simple Analytics)
- [ ] Email service API keys (SendGrid/Postmark)
- [ ] Error monitoring service (Sentry or LogRocket)

**Design assets required:**
- [ ] Logo/branding for questionnaire header
- [ ] Color palette (primary, secondary, accent, neutral grays)
- [ ] Typography (headings, body, mono for code examples if needed)
- [ ] Icon set for feature selection checkboxes
- [ ] Loading states and micro-interactions

---

## 📐 Implementation Phases

### Phase 1: Core Questionnaire (Week 1-2)
- Build question flow with state management
- Implement adaptive Q2 wording based on Q1
- Create smart default for Q3 from Q2 analysis
- Session persistence in localStorage
- Mobile-first responsive layout

### Phase 2: Cost Calculation Engine (Week 2-3)
- Feature cost database integration
- Real-time calculation with multipliers
- Running total UI component
- Platform/complexity cost adjustments

### Phase 3: Document Generation (Week 3-4)
- Scope PDF template creation
- Data mapping from form to document
- PDF generation pipeline (React-PDF/Puppeteer)
- Email delivery integration

### Phase 4: Polish & Testing (Week 4-5)
- Accessibility audit and fixes
- Performance optimization
- Cross-browser testing
- Mobile device testing
- Error handling and edge cases

### Phase 5: Analytics & Launch (Week 5-6)
- Analytics integration (field-level tracking)
- Launch checklist execution
- Monitoring setup
- Soft launch with limited traffic

### Phase 6: Post-Launch Optimization (Week 7-8)
- First week data analysis
- A/B test planning for Phase 2
- Bug fixes and quick wins
- Documentation for team handoff

---

## 📊 Key Metrics to Track

**Form Performance:**
- Completion rate (target: 70%+ after Q3)
- Average completion time (target: 4-8 minutes)
- Drop-off by question (identify problem questions)
- Mobile vs. desktop completion rates

**Technical Performance:**
- Page load time (target: <1.5s)
- Cost calculation speed (target: <50ms)
- PDF generation time (target: <5s)
- Error rate (target: <1% of submissions)

**Business Outcomes:**
- Total submissions per week
- Budget distribution (which ranges most common?)
- Business type distribution
- Features selected most frequently

---

## 🚨 Critical Success Factors

1. **Cost Transparency:** Users must see real-time costs without surprise at end
2. **Mobile Excellence:** 60% of traffic is mobile—must work flawlessly on phones
3. **Trust Building:** Professional design, clear language, no dark patterns
4. **Completion Rate:** If users abandon after Q3, questionnaire has failed
5. **48-Hour Delivery:** Team must execute prototype creation reliably
6. **Scope Quality:** Generated documents must be accurate enough for team to build from

---

## 🛡️ Risk Mitigation

**Risk:** Users abandon questionnaire mid-flow  
**Mitigation:** Session persistence, momentum-building opening, progress visibility without counts

**Risk:** Cost calculation overwhelms/confuses users  
**Mitigation:** Show running total, not itemized breakdown; add cost only when features selected

**Risk:** Generated scopes are inaccurate or incomplete  
**Mitigation:** Structured template, comprehensive question coverage, manual review before client delivery

**Risk:** Email delivery fails (spam filters, bounce)  
**Mitigation:** Reputable email service, SPF/DKIM/DMARC setup, confirmation page with "email sent" message

**Risk:** Mobile keyboard obscures form fields  
**Mitigation:** Scroll into view on focus, viewport-aware positioning, test on multiple devices

**Risk:** Accessibility violations block users  
**Mitigation:** Build with accessibility from start, automated testing, keyboard navigation testing

---

**Current scope locked:** ✅ Yes  
**Next review:** After first 100 submissions and 1 month of data  
**Change requests:** Routed through product owner approval process  

---

**This scope represents the minimal viable product to validate the Introspect concept. All enhancements are explicitly deferred to Phase 2 or Phase 3 to ensure focused, quality execution of core functionality.**
