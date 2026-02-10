/**
 * 🌅 Morning Priorities Widget — "Choose the few. Release the many."
 *
 * Do less, but do the right things. 1-3 priorities max.
 * Paste this into Agent Builder > Widgets > View pane.
 *
 * Default State fields needed:
 * - dateLabel, p1, p2, p3, ignore
 */

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
