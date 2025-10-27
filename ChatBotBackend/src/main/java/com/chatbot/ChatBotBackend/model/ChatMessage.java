package com.chatbot.ChatBotBackend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_session_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ChatSession chatSession;

    private String sender; // "user" or "assistant"
    private String content;

    private UUID threadId; // for edited message chains

    // 👇 Links AI message to the user message it responds to
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_to_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ChatMessage replyTo;

    // 👇 Automatically set creation time
    @CreationTimestamp
    private LocalDateTime createdAt;
}