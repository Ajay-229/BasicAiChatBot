package com.chatbot.ChatBotBackend.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;     // optional - can be null
    private String username;  // optional - can be null
    private String password;
}