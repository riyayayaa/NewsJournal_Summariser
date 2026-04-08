package com.newsummarize.newss.service;

import java.io.IOException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

@Service
public class ScraperService {

    public String extractContent(String url) {
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0")
                    .timeout(10_000)
                    .get();
            // Remove nav, footer, ads
            doc.select("nav, footer, script, style, aside, .ad, .advertisement").remove();
            String text = doc.select("article, .article-body, .post-content, main, body").text();
            return text.length() > 5000 ? text.substring(0, 5000) : text;
        } catch (IOException e) {
            return "Failed to extract content: " + e.getMessage();
        }
    }

    public String extractTitle(String url) {
        try {
            Document doc = Jsoup.connect(url).userAgent("Mozilla/5.0").timeout(10_000).get();
            return doc.title();
        } catch (IOException e) {
            return "Untitled";
        }
    }
}
