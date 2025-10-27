package com.chatbot.ChatBotBackend.repository;

import com.chatbot.ChatBotBackend.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
   Optional<ChatMessage> findByReplyToId(UUID replyToId);
   List<ChatMessage> findAllByChatSessionId(UUID chatSessionId);
    Optional<ChatMessage> findFirstByChatSessionIdAndSenderAndCreatedAtAfterOrderByCreatedAtAsc(
            UUID chatSessionId,
            String sender,
            LocalDateTime createdAt
    );
}
