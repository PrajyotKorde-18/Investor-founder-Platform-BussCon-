package com.busscon.repository;

import com.busscon.model.PipelineDeal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PipelineDealRepository extends JpaRepository<PipelineDeal, Long> {
    List<PipelineDeal> findByStage(String stage);
    Optional<PipelineDeal> findByStartupIdeaId(Long startupIdeaId);
}
