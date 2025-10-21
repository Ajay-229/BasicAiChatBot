package com.chatbot.ChatBotBackend.dto;

import java.util.List;
import java.util.Map;

public class ChatRequest {
    private List<Map<String, String>> messages; // [{role: "user", content: "..."}]

    public List<Map<String, String>> getMessages() {
        return messages;
    }

    public void setMessages(List<Map<String, String>> messages) {
        this.messages = messages;
    }
}