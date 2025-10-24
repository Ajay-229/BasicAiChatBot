package com.chatbot.ChatBotBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private UUID id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String token; // JWT
}