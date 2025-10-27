package com.chatbot.ChatBotBackend.controller;

import com.chatbot.ChatBotBackend.dto.*;
import com.chatbot.ChatBotBackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    // ----------------------
    // Signup
    // ----------------------
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            AuthResponse response = userService.registerUser(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ----------------------
    // Login
    // ----------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.loginUser(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ----------------------
    // Check username/email uniqueness
    // Example: /api/auth/check-unique?field=username&value=ajay
    // ----------------------
    @GetMapping("/check-unique")
    public ResponseEntity<Map<String, Object>> checkUnique(
            @RequestParam String field,
            @RequestParam String value) {
        return ResponseEntity.ok(userService.checkUnique(field, value));
    }

    // ----------------------
    // Logout
    // ----------------------
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer "
            userService.logoutUser(token); // ✅ just pass the JWT
            return ResponseEntity.ok(Map.of("message", "User logged out successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }


    // ----------------------
    // Delete currently logged-in user
    // ----------------------
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer "
            userService.deleteUser(token); // service will decode token, check active session, and delete
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}