package com.mecanosfera.nomos.dto;

import java.time.LocalDateTime;

import com.mecanosfera.nomos.model.Comentario;

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

    public static ComentarioResponse desde(Comentario comentario, boolean likeadoPorMi) {
        ComentarioResponse dto = new ComentarioResponse();
        dto.setId(comentario.getId());
        dto.setContenido(comentario.getContenido());
        dto.setUsuarioNombre(comentario.getUsuario().getNombre());
        dto.setUsuarioId(comentario.getUsuario().getId());
        dto.setFecha(comentario.getFecha());
        dto.setComentarioPadreId(
                comentario.getComentarioPadre() != null ? comentario.getComentarioPadre().getId() : null);
        dto.setCantidadLikes(comentario.getCantidadLikes());
        dto.setLikeadoPorMi(likeadoPorMi);
        return dto;
    }
}