package com.chatbot.ChatBotBackend.util;

import com.chatbot.ChatBotBackend.model.ChatMessage;
import io.github.cdimascio.dotenv.Dotenv;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Component
public class HuggingFaceClient {

    private static final String HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
    private static final Dotenv dotenv = Dotenv.load();
    private static final String HF_API_TOKEN = dotenv.get("HUGGINGFACE_API_TOKEN");

    public String getAIResponse(List<ChatMessage> messages) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(HF_API_TOKEN);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "deepseek-ai/DeepSeek-V3.2-Exp:novita");
            body.put("messages", messages);
            body.put("stream", false);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(
                    HF_API_URL, HttpMethod.POST, new HttpEntity<>(body, headers), Map.class
            );

            if (response.getBody() != null && response.getBody().containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, String> messageObj = (Map<String, String>) firstChoice.get("message");
                    return messageObj.get("content");
                }
            }
            return "⚠️ No valid response from AI model.";
        } catch (Exception e) {
            log.error("❌ Error contacting Hugging Face API: {}", e.getMessage(), e);
            return "❌ Error contacting Hugging Face: " + e.getMessage();
        }
    }
}
