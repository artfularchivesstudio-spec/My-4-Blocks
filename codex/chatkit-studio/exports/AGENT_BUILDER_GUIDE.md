# 🎭 Agent Builder Integration Guide

How to register your 8 ChatKit widgets in OpenAI's Agent Builder.

---

## Quick Links

- **Agent Builder**: https://platform.openai.com/agent-builder
- **Widget Builder**: https://widgets.chatkit.studio/
- **ChatKit Docs**: https://platform.openai.com/docs/guides/chatkit

---

## Your Widgets

| # | Widget | Action Type | Purpose |
|---|--------|-------------|---------|
| 1 | Daily Retro | `my4blocks.retro.save` | End-of-day reflection |
| 2 | 4 Blocks Planner | `my4blocks.commit` | Daily planning |
| 3 | Morning Priorities | `priorities.save` | Top 3 focus |
| 4 | Focus Sprint | `sprint.start` | Timed work sessions |
| 5 | Energy Check | `energy.log` | Mood + next action |
| 6 | Weekly Review | `weekly.save` | Week retrospective |
| 7 | Streak Saver | `habit.commit` | Micro-commitments |
| 8 | Quick Email | `email.send` | Inbox zero helper |

---

## Step-by-Step Setup

### Step 1: Open Agent Builder

1. Go to https://platform.openai.com/agent-builder
2. Select your existing workflow (the one with your `wf_...` ID)
3. Click "Edit" to enter the workflow editor

### Step 2: Add Widget Actions

For each widget, you need to create a corresponding **Action** in Agent Builder:

1. Click **"+ Add Action"** in the left sidebar
2. Configure the action:

```
Name: Save Daily Retro
Type: Custom Action
Action ID: my4blocks.retro.save
```

3. Define the **input schema** for the action (what data it receives):

```json
{
  "type": "object",
  "properties": {
    "b1Status": { "type": "string", "enum": ["done", "partial", "not_done"] },
    "b1Note": { "type": "string" },
    "b2Status": { "type": "string", "enum": ["done", "partial", "not_done"] },
    "b2Note": { "type": "string" },
    "b3Status": { "type": "string", "enum": ["done", "partial", "not_done"] },
    "b3Note": { "type": "string" },
    "b4Status": { "type": "string", "enum": ["done", "partial", "not_done"] },
    "b4Note": { "type": "string" },
    "friction": { "type": "string" },
    "win": { "type": "string" }
  }
}
```

### Step 3: Add Widget Views

1. Click **"+ Add View"** (or "Widget") in the workflow
2. Give it a name like "Daily Retro Widget"
3. In the **View** pane, paste the JSX from `./widgets/01-daily-retro.jsx`
4. In the **Default State** pane, add the initial values:

```json
{
  "dateLabel": "",
  "b1Status": "not_done",
  "b1Note": "",
  "b2Status": "not_done",
  "b2Note": "",
  "b3Status": "not_done",
  "b3Note": "",
  "b4Status": "not_done",
  "b4Note": "",
  "friction": "",
  "win": ""
}
```

### Step 4: Connect Actions to Widgets

In the widget JSX, the `confirm.action.type` must match your Action ID:

```jsx
confirm={{
  label: "Save retro",
  action: {
    type: "my4blocks.retro.save",  // <-- Must match Action ID
    payload: { source: "widget" },
    loadingBehavior: "container"
  },
}}
```

### Step 5: Add System Instructions

Update your workflow's **System Instructions** to know when to show each widget:

```
You are My 4 Blocks, an emotional wellness companion based on Dr. Vincent E. Parr's CBT/REBT framework.

## Available Widgets

When the user wants to:
- Plan their day → Show the "4 Blocks Planner" widget
- Reflect on their day → Show the "Daily Retro" widget
- Set morning priorities → Show the "Morning Priorities" widget
- Do focused work → Show the "Focus Sprint" widget
- Check their energy → Show the "Energy Check" widget
- Do a weekly review → Show the "Weekly Review" widget
- Keep a habit streak → Show the "Streak Saver" widget

## The Four Blocks Framework

The 4 emotional blocks are:
1. Anger - Created when we demand others/situations be different
2. Anxiety - Created when we catastrophize about the future
3. Depression - Created when we rate ourselves as worthless
4. Guilt - Created when we blame ourselves for past actions

Help users identify which block they're experiencing and challenge the irrational beliefs creating it.
```

---

## All Action Schemas

### 1. my4blocks.retro.save
```json
{
  "b1Status": "done|partial|not_done",
  "b1Note": "string",
  "b2Status": "done|partial|not_done",
  "b2Note": "string",
  "b3Status": "done|partial|not_done",
  "b3Note": "string",
  "b4Status": "done|partial|not_done",
  "b4Note": "string",
  "friction": "string",
  "win": "string"
}
```

### 2. my4blocks.commit
```json
{
  "block1Title": "string (required)",
  "block1Why": "string",
  "block1Time": "15m|30m|45m|1h|2h",
  "block2Title": "string (required)",
  "block2Why": "string",
  "block2Time": "15m|30m|45m|1h|2h",
  "block3Title": "string (required)",
  "block3Why": "string",
  "block3Time": "15m|30m|45m|1h|2h",
  "block4Title": "string (required)",
  "block4Why": "string",
  "block4Time": "15m|30m|45m|1h|2h"
}
```

### 3. priorities.save
```json
{
  "p1": "string (required)",
  "p2": "string",
  "p3": "string",
  "ignore": "string"
}
```

### 4. sprint.start
```json
{
  "duration": "25|50|75",
  "goal": "string (required)",
  "fallback": "string",
  "shutdown": "next_step|note|cleanup"
}
```

### 5. energy.log
```json
{
  "energy": "low|medium|high",
  "weight": "string",
  "next": "string (required)"
}
```

### 6. weekly.save
```json
{
  "win1": "string",
  "win2": "string",
  "win3": "string",
  "lesson": "string",
  "theme": "string"
}
```

### 7. habit.commit
```json
{
  "habit": "gym|walk|read|meditate|code",
  "minimum": "1m|5m|10m|15m",
  "when": "now|after_lunch|tonight|before_bed"
}
```

### 8. email.send
```json
{
  "to": "string (required)",
  "subject": "string (required)",
  "body": "string (required)"
}
```

---

## Testing Your Widgets

1. Click **"Preview"** in Agent Builder
2. Type prompts like:
   - "Help me plan my 4 blocks for today"
   - "I want to do a daily retro"
   - "Start a 25 minute focus sprint"
3. The widget should appear in the chat
4. Fill it out and submit
5. Check that the action fires correctly

---

## Deploying

1. Click **"Publish"** in Agent Builder
2. Copy the new `wf_...` workflow ID
3. Update your `.env`:
   ```
   CHATKIT_WORKFLOW_ID=wf_your_new_id
   ```
4. Redeploy: `vercel --prod`

---

## Troubleshooting

**Widget not showing?**
- Check that the System Instructions tell the model when to show it
- Make sure the View is properly saved in Agent Builder

**Action not firing?**
- Verify the `action.type` in the JSX matches your Action ID exactly
- Check the browser console for errors

**State not updating?**
- Ensure Default State has all the variables referenced in the JSX
- Variable names are case-sensitive

---

## Files Reference

```
codex/chatkit-studio/exports/widgets/
├── 01-daily-retro.jsx
├── 02-four-blocks-planner.jsx
├── 03-morning-priorities.jsx
├── 04-focus-sprint.jsx
├── 05-energy-check.jsx
├── 06-weekly-review.jsx
├── 07-streak-saver.jsx
└── 08-quick-email.jsx
```

Copy the JSX content from each file into Agent Builder's View pane.
