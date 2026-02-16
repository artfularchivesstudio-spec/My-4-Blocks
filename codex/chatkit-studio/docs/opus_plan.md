## My 4 Blocks - ChatGPT App Improvement Plan

### Project Context

My 4 Blocks is an emotional wellness platform based on Dr. Vincent E. Parr's **"You Only Have Four Problems"** framework.

The project has two main implementations:
- **v0/** – Production Next.js website with custom chat interface
- **codex/chatkit-home/** – ChatKit widget integration

---

### Key Findings from OpenAI Documentation Analysis

After reviewing OpenAI's official ChatGPT Apps SDK documentation, I've identified several opportunities to improve alignment with best practices.

---

## Recommended Improvements

### 1. Extract Atomic Actions from Current Implementation ⭐ **High Priority**

**Current State:**
- The main chat interface (`v0/`) provides general CBT/REBT conversation.
- ChatKit integration (`codex/chatkit-home/`) offers suggested prompts but lacks focused tools.

**OpenAI Best Practice:**

> "Instead of mirroring your full website or native app, identify a few atomic actions that can be extracted as tools. Each tool should expose the minimum inputs and outputs needed for the model to take the next step confidently."

**Recommended Actions:**

1. **Create focused MCP tools** for specific 4 Blocks workflows:
   - `identify_block` – Analyze user's situation to identify which block (Anger/Anxiety/Depression/Guilt)
   - `find_irrational_belief` – Extract the underlying irrational belief from user's narrative
   - `dispute_belief` – Apply REBT disputation questions (Ellis/Byron Katie)
   - `create_daily_plan` – Generate a 4 Blocks daily planning structure
   - `reflect_on_day` – End-of-day reflection using the 4 Blocks framework

2. Each tool should have:
   - Clear, action-oriented names (verb-based)
   - Explicit input parameters (user's situation, emotion, context)
   - Structured output (identified block, belief, disputation questions, etc.)
   - Proper annotations (`readOnlyHint` for analysis tools, no hints for planning tools)

**Files to Create/Modify:**
- New: `mcp-server/` directory with tool definitions
- New: `mcp-server/tools/identify-block.ts`
- New: `mcp-server/tools/find-belief.ts`
- New: `mcp-server/tools/dispute-belief.ts`
- Modify: `codex/chatkit-studio/widgets/four-blocks-planner.md` to align with tool structure

---

### 2. Improve Tool Descriptions for Better Model Selection ⭐ **High Priority**
# My 4 Blocks - ChatGPT App Improvement Plan

## Project Context

My 4 Blocks is an emotional wellness platform based on Dr. Vincent E. Parr's _You Only Have Four Problems_ framework.

The project has two main implementations:
- **v0/** – Production Next.js website with custom chat interface
- **codex/chatkit-home/** – ChatKit widget integration

---

## Key Findings from OpenAI Documentation Analysis

After reviewing OpenAI's official ChatGPT Apps SDK documentation, several opportunities have been identified to better align with best practices.

---

## Recommended Improvements

### 1. Extract Atomic Actions from Current Implementation ⭐ **High Priority**

**Current State**
- The main chat interface (`v0/`) provides general CBT/REBT conversation.
- ChatKit integration (`codex/chatkit-home/`) offers suggested prompts but lacks focused tools.

**OpenAI Best Practice**
> "Instead of mirroring your full website or native app, identify a few atomic actions that can be extracted as tools. Each tool should expose the minimum inputs and outputs needed for the model to take the next step confidently."

**Recommended Actions**
1. **Create focused MCP tools** for specific 4 Blocks workflows:
   - `identify_block` – Analyze user's situation to identify which block (Anger/Anxiety/Depression/Guilt)
   - `find_irrational_belief` – Extract the underlying irrational belief from user's narrative
   - `dispute_belief` – Apply REBT disputation questions (Ellis/Byron Katie)
   - `create_daily_plan` – Generate a 4 Blocks daily planning structure
   - `reflect_on_day` – End-of-day reflection using the 4 Blocks framework
2. Each tool should have:
   - Clear, action-oriented names (verb-based)
   - Explicit input parameters (user's situation, emotion, context)
   - Structured output (identified block, belief, disputation questions, etc.)
   - Proper annotations (`readOnlyHint` for analysis tools, none for planning tools)

**Files to Create/Modify**
- New: `mcp-server/` directory with tool definitions
- New: `mcp-server/tools/identify-block.ts`
- New: `mcp-server/tools/find-belief.ts`
- New: `mcp-server/tools/dispute-belief.ts`
- Modify: `codex/chatkit-studio/widgets/four-blocks-planner.md` to align with tool structure

---

### 2. Improve Tool Descriptions for Better Model Selection ⭐ **High Priority**

**Current State**
- Suggested prompts exist but lack structured tool definitions
- No formal MCP server implementation

**OpenAI Best Practice**
> "Write action-oriented tool names and descriptions that include 'Use this when…' guidance, note disallowed/edge cases, and add parameter descriptions to help the model choose the right tool."

**Recommended Tool Description Format**
```js
{
  name: "identify_block",
  description: "Identify which of the 4 emotional blocks (Anger, Anxiety, Depression, Guilt) a user is experiencing based on their situation. Use this when the user describes an emotional challenge but hasn't yet identified the core emotion. Do not use for general conversation or when the block is already clear.",
  parameters: {
    situation: "Brief description of what happened (1-3 sentences)",
    feelings: "Words the user used to describe their emotions",
    thought_pattern: "What the user is telling themselves about the situation"
  }
}
```

**Files to Create**
- `mcp-server/schemas/tool-schemas.ts`
- `mcp-server/utils/tool-registry.ts`

---

### 3. Implement Conversational UI Patterns (Not Long-Form Content) ⭐ **Medium Priority**

**Current State**
- `/about` and `/book` pages contain long-form educational content
- Could overwhelm users in a conversational context

**OpenAI Best Practice**
> "Avoid displaying long-form or static content better suited for a website or app."

**Recommended Actions**
1. Convert long-form content into conversational, on-demand snippets
2. Use inline cards for bite-sized educational content
3. Implement "Show more" patterns for deeper dives
4. Move comprehensive documentation to external website, keep ChatGPT interface focused on active problem-solving

**Files to Create/Modify**
- New: `components/cards/concept-card.tsx` (for bite-sized CBT concepts)
- New: `components/cards/belief-card.tsx` (for displaying identified beliefs)
- Modify: `app/about/page.tsx` → Convert to conversational FAQ format
- Modify: `app/book/page.tsx` → External link or shortened version

---

### 4. Add Display Modes for Better Presentation ⭐ **Medium Priority**

**Current State**
- Single chat interface without structured display modes
- ChatKit integration exists but doesn't leverage display modes

**OpenAI Best Practice**
ChatGPT Apps support three display modes:
- **Inline cards** - Quick confirmations, summaries
- **Fullscreen** - Rich interactive experiences
- **Picture-in-Picture** - Ongoing sessions (games, live activities)

**Recommended Display Mode Strategy**

**Inline Cards:**
- Belief identification summary card
- Daily 4 Blocks plan card
- Quick emotional check-in card

**Fullscreen:**
- Interactive belief disputation worksheet
- Daily reflection journal interface
- 4 Blocks progress tracker/dashboard

**Implementation Example:**
```jsx
// Example inline card component
export function BeliefCard({ belief, block, disputationQuestions }) {
  return (
    <Card>
      <CardHeader>
        <Badge>{block}</Badge>
        <CardTitle>Belief Identified</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{belief}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={openFullscreen}>Dispute This Belief</Button>
      </CardFooter>
    </Card>
  )
}
```

**Files to Create**
- `components/display-modes/inline-belief-card.tsx`
- `components/display-modes/fullscreen-disputation.tsx`
- `components/display-modes/daily-plan-card.tsx`

---

### 5. Use Apps SDK UI Design System ⭐ **Low Priority (but recommended)**

**Current State**
- Using Radix UI + Tailwind (good foundation!)
- Custom styling may not match ChatGPT's visual language

**OpenAI Recommendation**
> "Use the Apps SDK UI design system. It provides styling foundations with Tailwind, CSS variable design tokens, and a library of well-crafted, accessible components."

**Recommended Actions**
1. Install `@openai/apps-sdk-ui` package
2. Use OpenAI's Figma component library for design consistency
3. Replace custom components with SDK components where applicable
4. Maintain brand colors only on accents/badges (not backgrounds or text)

**Implementation**
```sh
pnpm add @openai/apps-sdk-ui
```

**Files to Modify**
- `v0/tailwind.config.js` - Import SDK design tokens
- `v0/styles/globals.css` - Use CSS variables from SDK
- `components/ui/` - Gradually migrate to SDK components

---

### 6. Optimize ChatKit Integration ⭐ **High Priority**

**Current State**
- ChatKit session endpoint exists (`codex/chatkit-home/app/api/chatkit/session/route.ts`)
- Device ID tracking implemented
- Workflow ID configured

**Gaps**
- No session refresh logic
- Missing tool annotations (`readOnlyHint`, `destructiveHint`, `openWorldHint`)
- No proper error handling for session expiration

**Recommended Actions**

1. **Implement Session Refresh:**
```js
// codex/chatkit-home/app/api/chatkit/session/route.ts
export async function POST(request: Request) {
  const { existingSecret } = await request.json();

  // If existing secret provided, refresh the session
  if (existingSecret) {
    const refreshedSession = await openai.chatkit.sessions.refresh({
      clientSecret: existingSecret
    });
    return Response.json({ client_secret: refreshedSession.client_secret });
  }

  // Otherwise create new session
  const session = await openai.chatkit.sessions.create({
    workflow: { id: process.env.CHATKIT_WORKFLOW_ID },
    user: deviceId
  });

  return Response.json({ client_secret: session.client_secret });
}
```

2. **Add Tool Annotations in Agent Builder:**
When defining tools in the workflow, ensure proper annotations:
- `identify_block` → `readOnlyHint: true` (analysis only)
- `find_irrational_belief` → `readOnlyHint: true` (analysis only)
- `dispute_belief` → `readOnlyHint: true` (provides questions, doesn't change state)
- `create_daily_plan` → no hints (creates new content, requires confirmation)
- `reflect_on_day` → no hints (writes reflection, requires confirmation)

**Files to Modify**
- `codex/chatkit-home/app/api/chatkit/session/route.ts`
- `codex/chatkit-home/app/page.tsx` (update client-side session handling)

---

### 7. Privacy & Data Minimization ⭐ **High Priority (Compliance)**

**Current State**
- No visible privacy policy
- Full conversation context may be sent to endpoints

**OpenAI Requirement**
> "Submissions must include a clear, published privacy policy explaining the categories of personal data collected, the purposes of use, the categories of recipients, and any controls offered to users."

**Recommended Actions**
1. Create privacy policy page
2. Implement data minimization:
   - Only send necessary context to tools (not full chat history)
   - Avoid requesting precise location data
   - No collection of sensitive data (PHI, government IDs, credentials)
3. Add privacy disclosure before first use

**Files to Create**
- `v0/app/privacy/page.tsx`
- `v0/components/privacy-disclosure-banner.tsx`
- Update: `README.md` with privacy practices section

---

### 8. Performance & Responsiveness ⭐ **Medium Priority**

**Current State**
- Streaming responses implemented ✅
- Edge runtime for chat API ✅

**OpenAI Best Practice**
> "Apps must be thoroughly tested to ensure stability, responsiveness, and low latency across a wide range of scenarios."

**Recommended Actions**
1. Add loading states for all tool calls
2. Implement retry logic for failed requests
3. Add timeout handling (max 30s for tool responses)
4. Show "thinking" indicators during processing

**Files to Modify**
- `v0/components/chat/chat-message.tsx` - Add loading states
- `v0/app/api/chat/route.ts` - Add timeout and retry logic
- `codex/chatkit-home/app/page.tsx` - Add error boundaries

---

### 9. UX Checklist Alignment ⭐ **Critical for Submission**

**OpenAI's Publishing Checklist:**

| Criterion                            | Status   | Notes                                               |
|---------------------------------------|----------|-----------------------------------------------------|
| Conversational value                  | ✅        | Leverages natural language for CBT therapy          |
| Beyond base ChatGPT                   | ✅        | Dr. Parr's framework & structured approach          |
| Atomic, model-friendly actions        | ❌        | Need to extract into focused tools (see #1)         |
| Helpful UI only                       | ⚠️        | Some pages are long-form content                    |
| End-to-end in-chat completion         | ✅        | Can complete emotional check-ins in chat            |
| Performance & responsiveness          | ⚠️        | Needs optimization (see #8)                         |
| Discoverability                       | ✅        | Clear prompts like "Help me understand my anxiety"  |
| Platform fit                          | ⚠️        | Not yet using display modes or MCP tools            |

**Blocking Issues for Submission**
1. Must implement atomic tools (#1)
2. Must add privacy policy (#7)
3. Must optimize performance (#8)

---

## Implementation Phases

### Phase 1: Core Infrastructure (Week 1)
- Set up MCP server with 5 core tools
- Add tool annotations and descriptions
- Implement session refresh logic
- Create privacy policy page

_Files:_ `mcp-server/`, `privacy/page.tsx`, `chatkit/session/route.ts`

### Phase 2: Display Modes (Week 2)
- Create inline card components
- Build fullscreen disputation interface
- Add daily plan card
- Integrate with ChatKit

_Files:_ `components/display-modes/`, `chatkit-home/app/page.tsx`

### Phase 3: UX Polish (Week 3)
- Convert long-form content to conversational
- Add loading states and error handling
- Implement Apps SDK UI components
- Add privacy disclosure banner

_Files:_ `about/page.tsx`, `book/page.tsx`, `components/ui/`

### Phase 4: Testing & Optimization (Week 4)
- Performance testing and optimization
- Mobile responsiveness testing
- Accessibility audit (WCAG AA)
- Edge case testing (network failures, long inputs)

---

## Verification Checklist

Before submission, verify:
- All 5 core tools defined with proper annotations
- Privacy policy published and linked
- Session refresh working correctly
- Display modes rendering properly on mobile and desktop
- Response times < 3 seconds for all tools
- No long-form content in chat interface
- Accessibility: contrast ratios meet WCAG AA
- Error handling for all failure modes
- Test credentials provided for review (if using auth)

---

## Critical Files to Create/Modify

**New Files:**
```
mcp-server/
├── index.ts
├── tools/
│   ├── identify-block.ts
│   ├── find-belief.ts
│   ├── dispute-belief.ts
│   ├── create-daily-plan.ts
│   └── reflect-on-day.ts
├── schemas/tool-schemas.ts
└── utils/tool-registry.ts

v0/app/privacy/page.tsx
v0/components/display-modes/
  ├── inline-belief-card.tsx
  ├── fullscreen-disputation.tsx
  └── daily-plan-card.tsx
v0/components/privacy-disclosure-banner.tsx
```

**Modified Files:**
- `codex/chatkit-home/app/api/chatkit/session/route.ts` (session refresh)
- `v0/app/about/page.tsx` (convert to conversational)
- `v0/app/book/page.tsx` (convert to conversational)
- `v0/components/chat/chat-message.tsx` (loading states)

---

## Expected Impact

**User Experience**
- Faster, more focused interactions
- Clear visual feedback with display modes
- Better model understanding through atomic tools

**Compliance**
- Ready for ChatGPT App Store submission
- Privacy-compliant data handling
- Accessible to wider audience (WCAG AA)

**Technical**
- Improved performance and reliability
- Better error handling
- Scalable tool architecture

---

## Next Steps

1. Review this plan with stakeholders
2. Prioritize which improvements to implement first
3. Begin Phase 1 implementation (MCP server + privacy)
4. Test iteratively with real users
5. Submit for ChatGPT App Store review when ready

---

## 10. Claude Code Skills for OpenAI UI/UX Best Practices ⭐ **New**

Create a suite of Claude Code skills that encapsulate OpenAI's ChatGPT Apps SDK best practices, making them reusable across projects.

### Skills to Create

#### Skill 1: `openai-app-ux-review`
- **Purpose:** Review any ChatGPT app project against OpenAI's UX principles checklist.

```yaml
# ~/.claude/skills/openai-app-ux-review/skill.md
name: openai-app-ux-review
description: Review a ChatGPT app project against OpenAI's official UX principles
triggers:
  - "review my chatgpt app ux"
  - "check openai ux compliance"
  - "ux audit for chatgpt"
```

**What it checks:**
- Conversational value (does it leverage ChatGPT's strengths?)
- Beyond base ChatGPT (provides new knowledge/actions/presentation?)
- Atomic, model-friendly actions (tools are indivisible, self-contained?)
- Helpful UI only (would plain text meaningfully degrade UX?)
- End-to-end in-chat completion (can users finish tasks without leaving?)
- Performance & responsiveness (fast enough for chat rhythm?)
- Discoverability (easy to imagine prompts that select this app?)
- Platform fit (uses rich prompts, context, composition?)

**Output:** Checklist report with ✅/❌/⚠️ for each criterion plus recommendations.

---

#### Skill 2: `openai-tool-designer`
- **Purpose:** Generate well-structured MCP tool definitions following OpenAI best practices.

```yaml
# ~/.claude/skills/openai-tool-designer/skill.md
name: openai-tool-designer
description: Design MCP tools with proper names, descriptions, and annotations for ChatGPT Apps
triggers:
  - "design a chatgpt tool"
  - "create mcp tool definition"
  - "openai tool schema"
```

**What it generates:**
- Action-oriented tool names (verb-based)
- "Use this when..." descriptions with edge cases
- Minimal, purpose-driven input parameters
- Proper annotations (`readOnlyHint`, `destructiveHint`, `openWorldHint`)
- TypeScript schema with Zod validation

**Example output:**
```ts
export const identifyBlockTool = {
  name: "identify_block",
  description: "Identify which of the 4 emotional blocks (Anger, Anxiety, Depression, Guilt) a user is experiencing. Use this when the user describes an emotional challenge but hasn't identified the core emotion. Do not use for general conversation.",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false
  },
  parameters: z.object({
    situation: z.string().describe("Brief description of what happened (1-3 sentences)"),
    feelings: z.string().describe("Words the user used to describe their emotions"),
    thought_pattern: z.string().optional().describe("What the user is telling themselves")
  })
}
```

---

#### Skill 3: `openai-display-mode-generator`
- **Purpose:** Generate React components for ChatGPT display modes (inline cards, fullscreen, PiP).

```yaml
# ~/.claude/skills/openai-display-mode-generator/skill.md
name: openai-display-mode-generator
description: Generate React components for ChatGPT Apps display modes following UI guidelines
triggers:
  - "create chatgpt inline card"
  - "generate display mode component"
  - "openai card component"
```

**What it generates:**
- Inline card components (single-purpose, no nested scrolling)
- Inline carousel components (3-8 items, consistent hierarchy)
- Fullscreen components (works with system composer)
- PiP components (responds to chat input)
- Uses Apps SDK UI design system tokens
- WCAG AA accessible by default

---

#### Skill 4: `openai-app-submission-checklist`
- **Purpose:** Generate a complete submission checklist and identify blocking issues.

```yaml
# ~/.claude/skills/openai-app-submission-checklist/skill.md
name: openai-app-submission-checklist
description: Generate ChatGPT App Store submission checklist and identify blocking issues
triggers:
  - "chatgpt app submission checklist"
  - "am i ready to submit my app"
  - "openai app store requirements"
```

**What it checks:**
- Purpose and originality (clear purpose, not copycat)
- Quality and reliability (no crashes, good error handling)
- App name, description, screenshots
- Tool definitions (clear names, accurate descriptions, correct annotations)
- Authentication flow (if applicable)
- Privacy policy (required)
- Safety compliance (usage policies, appropriateness)
- Commerce rules (if applicable)

---

#### Skill 5: `openai-ui-guidelines-quick-ref`
- **Purpose:** Quick reference for ChatGPT Apps UI patterns and rules.

```yaml
# ~/.claude/skills/openai-ui-guidelines-quick-ref/skill.md
name: openai-ui-guidelines-quick-ref
description: Quick reference for ChatGPT Apps UI guidelines - colors, typography, spacing, icons
triggers:
  - "chatgpt ui guidelines"
  - "openai design system reference"
  - "apps sdk ui patterns"
```

**What it provides:**
- Color system (system colors, where to use brand accents)
- Typography rules (system fonts, sizing)
- Spacing & layout guidelines
- Icon & imagery rules
- Accessibility requirements (WCAG AA)
- Do's and Don'ts with examples

**Skills File Structure**
```
~/.claude/skills/
├── openai-app-ux-review/
│   ├── skill.md
│   └── ux-checklist.md
├── openai-tool-designer/
│   ├── skill.md
│   ├── tool-template.ts
│   └── annotation-guide.md
├── openai-display-mode-generator/
│   ├── skill.md
│   ├── templates/
│   │   ├── inline-card.tsx
│   │   ├── inline-carousel.tsx
│   │   ├── fullscreen.tsx
│   │   └── pip.tsx
│   └── design-tokens.css
├── openai-app-submission-checklist/
│   ├── skill.md
│   └── checklist-template.md
└── openai-ui-guidelines-quick-ref/
    ├── skill.md
    └── quick-reference.md
```

---

## 11. Website Enhancements for My4Blocks ⭐ **New**

Enhance the My4Blocks website with more information while maintaining good UI/UX balance.

### Current Website Structure

```
v0/app/
├── page.tsx       (Home - Chat interface)
├── about/page.tsx (About - Framework overview)
└── book/page.tsx  (Book - Dr. Parr's book info)
```

### Proposed Enhancements

**A. Enhanced Home Page (Balanced Approach)**
- Brief tagline under logo: _"Understand your emotions through the Four Blocks framework"_
- 4 subtle icons representing each block (Anger, Anxiety, Depression, Guilt)
- Quick "How it works" section (3 steps, minimal text)
- Testimonials section (2-3 short quotes, optional)

Keep clean:
- Chat interface remains the hero/focus
- No long paragraphs above the fold
- Suggested prompts stay prominent

```jsx
// v0/app/page.tsx enhancement
<section className="quick-intro">
  <h2>The Four Blocks</h2>
  <div className="blocks-grid">
    <BlockIcon name="Anger" icon="🔥" />
    <BlockIcon name="Anxiety" icon="⚡" />
    <BlockIcon name="Depression" icon="🌧️" />
    <BlockIcon name="Guilt" icon="⚖️" />
  </div>
  <p className="text-muted">Click any block to learn more, or just start chatting.</p>
</section>
```

---

**B. Enhanced About Page**

_Current:_ Long-form explanation of the 4 Blocks framework.

**Proposed Structure:**
1. Hero section - One sentence + visual
2. The Four Blocks - Expandable accordion (collapsed by default)
3. The ABC Model - Simple diagram + brief explanation
4. The Seven Irrational Beliefs - Card grid (click to expand)
5. How My4Blocks Helps - 3 steps with icons
6. Meet Dr. Parr - Brief bio with photo
7. CTA - "Start a conversation" button

_UI Pattern:_ Progressive disclosure (show less, let users expand)

```jsx
// v0/app/about/page.tsx structure
<AboutHero />
<FourBlocksAccordion />
<ABCModelDiagram />
<IrrationalBeliefsGrid />
<HowItWorksSteps />
<DrParrBio />
<StartConversationCTA />
```

---

**C. New Pages to Add**

1. `/how-it-works` page
   - Visual step-by-step guide
   - Screenshots/mockups of the chat experience
   - Example conversations (anonymized)
2. `/the-framework` page (deep dive)
   - Full explanation of REBT/CBT foundations
   - The Seven Irrational Beliefs in detail
   - Disputation techniques explained
   - Link to book for further reading
3. `/faq` page
   - Common questions about emotional wellness
   - Technical questions (privacy, data handling)
   - How to get the most from My4Blocks
4. `/privacy` page (required)
   - Privacy policy
   - Data handling practices
   - User rights

---

**D. Visual/UX Enhancements**

- **Color System:**
  - Each block gets a subtle accent color:
    - Anger: Warm red/orange tones
    - Anxiety: Electric blue/yellow
    - Depression: Cool gray/blue
    - Guilt: Deep purple/gray
  - Use sparingly on badges, icons, hover states

- **Micro-interactions:**
  - Smooth transitions between pages
  - Subtle hover effects on cards
  - Loading shimmer for chat responses
  - Block icons animate on hover

- **Accessibility:**
  - All colors meet WCAG AA contrast
  - Keyboard navigation for all interactive elements
  - Screen reader labels for icons
  - Focus indicators visible

- **Mobile-first:**
  - Collapsible navigation
  - Touch-friendly button sizes (min 44x44px)
  - Bottom navigation for key actions
  - Swipeable carousels for blocks info

---

**E. Content Additions (Concise)**

_Add to About/Framework pages:_

| Topic                      | Format                | Length                   |
|----------------------------|----------------------|--------------------------|
| What is the 4 Blocks?      | Paragraph + diagram  | 50 words                 |
| The ABC Model explained    | Visual diagram       | Minimal text             |
| Each of the 4 Blocks       | Expandable cards     | 30 words each            |
| The 7 Irrational Beliefs   | Accordion list       | 20 words each            |
| How to dispute a belief    | Numbered steps       | 5 steps, 10 words each   |
| About Dr. Parr             | Bio card             | 75 words                 |
| The Book                   | Card with CTA        | 40 words + link          |

_Content principles:_
- Every section should fit on one mobile screen
- Use visuals where possible instead of text
- Provide "Learn more" links for deep dives
- Keep primary CTA visible at all times

---

## Files to Create/Modify for Website Enhancements

**New Files:**
```
v0/app/
├── how-it-works/page.tsx
├── the-framework/page.tsx
├── faq/page.tsx
└── privacy/page.tsx

v0/components/
├── home/
│   ├── blocks-preview.tsx
│   ├── quick-intro.tsx
│   └── testimonials.tsx
├── about/
│   ├── about-hero.tsx
│   ├── four-blocks-accordion.tsx
│   ├── abc-model-diagram.tsx
│   ├── irrational-beliefs-grid.tsx
│   ├── how-it-works-steps.tsx
│   └── dr-parr-bio.tsx
├── framework/
│   ├── belief-detail-card.tsx
│   ├── disputation-guide.tsx
│   └── framework-diagram.tsx
└── shared/
    ├── block-icon.tsx
    ├── expandable-section.tsx
    └── learn-more-link.tsx
```

**Modified Files:**
- `v0/app/page.tsx` (add quick intro, blocks preview)
- `v0/app/about/page.tsx` (restructure to accordion/cards)
- `v0/app/book/page.tsx` (simplify, add CTA)
- `v0/components/layout/header.tsx` (add new nav items)

---

## Updated Implementation Phases

### Phase 1: Core Infrastructure (Week 1)
- Set up MCP server with 5 core tools
- Add tool annotations and descriptions
- Implement session refresh logic
- Create privacy policy page

### Phase 2: Website Content Enhancements (Week 2)
- Add `/how-it-works` page
- Add `/the-framework` page with expandable content
- Add `/faq` page
- Enhance home page with blocks preview
- Restructure about page (accordion pattern)

### Phase 3: Claude Code Skills (Week 2-3)
- Create `openai-app-ux-review` skill
- Create `openai-tool-designer` skill
- Create `openai-display-mode-generator` skill
- Create `openai-app-submission-checklist` skill
- Create `openai-ui-guidelines-quick-ref` skill

### Phase 4: Display Modes & UI Polish (Week 3)
- Create inline card components
- Build fullscreen disputation interface
- Add loading states and micro-interactions
- Implement Apps SDK UI components

### Phase 5: Testing & Optimization (Week 4)
- Performance testing
- Mobile responsiveness testing
- Accessibility audit (WCAG AA)
- Edge case testing
- User testing feedback

---

## Resources Referenced

- https://developers.openai.com/apps-sdk/concepts/ux-principles/
- https://developers.openai.com/apps-sdk/concepts/ui-guidelines/
- https://developers.openai.com/apps-sdk/app-submission-guidelines/
- https://developers.openai.com/apps-sdk/
- https://openai.github.io/apps-sdk-ui/
- https://www.figma.com/community/file/1560064615791108827/apps-in-chatgpt-components-templates
