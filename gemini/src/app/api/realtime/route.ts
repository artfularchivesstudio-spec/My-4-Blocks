/**
 * 🎙️ Gemini Realtime Voice API Route ✨
 *
 * Pass-through route to the shared realtime handler.
 * Provides WebRTC session tokens for OpenAI Realtime API.
 *
 * - The Gemini Voice Portal
 */

import { handleRealtimeRequest } from '../../../../shared/api/realtime';

export async function POST(request: Request) {
  return handleRealtimeRequest(request);
}
