package com.chatbot.ChatBotBackend.config;

import com.chatbot.ChatBotBackend.model.User;
import com.chatbot.ChatBotBackend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    // ----------------------
    // Generate token using username
    // ----------------------
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username) // username stored in token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    // ----------------------
    // Extract username from token
    // ----------------------
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // ----------------------
    // Extract userId (UUID) using repository
    // ----------------------
    public UUID extractUserIdFromJwt(String token, UserRepository userRepository) {
        try {
            String username = extractUsername(token);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Invalid token: user not found"));
            return user.getId();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    // ----------------------
    // Validate token
    // ----------------------
    public boolean validateToken(String token) {
        try {
            return !getClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }
}