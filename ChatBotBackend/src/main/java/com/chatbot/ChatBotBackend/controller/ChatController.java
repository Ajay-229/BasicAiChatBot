package com.chatbot.ChatBotBackend.controller;

import com.chatbot.ChatBotBackend.dto.ChatRequest;
import com.chatbot.ChatBotBackend.dto.ChatResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.http.*;
import java.util.*;

@RestController
@RequestMapping("/api/chat")
//@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {
    private static final String HF_API_URL = "https://router.huggingface.co/v1/chat/completions";

    private static final Dotenv dotenv = Dotenv.load();
    // Now get the variable from the instance
    private static final String HF_API_TOKEN = dotenv.get("HUGGINGFACE_API_TOKEN");

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request){

        System.out.println("Hi from ChatPost!");
        String userMessage = request.getMessage();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(HF_API_TOKEN);

        Map<String, Object> body = new HashMap<String, Object>();
        body.put("model", "deepseek-ai/DeepSeek-V3.2-Exp:novita");

        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", userMessage);
        messages.add(message);
        body.put("messages", messages);
        body.put("stream", false);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(body, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(
                HF_API_URL,
                HttpMethod.POST,
                httpEntity,
                Map.class
        );

        String reply;
        try {
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, String> messageObj = (Map<String, String>) firstChoice.get("message");
                    reply = messageObj.get("content");
                } else {
                    reply = "Sorry, I didn’t get a response.";
                }
            } else {
                reply = "Sorry, no choices in response.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            reply = "Error talking to AI model.";
        }

//        String dummyReply = "This is a dummy reply to: " + userMassage;
        return new ChatResponse(reply);
    }
}