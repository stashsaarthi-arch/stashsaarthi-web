# Graph Report - .  (2026-09-12)

## Corpus Check
- 321 files · ~3,43,519 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1328 nodes · 2663 edges · 122 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output
- Edge kinds: contains: 958 · imports: 726 · imports_from: 607 · calls: 223 · method: 42 · rationale_for: 42 · reads_from: 25 · conceptually_related_to: 20 · references: 11 · inherits: 6 · uses: 2 · triggers: 1


## Input Scope
- Requested: all
- Resolved: all (source: configured-default)
- Included files: 321 · Candidates: recursive
- Excluded: 0 untracked · 0 ignored · 4 sensitive · 0 missing committed
## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 86 edges
2. `Button` - 47 edges
3. `Badge()` - 25 edges
4. `usePersona()` - 24 edges
5. `cn()` - 18 edges
6. `GeminiHandler` - 16 edges
7. `DialogContent` - 16 edges
8. `DialogTitle` - 16 edges
9. `Input` - 16 edges
10. `DialogHeader()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `AGENT_REPORTS` --conceptually_related_to--> `REPORT_FILE`  [INFERRED]
  ai_workforce/AGENT_REPORTS.md → C:/Users/Dell/Downloads/stashsaarthi-web/ai_workforce/orchestrator.js
- `AGENT_REPORTS` --conceptually_related_to--> `REPORT_FILE`  [INFERRED]
  ai_workforce/AGENT_REPORTS.md → C:/Users/Dell/Downloads/stashsaarthi-web/ai_workforce/runner.js
- `AGENT_REPORTS` --conceptually_related_to--> `reportLines`  [INFERRED]
  ai_workforce/AGENT_REPORTS.md → C:/Users/Dell/Downloads/stashsaarthi-web/execution/audit-vulnerabilities.mjs
- `AGENT_REPORTS` --conceptually_related_to--> `reportPath`  [INFERRED]
  ai_workforce/AGENT_REPORTS.md → C:/Users/Dell/Downloads/stashsaarthi-web/execution/audit-vulnerabilities.mjs
- `AGENT_REPORTS` --conceptually_related_to--> `AGENTS`  [INFERRED]
  ai_workforce/AGENT_REPORTS.md → C:/Users/Dell/Downloads/stashsaarthi-web/ai_workforce/orchestrator.js

## Communities

### Community 0 - "BaseHTTPRequestHandler / gemini_web2api.py / accou"
Cohesion: 0.06
Nodes (34): BaseHTTPRequestHandler, account_prefix(), clean_gemini_text(), extract_response_text(), gemini_stream_generate(), gemini_stream_generate_iter(), GeminiHandler, load_config() (+26 more)

### Community 1 - "connectAudioEngine.ts / AudioCompressorTelemetry /"
Cohesion: 0.06
Nodes (35): AudioCompressorTelemetry, calculateMOS(), detectNetworkTier(), NETWORK_PROFILES, NetworkProfile, NetworkTier, playCompressedVoicePreview(), getAppleMapsDirectionsUrl() (+27 more)

### Community 2 - "extendedBreakUpsell.ts / calculateExtendedBreakDis"
Cohesion: 0.07
Nodes (25): calculateExtendedBreakDiscount(), ExtendedBreakQuote, getExtendedBreakUpsellMessage(), calculateLocationPricingQuote(), DynamicPricingQuote, fetchLocationPricingQuoteFromSupabase(), getZoneTierBadge(), LocationQuoteParams (+17 more)

### Community 3 - "apiPenTestEngine.ts / PenTestReport / runApiPenTes"
Cohesion: 0.08
Nodes (27): PenTestReport, runApiPenTest(), VectorAuditResult, consumeLastCapturedError(), describeError(), describeStatus(), originalConsoleError, safeStringify() (+19 more)

### Community 4 - "index.tsx / ActivityTicker / BookingModal"
Cohesion: 0.07
Nodes (30): ActivityTicker, BookingModal, DualCrisis, EarlyAccessModal, ExitIntentModal, FamilyDashboard, FAQ, FeedbackSuggestions (+22 more)

### Community 5 - "DataPrivacyCommitment.tsx / DataPrivacyCommitment("
Cohesion: 0.11
Nodes (22): DataPrivacyCommitment(), FamilyDashboard, FEATURE_ICONS, FounderAccountability(), HostRules, ICONS, HostVettingFlow, VettingStage (+14 more)

### Community 6 - "ThemeContext.tsx / defaultContextValue / Theme"
Cohesion: 0.07
Nodes (24): defaultContextValue, Theme, ThemeContext, ThemeContextType, ThemeProvider(), useTheme(), COUNCIL_META, Route (+16 more)

### Community 7 - "useAuth.tsx / AuthContext / AuthUser"
Cohesion: 0.13
Nodes (24): AuthContext, AuthUser, AuthValue, useAuth(), checkAndRecordRateLimit(), showRateLimitToast(), GoogleProfile, insertWaitlistUser() (+16 more)

### Community 8 - "CampusCaptainModal.tsx / CampusCaptainModal() / In"
Cohesion: 0.13
Nodes (20): CampusCaptainModal(), InvestorModal(), InvestorModalProps, handleDownloadInvestorMemo(), LegalDialog(), CATEGORY_PRESETS, LuggageItemizerModal(), LuggageItemizerModalProps (+12 more)

### Community 9 - "LowDataContext.tsx / defaultContext / detectLowDat"
Cohesion: 0.12
Nodes (18): defaultContext, isLowDataModeEnabled(), LowDataContext, LowDataContextType, LowDataProvider(), useLowData(), AndroidGoDiagnostics, diagnoseAndroidGo() (+10 more)

### Community 10 - "PersonaContext.tsx / defaultContextValue / Persona"
Cohesion: 0.10
Nodes (17): defaultContextValue, PersonaContext, PersonaContextType, Role, usePersona(), ExitIntentModalProps, FloatingPersonaToggle, PredictivePersonaWidget (+9 more)

### Community 11 - "constants.ts / getWhatsAppUrl() / terms.tsx"
Cohesion: 0.12
Nodes (15): getWhatsAppUrl(), Route, HostPayoutCharterModalProps, DEFAULT_SCENES, Room360Viewer(), Room360ViewerProps, RoomHotspot, RoomScene (+7 more)

### Community 12 - "useCountUp.ts / useCountUp() / abTesting.ts"
Cohesion: 0.11
Nodes (14): useCountUp(), ALL_THALI_VARIANTS, ALL_VARIANTS, HeroCtaVariant, ThaliPriceLabelVariant, trackCtaClick(), useHeroCtaVariant(), AnimatedStat() (+6 more)

### Community 13 - "Route / Route / Route"
Cohesion: 0.09
Nodes (21): Route, Route, Route, getRouter(), AdminRoute, FileRoutesByFullPath, FileRoutesById, FileRoutesByPath (+13 more)

### Community 14 - "gemini.py / _account_prefix() / _build_headers()"
Cohesion: 0.18
Nodes (21): _account_prefix(), _build_headers(), _build_payload(), clean_text(), extract_response_text(), _extract_texts_from_line(), generate(), generate_stream() (+13 more)

### Community 15 - "interactionTelemetry.ts / ComponentInteractionReco"
Cohesion: 0.15
Nodes (11): ComponentInteractionRecord, flushTelemetryBuffer(), getTelemetrySessionId(), interactionBuffer, recordInteraction(), logSupabaseError(), queueOfflineSubmission(), sanitizePayload() (+3 more)

### Community 16 - "auth-middleware.ts / createSupabaseFetch() / isNew"
Cohesion: 0.12
Nodes (14): requireSupabaseAuth, createSupabaseAdminClient(), createSupabaseFetch(), supabaseAdmin, CompositeTypes, Constants, Database, DatabaseWithoutInternals (+6 more)

### Community 17 - "LanguageContext.tsx / defaultContextValue / Langua"
Cohesion: 0.15
Nodes (14): defaultContextValue, Language, LanguageContext, LanguageContextType, translations, useLanguage(), RagResponse, CalculatorHub (+6 more)

### Community 18 - "getContactedIds() / toggleContacted() / admin.tsx"
Cohesion: 0.12
Nodes (12): getContactedIds(), toggleContacted(), AndroidGoPerfModal, ApiPenTestModal, BookingCard(), COLOR_CLASSES, EdgeRegionMonitorWidget, ExecutiveAnalyticsDashboard (+4 more)

### Community 19 - "predictiveAI.ts / FeatureVector / MODEL_WEIGHTS"
Cohesion: 0.15
Nodes (13): FeatureVector, MODEL_WEIGHTS, normalizeFeatures(), PersonaTelemetryEngine, PredictedPersona, PredictionResult, predictPersonaML(), preloadedCache (+5 more)

### Community 20 - "LanguageProvider() / PersonaProvider() / AuthProvi"
Cohesion: 0.16
Nodes (8): LanguageProvider(), PersonaProvider(), AuthProvider(), coLivingItemListSchema, coLivingSpacesSchema, DynamicOGHead(), NetworkStatus(), PageTransition()

### Community 21 - "tools.py / _build_tool_choice_instruction() / buil"
Cohesion: 0.13
Nodes (17): _build_tool_choice_instruction(), build_tool_prompt(), _compress_b64_if_needed(), google_contents_to_prompt(), _google_tool_choice_instruction(), messages_to_prompt(), parse_google_function_calls(), parse_tool_calls() (+9 more)

### Community 22 - "localSubmissions.ts / AdminStats / deleteBooking()"
Cohesion: 0.23
Nodes (17): AdminStats, deleteBooking(), getAdminStats(), getBookings(), getMealOrders(), getReviews(), getSuggestions(), getWaitlistEntries() (+9 more)

### Community 23 - "intelligentNudges.ts / buildWhatsAppNudgeTemplate("
Cohesion: 0.21
Nodes (13): buildWhatsAppNudgeTemplate(), claimActiveNudgeToken(), fetchSupabaseInactiveStudents(), generateNudgeTokenCode(), getActiveClaimedNudgeToken(), getDaysSinceLastOrder(), getWhatsAppNudgeUrlForStudent(), isStudentEligibleForNudge() (+5 more)

### Community 24 - "visitorTracking.ts / buildInitialSession() / detec"
Cohesion: 0.22
Nodes (16): buildInitialSession(), detectBrowser(), detectDeviceType(), detectOS(), fetchVisitorSessions(), flushToSupabase(), getCityHintFromTimezone(), getOrCreateSessionId() (+8 more)

### Community 25 - "AuthButton.tsx / GoogleGlyph() / ProfileModal()"
Cohesion: 0.17
Nodes (12): ProfileModal(), Avatar, AvatarFallback, AvatarImage, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel (+4 more)

### Community 26 - "ToastContext.tsx / listeners / notifyListeners()"
Cohesion: 0.13
Nodes (10): listeners, toast, ToastContext, ToastContextType, ToastItem, ToastListener, ToastOptions, ToastProvider() (+2 more)

### Community 27 - "accessibility.ts / Announcement / announceToScreen"
Cohesion: 0.14
Nodes (7): Announcement, announceToScreenReader(), Listener, Politeness, ScreenReaderAnnouncerBus, srAnnouncerBus, AccessibilityAnnouncer()

### Community 28 - "audio.ts / getAudioContext() / playClick()"
Cohesion: 0.19
Nodes (10): getAudioContext(), playClick(), playPop(), DeliveryCutoffCountdown(), DeliveryCutoffCountdownProps, PeacockFeatherMatkiDustingProps, StudentTestimonialVideosWidget(), TESTIMONIAL_VIDEOS (+2 more)

### Community 29 - "hostVettingPolicy.ts / clearHostAgreement() / gene"
Cohesion: 0.19
Nodes (11): generateHostAgreementId(), getHostAgreement(), HostAgreementRecord, HostPolicyTier, HostVettingPolicyCharter, OFFICIAL_HOST_VETTING_POLICY, saveHostAgreement(), HostOnboardingAgreementModal() (+3 more)

### Community 30 - "FeedbackSuggestions.tsx / FeedbackSuggestions / IN"
Cohesion: 0.19
Nodes (10): FeedbackSuggestions, INITIAL_REVIEWS, INITIAL_SUGGESTIONS, ReviewItem, SuggestionItem, MyBookingsDashboard, ProfileModalProps, ProfileTab (+2 more)

### Community 31 - "TasteShieldModal.tsx / ISSUE_OPTIONS / POSITIVE_TA"
Cohesion: 0.21
Nodes (11): ISSUE_OPTIONS, POSITIVE_TAGS, TasteShieldModalProps, getUserShieldQuota(), RefundStatus, submitTasteShieldClaim(), TasteShieldClaimRequest, TasteShieldClaimResult (+3 more)

### Community 32 - "tiffin-services-near-allen.tsx / ALLEN_CONFIG / Al"
Cohesion: 0.16
Nodes (8): ALLEN_CONFIG, Route, MOTION_CONFIG, Route, PW_CONFIG, Route, CoachingHubTiffinPage(), HubConfig

### Community 33 - "ceoAnalytics.ts / calculateExecutiveMetrics() / Ch"
Cohesion: 0.21
Nodes (10): calculateExecutiveMetrics(), ChannelCacMetric, DEFAULT_CHANNEL_CAC, DEFAULT_SERVICE_LTV, DEFAULT_SPRINTS, ExecutiveAnalyticsData, exportExecutiveAnalyticsJson(), ServiceLtvMetric (+2 more)

### Community 34 - "offlineBookingQueue.ts / enqueueOfflineBooking() /"
Cohesion: 0.26
Nodes (11): enqueueOfflineBooking(), flushOfflineBookingQueue(), getPendingOfflineBookings(), initOfflineQueueAutoSync(), OfflineBookingPayload, OfflineBookingRecord, openOfflineBookingDB(), registerBackgroundPeriodicSync() (+3 more)

### Community 35 - "utils.ts / cn() / Tilt3D.tsx"
Cohesion: 0.22
Nodes (7): cn(), Props, Separator, Slider, Toggle, toggleVariants, TooltipContent

### Community 36 - "BookingModal() / CoachingHubTiffinPage.tsx / Foote"
Cohesion: 0.19
Nodes (10): BookingModal(), FooterSection, MENU_OPTIONS, MenuShareDetails, PRESET_NOTES_EN, PRESET_NOTES_HI, RoommateMenuShareModal(), RoommateMenuShareModalProps (+2 more)

### Community 37 - "test-offline-pwa-sync.mjs / assert() / bookingModa"
Cohesion: 0.17
Nodes (10): bookingModalPath, bookingModalSource, offlineQueuePath, queueSource, rootPath, rootSource, swPath, swRegisterPath (+2 more)

### Community 38 - "dataRetentionEngine.ts / auditInactiveStudentData("
Cohesion: 0.30
Nodes (10): auditInactiveStudentData(), DATA_RETENTION_CATEGORIES, DataRetentionCategory, executeAutoPurge18Months(), getLastRetentionPurgeResult(), InactiveRecordAudit, initAutoDataRetentionPurge(), RetentionPurgeResult (+2 more)

### Community 39 - "ActivityTicker.tsx / ACTIVITIES / ActivityItem"
Cohesion: 0.17
Nodes (9): ACTIVITIES, ActivityItem, ActivityTicker, ActivityTickerProps, CategoryFilter, COMPARISON_ROWS, ComparisonRow, PgComparisonTableProps (+1 more)

### Community 40 - "engine.js / BOARD_FILE / LOG_FILE"
Cohesion: 0.20
Nodes (10): BOARD_FILE, LOG_FILE, runSprint(), startDaemon(), TASK_BOARD, autonomous_engine, EXECUTIVE_DASHBOARD, pricing_engine (+2 more)

### Community 41 - "sop_elderly_host_home_audit / sop_saarthi_kitchen_"
Cohesion: 0.18
Nodes (9): sop_elderly_host_home_audit, sop_saarthi_kitchen_hygiene_audit, KNOWN_TABLES, MIGRATIONS_DIR, SENSITIVE_TABLES, sqlFiles, tablePolicies, tableRlsStatus (+1 more)

### Community 42 - "test-multilingual-rag.mjs / testQueries / ragChatb"
Cohesion: 0.33
Nodes (9): testQueries, extractPhrases(), generateRagResponse(), HINGLISH_TRANSLITERATION_MAP, KNOWLEDGE_BASE, KnowledgeChunk, normalizeHinglishTokens(), retrieveKnowledgeChunks() (+1 more)

### Community 43 - "trackPersonaLayoutRecording() / Connect() / Ecosys"
Cohesion: 0.20
Nodes (9): trackPersonaLayoutRecording(), Connect(), Ecosystem(), NodeBase, NodeKey, NODES_BASE, Rooms(), SolutionsHub (+1 more)

### Community 44 - "csoKitchenSealingService.ts / CsoAuditInput / CsoK"
Cohesion: 0.33
Nodes (8): CsoAuditInput, CsoKitchenSealCertificate, DEFAULT_SEALED_NODES, getAllSealedKitchenNodes(), getSealForNode(), sealKitchenNode(), verifyBarcodeSerial(), CsoKitchenSealModalProps

### Community 45 - "dataPrivacyAudit.ts / AuditCheckItem / auditUserDa"
Cohesion: 0.31
Nodes (9): AuditCheckItem, auditUserDataLawfulness(), DsarRequest, getDsarRequests(), PRIVACY_AUDIT_CHECKS, runDataPrivacyAudit(), submitDsarRequest(), UserDataLawfulnessReport (+1 more)

### Community 46 - "sw.js / cacheFirst() / cacheFirstImage()"
Cohesion: 0.24
Nodes (7): cacheFirst(), cacheFirstImage(), imageFallback(), networkFirst(), offlineFallback(), pendingImageRequests, PRECACHE_URLS

### Community 47 - "error-reporting.ts / reportError() / ErrorBoundary"
Cohesion: 0.22
Nodes (5): reportError(), Component, ErrorBoundary, Props, State

### Community 48 - "rateLimiter.ts / checkRateLimit() / DEFAULT_CONFIG"
Cohesion: 0.33
Nodes (9): checkRateLimit(), DEFAULT_CONFIG, getStorageKey(), getTimestamps(), memoryStore, RateLimitConfig, recordSubmission(), resetRateLimit() (+1 more)

### Community 49 - "stashWallet.ts / applyTrialTokenToCheckout() / can"
Cohesion: 0.33
Nodes (9): applyTrialTokenToCheckout(), canClaimZeroFeeTrialToken(), claimZeroFeeTrialToken(), consumeTrialTokenOnBooking(), DEFAULT_WALLET, getStashWallet(), saveStashWallet(), StashWalletState (+1 more)

### Community 50 - "20260903_taste_shield_and_meal_reviews.sql / publi"
Cohesion: 0.42
Nodes (9): public.meal_bookings, public.meal_reviews, public.meal_vendors, public.process_taste_shield_claim(), public.user_shield_quotas, Quota, v_booking, v_quota (+1 more)

### Community 51 - "supabase_taste_shield_migration.sql / public.meal_"
Cohesion: 0.42
Nodes (9): public.meal_bookings, public.meal_reviews, public.meal_vendors, public.process_taste_shield_claim(), public.user_shield_quotas, Quota, v_booking, v_quota (+1 more)

### Community 52 - "audit-vulnerabilities.mjs / cleanEnv / __dirname"
Cohesion: 0.22
Nodes (8): cleanEnv, __dirname, __filename, isStrict, rootDir, runBuild, timestamp, tmpDir

### Community 53 - "multimodal.py / _cached_page_tokens() / fetch_imag"
Cohesion: 0.28
Nodes (8): _cached_page_tokens(), fetch_image_bytes(), _get_page_tokens(), Multimodal: Scotty resumable upload for Gemini image input., Fetch image from URL., Fetch WIZ_global_data tokens from Gemini page (Push-ID, X-Client-Pctx)., Upload image via Scotty resumable upload. Returns file reference path., upload_image()

### Community 54 - "cache.ts / CacheEnvelope / CacheOptions"
Cohesion: 0.36
Nodes (8): CacheEnvelope, CacheOptions, getCached(), getOrSet(), invalidateCached(), isUpstashConfigured(), memoryCache, setCached()

### Community 55 - "kakadeo-survival-guide.tsx / GUIDEO_META / Kakadeo"
Cohesion: 0.28
Nodes (4): GUIDEO_META, Route, KakadeoSurvivalGuide(), KakadeoSurvivalGuideModalProps

### Community 56 - "sheet.tsx / SheetContent / SheetContentProps"
Cohesion: 0.22
Nodes (7): SheetContent, SheetContentProps, SheetDescription, SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 57 - "AGENTS / REPORT_FILE / REPORT_FILE"
Cohesion: 0.25
Nodes (8): AGENTS, REPORT_FILE, REPORT_FILE, AGENT_REPORTS, AGENTS, cmo_agent, reportLines, reportPath

### Community 58 - "orchestrator.js / log_activity() / loop()"
Cohesion: 0.36
Nodes (7): log_activity(), loop(), readState(), run_workforce_cycle(), STATE_FILE, writeState(), 01_CEO_ORCHESTRATOR

### Community 59 - "deploy-edge-functions-multi-region.mjs / allRegion"
Cohesion: 0.25
Nodes (7): allRegions, __dirname, __filename, isCheckOnly, manifest, manifestPath, rootDir

### Community 60 - "BookingRecord / storageQrValidator.ts / getStorage"
Cohesion: 0.36
Nodes (6): BookingRecord, getStorageQrCodeUrl(), StorageQrScanResult, verifyStorageQrCode(), StashPassItem, StashPassProps

### Community 61 - "mealPersonalization.ts / calculatePersonalizationT"
Cohesion: 0.36
Nodes (5): calculatePersonalizationTotal(), MEAL_PERSONALIZATION_OPTIONS, MealPersonalization, MealPersonalizationSelector(), MealPersonalizationSelectorProps

### Community 62 - "20260818080416_653af444-3317-4b54-8474-6e73a111e19"
Cohesion: 0.46
Nodes (7): auth.users, on_auth_user_created, public.co_living_inquiries, public.crowdsourced_room_listings, public.handle_new_user(), public.profiles, public.stash_bookings

### Community 63 - "SaarthiKitchenSchema.tsx / SaarthiKitchenSchema() "
Cohesion: 0.29
Nodes (5): SaarthiKitchenSchema(), SaarthiKitchenSchemaProps, INITIAL_KITCHENS, TopKitchen, TopRatedKitchensWidgetProps

### Community 64 - "FAQ.tsx / FAQ / FAQ_ITEMS"
Cohesion: 0.36
Nodes (6): FAQ, FAQ_ITEMS, FAQItem, AccordionContent, AccordionItem, AccordionTrigger

### Community 65 - "generate-og-images.mjs / createAdminSVG() / create"
Cohesion: 0.43
Nodes (6): createAdminSVG(), createHostSVG(), createStudentSVG(), generateAll(), PUBLIC_IMAGES, ROOT

### Community 66 - "test-data-retention-policy.mjs / engineContent / e"
Cohesion: 0.29
Nodes (6): engineContent, enginePath, privacyContent, privacyPath, sqlContent, sqlPath

### Community 67 - "MealOrderRecord / WaitlistRecord / MyBookingsDashb"
Cohesion: 0.29
Nodes (4): MealOrderRecord, WaitlistRecord, SERVICE_LABELS, Tab

### Community 68 - "20260907_data_retention_auto_purge.sql / public.co"
Cohesion: 0.52
Nodes (6): public.component_interaction_telemetry, public.stash_bookings, public.users_waitlist, public.visitor_sessions, public.waitlist_leads, purge_inactive_student_data_18_months()

### Community 69 - "DualCrisis.tsx / CrisisCard / DualCrisis"
Cohesion: 0.29
Nodes (6): CrisisCard, DualCrisis, FUSION, SENIOR, STUDENT, Tilt3D

### Community 71 - "runner.js / CONTROL_FILE / isSystemActive()"
Cohesion: 0.47
Nodes (5): CONTROL_FILE, isSystemActive(), logActivity(), runAutonomousEngine(), DAEMON_CONTROL

### Community 73 - "test-executive-analytics.mjs / adminContent / ceoA"
Cohesion: 0.33
Nodes (5): adminContent, ceoAnalyticsContent, ceoAnalyticsPath, dashboardContent, executiveDashboardPath

### Community 74 - "config.py / find_config() / load_config()"
Cohesion: 0.33
Nodes (5): find_config(), load_config(), Configuration management., Load config from JSON file., Search for config file in standard locations.

### Community 75 - "ragChatbotEngine.ts / ChatMessage / FAQ_KNOWLEDGE_"
Cohesion: 0.40
Nodes (5): ChatMessage, FAQ_KNOWLEDGE_BASE, generateRagResponse(), KnowledgeChunk, retrieveRagContext()

### Community 76 - "KanpurStudentCouncil.tsx / COUNCIL_MEMBERS / Counc"
Cohesion: 0.33
Nodes (5): COUNCIL_MEMBERS, CouncilMember, INITIAL_PROPOSALS, KanpurStudentCouncil(), StudentProposal

### Community 77 - "ReferralLeaderboard.tsx / LEADERBOARD_ALL_TIME / L"
Cohesion: 0.33
Nodes (4): LEADERBOARD_ALL_TIME, LEADERBOARD_THIS_MONTH, LeaderboardEntry, AnimatedContent

### Community 78 - "seo-keywords.ts / getOptimalSEO() / LONG_TAIL_SEO_"
Cohesion: 0.40
Nodes (4): getOptimalSEO(), LONG_TAIL_SEO_CONFIG, SEOKey, SEOMetadata

### Community 79 - "webgl-fallback.ts / diagnoseWebGL() / initWebGLSaf"
Cohesion: 0.60
Nodes (4): diagnoseWebGL(), initWebGLSafetyGuard(), isLegacyAndroidUserAgent(), WebGLDiagnosticResult

### Community 80 - "20260906_location_pricing_tiers.sql / public.campu"
Cohesion: 0.80
Nodes (4): public.campus_location_pricing, public.get_location_pricing_tier(), public.pricing_zones, v_zone

### Community 81 - "privacy.tsx / PrivacyPage() / PrivacyPageWrapped()"
Cohesion: 0.40
Nodes (2): Route, DataPrivacyAuditModal()

### Community 82 - "index.ts / CORS_HEADERS / generateHeuristicVisionR"
Cohesion: 0.40
Nodes (3): CORS_HEADERS, VerificationResult, VisionRequest

### Community 83 - "find_keys.js / content / fs"
Cohesion: 0.50
Nodes (3): content, fs, keys

### Community 84 - "models.py / Model definitions and mapping from Gem"
Cohesion: 0.50
Nodes (3): Model definitions and mapping from Gemini frontend JS source., Resolve model name to (name, mode_id, think_mode, error, extra_fields).      U, resolve_model()

### Community 85 - "kitchenSwStressTest.ts / KITCHEN_TEST_IMAGE_URLS /"
Cohesion: 0.50
Nodes (2): KITCHEN_TEST_IMAGE_URLS, KitchenSwStressMetrics

### Community 86 - "20260907_sensitive_data_rls_audit.sql / pg_policie"
Cohesion: 0.83
Nodes (3): pg_policies, pg_tables, public.audit_supabase_db_security()

### Community 87 - "generate-responsive-images.mjs / IMAGE_SPECS / ROO"
Cohesion: 0.67
Nodes (2): IMAGE_SPECS, ROOT

### Community 88 - "sonner.tsx / Toaster() / ToasterProps"
Cohesion: 0.67
Nodes (1): ToasterProps

### Community 91 - "__init__.py / gemini-web2api: Gemini Web to OpenAI"
Cohesion: 1.00
Nodes (1): gemini-web2api: Gemini Web to OpenAI API proxy.

### Community 93 - "20260815080735_4b05d7d6-2132-43b9-ac90-cfb62ff6f1e"
Cohesion: 1.00
Nodes (1): public.waitlist_leads

### Community 94 - "20260826_create_users_waitlist.sql / public.users_"
Cohesion: 1.00
Nodes (1): public.users_waitlist

### Community 95 - "20260906_component_interaction_telemetry.sql / pub"
Cohesion: 1.00
Nodes (1): public.component_interaction_telemetry

### Community 96 - "20260907_visitor_sessions.sql / visitor_sessions"
Cohesion: 1.00
Nodes (1): visitor_sessions

### Community 98 - "00_AUTONOMOUS_LOOP_PROTOCOL"
Cohesion: 1.00
Nodes (1): 00_AUTONOMOUS_LOOP_PROTOCOL

### Community 99 - "02_CTO_TECH_ARCHITECT"
Cohesion: 1.00
Nodes (1): 02_CTO_TECH_ARCHITECT

### Community 100 - "03_CMO_GROWTH_LEAD"
Cohesion: 1.00
Nodes (1): 03_CMO_GROWTH_LEAD

### Community 101 - "04_CPO_PRODUCT_UX_LEAD"
Cohesion: 1.00
Nodes (1): 04_CPO_PRODUCT_UX_LEAD

### Community 102 - "05_QA_SITE_RELIABILITY"
Cohesion: 1.00
Nodes (1): 05_QA_SITE_RELIABILITY

### Community 103 - "06_CRO_CONVERSION_SPECIALIST"
Cohesion: 1.00
Nodes (1): 06_CRO_CONVERSION_SPECIALIST

### Community 104 - "campus_captain_recruitment_pitch"
Cohesion: 1.00
Nodes (1): campus_captain_recruitment_pitch

### Community 105 - "campus_tiffin_tasting_event_playbook"
Cohesion: 1.00
Nodes (1): campus_tiffin_tasting_event_playbook

### Community 106 - "COMPANY_LOG"
Cohesion: 1.00
Nodes (1): COMPANY_LOG

### Community 107 - "cookie"
Cohesion: 1.00
Nodes (1): cookie

### Community 108 - "GEMINI"
Cohesion: 1.00
Nodes (1): GEMINI

### Community 109 - "googlec3390cf96e97cc6c"
Cohesion: 1.00
Nodes (1): googlec3390cf96e97cc6c

### Community 110 - "launch"
Cohesion: 1.00
Nodes (1): launch

### Community 111 - "ops_manager"
Cohesion: 1.00
Nodes (1): ops_manager

### Community 112 - "PRD"
Cohesion: 1.00
Nodes (1): PRD

### Community 113 - "progress"
Cohesion: 1.00
Nodes (1): progress

### Community 114 - "prompt"
Cohesion: 1.00
Nodes (1): prompt

### Community 115 - "README"
Cohesion: 1.00
Nodes (1): README

### Community 116 - "reel_script_csjmu_dead_rent"
Cohesion: 1.00
Nodes (1): reel_script_csjmu_dead_rent

### Community 117 - "reelscript"
Cohesion: 1.00
Nodes (1): reelscript

### Community 118 - "RELEASE_NOTES_v2.0"
Cohesion: 1.00
Nodes (1): RELEASE_NOTES_v2.0

### Community 119 - "RELEASE_NOTES_V3"
Cohesion: 1.00
Nodes (1): RELEASE_NOTES_V3

### Community 120 - "robots"
Cohesion: 1.00
Nodes (1): robots

### Community 121 - "safety_protocol"
Cohesion: 1.00
Nodes (1): safety_protocol

### Community 122 - "sop_emergency_sos_escalation"
Cohesion: 1.00
Nodes (1): sop_emergency_sos_escalation

### Community 123 - "sop_tamper_evident_seal_custody"
Cohesion: 1.00
Nodes (1): sop_tamper_evident_seal_custody

### Community 124 - "tasks"
Cohesion: 1.00
Nodes (1): tasks

### Community 125 - "tech_lead"
Cohesion: 1.00
Nodes (1): tech_lead

### Community 126 - "theme_guidelines"
Cohesion: 1.00
Nodes (1): theme_guidelines

### Community 127 - "whatsapp_hostel_group_broadcast"
Cohesion: 1.00
Nodes (1): whatsapp_hostel_group_broadcast

## Knowledge Gaps
- **460 isolated node(s):** `LOG_FILE`, `STATE_FILE`, `MIGRATIONS_DIR`, `SENSITIVE_TABLES`, `KNOWN_TABLES` (+455 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `privacy.tsx / PrivacyPage() / PrivacyPageWrapped()`** (2 nodes): `Route`, `DataPrivacyAuditModal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `kitchenSwStressTest.ts / KITCHEN_TEST_IMAGE_URLS /`** (2 nodes): `KITCHEN_TEST_IMAGE_URLS`, `KitchenSwStressMetrics`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `generate-responsive-images.mjs / IMAGE_SPECS / ROO`** (2 nodes): `IMAGE_SPECS`, `ROOT`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `sonner.tsx / Toaster() / ToasterProps`** (1 nodes): `ToasterProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `__init__.py / gemini-web2api: Gemini Web to OpenAI`** (1 nodes): `gemini-web2api: Gemini Web to OpenAI API proxy.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `20260815080735_4b05d7d6-2132-43b9-ac90-cfb62ff6f1e`** (1 nodes): `public.waitlist_leads`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `20260826_create_users_waitlist.sql / public.users_`** (1 nodes): `public.users_waitlist`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `20260906_component_interaction_telemetry.sql / pub`** (1 nodes): `public.component_interaction_telemetry`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `20260907_visitor_sessions.sql / visitor_sessions`** (1 nodes): `visitor_sessions`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `00_AUTONOMOUS_LOOP_PROTOCOL`** (1 nodes): `00_AUTONOMOUS_LOOP_PROTOCOL`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `02_CTO_TECH_ARCHITECT`** (1 nodes): `02_CTO_TECH_ARCHITECT`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `03_CMO_GROWTH_LEAD`** (1 nodes): `03_CMO_GROWTH_LEAD`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `04_CPO_PRODUCT_UX_LEAD`** (1 nodes): `04_CPO_PRODUCT_UX_LEAD`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `05_QA_SITE_RELIABILITY`** (1 nodes): `05_QA_SITE_RELIABILITY`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `06_CRO_CONVERSION_SPECIALIST`** (1 nodes): `06_CRO_CONVERSION_SPECIALIST`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `campus_captain_recruitment_pitch`** (1 nodes): `campus_captain_recruitment_pitch`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `campus_tiffin_tasting_event_playbook`** (1 nodes): `campus_tiffin_tasting_event_playbook`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `COMPANY_LOG`** (1 nodes): `COMPANY_LOG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `cookie`** (1 nodes): `cookie`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `GEMINI`** (1 nodes): `GEMINI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `googlec3390cf96e97cc6c`** (1 nodes): `googlec3390cf96e97cc6c`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `launch`** (1 nodes): `launch`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ops_manager`** (1 nodes): `ops_manager`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PRD`** (1 nodes): `PRD`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `progress`** (1 nodes): `progress`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `prompt`** (1 nodes): `prompt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `README`** (1 nodes): `README`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `reel_script_csjmu_dead_rent`** (1 nodes): `reel_script_csjmu_dead_rent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `reelscript`** (1 nodes): `reelscript`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `RELEASE_NOTES_v2.0`** (1 nodes): `RELEASE_NOTES_v2.0`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `RELEASE_NOTES_V3`** (1 nodes): `RELEASE_NOTES_V3`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `robots`** (1 nodes): `robots`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `safety_protocol`** (1 nodes): `safety_protocol`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `sop_emergency_sos_escalation`** (1 nodes): `sop_emergency_sos_escalation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `sop_tamper_evident_seal_custody`** (1 nodes): `sop_tamper_evident_seal_custody`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `tasks`** (1 nodes): `tasks`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `tech_lead`** (1 nodes): `tech_lead`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `theme_guidelines`** (1 nodes): `theme_guidelines`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `whatsapp_hostel_group_broadcast`** (1 nodes): `whatsapp_hostel_group_broadcast`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLanguage()` connect `LanguageContext.tsx / defaultContextValue / Langua` to `privacy.tsx / PrivacyPage() / PrivacyPageWrapped()`, `constants.ts / getWhatsAppUrl() / terms.tsx`, `ActivityTicker.tsx / ACTIVITIES / ActivityItem`, `LowDataContext.tsx / defaultContext / detectLowDat`, `AuthButton.tsx / GoogleGlyph() / ProfileModal()`, `useAuth.tsx / AuthContext / AuthUser`, `extendedBreakUpsell.ts / calculateExtendedBreakDis`, `CampusCaptainModal.tsx / CampusCaptainModal() / In`, `connectAudioEngine.ts / AudioCompressorTelemetry /`, `useCountUp.ts / useCountUp() / abTesting.ts`, `BookingModal() / CoachingHubTiffinPage.tsx / Foote`, `csoKitchenSealingService.ts / CsoAuditInput / CsoK`, `dataPrivacyAudit.ts / AuditCheckItem / auditUserDa`, `DataPrivacyCommitment.tsx / DataPrivacyCommitment(`, `dataRetentionEngine.ts / auditInactiveStudentData(`, `audio.ts / getAudioContext() / playClick()`, `DualCrisis.tsx / CrisisCard / DualCrisis`, `trackPersonaLayoutRecording() / Connect() / Ecosys`, `ceoAnalytics.ts / calculateExecutiveMetrics() / Ch`, `PersonaContext.tsx / defaultContextValue / Persona`, `FAQ.tsx / FAQ / FAQ_ITEMS`, `FeedbackSuggestions.tsx / FeedbackSuggestions / IN`, `ThemeContext.tsx / defaultContextValue / Theme`, `hostVettingPolicy.ts / clearHostAgreement() / gene`, `intelligentNudges.ts / buildWhatsAppNudgeTemplate(`, `kakadeo-survival-guide.tsx / GUIDEO_META / Kakadeo`, `KanpurStudentCouncil.tsx / COUNCIL_MEMBERS / Counc`, `mealPersonalization.ts / calculatePersonalizationT`, `index.tsx / ActivityTicker / BookingModal`, `MealOrderRecord / WaitlistRecord / MyBookingsDashb`, `LanguageProvider() / PersonaProvider() / AuthProvi`, `ReferralLeaderboard.tsx / LEADERBOARD_ALL_TIME / L`, `interactionTelemetry.ts / ComponentInteractionReco`, `BookingRecord / storageQrValidator.ts / getStorage`, `SaarthiKitchenSchema.tsx / SaarthiKitchenSchema() `?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `Button` connect `constants.ts / getWhatsAppUrl() / terms.tsx` to `getContactedIds() / toggleContacted() / admin.tsx`, `privacy.tsx / PrivacyPage() / PrivacyPageWrapped()`, `LowDataContext.tsx / defaultContext / detectLowDat`, `apiPenTestEngine.ts / PenTestReport / runApiPenTes`, `AuthButton.tsx / GoogleGlyph() / ProfileModal()`, `useAuth.tsx / AuthContext / AuthUser`, `extendedBreakUpsell.ts / calculateExtendedBreakDis`, `CampusCaptainModal.tsx / CampusCaptainModal() / In`, `connectAudioEngine.ts / AudioCompressorTelemetry /`, `BookingModal() / CoachingHubTiffinPage.tsx / Foote`, `dataPrivacyAudit.ts / AuditCheckItem / auditUserDa`, `DualCrisis.tsx / CrisisCard / DualCrisis`, `trackPersonaLayoutRecording() / Connect() / Ecosys`, `ceoAnalytics.ts / calculateExecutiveMetrics() / Ch`, `DataPrivacyCommitment.tsx / DataPrivacyCommitment(`, `FeedbackSuggestions.tsx / FeedbackSuggestions / IN`, `useCountUp.ts / useCountUp() / abTesting.ts`, `LanguageContext.tsx / defaultContextValue / Langua`, `kakadeo-survival-guide.tsx / GUIDEO_META / Kakadeo`, `index.tsx / ActivityTicker / BookingModal`, `ThemeContext.tsx / defaultContextValue / Theme`, `interactionTelemetry.ts / ComponentInteractionReco`, `audio.ts / getAudioContext() / playClick()`, `PersonaContext.tsx / defaultContextValue / Persona`, `error-reporting.ts / reportError() / ErrorBoundary`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `supabase` connect `interactionTelemetry.ts / ComponentInteractionReco` to `intelligentNudges.ts / buildWhatsAppNudgeTemplate(`, `offlineBookingQueue.ts / enqueueOfflineBooking() /`, `apiPenTestEngine.ts / PenTestReport / runApiPenTes`, `TasteShieldModal.tsx / ISSUE_OPTIONS / POSITIVE_TA`, `visitorTracking.ts / buildInitialSession() / detec`, `useAuth.tsx / AuthContext / AuthUser`, `FeedbackSuggestions.tsx / FeedbackSuggestions / IN`, `constants.ts / getWhatsAppUrl() / terms.tsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `LOG_FILE`, `STATE_FILE`, `MIGRATIONS_DIR` to the rest of the system?**
  _460 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `BaseHTTPRequestHandler / gemini_web2api.py / accou` be split into smaller, more focused modules?**
  _Cohesion score 0.06299603174603174 - nodes in this community are weakly interconnected._
- **Should `connectAudioEngine.ts / AudioCompressorTelemetry /` be split into smaller, more focused modules?**
  _Cohesion score 0.06464646464646465 - nodes in this community are weakly interconnected._
- **Should `extendedBreakUpsell.ts / calculateExtendedBreakDis` be split into smaller, more focused modules?**
  _Cohesion score 0.07195121951219512 - nodes in this community are weakly interconnected._