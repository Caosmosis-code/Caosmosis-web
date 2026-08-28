package com.mecanosfera.nomos.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mecanosfera.nomos.dto.ArticuloResponse;
import com.mecanosfera.nomos.dto.AutorResponse;
import com.mecanosfera.nomos.model.EstadoArticulo;
import com.mecanosfera.nomos.model.Usuario;
import com.mecanosfera.nomos.repository.ArticuloRepository;
import com.mecanosfera.nomos.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/autores")
public class AutorController {

    private final UsuarioRepository usuarioRepository;
    private final ArticuloRepository articuloRepository;

    public AutorController(UsuarioRepository usuarioRepository, ArticuloRepository articuloRepository) {
        this.usuarioRepository = usuarioRepository;
        this.articuloRepository = articuloRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AutorResponse> obtener(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Autor no encontrado"));
        return ResponseEntity.ok(AutorResponse.desde(usuario));
    }

    @GetMapping("/{id}/articulos")
    public ResponseEntity<List<ArticuloResponse>> articulos(@PathVariable Long id) {
        List<ArticuloResponse> respuesta = articuloRepository
                .findByAutorIdAndEstadoOrderByFechaPublicacionDesc(id, EstadoArticulo.PUBLICADO)
                .stream()
                .map(ArticuloResponse::desde)
                .toList();
        return ResponseEntity.ok(respuesta);
    }
}