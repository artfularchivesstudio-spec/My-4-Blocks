/**
 * ⏱️ Focus Sprint Widget — "Start a sprint. Finish it clean."
 *
 * 25/50/75 min focused work with intention + shutdown ritual.
 * Paste this into Agent Builder > Widgets > View pane.
 *
 * Default State fields needed:
 * - duration, goal, fallback, shutdown
 */

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
