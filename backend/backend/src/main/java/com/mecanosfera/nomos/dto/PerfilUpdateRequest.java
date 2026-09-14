package com.mecanosfera.nomos.dto;

import lombok.Data;

@Data
public class PerfilUpdateRequest {
    private String bio;
    private String instagram;
    private String twitter;
    private boolean contactoPublico;
}