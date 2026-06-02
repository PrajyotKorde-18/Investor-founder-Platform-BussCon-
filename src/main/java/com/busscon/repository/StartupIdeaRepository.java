package com.busscon.repository;

import com.busscon.model.StartupIdea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StartupIdeaRepository extends JpaRepository<StartupIdea, Long> {

    List<StartupIdea> findByDomain(String domain);

    @Query("SELECT s FROM StartupIdea s WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.shortDescription) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<StartupIdea> searchIdeas(@Param("query") String query);

    @Query("SELECT s FROM StartupIdea s WHERE s.domain = :domain AND (LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.shortDescription) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<StartupIdea> searchIdeasByDomain(@Param("query") String query, @Param("domain") String domain);
}
