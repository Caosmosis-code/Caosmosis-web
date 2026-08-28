package com.mecanosfera.nomos.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "articulos")
@Data
@NoArgsConstructor
public class Articulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(nullable = false)
    private String categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "autor_id", nullable = false)
    private Usuario autor;

    @Column(name = "fecha_publicacion", nullable = false, updatable = false)
    private LocalDateTime fechaPublicacion = LocalDateTime.now();

    @Column(name = "imagen_url")
    private String imagenUrl;

    @Column(name = "tiempo_lectura")
    private Integer tiempoLectura;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoArticulo estado = EstadoArticulo.PENDIENTE;

    @Column(name = "es_portada", nullable = false)
    private boolean esPortada = false;

    @Column(name = "comentario_revision", columnDefinition = "TEXT")
    private String comentarioRevision;
}