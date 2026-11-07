<<<<<<< HEAD
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
=======
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
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
