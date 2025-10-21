package com.chatbot.ChatBotBackend.controller;

import com.chatbot.ChatBotBackend.dto.ChatRequest;
import com.chatbot.ChatBotBackend.dto.ChatResponse;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private static final String HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
    private static final Dotenv dotenv = Dotenv.load();
    private static final String HF_API_TOKEN = dotenv.get("HUGGINGFACE_API_TOKEN");

    // 🧠 In-memory chat session store
    private final Map<String, List<Map<String, Object>>> sessionStore = new HashMap<>();

    // 🆕 Start a new chat session
    @PostMapping("/new")
    public Map<String, String> createNewSession() {
        String sessionId = UUID.randomUUID().toString();
        sessionStore.put(sessionId, new ArrayList<>());
        System.out.println("🆕 Created new chat session: " + sessionId);
        return Map.of("sessionId", sessionId);
    }

    // 💬 Handle chat messages for a specific session
    @PostMapping("/{sessionId}")
    public ChatResponse chat(@PathVariable String sessionId, @RequestBody ChatRequest request) {
        System.out.println("📩 Received chat for session: " + sessionId);

        // Store messages in memory
        List<Map<String, Object>> sessionMessages =
                sessionStore.computeIfAbsent(sessionId, k -> new ArrayList<>());

        // ✅ Convert List<Map<String, String>> → List<Map<String, Object>>
        for (Map<String, String> msg : request.getMessages()) {
            Map<String, Object> converted = new HashMap<>(msg);
            sessionMessages.add(converted);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(HF_API_TOKEN);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "deepseek-ai/DeepSeek-V3.2-Exp:novita");
        body.put("messages", sessionMessages);
        body.put("stream", false);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        String reply;

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    HF_API_URL, HttpMethod.POST, entity, Map.class
            );

            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, String> messageObj = (Map<String, String>) firstChoice.get("message");
                    reply = messageObj.get("content");

                    // Store AI reply in session
                    sessionMessages.add(Map.of("role", "assistant", "content", reply));
                } else {
                    reply = "⚠️ No response from model.";
                }
            } else {
                reply = "⚠️ Invalid response format.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            reply = "❌ Error contacting Hugging Face: " + e.getMessage();
        }

        return new ChatResponse(reply);
    }

    // 📜 Get chat history for a session
    @GetMapping("/{sessionId}")
    public List<Map<String, Object>> getSession(@PathVariable String sessionId) {
        return sessionStore.getOrDefault(sessionId, new ArrayList<>());
    }

    // 🗑️ Delete a chat session
    @DeleteMapping("/{sessionId}")
    public Map<String, String> deleteSession(@PathVariable String sessionId) {
        sessionStore.remove(sessionId);
        System.out.println("🗑️ Deleted chat session: " + sessionId);
        return Map.of("message", "Session cleared successfully");
    }
}