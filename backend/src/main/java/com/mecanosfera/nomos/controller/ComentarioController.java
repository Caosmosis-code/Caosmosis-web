package com.mecanosfera.nomos.controller;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mecanosfera.nomos.dto.ComentarioRequest;
import com.mecanosfera.nomos.dto.ComentarioResponse;
import com.mecanosfera.nomos.exception.ArticuloNoEncontradoException;
import com.mecanosfera.nomos.model.Articulo;
import com.mecanosfera.nomos.model.Comentario;
import com.mecanosfera.nomos.model.Like;
import com.mecanosfera.nomos.model.Usuario;
import com.mecanosfera.nomos.repository.ArticuloRepository;
import com.mecanosfera.nomos.repository.ComentarioRepository;
import com.mecanosfera.nomos.repository.LikeRepository;
import com.mecanosfera.nomos.repository.UsuarioRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/articulos/{articuloId}/comentarios")
public class ComentarioController {

    private final ComentarioRepository comentarioRepository;
    private final ArticuloRepository articuloRepository;
    private final UsuarioRepository usuarioRepository;
    private final LikeRepository likeRepository;

    public ComentarioController(ComentarioRepository comentarioRepository,
                                 ArticuloRepository articuloRepository,
                                 UsuarioRepository usuarioRepository,
                                 LikeRepository likeRepository) {
        this.comentarioRepository = comentarioRepository;
        this.articuloRepository = articuloRepository;
        this.usuarioRepository = usuarioRepository;
        this.likeRepository = likeRepository;
    }

    @GetMapping
    public ResponseEntity<List<ComentarioResponse>> listar(@PathVariable Long articuloId,
            Authentication authentication) {

        List<Comentario> comentarios = comentarioRepository.findByArticuloIdOrderByFechaAsc(articuloId);

        Set<Long> idsConLikeMio = obtenerIdsConLikeDelUsuarioActual(comentarios, authentication);

        List<ComentarioResponse> respuesta = comentarios.stream()
                .map(c -> ComentarioResponse.desde(c, idsConLikeMio.contains(c.getId())))
                .toList();

        return ResponseEntity.ok(respuesta);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ComentarioResponse> crear(@PathVariable Long articuloId,
            @Valid @RequestBody ComentarioRequest request,
            Authentication authentication) {

        Articulo articulo = articuloRepository.findById(articuloId)
                .orElseThrow(ArticuloNoEncontradoException::new);

        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));

        Comentario comentario = new Comentario();
        comentario.setContenido(request.getContenido());
        comentario.setArticulo(articulo);
        comentario.setUsuario(usuario);

        if (request.getComentarioPadreId() != null) {
            Comentario padre = comentarioRepository.findById(request.getComentarioPadreId())
                    .orElseThrow(() -> new RuntimeException("Comentario padre no encontrado"));
            comentario.setComentarioPadre(padre);
        }

        Comentario guardado = comentarioRepository.save(comentario);

        return ResponseEntity.status(201).body(ComentarioResponse.desde(guardado, false));
    }

    @PostMapping("/{comentarioId}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> darLike(@PathVariable Long articuloId,
            @PathVariable Long comentarioId,
            Authentication authentication) {

        Comentario comentario = comentarioRepository.findById(comentarioId)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));

        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));

        boolean yaLikeado = likeRepository.findByUsuarioIdAndComentarioId(usuario.getId(), comentarioId).isPresent();

        if (yaLikeado) {
            likeRepository.findByUsuarioIdAndComentarioId(usuario.getId(), comentarioId)
                    .ifPresent(likeRepository::delete);
            comentario.setCantidadLikes(Math.max(0, comentario.getCantidadLikes() - 1));
        } else {
            Like like = new Like();
            like.setUsuario(usuario);
            like.setComentario(comentario);
            likeRepository.save(like);
            comentario.setCantidadLikes(comentario.getCantidadLikes() + 1);
        }

        comentarioRepository.save(comentario);

        return ResponseEntity.ok(Map.of(
                "cantidadLikes", comentario.getCantidadLikes(),
                "likeadoPorMi", !yaLikeado
        ));
    }

    private Set<Long> obtenerIdsConLikeDelUsuarioActual(List<Comentario> comentarios, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return Set.of();
        }

        Usuario usuario = usuarioRepository.findByEmail(authentication.getName()).orElse(null);
        if (usuario == null) return Set.of();

        List<Long> ids = comentarios.stream().map(Comentario::getId).toList();

        return likeRepository.findByUsuarioIdAndComentarioIdIn(usuario.getId(), ids)
                .stream()
                .map(like -> like.getComentario().getId())
                .collect(Collectors.toSet());
    }
}