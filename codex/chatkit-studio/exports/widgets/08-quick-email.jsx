/**
 * ✉️ Quick Email Widget — "One message. Clean send."
 *
 * Inbox zero vibes - compose and send one email.
 * Paste this into Agent Builder > Widgets > View pane.
 *
 * Default State fields needed:
 * - to, subject, body
 */

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
