package com.newsummarize.newss.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.newsummarize.newss.model.JournalEntry;
import com.newsummarize.newss.repository.JournalEntryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JournalService {

    private final JournalEntryRepository repo;
    private final OllamaService ollama;
    private final ScraperService scraper;

    public List<JournalEntry> getAll() {
        return repo.findAll();
    }

    public Optional<JournalEntry> getById(Long id) {
        return repo.findById(id);
    }

    public JournalEntry save(JournalEntry entry) {
        return repo.save(entry);
    }

    public JournalEntry createFromUrl(String url) {
        JournalEntry entry = new JournalEntry();
        entry.setSourceUrl(url);
        entry.setTitle(scraper.extractTitle(url));
        entry.setContent(scraper.extractContent(url));
        return repo.save(entry);
    }

    public JournalEntry createFromText(String title, String content) {
        JournalEntry entry = new JournalEntry();
        entry.setTitle(title);
        entry.setContent(content);
        return repo.save(entry);
    }

    public JournalEntry summarize(Long id) {
        JournalEntry entry = repo.findById(id).orElseThrow();
        entry.setSummary(ollama.summarize(entry.getContent()));
        entry.setUpdatedAt(LocalDateTime.now());
        return repo.save(entry);
    }

    public JournalEntry classifyAndAnalyzeSentiment(Long id) {
        JournalEntry entry = repo.findById(id).orElseThrow();
        String result = ollama.classifyAndSentiment(entry.getContent());
        // Parse TOPIC: ... SENTIMENT: ...
        for (String line : result.split("\n")) {
            if (line.startsWith("TOPIC:")) entry.setTopic(line.replace("TOPIC:", "").trim());
            if (line.startsWith("SENTIMENT:")) entry.setSentiment(line.replace("SENTIMENT:", "").trim());
        }
        entry.setUpdatedAt(LocalDateTime.now());
        return repo.save(entry);
    }

    public JournalEntry update(Long id, String title, String content) {
        JournalEntry entry = repo.findById(id).orElseThrow();
        entry.setTitle(title);
        entry.setContent(content);
        entry.setUpdatedAt(LocalDateTime.now());
        return repo.save(entry);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    /** Build RAG context: concatenate relevant entries for the question */
    public String buildRagContext(String question) {
        List<JournalEntry> relevant = repo.searchByKeyword(extractKeyword(question));
        if (relevant.isEmpty()) relevant = repo.findAll();
        StringBuilder sb = new StringBuilder();
        for (JournalEntry e : relevant) {
            sb.append("--- Entry: ").append(e.getTitle()).append(" ---\n");
            if (e.getSummary() != null && !e.getSummary().isBlank()) {
                sb.append(e.getSummary()).append("\n");
            } else {
                String snippet = e.getContent() != null && e.getContent().length() > 500
                        ? e.getContent().substring(0, 500) : e.getContent();
                sb.append(snippet).append("\n");
            }
        }
        return sb.toString();
    }

    private String extractKeyword(String question) {
        // Simple: use the longest word as keyword
        String[] words = question.split("\\s+");
        String best = "";
        for (String w : words) {
            if (w.length() > best.length()) best = w;
        }
        return best;
    }
}
