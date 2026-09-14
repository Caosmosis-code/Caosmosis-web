package com.mecanosfera.nomos.dto;

import java.time.LocalDateTime;

import com.mecanosfera.nomos.model.Articulo;

import lombok.Data;

@Data
public class ArticuloEstadisticaResponse {
    private Long id;
    private String titulo;
    private String categoria;
    private String estado;
    private LocalDateTime fechaPublicacion;
    private long cantidadComentarios;
    private int cantidadLikes;

    public static ArticuloEstadisticaResponse desde(Articulo articulo, long cantidadComentarios, int cantidadLikes) {
        ArticuloEstadisticaResponse dto = new ArticuloEstadisticaResponse();
        dto.setId(articulo.getId());
        dto.setTitulo(articulo.getTitulo());
        dto.setCategoria(articulo.getCategoria());
        dto.setEstado(articulo.getEstado().name());
        dto.setFechaPublicacion(articulo.getFechaPublicacion());
        dto.setCantidadComentarios(cantidadComentarios);
        dto.setCantidadLikes(cantidadLikes);
        return dto;
    }
}