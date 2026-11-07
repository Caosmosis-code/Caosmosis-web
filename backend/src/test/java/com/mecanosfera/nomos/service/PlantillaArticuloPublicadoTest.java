package com.mecanosfera.nomos.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

class PlantillaArticuloPublicadoTest {

    private final PlantillaArticuloPublicado plantilla = new PlantillaArticuloPublicado();

    @Test
    void incluyeDatosDeLaNotaYEnlaces() {
        ArticuloPublicadoEvent articulo = new ArticuloPublicadoEvent(
                42L, "Una historia nueva", "Cultura", "Ana Pérez", "Una bajada breve.", null);

        MensajeEmail mensaje = plantilla.crear(articulo, "https://caosmosis.example/");

        assertTrue(mensaje.asunto().contains("Una historia nueva"));
        assertTrue(mensaje.texto().contains("https://caosmosis.example/articulo/42"));
        assertTrue(mensaje.texto().contains("https://caosmosis.example/perfil"));
        assertTrue(mensaje.html().contains("Una bajada breve."));
        assertTrue(mensaje.texto().contains("Cultura"));
        assertTrue(mensaje.html().contains("Ana"));
        assertTrue(mensaje.texto().contains("Ana Pérez"));
    }

    @Test
    void escapaTextoYDescartaImagenesQueNoSeanHttps() {
        ArticuloPublicadoEvent articulo = new ArticuloPublicadoEvent(
                43L, "<script>alert(1)</script>", "Ciencia", "Autor", "Texto", "javascript:alert(1)");

        MensajeEmail mensaje = plantilla.crear(articulo, "https://caosmosis.example");

        assertTrue(mensaje.html().contains("&lt;script&gt;"));
        assertFalse(mensaje.html().contains("<script>"));
        assertFalse(mensaje.html().contains("javascript:"));
    }
}