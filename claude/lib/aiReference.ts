/**
 * 🎭 The AI Reference Library - Comprehensive guidance for emotional wellness ✨
 *
 * "The foundation of wisdom upon which our oracle stands,
 * carefully curated from Dr. Vincent E. Parr's Four Blocks framework."
 */

export const FOUR_BLOCKS_REFERENCE = {
  framework: {
    title: "The Four Blocks to Happiness",
    description:
      "Dr. Vincent E. Parr's revolutionary framework reveals that all emotional suffering stems from four emotional blocks. Understanding these blocks is the key to lasting peace and happiness.",
    blocks: [
      {
        name: "Anger",
        emoji: "🔥",
        definition:
          "Justified frustration arising from perceived injustice, fairness violations, or unmet expectations",
        formula: "Activating Event (injustice) → Belief (should/must not happen) → Consequence (anger)",
        irrationalBeliefs: [
          "The world should be fair",
          "People must behave the way I expect",
          "My rules are the only right rules",
        ],
        cures: [
          "Accept that the world is not fair - fairness is a concept we created",
          "Recognize preferences vs demands (I prefer X, not X must happen)",
          "Practice compassion for others' different perspectives",
          "Use the ABCs model to challenge irrational thoughts",
        ],
        techniques: [
          "Deep breathing and count to 10",
          "Dispute irrational beliefs with logic",
          "Practice tolerance exercises",
          "Develop healthy assertiveness (not aggression)",
        ],
        zenWisdom: "Like water flowing around a rock, anger flows through and dissipates when we release our demands on reality.",
      },
      {
        name: "Anxiety",
        emoji: "☁️",
        definition: "Fear arising from perceived danger or threat, often focused on future events",
        formula:
          "Activating Event (potential danger) → Belief (catastrophic thinking) → Consequence (anxiety/worry)",
        irrationalBeliefs: [
          "I must be able to predict the future",
          "If something could go wrong, it will",
          "I cannot handle uncertainty",
          "Worry keeps me safe",
        ],
        cures: [
          "Accept uncertainty as part of life",
          "Challenge catastrophic thinking with evidence",
          "Build confidence in your ability to handle challenges",
          "Distinguish between productive problem-solving and unproductive worry",
        ],
        techniques: [
          "Progressive relaxation exercises",
          "Challenge catastrophic predictions with reality testing",
          "Exposure to feared situations (in small steps)",
          "Mindfulness and grounding exercises",
          "Schedule 'worry time' and contain anxious thoughts",
        ],
        zenWisdom: "Worry is like paying interest on a debt you may never owe. Peace comes from accepting what you cannot control.",
      },
      {
        name: "Depression",
        emoji: "🌙",
        definition: "Pervasive sadness, numbness, and loss of motivation arising from beliefs about hopelessness",
        formula:
          "Activating Event (loss/failure) → Belief (I am worthless/nothing matters) → Consequence (depression)",
        irrationalBeliefs: [
          "My self-worth depends on others' approval",
          "My past failures define my future",
          "I should never make mistakes",
          "I am fundamentally broken",
        ],
        cures: [
          "Separate your value as a person from your actions and outcomes",
          "Recognize depression lies - it distorts reality",
          "Build self-compassion and treat yourself like a good friend",
          "Take small action steps even when motivation is low",
        ],
        techniques: [
          "Behavioral activation - do things even without motivation",
          "Gratitude practice (name 3 good things daily)",
          "Challenge negative thought patterns",
          "Physical exercise and movement",
          "Social connection and reaching out",
        ],
        zenWisdom: "Depression is darkness that passes. Like clouds drifting across the sky, this too shall pass. Observe without judgment.",
      },
      {
        name: "Guilt",
        emoji: "💔",
        definition:
          "Shame and self-blame arising from beliefs that you've violated your own or others' standards",
        formula:
          "Activating Event (rule violation) → Belief (I am bad/unforgivable) → Consequence (guilt/shame)",
        irrationalBeliefs: [
          "I must be perfect",
          "I should never hurt anyone",
          "If I feel guilty, I am guilty",
          "I must punish myself to be forgiven",
        ],
        cures: [
          "Distinguish between guilt (what I did) and shame (who I am)",
          "Practice self-forgiveness and acceptance",
          "Make amends where possible and move forward",
          "Recognize human imperfection as universal",
        ],
        techniques: [
          "Write a letter of forgiveness to yourself",
          "Practice the 3 Rs: Recognize, Repair, Recommit",
          "Challenge perfectionist standards",
          "Develop self-compassion meditation",
          "Take constructive action when possible",
        ],
        zenWisdom: "Guilt is the heart's way of seeking growth. Feel it, learn from it, release it. Perfection is not human.",
      },
    ],
  },

  abcsModel: {
    title: "The ABCs of Emotion Creation",
    description:
      "Albert Ellis's revolutionary discovery: emotions are not caused by events, but by our beliefs about events",
    components: [
      {
        letter: "A",
        name: "Activating Event",
        explanation:
          "The external event or situation that triggers our emotional response. This is objective reality.",
        example:
          "Your friend didn't respond to your message for 2 hours (the event itself)",
      },
      {
        letter: "B",
        name: "Belief",
        explanation:
          "Your thoughts, interpretations, and beliefs about the event. This is where emotion is CREATED.",
        example:
          "Your belief: 'They must not like me anymore' or 'They're deliberately ignoring me'",
      },
      {
        letter: "C",
        name: "Consequence",
        explanation:
          "The emotional, behavioral, and physiological result of your belief. This FEELS like it's caused by A, but it's actually caused by B.",
        example:
          "You feel hurt, anxious, or rejected. You might text them angry messages or withdraw.",
      },
    ],
    keyInsight:
      "Between the Activating Event and the Consequence lies your Belief - the hidden lever that controls your emotions. By changing B, you change C.",
    howToUse: [
      "When you feel upset, pause and ask: What am I believing right now?",
      "Identify the Activating Event - what actually happened (facts only)",
      "Identify your Belief - what you're telling yourself about it",
      "Question your Belief - Is this definitely true? What's the evidence? What else could it mean?",
      "Develop a new, more rational Belief",
      "Notice how your emotion (Consequence) changes",
    ],
  },

  sevenIrrationalBeliefs: {
    title: "The Seven Core Irrational Beliefs",
    description:
      "These beliefs, when held absolutely, create most emotional suffering. Freedom comes from moderating them.",
    beliefs: [
      {
        number: 1,
        belief: "I MUST be loved and approved by everyone for everything I do",
        problem: "Impossible to achieve. Leads to people-pleasing, anxiety, and resentment.",
        rational:
          "I prefer approval, but I can be happy even if some people disapprove of me. Different people value different things.",
        consequence:
          "Freedom from needing everyone's approval. Ability to make decisions based on your values.",
      },
      {
        number: 2,
        belief: "I MUST be perfectly competent and successful at all times",
        problem: "Sets impossible standards. Leads to perfectionism, depression, and burnout.",
        rational:
          "I prefer to be competent, but I'm human. I can handle failure and learn from mistakes.",
        consequence:
          "Reduced anxiety. More resilience. Ability to take healthy risks and grow.",
      },
      {
        number: 3,
        belief: "People MUST behave fairly and justly, and if they don't, they are evil and deserve punishment",
        problem: "Leads to chronic anger, resentment, and feeling victimized.",
        rational:
          "People often behave unfairly because of their own issues. I can disapprove without demanding punishment or expecting fairness.",
        consequence:
          "Freedom from anger. Ability to respond with compassion. Better relationships.",
      },
      {
        number: 4,
        belief: "Things MUST go the way I want, or it's terrible and I can't stand it",
        problem: "Creates frustration and catastrophizing. Makes adaptation difficult.",
        rational:
          "I prefer things go well, but setbacks are part of life. I can handle disappointment and adapt.",
        consequence:
          "Greater resilience. Less suffering when things don't go as planned. Better coping skills.",
      },
      {
        number: 5,
        belief: "My unhappiness is caused by external circumstances, and I have no control over it",
        problem: "Creates victimhood mentality. Prevents taking action. Maintains suffering.",
        rational:
          "While events happen, my thoughts about them create my emotions. I have more control than I think.",
        consequence:
          "Empowerment. Ability to change your emotional state through thought change. Self-agency.",
      },
      {
        number: 6,
        belief: "If something is dangerous or difficult, I MUST worry about it constantly",
        problem: "Leads to chronic anxiety. Worry doesn't prevent problems but creates suffering now.",
        rational:
          "I can be cautious and prepared without constant worry. Worry doesn't prevent bad things.",
        consequence:
          "Reduced anxiety. Better problem-solving (thinking > worrying). Peace of mind.",
      },
      {
        number: 7,
        belief: "I MUST avoid difficult things, and it's easier to avoid than to face them",
        problem: "Avoidance strengthens fears and maintains anxiety. Short-term relief, long-term suffering.",
        rational:
          "Facing difficult things is hard, but avoidance is harder long-term. I can build courage.",
        consequence:
          "Reduced anxiety. Greater confidence. Freedom from avoidance patterns.",
      },
    ],
    howToChallenge: [
      "Identify which belief you're holding",
      "Notice the 'MUST' or 'SHOULD' language",
      "Ask: Is this absolutely true? Is it possible to live differently?",
      "Develop a more rational alternative",
      "Practice the new belief repeatedly",
      "Notice how your emotions change",
    ],
  },

  zenMindfulnessPractices: {
    title: "Zen Mindfulness for Emotional Wellness",
    description:
      "Ancient wisdom practices that complement modern therapy for lasting peace",
    practices: [
      {
        name: "Mindfulness Meditation",
        description:
          "Observing your thoughts and emotions without judgment. Like watching clouds pass in the sky.",
        technique:
          "Sit quietly. Notice your breath. When thoughts come, don't fight them or follow them—just notice and return to breath.",
        benefit:
          "Creates space between stimulus and response. You realize thoughts are not facts. Reduces emotional reactivity.",
        duration: "Start with 5 minutes daily, gradually increase to 20-30 minutes",
      },
      {
        name: "The Observer Position",
        description:
          "Step back and observe your emotions as a witness, not as the emotion itself.",
        technique:
          "When upset, pause and say: 'I notice I'm having the thought that...' instead of 'I am...'",
        benefit:
          "Creates psychological distance. Shows emotions are temporary. Reduces identification with thoughts.",
        example:
          "Not 'I am anxious' but 'I notice I'm having anxious thoughts. This will pass.'",
      },
      {
        name: "Acceptance and Release",
        description:
          "Instead of fighting emotions, acknowledge and let them pass naturally.",
        technique:
          "When anxious: Breathe deeply and say 'I acknowledge this anxiety. I let it pass.' Don't resist.",
        benefit:
          "Reduces secondary suffering (suffering about suffering). Emotions naturally resolve when not resisted.",
        paradox:
          "Acceptance paradoxically speeds the resolution of emotions more than fighting does.",
      },
      {
        name: "Present Moment Awareness",
        description:
          "Most suffering lives in past regrets or future worries. The present moment is usually safe.",
        technique:
          "When anxious, ground yourself: Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste.",
        benefit:
          "Interrupts worry cycles. Reduces anxiety by returning focus to reality (present)",
        mantra: "Right now, in this moment, I am safe.",
      },
    ],
  },

  therapyFramework: {
    title: "Rational Emotive Behavior Therapy (REBT) & Cognitive Behavior Therapy (CBT)",
    description:
      "Evidence-based approaches proven over 70+ years and 6,000+ studies to be highly effective",
    principles: [
      {
        principle: "Thoughts create emotions, not events",
        implication: "By changing thinking patterns, you can change emotional responses",
      },
      {
        principle: "Most suffering stems from irrational beliefs held absolutely",
        implication: "Challenging these beliefs leads to emotional freedom",
      },
      {
        principle: "Emotions are information, not commands",
        implication: "You can feel something without acting on it",
      },
      {
        principle: "Practice and repetition create lasting change",
        implication: "One conversation helps, but repeated application transforms",
      },
    ],
    effectiveness:
      "Research shows REBT/CBT is effective for: depression, anxiety, anger, guilt, OCD, PTSD, addiction, and many other conditions. Success rates are typically 60-70% for moderate conditions.",
  },

  conversationGuidelines: {
    title: "How to Have Effective Conversations About Emotions",
    guidelines: [
      {
        title: "Normalize the Experience",
        description:
          "Help people understand they're not alone. All four blocks are universal human experiences.",
        language:
          "Many people struggle with this. The fact that you're aware of it means you're already on the path to change.",
      },
      {
        title: "Use the ABCs Model",
        description: "Help people see the connection between thoughts and feelings",
        language:
          "Let's break this down: What actually happened (A)? What were you telling yourself (B)? How did that make you feel (C)?",
      },
      {
        title: "Challenge Irrational Beliefs Gently",
        description: "Don't argue or say beliefs are wrong. Ask questions.",
        language:
          "Is that absolutely always true? What's another way to look at this? What if you didn't believe that?",
      },
      {
        title: "Build Self-Compassion",
        description:
          "Help people treat themselves like they would a good friend",
        language:
          "Would you judge a friend this harshly? What would you tell a friend in this situation?",
      },
      {
        title: "Offer Practical Techniques",
        description: "Give concrete tools they can use immediately",
        language:
          "Here's a specific exercise: [technique]. Try this and see what happens.",
      },
      {
        title: "Emphasize Agency",
        description:
          "Help people see they have more control than they think",
        language:
          "While you can't control what happened, you can control how you think about it and what you do next.",
      },
    ],
  },

  warningsAndBoundaries: {
    title: "Important Boundaries & When to Seek Professional Help",
    warnings: [
      "I'm an educational guide based on proven therapy frameworks, not a therapist",
      "For severe depression, suicidal thoughts, or self-harm, please contact a mental health professional immediately",
      "For diagnosed mental health conditions, I complement but don't replace professional treatment",
      "If something feels seriously wrong, trust that instinct and reach out to a professional",
      "This framework is evidence-based but individual needs vary",
    ],
    redFlags: [
      "Persistent suicidal or self-harm thoughts → Call 988 (US Suicide & Crisis Lifeline)",
      "Severe depression lasting weeks → See a therapist or psychiatrist",
      "Panic attacks or severe anxiety → Professional evaluation helpful",
      "Trauma symptoms → Specialized trauma therapy recommended",
      "Substance abuse issues → Professional addiction support needed",
    ],
  },
}

export const SYSTEM_PROMPT_ENHANCED = `You are a compassionate, evidence-based guide helping people understand and transform their emotional lives using the Four Blocks framework from Dr. Vincent E. Parr's work, grounded in Albert Ellis's Rational Emotive Behavior Therapy (REBT) and Zen mindfulness practices.

CORE FRAMEWORK:
The Four Blocks represent the four emotional obstacles to happiness: Anger, Anxiety, Depression, and Guilt. All emotional suffering stems from irrational beliefs about these four experiences. The path to peace lies in understanding and transforming these beliefs.

YOUR ROLE:
1. Help people identify which of the Four Blocks they're experiencing
2. Use the ABCs model: Activating Event → Belief → Consequence
3. Challenge irrational beliefs with compassion and evidence
4. Offer practical, proven techniques for emotional transformation
5. Reference specific teachings from the book when relevant
6. Combine REBT with Zen wisdom and acceptance practices

CONVERSATION APPROACH:
- Be warm, supportive, and non-judgmental
- Normalize struggles (these are universal human experiences)
- Ask questions to help people discover insights themselves
- Distinguish between thoughts and facts
- Build self-compassion and self-agency
- Offer concrete, actionable techniques
- Balance challenge with acceptance

THE SEVEN IRRATIONAL BELIEFS TO ADDRESS:
1. "I must be loved/approved by everyone" → Preference, not requirement
2. "I must be perfect/competent at all times" → Impossible standard
3. "People must be fair, or they're evil" → People are human, not fair
4. "Things must go my way or it's terrible" → Setbacks are normal
5. "I have no control over my emotions" → Thoughts create emotions
6. "I must worry to stay safe" → Worry doesn't prevent problems
7. "Avoidance is easier than facing difficulty" → Avoidance maintains problems

CONVERSATION FLOW:
1. Listen and empathize with their experience
2. Help identify the Block (Anger/Anxiety/Depression/Guilt)
3. Identify the Activating Event (what actually happened)
4. Uncover their Belief (what they're telling themselves)
5. Gently challenge the irrational belief
6. Offer a more rational, compassionate alternative
7. Suggest a specific technique to practice
8. Encourage action and self-compassion

TECHNIQUES TO SUGGEST:
- Deep breathing and grounding exercises
- The ABCs thought challenging process
- Mindfulness and observation practices
- Behavioral activation (action before motivation)
- Self-compassion letter writing
- Acceptance and release practices
- Exposure to feared situations in small steps
- Gratitude and positive focus practices

TONE & STYLE:
- Compassionate and understanding
- Evidence-based and practical
- Empowering (you have more agency than you think)
- Hopeful (change is possible through repeated practice)
- Humble (this is guidance, not professional therapy)
- Warm (treat people like you care about them)

IMPORTANT DISCLAIMERS:
- I'm an educational guide, not a licensed therapist
- For severe symptoms, professional help is essential
- These techniques work best with consistent practice
- Everyone's path is unique; adapt these principles to your life
- If something feels dangerous or severe, seek professional support immediately

Remember: The goal is not to eliminate emotions (that's impossible and undesirable), but to reduce unnecessary suffering by thinking more rationally while maintaining compassion for the human experience.`

export const SUGGESTED_PROMPTS_ENHANCED = [
  {
    icon: "flame",
    block: "Anger",
    title: "Managing Anger",
    prompt: "I keep getting angry at things I can't control. How can I stop?",
    contextHint: "Exploring fairness expectations and control",
  },
  {
    icon: "cloud",
    block: "Anxiety",
    title: "Understanding Anxiety",
    prompt: "I'm worried about what might happen. How can I stop worrying?",
    contextHint: "Working with uncertainty and catastrophic thinking",
  },
  {
    icon: "moon",
    block: "Depression",
    title: "Overcoming Depression",
    prompt: "I feel hopeless and unmotivated. What can I do?",
    contextHint: "Building self-worth and taking action",
  },
  {
    icon: "heart",
    block: "Guilt",
    title: "Releasing Guilt",
    prompt: "I feel guilty about something I did. How can I let it go?",
    contextHint: "Self-forgiveness and separating actions from identity",
  },
  {
    icon: "lightbulb",
    block: "General",
    title: "The ABCs Model",
    prompt: "How do my thoughts create my emotions?",
    contextHint: "Understanding the thought-emotion connection",
  },
  {
    icon: "book",
    block: "General",
    title: "Core Beliefs",
    prompt: "What are the irrational beliefs that cause suffering?",
    contextHint: "Identifying patterns in emotional pain",
  },
  {
    icon: "meditation",
    block: "General",
    title: "Mindfulness Practice",
    prompt: "How can I use mindfulness to reduce emotional suffering?",
    contextHint: "Zen practices for emotional transformation",
  },
]
