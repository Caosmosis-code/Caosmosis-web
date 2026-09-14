package com.mecanosfera.nomos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mecanosfera.nomos.model.Comentario;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByArticuloIdOrderByFechaAsc(Long articuloId);
    List<Comentario> findByComentarioPadreId(Long padreId);
    long countByArticuloId(Long articuloId);
}