package com.chatbot.ChatBotBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    // For multi-message format: [{ "role": "user", "content": "..." }]
    private List<Map<String, String>> messages;

    // For simple format: { "sender": "user", "content": "Hello AI" }
    private String sender;
    private String content;
}