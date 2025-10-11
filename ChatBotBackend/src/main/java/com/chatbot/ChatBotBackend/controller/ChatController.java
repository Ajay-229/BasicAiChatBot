package com.chatbot.ChatBotBackend.controller;

import com.chatbot.ChatBotBackend.dto.ChatRequest;
import com.chatbot.ChatBotBackend.dto.ChatResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
//@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {
    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request){
        System.out.println("Hi from ChatPost!");
        String userMassage = request.getMessage();
        String dummyReply = "This is a dummy reply to: " + userMassage;
        return new ChatResponse(dummyReply);
    }
}
