package com.newsummarize.newss.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.newsummarize.newss.model.JournalEntry;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {

    List<JournalEntry> findByTopicIgnoreCase(String topic);

    List<JournalEntry> findBySentimentIgnoreCase(String sentiment);

    @Query("SELECT e FROM JournalEntry e WHERE LOWER(e.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<JournalEntry> searchByKeyword(@Param("keyword") String keyword);
}
