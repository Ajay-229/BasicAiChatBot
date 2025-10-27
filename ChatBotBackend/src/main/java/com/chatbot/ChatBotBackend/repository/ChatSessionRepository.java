package com.chatbot.ChatBotBackend.repository;

import com.chatbot.ChatBotBackend.model.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatSessionRepository extends JpaRepository<ChatSession, UUID> {
    List<ChatSession> findByUserId(UUID userId);
}