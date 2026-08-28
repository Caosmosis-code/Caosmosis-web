package com.mecanosfera.nomos.controller;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/archivos")
public class ArchivoController {

    @PostMapping("/extraer-texto")
    @PreAuthorize("hasAnyRole('ADMIN', 'ESCRITOR')")
    public ResponseEntity<Map<String, String>> extraerTexto(@RequestParam("archivo") MultipartFile archivo) {
        String nombreArchivo = archivo.getOriginalFilename();
        String contenido;

        try {
            if (nombreArchivo != null && nombreArchivo.toLowerCase().endsWith(".docx")) {
                contenido = extraerDeDocx(archivo.getInputStream());
            } else {
                contenido = new String(archivo.getBytes(), StandardCharsets.UTF_8);
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "No se pudo leer el archivo"));
        }

        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("contenido", contenido);
        return ResponseEntity.ok(respuesta);
    }

    private String extraerDeDocx(InputStream inputStream) throws IOException {
        StringBuilder texto = new StringBuilder();
        try (XWPFDocument documento = new XWPFDocument(inputStream)) {
            for (XWPFParagraph parrafo : documento.getParagraphs()) {
                texto.append(parrafo.getText()).append("\n");
            }
        }
        return texto.toString().trim();
    }
}