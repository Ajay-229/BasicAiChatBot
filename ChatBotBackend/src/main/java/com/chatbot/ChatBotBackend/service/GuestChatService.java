package com.chatbot.ChatBotBackend.service;

import com.chatbot.ChatBotBackend.dto.ChatRequest;
import com.chatbot.ChatBotBackend.dto.ChatResponse;
import com.chatbot.ChatBotBackend.model.ChatMessage;
import com.chatbot.ChatBotBackend.util.HuggingFaceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class GuestChatService {

    private final HuggingFaceClient huggingFaceClient;

    // In-memory guest session storage
    private final Map<UUID, List<ChatMessage>> guestSessionStore = new ConcurrentHashMap<>();

    // ✅ Track running AI generations (for cancellation)
    private final Map<UUID, Future<?>> activeGenerations = new ConcurrentHashMap<>();

    // ✅ Executor for async AI generation
    private final ExecutorService executor = Executors.newCachedThreadPool();

    /** Create a new guest chat session */
    public UUID createSession() {
        UUID sessionId = UUID.randomUUID();
        guestSessionStore.put(sessionId, new CopyOnWriteArrayList<>());
        return sessionId;
    }

    /** Validate that the guest session exists */
    public void validateSessionExists(UUID sessionId) {
        if (!guestSessionStore.containsKey(sessionId)) {
            throw new RuntimeException("Guest session not found");
        }
    }

    /** Handle chat and return AI response */
    public ChatResponse handleGuestChat(UUID sessionId, ChatRequest request) {
        // 1️⃣ Ensure guest session exists
        List<ChatMessage> messages = guestSessionStore.get(sessionId);
        if (messages == null) {
            throw new IllegalArgumentException("Invalid or expired guest session");
        }

        // 2️⃣ Extract user message
        String userContent = (request.getContent() != null && !request.getContent().isBlank())
                ? request.getContent().trim()
                : null;

        if (userContent == null) {
            throw new IllegalArgumentException("User message is required");
        }

        // 3️⃣ Add user message to session
        ChatMessage userMessage = ChatMessage.builder()
                .id(UUID.randomUUID())
                .sender("user")
                .content(userContent)
                .build();
        messages.add(userMessage);

        // 4️⃣ Submit async AI reply generation (so guest chat behaves like logged-in)
        Future<?> future = executor.submit(() -> {
            try {
                String aiReply = huggingFaceClient.getAIResponse(messages);

                ChatMessage aiMessage = ChatMessage.builder()
                        .id(UUID.randomUUID())
                        .sender("assistant")
                        .content(aiReply)
                        .build();
                messages.add(aiMessage);

                log.info("✅ AI reply added for guest session {}", sessionId);
            } catch (CancellationException ce) {
                log.warn("⚠️ AI generation cancelled for guest message {}", userMessage.getId());
            } catch (Exception e) {
                log.error("❌ AI generation failed for guest session {}", sessionId, e);
            } finally {
                activeGenerations.remove(userMessage.getId());
            }
        });

        // Register this message’s AI generation
        activeGenerations.put(userMessage.getId(), future);

        // 5️⃣ Return temporary acknowledgment
        return new ChatResponse("AI response is being generated...");
    }

    /** Get all messages in a session */
    public List<ChatMessage> getSessionMessages(UUID sessionId) {
        validateSessionExists(sessionId);
        return guestSessionStore.get(sessionId);
    }

    /** Edit a message (keeps original, adds new message with threadId) */
    public ChatMessage editMessage(UUID sessionId, UUID messageId, String newContent) {
        validateSessionExists(sessionId);
        List<ChatMessage> messages = guestSessionStore.get(sessionId);

        ChatMessage original = messages.stream()
                .filter(m -> m.getId().equals(messageId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Message not found"));

        ChatMessage edited = ChatMessage.builder()
                .id(UUID.randomUUID())
                .sender(original.getSender())
                .content(newContent)
                .threadId(original.getThreadId() != null ? original.getThreadId() : original.getId())
                .build();

        messages.add(edited);
        return edited;
    }

    /** Delete a specific message from a session */
    public void deleteMessage(UUID sessionId, UUID messageId) {
        validateSessionExists(sessionId);
        List<ChatMessage> messages = guestSessionStore.get(sessionId);
        if (messages == null) throw new RuntimeException("Invalid or expired guest session");

        // 1️⃣ Cancel generation if it’s still running
        Future<?> future = activeGenerations.remove(messageId);
        if (future != null && !future.isDone()) {
            future.cancel(true);
            log.info("🛑 Cancelled ongoing AI generation for guest message {}", messageId);
        }

        // 2️⃣ Find the deleted user message
        int userIndex = -1;
        for (int i = 0; i < messages.size(); i++) {
            if (messages.get(i).getId().equals(messageId)) {
                userIndex = i;
                break;
            }
        }

        if (userIndex == -1) throw new RuntimeException("Message not found");

        // 3️⃣ If the next message is an assistant reply, delete it as well
        if (userIndex + 1 < messages.size()) {
            ChatMessage nextMsg = messages.get(userIndex + 1);
            if ("assistant".equals(nextMsg.getSender())) {
                messages.remove(userIndex + 1);
                log.info("🗑️ Deleted AI reply following user message {}", messageId);
            }
        }

        // 4️⃣ Delete the user message itself
        messages.remove(userIndex);
        log.info("🗑️ Deleted guest message {}", messageId);
    }

    /** Delete entire session */
    public void deleteSession(UUID sessionId) {
        validateSessionExists(sessionId);
        guestSessionStore.remove(sessionId);
    }
}