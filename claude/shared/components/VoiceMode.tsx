/**
 * 🎙️ VoiceMode Component - WebRTC Voice Interface ✨
 *
 * "Where voice becomes the bridge between hearts,
 * and wisdom flows through the air like music."
 *
 * Now with voice & style selection! No more condescending
 * therapist voice unless you actually want that.
 *
 * - The Voice Experience Architect (who listens to feedback!)
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// 🎤 Voice & Style Types (imported from realtime API)
export type VoiceOption =
  | 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo'
  | 'marin' | 'sage' | 'shimmer' | 'verse';

export type VoiceStyle = 'direct' | 'warm' | 'casual' | 'professional';

// 🎨 Voice options for the picker - each has its own personality!
export const VOICE_OPTIONS: { id: VoiceOption; name: string; description: string }[] = [
  { id: 'ash', name: 'Ash', description: 'Friendly & conversational' },
  { id: 'alloy', name: 'Alloy', description: 'Neutral & balanced' },
  { id: 'ballad', name: 'Ballad', description: 'Warm storyteller' },
  { id: 'coral', name: 'Coral', description: 'Clear & articulate' },
  { id: 'echo', name: 'Echo', description: 'Soft & thoughtful' },
  { id: 'marin', name: 'Marin', description: 'Natural & modern' },
  { id: 'shimmer', name: 'Shimmer', description: 'Bright & energetic' },
  { id: 'verse', name: 'Verse', description: 'Expressive & dynamic' },
  { id: 'sage', name: 'Sage', description: 'Calm & slow (therapist vibe)' },
];

// 🎭 Style options - how you want to be spoken to
export const STYLE_OPTIONS: { id: VoiceStyle; name: string; description: string }[] = [
  { id: 'direct', name: 'Direct', description: 'Get to the point, no fluff' },
  { id: 'casual', name: 'Casual', description: 'Like chatting over coffee' },
  { id: 'warm', name: 'Warm', description: 'Friendly & supportive' },
  { id: 'professional', name: 'Professional', description: 'Clear & structured' },
];

// 🔮 Types for the component
export interface VoiceModeProps {
  /** Callback when voice session starts */
  onSessionStart?: () => void;
  /** Callback when voice session ends */
  onSessionEnd?: () => void;
  /** Callback when transcript is received */
  onTranscript?: (text: string, role: 'user' | 'assistant') => void;
  /** Initial context query for RAG retrieval */
  contextQuery?: string;
  /** Whether to show transcript in the component */
  showTranscript?: boolean;
  /** Custom API endpoint for realtime session */
  apiEndpoint?: string;
  /** Custom class name for styling */
  className?: string;
  /** Whether voice mode is active */
  isActive?: boolean;
  /** Callback when active state changes */
  onActiveChange?: (active: boolean) => void;
  /** Custom render for the orb visualization */
  renderOrb?: (state: VoiceState) => React.ReactNode;
  /** Default voice selection */
  defaultVoice?: VoiceOption;
  /** Default style selection */
  defaultStyle?: VoiceStyle;
  /** Whether to show voice/style picker */
  showSettings?: boolean;
}

export type VoiceState = 'idle' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error';

export interface TranscriptEntry {
  id: string;
  text: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface AudioLevel {
  level: number;
  frequency: number;
}

/**
 * 🎤 The VoiceMode Component
 *
 * Manages WebRTC connection to OpenAI Realtime API
 * with audio visualization, transcript handling, AND
 * voice/style selection because nobody wants to be
 * talked to like a baby! 👶🚫
 */
export function VoiceMode({
  onSessionStart,
  onSessionEnd,
  onTranscript,
  contextQuery,
  showTranscript = true,
  apiEndpoint = '/api/realtime',
  className = '',
  isActive = false,
  onActiveChange,
  renderOrb,
  defaultVoice = 'ash',      // 🎤 Friendly voice, not the slow therapist one!
  defaultStyle = 'direct',   // 🎭 Get to the point!
  showSettings = true,       // 🎨 Let users customize by default
}: VoiceModeProps) {
  // 🔮 State management
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState<AudioLevel>({ level: 0, frequency: 0 });
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 🎙️ Voice & Style preferences - your voice, your rules!
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(defaultVoice);
  const [selectedStyle, setSelectedStyle] = useState<VoiceStyle>(defaultStyle);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  // 🔗 WebRTC refs
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  /**
   * 📊 Analyze audio levels for visualization
   */
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average level
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const normalizedLevel = Math.min(average / 128, 1);

    // Get dominant frequency
    const maxIndex = dataArray.indexOf(Math.max(...dataArray));
    const frequency = (maxIndex * audioContextRef.current?.sampleRate!) / dataArray.length;

    setAudioLevel({ level: normalizedLevel, frequency });

    if (voiceState === 'connected' || voiceState === 'listening' || voiceState === 'speaking') {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    }
  }, [voiceState]);

  /**
   * 🎬 Start the voice session
   *
   * Now passes voice & style preferences to the API!
   * No more one-size-fits-all condescending voice.
   */
  const startSession = useCallback(async () => {
    try {
      setError(null);
      setVoiceState('connecting');

      // 1. Get ephemeral session token from our API with voice/style prefs
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contextQuery,
          config: {
            voice: selectedVoice,
            style: selectedStyle,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get session token');
      }

      const sessionData = await response.json();
      const ephemeralToken = sessionData.client_secret.value;

      // 2. Get user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 24000,
        },
      });
      streamRef.current = stream;

      // 3. Set up audio analysis
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // 4. Create WebRTC peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      peerConnectionRef.current = pc;

      // 5. Add audio track
      stream.getAudioTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // 6. Set up remote audio playback
      pc.ontrack = (event) => {
        const audio = new Audio();
        audio.srcObject = event.streams[0];
        audio.autoplay = true;
        audioElementRef.current = audio;
      };

      // 7. Set up data channel for events
      const dataChannel = pc.createDataChannel('oai-events');
      dataChannelRef.current = dataChannel;

      dataChannel.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleDataChannelMessage(data);
        } catch (e) {
          console.error('Failed to parse data channel message:', e);
        }
      };

      dataChannel.onopen = () => {
        console.log('🎙️ Data channel opened');
      };

      // 8. Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 9. Send offer to OpenAI
      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime?model=${sessionData.model}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${ephemeralToken}`,
            'Content-Type': 'application/sdp',
          },
          body: offer.sdp,
        }
      );

      if (!sdpResponse.ok) {
        throw new Error('Failed to establish WebRTC connection');
      }

      // 10. Set remote description from answer
      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription(
        new RTCSessionDescription({ type: 'answer', sdp: answerSdp })
      );

      // 11. Connection established
      setVoiceState('connected');
      onActiveChange?.(true);
      onSessionStart?.();

      // Start audio analysis
      analyzeAudio();

      console.log('🎙️ ✨ Voice session established!');
    } catch (err) {
      console.error('💥 Voice session error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start voice session');
      setVoiceState('error');
    }
  }, [apiEndpoint, contextQuery, selectedVoice, selectedStyle, analyzeAudio, onActiveChange, onSessionStart]);

  /**
   * 📨 Handle data channel messages from OpenAI
   */
  const handleDataChannelMessage = useCallback(
    (data: any) => {
      const { type } = data;

      switch (type) {
        case 'session.created':
          console.log('🎙️ Session created:', data.session);
          break;

        case 'session.updated':
          console.log('🎙️ Session updated:', data.session);
          break;

        case 'conversation.item.created':
          console.log('💬 Conversation item created:', data.item);
          break;

        case 'response.created':
          setVoiceState('speaking');
          break;

        case 'response.done':
          setVoiceState('connected');
          break;

        case 'response.audio_transcript.delta':
          // Handle streaming transcript
          if (data.delta) {
            const entry: TranscriptEntry = {
              id: data.item_id || Date.now().toString(),
              text: data.delta,
              role: 'assistant',
              timestamp: new Date(),
            };
            setTranscripts((prev) => [...prev, entry]);
            onTranscript?.(data.delta, 'assistant');
          }
          break;

        case 'conversation.item.input_audio_transcription.completed':
          // User's speech was transcribed
          if (data.transcript) {
            const entry: TranscriptEntry = {
              id: data.item_id || Date.now().toString(),
              text: data.transcript,
              role: 'user',
              timestamp: new Date(),
            };
            setTranscripts((prev) => [...prev, entry]);
            onTranscript?.(data.transcript, 'user');
          }
          break;

        case 'input_audio_buffer.speech_started':
          setVoiceState('listening');
          break;

        case 'input_audio_buffer.speech_stopped':
          setVoiceState('connected');
          break;

        case 'error':
          console.error('🎙️ OpenAI error:', data.error);
          setError(data.error?.message || 'Unknown error');
          break;

        default:
          // Log unhandled events for debugging
          if (process.env.NODE_ENV === 'development') {
            console.log('🎙️ Unhandled event:', type, data);
          }
      }
    },
    [onTranscript]
  );

  /**
   * 🛑 End the voice session
   */
  const endSession = useCallback(() => {
    // Stop audio analysis
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Clean up audio element
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }

    // Clean up data channel
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }

    setVoiceState('idle');
    setAudioLevel({ level: 0, frequency: 0 });
    onActiveChange?.(false);
    onSessionEnd?.();

    console.log('🎙️ Voice session ended');
  }, [onActiveChange, onSessionEnd]);

  /**
   * 🔇 Toggle mute
   */
  const toggleMute = useCallback(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  }, [isMuted]);

  /**
   * 🎨 Default orb visualization
   */
  const defaultRenderOrb = (state: VoiceState) => {
    const size = 120 + audioLevel.level * 40;
    const opacity = state === 'idle' ? 0.3 : 0.6 + audioLevel.level * 0.4;

    const stateColors = {
      idle: '#94a3b8',
      connecting: '#3b82f6',
      connected: '#10b981',
      listening: '#8b5cf6',
      speaking: '#f59e0b',
      error: '#ef4444',
    };

    const color = stateColors[state];

    return (
      <div
        className="voice-orb"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}`,
          boxShadow: `0 0 ${40 + audioLevel.level * 60}px ${color}80`,
          transition: 'all 0.1s ease-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Inner glow */}
        <div
          style={{
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}cc, transparent)`,
            opacity,
          }}
        />

        {/* Pulse animation rings */}
        {(state === 'listening' || state === 'speaking') && (
          <>
            <div
              className="pulse-ring"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `2px solid ${color}`,
                animation: 'pulse 1.5s ease-out infinite',
              }}
            />
            <div
              className="pulse-ring delay"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `2px solid ${color}`,
                animation: 'pulse 1.5s ease-out infinite 0.5s',
              }}
            />
          </>
        )}
      </div>
    );
  };

  /**
   * 🔄 Handle active state changes
   *
   * NOTE: We no longer auto-start when isActive becomes true!
   * Users now see the settings panel first and click "Start Voice Chat"
   * when they're ready. This gives them time to pick their voice/style.
   * We only auto-END when isActive becomes false.
   */
  useEffect(() => {
    if (!isActive && voiceState !== 'idle') {
      endSession();
    }
  }, [isActive, voiceState, endSession]);

  /**
   * 🧹 Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className={`voice-mode ${className}`}>
      {/* Voice Orb Visualization */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        {renderOrb ? renderOrb(voiceState) : defaultRenderOrb(voiceState)}

        {/* Status Text */}
        <div
          style={{
            fontSize: '0.875rem',
            color: '#64748b',
            textAlign: 'center',
          }}
        >
          {voiceState === 'idle' && 'Click to start voice mode'}
          {voiceState === 'connecting' && 'Connecting...'}
          {voiceState === 'connected' && 'Listening...'}
          {voiceState === 'listening' && 'I\'m listening...'}
          {voiceState === 'speaking' && 'Speaking...'}
          {voiceState === 'error' && error}
        </div>

        {/* Controls */}
        {voiceState !== 'idle' && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={toggleMute}
              disabled={voiceState !== 'connected' && voiceState !== 'listening'}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: isMuted ? '#ef4444' : '#3b82f6',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              {isMuted ? '🔇 Unmute' : '🎤 Mute'}
            </button>
            <button
              onClick={endSession}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#ef4444',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              End Session
            </button>
          </div>
        )}

        {/* 🎛️ Voice & Style Settings - customize your experience! */}
        {voiceState === 'idle' && showSettings && (
          <div style={{ width: '100%', maxWidth: '320px' }}>
            {/* Settings Toggle Button */}
            <button
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: 'transparent',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '0.875rem',
                marginBottom: '12px',
              }}
            >
              <span>⚙️</span>
              <span>
                {VOICE_OPTIONS.find(v => v.id === selectedVoice)?.name} • {STYLE_OPTIONS.find(s => s.id === selectedStyle)?.name}
              </span>
              <span style={{ marginLeft: 'auto' }}>{showSettingsPanel ? '▲' : '▼'}</span>
            </button>

            {/* Settings Panel */}
            {showSettingsPanel && (
              <div
                style={{
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  marginBottom: '16px',
                }}
              >
                {/* Voice Selection */}
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    🎤 Voice
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value as VoiceOption)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    {VOICE_OPTIONS.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} - {voice.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Style Selection */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    🎭 Conversation Style
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {STYLE_OPTIONS.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: selectedStyle === style.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                          background: selectedStyle === style.id ? '#eff6ff' : 'white',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>
                          {style.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          {style.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Start Button */}
        {voiceState === 'idle' && (
          <button
            onClick={startSession}
            style={{
              padding: '12px 32px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
            }}
          >
            🎙️ Start Voice Chat
          </button>
        )}
      </div>

      {/* Transcript Display */}
      {showTranscript && transcripts.length > 0 && (
        <div
          style={{
            marginTop: '24px',
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '12px',
            width: '100%',
          }}
        >
          {transcripts.map((entry) => (
            <div
              key={entry.id}
              style={{
                marginBottom: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: entry.role === 'user' ? '#3b82f620' : '#10b98120',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  marginRight: '8px',
                }}
              >
                {entry.role === 'user' ? '👤' : '🎙️'}
              </span>
              <span style={{ fontSize: '0.875rem' }}>{entry.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default VoiceMode;
