import 'dart:convert';
import 'package:dio/dio.dart';

class ChatRepository {
  final Dio _dio;
  
  // Pointing to absolute production URL so App Store testers can use the app without a local dev server running
  final String _baseUrl = 'https://my4blocks.vercel.app/api/chat';

  ChatRepository({Dio? dio}) : _dio = dio ?? Dio();

  Stream<String> sendMessageStream(List<Map<String, String>> messages) async* {
    try {
      final response = await _dio.post<ResponseBody>(
        _baseUrl,
        data: jsonEncode({'messages': messages}),
        options: Options(
          headers: {'Accept': 'text/event-stream'},
          responseType: ResponseType.stream,
        ),
      );

      if (response.data != null) {
        final stream = response.data!.stream;
        await for (final chunk in stream) {
          final stringChunk = utf8.decode(chunk);
          // Parse SSE data blocks
          final lines = stringChunk.split('\n');
          for (final line in lines) {
            if (line.startsWith('0:')) {
              // Next.js AI SDK streams text starting with 0:"text"
              var content = line.substring(2);
              if (content.startsWith('"') && content.endsWith('"')) {
                // VERY basic un-escaping for the stream
                // In production, use a proper SSE & JSON chunk parser
                content = content.substring(1, content.length - 1);
                content = content.replaceAll(r'\n', '\n').replaceAll(r'\"', '"');
                yield content;
              }
            }
          }
        }
      }
    } catch (e) {
      throw Exception('Failed to send message: \$e');
    }
  }
}
