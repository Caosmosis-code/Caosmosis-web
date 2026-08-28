package com.mecanosfera.nomos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MecanosferaApplication {
    public static void main(String[] args) {
        System.setProperty("user.timezone", "UTC");
        SpringApplication.run(MecanosferaApplication.class, args);
    }
}