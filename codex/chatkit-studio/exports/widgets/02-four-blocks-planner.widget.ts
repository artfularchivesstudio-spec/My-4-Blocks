/**
 * 🎭 4 Blocks Planner Widget Schema
 *
 * For Widget Studio: https://widgets.chatkit.studio/
 * Copy the Schema and View sections into the editor.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA TAB - Paste this into Widget Studio Schema tab
// ═══════════════════════════════════════════════════════════════════════════════

import { z } from "zod"

const WidgetState = z.object({
  dateLabel: z.string(),
  block1Title: z.string(),
  block1Why: z.string(),
  block1Time: z.string(),
  block2Title: z.string(),
  block2Why: z.string(),
  block2Time: z.string(),
  block3Title: z.string(),
  block3Why: z.string(),
  block3Time: z.string(),
  block4Title: z.string(),
  block4Why: z.string(),
  block4Time: z.string(),
})

export default WidgetState

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT TAB - Paste this into Widget Studio Default tab
// ═══════════════════════════════════════════════════════════════════════════════
/*
{
  "dateLabel": "Today",
  "block1Title": "",
  "block1Why": "",
  "block1Time": "",
  "block2Title": "",
  "block2Why": "",
  "block2Time": "",
  "block3Title": "",
  "block3Why": "",
  "block3Time": "",
  "block4Title": "",
  "block4Why": "",
  "block4Time": ""
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW TAB - Paste this into Widget Studio View tab (above the tabs)
// ═══════════════════════════════════════════════════════════════════════════════
/*
<Card
  size="md"
  asForm={true}
  status={{ text: "Pick 4. Everything else is noise." }}
  confirm={{
    label: "Commit my 4 Blocks",
    action: { type: "my4blocks.commit", payload: { source: "widget" } },
  }}
>
  <Col align="center" gap={2}>
    <Title value="Today's 4 Blocks" />
    <Caption value={dateLabel} color="secondary" />
  </Col>
  <Divider />
  <Col gap={10}>
    <Col gap={4}>
      <Text value="Block 1" weight="semibold" />
      <Text value={block1Title} editable={{ name: "block1Title", required: true, placeholder: "Name it." }} />
      <Text value={block1Why} color="secondary" editable={{ name: "block1Why", placeholder: "Why it matters" }} />
      <Select name="block1Time" placeholder="Time box" defaultValue={block1Time} options={[{ label: "15m", value: "15m" }, { label: "30m", value: "30m" }, { label: "1h", value: "1h" }, { label: "2h", value: "2h" }]} />
    </Col>
    <Divider />
    <Col gap={4}>
      <Text value="Block 2" weight="semibold" />
      <Text value={block2Title} editable={{ name: "block2Title", required: true, placeholder: "Name it." }} />
      <Text value={block2Why} color="secondary" editable={{ name: "block2Why", placeholder: "Why it matters" }} />
      <Select name="block2Time" placeholder="Time box" defaultValue={block2Time} options={[{ label: "15m", value: "15m" }, { label: "30m", value: "30m" }, { label: "1h", value: "1h" }, { label: "2h", value: "2h" }]} />
    </Col>
    <Divider />
    <Col gap={4}>
      <Text value="Block 3" weight="semibold" />
      <Text value={block3Title} editable={{ name: "block3Title", required: true, placeholder: "Name it." }} />
      <Text value={block3Why} color="secondary" editable={{ name: "block3Why", placeholder: "Why it matters" }} />
      <Select name="block3Time" placeholder="Time box" defaultValue={block3Time} options={[{ label: "15m", value: "15m" }, { label: "30m", value: "30m" }, { label: "1h", value: "1h" }, { label: "2h", value: "2h" }]} />
    </Col>
    <Divider />
    <Col gap={4}>
      <Text value="Block 4" weight="semibold" />
      <Text value={block4Title} editable={{ name: "block4Title", required: true, placeholder: "Name it." }} />
      <Text value={block4Why} color="secondary" editable={{ name: "block4Why", placeholder: "Why it matters" }} />
      <Select name="block4Time" placeholder="Time box" defaultValue={block4Time} options={[{ label: "15m", value: "15m" }, { label: "30m", value: "30m" }, { label: "1h", value: "1h" }, { label: "2h", value: "2h" }]} />
    </Col>
  </Col>
  <Divider />
  <Caption value="If it isn't a Block, it isn't happening." color="secondary" textAlign="center" />
</Card>
*/
