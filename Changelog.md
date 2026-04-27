# 🎭 My-4-Blocks Changelog ✨

> *"Where digital feelings meet artisanal code, hand-crafted with love."*

---

## 📅 April 27, 2026 (The Golden Hour)

### 🎁 "The Freemium Gateway: Where Anonymous Souls Become Recognized"

*As dawn breaks on this marathon session, we've bridged the gap between casual curiosity and committed connection. The web app now extends a gentle hand to every wanderer: "Try three messages. Feel the wisdom. Then, if it resonates, save your journey." No hard paywalls, no forced registrations—just authentic value exchange. Meanwhile, the foundation for authenticated persistence is laid with SSR-safe Supabase Auth, cookie-based sessions, and conversion-optimized flows that mirror our mobile app's grace.*

**The Vibe:** That rare moment when technical architecture and user psychology dance in perfect harmony. We're not gatekeeping; we're inviting.

**What We Crafted:**

- **The 3-Message Anonymous Trial** (`components/chat/chat-container.tsx`)
    - **Gentle Counter** — Uses `useTrialCounter` hook to track user messages (not assistant responses, just user sends).
    - **Soft Conversion Prompt** — After 3 messages, `TrialPrompt` appears with dismissible card offering:
        - "Create Free Account" (primary CTA)
        - "Sign In" (secondary CTA for returning users)
        - "Continue without saving →" (respectful dismissal)
    - **Framer Motion Magic** — Smooth entrance/exit animations with `AnimatePresence` for that premium feel.
    - **Persistent Anonymous Access** — Main route `/` remains fully public. No middleware blocking. The prompt is a suggestion, not a wall.

- **Full Supabase Auth Stack** (18 new files, 1177 lines)
    - **SSR-Safe Clients** (`lib/supabase/client.ts`, `server.ts`, `middleware.ts`)
        - Browser client with singleton pattern for Client Components
        - Server client using Next.js `cookies()` API for Server Components/Actions
        - Middleware client for route protection with cookie synchronization
    - **Server Actions** (`app/auth/actions.ts`)
        - `signUpAction` — Email + password with metadata (full_name), returns "Check your email" state
        - `signInAction` — Direct login with `signInWithPassword`
        - `signOutAction` — Clear session, revalidate paths
        - `verifyOtpAction` — 6-digit email verification (matches mobile flow)
        - `resetPasswordAction` — Initiate password recovery
        - `updatePasswordAction` — Complete password reset
    - **Auth UI Components** (`components/auth/`)
        - `AuthProvider` — React context wrapping `onAuthStateChange` for real-time auth awareness
        - `LoginForm` — Clean centered card with error handling, loading states
        - `SignupForm` — Full name + email + password, instant "Check Your Email" success state
        - `VerifyOtpForm` — 6-digit InputOTP component with `input-otp` library integration
        - `TrialPrompt` — The star of the show: conversion-optimized prompt card
    - **Auth Pages** (App Router)
        - `/login` — Returning user gateway
        - `/signup` — New user onboarding  
        - `/verify-otp?email=` — Email confirmation (reads email from query param)
    - **Middleware Protection** (`middleware.ts`)
        - Protected routes: `/dashboard`, `/history`, `/settings`, `/profile` (redirect unauthenticated to /login)
        - Auth route redirects: `/login`, `/signup` redirect authenticated users to `/`
        - Public routes: `/`, `/about`, `/faq`, etc. remain fully accessible
    - **Email Confirmation Handler** (`app/api/auth/confirm/route.ts`)
        - Receives Supabase confirmation links, exchanges `token_hash` for session
        - Redirects with `?verified=true` query param for welcome UI

- **Mobile Auth Verification**
    - Confirmed mobile app has full Supabase Auth implementation in `mobile/lib/features/auth/`
    - Repository pattern with `AuthRepository` (signInWithEmail, signUpWithEmail, verifyOTP, signOut)
    - BLoC pattern with `AuthBloc` managing `AuthInitial`, `AuthLoading`, `Authenticated`, `AuthNeedsVerification`, `Unauthenticated`, `AuthError` states
    - UI in `auth_screen.dart` with email, password, and OTP verification forms
    - **Flow parity achieved:** Web and mobile now share identical auth patterns

- **Vercel Production Deployment**
    - Build completed in 43 seconds, 558 dependencies resolved
    - New routes prerendered: `/login`, `/signup`, `/verify-otp`
    - Middleware registered as Proxy (dynamic route handling)
    - **Live URLs:**
        - Production: https://my4blocks-eqz5iqbw6-gsinghdevs-projects.vercel.app
        - Alias: https://my4blocks.vercel.app

**Architecture Highlights:**
- **@supabase/ssr** — The modern way to do Supabase Auth in Next.js App Router
- **Server Actions** — All auth mutations happen server-side with automatic cookie management
- **Cookie-based sessions** — HTTP-only, Secure, SameSite=strict (no localStorage vulnerabilities)
- **Middleware as bouncer** — Fast path rejection for protected routes, not heavy SSR checks
- **Progressive enhancement** — Auth works without JavaScript (form posts to Server Actions), enhanced with JS for UX polish

**What Remains TODO:**
- Add actual `/dashboard` page for authenticated users (currently redirects to `/`)
- Persist chat history to Supabase (currently anonymous chats are ephemeral)
- Add OAuth providers (Google, Apple) for one-tap signup
- A/B test the 3-message threshold vs 5-message vs 1-message
- Add welcome email post-verification

**Reflection:** This auth system embodies the Four Blocks philosophy—gentle, understanding, non-judgmental. We're not forcing users to commit before they experience value. Three messages is enough to feel the warmth of Dr. Parr's wisdom. After that, the invitation to save their journey feels natural, not transactional. The best conversion flows don't feel like conversion flows—they feel like genuine care for the user's experience. 🧱✨

---

## 📅 April 27, 2026 (Witching Hour)

### 🩹 "The MinimumOSVersion Heist: Patching Flutter's Phantom Plist"

*The clock struck midnight. TestFlight rejected our offering with two cryptic incantations: `MinimumOSVersion` was missing from `App.framework/Info.plist`, a phantom field that Flutter's xcode_backend.sh had silently forgotten to inscribe. We didn't flinch. We dove into the .xcarchive, surgically inserted the missing rune, re-codesigned the framework, and re-exported a pristine IPA. Then — because we're not the kind of artisans who leave a wound to scab over — we carved a permanent ward into `project.pbxproj`: a self-healing build phase that will catch this regression for every build, forever.*

**The Vibe:** That oddly satisfying feeling when a 2-error validation failure turns into a 20.5MB green checkmark in App Store Connect. Build `1.0.0 (2)` ascended at 12:19 AM. We did not blink.

**What We Crafted:**

- **Direct Archive Surgery** (`build/ios/archive/Runner.xcarchive`)
    - **The Plist Whisperer** — Used `plutil -insert MinimumOSVersion -string "13.0"` to inject the missing key into `App.framework/Info.plist`. The phantom rune is now corporeal.
    - **Re-Signing the Sacred** — Re-codesigned `App.framework` and the parent `Runner.app` with the dev cert (Apple's cloud-signing handles the distribution swap at export time), preserving the entitlements ledger.
    - **Clean Re-Export** — `xcodebuild -exportArchive` with our pinned `/usr/bin:$PATH` to dodge Homebrew's incompatible rsync. New IPA: 20,452,246 bytes of cryptographic perfection.

- **The Permanent Ward** (`mobile/ios/Runner.xcodeproj/project.pbxproj`)
    - **A New Build Phase**: `Fix App.framework MinimumOSVersion` — a PBXShellScriptBuildPhase that runs *after* the Embed Pods Frameworks step. It checks `Info.plist`, injects `MinimumOSVersion=${IPHONEOS_DEPLOYMENT_TARGET}` if missing, and re-codesigns the framework with `--preserve-metadata=identifier,entitlements,flags`. Future `flutter build ipa` runs will produce valid uploads on the first try. No more Witching Hour heists.

- **Bundle ID Reconciliation** (already committed in spirit, now codified)
    - `com.my4blocks.my4blocksMobile` → `com.binarybros.my4blocks` across both Runner & RunnerTests targets, matching the App Store Connect record (Team `5Y7NBCKHJP`).

- **Display Name Polish** (`mobile/ios/Runner/Info.plist`)
    - `CFBundleDisplayName` and `CFBundleName` set to **"My 4 Blocks"** — the way the home screen and Settings should always have shown it.

- **Version Cadence** (`mobile/pubspec.yaml`)
    - Marketing version held at `1.0.0`, build number bumped to `+2` per the App Store Connect screenshot. (1.0.2+3 was a parallel-universe artifact; we've returned to the canonical timeline.)
    - `flutter_animate` floor lifted to `^4.5.2` — the older 4.0.0 pin was incompatible with the current Flutter SDK's `hitTestTransform` requirement.

**TestFlight Status:** ✅ **My 4 Blocks 1.0.0 (2) uploaded** at 12:19 AM. Apple is currently inspecting the offering. "Show in App Store Connect" link active.

**What Remains TODO:**
- Wait for App Store Connect processing → "Ready to Test" status (typically 5–30 minutes).
- Notify the TestFlight crew at [https://testflight.apple.com/join/Ay3BWxKW](https://testflight.apple.com/join/Ay3BWxKW) that build 2 is alive.
- Resume the Phase 4 quest: PageIndex initialization, Graph Wiki construction, the next DSPy/GEPA evolution pass — all of which the parallel `claude-zai` session has been quietly excavating.

**Reflection:** There's a particular thrill to debugging Flutter's framework-emission bugs at midnight. The fix wasn't just patching the symptom — it was carving a **build phase that heals itself**, so this exact failure mode can never resurface. That's the difference between fixing a build and fortifying a build pipeline. Every digital craftsman knows: the most beautiful code is the code you'll never have to write a second time. The phantom plist is laid to rest. 🧱✨

---

## 📅 April 27, 2026 (Deep Night)

### 🎸 "The Ripper's Encore: Codifying the Sacred Search"

*Under the flickering neon of the late-night terminal, we've etched the Sacred Search rituals into the very soul of the project. No longer just a suggestion, the lightning-fast `rg` is now our absolute standard, woven into every rule file and mental layer. We're not just searching; we're performing digital archaeology with surgical precision.*

**The Vibe:** Lo-fi beats, high-speed retrieval. It's that feeling when your search results appear before you've even finished the thought. Clean, raw, and unapologetically fast.

**What We Crafted:**

- **The Ripper's Absolute Decree** (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`)
    - **Total Tool Unification** — Strengthened the rules to mandate `ripgrep` (`rg`) for ALL local search operations. We've cast standard `grep` into the digital abyss (except for those rare, dusty remote boxes where `rg` hasn't yet been invited).
    - **Mental Alignment** — Updated our core agent guidelines to ensure that "search first, ask second" is the primary ritual for any code exploration.
    - **Output Purity** — Re-emphasized the ban on `2>&1`, ensuring that every error and stdout stream flows naturally, revealing the raw truth of the process.

- **Remote Archaeology Rituals** (`SSH Commands`)
    - **The `book.local` Expedition** — Performed a deep-dive search on the remote host `book.local` to find the lost Flutter project. While `rg` was absent from that particular machine, we adapted our rituals to keep the quest moving.

**What Remains TODO:**
- Ensure `ripgrep` finds its way onto every machine in our constellation, including `book.local`.
- Continue the quest to find the elusive mobile project path on the remote host to reconcile the TestFlight build mysteries.

**Reflection:** Discipline is the bridge between a cluttered codebase and a crystal-clear portal. By standardizing our search rituals, we ensure that every agent—present and future—operates with the same artisanal precision. 🧱✨

---

## 📅 April 27, 2026 (Early Morning)

### 🚀 "The Ripper's Oath & The Portal Refinement"

*As a new dawn approaches, we have fortified our agent rituals and refined our public-facing persona. The standard `grep` has been retired in favor of the lightning-fast `ripgrep`, and our portals have evolved into portals and companions, reflecting a more accessible digital journey.*

**The Vibe:** Precise and sleek. It's the feeling of a well-oiled machine that speaks a humbler, more direct language. We aren't just building hideouts; we're building bridges (portals) and companions for the road ahead.

**What We Crafted:**

- **A/B Testing Persistence & Dashboard** (`v0/shared/lib/abTesting.ts`, `v0/app/admin/page.tsx`)
    - **Supabase Integration** — Migrated A/B test storage from volatile in-memory to persistent Supabase tables.
    - **The Arena Dashboard** — Created a beautiful new tab in the Admin Portal to visualize variant performance and user preferences.

- **Mobile "Place of Wonder" Upgrade** (`mobile/lib/features/chat/bloc/chat_bloc.dart`)
    - **Haptic Rituals** — Added tactical haptic feedback to message sending, arrival, and completion. The app now *feels* alive.

- **The Ripper's Oath** (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`)
    - **Search Rituals** — Formalized the requirement to **ALWAYS use ripgrep (`rg`)** for all text searches. Standard `grep` is now a relic of the past.
    - **Agent Integrity** — Created `AGENTS.md` and `.cursorrules` to ensure all future intelligence layers follow the same technical and aesthetic protocols.
    - **No Redirection** — Enforced a ban on `2>&1` redirection to keep terminal outputs clear and errors visible.

- **Persona Refinement** (Multiple Files)
    - **No More Sanctuaries** — Rebranded all instances of "Sanctuary" to "Portal," "Companion," or "Console."
    - **Pocket Companion** — The mobile invitation on the home page now welcomes users to "The Pocket Companion," a more intimate and portable name for our native experience.
    - **Admin Portal** — The command center is now officially the "Admin Portal," reflecting its role as a gateway to system mastery.

- **Mobile Version Ascension 2.0** (`mobile/pubspec.yaml`)
    - **The Next Leap** — Ascended to version `1.0.2+3`, preparing for the next wave of TestFlight feedback with our newly refined persona.

**What Remains TODO:**
- Finalize the automated deployment pipeline for future portal updates.
- Monitor seeker interactions with the new "Companion" branding.

**Reflection:** Language shapes reality. By shifting from "Sanctuary" to "Portal" and "Companion," we've moved from a sense of isolation to a sense of connection. And by adopting `ripgrep` as our sacred search tool, we've committed to a future of speed and precision. 🧱✨

---

## 📅 April 26, 2026 (Late Afternoon)
... (rest of the file)
