package com.chatbot.ChatBotBackend.controller;

import com.chatbot.ChatBotBackend.dto.ChatRequest;
import com.chatbot.ChatBotBackend.dto.ChatResponse;
import com.chatbot.ChatBotBackend.dto.ChatSessionResponse;
import com.chatbot.ChatBotBackend.dto.ChatMessageResponse;
import com.chatbot.ChatBotBackend.service.LoggedInChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LoggedInChatController {

    private final LoggedInChatService chatService;

    @PostMapping("/session")
    public ResponseEntity<Map<String, String>> createSession(@RequestHeader("Authorization") String authHeader) {
        UUID userId = chatService.getUserIdFromJwt(authHeader);
        UUID sessionId = chatService.createSession(userId);
        return ResponseEntity.ok(Map.of("sessionId", sessionId.toString()));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSessionResponse>> getAllSessions(@RequestHeader("Authorization") String authHeader) {
        UUID userId = chatService.getUserIdFromJwt(authHeader);
        return ResponseEntity.ok(chatService.getAllSessions(userId));
    }

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> addMessage(@RequestHeader("Authorization") String authHeader,
                                                   @RequestParam UUID sessionId,
                                                   @RequestBody ChatRequest request) {
        chatService.getUserIdFromJwt(authHeader); // validate token
        return ResponseEntity.ok(chatService.handleChat(sessionId, request));
    }

    @PutMapping("/message/{messageId}")
    public ResponseEntity<ChatMessageResponse> editMessage(@RequestHeader("Authorization") String authHeader,
                                                           @PathVariable UUID messageId,
                                                           @RequestBody Map<String, String> payload) {
        chatService.getUserIdFromJwt(authHeader); // validate token
        return ResponseEntity.ok(chatService.editMessage(messageId, payload.get("content")));
    }

    @DeleteMapping("/message/{messageId}")
    public ResponseEntity<Map<String, String>> deleteMessage(@RequestHeader("Authorization") String authHeader,
                                                             @PathVariable UUID messageId) {
        chatService.getUserIdFromJwt(authHeader); // validate token
        chatService.deleteMessage(messageId);
        return ResponseEntity.ok(Map.of("message", "Message deleted successfully"));
    }

    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Map<String, String>> deleteSession(@RequestHeader("Authorization") String authHeader,
                                                             @PathVariable UUID sessionId) {
        chatService.getUserIdFromJwt(authHeader); // validate token
        chatService.deleteSession(sessionId);
        return ResponseEntity.ok(Map.of("message", "Session deleted successfully"));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<List<ChatMessageResponse>> getSession(@RequestHeader("Authorization") String authHeader,
                                                                @PathVariable UUID sessionId) {
        chatService.getUserIdFromJwt(authHeader); // validate token
        return ResponseEntity.ok(chatService.getSessionMessages(sessionId));
    }
}