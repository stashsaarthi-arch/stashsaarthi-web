# Graph Report - .  (2026-09-13)

## Corpus Check
- 360 files · ~3,70,652 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1636 nodes · 3059 edges · 152 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output
- Edge kinds: contains: 1227 · imports: 769 · imports_from: 650 · calls: 230 · method: 42 · rationale_for: 42 · re_exports: 34 · reads_from: 25 · conceptually_related_to: 20 · references: 11 · inherits: 6 · uses: 2 · triggers: 1


## Input Scope
- Requested: auto
- Resolved: all (source: default-auto)
- Included files: 360 · Candidates: recursive
- Excluded: 0 untracked · 0 ignored · 6 sensitive · 0 missing committed
## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 90 edges
2. `Button` - 50 edges
3. `Badge()` - 25 edges
4. `cn()` - 25 edges
5. `usePersona()` - 24 edges
6. `playPop()` - 17 edges
7. `GeminiHandler` - 16 edges
8. `DialogContent` - 16 edges
9. `DialogTitle` - 16 edges
10. `Input` - 16 edges

## Surprising Connections (you probably didn't know these)
- `AGENT_REPORTS` --conceptually_related_to--> `reportLines`  [INFERRED]
  ai_workforce/AGENT_REPORTS.md → execution/audit-vulnerabilities.mjs
- `AGENT_REPORTS` --conceptually_related_to--> `reportPath`  [INFERRED]
  ai_workforce/AGENT_REPORTS.md → execution/audit-vulnerabilities.mjs
- `AGENTS` --conceptually_related_to--> `AGENTS`  [INFERRED]
  AGENTS.md → ai_workforce/orchestrator.js
- `EXECUTIVE_DASHBOARD` --conceptually_related_to--> `BOARD_FILE`  [INFERRED]
  EXECUTIVE_DASHBOARD.md → ai_workforce/engine.js
- `AGENT_REPORTS` --conceptually_related_to--> `REPORT_FILE`  [INFERRED]
  ai_workforce/AGENT_REPORTS.md → ai_workforce/orchestrator.js

## Communities

### Community 0 - "BaseHTTPRequestHandler / gemini_web2api.py / accou"
Cohesion: 0.06
Nodes (34): BaseHTTPRequestHandler, account_prefix(), clean_gemini_text(), extract_response_text(), gemini_stream_generate(), gemini_stream_generate_iter(), GeminiHandler, load_config() (+26 more)

### Community 1 - "connectAudioEngine.ts / AudioCompressorTelemetry /"
Cohesion: 0.06
Nodes (39): AudioCompressorTelemetry, calculateMOS(), detectNetworkTier(), NETWORK_PROFILES, NetworkProfile, NetworkTier, playCompressedVoicePreview(), getAppleMapsDirectionsUrl() (+31 more)

### Community 2 - "extendedBreakUpsell.ts / calculateExtendedBreakDis"
Cohesion: 0.06
Nodes (36): ActivityTicker, BookingModal, DualCrisis, EarlyAccessModal, ExitIntentModal, FamilyDashboard, FAQ, FeedbackSuggestions (+28 more)

### Community 3 - "apiPenTestEngine.ts / PenTestReport / runApiPenTes"
Cohesion: 0.08
Nodes (27): PenTestReport, runApiPenTest(), VectorAuditResult, consumeLastCapturedError(), describeError(), describeStatus(), originalConsoleError, safeStringify() (+19 more)

### Community 4 - "index.tsx / ActivityTicker / BookingModal"
Cohesion: 0.07
Nodes (24): useCountUp(), ALL_THALI_VARIANTS, ALL_VARIANTS, HeroCtaVariant, ThaliPriceLabelVariant, trackCtaClick(), useHeroCtaVariant(), AnimatedStat() (+16 more)

### Community 5 - "DataPrivacyCommitment.tsx / DataPrivacyCommitment("
Cohesion: 0.11
Nodes (22): DataPrivacyCommitment(), FamilyDashboard, FEATURE_ICONS, FounderAccountability(), HostRules, ICONS, HostVettingFlow, VettingStage (+14 more)

### Community 6 - "ThemeContext.tsx / defaultContextValue / Theme"
Cohesion: 0.09
Nodes (19): calculateExtendedBreakDiscount(), ExtendedBreakQuote, getExtendedBreakUpsellMessage(), calculateLocationPricingQuote(), DynamicPricingQuote, fetchLocationPricingQuoteFromSupabase(), getZoneTierBadge(), LocationQuoteParams (+11 more)

### Community 7 - "useAuth.tsx / AuthContext / AuthUser"
Cohesion: 0.11
Nodes (22): FeedbackSuggestions, INITIAL_REVIEWS, INITIAL_SUGGESTIONS, ReviewItem, SuggestionItem, KakadeoSurvivalGuide(), KakadeoSurvivalGuideModalProps, DOCS (+14 more)

### Community 8 - "CampusCaptainModal.tsx / CampusCaptainModal() / In"
Cohesion: 0.13
Nodes (18): checkAndRecordRateLimit(), logSupabaseError(), queueOfflineSubmission(), sanitizePayload(), SupabaseLogPayload, GoogleProfile, isCollegeEmail(), isNetworkError() (+10 more)

### Community 9 - "LowDataContext.tsx / defaultContext / detectLowDat"
Cohesion: 0.12
Nodes (18): defaultContext, isLowDataModeEnabled(), LowDataContext, LowDataContextType, LowDataProvider(), useLowData(), AndroidGoDiagnostics, diagnoseAndroidGo() (+10 more)

### Community 10 - "PersonaContext.tsx / defaultContextValue / Persona"
Cohesion: 0.10
Nodes (17): defaultContextValue, PersonaContext, PersonaContextType, Role, usePersona(), ExitIntentModalProps, FloatingPersonaToggle, PredictivePersonaWidget (+9 more)

### Community 11 - "constants.ts / getWhatsAppUrl() / terms.tsx"
Cohesion: 0.14
Nodes (18): showRateLimitToast(), insertWaitlistUser(), isDuplicateEmailError(), isValidEmail(), isValidPhone(), showNetworkRetryToast(), upsertGoogleUser(), CampusCaptainModal() (+10 more)

### Community 12 - "useCountUp.ts / useCountUp() / abTesting.ts"
Cohesion: 0.13
Nodes (14): getWhatsAppUrl(), HostPayoutCharterModalProps, ChatMessage, RagChatbotWidget, DEFAULT_SCENES, Room360Viewer(), Room360ViewerProps, RoomHotspot (+6 more)

### Community 13 - "Route / Route / Route"
Cohesion: 0.09
Nodes (22): Route, Route, Route, Route, getRouter(), AdminRoute, FileRoutesByFullPath, FileRoutesById (+14 more)

### Community 14 - "gemini.py / _account_prefix() / _build_headers()"
Cohesion: 0.11
Nodes (18): COUNCIL_META, Route, AuthButton(), BookingModal(), EarlyAccessModal(), FooterSection, NAV_LINKS, Navbar (+10 more)

### Community 15 - "interactionTelemetry.ts / ComponentInteractionReco"
Cohesion: 0.14
Nodes (19): BentoDescriptionProps, BentoGridProps, BentoHeaderProps, BentoTitleProps, ButtonProps, buttonVariants, Chip(), ChipProps (+11 more)

### Community 16 - "auth-middleware.ts / createSupabaseFetch() / isNew"
Cohesion: 0.18
Nodes (21): _account_prefix(), _build_headers(), _build_payload(), clean_text(), extract_response_text(), _extract_texts_from_line(), generate(), generate_stream() (+13 more)

### Community 17 - "LanguageContext.tsx / defaultContextValue / Langua"
Cohesion: 0.13
Nodes (16): defaultContextValue, Language, LanguageContext, LanguageContextType, translations, useLanguage(), CalculatorHub, CrisisCard (+8 more)

### Community 18 - "getContactedIds() / toggleContacted() / admin.tsx"
Cohesion: 0.12
Nodes (14): requireSupabaseAuth, createSupabaseAdminClient(), createSupabaseFetch(), supabaseAdmin, CompositeTypes, Constants, Database, DatabaseWithoutInternals (+6 more)

### Community 19 - "predictiveAI.ts / FeatureVector / MODEL_WEIGHTS"
Cohesion: 0.12
Nodes (12): getContactedIds(), toggleContacted(), AndroidGoPerfModal, ApiPenTestModal, BookingCard(), COLOR_CLASSES, EdgeRegionMonitorWidget, ExecutiveAnalyticsDashboard (+4 more)

### Community 20 - "LanguageProvider() / PersonaProvider() / AuthProvi"
Cohesion: 0.15
Nodes (13): FeatureVector, MODEL_WEIGHTS, normalizeFeatures(), PersonaTelemetryEngine, PredictedPersona, PredictionResult, predictPersonaML(), preloadedCache (+5 more)

### Community 21 - "tools.py / _build_tool_choice_instruction() / buil"
Cohesion: 0.16
Nodes (8): LanguageProvider(), PersonaProvider(), AuthProvider(), coLivingItemListSchema, coLivingSpacesSchema, DynamicOGHead(), NetworkStatus(), PageTransition()

### Community 22 - "localSubmissions.ts / AdminStats / deleteBooking()"
Cohesion: 0.13
Nodes (17): _build_tool_choice_instruction(), build_tool_prompt(), _compress_b64_if_needed(), google_contents_to_prompt(), _google_tool_choice_instruction(), messages_to_prompt(), parse_google_function_calls(), parse_tool_calls() (+9 more)

### Community 23 - "intelligentNudges.ts / buildWhatsAppNudgeTemplate("
Cohesion: 0.23
Nodes (17): AdminStats, deleteBooking(), getAdminStats(), getBookings(), getMealOrders(), getReviews(), getSuggestions(), getWaitlistEntries() (+9 more)

### Community 24 - "visitorTracking.ts / buildInitialSession() / detec"
Cohesion: 0.21
Nodes (13): buildWhatsAppNudgeTemplate(), claimActiveNudgeToken(), fetchSupabaseInactiveStudents(), generateNudgeTokenCode(), getActiveClaimedNudgeToken(), getDaysSinceLastOrder(), getWhatsAppNudgeUrlForStudent(), isStudentEligibleForNudge() (+5 more)

### Community 25 - "AuthButton.tsx / GoogleGlyph() / ProfileModal()"
Cohesion: 0.22
Nodes (16): buildInitialSession(), detectBrowser(), detectDeviceType(), detectOS(), fetchVisitorSessions(), flushToSupabase(), getCityHintFromTimezone(), getOrCreateSessionId() (+8 more)

### Community 26 - "ToastContext.tsx / listeners / notifyListeners()"
Cohesion: 0.17
Nodes (12): ProfileModal(), Avatar, AvatarFallback, AvatarImage, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel (+4 more)

### Community 27 - "accessibility.ts / Announcement / announceToScreen"
Cohesion: 0.13
Nodes (10): listeners, toast, ToastContext, ToastContextType, ToastItem, ToastListener, ToastOptions, ToastProvider() (+2 more)

### Community 28 - "audio.ts / getAudioContext() / playClick()"
Cohesion: 0.21
Nodes (13): contrast, hostAudit, parsed, studentAudit, auditSurfaceContrastHarmony(), checkContrast(), ContrastResult, generateSurfaceHarmonyScale() (+5 more)

### Community 29 - "hostVettingPolicy.ts / clearHostAgreement() / gene"
Cohesion: 0.14
Nodes (7): Announcement, announceToScreenReader(), Listener, Politeness, ScreenReaderAnnouncerBus, srAnnouncerBus, AccessibilityAnnouncer()

### Community 30 - "FeedbackSuggestions.tsx / FeedbackSuggestions / IN"
Cohesion: 0.19
Nodes (10): getAudioContext(), playClick(), playPop(), DeliveryCutoffCountdown(), DeliveryCutoffCountdownProps, PeacockFeatherMatkiDustingProps, StudentTestimonialVideosWidget(), TESTIMONIAL_VIDEOS (+2 more)

### Community 31 - "TasteShieldModal.tsx / ISSUE_OPTIONS / POSITIVE_TA"
Cohesion: 0.19
Nodes (11): generateHostAgreementId(), getHostAgreement(), HostAgreementRecord, HostPolicyTier, HostVettingPolicyCharter, OFFICIAL_HOST_VETTING_POLICY, saveHostAgreement(), HostOnboardingAgreementModal() (+3 more)

### Community 32 - "tiffin-services-near-allen.tsx / ALLEN_CONFIG / Al"
Cohesion: 0.13
Nodes (13): designTokensContent, designTokensPath, footerContent, footerPath, heroContent, heroPath, navbarContent, navbarPath (+5 more)

### Community 33 - "ceoAnalytics.ts / calculateExecutiveMetrics() / Ch"
Cohesion: 0.13
Nodes (13): designTokensContent, designTokensPath, __dirname, __filename, heroContent, heroPath, rootDir, sectionWrapperContent (+5 more)

### Community 34 - "offlineBookingQueue.ts / enqueueOfflineBooking() /"
Cohesion: 0.17
Nodes (12): auditResult, badgeClass, badgeContent, chipContent, pillBadgeContent, priceData, stylesContent, auditMicroCopyElements() (+4 more)

### Community 35 - "utils.ts / cn() / Tilt3D.tsx"
Cohesion: 0.13
Nodes (13): bentoGridContent, bentoGridPath, designTokensContent, designTokensPath, __dirname, __filename, primitivesContent, primitivesPath (+5 more)

### Community 36 - "BookingModal() / CoachingHubTiffinPage.tsx / Foote"
Cohesion: 0.21
Nodes (11): ISSUE_OPTIONS, POSITIVE_TAGS, TasteShieldModalProps, getUserShieldQuota(), RefundStatus, submitTasteShieldClaim(), TasteShieldClaimRequest, TasteShieldClaimResult (+3 more)

### Community 37 - "test-offline-pwa-sync.mjs / assert() / bookingModa"
Cohesion: 0.14
Nodes (12): designTokensContent, designTokensPath, __dirname, ecosystemContent, ecosystemPath, __filename, primitivesContent, primitivesPath (+4 more)

### Community 38 - "dataRetentionEngine.ts / auditInactiveStudentData("
Cohesion: 0.14
Nodes (12): designTokensContent, designTokensPath, __dirname, __filename, primitivesContent, primitivesPath, requiredCssUtilities, rootDir (+4 more)

### Community 39 - "ActivityTicker.tsx / ACTIVITIES / ActivityItem"
Cohesion: 0.20
Nodes (8): cn(), Separator, Slider, Toggle, toggleVariants, TooltipContent, TruncatedText(), TruncatedTextProps

### Community 40 - "engine.js / BOARD_FILE / LOG_FILE"
Cohesion: 0.16
Nodes (8): ALLEN_CONFIG, Route, MOTION_CONFIG, Route, PW_CONFIG, Route, CoachingHubTiffinPage(), HubConfig

### Community 41 - "sop_elderly_host_home_audit / sop_saarthi_kitchen_"
Cohesion: 0.20
Nodes (11): NodeBase, NodeKey, NODES_BASE, Props, Tilt3D, BentoCard, BentoCardProps, BentoDescription (+3 more)

### Community 42 - "test-multilingual-rag.mjs / testQueries / ragChatb"
Cohesion: 0.15
Nodes (12): bentoComponentPath, designTokensContent, designTokensPath, __dirname, ecosystemContent, ecosystemPath, __filename, primitivesContent (+4 more)

### Community 43 - "trackPersonaLayoutRecording() / Connect() / Ecosys"
Cohesion: 0.15
Nodes (11): cssContent, cssPath, __dirname, __filename, optContent, optPath, rootDir, tokensContent (+3 more)

### Community 44 - "csoKitchenSealingService.ts / CsoAuditInput / CsoK"
Cohesion: 0.15
Nodes (11): cssContent, cssPath, __dirname, __filename, langCtxContent, langCtxPath, rootDir, tokensContent (+3 more)

### Community 45 - "dataPrivacyAudit.ts / AuditCheckItem / auditUserDa"
Cohesion: 0.21
Nodes (10): calculateExecutiveMetrics(), ChannelCacMetric, DEFAULT_CHANNEL_CAC, DEFAULT_SERVICE_LTV, DEFAULT_SPRINTS, ExecutiveAnalyticsData, exportExecutiveAnalyticsJson(), ServiceLtvMetric (+2 more)

### Community 46 - "sw.js / cacheFirst() / cacheFirstImage()"
Cohesion: 0.26
Nodes (11): enqueueOfflineBooking(), flushOfflineBookingQueue(), getPendingOfflineBookings(), initOfflineQueueAutoSync(), OfflineBookingPayload, OfflineBookingRecord, openOfflineBookingDB(), registerBackgroundPeriodicSync() (+3 more)

### Community 47 - "error-reporting.ts / reportError() / ErrorBoundary"
Cohesion: 0.29
Nodes (10): testQueries, extractPhrases(), generateRagResponse(), HINGLISH_TRANSLITERATION_MAP, KNOWLEDGE_BASE, KnowledgeChunk, normalizeHinglishTokens(), RagResponse (+2 more)

### Community 48 - "rateLimiter.ts / checkRateLimit() / DEFAULT_CONFIG"
Cohesion: 0.17
Nodes (10): bookingModalPath, bookingModalSource, offlineQueuePath, queueSource, rootPath, rootSource, swPath, swRegisterPath (+2 more)

### Community 49 - "stashWallet.ts / applyTrialTokenToCheckout() / can"
Cohesion: 0.30
Nodes (10): auditInactiveStudentData(), DATA_RETENTION_CATEGORIES, DataRetentionCategory, executeAutoPurge18Months(), getLastRetentionPurgeResult(), InactiveRecordAudit, initAutoDataRetentionPurge(), RetentionPurgeResult (+2 more)

### Community 50 - "20260903_taste_shield_and_meal_reviews.sql / publi"
Cohesion: 0.18
Nodes (7): FONT_PRELOAD_CONFIG, FONT_SPECS, FontLoadingStats, FontPreloadConfig, FontSpec, initFontOptimization(), injectFontMetricOverrides()

### Community 51 - "supabase_taste_shield_migration.sql / public.meal_"
Cohesion: 0.20
Nodes (10): BOARD_FILE, LOG_FILE, runSprint(), startDaemon(), TASK_BOARD, autonomous_engine, EXECUTIVE_DASHBOARD, pricing_engine (+2 more)

### Community 52 - "audit-vulnerabilities.mjs / cleanEnv / __dirname"
Cohesion: 0.18
Nodes (9): sop_elderly_host_home_audit, sop_saarthi_kitchen_hygiene_audit, KNOWN_TABLES, MIGRATIONS_DIR, SENSITIVE_TABLES, sqlFiles, tablePolicies, tableRlsStatus (+1 more)

### Community 53 - "multimodal.py / _cached_page_tokens() / fetch_imag"
Cohesion: 0.18
Nodes (10): cssContent, cssPath, designTokensContent, designTokensPath, hostDepth, hostMesh, requiredCssUtilities, requiredExports (+2 more)

### Community 54 - "cache.ts / CacheEnvelope / CacheOptions"
Cohesion: 0.18
Nodes (9): cssContent, cssPath, __dirname, __filename, optContent, optPath, rootContent, rootDir (+1 more)

### Community 55 - "kakadeo-survival-guide.tsx / GUIDEO_META / Kakadeo"
Cohesion: 0.22
Nodes (8): AuthContext, AuthUser, AuthValue, useAuth(), MyBookingsDashboard, ProfileModalProps, ProfileTab, ReferralPill()

### Community 56 - "sheet.tsx / SheetContent / SheetContentProps"
Cohesion: 0.33
Nodes (8): CsoAuditInput, CsoKitchenSealCertificate, DEFAULT_SEALED_NODES, getAllSealedKitchenNodes(), getSealForNode(), sealKitchenNode(), verifyBarcodeSerial(), CsoKitchenSealModalProps

### Community 57 - "AGENTS / REPORT_FILE / REPORT_FILE"
Cohesion: 0.31
Nodes (9): AuditCheckItem, auditUserDataLawfulness(), DsarRequest, getDsarRequests(), PRIVACY_AUDIT_CHECKS, runDataPrivacyAudit(), submitDsarRequest(), UserDataLawfulnessReport (+1 more)

### Community 58 - "orchestrator.js / log_activity() / loop()"
Cohesion: 0.24
Nodes (7): cacheFirst(), cacheFirstImage(), imageFallback(), networkFirst(), offlineFallback(), pendingImageRequests, PRECACHE_URLS

### Community 59 - "deploy-edge-functions-multi-region.mjs / allRegion"
Cohesion: 0.20
Nodes (9): designTokensContent, designTokensPath, requiredUtilities, requiredVariables, rootDir, stylesContent, stylesCssPath, typographyComponentPath (+1 more)

### Community 60 - "BookingRecord / storageQrValidator.ts / getStorage"
Cohesion: 0.22
Nodes (5): reportError(), Component, ErrorBoundary, Props, State

### Community 61 - "mealPersonalization.ts / calculatePersonalizationT"
Cohesion: 0.33
Nodes (9): checkRateLimit(), DEFAULT_CONFIG, getStorageKey(), getTimestamps(), memoryStore, RateLimitConfig, recordSubmission(), resetRateLimit() (+1 more)

### Community 62 - "20260818080416_653af444-3317-4b54-8474-6e73a111e19"
Cohesion: 0.33
Nodes (9): applyTrialTokenToCheckout(), canClaimZeroFeeTrialToken(), claimZeroFeeTrialToken(), consumeTrialTokenOnBooking(), DEFAULT_WALLET, getStashWallet(), saveStashWallet(), StashWalletState (+1 more)

### Community 63 - "SaarthiKitchenSchema.tsx / SaarthiKitchenSchema()"
Cohesion: 0.42
Nodes (9): public.meal_bookings, public.meal_reviews, public.meal_vendors, public.process_taste_shield_claim(), public.user_shield_quotas, Quota, v_booking, v_quota (+1 more)

### Community 64 - "FAQ.tsx / FAQ / FAQ_ITEMS"
Cohesion: 0.42
Nodes (9): public.meal_bookings, public.meal_reviews, public.meal_vendors, public.process_taste_shield_claim(), public.user_shield_quotas, Quota, v_booking, v_quota (+1 more)

### Community 65 - "generate-og-images.mjs / createAdminSVG() / create"
Cohesion: 0.25
Nodes (7): defaultContextValue, Theme, ThemeContext, ThemeContextType, ThemeProvider(), useTheme(), ThemeToggle

### Community 66 - "test-data-retention-policy.mjs / engineContent / e"
Cohesion: 0.22
Nodes (8): cleanEnv, __dirname, __filename, isStrict, rootDir, runBuild, timestamp, tmpDir

### Community 67 - "MealOrderRecord / WaitlistRecord / MyBookingsDashb"
Cohesion: 0.22
Nodes (8): baseDir, buttonContent, chipContent, expectedExports, filesToCheck, iconButtonContent, pillBadgeContent, primitivesContent

### Community 68 - "20260907_data_retention_auto_purge.sql / public.co"
Cohesion: 0.22
Nodes (8): designTokensContent, designTokensPath, expectedUtilities, expectedVariables, hostGlow, studentGlow, stylesCssContent, stylesCssPath

### Community 69 - "DualCrisis.tsx / CrisisCard / DualCrisis"
Cohesion: 0.28
Nodes (8): _cached_page_tokens(), fetch_image_bytes(), _get_page_tokens(), Multimodal: Scotty resumable upload for Gemini image input., Fetch image from URL., Fetch WIZ_global_data tokens from Gemini page (Push-ID, X-Client-Pctx)., Upload image via Scotty resumable upload. Returns file reference path., upload_image()

### Community 70 - "skeleton.tsx / CardSkeleton() / MealCardSkeleton()"
Cohesion: 0.36
Nodes (8): CacheEnvelope, CacheOptions, getCached(), getOrSet(), invalidateCached(), isUpstashConfigured(), memoryCache, setCached()

### Community 71 - "runner.js / CONTROL_FILE / isSystemActive()"
Cohesion: 0.22
Nodes (7): SheetContent, SheetContentProps, SheetDescription, SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 72 - "run-api-pentest.mjs / computeQuote() / parseAndVal"
Cohesion: 0.25
Nodes (8): AGENTS, REPORT_FILE, REPORT_FILE, AGENT_REPORTS, AGENTS, cmo_agent, reportLines, reportPath

### Community 73 - "test-executive-analytics.mjs / adminContent / ceoA"
Cohesion: 0.36
Nodes (7): log_activity(), loop(), readState(), run_workforce_cycle(), STATE_FILE, writeState(), 01_CEO_ORCHESTRATOR

### Community 74 - "config.py / find_config() / load_config()"
Cohesion: 0.25
Nodes (7): allRegions, __dirname, __filename, isCheckOnly, manifest, manifestPath, rootDir

### Community 75 - "ragChatbotEngine.ts / ChatMessage / FAQ_KNOWLEDGE_"
Cohesion: 0.32
Nodes (5): ComponentInteractionRecord, flushTelemetryBuffer(), getTelemetrySessionId(), interactionBuffer, recordInteraction()

### Community 76 - "KanpurStudentCouncil.tsx / COUNCIL_MEMBERS / Counc"
Cohesion: 0.36
Nodes (6): BookingRecord, getStorageQrCodeUrl(), StorageQrScanResult, verifyStorageQrCode(), StashPassItem, StashPassProps

### Community 77 - "ReferralLeaderboard.tsx / LEADERBOARD_ALL_TIME / L"
Cohesion: 0.36
Nodes (5): calculatePersonalizationTotal(), MEAL_PERSONALIZATION_OPTIONS, MealPersonalization, MealPersonalizationSelector(), MealPersonalizationSelectorProps

### Community 78 - "seo-keywords.ts / getOptimalSEO() / LONG_TAIL_SEO_"
Cohesion: 0.43
Nodes (6): HostPhotoVerificationResult, runClientHeuristicVisionAI(), SAMPLE_PROPERTY_PHOTOS, SamplePhotoPreset, verifyHostPropertyPhoto(), VisionAiPhotoVerifier

### Community 79 - "webgl-fallback.ts / diagnoseWebGL() / initWebGLSaf"
Cohesion: 0.46
Nodes (7): auth.users, on_auth_user_created, public.co_living_inquiries, public.crowdsourced_room_listings, public.handle_new_user(), public.profiles, public.stash_bookings

### Community 80 - "20260906_location_pricing_tiers.sql / public.campu"
Cohesion: 0.29
Nodes (5): SaarthiKitchenSchema(), SaarthiKitchenSchemaProps, INITIAL_KITCHENS, TopKitchen, TopRatedKitchensWidgetProps

### Community 81 - "privacy.tsx / PrivacyPage() / PrivacyPageWrapped()"
Cohesion: 0.36
Nodes (6): FAQ, FAQ_ITEMS, FAQItem, AccordionContent, AccordionItem, AccordionTrigger

### Community 82 - "index.ts / CORS_HEADERS / generateHeuristicVisionR"
Cohesion: 0.43
Nodes (6): createAdminSVG(), createHostSVG(), createStudentSVG(), generateAll(), PUBLIC_IMAGES, ROOT

### Community 83 - "find_keys.js / content / fs"
Cohesion: 0.29
Nodes (6): designTokensContent, designTokensPath, expectedUtilities, expectedVariables, stylesCssContent, stylesCssPath

### Community 84 - "models.py / Model definitions and mapping from Gem"
Cohesion: 0.29
Nodes (6): engineContent, enginePath, privacyContent, privacyPath, sqlContent, sqlPath

### Community 85 - "kitchenSwStressTest.ts / KITCHEN_TEST_IMAGE_URLS /"
Cohesion: 0.29
Nodes (6): trackPersonaLayoutRecording(), Connect(), Ecosystem(), Rooms(), SolutionsHub, SolutionsHubProps

### Community 86 - "20260907_sensitive_data_rls_audit.sql / pg_policie"
Cohesion: 0.29
Nodes (4): MealOrderRecord, WaitlistRecord, SERVICE_LABELS, Tab

### Community 87 - "generate-responsive-images.mjs / IMAGE_SPECS / ROO"
Cohesion: 0.52
Nodes (6): public.component_interaction_telemetry, public.stash_bookings, public.users_waitlist, public.visitor_sessions, public.waitlist_leads, purge_inactive_student_data_18_months()

### Community 88 - "sonner.tsx / Toaster() / ToasterProps"
Cohesion: 0.33
Nodes (4): FounderEscalationWidget, OptimizedImage, OptimizedImageProps, SrcSetEntry

### Community 90 - "verify-android-go-perf.mjs / assert()"
Cohesion: 0.29
Nodes (6): gradientUtilityMap, SectionHeader(), SectionHeaderProps, Typography, TypographyProps, variantElementMap

### Community 91 - "__init__.py / gemini-web2api: Gemini Web to OpenAI"
Cohesion: 0.47
Nodes (5): CONTROL_FILE, isSystemActive(), logActivity(), runAutonomousEngine(), DAEMON_CONTROL

### Community 93 - "20260815080735_4b05d7d6-2132-43b9-ac90-cfb62ff6f1e"
Cohesion: 0.33
Nodes (5): adminContent, ceoAnalyticsContent, ceoAnalyticsPath, dashboardContent, executiveDashboardPath

### Community 94 - "20260826_create_users_waitlist.sql / public.users_"
Cohesion: 0.33
Nodes (5): heroContent, heroPath, rootDir, switcherContent, switcherPath

### Community 95 - "20260906_component_interaction_telemetry.sql / pub"
Cohesion: 0.33
Nodes (5): floatingContent, floatingLuggagePath, heroContent, heroPath, rootDir

### Community 96 - "20260907_visitor_sessions.sql / visitor_sessions"
Cohesion: 0.33
Nodes (5): find_config(), load_config(), Configuration management., Load config from JSON file., Search for config file in standard locations.

### Community 97 - "vite.config.ts / manualChunks()"
Cohesion: 0.40
Nodes (5): ChatMessage, FAQ_KNOWLEDGE_BASE, generateRagResponse(), KnowledgeChunk, retrieveRagContext()

### Community 98 - "00_AUTONOMOUS_LOOP_PROTOCOL"
Cohesion: 0.33
Nodes (5): COUNCIL_MEMBERS, CouncilMember, INITIAL_PROPOSALS, KanpurStudentCouncil(), StudentProposal

### Community 99 - "02_CTO_TECH_ARCHITECT"
Cohesion: 0.33
Nodes (4): CategoryFilter, COMPARISON_ROWS, ComparisonRow, PgComparisonTableProps

### Community 100 - "03_CMO_GROWTH_LEAD"
Cohesion: 0.33
Nodes (4): LEADERBOARD_ALL_TIME, LEADERBOARD_THIS_MONTH, LeaderboardEntry, AnimatedContent

### Community 101 - "04_CPO_PRODUCT_UX_LEAD"
Cohesion: 0.40
Nodes (4): content, designDocPath, projectRoot, requiredSections

### Community 102 - "05_QA_SITE_RELIABILITY"
Cohesion: 0.40
Nodes (4): designTokensContent, designTokensPath, stylesCssContent, stylesCssPath

### Community 103 - "06_CRO_CONVERSION_SPECIALIST"
Cohesion: 0.40
Nodes (4): getOptimalSEO(), LONG_TAIL_SEO_CONFIG, SEOKey, SEOMetadata

### Community 104 - "campus_captain_recruitment_pitch"
Cohesion: 0.60
Nodes (4): diagnoseWebGL(), initWebGLSafetyGuard(), isLegacyAndroidUserAgent(), WebGLDiagnosticResult

### Community 105 - "campus_tiffin_tasting_event_playbook"
Cohesion: 0.80
Nodes (4): public.campus_location_pricing, public.get_location_pricing_tier(), public.pricing_zones, v_zone

### Community 106 - "COMPANY_LOG"
Cohesion: 0.40
Nodes (2): Route, DataPrivacyAuditModal()

### Community 107 - "cookie"
Cohesion: 0.40
Nodes (4): DEFAULT_ICONS, StatusIndicator(), StatusIndicatorProps, VARIANT_CLASSES

### Community 108 - "GEMINI"
Cohesion: 0.40
Nodes (3): CORS_HEADERS, VerificationResult, VisionRequest

### Community 109 - "googlec3390cf96e97cc6c"
Cohesion: 0.50
Nodes (2): stylesCss, stylesPath

### Community 110 - "launch"
Cohesion: 0.50
Nodes (3): heroCode, heroPath, hostHeroSealsPath

### Community 111 - "ops_manager"
Cohesion: 0.50
Nodes (3): fileContent, radarComponentPath, requiredCampuses

### Community 112 - "PRD"
Cohesion: 0.50
Nodes (3): content, fs, keys

### Community 113 - "progress"
Cohesion: 0.50
Nodes (3): Model definitions and mapping from Gemini frontend JS source., Resolve model name to (name, mode_id, think_mode, error, extra_fields).      U, resolve_model()

### Community 114 - "prompt"
Cohesion: 0.50
Nodes (2): KITCHEN_TEST_IMAGE_URLS, KitchenSwStressMetrics

### Community 115 - "README"
Cohesion: 0.83
Nodes (3): pg_policies, pg_tables, public.audit_supabase_db_security()

### Community 116 - "reel_script_csjmu_dead_rent"
Cohesion: 0.50
Nodes (2): GUIDEO_META, Route

### Community 117 - "reelscript"
Cohesion: 0.67
Nodes (2): IMAGE_SPECS, ROOT

### Community 118 - "RELEASE_NOTES_v2.0"
Cohesion: 0.67
Nodes (1): ToasterProps

### Community 121 - "safety_protocol"
Cohesion: 1.00
Nodes (1): gemini-web2api: Gemini Web to OpenAI API proxy.

### Community 123 - "sop_tamper_evident_seal_custody"
Cohesion: 1.00
Nodes (1): public.waitlist_leads

### Community 124 - "tasks"
Cohesion: 1.00
Nodes (1): public.users_waitlist

### Community 125 - "tech_lead"
Cohesion: 1.00
Nodes (1): public.component_interaction_telemetry

### Community 126 - "theme_guidelines"
Cohesion: 1.00
Nodes (1): visitor_sessions

### Community 128 - "android-go-performance.spec.ts"
Cohesion: 1.00
Nodes (1): 00_AUTONOMOUS_LOOP_PROTOCOL

### Community 129 - "booking.spec.ts"
Cohesion: 1.00
Nodes (1): 02_CTO_TECH_ARCHITECT

### Community 130 - "data-privacy-dpdp-audit.spec.ts"
Cohesion: 1.00
Nodes (1): 03_CMO_GROWTH_LEAD

### Community 131 - "legacy-android-emulation.spec.ts"
Cohesion: 1.00
Nodes (1): 04_CPO_PRODUCT_UX_LEAD

### Community 132 - "storage-qr-booking.spec.ts"
Cohesion: 1.00
Nodes (1): 05_QA_SITE_RELIABILITY

### Community 133 - "eslint.config.js"
Cohesion: 1.00
Nodes (1): 06_CRO_CONVERSION_SPECIALIST

### Community 134 - "20260815081104_5b9ef56a-fedf-4b93-b0d6-ffb5e0663a4"
Cohesion: 1.00
Nodes (1): campus_captain_recruitment_pitch

### Community 135 - "20260818080448_d3747ccc-493c-4454-8dae-1564055175c"
Cohesion: 1.00
Nodes (1): campus_tiffin_tasting_event_playbook

### Community 136 - "20260818080523_5fdb4231-10fd-4b1c-ac5f-76227f5a3ed"
Cohesion: 1.00
Nodes (1): COMPANY_LOG

### Community 137 - "20260906_rls_security_audit_hardening.sql"
Cohesion: 1.00
Nodes (1): cookie

### Community 138 - "playwright.config.ts"
Cohesion: 1.00
Nodes (1): GEMINI

### Community 139 - "Community 139"
Cohesion: 1.00
Nodes (1): googlec3390cf96e97cc6c

### Community 140 - "Community 140"
Cohesion: 1.00
Nodes (1): launch

### Community 141 - "Community 141"
Cohesion: 1.00
Nodes (1): ops_manager

### Community 142 - "Community 142"
Cohesion: 1.00
Nodes (1): PRD

### Community 143 - "Community 143"
Cohesion: 1.00
Nodes (1): progress

### Community 144 - "Community 144"
Cohesion: 1.00
Nodes (1): prompt

### Community 145 - "Community 145"
Cohesion: 1.00
Nodes (1): README

### Community 146 - "Community 146"
Cohesion: 1.00
Nodes (1): reel_script_csjmu_dead_rent

### Community 147 - "Community 147"
Cohesion: 1.00
Nodes (1): reelscript

### Community 148 - "Community 148"
Cohesion: 1.00
Nodes (1): RELEASE_NOTES_v2.0

### Community 149 - "Community 149"
Cohesion: 1.00
Nodes (1): RELEASE_NOTES_V3

### Community 150 - "Community 150"
Cohesion: 1.00
Nodes (1): robots

### Community 151 - "Community 151"
Cohesion: 1.00
Nodes (1): safety_protocol

### Community 152 - "Community 152"
Cohesion: 1.00
Nodes (1): sop_emergency_sos_escalation

### Community 153 - "Community 153"
Cohesion: 1.00
Nodes (1): sop_tamper_evident_seal_custody

### Community 154 - "Community 154"
Cohesion: 1.00
Nodes (1): tasks

### Community 155 - "Community 155"
Cohesion: 1.00
Nodes (1): tech_lead

### Community 156 - "Community 156"
Cohesion: 1.00
Nodes (1): theme_guidelines

### Community 157 - "Community 157"
Cohesion: 1.00
Nodes (1): whatsapp_hostel_group_broadcast

## Knowledge Gaps
- **664 isolated node(s):** `LOG_FILE`, `STATE_FILE`, `MIGRATIONS_DIR`, `SENSITIVE_TABLES`, `KNOWN_TABLES` (+659 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `COMPANY_LOG`** (2 nodes): `Route`, `DataPrivacyAuditModal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `googlec3390cf96e97cc6c`** (2 nodes): `stylesCss`, `stylesPath`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `prompt`** (2 nodes): `KITCHEN_TEST_IMAGE_URLS`, `KitchenSwStressMetrics`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `reel_script_csjmu_dead_rent`** (2 nodes): `GUIDEO_META`, `Route`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `reelscript`** (2 nodes): `IMAGE_SPECS`, `ROOT`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `RELEASE_NOTES_v2.0`** (1 nodes): `ToasterProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `safety_protocol`** (1 nodes): `gemini-web2api: Gemini Web to OpenAI API proxy.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `sop_tamper_evident_seal_custody`** (1 nodes): `public.waitlist_leads`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `tasks`** (1 nodes): `public.users_waitlist`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `tech_lead`** (1 nodes): `public.component_interaction_telemetry`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `theme_guidelines`** (1 nodes): `visitor_sessions`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `android-go-performance.spec.ts`** (1 nodes): `00_AUTONOMOUS_LOOP_PROTOCOL`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `booking.spec.ts`** (1 nodes): `02_CTO_TECH_ARCHITECT`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `data-privacy-dpdp-audit.spec.ts`** (1 nodes): `03_CMO_GROWTH_LEAD`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `legacy-android-emulation.spec.ts`** (1 nodes): `04_CPO_PRODUCT_UX_LEAD`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `storage-qr-booking.spec.ts`** (1 nodes): `05_QA_SITE_RELIABILITY`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `eslint.config.js`** (1 nodes): `06_CRO_CONVERSION_SPECIALIST`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `20260815081104_5b9ef56a-fedf-4b93-b0d6-ffb5e0663a4`** (1 nodes): `campus_captain_recruitment_pitch`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `20260818080448_d3747ccc-493c-4454-8dae-1564055175c`** (1 nodes): `campus_tiffin_tasting_event_playbook`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `20260818080523_5fdb4231-10fd-4b1c-ac5f-76227f5a3ed`** (1 nodes): `COMPANY_LOG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `20260906_rls_security_audit_hardening.sql`** (1 nodes): `cookie`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `playwright.config.ts`** (1 nodes): `GEMINI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 139`** (1 nodes): `googlec3390cf96e97cc6c`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 140`** (1 nodes): `launch`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 141`** (1 nodes): `ops_manager`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 142`** (1 nodes): `PRD`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 143`** (1 nodes): `progress`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 144`** (1 nodes): `prompt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 145`** (1 nodes): `README`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 146`** (1 nodes): `reel_script_csjmu_dead_rent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 147`** (1 nodes): `reelscript`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 148`** (1 nodes): `RELEASE_NOTES_v2.0`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 149`** (1 nodes): `RELEASE_NOTES_V3`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 150`** (1 nodes): `robots`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 151`** (1 nodes): `safety_protocol`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 152`** (1 nodes): `sop_emergency_sos_escalation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 153`** (1 nodes): `sop_tamper_evident_seal_custody`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 154`** (1 nodes): `tasks`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 155`** (1 nodes): `tech_lead`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 156`** (1 nodes): `theme_guidelines`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 157`** (1 nodes): `whatsapp_hostel_group_broadcast`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLanguage()` connect `LanguageContext.tsx / defaultContextValue / Langua` to `COMPANY_LOG`, `useCountUp.ts / useCountUp() / abTesting.ts`, `extendedBreakUpsell.ts / calculateExtendedBreakDis`, `LowDataContext.tsx / defaultContext / detectLowDat`, `ToastContext.tsx / listeners / notifyListeners()`, `CampusCaptainModal.tsx / CampusCaptainModal() / In`, `ThemeContext.tsx / defaultContextValue / Theme`, `constants.ts / getWhatsAppUrl() / terms.tsx`, `connectAudioEngine.ts / AudioCompressorTelemetry /`, `index.tsx / ActivityTicker / BookingModal`, `gemini.py / _account_prefix() / _build_headers()`, `sheet.tsx / SheetContent / SheetContentProps`, `AGENTS / REPORT_FILE / REPORT_FILE`, `DataPrivacyCommitment.tsx / DataPrivacyCommitment(`, `stashWallet.ts / applyTrialTokenToCheckout() / can`, `FeedbackSuggestions.tsx / FeedbackSuggestions / IN`, `sop_elderly_host_home_audit / sop_saarthi_kitchen_`, `dataPrivacyAudit.ts / AuditCheckItem / auditUserDa`, `PersonaContext.tsx / defaultContextValue / Persona`, `privacy.tsx / PrivacyPage() / PrivacyPageWrapped()`, `useAuth.tsx / AuthContext / AuthUser`, `sonner.tsx / Toaster() / ToasterProps`, `TasteShieldModal.tsx / ISSUE_OPTIONS / POSITIVE_TA`, `visitorTracking.ts / buildInitialSession() / detec`, `00_AUTONOMOUS_LOOP_PROTOCOL`, `ReferralLeaderboard.tsx / LEADERBOARD_ALL_TIME / L`, `20260907_sensitive_data_rls_audit.sql / pg_policie`, `tools.py / _build_tool_choice_instruction() / buil`, `02_CTO_TECH_ARCHITECT`, `kakadeo-survival-guide.tsx / GUIDEO_META / Kakadeo`, `03_CMO_GROWTH_LEAD`, `kitchenSwStressTest.ts / KITCHEN_TEST_IMAGE_URLS /`, `KanpurStudentCouncil.tsx / COUNCIL_MEMBERS / Counc`, `20260906_location_pricing_tiers.sql / public.campu`, `seo-keywords.ts / getOptimalSEO() / LONG_TAIL_SEO_`, `ActivityTicker.tsx / ACTIVITIES / ActivityItem`, `verify-android-go-perf.mjs / assert()`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `Button` connect `useCountUp.ts / useCountUp() / abTesting.ts` to `predictiveAI.ts / FeatureVector / MODEL_WEIGHTS`, `COMPANY_LOG`, `LowDataContext.tsx / defaultContext / detectLowDat`, `apiPenTestEngine.ts / PenTestReport / runApiPenTes`, `ToastContext.tsx / listeners / notifyListeners()`, `CampusCaptainModal.tsx / CampusCaptainModal() / In`, `ThemeContext.tsx / defaultContextValue / Theme`, `constants.ts / getWhatsAppUrl() / terms.tsx`, `connectAudioEngine.ts / AudioCompressorTelemetry /`, `gemini.py / _account_prefix() / _build_headers()`, `AGENTS / REPORT_FILE / REPORT_FILE`, `LanguageContext.tsx / defaultContextValue / Langua`, `sop_elderly_host_home_audit / sop_saarthi_kitchen_`, `dataPrivacyAudit.ts / AuditCheckItem / auditUserDa`, `DataPrivacyCommitment.tsx / DataPrivacyCommitment(`, `useAuth.tsx / AuthContext / AuthUser`, `index.tsx / ActivityTicker / BookingModal`, `extendedBreakUpsell.ts / calculateExtendedBreakDis`, `kakadeo-survival-guide.tsx / GUIDEO_META / Kakadeo`, `FeedbackSuggestions.tsx / FeedbackSuggestions / IN`, `seo-keywords.ts / getOptimalSEO() / LONG_TAIL_SEO_`, `PersonaContext.tsx / defaultContextValue / Persona`, `BookingRecord / storageQrValidator.ts / getStorage`, `interactionTelemetry.ts / ComponentInteractionReco`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `supabase` connect `CampusCaptainModal.tsx / CampusCaptainModal() / In` to `visitorTracking.ts / buildInitialSession() / detec`, `ragChatbotEngine.ts / ChatMessage / FAQ_KNOWLEDGE_`, `sw.js / cacheFirst() / cacheFirstImage()`, `apiPenTestEngine.ts / PenTestReport / runApiPenTes`, `BookingModal() / CoachingHubTiffinPage.tsx / Foote`, `AuthButton.tsx / GoogleGlyph() / ProfileModal()`, `useCountUp.ts / useCountUp() / abTesting.ts`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `LOG_FILE`, `STATE_FILE`, `MIGRATIONS_DIR` to the rest of the system?**
  _664 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `BaseHTTPRequestHandler / gemini_web2api.py / accou` be split into smaller, more focused modules?**
  _Cohesion score 0.06299603174603174 - nodes in this community are weakly interconnected._
- **Should `connectAudioEngine.ts / AudioCompressorTelemetry /` be split into smaller, more focused modules?**
  _Cohesion score 0.060408163265306125 - nodes in this community are weakly interconnected._
- **Should `extendedBreakUpsell.ts / calculateExtendedBreakDis` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._