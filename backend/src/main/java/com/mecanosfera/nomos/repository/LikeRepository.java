<<<<<<< HEAD
package com.mecanosfera.nomos.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mecanosfera.nomos.model.Like;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUsuarioIdAndComentarioId(Long usuarioId, Long comentarioId);
    Optional<Like> findByVisitorKeyAndComentarioId(String visitorKey, Long comentarioId);
    List<Like> findByUsuarioIdAndComentarioIdIn(Long usuarioId, List<Long> comentarioIds);
    long deleteByComentarioId(Long comentarioId);
}
=======
package com.mecanosfera.nomos.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mecanosfera.nomos.model.Like;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUsuarioIdAndComentarioId(Long usuarioId, Long comentarioId);
    Optional<Like> findByVisitorKeyAndComentarioId(String visitorKey, Long comentarioId);
    List<Like> findByUsuarioIdAndComentarioIdIn(Long usuarioId, List<Long> comentarioIds);
    long deleteByComentarioId(Long comentarioId);
}
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
