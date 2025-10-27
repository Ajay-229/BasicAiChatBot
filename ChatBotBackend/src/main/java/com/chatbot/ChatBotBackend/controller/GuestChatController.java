package com.chatbot.ChatBotBackend.controller;

import com.chatbot.ChatBotBackend.dto.ChatRequest;
import com.chatbot.ChatBotBackend.dto.ChatResponse;
import com.chatbot.ChatBotBackend.dto.ChatMessageResponse;
import com.chatbot.ChatBotBackend.mapper.Mapper;
import com.chatbot.ChatBotBackend.model.ChatMessage;
import com.chatbot.ChatBotBackend.service.GuestChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat/guest")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class GuestChatController {

    private final GuestChatService guestChatService;

    @PostMapping("/new")
    public ResponseEntity<Map<String, String>> createGuestSession() {
        UUID sessionId = guestChatService.createSession();
        return ResponseEntity.ok(Map.of("sessionId", sessionId.toString()));
    }

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> addGuestMessage(
            @RequestParam UUID sessionId,
            @RequestBody ChatRequest request) {

        return ResponseEntity.ok(guestChatService.handleGuestChat(sessionId, request));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<List<ChatMessageResponse>> getGuestSession(@PathVariable UUID sessionId) {
        List<ChatMessage> messages = guestChatService.getSessionMessages(sessionId);
        return ResponseEntity.ok(messages.stream()
                .map(Mapper::toChatMessageResponse)
                .collect(Collectors.toList()));
    }

    @PutMapping("/message/{sessionId}/{messageId}")
    public ResponseEntity<ChatMessageResponse> editGuestMessage(
            @PathVariable UUID sessionId,
            @PathVariable UUID messageId,
            @RequestBody Map<String, String> requestBody) {

        String newContent = requestBody.get("content");
        ChatMessage edited = guestChatService.editMessage(sessionId, messageId, newContent);
        return ResponseEntity.ok(Mapper.toChatMessageResponse(edited));
    }

    @DeleteMapping("/message/{sessionId}/{messageId}")
    public ResponseEntity<Map<String, String>> deleteGuestMessage(
            @PathVariable UUID sessionId,
            @PathVariable UUID messageId) {

        guestChatService.deleteMessage(sessionId, messageId);
        return ResponseEntity.ok(Map.of("message", "Message deleted successfully"));
    }

    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Map<String, String>> deleteGuestSession(@PathVariable UUID sessionId) {
        guestChatService.deleteSession(sessionId);
        return ResponseEntity.ok(Map.of("message", "Guest session deleted successfully"));
    }
}