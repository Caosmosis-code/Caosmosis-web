package com.mecanosfera.nomos.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "likes", uniqueConstraints = {
        @UniqueConstraint(name = "uk_like_user_comment", columnNames = {"usuario_id", "comentario_id"}),
        @UniqueConstraint(name = "uk_like_visitor_comment", columnNames = {"visitor_key", "comentario_id"})
})
@Data
@NoArgsConstructor
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "visitor_key", length = 36)
    private String visitorKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comentario_id", nullable = false)
    private Comentario comentario;
}
