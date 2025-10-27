package com.chatbot.ChatBotBackend.service;

import com.chatbot.ChatBotBackend.config.JwtUtil;
import com.chatbot.ChatBotBackend.dto.*;
import com.chatbot.ChatBotBackend.mapper.Mapper;
import com.chatbot.ChatBotBackend.model.User;
import com.chatbot.ChatBotBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistService tokenBlacklistService;

    // ----------------------
    // Track active sessions per user (userId -> Set of tokens)
    // ----------------------
    private final Map<UUID, Set<String>> activeTokens = new ConcurrentHashMap<>();

    // ----------------------
    // Register a new user
    // ----------------------
    public AuthResponse registerUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already registered");
        if (userRepository.existsByUsername(request.getUsername()))
            throw new RuntimeException("Username already taken");

        User user = User.builder()
                .username(request.getUsername())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getUsername());

        // track token as active
        activeTokens.computeIfAbsent(saved.getId(), k -> ConcurrentHashMap.newKeySet()).add(token);

        return new AuthResponse(saved.getId(), saved.getUsername(), saved.getFirstName(),
                saved.getLastName(), saved.getEmail(), token);
    }

    // ----------------------
    // Login existing user
    // ----------------------
    public AuthResponse loginUser(LoginRequest request) {
        String identifier = Optional.ofNullable(request.getEmail())
                .filter(s -> !s.isEmpty())
                .orElse(request.getUsername());

        if (identifier == null || identifier.isEmpty() || request.getPassword() == null)
            throw new RuntimeException("Username/Email and password are required");

        User user = (identifier.contains("@") ? userRepository.findByEmail(identifier)
                : userRepository.findByUsername(identifier))
                .orElseThrow(() -> new RuntimeException("Invalid username/email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid credentials");

        String token = jwtUtil.generateToken(user.getUsername());

        // add token to active sessions
        activeTokens.computeIfAbsent(user.getId(), k -> ConcurrentHashMap.newKeySet()).add(token);

        return new AuthResponse(user.getId(), user.getUsername(), user.getFirstName(),
                user.getLastName(), user.getEmail(), token);
    }

    // ----------------------
    // Logout user
    // ----------------------
    public void logoutUser(String jwt) {
        UUID userId = extractUserIdFromJwt(jwt);

        // blacklist token
        tokenBlacklistService.blacklistToken(jwt);

        // remove from active tokens
        Set<String> tokens = activeTokens.get(userId);
        if (tokens != null) {
            tokens.remove(jwt);
            if (tokens.isEmpty()) activeTokens.remove(userId);
        }
    }

    // ----------------------
    // Delete a user by ID (requires valid token)
    // ----------------------
    public void deleteUser(String jwt) {
        UUID userId = extractUserIdFromJwt(jwt);
        if (!isTokenActive(userId, jwt)) {
            throw new RuntimeException("Invalid or expired token");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // remove all active tokens
        Set<String> tokens = activeTokens.remove(userId);
        if (tokens != null) {
            tokens.forEach(tokenBlacklistService::blacklistToken);
        }

        userRepository.delete(user);
    }

    // ----------------------
    // Check if token is active for a user
    // ----------------------
    public boolean isTokenActive(UUID userId, String jwt) {
        Set<String> tokens = activeTokens.get(userId);
        return tokens != null && tokens.contains(jwt) && !tokenBlacklistService.isBlacklisted(jwt);
    }

    // ----------------------
    // Extract userId from JWT
    // ----------------------
    public UUID extractUserIdFromJwt(String jwt) {
        return jwtUtil.extractUserIdFromJwt(jwt, userRepository);
    }

    // ----------------------
    // Check uniqueness
    // ----------------------
    public Map<String, Object> checkUnique(String field, String value) {
        boolean exists = "username".equals(field) ? existsByUsername(value) :
                "email".equals(field) ? existsByEmail(value) : false;
        String message = exists ? (field.equals("username") ? "Username already taken" : "Email already registered") : "Available";
        if (!"username".equals(field) && !"email".equals(field)) message = "Invalid field type";
        return Map.of("exists", exists, "message", message);
    }

    public boolean existsByEmail(String email) { return userRepository.existsByEmail(email); }
    public boolean existsByUsername(String username) { return userRepository.existsByUsername(username); }

    // ----------------------
    // Get user info
    // ----------------------
    public UserResponse getUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return Mapper.toUserResponse(user);
    }
}