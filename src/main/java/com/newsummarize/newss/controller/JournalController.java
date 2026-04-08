package com.newsummarize.newss.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.newsummarize.newss.model.JournalEntry;
import com.newsummarize.newss.service.JournalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/entries")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class JournalController {

    private final JournalService journalService;

    @GetMapping
    public List<JournalEntry> getAll() {
        return journalService.getAll();
    }

    @PostMapping("/url")
    public JournalEntry addFromUrl(@RequestBody Map<String, String> body) {
        return journalService.createFromUrl(body.get("url"));
    }

    @PostMapping("/text")
    public JournalEntry addFromText(@RequestBody Map<String, String> body) {
        return journalService.createFromText(body.get("title"), body.get("content"));
    }

    @PostMapping("/{id}/summarize")
    public JournalEntry summarize(@PathVariable Long id) {
        return journalService.summarize(id);
    }

    @PostMapping("/{id}/classify")
    public JournalEntry classify(@PathVariable Long id) {
        return journalService.classifyAndAnalyzeSentiment(id);
    }

    @PutMapping("/{id}")
    public JournalEntry update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return journalService.update(id, body.get("title"), body.get("content"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        journalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
