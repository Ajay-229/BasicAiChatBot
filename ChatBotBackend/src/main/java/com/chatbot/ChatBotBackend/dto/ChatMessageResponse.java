package com.chatbot.ChatBotBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponse {
    private UUID id;
    private String sender;
    private String content;
    private UUID threadId;      // for edits
    private LocalDateTime timestamp;
    private UUID replyToId;     // optional, for replies
}