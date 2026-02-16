/**
 * 🧪 Chat API Route Tests - The Foundational Safety Net ✨
 *
 * "These tests ensure the chat API never breaks in production.
 * If this test fails, don't deploy. Period."
 *
 * Tests:
 * - API route responds correctly
 * - Streaming format is correct for AI SDK
 * - Error handling works properly
 * - Messages are parsed correctly
 *
 * - The Quality Gate Guardian
 */

import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { POST } from '../route';

// 🎭 Mock the handleChatRequest to avoid actual API calls
vi.mock('../../../../shared/api/chat', () => ({
  handleChatRequest: vi.fn().mockImplementation(async (messages, config, signal) => {
    // 🌟 Simulate a streaming response similar to AI SDK v4's toDataStreamResponse()
    const mockStream = new ReadableStream({
      start(controller) {
        // Simulate AI SDK data stream protocol format
        controller.enqueue(new TextEncoder().encode('0:"Hello"\n'));
        controller.enqueue(new TextEncoder().encode('0:" from"\n'));
        controller.enqueue(new TextEncoder().encode('0:" My4Blocks"\n'));
        controller.close();
      },
    });

    return new Response(mockStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
      },
    });
  }),
}));

// 🔧 Helper to create a mock Request
function createMockRequest(body: object): Request {
  return new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// ═══════════════════════════════════════════════════════════════
// 🎯 API Route Basic Functionality
// ═══════════════════════════════════════════════════════════════

describe('Chat API Route - Basic Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 for valid message payload', async () => {
    const req = createMockRequest({
      messages: [
        { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
      ],
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/plain');
  });

  it('should accept messages with parts array format (AI SDK v4+)', async () => {
    const req = createMockRequest({
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          parts: [{ type: 'text', text: 'What is anxiety?' }],
        },
      ],
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
  });

  it('should accept messages with content string format (legacy)', async () => {
    const req = createMockRequest({
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'What is the ABC model?',
        },
      ],
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
  });

  it('should accept multi-turn conversations', async () => {
    const req = createMockRequest({
      messages: [
        { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
        { id: '2', role: 'assistant', parts: [{ type: 'text', text: 'Hi there!' }] },
        { id: '3', role: 'user', parts: [{ type: 'text', text: 'Tell me about anger' }] },
      ],
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
  });
});

// ═══════════════════════════════════════════════════════════════
// 🌩️ Error Handling Tests
// ═══════════════════════════════════════════════════════════════

describe('Chat API Route - Error Handling', () => {
  it('should return 400 for missing messages array', async () => {
    const req = createMockRequest({});

    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Invalid messages');
  });

  it('should return 400 for empty messages array', async () => {
    const req = createMockRequest({ messages: [] });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Invalid messages');
  });

  it('should return 400 for messages not being an array', async () => {
    const req = createMockRequest({ messages: 'not an array' });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Invalid messages');
  });

  it('should return 500 when OPENAI_API_KEY is missing', async () => {
    // Temporarily remove the API key
    const originalKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const req = createMockRequest({
      messages: [
        { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
      ],
    });

    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toContain('Missing OPENAI_API_KEY');

    // Restore the API key
    process.env.OPENAI_API_KEY = originalKey;
  });

  it('should handle malformed JSON gracefully', async () => {
    const req = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not valid json',
    });

    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe('Internal server error');
  });
});

// ═══════════════════════════════════════════════════════════════
// 🌊 Streaming Response Tests
// ═══════════════════════════════════════════════════════════════

describe('Chat API Route - Streaming Response Format', () => {
  it('should return a streaming response', async () => {
    const req = createMockRequest({
      messages: [
        { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
      ],
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(ReadableStream);
  });

  it('should have correct streaming headers for AI SDK', async () => {
    const req = createMockRequest({
      messages: [
        { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
      ],
    });

    const response = await POST(req);

    // AI SDK expects text/plain or application/octet-stream for data streams
    const contentType = response.headers.get('Content-Type');
    expect(contentType).toMatch(/text\/plain|application\/octet-stream/);
  });

  it('should stream readable content', async () => {
    const req = createMockRequest({
      messages: [
        { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
      ],
    });

    const response = await POST(req);
    const reader = response.body?.getReader();

    expect(reader).toBeDefined();

    // Read first chunk
    const { value, done } = await reader!.read();
    expect(done).toBe(false);
    expect(value).toBeDefined();

    // Decode and check it's valid
    const text = new TextDecoder().decode(value);
    expect(text.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// 🔐 Security Tests
// ═══════════════════════════════════════════════════════════════

describe('Chat API Route - Security', () => {
  it('should not leak API key in error responses', async () => {
    // Set a test API key that looks real
    const originalKey = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = 'sk-test1234567890abcdef';

    const req = createMockRequest({
      messages: 'invalid', // Force an error
    });

    const response = await POST(req);
    const body = await response.json();

    // Ensure API key is not in the response
    const responseText = JSON.stringify(body);
    expect(responseText).not.toContain('sk-test');
    expect(responseText).not.toContain('OPENAI_API_KEY');

    // Restore
    process.env.OPENAI_API_KEY = originalKey;
  });

  it('should handle XSS attempts in messages', async () => {
    const req = createMockRequest({
      messages: [
        {
          id: '1',
          role: 'user',
          parts: [{ type: 'text', text: '<script>alert("xss")</script>' }],
        },
      ],
    });

    // Should not throw, just process normally
    const response = await POST(req);
    expect(response.status).toBe(200);
  });
});

// ═══════════════════════════════════════════════════════════════
// 🎭 Message Format Compatibility Tests
// ═══════════════════════════════════════════════════════════════

describe('Chat API Route - Message Format Compatibility', () => {
  it('should handle AI SDK v4 useChat message format', async () => {
    // AI SDK v4 useChat sends messages in this format
    const req = createMockRequest({
      messages: [
        {
          id: 'user-msg-123',
          role: 'user',
          content: 'Hello, AI!',
        },
      ],
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
  });

  it('should handle AI SDK v4+ parts format', async () => {
    // AI SDK v4+ can also use parts format
    const req = createMockRequest({
      messages: [
        {
          id: 'user-msg-456',
          role: 'user',
          parts: [
            { type: 'text', text: 'What is' },
            { type: 'text', text: ' the four blocks?' },
          ],
        },
      ],
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
  });

  it('should handle mixed message formats in conversation', async () => {
    // Real conversations might have mixed formats
    const req = createMockRequest({
      messages: [
        { id: '1', role: 'user', content: 'Hi' },
        { id: '2', role: 'assistant', parts: [{ type: 'text', text: 'Hello!' }] },
        { id: '3', role: 'user', content: 'Tell me about anxiety' },
      ],
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
  });
});
