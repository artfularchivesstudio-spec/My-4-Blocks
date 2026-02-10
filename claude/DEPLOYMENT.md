# 🚀 Deployment Guide - My 4 Blocks on Vercel

This guide walks you through deploying the My 4 Blocks chat to Vercel for free.

## Prerequisites

- Vercel account ([vercel.com](https://vercel.com))
- OpenAI API key
- GitHub account (optional, for automatic deployments)

## Step 1: Prepare Your Embeddings

Before deploying, you need to generate the embeddings from the book PDF locally:

```bash
cd claude/scripts

# Install Python dependencies
pip install -r requirements.txt

# Generate embeddings (this takes 5-10 minutes)
export PDF_PATH="../content/you-only-have-four-problems-book-text.pdf"
export OUTPUT_PATH="../data/embeddings.json"
export OPENAI_API_KEY=sk-your-openai-key

python process_book.py
```

This creates `claude/data/embeddings.json` which will be bundled with your deployment.

## Step 2: Deploy to Vercel

### Option A: Deploy via CLI (Fastest)

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Navigate to the project
cd /Users/admin/Developer/My-4-Blocks/claude

# Deploy
vercel deploy --prod
```

### Option B: Deploy via Git (Automatic Updates)

1. Push to GitHub:

```bash
cd /Users/admin/Developer/My-4-Blocks/claude
git init
git add .
git commit -m "Initial commit: My 4 Blocks chat"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/my-4-blocks.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) and click "New Project"
3. Import your GitHub repository
4. Configure settings (see below)
5. Deploy

## Step 3: Configure Environment Variables

In Vercel project settings, add:

```
OPENAI_API_KEY = sk-your-key-here
```

## Step 4: Verify Deployment

After deployment completes:

1. Visit your Vercel URL (e.g., `https://my-4-blocks.vercel.app`)
2. Test the home page
3. Try a suggested prompt
4. Verify streaming responses work

## Updating Embeddings After Deployment

If you want to update the embeddings with a newer version of the book:

1. Regenerate locally: `python scripts/process_book.py`
2. Commit and push the updated `claude/data/embeddings.json`
3. Vercel will automatically redeploy

## Monitoring

- **Check logs**: In Vercel dashboard → "Deployments" → click your deployment → "Logs"
- **Monitor API calls**: Use OpenAI dashboard to track token usage
- **Performance**: Vercel provides real-time performance metrics

## Troubleshooting

### "API key not found" error

Make sure `OPENAI_API_KEY` is set in Vercel environment variables, not just in `.env.local`.

### Embeddings file too large

If `data/embeddings.json` is > 50MB, consider:
- Chunking the data into smaller files
- Using a different vector database (Pinecone, Supabase)
- Reducing chunk overlap

### Streaming not working

Check that your API route is properly configured for streaming. Vercel serverless functions support streaming responses.

### Cold starts too slow

The first request after deployment might take 10-15 seconds. Subsequent requests are faster. To improve:
- Upgrade to Vercel Pro for faster instances
- Use Regional Serverless Functions

## Cost Estimates

- **Vercel**: Free tier includes 100 GB bandwidth/month, enough for most use cases
- **OpenAI API**: 
  - Embeddings: ~$0.02 per 1M tokens (one-time during book processing)
  - Chat completion: ~$0.01-0.03 per request (varies by response length)

## Custom Domain

To add a custom domain:

1. Go to Vercel project settings → Domains
2. Add your domain
3. Follow the DNS configuration instructions
4. Update your domain registrar's DNS records

## SSL/TLS

Vercel automatically provides free SSL certificates for all deployments.

## Next Steps

- 🎨 Customize colors and fonts in `app/globals.css`
- 📊 Add analytics with Vercel Analytics
- 🔐 Consider rate limiting if traffic grows
- 🌍 Add internationalization (i18n) for multiple languages

---

**Your My 4 Blocks chat is now live and available to the world!** ✨
