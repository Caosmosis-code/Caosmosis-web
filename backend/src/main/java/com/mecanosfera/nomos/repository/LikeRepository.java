package com.mecanosfera.nomos.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mecanosfera.nomos.model.Like;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUsuarioIdAndComentarioId(Long usuarioId, Long comentarioId);
    List<Like> findByUsuarioIdAndComentarioIdIn(Long usuarioId, List<Long> comentarioIds);
}