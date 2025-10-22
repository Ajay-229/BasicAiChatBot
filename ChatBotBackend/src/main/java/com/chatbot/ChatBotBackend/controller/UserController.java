package com.chatbot.ChatBotBackend.controller;

import com.chatbot.ChatBotBackend.dto.*;
import com.chatbot.ChatBotBackend.service.UserService;
import com.chatbot.ChatBotBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            UserResponse response = userService.registerUser(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            UserResponse response = userService.loginUser(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Check username/email uniqueness
    @GetMapping("/check-unique")
    public ResponseEntity<Map<String, Object>> checkUnique(
            @RequestParam String field,
            @RequestParam String value) {

        Map<String, Object> response = new HashMap<>();

        if (field.equals("username")) {
            boolean exists = userRepository.existsByUsername(value);
            response.put("exists", exists);
            response.put("message", exists ? "Username already taken" : "Available");
        } else if (field.equals("email")) {
            boolean exists = userRepository.existsByEmail(value);
            response.put("exists", exists);
            response.put("message", exists ? "Email already registered" : "Available");
        } else {
            response.put("exists", false);
            response.put("message", "Invalid field type");
        }

        return ResponseEntity.ok(response);
    }
}