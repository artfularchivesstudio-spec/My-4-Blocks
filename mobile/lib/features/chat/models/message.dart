import 'package:equatable/equatable.dart';

class Message extends Equatable {
  final String id;
  final String role; // 'user' or 'assistant'
  final String content;
  final bool isStreaming;

  const Message({
    required this.id,
    required this.role,
    required this.content,
    this.isStreaming = false,
  });

  Message copyWith({
    String? id,
    String? role,
    String? content,
    bool? isStreaming,
  }) {
    return Message(
      id: id ?? this.id,
      role: role ?? this.role,
      content: content ?? this.content,
      isStreaming: isStreaming ?? this.isStreaming,
    );
  }

  @override
  List<Object?> get props => [id, role, content, isStreaming];
}
