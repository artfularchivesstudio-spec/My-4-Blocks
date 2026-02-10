/**
 * 🔥 Streak Saver Widget — "Minimum viable victory."
 *
 * Micro-commitment to keep habits alive on hard days.
 * Paste this into Agent Builder > Widgets > View pane.
 *
 * Default State fields needed:
 * - habit, minimum, when
 */

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
