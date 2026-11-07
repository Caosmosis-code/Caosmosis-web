package com.mecanosfera.nomos.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mecanosfera.nomos.model.Articulo;
import com.mecanosfera.nomos.model.EstadoArticulo;
import com.mecanosfera.nomos.repository.ArticuloRepository;

@Service
public class PublicacionProgramadaService {

    private static final Logger log = LoggerFactory.getLogger(PublicacionProgramadaService.class);

    private final ArticuloRepository articuloRepository;
    private final ApplicationEventPublisher eventPublisher;

    public PublicacionProgramadaService(ArticuloRepository articuloRepository,
            ApplicationEventPublisher eventPublisher) {
        this.articuloRepository = articuloRepository;
        this.eventPublisher = eventPublisher;
    }

    @Scheduled(fixedRate = 60000) // cada 60 segundos
    @Transactional
    public void publicarArticulosProgramados() {
        List<Articulo> pendientes = articuloRepository
                .findByEstadoAndFechaPublicacionProgramadaLessThanEqual(
                        EstadoArticulo.PROGRAMADO, LocalDateTime.now());

        for (Articulo articulo : pendientes) {
            articulo.setEstado(EstadoArticulo.PUBLICADO);
            articulo.setFechaPublicacion(LocalDateTime.now());
            articulo.setFechaPublicacionProgramada(null);
            Articulo publicado = articuloRepository.save(articulo);
            eventPublisher.publishEvent(ArticuloPublicadoEvent.desde(publicado));
            log.info("Publicación automática ejecutada — artículo id={}, título=\"{}\"",
                    articulo.getId(), articulo.getTitulo());
        }
    }
}