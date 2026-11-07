<<<<<<< HEAD
package com.mecanosfera.nomos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MecanosferaApplication {
    public static void main(String[] args) {
        System.setProperty("user.timezone", "UTC");
        SpringApplication.run(MecanosferaApplication.class, args);
    }
=======
package com.mecanosfera.nomos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MecanosferaApplication {
    public static void main(String[] args) {
        System.setProperty("user.timezone", "UTC");
        SpringApplication.run(MecanosferaApplication.class, args);
    }
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
}