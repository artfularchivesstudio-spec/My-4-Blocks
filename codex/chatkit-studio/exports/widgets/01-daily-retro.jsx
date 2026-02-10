/**
 * 🎭 Daily Retro Widget — "2 minutes. Honest answers."
 *
 * End-of-day reflection on the 4 Blocks.
 * Paste this into Agent Builder > Widgets > View pane.
 *
 * Default State fields needed:
 * - dateLabel, b1Status, b1Note, b2Status, b2Note,
 * - b3Status, b3Note, b4Status, b4Note, friction, win
 */

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
            { label: "Not done", value: "not_done" }
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
