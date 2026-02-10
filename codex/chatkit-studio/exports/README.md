## Upload these `.widget` files

This folder contains **ready-to-upload** ChatKit Studio widget exports.

### Files

- `my4blocks-four-blocks-planner.widget`
- `my4blocks-daily-retro.widget`

### How to upload

1. Open the Widget Builder: `https://widgets.chatkit.studio/`
2. Click **Upload .widget file**
3. Choose one of the files above.

### What’s inside a `.widget` file?

ChatKit Studio widgets are stored as a JSON bundle that includes:

- `view`: a compact component DSL (e.g. `<Card>...</Card>`) with `{state}` bindings
- `schema` / `jsonSchema`: the widget state schema (Zod and JSON Schema)
- `defaultState`: initial values for the state

This matches the format produced by the Builder’s **Share** link payload.

---

## Widget Library (Reference)

Below are the raw widget templates for quick copy/paste into the Widget Builder.

### 1) Daily Retro (2 min, super tight)

```tsx
<Card
  size="md"
  asForm={true}
  status={{ text: "2 minutes. Honest answers." }}
  confirm={{
    label: "Save retro",
    action: { type: "my4blocks.retro.save", payload: { source: "widget" }, loadingBehavior: "container" },
  }}
>
  <Col gap={12}>
    <Title value="Daily Retro" />
    <Caption value={dateLabel} color="secondary" />
    <Divider />

    <Col gap={10}>
      <Col gap={6}>
        <Text value="Block 1" weight="semibold" />
        <Select
          name="b1Status"
          defaultValue={b1Status}
          options={[
            { label: "Done", value: "done" },
            { label: "Partial", value: "partial" },
            { label: "Not done", value: "not_done" },
          ]}
        />
        <Text value={b1Note} color="secondary" editable={{ name: "b1Note", placeholder: "One-line note (optional)" }} />
      </Col>

      <Divider />

      <Col gap={6}>
        <Text value="Block 2" weight="semibold" />
        <Select name="b2Status" defaultValue={b2Status} options={[{ label: "Done", value: "done" }, { label: "Partial", value: "partial" }, { label: "Not done", value: "not_done" }]} />
        <Text value={b2Note} color="secondary" editable={{ name: "b2Note", placeholder: "One-line note (optional)" }} />
      </Col>

      <Divider />

      <Col gap={6}>
        <Text value="Block 3" weight="semibold" />
        <Select name="b3Status" defaultValue={b3Status} options={[{ label: "Done", value: "done" }, { label: "Partial", value: "partial" }, { label: "Not done", value: "not_done" }]} />
        <Text value={b3Note} color="secondary" editable={{ name: "b3Note", placeholder: "One-line note (optional)" }} />
      </Col>

      <Divider />

      <Col gap={6}>
        <Text value="Block 4" weight="semibold" />
        <Select name="b4Status" defaultValue={b4Status} options={[{ label: "Done", value: "done" }, { label: "Partial", value: "partial" }, { label: "Not done", value: "not_done" }]} />
        <Text value={b4Note} color="secondary" editable={{ name: "b4Note", placeholder: "One-line note (optional)" }} />
      </Col>

      <Divider />

      <Col gap={6}>
        <Text value="Friction" weight="semibold" />
        <Text value={friction} editable={{ name: "friction", placeholder: "Name the friction. Don't moralize it." }} />
      </Col>

      <Col gap={6}>
        <Text value="One win" weight="semibold" />
        <Text value={win} editable={{ name: "win", placeholder: "Even a messy day has a win." }} />
      </Col>
    </Col>
  </Col>
</Card>
```

### 2) 4 Blocks Planner (title + why + timebox)

```tsx
<Card
  size="md"
  asForm={true}
  status={{ text: "Pick 4. Everything else is noise." }}
  confirm={{
    label: "Commit my 4 Blocks",
    action: { type: "my4blocks.commit", payload: { source: "widget" }, loadingBehavior: "container" },
  }}
  cancel={{
    label: "Suggest Blocks",
    action: { type: "my4blocks.suggest", payload: { source: "widget" } },
  }}
>
  <Col gap={12}>
    <Title value="Today's 4 Blocks" />
    <Caption value={dateLabel} color="secondary" />
    <Divider />

    <Col gap={10}>
      <Col gap={6}>
        <Text value="Block 1" weight="semibold" />
        <Text value={block1Title} editable={{ name: "block1Title", required: true, placeholder: "Name it." }} />
        <Text value={block1Why} color="secondary" editable={{ name: "block1Why", placeholder: "Why it matters (optional)" }} />
        <Select
          name="block1Time"
          placeholder="Time box (optional)"
          defaultValue={block1Time}
          options={[{ label: "15m", value: "15m" }, { label: "30m", value: "30m" }, { label: "45m", value: "45m" }, { label: "1h", value: "1h" }, { label: "2h", value: "2h" }]}
        />
      </Col>

      <Divider />

      <Col gap={6}>
        <Text value="Block 2" weight="semibold" />
        <Text value={block2Title} editable={{ name: "block2Title", required: true, placeholder: "Name it." }} />
        <Text value={block2Why} color="secondary" editable={{ name: "block2Why", placeholder: "Why it matters (optional)" }} />
        <Select name="block2Time" placeholder="Time box (optional)" defaultValue={block2Time} options={[{ label: "15m", value: "15m" }, { label: "30m", value: "30m" }, { label: "45m", value: "45m" }, { label: "1h", value: "1h" }, { label: "2h", value: "2h" }]} />
      </Col>

      <Divider />

      <Col gap={6}>
        <Text value="Block 3" weight="semibold" />
        <Text value={block3Title} editable={{ name: "block3Title", required: true, placeholder: "Name it." }} />
        <Text value={block3Why} color="secondary" editable={{ name: "block3Why", placeholder: "Why it matters (optional)" }} />
        <Select name="block3Time" placeholder="Time box (optional)" defaultValue={block3Time} options={[{ label: "15m", value: "15m" }, { label: "30m", value: "30m" }, { label: "45m", value: "45m" }, { label: "1h", value: "1h" }, { label: "2h", value: "2h" }]} />
      </Col>

      <Divider />

      <Col gap={6}>
        <Text value="Block 4" weight="semibold" />
        <Text value={block4Title} editable={{ name: "block4Title", required: true, placeholder: "Name it." }} />
        <Text value={block4Why} color="secondary" editable={{ name: "block4Why", placeholder: "Why it matters (optional)" }} />
        <Select name="block4Time" placeholder="Time box (optional)" defaultValue={block4Time} options={[{ label: "15m", value: "15m" }, { label: "30m", value: "30m" }, { label: "45m", value: "45m" }, { label: "1h", value: "1h" }, { label: "2h", value: "2h" }]} />
      </Col>
    </Col>

    <Divider />
    <Caption value="If it isn't a Block, it isn't happening." color="secondary" />
  </Col>
</Card>
```

### 3) Morning “Do Less” Prioritizer (1–3 musts)

```tsx
<Card
  size="md"
  asForm={true}
  status={{ text: "Choose the few. Release the many." }}
  confirm={{ label: "Lock priorities", action: { type: "priorities.save", payload: { source: "widget" }, loadingBehavior: "container" } }}
>
  <Col gap={12}>
    <Title value="Morning Priorities" />
    <Caption value={dateLabel} color="secondary" />
    <Divider />

    <Col gap={10}>
      <Col gap={6}>
        <Text value="Top 1 (must)" weight="semibold" />
        <Text value={p1} editable={{ name: "p1", required: true, placeholder: "The one thing" }} />
      </Col>
      <Col gap={6}>
        <Text value="Top 2" weight="semibold" />
        <Text value={p2} editable={{ name: "p2", placeholder: "Nice-to-have" }} />
      </Col>
      <Col gap={6}>
        <Text value="Top 3" weight="semibold" />
        <Text value={p3} editable={{ name: "p3", placeholder: "Bonus if energy exists" }} />
      </Col>

      <Divider />

      <Col gap={6}>
        <Text value="One thing to actively ignore" weight="semibold" />
        <Text value={ignore} editable={{ name: "ignore", placeholder: "A distraction wearing a tuxedo" }} />
      </Col>
    </Col>
  </Col>
</Card>
```

### 4) Focus Sprint (25/50 min) with intention + shutdown

```tsx
<Card
  size="md"
  asForm={true}
  status={{ text: "Start a sprint. Finish it clean." }}
  confirm={{ label: "Start sprint", action: { type: "sprint.start", payload: { source: "widget" }, loadingBehavior: "container" } }}
  cancel={{ label: "Cancel", action: { type: "sprint.cancel", payload: { source: "widget" } } }}
>
  <Col gap={12}>
    <Title value="Focus Sprint" />
    <Divider />

    <Col gap={10}>
      <Col gap={6}>
        <Text value="Duration" weight="semibold" />
        <Select
          name="duration"
          defaultValue={duration}
          options={[
            { label: "25 min", value: "25" },
            { label: "50 min", value: "50" },
            { label: "75 min", value: "75" },
          ]}
        />
      </Col>

      <Col gap={6}>
        <Text value="What are you shipping?" weight="semibold" />
        <Text value={goal} editable={{ name: "goal", required: true, placeholder: "A crisp outcome" }} />
      </Col>

      <Col gap={6}>
        <Text value="If distracted, do this instead:" weight="semibold" />
        <Text value={fallback} color="secondary" editable={{ name: "fallback", placeholder: "Tiny safe action (e.g., write one sentence)" }} />
      </Col>

      <Divider />

      <Col gap={6}>
        <Text value="Shutdown ritual" weight="semibold" />
        <Select
          name="shutdown"
          defaultValue={shutdown}
          options={[
            { label: "Write next step", value: "next_step" },
            { label: "Leave a note to future-me", value: "note" },
            { label: "Clean up workspace", value: "cleanup" },
          ]}
        />
      </Col>
    </Col>
  </Col>
</Card>
```

### 5) “Energy Check” (simple mood + next action)

```tsx
<Card
  size="md"
  asForm={true}
  status={{ text: "No judgment. Just signal." }}
  confirm={{ label: "Log & adapt", action: { type: "energy.log", payload: { source: "widget" }, loadingBehavior: "container" } }}
>
  <Col gap={12}>
    <Title value="Energy Check" />
    <Caption value={dateLabel} color="secondary" />
    <Divider />

    <Col gap={10}>
      <Col gap={6}>
        <Text value="Energy level" weight="semibold" />
        <Select
          name="energy"
          defaultValue={energy}
          options={[
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
          ]}
        />
      </Col>

      <Col gap={6}>
        <Text value="What's weighing on you?" weight="semibold" />
        <Text value={weight} editable={{ name: "weight", placeholder: "Name it in one line" }} />
      </Col>

      <Col gap={6}>
        <Text value="Next best action (small)" weight="semibold" />
        <Text value={next} editable={{ name: "next", required: true, placeholder: "The smallest step that counts" }} />
      </Col>
    </Col>
  </Col>
</Card>
```

### 6) Weekly Review (wins + lessons + next week theme)

```tsx
<Card
  size="lg"
  asForm={true}
  status={{ text: "15 minutes. Bigger picture." }}
  confirm={{ label: "Save review", action: { type: "weekly.save", payload: { source: "widget" }, loadingBehavior: "container" } }}
>
  <Col gap={12}>
    <Title value="Weekly Review" />
    <Caption value={weekLabel} color="secondary" />
    <Divider />

    <Col gap={10}>
      <Col gap={6}>
        <Text value="Top 3 wins" weight="semibold" />
        <Text value={win1} editable={{ name: "win1", placeholder: "Win #1" }} />
        <Text value={win2} editable={{ name: "win2", placeholder: "Win #2" }} />
        <Text value={win3} editable={{ name: "win3", placeholder: "Win #3" }} />
      </Col>

      <Divider />

      <Col gap={6}>
        <Text value="One lesson" weight="semibold" />
        <Text value={lesson} editable={{ name: "lesson", placeholder: "What did reality teach you?" }} />
      </Col>

      <Col gap={6}>
        <Text value="Next week's theme" weight="semibold" />
        <Text value={theme} editable={{ name: "theme", placeholder: "A word or short phrase" }} />
      </Col>
    </Col>
  </Col>
</Card>
```

### 7) Habit “Streak Saver” (micro-commitment)

```tsx
<Card
  size="md"
  asForm={true}
  status={{ text: "Minimum viable victory." }}
  confirm={{ label: "Commit", action: { type: "habit.commit", payload: { source: "widget" }, loadingBehavior: "container" } }}
>
  <Col gap={12}>
    <Title value="Streak Saver" />
    <Divider />

    <Col gap={10}>
      <Col gap={6}>
        <Text value="Habit" weight="semibold" />
        <Select
          name="habit"
          defaultValue={habit}
          options={[
            { label: "Gym", value: "gym" },
            { label: "Walk", value: "walk" },
            { label: "Read", value: "read" },
            { label: "Meditate", value: "meditate" },
            { label: "Code", value: "code" },
          ]}
        />
      </Col>

      <Col gap={6}>
        <Text value="Minimum version" weight="semibold" />
        <Select
          name="minimum"
          defaultValue={minimum}
          options={[
            { label: "1 minute", value: "1m" },
            { label: "5 minutes", value: "5m" },
            { label: "10 minutes", value: "10m" },
            { label: "15 minutes", value: "15m" },
          ]}
        />
      </Col>

      <Col gap={6}>
        <Text value="When will you do it?" weight="semibold" />
        <Select
          name="when"
          defaultValue={when}
          options={[
            { label: "Now", value: "now" },
            { label: "After lunch", value: "after_lunch" },
            { label: "Tonight", value: "tonight" },
            { label: "Before bed", value: "before_bed" },
          ]}
        />
      </Col>
    </Col>
  </Col>
</Card>
```

### 8) “One Email” widget (inbox zero vibes)

```tsx
<Card
  size="md"
  asForm={true}
  status={{ text: "One message. Clean send." }}
  confirm={{ label: "Send", action: { type: "email.send", payload: { source: "widget" }, loadingBehavior: "container" } }}
  cancel={{ label: "Discard", action: { type: "email.discard", payload: { source: "widget" } } }}
>
  <Col gap={12}>
    <Title value="Quick Email" />
    <Divider />

    <Col gap={8}>
      <Col gap={6}>
        <Text value="To" weight="semibold" />
        <Text value={to} editable={{ name: "to", required: true, placeholder: "name@example.com" }} />
      </Col>

      <Col gap={6}>
        <Text value="Subject" weight="semibold" />
        <Text value={subject} editable={{ name: "subject", required: true, placeholder: "Subject" }} />
      </Col>

      <Col gap={6}>
        <Text value="Message" weight="semibold" />
        <Text value={body} minLines={6} editable={{ name: "body", required: true, placeholder: "Write your message..." }} />
      </Col>
    </Col>
  </Col>
</Card>
```

