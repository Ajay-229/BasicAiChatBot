package com.chatbot.ChatBotBackend.mapper;

import com.chatbot.ChatBotBackend.dto.ChatMessageResponse;
import com.chatbot.ChatBotBackend.dto.ChatSessionResponse;
import com.chatbot.ChatBotBackend.dto.UserResponse;
import com.chatbot.ChatBotBackend.model.ChatMessage;
import com.chatbot.ChatBotBackend.model.ChatSession;
import com.chatbot.ChatBotBackend.model.User;

import java.util.stream.Collectors;

public class Mapper {

    public static UserResponse toUserResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build();
    }

    public static ChatMessageResponse toChatMessageResponse(ChatMessage message) {
        if (message == null) return null;
        return ChatMessageResponse.builder()
                .id(message.getId())
                .sender(message.getSender())
                .content(message.getContent())
                .threadId(message.getThreadId())
                .timestamp(message.getCreatedAt()) // <- map createdAt to DTO timestamp
                .replyToId(message.getReplyTo() != null ? message.getReplyTo().getId() : null)
                .build();
    }

    public static ChatSessionResponse toChatSessionResponse(ChatSession session) {
        if (session == null) return null;
        return ChatSessionResponse.builder()
                .id(session.getId())
                .title(session.getTitle())
                .messages(session.getMessages().stream()
                        .map(Mapper::toChatMessageResponse) // THIS MUST BE STATIC
                        .collect(Collectors.toList()))
                .build();
    }
}