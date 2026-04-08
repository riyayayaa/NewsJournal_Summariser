package com.newsummarize.newss.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.newsummarize.newss.service.NewsApiService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NewsController {

    private final NewsApiService newsApiService;

    @GetMapping
    public List<Map<String, String>> getNews(
            @RequestParam(defaultValue = "general") String category,
            @RequestParam(required = false) String q) {
        if (q != null && !q.isBlank()) return newsApiService.searchNews(q);
        return newsApiService.getTopHeadlines(category);
    }
}
