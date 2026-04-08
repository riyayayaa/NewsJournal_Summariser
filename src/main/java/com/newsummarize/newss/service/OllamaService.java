package com.newsummarize.newss.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class OllamaService {

    @Value("${groq.api-key}")
    private String apiKey;

    @Value("${groq.model}")
    private String model;

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private final ObjectMapper mapper = new ObjectMapper();

    public String prompt(String systemPrompt, String userMessage) {
        try {
            RestClient client = RestClient.create();

            // OpenAI-compatible request body
            ObjectNode body = mapper.createObjectNode();
            body.put("model", model);
            ArrayNode messages = body.putArray("messages");
            messages.addObject().put("role", "system").put("content", systemPrompt);
            messages.addObject().put("role", "user").put("content", userMessage);

            String response = client.post()
                    .uri(GROQ_URL)
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .body(body.toString())
                    .retrieve()
                    .body(String.class);

            JsonNode json = mapper.readTree(response);
            return json.path("choices")
                       .path(0)
                       .path("message")
                       .path("content")
                       .asText("No response from Groq.");

        } catch (RestClientException | JsonProcessingException e) {
            return "Error contacting Groq: " + e.getMessage();
        }
    }

    public String summarize(String content) {
        return prompt("You are a news summarizer. Summarize the following article concisely in 3-5 sentences.", content);
    }

    public String classifyAndSentiment(String content) {
        return prompt(
            "Analyze the following news content. Respond ONLY in this exact format:\nTOPIC: <one of: Politics, Technology, Sports, Business, Health, Science, Entertainment, World, Other>\nSENTIMENT: <one of: Positive, Negative, Neutral>",
            content
        );
    }

    public String chat(String context, String question) {
        return prompt(
            "You are a helpful assistant. The user has a personal news journal. Use the following journal entries as context to answer their question. If the answer is not in the context, say so.\n\nJOURNAL CONTEXT:\n" + context,
            "USER QUESTION: " + question
        );
    }
}
