/**
 * 🔋 Energy Check Widget — "No judgment. Just signal."
 *
 * Quick mood check + next micro-action.
 * Paste this into Agent Builder > Widgets > View pane.
 *
 * Default State fields needed:
 * - dateLabel, energy, weight, next
 */

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
