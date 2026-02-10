# 🚀 Quick Start Guide

Get My 4 Blocks running in minutes!

## 1. Setup (2 minutes)

```bash
cd /Users/admin/Developer/My-4-Blocks/claude

# Install dependencies
npm install
```

## 2. Get Your OpenAI API Key (1 minute)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API keys
4. Create a new secret key
5. Copy it

## 3. Configure Environment (1 minute)

```bash
# Open .env.local
nano .env.local

# Paste your API key:
OPENAI_API_KEY=sk-your-key-here

# Save (Ctrl+O, Enter, Ctrl+X)
```

## 4. Generate Embeddings (5-10 minutes)

This processes the book PDF into searchable chunks:

```bash
cd scripts

# Install Python dependencies
pip install -r requirements.txt

# Process the book
export PDF_PATH="../content/you-only-have-four-problems-book-text.pdf"
export OUTPUT_PATH="../data/embeddings.json"
export OPENAI_API_KEY=sk-your-key-here

python process_book.py
```

Wait for the script to finish. You'll see: "🎉 ✨ EMBEDDING MASTERPIECE COMPLETE!"

## 5. Run Locally (1 minute)

```bash
cd ..
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 6. Test It Out

- Click "Start Your Journey"
- Try a suggested prompt like "How do I stop getting angry?"
- Watch the streaming response appear

## 7. Deploy to Vercel (5 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod
```

Follow the prompts. When asked about environment variables, add:
```
OPENAI_API_KEY=sk-your-key-here
```

Done! Your app is now live on the internet! 🎉

## Troubleshooting

### "Module not found: @/types/embeddings"

The TypeScript path alias isn't working. Make sure:
- You've run `npm install`
- You're in the `claude` directory
- Restart the dev server: `npm run dev`

### "OPENAI_API_KEY is not set"

Check your `.env.local` file:
- Make sure it's in `/Users/admin/Developer/My-4-Blocks/claude/.env.local`
- Check the key format: `OPENAI_API_KEY=sk-...`
- Restart the dev server

### "embeddings.json not found"

Run the Python script to process the book:
```bash
cd scripts
python process_book.py
```

### Embeddings processing is very slow

This is normal! The script:
- Extracts 80 pages of text
- Splits into intelligent chunks
- Generates embeddings for each (API calls)
- Can take 5-15 minutes depending on your connection

### Chat responses are empty or slow

First chat request might take 10-20 seconds. This is normal for cold starts. Try again after a few seconds.

---

Need help? Check the [README.md](README.md) for more details!
