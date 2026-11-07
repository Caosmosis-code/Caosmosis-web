package com.mecanosfera.nomos.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.mecanosfera.nomos.dto.ComentarioResponse;
import com.mecanosfera.nomos.model.EstadoComentario;
import com.mecanosfera.nomos.repository.ComentarioRepository;

@RestController
@RequestMapping("/api/admin/comentarios")
@PreAuthorize("hasRole('ADMIN')")
public class AdminComentarioController {
    private final ComentarioRepository comentarioRepository;

    public AdminComentarioController(ComentarioRepository comentarioRepository) {
        this.comentarioRepository = comentarioRepository;
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<ComentarioResponse>> pendientes() {
        return ResponseEntity.ok(comentarioRepository.findByEstadoOrderByFechaAsc(EstadoComentario.PENDIENTE)
                .stream().map(comment -> ComentarioResponse.desde(comment, false)).toList());
    }

    @PutMapping("/{id}/aprobar")
    public ResponseEntity<ComentarioResponse> aprobar(@PathVariable Long id) {
        return cambiarEstado(id, EstadoComentario.APROBADO);
    }

    @PutMapping("/{id}/rechazar")
    public ResponseEntity<ComentarioResponse> rechazar(@PathVariable Long id) {
        return cambiarEstado(id, EstadoComentario.RECHAZADO);
    }

    private ResponseEntity<ComentarioResponse> cambiarEstado(Long id, EstadoComentario estado) {
        var comment = comentarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentario no encontrado."));
        comment.setEstado(estado);
        return ResponseEntity.ok(ComentarioResponse.desde(comentarioRepository.save(comment), false));
    }
}
