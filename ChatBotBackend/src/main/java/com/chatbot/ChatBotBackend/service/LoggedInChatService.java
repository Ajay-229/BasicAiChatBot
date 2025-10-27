package com.chatbot.ChatBotBackend.service;

import com.chatbot.ChatBotBackend.config.JwtUtil;
import com.chatbot.ChatBotBackend.dto.*;
import com.chatbot.ChatBotBackend.mapper.Mapper;
import com.chatbot.ChatBotBackend.model.ChatMessage;
import com.chatbot.ChatBotBackend.model.ChatSession;
import com.chatbot.ChatBotBackend.model.User;
import com.chatbot.ChatBotBackend.repository.ChatMessageRepository;
import com.chatbot.ChatBotBackend.repository.ChatSessionRepository;
import com.chatbot.ChatBotBackend.repository.UserRepository;
import com.chatbot.ChatBotBackend.util.HuggingFaceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoggedInChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final HuggingFaceClient huggingFaceClient;
    private final JwtUtil jwtUtil;

    // For async AI handling and cancellation
    private final Map<UUID, Future<?>> activeGenerations = new ConcurrentHashMap<>();
    private final ExecutorService executor = Executors.newCachedThreadPool();

    // ============================
    // ===== SESSION LOGIC =======
    // ============================
    public UUID createSession(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ChatSession session = ChatSession.builder()
                .user(user)
                .title("New Chat")
                .build();
        chatSessionRepository.save(session);
        log.info("Created session: {}", session.getId());
        return session.getId();
    }

    public List<ChatSessionResponse> getAllSessions(UUID userId) {
        List<ChatSession> sessions = chatSessionRepository.findByUserId(userId);
        return sessions.stream()
                .map(Mapper::toChatSessionResponse)
                .collect(Collectors.toList());
    }

    public List<ChatMessageResponse> getSessionMessages(UUID sessionId) {
        ChatSession session = validateSessionExists(sessionId);
        return session.getMessages().stream()
                .map(Mapper::toChatMessageResponse)
                .collect(Collectors.toList());
    }

    // ============================
    // ===== HANDLE CHAT ==========
    // ============================
    @Transactional
    public ChatResponse handleChat(UUID sessionId, ChatRequest request) {
        // 1️⃣ Validate and fetch session
        ChatSession session = validateSessionExists(sessionId);

        // 2️⃣ Validate message content
        String userContent = (request.getContent() != null && !request.getContent().isBlank())
                ? request.getContent().trim()
                : null;
        if (userContent == null) {
            throw new IllegalArgumentException("User message is required");
        }

        // 3️⃣ Save user message
        ChatMessage userMessage = ChatMessage.builder()
                .chatSession(session)
                .sender("user")
                .content(userContent)
                .build();
        chatMessageRepository.save(userMessage);

        // 4️⃣ Fetch chat history (detached copy for async use)
        List<ChatMessage> messageSnapshot =
                new ArrayList<>(chatMessageRepository.findAllByChatSessionId(sessionId));

        // 5️⃣ Start async AI generation (for cancellation support)
        Future<?> future = executor.submit(() -> {
            try {
                String aiReply = huggingFaceClient.getAIResponse(messageSnapshot);

                // Save AI message in separate transaction
                saveAiMessage(session, aiReply);
                log.info("✅ AI reply saved for session {}", sessionId);

            } catch (CancellationException ce) {
                log.warn("⚠️ AI generation cancelled for message {}", userMessage.getId());
            } catch (Exception e) {
                log.error("❌ AI generation failed for message {}", userMessage.getId(), e);
            } finally {
                activeGenerations.remove(userMessage.getId());
            }
        });

        // 6️⃣ Register for cancel support
        activeGenerations.put(userMessage.getId(), future);

        // 7️⃣ Return temporary acknowledgment
        return new ChatResponse("AI response is being generated...");
    }

    // Helper method for async AI save
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveAiMessage(ChatSession session, String aiReply) {
        ChatMessage aiMessage = ChatMessage.builder()
                .chatSession(session)
                .sender("assistant")
                .content(aiReply)
                .build();
        chatMessageRepository.save(aiMessage);
    }

    // ============================
    // ===== DELETE MESSAGE =======
    // ============================
    @Transactional
    public void deleteMessage(UUID messageId) {
        ChatMessage userMsg = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // 1️⃣ Cancel if AI still running
        Future<?> future = activeGenerations.remove(messageId);
        if (future != null && !future.isDone()) {
            future.cancel(true);
            log.info("🛑 Cancelled AI generation for message {}", messageId);
        }

        // 2️⃣ Delete linked AI reply (if exists)
        chatMessageRepository
                .findFirstByChatSessionIdAndSenderAndCreatedAtAfterOrderByCreatedAtAsc(
                        userMsg.getChatSession().getId(), "assistant", userMsg.getCreatedAt())
                .ifPresent(aiMsg -> {
                    chatMessageRepository.delete(aiMsg);
                    log.info("🗑️ Deleted linked AI reply {}", aiMsg.getId());
                });

        // 3️⃣ Delete user message
        chatMessageRepository.delete(userMsg);
        log.info("🗑️ Deleted user message {}", messageId);
    }

    // ============================
    // ===== DELETE SESSION ======
    // ============================
    public void deleteSession(UUID sessionId) {
        validateSessionExists(sessionId);
        chatSessionRepository.deleteById(sessionId);
    }

    // ============================
    // ===== EDIT MESSAGE =========
    // ============================
    public ChatMessageResponse editMessage(UUID messageId, String newContent) {
        ChatMessage original = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        ChatMessage edited = ChatMessage.builder()
                .chatSession(original.getChatSession())
                .sender(original.getSender())
                .content(newContent)
                .threadId(original.getThreadId() != null
                        ? original.getThreadId()
                        : original.getId())
                .build();

        chatMessageRepository.save(edited);
        return Mapper.toChatMessageResponse(edited);
    }

    // ============================
    // ===== JWT UTIL =============
    // ============================
    public UUID getUserIdFromJwt(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        }
        String jwt = authHeader.substring(7);
        return jwtUtil.extractUserIdFromJwt(jwt, userRepository);
    }

    // ============================
    // ===== VALIDATE SESSION =====
    // ============================
    private ChatSession validateSessionExists(UUID sessionId) {
        return chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }
}