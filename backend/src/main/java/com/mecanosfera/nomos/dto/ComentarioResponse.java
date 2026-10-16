package com.mecanosfera.nomos.dto;

import java.time.LocalDateTime;

import com.mecanosfera.nomos.model.Comentario;
import com.mecanosfera.nomos.model.EstadoComentario;

import lombok.Data;

@Data
public class ComentarioResponse {
    private Long id;
    private String contenido;
    private String usuarioNombre;
    private Long usuarioId;
    private LocalDateTime fecha;
    private Long comentarioPadreId;
    private int cantidadLikes;
    private boolean likeadoPorMi;
    private EstadoComentario estado;
    private Long articuloId;

    public static ComentarioResponse desde(Comentario comentario, boolean likeadoPorMi) {
        ComentarioResponse dto = new ComentarioResponse();
        dto.setId(comentario.getId());
        dto.setContenido(comentario.getContenido());
        dto.setUsuarioNombre(comentario.getUsuario() != null ? comentario.getUsuario().getNombre() : comentario.getAutorNombre());
        dto.setUsuarioId(comentario.getUsuario() != null ? comentario.getUsuario().getId() : null);
        dto.setFecha(comentario.getFecha());
        dto.setComentarioPadreId(
                comentario.getComentarioPadre() != null ? comentario.getComentarioPadre().getId() : null);
        dto.setCantidadLikes(comentario.getCantidadLikes());
        dto.setLikeadoPorMi(likeadoPorMi);
        dto.setEstado(comentario.getEstado());
        dto.setArticuloId(comentario.getArticulo().getId());
        return dto;
    }
}
