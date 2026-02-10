/**
 * 🎭 MCP API Route - Where Tools Meet the Cloud
 *
 * "Every tool call a journey, every response a revelation."
 *
 * This endpoint exposes our My 4 Blocks MCP tools as HTTP APIs
 * that Agent Builder can invoke via the MCP node.
 *
 * - The Spellbinding MCP Gateway ✨
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// 🔮 Tool definitions for MCP protocol
const TOOLS = {
  identify_block: {
    name: 'identify_block',
    description: 'Identify which of the 4 emotional blocks (Anger, Anxiety, Depression, Guilt) a user is experiencing based on their situation.',
    inputSchema: {
      type: 'object',
      properties: {
        situation: { type: 'string', description: 'Brief description of what happened' },
        feelings: { type: 'string', description: 'Words describing emotions' },
        thought_pattern: { type: 'string', description: 'What the user tells themselves' },
      },
      required: ['situation', 'feelings'],
    },
  },
  find_irrational_belief: {
    name: 'find_irrational_belief',
    description: 'Extract the underlying irrational belief from a user narrative using the ABC model.',
    inputSchema: {
      type: 'object',
      properties: {
        situation: { type: 'string', description: 'The activating event' },
        emotional_response: { type: 'string', description: 'How the user feels' },
        self_talk: { type: 'string', description: 'What they tell themselves' },
        identified_block: { type: 'string', enum: ['anger', 'anxiety', 'depression', 'guilt'] },
      },
      required: ['situation', 'emotional_response'],
    },
  },
  dispute_belief: {
    name: 'dispute_belief',
    description: 'Generate REBT disputation questions to challenge an irrational belief.',
    inputSchema: {
      type: 'object',
      properties: {
        belief_statement: { type: 'string', description: 'The belief to dispute' },
        belief_type: { type: 'string', description: 'Type of irrational belief' },
        context: { type: 'string', description: 'Additional context' },
      },
      required: ['belief_statement'],
    },
  },
  create_daily_plan: {
    name: 'create_daily_plan',
    description: 'Create a structured daily emotional wellness plan using the 4 Blocks framework.',
    inputSchema: {
      type: 'object',
      properties: {
        focus_areas: { type: 'array', items: { type: 'string' }, description: 'Blocks to focus on' },
        current_challenges: { type: 'string', description: 'Current challenges' },
        intentions: { type: 'string', description: 'Goals for the day' },
        time_available: { type: 'string', enum: ['quick', 'moderate', 'extended'] },
      },
    },
  },
  reflect_on_day: {
    name: 'reflect_on_day',
    description: 'Generate an end-of-day reflection using the 4 Blocks framework.',
    inputSchema: {
      type: 'object',
      properties: {
        emotional_moments: { type: 'string', description: 'Significant moments from the day' },
        blocks_experienced: { type: 'array', items: { type: 'string' } },
        wins: { type: 'string', description: 'Positive moments' },
        challenges: { type: 'string', description: 'Difficult moments' },
      },
      required: ['emotional_moments'],
    },
  },
}

// 🎯 Block detection patterns
const BLOCK_PATTERNS = {
  anger: ['unfair', 'should', 'shouldn\'t', 'furious', 'annoyed', 'frustrated', 'mad', 'angry', 'demand', 'how dare'],
  anxiety: ['worried', 'anxious', 'scared', 'what if', 'can\'t handle', 'nervous', 'panic', 'dread', 'fear', 'catastrophe'],
  depression: ['worthless', 'hopeless', 'failure', 'useless', 'empty', 'sad', 'depressed', 'no point', 'hate myself'],
  guilt: ['should have', 'shouldn\'t have', 'my fault', 'guilty', 'blame myself', 'regret', 'sorry', 'ashamed'],
}

// 🌟 Disputation questions by source
const DISPUTATION_QUESTIONS = {
  ellis: [
    { question: 'Is this belief logical?', purpose: 'Check for logical fallacies' },
    { question: 'Where is the evidence that this belief is true?', purpose: 'Demand empirical support' },
    { question: 'Is this belief helping you achieve your goals?', purpose: 'Assess pragmatic value' },
    { question: 'What is the worst that could realistically happen?', purpose: 'Reality-test catastrophizing' },
  ],
  byron_katie: [
    { question: 'Is it true?', purpose: 'Initial truth check' },
    { question: 'Can you absolutely know that it\'s true?', purpose: 'Deepen the inquiry' },
    { question: 'How do you react when you believe that thought?', purpose: 'Examine consequences' },
    { question: 'Who would you be without that thought?', purpose: 'Imagine freedom' },
  ],
  stoic: [
    { question: 'Is this within your control?', purpose: 'Dichotomy of control' },
    { question: 'What would a wise person do in this situation?', purpose: 'Perspective taking' },
    { question: 'Will this matter in 5 years?', purpose: 'Temporal perspective' },
  ],
}

// 🔮 Tool implementations
async function identifyBlock(input: { situation: string; feelings: string; thought_pattern?: string }) {
  const text = `${input.situation} ${input.feelings} ${input.thought_pattern || ''}`.toLowerCase()

  const scores: Record<string, number> = { anger: 0, anxiety: 0, depression: 0, guilt: 0 }

  for (const [block, patterns] of Object.entries(BLOCK_PATTERNS)) {
    for (const pattern of patterns) {
      if (text.includes(pattern)) scores[block]++
    }
  }

  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const primary = entries[0]
  const secondary = entries[1]

  return {
    primary_block: primary[0],
    confidence: Math.min(primary[1] / 5, 1),
    secondary_block: secondary[1] > 0 ? secondary[0] : undefined,
    reasoning: `Based on language patterns, the primary emotion appears to be ${primary[0]}.`,
    key_indicators: BLOCK_PATTERNS[primary[0] as keyof typeof BLOCK_PATTERNS].filter(p => text.includes(p)),
  }
}

async function findIrrationalBelief(input: { situation: string; emotional_response: string; self_talk?: string; identified_block?: string }) {
  const beliefTypes = ['it_statements', 'awfulizing', 'cant_stand_it', 'shoulds_musts_demands', 'rating', 'absolutistic_thinking', 'entitlement']
  const text = `${input.situation} ${input.emotional_response} ${input.self_talk || ''}`.toLowerCase()

  let beliefType = 'shoulds_musts_demands'
  if (text.includes('it made me') || text.includes('it caused')) beliefType = 'it_statements'
  if (text.includes('awful') || text.includes('terrible') || text.includes('worst')) beliefType = 'awfulizing'
  if (text.includes('can\'t stand') || text.includes('can\'t take') || text.includes('unbearable')) beliefType = 'cant_stand_it'
  if (text.includes('always') || text.includes('never') || text.includes('everyone')) beliefType = 'absolutistic_thinking'
  if (text.includes('deserve') || text.includes('entitled') || text.includes('owe me')) beliefType = 'entitlement'

  return {
    belief_statement: input.self_talk || `"This situation is causing my ${input.emotional_response}"`,
    belief_type: beliefType,
    abc_breakdown: {
      a_event: input.situation,
      b_belief: input.self_talk || 'Implied belief from emotional response',
      c_consequence: input.emotional_response,
    },
    underlying_demand: 'This situation SHOULD be different than it is.',
  }
}

async function disputeBelief(input: { belief_statement: string; belief_type?: string; context?: string }) {
  const questions = [
    ...DISPUTATION_QUESTIONS.ellis.slice(0, 2),
    ...DISPUTATION_QUESTIONS.byron_katie.slice(0, 2),
    ...DISPUTATION_QUESTIONS.stoic.slice(0, 1),
  ].map(q => ({ ...q, source: 'ellis' }))

  return {
    disputation_questions: questions,
    rational_alternative: 'I prefer things to be different, but I can accept reality as it is while working to change what I can.',
    reframe_suggestion: 'Consider: What can you learn from this situation? How might this challenge help you grow?',
  }
}

async function createDailyPlan(input: { focus_areas?: string[]; current_challenges?: string; intentions?: string; time_available?: string }) {
  const blocks = input.focus_areas || ['anger', 'anxiety', 'depression', 'guilt']

  return {
    morning_check_in: {
      questions: [
        'What emotional patterns do I want to notice today?',
        'What belief might I need to challenge?',
        'What is one thing I can accept today?',
      ],
      intention: input.intentions || 'I will notice my thoughts without judgment.',
    },
    block_focuses: blocks.map(block => ({
      block,
      awareness_prompt: `Notice when ${block} arises. What triggered it?`,
      challenge_question: `Is the belief creating this ${block} absolutely true?`,
    })),
    evening_reflection: {
      review_questions: [
        'What emotional blocks showed up today?',
        'What beliefs did I challenge?',
        'What would I do differently?',
      ],
      gratitude_prompt: 'Name one thing that went well, even if small.',
    },
    affirmation: 'I am learning to observe my thoughts without being controlled by them.',
  }
}

async function reflectOnDay(input: { emotional_moments: string; blocks_experienced?: string[]; wins?: string; challenges?: string }) {
  const text = input.emotional_moments.toLowerCase()
  const detectedBlocks = Object.entries(BLOCK_PATTERNS)
    .filter(([_, patterns]) => patterns.some(p => text.includes(p)))
    .map(([block]) => block)

  return {
    summary: 'Today brought a mix of emotional experiences. Each moment is an opportunity for growth.',
    blocks_analysis: ['anger', 'anxiety', 'depression', 'guilt'].map(block => ({
      block,
      frequency: detectedBlocks.includes(block) ? 'occasional' : 'not_present',
      growth_opportunity: `Practice noticing ${block} without judgment.`,
    })),
    beliefs_to_examine: detectedBlocks.slice(0, 2).map(block => ({
      belief: `A belief related to ${block} that appeared today`,
      related_block: block,
    })),
    celebration: input.wins || 'You showed up and reflected on your day. That counts.',
    tomorrow_intention: 'Tomorrow, I will pause before reacting to notice my thoughts.',
  }
}

// 🎭 Main handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { method, params } = body

    // 📜 List tools
    if (method === 'tools/list') {
      return NextResponse.json({
        tools: Object.values(TOOLS),
      })
    }

    // 🔮 Call tool
    if (method === 'tools/call') {
      const { name, arguments: args } = params

      let result
      switch (name) {
        case 'identify_block':
          result = await identifyBlock(args)
          break
        case 'find_irrational_belief':
          result = await findIrrationalBelief(args)
          break
        case 'dispute_belief':
          result = await disputeBelief(args)
          break
        case 'create_daily_plan':
          result = await createDailyPlan(args)
          break
        case 'reflect_on_day':
          result = await reflectOnDay(args)
          break
        default:
          return NextResponse.json({ error: `Unknown tool: ${name}` }, { status: 400 })
      }

      return NextResponse.json({
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      })
    }

    return NextResponse.json({ error: 'Unknown method' }, { status: 400 })
  } catch (error) {
    console.error('🌩️ MCP Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 🌟 GET handler for tool discovery
export async function GET() {
  return NextResponse.json({
    name: 'my4blocks-mcp',
    version: '1.0.0',
    description: 'My 4 Blocks emotional wellness tools',
    tools: Object.values(TOOLS),
  })
}
