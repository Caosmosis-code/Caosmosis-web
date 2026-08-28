package com.mecanosfera.nomos.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mecanosfera.nomos.model.Articulo;
import com.mecanosfera.nomos.model.EstadoArticulo;

public interface ArticuloRepository extends JpaRepository<Articulo, Long> {
    List<Articulo> findByEstadoOrderByFechaPublicacionDesc(EstadoArticulo estado);
    List<Articulo> findByEstadoOrderByFechaPublicacionAsc(EstadoArticulo estado);
    List<Articulo> findByEstadoAndCategoriaOrderByFechaPublicacionDesc(EstadoArticulo estado, String categoria);
    List<Articulo> findByAutorIdOrderByFechaPublicacionDesc(Long autorId);
    List<Articulo> findByAutorIdAndEstadoOrderByFechaPublicacionDesc(Long autorId, EstadoArticulo estado);
    Optional<Articulo> findByEsPortadaTrue();
}