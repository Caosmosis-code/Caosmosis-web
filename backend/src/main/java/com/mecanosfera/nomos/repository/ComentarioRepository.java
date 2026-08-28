package com.mecanosfera.nomos.repository;

import com.mecanosfera.nomos.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByArticuloIdOrderByFechaAsc(Long articuloId);
}