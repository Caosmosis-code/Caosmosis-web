package com.mecanosfera.nomos.controller;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.mecanosfera.nomos.dto.ComentarioRequest;
import com.mecanosfera.nomos.dto.ComentarioResponse;
import com.mecanosfera.nomos.exception.ArticuloNoEncontradoException;
import com.mecanosfera.nomos.model.Articulo;
import com.mecanosfera.nomos.model.Comentario;
import com.mecanosfera.nomos.model.EstadoComentario;
import com.mecanosfera.nomos.model.Like;
import com.mecanosfera.nomos.model.Rol;
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

    public ComentarioController(ComentarioRepository comentarioRepository, ArticuloRepository articuloRepository,
            UsuarioRepository usuarioRepository, LikeRepository likeRepository) {
        this.comentarioRepository = comentarioRepository;
        this.articuloRepository = articuloRepository;
        this.usuarioRepository = usuarioRepository;
        this.likeRepository = likeRepository;
    }

    @GetMapping
    public ResponseEntity<List<ComentarioResponse>> listar(@PathVariable Long articuloId,
            @RequestHeader(value = "X-Visitor-Id", required = false) String visitorId, Authentication authentication) {
        List<Comentario> comments = comentarioRepository.findByArticuloIdAndEstadoOrderByFechaAsc(articuloId, EstadoComentario.APROBADO);
        Set<Long> likedIds = likedByCurrentUser(comments, visitorId, authentication);
        return ResponseEntity.ok(comments.stream().map(c -> ComentarioResponse.desde(c, likedIds.contains(c.getId()))).toList());
    }

    @PostMapping
    public ResponseEntity<ComentarioResponse> crear(@PathVariable Long articuloId, @Valid @RequestBody ComentarioRequest request,
            Authentication authentication) {
        Articulo article = articuloRepository.findById(articuloId).orElseThrow(ArticuloNoEncontradoException::new);
        Usuario user = authenticatedUser(authentication);
        if (user == null && (request.getAutorNombre() == null || request.getAutorNombre().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Indicá un nombre para publicar como visitante.");
        }

        Comentario parent = null;
        if (request.getComentarioPadreId() != null) {
            parent = comentarioRepository.findById(request.getComentarioPadreId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentario padre no encontrado."));
            if (!parent.getArticulo().getId().equals(articuloId) || parent.getEstado() != EstadoComentario.APROBADO) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede responder a ese comentario.");
            }
        }

        Comentario comment = new Comentario();
        comment.setContenido(request.getContenido().trim());
        comment.setArticulo(article);
        comment.setComentarioPadre(parent);
        comment.setUsuario(user);
        comment.setAutorNombre(user != null ? user.getNombre() : request.getAutorNombre().trim());
        comment.setAutorEmail(user == null ? request.getAutorEmail() : null);
        comment.setEstado(EstadoComentario.PENDIENTE);
        Comentario saved = comentarioRepository.save(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(ComentarioResponse.desde(saved, false));
    }

    @DeleteMapping("/{comentarioId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> eliminar(@PathVariable Long articuloId, @PathVariable Long comentarioId, Authentication authentication) {
        Comentario comment = comentarioRepository.findById(comentarioId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!comment.getArticulo().getId().equals(articuloId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        Usuario current = authenticatedUser(authentication);
        boolean isAuthor = current != null && comment.getUsuario() != null && comment.getUsuario().getId().equals(current.getId());
        boolean isAdmin = current != null && current.getRol() == Rol.ADMIN;
        if (!isAuthor && !isAdmin) throw new AccessDeniedException("No tenés permiso para eliminar este comentario.");
        deleteWithReplies(comment);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{comentarioId}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long articuloId, @PathVariable Long comentarioId,
            @RequestHeader(value = "X-Visitor-Id", required = false) String visitorId, Authentication authentication) {
        Comentario comment = comentarioRepository.findById(comentarioId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!comment.getArticulo().getId().equals(articuloId) || comment.getEstado() != EstadoComentario.APROBADO) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Usuario user = authenticatedUser(authentication);
        Like existing;
        if (user != null) {
            existing = likeRepository.findByUsuarioIdAndComentarioId(user.getId(), comentarioId).orElse(null);
        } else {
            if (visitorId == null || !isUuid(visitorId)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Falta un identificador de visitante válido.");
            existing = likeRepository.findByVisitorKeyAndComentarioId(visitorId, comentarioId).orElse(null);
        }

        boolean liked;
        if (existing != null) {
            likeRepository.delete(existing);
            comment.setCantidadLikes(Math.max(0, comment.getCantidadLikes() - 1));
            liked = false;
        } else {
            Like like = new Like();
            like.setUsuario(user);
            like.setVisitorKey(user == null ? visitorId : null);
            like.setComentario(comment);
            likeRepository.save(like);
            comment.setCantidadLikes(comment.getCantidadLikes() + 1);
            liked = true;
        }
        comentarioRepository.save(comment);
        return ResponseEntity.ok(Map.of("cantidadLikes", comment.getCantidadLikes(), "likeadoPorMi", liked));
    }

    private Usuario authenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) return null;
        return usuarioRepository.findByEmail(authentication.getName()).orElse(null);
    }

    private Set<Long> likedByCurrentUser(List<Comentario> comments, String visitorId, Authentication authentication) {
        Usuario user = authenticatedUser(authentication);
        if (comments.isEmpty()) return Set.of();
        List<Long> ids = comments.stream().map(Comentario::getId).toList();
        if (user != null) {
            return likeRepository.findByUsuarioIdAndComentarioIdIn(user.getId(), ids).stream()
                    .map(like -> like.getComentario().getId()).collect(Collectors.toSet());
        }
        if (visitorId == null || !isUuid(visitorId)) return Set.of();
        return ids.stream().filter(id -> likeRepository.findByVisitorKeyAndComentarioId(visitorId, id).isPresent())
                .collect(Collectors.toSet());
    }

    private void deleteWithReplies(Comentario comment) {
        for (Comentario reply : comentarioRepository.findByComentarioPadreId(comment.getId())) deleteWithReplies(reply);
        likeRepository.deleteByComentarioId(comment.getId());
        comentarioRepository.delete(comment);
    }

    private boolean isUuid(String value) {
        try { UUID.fromString(value); return true; }
        catch (IllegalArgumentException exception) { return false; }
    }
}
