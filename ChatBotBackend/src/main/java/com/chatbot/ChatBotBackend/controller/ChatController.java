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

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        System.out.println("📩 Received chat with " + request.getMessages().size() + " messages");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(HF_API_TOKEN);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "deepseek-ai/DeepSeek-V3.2-Exp:novita");
        body.put("messages", request.getMessages()); // ✅ full chat history
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
}