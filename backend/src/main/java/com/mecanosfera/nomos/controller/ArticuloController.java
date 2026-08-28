package com.mecanosfera.nomos.controller;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mecanosfera.nomos.dto.ArticuloRequest;
import com.mecanosfera.nomos.dto.ArticuloResponse;
import com.mecanosfera.nomos.dto.RechazoRequest;
import com.mecanosfera.nomos.exception.ArticuloNoEncontradoException;
import com.mecanosfera.nomos.model.Articulo;
import com.mecanosfera.nomos.model.EstadoArticulo;
import com.mecanosfera.nomos.model.Rol;
import com.mecanosfera.nomos.model.Usuario;
import com.mecanosfera.nomos.repository.ArticuloRepository;
import com.mecanosfera.nomos.repository.UsuarioRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/articulos")
public class ArticuloController {

    private final ArticuloRepository articuloRepository;
    private final UsuarioRepository usuarioRepository;

    public ArticuloController(ArticuloRepository articuloRepository, UsuarioRepository usuarioRepository) {
        this.articuloRepository = articuloRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ESCRITOR')")
    public ResponseEntity<ArticuloResponse> crear(@Valid @RequestBody ArticuloRequest request,
            Authentication authentication) {

        Usuario autor = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));

        Articulo articulo = new Articulo();
        articulo.setTitulo(request.getTitulo());
        articulo.setContenido(request.getContenido());
        articulo.setCategoria(request.getCategoria());
        articulo.setImagenUrl(request.getImagenUrl());
        articulo.setAutor(autor);
        articulo.setTiempoLectura(calcularTiempoLectura(request.getContenido()));
        articulo.setEstado(autor.getRol() == Rol.ADMIN ? EstadoArticulo.PUBLICADO : EstadoArticulo.PENDIENTE);

        Articulo guardado = articuloRepository.save(articulo);

        return ResponseEntity.status(201).body(ArticuloResponse.desde(guardado));
    }

    @GetMapping
    public ResponseEntity<List<ArticuloResponse>> listar(@RequestParam(required = false) String categoria) {
        List<Articulo> articulos = (categoria == null || categoria.isBlank())
                ? articuloRepository.findByEstadoOrderByFechaPublicacionDesc(EstadoArticulo.PUBLICADO)
                : articuloRepository.findByEstadoAndCategoriaOrderByFechaPublicacionDesc(EstadoArticulo.PUBLICADO, categoria);

        List<ArticuloResponse> respuesta = articulos.stream()
                .sorted(Comparator.comparing(Articulo::isEsPortada).reversed()
                        .thenComparing(Articulo::getFechaPublicacion, Comparator.reverseOrder()))
                .map(ArticuloResponse::desde)
                .toList();

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/pendientes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ArticuloResponse>> pendientes() {
        List<ArticuloResponse> respuesta = articuloRepository
                .findByEstadoOrderByFechaPublicacionAsc(EstadoArticulo.PENDIENTE)
                .stream()
                .map(ArticuloResponse::desde)
                .toList();
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/mios")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ArticuloResponse>> misArticulos(
            @RequestParam(required = false) String estado,
            Authentication authentication) {

        Usuario actual = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));

        List<Articulo> articulos = (estado == null || estado.isBlank())
                ? articuloRepository.findByAutorIdOrderByFechaPublicacionDesc(actual.getId())
                : articuloRepository.findByAutorIdAndEstadoOrderByFechaPublicacionDesc(
                        actual.getId(), EstadoArticulo.valueOf(estado));

        return ResponseEntity.ok(articulos.stream().map(ArticuloResponse::desde).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticuloResponse> obtenerPorId(@PathVariable Long id, Authentication authentication) {
        Articulo articulo = articuloRepository.findById(id)
                .orElseThrow(ArticuloNoEncontradoException::new);

        if (articulo.getEstado() != EstadoArticulo.PUBLICADO) {
            Usuario actual = usuarioActualOrNull(authentication);
            boolean esAutor = actual != null && actual.getId().equals(articulo.getAutor().getId());
            boolean esAdmin = actual != null && actual.getRol() == Rol.ADMIN;
            if (!esAutor && !esAdmin) {
                throw new ArticuloNoEncontradoException();
            }
        }

        return ResponseEntity.ok(ArticuloResponse.desde(articulo));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ESCRITOR')")
    public ResponseEntity<ArticuloResponse> editar(@PathVariable Long id,
            @Valid @RequestBody ArticuloRequest request,
            Authentication authentication) {

        Articulo articulo = articuloRepository.findById(id)
                .orElseThrow(ArticuloNoEncontradoException::new);

        Usuario actual = validarPermiso(articulo, authentication);

        articulo.setTitulo(request.getTitulo());
        articulo.setContenido(request.getContenido());
        articulo.setCategoria(request.getCategoria());
        articulo.setImagenUrl(request.getImagenUrl());
        articulo.setTiempoLectura(calcularTiempoLectura(request.getContenido()));

        // Si el autor reescribe un artículo rechazado, vuelve a la cola de revisión
        if (actual.getRol() == Rol.ESCRITOR && articulo.getEstado() == EstadoArticulo.RECHAZADO) {
            articulo.setEstado(EstadoArticulo.PENDIENTE);
            articulo.setComentarioRevision(null);
        }

        Articulo actualizado = articuloRepository.save(articulo);
        return ResponseEntity.ok(ArticuloResponse.desde(actualizado));
    }

    @PutMapping("/{id}/aprobar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ArticuloResponse> aprobar(@PathVariable Long id) {
        Articulo articulo = articuloRepository.findById(id)
                .orElseThrow(ArticuloNoEncontradoException::new);

        articulo.setEstado(EstadoArticulo.PUBLICADO);
        articulo.setComentarioRevision(null);
        articulo.setFechaPublicacion(LocalDateTime.now());

        Articulo actualizado = articuloRepository.save(articulo);
        return ResponseEntity.ok(ArticuloResponse.desde(actualizado));
    }

    @PutMapping("/{id}/rechazar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ArticuloResponse> rechazar(@PathVariable Long id, @Valid @RequestBody RechazoRequest request) {
        Articulo articulo = articuloRepository.findById(id)
                .orElseThrow(ArticuloNoEncontradoException::new);

        articulo.setEstado(EstadoArticulo.RECHAZADO);
        articulo.setComentarioRevision(request.getComentario());

        Articulo actualizado = articuloRepository.save(articulo);
        return ResponseEntity.ok(ArticuloResponse.desde(actualizado));
    }

    @PutMapping("/{id}/portada")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ArticuloResponse> marcarPortada(@PathVariable Long id) {
        Articulo articulo = articuloRepository.findById(id)
                .orElseThrow(ArticuloNoEncontradoException::new);

        if (articulo.getEstado() != EstadoArticulo.PUBLICADO) {
            throw new RuntimeException("Solo se puede destacar un artículo publicado");
        }

        articuloRepository.findByEsPortadaTrue().ifPresent(actual -> {
            actual.setEsPortada(false);
            articuloRepository.save(actual);
        });

        articulo.setEsPortada(true);
        Articulo actualizado = articuloRepository.save(articulo);

        return ResponseEntity.ok(ArticuloResponse.desde(actualizado));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ESCRITOR')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, Authentication authentication) {
        Articulo articulo = articuloRepository.findById(id)
                .orElseThrow(ArticuloNoEncontradoException::new);

        validarPermiso(articulo, authentication);
        articuloRepository.delete(articulo);

        return ResponseEntity.noContent().build();
    }

    private Usuario validarPermiso(Articulo articulo, Authentication authentication) {
        Usuario usuarioActual = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));

        boolean esAutor = articulo.getAutor().getId().equals(usuarioActual.getId());
        boolean esAdmin = usuarioActual.getRol() == Rol.ADMIN;

        if (!esAutor && !esAdmin) {
            throw new AccessDeniedException("No tenés permiso para modificar este artículo");
        }
        return usuarioActual;
    }

    private Usuario usuarioActualOrNull(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }
        return usuarioRepository.findByEmail(authentication.getName()).orElse(null);
    }

    private Integer calcularTiempoLectura(String contenido) {
        int palabras = contenido.trim().split("\\s+").length;
        int minutos = (int) Math.ceil(palabras / 200.0);
        return Math.max(minutos, 1);
    }
}