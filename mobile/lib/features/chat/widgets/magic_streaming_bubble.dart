import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

class MagicStreamingBubble extends StatelessWidget {
  final String text;
  final bool isStreaming;

  const MagicStreamingBubble({
    super.key,
    required this.text,
    required this.isStreaming,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final primary = theme.colorScheme.primary;
    
    Widget bubble = Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: isStreaming ? primary.withAlpha(15) : theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isStreaming ? primary.withAlpha(50) : theme.colorScheme.outlineVariant.withAlpha(50),
          width: 1,
        ),
        boxShadow: isStreaming ? [
          BoxShadow(
            color: primary.withAlpha(20),
            blurRadius: 10,
            spreadRadius: 2,
          ),
        ] : [],
      ),
      child: MarkdownBody(
        data: isStreaming ? '\$text ▍' : text,
        styleSheet: MarkdownStyleSheet(
          p: theme.textTheme.bodyLarge?.copyWith(height: 1.5, color: theme.colorScheme.onSurface),
        ),
      ),
    );

    if (isStreaming) {
      // Replicate the magic-glow + shimmering + gentle-nudge animations
      bubble = bubble.animate(onPlay: (controller) => controller.repeat())
        .shimmer(duration: 1600.ms, color: primary.withAlpha(30))
        .boxShadow(
          begin: BoxShadow(color: primary.withAlpha(10), blurRadius: 10, spreadRadius: 0),
          end: BoxShadow(color: primary.withAlpha(50), blurRadius: 25, spreadRadius: 4),
          duration: 1300.ms,
          curve: Curves.easeInOut,
        ).then(delay: 0.ms).boxShadow(
          begin: BoxShadow(color: primary.withAlpha(50), blurRadius: 25, spreadRadius: 4),
          end: BoxShadow(color: primary.withAlpha(10), blurRadius: 10, spreadRadius: 0),
          duration: 1300.ms,
          curve: Curves.easeInOut,
        );
    } else {
      // Sparkling entrance for finished messages
      bubble = bubble.animate()
        .fadeIn(duration: 400.ms)
        .scale(begin: const Offset(0.9, 0.9), duration: 400.ms, curve: Curves.easeOutBack)
        .blurXY(begin: 10, end: 0, duration: 600.ms);
    }

    return bubble;
  }
}
