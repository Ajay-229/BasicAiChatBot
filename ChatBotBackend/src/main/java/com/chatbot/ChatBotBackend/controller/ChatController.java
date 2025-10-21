package com.chatbot.ChatBotBackend.controller;

import com.chatbot.ChatBotBackend.dto.ChatRequest;
import com.chatbot.ChatBotBackend.dto.ChatResponse;
import com.chatbot.ChatBotBackend.model.ChatMessage;
import com.chatbot.ChatBotBackend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/new")
    public Map<String, String> createSession() {
        String sessionId = chatService.createSession();
        return Map.of("sessionId", sessionId);
    }

    @PostMapping("/{sessionId}")
    public ChatResponse chat(@PathVariable String sessionId, @RequestBody ChatRequest request) {
        return chatService.handleChat(sessionId, request);
    }

    @GetMapping("/{sessionId}")
    public List<ChatMessage> getSession(@PathVariable String sessionId) {
        return chatService.getSession(sessionId);
    }

    @DeleteMapping("/{sessionId}")
    public Map<String, String> deleteSession(@PathVariable String sessionId) {
        chatService.deleteSession(sessionId);
        return Map.of("message", "Session deleted successfully");
    }
}