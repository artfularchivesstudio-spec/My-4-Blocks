# My 4 Blocks - Emotional Wellness Chat

A beautiful Next.js application that helps users understand and manage their emotions using the Four Blocks framework from Dr. Vincent E. Parr's groundbreaking work, powered by RAG (Retrieval-Augmented Generation).

## 🌟 The Four Blocks

1. **Anger** - Understanding and managing justified frustration
2. **Anxiety** - Conquering worry and fear
3. **Depression** - Healing sadness and numbness
4. **Guilt** - Releasing shame and regret

## 🏗️ Architecture

```
Next.js Frontend (Vercel) ← → API Routes (Serverless) ← → OpenAI API
                               ↓
                         Vector Search
                               ↓
                        Embeddings JSON
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+ (for processing the book)
- OpenAI API key

### Installation

```bash
cd claude
npm install
```

### Configuration

1. Create `.env.local` and add your OpenAI API key:

```bash
OPENAI_API_KEY=sk-your-key-here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Processing the Book

To generate embeddings from the book PDF:

```bash
# Install Python dependencies
cd scripts
pip install -r requirements.txt

# Set environment variables
export PDF_PATH="../content/you-only-have-four-problems-book-text.pdf"
export OUTPUT_PATH="../data/embeddings.json"
export OPENAI_API_KEY=sk-your-key-here

# Run the processing script
python process_book.py
```

The script will:
1. Extract text from the PDF
2. Chunk the content intelligently using Chonkie
3. Generate embeddings via OpenAI's `text-embedding-3-small`
4. Save to `data/embeddings.json` with metadata

## 📁 Project Structure

```
claude/
├── app/
│   ├── page.tsx              # Landing page
│   ├── chat/page.tsx         # Chat interface
│   ├── api/chat/route.ts     # RAG + OpenAI endpoint
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ChatInterface.tsx     # Main chat component
│   ├── SuggestedPrompts.tsx  # Suggested prompt cards
│   └── MessageBubble.tsx     # Message styling
├── lib/
│   ├── vectorSearch.ts       # Cosine similarity search
│   ├── openai.ts             # OpenAI client
│   └── prompts.ts            # System prompts
├── types/
│   └── embeddings.ts         # TypeScript types
├── data/
│   └── embeddings.json       # Pre-computed embeddings
├── scripts/
│   ├── process_book.py       # Book processing script
│   └── requirements.txt      # Python dependencies
└── public/                    # Static assets
```

## 🎨 UI Features

- **Beautiful glass-morphism design** with calming colors
- **Smooth animations** via Framer Motion
- **Responsive layout** for mobile & desktop
- **Four Blocks visual indicators** for emotional context
- **Streaming chat responses** for real-time interaction
- **Suggested prompts** to guide new users

## 🔗 API Endpoints

### POST /api/chat

```json
{
  "message": "How do I stop getting angry at things I can't control?",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello!" }
  ]
}
```

Returns a streaming text response grounded in the book's wisdom.

## 🧪 How RAG Works

1. **Query Embedding**: User's message is embedded using `text-embedding-3-small`
2. **Similarity Search**: Find the 5 most relevant book chunks via cosine similarity
3. **Context Building**: Format chunks into a coherent context prompt
4. **RAG Response**: Stream a response from GPT-4 that references the retrieved context

## 🚢 Deployment to Vercel

```bash
# Build the project
npm run build

# Deploy
vercel deploy
```

Set the `OPENAI_API_KEY` environment variable in Vercel project settings.

## 📖 Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **AI/ML**: OpenAI API, text-embedding-3-small, GPT-4
- **Processing**: Python, Chonkie, pdfplumber
- **Deployment**: Vercel

## 🎯 Key Features

✨ **RAG-Powered**: Responses grounded in actual book content
🧘 **Compassionate AI**: System prompt designed for emotional support
🎨 **Beautiful UX**: Peaceful, accessible interface
⚡ **Fast**: Pre-computed embeddings, zero cold-start latency
🔒 **Secure**: API keys handled securely via environment variables

## ⚠️ Important Disclaimer

This tool is designed to provide educational guidance based on Dr. Vincent Parr's Four Blocks framework. It is **not** a substitute for professional mental health care. If you're experiencing severe emotional distress, please consult with a licensed mental health professional.

## 📝 License

Based on the teachings of "You Only Have Four Problems" by Dr. Vincent E. Parr. Educational use only.

## 🙏 Credits

- **Book**: "You Only Have Four Problems" by Dr. Vincent E. Parr
- **Inspiration**: Albert Ellis's Rational Emotive Behavior Therapy (REBT)
- **Practices**: Zen mindfulness and Buddhist philosophy

---

**Made with ✨ for emotional wellness**
