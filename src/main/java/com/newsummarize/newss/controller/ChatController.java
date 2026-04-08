package com.newsummarize.newss.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.newsummarize.newss.service.JournalService;
import com.newsummarize.newss.service.OllamaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final JournalService journalService;
    private final OllamaService ollamaService;

    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> ask(@RequestBody Map<String, String> body) {
        String question = body.getOrDefault("question", "");
        if (question.isBlank()) return ResponseEntity.badRequest().body(Map.of("answer", "Please ask a question."));
        String context = journalService.buildRagContext(question);
        String answer = ollamaService.chat(context, question);
        return ResponseEntity.ok(Map.of("answer", answer));
    }
}
