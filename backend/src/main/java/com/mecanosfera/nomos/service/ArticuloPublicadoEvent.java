package com.mecanosfera.nomos.service;

import com.mecanosfera.nomos.model.Articulo;

public record ArticuloPublicadoEvent(
        Long id,
        String titulo,
        String categoria,
        String autor,
        String resumen,
        String imagenUrl) {

    public static ArticuloPublicadoEvent desde(Articulo articulo) {
        String resumen = articulo.getContenido().lines()
                .map(String::trim)
                .filter(linea -> !linea.isBlank())
                .findFirst()
                .orElse("");
        if (resumen.startsWith("> ")) resumen = resumen.substring(2);
        if (resumen.startsWith("## ")) resumen = resumen.substring(3);
        if (resumen.length() > 260) resumen = resumen.substring(0, 257).stripTrailing() + "...";

        return new ArticuloPublicadoEvent(
                articulo.getId(),
                articulo.getTitulo(),
                articulo.getCategoria(),
                articulo.getAutor().getNombre(),
                resumen,
                articulo.getImagenUrl());
    }
}