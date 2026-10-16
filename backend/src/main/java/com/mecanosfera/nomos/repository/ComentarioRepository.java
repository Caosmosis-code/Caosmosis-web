package com.mecanosfera.nomos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mecanosfera.nomos.model.Comentario;
import com.mecanosfera.nomos.model.EstadoComentario;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByArticuloIdOrderByFechaAsc(Long articuloId);
    List<Comentario> findByArticuloIdAndEstadoOrderByFechaAsc(Long articuloId, EstadoComentario estado);
    List<Comentario> findByEstadoOrderByFechaAsc(EstadoComentario estado);
    List<Comentario> findByComentarioPadreId(Long padreId);
}
