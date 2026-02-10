/**
 * 📅 Weekly Review Widget — "15 minutes. Bigger picture."
 *
 * Wins, lessons, and next week's theme.
 * Paste this into Agent Builder > Widgets > View pane.
 *
 * Default State fields needed:
 * - weekLabel, win1, win2, win3, lesson, theme
 */

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
