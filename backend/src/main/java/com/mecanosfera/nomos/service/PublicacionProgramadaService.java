package com.mecanosfera.nomos.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.mecanosfera.nomos.model.Articulo;
import com.mecanosfera.nomos.model.EstadoArticulo;
import com.mecanosfera.nomos.repository.ArticuloRepository;

@Service
public class PublicacionProgramadaService {

    private static final Logger log = LoggerFactory.getLogger(PublicacionProgramadaService.class);

    private final ArticuloRepository articuloRepository;

    public PublicacionProgramadaService(ArticuloRepository articuloRepository) {
        this.articuloRepository = articuloRepository;
    }

    @Scheduled(fixedRate = 60000) // cada 60 segundos
    public void publicarArticulosProgramados() {
        List<Articulo> pendientes = articuloRepository
                .findByEstadoAndFechaPublicacionProgramadaLessThanEqual(
                        EstadoArticulo.PROGRAMADO, LocalDateTime.now());

        for (Articulo articulo : pendientes) {
            articulo.setEstado(EstadoArticulo.PUBLICADO);
            articulo.setFechaPublicacion(LocalDateTime.now());
            articulo.setFechaPublicacionProgramada(null);
            articuloRepository.save(articulo);
            log.info("Publicación automática ejecutada — artículo id={}, título=\"{}\"",
                    articulo.getId(), articulo.getTitulo());
        }
    }
}