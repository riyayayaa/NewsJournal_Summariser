package com.newsummarize.newss.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class NewsApiService {

    @Value("${newsapi.key}")
    private String apiKey;

    @Value("${newsapi.base-url}")
    private String baseUrl;

    private final ObjectMapper mapper = new ObjectMapper();

    public List<Map<String, String>> getTopHeadlines(String category) {
        List<Map<String, String>> articles = new ArrayList<>();
        try {
            String cat = (category == null || category.isBlank()) ? "general" : category;
            RestClient client = RestClient.create();
            String response = client.get()
                    .uri(baseUrl + "/top-headlines?country=us&category=" + cat + "&pageSize=20&apiKey=" + apiKey)
                    .retrieve()
                    .body(String.class);

            JsonNode root = mapper.readTree(response);
            for (JsonNode article : root.path("articles")) {
                articles.add(Map.of(
                    "title",       article.path("title").asText(""),
                    "description", article.path("description").asText(""),
                    "url",         article.path("url").asText(""),
                    "source",      article.path("source").path("name").asText(""),
                    "publishedAt", article.path("publishedAt").asText("")
                ));
            }
        } catch (RestClientException | JsonProcessingException e) {
            articles.add(Map.of("title", "Error fetching news: " + e.getMessage(), "description", "", "url", "", "source", "", "publishedAt", ""));
        }
        return articles;
    }

    public List<Map<String, String>> searchNews(String query) {
        List<Map<String, String>> articles = new ArrayList<>();
        try {
            RestClient client = RestClient.create();
            String response = client.get()
                    .uri(baseUrl + "/everything?q=" + query + "&pageSize=20&sortBy=publishedAt&apiKey=" + apiKey)
                    .retrieve()
                    .body(String.class);

            JsonNode root = mapper.readTree(response);
            for (JsonNode article : root.path("articles")) {
                articles.add(Map.of(
                    "title",       article.path("title").asText(""),
                    "description", article.path("description").asText(""),
                    "url",         article.path("url").asText(""),
                    "source",      article.path("source").path("name").asText(""),
                    "publishedAt", article.path("publishedAt").asText("")
                ));
            }
        } catch (RestClientException | JsonProcessingException e) {
            articles.add(Map.of("title", "Error: " + e.getMessage(), "description", "", "url", "", "source", "", "publishedAt", ""));
        }
        return articles;
    }
}
