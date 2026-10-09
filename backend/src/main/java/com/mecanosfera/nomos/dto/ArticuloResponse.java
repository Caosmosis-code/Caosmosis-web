package com.mecanosfera.nomos.dto;

import com.mecanosfera.nomos.model.Articulo;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ArticuloResponse {
    private Long id;
    private String titulo;
    private String contenido;
    private String categoria;
    private String autorNombre;
    private Long autorId;
    private String autorEmail;
    private String autorInstagram;
    private String autorTwitter;
    private LocalDateTime fechaPublicacion;
    private String imagenUrl;
    private Integer tiempoLectura;
    private String estado;
    private boolean esPortada;
    private String comentarioRevision;

    public static ArticuloResponse desde(Articulo articulo) {
        ArticuloResponse dto = new ArticuloResponse();
        dto.setId(articulo.getId());
        dto.setTitulo(articulo.getTitulo());
        dto.setContenido(articulo.getContenido());
        dto.setCategoria(articulo.getCategoria());
        dto.setAutorNombre(articulo.getAutor().getNombre());
        dto.setAutorId(articulo.getAutor().getId());
        dto.setFechaPublicacion(articulo.getFechaPublicacion());
        dto.setImagenUrl(articulo.getImagenUrl());
        dto.setTiempoLectura(articulo.getTiempoLectura());
        dto.setEstado(articulo.getEstado().name());
        dto.setEsPortada(articulo.isEsPortada());
        dto.setComentarioRevision(articulo.getComentarioRevision());

        boolean contactoPublico = articulo.getAutor().isContactoPublico();
        dto.setAutorEmail(contactoPublico ? articulo.getAutor().getEmail() : null);
        dto.setAutorInstagram(contactoPublico ? articulo.getAutor().getInstagram() : null);
        dto.setAutorTwitter(contactoPublico ? articulo.getAutor().getTwitter() : null);
        return dto;
    }
}