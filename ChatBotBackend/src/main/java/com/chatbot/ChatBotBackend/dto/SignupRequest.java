package com.chatbot.ChatBotBackend.dto;

import lombok.Builder;
import lombok.Data;
@Builder
@Data
public class SignupRequest {
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
}