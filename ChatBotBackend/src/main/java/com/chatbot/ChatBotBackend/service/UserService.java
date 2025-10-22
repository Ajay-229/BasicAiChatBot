package com.chatbot.ChatBotBackend.service;

import com.chatbot.ChatBotBackend.dto.*;
import com.chatbot.ChatBotBackend.model.User;
import com.chatbot.ChatBotBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ===========================
    // ✅ Signup Logic
    // ===========================
    public UserResponse registerUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        User user = User.builder()
                .username(request.getUsername())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User saved = userRepository.save(user);
        return new UserResponse(saved.getId(), saved.getUsername(), saved.getFirstName(), saved.getLastName(), saved.getEmail());
    }

    // ===========================
    // ✅ Login via email OR username
    // ===========================
    public UserResponse loginUser(LoginRequest request) {
        String identifier = (request.getEmail() != null && !request.getEmail().isEmpty())
                ? request.getEmail()
                : request.getUsername();

        if (identifier == null || identifier.isEmpty() || request.getPassword() == null) {
            throw new RuntimeException("Username/Email and password are required");
        }

        Optional<User> userOpt;

        // detect if identifier looks like an email
        if (identifier.contains("@")) {
            userOpt = userRepository.findByEmail(identifier);
        } else {
            userOpt = userRepository.findByUsername(identifier);
        }

        User user = userOpt.orElseThrow(() -> new RuntimeException("Invalid username/email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail()
        );
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

}