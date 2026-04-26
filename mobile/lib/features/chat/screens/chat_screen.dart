import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lottie/lottie.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

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

  // 🌟 The Chronicles of Wisdom - Exporting our digital journey to Markdown
  void _exportChat() {
    final state = context.read<ChatBloc>().state;
    if (state.messages.isEmpty) return;

    final buffer = StringBuffer();
    buffer.writeln('# 🎭 My 4 Blocks - Chat History ✨');
    buffer.writeln('\n*Generated on ${DateTime.now().toLocal()}*\n');
    buffer.writeln('---');

    for (final msg in state.messages) {
      final role = msg.role == 'user' ? 'Seeker' : 'Guide';
      buffer.writeln('\n### 🧱 $role:');
      buffer.writeln(msg.content);
      buffer.writeln('\n---');
    }

    Share.share(buffer.toString(), subject: 'My 4 Blocks Chat History');
  }

  // 🌐 The Portal to Mastery - Accessing the Admin Sanctuary
  Future<void> _openAdmin() async {
    final url = Uri.parse('https://my4blocks.vercel.app/admin');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

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
        title: GestureDetector(
          onTripleTap: _openAdmin,
          child: Row(
            children: [
              Icon(LucideIcons.sparkles, color: Theme.of(context).colorScheme.primary),
              const SizedBox(width: 8),
              const Text('My 4 Blocks'),
            ],
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.download),
            tooltip: 'Export Chat',
            onPressed: _exportChat,
          ),
          IconButton(
            icon: const Icon(LucideIcons.settings),
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
                          Lottie.network(
                            'https://lottie.host/36262441-3d01-4475-816d-31991d09e52c/2L7o9xY6eX.json',
                            width: 200,
                            height: 200,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'How are you feeling today?',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: Theme.of(context).colorScheme.onSurface.withAlpha(150)
                            ),
                          ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.2, end: 0),
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
                                  child: Icon(LucideIcons.brainCircuit, size: 16, color: Theme.of(context).colorScheme.primary),
                                ).animate().scale(duration: 400.ms, curve: Curves.easeOutBack),
                              ),
                            
                            Flexible(
                              child: isUser
                                ? Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                    decoration: BoxDecoration(
                                      color: Theme.of(context).colorScheme.secondaryContainer,
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Text(msg.content, style: Theme.of(context).textTheme.bodyLarge),
                                  ).animate()
                                   .fadeIn(duration: 400.ms)
                                   .slideY(begin: 0.2, end: 0, duration: 400.ms, curve: Curves.easeOutBack)
                                   .slideX(begin: 0.1, end: 0)
                                : msg.content.isEmpty && msg.isStreaming
                                    ? Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                        decoration: BoxDecoration(
                                          color: Theme.of(context).colorScheme.surfaceVariant.withAlpha(100),
                                          borderRadius: BorderRadius.circular(16),
                                        ),
                                        child: Lottie.network(
                                          'https://lottie.host/5cc4b104-5f50-4828-98e9-74d306b38c20/Z9gM5U77xS.json',
                                          width: 60,
                                          height: 30,
                                        ),
                                      ).animate().fadeIn().scale(begin: const Offset(0.8, 0.8))
                                    : MagicStreamingBubble(
                                        text: msg.content,
                                        isStreaming: msg.isStreaming,
                                      ).animate()
                                       .fadeIn(duration: 400.ms)
                                       .slideY(begin: 0.2, end: 0, duration: 400.ms, curve: Curves.easeOutBack),
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
                      decoration: InputDecoration(
                        hintText: 'Type your thoughts...',
                        hintStyle: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant.withAlpha(150)),
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
                        icon: const Icon(LucideIcons.send),
                        color: Theme.of(context).colorScheme.primary,
                        style: IconButton.styleFrom(
                          backgroundColor: Theme.of(context).colorScheme.primary.withAlpha(20),
                        ),
                        onPressed: state.isLoading ? null : _submit,
                      ).animate(target: state.isLoading ? 0 : 1).scale(duration: 200.ms).fadeIn();
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(duration: 800.ms).scale(begin: const Offset(0.98, 0.98), curve: Curves.easeOut);
  }
}
