"""
🎭 Streaming Widgets — The Card That Changes Mid-Sentence ✨

"A living card, updating as insight arrives,
so the user sees progress instead of waiting in the dark."

- The Spellbinding Museum Director of Event Streams

Based on the OpenAI "Advanced integrations with ChatKit" doc:
`https://platform.openai.com/docs/guides/custom-chatkit`

Note:
This is intentionally a **snippet**. Your real server class and imports depend on how you
structure your ChatKit server, store, and event loop.
"""


async def stream_four_blocks_widget(thread, stream_widget, Card, Text, generate_id):
    """
    🌟 Stream a simple “4 Blocks” widget.

    - Uses a `Card` widget with multiple `Text` children.
    - Streams it as an event sequence so the UI can render immediately.

    (Playful truth) 🧠: the user’s brain loves “something is happening” more than “please wait”.
    """
    widget = Card(
        children=[
            Text(id="title", value="Today’s 4 Blocks"),
            Text(id="b1", value="1) [Block 1 title]"),
            Text(id="b2", value="2) [Block 2 title]"),
            Text(id="b3", value="3) [Block 3 title]"),
            Text(id="b4", value="4) [Block 4 title]"),
        ]
    )

    async for event in stream_widget(
        thread,
        widget,
        generate_id=generate_id,
    ):
        yield event

