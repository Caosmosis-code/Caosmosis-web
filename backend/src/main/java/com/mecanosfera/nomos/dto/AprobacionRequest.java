package com.mecanosfera.nomos.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AprobacionRequest {
    private LocalDateTime fechaPublicacionProgramada; // null = publicar ya
}