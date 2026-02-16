/**
 * 🧪 Response Blueprints Test Suite ✨
 *
 * "Where we ensure the blueprints actually... blueprint!"
 *
 * Testing the A/B testing prompts, block detection,
 * and all the mystical utilities that make guidance magical.
 *
 * - The Spellbinding QA Alchemist
 */

import { describe, it, expect } from 'vitest';
import {
  RESPONSE_BLUEPRINT_A,
  RESPONSE_BLUEPRINT_B,
  getBlueprintConfig,
  getRandomBlueprint,
  detectLikelyBlock,
  getBlockFormula,
  buildEnhancedSystemPrompt,
  createResponseMetadata,
  type EmotionalBlock,
  type BlueprintVariant,
} from '../responseBlueprints';

// ═══════════════════════════════════════════════════════════════════════════
// 🎭 BLUEPRINT CONTENT TESTS
// Ensuring our prompts contain the cosmic wisdom they should
// ═══════════════════════════════════════════════════════════════════════════

describe('Response Blueprints Content', () => {
  describe('RESPONSE_BLUEPRINT_A (Structured)', () => {
    /**
     * 📋 Verify Blueprint A contains all 6 steps
     * The methodical approach needs its method!
     */
    it('should contain all 6 structured steps', () => {
      expect(RESPONSE_BLUEPRINT_A).toContain('STEP 1: Safety + Validation');
      expect(RESPONSE_BLUEPRINT_A).toContain('STEP 2: Identify the Block & Formula');
      expect(RESPONSE_BLUEPRINT_A).toContain('STEP 3: Map to THEIR Situation');
      expect(RESPONSE_BLUEPRINT_A).toContain('STEP 4: The Key Shift');
      expect(RESPONSE_BLUEPRINT_A).toContain('STEP 5: Acknowledge Their Strengths');
      expect(RESPONSE_BLUEPRINT_A).toContain('STEP 6: Close with ONE Targeted Question');
    });

    /**
     * 🛡️ Safety first! Crisis resources must be present
     */
    it('should include crisis resources in step 1', () => {
      expect(RESPONSE_BLUEPRINT_A).toContain('988');
      expect(RESPONSE_BLUEPRINT_A).toContain('Crisis Text Line');
      expect(RESPONSE_BLUEPRINT_A).toContain('741741');
    });

    /**
     * 🎯 All four blocks must be documented with formulas
     */
    it('should define all four emotional blocks with formulas', () => {
      expect(RESPONSE_BLUEPRINT_A).toContain('**ANGER**');
      expect(RESPONSE_BLUEPRINT_A).toContain('**ANXIETY**');
      expect(RESPONSE_BLUEPRINT_A).toContain('**DEPRESSION**');
      expect(RESPONSE_BLUEPRINT_A).toContain('**GUILT**');
      expect(RESPONSE_BLUEPRINT_A).toContain('Frustration + DEMAND = Anger');
      expect(RESPONSE_BLUEPRINT_A).toContain('Concern + CATASTROPHIZING = Anxiety');
    });

    /**
     * 🔄 The MUST → preference shift is the core cognitive magic
     */
    it('should explain the MUST to preference shift', () => {
      expect(RESPONSE_BLUEPRINT_A).toContain('MUST → Preference');
      expect(RESPONSE_BLUEPRINT_A).toContain('I would strongly PREFER');
    });

    /**
     * 📚 Must reference Dr. Parr and the book
     */
    it('should reference Dr. Vincent E. Parr and the book', () => {
      expect(RESPONSE_BLUEPRINT_A).toContain('Dr. Vincent E. Parr');
      expect(RESPONSE_BLUEPRINT_A).toContain('You Only Have Four Problems');
    });
  });

  describe('RESPONSE_BLUEPRINT_B (Warm Conversational)', () => {
    /**
     * ☕ Verify Blueprint B has its key sections
     */
    it('should contain key conversational sections', () => {
      expect(RESPONSE_BLUEPRINT_B).toContain('OPENING: Genuine Acknowledgment');
      expect(RESPONSE_BLUEPRINT_B).toContain('GENTLY INTRODUCING THE FRAMEWORK');
      expect(RESPONSE_BLUEPRINT_B).toContain('"I WONDER IF..."');
      expect(RESPONSE_BLUEPRINT_B).toContain('THE SHIFT AS AN INVITATION');
      expect(RESPONSE_BLUEPRINT_B).toContain('ENDING WITH CURIOSITY');
    });

    /**
     * 🛡️ Crisis awareness must be present even in warm mode
     */
    it('should include crisis resources', () => {
      expect(RESPONSE_BLUEPRINT_B).toContain('988');
      expect(RESPONSE_BLUEPRINT_B).toContain('741741');
    });

    /**
     * 🎭 Must explain exploratory language
     */
    it('should emphasize exploratory language', () => {
      expect(RESPONSE_BLUEPRINT_B).toContain('I wonder if');
      expect(RESPONSE_BLUEPRINT_B).toContain('What if');
      expect(RESPONSE_BLUEPRINT_B).toContain('curious');
    });

    /**
     * 📚 Must reference Dr. Parr and the book
     */
    it('should reference Dr. Vincent E. Parr and the book', () => {
      expect(RESPONSE_BLUEPRINT_B).toContain('Dr. Vincent E. Parr');
      expect(RESPONSE_BLUEPRINT_B).toContain('You Only Have Four Problems');
    });

    /**
     * 🚫 Should explicitly avoid therapy-speak
     */
    it('should discourage therapy-speak phrases', () => {
      expect(RESPONSE_BLUEPRINT_B).toContain('Never say "I hear you"');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 UTILITY FUNCTION TESTS
// Making sure our tools work as expected
// ═══════════════════════════════════════════════════════════════════════════

describe('Utility Functions', () => {
  describe('getBlueprintConfig', () => {
    /**
     * 🅰️ Getting variant A should return structured config
     */
    it('should return Blueprint A config for variant A', () => {
      const config = getBlueprintConfig('A');
      expect(config.variant).toBe('A');
      expect(config.name).toBe('Structured Cognitive Guidance');
      expect(config.prompt).toBe(RESPONSE_BLUEPRINT_A);
    });

    /**
     * 🅱️ Getting variant B should return warm config
     */
    it('should return Blueprint B config for variant B', () => {
      const config = getBlueprintConfig('B');
      expect(config.variant).toBe('B');
      expect(config.name).toBe('Warm Conversational Guidance');
      expect(config.prompt).toBe(RESPONSE_BLUEPRINT_B);
    });
  });

  describe('getRandomBlueprint', () => {
    /**
     * 🎲 Random should return a valid variant
     */
    it('should return a valid blueprint config', () => {
      const config = getRandomBlueprint();
      expect(['A', 'B']).toContain(config.variant);
      expect(config.prompt).toBeDefined();
      expect(config.name).toBeDefined();
    });

    /**
     * 🎲 With enough samples, should get both variants
     * (This is probabilistic but with 100 samples, statistically certain)
     */
    it('should eventually return both variants with enough samples', () => {
      const variants = new Set<BlueprintVariant>();
      for (let i = 0; i < 100; i++) {
        variants.add(getRandomBlueprint().variant);
      }
      expect(variants.has('A')).toBe(true);
      expect(variants.has('B')).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 🔮 BLOCK DETECTION TESTS
// The pattern recognition that identifies which cosmic quadrant they're in
// ═══════════════════════════════════════════════════════════════════════════

describe('detectLikelyBlock', () => {
  describe('Anger Detection', () => {
    /**
     * 😤 Should detect anger from "should" directed at others
     */
    it('should detect anger from demands on others', () => {
      expect(detectLikelyBlock("He shouldn't have talked to me like that!")).toBe('Anger');
      expect(detectLikelyBlock("They should know better")).toBe('Anger');
      expect(detectLikelyBlock("This is so unfair!")).toBe('Anger');
      expect(detectLikelyBlock("I'm so angry at my boss")).toBe('Anger');
    });

    /**
     * 😤 Should detect anger from "how dare" patterns
     */
    it('should detect anger from indignation patterns', () => {
      expect(detectLikelyBlock("How dare they ignore me!")).toBe('Anger');
      expect(detectLikelyBlock("How could she do this to me?")).toBe('Anger');
    });
  });

  describe('Anxiety Detection', () => {
    /**
     * 😰 Should detect anxiety from "what if" catastrophizing
     */
    it('should detect anxiety from future worries', () => {
      expect(detectLikelyBlock("What if I fail the interview?")).toBe('Anxiety');
      expect(detectLikelyBlock("I'm so worried about tomorrow")).toBe('Anxiety');
      expect(detectLikelyBlock("I can't stop thinking about what might go wrong")).toBe('Anxiety');
    });

    /**
     * 😰 Should detect anxiety from dread patterns
     */
    it('should detect anxiety from dread language', () => {
      expect(detectLikelyBlock("I'm dreading the meeting")).toBe('Anxiety');
      expect(detectLikelyBlock("Something bad is going to happen")).toBe('Anxiety');
    });
  });

  describe('Depression Detection', () => {
    /**
     * 😔 Should detect depression from self-rating ("I am" statements)
     */
    it('should detect depression from global self-condemnation', () => {
      expect(detectLikelyBlock("I'm such a failure")).toBe('Depression');
      expect(detectLikelyBlock("I am worthless")).toBe('Depression');
      expect(detectLikelyBlock("I'm not good enough")).toBe('Depression');
      expect(detectLikelyBlock("I hate myself")).toBe('Depression');
    });

    /**
     * 😔 Should detect depression from hopelessness
     */
    it('should detect depression from hopelessness patterns', () => {
      expect(detectLikelyBlock("I'll never be successful")).toBe('Depression');
      expect(detectLikelyBlock("Nobody loves me")).toBe('Depression');
    });
  });

  describe('Guilt Detection', () => {
    /**
     * 😓 Should detect guilt from "should have" regret about actions
     */
    it('should detect guilt from action-focused regret', () => {
      expect(detectLikelyBlock("I shouldn't have said that to her")).toBe('Guilt');
      expect(detectLikelyBlock("I wish I hadn't done that")).toBe('Guilt');
      expect(detectLikelyBlock("I feel terrible about what I did")).toBe('Guilt');
    });

    /**
     * 😓 Should detect guilt from shame about behavior
     */
    it('should detect guilt from shame patterns', () => {
      expect(detectLikelyBlock("I'm so ashamed of what I said")).toBe('Guilt');
      expect(detectLikelyBlock("I let everyone down")).toBe('Guilt');
      expect(detectLikelyBlock("How could I have done that?")).toBe('Guilt');
    });
  });

  describe('Edge Cases', () => {
    /**
     * 🌙 Should return null when no clear pattern
     */
    it('should return null for unclear messages', () => {
      expect(detectLikelyBlock("The weather is nice today")).toBe(null);
      expect(detectLikelyBlock("I had a sandwich for lunch")).toBe(null);
      expect(detectLikelyBlock("Hello!")).toBe(null);
    });

    /**
     * 📏 Should handle empty strings gracefully
     */
    it('should return null for empty input', () => {
      expect(detectLikelyBlock("")).toBe(null);
    });

    /**
     * 🎯 Depression vs Guilt differentiation
     * This is the critical distinction from Dr. Parr's framework!
     */
    it('should differentiate depression (self-rating) from guilt (action-rating)', () => {
      // Depression: "I AM bad"
      expect(detectLikelyBlock("I am a terrible person")).toBe('Depression');
      // Guilt: "I DID bad"
      expect(detectLikelyBlock("I did a terrible thing")).toBe('Guilt');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 📚 BLOCK FORMULA TESTS
// Each block has its own cosmic equation
// ═══════════════════════════════════════════════════════════════════════════

describe('getBlockFormula', () => {
  /**
   * 😤 Anger formula verification
   */
  it('should return correct Anger formula', () => {
    const formula = getBlockFormula('Anger');
    expect(formula.formula).toBe('Frustration + DEMAND = Anger');
    expect(formula.coreBeliefPattern).toContain('MUST');
    expect(formula.keyShift).toContain('SHOULD');
    expect(formula.signatureWords).toContain('should');
  });

  /**
   * 😰 Anxiety formula verification
   */
  it('should return correct Anxiety formula', () => {
    const formula = getBlockFormula('Anxiety');
    expect(formula.formula).toBe('Concern + CATASTROPHIZING = Anxiety');
    expect(formula.coreBeliefPattern).toContain('MUST NOT happen');
    expect(formula.signatureWords).toContain('what if');
  });

  /**
   * 😔 Depression formula verification
   */
  it('should return correct Depression formula', () => {
    const formula = getBlockFormula('Depression');
    expect(formula.formula).toBe('Disappointment + SELF-RATING = Depression');
    expect(formula.coreBeliefPattern).toContain('MUST');
    expect(formula.keyShift).toContain('I AM a failure');
    expect(formula.signatureWords).toContain('worthless');
  });

  /**
   * 😓 Guilt formula verification
   */
  it('should return correct Guilt formula', () => {
    const formula = getBlockFormula('Guilt');
    expect(formula.formula).toBe('Regret + MORAL DEMAND = Guilt');
    expect(formula.coreBeliefPattern).toContain('MUST NOT have done');
    expect(formula.signatureWords).toContain('should have');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 🏗️ ENHANCED PROMPT BUILDER TESTS
// Building the complete cosmic instructions
// ═══════════════════════════════════════════════════════════════════════════

describe('buildEnhancedSystemPrompt', () => {
  /**
   * 📋 Should include chosen blueprint
   */
  it('should include the chosen blueprint', () => {
    const promptA = buildEnhancedSystemPrompt('A');
    expect(promptA).toContain('STEP 1: Safety + Validation');

    const promptB = buildEnhancedSystemPrompt('B');
    expect(promptB).toContain('OPENING: Genuine Acknowledgment');
  });

  /**
   * 📚 Should include core framework reference
   */
  it('should include Dr. Parr quote and ABC model', () => {
    const prompt = buildEnhancedSystemPrompt('A');
    expect(prompt).toContain('"Nothing and no one has ever upset you."');
    expect(prompt).toContain('A = Activating Event');
    expect(prompt).toContain('B = Belief');
    expect(prompt).toContain('C = Consequence');
  });

  /**
   * 📖 Should append base knowledge when provided
   */
  it('should include optional base knowledge', () => {
    const baseKnowledge = "Here is some relevant book context about anger management.";
    const prompt = buildEnhancedSystemPrompt('A', baseKnowledge);
    expect(prompt).toContain('## Relevant Context from the Book');
    expect(prompt).toContain(baseKnowledge);
  });

  /**
   * 🎯 Should include depression vs guilt distinction
   */
  it('should include critical depression vs guilt distinction', () => {
    const prompt = buildEnhancedSystemPrompt('A');
    expect(prompt).toContain('Critical: Depression vs Guilt');
    expect(prompt).toContain('DEPRESSION rates the SELF');
    expect(prompt).toContain('GUILT rates the ACTION');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 📊 METADATA CREATION TESTS
// For A/B testing analytics
// ═══════════════════════════════════════════════════════════════════════════

describe('createResponseMetadata', () => {
  /**
   * 🏷️ Should create valid metadata
   */
  it('should create metadata with all fields', () => {
    const metadata = createResponseMetadata(
      'A',
      "I'm so angry at my boss",
      'session-123'
    );

    expect(metadata.blueprintVariant).toBe('A');
    expect(metadata.detectedBlock).toBe('Anger');
    expect(metadata.timestamp).toBeDefined();
    expect(metadata.timestamp).toBeGreaterThan(0);
    expect(metadata.sessionId).toBe('session-123');
  });

  /**
   * 🎲 Should handle optional session ID
   */
  it('should work without session ID', () => {
    const metadata = createResponseMetadata('B', "What if I fail?");

    expect(metadata.blueprintVariant).toBe('B');
    expect(metadata.detectedBlock).toBe('Anxiety');
    expect(metadata.sessionId).toBeUndefined();
  });

  /**
   * 🌙 Should handle unclear messages
   */
  it('should return null block for unclear messages', () => {
    const metadata = createResponseMetadata('A', "Hello there!");

    expect(metadata.detectedBlock).toBe(null);
  });
});
