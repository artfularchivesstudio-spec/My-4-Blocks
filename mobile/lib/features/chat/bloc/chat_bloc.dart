import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'dart:async';
import 'package:uuid/uuid.dart';

import '../models/message.dart';
import '../repository/chat_repository.dart';

// --- EVENTS ---
abstract class ChatEvent extends Equatable {
  const ChatEvent();
  @override
  List<Object> get props => [];
}

class SendMessageEvent extends ChatEvent {
  final String text;
  const SendMessageEvent(this.text);
  @override
  List<Object> get props => [text];
}

class _StreamStartedEvent extends ChatEvent {
  final String messageId;
  const _StreamStartedEvent(this.messageId);
}

class _StreamChunkReceivedEvent extends ChatEvent {
  final String messageId;
  final String chunk;
  const _StreamChunkReceivedEvent(this.messageId, this.chunk);
}

class _StreamEndedEvent extends ChatEvent {
  final String messageId;
  const _StreamEndedEvent(this.messageId);
}

class _StreamErrorEvent extends ChatEvent {
  final String messageId;
  final String error;
  const _StreamErrorEvent(this.messageId, this.error);
}


// --- STATE ---
class ChatState extends Equatable {
  final List<Message> messages;
  final bool isLoading;
  
  const ChatState({
    this.messages = const [],
    this.isLoading = false,
  });

  ChatState copyWith({
    List<Message>? messages,
    bool? isLoading,
  }) {
    return ChatState(
      messages: messages ?? this.messages,
      isLoading: isLoading ?? this.isLoading,
    );
  }

  @override
  List<Object> get props => [messages, isLoading];
}


// --- BLOC ---
class ChatBloc extends Bloc<ChatEvent, ChatState> {
  final ChatRepository _repository;
  final _uuid = const Uuid();

  ChatBloc(this._repository) : super(const ChatState()) {
    on<SendMessageEvent>(_onSendMessage);
    on<_StreamStartedEvent>(_onStreamStarted);
    on<_StreamChunkReceivedEvent>(_onStreamChunkReceived);
    on<_StreamEndedEvent>(_onStreamEnded);
    on<_StreamErrorEvent>(_onStreamError);
  }

  Future<void> _onSendMessage(SendMessageEvent event, Emitter<ChatState> emit) async {
    final userMessage = Message(
      id: _uuid.v4(),
      role: 'user',
      content: event.text,
    );
    
    // Create optimistic assistant message placeholder
    final assistantMessageId = _uuid.v4();
    final assistantMessage = Message(
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    );

    final updatedMessages = List<Message>.from(state.messages)..addAll([userMessage, assistantMessage]);
    emit(state.copyWith(messages: updatedMessages, isLoading: true));

    // Convert messages for API
    final apiMessages = updatedMessages
        .where((m) => m.id != assistantMessageId) // don't send the placeholder
        .map((m) => {'role': m.role, 'content': m.content})
        .toList();

    try {
      final stream = _repository.sendMessageStream(apiMessages);
      add(_StreamStartedEvent(assistantMessageId));
      
      await for (final chunk in stream) {
        add(_StreamChunkReceivedEvent(assistantMessageId, chunk));
      }
      add(_StreamEndedEvent(assistantMessageId));
    } catch (e) {
      add(_StreamErrorEvent(assistantMessageId, e.toString()));
    }
  }

  void _onStreamStarted(_StreamStartedEvent event, Emitter<ChatState> emit) {
    // Already handled optimism in _onSendMessage, but good hook for future
  }

  void _onStreamChunkReceived(_StreamChunkReceivedEvent event, Emitter<ChatState> emit) {
    final newMessages = state.messages.map((m) {
      if (m.id == event.messageId) {
        return m.copyWith(content: m.content + event.chunk);
      }
      return m;
    }).toList();
    emit(state.copyWith(messages: newMessages));
  }

  void _onStreamEnded(_StreamEndedEvent event, Emitter<ChatState> emit) {
    final newMessages = state.messages.map((m) {
      if (m.id == event.messageId) {
        return m.copyWith(isStreaming: false);
      }
      return m;
    }).toList();
    emit(state.copyWith(messages: newMessages, isLoading: false));
  }

  void _onStreamError(_StreamErrorEvent event, Emitter<ChatState> emit) {
    final newMessages = state.messages.map((m) {
      if (m.id == event.messageId) {
        return m.copyWith(
          isStreaming: false, 
          content: m.content.isEmpty ? "Sorry, I encountered an error answering your request." : m.content
        );
      }
      return m;
    }).toList();
    emit(state.copyWith(messages: newMessages, isLoading: false));
  }
}
