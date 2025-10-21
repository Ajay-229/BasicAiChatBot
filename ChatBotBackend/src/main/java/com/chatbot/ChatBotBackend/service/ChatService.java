package com.chatbot.ChatBotBackend.service;

import com.chatbot.ChatBotBackend.dto.ChatRequest;
import com.chatbot.ChatBotBackend.dto.ChatResponse;
import com.chatbot.ChatBotBackend.model.ChatMessage;
import com.chatbot.ChatBotBackend.util.HuggingFaceClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class ChatService {

    private final Map<String, List<ChatMessage>> sessionStore = new HashMap<>();
    private final HuggingFaceClient huggingFaceClient;

    public ChatService(HuggingFaceClient huggingFaceClient) {
        this.huggingFaceClient = huggingFaceClient;
    }

    // 🆕 Create new session
    public String createSession() {
        String sessionId = UUID.randomUUID().toString();
        sessionStore.put(sessionId, new ArrayList<>());
        log.info("🆕 Created session: {}", sessionId);
        return sessionId;
    }

    // 💬 Process chat message
    public ChatResponse handleChat(String sessionId, ChatRequest request) {
        List<ChatMessage> sessionMessages = sessionStore.computeIfAbsent(sessionId, k -> new ArrayList<>());

        // Add user messages
        request.getMessages().forEach(msg ->
                sessionMessages.add(new ChatMessage(msg.get("role"), msg.get("content")))
        );

        String aiReply = huggingFaceClient.getAIResponse(sessionMessages);

        // Store assistant reply
        sessionMessages.add(new ChatMessage("assistant", aiReply));

        return new ChatResponse(aiReply);
    }

    // 📜 Get session history
    public List<ChatMessage> getSession(String sessionId) {
        return sessionStore.getOrDefault(sessionId, new ArrayList<>());
    }

    // 🗑️ Delete session
    public void deleteSession(String sessionId) {
        sessionStore.remove(sessionId);
        log.info("🗑️ Deleted session: {}", sessionId);
    }
}
