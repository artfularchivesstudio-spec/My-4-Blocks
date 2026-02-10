/**
 * 🎭 4 Blocks Planner Widget — "Pick 4. Everything else is noise."
 *
 * Daily planning with title, why, and timebox for each block.
 * Paste this into Agent Builder > Widgets > View pane.
 *
 * Default State fields needed:
 * - dateLabel, block1Title, block1Why, block1Time,
 * - block2Title, block2Why, block2Time,
 * - block3Title, block3Why, block3Time,
 * - block4Title, block4Why, block4Time
 */

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
