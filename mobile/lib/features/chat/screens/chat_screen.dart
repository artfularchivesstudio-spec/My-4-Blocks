import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../bloc/chat_bloc.dart';
import '../widgets/magic_streaming_bubble.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  void _submit() {
    final text = _textController.text.trim();
    if (text.isEmpty) return;
    
    context.read<ChatBloc>().add(SendMessageEvent(text));
    _textController.clear();
    
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(Icons.psychology_outlined, color: Theme.of(context).colorScheme.primary),
            const SizedBox(width: 8),
            const Text('My 4 Blocks'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: BlocBuilder<ChatBloc, ChatState>(
                builder: (context, state) {
                  if (state.messages.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.spa_outlined, size: 64, color: Theme.of(context).colorScheme.primary.withAlpha(100))
                            .animate(onPlay: (controller) => controller.repeat(reverse: true))
                            .scale(duration: 2.seconds, begin: const Offset(1, 1), end: const Offset(1.1, 1.1)),
                          const SizedBox(height: 16),
                          Text(
                            'How are you feeling today?',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: Theme.of(context).colorScheme.onSurface.withAlpha(150)
                            ),
                          ).animate().fadeIn(delay: 400.ms),
                        ],
                      ),
                    );
                  }

                  return ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: state.messages.length,
                    itemBuilder: (context, index) {
                      final msg = state.messages[index];
                      final isUser = msg.role == 'user';
                      
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 24),
                        child: Row(
                          mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (!isUser)
                              Padding(
                                padding: const EdgeInsets.only(right: 12, top: 4),
                                child: CircleAvatar(
                                  radius: 14,
                                  backgroundColor: Theme.of(context).colorScheme.primary.withAlpha(30),
                                  child: Icon(Icons.psychology, size: 16, color: Theme.of(context).colorScheme.primary),
                                ).animate().scale(duration: 200.ms, curve: Curves.easeOutBack),
                              ),
                            
                            Flexible(
                              child: isUser
                                ? Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                    decoration: BoxDecoration(
                                      color: Theme.of(context).colorScheme.secondary,
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Text(msg.content, style: Theme.of(context).textTheme.bodyLarge),
                                  ).animate().slideX(begin: 0.1, duration: 300.ms, curve: Curves.easeOut).fadeIn()
                                : MagicStreamingBubble(
                                    text: msg.content,
                                    isStreaming: msg.isStreaming,
                                  ).animate().fadeIn(duration: 300.ms),
                            ),
                          ],
                        ),
                      );
                    },
                  );
                },
              ),
            ),
            
            // Input Area
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).scaffoldBackgroundColor,
                border: Border(top: BorderSide(color: Theme.of(context).colorScheme.outlineVariant.withAlpha(50))),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _textController,
                      decoration: const InputDecoration(
                        hintText: 'Type your thoughts...',
                        border: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        filled: false,
                      ),
                      onSubmitted: (_) => _submit(),
                    ),
                  ),
                  BlocBuilder<ChatBloc, ChatState>(
                    builder: (context, state) {
                      return IconButton(
                        icon: const Icon(Icons.arrow_upward_rounded),
                        color: Theme.of(context).colorScheme.primary,
                        style: IconButton.styleFrom(
                          backgroundColor: Theme.of(context).colorScheme.primary.withAlpha(20),
                        ),
                        onPressed: state.isLoading ? null : _submit,
                      ).animate().scale(duration: 200.ms);
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
